# Epic 02: Portada y páginas interiores

> La portada está completa (spotlight Jaldún, mosaico, banner regalo, visita con mapa y JSON-LD) y existen las tres páginas interiores con contenido: Servicios, Tienda y Contacto.

| | |
|---|---|
| **Epic id** | `02-portada-y-paginas` |
| **Tasks** | `E2-T1` … `E2-T5` (pasos 6 a 10) |
| **Depends on** | 01-fundamentos-y-hero |
| **Unlocks** | 03-legales-calidad-y-publicacion |
| **Parallel with** | ninguna (comparten `css/styles.css`) |

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
index.html                      # pasos 6 y 7: spotlight, mosaico, banner, visita, JSON-LD (exists, edit)
css/styles.css                  # se amplía en cada paso (exists, edit)
pages/
  servicios.html                # NUEVO paso 8
  tienda.html                   # NUEVO paso 9
  contacto.html                 # NUEVO paso 10
tests/
  inicio.test.js                # se amplía en 6 y 7 (exists, edit)
  servicios.test.js             # NUEVO paso 8
  tienda.test.js                # NUEVO paso 9
  contacto.test.js              # NUEVO paso 10
# solo lectura: js/*, assets/*, tests/pages.test.js, tests/css.test.js, docs/contenido-fuente.md
```

Todo lo que quede fuera de este subárbol está fuera de alcance. Si una tarea parece exigir editar un archivo no listado, detente y repórtalo: el límite de la épica está mal.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `AURA_DATA.items` | los 15 servicios (`servicio`), los 3 productos Jaldún y los 3 regalos (lectura): `price`, `priceMax`, `duration`, `name`, `contact` | respaldo de precio y duración comparado con `AuraLib.formatPrice` |
| `AURA_DATA.categories` | `spa`, `tratamientos`, `peluqueria` | pestañas de Servicios |
| `AURA_DATA.hours`, `business` | horario y teléfono | JSON-LD de la portada igual a `data.js` |

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
| 01-fundamentos-y-hero | estructura común (`<head>`, barra superior, cabecera, pie, botón flotante) de `index.html` | se copia a cada página nueva con prefijo `../` |
| 01-fundamentos-y-hero | `css/tokens.css` y componentes compartidos de `css/styles.css` | solo `var(--…)` |
| 01-fundamentos-y-hero | `tests/pages.test.js` | cubre automáticamente cada página nueva |
| workspace | `js/main.js` | pestañas, formulario con resumen `aria-live`, mapa bajo demanda, WhatsApp |
| workspace | `js/lib.js`, `js/data.js` | datos y funciones puras |

**Produced** — épicas posteriores dependen exactamente de esto:

| Export | Signature | Used by |
|---|---|---|
| `index.html` | portada de ocho secciones y JSON-LD `HairSalon` | épica 3 (SEO, accesibilidad, distinción) |
| `pages/servicios.html` | ids de cada servicio y de los paneles `spa`, `barros-alisados-antifrizz`, `peluqueria` (anclas) | portada (enlaces `servicios.html#id`) |
| `pages/tienda.html`, `pages/contacto.html` | anclas `#jaldun`, `#tarjetas-regalo`, `#formulario` | portada y Servicios |
| `css/styles.css` | `.page-hero`, `.tab`, `.service-row`, `.product-card`, `.gift-tile`, `.contact-card`, `.contact-form`, `.map` | épica 3 |

## Conventions that bite in this area

- Las páginas de `pages/` usan prefijo `../` en toda ruta local y enlazan entre sí (también desde el pie) como `servicios.html`, `tienda.html`, `contacto.html`, `aviso-legal.html`, `privacidad.html`; nunca `pages/…`.
- El `<title>`, la `meta description`, el canonical y los `og:*` de cada página son los de este documento y únicos; el dominio provisional es `https://centro-aura-2.vercel.app`.
- Los ids de servicio son los de `js/data.js` y a la vez anclas: `servicios.html#spa-esencial`. Los paneles tienen ids `spa`, `barros-alisados-antifrizz`, `peluqueria`.
- Los comentarios `<!-- … -->` de los bloques de ejemplo se sustituyen por el contenido real: `tests/pages.test.js` falla con cualquier comentario HTML (salvo el `BORRADOR` de las legales).
- `[hidden] { display: none !important; }` ya existe (paso 2): el botón del mapa y la lista de pestañas se ocultan con el atributo `hidden`.
- Servicios de "Barros, alisados y antifrizz": sin duración; precio con rango y aviso "orientativos" antes del primer precio.
- Texto sobre foto: solo `.gift-banner` (velo oscuro) y `.page-hero` (velo claro, solo `--c-text`).
- Sin carrito: cada botón de producto abre WhatsApp con `data-wa-kind="producto"`.

Reglas completas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/css.md`, `html.md`, `js-tools.md` y `tests.md`. Todos están en la raíz del proyecto.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el orden de construcción: trabaja de arriba abajo y no reordenes por prioridad.

### `E2-T1` — Portada C — destacado Jaldún y mosaico Sobre Aura

**Depends on:** `E1-T5` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Añade a `index.html`, tras `.service-cards`, las secciones `.spotlight` y `.mosaic`. Los frascos de los champús son fotos con **fondo blanco puro**: sobre el panel en arco se mezclan con `mix-blend-mode: multiply` para que el blanco desaparezca. Sin retrato de Paula ni afirmaciones biográficas más allá de "peluquera titulada y fundadora".

```html
<section class="spotlight section" aria-labelledby="spotlight-title">
  <div class="container spotlight__inner">
    <div class="spotlight__panel arch reveal">
      <div class="spotlight__bottles">
        <img src="assets/img/champu-equilibrante.webp" alt="Frasco del champú Equilibrante de Jaldún" width="2250" height="2250" loading="lazy">
        <img class="is-center" src="assets/img/champu-vitalzen.webp" alt="Frasco del champú Vitalzen Fortificante de Jaldún" width="2250" height="2250" loading="lazy">
        <img src="assets/img/champu-multiefecto.webp" alt="Frasco del champú Multiefecto Regulador de Jaldún" width="2250" height="2250" loading="lazy">
      </div>
    </div>
    <div class="spotlight__copy reveal">
      <span class="eyebrow">Cosmética natural</span>
      <h2 id="spotlight-title">Champús <em>Jaldún</em> para cada cuero cabelludo</h2>
      <p>Fitoterapia capilar que devuelve al cuero cabelludo su equilibrio natural. Si no sabes cuál es el tuyo, pregúntame.</p>
      <ul class="checklist" role="list">
        <li><span class="checklist__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-check"/></svg></span><span><strong>Equilibrante</strong> para caspa y exceso de grasa.</span></li>
        <li><span class="checklist__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-check"/></svg></span><span><strong>Vitalzen Fortificante</strong> para la caída.</span></li>
        <li><span class="checklist__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-check"/></svg></span><span><strong>Multiefecto Regulador</strong> para cuero cabelludo sensible o desequilibrado.</span></li>
      </ul>
      <a class="btn btn--primary" href="pages/tienda.html#jaldun">Ver tienda<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-flecha"/></svg></span></a>
    </div>
  </div>
</section>

<section class="mosaic section section--alt" aria-labelledby="mosaic-title">
  <div class="container mosaic__inner">
    <div class="mosaic__copy reveal">
      <span class="eyebrow">Sobre Aura</span>
      <h2 id="mosaic-title">Que tu pelo, además de bonito, esté <em>sano</em></h2>
      <p>Centro Aura es el espacio de Paula, peluquera titulada y fundadora, en Las Cabezas de San Juan. Unimos la peluquería de siempre con la tricología y los rituales de spa capilar.</p>
      <blockquote class="mosaic__quote"><p>Aura, <em>la energía del interior y la que envuelve al cuerpo físico</em>.</p></blockquote>
    </div>
    <div class="mosaic__photos reveal">
      <img class="mosaic__photo mosaic__photo--tall" src="assets/img/servicio-salud.webp" alt="Masaje en el cuero cabelludo con la clienta relajada" width="1000" height="1250" loading="lazy">
      <img class="mosaic__photo" src="assets/img/destacado-terapias.webp" alt="Masaje suave en la cabeza durante un ritual de spa" width="900" height="1125" loading="lazy">
      <img class="mosaic__photo" src="assets/img/servicio-peluqueria.webp" alt="Estilista secando el pelo de una clienta con cepillo redondo" width="1000" height="1250" loading="lazy">
    </div>
  </div>
