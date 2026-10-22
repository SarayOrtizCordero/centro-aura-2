const test = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');
const data = require('../js/data.js');
const lib = require('../js/lib.js');

const html = read('pages/tienda.html');
const css = read('css/styles.css');
const main = html.match(/<main id="contenido">([\s\S]*)<\/main>/)[1];

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};

test('fotos de producto: tres frascos con tamaño, lazy y alt reales', () => {
  const expected = {
    'champu-equilibrante.webp': 'Frasco del champú Equilibrante de Jaldún',
    'champu-vitalzen.webp': 'Frasco del champú Vitalzen Fortificante de Jaldún',
    'champu-multiefecto.webp': 'Frasco del champú Multiefecto Regulador de Jaldún',
  };
  const section = html.match(/<section class="section section--alt" id="jaldun"[\s\S]*?<\/section>/)[0];
  const imgs = section.match(/<img\b[^>]*>/g);
  assert.equal(imgs.length, 3);
  for (const img of imgs) {
    const file = attr(img, 'src').split('/').pop();
    assert.equal(attr(img, 'alt'), expected[file], file);
    assert.deepEqual([attr(img, 'width'), attr(img, 'height'), attr(img, 'loading')], ['2250', '2250', 'lazy']);
  }
  assert.ok(!html.includes('class="bottle'));
});

test('secciones y mosaico de categorías', () => {
  assert.match(html, /<section class="section section--alt" id="jaldun"/);
  assert.match(html, /<section class="section" id="tarjetas-regalo"/);
  const tiles = html.match(/<a class="category-tile card"[^>]*>/g);
  assert.deepEqual(tiles.map((t) => attr(t, 'href')), ['#jaldun', '#tarjetas-regalo']);
  assert.ok(!html.includes('id="bonos"') && !html.includes('href="#bonos"'));
});

test('ficha destacada: la primera, en arco; las otras no', () => {
  const cards = main.match(/<li class="product-card[^"]*"[\s\S]*?<\/li>/g);
  assert.equal(cards.length, 3);
  assert.ok(cards[0].includes('product-card--featured'));
  assert.ok(/class="product-card__visual arch"/.test(cards[0]));
  for (const c of cards.slice(1)) {
    assert.ok(!c.includes('product-card--featured'));
    assert.ok(!/product-card__visual arch/.test(c));
  }
});

test('precios: todo ítem que no es servicio tiene su data-price igual a formatPrice', () => {
  for (const [id, it] of Object.entries(data.items)) {
    if (it.type === 'servicio') continue;
    const found = [...html.matchAll(new RegExp(`data-price="${id}">([^<]*)<`, 'g'))];
    assert.ok(found.length > 0, 'falta data-price de ' + id);
    for (const m of found) assert.equal(norm(m[1]), norm(lib.formatPrice(it)), id);
  }
});

test('botones: siete enlaces de WhatsApp de producto (3 Lo quiero, 4 Regalar)', () => {
  const links = main.match(/<a\b[^>]*\sdata-wa="[^"]*"[^>]*>[\s\S]*?<\/a>/g);
  assert.equal(links.length, 7);
  for (const a of links) assert.equal(attr(a.match(/<a\b[^>]*>/)[0], 'data-wa-kind'), 'producto');
  const labels = links.map((a) => a.replace(/<[^>]+>/g, '').trim());
  assert.equal(labels.filter((l) => l === 'Lo quiero').length, 3);
  assert.equal(labels.filter((l) => l === 'Regalar').length, 4);
});

test('nota, cabecera y CSS', () => {
  assert.ok(main.includes('Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.'));
  assert.match(main, /<h1>Tienda<\/h1>/);
  assert.ok(main.includes('textura-lino.webp') && main.includes('class="page-hero__veil"'));
  assert.ok(css.includes('.product-card--featured'));
  assert.ok(css.includes('mix-blend-mode: multiply'));
});
