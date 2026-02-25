import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv.model";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { A4 } from "./a4.constants";

/**
 * Image-based PDF export.
 *
 * Strategy: capture the resume DOM as a high-DPI PNG via `html-to-image`,
 * then place it into a `jsPDF` A4 document, slicing across pages if the
 * rendered height exceeds a single sheet.
 *
 * ## Trade-offs vs PrintExportService
 *
 * | Aspect          | ImageExport      | PrintExport       |
 * |-----------------|------------------|-------------------|
 * | Text selectable | ❌               | ✅                |
 * | Visual fidelity | Pixel-perfect    | High              |
 * | File size       | ~2-5 MB          | ~100 KB           |
 * | ATS friendly    | ❌               | ✅                |
 */
@Injectable({ providedIn: "root" })
export class PdfExportService {
  /**
   * Export the resume as a downloadable image-based PDF.
   *
   * @param cv   The CV model (used for the filename).
   * @param element The `#resume-content` DOM node to capture.
   */
  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    const originalStyles = this.lockToA4Width(element);

    try {
      const dataUrl = await this.captureHighDpiPng(element);
      const { width: imgW, height: imgH } = await this.loadImage(dataUrl);
      const renderedHeight = (imgH / imgW) * A4.WIDTH_MM;

      const pdf = this.createPdf();
      this.addImagePages(pdf, dataUrl, renderedHeight);
      pdf.save(this.buildFilename(cv));
    } finally {
      this.restoreStyles(element, originalStyles);
    }
  }

  // ─── Capture ─────────────────────────────────────────────────

  /** Capture the element as a 3× resolution PNG data URL. */
  private captureHighDpiPng(element: HTMLElement): Promise<string> {
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
  private createPdf(): jsPDF {
    return new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  }

  /**
   * Place the image onto one or more PDF pages.
   * If `renderedHeight` exceeds A4, slices across pages by
   * drawing the full image with a negative Y offset.
   */
  private addImagePages(
    pdf: jsPDF,
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
}