</section>
```

CSS ("Portada · destacado y mosaico"):

| Componente | Declaraciones obligatorias |
|---|---|
| `.spotlight__inner` | `display: grid; gap: var(--s-12); align-items: center;` · desde 900 px `grid-template-columns: 5fr 6fr;` |
| `.spotlight__panel` | suma `.arch` (fondo `--c-bg-alt`) · `.spotlight__bottles { display: flex; align-items: flex-end; justify-content: center; min-height: 420px; padding: var(--s-12) var(--s-4) var(--s-8); }` · `.spotlight__bottles img { width: 46%; margin-inline: -8%; mix-blend-mode: multiply; }` · `.spotlight__bottles img.is-center { width: 54%; position: relative; z-index: 1; }` |
| `.checklist` | `display: grid; gap: var(--s-3); margin: var(--s-6) 0; padding: 0; list-style: none;` · `li { display: grid; grid-template-columns: auto 1fr; gap: var(--s-3); align-items: start; }` · `.checklist__icon { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--c-clay-soft); color: var(--c-anchor); }` |
| `.mosaic__inner` | `display: grid; gap: var(--s-12); align-items: center;` · desde 900 px `grid-template-columns: 6fr 5fr;` |
| `.mosaic__photos` | `display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-3);` · `.mosaic__photo { width: 100%; height: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--r-card); }` · `.mosaic__photo--tall { grid-row: span 2; aspect-ratio: auto; border-radius: var(--r-arch); }` |
| `.mosaic__quote` | `margin: var(--s-8) 0 0; padding-left: var(--s-6); border-left: 2px solid var(--c-gold); font: 400 1.5rem/1.3 var(--font-display);` y `p { margin: 0; }` |

Añade a `tests/inicio.test.js`:
- Orden: `hero`, `pillars`, `icon-row`, `service-cards`, `spotlight`, `mosaic`.
- `.spotlight`: tres `img` `champu-equilibrante.webp`, `champu-vitalzen.webp`, `champu-multiefecto.webp` (2250×2250, `loading="lazy"`, alt `Frasco del champú … de Jaldún`) dentro de `.arch`; `h2` con `<em>Jaldún</em>`; `ul.checklist` con tres `li` cuyos `strong` son `Equilibrante`, `Vitalzen Fortificante`, `Multiefecto Regulador`; botón `Ver tienda` con `href="pages/tienda.html#jaldun"`.
- `.mosaic`: tres fotos (`servicio-salud.webp` 1000×1250, `destacado-terapias.webp` 900×1125, `servicio-peluqueria.webp` 1000×1250) con sus alt; el texto contiene la cita `la energía del interior y la que envuelve al cuerpo físico` dentro de `<em>`; la sección **no** contiene `Hola, soy Paula`, `retrato`, `años de experiencia` ni un número seguido de `años`.
- CSS: `.spotlight__bottles img` con `mix-blend-mode: multiply`.

**Files**
- `index.html` — edit
- `css/styles.css` — edit
- `tests/inicio.test.js` — edit

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that the sections of `main` are, in order, `hero`, `pillars`, `icon-row`, `service-cards`, `spotlight` and `mosaic`.
2. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.spotlight` shows the three `champu-*.webp` photos at 2250×2250 with `loading="lazy"` and their real alt text inside an `.arch` panel, and that `css/styles.css` gives `.spotlight__bottles img` `mix-blend-mode: multiply`.
3. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.spotlight` has a three-item `ul.checklist` whose `strong` labels are "Equilibrante", "Vitalzen Fortificante" and "Multiefecto Regulador", and a button "Ver tienda" to `pages/tienda.html#jaldun`.
4. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.mosaic` shows `servicio-salud.webp` (1000×1250), `destacado-terapias.webp` (900×1125) and `servicio-peluqueria.webp` (1000×1250) with their real alt text, and the quote "la energía del interior y la que envuelve al cuerpo físico" inside `<em>`.
5. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the `.mosaic` section contains none of "Hola, soy Paula", "retrato", "años de experiencia" or a number followed by "años".
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 5 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/inicio.test.js
node tools/smoke.mjs . 4179 ./=200 assets/img/champu-vitalzen.webp=200 assets/img/servicio-salud.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 6: inicio-jaldun-mosaico"
git tag step-06-inicio-jaldun-mosaico
git rev-parse -q --verify refs/tags/step-06-inicio-jaldun-mosaico >/dev/null
git ls-files --error-unmatch index.html css/styles.css tests/inicio.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-06-inicio-jaldun-mosaico` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-06-inicio-jaldun-mosaico` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E2-T2` — Portada D — banner regalo, visita con mapa y JSON-LD

**Depends on:** `E2-T1` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Cierra la portada: añade `.gift-banner` y `.visit` tras `.mosaic`, y el bloque JSON-LD en el `<head>`. El mapa **no** carga nada de Google hasta que el visitante pulsa "Ver el mapa" (`js/main.js` crea el `iframe`); sin JavaScript queda el enlace "Abrir en Google Maps". El texto del velo sobre la foto del banner cumple el contraste porque el par ya está en `tests/css.test.js` (paso 2).

```html
<section class="gift-banner" aria-labelledby="gift-title">
  <img class="gift-banner__img" src="assets/img/tarjeta-regalo.webp" alt="" width="1200" height="900" loading="lazy">
  <div class="gift-banner__veil" aria-hidden="true"></div>
  <div class="container gift-banner__inner reveal">
    <span class="eyebrow">Tarjetas regalo</span>
    <h2 id="gift-title">Regala <em>Aura</em></h2>
    <p>Una tarjeta para un spa capilar, un tratamiento o el importe que prefieras.</p>
    <a class="btn btn--light" href="https://wa.me/34610167764" data-wa="Tarjeta regalo" data-wa-kind="producto">Pedir tarjeta regalo<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-flecha"/></svg></span></a>
  </div>
</section>

<section class="visit section" aria-labelledby="visit-title">
  <div class="container visit__inner">
    <div class="visit__map reveal">
      <div class="map" data-map-src="https://www.google.com/maps?q=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan&amp;output=embed" data-map-title="Mapa: Centro Aura en C/ Dr. Domingo Gallego, 3, Las Cabezas de San Juan">
        <div class="map__cover">
          <img class="lotus" src="assets/icons/loto.svg" alt="" width="64" height="40">
          <p>Para ver el mapa se conectará con Google Maps y Google podrá recibir tu dirección IP.</p>
          <button class="btn btn--primary" type="button" data-map-load hidden>Ver el mapa</button>
          <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan" target="_blank" rel="noopener">Abrir en Google Maps</a>
        </div>
      </div>
    </div>
    <div class="visit__info reveal">
      <span class="eyebrow">Visítanos</span>
      <h2 id="visit-title">Te esperamos en <em>Las Cabezas</em></h2>
      <ul class="visit__list" role="list">
        <li class="visit__item"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-pin"/></svg><address>C/ Dr. Domingo Gallego, 3<br>41730 Las Cabezas de San Juan, Sevilla</address></li>
        <li class="visit__item"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-reloj"/></svg>
          <dl class="hours" data-hours>
            <dt>Lunes – Viernes</dt><dd>9:30 – 14:00 · 17:00 – 20:30</dd>
            <dt>Sábado</dt><dd>9:30 – 14:00</dd>
            <dt>Domingo</dt><dd>Cerrado</dd>
          </dl></li>
        <li class="visit__item"><svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons/sprite.svg#i-telefono"/></svg><a href="tel:+34610167764" data-phone>+34 610 16 77 64</a></li>
      </ul>
      <a class="btn btn--outline" href="https://www.google.com/maps/search/?api=1&amp;query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan" target="_blank" rel="noopener">Cómo llegar</a>
    </div>
  </div>
</section>
```

