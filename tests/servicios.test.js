const test = require('node:test');
const assert = require('node:assert/strict');
const { read, pageFiles } = require('./helpers');
const data = require('../js/data.js');
const lib = require('../js/lib.js');

const html = read('pages/servicios.html');
const css = read('css/styles.css');

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const text = (s) => norm(s.replace(/<[^>]+>/g, ''));
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const services = Object.entries(data.items).filter(([, it]) => it.type === 'servicio');

const panelOf = (id) => {
  const marker = `id="${id}" role="tabpanel"`;
  const start = html.indexOf(marker);
  assert.ok(start > -1, 'falta el panel ' + id);
  const next = html.indexOf('role="tabpanel"', start + marker.length);
  return html.slice(start, next === -1 ? html.indexOf('</main>') : next);
};
const rowOf = (id) => {
  const start = html.indexOf(`<li class="service-row card" id="${id}">`);
  assert.ok(start > -1, 'falta la fila ' + id);
  const end = html.indexOf('<div class="service-row__side">', start);
  const close = html.indexOf('</li>\n', end);
  return html.slice(start, close + 5);
};

test('filas: una por servicio, con precio, WhatsApp y duración solo si existe', () => {
  for (const [id, it] of services) {
    const row = rowOf(id);
    assert.ok(row.includes(`data-price="${id}"`), id + ': data-price');
    assert.ok(row.includes(`data-wa="${it.name}"`), id + ': data-wa');
    assert.equal(row.includes(`data-duration="${id}"`), Boolean(it.duration), id + ': data-duration');
  }
});

test('respaldo == datos: texto de cada data-price', () => {
  for (const [id, it] of services) {
    const m = html.match(new RegExp(`data-price="${id}">([^<]*)<`));
    assert.ok(m, id);
    assert.equal(norm(m[1]), norm(lib.formatPrice(it)), id);
  }
});

test('textos: aviso orientativo, Corte y rituales de Spa', () => {
  const panel = panelOf('peluqueria');
  const note = panel.match(/<p class="price-note">[\s\S]*?<\/p>/)[0];
  assert.ok(note.includes('<strong>orientativos</strong>'));
  assert.ok(note.includes('productos que se gasten'));
  assert.ok(panel.indexOf('price-note') < panel.indexOf('data-price'));
  assert.ok(panelOf('salud-capilar').includes('<strong>30 a 50 €</strong>'));
  assert.match(html, /<h3>Corte<\/h3>\s*<p class="service-row__note">Incluye lavado, corte y secado<\/p>/);
  for (const id of ['spa-esencial', 'spa-equilibrio', 'spa-aura']) {
    const inc = rowOf(id).match(/<ul class="includes"[\s\S]*?<\/ul>/);
    assert.ok(inc && inc[0].includes('Masaje de hombros, cuello, rostro y cabeza'), id);
  }
});

test('pestañas y paneles', () => {
  const tablist = html.match(/<div class="tabs chips" role="tablist"[^>]*>/)[0];
  assert.ok(/\shidden\b/.test(tablist));
  assert.ok(attr(tablist, 'aria-label'));
  const tabs = html.match(/<button class="tab"[^>]*>/g);
  assert.equal(tabs.length, data.categories.length);
  const panels = { salud: 'salud-capilar', spa: 'spa', peluqueria: 'peluqueria' };
  data.categories.forEach((cat, i) => {
    const tab = tabs[i];
    assert.equal(attr(tab, 'role'), 'tab');
    assert.equal(attr(tab, 'id'), 'tab-' + cat.id);
    assert.equal(attr(tab, 'aria-controls'), panels[cat.id]);
    assert.equal(attr(tab, 'data-category'), cat.id);
    assert.equal(attr(tab, 'aria-selected'), i === 0 ? 'true' : 'false');
    if (i > 0) assert.equal(attr(tab, 'tabindex'), '-1');
    assert.match(html, new RegExp(`id="${panels[cat.id]}" role="tabpanel" aria-labelledby="tab-${cat.id}"`));
  });
  for (const [id, it] of services) {
    const panel = panelOf(panels[it.category]);
    assert.ok(panel.includes(`id="${id}"`), `${id} debe estar en el panel de ${it.category}`);
  }
});

