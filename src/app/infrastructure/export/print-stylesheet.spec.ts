import { describe, it, expect } from "vitest";
import { buildPrintStylesheet } from "./print-stylesheet";
import { A4 } from "./a4";

describe("buildPrintStylesheet", () => {
  const css = buildPrintStylesheet();

  it("forces the resume container to A4 dimensions", () => {
    expect(css).toContain(`width: ${A4.WIDTH_MM}mm !important`);
    expect(css).toContain(`min-height: ${A4.HEIGHT_MM}mm !important`);
  });

  it("preserves background colours in print", () => {
    expect(css).toContain("print-color-adjust: exact !important");
  });

  // Regression: the flex-stretch rule must ONLY target the top-level
  // two-column layout (`.resume-content > .flex`, used by the Creative
  // sidebar). It must NOT match nested header rows
  // (`.resume-content > div > .flex`) — that stretched the Modern/Executive
  // headers to a full A4 page each, turning a 2-page resume into 4 pages.
  it("stretches only the direct flex child of .resume-content", () => {
    expect(css).toContain(".resume-content > .flex");
    expect(css).not.toContain(".resume-content > div > .flex");
  });
});
