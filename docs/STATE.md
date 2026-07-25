# STATE — Current status of the project

> **How to use this file**: read it at the start of every session to know where work stands. **Update it at the end of every session**: move finished items to the log, add new known issues, keep "Next steps" honest. Keep it short — this is a status board, not a changelog archive.

**Last updated**: 2026-07-25 · **Active branch**: `main`. Fases 0–7 de [docs/plan/PLAN.md](plan/PLAN.md) completadas. Deployment migrado a Cloudflare Pages y presentación pública del repo renovada.

## In progress

_Nothing currently in progress. Ready for next phase planning._

## What's working (stable)

- Full flow: landing → dashboard (CRUD of CVs + JSON export/import per CV + backup/restore) → editor (9 tabs) → live preview → PDF/print export.
- 5 templates (Modern, Classic, Minimal, Creative, Executive) with per-CV accent/background/primary color/font settings. **Templates now support ordered, visible, and custom sections via `getOrderedSections()` and render custom sections dynamically.**
- Autosave to IndexedDB (Dexie) with debounce + saved indicator; data survives reloads.
- Dark/light theme with localStorage persistence and system-preference fallback.
- Multi-page image PDF export and text-based print export.
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
- **Tooling**: ESLint + angular-eslint + Prettier + Vitest + Playwright. 70 unit tests green, 12 e2e tests green.
- **Deployment**: Cloudflare Pages es el único target. Proyecto `cv-builder`, config en `wrangler.jsonc`, SPA fallback en `public/_redirects`, cache/seguridad en `public/_headers`. `pnpm deploy` despliega a producción; `.github/workflows/deploy.yml` lo hace en cada push a `main`.

## Known issues

1. **Vite dev warnings** (non-blocking): `[@analogjs/vite-plugin-angular]` warns that pre-bundled `node_modules/.vite/deps/*.js` and `@analogjs/router/fesm2022/*.mjs` contain Angular decorators but are not in the TypeScript program. Dev-only warning from the stable 2.6.3 plugin.
2. **`cv-builder.andersseen.dev` no resuelve todavía** (bloqueado, requiere acción manual): el dominio está añadido al proyecto de Pages pero la zona `andersseen.dev` tiene un registro wildcard `*`, así que el subdominio resuelve al proxy de Cloudflare sin llegar al proyecto y devuelve 404. Falta crear un CNAME específico `cv-builder` → `cv-builder-8on.pages.dev` (proxied) en el dashboard de DNS. El token OAuth de wrangler no tiene scope de DNS. Mientras tanto la URL viva es <https://cv-builder-8on.pages.dev>.
3. **Secrets de CI pendientes**: `deploy.yml` fallará hasta que se añadan `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` a los secrets del repo.

## Next steps (in rough priority order)

0. **Desbloquear el dominio y el CI** (ver Known issues 2 y 3): crear el CNAME `cv-builder` en la zona `andersseen.dev` y añadir los dos secrets de Cloudflare al repo.
1. **Fase 8** — PWA y offline real (requiere aprobación del usuario para nueva dependencia `vite-plugin-pwa` o service worker a mano).
2. Consider running `pnpm format` once repo-wide in an isolated commit to normalize formatting.
3. Phase 8+ a11y: enable eslint template accessibility rules and fix findings.

## Session log (newest first, keep last ~10)

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
  - Verificado: `pnpm build`, `pnpm test` (70) y `pnpm e2e` (12) verdes.

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
