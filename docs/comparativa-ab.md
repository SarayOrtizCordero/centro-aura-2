# Comparativa A/B — cómo enseñar las dos demos a la clienta

La demo A y la demo B tienen la misma información y las mismas URLs, pero distinta imagen y composición. Esta guía es el procedimiento para verlas juntas y que la clienta elija. Es una comprobación manual: la hace una persona, una vez, antes de decidir.

## Servir las dos a la vez

Cada demo necesita su propio puerto. La demo B es este proyecto; la demo A está en la carpeta `centro-aura`, junto a esta.

| Demo | Carpeta | Comando | Dirección |
|---|---|---|---|
| Demo B | este proyecto (`demo-centro-aura-2`) | `PORT=4173 node tools/serve.mjs` | http://localhost:4173 |
| Demo A | la carpeta de la demo A (`centro-aura`) | `PORT=4174 node tools/serve.mjs` | http://localhost:4174 |

Lanza cada comando desde la raíz de su carpeta, cada uno en su propia terminal. Mientras las dos estén en marcha, abre una en cada ventana del navegador.

## Qué capturas hacer

Para cada demo, capturas de estas cuatro páginas a dos anchos, para poder ponerlas **lado a lado**:

| Página | A 375 px (móvil) | A 1440 px (escritorio) |
|---|---|---|
| Portada | Demo A / Demo B | Demo A / Demo B |
| Servicios | Demo A / Demo B | Demo A / Demo B |
| Tienda | Demo A / Demo B | Demo A / Demo B |
| Contacto | Demo A / Demo B | Demo A / Demo B |

Conviene enseñarlas primero en móvil, que es donde la clienta y sus clientas van a verlas casi siempre.

## Tabla de decisión para la clienta

Se rellena con ella, mirando las capturas. No hace falta escribir mucho: una palabra o una marca por casilla.

| | Demo A | Demo B |
|---|---|---|
| Primera impresión | | |
| Cómo se lee el menú | | |
| Cómo se ve el precio | | |
| Cómo se reserva | | |
| Qué le gusta más | | |

## Después de elegir

- La demo elegida sigue adelante con los pendientes de `README.md` (fotos reales, datos legales, dominio, precios y horario definitivos).
- La otra se archiva. `js/data.js` está copiado en cada demo, no compartido, así que un cambio de precio u horario solo afecta a la demo en la que se haga.
- Anota la decisión y la fecha en `docs/qa-manual.md`, en el apartado "Comparación A/B con la clienta".
