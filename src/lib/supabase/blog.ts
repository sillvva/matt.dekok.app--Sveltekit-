/* eslint-disable @typescript-eslint/ban-ts-comment */
import matter from "gray-matter";
import { writeFileSync } from "fs";
import { supabase } from "./client";
import { getContentDir } from "./func";
import type { PostData } from "../types";

interface FetchOptions {
  getPosts?: boolean;
  page?: number;
  perpage?: number;
  query?: string;
};

export async function fetchPosts(options: FetchOptions = {}) {
  if (!supabase) throw new Error("Supabase not initialized");
  const { getPosts, page, perpage, query } = options;

  let changes = 0;
  let added = 0;
  const upserted: string[] = [];
  const removed: string[] = [];
  const errors: { slug: string; error: any }[] = [];

  const { data: stgData } = await supabase.storage.from("blog").list();
  const contentList = (stgData || []).filter(post => post.name.endsWith(".md"));
  let num = contentList.length;

  let result: { data: PostData[] | null; count: number | null };
  if (query) {
    result = await supabase.rpc("search_posts", { keyword: query });
    num = (result.data || []).length;
  } else if (page && perpage)
    result = await supabase
      .from("blog")
      .select("*")
      .range((page - 1) * perpage, page * perpage - 1);
  else result = await supabase.from("blog").select("*");

  const posts = result.data || [];

  if (query || (page && perpage))
    return { changes, upserted, removed, errors, posts, num };

  for (const file of contentList) {
    const slug = file.name.slice(0, file.name.length - 3);

    const fsIndex = posts.findIndex(p => p.slug == slug);
    const fsItem = posts[fsIndex];
    if (!fsItem) added++;
    if (!fsItem || !fsItem.created_at || file.updated_at > fsItem.updated_at) {
      console.log(`Upserting: ${slug}`);
      upserted.push(slug);
      changes++;
    } else continue;

    const { publicURL: url } = await supabase.storage.from("blog").getPublicUrl(file.name);
    if (!url) throw new Error(`Could not get public URL for ${file.name}`);
    const response = await fetch(`${url}?t=${Date.now()}`);
    const result = await response.text();

    const parsedData = matter(result);
    const postData = {
      id: fsItem?.id,
      name: file.name,
      slug: slug,
      created_at: file.created_at,
      updated_at: file.updated_at,
      ...{
        title: parsedData.data.title,
        description: parsedData.data.description,
        ...(parsedData.data.date && { date: new Date(parsedData.data.date).toISOString() }),
        ...(parsedData.data.updated && { updated: new Date(parsedData.data.updated).toISOString() }),
        link: parsedData.data.link,
        image: parsedData.data.image,
        tags: parsedData.data.tags,
        full: parsedData.data.full
      }
    };
    if (fsItem) posts.splice(fsIndex, 1, postData);
    else posts.push(postData);
  }

  posts.forEach((post, pi) => {
    const storageFile = contentList.find(item => item.name === `${post.slug}.md`);
    if (!storageFile) {
      console.log(`Removing: ${post.slug}`);
      posts.splice(pi, 1);
      removed.push(post.slug);
      changes++;
    }
  });

  writeFileSync(`${getContentDir()}/blog.json`, JSON.stringify(posts));

  if (changes) {
    console.log("Storing metadata to Firestore");
    for (const post of posts.filter(p => !!upserted.find(a => a === p.slug))) {
      const { error } = await supabase.from("blog").upsert(post);
      if (error) errors.push({ slug: post.slug, error });
    }
    for (const slug of removed) {
      const { error } = await supabase.from("blog").delete().match({ slug });
      if (error) errors.push({ slug, error });
    }
  } else console.log("No changes found");

  return {
    changes,
    upserted,
    removed,
    errors,
    posts: getPosts ? posts : [],
    num: (num || 0) + added - removed.length
  };
}
