# Spec 005 — Cloudflare Workers + Cloud PDF (Browser Run)

- **Status**: Done
- **Created**: 2026-07-28
- **Author**: Kimi Code CLI

## Goal

Migrate deployment from Cloudflare Pages to Cloudflare Workers (static assets + Worker script) and add a third PDF export path — "Cloud PDF" — that renders the resume server-side via [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/how-to/pdf-generation/), combining selectable text with pixel-perfect fidelity.

## Context

The app is currently deployed to Cloudflare Pages (`wrangler.jsonc` with `pages_build_output_dir`, see `docs/STATE.md` known issues #2/#3). Two export paths exist: `PrintExport` (text, ATS-friendly, browser dialog) and `PdfExport` (image snapshot, pixel-perfect but not selectable). The user explicitly requested a full migration to Cloudflare Workers plus a third, server-rendered PDF path using Browser Run.

Browser Run requires a Worker with a `browser` binding — it cannot run on Pages. Migrating Pages → Workers with static assets lets one Worker serve the app **and** expose `POST /api/pdf` on the same origin (no CORS).

Privacy note (CONTEXT.md principle 2): this is the first feature that sends CV data off the browser. It goes only to the project's own Worker, only when the user explicitly picks "Cloud PDF", and the dropdown label says so. The user approved this trade-off when requesting the feature.

## Requirements

Must-have:

1. `wrangler.jsonc` uses the Workers format (`main` + `assets.directory` + `assets.not_found_handling: "single-page-application"` + `browser` binding); `pages_build_output_dir` is gone.
2. `worker/index.ts` serves static assets for normal requests and handles `POST /api/pdf`: receives a full HTML document, renders it with `@cloudflare/puppeteer`, returns `application/pdf`.
3. New client service `CloudPdfExport` builds a self-contained HTML document (reusing `buildPrintStylesheet()` and the `#print-wrapper` convention), POSTs it to `/api/pdf`, and downloads the returned PDF with a CV-derived filename.
4. Editor toolbar dropdown offers "Cloud PDF (server)" as a third export option, wired through `editor.page.ts` with `isExporting` state and success/error toasts.
5. `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e` all green; `wrangler deploy --dry-run` validates the config.
6. CI deploy workflow uses `wrangler deploy` (not `wrangler pages deploy`).

Should-have:

- `dev:worker` script for local full-stack testing of `/api/pdf`.
- e2e test mocking `/api/pdf` to verify the UI flow.
- Request-size guard on the Worker (reject bodies > 5 MB).

## Non-goals

- No rate limiting, auth, or abuse protection on `/api/pdf` beyond the size guard (personal project; Browser Run free tier caps usage at 10 min/day).
- No deletion of the old Pages project and no Custom Domain attachment — those are manual dashboard steps after deploy.
- No changes to the two existing export paths (Print, Image).
- No use of the Browser Run REST API (`/pdf` quick action) — the Worker binding with Puppeteer gives the control we need (`setContent`, `preferCSSPageSize`).
- No SSR: the app stays 100% client-side; the Worker only serves assets and the PDF endpoint.

## Data model impact

None.

## Affected files

- `worker/index.ts` — new: Worker entry, `/api/pdf` handler.
- `worker/tsconfig.json` — new: types for editor/type-checking of the Worker.
- `wrangler.jsonc` — Workers format migration.
- `public/_redirects` — deleted (SPA fallback handled by `not_found_handling`).
- `src/app/infrastructure/export/pdf-document.ts` — new: pure `buildPdfDocument()` builder.
- `src/app/infrastructure/export/pdf-document.spec.ts` — new: unit tests for the builder.
- `src/app/infrastructure/export/cloud-pdf-export.ts` — new: `CloudPdfExport` service.
- `src/app/features/editor/components/editor-toolbar.ts` — third dropdown option + `exportCloudPdf` output.
- `src/app/pages/editor.page.ts` — `exportCloudPdf()` handler.
- `src/app/pages/editor.html` — wire the new output.
- `package.json` — deploy scripts + devDeps (`wrangler@^4`, `@cloudflare/puppeteer`, `@cloudflare/workers-types`).
- `.github/workflows/deploy.yml` — `command: deploy`, job renamed.
- `e2e/cloud-pdf.spec.ts` — new: mocked `/api/pdf` e2e.
- Docs: `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/CONTEXT.md`, `docs/STATE.md`, `docs/specs/README.md`.

## Implementation plan

1. Spec + specs index (this file).
2. `pnpm add -D wrangler@^4 @cloudflare/puppeteer @cloudflare/workers-types`.
3. Worker code + tsconfig; migrate `wrangler.jsonc`; delete `public/_redirects`.
4. Client: `pdf-document.ts` (+ spec) and `cloud-pdf-export.ts`.
5. UI: toolbar option + editor wiring.
6. `package.json` scripts + `deploy.yml`.
7. e2e mock test.
8. Verify: lint, test, build, e2e, `wrangler deploy --dry-run`, and a real `curl` against `wrangler dev` producing a valid PDF.
9. Docs sweep.

## Acceptance criteria

- [ ] `wrangler.jsonc` has no Pages fields; `wrangler deploy --dry-run` passes.
- [ ] `POST /api/pdf` on `wrangler dev` returns a valid PDF for a sample HTML document.
- [ ] Editor dropdown shows three PDF options; "Cloud PDF" downloads a text-selectable PDF that matches the preview.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e` all green.
- [ ] Deep routes (`/dashboard`, `/editor`) serve `index.html` on the Worker (SPA fallback) without `_redirects`.
- [ ] The two existing export paths still work unchanged.

## Manual QA steps

1. `pnpm dev:worker` → open `http://localhost:8787`, create/open a CV in the editor.
2. Export dropdown → "Cloud PDF (server)" → a PDF downloads; open it: text is selectable, layout matches preview, backgrounds/colors preserved.
3. Navigate directly to `http://localhost:8787/dashboard` → app loads (SPA fallback).
4. "Download PDF" (print) and "High-fidelity PDF" still behave as before.
5. Repeat 2 in dark mode — resume output identical (resume templates are theme-independent).

## Deviations

(Fill during implementation.)

- **Stylesheets are inlined, not linked.** The spec said to send the compiled Tailwind CSS as a `<link>` resolved via `<base href>`. Verification with a real `wrangler dev` render showed the server browser (opaque `null` origin from `setContent()`) blocked the linked stylesheet: Vite emits `<link rel="stylesheet" crossorigin>`, making it a CORS-mode fetch that fails without `Access-Control-Allow-Origin`, and local dev additionally hits Private Network Access (`loopback`) blocking. `CloudPdfExport` now fetches each linked stylesheet and inlines it as a `<style>` tag, so the document is fully self-contained. Confirmed end-to-end: the exported PDF of the example CV matches the preview pixel-for-pixel.
- `compatibility_flags: ["nodejs_compat"]` added to `wrangler.jsonc` — `@cloudflare/puppeteer` imports `node:buffer` (wrangler warned during `--dry-run`).
- `.gitignore` gained `.wrangler/` (local wrangler state).
