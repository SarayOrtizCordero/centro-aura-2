# Epic 03: Legales, calidad y publicación

> Las páginas legales (borrador) y la 404 existen; el SEO, la accesibilidad estática, la distinción respecto a la demo A, el README y la lista de pendientes están probados; y `npm run build` publica solo la web y se sirve en las siete rutas.

| | |
|---|---|
| **Epic id** | `03-legales-calidad-y-publicacion` |
| **Tasks** | `E3-T1` … `E3-T5` (pasos 11 a 15) |
| **Depends on** | 02-portada-y-paginas |
| **Unlocks** | nada — es el final del build; siguen las puertas manuales de §20.1 del blueprint |
| **Parallel with** | ninguna |

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
404.html                        # paso 11 definitiva (exists, edit)
pages/
  aviso-legal.html              # NUEVO paso 11 (borrador)
  privacidad.html               # NUEVO paso 11 (borrador)
css/styles.css                  # pasos 11 y 13 (exists, edit)
README.md                       # NUEVO paso 14
docs/
  qa-manual.md                  # NUEVO paso 13
  comparativa-ab.md             # NUEVO paso 14
tests/
  legal-404.test.js             # NUEVO paso 11
  seo.test.js                   # NUEVO paso 12
  a11y.test.js                  # NUEVO paso 13
  distincion.test.js            # NUEVO paso 14
  deploy.test.js                # NUEVO paso 15
# solo lectura: index.html, pages/servicios|tienda|contacto.html, js/*, tools/*, robots.txt, sitemap.xml, docs/contenido-fuente.md
```

Todo lo que quede fuera de este subárbol está fuera de alcance. Si una tarea parece exigir editar un archivo no listado, detente y repórtalo: el límite de la épica está mal.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `AURA_DATA.business`, `hours` | teléfono e Instagram, horario | JSON-LD y enlaces de respaldo; `seo.test.js` y `set-domain` |

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
| 02-portada-y-paginas | las seis páginas con título, descripción, canonical y `og:*` únicos | `tests/seo.test.js` los compara entre sí |
| 01-fundamentos-y-hero | estructura común, tokens y `tests/pages.test.js` | las legales y la 404 la reutilizan |
| workspace | `tools/set-domain.mjs`, `tools/pendientes.mjs`, `tools/build.mjs`, `tools/smoke.mjs` | cambio de dominio, pendientes, build y comprobación de rutas |
| workspace | `robots.txt`, `sitemap.xml`, `vercel.json` | ya con el dominio provisional |

**Produced** — épicas posteriores dependen exactamente de esto:

| Export | Signature | Used by |
|---|---|---|
| `pages/aviso-legal.html`, `pages/privacidad.html` | campos `<mark class="pendiente">` que lista `npm run pendientes` | la clienta (datos legales) |
| `404.html` | página servida por Vercel en cualquier URL inexistente (rutas desde la raíz con `<base href="/">`) | despliegue |
| `README.md`, `docs/qa-manual.md`, `docs/comparativa-ab.md` | guía de uso, pasada manual y comparación A/B | puertas manuales de §20.1 |
| `dist/` (generado por `npm run build`) | solo la web, lista blanca | Vercel |

## Conventions that bite in this area

- Las legales son un **borrador**: textos literales de `docs/contenido-fuente.md`, campos pendientes en `<mark class="pendiente">[…]</mark>` y el comentario `BORRADOR` antes del primer `h2`. No inventes datos legales.
- La 404 usa `<base href="/">` **antes** de cualquier `<link>` o `<script src>`, rutas relativas sin barra inicial, `noindex` y sin canonical.
- `tests/seo.test.js` no fija el dominio: exige uno solo y consistente (`set-domain` lo cambia en todas partes).
- `npm run pendientes` sale 1 mientras queden datos legales por rellenar: **ese es el estado correcto** de la demo; se comprueba con `rc=0; out=$(node tools/pendientes.mjs) || rc=$?; test "$rc" -eq 1 && echo "$out" | grep -q "Pendiente:"` (una caída sale con 70). Cuenta también el dominio provisional.
- El despliegue en Vercel y la elección del dominio **no son pasos**: son puertas manuales (necesitan la cuenta del usuario).
- El README y `docs/` no se publican: `tools/build.mjs` copia solo la lista blanca.
- Ningún criterio espera a una persona: la pasada de teclado, zoom y lector de pantalla se documenta en `docs/qa-manual.md` y se hace una vez antes de publicar.

Reglas completas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/css.md`, `html.md`, `js-tools.md` y `tests.md`. Todos están en la raíz del proyecto.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el orden de construcción: trabaja de arriba abajo y no reordenes por prioridad.

### `E3-T1` — Páginas legales en borrador y página 404

**Depends on:** `E2-T5` · **Priority:** p1 — metadata para recortes de alcance, no un orden de ejecución

