import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv.model";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/**
 * 100 % client-side PDF export.
 * Strategy: html-to-image (PNG @ 3×) → jsPDF, preserving the
 * natural aspect ratio and splitting across pages when needed.
 */
@Injectable({ providedIn: "root" })
export class PdfExportService {
  /** A4 width in px at 96 DPI */
  private readonly A4_PX_WIDTH = 794;

  async exportToPdf(cv: Cv, element: HTMLElement): Promise<void> {
    // A4 in mm
    const a4W = 210;
    const a4H = 297;

    // 1. Lock element to consistent A4 width
    const origW = element.style.width;
    const origMaxW = element.style.maxWidth;
    const origMinH = element.style.minHeight;
    element.style.width = `${this.A4_PX_WIDTH}px`;
    element.style.maxWidth = `${this.A4_PX_WIDTH}px`;
    element.style.minHeight = "auto";

    try {
      // 2. Capture high-DPI PNG
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      // 3. Decode the image to get its actual pixel size
      const img = await this.loadImage(dataUrl);
      const imgW = img.width;
      const imgH = img.height;

      // 4. The image maps to a4W; compute rendered height in mm
      const renderedH = (imgH / imgW) * a4W;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      if (renderedH <= a4H) {
        // Content fits on a single page
        pdf.addImage(dataUrl, "PNG", 0, 0, a4W, renderedH);
      } else {
        // Content spans multiple pages — slice the image
        const totalPages = Math.ceil(renderedH / a4H);

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) pdf.addPage();

          // We draw the *full* image offset upward so that only
          // the current page's slice is visible.
          const yOffset = -(page * a4H);
          pdf.addImage(dataUrl, "PNG", 0, yOffset, a4W, renderedH);
        }
      }

      const filename = cv.name
        ? `${cv.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(filename);
    } finally {
      element.style.width = origW;
      element.style.maxWidth = origMaxW;
      element.style.minHeight = origMinH;
    }
  }

  /** Load an image data URL and resolve with the HTMLImageElement once ready. */
  private loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }
}
