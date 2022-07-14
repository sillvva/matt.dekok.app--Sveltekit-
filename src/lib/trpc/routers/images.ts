import path from "path";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { supabase } from "$lib/supabase/client";
import { authMiddleware, createRouter } from "../context";
import { getResult } from "../helpers";

const select = "images";

export const imagesRouter = createRouter()
  .middleware(authMiddleware)
  .query("get", {
    async resolve() {
      return await getResult(select);
    }
  })
  .mutation("post", {
    input: z.object({
      file: z.string(),
      filename: z.string(),
      upsert: z.boolean()
    }),
    async resolve({ input: { file, filename, upsert } }) {
      const buffer = Buffer.from(file, "base64");
      const extname = path.extname(filename || "");

      let bucket = "";
      if (extname === ".png" || extname === ".jpg" || extname === ".jpeg" || extname === ".svg" || extname === ".webp")
        bucket = "images";

      if (!file || !filename) throw new TRPCError({ message: "No file", code: "BAD_REQUEST" });
      if (!extname || !bucket) throw new TRPCError({ message: "Invalid file extension", code: "BAD_REQUEST" });

      const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
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
    async resolve({ input: { filename } }) {
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
