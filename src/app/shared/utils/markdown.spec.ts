import { describe, it, expect } from "vitest";
import { renderRichText } from "./markdown";

describe("renderRichText", () => {
  it("returns empty string for empty input", () => {
    expect(renderRichText("")).toBe("");
  });

  it("renders bold and italic", () => {
    expect(renderRichText("**hi** and *bye*")).toBe(
      "<strong>hi</strong> and <em>bye</em>",
    );
  });

  it("groups consecutive dash lines into a list", () => {
    expect(renderRichText("- one\n- two")).toBe(
      '<ul style="list-style:disc;padding-left:1.25rem;margin:0.25rem 0"><li>one</li><li>two</li></ul>',
    );
  });

  it("joins plain lines with <br>", () => {
    expect(renderRichText("line1\nline2")).toBe("line1<br>line2");
  });

  it("escapes HTML to prevent injection", () => {
    expect(renderRichText("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("mixes a paragraph, a list, and formatting", () => {
    expect(renderRichText("Intro\n- **a**\n- b")).toBe(
      'Intro<ul style="list-style:disc;padding-left:1.25rem;margin:0.25rem 0"><li><strong>a</strong></li><li>b</li></ul>',
    );
  });
});
