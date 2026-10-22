# Centro Aura — demo B

Segunda propuesta de diseño de la web de Centro Aura (peluquería, spa capilar y tricología, Las Cabezas de San Juan): sitio estático multipágina para que la clienta elija entre dos diseños; una sola acción, reservar por WhatsApp.

## Commands

| Task | Command |
|---|---|
| Install | nada que instalar: cero dependencias, Node 24 o superior |
| Dev server | `npm run serve` — http://localhost:4173 (`PORT=4180 npm run serve` cambia el puerto) |
| Build | `npm run build` → `dist/` (solo la web, lista blanca en `tools/build.mjs`) |
| Unit tests | `npm test` · un archivo: `node --test tests/<archivo>.test.js` |
| Smoke (arranca y para el servidor) | `node tools/smoke.mjs <carpeta> <puerto> <ruta>=<código> …` — rutas **sin barra inicial**, `./` es la portada; salida 0 ok · 1 código distinto · 2 uso · 3 puerto ocupado · 70 error inesperado |
| Fuentes (requiere red) | `npm run fonts` → `assets/fonts/` y `css/fonts.css` |
| Dominio | `npm run domain -- https://www.tudominio.es` |
| Pendientes | `npm run pendientes` (lista datos legales y dominio provisional; sale 1 mientras quede algo, 70 si falla) |

**Gate:** `npm test` debe pasar, más el `Verify` del paso, antes de marcar nada como hecho. No hay typecheck ni lint: no hay compilador ni dependencias.

Node se fija en `engines` (`>=24`). Todo se ejecuta desde la **raíz del proyecto**, nunca desde `blueprints/`.

## Stack

HTML5 · CSS plano con propiedades personalizadas · JavaScript vanilla (ES2022) · Node 24 solo para tests, build y servidor local · Vercel estático. Sin framework, sin bundler, sin base de datos.

## Architecture

**Flujo.** Navegador → HTML estático (`index.html`, `pages/*.html`) → `css/fonts.css`, `css/tokens.css`, `css/styles.css` → `js/data.js` y `js/lib.js` (UMD: `window.AURA_DATA` / `window.AuraLib`) → `js/main.js` rellena precios, duraciones, horario y teléfono, enlaza WhatsApp y activa menú, pestañas, formulario y mapa. Sin JavaScript queda el texto de respaldo del HTML. Los datos de negocio solo se editan en `js/data.js`.

**Boundaries.**

| Pieza | Puede usar | Nunca |
|---|---|---|
| `index.html`, `pages/*.html` | `css/*`, `js/*`, `assets/*` | cargar fuentes o scripts de terceros, ni `<iframe>` al arrancar |
| `css/styles.css` | `var(--…)` de `css/tokens.css` | hex, `max-width` en media queries |
| `js/main.js` | `window.AURA_DATA`, `window.AuraLib` | importar módulos, tocar la red salvo crear el iframe del mapa |
| `tools/*.mjs`, `tests/*.js` | Node y archivos del proyecto | ser publicados (la lista `PUBLIC` de `build.mjs` los deja fuera) |

**Where things live.**

| Concern | Single source of truth |
|---|---|
| Precios, duraciones, horario, teléfono | `js/data.js` (el HTML lleva respaldo idéntico; los tests avisan) |
| Colores, tipografía, espaciado | `css/tokens.css` (único archivo con hex) |
| Textos | `docs/contenido-fuente.md` (A literal + textos nuevos de B) |
| Iconos | `assets/icons/sprite.svg` es la fuente; cada página lleva el sprite **incrustado** (`<svg class="sprite">`) y los iconos se usan con `<use href="#i-<nombre>">`. Tras cambiar el sprite o añadir una página: `node tools/sync-sprite.mjs` |
| Fotos y tamaños | `assets/img/*.webp` + `tests/fixtures/images.json` (`width`/`height` del HTML = tamaño real) |
| Estado de la construcción | `blueprints/centro-aura-2/tasks.json` y `epics/` |

**Rutas locales por nivel:** `index.html` usa `assets/…`; `pages/*.html` usa `../assets/…`; `404.html` usa rutas desde la raíz con `<base href="/">` (no las cambies a `/…`).

## Code rules

1. **Mobile-first.** Solo `@media (min-width: 600px | 760px | 900px | 1200px)`. Prohibido `max-width` dentro de una media query.
2. **Ningún hex fuera de `css/tokens.css`.** Componentes con `var(--c-…)`, `var(--s-…)`, `var(--r-…)`.
3. **`--c-muted` y `--c-gold` son decorativos:** jamás como `color` de texto.
4. **Un `h1` por página**, niveles de encabezado sin saltos; toda `<img>` con `alt`, `width` y `height` reales.
5. **Una sola familia de iconos** (el sprite). Los `<svg>` decorativos llevan `aria-hidden="true"`.
6. **Todo botón de reserva es un `<a data-wa="…" href="https://wa.me/34610167764">`**: el `href` fijo es el respaldo sin JS.
7. **Nada de terceros sin acción del usuario.** El mapa lo crea `main.js` al pulsar "Ver el mapa".
8. **Textos de A literales; textos nuevos solo con hechos de A.** Prohibido inventar años, cifras, premios, reseñas, nombres, ingredientes o beneficios médicos.
9. **Cada paso escribe y ejecuta su test.** No se edita un test para que pase; se arregla el código.
10. **Sin dependencias nuevas.** `package.json` no lleva `dependencies` ni `devDependencies`.

