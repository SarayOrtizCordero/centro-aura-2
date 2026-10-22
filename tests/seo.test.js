const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT, read, pageFiles } = require('./helpers');

const ORIGIN_OK = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i;
const pages = pageFiles();
const meta = (html, re) => (html.match(re) || [])[1];
const originOf = (url) => new URL(url).origin;
const jsonLd = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1]) : null;
};
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

test('páginas: las seis esperadas, y todo enlace a pages/*.html existe', () => {
  assert.deepEqual([...pages].sort(), [
    'index.html',
    'pages/aviso-legal.html',
    'pages/contacto.html',
    'pages/privacidad.html',
    'pages/servicios.html',
    'pages/tienda.html',
  ]);
  for (const rel of [...pages, '404.html']) {
    const dir = path.posix.dirname(rel);
    for (const m of read(rel).matchAll(/\shref="([^"#]+\.html)(?:#[^"]*)?"/g)) {
      if (/^https?:/.test(m[1])) continue;
      const target = rel === '404.html' ? m[1] : path.posix.normalize(path.posix.join(dir, m[1]));
      assert.ok(fs.existsSync(path.join(ROOT, target)), `${rel} enlaza a ${m[1]}, que no existe`);
    }
  }
});

test('sitemap: URLs absolutas de un solo origen, las de pageFiles() y sin 404', () => {
  const urls = locs(read('sitemap.xml'));
  assert.ok(urls.length > 0);
  const origins = new Set(urls.map(originOf));
  assert.equal(origins.size, 1, 'más de un origen en el sitemap');
  for (const u of urls) assert.ok(u.startsWith('https://'), u);
  assert.ok(!urls.some((u) => u.includes('404')));
  const paths = urls.map((u) => new URL(u).pathname).sort();
  const expected = pages.map((p) => (p === 'index.html' ? '/' : '/' + p)).sort();
  assert.deepEqual(paths, expected);
});

test('un solo dominio en canonical, og:url, og:image, JSON-LD, sitemap y robots', () => {
  const origin = originOf(locs(read('sitemap.xml'))[0]);
  assert.match(origin, ORIGIN_OK);
  assert.ok(!origin.includes('TU-DOMINIO'));
  for (const rel of pages) {
    const html = read(rel);
    for (const re of [
      /<link rel="canonical" href="([^"]+)"/,
      /<meta property="og:url" content="([^"]+)"/,
      /<meta property="og:image" content="([^"]+)"/,
    ]) {
      const url = meta(html, re);
      assert.ok(url, `${rel}: falta ${re}`);
      assert.equal(originOf(url), origin, `${rel}: ${url}`);
    }
  }
  const ld = jsonLd(read('index.html'));
  assert.equal(originOf(ld.url), origin);
  assert.equal(originOf(ld.image), origin);
  const sitemapLine = read('robots.txt').match(/^Sitemap:\s*(\S+)/im);
  assert.ok(sitemapLine, 'robots.txt sin línea Sitemap');
  assert.equal(originOf(sitemapLine[1]), origin);
});

test('unicidad: title, meta description y og:title distintos; og:description presente', () => {
  const seen = { title: [], description: [], ogTitle: [] };
  for (const rel of pages) {
    const html = read(rel);
    seen.title.push(meta(html, /<title>([^<]*)<\/title>/));
    seen.description.push(meta(html, /<meta name="description" content="([^"]*)"/));
    seen.ogTitle.push(meta(html, /<meta property="og:title" content="([^"]*)"/));
    assert.ok(meta(html, /<meta property="og:description" content="([^"]+)"/), `${rel}: falta og:description`);
  }
  for (const [kind, values] of Object.entries(seen)) {
    assert.ok(values.every(Boolean), kind + ' vacío');
    assert.equal(new Set(values).size, values.length, `${kind} repetido: ${values.join(' | ')}`);
  }
});

test('robots.txt y datos estructurados', () => {
  const robots = read('robots.txt');
  assert.match(robots, /^User-agent:\s*\*/m);
  assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'Disallow: / bloquearía todo el sitio');
  const origin = originOf(locs(read('sitemap.xml'))[0]);
  assert.ok(robots.toLowerCase().includes(`sitemap: ${origin}/sitemap.xml`.toLowerCase()));
  for (const rel of pages) {
    assert.equal(read(rel).includes('application/ld+json'), rel === 'index.html', rel);
  }
});

test('cambio de dominio real: dos cambios encadenados sobre una copia temporal', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-seo-'));
  try {
    const files = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', ...pages.filter((p) => p !== 'index.html')];
    for (const rel of files) {
      fs.mkdirSync(path.dirname(path.join(tmp, rel)), { recursive: true });
      fs.copyFileSync(path.join(ROOT, rel), path.join(tmp, rel));
    }
    const readTmp = (rel) => fs.readFileSync(path.join(tmp, rel), 'utf8');
    let previous = originOf(locs(readTmp('sitemap.xml'))[0]);

    for (const next of ['https://www.centroaura.es', 'https://centroaura.com']) {
      const run = spawnSync(process.execPath, [path.join(ROOT, 'tools/set-domain.mjs'), next], {
        env: { ...process.env, AURA_ROOT: tmp },
        encoding: 'utf8',
      });
      assert.equal(run.status, 0, run.stderr || run.stdout);
      for (const rel of files) {
        assert.ok(!readTmp(rel).includes(previous), `${rel} conserva ${previous}`);
      }
      for (const rel of pages) {
        const html = readTmp(rel);
        assert.equal(originOf(meta(html, /<link rel="canonical" href="([^"]+)"/)), next, rel);
        assert.equal(originOf(meta(html, /<meta property="og:url" content="([^"]+)"/)), next, rel);
        assert.equal(originOf(meta(html, /<meta property="og:image" content="([^"]+)"/)), next, rel);
      }
      const ld = jsonLd(readTmp('index.html'));
      assert.equal(originOf(ld.url), next);
      assert.equal(originOf(ld.image), next);
      assert.ok(locs(readTmp('sitemap.xml')).every((u) => originOf(u) === next));
      assert.ok(readTmp('robots.txt').includes(`Sitemap: ${next}/sitemap.xml`));
      previous = next;
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
