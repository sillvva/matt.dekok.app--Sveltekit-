import type { RequestHandler } from "./__types/skills";
import { supabase } from "$lib/supabase/client";
import type { SkillSection } from "$lib/types";


export const get: RequestHandler<{ skills: SkillSection[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data } = await supabase
    .from("skill_categories")
    .select("name, skills ( name, rating ), sort");
  let skills: SkillSection[] =
    data?.sort((a: SkillSection, b: SkillSection) => (a.sort > b.sort ? 1 : -1)) || [];
  skills = skills.map(section => ({
    ...section,
    skills: section.skills.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
  }));

  return {
    body: {
      skills
    },
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  };
};
