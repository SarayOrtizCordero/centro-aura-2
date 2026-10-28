const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, read, pageFiles, webpSize } = require('./helpers');
const data = require('../js/data.js');

const WA = 'https://wa.me/34610167764';
const LEGAL = ['pages/aviso-legal.html', 'pages/privacidad.html'];
const LATER = new Set([
  'pages/servicios.html',
  'pages/tienda.html',
  'pages/contacto.html',
  'pages/aviso-legal.html',
  'pages/privacidad.html',
]);

const sprite = read('assets/icons/sprite.svg');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const ORIGIN_RE = /<link rel="canonical" href="(https:\/\/[^"/]+)/;

const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const tags = (html, name) => html.match(new RegExp('<' + name + '\\b[^>]*>', 'g')) || [];
const stripScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/g, '');

for (const rel of pageFiles()) {
  const prefix = rel.startsWith('pages/') ? '../' : '';
  const html = read(rel);
  const isLegal = LEGAL.includes(rel);
  const dir = path.posix.dirname(rel);

  test(`${rel}: estructura y metadatos`, () => {
    assert.match(html, /<html lang="es">/);
    const comments = html.match(/<!--[\s\S]*?-->/g) || [];
    for (const c of comments) assert.ok(isLegal && /BORRADOR/.test(c), 'comentario HTML no permitido: ' + c.slice(0, 40));
    assert.equal((html.match(/<h1\b/g) || []).length, 1, 'debe haber un h1');
    const title = html.match(/<title>([^<]*)<\/title>/)[1];
    assert.ok(title.length >= 10 && title.length <= 70, 'title ' + title.length);
    const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
    assert.ok(desc.length >= 50 && desc.length <= 200, 'description ' + desc.length);
    assert.match(html, /<main id="contenido"/);
    assert.match(html, /<a class="skip-link" href="#contenido"/);
    let prev = 0;
    for (const m of html.matchAll(/<h([1-6])\b/g)) {
      const lvl = Number(m[1]);
      assert.ok(lvl <= prev + 1, `salto de encabezado h${prev} -> h${lvl}`);
      prev = lvl;
    }
  });

  test(`${rel}: SEO por página`, () => {
    const canonical = html.match(/<link rel="canonical" href="(https:\/\/[^"]+)"/)[1];
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)[1];
    assert.equal(canonical, ogUrl);
    const pagePath = rel === 'index.html' ? '/' : '/' + rel;
    assert.ok(canonical.endsWith(pagePath), canonical + ' no termina en ' + pagePath);
    const img = html.match(/<meta property="og:image" content="(https:\/\/[^"]+)"/)[1];
    const imgPath = new URL(img).pathname;
    assert.match(imgPath, /^\/assets\/img\/.+\.webp$/);
    assert.ok(fs.existsSync(path.join(ROOT, imgPath)), 'no existe ' + imgPath);
    const origin = html.match(ORIGIN_RE)[1];
    for (const m of sitemap.matchAll(/<loc>(https:\/\/[^/<]+)/g)) assert.equal(m[1], origin);
    assert.equal(robots.match(/^Sitemap:\s*(https:\/\/[^/\s]+)/m)[1], origin);
  });

  test(`${rel}: orden de carga`, () => {
    const jsClass = html.indexOf("classList.add('js')");
    const firstSheet = html.indexOf('rel="stylesheet"');
    assert.ok(jsClass > -1 && jsClass < firstSheet, 'el script de la clase js va antes de las hojas');
    for (const f of ['cormorant-garamond-normal.woff2', 'dm-sans-normal.woff2']) {
      const href = `${prefix}assets/fonts/${f}`;
      const re = new RegExp(`<link rel="preload" href="${href.replace(/\./g, '\\.')}" as="font"[^>]*crossorigin`);
      assert.match(html, re, 'preload ' + f);
      assert.ok(fs.existsSync(path.join(ROOT, 'assets/fonts', f)));
    }
    const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(sheets, ['fonts.css', 'tokens.css', 'styles.css'].map((f) => `${prefix}css/${f}`));
    const scripts = [...html.matchAll(/<script src="([^"]+)"([^>]*)>/g)];
    assert.deepEqual(scripts.map((m) => m[1]), ['data.js', 'lib.js', 'main.js'].map((f) => `${prefix}js/${f}`));
    for (const s of scripts) assert.match(s[2], /\bdefer\b/);
    assert.ok(!/fonts\.googleapis|fonts\.gstatic/.test(html));
    assert.ok(!/<iframe/.test(html));
  });

  test(`${rel}: iconos del sprite incrustado`, () => {
    // El sprite va dentro de la página: con <use href="…/sprite.svg#…"> los iconos no se pintan al abrir por file://.
    assert.ok(!html.includes('sprite.svg'), 'la página no debe referenciar sprite.svg por URL');
    const inline = html.match(/<svg class="sprite"[\s\S]*?<\/svg>/);
    assert.ok(inline, 'falta el sprite incrustado (node tools/sync-sprite.mjs)');
    assert.equal((html.match(/<svg class="sprite"/g) || []).length, 1);
    const norm = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
    const fromFile = [...sprite.matchAll(/<symbol\b[\s\S]*?<\/symbol>/g)].map((m) => norm(m[0]));
    const fromPage = [...inline[0].matchAll(/<symbol\b[\s\S]*?<\/symbol>/g)].map((m) => norm(m[0]));
    assert.deepEqual(fromPage, fromFile, 'el sprite de la página no coincide con assets/icons/sprite.svg');
    const used = [...html.matchAll(/<use href="#(i-[\w-]+)"/g)].map((m) => m[1]);
    assert.ok(used.length > 0);
    for (const id of used) assert.ok(inline[0].includes(`<symbol id="${id}"`), 'símbolo inexistente: ' + id);
  });

  test(`${rel}: imágenes, ids, datos y enlaces locales`, () => {
    for (const img of tags(html, 'img')) {
      assert.notEqual(attr(img, 'alt'), null, 'img sin alt: ' + img);
      const w = attr(img, 'width');
      const h = attr(img, 'height');
      assert.ok(w && h, 'img sin width/height: ' + img);
      const src = attr(img, 'src');
      if (src && !/^https?:/.test(src) && src.endsWith('.webp')) {
        const file = path.join(ROOT, dir, src);
        const [rw, rh] = webpSize(fs.readFileSync(file));
        assert.deepEqual([Number(w), Number(h)], [rw, rh], 'tamaño real de ' + src);
      }
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
    for (const m of html.matchAll(/data-(?:price|duration)="([^"]+)"/g)) {
      assert.ok(data.items[m[1]], 'clave inexistente en data.js: ' + m[1]);
    }
    const refs = [...stripScripts(html).matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|tel:|mailto:|#)/.test(ref)) continue;
      const [file, frag] = ref.split('#');
      const resolved = path.posix.normalize(path.posix.join(dir, file));
      if (!fs.existsSync(path.join(ROOT, resolved))) {
        assert.ok(LATER.has(resolved), 'destino local inexistente: ' + ref);
        continue;
      }
      if (file.endsWith('sprite.svg') && frag) {
        assert.ok(sprite.includes(`id="${frag}"`), 'símbolo inexistente: ' + frag);
      }
    }
  });

  test(`${rel}: estructura común`, () => {
    const topbar = html.indexOf('class="topbar"');
    const header = html.indexOf('<header class="site-header"');
    assert.ok(topbar > -1 && header > topbar, 'topbar antes de la cabecera');
    assert.equal((html.match(/class="topbar"/g) || []).length, 1);
    const toggle = html.indexOf('<button class="nav-toggle"');
    const nav = html.indexOf('<nav class="site-nav" id="site-menu"');
    assert.ok(toggle > -1 && nav > toggle, 'nav-toggle antes de nav#site-menu');
    const btn = tags(html, 'button').find((b) => b.includes('nav-toggle'));
    assert.equal(attr(btn, 'aria-expanded'), 'false');
    assert.equal(attr(btn, 'aria-controls'), 'site-menu');
    const navHtml = html.slice(nav, html.indexOf('</nav>', nav));
    assert.match(navHtml, /aria-label="Principal"/);
    const links = [...navHtml.matchAll(/<a ([^>]*)>([^<]*)<\/a>/g)].filter((m) => !/class="btn/.test(m[1]));
    assert.deepEqual(
      links.map((m) => m[2]),
      ['Inicio', 'Servicios', 'Salud capilar', 'Spa', 'Peluquería', 'Tienda', 'Jaldún', 'Champús', 'Tarjetas regalo', 'Contacto']
    );
    const current = links.filter((m) => /aria-current="page"/.test(m[1]));
    assert.equal(current.length, isLegal ? 0 : 1);
    assert.equal((navHtml.match(/class="sub-toggle" type="button" aria-expanded="false"/g) || []).length, 2);
    const brand = html.match(/<header class="site-header">[\s\S]*?<\/a>/)[0];
    assert.ok(brand.includes('<span class="brand__name">AURA</span>'));
    assert.ok(!brand.includes('brand__tag'), 'la cabecera lleva solo AURA');
    const footer = html.slice(html.indexOf('<footer class="site-footer"'));
    assert.deepEqual(
      [...footer.matchAll(/<h2 class="site-footer__title">([^<]*)<\/h2>/g)].map((m) => m[1]),
      ['Visítanos', 'Horario', 'Contacto']
    );
    assert.match(footer, />Aviso legal<\/a>/);
    assert.match(footer, />Privacidad y cookies<\/a>/);
    assert.equal((html.match(/<a class="wa-float"/g) || []).length, 1);
    if (prefix) {
      for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        assert.ok(!/^(\.\.\/)?pages\//.test(m[1]), 'referencia con pages/: ' + m[1]);
      }
    }
    const wa = tags(html, 'a').filter((a) => /\sdata-wa\b/.test(a));
    assert.ok(wa.length >= 3);
    for (const a of wa) assert.equal(attr(a, 'href'), WA);
  });
}
