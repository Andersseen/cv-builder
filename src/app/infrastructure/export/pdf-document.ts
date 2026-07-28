import { buildPrintStylesheet } from "./print-stylesheet";

export interface PdfDocumentInput {
  /** `outerHTML` of the rendered `.resume-content` element. */
  resumeHtml: string;
  /** `<style>` and `<link rel="stylesheet">` tags collected from `document.head`. */
  headStylesHtml: string;
  /** App origin (e.g. `https://cv-builder.workers.dev`) so linked assets resolve server-side. */
  baseHref: string;
}

/**
 * Builds a complete, self-contained HTML document for server-side PDF
 * rendering (Cloudflare Browser Run).
 *
 * The server runs a stock headless browser — no Angular, no app state — so
 * the document must carry everything the resume needs to render:
 *
 * 1. `<base href>` remains as a fallback for any relative asset URL, but the
 *    document is expected to be self-contained: `headStylesHtml` arrives
 *    with stylesheets already inlined (linked CSS dies on CORS/PNA checks
 *    inside the server browser's opaque-origin document).
 * 2. The collected head styles include Angular's runtime-injected component
 *    styles, whose `_ngcontent-*` selectors still match the cloned markup.
 * 3. `buildPrintStylesheet()` is reused verbatim so the output matches the
 *    client print export (A4 `@page`, color forcing, page-break rules).
 * 4. The resume is wrapped in `#print-wrapper`, the same convention
 *    `PrintExport` uses, so the print stylesheet selectors apply unchanged.
 *
 * Kept as a pure function (no DOM access) so it is unit-testable.
 */
export function buildPdfDocument(input: PdfDocumentInput): string {
  const { resumeHtml, headStylesHtml, baseHref } = input;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <base href="${baseHref}/" />
    ${headStylesHtml}
    <style>${buildPrintStylesheet()}</style>
  </head>
  <body>
    <div id="print-wrapper">${resumeHtml}</div>
  </body>
</html>`;
}
