/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface UserSession {
		theme: import('$lib/utils').Theme;
    user: import('@supabase/supabase-js').User;
    accessToken?: string;
  }
	interface Locals extends UserSession {
		serverClient: import('@supabase/supabase-js').SupabaseClient;
    error: import('@supabase/supabase-js').ApiError;
	}
	// interface Platform {}
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Session extends UserSession {
	}
	// interface Stuff {}
}
