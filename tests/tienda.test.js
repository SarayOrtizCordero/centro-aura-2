const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { read, ROOT } = require('./helpers');
const data = require('../js/data.js');
const images = require('./fixtures/images.json');
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

test('fotos de producto: los doce productos de Jaldún tienen foto con tamaño, lazy y alt reales', () => {
  const expected = {
    'champu-equilibrante.webp': 'Frasco del champú Equilibrante de Jaldún',
    'champu-vitalzen.webp': 'Frasco del champú Vitalzen Fortificante de Jaldún',
    'champu-multiefecto.webp': 'Frasco del champú Multiefecto Regulador de Jaldún',
    'tonico-equilibrante.webp': 'Frasco y caja del Tónico Equilibrante de Jaldún',
    'tonico-actianagen.webp': 'Frasco y caja del Tónico Actianagen de Jaldún',
    'nutrianagen.webp': 'Caja de Nutrianagen, complemento alimenticio capilar de Jaldún',
    'aceite-bioregenerador.webp': 'Frasco con cuentagotas del Aceite Bioregenerador de Jaldún',
    'emulsion-c3q.webp': 'Tubo de la Emulsión Equilibrante C3Q de Jaldún',
    'acondicionador-spray.webp': 'Frasco con pulverizador del Acondicionador Spray Equilibrante de Jaldún',
    'factor-crecimiento.webp': 'Frasco del Factor de Crecimiento Capilar de Jaldún',
    'oxigenador.webp': 'Tarro del Oxigenador de Jaldún',
    'oxigenador-marino.webp': 'Tarro del Oxigenador Marino de Jaldún',
  };
  const sizes = images.reduce((o, i) => ({ ...o, [i.name + '.webp']: [String(i.width), String(i.height)] }), {});
  const photos = jaldun.match(/<img\b[^>]*>/g).filter((img) => attr(img, 'src').endsWith('.webp'));
  assert.equal(photos.length, 12);
  for (const img of photos) {
    const file = attr(img, 'src').split('/').pop();
    assert.equal(attr(img, 'alt'), expected[file], file);
    assert.deepEqual([attr(img, 'width'), attr(img, 'height'), attr(img, 'loading')], [...sizes[file], 'lazy']);
  }
  assert.ok(!jaldun.includes('product-card__visual--empty'), 'no quedan productos sin foto');
  assert.ok(!html.includes('class="bottle'));
});

test('secciones: Jaldún, Brazilian Hairtech y Tarjetas regalo, con su mosaico', () => {
  assert.match(html, /<section class="section section--alt" id="jaldun"/);
  assert.match(html, /<section class="section" id="brazilian-hairtech"/);
  assert.match(html, /<section class="section section--alt" id="tarjetas-regalo"/);
  const tiles = html.match(/<a class="category-tile card"[^>]*>/g);
  assert.deepEqual(tiles.map((t) => attr(t, 'href')), ['#jaldun', '#brazilian-hairtech', '#tarjetas-regalo']);
  assert.ok(!html.includes('id="bonos"') && !html.includes('href="#bonos"'));
});

test('Jaldún: sin subcategorías; todos los productos juntos como fichas iguales (h3)', () => {
  assert.ok(!html.includes('class="subcategory"') && !html.includes('jaldun-champus'), 'ya no hay subcategorías');
  const cards = jaldun.match(/<li class="product-card[^"]*"[\s\S]*?<\/li>/g);
  assert.equal(cards.length, 12);
  const titles = cards.map((c) => c.match(/<h3>([^<]*)<\/h3>/)[1]);
  assert.deepEqual(titles, [
    'Champú Equilibrante', 'Champú Vitalzen Fortificante', 'Champú Multiefecto Regulador',
    'Tónico Equilibrante', 'Tónico Actianagen', 'Nutrianagen', 'Aceite Bioregenerador',
    'Emulsión Equilibrante C3Q', 'Acondicionador Spray Equilibrante', 'Factor de Crecimiento Capilar',
    'Oxigenador', 'Oxigenador Marino',
  ]);
  for (const c of cards) assert.ok(!c.includes('product-card--featured'));
  assert.ok(!css.includes('.product-card--featured'), 'sin ficha destacada: en PC son tres iguales');
});

