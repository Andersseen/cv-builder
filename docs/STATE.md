# STATE — Current status of the project

> **How to use this file**: read it at the start of every session to know where work stands. **Update it at the end of every session**: move finished items to the log, add new known issues, keep "Next steps" honest. Keep it short — this is a status board, not a changelog archive.

**Last updated**: 2026-08-12 · **Active branch**: `main`. Fases 0–7 de [docs/plan/PLAN.md](plan/PLAN.md) completadas. **Angular 22 + Signal Forms**: los 8 formularios del editor migrados desde Reactive Forms ([docs/signal-forms-migration.md](signal-forms-migration.md)). Deployment migrado a **Cloudflare Pages para la app** + **Cloudflare Worker separado para servicios** (`POST /api/pdf`) ([spec 006](specs/006-cloudflare-pages-app-worker-services.md)). Cloud PDF con Browser Run sigue disponible como export opt-in ([spec 005](specs/005-cloudflare-workers-cloud-pdf.md)). Automatización de Claude Code (hooks, skills, subagentes, MCP) configurada en `.claude/`.

## In progress

_Nothing currently in progress. Ready for next phase planning._

## What's working (stable)

- Full flow: landing → dashboard (CRUD of CVs + JSON export/import per CV + backup/restore) → editor (9 tabs) → live preview → PDF/print export.
- 5 templates (Modern, Classic, Minimal, Creative, Executive) with per-CV accent/background/primary color/font settings. **Templates now support ordered, visible, and custom sections via `getOrderedSections()` and render custom sections dynamically.**
- Autosave to IndexedDB (Dexie) with debounce + saved indicator; data survives reloads.
- Dark/light theme with localStorage persistence and system-preference fallback.
- Multi-page image PDF export, text-based print export, y **Cloud PDF** server-side vía Cloudflare Browser Run (`worker/index.ts`, `POST /api/pdf`).
- **Fase 0**: QA manual del flujo completo en desktop; e2e extendido con flujo real.
- **Fase 1**: Export/import JSON por CV + backup completo + validación estructural + `navigator.storage.persist()` + banner de datos locales.
- **Fase 2**: Editor usable en viewports <lg con overlay de preview y render off-screen para export.
- **Fase 3**: Undo/redo en memoria, atajos de teclado, botones en toolbar, y modal de confirmación para borrar CV.
- **Fase 4**: Etiquetas claras de export, filename en print, lazy-load de libs PDF, y mitigación de cortes de página.
- **Fase 5**: CV de ejemplo, score de completitud y sugerencias accionables en vivo.
- **Fase 6**:
  - Solo `fullName` es obligatorio en `personal-info-form.ts`; `email` se valida solo si no está vacío; Phone/Location ya no tienen `*` ni error de required.
  - Downscale de avatar a máx 400 px lado + JPEG calidad 0.85 vía `resizeImageToDataUrl()` en `personal-info-form.ts`.
  - `@utility input-field` y `input-field-resize-none` en `src/styles.css`; aplicadas a todos los `volt-input`/`volt-textarea`/`volt-native-select` de los 7 formularios.
  - Selector de fuente en `template-selector.ts` con 4 opciones seguras para print; `settings.fontFamily` cableado a las 5 plantillas y al `resume-preview`; preview y exports respetan la fuente elegida.
- **Fase 7**: secciones flexibles. Modelo extendido con `sections.customSections`, `settings.sectionVisibility` y `settings.sectionOrder`; helpers puros `getOrderedSections`, `isSectionVisible`, `moveSection`, `toggleSectionVisibility`, `createCustomSection` con tests. Nuevo tab "Sections" en el editor (`editor-tabs.ts`, `editor.page.ts`, `editor.html`) con visibilidad/reorden de secciones y CRUD de secciones personalizadas. Las 5 plantillas renderizan por orden, respetan visibilidad y muestran custom sections.
- **Angular 22 + Signal Forms**: `@angular/*` 22.1.1, AnalogJS 2.7, Vite 8, TypeScript 6.0, Vitest 4. UI libs al día: `@voltui/components` 1.0.0, `angular-movement` 0.7.0, `quartz-headless` 0.0.5. `@angular/animations` eliminado de `dependencies` (nadie lo usaba; `provideAnimations`/`provideNoopAnimations` están deprecados desde 20.2 y se van en v23). Los 8 formularios del editor usan `form()` + `[formField]` (`@angular/forms/signals`); no queda ni un `FormGroup` en `src/`. `PersonalInfoForm` y `CustomSectionForm` usan `model()` para escribir directo al store (sin `effect`/`patchValue`/`valueChanges`); los 6 editores con draft mantienen su buffer privado y semántica de Cancel.
- **Tooling**: ESLint + angular-eslint + Prettier + Vitest + Playwright. Vitest ahora tiene 2 proyectos: `domain` (Node, rápido) y `component` (jsdom + TestBed zoneless, ficheros `*.ct.spec.ts`). 184 unit/component tests green, 22 e2e tests green.
- **Deployment**: Cloudflare es el único platform target. App estática en Pages (`wrangler.jsonc`, `pages_build_output_dir: dist/analog/public`, `public/_redirects` para SPA fallback, `public/_headers` para cache/seguridad) y servicio PDF en Worker separado `cv-builder-pdf` (`worker/wrangler.jsonc`, Browser Run binding `BROWSER`, `workers.dev` habilitado). En producción el cliente llama a `https://cv-builder-pdf.andriipap01.workers.dev/api/pdf` con CORS restringido; `pnpm deploy:prod` despliega ambos; `.github/workflows/deploy.yml` lo hace en cada push a `main`.
- **Local Cloud PDF dev**: `pnpm start` levanta el Worker (`localhost:8787`) y luego Vite (`localhost:5173`). `vite.config.ts` intercepta `/api/pdf` antes del router dev de Analog y lo reenvía al Worker local.

