/* eslint-disable @typescript-eslint/ban-ts-comment */
import { existsSync } from "fs";
import admin from "firebase-admin";
import path from "path";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  blogCollection: "posts",
};

let fbApp;
try {
  fbApp = admin.app();
}
catch (err) {
  fbApp = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(import.meta.env.VITE_FIREBASE_ADMIN_CREDENTIAL || "{}")),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  });
}

export const app = fbApp;
export const storage = admin.storage(app).bucket();
export const firestore = admin.firestore(app);

export const getContentDir = () => {
  // Local directory
  let dirPath = path.join(process.cwd(), 'src/content');
  // Vercel directory, because the cwd() directory is read-only
  if (!existsSync(dirPath) && existsSync('/tmp')) dirPath = '/tmp';
  return dirPath;
}