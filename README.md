## Preview

A demo can be viewed at https://sveltekit.dekok.app

## Setup

Create a `.env.local` file with the following constants:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
VITE_SUPABASE_SERVICE_KEY=
VITE_AUTH_UID=
```

## Developing

Once you've created a project and installed dependencies, start a development server:

```bash
pnpm install
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.