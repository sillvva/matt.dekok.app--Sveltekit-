import { writable } from "svelte/store";
import type { InferQueryOutput } from "./trpc/client";
import type { PageProps } from "./types";

export const pageProps = writable<PageProps>({});

export const drawer = writable(false);

export const admin = writable<InferQueryOutput<"posts:get">>({
  success: false,
  numposts: 0,
  posts: [],
  numexperience: 0,
  experience: [],
  numskills: 0,
  skills: [],
  numprojects: 0,
  projects: [],
  numimages: 0,
  images: []
});

export const pageStore = writable(1);
export const queryStore = writable("");

export type ToastType = "success" | "error" | "warning" | "info";
export const toasts = (() => {
  const { update, set, subscribe } = writable<
    {
      id: number;
      type: ToastType;
      message: string;
    }[]
  >([]);
  const remove = (id: number) => update(t => t.filter(t => t.id !== id));
  const reset = () => set([]);
  const add = (type: ToastType, message: string, timer = 5000) =>
    update(t => {
      const id = Math.random();
      if (timer)
        setTimeout(() => {
          remove(id || 0);
        }, timer);
      return [
        ...t,
        {
          id: Math.random(),
          type,
          message
        }
      ];
    });

  return {
    subscribe,
    add,
    remove,
    reset
  };
})();
