import type { Handle, GetSession } from "@sveltejs/kit";
import { parse } from "cookie";
import { router } from "$lib/trpc/server";
import { createContext } from "$lib/trpc/context";
import { createTRPCHandle } from "trpc-sveltekit";
import { handleAuth, supabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Theme } from "$lib/utils";

export const handle: Handle = sequence(
  ...handleAuth({
    logout: { returnTo: "/" },
    tokenRefreshMargin: 60 * 10 // 10 minutes
  }),
  async ({ event, resolve }) => {
    const cookies = parse(event.request.headers?.get("cookie") || "");
    event.locals.theme = (cookies.theme as Theme) || "dark";
    
    event.locals.serverClient = supabaseServerClient(event.locals.accessToken || "");

    const response = await createTRPCHandle({
      url: "/trpc", // optional; defaults to '/trpc'
      router,
      createContext,
      event,
      resolve
    });

    return response;
  }
);

export const getSession: GetSession = async event => {
  const { user, accessToken, error, theme } = event.locals;
  return {
    theme,
    user,
    accessToken,
    error
  };
};
