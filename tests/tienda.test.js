const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { read, ROOT } = require('./helpers');
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
const jaldun = html.match(/<section class="section section--alt" id="jaldun"[\s\S]*?<\/section>/)[0];
const regalo = html.match(/<section class="section section--alt" id="tarjetas-regalo"[\s\S]*?<\/section>/)[0];

test('fotos de producto: tres frascos con tamaño, lazy y alt reales; el resto, recuadro sin foto', () => {
  const expected = {
    'champu-equilibrante.webp': 'Frasco del champú Equilibrante de Jaldún',
    'champu-vitalzen.webp': 'Frasco del champú Vitalzen Fortificante de Jaldún',
    'champu-multiefecto.webp': 'Frasco del champú Multiefecto Regulador de Jaldún',
  };
  const photos = jaldun.match(/<img\b[^>]*>/g).filter((img) => attr(img, 'src').endsWith('.webp'));
  assert.equal(photos.length, 3);
  for (const img of photos) {
    const file = attr(img, 'src').split('/').pop();
    assert.equal(attr(img, 'alt'), expected[file], file);
    assert.deepEqual([attr(img, 'width'), attr(img, 'height'), attr(img, 'loading')], ['2250', '2250', 'lazy']);
  }
  const empty = jaldun.match(/<div class="product-card__visual product-card__visual--empty" aria-hidden="true"><img class="lotus"[^>]*>/g);
  assert.equal(empty.length, 7, 'los siete productos nuevos no tienen foto todavía');
  assert.ok(!html.includes('class="bottle'));
});

test('secciones: Jaldún, Brasil Cacau y Tarjetas regalo, con su mosaico', () => {
  assert.match(html, /<section class="section section--alt" id="jaldun"/);
  assert.match(html, /<section class="section" id="brasil-cacau"/);
  assert.match(html, /<section class="section section--alt" id="tarjetas-regalo"/);
  const tiles = html.match(/<a class="category-tile card"[^>]*>/g);
  assert.deepEqual(tiles.map((t) => attr(t, 'href')), ['#jaldun', '#brasil-cacau', '#tarjetas-regalo']);
  assert.ok(!html.includes('id="bonos"') && !html.includes('href="#bonos"'));
});

test('Jaldún: sin subcategorías; todos los productos juntos como fichas iguales (h3)', () => {
  assert.ok(!html.includes('class="subcategory"') && !html.includes('jaldun-champus'), 'ya no hay subcategorías');
  const cards = jaldun.match(/<li class="product-card[^"]*"[\s\S]*?<\/li>/g);
  assert.equal(cards.length, 10);
  const titles = cards.map((c) => c.match(/<h3>([^<]*)<\/h3>/)[1]);
  assert.deepEqual(titles, [
    'Champú Equilibrante', 'Champú Vitalzen Fortificante', 'Champú Multiefecto Regulador',
    'Tónico Equilibrante', 'Tónico Actianagen', 'Nutrianagen', 'Ajobiotic',
    'Aceite Bioregenerador', 'Emulsión Equilibrante C3Q', 'Factor de Crecimiento Capilar',
  ]);
  for (const c of cards) assert.ok(!c.includes('product-card--featured'));
  assert.ok(!css.includes('.product-card--featured'), 'sin ficha destacada: en PC son tres iguales');
});

test('productos nuevos: solo con lo que ha dicho la clienta y precio "Consultar"', () => {
  const textos = {
    'jaldun-tonico-equilibrante': 'Tónico capilar.',
    'jaldun-tonico-actianagen': 'Tónico capilar.',
    'jaldun-nutrianagen': 'Complemento alimenticio.',
    'jaldun-aceite-bioregenerador': 'Aceite de granada.',
    'jaldun-emulsion-c3q': 'Para el cuidado del cabello y la piel.',
  };
  for (const id of ['jaldun-tonico-equilibrante', 'jaldun-tonico-actianagen', 'jaldun-nutrianagen', 'jaldun-ajobiotic', 'jaldun-aceite-bioregenerador', 'jaldun-emulsion-c3q', 'jaldun-factor-crecimiento']) {
    const card = jaldun.match(new RegExp('<li class="product-card[^"]*"(?:(?!</li>)[\\s\\S])*data-price="' + id + '"[\\s\\S]*?</li>'))[0];
    assert.ok(card.includes('>Consultar<'), id + ': precio Consultar');
    assert.ok(card.includes(`data-wa="${data.items[id].name}"`), id + ': WhatsApp con su nombre');
    if (textos[id]) assert.ok(card.includes('<p>' + textos[id] + '</p>'), id);
    else assert.ok(!card.includes('<p>'), id + ': sin descripción inventada');
  }
});