Bloque JSON-LD en el `<head>` de `index.html` (después de los `<script src>`), con el dominio provisional:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Centro Aura — Spa Capilar · Tricología",
  "description": "Peluquería, spa capilar, barros, alisados y antifrizz con cosmética natural Jaldún.",
  "url": "https://centro-aura-2.vercel.app/",
  "image": "https://centro-aura-2.vercel.app/assets/img/hero-salon.webp",
  "telephone": "+34610167764",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "C/ Dr. Domingo Gallego, 3",
    "addressLocality": "Las Cabezas de San Juan",
    "addressRegion": "Sevilla",
    "postalCode": "41730",
    "addressCountry": "ES"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 36.9853, "longitude": -5.9395 },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:30", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "17:00", "closes": "20:30" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:30", "closes": "14:00" }
  ],
  "sameAs": ["https://www.instagram.com/centro__aura/"]
}
</script>
```

CSS ("Portada · banner y visita"):

| Componente | Declaraciones obligatorias |
|---|---|
| `.gift-banner` | `position: relative; isolation: isolate; overflow: hidden; padding-block: var(--s-24); color: var(--c-on-anchor);` · `.gift-banner__img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }` · `.gift-banner__veil { position: absolute; inset: 0; z-index: -1; background: rgb(var(--veil-dark-rgb) / var(--veil-dark-alpha)); }` · `.gift-banner__inner { max-width: var(--measure); }` · `.gift-banner h2 { color: var(--c-on-anchor); }` · `.gift-banner h2 em, .gift-banner .eyebrow { color: var(--c-on-anchor-soft); }` |
| `.visit__inner` | `display: grid; gap: var(--s-12); align-items: center;` · desde 900 px `grid-template-columns: 1fr 1fr;` |
| `.map` | `position: relative; min-height: 320px; border-radius: var(--r-card); overflow: hidden; background: var(--c-bg-alt);` · `.map__cover { display: grid; place-items: center; align-content: center; gap: var(--s-4); min-height: 320px; padding: var(--s-8); text-align: center; }` · `.map iframe { display: block; width: 100%; height: 100%; min-height: 320px; border: 0; }` · `.lotus { width: 64px; height: 40px; }` |
| `.visit__list` | `display: grid; gap: var(--s-6); margin: var(--s-6) 0; padding: 0; list-style: none;` · `.visit__item { display: grid; grid-template-columns: auto 1fr; gap: var(--s-4); align-items: start; }` · `.visit__item address { font-style: normal; }` |

Añade a `tests/inicio.test.js`:
- Orden final: las ocho secciones de `main` son `hero`, `pillars`, `icon-row`, `service-cards`, `spotlight`, `mosaic`, `gift-banner`, `visit` y `.topbar` precede a `header.site-header`.
- `.gift-banner`: `img` `tarjeta-regalo.webp` 1200×900 con `alt=""`; `.gift-banner__veil` con `aria-hidden="true"`; `h2` `Regala Aura` con `<em>Aura</em>`; botón `Pedir tarjeta regalo` con `data-wa="Tarjeta regalo"`, `data-wa-kind="producto"` y href de respaldo de WhatsApp; CSS: el velo usa `rgb(var(--veil-dark-rgb) / var(--veil-dark-alpha))`.
- `.visit`: `div.map[data-map-src]` con `data-map-src` que empieza por `https://www.google.com/maps?q=` y termina en `&amp;output=embed` (en el HTML), `data-map-title`, `button[data-map-load][hidden]` con texto `Ver el mapa` y enlace `Abrir en Google Maps` a `https://www.google.com/maps/search/`; `index.html` no contiene `<iframe`; `dl[data-hours]`, `a[data-phone]` con `tel:+34610167764` y botón `Cómo llegar`.
- JSON-LD: el `<script type="application/ld+json">` se parsea; `@type` es `HairSalon`; `telephone` es `'+' + data.business.phoneDigits`; `sameAs` es `[data.business.instagram]`; `address.postalCode` es `41730`; las parejas día|apertura|cierre de `openingHoursSpecification` (con `dayOfWeek` como cadena o lista) son **exactamente** las que salen de `data.hours` (con la hora rellenada a cinco caracteres: `9:30` → `09:30`), comparadas como conjuntos ordenados.

**Files**
- `index.html` — edit
- `css/styles.css` — edit
- `tests/inicio.test.js` — edit

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that the eight sections of `main` are, in order, `hero`, `pillars`, `icon-row`, `service-cards`, `spotlight`, `mosaic`, `gift-banner` and `visit`, and that `.topbar` precedes `header.site-header`.
2. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `.gift-banner` has a decorative (`alt=""`) 1200×900 `tarjeta-regalo.webp`, an `aria-hidden` veil painted with `rgb(var(--veil-dark-rgb) / var(--veil-dark-alpha))`, the heading "Regala Aura" and the button "Pedir tarjeta regalo" with `data-wa="Tarjeta regalo"` and the `wa.me/34610167764` fallback.
3. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that `index.html` contains no `<iframe`, and that `.visit` holds `div.map[data-map-src]` with a `data-map-title`, a hidden `button[data-map-load]` reading "Ver el mapa" and a link "Abrir en Google Maps" to `https://www.google.com/maps/search/`.
4. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the JSON-LD parses as `HairSalon` with `telephone` equal to `+` plus `data.business.phoneDigits`, `sameAs` equal to `[data.business.instagram]` and `postalCode` `41730`.
5. **WHEN** `node --test tests/inicio.test.js` runs **THE SYSTEM SHALL** assert that the day|opens|closes triples of the JSON-LD `openingHoursSpecification` equal, as sorted sets, those derived from `data.hours` with times zero-padded to five characters.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with the gates of steps 1 to 6 still green.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/inicio.test.js
node tools/smoke.mjs . 4179 ./=200 assets/img/tarjeta-regalo.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 7: inicio-regalo-visita"
git tag step-07-inicio-regalo-visita
git rev-parse -q --verify refs/tags/step-07-inicio-regalo-visita >/dev/null
git ls-files --error-unmatch index.html css/styles.css tests/inicio.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-07-inicio-regalo-visita` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-07-inicio-regalo-visita` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E2-T3` — Servicios: pestañas, filas-tarjeta y análisis

**Depends on:** `E1-T3` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Crea `pages/servicios.html` con la estructura común del paso 3 (prefijo `../`, `aria-current="page"` en `Servicios`) y estos metadatos: `title` `Servicios · Spa, barros, alisados y peluquería | Centro Aura`; `meta description` `Spa esencial, equilibrio y aura, barros, alisados, antifrizz, tratamientos de la fibra capilar, cortes y peinados en Centro Aura, Las Cabezas de San Juan.`; `canonical` y `og:url` `https://centro-aura-2.vercel.app/pages/servicios.html`; `og:title` `Servicios · Centro Aura`; `og:description` `Spa capilar, barros, alisados y peluquería en Las Cabezas de San Juan.`; `og:image` `https://centro-aura-2.vercel.app/assets/img/hero-salon.webp`. Todos los textos de servicios, descripciones, listas "incluye", avisos y precios salen de `docs/contenido-fuente.md` PARTE 1 (sección "Servicios"); los ids de cada servicio son los de `js/data.js` (`spa-esencial`, `spa-equilibrio`, `spa-aura`, `barro-raiz`, `barro-completo`, `alisado-corto`, `alisado-media-melena`, `alisado-largo`, `alisado-muy-largo`, `antifrizz-corto`, `antifrizz-medio-largo`, `tratamiento-fibra`, `lavado-peinado`, `corte`, `corte-peinado`).

