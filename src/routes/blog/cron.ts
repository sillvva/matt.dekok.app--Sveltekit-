/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from "./__types/cron";
import { fetchPosts } from "$lib/supabase/blog";
import { itemsPerPage } from "$lib/constants";

export const post: RequestHandler<any> = async ({ url }) => {
  try {
    const getPosts = !!url.searchParams.get("posts");
    const page = parseInt(url.searchParams.get("page") || "1");
    const perpage = parseInt(url.searchParams.get("limit") || itemsPerPage.toString());
    const query = url.searchParams.get("s") || "";

    const result = await fetchPosts({ getPosts, page, perpage, query });
    return {
      status: 200,
      body: { success: true, revalidated: !!result.upserted.length, ...result },
      headers: {
        "Cache-Control": "no-cache"
      }
    };
  } catch (err: any) {
    return {
      status: 200,
      body: {
        error: {
          message: err.message
        }
      },
      headers: {
        "Cache-Control": "no-cache"
      }
    };
  }
};
