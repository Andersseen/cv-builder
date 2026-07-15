# CONTEXT — Todo lo que necesitas saber para trabajar en este repo

> **Cómo usar este archivo**: léelo entero antes de tocar código. Junto con
> [PLAN.md](PLAN.md) (mismo directorio) es autosuficiente: no necesitas re-analizar el repo.
> Snapshot del análisis: **2026-07-15**. Si algo aquí contradice el código real, gana el código
> (y actualiza este archivo al final de la sesión).

## 1. Qué es el producto

**Modern CV Builder**: app 100% client-side para crear currículums con preview en vivo y
export a PDF. Sin backend, sin cuentas, sin analytics — todo se guarda en IndexedDB del
navegador. Desplegada en Vercel como build estático.

**Principios de producto** (úsalos para resolver dudas de diseño):

1. **El CV es el producto** — fidelidad de preview y calidad del PDF por encima de cualquier detalle de UI.
2. **Los datos nunca salen del navegador** — nada de servidores, APIs de terceros ni analytics.
3. **Rápido y simple gana a feature-rich.**
4. **Las plantillas deben ser genuinamente distintas** (layouts diferentes, no recolores).

**Non-goals** (NO construir sin decisión explícita del usuario): backend/auth/cloud sync,
IA in-app, cover letters, job tracking, apps nativas.

## 2. Stack y comandos

- **Angular 21.2** — standalone components, signals, zoneless (`provideZonelessChangeDetection`), sin zone.js.
- **AnalogJS 2.6.3 + Vite 6** — file-based routing (`src/app/pages/*.page.ts`), build estático (`static: true`, prerender).
- **Tailwind CSS v4** — config CSS-first en `src/styles.css` (bloque `@theme`), tokens semánticos HSL, dark mode con clase `.dark` en `<html>`.
- **Dexie 4** — única persistencia (IndexedDB, tabla `cvs`).
- **html-to-image + jspdf** — export PDF por imagen; diálogo nativo de impresión para export por texto.
- **UI libs propias del usuario**: `@voltui/components` (volt-button, volt-input, volt-textarea, volt-native-select), `lumen-icons` (`lumen-icons/<nombre>`), `angular-movement`, `quartz-headless`. Todas requieren Angular ^21.
- **TypeScript 5.9 strict** (todos los flags), `moduleResolution: "bundler"` (no cambiar — "node" rompe el build).

```bash
pnpm install     # pnpm SIEMPRE, nunca npm
pnpm start       # dev server → http://localhost:5173
pnpm build       # build producción (client + SSR entry + prerender)
pnpm lint        # ESLint + angular-eslint
pnpm test        # Vitest (unit)
pnpm e2e         # Playwright (hoy solo un smoke test)
```

**Verificación mínima de cada sesión**: `pnpm build` + `pnpm lint` + `pnpm test` verdes.
Para cambios de UI, además QA manual en el navegador (5173).

## 3. Reglas de oro (obligatorias)

