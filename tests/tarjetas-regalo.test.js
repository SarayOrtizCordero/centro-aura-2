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

test('tres tarjetas, una por spa: el precio va dentro de la imagen (y en su alt), no como texto aparte', () => {
  assert.equal(cards.length, 3);
  cards.forEach((c, i) => {
    const id = IDS[i];
    const img = c.match(/<img\b[^>]*>/)[0];
    assert.ok(attr(img, 'src').endsWith('tarjeta-' + id + '.webp'));
    const alt = norm(attr(img, 'alt'));
    assert.ok(alt.includes(data.items[id].name) && alt.includes(data.items[id].duration), 'el alt recoge el texto de la imagen');
    assert.ok(alt.includes(norm(lib.formatPrice(data.items['regalo-' + id]))), 'el alt recoge el precio que lleva la imagen');
    assert.deepEqual([attr(img, 'width'), attr(img, 'height')], ['564', '402']);
    assert.ok(!c.includes('data-price'), 'el precio ya no se repite como texto bajo la imagen');
    const btn = c.match(/<a [^>]*data-wa[^>]*>/)[0];
    assert.equal(attr(btn, 'href'), 'https://wa.me/34610167764');
    assert.equal(attr(btn, 'data-wa'), 'Tarjeta regalo ' + data.items[id].name);
    assert.equal(attr(btn, 'data-wa-kind'), 'producto');
  });
});
test('cada tarjeta tiene "Más info": enlaza a su Spa en la página de servicios y esa fila existe', () => {
  const servicios = read('pages/servicios.html');
  cards.forEach((c, i) => {
    const id = IDS[i];
    const link = c.match(/<a [^>]*href="servicios\.html#[^"]*"[^>]*>/)[0];
    assert.equal(attr(link, 'href'), 'servicios.html#' + id);
    assert.ok(!link.includes('data-wa'), 'Más info no es un botón de reserva');
    assert.ok(servicios.includes('id="' + id + '"'), 'existe la fila ' + id + ' en servicios');
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
