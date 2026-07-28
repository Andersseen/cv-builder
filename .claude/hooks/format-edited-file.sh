#!/usr/bin/env bash
#
# PostToolUse hook — run Prettier (and ESLint --fix for code) on the file that
# was just written.
#
# The repo uses a non-default Prettier style (double quotes, printWidth 80 —
# AGENTS.md golden rule 12) and CI hard-fails on `pnpm lint`, so fixing at
# write time avoids a CI round-trip. Failures are intentionally swallowed: a
# formatter must never block the edit that already succeeded.

set -uo pipefail

payload="$(cat)"
file="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty')"
[ -n "$file" ] || exit 0
[ -f "$file" ] || exit 0

root="${CLAUDE_PROJECT_DIR:-$PWD}"
cd "$root" || exit 0

# Only touch files inside the project.
case "$file" in
  "$root"/*) ;;
  /*) exit 0 ;;
esac

case "$file" in
  *.ts | *.html | *.css | *.md | *.json | *.mjs | *.jsonc)
    pnpm exec prettier --write "$file" >/dev/null 2>&1
    ;;
esac

case "$file" in
  *.ts | *.html)
    pnpm exec eslint --fix "$file" >/dev/null 2>&1
    ;;
esac

exit 0