Crea las dos páginas legales y sustituye la 404 provisional. Los textos son **literales** de `docs/contenido-fuente.md`: PARTE 1 ("Aviso legal", "Privacidad y cookies", "Página 404") y, para los cuerpos legales, el **marcado literal de la PARTE 1b** (con sus enlaces `<a>`, negritas y `<mark>`): no los reescribas ni pierdas ningún enlace. Son un **borrador**: cada dato que falta va como `<mark class="pendiente">[…]</mark>` con el texto entre corchetes de la PARTE 1, y cada página lleva, justo antes del primer `h2`, el comentario `<!-- BORRADOR: rellenar los campos marcados (npm run pendientes los lista), revisarlo con un profesional y quitar este comentario. -->`.

**Páginas legales** (`pages/aviso-legal.html` y `pages/privacidad.html`): estructura común (prefijo `../`, sin `aria-current` porque no cuelgan del menú). Metadatos: aviso legal — `title` `Aviso legal | Centro Aura`, `meta description` `Aviso legal de Centro Aura, spa capilar y tricología en Las Cabezas de San Juan: titular del sitio, condiciones de uso y legislación aplicable.`, `og:title` `Aviso legal · Centro Aura`, `og:description` `Datos del titular y condiciones de uso de la web de Centro Aura.`, canonical `https://centro-aura-2.vercel.app/pages/aviso-legal.html`; privacidad — `title` `Privacidad y cookies | Centro Aura`, `meta description` `Política de privacidad y cookies de Centro Aura: qué datos tratamos, con qué finalidad, qué servicios de terceros usa la web y cómo ejercer tus derechos.`, `og:title` `Privacidad y cookies · Centro Aura`, `og:description` `Cómo tratamos tus datos y qué cookies usa la web de Centro Aura.`, canonical `https://centro-aura-2.vercel.app/pages/privacidad.html`. Ambas con `page-hero` (h1 `Aviso legal` / `Privacidad y cookies` y su frase de la PARTE 1) y un `<section class="section"><div class="container legal">…</div></section>` con los `h2` numerados, párrafos, la lista `dl.legal-data` y el párrafo `p.legal-date` (`Última actualización: <mark class="pendiente">[fecha]</mark>`). `og:image` `https://centro-aura-2.vercel.app/assets/img/hero-salon.webp`.

**404** (`404.html`): se sirve desde cualquier URL (`/a/b/c`), así que todas sus rutas parten de la raíz mediante `<base href="/">`, como es habitual en una 404 estática. El `<head>` empieza por este bloque, **antes** de cualquier `<link>` o `<script src>`:

```html
<script>
  if (location.protocol === 'file:') {
    var b = document.createElement('base');
    b.href = location.href.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
    document.head.insertBefore(b, document.head.firstChild);
  }
</script>
<base href="/">
```

Después va el resto del `<head>` de la estructura común **sin `canonical` ni `og:*`** y con `<meta name="robots" content="noindex">`, `title` `Página no encontrada | Centro Aura` y `meta description` `La página que buscas no existe. Vuelve al inicio de Centro Aura, spa capilar y tricología en Las Cabezas de San Juan.`; rutas relativas sin prefijo (`assets/…`, `css/…`, `index.html`, `pages/servicios.html`). El `skip-link` lleva `onclick="event.preventDefault(); document.getElementById('contenido').focus();"` (con `<base>`, `#contenido` llevaría a la portada). El `<main id="contenido" tabindex="-1">` contiene:

```html
<section class="notfound">
  <p class="notfound__code" aria-hidden="true"><span>4</span><img src="assets/icons/loto.svg" alt="" width="64" height="40"><span>4</span></p>
  <span class="eyebrow">Error 404</span>
  <h1>Te has salido del camino</h1>
  <p class="notfound__text">La página que buscas no está aquí, pero tu cabello sigue en buenas manos. Vuelve al inicio o escríbenos y te ayudamos.</p>
  <div class="actions">
    <a class="btn btn--primary" href="index.html">Volver al inicio</a>
    <a class="btn btn--outline" href="pages/servicios.html">Ver servicios</a>
  </div>
  <p class="notfound__help"><a class="link-arrow" href="https://wa.me/34610167764" data-wa="" data-wa-kind="producto">Escríbenos por WhatsApp</a></p>
</section>
```

CSS ("Legales y 404"): `.legal { max-width: var(--measure); }` · `.legal h2 { margin-top: var(--s-8); font-size: 1.75rem; }` · `.legal-data { display: grid; grid-template-columns: auto 1fr; gap: var(--s-2) var(--s-6); }` · `mark.pendiente { padding: 0 0.25em; border-radius: 4px; background: var(--c-clay-soft); color: var(--c-anchor); }` · `.notfound { display: grid; justify-items: center; gap: var(--s-4); padding-block: var(--s-24); text-align: center; }` · `.notfound__code { display: flex; align-items: center; gap: var(--s-4); margin: 0; font: 500 clamp(5rem, 20vw, 9rem)/1 var(--font-display); color: var(--c-clay); }` · `.notfound__text { max-width: var(--measure); }`.

