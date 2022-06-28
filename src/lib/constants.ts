export const blogPostsPerPage = 12;
export const transitionDuration = 500;

let envVars: {
  FIREBASE_API_KEY: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_ADMIN_CREDENTIAL: string;
  API_SECRET_KEY: string;
};
if (process.env.VITE_FIREBASE_API_KEY) {
  envVars = {
    FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || "",
    FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    FIREBASE_ADMIN_CREDENTIAL: process.env.VITE_FIREBASE_ADMIN_CREDENTIAL || "{}",
    API_SECRET_KEY: process.env.VITE_API_SECRET_KEY || "",
  }
}
else {
  envVars = {
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "",
    FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    FIREBASE_ADMIN_CREDENTIAL: import.meta.env.VITE_FIREBASE_ADMIN_CREDENTIAL || "{}",
    API_SECRET_KEY: import.meta.env.VITE_API_SECRET_KEY || "",
  }
}

export const env = {
  ...envVars
}