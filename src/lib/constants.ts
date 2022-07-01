export const blogPostsPerPage = 12;
export const transitionDuration = 500;
export const vercelUrl = process.env.VERCEL_URL;

let envVars: {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  PROD_URL: string;
};
if (process.env.VITE_FIREBASE_API_KEY) {
  envVars = {
    SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
    SUPABASE_KEY: process.env.VITE_SUPABASE_KEY || "",
    PROD_URL: process.env.PROD_URL || ""
  }
}
else {
  envVars = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
    SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY || "",
    PROD_URL: import.meta.env.VITE_PROD_URL || ""
  }
}

export const env = {
  ...envVars
}