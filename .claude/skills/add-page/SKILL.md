---
name: add-page
description: Añade una página nueva a la web de Centro Aura demo B (por ejemplo una página de servicio o una legal) con la estructura común, sus metadatos únicos, su entrada en el sitemap y su test. Úsala cuando alguien pida "añade una página", "crea la página de X" o "nueva página en pages/".
---

# Añadir una página

## When to use
Cuando haya que crear una URL nueva bajo `pages/`. No la uses para cambiar el contenido de una página existente.

## Steps
1. Copia el `<head>`, la barra superior, la cabecera, el pie y el botón flotante de `pages/servicios.html` (prefijo `../`). Cambia `<title>`, `meta description`, `canonical`, `og:url`, `og:title` y `og:description`: los tres primeros deben ser **únicos** en el sitio.
2. Deja un único `<h1>` y los niveles de encabezado sin saltos; toda `<img>` con `alt`, `width` y `height` reales.
3. Si la página cuelga del menú, añade su enlace a la navegación de **todas** las páginas y su `aria-current="page"` en la propia; si es legal, no lleva `aria-current`.
4. Añade su `<url><loc>` a `sitemap.xml` con el dominio actual del sitio. Ejecuta `node tools/sync-sprite.mjs` para que la página nueva lleve el sprite de iconos incrustado.
5. Si la página usa datos de negocio, usa `data-price`, `data-duration`, `data-phone`, `data-hours` o `data-wa` con ids que existan en `js/data.js`, y deja el texto de respaldo idéntico.
6. Crea `tests/<pagina>.test.js` con las aserciones propias de la página (`tests/pages.test.js` y `tests/seo.test.js` ya cubren la estructura común y el sitemap).

## Verify
```bash
node --test tests/<pagina>.test.js   # expect: exit 0
npm test                              # expect: exit 0, 0 failed
```

## Do not
- No copies textos que no estén en `docs/contenido-fuente.md`, ni inventes cifras, reseñas o datos.
- No añadas la página a `sitemap.xml` si lleva `noindex`.
- No uses rutas con `/` inicial salvo en `404.html` (que usa `<base href="/">`).
