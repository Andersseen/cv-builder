# CONTEXT — What this project is and why it exists

## One-sentence pitch

Modern CV Builder is a free, privacy-first resume builder that runs entirely in the browser: users fill structured forms, see a live preview across multiple templates, and export a polished A4 PDF — without creating an account or sending data to any server.

## Why it exists

Most online resume builders require sign-up, lock export behind a paywall, or store personal data on their servers. This project takes the opposite approach:

- **Local-first**: every CV lives in the user's browser (IndexedDB). Closing the tab loses nothing; no network needed after first load.
- **Zero friction**: land on the page → create a resume → export PDF. No account, no payment, no cookies-consent maze.
- **Portfolio-quality engineering**: the project also serves as a showcase of modern Angular (v19, signals, standalone, Tailwind v4) with a clean layered architecture. Code quality is a goal in itself, not just a means.

## Target user

Job seekers who want a clean, professional resume quickly, and who care (or should care) about not uploading personal data to third parties.

## What the product does today

1. **Landing page** (`/`) — marketing page: hero, features, CTA.
2. **Dashboard** (`/dashboard`) — list of saved resumes as cards; create, rename, duplicate, delete.
3. **Editor** (`/editor?cv=<id>`) — the core:
   - Vertical tabs: Personal / Experience / Education / Skills / Template
   - Live A4 preview (collapsible), updates as you type
   - 5 templates: Modern, Classic, Minimal, Creative, Executive
   - Per-CV customization: accent color, background color, primary color
   - Autosave to IndexedDB (800 ms debounce) with "last saved" indicator
   - Two export paths: **image PDF** (pixel-perfect, heavy, not ATS-friendly) and **print/PDF via browser dialog** (text-selectable, light, ATS-friendly)
4. **Dark/light theme** for the app UI (resume preview always renders on white — a resume is a print artifact).

## Product principles (use these to resolve design questions)

1. **The resume is the product.** Preview fidelity and PDF output quality beat any app-UI concern.
2. **Data never leaves the browser.** Any feature requiring a server, analytics, or third-party API is out of scope unless the user explicitly decides otherwise.
3. **Fast and simple beats feature-rich.** Prefer improving the existing flow over adding new sections/settings.
4. **Templates must be genuinely distinct** — different layouts (sidebar, header-accent, single-column), not just recolors.

## Non-goals (do NOT build these unless explicitly asked)

- Backend, accounts, auth, cloud sync, sharing links
- AI content generation inside the app
- Multi-language resume content management (i18n of the app UI may come later)
- Cover letters, job tracking, or anything beyond the resume itself
- Mobile-native apps (responsive web is enough)

## Success criteria

- A user can go from blank page to downloaded PDF in under 5 minutes.
- The exported PDF looks exactly like the preview.
- Lighthouse-fast: lazy-loaded routes, no heavy deps in initial bundle.
- The codebase stays exemplary: strict TS, signals-first, clean layers (see ARCHITECTURE.md).
