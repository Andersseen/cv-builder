import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv.model";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";

/**
 * 100% client-side PDF export.
 * Strategy: html-to-image → JPEG → jsPDF embed.
 */
@Injectable({ providedIn: "root" })
export class PdfExportService {
  /**
   * Export the resume preview DOM element to PDF and trigger download.
   * @param cv       The CV data (used for filename).
   * @param element  The DOM element to capture (the template root).
   */
  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Render at 2x for crisp output
    const scale = 2;
    const pxWidth = Math.round(a4Width * 3.7795275591 * scale); // mm → px at 96 DPI * scale
    const pxHeight = Math.round(a4Height * 3.7795275591 * scale);

    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      canvasWidth: pxWidth,
      canvasHeight: pxHeight,
      pixelRatio: 1, // we already scaled via canvasWidth/Height
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(dataUrl, "JPEG", 0, 0, a4Width, a4Height);

    const filename = cv.name
      ? `${cv.name.replace(/\s+/g, "_")}_Resume.pdf`
      : "Resume.pdf";

    pdf.save(filename);
  }
}
