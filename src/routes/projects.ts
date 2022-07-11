import type { RequestHandler } from "./__types/projects";
import { supabase } from "$lib/supabase/connection";

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  created_at: string;
};

export const get: RequestHandler = async () => {
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