## Known issues

1. **Vite dev warnings** (non-blocking): `[@analogjs/vite-plugin-angular]` warns that pre-bundled `node_modules/.vite/deps/*.js` and `@analogjs/router/fesm2022/*.mjs` contain Angular decorators but are not in the TypeScript program. Dev-only warning from the stable 2.6.3 plugin.
2. **Cloudflare production verification pendiente** (manual): tras el siguiente deploy verde, verificar `cv-builder.andersseen.dev` en Pages y que Cloud PDF responde desde `cv-builder-pdf.andriipap01.workers.dev`.
3. **Worker antiguo `cv-builder` puede quedar vivo** (manual): tras verificar Pages + `cv-builder-pdf`, borrar o desactivar el Worker monolítico antiguo para evitar confusiones.
4. **Peer ranges desactualizados en las libs de UI**: `@voltui/components@1.0.0`, `angular-movement@0.7.0`, `lumen-icons@0.2.0` y `quartz-headless@0.0.5` siguen declarando `@angular/core: ^21`. pnpm avisa de peers no satisfechos; build y tests van verdes, pero una instalación con `--strict-peer-dependencies` fallaría. Ninguna release upstream amplía el rango todavía.
5. **`quartz-headless` no se usa**: está en `dependencies` pero no se importa en ningún sitio de `src/`. Candidato a eliminar.

## Next steps (in rough priority order)

0. Relanzar deploy con el Worker en `workers.dev`, verificar Pages `cv-builder` en `cv-builder.andersseen.dev`, verificar Cloud PDF contra `cv-builder-pdf.andriipap01.workers.dev`, y retirar el Worker monolítico antiguo cuando producción esté verificada.
1. **Fase 8** — PWA y offline real (requiere aprobación del usuario para nueva dependencia `vite-plugin-pwa` o service worker a mano).
2. Consider running `pnpm format` once repo-wide in an isolated commit to normalize formatting.
3. Phase 8+ a11y: enable eslint template accessibility rules and fix findings.
4. Propuesta upstream a Volt UI: `FormCheckboxControl` en `VoltCheckbox` y ampliar el peer range a `^21.2.0 || ^22.0.0` (§7 de `signal-forms-migration.md`).

## Session log (newest first, keep last ~10)

- **2026-08-12** — **Angular 22 + migración a Signal Forms.**
  - Upgrade a Angular 22.1.1 (+ AnalogJS 2.7, Vite 8, TypeScript 6.0.3, Vitest 4.1, angular-eslint 22). **Cero cambios de código fuente**: build, lint y los 75 tests existentes pasaron en Angular 22 antes de tocar los formularios.
  - Infraestructura de component tests nueva: `vitest.config.ts` con 2 proyectos (`domain` en Node, `component` en jsdom con `@analogjs/vitest-angular` + TestBed zoneless), `tsconfig.spec.json` y `src/test-setup.ts`.
  - Migrados los 8 formularios a Signal Forms. Eliminados 38 `new FormControl`, 8 `new FormGroup`, 15 `Validators.*`, 8 `patchValue`, 8 `getRawValue`, 3 suscripciones `valueChanges` y 2 `effect()` de mirroring. El editor ya no importa RxJS.
  - **Bug pre-existente encontrado y arreglado**: los selects de nivel (Skills) y proficiency (Languages) lanzaban `NG01203: No value accessor` y estaban muertos en producción — `volt-native-select` (0.6.0) no implementaba CVA. Verificado en navegador real contra el código anterior. Arreglado primero con un shim local y después de forma definitiva: `@voltui/components@1.0.0` convierte `VoltNativeSelect` en directiva sobre `<select>` nativo (`select[voltNativeSelect]`), así que `[formField]` enlaza por la vía nativa y el shim se borró.
  - Subidas las libs de UI y eliminado `@angular/animations` junto con `provideAnimations()` (`main.ts`) y `provideNoopAnimations()` (`app.config.server.ts`): nada los usaba y están deprecados con retirada prevista en v23.
  - **Fuga arreglada**: `CustomSectionForm` tenía un `valueChanges.subscribe()` sin `takeUntilDestroyed`.
  - Footgun de arrays anidados documentado: iterar el `FieldTree` en `@for` lanza `NG01904 Orphan field` al borrar un item; hay que iterar el modelo e indexar `sectionForm.items[i]`.
  - Tests: 75 → 184 unit/component, 14 → 22 e2e. Cada test de componente se escribió primero contra la implementación con Reactive Forms.
  - Evidencia completa en [docs/signal-forms-migration.md](signal-forms-migration.md).

