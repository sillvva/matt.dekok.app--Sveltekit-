import type { RequestHandler } from "./__types/skills";
import { supabase } from "$lib/supabase/client";
import prisma from "$lib/prisma";
import type { skills, skill_categories } from "@prisma/client";

export type SkillCategory = skill_categories & { skills: skills[] };

export const GET: RequestHandler<{ skills: SkillCategory[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const data = await prisma.skill_categories.findMany({
    include: {
      skills: true
    }
  });

  const skills: SkillCategory[] = data.map(category => ({
    ...category,
    skills: category.skills.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? -1 : 1))
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
