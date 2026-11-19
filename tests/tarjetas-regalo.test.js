const test = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');
const data = require('../js/data.js');
const lib = require('../js/lib.js');

const html = read('pages/tarjetas-regalo.html');
const css = read('css/styles.css');
const main = html.match(/<main id="contenido">([\s\S]*)<\/main>/)[1];
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const cards = main.match(/<li class="gift-card card[^"]*"[\s\S]*?<\/li>/g);
const IDS = ['spa-esencial', 'spa-equilibrio', 'spa-aura'];

test('cabecera: un solo h1, textura y velo', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(main, /<h1>Tarjetas regalo<\/h1>/);
  assert.ok(main.includes('textura-lino.webp') && main.includes('class="page-hero__veil"'));
});

test('tres tarjetas, una por spa, con su imagen y el precio debajo, fuera de la imagen', () => {
  assert.equal(cards.length, 3);
  cards.forEach((c, i) => {
    const id = IDS[i];
    const img = c.match(/<img\b[^>]*>/)[0];
    assert.ok(attr(img, 'src').endsWith('tarjeta-' + id + '.webp'));
    const alt = attr(img, 'alt');
    assert.ok(alt.includes(data.items[id].name) && alt.includes(data.items[id].duration), 'el alt recoge el texto de la imagen');
    assert.deepEqual([attr(img, 'width'), attr(img, 'height')], ['564', '402']);
    const body = c.match(/<div class="gift-card__body">[\s\S]*<\/div>/)[0];
    assert.equal(norm(body.match(new RegExp('data-price="regalo-' + id + '">([^<]*)<'))[1]), norm(lib.formatPrice(data.items['regalo-' + id])));
    assert.ok(!c.slice(0, c.indexOf('<div class="gift-card__body">')).includes('data-price'), 'el precio no va sobre la imagen');
    const btn = c.match(/<a [^>]*data-wa[^>]*>/)[0];
    assert.equal(attr(btn, 'href'), 'https://wa.me/34610167764');
    assert.equal(attr(btn, 'data-wa'), 'Tarjeta regalo ' + data.items[id].name);
    assert.equal(attr(btn, 'data-wa-kind'), 'producto');
  });
});
test('el precio de cada tarjeta es el de su spa', () => {
  for (const id of IDS) assert.equal(data.items['regalo-' + id].price, data.items[id].price, id);
});

test('css: cuadrícula de tarjetas y la imagen ocupa todo el ancho', () => {
  assert.match(css, /\.gift-cards\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.gift-card__img\s*\{[^}]*width:\s*100%/);
});
test('las tarjetas regalo ya no están en la tienda', () => {
  const tienda = read('pages/tienda.html');
  assert.ok(!tienda.includes('data-wa="Tarjeta regalo'));
  assert.ok(!/id="tarjetas-regalo"/.test(tienda));
});
