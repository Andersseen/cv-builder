import puppeteer from "@cloudflare/puppeteer";

interface Env {
  BROWSER: Fetcher;
}

/** Payload for POST /api/pdf: a complete, self-contained HTML document. */
interface PdfRequest {
  document?: string;
}

/** Reject obviously abusive payloads (avatars are inlined as data URLs). */
const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

/**
 * Render the provided HTML document to a PDF using Cloudflare Browser Run.
 *
 * The client sends a fully-built document (styles inlined, resume wrapped in
 * `#print-wrapper` with the print stylesheet applied), so the browser only
 * needs to lay it out in print media and emit an A4 PDF.
 */
async function handlePdf(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_DOCUMENT_BYTES) {
    return jsonError(413, "Document too large");
  }

  let body: PdfRequest;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const documentHtml = body.document;
  if (!documentHtml || typeof documentHtml !== "string") {
    return jsonError(400, 'Missing "document" field');
  }
  if (new TextEncoder().encode(documentHtml).length > MAX_DOCUMENT_BYTES) {
    return jsonError(413, "Document too large");
  }

  const browser = await puppeteer.launch(env.BROWSER);
  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.setContent(documentHtml, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      printBackground: true,
      // Respect the document's `@page { size: A4; margin: 0 }` rule so the
      // resume renders full-bleed, exactly like the client print export.
      preferCSSPageSize: true,
    });

    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
        "cache-control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/pdf") {
      try {
        return await handlePdf(request, env);
      } catch (error) {
        console.error("PDF generation failed:", error);
        return jsonError(500, "PDF generation failed");
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonError(404, "Not found");
    }

    return jsonError(404, "Not found");
  },
};
