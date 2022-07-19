import type { RequestHandler } from "./__types/skills";
import { supabase } from "$lib/supabase/client";
import prisma from "$lib/prisma";
import type { skills, skill_categories } from "@prisma/client";

interface Skill extends Omit<Omit<skills, "id">, "category_id"> {
  id: number;
  category_id: number;
}

export interface SkillCategory extends Omit<skill_categories & { skills: Skill[] }, "id"> {
  id: number;
}

export const GET: RequestHandler<{ skills: SkillCategory[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const data = await prisma.skill_categories.findMany({
    include: {
      skills: true
    }
  });

  const skills: SkillCategory[] = data.map(category => ({
    ...category,
    id: Number(category.id),
    skills: category.skills
      .map(skill => ({
        ...skill,
        id: Number(skill.id),
        category_id: Number(category.id)
      }))
      .sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? -1 : 1))
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
