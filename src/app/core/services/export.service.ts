import { Injectable, inject } from '@angular/core';
import { Resume } from '../models/resume.model';
import { toJpeg } from 'html-to-image';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private toastService = inject(ToastService);

  async exportToPdf(resume: Resume, elementId: string): Promise<void> {
    try {
      // First convert the HTML to an image
      const resumeElement = document.getElementById(elementId);
      if (!resumeElement) {
        this.toastService.show('Resume element not found', 'error');
        return;
      }

      // Create a loading toast
      this.toastService.show('Generating PDF...', 'info');

      // Convert the HTML to an image
      const dataUrl = await toJpeg(resumeElement, {
        quality: 0.95,
        backgroundColor: 'white',
        canvasWidth: 794, // A4 width in pixels at 96 DPI
        canvasHeight: 1123, // A4 height in pixels at 96 DPI
      });

      // Create a new PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([794, 1123]); // A4 size at 96 DPI

      // Convert data URL to Uint8Array
      const base64Data = dataUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const image = await pdfDoc.embedJpg(imageBytes);

      // Draw the image on the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create a Blob from the PDF data
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Create a link to download the PDF
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${resume.name.replace(/\s+/g, '_')}.pdf`;
      link.click();

      this.toastService.show('PDF exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting to PDF', error);
      this.toastService.show('Error exporting to PDF', 'error');
    }
  }

  exportToJSON(resume: Resume): void {
    try {
      const json = JSON.stringify(resume, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${resume.name.replace(/\s+/g, '_')}.json`;
      link.click();
      
      this.toastService.show('Resume exported as JSON', 'success');
    } catch (error) {
      console.error('Error exporting to JSON', error);
      this.toastService.show('Error exporting to JSON', 'error');
    }
  }

  async importFromJSON(file: File): Promise<Resume | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonContent = event.target?.result as string;
          const resume = JSON.parse(jsonContent) as Resume;
          
          // Validate the parsed JSON
          if (!resume.id || !resume.personalInfo || !Array.isArray(resume.sections)) {
            this.toastService.show('Invalid resume JSON format', 'error');
            resolve(null);
            return;
          }
          
          this.toastService.show('Resume imported successfully', 'success');
          resolve(resume);
        } catch (error) {
          console.error('Error parsing JSON', error);
          this.toastService.show('Error parsing JSON file', 'error');
          resolve(null);
        }
      };
      
      reader.onerror = () => {
        this.toastService.show('Error reading file', 'error');
        resolve(null);
      };
      
      reader.readAsText(file);
    });
  }
}