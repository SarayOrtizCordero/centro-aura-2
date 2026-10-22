const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, read } = require('./helpers');

const aviso = read('pages/aviso-legal.html');
const privacidad = read('pages/privacidad.html');
const nf = read('404.html');

const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};

test('legales: h1, textos clave, campos pendientes, BORRADOR y sin formularios', () => {
  assert.ok(aviso.includes('<h1>Aviso legal</h1>'));
  assert.ok(aviso.includes('Ley 34/2002'));
  assert.ok(privacidad.includes('<h1>Privacidad y cookies</h1>'));
  assert.ok(privacidad.includes('no usa cookies propias'));
  assert.ok(privacidad.includes('aepd.es'));
  for (const html of [aviso, privacidad]) {
    assert.ok(html.includes('<mark class="pendiente">'));
    assert.ok(html.includes('BORRADOR'));
    assert.ok(!html.includes('<form'));
  }
});

test('404: noindex, sin canonical, un h1 y base antes de enlaces y scripts', () => {
  assert.ok(nf.includes('<meta name="robots" content="noindex">'));
  assert.ok(!nf.includes('canonical'));
  assert.equal((nf.match(/<h1\b/g) || []).length, 1);
  assert.ok(nf.includes("location.protocol === 'file:'"));
  assert.ok(nf.includes('document.head.insertBefore(b, document.head.firstChild)'));
  const base = nf.indexOf('<base href="/">');
  assert.ok(base > -1);
  assert.ok(base < nf.indexOf('<link '), '<base> antes del primer <link');
  assert.ok(base < nf.indexOf('<script src='), '<base> antes del primer <script src=');
});

test('404: todas las rutas locales parten de la raíz y existen', () => {
  const refs = [...nf.matchAll(/\s(?:href|src)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => r !== '/' && !/^(https?:|tel:|mailto:|#)/.test(r));
  assert.ok(refs.length > 8, 'solo ' + refs.length + ' rutas locales');
  for (const ref of refs) {
    assert.ok(!ref.startsWith('/'), 'ruta absoluta: ' + ref);
    assert.ok(!ref.startsWith('../'), 'ruta con ../: ' + ref);
    const file = ref.split('#')[0];
    assert.ok(fs.existsSync(path.join(ROOT, file)), 'no existe ' + file);
  }
});

test('404: contenido, salto al contenido y tres salidas', () => {
  assert.ok(
    nf.includes(`onclick="event.preventDefault(); document.getElementById('contenido').focus();"`)
  );
  assert.ok(nf.includes('<main id="contenido" tabindex="-1">'));
  assert.ok(nf.includes('<section class="notfound">'));
  assert.ok(nf.includes('<span>4</span><img src="assets/icons/loto.svg" alt="" width="64" height="40"><span>4</span>'));
  assert.ok(nf.includes('<h1>Te has salido del camino</h1>'));
  const home = nf.match(/<a [^>]*>Volver al inicio<\/a>/)[0];
  assert.equal(attr(home, 'href'), 'index.html');
  const services = nf.match(/<a [^>]*>Ver servicios<\/a>/)[0];
  assert.equal(attr(services, 'href'), 'pages/servicios.html');
  const wa = nf.match(/<a [^>]*>Escríbenos por WhatsApp<\/a>/)[0];
  assert.equal(attr(wa, 'data-wa-kind'), 'producto');
  assert.equal(attr(wa, 'href'), 'https://wa.me/34610167764');
});

test('404: estructura común (topbar, cabecera, pie, WhatsApp, fuentes y hojas)', () => {
  for (const needle of [
    'class="topbar"',
    '<header class="site-header"',
    '<footer class="site-footer"',
    '<a class="wa-float"',
    '<link rel="preload" href="assets/fonts/cormorant-garamond-normal.woff2"',
    '<link rel="preload" href="assets/fonts/dm-sans-normal.woff2"',
  ]) {
    assert.ok(nf.includes(needle), 'falta ' + needle);
  }
  const sheets = [...nf.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(sheets, ['css/fonts.css', 'css/tokens.css', 'css/styles.css']);
});