test('cabecera, fotos de categoría, análisis y llamada final', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal(text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]), 'Servicios');
  const bg = html.match(/<img class="page-hero__bg"[^>]*>/)[0];
  assert.ok(attr(bg, 'src').endsWith('textura-lino.webp'));
  assert.equal(attr(bg, 'alt'), '');
  assert.deepEqual([attr(bg, 'width'), attr(bg, 'height')], ['2000', '900']);
  assert.ok(html.includes('class="page-hero__veil"'));
  const photos = html.match(/<img class="category__photo"[^>]*>/g);
  assert.equal(photos.length, 3);
  assert.deepEqual(
    photos.map((p) => attr(p, 'alt')),
    [
      'Primer plano del cabello, como se ve con la microcámara en el análisis',
      'Masaje en el cuero cabelludo con la clienta relajada',
      'Estilista secando el pelo de una clienta con cepillo redondo',
    ]
  );
  const sizes = photos.map((p) => [attr(p, 'width'), attr(p, 'height'), attr(p, 'loading')]);
  assert.deepEqual(sizes, [['900', '1125', 'lazy'], ['1000', '1250', 'lazy'], ['1000', '1250', 'lazy']]);
  assert.match(html, /<h2 id="consulta-title">¿Cómo es el análisis del cuero cabelludo\?<\/h2>/);
  const steps = html.match(/<li class="step-card card reveal">[\s\S]*?<\/li>/g);
  assert.deepEqual(
    steps.map((s) => text(s.match(/<h3>([\s\S]*?)<\/h3>/)[1])),
    ['Diagnóstico con microcámara', 'Plan personalizado', 'Seguimiento']
  );
  const cta = html.match(/<a [^>]*>Escríbeme/)[0];
  assert.equal(attr(cta, 'href'), 'contacto.html#formulario');
});

test('enlaces entrantes: todo servicios.html#<id> apunta a un id existente', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  let seen = 0;
  for (const rel of pageFiles()) {
    for (const m of read(rel).matchAll(/href="(?:pages\/)?servicios\.html#([^"]+)"/g)) {
      seen++;
      assert.ok(ids.has(m[1]), `${rel} enlaza a #${m[1]}, que no existe en servicios.html`);
    }
  }
  assert.ok(seen > 0);
});

