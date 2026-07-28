---
name: end-session
description: Close out a work session — update docs/STATE.md with what was done, what is unfinished, and any new known issues, after verifying the build is green.
disable-model-invocation: true
---

# End session

[AGENTS.md](../../../AGENTS.md) requires updating [docs/STATE.md](../../../docs/STATE.md)
at the end of **every** session. This skill does that from the actual diff rather
than from recollection.

## Steps

### 1. Gather what actually changed

```bash
git status --short
git diff --stat HEAD
git log --oneline -10
```

Also check for uncommitted spec changes in `docs/specs/` — if a spec moved to
`Done`, its row in the index table of [docs/specs/README.md](../../../docs/specs/README.md)
must say so too.

### 2. Verify before claiming anything is green

Only report a state as working if you saw it pass in this session:

```bash
pnpm lint && pnpm test && pnpm build
```

`pnpm e2e` too if the change touched UI flows. If something fails, that is a
**Known issue**, not a "What's working" bullet. Never write "all green" without
the output to back it.

### 3. Rewrite the affected parts of docs/STATE.md

Keep the existing section order and the existing language of the file (recent
entries are in Spanish — match them):

| Section                   | What goes in it                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Header line               | `**Last updated**: YYYY-MM-DD · **Active branch**: <branch>` + one-sentence summary  |
| `## In progress`          | Only genuinely half-finished work. If nothing, say so explicitly.                    |
| `## What's working`       | Move finished items here. One bullet per capability, not per commit.                 |
| `## Known issues`         | Numbered. Mark blocked ones `(bloqueado, requiere acción manual)` with the exact fix. |
| `## Next steps`           | Rough priority order. Be honest — drop items that are no longer real.                |
| `## Session log`          | Newest first, `- **YYYY-MM-DD** — **Title.**` + nested bullets. Keep last ~10.        |

Rules:

- **Trim as you add.** STATE.md is a status board, not a changelog archive. If
  the session log exceeds ~10 entries, delete the oldest.
- **Resolve, don't accumulate.** If a known issue got fixed this session, remove
  it rather than leaving it with a note.
- A finished item belongs in exactly one place: "What's working", not both there
  and "In progress".

### 4. Report

Tell the user which sections changed, which verification commands passed, and
anything you deliberately left in "Known issues".
