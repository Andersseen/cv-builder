# Spec-Driven Development (SDD) — Workflow

For any **non-trivial change** (new feature, new section type, new template, refactor touching 3+ files, anything changing the data model), write a spec **before** writing code. Trivial fixes (typos, one-line bugs, broken class cleanup) don't need a spec.

## Why

Specs force the design decisions to happen in prose, where they are cheap, instead of in code, where they are expensive. They also let a human (or a stronger model) review the plan before tokens are spent on implementation.

## Workflow

1. **Create the spec**: copy [TEMPLATE.md](TEMPLATE.md) to `docs/specs/NNN-short-name.md` (`NNN` = next number: `001`, `002`, …). Fill in every section. Reading `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, and `docs/CONVENTIONS.md` first is mandatory — the spec must not contradict them.
2. **Get approval**: present the spec to the user. Do not start implementing until the user approves it (or explicitly tells you to skip approval).
3. **Implement**: follow the spec's implementation plan step by step. If reality forces a deviation, update the spec first (one line in "Deviations"), then continue.
4. **Verify**: walk through every acceptance criterion and the manual QA steps. `pnpm build` must pass.
5. **Close**: set the spec's status to `Done`, update `docs/STATE.md` (session log + next steps).

## Spec statuses

`Draft` → `Approved` → `In progress` → `Done` (or `Abandoned` — never delete a spec, mark it abandoned with a one-line reason).

## Rules for implementing models

- The spec is the contract. If something is not in the spec and not in CONVENTIONS.md, ask — don't improvise.
- Respect the "Non-goals" section as hard boundaries.
- Touch only the files listed in "Affected files"; if you need another file, add it to the spec with a reason first.
- Never mark an acceptance criterion as met without actually verifying it.

## Index

| #   | Spec                                              | Status    |
| --- | ------------------------------------------------- | --------- |
| 001 | [VoltUI editor forms](001-voltui-editor-forms.md) | Done      |
| 002 | [Fase 5: onboarding & completeness](002-fase5-onboarding-completeness.md) | Done     |