Crea `tests/legal-404.test.js` (CommonJS). Aserta:
- **Legales:** `pages/aviso-legal.html` tiene `<h1>Aviso legal</h1>` y `Ley 34/2002`; `pages/privacidad.html` tiene `<h1>Privacidad y cookies</h1>`, `no usa cookies propias` y `aepd.es`; ambas contienen al menos un `<mark class="pendiente">` y el comentario `BORRADOR`; ninguna contiene `<form`.
- **404, cabecera:** `<meta name="robots" content="noindex">`, sin `canonical`, exactamente un `h1`; el `<head>` contiene `location.protocol === 'file:'` y `document.head.insertBefore(b, document.head.firstChild)`; `<base href="/">` aparece antes que el primer `<link ` y el primer `<script src=`.
- **404, rutas:** todo `href`/`src` local es relativo (no empieza por `/`, salvo el `href="/"` del `<base>`) y existe en disco; hay más de ocho.
- **404, contenido:** `skip-link` con el `onclick` indicado y `<main id="contenido" tabindex="-1">`; `<section class="notfound">`; `<span>4</span><img src="assets/icons/loto.svg" alt="" width="64" height="40"><span>4</span>`; `<h1>Te has salido del camino</h1>`; botón `Volver al inicio` a `index.html`, enlace `Ver servicios` a `pages/servicios.html` y el enlace de WhatsApp con `data-wa-kind="producto"`.
- **404, estructura común:** contiene `.topbar`, `header.site-header`, `footer.site-footer` y `a.wa-float`, los dos preloads de fuentes y las hojas `fonts.css`, `tokens.css`, `styles.css`.

**Files**
- `pages/aviso-legal.html` — new
- `pages/privacidad.html` — new
- `404.html` — edit
- `css/styles.css` — edit
- `tests/legal-404.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/legal-404.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that the two legal pages have their `h1`, the "Ley 34/2002", "no usa cookies propias" and "aepd.es" texts, at least one `<mark class="pendiente">`, the `BORRADOR` comment and no `<form`.
2. **WHEN** `node --test tests/legal-404.test.js` runs **THE SYSTEM SHALL** assert that `404.html` has `noindex`, no `canonical`, one `h1`, the `file:` base script, `<base href="/">` before the first `<link ` and `<script src=`, and local references that are all relative to the site root, exist on disk and number more than eight.
3. **WHEN** `node tools/pendientes.mjs` runs **THE SYSTEM SHALL** exit with code 1 and list the `<mark class="pendiente">` fields of both legal pages and the provisional domain, ending with a line that starts with `Pendiente:`.
4. **WHEN** `node --test tests/legal-404.test.js` runs **THE SYSTEM SHALL** assert the 404 skip link `onclick` focusing `#contenido`, `<main id="contenido" tabindex="-1">`, the lotus between two `<span>4</span>`, the `h1` "Te has salido del camino" and three exits (home, services, WhatsApp).
5. **WHEN** `node --test tests/legal-404.test.js` runs **THE SYSTEM SHALL** assert that `404.html` has `.topbar`, `header.site-header`, `footer.site-footer`, `a.wa-float`, both font preloads and the three stylesheets.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0, including `tests/pages.test.js` on both legal pages.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/legal-404.test.js
node tools/smoke.mjs . 4179 pages/aviso-legal.html=200 pages/privacidad.html=200 404.html=200 no-existe=404
rc=0; out=$(node tools/pendientes.mjs) || rc=$?; test "$rc" -eq 1 && echo "$out" | grep -q "Nombre y apellidos o denominación social" && echo "$out" | grep -q "dominio provisional" && echo "$out" | grep -q "Pendiente:"
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 11: legales-404"
git tag step-11-legales-404
git rev-parse -q --verify refs/tags/step-11-legales-404 >/dev/null
git ls-files --error-unmatch pages/aviso-legal.html pages/privacidad.html 404.html css/styles.css tests/legal-404.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-11-legales-404` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-11-legales-404` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E3-T2` — SEO, sitemap, robots y cambio de dominio

**Depends on:** `E2-T2`, `E3-T1` · **Priority:** p1 — metadata para recortes de alcance, no un orden de ejecución

`robots.txt` y `sitemap.xml` ya vienen en `workspace/` con el dominio provisional `https://centro-aura-2.vercel.app` y las seis páginas indexables (la 404 queda fuera y lleva `noindex`). `tools/set-domain.mjs` cambia el dominio en todos los sitios donde aparece. Este paso **demuestra** que las siete páginas, el JSON-LD, el sitemap y robots dicen lo mismo y que cambiar de dominio no deja ningún rastro del anterior. No cambies los metadatos que ya fijaron los pasos 3 a 11 salvo para corregir un defecto que el test encuentre (y en ese caso sigue la misma regla de unicidad).

