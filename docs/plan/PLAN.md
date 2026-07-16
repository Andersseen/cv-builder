# PLAN — Fases de mejora (análisis 2026-07-15)

> **Cómo usar este archivo**: cada fase es auto-contenida y puede hacerse en una sesión
> nueva, en cualquier orden salvo lo que diga su campo **Depende de**. También se pueden
> encadenar varias fases en una misma sesión (respetando dependencias). Este plan refina y
> reordena las fases pendientes de `docs/ROADMAP.md` según el análisis de 2026-07-15; si
> hay conflicto entre ambos, manda este archivo.
>
> **Protocolo de sesión**:
>
> 1. Lee [CONTEXT.md](CONTEXT.md) (mismo directorio) — completo, antes de tocar código.
> 2. Ejecuta la(s) fase(s) que te pidan. Respeta las reglas de oro de CONTEXT.md § 3
>    (en especial: **ninguna dependencia nueva sin aprobación del usuario**).
> 3. Verifica: `pnpm build` + `pnpm lint` + `pnpm test` verdes, y QA manual en el
>    navegador (`pnpm start` → localhost:5173) de lo que hayas tocado.
> 4. Marca aquí los checkboxes hechos y actualiza `docs/STATE.md` (qué hiciste, qué
>    queda, issues nuevos). Si el modelo `Cv` cambió, añade el backfill en
>    `CvStore.loadAll()` y un test.
>
> Esfuerzo: 🟢 pequeño (menos de media sesión) · 🟡 medio (una sesión) · 🔴 grande (sesión larga o dos).
> ⭐ = máxima relación impacto/esfuerzo.

**Orden recomendado**: 0 → 1 → 2 → 3 → 4 → 5 → 6; las fases 7–9 son independientes y
pueden intercalarse después según feedback.

---

## Fase 0 — QA manual y estabilización post-upgrade 🟢 (bloqueante)

**Por qué**: el upgrade a Angular 21 y la migración de los formularios a `@voltui/components`
se verificaron solo con build/lint/test — nadie ha mirado el editor en un navegador. Es
exactamente donde se rompen cosas que el compilador no ve (`volt-input` + `formControlName`).

**Depende de**: nada. **Toda otra fase asume que esta está hecha.**

- [x] Arrancar `pnpm start` y recorrer el flujo completo: landing → dashboard (crear,
      renombrar, duplicar, borrar) → editor.
- [x] Verificar los 8 tabs del editor: escribir en cada campo de cada formulario y confirmar
      que la preview se actualiza y el indicador "Saved ✓" aparece (autosave).
- [x] Verificar reorden ↑/↓ en las 6 listas, el markdown (`**bold**`, `*italic*`, `- bullets`)
      en descripciones de experiencia/proyectos, y subir/quitar avatar.
- [x] Verificar ambos exports (PDF imagen + print) con las 5 plantillas, en light y dark.
      Confirmar que el CV renderiza igual en ambos temas (debe — usa Tailwind directo).
- [x] Probar en viewport móvil (~375px): documentar qué pasa con la preview y el export
      (hipótesis del análisis: no hay preview y el export sale vacío o falla). Anotar
      hallazgos en `docs/STATE.md` como input de la Fase 2.
- [x] Recargar la página del editor y confirmar que los datos persisten (IndexedDB).
- [x] Arreglar todo lo roto que aparezca (con su test si es lógica).
- [x] Ampliar `e2e/smoke.spec.ts` a un flujo real: crear CV → rellenar personal +
      1 experiencia → verificar que aparece en preview → volver al dashboard → verificar card.

**Hecho cuando**: flujo completo verificado y documentado en STATE.md; e2e del flujo verde;
cero regresiones conocidas del upgrade.

---

## Fase 1 — Seguridad y portabilidad de datos 🟡 ⭐ (la más importante)

**Por qué**: todo vive en IndexedDB; limpiar el navegador borra todos los CVs sin aviso.
Para un usuario no técnico es pérdida de datos silenciosa. Es el riesgo nº 1 del producto.

**Depende de**: Fase 0.

- [x] **Export JSON por CV**: nueva carpeta `src/app/infrastructure/portability/` con un
      servicio que serializa un `Cv` a archivo descargable `<nombre>.cv.json`. Incluir campo
      `schemaVersion: 1` en el envelope para migraciones futuras. Botón en el menú de la
      card del dashboard y en el dropdown de export del editor.
- [x] **Import JSON** con validación estructural contra el modelo `Cv` (función pura en
      `domain/` o `infrastructure/portability/`, con tests): campos requeridos presentes,
      tipos correctos, backfill de secciones ausentes (reutilizar la lógica de `loadAll()` —
      extraerla a una función compartida). Al importar: regenerar `id` si colisiona con uno
      existente. JSON inválido → toast de error claro, nunca un crash ni un CV corrupto.