Estructura del `<main>` (las rutas llevan el prefijo `../`):

```html
<main id="contenido">
  <section class="page-hero">
    <img class="page-hero__bg" src="../assets/img/textura-lino.webp" alt="" width="2000" height="900" fetchpriority="high">
    <div class="page-hero__veil" aria-hidden="true"></div>
    <div class="container page-hero__inner">
      <img class="lotus" src="../assets/icons/loto.svg" alt="" width="64" height="40">
      <h1>Servicios</h1>
      <p>Spa, barros, alisados y peluquería. Todo empieza por escucharte y mirar tu cuero cabelludo.</p>
    </div>
  </section>

  <section class="section" aria-label="Carta de servicios">
    <div class="container">
      <div class="tabs chips" role="tablist" aria-label="Categorías de servicios" hidden>
        <button class="tab" type="button" role="tab" id="tab-spa" aria-controls="spa" aria-selected="true" data-category="spa">Spa</button>
        <button class="tab" type="button" role="tab" id="tab-tratamientos" aria-controls="barros-alisados-antifrizz" aria-selected="false" tabindex="-1" data-category="tratamientos">Barros, alisados y antifrizz</button>
        <button class="tab" type="button" role="tab" id="tab-peluqueria" aria-controls="peluqueria" aria-selected="false" tabindex="-1" data-category="peluqueria">Peluquería</button>
      </div>

      <div class="category" id="spa" role="tabpanel" aria-labelledby="tab-spa">
        <div class="category__head">
          <div>
            <h2>Spa</h2>
            <p class="lead">Un momento para ti: tres rituales, de menos a más completo.</p>
          </div>
          <img class="category__photo" src="../assets/img/servicio-salud.webp" alt="Masaje en el cuero cabelludo con la clienta relajada" width="1000" height="1250" loading="lazy">
        </div>
        <ul class="service-rows" role="list">
          <li class="service-row card" id="spa-esencial">
            <div class="service-row__main">
              <div class="chips"><span class="chip" data-duration="spa-esencial">50 min aprox.</span></div>
              <h3>Spa esencial</h3>
              <p>Un momento para desconectar y disfrutar de un ritual de bienestar.</p>
              <ul class="includes" role="list"><li>Lavado capilar</li><li>Masaje de hombros, cuello, rostro y cabeza</li><li>Secado final</li></ul>
            </div>
            <div class="service-row__side">
              <span class="price" data-price="spa-esencial">40 €</span>
              <a class="btn btn--outline btn--sm" href="https://wa.me/34610167764" data-wa="Spa esencial">Reservar</a>
            </div>
          </li>
          <!-- spa-equilibrio y spa-aura: misma fila-tarjeta con sus textos, listas y duración de la PARTE 1 -->
        </ul>
      </div>

      <div class="category" id="barros-alisados-antifrizz" role="tabpanel" aria-labelledby="tab-tratamientos">
        <div class="category__head">
          <div>
            <h2>Barros, alisados y antifrizz</h2>
            <p class="lead">Tratamientos para la fibra capilar, según lo que necesite tu pelo.</p>
            <p class="price-note">Los precios de este apartado son <strong>orientativos</strong>: varían según los productos que se gasten, el largo y la densidad del pelo.</p>
          </div>
          <img class="category__photo" src="../assets/img/servicio-tratamientos.webp" alt="Melena larga, lisa y brillante vista de espaldas" width="1000" height="1250" loading="lazy">
        </div>
        <p class="service-group">Barros</p>
        <ul class="service-rows" role="list"><!-- barro-raiz, barro-completo --></ul>
        <p class="service-group">Alisados</p>
        <ul class="service-rows" role="list"><!-- alisado-corto, alisado-media-melena, alisado-largo, alisado-muy-largo --></ul>
        <p class="service-group">Antifrizz</p>
        <ul class="service-rows" role="list"><!-- antifrizz-corto, antifrizz-medio-largo --></ul>
        <p class="service-group">Fibra capilar</p>
        <ul class="service-rows" role="list"><!-- tratamiento-fibra (con la lista Reparación, Hidratación, Nutrición) --></ul>
      </div>

      <div class="category" id="peluqueria" role="tabpanel" aria-labelledby="tab-peluqueria">
        <div class="category__head">
          <div>
            <h2>Peluquería</h2>
            <p class="lead">Cortes y peinados con el mismo mimo que todo lo demás.</p>
          </div>
          <img class="category__photo" src="../assets/img/servicio-peluqueria.webp" alt="Estilista secando el pelo de una clienta con cepillo redondo" width="1000" height="1250" loading="lazy">
        </div>
        <ul class="service-rows" role="list"><!-- lavado-peinado, corte (con <p class="service-row__note">Incluye lavado, corte y secado</p> bajo el h3), corte-peinado --></ul>
      </div>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="consulta-title">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Paso a paso</span>
        <h2 id="consulta-title">¿Cómo es el análisis del cuero cabelludo?</h2>
      </div>
      <ol class="steps-grid" role="list">
        <li class="step-card card reveal"><span class="step-card__num" aria-hidden="true">1</span><h3>Diagnóstico con microcámara</h3><p>En el Spa equilibrio y el Spa aura vemos tu cuero cabelludo ampliado en pantalla y te explico lo que encontramos.</p></li>
        <li class="step-card card reveal"><span class="step-card__num" aria-hidden="true">2</span><h3>Plan personalizado</h3><p>Elegimos el tratamiento en cabina y los productos para casa según lo que necesita tu piel.</p></li>
        <li class="step-card card reveal"><span class="step-card__num" aria-hidden="true">3</span><h3>Seguimiento</h3><p>Revisamos cómo evoluciona y ajustamos el plan hasta ver resultados.</p></li>
      </ol>
    </div>
  </section>

  <section class="section cta" aria-labelledby="dudas-title">
    <div class="container section-head section-head--center reveal">
      <h2 id="dudas-title">¿Dudas sobre qué necesita tu cabello?</h2>
      <p>Cuéntamelo y lo vemos, sin compromiso.</p>
      <a class="btn btn--primary" href="contacto.html#formulario">Escríbeme<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-flecha"/></svg></span></a>
    </div>
  </section>
</main>
```

Los comentarios `<!-- … -->` del bloque indican filas que debes escribir completas con el mismo molde que `spa-esencial` y **desaparecen al terminar** (no puede quedar ningún comentario con `<!--` salvo el de borrador de las páginas legales). Los servicios de "Barros, alisados y antifrizz" no llevan duración (`js/data.js` no la define) y sí `data-price` con su rango; el texto de respaldo del precio es `lib.formatPrice(item)` (p. ej. `30–40 €` con espacio duro U+00A0).

CSS ("Páginas interiores · Servicios"), en `css/styles.css`, mobile-first:

