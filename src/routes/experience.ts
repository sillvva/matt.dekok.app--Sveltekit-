import type { RequestHandler } from "./__types/experience";
import { supabase } from "$lib/supabase/client";
import prisma from "$lib/prisma";
import type { experience, experience_categories } from "@prisma/client";

export type ExperienceCategory = experience_categories & { experience: experience[] };

export const GET: RequestHandler<{ experience: ExperienceCategory[] }> = async () => {
  if (!supabase) throw new Error("Supabase not initialized");

  const data = await prisma.experience_categories.findMany({
    include: {
      experience: true
    }
  });

  const experience: ExperienceCategory[] = data.map(category => ({
    ...category,
    experience: category.experience.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
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
