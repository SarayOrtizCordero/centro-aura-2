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

test('marca → subcategoría: Jaldún > Champús, con tres fichas iguales (h4)', () => {
  const section = html.match(/<section class="section section--alt" id="jaldun"[\s\S]*?<\/section>/)[0];
  assert.match(section, /<h3 class="subcategory" id="jaldun-champus">Champús<\/h3>/);
  const cards = section.match(/<li class="product-card[^"]*"[\s\S]*?<\/li>/g);
  assert.equal(cards.length, 3);
  for (const c of cards) {
    assert.ok(!c.includes('product-card--featured'));
    assert.match(c, /<h4>Champú [^<]+<\/h4>/);
  }
  assert.ok(!css.includes('.product-card--featured'), 'sin ficha destacada: en PC son tres iguales');
});

test('cuadrículas: fichas en tres columnas y tarjetas regalo 2 × 2', () => {
  assert.match(css, /\.gift-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /\.product-grid\s*\{\s*grid-template-columns:\s*repeat\(3,/);
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
  assert.ok(css.includes('mix-blend-mode: multiply'));
});

test('selector Lista / Cuadrícula junto a los champús y a las tarjetas regalo, con iconos', () => {
  const bars = html.match(/<div class="view-bar"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g);
  assert.equal(bars.length, 2);
  for (const bar of bars) {
    assert.ok(/\shidden\b/.test(bar.match(/<div class="view-bar"[^>]*>/)[0]));
    assert.equal(attr(bar.match(/<div class="view-bar"[^>]*>/)[0], 'data-view-default'), 'list');
    assert.ok(bar.includes('#i-lista') && bar.includes('#i-cuadricula'));
    assert.ok(!/Ver como|>Lista<|>Cuadrícula</.test(bar));
  }
  const champus = html.indexOf('id="jaldun-champus"');
  assert.ok(html.indexOf('class="view-bar"') > champus - 40, 'el primer selector va en la fila de Champús');
  assert.match(css, /main\[data-view="list"\] \.gift-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /main\[data-view="grid"\] \.product-grid\s*\{[^}]*repeat\(3,/);
});

test('menú: la subcategoría lleva un puntito delante (sin raya) y las categorías se separan', () => {
  assert.match(css, /\.subnav__sub a::before\s*\{[^}]*border-radius:\s*50%/);
  assert.ok(!/\.subnav__sub\s*\{[^}]*border-left/.test(css), 'sin raya vertical');
  assert.match(css, /\.subnav li \+ li\s*\{[^}]*border-top:\s*1px solid/);
});
