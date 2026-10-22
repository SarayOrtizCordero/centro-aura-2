---
name: update-data
description: Cambia precios, duraciones, horario o teléfono de Centro Aura demo B sin dejar nada desincronizado entre js/data.js, el texto de respaldo del HTML, el JSON-LD y los enlaces de respaldo. Úsala cuando alguien diga "cambia el precio de", "nuevo horario" o "nuevo teléfono".
---

# Cambiar datos de negocio

## When to use
Cuando Paula o la clienta confirmen un precio, una duración, el horario o el teléfono.

## Steps
1. **Precio o duración:** edita el ítem en `js/data.js` (un rango usa `price` y `priceMax` con `approx: true`; solo los Spa tienen `duration`). Cambia el texto de respaldo en `index.html` y `pages/servicios.html` o `pages/tienda.html` con el mismo formato que `AuraLib.formatPrice` (espacio duro antes del `€`).
2. **Horario:** edita `hours` en `js/data.js`, el texto de respaldo de cada `dl[data-hours]`, el de `[data-hours-summary]` en todas las páginas (`L–V ` + franjas con ` – ` → `–`) y el `openingHoursSpecification` del JSON-LD de `index.html`.
3. **Teléfono:** edita `business` en `js/data.js` y sustituye `34610167764` en todos los `wa.me`, `tel:` y en el JSON-LD (`telephone`).
4. Ejecuta los tests: avisan de cualquier respaldo que no coincida.

## Verify
```bash
npm test   # expect: exit 0, 0 failed
```

## Do not
- No cambies un `id` de `items` sin cambiar todos sus usos (`data-price`, `data-duration`, `data-wa`, anclas `servicios.html#<id>`).
- No inventes una duración para un servicio que no la tiene.
- No toques `js/lib.js`: se entrega sin cambios.
