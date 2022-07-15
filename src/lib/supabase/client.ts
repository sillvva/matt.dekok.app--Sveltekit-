import { createSupabaseClient } from "@supabase/auth-helpers-sveltekit";
import { env } from "../constants";

export const supabase = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_KEY).supabaseClient;