| Componente | Declaraciones obligatorias |
|---|---|
| `.page-hero` | `position: relative; isolation: isolate; overflow: hidden; padding-block: var(--s-16); text-align: center;` · `.page-hero__bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }` · `.page-hero__veil { position: absolute; inset: 0; z-index: -1; background: rgb(var(--veil-light-rgb) / var(--veil-light-alpha)); }` · `.page-hero p { max-width: var(--measure); margin: var(--s-4) auto 0; color: var(--c-text); }` (solo `--c-text` sobre el velo: es el par comprobado) · `.page-hero .lotus { margin-inline: auto; }` |
| `.tabs` / `.tab` | `.tabs { margin-bottom: var(--s-8); }` · `.tab { min-height: 44px; padding: 0 var(--s-6); border: 1.5px solid var(--c-border); border-radius: var(--r-pill); background: transparent; color: var(--c-text); font: 500 0.9375rem/1 var(--font-body); cursor: pointer; }` · `.tab[aria-selected="true"] { background: var(--c-anchor); border-color: var(--c-anchor); color: var(--c-on-anchor); }` |
| `.category` | `.category + .category { margin-top: var(--s-16); }` · `.category__head { display: grid; gap: var(--s-6); margin-bottom: var(--s-8); }` y desde 900 px `grid-template-columns: 1fr 280px; align-items: center;` · `.category__photo { width: 100%; max-width: 280px; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--r-arch); }` |
| `.price-note` | `margin: var(--s-4) 0 0; padding: var(--s-4) var(--s-6); border-left: 3px solid var(--c-gold); background: var(--c-bg-alt);` |
| `.service-group` | `margin: var(--s-8) 0 var(--s-3); font: 500 var(--fs-eyebrow)/1.4 var(--font-body); letter-spacing: var(--ls-eyebrow); text-transform: uppercase; color: var(--c-clay);` |
| `.service-rows` / `.service-row` | `.service-rows { display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none; }` · `.service-row { display: grid; gap: var(--s-4); padding: var(--s-6); }` y desde 600 px `grid-template-columns: 1fr auto; align-items: center;` · `.service-row__side { display: flex; align-items: center; justify-content: space-between; gap: var(--s-6); }` y desde 600 px `flex-direction: column; align-items: flex-end;` · `.service-row .price { font-size: 2rem; }` · `.includes { display: grid; gap: var(--s-1); margin: var(--s-3) 0 0; padding-left: var(--s-4); color: var(--c-text-soft); }` · `.service-row__note { margin: 0; color: var(--c-text-soft); font-size: 0.9375rem; }` |
| `.steps-grid` / `.step-card` | `.steps-grid { display: grid; gap: var(--s-6); margin: 0; padding: 0; list-style: none; }` y 3 columnas desde 760 px · `.step-card { padding: var(--s-8); }` · `.step-card__num { display: block; margin-bottom: var(--s-3); font: 500 3rem/1 var(--font-display); color: var(--c-clay); }` |
| `.cta` | `text-align: center;` |

Crea `tests/servicios.test.js` (CommonJS: carga `pages/servicios.html`, `js/data.js` y `js/lib.js`). Aserta:
- **Filas:** por cada ítem de `data.items` con `type === 'servicio'` existe `<li class="service-row card" id="<id>">`, un `data-price="<id>"`, un `<a … data-wa="<item.name>">` y `data-duration="<id>"` **si y solo si** `item.duration` existe.
- **Respaldo == datos:** el texto de cada `data-price="<id>"` es `lib.formatPrice(item)` (espacios normalizados).
- **Aviso orientativo:** en el panel `barros-alisados-antifrizz`, `p.price-note` con `<strong>orientativos</strong>` y `productos que se gasten`, antes del primer `data-price`.
- **Corte:** `<h3>Corte</h3>` seguido de `<p class="service-row__note">Incluye lavado, corte y secado</p>`.
- **Spa:** los tres servicios Spa tienen `ul.includes` con `Masaje de hombros, cuello, rostro y cabeza`.
- **Paneles:** cada servicio está dentro del panel de su categoría (`spa` → `#spa`, `tratamientos` → `#barros-alisados-antifrizz`, `peluqueria` → `#peluqueria`).
- **Pestañas:** `div[role="tablist"][hidden]` con `aria-label`; por cada categoría de `data.categories`, `role="tab" id="tab-<id>" aria-controls="<panel>" … data-category="<id>"` y `role="tabpanel" aria-labelledby="tab-<id>"`; solo la primera pestaña con `aria-selected="true"` y las otras con `tabindex="-1"`.
- **Cabecera y fotos:** `h1` `Servicios`; `textura-lino.webp` 2000×900 `alt=""` con `.page-hero__veil`; las tres fotos de categoría con sus alt de `docs/contenido-fuente.md` y 1000×1250 `loading="lazy"`.
- **Análisis y CTA:** `h2` `¿Cómo es el análisis del cuero cabelludo?`, tres `li.step-card` (`Diagnóstico con microcámara`, `Plan personalizado`, `Seguimiento`) y botón `Escríbeme` a `contacto.html#formulario`.
- **Enlaces entrantes:** todo `servicios.html#<id>` que aparezca en cualquier página de `pageFiles()` apunta a un `id` que existe en `pages/servicios.html`.
- **CSS:** `.page-hero__veil` con `rgb(var(--veil-light-rgb) / var(--veil-light-alpha))`.

**Files**
- `pages/servicios.html` — new
- `css/styles.css` — edit
- `tests/servicios.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/servicios.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that every `servicio` item of `js/data.js` has its `li.service-row#<id>`, a `data-price`, a `data-wa` equal to its name, and a `data-duration` only when `data.js` defines a duration.
2. **WHEN** `node --test tests/servicios.test.js` runs **THE SYSTEM SHALL** assert that the written text of every `data-price` equals `lib.formatPrice` of its item, including the ranges such as `30–40 €`.
3. **WHEN** `node --test tests/servicios.test.js` runs **THE SYSTEM SHALL** assert that the panel `barros-alisados-antifrizz` shows `p.price-note` with the word "orientativos" before its first price, that Corte shows "Incluye lavado, corte y secado", and that the three Spa rows list "Masaje de hombros, cuello, rostro y cabeza".
4. **WHEN** `node --test tests/servicios.test.js` runs **THE SYSTEM SHALL** assert a hidden `tablist` with one `tab` per `data.categories` entry controlling the panels `spa`, `barros-alisados-antifrizz` and `peluqueria`, only the first tab selected, and every service inside the panel of its category.
5. **WHEN** `node --test tests/servicios.test.js` runs **THE SYSTEM SHALL** assert that every `servicios.html#<id>` link on any page resolves to an `id` present in `pages/servicios.html`, that the page has `h1` "Servicios", three category photos at 1000×1250, the three `li.step-card` of the scalp analysis and the button "Escríbeme" to `contacto.html#formulario`.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0, including `tests/pages.test.js` on the new page and the `css/styles.css` checks of `tests/css.test.js`.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/servicios.test.js
node tools/smoke.mjs . 4179 pages/servicios.html=200 assets/img/servicio-salud.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 8: servicios"
git tag step-08-servicios
git rev-parse -q --verify refs/tags/step-08-servicios >/dev/null
git ls-files --error-unmatch pages/servicios.html css/styles.css tests/servicios.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-08-servicios` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-08-servicios` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E2-T4` — Tienda: categorías, champús Jaldún y tarjetas regalo

**Depends on:** `E2-T3` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Crea `pages/tienda.html` con la estructura común (prefijo `../`, `aria-current="page"` en `Tienda`). Metadatos: `title` `Tienda · Champús Jaldún y tarjetas regalo | Centro Aura`; `meta description` `Champús naturales Jaldún, y tarjetas regalo de Centro Aura. Pídelos por WhatsApp y recógelos en el salón.`; `canonical` y `og:url` `https://centro-aura-2.vercel.app/pages/tienda.html`; `og:title` `Tienda · Centro Aura`; `og:description` `Cosmética natural Jaldún y tarjetas regalo.`; `og:image` `https://centro-aura-2.vercel.app/assets/img/hero-salon.webp`. Textos de fichas, precios y botones: `docs/contenido-fuente.md` PARTE 1 (sección "Tienda") y PARTE 3. **Sin carrito**: cada botón abre WhatsApp con un mensaje de producto (`data-wa-kind="producto"`).

Estructura del `<main>`:

