import path from "path";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { authMiddleware, createRouter } from "../context";
import { getResult } from "../helpers";

export const imagesRouter = createRouter()
  .query("get", {
    async resolve() {
      return await getResult("images");
    }
  })
  .middleware(authMiddleware)
  .mutation("post", {
    input: z.object({
      file: z.string(),
      filename: z.string(),
      upsert: z.boolean()
    }),
    async resolve({ input: { file, filename, upsert }, ctx: { locals } }) {
      const supabase = locals.serverClient;

      if (!file || !filename) throw new TRPCError({ message: "No file", code: "BAD_REQUEST" });

      const extname = path.extname(filename || "");
      if (![".png", ".jpg", ".jpeg", ".svg", ".webp"].includes(extname))
        throw new TRPCError({ message: "Invalid file extension", code: "BAD_REQUEST" });

      const buffer = Buffer.from(file, "base64");
      const { error } = await supabase.storage.from("images").upload(filename, buffer, {
        upsert
      });

      if (error) throw new TRPCError({ message: error?.message, code: "BAD_REQUEST" });

      return {
        success: true,
        error: ""
      };
    }
  })
  .mutation("delete", {
    input: z.object({
      filename: z.string()
    }),
    async resolve({ input: { filename }, ctx: { locals } }) {
      const supabase = locals.serverClient;

      const images = supabase.storage.from("images");
      const { data } = await images.list("archive", { search: filename });
      const suffix = data && data.length ? ` (${data.length + 1})` : "";
      const extname = path.extname(filename);
      const basename = path.basename(filename, extname);
      const { error } = await images.move(`${filename}`, `archive/${basename}${suffix}${extname}`);
      if (error) throw new TRPCError({ message: error.message, code: "BAD_REQUEST" });

      return {
        success: true,
        error: ""
      };
    }
  });
