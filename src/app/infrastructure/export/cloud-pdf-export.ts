import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv-model";
import { buildPdfDocument } from "./pdf-document";

/**
 * Server-rendered PDF export via Cloudflare Browser Run.
 *
 * Strategy: build a self-contained HTML document from the live preview
 * (resume markup + all page styles + the print stylesheet), POST it to the
 * project's own Cloudflare Worker at `/api/pdf`, which renders it in a
 * headless browser and returns a real A4 PDF.
 *
 * ## Trade-offs vs the client-side exports
 *
 * | Aspect              | ImageExport      | PrintExport    | CloudPdfExport        |
 * |---------------------|------------------|----------------|-----------------------|
 * | Text selectable     | ❌               | ✅             | ✅                    |
 * | Visual fidelity     | Pixel-perfect    | High           | Pixel-perfect         |
 * | File size           | ~2-5 MB          | ~100 KB        | ~100-300 KB           |
 * | ATS friendly        | ❌               | ✅             | ✅                    |
 * | Data leaves browser | Never            | Never          | To our Worker only ⚠️ |
 *
 * ⚠️ Unlike the other paths, this one sends the resume HTML over the
 * network — to the project's own Cloudflare Worker, nowhere else. The
 * dropdown label says this out loud so the choice is explicit.
 */
@Injectable({ providedIn: "root" })
export class CloudPdfExport {
  /**
   * Export the resume as a server-rendered, text-based PDF.
   *
   * @param cv The CV model (used for the filename).
   * @param element The `.resume-content` DOM node from the export preview.
   */
  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    const documentHtml = buildPdfDocument({
      resumeHtml: element.outerHTML,
      headStylesHtml: await this.collectHeadStyles(),
      baseHref: document.location.origin,
    });

    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ document: documentHtml }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Cloud PDF failed (${response.status}): ${detail}`);
    }

    const blob = await response.blob();
    this.download(blob, this.buildFilename(cv));
  }

  // ─── Private helpers ─────────────────────────────────────────

  /**
   * Collect every stylesheet in the document head as INLINE `<style>` tags.
   *
   * `<style>` tags (Angular's runtime-injected component styles) are copied
   * as-is. Linked stylesheets (the compiled Tailwind bundle) are fetched and
   * inlined instead of sent as `<link>` tags: the server-side browser renders
   * a `setContent()` document from an opaque `null` origin, so a `<link>` —
   * especially with Vite's `crossorigin` attribute — dies on CORS / Private
   * Network Access checks. An inlined document is fully self-contained and
   * needs zero subresource loads.
   */
  private async collectHeadStyles(): Promise<string> {
    const nodes = Array.from(
      document.head.querySelectorAll('style, link[rel="stylesheet"]'),
    );
    const parts = await Promise.all(
      nodes.map((node) => this.toInlineStyle(node)),
    );
    return parts.join("\n");
  }

  /** Convert a head node to an inline `<style>` tag. */
  private async toInlineStyle(node: Node): Promise<string> {
    if (node instanceof HTMLStyleElement) {
      return node.outerHTML;
    }
    if (node instanceof HTMLLinkElement) {
      const response = await fetch(node.href);
      if (!response.ok) {
        throw new Error(`Failed to fetch stylesheet ${node.href}`);
      }
      const css = await response.text();
      return `<style>${css}</style>`;
    }
    return "";
  }

  /** Trigger a browser download for the received PDF. */
  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  /** Derive a filesystem-friendly filename from the CV name. */
  private buildFilename(cv: Cv): string {
    return cv.name
      ? `${cv.name.replace(/\s+/g, "_")}_Resume.pdf`
      : "Resume.pdf";
  }
}