- **2026-08-12** — **Fix CI deploy sin Workers Routes.**
  - El run `31575112085` seguía fallando al escribir `/zones/.../workers/routes` aunque Pages y el upload del Worker ya funcionaban.
  - Se quitó la route de `worker/wrangler.jsonc` y se habilitó `workers_dev: true` para que CI despliegue solo el script `cv-builder-pdf`, sin permisos de zona.
  - `CloudPdfExport` ahora usa `/api/pdf` solo en local; en producción llama a `https://cv-builder-pdf.andriipap01.workers.dev/api/pdf`.
  - `worker/index.ts` añade CORS para `cv-builder.andersseen.dev`, `cv-builder-8on.pages.dev`, previews `*.cv-builder-8on.pages.dev` y localhost/127.0.0.1 en puertos 517x.

- **2026-08-12** — **Diagnóstico CI deploy Cloudflare.**
  - Revisado el run `31515154446` de GitHub Actions: `pages deploy dist/analog/public --project-name=cv-builder --branch=main` termina correctamente y publica `https://e0f5870d.cv-builder-8on.pages.dev`.
  - `wrangler deploy --config worker/wrangler.jsonc` sube el Worker `cv-builder-pdf` y detecta el binding `BROWSER`, pero falla al crear/actualizar la route `cv-builder.andersseen.dev/api/*` por `Authentication error [code: 10000]` en `/zones/61f26584b39c36626b9eedbc24ad833a/workers/routes`.
  - Causa: el token tiene permisos de account suficientes para Pages/Worker script, pero le falta `Zone: Workers Routes:Edit` para `andersseen.dev`. No conviene quitar la route del config solo para pasar CI, porque rompería `/api/pdf` en producción.

- **2026-08-11** — **Limpieza Vercel + diagnóstico deploy Cloudflare.**
  - Confirmado en GitHub Actions: `Deploy / Cloudflare Pages + Worker` falló en `wrangler pages deploy dist/analog/public --project-name=cv-builder --branch=main` por `Authentication error [code: 10000]`. Causa: `CLOUDFLARE_API_TOKEN` existe, pero no tiene permiso `Cloudflare Pages:Edit`.
  - `.github/workflows/deploy.yml` documenta permisos mínimos para el token: `Cloudflare Pages:Edit`, `Workers Scripts:Edit`, `Workers Routes:Edit`.
  - Eliminada la referencia obsoleta a Vercel en `docs/plan/CONTEXT.md`; README deja claro que no hay config Vercel y Cloudflare es el único target.
  - Desactivado y borrado desde GitHub el deployment Vercel reciente (`vercel[bot]`, environment `Preview`, id `5854616570`). Si Vercel sigue conectado como GitHub App/proyecto externo, volverá a crear deployments hasta desconectarlo en Vercel.
  - `eslint.config.mjs` ignora explícitamente `test-results/**` y `playwright-report/**` para que `pnpm lint` no falle si los artefactos de Playwright no existen.

