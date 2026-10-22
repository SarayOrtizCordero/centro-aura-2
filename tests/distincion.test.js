const test = require('node:test');
const assert = require('node:assert/strict');
const { read, pageFiles } = require('./helpers');

const htmlFiles = [...pageFiles(), '404.html'];
const home = read('index.html');
const styles = read('css/styles.css');
const tokens = read('css/tokens.css');
const fonts = read('css/fonts.css');

const classTokens = (html) => {
  const tokens = new Set();
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) m[1].split(/\s+/).filter(Boolean).forEach((t) => tokens.add(t));
  return tokens;
};

test('la portada usa los componentes propios de la demo B', () => {
  const used = classTokens(home);
  for (const cls of ['topbar', 'hero__card', 'pillars', 'icon-row', 'service-cards', 'spotlight', 'mosaic', 'gift-banner', 'visit']) {
    assert.ok(used.has(cls), 'falta la clase ' + cls);
  }
});

test('el layout de la demo A no aparece en ninguna página ni en styles.css', () => {
  const forbidden = ['feature-grid', 'feature-card', 'shop-grid', 'shop-tile', 'split'];
  for (const rel of htmlFiles) {
    const used = classTokens(read(rel));
    for (const cls of forbidden) assert.ok(!used.has(cls), `${rel} usa la clase ${cls}`);
  }
  for (const cls of forbidden) {
    assert.ok(!new RegExp('\\.' + cls + '(?![A-Za-z0-9_])').test(styles), `styles.css contiene el selector .${cls}`);
  }
});

test('tipografía distinta: DM Sans en el cuerpo y sin Jost', () => {
  assert.match(tokens, /--font-body:\s*'DM Sans'/);
  assert.ok(fonts.includes('DM Sans'));
  for (const [name, css] of Object.entries({ 'tokens.css': tokens, 'styles.css': styles, 'fonts.css': fonts })) {
    assert.ok(!css.includes('Jost'), 'Jost en ' + name);
  }
});

test('sin prueba social inventada', () => {
  const pattern = /rese[ñn]a|testimon|★|opini[oó]n(es)? de|clientas? feliz|alumnas?|\b\d+(?:[.,]\d+)?\s?[kK]\b/i;
  for (const rel of htmlFiles) {
    const hit = read(rel).match(pattern);
    assert.ok(!hit, `${rel}: prueba social inventada ("${hit && hit[0]}")`);
  }
});

test('sin hechos inventados (años, premios, certificaciones)', () => {
  const pattern = /\b\d+\s+años\b|años de experiencia|premiad|galardon|certificad[oa] por/i;
  for (const rel of htmlFiles) {
    const hit = read(rel).match(pattern);
    assert.ok(!hit, `${rel}: hecho inventado ("${hit && hit[0]}")`);
  }
});
