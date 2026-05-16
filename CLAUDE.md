# Project notes for Claude

## Deploy workflow

This repo is connected to Vercel. **Pushing to `main` triggers an automatic
production deploy** via the Vercel↔GitHub integration (see `vercel.json`).

**Default workflow when the user asks for an update to be pushed/shipped:**

1. Make the change on whatever working branch.
2. Verify locally with `npm run build` (and `npm run lint` for non-trivial
   changes). Do not push if the build fails.
3. Fast-forward (or merge) the change into `main` and `git push origin main`.
4. Confirm the push succeeded. The Vercel deploy then kicks off
   automatically — no `vercel --prod` CLI call needed (the CLI isn't
   installed in this environment anyway).

Do not open a PR for routine changes unless the user explicitly asks for
one. The user has approved direct-to-main as the default.

## Tech stack

- Vite 8 + React 19 + React Router 7
- Tailwind CSS v4 (via `@tailwindcss/vite`) — utility classes; custom
  helpers in `src/index.css` (`.glass-nav`, `.apple-shadow`, `.btn-apple`,
  `.card-lift`).
- Supabase client (`@supabase/supabase-js`) — see `src/lib/supabase` etc.
- localStorage keys use the `amino-select-*` prefix (e.g.
  `amino-select-cart`, `amino-select-verified`).

## Brand naming

The active brand in code is **"Amino Select"** (most recent rebrand on
`main`). Earlier names in the git history: "Amino Club", "Puro Peptides".
Match what's already in the codebase (`Header.jsx`, etc.) — don't
reintroduce old names.
