---
description: Convenciones del CSS de la demo B
paths:
  - "css/**"
---

# CSS

- **Un bloque por componente, un bloque por selector.** `css/styles.css` va ordenado por componente, cada uno con su cabecera de comentario: primero sus reglas base y justo debajo sus ajustes `@media`. Para cambiar un componente se edita **su** regla; no se añade otra con el mismo selector al final del archivo (`tests/css.test.js` lo comprueba). Un componente nuevo va en su propia sección, antes de "Interacción con el ratón y movimiento reducido".
- Cuidado con la especificidad: una regla como `[data-view-block][data-view="list"] .service-row` gana a `.service-row` en cualquier ancho, aunque la segunda esté en un `@media` posterior.
- Mobile-first: la base es el móvil; solo `@media (min-width: 600px)`, `760px`, `900px` o `1200px`. Prohibido `max-width` dentro de una media query (`tests/css.test.js` lo comprueba).
- Ningún valor hexadecimal fuera de `css/tokens.css`. Usa `var(--c-…)`, `var(--s-…)`, `var(--r-…)`, `var(--shadow-soft)`.
- `--c-muted` y `--c-gold` son decorativos: nunca como `color` de texto.
- Texto sobre foto solo dentro de `.gift-banner` (velo oscuro) y `.page-hero` (velo claro); cualquier otro texto va sobre un fondo opaco.
- Foco visible con `:focus-visible` (2 px); en fondos cacao, `outline-color: var(--c-on-anchor)`.
- Objetivos táctiles: `.btn` 48 px, `.tab` y `.link-arrow` 44 px como mínimo.
- Una sola sombra (`--shadow-soft`); sin `backdrop-filter`.
- `css/fonts.css` está generado por `npm run fonts`: no se edita a mano.
- Si cambias un token, cámbialo a la vez en `css/tokens.css`, en la tabla de `tests/css.test.js` y en `CLAUDE.md`.
