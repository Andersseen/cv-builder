import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv.model";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/**
 * 100% client-side PDF export.
 * Strategy: html-to-image (PNG @ 3x) → jsPDF embed at A4.
 */
@Injectable({ providedIn: "root" })
export class PdfExportService {
  /** A4 width in px at 96 DPI */
  private readonly A4_PX_WIDTH = 794;

  /**
   * Export the resume preview DOM element to PDF and trigger download.
   * @param cv       The CV data (used for filename).
   * @param element  The DOM element to capture (the template root).
   */
  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Lock element to A4 width so capture is consistent
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    element.style.width = `${this.A4_PX_WIDTH}px`;
    element.style.maxWidth = `${this.A4_PX_WIDTH}px`;

    try {
      // Render at 3x pixel ratio with PNG (lossless) for crisp text
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, a4Width, a4Height);

      const filename = cv.name
        ? `${cv.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(filename);
    } finally {
      // Restore original styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
    }
  }
}