1. **Solo standalone components** — nunca NgModules.
2. **`ChangeDetectionStrategy.OnPush` en todo componente**, sin excepciones.
3. **Signals-first**: `signal()`/`computed()`/`effect()`; `input()`/`output()` (nunca decoradores `@Input`/`@Output`). Inputs/outputs `readonly`.
4. **`inject()`**, no inyección por constructor.
5. **Rutas file-based**: cada `src/app/pages/*.page.ts` es una ruta y su **default export** es la página. No hay archivo de configuración de rutas.
6. **Control flow nuevo**: `@if`/`@for`/`@switch` — nunca `*ngIf`/`*ngFor`.
7. **Nombres sin sufijo**: `editor.ts`, `cv-card.ts`, clase `Editor`, `Autosave` (no `.component.ts`/`.service.ts`).
8. **Capas con dependencias solo hacia abajo**: `features/` → `application/` → `infrastructure/` → `domain/`. `domain/` es TypeScript puro (sin Angular, sin RxJS, sin side effects). `core/` + `shared/` son transversales.
9. **Todo cambio de estado de CV pasa por `CvStore`** — los componentes jamás tocan el repositorio o Dexie. La persistencia la hace `Autosave`; no llamar `persist()` desde componentes.
10. **UI de la app con tokens semánticos** (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`…). **Excepción cerrada y definitiva**: las plantillas de CV (`features/editor/components/resume-templates/`) usan utilidades directas (`bg-white`, `text-gray-900`) porque el CV debe renderizar idéntico en light/dark y en el PDF. No revertir.
11. **Ninguna dependencia nueva sin aprobación explícita del usuario.** Si una fase la necesita, parar y preguntar antes.
12. **Prettier con comillas dobles** (config commiteada).
13. **No generar contenido placeholder/demo** salvo que se pida.

## 4. Arquitectura y flujo de datos

```
features/ (UI)          application/ (estado)      infrastructure/          domain/
────────────────        ──────────────────────     ─────────────────        ──────────
form component ──emit──▶ editor.page.ts             LocalCvRepository        cv-model.ts
  (output)                │ updateX(patch)          (Dexie, tabla cvs)       (interfaces puras)
                          ▼
                        CvStore.updateActiveCv(patch)   ← deepMerge inmutable
                          │ (solo memoria, NO persiste)
                          ▼
                        effect en editor.page.ts (autosaveEffect)
                          │
                          ▼
                        Autosave.scheduleAutosave(cv)  → debounce 800 ms →
                        CvStore.persist(cv) → repo.save(cv) → IndexedDB
```

Detalles clave:

- Los formularios reciben datos por `input()` y emiten el objeto/array completo por `output()`;
  la página editor traduce a `cvStore.updateActiveCv({ sections: { ... } })`.
- `Autosave.scheduleAutosave` compara `JSON.stringify(cv)` contra el último snapshot para
  saltarse no-cambios; expone signals `saving` y `lastSavedAt` (los muestra la toolbar).
- `CvStore.loadAll()` hace **backfill de campos añadidos después del esquema inicial**
  (`projects`/`certifications`/`languages` → `[]`, `backgroundColor`/`primaryColor` → defaults).
  Cualquier campo nuevo del modelo necesita su backfill aquí.
- Guard del editor: `/editor?cv=<id>` inválido/ausente → toast + redirect a `/dashboard`.
- Export: ambos paths capturan el nodo DOM `#resume-content` (vive dentro de
  `app-resume-preview`). `PdfExport` fija el ancho a A4 px, captura PNG a 3× con
  html-to-image y lo rebana en páginas A4 con jspdf. `PrintExport` abre el diálogo nativo
  con una hoja de estilos de impresión (`print-stylesheet.ts`).
- Tema dark/light: `core/services/theme.ts`, persiste en localStorage, fallback a
  preferencia del sistema. Toasts: `core/services/toast.ts` (`toast.show(msg, "success" | "error")`).

## 5. Mapa de archivos

| Qué | Dónde |
|---|---|
| Páginas (rutas lazy) | `src/app/pages/(home).page.ts`, `dashboard.page.ts`, `editor.page.ts` + `editor.html` |
| Modelos de dominio | `src/app/domain/models/cv-model.ts` |
| Factory/defaults de CV | `src/app/domain/models/cv-defaults.ts` (`createDefaultCv()`) |
| Catálogo de plantillas | `src/app/domain/models/template-registry.ts` |
| Store central (signals) | `src/app/application/state/cv.ts` (`CvStore`) + `deep-merge.ts` |
| Autosave (debounce 800 ms) | `src/app/application/services/autosave.ts` |
| Persistencia | `src/app/infrastructure/persistence/cv-database.ts` (Dexie) + `cv-repository.ts` (`getAll/save/delete`) |
| Export PDF imagen | `src/app/infrastructure/export/pdf-export.ts` + `a4.ts` (constantes A4 mm/px) |
| Export print/texto | `src/app/infrastructure/export/print-export.ts` + `print-stylesheet.ts` |
| Toolbar del editor (export, saved) | `src/app/features/editor/components/editor-toolbar.ts` |
| Tabs del editor (8 tabs) | `src/app/features/editor/components/editor-tabs.ts` |
| Formularios de sección | `src/app/features/editor/components/{personal-info,experience,education,skills,projects,certifications,languages}-form.ts` |
| Selector de plantilla + colores | `src/app/features/editor/components/template-selector.ts` + `color-picker.ts` |
| Preview (switch de plantillas) | `src/app/features/editor/components/resume-preview.ts` |
| Las 5 plantillas de CV | `src/app/features/editor/components/resume-templates/{modern,classic,minimal,creative,executive}-template.ts` |
| Dashboard (cards, empty state) | `src/app/features/dashboard/components/` |
| Landing | `src/app/features/landing/components/` |
| Header/footer/toast compartidos | `src/app/shared/components/` |
| Markdown ligero (bold/italic/bullets) | `src/app/shared/utils/markdown.ts` (render con `[innerHTML]`) |
| Reorden ↑/↓ de listas | `src/app/core/utils/array.ts` |
| Tokens de diseño (`@theme`) | `src/styles.css` |
| Tests unit existentes | `*.spec.ts` junto a deep-merge, cv-defaults, a4, array, markdown (22 tests) |
| E2E | `e2e/smoke.spec.ts` + `playwright.config.ts` (solo smoke) |

## 6. API exacta (no adivinar firmas)

