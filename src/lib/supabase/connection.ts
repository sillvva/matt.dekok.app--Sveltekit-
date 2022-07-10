import { createClient, type Session } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import { env } from "../constants";

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const auth = writable<Session | null>(null);
let authExpiresAt = 0;
let refreshTimer: NodeJS.Timeout | null = null;
auth.subscribe((session) => {
  if (session && session.expires_at && session.expires_at !== authExpiresAt) {
    authExpiresAt = session.expires_at;
    const now = new Date().getTime();
    const timer = Math.max(1, authExpiresAt - now / 1000 - 10 * 60) * 1000;
    console.log("Refresh at", new Date(now + timer));
    console.log("Expires at", new Date(authExpiresAt * 1000));
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      let newSession: Session | null = null;
      if (session?.refresh_token) {
        newSession = (
          await supabase.auth.signIn({
            refreshToken: session.refresh_token,
            provider: "github"
          })
        )?.session;
      }
      if (newSession) auth.set(newSession);
    }, timer);
  }
});