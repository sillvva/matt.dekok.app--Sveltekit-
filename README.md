## Setup

Create a `.env.local` file with the following constants:

```env
VITE_FIREBASE_ADMIN_CREDENTIAL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_STORAGE_BUCKET=

VITE_API_SECRET_KEY=
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

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