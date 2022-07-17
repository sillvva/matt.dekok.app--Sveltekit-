import { createRouter } from "./context";
import { postsRouter } from "./routers/posts"; 
import { imagesRouter } from "./routers/images"; 

export const router = createRouter()
  .merge("posts:", postsRouter)
  .merge("images:", imagesRouter);

// export type definition of API
export type Router = typeof router;