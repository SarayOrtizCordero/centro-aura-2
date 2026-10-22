# Epic 01: Fundamentos y hero

> Existe una base que se sirve, se construye y se prueba; los tokens y el CSS base; la estructura común de las siete páginas; y la portada hasta el hero con tarjeta flotante, la banda de pilares, la fila de iconos y las tarjetas de Spa.

| | |
|---|---|
| **Epic id** | `01-fundamentos-y-hero` |
| **Tasks** | `E1-T1` … `E1-T5` (pasos 1 a 5) |
| **Depends on** | nada — empieza aquí |
| **Unlocks** | 02-portada-y-paginas, 03-legales-calidad-y-publicacion |
| **Parallel with** | ninguna (todos los pasos comparten `css/styles.css` e `index.html`) |

Todo se ejecuta desde la **raíz del proyecto** (no desde `blueprints/`), con el `workspace/` ya copiado por el Bootstrap del blueprint (§10). No necesitas ningún otro archivo para completar esta épica: lo siguiente se repite a propósito.

---

## Stack

HTML5 · CSS plano con propiedades personalizadas (mobile-first) · JavaScript vanilla (ES2022) · sin base de datos ni ORM ni auth · Vercel estático. Node 24 solo para tests, build y servidor local; npm solo ejecuta scripts (cero dependencias, sin lockfile). Versiones: `engines.node` `>=24` en `package.json`; no hay paquetes que fijar.

Gestor de paquetes: `npm` (solo scripts). Runtime fijado en `engines` de `package.json`. No hay lockfile: no hay dependencias.