Crea `tests/seo.test.js` (CommonJS, `node:test`, sin dependencias). Aserta:
- **Páginas:** `pageFiles()` ordenadas es exactamente `index.html`, `pages/aviso-legal.html`, `pages/contacto.html`, `pages/privacidad.html`, `pages/servicios.html`, `pages/tienda.html`.
- **Enlaces a páginas:** todo `href` local que apunte a `pages/*.html`, en cualquiera de las siete páginas, existe en disco (cierra el salto del test de enlaces del paso 3).
- **Sitemap:** las `<loc>` son URLs absolutas `https://…` de un solo origen y sus rutas (`/` para la portada) son exactamente las de `pageFiles()`; no aparece `404`.
- **Un solo dominio:** el origen del sitemap es el de `canonical`, `og:url` y `og:image` de las seis páginas, el de `url` e `image` del JSON-LD de la portada y el de la línea `Sitemap:` de `robots.txt`; ese origen cumple `/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i` y no contiene `TU-DOMINIO`.
- **Unicidad:** los `<title>`, las `meta description` y los `og:title` de las seis páginas son todos distintos entre sí; cada una tiene `og:description`.
- **Robots:** `User-agent: *`, sin `Disallow: /` y con `Sitemap: <origen>/sitemap.xml` (comparación sin distinguir mayúsculas).
- **Datos estructurados:** solo `index.html` contiene `application/ld+json`.
- **Cambio de dominio real:** copia a un directorio temporal (`fs.mkdtempSync`) `index.html`, `404.html`, `robots.txt`, `sitemap.xml` y `pages/*.html`, ejecuta `tools/set-domain.mjs https://www.centroaura.es` con `AURA_ROOT` apuntando a esa copia (`spawnSync(process.execPath, …)`) y comprueba: salida 0; en ninguno de esos archivos queda el origen anterior; el nuevo aparece en `canonical`, `og:url`, `og:image`, JSON-LD, sitemap y robots. Repítelo con `https://centroaura.com` para probar que se puede encadenar. Limpia el directorio temporal.

