import { createRouter } from "./context";
import superjson from "superjson";

import { postsRouter } from "./posts"; 

export const router = createRouter()
  .transformer(superjson)
  .merge("posts:", postsRouter);

// export type definition of API
export type Router = typeof router;