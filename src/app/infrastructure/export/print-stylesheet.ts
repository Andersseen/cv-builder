import { A4 } from "./a4";

/**
 * Generates the `@media print` stylesheet injected by PrintExport.
 *
 * Kept as a pure function (no side-effects) so it can be
 * unit-tested independently of the DOM.
 */
export function buildPrintStylesheet(): string {
  return [
    screenHideWrapper(),
    pageSetup(),
    printColorForcing(),
    printAppVisibility(),
    printResumeA4(),
    printTailwindOverrides(),
    printFlexStretch(),
    printPageBreaks(),
  ].join("\n");
}

// ─── Individual CSS blocks ──────────────────────────────────

/** On screen the wrapper is invisible — it only exists for print. */
function screenHideWrapper(): string {
  return `
    #print-wrapper {
      display: none;
    }`;
}

/** Force A4 portrait with zero margins. */
function pageSetup(): string {
  return `
    @page {
      size: A4 portrait;
      margin: 0;
    }`;
}

/** Ensure all background colours/gradients are preserved in print. */
function printColorForcing(): string {
  return `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }`;
}

/** Hide every direct child of body except the print wrapper. */
function printAppVisibility(): string {
  return `
    @media print {
      body > *:not(#print-wrapper) {
        display: none !important;
      }

      #print-wrapper {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }`;
}

/** Force the resume container to exactly A4 dimensions. */
function printResumeA4(): string {
  return `
    @media print {
      #print-wrapper #resume-content {
        width: ${A4.WIDTH_MM}mm !important;
        max-width: ${A4.WIDTH_MM}mm !important;
        min-width: ${A4.WIDTH_MM}mm !important;
        min-height: ${A4.HEIGHT_MM}mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }`;
}

/** Override Tailwind max-width utility classes that constrain width. */
function printTailwindOverrides(): string {
  return `
    @media print {
      #print-wrapper .max-w-4xl,
      #print-wrapper .max-w-3xl,
      #print-wrapper .max-w-2xl {
        max-width: ${A4.WIDTH_MM}mm !important;
      }
    }`;
}

/** Stretch flex children so the layout fills the full page height. */
function printFlexStretch(): string {
  return `
    @media print {
      #print-wrapper #resume-content > .flex,
      #print-wrapper #resume-content > div > .flex {
        min-height: ${A4.HEIGHT_MM}mm !important;
      }
    }`;
}

/** Prevent awkward page breaks inside sections / after headings. */
function printPageBreaks(): string {
  return `
    @media print {
      section { break-inside: avoid; }
      h1, h2, h3 { break-after: avoid; }
    }`;
}
