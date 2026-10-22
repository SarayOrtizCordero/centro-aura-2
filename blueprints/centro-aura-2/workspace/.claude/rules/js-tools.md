---
description: Convenciones de js/ y tools/ de la demo B
paths:
  - "js/**"
  - "tools/**"
---

# JavaScript y herramientas

- `js/data.js`, `js/lib.js` y `js/main.js` son clásicos (sin módulos): UMD que cuelga de `window` en el navegador y exporta con `module.exports` en Node. No los conviertas a módulos ES.
- `js/data.js` y `js/lib.js` vienen entregados y no se editan (procedencia: commit 1444fd6 de la demo anterior). Los datos se cambian en `data.js`; `lib.js` no se toca.
- `js/main.js` es mejora progresiva: sin JavaScript la web se lee entera. No añadas carga de recursos de terceros.
- `tools/*.mjs` son ESM de Node 24 sin dependencias (solo `node:`). Leen archivos concretos, nunca recorren todo el árbol (el bundle `blueprints/` cuelga de la raíz).
- Variables de entorno opcionales: `PORT`, `AURA_SERVE_DIR`, `AURA_ROOT`. No leas ningún `.env`.
- `tools/pendientes.mjs` sale 0 (nada pendiente), 1 (queda algo: datos legales o dominio provisional) o 70 (error inesperado); `tools/smoke.mjs` sale 0, 1, 2, 3 o 70. Los gates que esperan 1 o 2 comprueban también la salida.
- `tools/smoke.mjs`: las rutas se escriben sin barra inicial (`./` es la portada) porque Git Bash en Windows reescribe los argumentos que empiezan por `/`.
