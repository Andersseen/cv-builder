import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv-model";
import { A4 } from "./a4";

// html-to-image and jspdf are lazy-loaded inside exportToPdf() so they are
// not pulled into the initial editor chunk.

/**
 * Image-based PDF export.
 *
 * Strategy: capture the resume DOM as a high-DPI PNG via `html-to-image`,
 * then place it into a `jsPDF` A4 document, slicing across pages if the
 * rendered height exceeds a single sheet.
 *
 * ## Trade-offs vs PrintExport
 *
 * | Aspect          | ImageExport      | PrintExport       |
 * |-----------------|------------------|-------------------|
 * | Text selectable | ❌               | ✅                |
 * | Visual fidelity | Pixel-perfect    | High              |
 * | File size       | ~2-5 MB          | ~100 KB           |
 * | ATS friendly    | ❌               | ✅                |
 */
@Injectable({ providedIn: "root" })
export class PdfExport {
  /**
   * Export the resume as a downloadable image-based PDF.
   *
   * @param cv   The CV model (used for the filename).
   * @param element The `#resume-content` DOM node to capture.
   */
  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    const originalStyles = this.lockToA4Width(element);
    const pageBreakStyles = this.avoidPageBreaks(element);

    try {
      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const dataUrl = await this.captureHighDpiPng(element, toPng);
      const { width: imgW, height: imgH } = await this.loadImage(dataUrl);
      const renderedHeight = (imgH / imgW) * A4.WIDTH_MM;

      const pdf = this.createPdf(jsPDF);
      this.addImagePages(pdf, dataUrl, renderedHeight);
      pdf.save(this.buildFilename(cv));
    } finally {
      this.restoreStyles(element, originalStyles);
      this.restorePageBreakStyles(element, pageBreakStyles);
    }
  }

  // ─── Capture ─────────────────────────────────────────────────

  /** Capture the element as a 3× resolution PNG data URL. */
  private captureHighDpiPng(
    element: HTMLElement,
    toPng: typeof import("html-to-image").toPng,
  ): Promise<string> {
    return toPng(element, { backgroundColor: "#ffffff", pixelRatio: 3 });
  }

  /** Load an image data URL and resolve with the HTMLImageElement. */
  private loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  // ─── PDF construction ────────────────────────────────────────

  /** Create a blank A4 portrait jsPDF document. */
  private createPdf(jsPDF: typeof import("jspdf").default): import("jspdf").default {
    return new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  }

  /**
   * Place the image onto one or more PDF pages.
   * If `renderedHeight` exceeds A4, slices across pages by
   * drawing the full image with a negative Y offset.
   */
  private addImagePages(
    pdf: import("jspdf").default,
    dataUrl: string,
    renderedHeight: number,
  ): void {
    if (renderedHeight <= A4.HEIGHT_MM) {
      pdf.addImage(dataUrl, "PNG", 0, 0, A4.WIDTH_MM, renderedHeight);
      return;
    }

    const totalPages = Math.ceil(renderedHeight / A4.HEIGHT_MM);
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();
      const yOffset = -(page * A4.HEIGHT_MM);
      pdf.addImage(dataUrl, "PNG", 0, yOffset, A4.WIDTH_MM, renderedHeight);
    }
  }

  // ─── DOM helpers ─────────────────────────────────────────────

  /**
   * Temporarily lock the element to A4 pixel width so the capture
   * produces a consistent result regardless of the preview panel size.
   */
  private lockToA4Width(el: HTMLElement): Map<string, string> {
    const saved = new Map([
      ["width", el.style.width],
      ["maxWidth", el.style.maxWidth],
      ["minHeight", el.style.minHeight],
    ]);

    el.style.width = `${A4.WIDTH_PX}px`;
    el.style.maxWidth = `${A4.WIDTH_PX}px`;
    el.style.minHeight = "auto";

    return saved;
  }

  /** Restore the original inline styles after capture. */
  private restoreStyles(el: HTMLElement, saved: Map<string, string>): void {
    el.style.width = saved.get("width") ?? "";
    el.style.maxWidth = saved.get("maxWidth") ?? "";
    el.style.minHeight = saved.get("minHeight") ?? "";
  }

  // ─── Filename ────────────────────────────────────────────────

  /** Derive a filesystem-friendly filename from the CV name. */
  private buildFilename(cv: Cv): string {
    return cv.name
      ? `${cv.name.replace(/\s+/g, "_")}_Resume.pdf`
      : "Resume.pdf";
  }

  // ─── Page-break avoidance ────────────────────────────────────

  /**
   * Push sections that cross an A4 page boundary down to the next page by
   * adding padding-bottom to the previous section. This prevents the image
   * slicing from cutting a section in half.
   *
   * Returns a map of modified elements to their original padding-bottom
   * values so they can be restored.
   *
   * Limitation: if a single section is taller than one A4 page it will still
   * be cut; this is uncommon for resume sections.
   */
  private avoidPageBreaks(el: HTMLElement): Map<HTMLElement, string> {
    const saved = new Map<HTMLElement, string>();
    const pageHeight = A4.HEIGHT_PX;
    // Sections and their direct child divs (the list items in every template).
    const blocks = Array.from(
      el.querySelectorAll<HTMLElement>("section, section > div"),
    );
    if (blocks.length < 2) return saved;

    const containerRect = el.getBoundingClientRect();

    // Iterate twice to stabilise after padding changes.
    for (let pass = 0; pass < 2; pass++) {
      let previousBlock: HTMLElement | null = null;

      for (const block of blocks) {
        const rect = block.getBoundingClientRect();
        const top = rect.top - containerRect.top;
        const bottom = top + rect.height;
        const startPage = Math.floor(top / pageHeight);
        const endPage = Math.floor(bottom / pageHeight);

        if (startPage !== endPage && previousBlock) {
          const nextPageTop = (startPage + 1) * pageHeight;
          const needed = nextPageTop - top;
          if (needed > 0) {
            const currentPadding =
              getComputedStyle(previousBlock).paddingBottom ?? "0px";
            const currentPx = parseFloat(currentPadding) || 0;
            const newPadding = `${currentPx + needed}px`;

            if (!saved.has(previousBlock)) {
              saved.set(previousBlock, previousBlock.style.paddingBottom);
            }
            previousBlock.style.paddingBottom = newPadding;
          }
        }
        previousBlock = block;
      }
    }

    return saved;
  }

  /** Restore padding-bottom values modified by avoidPageBreaks. */
  private restorePageBreakStyles(
    el: HTMLElement,
    saved: Map<HTMLElement, string>,
  ): void {
    for (const [element, original] of saved) {
      element.style.paddingBottom = original;
    }
  }
}
