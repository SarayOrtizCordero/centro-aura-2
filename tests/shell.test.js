const test = require('node:test');
const assert = require('node:assert/strict');
const { read } = require('./helpers');
const data = require('../js/data.js');

const css = read('css/styles.css');
const main = read('js/main.js');

test('topbar: el texto de respaldo del horario sale de data.js', () => {
  const html = read('index.html');
  const m = html.match(/<span data-hours-summary>([^<]*)<\/span>/);
  assert.ok(m, 'falta [data-hours-summary]');
  const expected = 'L–V ' + data.hours[0].slots.map((s) => s.replace(/ – /g, '–')).join(' · ');
  assert.equal(m[1], expected);
});

test('main.js: contiene las cadenas del contrato y no usa max-width', () => {
  const strings = [
    "'[data-hours-summary]'",
    'closest(\'a[href^="tel:"]\')',
    'aria-expanded',
    "'Escape'",
    '.inert',
    'IntersectionObserver',
    'prefers-reduced-motion: reduce',
    'data-map-load',
    'form-summary',
    'aria-controls',
    '(min-width: 900px)',
  ];
  for (const s of strings) assert.ok(main.includes(s), 'falta ' + s);
  assert.ok(!main.includes('max-width'));
});

test('styles.css: reglas de la estructura común', () => {
  assert.ok(css.includes('scroll-padding-top: calc(var(--header-h) + 16px)'));
  assert.match(css, /\.site-header\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0/);
  assert.match(css, /\.js \.site-nav\s*\{[^}]*position:\s*absolute;[^}]*visibility:\s*hidden/);
  assert.match(css, /body\.menu-open\s*\{[^}]*overflow:\s*hidden/);
  assert.match(css, /body\.menu-open \.site-nav\s*\{[^}]*visibility:\s*visible/);
});

test('styles.css: en @media (min-width: 900px) se ocultan .nav-toggle y .wa-float', () => {
  const idx = css.split('@media (min-width: 900px)').slice(1);
  assert.ok(idx.length > 0);
  const body = idx.join('\n');
  assert.match(body, /\.js \.nav-toggle\s*\{\s*display:\s*none;\s*\}/);
  assert.match(body, /\.wa-float\s*\{\s*display:\s*none;\s*\}/);
});

test('menú móvil: Servicios y Tienda son pestañas plegables y el panel ocupa todo el ancho', () => {
  assert.match(css, /\.js \.site-nav__list \.has-sub > \.subnav\s*\{[^}]*display:\s*none/);
  assert.match(css, /\.js \.site-nav__list \.has-sub\.is-open > \.subnav\s*\{\s*display:\s*block/);
  assert.match(css, /\.js \.site-nav\s*\{[^}]*left:\s*calc\(-1 \* var\(--s-4\)\)/);
  assert.match(css, /\.js \.sub-toggle\s*\{[^}]*width:\s*56px/);
});
