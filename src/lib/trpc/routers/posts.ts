import path from "path";
import { fetchPosts } from "$lib/supabase/blog";
import { authMiddleware, createRouter } from "../context";
import { getResult } from "../helpers";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postsRouter = createRouter()
  .query("get", {
    input: z
      .object({
        images: z.boolean().nullish()
      })
      .nullish(),
    async resolve({ input }) {
      return await getResult("posts", !!input?.images);
    }
  })
  .middleware(authMiddleware)
  .mutation("post", {
    input: z.object({
      file: z.string(),
      filename: z.string()
    }),
    async resolve({ input: { file, filename }, ctx: { locals } }) {
      const supabase = locals.serverClient;

      if (!file || !filename) throw new TRPCError({ message: "No file", code: "INTERNAL_SERVER_ERROR" });

      const extname = path.extname(filename || "");
      if (extname !== ".md") throw new TRPCError({ message: "Invalid file extension", code: "INTERNAL_SERVER_ERROR" });

      const buffer = Buffer.from(file, "base64");
      const { error } = await supabase.storage.from("blog").upload(filename, buffer, {
        contentType: "text/markdown",
        upsert: true
      });

      if (error) throw new TRPCError({ message: error?.message, code: "BAD_REQUEST" });
      await fetchPosts();

      return {
        success: true,
        error
      };
    }
  })
  .mutation("delete", {
    input: z.object({
      slug: z.string()
    }),
    async resolve({ input: { slug }, ctx: { locals } }) {
      const supabase = locals.serverClient;

      const blog = supabase.storage.from("blog");
      const { data } = await blog.list("archive", { search: slug });
      const suffix = data && data.length ? ` (${data.length + 1})` : "";
      const { error } = await blog.move(`${slug}.md`, `archive/${slug}${suffix}.md`);

      if (error) throw new TRPCError({ message: error.message, code: "BAD_REQUEST" });
      await fetchPosts();

      return {
        success: true,
        error: ""
      };
    }
  });