- **2026-08-11** — **Migración Workers monolítico → Pages app + Worker PDF (spec 006).**
  - `wrangler.jsonc` vuelve a Cloudflare Pages (`pages_build_output_dir: dist/analog/public`) y se restaura `public/_redirects` para SPA fallback.
  - Añadido `worker/wrangler.jsonc` para el Worker separado `cv-builder-pdf`, con `BROWSER` de Browser Run y ruta `cv-builder.andersseen.dev/api/*`.
  - `worker/index.ts` deja de servir assets vía `ASSETS`; ahora solo responde `POST /api/pdf`, otros `/api/*` con 404, y cualquier otra ruta con 404.
  - Scripts divididos: `dev:app`, `dev:pages`, `dev:worker`, `deploy:pages`, `deploy:worker`, `deploy:prod` compuesto; `deploy:preview` vuelve a Pages. `dev:worker` fija el puerto 8787 y `pnpm start` usa `scripts/dev-local.mjs` para levantar Worker + app en orden.
  - Añadido middleware dev en `vite.config.ts` para reenviar `/api/pdf` a `http://127.0.0.1:8787/api/pdf`; esto evita el 404 de Analog/Nitro (`Cannot find any route matching /pdf`) cuando se usa `pnpm start`.
  - `.github/workflows/deploy.yml` ahora despliega Pages primero y Worker después.
  - Docs actualizados: AGENTS.md, README.md, ARCHITECTURE.md, CONTEXT.md, spec 006 + índice.
  - Verificado: `pnpm lint`, `pnpm test` (75), `pnpm build`, `pnpm e2e` (14) verdes. `wrangler deploy --dry-run --config worker/wrangler.jsonc` validó bundle/bindings y salió 0; imprimió un `EPERM` no bloqueante al intentar escribir logs fuera del sandbox. Prueba local real: `pnpm start` + `POST localhost:5173/api/pdf` devuelto como `application/pdf`.

- **2026-07-28 (noche)** — **Deploy a producción + fix de scripts y workflows.**
  - El fallo de CI en `deploy.yml` era el known issue #3 (`CLOUDFLARE_API_TOKEN` ausente; verificado con `gh run view` y `gh secret list`). Sin arreglo posible desde código: requiere crear el token en el dashboard.
  - Bump de actions en `ci.yml` y `deploy.yml` (`checkout@v7`, `setup-node@v7`, `pnpm/action-setup@v6`) para silenciar la deprecación de Node 20.
  - Renombrado el script `deploy` → `deploy:prod`: `pnpm deploy` choca con el built-in `deploy` de pnpm 10 (`ERR_PNPM_CANNOT_DEPLOY`). Docs actualizados (AGENTS.md, README, STATE).
  - **Primer deploy del Worker a producción** con `pnpm deploy:prod`: <https://cv-builder.andriipap01.workers.dev>. Verificado en vivo: `/` 200, `/dashboard` 200 (SPA fallback), `_headers` aplicados (cache immutable en `/assets/*`, revalidate en index, seguridad), y `POST /api/pdf` → PDF válido vía Browser Run.

- **2026-07-28 (tarde)** — **Migración Pages → Workers + tercera vía de PDF con Browser Run (spec 005).**
  - `wrangler.jsonc` migrado al formato Workers: `main: worker/index.ts`, `assets` con `not_found_handling: "single-page-application"` y `run_worker_first: ["/api/*"]`, binding `BROWSER` de Browser Run, `compatibility_flags: ["nodejs_compat"]` (lo pide `@cloudflare/puppeteer`). Eliminado `public/_redirects` (el SPA fallback ahora es nativo); `public/_headers` se mantiene (soportado en Workers assets).
  - Nuevo `worker/index.ts`: sirve assets vía binding `ASSETS`; `POST /api/pdf` recibe un documento HTML completo y lo renderiza con `@cloudflare/puppeteer` (`emulateMediaType("print")` + `setContent` + `page.pdf({ preferCSSPageSize: true, printBackground: true })`); guardas de método/tamaño (5 MB) y errores JSON 400/404/405/413/500.
  - Cliente: `buildPdfDocument()` pura en `infrastructure/export/pdf-document.ts` (reutiliza `buildPrintStylesheet()` y la convención `#print-wrapper`) + 5 tests. Nuevo servicio `CloudPdfExport` que POSTea el documento y descarga el blob.
  - **Hallazgo clave (fix durante verificación real)**: el documento debe llevar los estilos **inlineados**, no linkeados. El navegador server-side renderiza un documento `setContent()` con origen opaco `null`; el `<link rel="stylesheet" crossorigin>` que emite Vite muere por CORS, y en dev local además por Private Network Access (`loopback`). `CloudPdfExport` ahora fetchea cada hoja linkeada y la inlinea como `<style>` — documento autocontenido, cero subrecursos. Verificado end-to-end contra `wrangler dev` real: el PDF del CV de ejemplo sale idéntico al preview (header con gradiente, tipografía, pills de skills), 2 páginas A4, texto seleccionable.
  - UI: tercera opción "Cloud PDF (server)" en el dropdown del toolbar (con nota transparente de que el HTML sale del navegador), output `exportCloudPdf` cableado en `editor.page.ts`/`editor.html` con `isExporting` + toasts.
  - Deps (regla 11, aprobadas en el plan): `wrangler@^4`, `@cloudflare/puppeteer`, `@cloudflare/workers-types` — todas devDeps. Scripts: `deploy` → `wrangler deploy`, `deploy:preview` → `wrangler versions upload`, nuevo `dev:worker`. `deploy.yml` ahora usa `command: deploy`.
  - e2e: `e2e/cloud-pdf.spec.ts` con `/api/pdf` mockeado (la suite corre contra Vite dev, sin Worker) — verifica el POST con el documento y la descarga, y el toast de error. Helper `createResume` endurecido contra la carrera de carga inicial (espera a `app-cv-card, app-empty-state`).
  - Verificado: `pnpm lint`, `pnpm test` (75), `pnpm build`, `pnpm e2e` (14) verdes; `wrangler deploy --dry-run` OK; prueba real con `wrangler dev` + `curl` → PDF A4 válido a sangre completa con fondos (verificado visualmente), y 405/404/400 correctos.
  - **Pendiente (manual)**: `pnpm deploy:prod` a producción, Custom Domain al Worker, borrar el proyecto Pages viejo, revisar límites de Browser Run (free tier: 10 min/día).
  - Docs actualizados: AGENTS.md, README.md, ARCHITECTURE.md, CONTEXT.md (excepción de privacidad documentada), specs 005 + índice.

