const test = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');
const data = require('../js/data.js');
const lib = require('../js/lib.js');

const html = read('pages/contacto.html');
const main = html.match(/<main id="contenido">([\s\S]*)<\/main>/)[1];

const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};

test('anclas, cabecera y cuatro tarjetas de contacto', () => {
  assert.match(html, /<section class="section" id="formulario"/);
  assert.match(main, /<h1>Contacto<\/h1>/);
  const cards = main.match(/<a class="contact-card card"[^>]*>/g);
  assert.equal(cards.length, 4);
  const hrefs = cards.map((c) => attr(c, 'href'));
  assert.equal(hrefs[0], 'tel:+34610167764');
  assert.equal(hrefs[1], 'https://wa.me/34610167764');
  assert.ok(/\sdata-wa=""/.test(cards[1]));
  assert.equal(hrefs[2], 'https://www.instagram.com/centro__aura/');
  assert.ok(hrefs[3].startsWith('https://www.google.com/maps/search/'));
});

test('formulario: etiquetas, required, errores asociados y resumen aria-live', () => {
  assert.match(html, /<form class="contact-form" id="contact-form">/);
  for (const field of ['nombre', 'mensaje']) {
    assert.ok(html.includes(`<label for="f-${field}">`), 'label de ' + field);
    const control = html.match(new RegExp(`<(?:input|textarea)\\b[^>]*id="f-${field}"[^>]*>`))[0];
    assert.equal(attr(control, 'name'), field);
    assert.ok(/\srequired\b/.test(control), field + ' required');
    assert.equal(attr(control, 'aria-describedby'), 'err-' + field);
    assert.ok(attr(control, 'data-error'), field + ' data-error');
    assert.ok(html.includes(`<p class="field-error" id="err-${field}">`), 'p.field-error de ' + field);
  }
  assert.ok(html.includes('<label for="f-servicio">'));
  const summary = html.match(/<div class="form-summary" id="form-summary"[^>]*>/)[0];
  assert.equal(attr(summary, 'aria-live'), 'polite');
});

test('selector: una opción por servicio de data.js y "Otro / no lo sé" al final', () => {
  const select = html.match(/<select id="f-servicio"[\s\S]*?<\/select>/)[0];
  const options = [...select.matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)].map((m) => ({ attrs: m[1], label: m[2] }));
  const labels = new Set();
  for (const it of Object.values(data.items)) {
    if (it.type !== 'servicio') continue;
    const label = it.contact || it.name;
    labels.add(label);
    assert.ok(select.includes(`<option>${label}</option>`), 'falta la opción ' + label);
  }
  assert.equal(labels.size, 13);
  const last = options[options.length - 1];
  assert.equal(last.label, 'Otro / no lo sé');
  assert.equal(attr(last.attrs.replace(/^/, ' '), 'value'), '');
});

test('mapa bajo demanda y horario de respaldo', () => {
  assert.ok(!html.includes('<iframe'));
  const map = main.match(/<div class="map"[^>]*>/)[0];
  assert.ok(attr(map, 'data-map-src'));
  assert.ok(attr(map, 'data-map-title'));
  const button = main.match(/<button [^>]*data-map-load[^>]*>([^<]*)<\/button>/);
  assert.ok(button && /\shidden\b/.test(button[0]));
  assert.equal(button[1], 'Ver el mapa');
  const hours = main.match(/<dl class="hours" data-hours>([\s\S]*?)<\/dl>/);
  assert.ok(hours);
  assert.equal([...hours[1].matchAll(/<dt>/g)].length, 3);
});

test('mensaje a WhatsApp: composeContactMessage', () => {
  const msg = lib.composeContactMessage({ name: ' Lucía ', service: 'Corte', message: 'Hola ' });
  assert.equal(msg, 'Hola Paula, soy Lucía. Me interesa: Corte. Hola');
});
