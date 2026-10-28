const test = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');

const html = read('index.html');
const css = read('css/styles.css');

const WA = 'https://wa.me/34610167764';
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const sectionOf = (cls) => {
  const m = html.match(new RegExp('<section class="' + cls + '\\b[\\s\\S]*?</section>'));
  assert.ok(m, 'falta section.' + cls);
  return m[0];
};
const rule = (selector) => {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp('(?:^|\\})\\s*' + esc + '\\s*\\{([^}]*)\\}'));
  assert.ok(m, 'falta la regla ' + selector);
  return m[1];
};

const main = html.match(/<main id="contenido">([\s\S]*)<\/main>/)[1];
const sections = [...main.matchAll(/<section class="([\w-]+)/g)].map((m) => m[1]);

test('main: empieza por hero y pillars, sin placeholder', () => {
  assert.deepEqual(sections.slice(0, 2), ['hero', 'pillars']);
  assert.ok(!html.includes('shell-placeholder'));
});

test('hero: título, eyebrow, imagen y botones', () => {
  const hero = sectionOf('hero');
  const h1 = hero.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1];
  assert.equal(text(h1), 'Cuidamos tu cabello desde la raíz');
  assert.ok(h1.includes('<em>desde la raíz</em>'));
  assert.ok(hero.includes('<span class="eyebrow eyebrow--plain">Spa Capilar · Tricología</span>'));
  const img = hero.match(/<img class="hero__img"[^>]*>/)[0];
  assert.ok(attr(img, 'src').endsWith('hero-salon.webp'));
  assert.equal(attr(img, 'width'), '2000');
  assert.equal(attr(img, 'height'), '1333');
  assert.equal(attr(img, 'fetchpriority'), 'high');
  assert.ok(attr(img, 'alt').trim().length > 0);
  const reservar = hero.match(/<a [^>]*data-wa[^>]*>Reservar cita/)[0];
  assert.equal(attr(reservar, 'href'), WA);
  assert.ok(/data-wa=""/.test(reservar));
  const servicios = hero.match(/<a [^>]*>Ver servicios<\/a>/)[0];
  assert.equal(attr(servicios, 'href'), 'pages/servicios.html');
});

test('hero: la tarjeta va después de la foto y fuera de ella', () => {
  const hero = sectionOf('hero');
  const mediaStart = hero.indexOf('<div class="hero__media">');
  const mediaEnd = hero.indexOf('</div>', mediaStart);
  const cardStart = hero.indexOf('<aside class="hero__card"');
  assert.ok(mediaStart > -1 && cardStart > mediaEnd, 'aside.hero__card debe seguir a .hero__media');
  const card = hero.slice(cardStart, hero.indexOf('</aside>', cardStart));
  assert.ok(/<dl class="hours" data-hours>/.test(card));
  const rows = [...card.matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)(?:<small class="hours__note">[^<]*<\/small>)?<\/dd>/g)];
  assert.equal(rows.length, 3);
  const contacto = card.match(/<a [^>]*>Ver contacto<\/a>/)[0];
  assert.equal(attr(contacto, 'href'), 'pages/contacto.html');
});