- [x] **Backup completo**: exportar todos los CVs en un único JSON + restaurar desde él
      (botón en el header del dashboard).
- [x] **`navigator.storage.persist()`**: solicitarlo al crear el primer CV (en `CvStore.create`
      o en el arranque del dashboard). Es una línea y reduce purgas automáticas del navegador.
- [x] **Aviso honesto en el dashboard**: banner/nota discreta "Tus CVs viven solo en este
      navegador — descarga una copia de seguridad" con CTA al backup. Descartable
      (persistir el descarte en localStorage).
- [x] **Manejo de errores de IndexedDB**: envolver los fallos de `repo.save/getAll` (cuota
      llena, Safari en privado) en toasts claros en vez de fallos silenciosos en consola.

**Hecho cuando**: exportar un CV → borrar IndexedDB a mano → importarlo → CV idéntico
(verificado con test del round-trip). JSON corrupto muestra error claro. Backup completo
restaura N CVs. `persist()` se solicita. Build/lint/test verdes.

---

## Fase 2 — Preview y export en móvil 🟡 ⭐

**Por qué**: hoy la preview es `hidden lg:block` y su botón de toggle `hidden lg:flex`
(`src/app/pages/editor.html`): en un teléfono el usuario rellena formularios **a ciegas** y
el export depende de `#resume-content`, que está oculto por CSS (probablemente roto en móvil
— confirmar con los hallazgos de la Fase 0). El público no técnico es mayoritariamente móvil.

**Depende de**: Fase 0 (trae el diagnóstico exacto del comportamiento móvil).

- [x] Hacer visible el botón flotante de preview en todos los viewports (quitar `hidden lg:flex`).
- [x] En <lg, el botón abre la preview como **overlay a pantalla completa**: fondo oscurecido,
      CV escalado para caber en el ancho (`transform: scale()` calculado desde el ancho A4 px
      de `a4.ts`), scroll vertical, botón de cierre. En ≥lg se mantiene el panel lateral actual.
- [x] Garantizar que el export funciona en móvil: el nodo `.resume-content` se renderiza siempre
      en un contenedor off-screen (`[data-export-preview]`) y se captura desde ahí, evitando IDs
      duplicados y asegurando que esté disponible incluso cuando el overlay está cerrado.
- [x] Revisar la toolbar del editor en móvil (botones de export accesibles, sin overflow).
- [x] QA automatizada en viewport 375px: las 5 plantillas visibles en el overlay + ambos exports
      (`e2e/qa-fase2.spec.ts`).

**Hecho cuando**: en un viewport de 375px se puede ver la preview de las 5 plantillas y
descargar ambos PDFs. El comportamiento desktop no cambia.

---

## Fase 3 — Undo/redo y borrado seguro 🟡 ⭐

**Por qué**: el autosave (800 ms) persiste un borrado accidental casi al instante y no hay
vuelta atrás. Para un no-dev eso es "la app me borró mi trabajo".

**Depende de**: Fase 0. Independiente de 1 y 2.

- [ ] **Historial en el editor**: stack de snapshots del `Cv` activo en `application/`
      (nuevo servicio `application/services/history.ts` o integrado en `CvStore`). Push en
      cada `updateActiveCv` (con coalescing: agrupar ediciones de tipeo separadas por <1s
      para no guardar un snapshot por tecla), límite ~50 entradas, solo en memoria (no
      persiste entre sesiones).
- [ ] `undo()` / `redo()` en el store + signals `canUndo` / `canRedo`.
- [ ] Atajos de teclado en la página del editor: Ctrl/Cmd+Z y Ctrl/Cmd+Shift+Z.
- [ ] Botones undo/redo en la toolbar del editor con estados disabled.
- [ ] **Borrado de ítems con deshacer**: al borrar un ítem de una lista (experiencia, etc.),
      toast "Elemento borrado — Deshacer" (~5 s) que restaura vía el historial.
- [ ] **Reemplazar el `confirm()` nativo** de borrado de CV (`dashboard.page.ts`) por un
      modal propio con tokens del design system (o patrón borrado + toast deshacer; elegir
      uno y ser consistente).
- [ ] Tests unit del historial (push/undo/redo/límite/coalescing).

**Hecho cuando**: Ctrl+Z revierte una edición de campo y un borrado de ítem; borrar un CV
pide confirmación en un modal propio (o es deshacible); no queda ningún `confirm()` nativo.

---

## Fase 4 — UX de exportación y calidad de PDF 🟡

**Por qué**: hay dos exports con trade-offs (imagen pixel-perfect NO apta para ATS vs
print/texto apta para ATS) que un usuario no técnico no puede distinguir, y el PDF imagen
puede cortar una línea de texto entre páginas.

**Depende de**: Fase 0. Independiente de 1–3.

