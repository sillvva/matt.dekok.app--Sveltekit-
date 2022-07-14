import type { Handle, GetSession } from "@sveltejs/kit";
import { parse } from "cookie";
import { router } from "$lib/trpc/server";
import { createContext } from "$lib/trpc/context";
import { createTRPCHandle } from "trpc-sveltekit";

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = parse(event.request.headers?.get("cookie") || "");
  event.locals.theme = <Theme>cookies.theme || "dark";
	
  const response = await createTRPCHandle({
    url: "/trpc", // optional; defaults to '/trpc'
    router,
    createContext,
    event,
    resolve
  });

  return response;
};

export const getSession: GetSession = request => {
  return {
    theme: request.locals.theme,
    auth: {}
  };
};
