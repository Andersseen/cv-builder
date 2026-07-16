/**
 * Minimal, dependency-free rich-text renderer for CV descriptions.
 *
 * Supports a deliberately small subset so descriptions stay portable and export
 * cleanly to PDF:
 *   - `**bold**`   → <strong>
 *   - `*italic*`   → <em>
 *   - lines starting with `- ` or `* ` → grouped into a <ul><li> list
 *   - remaining line breaks → <br>
 *
 * The input is HTML-escaped BEFORE any formatting is applied, so raw user text
 * can never inject markup. The output is still meant to be bound via Angular's
 * `[innerHTML]`, which sanitizes it a second time. Pure — no side effects.
 */
export function renderRichText(input: string): string {
  if (!input) return "";

  const escaped = escapeHtml(input);
  const lines = escaped.split(/\r?\n/);

  const htmlParts: string[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      const items = bulletBuffer
        .map((b) => `<li>${formatInline(b)}</li>`)
        .join("");
      // Inline styles (not Tailwind classes) so bullets survive Tailwind's list
      // reset AND the html-to-image PDF export path.
      htmlParts.push(
        `<ul style="list-style:disc;padding-left:1.25rem;margin:0.25rem 0">${items}</ul>`,
      );
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      bulletBuffer.push(bullet[1]);
    } else {
      flushBullets();
      htmlParts.push(formatInline(line));
    }
  }
  flushBullets();

  // Join non-list lines with <br>, but not around block-level <ul> elements.
  return htmlParts
    .map((part, i) => {
      const prev = htmlParts[i - 1];
      const isList = part.startsWith("<ul");
      const prevIsList = prev?.startsWith("<ul");
      if (i === 0 || isList || prevIsList) return part;
      return `<br>${part}`;
    })
    .join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