test('pilares: cuatro, con título e icono en orden', () => {
  const pillars = sectionOf('pillars');
  assert.match(pillars, /<h2 class="visually-hidden" id="pillars-title">Lo que hacemos en Aura<\/h2>/);
  const items = [...pillars.matchAll(/<li class="pillar\b[\s\S]*?<\/li>/g)].map((m) => m[0]);
  assert.equal(items.length, 4);
  assert.deepEqual(
    items.map((li) => text(li.match(/<h3>([\s\S]*?)<\/h3>/)[1])),
    ['Peluquería titulada', 'Spa capilar', 'Tricología con microcámara', 'Cosmética natural Jaldún']
  );
  assert.deepEqual(
    items.map((li) => li.match(/<use href="#(i-[\w-]+)"/)[1]),
    ['i-tijeras', 'i-spa', 'i-tricologia', 'i-barro']
  );
});

test('css: pilares cacao, tarjeta opaca, foto con borde inferior curvo, sin backdrop-filter', () => {
  assert.match(rule('.pillars'), /background:\s*var\(--c-anchor\)/);
  assert.match(rule('.hero__card'), /background:\s*var\(--c-bg\)/);
  assert.match(rule('.hero__media'), /border-radius:\s*0 0 var\(--r-curve\) var\(--r-curve\)/);
  assert.ok(!css.includes('backdrop-filter'));
});

const lib = require('../js/lib.js');
const data = require('../js/data.js');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

test('main: las cuatro primeras secciones en orden', () => {
  assert.deepEqual(sections.slice(0, 4), ['hero', 'pillars', 'icon-row', 'service-cards']);
});

test('icon-row: título y cuatro enlaces en orden', () => {
  const row = sectionOf('icon-row');
  assert.equal(text(row.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)[1]), 'Elige por dónde empezar');
  const items = [...row.matchAll(/<a class="icon-row__item"[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]);
  assert.deepEqual(
    items.map((a) => attr(a, 'href')),
    [
      'pages/servicios.html#salud-capilar',
      'pages/servicios.html#spa',
      'pages/servicios.html#peluqueria',
      'pages/tienda.html',
    ]
  );
  for (const a of items) {
    assert.match(a, /<h3>[^<]+<\/h3>/);
    const p = text(a.match(/<p>([\s\S]*?)<\/p>/)[1]);
    assert.ok(p.length > 0 && p.length <= 80, 'p de ' + p.length + ' caracteres');
    assert.match(a, /<use href="#i-[\w-]+"/);
  }
});

test('service-cards: tres tarjetas de Spa con foto, chips, precio y un solo enlace', () => {
  const sec = sectionOf('service-cards');
  const cards = [...sec.matchAll(/<article class="service-card card">[\s\S]*?<\/article>/g)].map((m) => m[0]);
  assert.equal(cards.length, 3);
  const ids = ['spa-esencial', 'spa-equilibrio', 'spa-aura'];
  cards.forEach((card, i) => {
    const id = ids[i];
    const img = card.match(/<img\b[^>]*>/)[0];
    assert.match(attr(img, 'src'), /^assets\/img\/.+\.webp$/);
    assert.ok(attr(img, 'alt').trim().length > 0);
    assert.equal(attr(img, 'width'), '900');
    assert.equal(attr(img, 'height'), '1125');
    assert.equal(attr(img, 'loading'), 'lazy');
    assert.ok(card.includes('<span class="chip">Spa</span>'));
    assert.ok(card.includes(`data-duration="${id}"`));
    assert.ok(card.includes(`data-price="${id}"`));
    const links = card.match(/<a\b[^>]*>/g) || [];
    assert.equal(links.length, 1, 'un solo enlace por tarjeta');
    assert.equal(attr(links[0], 'href'), `pages/servicios.html#${id}`);
    assert.ok(/<h3><a\b/.test(card), 'el enlace va dentro del h3');
  });
  const more = sec.match(/<a [^>]*>Ver todos los servicios<\/a>/)[0];
  assert.equal(attr(more, 'href'), 'pages/servicios.html');
});

test('respaldo == datos: precio y duración del HTML salen de data.js', () => {
  const prices = [...html.matchAll(/data-price="([^"]+)"[^>]*>([^<]*)</g)];
  const durations = [...html.matchAll(/data-duration="([^"]+)"[^>]*>([^<]*)</g)];
  assert.ok(prices.length >= 3 && durations.length >= 3);
  for (const [, id, txt] of prices) assert.equal(norm(txt), norm(lib.formatPrice(data.items[id])), id);
  for (const [, id, txt] of durations) assert.equal(norm(txt), norm(data.items[id].duration), id);
});

test('main: las seis primeras secciones en orden', () => {
  assert.deepEqual(sections.slice(0, 6), ['hero', 'pillars', 'icon-row', 'service-cards', 'spotlight', 'mosaic']);
});

test('spotlight: tres frascos en arco, título, checklist y botón', () => {
  const sec = sectionOf('spotlight');
  const panel = sec.match(/<div class="spotlight__panel arch\b[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(panel, 'las fotos van dentro de un panel .arch');
  const imgs = panel[0].match(/<img\b[^>]*>/g);
  assert.equal(imgs.length, 3);
  assert.deepEqual(
    imgs.map((i) => attr(i, 'src').split('/').pop()),
    ['champu-equilibrante.webp', 'champu-vitalzen.webp', 'champu-multiefecto.webp']
  );
  for (const i of imgs) {
    assert.equal(attr(i, 'width'), '2250');
    assert.equal(attr(i, 'height'), '2250');
    assert.equal(attr(i, 'loading'), 'lazy');
    assert.match(attr(i, 'alt'), /^Frasco del champú .+ de Jaldún$/);
  }
  assert.ok(/<h2\b[^>]*>[^<]*<em>Jaldún<\/em>/.test(sec));
  const list = sec.match(/<ul class="checklist"[\s\S]*?<\/ul>/)[0];
  const items = list.match(/<li>[\s\S]*?<\/li>/g);
  assert.equal(items.length, 3);
  assert.deepEqual(
    items.map((li) => li.match(/<strong>([^<]*)<\/strong>/)[1]),
    ['Equilibrante', 'Vitalzen Fortificante', 'Multiefecto Regulador']
  );
  const btn = sec.match(/<a [^>]*>Ver tienda/)[0];
  assert.equal(attr(btn, 'href'), 'pages/tienda.html#jaldun');
  assert.match(rule('.spotlight__bottles img'), /mix-blend-mode:\s*multiply/);
});

test('mosaic: tres fotos, cita y sin biografía inventada', () => {
  const sec = sectionOf('mosaic');
  const imgs = sec.match(/<img\b[^>]*>/g);
  assert.deepEqual(
    imgs.map((i) => [attr(i, 'src').split('/').pop(), attr(i, 'width'), attr(i, 'height')]),
    [
      ['servicio-salud.webp', '1000', '1250'],
      ['destacado-terapias.webp', '900', '1125'],
      ['servicio-peluqueria.webp', '1000', '1250'],
    ]
  );
  for (const i of imgs) assert.ok(attr(i, 'alt').trim().length > 0);
  assert.ok(sec.includes('<em>la energía del interior y la que envuelve al cuerpo físico</em>'));
  for (const banned of ['Hola, soy Paula', 'retrato', 'años de experiencia']) {
    assert.ok(!sec.includes(banned), 'no debe contener: ' + banned);
  }
  assert.ok(!/\d\s*años/.test(sec));
});

test('main: las ocho secciones en orden y la topbar precede a la cabecera', () => {
  assert.deepEqual(sections, [
    'hero', 'pillars', 'icon-row', 'service-cards', 'spotlight', 'mosaic', 'gift-banner', 'visit',
  ]);
  assert.ok(html.indexOf('class="topbar"') > -1);
  assert.ok(html.indexOf('class="topbar"') < html.indexOf('<header class="site-header"'));
});

test('gift-banner: foto decorativa, velo, título y botón de WhatsApp', () => {
  const sec = sectionOf('gift-banner');
  const img = sec.match(/<img\b[^>]*>/)[0];
  assert.ok(attr(img, 'src').endsWith('tarjeta-regalo.webp'));
  assert.equal(attr(img, 'alt'), '');
  assert.equal(attr(img, 'width'), '1200');
  assert.equal(attr(img, 'height'), '900');
  const veil = sec.match(/<div class="gift-banner__veil"[^>]*>/)[0];
  assert.equal(attr(veil, 'aria-hidden'), 'true');
  const h2 = sec.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)[1];
  assert.equal(text(h2), 'Regala Aura');
  assert.ok(h2.includes('<em>Aura</em>'));
  const btn = sec.match(/<a [^>]*>Pedir tarjeta regalo/)[0];
  assert.equal(attr(btn, 'data-wa'), 'Tarjeta regalo');
  assert.equal(attr(btn, 'data-wa-kind'), 'producto');
  assert.equal(attr(btn, 'href'), WA);
  assert.match(rule('.gift-banner__veil'), /rgb\(var\(--veil-dark-rgb\) \/ var\(--veil-dark-alpha\)\)/);
});

test('visit: mapa bajo demanda, sin iframe, horario, teléfono y cómo llegar', () => {
  assert.ok(!html.includes('<iframe'));
  const sec = sectionOf('visit');
  const map = sec.match(/<div class="map"[^>]*>/)[0];
  const src = attr(map, 'data-map-src');
  assert.ok(src.startsWith('https://www.google.com/maps?q='));
  assert.ok(src.endsWith('&amp;output=embed'));
  assert.ok(attr(map, 'data-map-title'));
  const button = sec.match(/<button [^>]*data-map-load[^>]*>([^<]*)<\/button>/);
  assert.ok(button && /\shidden\b/.test(button[0]));
  assert.equal(button[1], 'Ver el mapa');
  const open = sec.match(/<a [^>]*>Abrir en Google Maps<\/a>/)[0];
  assert.ok(attr(open, 'href').startsWith('https://www.google.com/maps/search/'));
  assert.ok(/<dl class="hours" data-hours>/.test(sec));
  const phone = sec.match(/<a [^>]*data-phone[^>]*>/)[0];
  assert.equal(attr(phone, 'href'), 'tel:+34610167764');
  assert.match(sec, /<a [^>]*>Cómo llegar<\/a>/);
});

test('JSON-LD: HairSalon con teléfono, redes y horario iguales a data.js', () => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'falta el JSON-LD');
  const ld = JSON.parse(m[1]);
  assert.equal(ld['@type'], 'HairSalon');
  assert.equal(ld.telephone, '+' + data.business.phoneDigits);
  assert.deepEqual(ld.sameAs, [data.business.instagram]);
  assert.equal(ld.address.postalCode, '41730');
  const pad = (t) => t.padStart(5, '0');
  const fromData = [];
  for (const h of data.hours) {
    for (const slot of h.slots) {
      const [o, c] = slot.split(' – ').map(pad);
      for (const d of h.schemaDays) fromData.push(`${d}|${o}|${c}`);
    }
  }
  const fromLd = [];
  for (const s of ld.openingHoursSpecification) {
    for (const d of [].concat(s.dayOfWeek)) fromLd.push(`${d}|${s.opens}|${s.closes}`);
  }
  assert.deepEqual(fromLd.sort(), fromData.sort());
});
