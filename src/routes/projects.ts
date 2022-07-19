import type { RequestHandler } from "./__types/projects";
import { supabase } from "$lib/supabase/client";
import type { projects } from "@prisma/client";
import prisma from "$lib/prisma";

export const GET: RequestHandler<{ projects: projects[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const projects = await prisma.projects.findMany();

  return {
    body: {
      projects: projects.sort((a, b) =>
        new Date(a.created_at).toISOString() > new Date(b.created_at).toISOString() ? -1 : 1
      )
    },
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  };
};
