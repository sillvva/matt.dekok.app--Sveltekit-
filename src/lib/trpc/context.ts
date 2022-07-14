import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import type { RequestEvent } from "@sveltejs/kit";
import type { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";
import { supabase } from "$lib/supabase/client";
import { parse } from "cookie";

export const createContext = async ({ request }: RequestEvent) => {
  return {
    req: request
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

export const authMiddleware: MiddlewareFunction<{ req: Request }, unknown, unknown> = async ({
  ctx: { req },
  next
}) => {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.supabase_auth;
  const { user, error } = await supabase.auth.api.getUser(token);
  if (!user) throw new TRPCError({ message: `Unauthorized: ${error?.message}`, code: "UNAUTHORIZED" });
  return next();
};
