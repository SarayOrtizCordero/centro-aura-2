const { test } = require('node:test');
const assert = require('node:assert/strict');
const data = require('../js/data.js');

const TYPES = ['servicio', 'producto', 'bono', 'regalo'];

test('contacto del negocio', () => {
  assert.equal(data.business.phoneDigits, '34610167764');
  assert.equal(data.business.phoneDisplay, '+34 610 16 77 64');
  assert.equal(data.business.instagram, 'https://www.instagram.com/centro__aura/');
  assert.match(data.business.address, /Domingo Gallego, 3/);
});

test('todos los items tienen tipo, nombre y precio numérico', () => {
  for (const [id, item] of Object.entries(data.items)) {
    assert.ok(TYPES.includes(item.type), `${id}: tipo inválido`);
    assert.ok(item.name && item.name.length > 2, `${id}: falta nombre`);
    assert.equal(typeof item.price, 'number', `${id}: precio no numérico`);
  }
});

test('los servicios tienen categoría válida y duración', () => {
  const cats = data.categories.map((c) => c.id);
  assert.deepEqual(cats, ['spa', 'tratamientos', 'peluqueria']);
  const servicios = Object.entries(data.items).filter(([, i]) => i.type === 'servicio');
  assert.equal(servicios.length, 15);
  for (const [id, item] of servicios) {
    assert.ok(cats.includes(item.category), `${id}: categoría inválida`);
  }
});

test('los tres Spa tienen duración; el resto no inventa una', () => {
  for (const [id, item] of Object.entries(data.items)) {
    if (item.category === 'spa') assert.ok(item.duration, `${id}: falta duración`);
    else assert.equal(item.duration, undefined, `${id}: no se ha dado duración`);
  }
});

test('precios en rango: máximo mayor que mínimo y marcados como orientativos', () => {
  const rangos = Object.entries(data.items).filter(([, i]) => i.priceMax !== undefined);
  assert.equal(rangos.length, 9);
  for (const [id, item] of rangos) {
    assert.ok(item.priceMax > item.price, `${id}: priceMax debe ser mayor que price`);
    assert.equal(item.approx, true, `${id}: un rango es orientativo`);
    assert.equal(item.category, 'tratamientos', id);
  }
});

test('precios de la carta (lista dada por Paula)', () => {
  const esperado = {
    'spa-esencial': [40], 'spa-equilibrio': [50], 'spa-aura': [70],
    'lavado-peinado': [13], 'corte': [15], 'corte-peinado': [22],
    'barro-raiz': [30, 40], 'barro-completo': [50, 70],
    'alisado-corto': [100, 140], 'alisado-media-melena': [140, 180],
    'alisado-largo': [180, 230], 'alisado-muy-largo': [230, 270],
    'antifrizz-corto': [45, 50], 'antifrizz-medio-largo': [50, 60],
    'tratamiento-fibra': [30, 50]
  };
  for (const [id, [min, max]] of Object.entries(esperado)) {
    assert.equal(data.items[id].price, min, `${id}: mínimo`);
    assert.equal(data.items[id].priceMax, max, `${id}: máximo`);
  }
});

test('el catálogo tiene los 21 items esperados', () => {
  const expectedIds = [
    'spa-esencial', 'spa-equilibrio', 'spa-aura',
    'barro-raiz', 'barro-completo',
    'alisado-corto', 'alisado-media-melena', 'alisado-largo', 'alisado-muy-largo',
    'antifrizz-corto', 'antifrizz-medio-largo', 'tratamiento-fibra',
    'lavado-peinado', 'corte', 'corte-peinado',
    'jaldun-equilibrante', 'jaldun-vitalzen', 'jaldun-multiefecto',
    'regalo-25', 'regalo-50', 'regalo-75'
  ];
  assert.deepEqual(Object.keys(data.items).sort(), expectedIds.sort());
  for (const [id, item] of Object.entries(data.items)) {
    assert.ok(typeof item.price === 'number' && item.price > 0, `${id}: precio no es un número positivo`);
  }
});

test('ya no quedan bonos: dependían de servicios que se retiraron', () => {
  assert.deepEqual(Object.values(data.items).filter((i) => i.type === 'bono'), []);
});

test('horario con formato "H:MM – HH:MM"', () => {
  assert.equal(data.hours.length, 3);
  for (const h of data.hours) {
    for (const slot of h.slots) assert.match(slot, /^\d{1,2}:\d{2} – \d{2}:\d{2}$/, slot);
  }
});

test('cada horario tiene días de schema.org válidos', () => {
  const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const h of data.hours) {
    assert.ok(Array.isArray(h.schemaDays) && h.schemaDays.length > 0, `${h.days}: falta schemaDays`);
    for (const day of h.schemaDays) assert.ok(VALID_DAYS.includes(day), `${h.days}: día inválido "${day}"`);
  }
});