```html
<main id="contenido">
  <section class="page-hero">
    <img class="page-hero__bg" src="../assets/img/textura-lino.webp" alt="" width="2000" height="900" fetchpriority="high">
    <div class="page-hero__veil" aria-hidden="true"></div>
    <div class="container page-hero__inner">
      <img class="lotus" src="../assets/icons/loto.svg" alt="" width="64" height="40">
      <h1>Tienda</h1>
      <p>Cosmética natural Jaldún y tarjetas regalo.</p>
    </div>
  </section>

  <div class="container">
    <p class="note"><svg class="icon" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-pin"/></svg>Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.</p>
  </div>

  <section class="section" aria-labelledby="categorias-title">
    <div class="container">
      <h2 class="visually-hidden" id="categorias-title">Secciones de la tienda</h2>
      <div class="category-tiles">
        <a class="category-tile card" href="#jaldun">
          <img src="../assets/img/champu-vitalzen.webp" alt="" width="2250" height="2250" loading="lazy">
          <div><h3>Champús Jaldún</h3><p>Fitoterapia capilar para cada tipo de cuero cabelludo.</p><span class="link-arrow" aria-hidden="true">Ver champús</span></div>
        </a>
        <a class="category-tile card" href="#tarjetas-regalo">
          <img src="../assets/img/tarjeta-regalo.webp" alt="" width="1200" height="900" loading="lazy">
          <div><h3>Tarjetas regalo</h3><p>Una tarjeta para un spa capilar, un tratamiento o el importe que prefieras.</p><span class="link-arrow" aria-hidden="true">Ver tarjetas regalo</span></div>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--alt" id="jaldun" aria-labelledby="jaldun-title">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Cosmética natural</span>
        <h2 id="jaldun-title">Champús <em>Jaldún</em></h2>
        <p>Fitoterapia capilar que devuelve al cuero cabelludo su equilibrio natural. Si no sabes cuál es el tuyo, pregúntame.</p>
      </div>
      <ul class="product-grid" role="list">
        <li class="product-card product-card--featured card reveal">
          <div class="product-card__visual arch"><img src="../assets/img/champu-equilibrante.webp" alt="Frasco del champú Equilibrante de Jaldún" width="2250" height="2250" loading="lazy"></div>
          <div class="product-card__body">
            <h3>Champú Equilibrante</h3>
            <p>Para caspa y exceso de grasa. Equilibra el cuero cabelludo con árbol de té, sauce y aloe vera.</p>
            <span class="price" data-price="jaldun-equilibrante">22 €</span>
            <a class="btn btn--primary" href="https://wa.me/34610167764" data-wa="Champú Equilibrante Jaldún" data-wa-kind="producto">Lo quiero<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-flecha"/></svg></span></a>
          </div>
        </li>
        <!-- Vitalzen y Multiefecto: misma ficha sin `--featured` y sin `.arch`, con su foto, alt, texto, precio y botón de la PARTE 1 -->
      </ul>
    </div>
  </section>

  <section class="section" id="tarjetas-regalo" aria-labelledby="regalo-title">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Un detalle con sentido</span>
        <h2 id="regalo-title">Tarjetas regalo</h2>
        <p>Elige un importe o regala un servicio concreto. La preparamos a mano y la recoges en el salón.</p>
      </div>
      <ul class="gift-grid" role="list">
        <li class="gift-tile card reveal">
          <div class="gift-tile__face" aria-hidden="true"><img class="lotus" src="../assets/icons/loto.svg" alt="" width="64" height="40"><span class="gift-tile__brand">AURA</span><span class="gift-tile__value" data-price="regalo-25">25 €</span></div>
          <div class="gift-tile__body">
            <h3>Tarjeta de 25 €</h3>
            <p>Para gastar en cualquier servicio o producto.</p>
            <span class="price" data-price="regalo-25">25 €</span>
            <a class="btn btn--outline btn--sm" href="https://wa.me/34610167764" data-wa="Tarjeta regalo de 25 €" data-wa-kind="producto">Regalar</a>
          </div>
        </li>
        <!-- Tarjetas de 50 € y de 75 € (mismo molde, `data-price="regalo-50"` y `"regalo-75"`) y la cuarta: "El servicio que elijas" · "Un spa capilar, un tratamiento o un peinado para una ocasión especial." · cara con el texto `Un servicio` · precio `<span class="price">A elegir</span>` · botón Regalar con data-wa="Tarjeta regalo de un servicio" -->
      </ul>
    </div>
  </section>
</main>
```

Los comentarios del bloque se sustituyen por las fichas completas y no pueden quedar. Todo texto de respaldo de precio usa un espacio duro U+00A0 antes de `€` (`25 €`), como `lib.formatPrice`; el test normaliza los espacios al comparar.

CSS ("Páginas interiores · Tienda"):

| Componente | Declaraciones obligatorias |
|---|---|
| `.note` | `display: flex; align-items: center; justify-content: center; gap: var(--s-2); margin: var(--s-6) 0 0; color: var(--c-text-soft);` |
| `.category-tiles` | `display: grid; gap: var(--s-6);` y 2 columnas desde 760 px · `.category-tile { display: grid; grid-template-columns: 120px 1fr; gap: var(--s-4); align-items: center; padding: var(--s-4); color: inherit; text-decoration: none; }` · `.category-tile img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: var(--r-card); mix-blend-mode: multiply; }` · `.category-tile h3 { font-size: 1.5rem; }` |
| `.product-grid` | `display: grid; gap: var(--s-6); margin: 0; padding: 0; list-style: none;` y 3 columnas desde 900 px · `.product-card { display: grid; }` · `.product-card__visual { background: var(--c-bg-alt); }` · `.product-card__visual img { width: 100%; aspect-ratio: 1 / 1; object-fit: contain; mix-blend-mode: multiply; }` · `.product-card__body { display: grid; gap: var(--s-3); padding: var(--s-6); align-content: start; }` · `.product-card--featured .product-card__visual { border-radius: var(--r-arch); margin: var(--s-4) var(--s-4) 0; }` y desde 900 px `.product-card--featured { grid-column: span 3; grid-template-columns: 1fr 1fr; align-items: center; }` |
| `.gift-grid` | `display: grid; gap: var(--s-6); margin: 0; padding: 0; list-style: none;` · 2 columnas desde 600 px · 4 desde 1200 px · `.gift-tile__face { display: grid; place-items: center; align-content: center; gap: var(--s-1); min-height: 160px; background: var(--c-anchor); color: var(--c-on-anchor); }` · `.gift-tile__brand { font: 500 1rem/1 var(--font-display); letter-spacing: 0.32em; }` · `.gift-tile__value { font: 500 2.25rem/1 var(--font-display); }` · `.gift-tile__body { display: grid; gap: var(--s-3); padding: var(--s-6); }` |

Crea `tests/tienda.test.js` (CommonJS). Aserta:
- **Fotos de producto:** los tres `champu-*.webp` aparecen con `width="2250" height="2250" loading="lazy"` y alt `Frasco del champú Equilibrante de Jaldún`, `Frasco del champú Vitalzen Fortificante de Jaldún`, `Frasco del champú Multiefecto Regulador de Jaldún`; no queda `class="bottle`.
- **Secciones:** `section#jaldun` y `section#tarjetas-regalo`; dos `a.category-tile` con `href="#jaldun"` y `href="#tarjetas-regalo"`; no existe `id="bonos"` ni `href="#bonos"`.
- **Destacada:** el primer `li.product-card` es `product-card--featured` y su `.product-card__visual` lleva la clase `arch`; los otros dos no.
- **Precios:** todo ítem de `data.items` que no sea `servicio` tiene un `data-price="<id>"` en la página y el texto de cada `data-price` es `lib.formatPrice(item)` (comparando con los espacios normalizados).
- **Botones:** dentro de `<main>` hay exactamente un `<a data-wa="…">` por ficha de producto (3) y por tarjeta de regalo (4), es decir 7, y todos llevan `data-wa-kind="producto"`; los textos de botón son `Lo quiero` (productos) y `Regalar` (tarjetas).
- **Nota y hero:** el texto `Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.` está presente; `h1` `Tienda`; `textura-lino.webp` con veil.
- **CSS:** `.product-card--featured` y `mix-blend-mode: multiply` presentes.