test('css: servicios en cuadrícula (2 en móvil, 3 en tablet, lista en PC) y fotos centradas', () => {
  assert.match(css, /\.service-rows\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /\[data-view-block\]\[data-view="list"\] \.service-rows\s*\{\s*grid-template-columns:\s*1fr;/);
  assert.match(css, /\.category__photo\s*\{[^}]*margin-inline:\s*auto/);
});

test('css: velo claro de la cabecera de página', () => {
  assert.match(css, /\.page-hero__veil\s*\{[^}]*rgb\(var\(--veil-light-rgb\) \/ var\(--veil-light-alpha\)\)/);
});

test('selector Lista / Cuadrícula: icono por botón, uno en cada bloque, oculto sin JS y lista por defecto', () => {
  const bars = html.match(/<div class="view-bar"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g);
  assert.equal(bars.length, 3, 'uno por categoría');
  for (const bar of bars) {
    assert.ok(/\shidden\b/.test(bar.match(/<div class="view-bar"[^>]*>/)[0]));
    assert.equal(attr(bar.match(/<div class="view-bar"[^>]*>/)[0], 'data-view-default'), 'list');
    const buttons = bar.match(/<button[^>]*>[\s\S]*?<\/button>/g);
    assert.deepEqual(buttons.map((b) => attr(b, 'data-view')), ['list', 'grid']);
    assert.deepEqual(buttons.map((b) => attr(b, 'aria-pressed')), ['true', 'false']);
    assert.deepEqual(buttons.map((b) => attr(b, 'aria-label')), ['Ver en lista', 'Ver en cuadrícula']);
    assert.ok(bar.includes('#i-lista') && bar.includes('#i-cuadricula'));
    assert.ok(!/Ver como|>Lista<|>Cuadrícula</.test(bar), 'solo iconos, sin texto visible');
  }
  assert.ok(html.indexOf('view-bar') > html.indexOf('class="category__head"'), 'el selector va junto a los elementos, no al principio');
  const main = read('js/main.js');
  assert.equal((html.match(/data-view-block/g) || []).length, 3, 'cada categoría tiene su propia vista');
  for (const s of ['initViewToggle', 'data-view-block', 'dataset.view', 'localStorage', "|| 'list'"]) assert.ok(main.includes(s), 'falta ' + s);
});

test('cada servicio de Spa: nombre primero y la duración debajo', () => {
  for (const id of ['spa-esencial', 'spa-equilibrio', 'spa-aura']) {
    const row = rowOf(id);
    assert.ok(row.indexOf('<h3>') < row.indexOf('data-duration'), id);
  }
});

test('pestañas de servicios: tres en una línea en móvil', () => {
  assert.match(css, /\.tabs\.chips\s*\{[^}]*grid-template-columns:\s*repeat\(3,/);
});

test('cuadrícula móvil: cada spa tiene su botón "Ver qué incluye", que abre una ventana emergente', () => {
  for (const id of ['spa-esencial', 'spa-equilibrio', 'spa-aura']) {
    const btn = rowOf(id).match(/<button class="service-row__more"[^>]*>[^<]*<\/button>/)[0];
    assert.equal(attr(btn, 'aria-haspopup'), 'dialog', id);
    assert.ok(btn.includes('>Ver qué incluye<'), id);
  }
  const main = read('js/main.js');
  for (const s of ['initServiceMore', "createElement('dialog')", 'showModal', 'service-dialog__x', 'service-dialog__close', 'event.target === dialog']) assert.ok(main.includes(s), 'falta ' + s);
  assert.match(css, /\.service-dialog::backdrop\s*\{/);
  assert.ok(!css.includes('service-detail') && !css.includes('is-expanded'), 'ya no hay panel en la página');
});

test('lista de servicios: el precio y el botón de reservar van en una fila propia, debajo del texto', () => {
  assert.match(css, /\[data-view-block\]\[data-view="list"\] \.service-row\s*\{[^}]*flex-direction:\s*column/);
  assert.match(css, /\[data-view-block\]\[data-view="list"\] \.service-row__side\s*\{[^}]*flex-direction:\s*row[^}]*justify-content:\s*space-between/);
});

test('cuadrícula de servicios: precio y botón al fondo, separados del texto por una línea', () => {
  assert.match(css, /\.service-row__side\s*\{[^}]*padding-top:[^}]*border-top:\s*1px solid var\(--c-line\)/);
});

test('"Ver qué incluye" se ve como un subtítulo (acento, mayúsculas pequeñas), no con color de filete', () => {
  const rule = css.match(/\.js \.service-row__more\s*\{[^}]*\}/)[0];
  assert.match(rule, /color:\s*var\(--c-clay\)/);
  assert.match(rule, /text-transform:\s*uppercase/);
  assert.ok(!/--c-line|--c-muted|--c-gold/.test(rule), 'el texto no puede usar colores decorativos');
});

test('resúmenes breves: solo con textos de la clienta (o el propio nombre del servicio) y visibles también en cuadrícula', () => {
  const esperado = {
    'diagnostico': 'Vemos tu cuero cabelludo ampliado en pantalla y te explico lo que encontramos.',
    'tratamiento-fibra': 'Tres opciones según lo que necesite tu pelo: reparación, hidratación o nutrición.',
    'reparacion-nutricion-hidratacion': 'Tres opciones según lo que necesite tu pelo.',
    'lavado-peinado': 'Incluye lavado y peinado.',
    'barro-raiz': 'Coloración natural solo en la raíz.',
    'barro-completo': 'Coloración natural en todo el cabello.',
    'antifrizz-corto': 'Se ajusta a tu melena y a lo que necesite.',
    'antifrizz-medio-largo': 'Se ajusta a tu melena y a lo que necesite.',
  };
  for (const [id, text] of Object.entries(esperado)) {
    assert.ok(rowOf(id).includes('<p class="service-row__note">' + text + '</p>'), id);
  }
});
