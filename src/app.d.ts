/// <reference types="@sveltejs/kit" />

type Theme = 'dark' | 'light' | 'blue';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		theme: Theme;
	}
	// interface Platform {}
	interface Session {
		theme: Theme;
		auth: any;
	}
	// interface Stuff {}
}