- [ ] **Etiquetas claras** en la toolbar (`editor-toolbar.ts`): acción primaria
      "Download PDF — recommended for job applications" (path print/texto) y en el dropdown
      "High-fidelity PDF (image — not readable by ATS systems)" con una línea explicativa.
      El texto exacto puede ajustarse, pero el usuario debe entender cuál usar sin saber qué es ATS.
- [ ] **Nombre de archivo también en el print export**: setear `document.title` al nombre del
      CV durante la impresión (es el filename por defecto del "guardar como PDF" del navegador)
      y restaurarlo después.
- [ ] **Lazy-load de las libs de export**: en `pdf-export.ts`, pasar `html-to-image` y `jspdf`
      a `await import(...)` dentro de `exportToPdf()` para sacarlas del chunk del editor.
      Verificar con el output del build que ya no están en el chunk.
- [ ] **Cortes de página del PDF imagen** (`addImagePages` en `pdf-export.ts`): evitar cortar
      una línea por la mitad. Enfoque sugerido sin deps: antes de capturar, medir los bloques
      hijos de `#resume-content` y añadir spacers/padding para que ningún bloque cruce un
      límite A4; alternativa mínima: documentar la limitación y añadir margen inferior de
      seguridad por página. Elegir según complejidad real de las plantillas.
- [ ] QA: CV de 2 páginas exportado por ambos paths con las 5 plantillas.

**Hecho cuando**: los botones explican qué export usar; ambos PDFs se descargan con el nombre
del CV; `jspdf`/`html-to-image` fuera del chunk inicial del editor; sin líneas cortadas (o
mitigación documentada y visiblemente mejor que hoy).

---

## Fase 5 — Onboarding y guía de completitud 🟡 ⭐

**Por qué**: un CV en blanco con 8 tabs intimida a un usuario no técnico. Un ejemplo
pre-rellenado + feedback de completitud le dan la guía que hoy no existe. 100% client-side,
sin IA (respeta los non-goals).

**Depende de**: Fase 0. Independiente de 1–4.

- [ ] **CV de ejemplo**: `createExampleCv()` en `domain/models/` (junto a `cv-defaults.ts`)
      con datos realistas y completos (experiencia con bullets markdown, proyectos, idiomas…).
      Botón "Start with an example" en el empty state del dashboard y como acción secundaria
      en el header del dashboard. Nota: esto es una excepción deliberada a la regla "no
      placeholder content" — es una feature pedida, no relleno.
- [ ] **Chequeo de completitud**: función pura en `domain/` (con tests) que puntúa un `Cv`:
      campos personales vacíos, sin summary, summary muy corto, sin experiencia, descripciones
      de <X caracteres, sin skills, fechas faltantes… Devuelve score 0–100 + lista de
      sugerencias accionables (`{ severity, message, tabId }`).
- [ ] **UI del chequeo**: badge/anillo con el score en el editor (p. ej. junto a los tabs o
      en la toolbar) que despliega la lista de sugerencias; cada sugerencia navega a su tab.
      Actualización en vivo (computed sobre `activeCv`).
- [ ] QA: crear ejemplo en 1 click → score alto; CV vacío → score bajo con sugerencias útiles.

**Hecho cuando**: un usuario nuevo llega a un CV completo de ejemplo en 1 click; el score y
las sugerencias reaccionan en vivo a la edición; heurística cubierta por tests.

---

## Fase 6 — Pulido de formularios y datos 🟢

**Por qué**: detalles que separan una app pulida de una demo, todos baratos.

**Depende de**: Fase 0. Independiente de 1–5.

- [ ] **Relajar requireds** en `personal-info-form.ts`: solo `fullName` requerido; `email`
      se valida solo si no está vacío (mucha gente no quiere teléfono en el CV; en varios
      países se desaconseja). Quitar los asteriscos de Phone/Location.
- [ ] **Downscale del avatar al subirlo**: en `onAvatarSelected`, redimensionar con canvas a
      máx ~400px de lado y exportar JPEG calidad ~0.85 antes de guardar el data URL. Una foto
      de móvil de 8 MB no debe entrar cruda en IndexedDB ni en el PDF.
- [ ] **Deduplicar las clases de inputs**: la misma cadena de ~40 utilidades Tailwind se
      repite en cada `volt-input`/`volt-textarea` de los 7 formularios. Extraer a una
      `@utility` en `src/styles.css` (p. ej. `input-field`) o a un componente wrapper con
      label + error integrados. Aplicar en todos los formularios.
- [ ] **Cablear `settings.fontFamily`**: selector de fuente en el tab Template
      (`template-selector.ts`) con 3–4 fuentes seguras para print (p. ej. system sans, serif,
      humanist), aplicado a las 5 plantillas y verificado en ambos exports. (Si el usuario
      prefiere quitarlo del modelo en vez de cablearlo, preguntar antes — pero cablearlo es
      lo recomendado.)
