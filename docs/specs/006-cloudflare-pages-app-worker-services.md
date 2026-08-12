# Spec 006 — Cloudflare Pages app + Worker services

- **Status**: Done
- **Created**: 2026-08-11
- **Author**: Codex

## Goal

Deploy the Angular app as a Cloudflare Pages static site again, while keeping server-side services in a separate Cloudflare Worker. The Cloud PDF feature remains served by the Worker; production calls the Worker on `workers.dev` with explicit CORS so CI does not need zone-level Workers Routes permissions.

## Context

The project currently deploys as one Cloudflare Worker that serves both static assets and `POST /api/pdf` via `worker/index.ts`. The user prefers a cleaner split: apps on Cloudflare Pages, services on Workers.

## Requirements

1. Static app deployment uses Cloudflare Pages with `dist/analog/public` as the build output.
2. The PDF service deploys as a standalone Worker with Browser Run binding and no static asset serving.
3. Local development keeps calling `/api/pdf` through the Vite middleware; production calls the Worker endpoint directly.
4. CI deploys both targets in order: Pages app first, Worker service second.
5. SPA deep links continue to work on Pages.

Should-have:

- Local scripts make the split obvious (`dev:pages`, `dev:worker`, `deploy:pages`, `deploy:worker`).
- Docs explain the manual Cloudflare dashboard/routing requirements.

## Non-goals

- No new runtime features.
- No new dependencies.
- No account/auth/backend storage.
- No deletion of existing Cloudflare projects from code.

## Data model impact

None.

## Affected files

- `wrangler.jsonc` — restore Pages deployment config.
- `worker/wrangler.jsonc` — add standalone PDF Worker config with Browser Run and `workers.dev`.
- `worker/index.ts` — remove static asset serving from the Worker.
- `public/_redirects` — restore SPA fallback for Pages.
- `package.json` — split local/dev/deploy scripts.
- `vite.config.ts` — dev-only `/api/pdf` proxy middleware for local Worker testing.
- `.github/workflows/deploy.yml` — deploy Pages and Worker separately.
- `README.md` — update deployment docs.
- `AGENTS.md` — update project deployment guidance.
- `docs/CONTEXT.md` — clarify Pages app + Worker service architecture.
- `docs/ARCHITECTURE.md` — update deployment section.
- `docs/STATE.md` — close session with current state.
- `docs/specs/README.md` — index this spec.

## Implementation plan

1. Restore Pages config and `_redirects`.
2. Add standalone Worker config and simplify `worker/index.ts`.
3. Update scripts and deploy workflow.
4. Update docs/spec index/state.
5. Verify with lint, tests, build, e2e, and Wrangler dry-runs where possible.

## Acceptance criteria

- [x] `wrangler.jsonc` contains `pages_build_output_dir`.
- [x] `worker/wrangler.jsonc` contains the Browser Run binding and `workers.dev` endpoint.
- [x] `worker/index.ts` only handles `/api/pdf` and `/api/*` responses.
- [x] `public/_redirects` restores SPA fallback.
- [x] `pnpm lint` passes with zero errors.
- [x] `pnpm test` passes with zero errors.
- [x] `pnpm e2e` passes with zero errors.
- [x] `pnpm build` passes with zero errors.

## Manual QA steps

1. Run `pnpm dev:pages`, open the Pages local URL, and verify `/`, `/dashboard`, and `/editor` load.
2. Run `pnpm dev:worker`, send `POST /api/pdf` to the Worker URL with a sample document, and verify a PDF response.
3. In production, point `cv-builder.andersseen.dev` to Pages, deploy `cv-builder-pdf` on `workers.dev`, then test Cloud PDF from the editor.

## Deviations

- Wrangler Worker dry-run succeeded, but Wrangler attempted to write logs under `~/Library/Preferences/.wrangler/logs` and printed a sandbox `EPERM`; the command still exited 0 and validated the Worker bundle/bindings.
- Local Vite testing needed a custom middleware instead of `server.proxy`: Analog/Nitro registers its own `/api` dev router and returned `404 Cannot find any route matching /pdf` before Vite's proxy could forward the request.
- 2026-08-12 update: the GitHub deploy token could deploy Pages and upload the Worker but could not write `/workers/routes` for the zone. The app now calls `cv-builder-pdf.andriipap01.workers.dev` in production with Worker-side CORS instead of requiring CI to manage the `/api/*` route.
