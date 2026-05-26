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

## Auth + admin

- Supabase Auth (email + password). Sessions hydrate via
  `src/context/AuthContext.jsx`. Routes are gated through
  `src/components/ProtectedRoute.jsx`.
- `profiles.is_admin` (see `supabase/migrations/002_auth_and_profiles.sql`)
  gates the `/admin` surface. A trigger blocks self-promotion — to make
  the first admin, sign up the user via `/register`, then in the
  Supabase dashboard → Table Editor → `profiles` → flip `is_admin = true`
  on that row.
- Migrations to apply in order via Supabase SQL Editor:
  `002_auth_and_profiles.sql`, `003_carts.sql`, then create a public
  Storage bucket named `certificates` and apply
  `004_storage_certificates.sql`.
- Signed-in users get server-synced carts (table `carts`). Anonymous
  carts stay in localStorage. Sign-in additively merges local cart →
  server cart.

## gstack

[gstack](https://github.com/garrytan/gstack) provides browser + workflow
skills for agents working in this repo.

- **Use the `/browse` skill from gstack for all web browsing** — testing
  the deployed site, dogfooding flows, screenshots, verifying deploys.
- **Never use `mcp__claude-in-chrome__*` tools.** Route all browsing
  through gstack's `/browse` instead.

### Available gstack skills

`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`,
`/plan-design-review`, `/design-consultation`, `/design-shotgun`,
`/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`,
`/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`,
`/design-review`, `/setup-browser-cookies`, `/setup-deploy`,
`/setup-gbrain`, `/retro`, `/investigate`, `/document-release`,
`/document-generate`, `/codex`, `/cso`, `/autoplan`,
`/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`,
`/unfreeze`, `/gstack-upgrade`, `/learn`
