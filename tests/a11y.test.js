const test = require('node:test');
const assert = require('node:assert/strict');
const { read, pageFiles } = require('./helpers');

const files = [...pageFiles(), '404.html'];
const css = read('css/styles.css').replace(/\/\*[\s\S]*?\*\//g, '');
const main = read('js/main.js');

const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const body = (html) => html.slice(html.indexOf('<body'));

// Cuerpos de todas las reglas cuyo selector termina en `selector`, a cualquier nivel.
const rulesOf = (selector) => {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...css.matchAll(new RegExp('(?:^|[}\\s,])' + esc + '\\s*\\{([^}]*)\\}', 'g'))].map((m) => m[1]);
};

for (const rel of files) {
  const html = read(rel);
  const doc = body(html);

  test(`${rel}: puntos de referencia y navegación etiquetada`, () => {
    assert.equal((doc.match(/<main\b/g) || []).length, 1, 'un main');
    assert.equal((doc.match(/<header\b/g) || []).length, 1, 'un header');
    assert.equal((doc.match(/<footer\b/g) || []).length, 1, 'un footer');
    for (const nav of doc.match(/<nav\b[^>]*>/g) || []) assert.ok(attr(nav, 'aria-label'), 'nav sin aria-label: ' + nav);
  });

  test(`${rel}: enlaces con nombre accesible, sin href="#" y con noopener`, () => {
    for (const m of doc.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const tag = '<a' + m[1] + '>';
      const inner = m[2];
      const text = inner.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
      const img = inner.match(/<img\b[^>]*>/);
      const named = text.length > 0 || attr(tag, 'aria-label') || (img && (attr(img[0], 'alt') || '').trim());
      assert.ok(named, 'enlace sin nombre accesible: ' + tag);
      assert.notEqual(attr(tag, 'href'), '#', 'href="#": ' + tag);
      if (attr(tag, 'target') === '_blank') assert.match(attr(tag, 'rel') || '', /\bnoopener\b/, tag);
    }
  });

  test(`${rel}: botones, SVG, tabindex e iframes`, () => {
    for (const b of doc.match(/<button\b[^>]*>/g) || []) assert.ok(attr(b, 'type'), 'button sin type: ' + b);
    for (const s of doc.match(/<svg\b[^>]*>/g) || []) assert.equal(attr(s, 'aria-hidden'), 'true', s);
    for (const m of doc.matchAll(/\stabindex="(-?\d+)"/g)) assert.ok(Number(m[1]) <= 0, 'tabindex positivo');
    assert.ok(!doc.includes('<iframe'));
  });

  test(`${rel}: todo campo con id tiene su label`, () => {
    for (const m of doc.matchAll(/<(?:input|select|textarea)\b[^>]*\sid="([^"]+)"[^>]*>/g)) {
      assert.ok(doc.includes(`<label for="${m[1]}"`), 'falta label para #' + m[1]);
    }
  });
}

test('sin parches de accesibilidad de terceros en HTML, CSS ni JS', () => {
  const vendors = /accessibe|userway|audioeye|equalweb/i;
  const sources = [...files.map((f) => [f, read(f)]), ['css/styles.css', read('css/styles.css')], ['js/main.js', main]];
  for (const [name, text] of sources) assert.ok(!vendors.test(text), 'proveedor de overlay en ' + name);
});

test('main.js respeta prefers-reduced-motion', () => {
  assert.ok(main.includes('prefers-reduced-motion: reduce'));
  assert.ok(main.includes('matchMedia'));
});

test('css: foco visible, objetivos táctiles y scroll-padding', () => {
  assert.ok(/:focus-visible\s*\{[^}]*outline:\s*2px solid/.test(css));
  assert.ok(rulesOf('.btn').some((b) => /min-height:\s*48px/.test(b)), '.btn min-height 48px');
  assert.ok(rulesOf('.tab').some((b) => /min-height:\s*44px/.test(b)), '.tab min-height 44px');
  assert.ok(rulesOf('.link-arrow').some((b) => /min-height:\s*44px/.test(b)), '.link-arrow min-height 44px');
  assert.ok(
    rulesOf('.js .nav-toggle').some((b) => /width:\s*48px/.test(b) && /height:\s*48px/.test(b)),
    '.js .nav-toggle 48x48'
  );
  assert.ok(rulesOf('html').some((b) => /scroll-padding-top/.test(b)));
});

test('css: movimiento reducido y aparición condicionada a .reveal-ready', () => {
  const block = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\n\}/);
  assert.ok(block, 'falta el bloque prefers-reduced-motion');
  assert.match(block[0], /transition-duration:\s*0\.01ms/);
  assert.match(block[0], /\.reveal\s*\{[^}]*opacity:\s*1/);
  for (const m of css.matchAll(/(^|[}\s,])([^{}]*\.reveal\b[^{}]*)\{([^}]*)\}/g)) {
    const selector = m[2].trim();
    if (/opacity:\s*0\b/.test(m[3])) assert.ok(/\.reveal-ready/.test(selector), '.reveal oculto sin .reveal-ready: ' + selector);
  }
});

test('css: sin overflow-x: hidden en html ni body', () => {
  for (const sel of ['html', 'body']) {
    for (const b of rulesOf(sel)) assert.ok(!/overflow-x:\s*hidden/.test(b), `overflow-x: hidden en ${sel}`);
  }
});

test('css: guardia de reflow, ningún width/min-width en px > 320 fuera de @media (min-width)', () => {
  const stack = [];
  const offenders = [];
  let buf = '';
  for (const ch of css) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      const inMinWidth = stack.some((p) => /^@media[^{]*\(min-width/.test(p));
      const top = stack[stack.length - 1] || '';
      if (!top.startsWith('@') && !inMinWidth) {
        for (const m of buf.matchAll(/(?:^|[;\s])(?:min-)?width\s*:\s*(\d+(?:\.\d+)?)px/g)) {
          if (Number(m[1]) > 320) offenders.push(`${top} { width: ${m[1]}px }`);
        }
      }
      stack.pop();
      buf = '';
    } else {
      buf += ch;
    }
  }
  assert.deepEqual(offenders, []);
});