**Files**
- `pages/tienda.html` — new
- `css/styles.css` — edit
- `tests/tienda.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/tienda.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting that `section#jaldun` shows the three `champu-*.webp` photos at 2250×2250 with `loading="lazy"` and their real alt text, the first card being `product-card--featured` with an `.arch` visual.
2. **WHEN** `node --test tests/tienda.test.js` runs **THE SYSTEM SHALL** assert that `section#tarjetas-regalo` shows four gift tiles and that two `a.category-tile` link to `#jaldun` and `#tarjetas-regalo`, with no `id="bonos"` anywhere.
3. **WHEN** `node --test tests/tienda.test.js` runs **THE SYSTEM SHALL** assert that every non-service item of `js/data.js` has a `data-price` on the page whose text equals `lib.formatPrice` of the item (whitespace normalized).
4. **WHEN** `node --test tests/tienda.test.js` runs **THE SYSTEM SHALL** assert that `main` contains exactly seven `a[data-wa]` buttons (three "Lo quiero", four "Regalar"), each with `data-wa-kind="producto"`.
5. **WHEN** `node --test tests/tienda.test.js` runs **THE SYSTEM SHALL** assert the note "Recogida en el salón. Te confirmamos disponibilidad por WhatsApp." and the `h1` "Tienda".
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0, including `tests/pages.test.js` on the new page.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/tienda.test.js
node tools/smoke.mjs . 4179 pages/tienda.html=200 assets/img/champu-equilibrante.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 9: tienda"
git tag step-09-tienda
git rev-parse -q --verify refs/tags/step-09-tienda >/dev/null
git ls-files --error-unmatch pages/tienda.html css/styles.css tests/tienda.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-09-tienda` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-09-tienda` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

### `E2-T5` — Contacto: tarjetas, mapa y formulario a WhatsApp

**Depends on:** `E2-T4` · **Priority:** p0 — metadata para recortes de alcance, no un orden de ejecución

Crea `pages/contacto.html` con la estructura común (prefijo `../`, `aria-current="page"` en `Contacto`). Metadatos: `title` `Contacto y horario | Centro Aura, Las Cabezas de San Juan`; `meta description` `Teléfono, WhatsApp, horario y cómo llegar a Centro Aura: C/ Dr. Domingo Gallego, 3, Las Cabezas de San Juan (Sevilla). Pide cita o pregúntanos lo que necesites.`; `canonical` y `og:url` `https://centro-aura-2.vercel.app/pages/contacto.html`; `og:title` `Contacto · Centro Aura`; `og:description` `Pide cita por WhatsApp o visítanos en Las Cabezas de San Juan.`; `og:image` `https://centro-aura-2.vercel.app/assets/img/hero-salon.webp`. Textos: `docs/contenido-fuente.md` PARTE 1 ("Contacto") y PARTE 3. El formulario **no tiene servidor**: `js/main.js` valida, compone el mensaje con `AuraLib.composeContactMessage` y abre WhatsApp.

Estructura del `<main>` tras el `page-hero` (h1 `Contacto`, texto `Escríbeme, llámame o pásate por el salón. Te respondo lo antes posible.`, mismo molde que Servicios):

```html
<section class="section" aria-label="Formas de contacto">
  <div class="container">
    <ul class="contact-cards" role="list">
      <li class="reveal"><a class="contact-card card" href="tel:+34610167764">
        <span class="contact-card__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-telefono"/></svg></span>
        <h2>Llámame</h2><span data-phone>+34 610 16 77 64</span></a></li>
      <li class="reveal"><a class="contact-card card" href="https://wa.me/34610167764" data-wa="">
        <span class="contact-card__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-whatsapp"/></svg></span>
        <h2>WhatsApp</h2><span>Pide cita o pregúntame</span></a></li>
      <li class="reveal"><a class="contact-card card" href="https://www.instagram.com/centro__aura/" target="_blank" rel="noopener">
        <span class="contact-card__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-instagram"/></svg></span>
        <h2>Instagram</h2><span>@centro__aura</span></a></li>
      <li class="reveal"><a class="contact-card card" href="https://www.google.com/maps/search/?api=1&amp;query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan" target="_blank" rel="noopener">
        <span class="contact-card__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-pin"/></svg></span>
        <h2>Cómo llegar</h2><span>C/ Dr. Domingo Gallego, 3</span></a></li>
    </ul>
  </div>
</section>

<section class="section section--alt" aria-labelledby="horario-title">
  <div class="container contact-visit">
    <div class="reveal">
      <span class="eyebrow">Horario</span>
      <h2 id="horario-title">Cuándo encontrarnos</h2>
      <address>C/ Dr. Domingo Gallego, 3<br>41730 Las Cabezas de San Juan, Sevilla</address>
      <dl class="hours" data-hours>
        <dt>Lunes – Viernes</dt><dd>9:30 – 14:00 · 17:00 – 20:30</dd>
        <dt>Sábado</dt><dd>9:30 – 14:00</dd>
        <dt>Domingo</dt><dd>Cerrado</dd>
      </dl>
    </div>
    <div class="reveal">
      <!-- el mismo bloque div.map que la portada (paso 7), con las rutas de este nivel -->
    </div>
  </div>
</section>

<section class="section" id="formulario" aria-labelledby="form-title">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">Pregúntanos</span>
      <h2 id="form-title">¿Tienes alguna duda?</h2>
      <p>Escribe tu mensaje y se abrirá WhatsApp con todo listo para enviar.</p>
    </div>
    <form class="contact-form" id="contact-form">
      <div class="form-summary" id="form-summary" aria-live="polite"></div>
      <div class="field">
        <label for="f-nombre">Nombre</label>
        <input id="f-nombre" name="nombre" type="text" autocomplete="given-name" required aria-describedby="err-nombre" data-error="Escribe tu nombre, por favor.">
        <p class="field-error" id="err-nombre"></p>
      </div>
      <div class="field">
        <label for="f-servicio">Servicio de interés <span class="optional">(opcional)</span></label>
        <select id="f-servicio" name="servicio">
          <option value="">Elige una opción</option>
          <option>Spa esencial</option>
          <option>Spa equilibrio</option>
          <option>Spa aura</option>
          <option>Barros</option>
          <option>Alisados</option>
          <option>Antifrizz</option>
          <option>Tratamiento de la fibra capilar</option>
          <option>Lavado y peinado</option>
          <option>Corte</option>
          <option>Corte y peinado</option>
          <option value="">Otro / no lo sé</option>
        </select>
      </div>
      <div class="field">
        <label for="f-mensaje">Mensaje</label>
        <textarea id="f-mensaje" name="mensaje" rows="5" required aria-describedby="err-mensaje" data-error="Cuéntame en qué puedo ayudarte."></textarea>
        <p class="field-error" id="err-mensaje"></p>
      </div>
      <button class="btn btn--primary" type="submit">Enviar por WhatsApp<span class="btn__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" focusable="false"><use href="../assets/icons/sprite.svg#i-flecha"/></svg></span></button>
      <p class="form-hint">Se abrirá WhatsApp con tu mensaje listo para enviar.</p>
    </form>
  </div>
</section>
```

El comentario `<!-- … -->` del mapa se sustituye por el bloque real y no puede quedar. Las opciones del selector son las etiquetas únicas de `item.contact || item.name` de los servicios de `data.js`.

CSS ("Páginas interiores · Contacto"):

