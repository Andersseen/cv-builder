import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";
import { provideServerContext } from "@analogjs/router/server";
import { ServerContext } from "@analogjs/router/tokens";
import { App } from "./app/app";
import { config } from "./app/app.config.server";

enableProdMode();

export function bootstrap() {
  return bootstrapApplication(App, config);
}

export default async function render(
  url: string,
  document: string,
  serverContext: ServerContext,
) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [provideServerContext(serverContext)],
  });

  return html;
}