- **2026-07-28** — **Automatización de Claude Code: hooks, skills, subagentes y MCP.**
  - `.mcp.json`: añadidos `angular-cli` (`pnpm exec ng mcp`, el servidor MCP que trae el CLI de Angular 21 — best practices, docs y `modernize`) y `cloudflare-docs` (HTTP remoto, para no inventar sintaxis de `_headers`/`_redirects`/wrangler). Los tres servidores verificados con `claude mcp list`.
  - `.claude/settings.json` + `.claude/hooks/`: hook `PreToolUse` que bloquea escrituras a `dist/**`, `pnpm-lock.yaml` y `.env` (regla 11 y el footgun de editar el `_headers` copiado en `dist/`), y hook `PostToolUse` que pasa Prettier + `eslint --fix` al fichero recién escrito. Ambos probados con payloads reales.
  - `.claude/skills/`: `end-session` (actualiza este fichero desde el diff real, no de memoria) y `new-template` (los 3 pasos de añadir plantilla + la excepción de estilos de `resume-templates/`).
  - `.claude/agents/`: `conventions-reviewer` (reglas doradas que ni ESLint ni `tsc` cazan: fronteras de capas, `domain/` sin Angular/RxJS, estado solo vía `CvStore`, tokens semánticos) y `a11y-reviewer` (cubre el hueco de las reglas a11y de plantilla desactivadas a propósito en `eslint.config.mjs`).
  - `.gitignore`: añadido `.claude/settings.local.json` (la config compartida se commitea, los overrides personales no).

- **2026-07-25** — **Deployment unificado en Cloudflare Pages + presentación pública del repo.**
  - **Deployment**: eliminado `vercel.json`. Añadidos `wrangler.jsonc` (`pages_build_output_dir: dist/analog/public`), `public/_redirects` (SPA fallback) y `public/_headers` (cache inmutable para `/assets/*`, revalidación de `index.html`, cabeceras de seguridad). Vite copia `public/` al output, verificado en el build.
  - Añadidos scripts `deploy` y `deploy:preview` usando `pnpm dlx wrangler` (sin añadir dependencia, respetando la regla 11 de AGENTS.md).
  - Nuevo `.github/workflows/deploy.yml` (push a `main` + `workflow_dispatch`) con `cloudflare/wrangler-action@v4`, concurrency group y GitHub Environment `production`.
  - Creado el proyecto de Pages `cv-builder` y desplegado a producción. Verificado en vivo: root 200, ruta profunda `/dashboard` 200 (confirma `_redirects`), y las cabeceras de `_headers` presentes en la respuesta.
  - **README** reescrito de cero, orientado a visual: header centrado con hero, badges de estado/tech, tabla comparativa, tabla de features, galería de plantillas, 2 diagramas mermaid (capas + secuencia de keystroke→preview→autosave), tabla de stack, scripts, deployment, estructura y docs.
  - **Screenshots reales** capturados con Playwright contra el deploy en vivo y guardados en `docs/screenshots/` (landing, editor, template picker, dashboard, editor en dark mode) + `templates.png`, un strip compuesto de las 5 plantillas renderizadas en A4 con el CV de ejemplo (~1,2 MB en total).
  - **GitHub About** actualizado: descripción nueva, homepage y 20 topics (angular, angular21, analogjs, signals, zoneless, resume-builder, local-first, cloudflare-pages…).
  - Añadido `LICENSE` (MIT) — el README ya declaraba MIT pero el fichero no existía.
  - Corregidas versiones obsoletas en docs: Angular 19 → 21 en `AGENTS.md` y `docs/CONTEXT.md`, `docs/CONVENTIONS.md`; "8 tabs" → 9 en este fichero. Reescrita la sección de comandos de `AGENTS.md` (decía "no tests and no linter configured yet", que era falso) y añadida sección de Deployment.
  - **GitHub Pages deshabilitado** (`DELETE /repos/.../pages`): estaba activo construyendo desde la raíz de `main` y sirviendo el repo crudo en `andersseen.github.io/cv-builder`, o sea un segundo camino de deploy. Ahora Cloudflare Pages es literalmente el único.
  - **Fix de CI**: el primer run de `deploy.yml` falló porque wrangler 4.x exige Node ≥ 22 y los workflows pinneaban Node 20. Subidos `ci.yml` y `deploy.yml` a Node 22 y corregido el prerequisito del README (20+ → 22+). Tras el fix, `deploy.yml` llega hasta `wrangler pages deploy` y solo falta el token (Known issue 3).
  - Verificado: `pnpm lint`, `pnpm build`, `pnpm test` (70) y `pnpm e2e` (12) verdes en local; CI verde en GitHub Actions.

