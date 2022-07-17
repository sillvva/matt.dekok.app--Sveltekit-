import type { RequestHandler } from "./__types/projects";
import { supabase } from "$lib/supabase/client";
import type { Project } from "$lib/types";


export const get: RequestHandler<{ projects: Project[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data } = await supabase.from("projects").select("*");
  const projects: Project[] = data || [];

  return {
    body: {
      projects: projects.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    },
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  };
};