| Task | Command |
|---|---|
| Dev | `npm run serve` (http://localhost:4173) |
| Typecheck / Lint | no existen: no hay compilador ni dependencias |
| Test (todo) | `npm test` |
| Test (un archivo) | `node --test tests/<archivo>.test.js` |
| Smoke | `node tools/smoke.mjs <carpeta> <puerto> <ruta>=<código> …` (rutas sin barra inicial; `./` es la portada) |
| Build | `npm run build` → `dist/` |
| Fuentes (red) | `npm run fonts` |
| Servicios locales | ninguno: no hay base de datos ni cola |

**Gate:** `npm test` pasa antes de dar por hecha cualquier tarea de esta épica, además del `Verify` de la tarea. Tú no escribes los archivos de `workspace/` (`js/*`, `tools/*`, `tests/helpers.js` y los demás): ya están en la raíz.

## Directory subtree

Solo lo que toca esta épica:

```
index.html                      # paso 1 stub · paso 3 estructura · pasos 4 y 5 secciones
404.html                        # paso 1 stub (definitiva en el paso 11)
css/
  fonts.css                     # NUEVO paso 2 (generado por npm run fonts)
  tokens.css                    # NUEVO paso 2 (únicos hex del proyecto)
  styles.css                    # NUEVO paso 2 · se amplía en 3, 4 y 5
assets/fonts/*.woff2            # NUEVO paso 2 (generados)
tests/
  css.test.js                   # NUEVO paso 2: contraste, tokens, mobile-first, sin hex
  pages.test.js                 # NUEVO paso 3: estructura común de todas las páginas
  shell.test.js                 # NUEVO paso 3: contrato de main.js y reglas del menú
  inicio.test.js                # NUEVO paso 4 · se amplía en el 5
# ya existen, solo lectura (entregados por workspace/): js/data.js js/lib.js js/main.js assets/ tools/ tests/helpers.js
# tests/data.test.js lib.test.js assets.test.js domain.test.js tooling.test.js package.json vercel.json robots.txt sitemap.xml docs/contenido-fuente.md
```

Todo lo que quede fuera de este subárbol está fuera de alcance. Si una tarea parece exigir editar un archivo no listado, detente y repórtalo: el límite de la épica está mal.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `AURA_DATA.items` | `price`, `priceMax`, `duration` de `spa-esencial`, `spa-equilibrio`, `spa-aura` (lectura) | los textos de respaldo del HTML se comparan con `AuraLib.formatPrice` y `item.duration` |
| `AURA_DATA.hours`, `business` | horario y teléfono (lectura) | respaldo de `[data-hours]`, `[data-hours-summary]` y `[data-phone]` |

## Design system (se repite a propósito)

Los valores están en `css/tokens.css` (paso 2). Los componentes usan solo nombres de token.

| Token | Valor | Uso |
|---|---|---|
| `--c-bg` / `--c-bg-alt` | `#FFFDF7` / `#F6F0E4` | página / bandas alternas, topbar, panel en arco |
| `--c-text` / `--c-text-soft` | `#4A4238` / `#6B6153` | texto / texto secundario |
| `--c-anchor` / `--c-on-anchor` / `--c-on-anchor-soft` | `#3F372D` / `#FFFDF7` / `#E9DDC8` | banda cacao, botón primario, pie / texto sobre cacao |
| `--c-clay` / `--c-clay-soft` | `#9A5B43` / `#EAD3C6` | acento de texto (cursiva, enlaces, eyebrow) / fondo de chips |
| `--c-border` / `--c-line` | `#8C7F6D` / `#E9DDC8` | bordes de interfaz / filetes decorativos |
| `--c-error` | `#9B3D2E` | errores |
| `--c-muted` / `--c-gold` | `#B2A38F` / `#D2C244` | SOLO decorativos, nunca `color` de texto |
| Tipografía | Cormorant Garamond 500 (títulos, una palabra en `<em>`) · DM Sans 400/500, 17 px / 1,65 | h1 `clamp(2.75rem,7vw,5.25rem)`, h2 `clamp(2rem,4.2vw,3.1rem)`, h3 `clamp(1.4rem,2.6vw,1.75rem)` |
| Espaciado y formas | escala de 4 px (`--s-1` … `--s-32`); `--r-pill` 999px, `--r-card` 24px, `--r-arch` `999px 999px 24px 24px`, `--r-curve` 32px (64px desde 900px) | sin valores arbitrarios |
| Breakpoints y medidas | `min-width` 600 / 760 / 900 / 1200 px · contenedor 1200 px · lectura 62ch | mobile-first |

Componentes compartidos de `css/styles.css`:

| Componente | Declaraciones obligatorias (todos los valores salen de `css/tokens.css`) |
|---|---|
| Reset y `body` | `*, *::before, *::after { box-sizing: border-box; }` · `body { margin: 0; background: var(--c-bg); color: var(--c-text); font: 400 var(--fs-base)/var(--lh-base) var(--font-body); }` · `img { display: block; max-width: 100%; height: auto; }` |
| Títulos | `h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: 500; }` · `h1 { font-size: var(--fs-h1); line-height: var(--lh-h1); }` · `h2 { font-size: var(--fs-h2); line-height: var(--lh-h2); }` · `h3 { font-size: var(--fs-h3); line-height: var(--lh-h3); }` · `h1 em, h2 em, h3 em { font-style: italic; font-weight: 500; color: var(--c-clay); }` (en bandas oscuras la `em` pasa a `var(--c-on-anchor-soft)`) |
| `.container` | `width: min(100% - 2 * var(--s-4), var(--container)); margin-inline: auto;` y desde 760 px `width: min(100% - 2 * var(--s-8), var(--container));` |
| `.section` / `.section--alt` | `padding-block: var(--s-16);` (desde 900 px `var(--s-24)`) · `--alt`: `background: var(--c-bg-alt);` |
| `.section-head` | `max-width: var(--measure); margin: 0 0 var(--s-8);` · `.section-head--center { margin-inline: auto; text-align: center; }` |
| `.eyebrow` | `display: block; margin-bottom: var(--s-3); font: 500 var(--fs-eyebrow)/1.4 var(--font-body); letter-spacing: var(--ls-eyebrow); text-transform: uppercase; color: var(--c-clay);` |
| `.lead` | `max-width: var(--measure); font-size: 1.125rem; color: var(--c-text-soft);` |
| `.visually-hidden` | patrón estándar: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;` |
| `.skip-link` | `position: absolute; left: var(--s-4); top: -100px; z-index: 100; padding: var(--s-3) var(--s-6); background: var(--c-anchor); color: var(--c-on-anchor); border-radius: var(--r-pill);` y `:focus { top: var(--s-4); }` |
| `.icon` | `width: 1.25rem; height: 1.25rem; flex: none;` · `.icon--lg { width: 1.75rem; height: 1.75rem; }` (los iconos se pintan con `currentColor`) |
| `.btn` | `display: inline-flex; align-items: center; justify-content: center; gap: var(--s-3); min-height: 48px; padding: 0 var(--s-6); border: 1.5px solid transparent; border-radius: var(--r-pill); font: 500 0.9375rem/1 var(--font-body); text-decoration: none; cursor: pointer; transition: background var(--dur) var(--ease), color var(--dur) var(--ease);` |
| `.btn--primary` | `background: var(--c-anchor); color: var(--c-on-anchor); padding-right: var(--s-2);` · `.btn__icon { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--c-on-anchor); color: var(--c-anchor); }` |
| `.btn--outline` | `background: transparent; color: var(--c-anchor); border-color: var(--c-border);` |
| `.btn--light` | `background: var(--c-on-anchor); color: var(--c-anchor);` (sobre fondos oscuros) · `.btn--sm { min-height: 44px; padding: 0 var(--s-4); }` |
| `.chips` / `.chip` | `.chips { display: flex; flex-wrap: wrap; gap: var(--s-2); }` · `.chip { display: inline-flex; align-items: center; min-height: 28px; padding: 0 var(--s-3); border-radius: var(--r-pill); background: var(--c-clay-soft); color: var(--c-anchor); font: 500 0.75rem/1 var(--font-body); }` |
| `.link-arrow` | `display: inline-flex; align-items: center; gap: var(--s-2); min-height: 44px; font-weight: 500; color: var(--c-clay); text-decoration: underline; text-underline-offset: 0.25em;` y `::after { content: "→"; }` |
| `.price` | `font: 500 1.5rem/1 var(--font-display); color: var(--c-text);` (las cifras van en Cormorant) |
| `.card` | `background: var(--c-bg); border: 1px solid var(--c-line); border-radius: var(--r-card); overflow: hidden;` |
| `.arch` | `border-radius: var(--r-arch); overflow: hidden; background: var(--c-bg-alt);` |
| `.hours` | `display: grid; grid-template-columns: auto 1fr; gap: var(--s-1) var(--s-6); margin: 0;` · `.hours dt { font-weight: 500; }` · `.hours dd { margin: 0; }` |
| Foco | `:focus-visible { outline: 2px solid var(--c-anchor); outline-offset: 3px; }` y, dentro de `.pillars`, `.site-footer`, `.gift-banner` y `.site-nav`, `outline-color: var(--c-on-anchor);` |
| Aparición | `.reveal-ready .reveal { opacity: 0; transform: translateY(12px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }` · `.reveal-ready .reveal.is-visible { opacity: 1; transform: none; }` |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } .reveal { opacity: 1 !important; transform: none !important; } }` |
| Atributo `hidden` | `[hidden] { display: none !important; }` (base: sin esta regla `.btn { display: inline-flex; }` mostraría el botón oculto del mapa cuando no hay JavaScript) |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| workspace | `js/data.js` → `window.AURA_DATA` / `module.exports` | catálogo, horario y teléfono; no se edita |
| workspace | `js/lib.js` → `formatPrice`, `hoursToRows`, `waMessage`, `buildWaUrl`, `categoryOf`, `composeContactMessage` | funciones puras idénticas a la demo A |
| workspace | `js/main.js` | rellena `data-price`, `data-duration`, `data-phone`, `data-hours`, `data-hours-summary`, `data-wa`, menú, pestañas, formulario, mapa y aparición |
| workspace | `assets/icons/sprite.svg` | símbolos `i-spa`, `i-barro`, `i-alisado`, `i-tijeras`, `i-tricologia`, `i-regalo`, `i-reloj`, `i-pin`, `i-telefono`, `i-whatsapp`, `i-instagram`, `i-flecha`, `i-check`, `i-menu`, `i-cerrar` |
| workspace | `tools/smoke.mjs`, `tools/serve.mjs`, `tools/build.mjs`, `tools/fetch-fonts.mjs` | servir y comprobar, construir, descargar fuentes |
| workspace | `tests/helpers.js` → `ROOT`, `read`, `pageFiles`, `webpSize` | utilidades de los tests |

**Produced** — épicas posteriores dependen exactamente de esto:

| Export | Signature | Used by |
|---|---|---|
| `css/tokens.css` | tokens `--p-*`, `--c-*`, `--veil-*`, `--font-*`, `--fs-*`, `--s-*`, `--r-*`, `--shadow-soft`, `--header-h` | todas las épicas |
| `index.html` (paso 3) | cabecera de documento, barra superior, cabecera, pie y botón flotante: la estructura que se copia a las demás páginas | épicas 2 y 3 |
| `tests/pages.test.js` | comprueba cada página que devuelve `pageFiles()` | épicas 2 y 3 |
| `css/styles.css` | componentes compartidos (`.btn`, `.chip`, `.card`, `.arch`, `.eyebrow`, `.price`, `.hours`, `.icon`) y de estructura | épicas 2 y 3 |

## Conventions that bite in this area

- Todo hex vive en `css/tokens.css`; `css/styles.css` solo usa `var(--…)`. El test lo comprueba.
- Mobile-first: solo `@media (min-width: 600px | 760px | 900px | 1200px)`. **Nunca `max-width` en una media query.**
- El orden del código fuente importa: el botón `.nav-toggle` va **antes** del `nav#site-menu` (orden de foco); la tarjeta del hero va **después** de la foto (en móvil, debajo).
- La tarjeta del hero es **opaca**: sin `backdrop-filter` en ningún sitio.
- Los textos salen de `docs/contenido-fuente.md` (PARTE 1 literal, PARTE 3 nueva). No inventes ni reescribas.
- El texto de respaldo de precio y duración en el HTML debe ser el que escribe `main.js` desde `data.js` (con espacio duro U+00A0 antes de `€`).
- `npm run fonts` necesita red; si no la hay, detente y repórtalo (no sustituyas fuentes).
- Las rutas de `tools/smoke.mjs` van **sin barra inicial** (`./` es la portada) por Git Bash en Windows.

Reglas completas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/css.md`, `html.md`, `js-tools.md` y `tests.md`. Todos están en la raíz del proyecto.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el orden de construcción: trabaja de arriba abajo y no reordenes por prioridad.

### `E1-T1` — Línea base y primer artefacto servido

**Depends on:** nothing · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Deja la demo B en un estado en el que ya se sirve, se construye y se prueba, antes de diseñar nada. El Bootstrap de §10 ya copió `workspace/` a la raíz del proyecto: `package.json`, `js/data.js`, `js/lib.js`, `js/main.js`, `tools/*.mjs`, `tests/*` (con `tests/fixtures/images.json`), `assets/` (fotos, iconos y `sprite.svg`), `robots.txt`, `sitemap.xml`, `docs/contenido-fuente.md` y la configuración de agente. **No los reescribas ni los edites en este paso.** Lo único que este paso crea son dos páginas provisionales, para que `tools/serve.mjs` y `tools/build.mjs` tengan algo que servir y copiar. Se sustituyen en los pasos 3 y 11.

Crea `index.html` con exactamente este contenido:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centro Aura · Demo B en construcción</title>
</head>
<body>
  <main id="contenido"><h1>Centro Aura · Demo B</h1><p>En construcción.</p></main>
</body>
</html>
```

Crea `404.html` con exactamente este contenido:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página no encontrada · Centro Aura</title>
</head>
<body>
  <main id="contenido"><h1>404</h1><p>Página no encontrada.</p></main>
</body>
</html>
```

Después ejecuta los gates de Verify. `tools/smoke.mjs` arranca `node tools/serve.mjs` por ti, comprueba los códigos HTTP y lo para: sus rutas se escriben **sin barra inicial** (`./` es la portada) porque Git Bash en Windows convierte los argumentos que empiezan por `/` en rutas de disco. Sus códigos de salida son: 0 todo bien, 1 algún código HTTP no coincide, 2 uso incorrecto, 3 puerto ocupado o servidor que no arranca, 70 error inesperado (una caída del script nunca coincide con un código documentado). Los gates que esperan un código distinto de 0 comprueban además la **salida** (`FAIL /` o `Uso:`), para que no pasen por una caída.

**Files**
- `index.html` — new
- `404.html` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with 0 failed and 0 skipped, running `tests/data.test.js`, `tests/lib.test.js`, `tests/assets.test.js`, `tests/domain.test.js` and `tests/tooling.test.js`, and with `tests/tooling.test.js` asserting that every `tests/*.test.js` file contains at least one `test(` call so that an empty test file cannot pass.
2. **WHEN** `node tools/smoke.mjs . 4179 ./=200 index.html=200 no-existe=404` runs **THE SYSTEM SHALL** start `node tools/serve.mjs` on port 4179, receive the statuses 200, 200 and 404, stop the server and exit 0.
3. **WHEN** `npm run build` runs **THE SYSTEM SHALL** exit 0 and write `dist/index.html`, `dist/404.html`, `dist/robots.txt` and `dist/sitemap.xml`, and SHALL NOT copy any `CREDITOS.md` or `.gitkeep` file into `dist/`.
4. **WHEN** `node tools/smoke.mjs dist 4179 ./=200 no-existe=404 robots.txt=200 sitemap.xml=200` runs **THE SYSTEM SHALL** serve the built `dist/` folder and exit 0.
5. **WHEN** `node tools/smoke.mjs . 4179 ./=999` runs **THE SYSTEM SHALL** exit with code 1 and print a line starting with `FAIL /`, and WHEN it receives no route to check it SHALL exit with code 2 and print a line starting with `Uso:`.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 24 ? 0 : 1)"
npm test
node tools/smoke.mjs . 4179 ./=200 index.html=200 no-existe=404
npm run build
test -f dist/index.html && test -f dist/404.html && test -f dist/robots.txt && test -f dist/sitemap.xml
test ! -e dist/assets/img/CREDITOS.md && test ! -e dist/css/.gitkeep && test ! -e dist/pages/.gitkeep
node tools/smoke.mjs dist 4179 ./=200 no-existe=404 robots.txt=200 sitemap.xml=200
rc=0; out=$(node tools/smoke.mjs . 4179 ./=999) || rc=$?; test "$rc" -eq 1 && echo "$out" | grep -q "FAIL /"
rc=0; out=$(node tools/smoke.mjs . 4179 2>&1) || rc=$?; test "$rc" -eq 2 && echo "$out" | grep -q "Uso:"
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 1: baseline"
git tag step-01-baseline
git rev-parse -q --verify refs/tags/step-01-baseline >/dev/null
git ls-files --error-unmatch index.html 404.html >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-01-baseline` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-01-baseline` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E1-T2` — Tipografías propias, tokens y CSS base

**Depends on:** `E1-T1` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Crea la base visual de §7. **Requiere red solo para el primer comando** (`npm run fonts` descarga de Google Fonts); si no hay red, detente y repórtalo: no inventes tipografías ni las sustituyas por otras.

1. Ejecuta `npm run fonts`. Genera `css/fonts.css` y los `woff2` en `assets/fonts/`. Deben existir exactamente `assets/fonts/cormorant-garamond-normal.woff2`, `assets/fonts/cormorant-garamond-italic.woff2` y `assets/fonts/dm-sans-normal.woff2` (las páginas precargan `cormorant-garamond-normal.woff2` y `dm-sans-normal.woff2`; la itálica se carga cuando hace falta). Si el script crea nombres con rangos de peso (`…-400-600.woff2`), detente y repórtalo: significa que Google ha dejado de servir fuentes variables y hay que revisar la decisión de tipografías antes de seguir. **No escribas hashes ni versiones de los archivos.**
2. Crea `css/tokens.css` con exactamente este contenido. Es el único archivo del proyecto donde aparece un valor hexadecimal:

```css
/* Centro Aura · demo B — tokens de diseño.
   Capa 1: primitivas (los únicos hex del proyecto).
   Capa 2: semánticos, por rol. Los componentes (capa 3, en styles.css) solo usan var(--…). */
:root {
  /* Capa 1 · primitivas */
  --p-cream-50: #FFFDF7;
  --p-cream-100: #F6F0E4;
  --p-sand-200: #E9DDC8;
  --p-sand-400: #B2A38F;
  --p-gold-400: #D2C244;
  --p-cocoa-500: #8C7F6D;
  --p-cocoa-600: #6B6153;
  --p-cocoa-700: #4A4238;
  --p-cocoa-900: #3F372D;
  --p-clay-100: #EAD3C6;
  --p-clay-600: #9A5B43;
  --p-brick-700: #9B3D2E;

  /* Capa 2 · semánticos */
  --c-bg: var(--p-cream-50);
  --c-bg-alt: var(--p-cream-100);
  --c-line: var(--p-sand-200);
  --c-muted: var(--p-sand-400);        /* SOLO decorativo: nunca como color de texto */
  --c-gold: var(--p-gold-400);         /* SOLO decorativo: loto y filetes, nunca como texto */
  --c-text: var(--p-cocoa-700);
  --c-text-soft: var(--p-cocoa-600);
  --c-border: var(--p-cocoa-500);
  --c-error: var(--p-brick-700);
  --c-anchor: var(--p-cocoa-900);      /* banda "cacao" oscura */
  --c-on-anchor: var(--p-cream-50);
  --c-on-anchor-soft: var(--p-sand-200);
  --c-clay: var(--p-clay-600);         /* acento de texto: palabra en cursiva, enlaces */
  --c-clay-soft: var(--p-clay-100);    /* fondo de chips; el texto va en --c-anchor */

  /* Velos sobre foto. Los números repiten --c-anchor y --c-bg; tests/css.test.js lo comprueba. */
  --veil-dark-rgb: 63 55 45;
  --veil-dark-alpha: 0.82;
  --veil-light-rgb: 255 253 247;
  --veil-light-alpha: 0.82;

  /* Tipografía */
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-body: 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --fs-base: 1.0625rem;
  --lh-base: 1.65;
  --fs-h1: clamp(2.75rem, 7vw, 5.25rem);
  --fs-h2: clamp(2rem, 4.2vw, 3.1rem);
  --fs-h3: clamp(1.4rem, 2.6vw, 1.75rem);
  --fs-eyebrow: 0.75rem;
  --ls-eyebrow: 0.14em;
  --lh-h1: 1.05;
  --lh-h2: 1.12;
  --lh-h3: 1.2;

  /* Espaciado (escala de 4 px) */
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-6: 1.5rem;
  --s-8: 2rem;
  --s-12: 3rem;
  --s-16: 4rem;
  --s-24: 6rem;
  --s-32: 8rem;

  /* Formas, sombra, medidas y movimiento */
  --r-pill: 999px;
  --r-card: 24px;
  --r-arch: 999px 999px 24px 24px;
  --r-curve: 32px;
  --shadow-soft: 0 12px 32px -16px rgb(63 55 45 / 0.28);
  --container: 1200px;
  --measure: 62ch;
  --header-h: 72px;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --dur: 280ms;
}
```

**Pares de contraste** (los comprueba el test del punto 4; razones calculadas con la fórmula WCAG 2.2 al escribir este blueprint):

| Primer plano | Fondo | Mínimo | Razón | Uso |
|---|---|---|---|---|
| `--c-text` | `--c-bg` | 4,5 | 9,70 | texto de cuerpo |
| `--c-text` | `--c-bg-alt` | 4,5 | 8,70 | texto sobre bandas claras |
| `--c-text-soft` | `--c-bg` | 4,5 | 5,97 | texto secundario |
| `--c-text-soft` | `--c-bg-alt` | 4,5 | 5,35 | texto secundario sobre banda |
| `--c-clay` | `--c-bg` | 4,5 | 5,22 | enlaces, eyebrow, palabra en cursiva |
| `--c-clay` | `--c-bg-alt` | 4,5 | 4,68 | ídem sobre banda |
| `--c-error` | `--c-bg` | 4,5 | 6,66 | mensajes de error |
| `--c-error` | `--c-bg-alt` | 4,5 | 5,97 | ídem sobre banda |
| `--c-on-anchor` | `--c-anchor` | 4,5 | 11,50 | texto sobre la banda cacao y el pie |
| `--c-on-anchor-soft` | `--c-anchor` | 4,5 | 8,71 | texto secundario sobre cacao |
| `--c-anchor` | `--c-clay-soft` | 4,5 | 8,15 | texto de chips |
| `--c-text` | `--c-clay-soft` | 4,5 | 6,88 | texto sobre chips |
| `--c-border` | `--c-bg` | 3 | 3,84 | borde de campos y botones de contorno |
| `--c-border` | `--c-bg-alt` | 3 | 3,44 | ídem sobre banda |
| `--c-anchor` | `--c-bg` | 3 | 11,50 | anillo de foco |
| `--c-on-anchor` sobre velo oscuro (`--veil-dark-rgb` al `--veil-dark-alpha` sobre blanco puro) | — | 4,5 | 6,59 | título del banner regalo |
| `--c-on-anchor-soft` sobre velo oscuro (ídem) | — | 4,5 | 4,99 | palabra en cursiva del banner |
| `--c-text` sobre velo claro (`--veil-light-rgb` al `--veil-light-alpha` sobre negro puro) | — | 4,5 | 6,36 | título y texto de la cabecera de página |

Los hex de partida cumplen todos los pares con margen: **no se ajusta ningún tono**. Si algún día se cambia un hex, se cambia a la vez en `css/tokens.css`, en la tabla de `tests/css.test.js`, en la sección de diseño del blueprint (§7) y en `CLAUDE.md`.

3. Crea `css/styles.css` (mobile-first: la base es el móvil; solo se amplía con `@media (min-width: 600px | 760px | 900px | 1200px)`; **jamás `max-width` en una media query**). En este paso solo la capa de base y los componentes compartidos de §7, cada uno con las declaraciones de esta tabla: reset y `html`/`body`, tipografía y `em` de títulos, `.container`, `.section` (+ `.section--alt`), `.section-head`, `.eyebrow`, `.lead`, `.visually-hidden`, `.skip-link`, `.icon`, `.btn` (+ `--primary`, `--outline`, `--light`, `--sm`) con `.btn__icon`, `.chip`, `.link-arrow`, `.price`, `.card`, `.arch`, `:focus-visible`, `.reveal` y el bloque `@media (prefers-reduced-motion: reduce)`. Las secciones de página se añaden en pasos posteriores.

| Componente | Declaraciones obligatorias (todos los valores salen de `css/tokens.css`) |
|---|---|
| Reset y `body` | `*, *::before, *::after { box-sizing: border-box; }` · `body { margin: 0; background: var(--c-bg); color: var(--c-text); font: 400 var(--fs-base)/var(--lh-base) var(--font-body); }` · `img { display: block; max-width: 100%; height: auto; }` |
| Títulos | `h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: 500; }` · `h1 { font-size: var(--fs-h1); line-height: var(--lh-h1); }` · `h2 { font-size: var(--fs-h2); line-height: var(--lh-h2); }` · `h3 { font-size: var(--fs-h3); line-height: var(--lh-h3); }` · `h1 em, h2 em, h3 em { font-style: italic; font-weight: 500; color: var(--c-clay); }` (en bandas oscuras la `em` pasa a `var(--c-on-anchor-soft)`) |
| `.container` | `width: min(100% - 2 * var(--s-4), var(--container)); margin-inline: auto;` y desde 760 px `width: min(100% - 2 * var(--s-8), var(--container));` |
| `.section` / `.section--alt` | `padding-block: var(--s-16);` (desde 900 px `var(--s-24)`) · `--alt`: `background: var(--c-bg-alt);` |
| `.section-head` | `max-width: var(--measure); margin: 0 0 var(--s-8);` · `.section-head--center { margin-inline: auto; text-align: center; }` |
| `.eyebrow` | `display: block; margin-bottom: var(--s-3); font: 500 var(--fs-eyebrow)/1.4 var(--font-body); letter-spacing: var(--ls-eyebrow); text-transform: uppercase; color: var(--c-clay);` |
| `.lead` | `max-width: var(--measure); font-size: 1.125rem; color: var(--c-text-soft);` |
| `.visually-hidden` | patrón estándar: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;` |
| `.skip-link` | `position: absolute; left: var(--s-4); top: -100px; z-index: 100; padding: var(--s-3) var(--s-6); background: var(--c-anchor); color: var(--c-on-anchor); border-radius: var(--r-pill);` y `:focus { top: var(--s-4); }` |
| `.icon` | `width: 1.25rem; height: 1.25rem; flex: none;` · `.icon--lg { width: 1.75rem; height: 1.75rem; }` (los iconos se pintan con `currentColor`) |
| `.btn` | `display: inline-flex; align-items: center; justify-content: center; gap: var(--s-3); min-height: 48px; padding: 0 var(--s-6); border: 1.5px solid transparent; border-radius: var(--r-pill); font: 500 0.9375rem/1 var(--font-body); text-decoration: none; cursor: pointer; transition: background var(--dur) var(--ease), color var(--dur) var(--ease);` |
| `.btn--primary` | `background: var(--c-anchor); color: var(--c-on-anchor); padding-right: var(--s-2);` · `.btn__icon { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--c-on-anchor); color: var(--c-anchor); }` |
| `.btn--outline` | `background: transparent; color: var(--c-anchor); border-color: var(--c-border);` |
| `.btn--light` | `background: var(--c-on-anchor); color: var(--c-anchor);` (sobre fondos oscuros) · `.btn--sm { min-height: 44px; padding: 0 var(--s-4); }` |
| `.chips` / `.chip` | `.chips { display: flex; flex-wrap: wrap; gap: var(--s-2); }` · `.chip { display: inline-flex; align-items: center; min-height: 28px; padding: 0 var(--s-3); border-radius: var(--r-pill); background: var(--c-clay-soft); color: var(--c-anchor); font: 500 0.75rem/1 var(--font-body); }` |
| `.link-arrow` | `display: inline-flex; align-items: center; gap: var(--s-2); min-height: 44px; font-weight: 500; color: var(--c-clay); text-decoration: underline; text-underline-offset: 0.25em;` y `::after { content: "→"; }` |
| `.price` | `font: 500 1.5rem/1 var(--font-display); color: var(--c-text);` (las cifras van en Cormorant) |
| `.card` | `background: var(--c-bg); border: 1px solid var(--c-line); border-radius: var(--r-card); overflow: hidden;` |
| `.arch` | `border-radius: var(--r-arch); overflow: hidden; background: var(--c-bg-alt);` |
| `.hours` | `display: grid; grid-template-columns: auto 1fr; gap: var(--s-1) var(--s-6); margin: 0;` · `.hours dt { font-weight: 500; }` · `.hours dd { margin: 0; }` |
| Foco | `:focus-visible { outline: 2px solid var(--c-anchor); outline-offset: 3px; }` y, dentro de `.pillars`, `.site-footer`, `.gift-banner` y `.site-nav`, `outline-color: var(--c-on-anchor);` |
| Aparición | `.reveal-ready .reveal { opacity: 0; transform: translateY(12px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }` · `.reveal-ready .reveal.is-visible { opacity: 1; transform: none; }` |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } .reveal { opacity: 1 !important; transform: none !important; } }` |
| Atributo `hidden` | `[hidden] { display: none !important; }` (base: sin esta regla `.btn { display: inline-flex; }` mostraría el botón oculto del mapa cuando no hay JavaScript) |

4. Crea `tests/css.test.js` (CommonJS, `node:test`, sin dependencias, lee `css/*.css` con `read()` de `tests/helpers.js`). Debe contener estas aserciones:
   - **Mobile-first:** ninguna media query de `css/styles.css` contiene `max-width`, y las únicas anchuras `min-width` usadas están en el conjunto `{600, 760, 900, 1200}`.
   - **Sin hex fuera de tokens:** ningún valor hexadecimal (`#` + 3, 4, 6 u 8 dígitos) en `css/styles.css` ni en `css/fonts.css`.
   - **Tokens:** `css/tokens.css` define cada token semántico `--c-*` de la lista de esta sección y cada uno resuelve (siguiendo `var(--p-…)`) al hex de la lista; `--veil-dark-rgb` equivale al hex de `--c-anchor` y `--veil-light-rgb` al de `--c-bg`.
   - **Contraste WCAG** (función de luminancia relativa escrita en el propio test): cada par de la tabla "Pares de contraste" de abajo cumple su mínimo (4,5 texto normal · 3 texto grande o interfaz), incluidos los tres pares de velo calculados en el peor caso (velo oscuro sobre blanco; velo claro sobre negro) por composición alfa.
   - **Decorativos:** `var(--c-muted)` y `var(--c-gold)` no aparecen como valor de la propiedad `color` en `css/styles.css`.
   - **Tipografías:** `--font-body` empieza por `'DM Sans'`, `--font-display` por `'Cormorant Garamond'`, y la palabra `Jost` no aparece en ningún `css/*.css`; cada `@font-face` de `css/fonts.css` lleva `font-display: swap` y su `url('../assets/fonts/…')` apunta a un archivo que existe; están declaradas `Cormorant Garamond` normal e itálica y `DM Sans` normal.
   - **Movimiento:** `css/styles.css` contiene `@media (prefers-reduced-motion: reduce)`; contiene `:focus-visible` con `outline: 2px solid`; contiene `[hidden] { display: none !important; }`.

**Files**
- `css/tokens.css` — new
- `css/styles.css` — new
- `css/fonts.css` — generado por `npm run fonts`
- `assets/fonts/*.woff2` — generado por `npm run fonts`
- `tests/css.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `npm run fonts` runs with network access **THE SYSTEM SHALL** exit 0, write `assets/fonts/cormorant-garamond-normal.woff2`, `assets/fonts/cormorant-garamond-italic.woff2` and `assets/fonts/dm-sans-normal.woff2`, and generate `css/fonts.css` with `font-display: swap` in every `@font-face`.
2. **WHEN** `node --test tests/css.test.js` runs **THE SYSTEM SHALL** exit 0 with every foreground/background pair of the contrast table meeting 4.5 (normal text) or 3 (large text and interface), including the two veil composites computed at their worst case.
3. **WHEN** `node --test tests/css.test.js` runs **THE SYSTEM SHALL** report no `max-width` inside any `@media` query of `css/styles.css` and only `min-width` values in {600, 760, 900, 1200}.
4. **WHEN** `node --test tests/css.test.js` runs **THE SYSTEM SHALL** find no hexadecimal color in `css/styles.css` or `css/fonts.css`, `--c-muted` and `--c-gold` never used as `color`, and the word `Jost` in no stylesheet.
5. **WHEN** `node tools/smoke.mjs . 4179 css/tokens.css=200 css/styles.css=200 css/fonts.css=200 assets/fonts/dm-sans-normal.woff2=200` runs **THE SYSTEM SHALL** exit 0.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the baseline of step 1 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
test -f assets/fonts/cormorant-garamond-normal.woff2 && test -f assets/fonts/cormorant-garamond-italic.woff2 && test -f assets/fonts/dm-sans-normal.woff2
test -f css/fonts.css && test -f css/tokens.css && test -f css/styles.css
node --test tests/css.test.js
node tools/smoke.mjs . 4179 css/tokens.css=200 css/styles.css=200 css/fonts.css=200 assets/fonts/dm-sans-normal.woff2=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 2: tokens-css"
git tag step-02-tokens-css
git rev-parse -q --verify refs/tags/step-02-tokens-css >/dev/null
git ls-files --error-unmatch css/tokens.css css/styles.css css/fonts.css tests/css.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-02-tokens-css` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-02-tokens-css` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E1-T3` — Estructura común, menú, pie y comportamiento

**Depends on:** `E1-T2` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Construye la estructura que comparten las siete páginas y deja `index.html` como su primera instancia. `js/main.js` y `assets/icons/sprite.svg` ya vienen entregados en `workspace/` (contratos en §19.6): este paso los **conecta** con el HTML y el CSS y los **prueba**.

1. Sustituye `index.html` por la estructura de abajo. Es el contenido exacto del `<head>` y de la cabecera, el pie y el botón flotante; el `<main>` es provisional (lo sustituyen los pasos 4 a 7). Cada página del sitio la copia con dos cambios mecánicos: en las páginas de `pages/` se antepone `../` a toda ruta local (`assets/`, `css/`, `js/`, `index.html`) y los enlaces entre páginas, **incluidos los del pie** (`Aviso legal`, `Privacidad y cookies`), pasan a `servicios.html`, `tienda.html`, `contacto.html`, `aviso-legal.html`, `privacidad.html` (nunca `pages/…`); y el `aria-current="page"` va en el enlace de la propia página. Cada página cambia además su `<title>`, `meta description`, `canonical`, `og:*` y su `<main>`.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centro Aura · Spa capilar y tricología en Las Cabezas de San Juan</title>
  <meta name="description" content="Peluquería, spa capilar, barros, alisados y antifrizz en Las Cabezas de San Juan (Sevilla). Cosmética natural Jaldún y tarjetas regalo.">
  <link rel="canonical" href="https://centro-aura-2.vercel.app/">
  <meta name="theme-color" content="#FFFDF7">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Centro Aura">
  <meta property="og:title" content="Centro Aura · Spa Capilar · Tricología">
  <meta property="og:description" content="Cuidamos tu cabello desde la raíz. Peluquería, spa capilar y tricología en Las Cabezas de San Juan.">
  <meta property="og:url" content="https://centro-aura-2.vercel.app/">
  <meta property="og:image" content="https://centro-aura-2.vercel.app/assets/img/hero-salon.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js');</script>
  <link rel="preload" href="assets/fonts/cormorant-garamond-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/dm-sans-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/data.js" defer></script>
  <script src="js/lib.js" defer></script>
  <script src="js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>

  <div class="topbar">
    <div class="container topbar__inner">
      <p class="topbar__item"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-pin"/></svg>Las Cabezas de San Juan</p>
      <p class="topbar__item"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-reloj"/></svg><span data-hours-summary>L–V 9:30–14:00 · 17:00–20:30</span></p>
      <a class="topbar__item topbar__phone" href="tel:+34610167764"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-telefono"/></svg><span data-phone>+34 610 16 77 64</span></a>
    </div>
  </div>

  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html" aria-label="Centro Aura, inicio">
        <span class="brand__name">AURA</span>
        <span class="brand__rule" aria-hidden="true"></span>
        <span class="brand__tag">Spa Capilar · Tricología</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Abrir menú">
        <svg class="icon icon--open" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-menu"/></svg>
        <svg class="icon icon--close" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-cerrar"/></svg>
      </button>
      <nav class="site-nav" id="site-menu" aria-label="Principal">
        <ul class="site-nav__list">
          <li><a href="index.html" aria-current="page">Inicio</a></li>
          <li><a href="pages/servicios.html">Servicios</a></li>
          <li><a href="pages/tienda.html">Tienda</a></li>
          <li><a href="pages/contacto.html">Contacto</a></li>
        </ul>
        <a class="btn btn--primary site-nav__cta" href="https://wa.me/34610167764" data-wa="">Reservar<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-flecha"/></svg></span></a>
      </nav>
    </div>
  </header>

  <main id="contenido">
    <section class="shell-placeholder">
      <div class="container"><h1>Centro Aura</h1></div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <a class="brand brand--on-anchor" href="index.html" aria-label="Centro Aura, inicio">
          <span class="brand__name">AURA</span>
          <span class="brand__rule" aria-hidden="true"></span>
          <span class="brand__tag">Spa Capilar · Tricología</span>
        </a>
        <p class="site-footer__claim">Peluquería y salud capilar en Las Cabezas de San Juan.</p>
        <a class="btn btn--light" href="https://wa.me/34610167764" data-wa="">Reservar por WhatsApp</a>
      </div>
      <div>
        <h2 class="site-footer__title">Visítanos</h2>
        <address>C/ Dr. Domingo Gallego, 3<br>41730 Las Cabezas de San Juan<br>Sevilla</address>
        <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan" target="_blank" rel="noopener">Cómo llegar</a>
      </div>
      <div>
        <h2 class="site-footer__title">Horario</h2>
        <dl class="hours" data-hours>
          <dt>Lunes – Viernes</dt><dd>9:30 – 14:00 · 17:00 – 20:30</dd>
          <dt>Sábado</dt><dd>9:30 – 14:00</dd>
          <dt>Domingo</dt><dd>Cerrado</dd>
        </dl>
      </div>
      <div>
        <h2 class="site-footer__title">Contacto</h2>
        <ul class="site-footer__list" role="list">
          <li><a href="tel:+34610167764" data-phone>+34 610 16 77 64</a></li>
          <li><a href="https://wa.me/34610167764" data-wa="">WhatsApp</a></li>
          <li><a href="https://www.instagram.com/centro__aura/" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <nav aria-label="Pie">
        <ul class="site-footer__nav" role="list">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="pages/servicios.html">Servicios</a></li>
          <li><a href="pages/tienda.html">Tienda</a></li>
          <li><a href="pages/contacto.html">Contacto</a></li>
        </ul>
      </nav>
      <p>© 2026 Centro Aura</p>
      <p><a href="pages/aviso-legal.html">Aviso legal</a> · <a href="pages/privacidad.html">Privacidad y cookies</a></p>
    </div>
  </footer>

  <a class="wa-float" href="https://wa.me/34610167764" data-wa="" aria-label="Reservar por WhatsApp">
    <svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-whatsapp"/></svg>
  </a>
</body>
</html>
```

2. En `css/styles.css` añade el bloque "Estructura común" con estas declaraciones:

| Componente | Declaraciones obligatorias |
|---|---|
| `html` | `scroll-padding-top: calc(var(--header-h) + 16px);` y, desde 900 px, `:root { --header-h: 84px; }` |
| `.topbar` | `background: var(--c-bg-alt); border-bottom: 1px solid var(--c-line); font-size: 0.8125rem; color: var(--c-text-soft);` · `.topbar__inner { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-1) var(--s-6); padding-block: var(--s-2); }` · `.topbar__item { display: inline-flex; align-items: center; gap: var(--s-2); margin: 0; }` · `.topbar__phone { display: none; color: var(--c-text); }` y desde 600 px `display: inline-flex;` · desde 900 px `.topbar__inner { justify-content: space-between; }` |
| `.site-header` | `position: sticky; top: 0; z-index: 50; background: var(--c-bg); border-bottom: 1px solid var(--c-line);` · `.site-header__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; min-height: var(--header-h); }` |
| `.brand` | `display: inline-flex; flex-direction: column; align-items: center; color: var(--c-text); text-decoration: none;` · `.brand__name { font: 500 1.75rem/1 var(--font-display); letter-spacing: 0.32em; padding-left: 0.32em; }` · `.brand__rule { width: 48px; height: 1px; margin: 4px 0; background: var(--c-gold); }` · `.brand__tag { font: 500 0.625rem/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase; color: var(--c-text-soft); }` · `.brand--on-anchor { color: var(--c-on-anchor); }` y su `.brand__tag` en `var(--c-on-anchor-soft)` |
| `.nav-toggle` | sin JS: `display: none;` · `.js .nav-toggle { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border: 1.5px solid var(--c-border); border-radius: var(--r-pill); background: transparent; color: var(--c-text); }` · `.icon--close { display: none; }` y con `.nav-toggle[aria-expanded="true"]` se oculta `.icon--open` y se muestra `.icon--close` · desde 900 px `.js .nav-toggle { display: none; }` |
| `.site-nav` (sin JS) | una fila de enlaces bajo la marca: `display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-4) var(--s-6); width: 100%; padding-block: var(--s-3);` |
| `.js .site-nav` (menú móvil) | `position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--s-8); padding: calc(var(--header-h) + var(--s-6)) var(--s-6) var(--s-8); background: var(--c-bg); visibility: hidden; opacity: 0; transition: opacity var(--dur) var(--ease), visibility 0s linear var(--dur);` · `body.menu-open .site-nav { visibility: visible; opacity: 1; transition-delay: 0s; }` · `body.menu-open { overflow: hidden; }` · `.js .brand, .js .nav-toggle { position: relative; z-index: 2; }` · enlaces del menú: `.site-nav__list a { font: 500 2rem/1.2 var(--font-display); color: var(--c-text); text-decoration: none; }` |
| `.site-nav` desde 900 px | `.js .site-nav { position: static; inset: auto; z-index: auto; flex-direction: row; width: auto; padding: 0; background: transparent; visibility: visible; opacity: 1; gap: var(--s-8); }` · `.site-nav__list { display: flex; gap: var(--s-6); margin: 0; padding: 0; list-style: none; }` · `.site-nav__list a { font: 500 0.9375rem/1 var(--font-body); }` · `[aria-current="page"] { color: var(--c-clay); text-decoration: underline; text-underline-offset: 0.5em; }` |
| `.site-footer` | `background: var(--c-anchor); color: var(--c-on-anchor-soft); padding-block: var(--s-16) var(--s-8);` · `.site-footer a { color: var(--c-on-anchor); }` · `.site-footer__grid { display: grid; gap: var(--s-12); }` y desde 600 px `grid-template-columns: repeat(2, 1fr);` y desde 900 px `grid-template-columns: 1.3fr 1fr 1fr 1fr;` · `.site-footer__title { margin: 0 0 var(--s-4); font: 500 var(--fs-eyebrow)/1.4 var(--font-body); letter-spacing: var(--ls-eyebrow); text-transform: uppercase; color: var(--c-on-anchor-soft); }` · `.site-footer__claim { max-width: 32ch; }` · `.site-footer .hours dt { color: var(--c-on-anchor); }` · `.site-footer__bottom { display: flex; flex-wrap: wrap; gap: var(--s-3) var(--s-8); justify-content: space-between; margin-top: var(--s-12); padding-top: var(--s-6); border-top: 1px solid var(--c-text-soft); font-size: 0.875rem; }` · listas del pie sin viñetas y con `gap: var(--s-2)` |
| `.wa-float` | `position: fixed; right: var(--s-4); bottom: var(--s-4); z-index: 40; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: var(--c-anchor); color: var(--c-on-anchor); box-shadow: var(--shadow-soft);` y, desde 900 px, `display: none;` |

Cubre `.topbar`, `.site-header` (sticky), `.brand`, `.nav-toggle`, `.site-nav` (menú a pantalla completa en móvil, en línea desde 900 px), `.site-footer` y `.wa-float`. Debe contener estas reglas, que `tests/shell.test.js` comprueba: `html { scroll-padding-top: calc(var(--header-h) + 16px); }`; `.site-header { position: sticky; top: 0; … }`; `.js .site-nav { position: fixed; … }` oculto con `visibility: hidden` hasta que `body.menu-open` lo muestra; `body.menu-open { overflow: hidden; }`; sin `.js` el menú se ve como una fila de enlaces bajo la marca; y, dentro de `@media (min-width: 900px)`, `.js .nav-toggle { display: none; }` y `.wa-float { display: none; }`.
3. Crea `tests/pages.test.js` (CommonJS, `node:test`; recorre `pageFiles()` de `tests/helpers.js`, así que cada página nueva queda cubierta sola; la 404 se prueba en el paso 11). Por cada página `rel` (`prefix` es `'../'` si `rel` empieza por `pages/` y vacío en caso contrario):
   - **Estructura:** `<html lang="es">`; ningún comentario HTML `<!--` salvo el comentario `BORRADOR` de las dos páginas legales; exactamente un `h1`; `<title>` de 10 a 70 caracteres; `meta description` de 50 a 200; `<main id="contenido">`; `a.skip-link` con `href="#contenido"`; los niveles de encabezado no saltan (tras un `h1` solo puede venir `h2`, tras `h2` solo `h3`, y así; sí se puede bajar de nivel).
   - **SEO por página:** `canonical` absoluto `https://…` cuya ruta termina en la de la página (`/` para la portada); `og:url` igual al canonical; `og:image` absoluto a `/assets/img/*.webp` que existe en disco; el origen del canonical, tal como lo captura `/<link rel="canonical" href="(https:\/\/[^"/]+)/` (la misma expresión que usa `tools/set-domain.mjs`), es el de las `<loc>` de `sitemap.xml` y el de la línea `Sitemap:` de `robots.txt`.
   - **Carga:** el `<script>` inline que añade la clase `js` va antes de las hojas de estilo; los dos `<link rel="preload" … as="font" … crossorigin>` apuntan a `${prefix}assets/fonts/cormorant-garamond-normal.woff2` y `${prefix}assets/fonts/dm-sans-normal.woff2` y esos archivos existen; hojas `fonts.css`, `tokens.css`, `styles.css` en ese orden; scripts `data.js`, `lib.js`, `main.js` en ese orden, todos con `defer`; ni `fonts.googleapis`/`fonts.gstatic` ni `<iframe` en el HTML.
   - **Imágenes:** toda `<img>` lleva `alt`, `width` y `height`; para las `.webp` locales, `width` y `height` coinciden con el tamaño real del archivo (`webpSize`); todos los `id` son únicos; cada `data-price`/`data-duration` existe en `js/data.js`; todo `href`/`src` local (incluidos los `<use href="…sprite.svg#i-…">`, sin el fragmento) apunta a un archivo que existe y cada `#i-…` existe como símbolo en el sprite. **Salto explícito y exacto:** solo se salta un destino que, resuelto desde la raíz, sea exactamente una de estas cinco rutas y aún no exista en disco: `pages/servicios.html`, `pages/tienda.html`, `pages/contacto.html`, `pages/aviso-legal.html` y `pages/privacidad.html` (la portada enlaza a páginas que nacen en los pasos 8 a 11). Cualquier otro destino local inexistente, incluido `pages/pages/aviso-legal.html`, falla de inmediato. Que las seis páginas existen lo afirman `tests/seo.test.js` (paso 12) y `tests/deploy.test.js` (paso 15).
   - **Estructura común:** un `.topbar` antes de un `header.site-header`; un `button.nav-toggle` con `aria-expanded="false"` y `aria-controls="site-menu"` situado antes de `nav#site-menu`; el `nav` con `aria-label="Principal"` y los cuatro enlaces `Inicio`, `Servicios`, `Tienda`, `Contacto` en ese orden y exactamente un `aria-current="page"` (cero en `pages/aviso-legal.html` y `pages/privacidad.html`); `footer.site-footer` cuyos `h2` son `Visítanos`, `Horario`, `Contacto` y cuyos enlaces legales son `Aviso legal` y `Privacidad y cookies`; un `a.wa-float`; en las páginas de `pages/`, ninguna referencia local empieza por `pages/` ni `../pages/` (los enlaces hermanos son solo el nombre del archivo); todo `<a … data-wa=…>` lleva `href="https://wa.me/34610167764"` de respaldo y hay al menos tres.
4. Crea `tests/shell.test.js` con: (a) el texto de respaldo de `[data-hours-summary]` en `index.html` es `'L–V ' + data.hours[0].slots.map(s => s.replace(/ – /g, '–')).join(' · ')` calculado con `js/data.js`; (b) `js/main.js` contiene las cadenas del contrato (`'[data-hours-summary]'`, `closest('a[href^="tel:"]')`, `aria-expanded`, `'Escape'`, `.inert`, `IntersectionObserver`, `prefers-reduced-motion: reduce`, `data-map-load`, `form-summary`, `aria-controls`, `(min-width: 900px)`) y no contiene `max-width`; (c) `css/styles.css` contiene las reglas del punto 2.

**Files**
- `index.html` — edit
- `css/styles.css` — edit
- `tests/pages.test.js` — new
- `tests/shell.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/pages.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting, for every page `pageFiles()` returns, one `h1`, `lang="es"`, a `title` of 10 to 70 characters and a `meta description` of 50 to 200, `canonical` equal to `og:url` and ending in the page path, an absolute `og:image` that exists on disk, the inline `js` class script before the stylesheets, both font preloads pointing at existing files, the stylesheets in the order `fonts.css`, `tokens.css`, `styles.css`, the scripts in the order `data.js`, `lib.js`, `main.js`, and neither Google Fonts nor `<iframe` in the source, nor any HTML comment other than the BORRADOR note of the two legal pages, and a canonical origin that equals the origin of `sitemap.xml` and of the `Sitemap:` line of `robots.txt` and is captured by the same pattern `tools/set-domain.mjs` uses.
2. **WHEN** `node --test tests/pages.test.js` runs **THE SYSTEM SHALL** assert for every page that each `<img>` has `alt`, `width` and `height`, that each local WebP's `width` and `height` equal the real file size, that ids are unique, that every `data-price` and `data-duration` key exists in `js/data.js`, that every local `href`, `src` and sprite `use href` resolves to an existing file and symbol (only a link that, resolved from the root, is exactly `pages/servicios.html`, `pages/tienda.html`, `pages/contacto.html`, `pages/aviso-legal.html` or `pages/privacidad.html` and does not exist yet is skipped; any other missing local target, including `pages/pages/aviso-legal.html`, fails; `tests/seo.test.js` and `tests/deploy.test.js` assert that the six pages exist), and that every `a[data-wa]` carries `href="https://wa.me/34610167764"`.
3. **WHEN** `node --test tests/pages.test.js` runs **THE SYSTEM SHALL** assert for every page one `.topbar` before one `header.site-header`, a `button.nav-toggle` with `aria-expanded="false"` and `aria-controls="site-menu"` before `nav#site-menu`, the four links Inicio, Servicios, Tienda, Contacto with exactly one `aria-current="page"` (none on the two legal pages), a footer whose `h2` titles are Visítanos, Horario, Contacto, the legal links Aviso legal and Privacidad y cookies, one `a.wa-float`, and, on pages under `pages/`, no local reference that starts with `pages/` or `../pages/` (sibling links are bare file names).
4. **WHEN** `node --test tests/shell.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that the topbar fallback equals `L–V ` plus the first `data.hours` row's slots with ` – ` replaced by `–` and joined by ` · `, that `js/main.js` contains the contract strings listed in the step and no `max-width`, and that `css/styles.css` contains `scroll-padding-top`, a sticky `.site-header`, a fixed `.js .site-nav`, `body.menu-open` with `overflow: hidden`, and `.nav-toggle` and `.wa-float` set to `display: none` inside `@media (min-width: 900px)`.
5. **WHEN** `node --check js/main.js` runs **THE SYSTEM SHALL** exit 0, and WHEN `node tools/smoke.mjs . 4179 ./=200 js/main.js=200 assets/icons/sprite.svg=200 css/tokens.css=200` runs THE SYSTEM SHALL exit 0.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 and 2 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/pages.test.js
node --test tests/shell.test.js
node --check js/main.js
node tools/smoke.mjs . 4179 ./=200 js/main.js=200 assets/icons/sprite.svg=200 css/tokens.css=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 3: shell"
git tag step-03-shell
git rev-parse -q --verify refs/tags/step-03-shell >/dev/null
git ls-files --error-unmatch index.html css/styles.css tests/pages.test.js tests/shell.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-03-shell` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-03-shell` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E1-T4` — Portada A — hero con tarjeta flotante y banda de pilares

**Depends on:** `E1-T3` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Sustituye el `<section class="shell-placeholder">` de `index.html` por las dos primeras secciones de la portada. Los textos son los de `docs/contenido-fuente.md` PARTE 3 (no los reescribas). El orden del código fuente importa: en móvil la tarjeta va **debajo** de la foto y no encima.

```html
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__inner">
    <div class="hero__copy">
      <span class="eyebrow">Spa capilar · Tricología</span>
      <h1 class="hero__title" id="hero-title">Cuidamos tu cabello <em>desde la raíz</em></h1>
      <div class="actions">
        <a class="btn btn--primary" href="https://wa.me/34610167764" data-wa="">Reservar cita<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-flecha"/></svg></span></a>
        <a class="btn btn--outline" href="pages/servicios.html">Ver servicios</a>
      </div>
    </div>
    <div class="hero__media">
      <img class="hero__img" src="assets/img/hero-salon.webp" alt="Sillones de peluquería frente a espejos ovalados en el salón" width="2000" height="1333" fetchpriority="high">
    </div>
    <aside class="hero__card" aria-labelledby="hero-card-title">
      <h2 class="hero__card-title" id="hero-card-title">Horario</h2>
      <dl class="hours" data-hours>
        <dt>Lunes – Viernes</dt><dd>9:30 – 14:00 · 17:00 – 20:30</dd>
        <dt>Sábado</dt><dd>9:30 – 14:00</dd>
        <dt>Domingo</dt><dd>Cerrado</dd>
      </dl>
      <a class="link-arrow" href="pages/contacto.html">Ver contacto</a>
    </aside>
  </div>
</section>

<section class="pillars" aria-labelledby="pillars-title">
  <div class="container">
    <h2 class="visually-hidden" id="pillars-title">Lo que hacemos en Aura</h2>
    <ul class="pillars__list" role="list">
      <li class="pillar reveal">
        <svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-tijeras"/></svg>
        <h3>Peluquería titulada</h3>
        <p>Paula, peluquera titulada y fundadora de Centro Aura.</p>
      </li>
      <li class="pillar reveal">
        <svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-spa"/></svg>
        <h3>Spa capilar</h3>
        <p>Tres rituales: esencial, equilibrio y aura.</p>
      </li>
      <li class="pillar reveal">
        <svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-tricologia"/></svg>
        <h3>Tricología con microcámara</h3>
        <p>Vemos tu cuero cabelludo ampliado en pantalla y te explico lo que encontramos.</p>
      </li>
      <li class="pillar reveal">
        <svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-barro"/></svg>
        <h3>Cosmética natural Jaldún</h3>
        <p>Fitoterapia capilar para cada tipo de cuero cabelludo.</p>
      </li>
    </ul>
  </div>
</section>
```

CSS en `css/styles.css` (bloque "Portada · hero y pilares"), mobile-first:

| Componente | Declaraciones obligatorias |
|---|---|
| `.actions` | `display: flex; flex-wrap: wrap; gap: var(--s-3);` |
| `.hero` | `padding-block: var(--s-8) var(--s-12);` |
| `.hero__inner` | `display: grid; gap: var(--s-8);` · desde 900 px `position: relative; grid-template-columns: 5fr 7fr; align-items: center; gap: var(--s-12);` |
| `.hero__copy` | `.hero__title { font-size: var(--fs-h1); line-height: var(--lh-h1); margin-bottom: var(--s-6); }` (la `em` hereda el acento arcilla de los títulos) · `.hero .actions { margin-top: var(--s-8); }` |
| `.hero__media` | `overflow: hidden; border-radius: 0 0 var(--r-curve) var(--r-curve);` · desde 900 px `:root { --r-curve: 64px; }` · `.hero__img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }` y desde 900 px `aspect-ratio: auto; height: 100%; min-height: 560px;` |
| `.hero__card` | `background: var(--c-bg); border: 1px solid var(--c-line); border-radius: var(--r-card); box-shadow: var(--shadow-soft); padding: var(--s-6);` (**opaca, nunca cristal: sin `backdrop-filter` en todo el CSS**) · desde 900 px `position: absolute; right: var(--s-8); bottom: calc(var(--s-8) * -1); width: min(320px, 100%);` y `.hero` gana `padding-bottom: var(--s-24);` · `.hero__card-title { font-size: 1.5rem; margin-bottom: var(--s-3); }` |
| `.pillars` | `background: var(--c-anchor); color: var(--c-on-anchor); padding-block: var(--s-12);` · `.pillars__list { display: grid; gap: var(--s-8); margin: 0; padding: 0; list-style: none; }` con 2 columnas desde 600 px y 4 desde 900 px |
| `.pillar` | `display: grid; gap: var(--s-3); justify-items: start;` · `.pillar .icon { color: var(--c-on-anchor-soft); }` · `.pillar h3 { font-size: 1.5rem; color: var(--c-on-anchor); }` · `.pillar p { margin: 0; color: var(--c-on-anchor-soft); }` |

Crea `tests/inicio.test.js` (CommonJS, `node:test`; carga `index.html` con `read()` y `js/data.js`; los pasos 5, 6 y 7 **añaden** aserciones a este mismo archivo). En este paso aserta:
- `<main>` empieza por `section.hero` y la sigue `section.pillars`; no queda `shell-placeholder`.
- Hero: el `h1` (sin etiquetas) es `Cuidamos tu cabello desde la raíz` y contiene `<em>desde la raíz</em>`; eyebrow `Spa capilar · Tricología`; `img.hero__img` con `hero-salon.webp`, `width="2000"`, `height="1333"`, `fetchpriority="high"` y `alt` no vacío; botón `Reservar cita` con `data-wa=""` y href de respaldo de WhatsApp; enlace `Ver servicios` a `pages/servicios.html`.
- Tarjeta: `aside.hero__card` aparece **después** de `.hero__media` en el código fuente y no está dentro de él; contiene `dl[data-hours]` con las tres filas de respaldo y el enlace `Ver contacto` a `pages/contacto.html`.
- Pilares: `h2` oculto `Lo que hacemos en Aura`; exactamente cuatro `li.pillar` con los títulos `Peluquería titulada`, `Spa capilar`, `Tricología con microcámara`, `Cosmética natural Jaldún` y los iconos `i-tijeras`, `i-spa`, `i-tricologia`, `i-barro` en ese orden.
- CSS: `.pillars` con `background: var(--c-anchor)`; `.hero__card` con `background: var(--c-bg)`; `.hero__media` con `border-radius: 0 0 var(--r-curve) var(--r-curve)`; la cadena `backdrop-filter` no aparece en `css/styles.css`.

**Files**
- `index.html` — edit
- `css/styles.css` — edit
- `tests/inicio.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that `main` starts with `section.hero` followed by `section.pillars`, that the `h1` reads "Cuidamos tu cabello desde la raíz" with `<em>desde la raíz</em>`, and that `img.hero__img` is `hero-salon.webp` at 2000×1333 with `fetchpriority="high"` and a non-empty `alt`.
2. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the hero has the buttons "Reservar cita" (`data-wa` with the `wa.me/34610167764` fallback) and "Ver servicios" (to `pages/servicios.html`).
3. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `aside.hero__card` follows `.hero__media` in source order, is not inside it, and holds `dl[data-hours]` and the link "Ver contacto" to `pages/contacto.html`.
4. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `section.pillars` holds exactly four `li.pillar` titled "Peluquería titulada", "Spa capilar", "Tricología con microcámara" and "Cosmética natural Jaldún", with the icons `i-tijeras`, `i-spa`, `i-tricologia`, `i-barro` in that order.
5. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `css/styles.css` gives `.pillars` `background: var(--c-anchor)`, `.hero__card` `background: var(--c-bg)` and `.hero__media` `border-radius: 0 0 var(--r-curve) var(--r-curve)`, and contains no `backdrop-filter`.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0, including `tests/css.test.js` (contrast, no hex, no `max-width`) and `tests/pages.test.js` on the new `index.html`.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/inicio.test.js
node tools/smoke.mjs . 4179 ./=200 assets/img/hero-salon.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 4: inicio-hero-pilares"
git tag step-04-inicio-hero-pilares
git rev-parse -q --verify refs/tags/step-04-inicio-hero-pilares >/dev/null
git ls-files --error-unmatch index.html css/styles.css tests/inicio.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-04-inicio-hero-pilares` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-04-inicio-hero-pilares` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E1-T5` — Portada B — fila de iconos y tarjetas de Spa

**Depends on:** `E1-T4` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Añade a `index.html`, justo después de `section.pillars`, las secciones `.icon-row` y `.service-cards`. Textos de `docs/contenido-fuente.md` PARTE 3. Cada tarjeta de Spa lleva **un solo enlace** (el del `h3`, estirado sobre toda la tarjeta con `::after`). El texto de respaldo de precio y duración debe ser el que genera `js/main.js` desde `js/data.js` (`lib.formatPrice` y `item.duration`).

```html
<section class="icon-row section" aria-labelledby="icon-row-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Servicios y tienda</span>
      <h2 id="icon-row-title">Elige por dónde <em>empezar</em></h2>
    </div>
    <ul class="icon-row__list" role="list">
      <li class="reveal"><a class="icon-row__item" href="pages/servicios.html#spa">
        <span class="icon-row__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-spa"/></svg></span>
        <h3>Spa</h3><p>Tres rituales, de menos a más completo.</p>
      </a></li>
      <li class="reveal"><a class="icon-row__item" href="pages/servicios.html#barros-alisados-antifrizz">
        <span class="icon-row__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-barro"/></svg></span>
        <h3>Barros, alisados y antifrizz</h3><p>Tratamientos para la fibra capilar.</p>
      </a></li>
      <li class="reveal"><a class="icon-row__item" href="pages/servicios.html#peluqueria">
        <span class="icon-row__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-tijeras"/></svg></span>
        <h3>Peluquería</h3><p>Cortes y peinados con el mismo mimo que todo lo demás.</p>
      </a></li>
      <li class="reveal"><a class="icon-row__item" href="pages/tienda.html">
        <span class="icon-row__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-regalo"/></svg></span>
        <h3>Tienda</h3><p>Cosmética Jaldún y tarjetas regalo, para recoger en el salón.</p>
      </a></li>
    </ul>
  </div>
</section>

<section class="service-cards section section--alt" aria-labelledby="spa-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Spa capilar</span>
      <h2 id="spa-title">Tres rituales para <em>desconectar</em></h2>
      <p class="lead">De menos a más completo: elige el que mejor encaje con lo que necesitas hoy.</p>
    </div>
    <ul class="card-grid" role="list">
      <li class="reveal">
        <article class="service-card card">
          <div class="service-card__media"><img src="assets/img/destacado-spa.webp" alt="Masaje relajante en el cuero cabelludo durante un spa capilar" width="900" height="1125" loading="lazy"></div>
          <div class="service-card__body">
            <div class="chips"><span class="chip">Spa</span><span class="chip" data-duration="spa-esencial">50 min aprox.</span></div>
            <h3><a href="pages/servicios.html#spa-esencial">Spa esencial</a></h3>
            <p>Un momento para desconectar y disfrutar de un ritual de bienestar.</p>
            <div class="service-card__foot"><span class="price" data-price="spa-esencial">40 €</span><span class="link-arrow" aria-hidden="true">Ver detalle</span></div>
          </div>
        </article>
      </li>
      <li class="reveal">
        <article class="service-card card">
          <div class="service-card__media"><img src="assets/img/destacado-tricologia.webp" alt="Primer plano del cabello, como se ve con la microcámara en el análisis" width="900" height="1125" loading="lazy"></div>
          <div class="service-card__body">
            <div class="chips"><span class="chip">Spa</span><span class="chip" data-duration="spa-equilibrio">1 h 10 min aprox.</span></div>
            <h3><a href="pages/servicios.html#spa-equilibrio">Spa equilibrio</a></h3>
            <p>Una experiencia que combina relajación y cuidado.</p>
            <div class="service-card__foot"><span class="price" data-price="spa-equilibrio">50 €</span><span class="link-arrow" aria-hidden="true">Ver detalle</span></div>
          </div>
        </article>
      </li>
      <li class="reveal">
        <article class="service-card card">
          <div class="service-card__media"><img src="assets/img/destacado-terapias.webp" alt="Masaje suave en la cabeza durante un ritual de spa" width="900" height="1125" loading="lazy"></div>
          <div class="service-card__body">
            <div class="chips"><span class="chip">Spa</span><span class="chip" data-duration="spa-aura">1 h 30 min</span></div>
            <h3><a href="pages/servicios.html#spa-aura">Spa aura</a></h3>
            <p>El más completo.</p>
            <div class="service-card__foot"><span class="price" data-price="spa-aura">70 €</span><span class="link-arrow" aria-hidden="true">Ver detalle</span></div>
          </div>
        </article>
      </li>
    </ul>
    <p class="section-more"><a class="link-arrow" href="pages/servicios.html">Ver todos los servicios</a></p>
  </div>
</section>
```

Textos de respaldo exactos (los mismos que escribe `main.js`): `50 min aprox.` y `40 €` para el esencial; `1 h 10 min aprox.` y `50 €` para el equilibrio; `1 h 30 min` y `70 €` para el aura (el espacio antes de `€` es un espacio duro U+00A0, como en `lib.formatPrice`).

CSS ("Portada · iconos y tarjetas"):

| Componente | Declaraciones obligatorias |
|---|---|
| `.icon-row__list` | `display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none;` · 2 columnas desde 600 px · 4 desde 900 px |
| `.icon-row__item` | `display: grid; gap: var(--s-2); height: 100%; padding: var(--s-6); background: var(--c-bg); border: 1px solid var(--c-line); border-radius: var(--r-card); color: inherit; text-decoration: none;` y `:hover { background: var(--c-bg-alt); }` · `h3 { font-size: 1.5rem; }` · `p { margin: 0; color: var(--c-text-soft); }` |
| `.icon-row__icon` | `display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: var(--c-clay-soft); color: var(--c-anchor);` |
| `.card-grid` | `display: grid; gap: var(--s-6); margin: 0; padding: 0; list-style: none;` · 3 columnas desde 760 px |
| `.service-card` | `position: relative; display: flex; flex-direction: column; height: 100%;` (suma `.card`) · `.service-card__media img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }` y desde 760 px `aspect-ratio: 1 / 1;` · `.service-card__body { display: grid; gap: var(--s-3); padding: var(--s-6); }` · `.service-card h3 a { color: inherit; text-decoration: none; }` · `.service-card h3 a::after { content: ""; position: absolute; inset: 0; }` · `.service-card__foot { display: flex; align-items: center; justify-content: space-between; }` |
| `.section-more` | `margin: var(--s-8) 0 0; text-align: center;` |

Añade a `tests/inicio.test.js`:
- Orden: las secciones de `main` son, en este orden, `hero`, `pillars`, `icon-row`, `service-cards`.
- `.icon-row`: `h2` `Elige por dónde empezar`; cuatro `a.icon-row__item` con estos `href` exactos y en este orden: `pages/servicios.html#spa`, `pages/servicios.html#barros-alisados-antifrizz`, `pages/servicios.html#peluqueria`, `pages/tienda.html`; cada uno con un `h3` y un `p` no vacío de 80 caracteres como máximo (los textos del bloque de arriba) y un icono del sprite.
- `.service-cards`: tres `article.service-card`; cada uno con `img` (el `src` y el `alt` de arriba, `width="900"`, `height="1125"`, `loading="lazy"`), chips `Spa` y `data-duration="<id>"`, `data-price="<id>"`, un único enlace en el `h3` con `href="pages/servicios.html#<id>"` y los ids `spa-esencial`, `spa-equilibrio`, `spa-aura` en ese orden; enlace `Ver todos los servicios` a `pages/servicios.html`.
- Respaldo == datos: el texto de cada `[data-price]` es `lib.formatPrice(data.items[id])` y el de cada `[data-duration]` es `data.items[id].duration`, comparando con los espacios normalizados.

**Files**
- `index.html` — edit
- `css/styles.css` — edit
- `tests/inicio.test.js` — edit

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that the sections of `main` are, in order, `hero`, `pillars`, `icon-row` and `service-cards`.
2. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.icon-row` has four `a.icon-row__item` linking, in order, to `pages/servicios.html#spa`, `pages/servicios.html#barros-alisados-antifrizz`, `pages/servicios.html#peluqueria` and `pages/tienda.html`, each with an `h3`, a non-empty `p` of at most 80 characters and a sprite icon.
3. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.service-cards` holds three `article.service-card` for `spa-esencial`, `spa-equilibrio` and `spa-aura`, each with a 900×1125 `loading="lazy"` photo and its real alt text, a "Spa" chip, a `data-duration` chip, a `data-price` price, and exactly one link (`pages/servicios.html#<id>`) in the `h3`.
4. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the fallback text of every `[data-price]` equals `lib.formatPrice` of its `data.js` item and that of every `[data-duration]` equals the item's `duration`.
5. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the link "Ver todos los servicios" points to `pages/servicios.html`.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 4 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/inicio.test.js
node tools/smoke.mjs . 4179 ./=200 assets/img/destacado-spa.webp=200 assets/img/destacado-tricologia.webp=200 assets/img/destacado-terapias.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 5: inicio-iconos-spa"
git tag step-05-inicio-iconos-spa
git rev-parse -q --verify refs/tags/step-05-inicio-iconos-spa >/dev/null
git ls-files --error-unmatch index.html css/styles.css tests/inicio.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-05-inicio-iconos-spa` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-05-inicio-iconos-spa` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

---

## Epic acceptance

La épica está hecha cuando todas sus tareas están `done` **y**:

1. **WHEN** `npm test` runs after step 5 **THE SYSTEM SHALL** exit 0 with the baseline, CSS and page-structure tests green.
2. **WHEN** `node tools/smoke.mjs . 4179 ./=200 css/tokens.css=200 css/styles.css=200 css/fonts.css=200 js/main.js=200 assets/icons/sprite.svg=200` runs **THE SYSTEM SHALL** exit 0.

```bash
npm test
node tools/smoke.mjs . 4179 ./=200 css/tokens.css=200 css/styles.css=200 css/fonts.css=200 js/main.js=200 assets/icons/sprite.svg=200
```

Desde la raíz del proyecto. Ambos criterios se deciden con estos comandos: una puerta de épica que espera a una persona bloquea todo lo que viene detrás.

## Pitfalls

- **Escribir un hex en `styles.css`** — el test del paso 2 falla en todos los pasos siguientes. Usa el token.
- **Poner un texto directamente sobre una foto** — el contraste no se puede garantizar; en la portada solo hay texto sobre foto en el banner de regalo (paso 7, con velo).
- **Reescribir `js/main.js`, `js/data.js` o `js/lib.js`** — son entregados y los tests asumen su contrato; si algo no encaja, corrige el HTML.
- **Olvidar `reveal` o el `.js` del `<head>`** — sin la clase `js` el menú móvil queda como una fila de enlaces (el estado sin JavaScript).

## Before moving on

- [ ] Toda tarea de esta épica está `done` en `tasks.json`; ninguna queda `in_progress`.
- [ ] Todos los comandos `verify` de todas las tareas pasaron, no solo el primero.
- [ ] Ningún `verify` se editó y ninguno se saltó porque faltara un archivo que nombra.
- [ ] Cada tarea de esta épica tiene su tag en git (`step-01-baseline`, `step-02-tokens-css`, `step-03-shell`, `step-04-inicio-hero-pilares`, `step-05-inicio-iconos-spa`); `git tag -l 'step-*'` los lista.
- [ ] `npm test` pasa limpio desde la raíz.
- [ ] Todo contrato "Produced" de arriba existe con la firma indicada.
- [ ] No se modificó ningún archivo fuera del subárbol.
- [ ] No hay `.env.example` que actualizar: el proyecto no usa variables de entorno obligatorias.
- [ ] Un commit por tarea, cada uno con su id como prefijo de mensaje (`step N: …`) y seguido de su tag.
