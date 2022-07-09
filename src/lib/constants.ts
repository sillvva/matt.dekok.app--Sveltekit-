import { z } from "zod";

export const blogPostsPerPage = 12;
export const transitionDuration = 500;

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  AUTH_UID: z.string(),
  PROD_URL: process.env.PROD_URL ? z.string().url() : z.undefined(),
  VERCEL_URL: process.env.VERCEL_URL ? z.string() : z.undefined()
});

console.log(process.env.VERCEL_URL);

const envCheck = envSchema.safeParse({
  SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: process.env.VITE_SUPABASE_KEY ?? import.meta.env.VITE_SUPABASE_KEY,
  AUTH_UID: process.env.VITE_AUTH_UID ?? import.meta.env.VITE_AUTH_UID,
  PROD_URL: process.env.PROD_URL,
  VERCEL_URL: process.env.VERCEL_URL
});

if (!envCheck.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(envCheck.error.format(), null, 4));
  process.exit(1);
}

export const env = {
  ...envCheck.data
};
