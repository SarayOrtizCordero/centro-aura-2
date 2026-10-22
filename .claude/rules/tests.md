---
description: Convenciones de los tests de la demo B
paths:
  - "tests/**"
---

# Tests

- `node:test` + `node:assert/strict`, CommonJS, sin dependencias. `npm test` solo busca en `tests/` (`"tests/**/*.test.js"`); un archivo: `node --test tests/<archivo>.test.js`.
- Cada paso de página escribe su test y lo ejecuta; `tests/pages.test.js` recorre `pageFiles()` y cubre solo las páginas que existen.
- Los textos de respaldo se comparan con `js/data.js` y `AuraLib` (no con números escritos a mano). Prefiere propiedades ("todo servicio de `data.js` tiene su fila") a recuentos.
- Los tests leen archivos con `read()` de `tests/helpers.js`; nunca recorren el árbol completo ni `blueprints/`.
- No edites un test para que pase: arregla el código. No uses `skip` ni `todo`.
