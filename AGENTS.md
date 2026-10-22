# Centro Aura — demo B — agent instructions

Segunda propuesta de diseño de la web de Centro Aura (peluquería, spa capilar y tricología): sitio estático multipágina para que la clienta elija entre dos diseños; una sola acción, reservar por WhatsApp.

## Commands

| Task | Command |
|---|---|
| Install | nada que instalar: cero dependencias, Node 24 o superior |
| Dev server | `npm run serve` — http://localhost:4173 |
| Build | `npm run build` → `dist/` |
| Unit tests | `npm test` · un archivo: `node --test tests/<archivo>.test.js` |
| Smoke | `node tools/smoke.mjs <carpeta> <puerto> <ruta>=<código> …` (rutas sin barra inicial; `./` es la portada; salida 0 ok, 1 código distinto, 2 uso, 3 puerto ocupado, 70 error inesperado) |
| Fuentes (requiere red) | `npm run fonts` |
| Dominio | `npm run domain -- https://www.tudominio.es` |
| Pendientes | `npm run pendientes` (sale 1 mientras quede algo; 70 si falla) |

**Gate:** `npm test` más el `Verify` del paso, antes de marcar nada como hecho. Todo se ejecuta desde la raíz del proyecto.

## Non-negotiable

1. No inventes contenido: textos, datos y fotos salen de `docs/contenido-fuente.md`, `js/data.js` y `assets/`.
2. No implementes nada de los Non-Goals de `blueprints/centro-aura-2/blueprint.md` §1.
3. Ningún hex fuera de `css/tokens.css`; CSS mobile-first (solo `min-width`, nunca `max-width` en media queries).
4. No edites a mano los archivos entregados por `workspace/` (`js/*`, `tools/*`, `package.json`, `vercel.json`, `sprite.svg`) salvo que un paso lo diga.
5. No marques una tarea como hecha con un test o un `Verify` fallando, ni edites un `Verify`.
6. No publiques `tests/`, `tools/`, `docs/` ni `blueprints/` (lista blanca de `tools/build.mjs`) y no hagas `git push`.

Full architecture, boundaries, and design tokens: see `CLAUDE.md` in this directory.