- **2026-07-17** — **Fase 7 finalizada: cableado del tab "Sections" y verificación completa.**
  - Añadido `sections` al union type `EditorTab` en `src/app/features/editor/components/editor-tabs.ts`.
  - Creados `src/app/features/editor/components/sections-manager.ts` y `src/app/features/editor/components/custom-section-form.ts` para gestionar visibilidad, orden y CRUD de secciones personalizadas.
  - Cableado el tab "Sections" en `src/app/pages/editor.page.ts` (imports, lista de tabs, handlers) y `src/app/pages/editor.html` (`@case ("sections")`).
  - Añadidos métodos `updateSectionVisibility`, `updateSectionOrder`, `addCustomSection`, `updateCustomSection` y `removeCustomSection` en `editor.page.ts`.
  - Corregido error de build en `custom-section-form.ts`: `(click)="remove.emit()"` → `(click)="removed.emit()"`.
  - Eliminados imports no usados en `section-helpers.spec.ts` y `sections-manager.ts` para pasar lint.
  - Verificado: `pnpm build`, `pnpm lint`, `pnpm test` (70 tests) y `pnpm e2e` (12 tests) verdes.
  - Actualizados `docs/plan/PLAN.md`, `docs/STATE.md` y `docs/specs/004-fase7-flexible-sections.md` a Done.

- **2026-07-17** — **Fase 7 (inicio): refactor de plantillas para secciones ordenadas, visibles y personalizadas.**
  - Añadidos `getOrderedSections()`, `CustomSection` y `CustomItem` a las 5 plantillas (`modern-template.ts`, `classic-template.ts`, `minimal-template.ts`, `creative-template.ts`, `executive-template.ts`).
  - Reemplazados los bloques estáticos de `experience`, `education`, `skills`, `projects`, `certifications` y `languages` por un `@for` + `@switch` sobre `orderedSections()`.
  - Creative renderiza `skills`, `education` y `languages` en la sidebar y el resto (incluidas secciones personalizadas) en la columna principal.
  - Añadido renderizado de secciones personalizadas con título, subtítulo y descripción markdown en estilo de projects/experience de cada plantilla.
  - Correcciones de compilación relacionadas: añadido `customSections: []` en `cv-example.ts` y acceso por clave `BUILT_IN_SECTION_LABELS["personal"]` en `section-helpers.ts`.
  - Verificado: `pnpm build` y `pnpm test` (70 tests) verdes. UI del tab de secciones pendiente para siguiente sesión.

- **2026-07-17** — **Fase 6 de PLAN.md: pulido de formularios y datos.**
  - Relajados requireds en `personal-info-form.ts`: solo `fullName` es obligatorio; `email` valida solo si no está vacío; Phone/Location ya no marcan `*` ni error required.
  - Añadido `resizeImageToDataUrl()` en `personal-info-form.ts` para redimensionar avatares a 400 px de lado y exportar JPEG 0.85 antes de guardar en IndexedDB/PDF.
  - Creadas `@utility input-field` e `input-field-resize-none` en `src/styles.css`; reemplazadas las clases duplicadas en los 7 formularios.
  - Añadido selector de fuente en `template-selector.ts` con 4 stacks seguros para print; cableado `fontFamily` a las 5 plantillas vía `resume-preview.ts` y `editor.page.ts`.
  - Verificado: `pnpm build`, `pnpm lint`, `pnpm test` (58 tests) y `pnpm e2e` (12 tests) verdes.
  - Actualizados `docs/plan/PLAN.md`, `docs/STATE.md` y `docs/specs/003-fase6-form-polish.md` a Done.

