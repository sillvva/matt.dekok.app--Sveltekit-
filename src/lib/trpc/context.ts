import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import type { RequestEvent } from "@sveltejs/kit";
import type { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";

export const createContext = async ({ request, locals }: RequestEvent) => {
  return {
    req: request,
    locals
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

export const authMiddleware: MiddlewareFunction<{ req: Request; locals: App.Locals }, Context, unknown> = async ({
  ctx: { locals },
  next
}) => {
  if (!locals.user) throw new TRPCError({ message: `Unauthorized`, code: "UNAUTHORIZED" });
  return next();
};
