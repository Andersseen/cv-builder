/// <reference types="vitest" />

import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import analog from "@analogjs/platform";

const LOCAL_PDF_WORKER_URL = "http://127.0.0.1:8787/api/pdf";

function cloudPdfDevProxy(): Plugin {
  return {
    name: "cloud-pdf-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/pdf", async (request, response) => {
        try {
          await forwardToLocalPdfWorker(request, response);
        } catch (error) {
          const detail =
            error instanceof Error ? error.message : "Unknown proxy error";
          response.statusCode = 503;
          response.setHeader("content-type", "application/json");
          response.end(
            JSON.stringify({
              error: "Cloud PDF Worker is not reachable locally",
              detail,
              hint: "Restart local dev with `pnpm start`, or run `pnpm dev:worker` in another terminal alongside `pnpm dev:app`.",
            }),
          );
        }
      });
    },
  };
}

async function forwardToLocalPdfWorker(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const body = await readRequestBody(request);
  const workerResponse = await fetch(LOCAL_PDF_WORKER_URL, {
    method: request.method,
    headers: toFetchHeaders(request.headers),
    body,
  });

  response.statusCode = workerResponse.status;
  workerResponse.headers.forEach((value, key) => {
    if (key !== "transfer-encoding") {
      response.setHeader(key, value);
    }
  });

  const responseBody = await workerResponse.arrayBuffer();
  response.end(new Uint8Array(responseBody));
}

async function readRequestBody(
  request: IncomingMessage,
): Promise<Uint8Array | undefined> {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of request) {
    chunks.push(
      typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk,
    );
  }

  const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function toFetchHeaders(headers: IncomingHttpHeaders): Headers {
  const fetchHeaders = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (!value || key === "host" || key === "connection") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        fetchHeaders.append(key, item);
      }
    } else {
      fetchHeaders.set(key, value);
    }
  }
  return fetchHeaders;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ["es2022"],
  },
  resolve: {
    mainFields: ["module"],
  },
  plugins: [
    cloudPdfDevProxy(),
    analog({
      ssr: false,
      static: true,
      liveReload: false,
    }),
  ],
  define: {
    "import.meta.vitest": mode !== "production",
  },
}));
