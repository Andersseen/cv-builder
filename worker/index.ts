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

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/cv-builder\.andersseen\.dev$/,
  /^https:\/\/cv-builder-8on\.pages\.dev$/,
  /^https:\/\/[a-z0-9-]+\.cv-builder-8on\.pages\.dev$/,
  /^http:\/\/localhost:517\d$/,
  /^http:\/\/127\.0\.0\.1:517\d$/,
];

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
    ? origin
    : null;
}

function corsHeaders(request: Request): HeadersInit {
  const allowedOrigin = getAllowedOrigin(request);
  return allowedOrigin
    ? {
        "access-control-allow-origin": allowedOrigin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin",
      }
    : { vary: "Origin" };
}

function jsonError(status: number, message: string, request: Request): Response {
  return Response.json(
    { error: message },
    { status, headers: corsHeaders(request) },
  );
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
    return jsonError(405, "Method not allowed", request);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_DOCUMENT_BYTES) {
    return jsonError(413, "Document too large", request);
  }

  let body: PdfRequest;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON body", request);
  }

  const documentHtml = body.document;
  if (!documentHtml || typeof documentHtml !== "string") {
    return jsonError(400, 'Missing "document" field', request);
  }
  if (new TextEncoder().encode(documentHtml).length > MAX_DOCUMENT_BYTES) {
    return jsonError(413, "Document too large", request);
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
        ...corsHeaders(request),
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
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request),
        });
      }

      try {
        return await handlePdf(request, env);
      } catch (error) {
        console.error("PDF generation failed:", error);
        return jsonError(500, "PDF generation failed", request);
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonError(404, "Not found", request);
    }

    return jsonError(404, "Not found", request);
  },
};
