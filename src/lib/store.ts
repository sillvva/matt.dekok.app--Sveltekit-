import { writable } from "svelte/store";
import type { PostData } from "./types/blog";
import type { Rating } from "./types/rating";

export interface PageProps {
  title?: string;
  description?: string;
  bodyClass?: string;
  backTo?: boolean | string;
  menu?: boolean;
  articleMeta?: object;
  image?: string;
};
export const pageProps = writable<PageProps>({});

export const drawer = writable(false);

export interface Admin {
  success: boolean;
  error?: string;
  numposts?: number;
  posts?: PostData[];
  numimages?: number;
  images?: any[];
  numexperience?: number;
  experience?: any[];
  numskills?: number;
  skills?: Rating[];
  numprojects?: number;
  projects?: any[];
};
export const admin = writable<Admin>({
  success: false,
  posts: [],
  experience: [],
  skills: [],
  projects: []
});