## Design system

Tokens en `css/tokens.css`; los componentes solo usan nombres.

| Role | Value | Used for |
|---|---|---|
| `--c-bg` | `#FFFDF7` | fondo de página |
| `--c-bg-alt` | `#F6F0E4` | bandas alternas, topbar, panel en arco |
| `--c-text` / `--c-text-soft` | `#4A4238` / `#6B6153` | texto / texto secundario |
| `--c-anchor` | `#3F372D` | banda cacao, botón primario, pie |
| `--c-on-anchor` / `--c-on-anchor-soft` | `#FFFDF7` / `#E9DDC8` | texto sobre cacao |
| `--c-clay` / `--c-clay-soft` | `#9A5B43` / `#EAD3C6` | acento de texto (cursiva, enlaces) / fondo de chips |
| `--c-border` / `--c-line` | `#8C7F6D` / `#E9DDC8` | bordes de interfaz / filetes decorativos |
| `--c-error` | `#9B3D2E` | errores |
| `--c-muted` / `--c-gold` | `#B2A38F` / `#D2C244` | SOLO decorativos |

- **Type:** títulos Cormorant Garamond 500 con UNA palabra en `<em>` (cursiva, `--c-clay`); texto DM Sans 400/500, 17 px / 1,65; eyebrow DM Sans 500, `.75rem`, mayúsculas, `.14em`; precios en Cormorant. h1 `clamp(2.75rem,7vw,5.25rem)`, h2 `clamp(2rem,4.2vw,3.1rem)`, h3 `clamp(1.4rem,2.6vw,1.75rem)`.
- **Spacing:** base 4 px — 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (`--s-1 … --s-32`). Sin valores arbitrarios.
- **Radius:** pill 999px (botones, chips) · 24px tarjetas · arco `999px 999px 24px 24px` · curva del hero 32px (64px desde 900px).
- **Elevation:** una sombra, `--shadow-soft`. Nada de cristal translúcido.
- **Motion:** 280 ms, `cubic-bezier(0.22,0.61,0.36,1)`, solo opacidad y transform; `prefers-reduced-motion: reduce` lo anula.
- **Layout:** contenedor 1200 px, lectura 62ch; header sticky con `scroll-padding-top` para que el foco no quede tapado.
- **Contraste:** los pares de `tests/css.test.js` deben cumplir 4,5 (texto) o 3 (interfaz); si cambias un hex, cámbialo a la vez en `tokens.css`, ese test y esta tabla.

## Environment

No hay variables obligatorias ni `.env`. Opcionales: `PORT` (puerto de `tools/serve.mjs`, por defecto 4173), `AURA_SERVE_DIR` (carpeta que sirve, la usa `tools/smoke.mjs`) y `AURA_ROOT` (raíz que lee `tools/set-domain.mjs`, solo los tests). Se pasan en línea, no se leen de ningún archivo.

## Rules

Convenciones por área; léelas antes de editar:

| File | Applies to |
|---|---|
| `.claude/rules/css.md` | `css/**` |
| `.claude/rules/html.md` | `index.html`, `404.html`, `pages/**` |
| `.claude/rules/js-tools.md` | `js/**`, `tools/**` |
| `.claude/rules/tests.md` | `tests/**` |

Skills del proyecto: `add-page` (añadir una página con su test, sitemap y metadatos) y `update-data` (cambiar precios, horario o teléfono sin desincronizar nada).

## Non-negotiable

1. No inventes contenido: textos, datos y fotos salen de `docs/contenido-fuente.md`, `js/data.js` y `assets/`.
2. No implementes nada de los Non-Goals de `blueprints/centro-aura-2/blueprint.md` §1 (carrito, calendario, CMS, blog, multidioma, modo oscuro, reseñas o cifras de prueba social, retrato, banner de cookies, selector A↔B, analítica).
3. No edites a mano archivos entregados por `workspace/` salvo que un paso lo diga: `js/data.js`, `js/lib.js`, `js/main.js`, `tools/*`, `package.json`, `vercel.json`, `assets/icons/sprite.svg`.
4. No marques una tarea como hecha con un test o un `Verify` fallando, ni edites un `Verify`.
5. No publiques `tests/`, `tools/`, `docs/` ni `blueprints/`: la lista blanca de `tools/build.mjs` es la única puerta.
6. No hagas `git push`; el despliegue en Vercel y la elección de dominio son puertas manuales del usuario.
7. Para continuar la construcción en otra sesión: `/architect-next` (lee `tasks.json`); no re-ordenes tareas.