```ts
// CvStore (application/state/cv.ts) — @Injectable providedIn: "root"
readonly cvs: Signal<Cv[]>; readonly activeCvId: Signal<string | null>;
readonly loading: Signal<boolean>; readonly activeCv: Signal<Cv | null>;
loadAll(): Promise<void>                       // carga + backfill; llamar en ngOnInit de páginas
create(name?: string): Promise<Cv>             // crea, persiste, activa, toast
duplicate(id: string): Promise<Cv | null>
setActive(id: string): void
rename(id: string, name: string): Promise<void>
updateActiveCv(patch: DeepPartial<Cv>): void   // deepMerge + updatedAt; NO persiste
persist(cv: Cv): Promise<void>                 // solo lo llama Autosave
deleteById(id: string): Promise<void>

// Autosave (application/services/autosave.ts)
readonly saving: Signal<boolean>; readonly lastSavedAt: Signal<Date | null>;
scheduleAutosave(cv: Cv): void; destroy(): void;

// LocalCvRepository (infrastructure/persistence/cv-repository.ts)
getAll(): Promise<Cv[]>; save(cv: Cv): Promise<void>; delete(id: string): Promise<void>;
```

**Modelo `Cv`** (domain/models/cv-model.ts): `{ id, name, createdAt, updatedAt, templateId,
sections, settings }`. `sections`: `personal` (fullName, email, phone, location, website,
linkedin, summary, avatarUrl), `experience[]`, `education[]`, `skills[]` (level:
Beginner…Expert), `projects[]`, `certifications[]`, `languages[]` (proficiency:
Basic…Native). `settings`: `{ accentColor, backgroundColor, primaryColor, fontFamily }`
(⚠️ `fontFamily` existe en el modelo pero NO está cableado a ninguna UI).
Todos los ítems de lista tienen `id` (crypto.randomUUID). Fechas como strings ISO.

## 7. Gotchas y decisiones cerradas

- `src/main.server.ts` + `src/app/app.config.server.ts` **deben existir** aunque `ssr: false`
  — el build estático de Analog los requiere. No borrarlos.
- `moduleResolution: "bundler"` en tsconfig — no cambiar.
- Las plantillas de CV usan Tailwind directo (no tokens) **a propósito y de forma definitiva**.
- El export depende de que `#resume-content` exista en el DOM: la preview está en un
  `@if (previewOpen())` y además `hidden lg:block` (oculta por CSS en <lg). En móvil el
  botón de toggle también está oculto (`hidden lg:flex` en `pages/editor.html`).
- Borrado de CV usa `confirm()` nativo (`dashboard.page.ts`).
- El avatar se guarda como data URL **sin redimensionar** (`personal-info-form.ts`).
- `jspdf` y `html-to-image` se importan estáticamente en `pdf-export.ts` (van al chunk del editor).
- UI de la app en inglés; docs del repo en español/inglés mixto.
- Existe otro sistema de docs en el repo (`AGENTS.md`, `docs/STATE.md`, `docs/ROADMAP.md`):
  **al terminar una sesión actualiza `docs/STATE.md`** (qué hiciste, qué queda, issues nuevos)
  y marca los checkboxes correspondientes en `docs/plan/PLAN.md`.

## 8. Hallazgos del análisis (2026-07-15) — base del PLAN

Priorizados por daño al usuario no técnico. Cada uno mapea a una fase de [PLAN.md](PLAN.md):

1. **Pérdida de datos silenciosa** — todo en IndexedDB, sin export/import JSON, sin
   `navigator.storage.persist()`, sin aviso al usuario. → Fase 1.
2. **En móvil no hay preview** (y el export probablemente falle o salga vacío porque
   `#resume-content` está `display:none`). → Fase 2 (verificar export móvil en Fase 0).
3. **Sin undo/redo** — el autosave persiste un borrado accidental en 800 ms, irrecuperable. → Fase 3.
4. **Los dos exports no explican su trade-off** (imagen pixel-perfect NO apta para ATS vs
   print/texto apta para ATS); el PDF imagen rebana ciegamente en límites A4 y puede cortar
   una línea de texto entre páginas (`pdf-export.ts` § `addImagePages`). → Fase 4.
5. **Formulario en blanco intimida** — sin CV de ejemplo ni indicador de completitud. → Fase 5.
6. Pulido: phone/location required (no deberían), avatar sin downscale, `fontFamily` muerto,
   `confirm()` nativo, ~40 clases repetidas en cada `volt-input`. → Fases 3 y 6.
7. Diferidos de roadmap que importan a usuarios reales: secciones personalizadas,
   ocultar/reordenar secciones. → Fase 7.
8. Sin PWA (el pitch "no network needed" no es verdad estricta sin service worker). → Fase 8.
9. UI solo en inglés. → Fase 9.
10. **QA manual pendiente**: el upgrade Angular 21 + migración de formularios a VoltUI se
    verificó solo con build/lint/test, nunca en navegador. → Fase 0 (bloqueante).
