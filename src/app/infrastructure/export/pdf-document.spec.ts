import { describe, expect, it } from "vitest";
import { buildPdfDocument } from "./pdf-document";

const INPUT = {
  resumeHtml: '<div class="resume-content"><h1>Ada Lovelace</h1></div>',
  headStylesHtml:
    '<link rel="stylesheet" href="/assets/styles-abc123.css" /><style>_ngcontent-1{}</style>',
  baseHref: "https://cv-builder.example.dev",
};

describe("buildPdfDocument", () => {
  it("wraps the resume markup in the print wrapper", () => {
    const doc = buildPdfDocument(INPUT);
    expect(doc).toContain(`<div id="print-wrapper">${INPUT.resumeHtml}</div>`);
  });

  it("includes the collected head styles", () => {
    const doc = buildPdfDocument(INPUT);
    expect(doc).toContain(INPUT.headStylesHtml);
  });

  it("sets a base href so relative assets resolve against the origin", () => {
    const doc = buildPdfDocument(INPUT);
    expect(doc).toContain(`<base href="${INPUT.baseHref}/" />`);
  });

  it("inlines the print stylesheet (A4 page setup + wrapper visibility)", () => {
    const doc = buildPdfDocument(INPUT);
    expect(doc).toContain("@page");
    expect(doc).toContain("size: A4 portrait");
    expect(doc).toContain("#print-wrapper");
    expect(doc).toContain("-webkit-print-color-adjust: exact");
  });

  it("produces a complete HTML document", () => {
    const doc = buildPdfDocument(INPUT);
    expect(doc.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(doc).toContain("<body>");
    expect(doc.trimEnd().endsWith("</html>")).toBe(true);
  });
});