- **2026-07-17** — **Fase 5 de PLAN.md: onboarding y guía de completitud.**
  - Añadida factory `createExampleCv()` en `src/app/domain/models/cv-example.ts` con datos realistas y completos; tests en `cv-example.spec.ts`.
  - Añadida función pura `scoreCompleteness()` en `src/app/domain/models/cv-completeness.ts` con heurística 0–100 y sugerencias accionables; tests en `cv-completeness.spec.ts`.
  - Añadido `CvStore.createExample()` para persistir y activar el CV de ejemplo.
  - Añadidos botones "Start with an Example" en `empty-state.ts` y `dashboard-header.ts`; cableado en `dashboard.page.ts` para crear el ejemplo y abrir el editor.
  - Creado componente `CompletenessScore` con anillo de score colorido, popover de sugerencias y navegación a tabs; integrado en `editor-toolbar.ts` y cableado en `editor.page.ts`.
  - Añadidos 2 tests e2e en `e2e/smoke.spec.ts` para el flujo de ejemplo y el score de CV vacío.
  - Verificado: `pnpm build`, `pnpm lint`, `pnpm test` (58 tests) y `pnpm e2e` (12 tests) verdes.
  - Actualizados `docs/plan/PLAN.md`, `docs/STATE.md` y `docs/specs/002-fase5-onboarding-completeness.md` a Done.

- **2026-07-16 (noche)** — **Fix del PDF de texto (print) que salía en 4 páginas.**
  - Síntoma: el "Download PDF" / "Print PDF (text)" convertía un CV de 2 páginas en 4 — las páginas 1 y 2 eran casi enteramente la cabecera de color estirada, y el contenido real empezaba en la página 3. El PDF de imagen (`html-to-image`) no se veía afectado porque captura el DOM natural.
  - Causa: `printFlexStretch()` en `src/app/infrastructure/export/print-stylesheet.ts` aplicaba `min-height: 297mm` a `.resume-content > div > .flex`, que casaba con las filas flex internas de la cabecera de las plantillas **Modern** y **Executive**, estirando cada una a una página A4 completa.
  - Fix: se eliminó el selector `.resume-content > div > .flex`, dejando solo `.resume-content > .flex` (que sirve la barra lateral de dos columnas de la plantilla **Creative**, cuyo estirado a página completa es intencional). Verificado con `page.pdf()` real: Modern y Executive vuelven a 2 páginas con cabecera compacta; Creative mantiene la barra lateral a altura completa.
  - Añadido test de regresión `src/app/infrastructure/export/print-stylesheet.spec.ts` (asegura que la hoja de estilos no vuelva a incluir `.resume-content > div > .flex`).
  - Verificado: `pnpm build`, `pnpm lint` y `pnpm test` verdes (46 unit tests).

- **2026-07-16 (tarde)** — **Fase 4 de PLAN.md.**
  - Toolbar del editor: acción primaria renombrada a "Download PDF" con tooltip explicativo; dropdown con "Print PDF (text)" y "High-fidelity PDF (image snapshot)" + subtextos claros sobre seleccionabilidad y ATS.
  - `PrintExport` ahora recibe el `Cv` y setea/restaura `document.title` con el nombre del CV para que el "Guardar como PDF" del navegador use un nombre descriptivo.
  - `PdfExport` hace lazy-load de `html-to-image` y `jspdf` dentro de `exportToPdf()`; el chunk `editor.page` bajó de ~505 KB a ~135 KB (client) y `jspdf` vive ahora en su propio chunk.
  - Añadido helper `avoidPageBreaks()` en `PdfExport` que mide `section` y `section > div` antes de capturar y empuja los bloques que cruzan un límite A4 a la siguiente página vía padding-bottom (restaurado después). Añadido `break-inside: avoid-page` para items en `print-stylesheet.ts`.
  - Actualizados tests e2e de Fase 2 para usar `data-testid` en los botones de export (los labels cambiaron y hay undo/redo antes del dropdown).
  - Verificado: `pnpm build`, `pnpm lint`, `pnpm test` y `pnpm e2e` verdes (10 e2e tests).
  - Actualizados `docs/plan/PLAN.md` y `docs/STATE.md`.

