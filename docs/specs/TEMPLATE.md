# Spec NNN — <Short title>

- **Status**: Draft | Approved | In progress | Done | Abandoned
- **Created**: YYYY-MM-DD
- **Author**: <model/person>

## Goal

One or two sentences: what will exist when this is done, and for whom. Tie it to a product principle from `docs/CONTEXT.md` if possible.

## Context

Why now? What's the current behavior/state and what's wrong or missing about it? Link relevant files with paths.

## Requirements

Must-have (numbered, testable — each one becomes an acceptance criterion):

1. …
2. …

Should-have (nice if cheap, cuttable):

- …

## Non-goals

Explicit boundaries. What this spec deliberately does NOT include, so the implementer doesn't drift into it.

- …

## Data model impact

Changes to `Cv`/`CvSections`/`CvSettings` interfaces? If yes, list the exact fields and remember the 3 sync points: `cv-model.ts`, `cv-defaults.ts` (defaults for new CVs), `CvStore.loadAll()` (backfill for stored CVs). If no: "None."

## Affected files

Exhaustive list. Adding files not listed here requires updating the spec first.

- `src/app/…` — what changes and why (one line each)

## Implementation plan

Ordered steps small enough that each leaves the build green:

1. …
2. …

## Acceptance criteria

Checklist mirroring the must-have requirements. Verify each one before marking Done:

- [ ] …
- [ ] `pnpm build` passes with zero errors
- [ ] Works in both light and dark app theme
- [ ] Preview + both export paths (PDF, Print) still render correctly (if resume rendering was touched)

## Manual QA steps

Exact clicks/typing a human would perform to verify, starting from `pnpm start`.

1. …

## Deviations

(Fill during implementation, one line each: what changed vs. the plan and why.)