| Componente | Declaraciones obligatorias |
|---|---|
| `.contact-cards` | `display: grid; gap: var(--s-4); margin: 0; padding: 0; list-style: none;` · 2 columnas desde 600 px · 4 desde 900 px · `.contact-card { display: grid; justify-items: center; gap: var(--s-2); height: 100%; padding: var(--s-8) var(--s-6); text-align: center; color: inherit; text-decoration: none; }` · `.contact-card h2 { font-size: 1.5rem; }` · `.contact-card__icon { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: var(--c-clay-soft); color: var(--c-anchor); }` |
| `.contact-visit` | `display: grid; gap: var(--s-12); align-items: center;` y 2 columnas desde 900 px · `address { font-style: normal; margin: var(--s-4) 0 var(--s-6); }` |
| `.contact-form` | `display: grid; gap: var(--s-6); width: min(100%, 640px); margin-inline: auto;` · `.field { display: grid; gap: var(--s-2); }` · `label { font-weight: 500; }` · `input, select, textarea { min-height: 48px; padding: var(--s-3) var(--s-4); border: 1.5px solid var(--c-border); border-radius: var(--s-3); background: var(--c-bg); color: var(--c-text); font: inherit; }` · `[aria-invalid="true"] { border-color: var(--c-error); }` · `.field-error { margin: 0; color: var(--c-error); font-size: 0.875rem; }` · `.form-summary:not(:empty) { padding: var(--s-4); border: 1.5px solid var(--c-error); border-radius: var(--s-3); color: var(--c-error); }` · `.optional { font-weight: 400; color: var(--c-text-soft); }` · `.form-hint { margin: 0; color: var(--c-text-soft); font-size: 0.875rem; }` |

Crea `tests/contacto.test.js` (CommonJS). Aserta:
- **Anclas y cabecera:** `section#formulario`; `h1` `Contacto`.
- **Tarjetas:** cuatro `a.contact-card`: `tel:+34610167764`; `https://wa.me/34610167764` con `data-wa=""`; `https://www.instagram.com/centro__aura/`; `https://www.google.com/maps/search/`.
- **Formulario:** `form#contact-form.contact-form`; para `nombre` y `mensaje`: `<label for="f-<campo>">`, `id="f-<campo>" name="<campo>"` con `required`, `aria-describedby="err-<campo>"` y `data-error="…"`, y `<p class="field-error" id="err-<campo>">` existente; `<label for="f-servicio">`; `div#form-summary` con `aria-live="polite"`.
- **Selector:** para cada servicio de `data.items`, `<option>${item.contact || item.name}</option>` existe; las etiquetas únicas son las diez de la lista del paso (tres Spa, Barros, Alisados, Antifrizz, fibra, lavado, corte y corte y peinado); el último `option` es `Otro / no lo sé` con `value=""`.
- **Mapa:** sin `<iframe`; `div.map[data-map-src]` con `data-map-title`; `button[data-map-load][hidden]` con `Ver el mapa`.
- **Horario:** `dl[data-hours]` con las tres filas de respaldo.
- **Mensaje a WhatsApp:** `lib.composeContactMessage({ name: ' Lucía ', service: 'Corte', message: 'Hola ' })` empieza por `Hola Paula, soy Lucía. Me interesa: Corte.` (el contrato que `main.js` usa al enviar).

**Files**
- `pages/contacto.html` — new
- `css/styles.css` — edit
- `tests/contacto.test.js` — new

**Acceptance**

Copiado literalmente del array `acceptance` de esta tarea en `tasks.json`. Cada criterio se decide con un comando de abajo, en esta máquina, durante el build.

1. **WHEN** `node --test tests/contacto.test.js` runs **THE SYSTEM SHALL** exit 0 after asserting four `a.contact-card` links to `tel:+34610167764`, `https://wa.me/34610167764`, the Instagram profile and Google Maps, plus `section#formulario` and the `h1` "Contacto".
2. **WHEN** `node --test tests/contacto.test.js` runs **THE SYSTEM SHALL** assert that `nombre` and `mensaje` each have a `label[for]`, are `required`, point `aria-describedby` at an existing `p.field-error`, and carry a `data-error` message, and that `div#form-summary` has `aria-live="polite"`.
3. **WHEN** `node --test tests/contacto.test.js` runs **THE SYSTEM SHALL** assert that the select lists, for every `servicio` of `js/data.js`, `item.contact || item.name` as an `<option>`, and ends with the option "Otro / no lo sé" with an empty value.
4. **WHEN** `node --test tests/contacto.test.js` runs **THE SYSTEM SHALL** assert that the page has no `<iframe`, a `div.map[data-map-src]` with `data-map-title`, a hidden `button[data-map-load]` reading "Ver el mapa", and `dl[data-hours]`.
5. **WHEN** `node --test tests/contacto.test.js` runs **THE SYSTEM SHALL** assert that `composeContactMessage` builds "Hola Paula, soy Lucía. Me interesa: Corte. Hola" from `{ name: ' Lucía ', service: 'Corte', message: 'Hola ' }`.
6. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0, including `tests/pages.test.js` on the new page.

**Verify** — todos los comandos, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta; que el último salga 0 es lo que la da por hecha.

```bash
node --test tests/contacto.test.js
node tools/smoke.mjs . 4179 pages/contacto.html=200 assets/img/textura-lino.webp=200
npm test
```

Estas líneas son el array `verify` de la tarea en `tasks.json`, una por línea y con el envoltorio de código de salida intacto (`rc=0; out=$(cmd) || rc=$?; test "$rc" -eq N && echo "$out" | grep -q "…"`). No las "limpies" a la versión sin envolver: una línea cuyo éxito es un código distinto de 0 es una puerta roja para siempre.

**Checkpoint**

```bash
git add -A && git commit -m "step 10: contacto"
git tag step-10-contacto
git rev-parse -q --verify refs/tags/step-10-contacto >/dev/null
git ls-files --error-unmatch pages/contacto.html css/styles.css tests/contacto.test.js >/dev/null
test -z "$(git status --porcelain)"
```

Ejecuta todo tras el último `Verify` en verde y antes de la tarea siguiente. El tag `step-10-contacto` es el objetivo de vuelta atrás: si la siguiente tarea sale mal, `git reset --hard step-10-contacto` en lugar de depurar hacia delante. Las tres últimas líneas son aserciones sobre lo ya commiteado.

---

## Epic acceptance

La épica está hecha cuando todas sus tareas están `done` **y**:

1. **WHEN** `npm test` runs after step 10 **THE SYSTEM SHALL** exit 0 with the home, services, shop and contact tests and the page-structure test green.
2. **WHEN** `node tools/smoke.mjs . 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200` runs **THE SYSTEM SHALL** exit 0.

```bash
npm test
node tools/smoke.mjs . 4179 ./=200 pages/servicios.html=200 pages/tienda.html=200 pages/contacto.html=200
```

Desde la raíz del proyecto. Ambos criterios se deciden con estos comandos: una puerta de épica que espera a una persona bloquea todo lo que viene detrás.

## Pitfalls

- **Rutas sin el prefijo `../`** en una página de `pages/` — `tests/pages.test.js` falla con "no existe"; el navegador no carga CSS ni imágenes.
- **Precio escrito a mano distinto de `lib.formatPrice`** — usa el espacio duro U+00A0 antes de `€` y el guion largo `–` en los rangos.
- **Duración inventada** para un servicio que no la tiene — `data.js` solo define duración en los Spa.
- **Dos botones o enlaces en una tarjeta clicable** — la tarjeta de Spa usa un único enlace en el `h3` estirado con `::after`.
- **Usar `max-width` en una media query** — `tests/css.test.js` falla.

## Before moving on

- [ ] Toda tarea de esta épica está `done` en `tasks.json`; ninguna queda `in_progress`.
- [ ] Todos los comandos `verify` de todas las tareas pasaron, no solo el primero.
- [ ] Ningún `verify` se editó y ninguno se saltó porque faltara un archivo que nombra.
- [ ] Cada tarea de esta épica tiene su tag en git (`step-06-inicio-jaldun-mosaico`, `step-07-inicio-regalo-visita`, `step-08-servicios`, `step-09-tienda`, `step-10-contacto`); `git tag -l 'step-*'` los lista.
- [ ] `npm test` pasa limpio desde la raíz.
- [ ] Todo contrato "Produced" de arriba existe con la firma indicada.
- [ ] No se modificó ningún archivo fuera del subárbol.
- [ ] No hay `.env.example` que actualizar: el proyecto no usa variables de entorno obligatorias.
- [ ] Un commit por tarea, cada uno con su id como prefijo de mensaje (`step N: …`) y seguido de su tag.
