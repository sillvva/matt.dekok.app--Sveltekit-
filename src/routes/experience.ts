import type { RequestHandler } from "./__types/experience";
import { supabase } from "$lib/supabase/client";
import prisma from "$lib/prisma";
import type { experience, experience_categories } from "@prisma/client";

interface Experience extends Omit<Omit<experience, "id">, "category_id"> {
  id: number;
  category_id: number;
}

export interface ExperienceCategory extends Omit<experience_categories & { experience: Experience[] }, "id"> {
  id: number;
}

export const GET: RequestHandler<{ experience: ExperienceCategory[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const data = await prisma.experience_categories.findMany({
    include: {
      experience: true
    }
  });

  const experience: ExperienceCategory[] = data.map(category => ({
    ...category,
    id: Number(category.id),
    experience: category.experience
      .map(experience => ({
        ...experience,
        id: Number(experience.id),
        category_id: Number(experience.category_id)
      }))
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
  }));

  return {
    body: {
      experience
    },
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  };
};
