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
  const panel = panelOf('barros-alisados-antifrizz');
  const note = panel.match(/<p class="price-note">[\s\S]*?<\/p>/)[0];
  assert.ok(note.includes('<strong>orientativos</strong>'));
  assert.ok(note.includes('productos que se gasten'));
  assert.ok(panel.indexOf('price-note') < panel.indexOf('data-price'));
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
  const panels = { spa: 'spa', tratamientos: 'barros-alisados-antifrizz', peluqueria: 'peluqueria' };
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
      'Masaje en el cuero cabelludo con la clienta relajada',
      'Melena larga, lisa y brillante vista de espaldas',
      'Estilista secando el pelo de una clienta con cepillo redondo',
    ]
  );
  for (const p of photos) {
    assert.deepEqual([attr(p, 'width'), attr(p, 'height'), attr(p, 'loading')], ['1000', '1250', 'lazy']);
  }
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

test('css: velo claro de la cabecera de página', () => {
  assert.match(css, /\.page-hero__veil\s*\{[^}]*rgb\(var\(--veil-light-rgb\) \/ var\(--veil-light-alpha\)\)/);
});
