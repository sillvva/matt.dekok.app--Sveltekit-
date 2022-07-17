import { writable } from "svelte/store";
import type { InferQueryOutput } from "./trpc/client";
import type { Toast, PageProps } from "./types";

export const pageProps = writable<PageProps>({});

export const drawer = writable(false);

export const admin = writable<InferQueryOutput<"posts:get">>({
  success: false,
  posts: [],
  experience: [],
  skills: [],
  projects: []
});

export const pageStore = writable(1);
export const queryStore = writable("");

export const toasts = writable<Toast[]>([]);