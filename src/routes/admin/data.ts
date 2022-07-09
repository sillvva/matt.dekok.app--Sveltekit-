/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from "./__types/data";
import type { User } from "@supabase/supabase-js";
import path from "path";
import type { Admin } from "$lib/store";
import { env } from "$lib/constants";
import { supabase } from "$lib/supabase/connection";
import { service } from "$lib/supabase/service";
import { fetchPosts } from "$lib/supabase/blog";

export const get: RequestHandler<Admin> = async ({ request, url }) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const { user } = await supabase.auth.api.getUser(token);
  if (user?.id !== env.AUTH_UID) {
    if (user) await deleteUser(user);
    return getError("Unauthorized", 401);
  }

  const select = url.searchParams.get("select");
  const images = url.searchParams.get("images");
  return getResult(select, images);
};

export type AdminMutation = {
  success: boolean;
  error?: string;
};

export const post: RequestHandler<AdminMutation> = async ({ request, url }) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const { user } = await supabase.auth.api.getUser(token);
  if (user?.id !== env.AUTH_UID) {
    if (user) await deleteUser(user);
    return getError("Unauthorized", 401);
  }

  const select = url.searchParams.get("select");

  if (select === "posts") {
    const formData = await request.formData();
    const file = formData.get("file")?.toString() || "";
    const buffer = Buffer.from(file, "base64");
    const filename = formData.get("filename")?.toString();
    const extname = path.extname(filename || "");

    let bucket = "";
    if (extname === ".md") bucket = "blog";

    if (!file || !filename) return getError("No file");
    if (!extname || !bucket) return getError("Invalid file extension");

    const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
      upsert: true
    });

    if (error) return getError(error);
    else if (bucket === "blog") await fetchPosts();
  }

  if (select === "images") {
    const formData = await request.formData();
    const file = formData.get("file")?.toString() || "";
    const buffer = Buffer.from(file, "base64");
    const filename = formData.get("filename")?.toString();
    const extname = path.extname(filename || "");

    let bucket = "";
    if (extname === ".png" || extname === ".jpg" || extname === ".jpeg" || extname === ".svg" || extname === ".webp")
      bucket = "images";

    if (!file || !filename) return getError("No file");
    if (!extname || !bucket) return getError("Invalid file extension");

    const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
      upsert: false
    });

    if (error) return getError(error);
    else if (bucket === "blog") await fetchPosts();
  }

  return {
    status: 200,
    body: {
      success: true
    }
  };
};

export const del: RequestHandler<AdminMutation> = async ({ request, url }) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const { user } = await supabase.auth.api.getUser(token);
  if (user?.id !== env.AUTH_UID) {
    if (user) await deleteUser(user);
    return getError("Unauthorized", 401);
  }

  const select = url.searchParams.get("select");

  if (select === "posts") {
    const slug = url.searchParams.get("slug");

    if (slug) {
      const blog = supabase.storage.from("blog");
      const { data } = await blog.list("archive", { search: slug });
      const suffix = data && data.length ? ` (${data.length + 1})` : "";
      const { error } = await blog.move(`${slug}.md`, `archive/${slug}${suffix}.md`);
      if (error) return getError(error);
      else await fetchPosts();
    }
  }

  if (select === "images") {
    const filename = url.searchParams.get("file");

    if (filename) {
      const blog = supabase.storage.from("images");
      const { data } = await blog.list("archive", { search: filename });
      const suffix = data && data.length ? ` (${data.length + 1})` : "";
      const extname = path.extname(filename);
      const basename = path.basename(filename, extname);
      const { error } = await blog.move(`${filename}`, `archive/${basename}${suffix}${extname}`);
      if (error) return getError(error);
    }
  }

  return {
    status: 200,
    body: {
      success: true
    }
  };
};

const getResult = async (select: string | null, getImages: string | null) => {
  const { data: posts, count: numposts } = await supabase
    .from("blog")
    .select("*", { count: "exact", head: select === "posts" ? false : true });

  const { data: experience, count: numexperience } = await supabase
    .from("experience")
    .select("*", { count: "exact", head: select === "experience" ? false : true });

  const { data: skills, count: numskills } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: select === "skills" ? false : true });

  const { data: projects, count: numprojects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: select === "projects" ? false : true });

  let images: any[] = [];
  if (select === "images" || getImages === "1") {
    const { data: imageData } = await supabase.storage.from("images").list();
    const filteredImages = (imageData || []).filter(
      image =>
        image.name.endsWith(".png") ||
        image.name.endsWith(".jpg") ||
        image.name.endsWith(".jpeg") ||
        image.name.endsWith(".svg") ||
        image.name.endsWith(".webp")
    );
    images = filteredImages;
  }

  return {
    status: 200,
    body: {
      success: true,
      numposts: numposts || 0,
      posts: posts || [],
      numimages: images.length,
      images: select === "images" ? images : [],
      numexperience: numexperience || 0,
      experience: experience || [],
      numskills: numskills || 0,
      skills: skills || [],
      numprojects: numprojects || 0,
      projects: projects || []
    },
    headers: {
      "Cache-Control": "no-cache"
    }
  };
};

const getError = async (error: Error | string, code = 500) => {
  return {
    status: code,
    body: {
      success: false,
      error: error.toString()
    },
    headers: {
      "Cache-Control": "no-cache"
    }
  };
};

const deleteUser = async (user: User) => {
  if (user.id === env.AUTH_UID) return;
  const { error } = await service.auth.api.deleteUser(user.id);
  return !error;
};
