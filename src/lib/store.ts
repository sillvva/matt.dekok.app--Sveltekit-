import { writable } from "svelte/store";
import type { InferQueryOutput } from "./trpc/client";
import type { Toast, PageProps, ToastType } from "./types";

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

export const toasts = (() => {
  const { update, set, subscribe } = writable<Toast[]>([]);
  const remove = (id: number) => update(t => t.filter(t => t.id !== id));
  const reset = () => set([]);
  const add = (type: ToastType, message: string, timer = 5000) =>
    update(t => {
      const toast: Toast = {
        id: Math.random(),
        type,
        message
      };
      if (timer)
        setTimeout(() => {
          remove(toast.id || 0);
        }, timer);
      return [...t, toast];
    });

  return {
    subscribe,
    add,
    remove,
    reset
  };
})();
