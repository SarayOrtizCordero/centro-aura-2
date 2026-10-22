---
description: Convenciones del HTML de la demo B
paths:
  - "index.html"
  - "404.html"
  - "pages/**"
---

# HTML

- Estructura común idéntica en todas las páginas (barra superior, cabecera, pie, botón flotante); solo cambian `<title>`, `meta description`, `canonical`, `og:*`, el `aria-current` y el `<main>`.
- Rutas locales: `index.html` usa `assets/…`; `pages/*.html` usa `../assets/…`; `404.html` usa rutas desde la raíz con `<base href="/">`.
- Un solo `<h1>`; encabezados sin saltos; `<img>` con `alt`, `width`, `height` reales (los de debajo del primer pliegue con `loading="lazy"`).
- Iconos solo del sprite, **incrustado en la página** (con `<use href="…/sprite.svg#…">` no se pintan al abrir por `file://`): `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-<nombre>"/></svg>`. `node tools/sync-sprite.mjs` incrusta el sprite actual en todas las páginas; `tests/pages.test.js` comprueba que coincide con `assets/icons/sprite.svg`.
- Botones de reserva: `<a data-wa="<servicio>" href="https://wa.me/34610167764">` (producto o regalo: añade `data-wa-kind="producto"`).
- Precio y duración: `data-price="<id>"` / `data-duration="<id>"` con texto de respaldo idéntico a `js/data.js`.
- Sin `<iframe>`, sin Google Fonts, sin comentarios HTML (salvo el `BORRADOR` de las páginas legales).
- Textos: de `docs/contenido-fuente.md`; no inventes hechos.