**Files**
- `tests/seo.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/seo.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that `pageFiles()` is exactly `index.html`, `pages/aviso-legal.html`, `pages/contacto.html`, `pages/privacidad.html`, `pages/servicios.html` and `pages/tienda.html`, and that every local link to a `pages/*.html` file on any page resolves to an existing file, and that `sitemap.xml` lists exactly those URLs on a single origin without `404`.
2. **WHEN** `node --test tests/seo.test.js` runs **THE SYSTEM SHALL** assert that the origin of `canonical`, `og:url` and `og:image` on every page, the JSON-LD `url` and `image`, the sitemap and the `Sitemap:` line of `robots.txt` is one and the same `https://` origin that does not contain `TU-DOMINIO`.
3. **WHEN** `node --test tests/seo.test.js` runs **THE SYSTEM SHALL** assert that the six `title`, `meta description` and `og:title` values are each pairwise distinct and that every page has an `og:description`.
4. **WHEN** `node --test tests/seo.test.js` runs **THE SYSTEM SHALL** assert that `robots.txt` has `User-agent: *`, no `Disallow: /`, and a `Sitemap:` line, and that only `index.html` carries `application/ld+json`.
5. **WHEN** `node --test tests/seo.test.js` runs **THE SYSTEM SHALL** run `tools/set-domain.mjs` twice on a temporary copy of the site and find, after each run, exit code 0, no trace of the previous origin and the new origin in every canonical, `og:url`, `og:image`, JSON-LD, sitemap and robots occurrence.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 11 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/seo.test.js
grep -q 'rel="canonical" href="https://centro-aura-2.vercel.app/"' index.html
node tools/smoke.mjs . 4179 robots.txt=200 sitemap.xml=200 ./=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 12: seo-dominio"
git tag step-12-seo-dominio
git rev-parse -q --verify refs/tags/step-12-seo-dominio >/dev/null
git ls-files --error-unmatch tests/seo.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-12-seo-dominio` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-12-seo-dominio` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E3-T3` — Accesibilidad y reflow: tests y guía de pasada manual

**Depends on:** `E3-T2` · **Priority:** p1 — metadata para recortes de alcance, no un orden de ejecución

Cierra lo que se puede decidir con un script y deja por escrito lo que no. **Ningún criterio de este paso espera a una persona**: la pasada de teclado, zoom, 320 px, anchos reales y lector de pantalla es una puerta manual de §20.1 y se hace una vez antes de publicar; aquí solo se crea la guía.

1. Crea `tests/a11y.test.js` (CommonJS, `node:test`, sin dependencias). Recorre `pageFiles()` **y** `404.html`. Aserta, por página:
   - **Puntos de referencia:** exactamente un `<main`, un `<header` y un `<footer`; todo `<nav` lleva `aria-label`.
   - **Enlaces:** todo `<a` tiene texto visible, `aria-label` o una `<img>` con `alt` no vacío; ninguno tiene `href="#"`; todo `target="_blank"` lleva `rel` con `noopener`.
   - **Botones y SVG:** todo `<button` lleva `type`; todo `<svg` lleva `aria-hidden="true"`; no hay `tabindex` positivo; no hay `<iframe`.
   - **Formularios:** todo `input`, `select` y `textarea` con `id` tiene un `<label for="<id>">`.
   - **Sin parches externos:** ningún texto `accessibe`, `userway`, `audioeye` ni `equalweb` en HTML, CSS o JS.
   - **Movimiento:** `js/main.js` desactiva la aparición cuando `prefers-reduced-motion: reduce` coincide (contiene esa cadena y `matchMedia`).
2. En el mismo test, comprueba `css/styles.css`: `:focus-visible` con `outline: 2px solid`; `.btn` con `min-height: 48px`; `.tab` y `.link-arrow` con `min-height: 44px`; `.js .nav-toggle` con `width: 48px; height: 48px`; `scroll-padding-top` en `html`; `@media (prefers-reduced-motion: reduce)` que anula transiciones y la aparición; `.reveal` solo se oculta bajo `.reveal-ready`; ni `overflow-x: hidden` en `html` o `body`; **guardia de reflow**: ninguna declaración `width` o `min-width` en píxeles mayor que 320 fuera de un `@media (min-width: …)` (las anchuras máximas con `max-width` y las funciones `min()` no cuentan).
3. Corrige en `css/styles.css` lo que el test encuentre (por ejemplo un `min-height` que falte). Si el test apunta a un defecto de marcado en una página, **detente y repórtalo**: ese defecto es de un paso anterior (regla explícita: no se arregla en silencio el marcado de otros pasos; se detiene y se reporta).
4. Crea `docs/qa-manual.md` con estos encabezados `##` exactos, cada uno con su lista de comprobación y una línea `Hecho por: ____ · Fecha: ____`: `Teclado`, `Zoom 200 %`, `Reflow a 320 px`, `Anchos 375, 768 y 1440`, `Lector de pantalla`, `Movimiento reducido`, `Comparación A/B con la clienta`, `Opcional: axe automatizado`. Contenido mínimo: **Teclado** — recorrer Tab por cabecera, menú móvil (abrir, Esc cierra, el foco no se escapa), pestañas de Servicios (flechas, Inicio, Fin), formulario y pie, con foco siempre visible y nunca tapado por la cabecera fija; **Zoom 200 %** y **Reflow a 320 px** — sin scroll horizontal ni texto cortado; **Anchos** — capturas a 375, 768 y 1440 de las siete páginas; **Lector de pantalla** — NVDA o VoiceOver sobre la portada, Servicios y el formulario (error y resumen anunciados); **Movimiento reducido** — con la preferencia activada no hay aparición ni transiciones; **Comparación A/B** — remite a `docs/comparativa-ab.md` (paso 14); **Opcional: axe automatizado** — axe-core, `@axe-core/playwright` y playwright **no están en `package.json` ni los instala ningún paso**: es una comprobación a demanda, fuera del build; el documento dice solo "verificar versiones antes de instalar, p. ej. axe-core y playwright", **sin escribir ninguna versión**.

**Files**
- `tests/a11y.test.js` — new
- `css/styles.css` — edit
- `docs/qa-manual.md` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/a11y.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting, for every page and `404.html`, one `main`, one `header` and one `footer`, labelled `nav` elements, links with an accessible name, `rel` containing `noopener` on every `target="_blank"`, a `type` on every `button`, `aria-hidden="true"` on every `svg` and no positive `tabindex`.
2. **WHEN** `node --test tests/a11y.test.js` runs **THE SYSTEM SHALL** assert that every `input`, `select` and `textarea` with an `id` has a matching `label[for]` and that no accessibility-overlay vendor name appears in HTML, CSS or JS.
3. **WHEN** `node --test tests/a11y.test.js` runs **THE SYSTEM SHALL** assert that `css/styles.css` has a 2px `:focus-visible` outline, `.btn` with `min-height: 48px`, `.tab` and `.link-arrow` with `min-height: 44px`, `scroll-padding-top` on `html`, a `prefers-reduced-motion: reduce` block that cancels transitions and the reveal, and no `overflow-x: hidden` on `html` or `body`.
4. **WHEN** `node --test tests/a11y.test.js` runs **THE SYSTEM SHALL** assert that no `width` or `min-width` declaration in pixels above 320 exists outside a `@media (min-width: …)` block of `css/styles.css`.
5. **WHEN** `node -e "const t=require('fs').readFileSync('docs/qa-manual.md','utf8'); const h=['Teclado','Zoom 200 %','Reflow a 320 px','Anchos 375, 768 y 1440','Lector de pantalla','Movimiento reducido','Comparación A/B con la clienta','Opcional: axe automatizado']; process.exit(h.every((x)=>t.includes('\n## '+x+'\n')) ? 0 : 1)"` runs **THE SYSTEM SHALL** exit 0, proving that `docs/qa-manual.md` has the eight second-level headings Teclado, Zoom 200 %, Reflow a 320 px, Anchos 375, 768 y 1440, Lector de pantalla, Movimiento reducido, Comparación A/B con la clienta and Opcional: axe automatizado.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 12 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/a11y.test.js
node -e "const t=require('fs').readFileSync('docs/qa-manual.md','utf8'); const h=['Teclado','Zoom 200 %','Reflow a 320 px','Anchos 375, 768 y 1440','Lector de pantalla','Movimiento reducido','Comparación A/B con la clienta','Opcional: axe automatizado']; process.exit(h.every((x)=>t.includes('\n## '+x+'\n')) ? 0 : 1)"
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 13: a11y-responsive"
git tag step-13-a11y-responsive
git rev-parse -q --verify refs/tags/step-13-a11y-responsive >/dev/null
git ls-files --error-unmatch tests/a11y.test.js css/styles.css docs/qa-manual.md >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-13-a11y-responsive` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-13-a11y-responsive` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E3-T4` — Distinción respecto a la demo A, README y pendientes

**Depends on:** `E3-T3` · **Priority:** p1 — metadata para recortes de alcance, no un orden de ejecución

La demo B existe para que la clienta pueda **elegir**: tiene que ser visiblemente distinta de la A y no inventar nada. Este paso lo convierte en tests y documenta cómo se publica.

1. Crea `tests/distincion.test.js` (CommonJS, `node:test`). Aserta:
   - **Componentes de B:** `index.html` contiene las clases `topbar`, `hero__card`, `pillars`, `icon-row`, `service-cards`, `spotlight`, `mosaic`, `gift-banner` y `visit` (como fichas dentro de un atributo `class`).
   - **Layout de A ausente:** ningún HTML del proyecto (`pageFiles()` y `404.html`) ni `css/styles.css` contiene como clase o selector `feature-grid`, `feature-card`, `shop-grid`, `shop-tile` o `split` (como ficha de clase exacta o como selector `.nombre` seguido de un carácter que no sea letra, cifra ni guion bajo).
   - **Tipografía distinta:** `css/tokens.css` declara `--font-body` con `'DM Sans'`; ningún `css/*.css` contiene `Jost`; `css/fonts.css` declara `DM Sans`.
   - **Sin prueba social inventada:** ningún HTML del proyecto (`pageFiles()` y `404.html`) coincide con `/rese[ñn]a|testimon|★|opini[oó]n(es)? de|clientas? feliz|alumnas?|\b\d+(?:[.,]\d+)?\s?[kK]\b/i`. (`reservar` no coincide: el patrón exige `rese` + `ñ`/`n` + `a`.)
   - **Sin hechos inventados:** ningún HTML coincide con `/\b\d+\s+años\b|años de experiencia|premiad|galardon|certificad[oa] por/i`.
2. Crea `README.md` en español con estos encabezados `##` exactos y su contenido: `Verla` (`npm run serve`, http://localhost:4173, Node 24 o superior; abrir por `file://` muestra avisos de precarga de fuentes y los iconos externos no se pintan: usar el servidor); `Cambiar precios, horario o teléfono` (`js/data.js`; los rangos con `price`/`priceMax`; el texto de respaldo del HTML debe coincidir y `npm test` avisa; teléfono: `34610167764` en `wa.me`, `tel:` y JSON-LD; horario: JSON-LD y el texto de respaldo de `[data-hours-summary]`); `Cambiar las fotos` (mismo nombre, WebP, actualizar `width`/`height` en el HTML y en `tests/fixtures/images.json`; las fotos de stock son provisionales, `assets/img/CREDITOS.md`); `Tipografías` (`npm run fonts`, requiere red, genera `css/fonts.css` y `assets/fonts/`); `Mapa de Google` (carga solo al pulsar "Ver el mapa"; por eso no hay banner de cookies); `Páginas legales` (borrador con `<mark class="pendiente">`; revisar con un profesional); `Antes de publicar` (`npm run pendientes`; `npm run domain -- https://www.tudominio.es`; datos legales; precios y horario definitivos; `npm run build` copia a `dist/` solo la web; en Vercel lo hace `vercel.json`; la 404 se sirve en cualquier URL gracias a `<base>`); `Tests` (`npm test`, qué comprueban); `Estructura` (tabla de carpetas); `Demo A y demo B` (B nació de A@1444fd6: mismos datos, otra imagen; `js/data.js` está copiado, no compartido; si la clienta elige una, la otra se archiva); `Pendiente de la clienta` (fotos reales del local y de sus trabajos; precios y horario definitivos; datos legales y dominio; retrato de Paula si lo quiere; reseñas reales para añadir tras el lanzamiento, nunca inventadas).
3. Crea `docs/comparativa-ab.md`: el procedimiento para la **puerta manual A/B** de §20.1. Explica cómo servir las dos demos a la vez (`PORT=4173 node tools/serve.mjs` en este proyecto, la B, y `PORT=4174 node tools/serve.mjs` en la carpeta de la A: dos puertos distintos, el archivo nombra ambos), qué capturas hacer (portada, Servicios, Tienda y Contacto, a 375 y a 1440 px de ancho, lado a lado) y una tabla de decisión para la clienta con las filas `Primera impresión`, `Cómo se lee el menú`, `Cómo se ve el precio`, `Cómo se reserva`, `Qué le gusta más` y las columnas `Demo A` y `Demo B`.
4. Ejecuta `node tools/pendientes.mjs`: debe listar los datos legales sin rellenar **y el dominio provisional** (`https://centro-aura-2.vercel.app`), terminar con una línea `Pendiente: N cosas.` y salir con código 1 mientras existan (es el estado correcto de una demo en borrador). Una caída del script sale con 70, nunca con 1.

**Files**
- `tests/distincion.test.js` — new
- `README.md` — new
- `docs/comparativa-ab.md` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/distincion.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that `index.html` contains the classes `topbar`, `hero__card`, `pillars`, `icon-row`, `service-cards`, `spotlight`, `mosaic`, `gift-banner` and `visit`, that none of the layout classes `feature-grid`, `feature-card`, `shop-grid`, `shop-tile` or `split` appears in any HTML page or in `css/styles.css`, that `css/tokens.css` declares `'DM Sans'` as `--font-body`, and that the word `Jost` appears in no stylesheet.
2. **WHEN** `node --test tests/distincion.test.js` runs **THE SYSTEM SHALL** assert that no HTML page matches the invented-social-proof pattern (reseña, testimonio, ★, opiniones de, clientas felices, alumnas, a number followed by K) or the invented-facts pattern (a number followed by años, años de experiencia, premiad-, galardon-).
3. **WHEN** `node tools/pendientes.mjs` runs **THE SYSTEM SHALL** list the legal fields still marked `pendiente` and the provisional domain `https://centro-aura-2.vercel.app`, print a final line that starts with `Pendiente:` and exit with code 1.
4. **WHEN** `node -e "const t=require('fs').readFileSync('README.md','utf8'); const h=['Verla','Cambiar precios, horario o teléfono','Cambiar las fotos','Tipografías','Mapa de Google','Páginas legales','Antes de publicar','Tests','Estructura','Demo A y demo B','Pendiente de la clienta']; process.exit(h.every((x)=>t.includes('\n## '+x+'\n')) ? 0 : 1)"` runs **THE SYSTEM SHALL** exit 0.
5. **WHEN** `test -f docs/comparativa-ab.md && grep -q 4173 docs/comparativa-ab.md && grep -q 4174 docs/comparativa-ab.md` runs **THE SYSTEM SHALL** exit 0, proving that the A/B comparison guide exists and names both ports, 4173 for demo B and 4174 for demo A.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 13 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/distincion.test.js
rc=0; out=$(node tools/pendientes.mjs) || rc=$?; test "$rc" -eq 1 && echo "$out" | grep -q "Nombre y apellidos o denominación social" && echo "$out" | grep -q "dominio provisional" && echo "$out" | grep -q "Pendiente:"
node -e "const t=require('fs').readFileSync('README.md','utf8'); const h=['Verla','Cambiar precios, horario o teléfono','Cambiar las fotos','Tipografías','Mapa de Google','Páginas legales','Antes de publicar','Tests','Estructura','Demo A y demo B','Pendiente de la clienta']; process.exit(h.every((x)=>t.includes('\n## '+x+'\n')) ? 0 : 1)"
test -f docs/comparativa-ab.md && grep -q 'Demo A' docs/comparativa-ab.md && grep -q 'Demo B' docs/comparativa-ab.md && grep -q 4173 docs/comparativa-ab.md && grep -q 4174 docs/comparativa-ab.md
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 14: distincion-readme"
git tag step-14-distincion-readme
git rev-parse -q --verify refs/tags/step-14-distincion-readme >/dev/null
git ls-files --error-unmatch tests/distincion.test.js README.md docs/comparativa-ab.md >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-14-distincion-readme` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-14-distincion-readme` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E3-T5` — Build final a dist/ y comprobación de las siete rutas

**Depends on:** `E3-T4` · **Priority:** p1 — metadata para recortes de alcance, no un orden de ejecución

Demuestra que lo que se publica es la web y solo la web, y que se sirve. `tools/build.mjs` ya tiene la lista blanca; `vercel.json` ya apunta a `node tools/build.mjs` y `dist`. **El despliegue en Vercel y la elección del dominio no son pasos de build**: necesitan la cuenta del usuario y están en la lista manual de §20.1.

Crea `tests/deploy.test.js` (CommonJS, `node:test`). En un `before` construye en un directorio temporal (`fs.mkdtempSync(path.join(os.tmpdir(), 'aura-dist-'))`) con `execFileSync(process.execPath, [tools/build.mjs, tmp])`; en un `after` bórralo. Aserta:
- **vercel.json:** `buildCommand` es `node tools/build.mjs`, `outputDirectory` es `dist` y `framework` es `null`.
- **Lo publicado:** existen `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `css/fonts.css`, `css/tokens.css`, `css/styles.css`, `js/main.js`, `js/data.js`, `js/lib.js`, `pages/servicios.html`, `pages/tienda.html`, `pages/contacto.html`, `pages/aviso-legal.html`, `pages/privacidad.html`, `assets/icons/loto.svg`, `assets/icons/favicon.svg`, `assets/icons/sprite.svg`, los tres `.woff2` de `assets/fonts/` y toda imagen de `tests/fixtures/images.json` en `assets/img/`.
- **Lo que no se publica:** ninguna ruta empieza por `tests/`, `tools/`, `docs/`, `blueprints/`, `.claude/`, `.git/` o `node_modules/`; ninguna es `README.md`, `package.json`, `vercel.json`, `.gitignore`, `.gitattributes`, `CLAUDE.md`, `AGENTS.md` ni `.workspace-applied`; ninguna termina en `CREDITOS.md` ni en `.gitkeep`.
- **Recursos completos:** todo `href`/`src` local de cada HTML publicado (incluidos los `<use href>` del sprite, sin fragmento) existe dentro del directorio publicado (la 404 parte de la raíz); toda `url('…')` de `css/fonts.css` existe.

**Files**
- `tests/deploy.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/deploy.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that `vercel.json` builds with `node tools/build.mjs`, publishes `dist` and sets `framework` to `null`.
2. **WHEN** `node --test tests/deploy.test.js` runs **THE SYSTEM SHALL** assert that the built folder contains the seven HTML pages, `robots.txt`, `sitemap.xml`, the three stylesheets, the three scripts, the three icon files, the three `.woff2` fonts and every image of `tests/fixtures/images.json`.
3. **WHEN** `node --test tests/deploy.test.js` runs **THE SYSTEM SHALL** assert that the built folder contains nothing under `tests/`, `tools/`, `docs/`, `blueprints/`, `.claude/`, `.git/` or `node_modules/`, none of `README.md`, `package.json`, `vercel.json`, `.gitignore`, `.gitattributes`, `CLAUDE.md`, `AGENTS.md` or `.workspace-applied`, and no `CREDITOS.md` or `.gitkeep`.
4. **WHEN** `node --test tests/deploy.test.js` runs **THE SYSTEM SHALL** assert that every local `href`, `src` and sprite `use href` of every published HTML file, and every `url()` of `css/fonts.css`, resolves to a file inside the built folder.
5. **WHEN** `node tools/smoke.mjs dist 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200 pages/aviso-legal.html=200 pages/privacidad.html=200 404.html=200 robots.txt=200 sitemap.xml=200 no-existe=404` runs after `npm run build` **THE SYSTEM SHALL** serve `dist/` and exit 0 with every status as listed.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with all the gates of steps 1 to 14 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
npm run build
node --test tests/deploy.test.js
node tools/smoke.mjs dist 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200 pages/aviso-legal.html=200 pages/privacidad.html=200 404.html=200 robots.txt=200 sitemap.xml=200 no-existe=404
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 15: build-final"
git tag step-15-build-final
git rev-parse -q --verify refs/tags/step-15-build-final >/dev/null
git ls-files --error-unmatch tests/deploy.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-15-build-final` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-15-build-final` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

---

## Epic acceptance

La épica está hecha cuando todas sus tareas están `done` **y**:

1. **WHEN** `npm test` runs after step 15 **THE SYSTEM SHALL** exit 0 with every test file of the project green.
2. **WHEN** `npm run build` runs and `node tools/smoke.mjs dist 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200 pages/aviso-legal.html=200 pages/privacidad.html=200 404.html=200 robots.txt=200 sitemap.xml=200 no-existe=404` then runs **THE SYSTEM SHALL** exit 0.

```bash
npm test
npm run build
node tools/smoke.mjs dist 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200 pages/aviso-legal.html=200 pages/privacidad.html=200 404.html=200 robots.txt=200 sitemap.xml=200 no-existe=404
```

Desde la raíz del proyecto. Ambos criterios se deciden con estos comandos: una puerta de épica que espera a una persona bloquea todo lo que viene detrás.

## Pitfalls

- **Quitar el comentario `BORRADOR` o los `<mark class="pendiente">`** — los tests de las legales fallan y se pierde la lista de pendientes.
- **Cambiar `<base href="/">` de la 404 o poner rutas con `/` inicial** — rompe la página en `/a/b/c` y por `file:`.
- **Esperar a que `npm run pendientes` salga 0** — saldrá 0 solo cuando la clienta rellene los datos legales.
- **Arreglar en silencio el marcado de un paso anterior** cuando `a11y.test.js` o `seo.test.js` lo señalen — detente y repórtalo; es un defecto de ese paso.
- **Intentar desplegar a Vercel o elegir dominio** — no es un paso; está en las puertas manuales de §20.1.

## Before moving on

- [ ] Toda tarea de esta épica está `done` en `tasks.json`; ninguna queda `in_progress`.
- [ ] Todos los comandos `verify` de todas las tareas pasaron, no solo el primero.
- [ ] Ningún `verify` se editó y ninguno se saltó porque faltara un archivo que nombra.
- [ ] Cada tarea de esta épica tiene su tag en git (`step-11-legales-404`, `step-12-seo-dominio`, `step-13-a11y-responsive`, `step-14-distincion-readme`, `step-15-build-final`); `git tag -l 'step-*'` los lista.
- [ ] `npm test` pasa limpio desde la raíz.
- [ ] Todo contrato "Produced" de arriba existe con la firma indicada.
- [ ] No se modificó ningún archivo fuera del subárbol.
- [ ] No hay `.env.example` que actualizar: el proyecto no usa variables de entorno obligatorias.
- [ ] Un commit por tarea, cada uno con su id como prefijo de mensaje (`step N: …`) y seguido de su tag.