- [ ] QA visual de los 7 formularios tras la deduplicación (no debe cambiar nada visualmente).

**Hecho cuando**: solo el nombre es obligatorio; una foto de 8 MB queda en <100 KB
almacenados; una sola fuente de verdad para el estilo de inputs; la fuente elegida se ve en
preview y en ambos PDFs.

---

## Fase 7 — Secciones flexibles 🔴

**Por qué**: voluntariado, publicaciones, premios… son necesidades reales de CVs no-tech
(docencia, sanidad, etc.). Eran los ítems diferidos de la Fase 1.5 del roadmap original.

**Depende de**: Fase 0. Recomendado después de la 4 (para no rehacer trabajo de page-breaks
al tocar las plantillas). Toca el modelo → exige backfill en `loadAll()` + tests.

- [ ] **Secciones personalizadas**: `customSections: CustomSection[]` en el modelo
      (`{ id, title, items: { id, title, subtitle, description }[] }`, description con
      markdown ligero). Backfill `?? []`. Form genérico (nuevo tab "More" o similar) para
      crear/renombrar/borrar secciones y sus ítems, con reorden ↑/↓.
- [ ] **Visibilidad por sección**: `sectionVisibility` en settings (o campo `hidden` por
      sección) + toggles en la UI. Sección oculta no renderiza en preview ni exports.
- [ ] **Orden de secciones**: `sectionOrder: string[]` en settings + UI de reorden (↑/↓,
      consistente con las listas). Las 5 plantillas respetan el orden donde su layout lo
      permita (documentar excepciones: p. ej. un sidebar fijo puede limitar qué se mueve).
- [ ] Render de todo lo anterior en las 5 plantillas + ambos exports.
- [ ] Tests: backfill, y helpers de visibilidad/orden como funciones puras.

**Hecho cuando**: crear una sección "Volunteering", ocultar Skills y reordenar secciones se
refleja en preview y en ambos PDFs con las 5 plantillas; CVs antiguos cargan sin romperse.

---

## Fase 8 — PWA y offline real 🟡

**Por qué**: el pitch dice "no network needed after first load" — sin service worker no es
verdad estricta. Para una app privacy-first, "funciona sin internet" es además coherencia de
marketing.

**Depende de**: Fase 0. ⚠️ Probablemente requiere una dependencia nueva
(`vite-plugin-pwa` es lo estándar con Vite/Analog) → **pedir aprobación al usuario antes de
instalar nada** (regla de oro #11). Si la deniega, valorar un service worker escrito a mano
(precache del shell + runtime cache).

- [ ] Manifest (nombre, iconos, theme color, display standalone) + iconos generados.
- [ ] Service worker: precache del app shell, estrategia cache-first para assets con hash.
- [ ] Verificar que el flujo completo (dashboard → editor → export) funciona offline tras
      la primera carga.
- [ ] Aviso de actualización disponible (nueva versión del SW) — toast simple.

**Hecho cuando**: Lighthouse marca la app como instalable; con el dev server apagado /
network offline en DevTools, la app carga y el flujo completo funciona.

---

## Fase 9 — i18n de la UI (es/en) 🔴

**Por qué**: la UI está solo en inglés; para usuarios no técnicos hispanohablantes es
barrera de entrada. Solo la interfaz — el contenido del CV lo escribe el usuario.

**Depende de**: Fase 0. Hacerla tarde: cada fase anterior añade strings (mejor traducir una vez).

- [ ] **Sin deps nuevas** (el i18n build-time de Angular encaja mal con Analog): servicio
      `core/services/i18n.ts` con signal de locale (persistido en localStorage, default =
      idioma del navegador), diccionarios `es`/`en` tipados (las claves como union type para
      que falte-una-clave sea error de compilación), y helper/pipe `t()`.
- [ ] Extraer todos los strings de la UI (landing, dashboard, editor, toasts, toolbar) a los
      diccionarios. Selector de idioma en el header.
- [ ] **Idioma del CV (decisión aparte)**: los títulos de sección de las plantillas
      ("Experience", "Skills"…) se imprimen en el PDF. Añadir un ajuste por-CV
      `settings.language` (es/en) que traduzca solo esos títulos en las plantillas — así un
      usuario español genera un CV en español aunque use la UI como quiera. Backfill a "en".
- [ ] QA: UI completa en ambos idiomas sin strings hardcodeados; PDF con títulos en español.

**Hecho cuando**: toda la UI conmuta es/en al vuelo; un CV puede exportarse con títulos de
sección en español; cero strings sueltos (grep de textos en templates como verificación).

---

## Fuera de alcance (recordatorio)

Backend, cuentas, auth, cloud sync, links compartibles · IA in-app · cover letters / job
tracking · apps nativas. Cualquiera de estos requiere decisión explícita del usuario primero.
