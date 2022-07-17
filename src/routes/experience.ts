import type { RequestHandler } from "./__types/experience";
import type { ExperienceSection } from "$lib/types";
import { supabase } from "$lib/supabase/client";

export const get: RequestHandler<{ experience: ExperienceSection[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data } = await supabase
    .from("experience_categories")
    .select("name, experience ( name, nameLink, image, h4, h4Link, h5, h5Link, created_at ), sort");
  const experience: ExperienceSection[] =
    (<ExperienceSection[]>data || [])
      .sort((a, b) => (a.sort > b.sort ? 1 : -1))
      .map(section => ({
        ...section,
        experience: section.experience.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
      })) || [];

  return {
    body: {
      experience
    },
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  };
};
