/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, rmSync, existsSync, writeFileSync, statSync } from "node:fs";
import matter from "gray-matter";
import type { RequestHandler } from "./__types/[slug]";
import { supabase } from "$lib/supabase/client";
import { getContentDir } from "$lib/supabase/func";
import { env } from "$lib/constants";
import prisma from "$lib/prisma";
import type { blog } from "@prisma/client";

export const get: RequestHandler = async ({ params: { slug } }) => {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const dirPath = getContentDir();
  const postsPath = `${dirPath}/blog.json`;
  const filePath = `${dirPath}/${slug}.md`;

  if (slug.match(/\.[a-z]*$/))
    return {
      status: 200
    };

  let meta: blog | null = null;
  const result = { data: "" };

  if (existsSync(postsPath)) {
    const data = readFileSync(postsPath, "utf8");
    const posts: blog[] = JSON.parse(data);
    meta = posts.find(p => p.slug == slug) || null;
  }
  if (!meta && existsSync(filePath)) {
    result.data = readFileSync(filePath, "utf8");
    const { data } = matter(result.data);
    meta = <any>data || null;
  }
  if (!meta) {
    meta = await prisma.blog.findFirst({ where: { slug } });
  }

  if (!meta) throw new Error("Slug not found");

  let write = false;
  if (existsSync(filePath)) {
    const stat = statSync(filePath);
    const tdiff = (new Date(meta.created_at).getTime() - stat.ctime.getTime()) / 1000;
    if (tdiff > 0) {
      write = true;
      rmSync(filePath);
    } else {
      result.data = readFileSync(filePath, "utf8");
    }
  } else write = true;

  if (write) {
    console.log("Revalidating...", slug);
    const { publicURL: url } = await supabase.storage.from("blog").getPublicUrl(meta.name);
    if (!url) throw new Error(`Could not get public URL for ${meta.name}`);
    const response = await fetch(`${url}?t=${Date.now()}`);
    const content = await response.text();
    result.data = content;
    writeFileSync(filePath, content);
  }

  const { content, data } = matter(result.data);
  if (data.date) data.dateISO = new Date(data.date).toISOString();
  if (data.updated) data.updatedISO = new Date(data.updated).toISOString();
  for (const key in data) {
    if (data[key] instanceof Date) {
      data[key] = data[key].toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
  }

  return {
    status: 200,
    body: {
      content,
      data
    },
    headers: {
      "Cache-Control": env.MODE === "production" ? "public, max-age=10800" : "no-cache"
    }
  };
};
