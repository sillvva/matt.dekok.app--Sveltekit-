import type { Admin, Image } from "$lib/types";
import { supabase } from "$lib/supabase/client";

export const getResult = async (select: string | null, getImages?: boolean): Promise<Admin> => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data: posts, count: numposts } = await supabase
    .from("blog")
    .select("*", { count: "exact", head: select === "posts" ? false : true });

  const { data: experience, count: numexperience } = await supabase
    .from("experience")
    .select("*", { count: "exact", head: select === "experience" ? false : true });

  const { data: skills, count: numskills } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: select === "skills" ? false : true });

  const { data: projects, count: numprojects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: select === "projects" ? false : true });

  let images: Image[] = [];
  if (select === "images" || getImages) {
    const { data: imageData } = await supabase.storage.from("images").list();
    images = (imageData || []).filter(
      image =>
        image.name.endsWith(".png") ||
        image.name.endsWith(".jpg") ||
        image.name.endsWith(".jpeg") ||
        image.name.endsWith(".svg") ||
        image.name.endsWith(".webp")
    );
  }

  return {
    success: true,
    numposts: numposts || 0,
    posts: posts || [],
    numimages: images.length,
    images: select === "images" ? images : [],
    numexperience: numexperience || 0,
    experience: experience || [],
    numskills: numskills || 0,
    skills: skills || [],
    numprojects: numprojects || 0,
    projects: projects || []
  };
};
