/* eslint-disable @typescript-eslint/ban-ts-comment */
import { existsSync } from "fs";
import admin from "firebase-admin";
import path from "path";
import { env } from "$lib/constants";

export const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  blogCollection: "posts",
  blogStorage: "blog/articles"
};

let fbApp;
try {
  fbApp = admin.app();
}
catch (err) {
  fbApp = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(env.FIREBASE_ADMIN_CREDENTIAL)),
    storageBucket: env.FIREBASE_STORAGE_BUCKET
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