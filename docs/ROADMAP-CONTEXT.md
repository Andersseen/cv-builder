# ROADMAP-CONTEXT — Snapshot del análisis (para arrancar una fase sin re-analizar)

> Este archivo es un resumen condensado del repo, hecho para que una sesión nueva pueda
> abordar una fase de [ROADMAP.md](ROADMAP.md) sin tener que releer todo el código. Es un
> complemento, no un reemplazo, de la doc canónica: [CONTEXT.md](CONTEXT.md) (qué/por qué),
> [ARCHITECTURE.md](ARCHITECTURE.md) (capas/flujo), [CONVENTIONS.md](CONVENTIONS.md) (estilo),
> [STATE.md](STATE.md) (estado vivo). Si algo aquí contradice a `STATE.md`, gana `STATE.md`.

## Qué es

CV builder 100% client-side. Angular 19 (standalone, signals, zoneless) + AnalogJS 2.x + Vite 6
+ Tailwind v4 (CSS-first) + Dexie/IndexedDB. Sin backend, sin auth, sin red tras la primera
carga. Export a PDF por dos vías (image PDF y print/PDF nativo).

Comandos: `pnpm install`, `pnpm start` (dev en `http://localhost:5173`), `pnpm build`.
No hay tests ni linter configurados aún — la verificación hoy es `pnpm build` (TS strict +
strictTemplates atrapan casi todo).

## Arquitectura en una frase

Capas con dependencias sólo hacia abajo: `features/` → `application/` → `infrastructure/` →
`domain/` (+ `core/`/`shared/` transversales). `domain/` es TS puro (sin Angular/RxJS). Todo
el estado del CV pasa por `CvStore` (`application/state/cv.ts`); persistencia vía `Autosave`
(debounce 800 ms) → `LocalCvRepository` → Dexie. Los componentes nunca tocan Dexie ni llaman
`persist()`.

Loop de datos: form emite `output()` → `Editor` llama `cvStore.updateActiveCv(patch)` →
deep-merge en el signal `activeCv` → preview re-renderiza + `effect()` dispara autosave.
Los patches son `DeepPartial<Cv>`; arrays se reemplazan enteros, objetos se mergean.

## Modelo de datos (estado actual)

`Cv { id, name, createdAt, updatedAt, templateId, sections, settings }`
- `sections`: `personal` (fullName, email, phone, location, website, linkedin, summary,
  avatarUrl), `experience[]`, `education[]`, `skills[]`. **Sólo 4 secciones** — no hay
  projects/certifications/languages/custom (oportunidad Fase 1).
- `settings`: `accentColor`, `backgroundColor`, `primaryColor`, `fontFamily`. `fontFamily`
  existe en el modelo pero **puede no estar cableado a la UI** (verificar en Fase 3).
- 5 plantillas: Modern, Classic, Minimal, Creative, Executive.

Archivos clave del modelo: `domain/models/cv-model.ts`, `cv-defaults.ts`,
`template-registry.ts`. Al añadir un campo hay que tocar 5 sitios (ver receta en
`CONVENTIONS.md` → "Add a field to the CV model"), incluido el backfill en `CvStore.loadAll()`.

## Mapa rápido de archivos (los que más se tocan)

| Concern | Archivo |
|---|---|
| Rutas (landing `/`, `/dashboard`, `/editor`) | `src/app/pages/(home).page.ts`, `dashboard.page.ts`, `editor.page.ts` |
| Modelos de dominio | `src/app/domain/models/cv-model.ts` |
| CV por defecto | `src/app/domain/models/cv-defaults.ts` |
| Catálogo de plantillas | `src/app/domain/models/template-registry.ts` |
| Estado central (store) | `src/app/application/state/cv.ts` |
| Autosave | `src/app/application/services/autosave.ts` |
| Persistencia (Dexie) | `src/app/infrastructure/persistence/` |
| Export PDF (imagen) + print (texto) | `src/app/infrastructure/export/` |
| Plantillas de CV | `src/app/features/editor/components/resume-templates/*-template.ts` |
| Dispatch de plantilla | `src/app/features/editor/components/resume-preview.ts` (`@switch`) |
| Forms del editor | `src/app/features/editor/components/*-form.ts` |
| Tokens de diseño | `src/styles.css` (`@theme` + HSL vars) |
| Theme (dark/light) | `src/app/core/services/theme.ts` |
| Toasts | `src/app/core/services/toast.ts` + `shared/components/toast/` |

## Reglas no negociables (resumen de AGENTS.md)

Standalone only · `OnPush` en cada componente · signals-first (`input()`/`output()`, nunca
decoradores) · `inject()` (no constructor DI) · páginas de ruta con `export default` y nombre
`*.page.ts` · control de flujo nuevo (`@if`/`@for`/`@switch`) · nombres de archivo/clase SIN
sufijos (`editor.ts`, clase `Editor`) · UI de la app sólo con tokens semánticos
(`bg-background`, `text-muted-foreground`…), **excepto** las plantillas de CV que usan
utilidades directas (`bg-white`) a propósito (deben verse igual en light/dark y en PDF) ·
**sin nuevas dependencias sin aprobación explícita del usuario** · double quotes.

## Estado y deuda técnica conocida (ver STATE.md para el detalle)

- ✅ Migración a AnalogJS + Vite + zoneless: completa y commiteada en `main`.
- ✅ `pnpm build` verde; CI corre build en cada push/PR.
- ⚠️ **Clases Tailwind rotas** en ~15 archivos (`text-muted-foreground-foreground`,
  `bg-card-alt`, `bg-card-hover`, `text-danger`) — renderizan sin estilo. Fase 0.
- ⚠️ Bloque `@utilities` muerto en `styles.css`: las animaciones `animate-*` no funcionan en
  prod. Fase 0.
- ⚠️ Sin tests ni linter. Fase 0.
- ⚠️ Guard de `/editor` blando (redirige en silencio). Fase 0.
- ⚠️ README menciona `pdf-lib` (no existe). Fase 0.
- Parche local de `@analogjs/vite-plugin-angular` en `patches/` es **funcional, no borrar**.
  `src/main.server.ts` + `app.config.server.ts` **deben quedarse** aunque `ssr: false`.

## Cosas a verificar al empezar (pueden haber cambiado)

1. ¿Está `fontFamily` cableado a la UI? (afecta Fase 3).
2. ¿Se cerraron ya las known issues de Fase 0? Releer `STATE.md` → known issues.
3. ¿Sigue habiendo 5 plantillas? Contar en `template-registry.ts`.
4. Estándar JSON Resume (Fase 2): https://jsonresume.org/schema

## Product principles (para resolver dudas de diseño)

1. El CV es el producto (fidelidad de preview/PDF > todo lo demás).
2. Los datos nunca salen del navegador (nada de server/analytics/APIs de terceros sin decisión
   explícita del usuario).
3. Rápido y simple > lleno de features.
4. Las plantillas deben ser genuinamente distintas (layouts, no recolores).

## Non-goals (NO construir sin pedirlo explícitamente)

Backend/cuentas/auth/cloud sync/share links · IA generativa de contenido in-app · gestión
multi-idioma del contenido del CV · cover letters/job tracking · apps nativas móviles.
