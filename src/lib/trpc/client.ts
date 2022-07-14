import { get } from "svelte/store";
import { auth } from "$lib/supabase/client";
import * as trpc from "@trpc/client";
import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import type { Router } from "./server"; // 👈 only the types are imported from the server

export default trpc.createTRPCClient<Router>({
  url: "/trpc",
  headers() {
    return {
      authorization: `Bearer ${get(auth)?.access_token}`
    };
  }
});

type Query = keyof Router["_def"]["queries"];
type Mutation = keyof Router["_def"]["mutations"];

// Useful types 👇👇👇
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<Router["_def"]["queries"][RouteKey]>;
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<Router["_def"]["queries"][RouteKey]>;
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
  Router["_def"]["mutations"][RouteKey]
>;
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<Router["_def"]["mutations"][RouteKey]>;