test('productos de Jaldún: solo con lo que ha dicho la clienta y con su precio', () => {
  const esperado = {
    'jaldun-equilibrante': 'Ayuda a restablecer el equilibrio del cuero cabelludo, regulando la grasa, la descamación y las molestias.',
    'jaldun-vitalzen': 'Nutre y revitaliza el cuero cabelludo, ayudando a fortalecer el cabello y prevenir su caída.',
    'jaldun-multiefecto': 'Regula el exceso de grasa, combate la caspa, calma el picor y aporta volumen y textura.',
    'jaldun-tonico-equilibrante': 'Ayuda a regular la grasa y la descamación, calma los picores y favorece el equilibrio natural del cuero cabelludo.',
    'jaldun-tonico-actianagen': 'Estimula la microcirculación del cuero cabelludo, ayuda a fortalecer el cabello y a prevenir su caída.',
    'jaldun-nutrianagen': 'Complemento alimenticio que ayuda a fortalecer el cabello y mantener su salud desde el interior.',
    'jaldun-aceite-bioregenerador': 'Nutre, regenera y aporta suavidad al cabello y al cuero cabelludo.',
    'jaldun-emulsion-c3q': 'Ayuda a equilibrar el cuero cabelludo, hidratar y acondicionar el cabello.',
    'jaldun-acondicionador-spray': 'Acondiciona, hidrata y revitaliza todo tipo de cabellos, especialmente los frágiles y sensibles.',
    'jaldun-factor-crecimiento': 'Ayuda a revitalizar el cuero cabelludo y estimular la actividad capilar.',
    'jaldun-oxigenador': 'Limpia en profundidad, nutre, elimina impurezas y favorece el equilibrio del cuero cabelludo.',
    'jaldun-oxigenador-marino': 'Ayuda a regular el exceso de grasa, eliminar impurezas y refrescar el cuero cabelludo.',
  };
  const precios = { 'jaldun-nutrianagen': 37, 'jaldun-aceite-bioregenerador': 26, 'jaldun-emulsion-c3q': 27, 'jaldun-acondicionador-spray': 20, 'jaldun-factor-crecimiento': 70, 'jaldun-oxigenador': 43, 'jaldun-oxigenador-marino': 43 };
  for (const [id, p] of Object.entries(precios)) assert.equal(data.items[id].price, p, id);
  assert.equal(data.items['jaldun-tonico-equilibrante'].price, 40);
  assert.equal(data.items['jaldun-tonico-actianagen'].price, 59);
  for (const [id, texto] of Object.entries(esperado)) {
    const card = jaldun.match(new RegExp('<li class="product-card[^"]*"(?:(?!</li>)[\\s\\S])*data-price="' + id + '"[\\s\\S]*?</li>'))[0];
    assert.ok(card.includes('<p>' + texto + '</p>'), id);
    assert.ok(card.includes(`data-wa="${data.items[id].name}"`), id + ': WhatsApp con su nombre');
  }
  assert.ok(!html.includes('jaldun-ajobiotic') && !data.items['jaldun-ajobiotic'], 'Ajobiotic: retirado, no hay foto ni datos');
});