- **2026-07-16** — **Fase 3 de PLAN.md + fix de build del dashboard.**
  - Corregido el error de build en `src/app/pages/dashboard.page.ts`: la expresión inline del mensaje del diálogo (`deleteCandidate()!.name`) rompía el parser de Angular. Se movió a un `computed` (`deleteMessage`) y se reemplazó el output `cancel` por `cancelled` para cumplir `@angular-eslint/no-output-native`.
  - Completada Fase 3: añadidos outputs `removed` a los 4 formularios de lista que faltaban (`skills-form.ts`, `projects-form.ts`, `certifications-form.ts`, `languages-form.ts`), y cableados en `editor.html` al toast de deshacer (`onListItemRemoved`).
  - Añadido `data-testid="export-dropdown-toggle"` al botón de dropdown de export de `editor-toolbar.ts` y actualizado `e2e/qa-fase2.spec.ts` para que el selector no dependa del índice de botón (ahora hay undo/redo antes del dropdown).
  - Verificado: `pnpm build`, `pnpm lint`, `pnpm test` y `pnpm e2e` verdes (10 e2e tests).
  - Actualizados `docs/plan/PLAN.md` y `docs/STATE.md`.

- **2026-07-15** — **Fases 0, 1 y 2 de PLAN.md.**
  - Fase 0: QA manual con Playwright del flujo completo (landing, dashboard, editor 8 tabs, preview, exports, persistencia, viewport 375px). Corregidos los selectores de `e2e/smoke.spec.ts` para `volt-input` (usar placeholders/inputs nativos). Extendido smoke con flujo real: crear CV → rellenar personal + experiencia → verificar preview → dashboard → verificar card. Eliminados imports no usados en `editor-toolbar.ts` que generaban warnings.
  - Fase 1: añadida capa `src/app/infrastructure/portability/` con `CvPortability` (export/import de CV y backup completo). Extraída función pura `migrateCv` a `src/app/domain/models/cv-migration.ts` y reutilizada en `CvStore.loadAll()` e importación. Añadidos botones de export JSON en cards del dashboard y dropdown del editor; botones de backup/import en header del dashboard. Añadido banner descartable en dashboard con aviso de datos locales. Añadido `navigator.storage.persist()` al crear el primer CV. Envueltas operaciones IndexedDB en `CvStore` con try/catch + toast. Añadidos 14 tests nuevos (migration + portability). `pnpm build`, `pnpm lint`, `pnpm test` y `pnpm e2e` verdes.
  - Fase 2: implementado overlay de preview a pantalla completa para viewports <lg con escalado A4, preview off-screen `[data-export-preview]` para que image PDF y print PDF funcione en móvil, y botón flotante de preview accesible en todos los tamaños. Centralizado el selector de contenido de export en `data-export-preview .resume-content` para evitar IDs duplicados. Añadidos `aria-label` al botón primario Print PDF y `data-testid` a los contenedores de preview para tests. Añadido `e2e/qa-fase2.spec.ts` con 4 tests (mobile overlay, image PDF, print PDF, desktop panel). Actualizado `e2e/smoke.spec.ts` para referirse al panel de preview visible. `pnpm build`, `pnpm lint`, `pnpm test` y `pnpm e2e` verdes.

- **2026-07-10** — **VoltUI editor form migration + OnPush import fix.** Normalized malformed `@angular/core` imports that caused Angular LS to report `ChangeDetectionStrategy.OnPush` as an unknown/static-analysis failure, then applied the canonical `ChangeDetectionStrategy`-first import shape across all affected components/pages. Added a focused spec (`docs/specs/001-voltui-editor-forms.md`) and migrated editor form chrome to `@voltui/components`: `VoltButton`, `VoltInput`, `VoltTextarea`, and `VoltNativeSelect` across Personal, Experience, Education, Skills, Projects, Certifications, Languages, plus `VoltInput` for the color hex field. Kept file upload, checkbox, color swatch, and native labels where safer. Verified `pnpm build`, `pnpm lint`, and `pnpm test` green.

- **2026-07-10** — **Angular 21 upgrade (Phase A of the voltui UI migration).** Bumped `@angular/*` 19.2→21.2.18, added `@angular/cdk` 21.2.14, `@analogjs/*` beta.5→2.6.3 stable, TS ~5.9.3, `angular-eslint` 21.4.0. Renamed the zoneless provider to the stable `provideZonelessChangeDetection`. Removed the `@analogjs/vite-plugin-angular` pnpm patch + `pnpm-workspace.yaml` (patch targeted the beta; stable 2.6.3 already carries the fixes — dev boots clean, no decorator warnings). `pnpm build`/`lint`/`test`/`dev` all green. Reason for the upgrade: all four target libs (`@voltui/components`, `angular-movement`, `lumen-icons`, `quartz-headless`) require Angular ^21. **Stopped here for user review before starting Phase B** (installing the libs + migrating chrome to `volt-*` components, `lmn-*` icons, and `angular-movement` motion; resume templates untouched).
