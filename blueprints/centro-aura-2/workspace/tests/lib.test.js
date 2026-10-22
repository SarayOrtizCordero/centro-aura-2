const { test } = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../js/lib.js');

const NBSP = ' ';

test('formatPrice: precio fijo', () => {
  assert.equal(lib.formatPrice({ price: 30, from: false }), `30${NBSP}€`);
});

test('formatPrice: precio "desde"', () => {
  assert.equal(lib.formatPrice({ price: 35, from: true }), `desde${NBSP}35${NBSP}€`);
});

test('formatPrice: rango con guion largo y espacio duro antes del euro', () => {
  assert.equal(lib.formatPrice({ price: 30, priceMax: 40 }), `30–40${NBSP}€`);
  assert.equal(lib.formatPrice({ price: 100, priceMax: 140, approx: true }), `100–140${NBSP}€`);
});

test('formatPrice: sin dato muestra "Consultar"', () => {
  assert.equal(lib.formatPrice(undefined), 'Consultar');
  assert.equal(lib.formatPrice({}), 'Consultar');
});

test('formatSaving: con y sin ahorro', () => {
  assert.equal(lib.formatSaving({ saving: 25 }), `ahorras${NBSP}25${NBSP}€`);
  assert.equal(lib.formatSaving({ price: 10 }), '');
  assert.equal(lib.formatSaving(undefined), '');
});

test('waMessage: reserva con servicio', () => {
  assert.equal(lib.waMessage('reserva', 'Spa capilar'), 'Hola Paula, me gustaría reservar: Spa capilar');
});

test('waMessage: reserva sin servicio', () => {
  assert.equal(lib.waMessage('reserva', ''), 'Hola Paula, me gustaría reservar una cita.');
  assert.equal(lib.waMessage(undefined, '  '), 'Hola Paula, me gustaría reservar una cita.');
});

test('waMessage: producto', () => {
  assert.equal(lib.waMessage('producto', 'Champú Equilibrante Jaldún'), 'Hola Paula, me interesa: Champú Equilibrante Jaldún');
  assert.equal(lib.waMessage('producto', ''), 'Hola Paula, me gustaría información.');
});

test('buildWaUrl: codifica el mensaje', () => {
  assert.equal(
    lib.buildWaUrl('34610167764', 'Hola Paula, me gustaría reservar: Spa capilar'),
    'https://wa.me/34610167764?text=Hola%20Paula%2C%20me%20gustar%C3%ADa%20reservar%3A%20Spa%20capilar'
  );
});

test('buildWaUrl: sin mensaje', () => {
  assert.equal(lib.buildWaUrl('34610167764'), 'https://wa.me/34610167764');
});

test('hoursToRows: une franjas y marca cerrado', () => {
  const rows = lib.hoursToRows([
    { days: 'Lunes – Viernes', slots: ['9:30 – 14:00', '17:00 – 20:30'] },
    { days: 'Domingo', slots: [] }
  ]);
  assert.deepEqual(rows, [
    { days: 'Lunes – Viernes', text: '9:30 – 14:00 · 17:00 – 20:30' },
    { days: 'Domingo', text: 'Cerrado' }
  ]);
});

test('categoryOf: devuelve la categoría o null', () => {
  const items = { 'spa-capilar': { category: 'salud' }, 'jaldun-x': { type: 'producto' } };
  assert.equal(lib.categoryOf(items, 'spa-capilar'), 'salud');
  assert.equal(lib.categoryOf(items, 'jaldun-x'), null);
  assert.equal(lib.categoryOf(items, 'no-existe'), null);
});

test('composeContactMessage: con servicio', () => {
  assert.equal(
    lib.composeContactMessage({ name: ' Lucía ', service: 'Spa capilar', message: '¿Tenéis hueco el viernes? ' }),
    'Hola Paula, soy Lucía. Me interesa: Spa capilar. ¿Tenéis hueco el viernes?'
  );
});

test('composeContactMessage: sin servicio', () => {
  assert.equal(
    lib.composeContactMessage({ name: 'Lucía', service: '', message: 'Tengo mucha caída.' }),
    'Hola Paula, soy Lucía. Tengo mucha caída.'
  );
});
