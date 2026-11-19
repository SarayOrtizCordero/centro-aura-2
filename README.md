# Centro Aura — demo B

Segunda propuesta de diseño para la web de Centro Aura (peluquería, spa capilar y tricología en Las Cabezas de San Juan), pensada para que la clienta pueda elegir entre dos diseños. Es un sitio estático de nueve páginas (portada, Servicios, Tienda, Tarjetas regalo, Contacto, Aviso legal, Privacidad, Cookies y la 404), con la misma información que la demo A y una sola acción: reservar por WhatsApp.

No tiene dependencias: HTML, CSS y JavaScript sin framework. Node solo se usa para el servidor local, los tests y el build.

## Verla

Necesitas Node 24 o superior.

```bash
npm run serve
```

Abre http://localhost:4173. Para usar otro puerto: `PORT=4180 npm run serve`.

Mejor no abrirla haciendo doble clic en `index.html` (`file://`): el navegador puede mostrar avisos de precarga de fuentes. Los iconos sí se ven también así, porque cada página lleva el sprite incrustado. Para verla como la verán las clientas, usa el servidor.

## Cambiar precios, horario o teléfono

Todo sale de `js/data.js`.

- **Precios:** cada servicio o producto tiene `price`. Si es un rango, añade `priceMax` (se muestra como `30–40 €`).
- **Texto de respaldo:** el HTML lleva el mismo precio escrito a mano para que se vea aunque el JavaScript falle. Debe coincidir con `js/data.js`; `npm test` avisa si no.
- **Teléfono:** `34610167764` aparece en los enlaces `wa.me` y `tel:` del HTML y en el JSON-LD de `index.html`. `js/data.js` no controla esos enlaces fijos: hay que sustituirlo también ahí.
- **Horario:** además de `js/data.js`, actualiza el JSON-LD de `index.html` y el texto de respaldo de los bloques `[data-hours]` (contacto, portada y pie).

## Cambiar las fotos

Las fotos están en `assets/img/` en formato WebP.

1. Sustituye el archivo conservando el **mismo nombre**.
2. Actualiza `width` y `height` en el HTML con el tamaño real de la nueva foto, y en `tests/fixtures/images.json`.
3. Ejecuta `npm test`: comprueba que los tamaños coinciden.

Las fotos son una mezcla: las de la clienta (el salón, la tricología, los productos de las dos marcas, las tarjetas regalo y el retrato de Paula) y algunas de stock todavía **provisionales**. La procedencia de cada una está en `assets/img/CREDITOS.md` y `assets/brands/CREDITOS.md`.

## Tipografías

Cormorant Garamond (títulos) y DM Sans (texto) se sirven desde este mismo sitio, no desde Google. Para regenerarlas:

```bash
npm run fonts
```

Requiere conexión a Internet. Descarga los `.woff2` a `assets/fonts/` y genera `css/fonts.css`; no edites ese archivo a mano.

## Mapa de Google

El mapa **no se carga** hasta que la visitante pulsa "Ver el mapa". Hasta entonces no se contacta con Google, y por eso la web no necesita banner de cookies. Sin JavaScript queda el enlace "Abrir en Google Maps".

## Páginas legales

`pages/aviso-legal.html`, `pages/privacidad.html` y `pages/cookies.html` llevan los datos de la titular y se dan por buenas (noviembre de 2026). Cada una conserva un comentario `<!-- BORRADOR … -->` en el código fuente, que no se ve en la web; quitarlo exige cambiar también `tests/legal-404.test.js`. Los datos que falten se marcan con `<mark class="pendiente">`, y `npm run pendientes` los detecta.

## Antes de publicar

1. `npm run pendientes` lista lo que falta: los datos legales sin rellenar y el dominio provisional. Termina con código 0 cuando no queda nada.
2. El dominio definitivo es `centroauraspa.es`. Si cambiara: `npm run domain -- https://www.tudominio.es` (con `https://`, sin barra final).
3. Confirma con la clienta los precios y el horario definitivos. Los precios incluyen IVA (confirmado), y así lo dice el aviso legal.
4. `npm run build` copia a `dist/` **solo la web** (lista blanca en `tools/build.mjs`); no se publican `tests/`, `tools/`, `docs/` ni `blueprints/`. En Vercel lo hace `vercel.json`, que además añade las cabeceras de seguridad y la caché de `/assets/`.
5. La página 404 se sirve en cualquier URL gracias a `<base href="/">`.

El despliegue y la elección del dominio los hace una persona; ningún paso del proyecto los ejecuta.

## Tests

```bash
npm test
```

Un archivo concreto: `node --test tests/<archivo>.test.js`.

| Archivo | Qué comprueba |
|---|---|
| `data`, `lib` | los datos de negocio y las funciones puras (precios, horario, mensajes de WhatsApp) |
| `assets`, `domain`, `tooling` | las fotos, el cambio de dominio y las herramientas del proyecto |
| `css` | contraste WCAG, tokens, mobile-first, sin colores sueltos ni `max-width` en media queries |
| `pages`, `shell` | estructura común, metadatos, enlaces y el menú de todas las páginas |
| `inicio`, `servicios`, `tienda`, `tarjetas-regalo`, `contacto` | el contenido de cada página, contra `js/data.js` |
| `legal-404` | las páginas legales (aviso legal, privacidad y cookies) y la 404 |
| `seo` | un solo dominio, canonical de cada página, longitudes de título y descripción, metadatos únicos y el cambio de dominio |
| `deploy` | lo que se publica y lo que no, y las cabeceras de `vercel.json` |
| `a11y` | accesibilidad, tamaños táctiles y reflow |
| `distincion` | que la demo B sea distinta de la A y no contenga reseñas ni cifras inventadas |

Hay además una pasada manual (teclado, zoom, lector de pantalla…) en `docs/qa-manual.md`.

## Estructura

| Carpeta o archivo | Contenido |
|---|---|
| `index.html`, `pages/`, `404.html` | las nueve páginas (ocho públicas y la 404) |
| `css/` | `tokens.css` (únicos colores), `styles.css` y `fonts.css` (generado) |
| `js/` | `data.js` (datos de negocio), `lib.js` (funciones puras) y `main.js` (comportamiento) |
| `assets/` | fotos, iconos (`sprite.svg`, que `node tools/sync-sprite.mjs` incrusta en cada página) y fuentes |
| `tools/` | servidor, build, fuentes, dominio, pendientes y smoke |
| `tests/` | los tests de `npm test` |
| `docs/` | contenido fuente, pasada manual y comparativa A/B |
| `blueprints/` | el plan de construcción; no se publica |

## Demo A y demo B

La demo B nació de la A (commit `1444fd6`): mismos datos y mismas URLs, otra imagen y otra composición. `js/data.js` está **copiado**, no compartido, así que un cambio de precio hay que hacerlo en las dos si ambas siguen vivas. Si la clienta elige una, la otra se archiva. La guía para enseñarlas juntas está en `docs/comparativa-ab.md`.

## Pendiente de la clienta

- Fotos reales que sustituyan a las de stock que quedan (ver `assets/img/CREDITOS.md`).
- Precios y horario definitivos.
- Las páginas legales se dan por buenas (noviembre de 2026), pero conservan el comentario `<!-- BORRADOR -->` en el código fuente, que no se ve en la web. Quitarlo exige también cambiar `tests/legal-404.test.js`.
- Reseñas reales para añadir tras el lanzamiento, nunca inventadas.
