# ROADMAP — Plan de mejoras por fases

> **Cómo usar este archivo**: es el plan de evolución del producto, dividido en fases
> auto-contenidas. Cada fase puede abordarse en una sesión nueva de forma independiente.
> Antes de empezar una fase, lee [ROADMAP-CONTEXT.md](ROADMAP-CONTEXT.md) (snapshot del
> análisis) + [STATE.md](STATE.md) (estado actual). Al terminar, marca los ítems hechos aquí
> y actualiza `STATE.md`.
>
> **Regla de oro del roadmap**: todo respeta los *product principles* y *non-goals* de
> [CONTEXT.md](CONTEXT.md) — 100% client-side, privacy-first, sin backend/cuentas/IA in-app.
> El CV es el producto: fidelidad de preview y calidad de PDF por encima de todo.

Leyenda de esfuerzo: 🟢 pequeño · 🟡 medio · 🔴 grande. Prioridad: ⭐ = alto impacto.

---

## Fase 0 — Fundaciones y limpieza ✅ COMPLETADA (2026-07-10)

Objetivo: dejar el código limpio, tipado, con tooling y una red de seguridad mínima. Todo
esto ya está catalogado en `STATE.md` → known issues; esta fase lo cierra.

- [x] 🟢 Arreglar clases Tailwind rotas (known issue #1): `text-muted-foreground-foreground`
      → `text-muted-foreground`, `bg-card-alt`/`hover:bg-card-hover` → `bg-muted`/`hover:bg-accent`,
      `text-danger` → `text-destructive`. Find/replace mecánico en ~15 archivos, verificar en
      light + dark.
- [x] 🟢 Arreglar el bloque `@utilities` muerto en `src/styles.css` (known issue #3): reemplazar
      por `@utility ...` por clase, o clases CSS planas. Corregir `--radius: var(--radius)`
      auto-referencial. Verificar que `animate-fade-in/slide-up/float` funcionen en prod.
- [x] 🟢 Retirar/decidir sobre aliases legacy `surface-*` en `@theme` (STATE next-step #2).
- [x] 🟢 Arreglar drift del README (known issue #4): menciona `pdf-lib`, que no existe.
- [x] 🟡 Tooling de calidad: ESLint + `angular-eslint` + Prettier (double quotes, 2 espacios)
      con config commiteada. Añadir script `pnpm lint` y a CI (`.github/workflows/ci.yml`).
- [x] 🟡 Setup de tests con **Vitest** (compatible con el builder esbuild). Smoke tests de:
      `deepMerge` (application/state/cv.ts), matemática A4 (`infrastructure/export/a4.ts`),
      backfill de `loadAll()`. No perseguir cobertura alta — sólo la red de seguridad.
- [x] 🟢 Endurecer el guard de `/editor` (known issue #6): hoy redirige en silencio si el
      `?cv=` es inválido; mostrar toast o estado claro.

**Definición de hecho**: `pnpm build` verde, `pnpm lint` verde, `pnpm test` corre, cero
clases Tailwind inexistentes, animaciones vivas en prod.

---
## Fase 1 — Profundidad de contenido del CV ✅ COMPLETADA (2026-07-10, variante lean sin deps)

Hoy el modelo sólo tiene 4 secciones (personal, experiencia, educación, skills). Los CVs
reales necesitan más. Cada sección nueva sigue la receta de `CONVENTIONS.md` → "Add a field
to the CV model" (tocar cv-model, cv-defaults, backfill en loadAll, form, y las 5 plantillas).

- [x] 🔴 ⭐ Nuevas secciones: **Projects**, **Certifications**, **Languages** (con nivel).
      Modelo + form component + render en las 5 plantillas.
- [ ] 🟡 **Secciones personalizadas** (título libre + lista de ítems) para cubrir voluntariado,
      premios, publicaciones, etc. sin explotar el modelo. — _diferido (no crítico para esta fase)_
- [x] 🟡 ⭐ **Reordenar ítems** dentro de una sección (experiencia, educación, skills, +proyectos,
      certs, idiomas) — botones subir/bajar (`core/utils/array.ts`). Sin drag&drop (era la variante con deps).
- [ ] 🟡 **Toggle de visibilidad** por sección y **reordenar secciones** en el CV. — _diferido a una futura iteración_
- [x] 🟡 **Rich text ligero** en descripciones (bold/italic/bullets) vía `shared/utils/markdown.ts`,
      renderizado con `[innerHTML]` (sanitizado) en las 5 plantillas. Exporta bien a PDF (estilos inline).

**Definición de hecho**: se puede crear un CV completo (proyectos, certs, idiomas) que
renderiza bien en las 5 plantillas y en ambos exports (image PDF + print). ✅ (build/lint/test verdes;
falta QA visual manual — ver STATE.md § Next steps).

> **Nota**: dos ítems 🟡 quedaron diferidos a propósito (secciones personalizadas y
> visibilidad/reorden de secciones) — no eran críticos para la definición de hecho y añadían
> complejidad de modelo/UI. Se pueden retomar en una iteración de Fase 1.5.

---

## Fase 2 — Portabilidad y seguridad de datos (privacy-first) ⭐

Todo vive en IndexedDB: si el usuario borra el navegador, pierde todo. Portabilidad = feature
alineada con "los datos nunca salen del navegador" (la exportación la controla el usuario).

- [ ] 🟡 ⭐ **Export/Import de CV como JSON** (backup/restore). Botón en dashboard y editor.
      Validar el JSON al importar contra el modelo `Cv`.
- [ ] 🟡 Compatibilidad con el estándar **[JSON Resume](https://jsonresume.org/schema)**
      (mapear import/export). Aumenta interoperabilidad sin backend.
- [ ] 🟡 ⭐ **Undo/redo** en el editor: historial basado en signals (stack de snapshots del
      `Cv` activo). Encaja con la arquitectura de `CvStore`.
- [ ] 🟢 **Dashboard**: búsqueda + orden (por fecha/nombre) cuando haya muchos CVs.
- [ ] 🟢 Exportar **todos** los CVs como un único archivo (backup completo).

**Definición de hecho**: exportar un CV, borrar IndexedDB, reimportarlo y quedar idéntico.
Ctrl+Z / Ctrl+Shift+Z funcionan en el editor.

---

## Fase 3 — Salida y personalización (fidelidad de PDF)

Hoy sólo hay accent/background/primary color. `fontFamily` existe en el modelo pero puede no
estar cableado a la UI. Los usuarios quieren control tipográfico y de página.

- [ ] 🟡 ⭐ **Selector de fuente** (cablear `settings.fontFamily`) + control de tamaño de
      fuente / interlineado / márgenes por CV.
- [ ] 🟡 **Tamaño de página A4 / Letter** y control de **saltos de página** (evitar cortar un
      ítem de experiencia a la mitad en el PDF).
- [ ] 🔴 **Más plantillas** (receta de 3 pasos en `ARCHITECTURE.md` § Template system) —
      deben ser genuinamente distintas (sidebar, two-column, header-accent), no recolores.
- [ ] 🟡 Mejoras del export PDF: calidad, saltos de página inteligentes, nombre de archivo con
      el nombre del CV.
- [ ] 🟢 **Foto de avatar**: subir + recortar (client-side, guardar como data URL).

**Definición de hecho**: el PDF exportado respeta fuente/márgenes elegidos y no parte ítems
entre páginas; al menos una plantilla nueva de layout distinto.

---

## Fase 4 — Guía, onboarding y "app-quality" (blank → PDF en <5 min)

- [ ] 🟡 ⭐ **Chequeo de completitud / heurística ATS** (100% client-side, SIN IA): detectar
      campos vacíos, secciones faltantes, descripciones muy cortas, y dar una puntuación +
      sugerencias. Encaja con non-goals (no es generación de contenido con IA).
- [ ] 🟢 **Onboarding**: CV de ejemplo pre-rellenado opcional + galería de plantillas al crear.
- [ ] 🟡 **PWA**: instalable + offline (service worker). Encaja perfecto con "local-first,
      no network needed after first load".
- [ ] 🟢 **Atajos de teclado** (guardar, exportar, cambiar tab, undo/redo).
- [ ] 🟡 **Auditoría de accesibilidad** (a11y): foco, roles ARIA, contraste, navegación teclado.
- [ ] 🟡 **i18n de la UI de la app** (marcado como "may come later" en CONTEXT). El contenido
      del CV lo escribe el usuario; esto es sólo la interfaz.

**Definición de hecho**: la app es instalable y funciona offline; hay feedback de completitud;
un usuario nuevo llega a PDF sin fricción.

---

## Fase 5 — Rendimiento y robustez (mantener el código ejemplar)

- [ ] 🟡 Auditoría **Lighthouse** + análisis de bundle (skill `web-perf` disponible). Objetivo
      del proyecto: lazy routes, sin deps pesadas en el bundle inicial.
- [ ] 🟡 **Tests E2E** (Playwright): flujo landing → dashboard → editor → export.
- [ ] 🟢 Revisar carga perezosa de `html-to-image`/`jspdf` (sólo cargar al exportar).
- [ ] 🟢 Manejo de errores de IndexedDB (cuota llena, modo privado del navegador).

---

## Cómo priorizar

Orden recomendado: **Fase 0 → Fase 1 → Fase 2** son el núcleo de valor (estabilidad +
contenido + portabilidad). Fases 3–5 son incrementales y pueden reordenarse según feedback.

Los ítems ⭐ son los de mayor relación impacto/esfuerzo si se quiere ir a lo seguro.

## Fuera de alcance (recordatorio de CONTEXT.md § Non-goals)

Backend, cuentas, auth, cloud sync, links para compartir · generación de contenido con IA
in-app · gestión multi-idioma del *contenido* del CV · cover letters / job tracking · apps
nativas móviles. Cualquiera de estos requiere decisión explícita del usuario primero.
