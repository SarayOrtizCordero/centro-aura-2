const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, read } = require('./helpers');

const tokens = read('css/tokens.css');
const styles = read('css/styles.css');
const fonts = read('css/fonts.css');
const allCss = { 'tokens.css': tokens, 'styles.css': styles, 'fonts.css': fonts };

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/;

const DECLARED = {};
for (const m of tokens.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) DECLARED[m[1]] = m[2].trim();

function resolve(name, seen = new Set()) {
  assert.ok(!seen.has(name), 'ciclo en ' + name);
  seen.add(name);
  const v = DECLARED[name];
  assert.ok(v !== undefined, name + ' no está definido en tokens.css');
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(ref[1], seen) : v;
}

const EXPECTED = {
  '--c-bg': '#FFFDF7',
  '--c-bg-alt': '#F6F0E4',
  '--c-line': '#E9DDC8',
  '--c-muted': '#B2A38F',
  '--c-gold': '#D2C244',
  '--c-text': '#4A4238',
  '--c-text-soft': '#6B6153',
  '--c-border': '#8C7F6D',
  '--c-error': '#9B3D2E',
  '--c-anchor': '#3F372D',
  '--c-on-anchor': '#FFFDF7',
  '--c-on-anchor-soft': '#E9DDC8',
  '--c-clay': '#9A5B43',
  '--c-clay-soft': '#EAD3C6',
};

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = (fg, bg, alpha) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
const rgbOf = (name) => hexToRgb(resolve(name));
const triplet = (name) => DECLARED[name].split(/\s+/).map(Number);

function mediaBlocks(css) {
  const out = [];
  for (const m of css.matchAll(/@media\s*([^{]+)\{/g)) out.push(m[1].trim());
  return out;
}

test('tokens: cada token semántico resuelve a su hex', () => {
  for (const [name, hex] of Object.entries(EXPECTED)) {
    assert.equal(resolve(name).toUpperCase(), hex, name);
  }
});

test('tokens: los velos repiten --c-anchor y --c-bg', () => {
  assert.deepEqual(triplet('--veil-dark-rgb'), rgbOf('--c-anchor'));
  assert.deepEqual(triplet('--veil-light-rgb'), rgbOf('--c-bg'));
});

test('contraste WCAG: pares de texto e interfaz', () => {
  const pairs = [
    ['--c-text', '--c-bg', 4.5],
    ['--c-text', '--c-bg-alt', 4.5],
    ['--c-text-soft', '--c-bg', 4.5],
    ['--c-text-soft', '--c-bg-alt', 4.5],
    ['--c-clay', '--c-bg', 4.5],
    ['--c-clay', '--c-bg-alt', 4.5],
    ['--c-error', '--c-bg', 4.5],
    ['--c-error', '--c-bg-alt', 4.5],
    ['--c-on-anchor', '--c-anchor', 4.5],
    ['--c-on-anchor-soft', '--c-anchor', 4.5],
    ['--c-anchor', '--c-clay-soft', 4.5],
    ['--c-text', '--c-clay-soft', 4.5],
    ['--c-border', '--c-bg', 3],
    ['--c-border', '--c-bg-alt', 3],
    ['--c-anchor', '--c-bg', 3],
  ];
  for (const [fg, bg, min] of pairs) {
    const r = ratio(rgbOf(fg), rgbOf(bg));
    assert.ok(r >= min, `${fg} sobre ${bg}: ${r.toFixed(2)} < ${min}`);
  }
});

test('contraste WCAG: velos en el peor caso', () => {
  const darkVeil = blend(triplet('--veil-dark-rgb'), [255, 255, 255], Number(DECLARED['--veil-dark-alpha']));
  const lightVeil = blend(triplet('--veil-light-rgb'), [0, 0, 0], Number(DECLARED['--veil-light-alpha']));
  const cases = [
    ['--c-on-anchor sobre velo oscuro', rgbOf('--c-on-anchor'), darkVeil, 4.5],
    ['--c-on-anchor-soft sobre velo oscuro', rgbOf('--c-on-anchor-soft'), darkVeil, 4.5],
    ['--c-text sobre velo claro', rgbOf('--c-text'), lightVeil, 4.5],
  ];
  for (const [label, fg, bg, min] of cases) {
    const r = ratio(fg, bg);
    assert.ok(r >= min, `${label}: ${r.toFixed(2)} < ${min}`);
  }
});

test('mobile-first: sin max-width en media queries y solo breakpoints permitidos', () => {
  const queries = mediaBlocks(styles);
  assert.ok(queries.length > 0);
  for (const q of queries) {
    assert.ok(!/max-width/.test(q), 'max-width en @media ' + q);
    for (const m of q.matchAll(/min-width:\s*(\d+)px/g)) {
      assert.ok([600, 760, 900, 1200].includes(Number(m[1])), 'min-width no permitido: ' + m[1]);
    }
  }
});

test('sin hex fuera de tokens.css', () => {
  assert.ok(!HEX.test(styles), 'hex en styles.css');
  assert.ok(!HEX.test(fonts), 'hex en fonts.css');
  assert.ok(HEX.test(tokens), 'tokens.css debe contener los hex');
});

test('--c-muted y --c-gold nunca son color de texto', () => {
  assert.ok(!/(^|[;{\s])color\s*:\s*var\(--c-(muted|gold)\)/.test(styles));
});

test('tipografías: DM Sans + Cormorant, sin Jost, font-display swap', () => {
  assert.ok(DECLARED['--font-body'].startsWith("'DM Sans'"));
  assert.ok(DECLARED['--font-display'].startsWith("'Cormorant Garamond'"));
  for (const [file, css] of Object.entries(allCss)) {
    assert.ok(!/Jost/i.test(css), 'Jost en ' + file);
  }
  const faces = fonts.match(/@font-face\s*\{[^}]*\}/g) || [];
  assert.ok(faces.length >= 3, 'faltan @font-face');
  for (const face of faces) {
    assert.match(face, /font-display:\s*swap/);
    const url = face.match(/url\(\s*['"]?\.\.\/assets\/fonts\/([^'")]+)['"]?\s*\)/);
    assert.ok(url, 'url de fuente no apunta a ../assets/fonts/');
    assert.ok(fs.existsSync(path.join(ROOT, 'assets/fonts', url[1])), 'no existe ' + url[1]);
  }
  const has = (family, style) =>
    faces.some((f) => f.includes(`'${family}'`) && new RegExp(`font-style:\\s*${style}`).test(f));
  assert.ok(has('Cormorant Garamond', 'normal'));
  assert.ok(has('Cormorant Garamond', 'italic'));
  assert.ok(has('DM Sans', 'normal'));
});

test('movimiento y foco: reduced-motion, :focus-visible 2px, [hidden]', () => {
  assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(/:focus-visible\s*\{[^}]*outline:\s*2px solid/.test(styles));
  assert.ok(/\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/.test(styles));
});
