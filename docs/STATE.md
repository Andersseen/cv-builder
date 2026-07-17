# STATE — Current status of the project

> **How to use this file**: read it at the start of every session to know where work stands. **Update it at the end of every session**: move finished items to the log, add new known issues, keep "Next steps" honest. Keep it short — this is a status board, not a changelog archive.

**Last updated**: 2026-07-17 · **Active branch**: `feature/plan`. Fases 0, 1, 2, 3, 4 y 5 de [docs/plan/PLAN.md](plan/PLAN.md) completadas.

## In progress

Nada en curso. Última sesión: Fase 5 (onboarding y guía de completitud) cerrada.

## What's working (stable)

- Full flow: landing → dashboard (CRUD of CVs + JSON export/import per CV + backup/restore) → editor (8 tabs) → live preview → PDF/print export.
- 5 templates (Modern, Classic, Minimal, Creative, Executive) with per-CV accent/background/primary color settings.
- Autosave to IndexedDB (Dexie) with debounce + saved indicator; data survives reloads.
- Dark/light theme with localStorage persistence and system-preference fallback.
- Multi-page image PDF export and text-based print export.
- **Fase 0**: QA manual del flujo completo en desktop; e2e extendido con flujo real.
- **Fase 1**: Export/import JSON por CV + backup completo + validación estructural + `navigator.storage.persist()` + banner de datos locales.
- **Fase 2**: Editor usable en viewports <lg con overlay de preview y render off-screen para export.
- **Fase 3**: Undo/redo en memoria, atajos de teclado, botones en toolbar, y modal de confirmación para borrar CV.
- **Fase 4**: Etiquetas claras de export, filename en print, lazy-load de libs PDF, y mitigación de cortes de página.
- **Fase 5**:
  - `createExampleCv()` en `src/app/domain/models/cv-example.ts` con CV realista y completo (personal, summary, 2 experiencias con bullets markdown, educación, 6 skills, 2 proyectos, 2 certificaciones, 3 idiomas).
  - Botones "Start with an Example" en empty state y header del dashboard; `CvStore.createExample()` persiste y activa el CV.
  - `scoreCompleteness()` en `src/app/domain/models/cv-completeness.ts` (pura, con tests): score 0–100 + sugerencias `{ severity, message, tabId }`.
  - Componente `CompletenessScore` en `src/app/features/editor/components/completeness-score.ts`: anillo de score en la toolbar, popover con sugerencias, navegación directa al tab correspondiente. Actualización en vivo vía `computed` sobre `activeCv`.
  - E2E añadidos en `e2e/smoke.spec.ts` para verificar ejemplo de alto score y CV vacío con sugerencias.
- **Tooling**: ESLint + angular-eslint + Prettier + Vitest + Playwright. 58 unit tests green, 12 e2e tests green.

## Known issues

1. **Vite dev warnings** (non-blocking): `[@analogjs/vite-plugin-angular]` warns that pre-bundled `node_modules/.vite/deps/*.js` and `@analogjs/router/fesm2022/*.mjs` contain Angular decorators but are not in the TypeScript program. Dev-only warning from the stable 2.6.3 plugin.

## Next steps (in rough priority order)

1. **Fase 6** — Pulido de formularios y datos (relajar requireds, downscale avatar, deduplicar clases de inputs, cablear `fontFamily`).
2. Consider running `pnpm format` once repo-wide in an isolated commit to normalize formatting.
3. Phase 6+ a11y: enable eslint template accessibility rules and fix findings.

## Session log (newest first, keep last ~10)

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