test('Brasil Cacau: sección con aviso, sin productos ni selector', () => {
  const brasilia = html.match(/<section class="section" id="brasil-cacau"[\s\S]*?<\/section>/)[0];
  assert.match(brasilia, /<h2 id="brasil-cacau-title">Marca Brasil <em>Cacau<\/em><\/h2>/);
  assert.ok(brasilia.includes('Estamos preparando los productos de Brasil Cacau.'));
  assert.ok(!brasilia.includes('product-card') && !brasilia.includes('view-bar'));
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

test('botones: catorce enlaces de WhatsApp de producto (10 Lo quiero, 4 Regalar)', () => {
  const links = main.match(/<a\b[^>]*\sdata-wa="[^"]*"[^>]*>[\s\S]*?<\/a>/g);
  assert.equal(links.length, 14);
  for (const a of links) assert.equal(attr(a.match(/<a\b[^>]*>/)[0], 'data-wa-kind'), 'producto');
  const labels = links.map((a) => a.replace(/<[^>]+>/g, '').trim());
  assert.equal(labels.filter((l) => l === 'Lo quiero').length, 10);
  assert.equal(labels.filter((l) => l === 'Regalar').length, 4);
});

test('nota, cabecera y CSS', () => {
  assert.ok(main.includes('Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.'));
  assert.match(main, /<h1>Tienda<\/h1>/);
  assert.ok(main.includes('textura-lino.webp') && main.includes('class="page-hero__veil"'));
  assert.ok(css.includes('mix-blend-mode: multiply'));
});

test('selector Lista / Cuadrícula en Jaldún y en las tarjetas regalo, con iconos', () => {
  const bars = html.match(/<div class="view-bar"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g);
  assert.equal(bars.length, 2);
  for (const bar of bars) {
    assert.ok(/\shidden\b/.test(bar.match(/<div class="view-bar"[^>]*>/)[0]));
    assert.equal(attr(bar.match(/<div class="view-bar"[^>]*>/)[0], 'data-view-default'), 'list');
    assert.ok(bar.includes('#i-lista') && bar.includes('#i-cuadricula'));
    assert.ok(!/Ver como|>Lista<|>Cuadrícula</.test(bar));
  }
  assert.equal((jaldun.match(/class="view-bar"/g) || []).length, 1);
  assert.equal((regalo.match(/class="view-bar"/g) || []).length, 1);
  assert.match(css, /\[data-view-block\]\[data-view="list"\] \.gift-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /\[data-view-block\]\[data-view="grid"\] \.product-grid\s*\{[^}]*repeat\(3,/);
});

test('menú: Tienda → Jaldún, Brasil Cacau y Tarjetas regalo, sin subcategorías', () => {
  assert.ok(!css.includes('subnav__sub'), 'ya no hay subcategorías en el menú');
  assert.match(css, /\.subnav li \+ li\s*\{[^}]*border-top:\s*1px solid/);
  for (const href of ['tienda.html#jaldun', 'tienda.html#brasil-cacau', 'tienda.html#tarjetas-regalo']) assert.ok(html.includes('href="' + href + '"'), href);
});

test('los productos de Jaldún y las tarjetas regalo tienen cada uno su propia vista', () => {
  assert.match(html, /<section class="section section--alt" id="jaldun"[^>]*data-view-block>/);
  assert.match(html, /<section class="section section--alt" id="tarjetas-regalo"[^>]*data-view-block>/);
});

test('botones de la tienda: "Lo quiero" más pequeño y "Regalar" separado del texto', () => {
  assert.match(css, /\.product-card__body \.btn--primary\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.gift-tile__body \.btn\s*\{[^}]*margin-top:\s*var\(--s-3\)/);
});

test('mosaico de marcas: logo de Jaldún y de Brasil Cacau, y el loto de Aura en las tarjetas regalo', () => {
  const tiles = html.match(/<a class="category-tile card"[\s\S]*?<\/a>/g);
  assert.equal(tiles.length, 3);
  const logos = tiles.map((t) => attr(t.match(/<img\b[^>]*>/)[0], 'src'));
  assert.deepEqual(logos, ['../assets/brands/jaldun-salud-capilar.jpg', '../assets/brands/brasil-cacau.png', '../assets/icons/loto.svg']);
  for (const t of tiles) {
    const img = t.match(/<img\b[^>]*>/)[0];
    assert.equal(attr(img, 'alt'), '', 'logo decorativo: el nombre ya está en el título');
    assert.ok(attr(img, 'width') && attr(img, 'height'));
  }
  assert.match(css, /\.category-tile__logo\s*\{[^}]*background:\s*var\(--c-bg-alt\)/);
});

test('logos de marca: archivos locales con sus créditos (nada de terceros al cargar)', () => {
  const credits = read('assets/brands/CREDITOS.md');
  for (const f of ['jaldun-salud-capilar.jpg', 'brasil-cacau.png']) {
    assert.ok(credits.includes(f), f);
    assert.ok(fs.existsSync(path.join(ROOT, 'assets/brands', f)), f);
  }
  const imgs = [...html.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  for (const src of imgs) assert.ok(!/^https?:/.test(src), 'imagen externa: ' + src);
});

test('filtro de productos: botón "Filtrar" que abre un panel, oculto sin JS, cuatro opciones y cada ficha con su tipo', () => {
  const bar = jaldun.match(/<div class="filter-bar"[^>]*>[\s\S]*?<span class="visually-hidden"[^>]*><\/span>\s*<\/div>/)[0];
  assert.ok(/\shidden\b/.test(bar.match(/<div class="filter-bar"[^>]*>/)[0]));
  const btn = bar.match(/<button class="filter-btn"[^>]*>/)[0];
  assert.equal(attr(btn, 'aria-expanded'), 'false');
  assert.equal(attr(btn, 'aria-controls'), 'filter-panel');
  assert.ok(bar.includes('<span>Filtrar</span>') && bar.includes('#i-filtro'));
  const panel = bar.match(/<div class="filter-panel"[^>]*>/)[0];
  assert.equal(attr(panel, 'id'), 'filter-panel');
  assert.ok(/\shidden\b/.test(panel), 'el panel arranca cerrado');
  const chips = [...bar.matchAll(/<button class="filter-chip"[^>]*>([^<]*)<\/button>/g)];
  assert.deepEqual(chips.map((c) => c[1]), ['Todos', 'Champús', 'Tónicos', 'Otros']);
  assert.deepEqual(chips.map((c) => attr(c[0], 'data-filter')), ['all', 'champus', 'tonicos', 'otros']);
  assert.deepEqual(chips.map((c) => attr(c[0], 'aria-pressed')), ['true', 'false', 'false', 'false']);
  const cards = jaldun.match(/<li class="product-card[^"]*" data-type="[^"]+"/g);
  assert.deepEqual(cards.map((c) => c.match(/data-type="([^"]+)"/)[1]),
    ['champus', 'champus', 'champus', 'tonicos', 'tonicos', 'otros', 'otros', 'otros', 'otros', 'otros']);
  assert.ok(bar.includes('role="status"') && bar.includes('aria-live="polite"'), 'avisa del resultado');
  const mainJs = read('js/main.js');
  for (const s of ['initProductFilter', 'data-filter', 'item.hidden', 'dataset.type', "'Escape'", 'aria-expanded']) assert.ok(mainJs.includes(s), 'falta ' + s);
  assert.match(css, /\.filter-panel\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.filter-btn\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.filter-chip\s*\{[^}]*min-height:\s*44px/);
});