test('Brazilian Hairtech: siete fichas iguales a las de Jaldún, con foto de producto, precio de la clienta y selector de vista, sin filtro', () => {
  const sec = html.match(/<section class="section" id="brazilian-hairtech"[\s\S]*?<\/section>/)[0];
  assert.ok(/<section class="section" id="brazilian-hairtech"[^>]*data-view-block>/.test(sec));
  assert.match(sec, /<h2 id="brazilian-hairtech-title">Marca Brazilian <em>Hairtech<\/em><\/h2>/);
  assert.ok(!html.includes('Brasil Cacau') && !html.includes('brasil-cacau'), 'ya no queda Brasil Cacau');
  assert.equal((sec.match(/class="view-bar"/g) || []).length, 1);
  assert.ok(!sec.includes('filter-bar'));
  const cards = sec.match(/<li class="product-card[^"]*"[\s\S]*?<\/li>/g);
  assert.equal(cards.length, 7);
  const textos = {
      "brazilian-post-alisado": "Champú y acondicionador con nuez de Brasil y manteca de cupuaçu. Ayudan a prolongar el efecto del alisado y mantienen el cabello suave, hidratado y sin frizz.",
      "brazilian-healing": "Champú con pantenol y aceite de almendras, y mascarilla con macadamia y aceite de semilla de uva. Nutren e hidratan el cabello y ayudan a reparar la fibra para más brillo y suavidad.",
      "brazilian-alisado": "Tratamiento de alisado Copacabana Tanino Amino, con queratina, aminoácidos y taninos, que se aplica en el centro. Reduce el frizz y conserva el movimiento natural. El precio varía según el producto que se gaste.",
      "brazilian-hidratacion": "Tratamiento intensivo que se aplica en el centro para hidratar y nutrir el cabello, con la ampolla Healing de aminoácidos, aceite de lino y vitamina E. El precio varía según las cantidades.",
      "brazilian-reparacion": "Tratamiento intensivo que se aplica en el centro para reparar y reconstruir la fibra capilar, con queratina hidrolizada, aceite de semilla de uva y péptidos. El precio varía según las cantidades.",
      "brazilian-aceite-coco": "Nutre el cabello, aporta brillo y suavidad, y ayuda a controlar el frizz. Con ácido hialurónico y protección térmica.",
      "brazilian-healing-foam": "Espuma sin aclarado con ácido hialurónico y pantenol. Aporta suavidad e hidratación y ayuda a reparar y proteger el cabello del calor y de agresiones externas."
  };
  const esperado = {
    'brazilian-post-alisado': ['post-alisado', '55'],
    'brazilian-healing': ['healing', '55'],
    'brazilian-alisado': ['alisado', 'desde 100'],
    'brazilian-hidratacion': ['hidratacion', '30–50'],
    'brazilian-reparacion': ['reparacion', '30–50'],
    'brazilian-aceite-coco': ['aceite-coco', '38'],
    'brazilian-healing-foam': ['healing-foam', '38'],
  };
  assert.deepEqual(cards.map((c) => attr(c.match(/<span class="price"[^>]*>/)[0], 'data-price')), Object.keys(esperado));
  for (const c of cards) {
    const id = attr(c.match(/<span class="price"[^>]*>/)[0], 'data-price');
    const img = c.match(/<img\b[^>]*>/)[0];
    assert.equal(attr(img, 'src'), '../assets/img/brazilian-' + esperado[id][0] + '.webp');
    assert.deepEqual([attr(img, 'width'), attr(img, 'height'), attr(img, 'loading')], ['1000', '1000', 'lazy']);
    assert.ok(attr(img, 'alt').includes('Brazilian Hairtech'), id + ': alt');
    assert.ok(!c.includes('product-card__visual--photo') && !c.includes('--empty'), id + ': misma ficha que Jaldún');
    assert.ok(c.includes('<p>' + textos[id] + '</p>'), id + ': texto');
    assert.ok(c.includes(`data-wa="${data.items[id].name}"`), id + ': WhatsApp con su nombre');
    assert.ok(norm(c.match(/<span class="price"[^>]*>([^<]*)</)[1]).startsWith(esperado[id][1].replace('desde ', 'desde ')), id + ': precio');
  }
  assert.ok(!css.includes('product-card__visual--photo'), 'ya no hay variante de foto de ambiente');
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

test('botones: veintitrés enlaces de WhatsApp de producto (19 Lo quiero, 4 Regalar)', () => {
  const links = main.match(/<a\b[^>]*\sdata-wa="[^"]*"[^>]*>[\s\S]*?<\/a>/g);
  assert.equal(links.length, 23);
  for (const a of links) assert.equal(attr(a.match(/<a\b[^>]*>/)[0], 'data-wa-kind'), 'producto');
  const labels = links.map((a) => a.replace(/<[^>]+>/g, '').trim());
  assert.equal(labels.filter((l) => l === 'Lo quiero').length, 19);
  assert.equal(labels.filter((l) => l === 'Regalar').length, 4);
});

test('nota, cabecera y CSS', () => {
  assert.ok(main.includes('Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.'));
  assert.match(main, /<h1>Tienda<\/h1>/);
  assert.ok(main.includes('textura-lino.webp') && main.includes('class="page-hero__veil"'));
  assert.ok(css.includes('mix-blend-mode: multiply'));
});

test('selector Lista / Cuadrícula en Jaldún, Brazilian Hairtech y las tarjetas regalo, con iconos', () => {
  const bars = html.match(/<div class="view-bar"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g);
  assert.equal(bars.length, 3);
  for (const bar of bars) {
    assert.ok(/\shidden\b/.test(bar.match(/<div class="view-bar"[^>]*>/)[0]));
    // Jaldún y Brazilian Hairtech empiezan en cuadrícula (foto arriba); las tarjetas regalo, en lista
    assert.equal(attr(bar.match(/<div class="view-bar"[^>]*>/)[0], 'data-view-default'), bars.indexOf(bar) < 2 ? 'grid' : 'list');
    assert.ok(bar.includes('#i-lista') && bar.includes('#i-cuadricula'));
    assert.ok(!/Ver como|>Lista<|>Cuadrícula</.test(bar));
  }
  assert.equal((jaldun.match(/class="view-bar"/g) || []).length, 1);
  assert.equal((regalo.match(/class="view-bar"/g) || []).length, 1);
  assert.match(css, /\[data-view-block\]\[data-view="list"\] \.gift-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /\[data-view-block\]\[data-view="grid"\] \.product-grid\s*\{[^}]*repeat\(3,/);
});

test('menú: Tienda → Jaldún, Brazilian Hairtech y Tarjetas regalo, sin subcategorías', () => {
  assert.ok(!css.includes('subnav__sub'), 'ya no hay subcategorías en el menú');
  assert.match(css, /\.subnav li \+ li\s*\{[^}]*border-top:\s*1px solid/);
  for (const href of ['tienda.html#jaldun', 'tienda.html#brazilian-hairtech', 'tienda.html#tarjetas-regalo']) assert.ok(html.includes('href="' + href + '"'), href);
});

test('los productos de Jaldún y las tarjetas regalo tienen cada uno su propia vista', () => {
  assert.match(html, /<section class="section section--alt" id="jaldun"[^>]*data-view-block>/);
  assert.match(html, /<section class="section section--alt" id="tarjetas-regalo"[^>]*data-view-block>/);
});

test('botones de la tienda: "Lo quiero" más pequeño y "Regalar" separado del texto', () => {
  assert.match(css, /\.product-card__body \.btn--primary\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.gift-tile__body \.btn\s*\{[^}]*margin-top:\s*var\(--s-3\)/);
});

test('mosaico de marcas: logo de Jaldún y de Brazilian Hairtech, y el loto de Aura en las tarjetas regalo', () => {
  const tiles = html.match(/<a class="category-tile card"[\s\S]*?<\/a>/g);
  assert.equal(tiles.length, 3);
  const logos = tiles.map((t) => attr(t.match(/<img\b[^>]*>/)[0], 'src'));
  assert.deepEqual(logos, ['../assets/brands/jaldun-salud-capilar.jpg', '../assets/brands/brazilian-hairtech.webp', '../assets/icons/loto.svg']);
  for (const t of tiles) {
    const img = t.match(/<img\b[^>]*>/)[0];
    assert.equal(attr(img, 'alt'), '', 'logo decorativo: el nombre ya está en el título');
    assert.ok(attr(img, 'width') && attr(img, 'height'));
  }
  assert.match(css, /\.category-tile__logo\s*\{[^}]*background:\s*var\(--c-bg-alt\)/);
});

test('logos de marca: archivos locales con sus créditos (nada de terceros al cargar)', () => {
  const credits = read('assets/brands/CREDITOS.md');
  for (const f of ['jaldun-salud-capilar.jpg', 'brazilian-hairtech.webp']) {
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
    ['champus', 'champus', 'champus', 'tonicos', 'tonicos', 'otros', 'otros', 'otros', 'otros', 'otros', 'otros', 'otros']);
  assert.ok(bar.includes('role="status"') && bar.includes('aria-live="polite"'), 'avisa del resultado');
  const mainJs = read('js/main.js');
  for (const s of ['initProductFilter', 'data-filter', 'item.hidden', 'dataset.type', "'Escape'", 'aria-expanded']) assert.ok(mainJs.includes(s), 'falta ' + s);
  assert.match(css, /\.filter-panel\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.filter-btn\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\.filter-chip\s*\{[^}]*min-height:\s*44px/);
});
