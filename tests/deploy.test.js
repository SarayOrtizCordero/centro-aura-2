const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT, read } = require('./helpers');

let dist;
let published = [];

const walk = (dir, base = dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full, base) : [path.relative(base, full).split(path.sep).join('/')];
  });

test.before(() => {
  dist = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-dist-'));
  execFileSync(process.execPath, [path.join(ROOT, 'tools/build.mjs'), dist], { stdio: 'pipe' });
  published = walk(dist);
});

test.after(() => {
  if (dist) fs.rmSync(dist, { recursive: true, force: true });
});

test('vercel.json: build con tools/build.mjs, salida dist y sin framework', () => {
  const cfg = JSON.parse(read('vercel.json'));
  assert.equal(cfg.buildCommand, 'node tools/build.mjs');
  assert.equal(cfg.outputDirectory, 'dist');
  assert.equal(cfg.framework, null);
});

test('lo publicado: las siete páginas, recursos, fuentes e imágenes', () => {
  const required = [
    'index.html', '404.html', 'robots.txt', 'sitemap.xml',
    'css/fonts.css', 'css/tokens.css', 'css/styles.css',
    'js/main.js', 'js/data.js', 'js/lib.js',
    'pages/servicios.html', 'pages/tienda.html', 'pages/contacto.html',
    'pages/aviso-legal.html', 'pages/privacidad.html',
    'assets/icons/loto.svg', 'assets/icons/favicon.svg', 'assets/icons/sprite.svg',
    'assets/fonts/cormorant-garamond-normal.woff2',
    'assets/fonts/cormorant-garamond-italic.woff2',
    'assets/fonts/dm-sans-normal.woff2',
  ];
  const images = JSON.parse(read('tests/fixtures/images.json')).map((i) => `assets/img/${i.name}.webp`);
  for (const rel of [...required, ...images]) assert.ok(published.includes(rel), 'falta en dist: ' + rel);
});

test('lo que no se publica: tests, herramientas, docs, blueprints ni archivos internos', () => {
  const bannedDirs = ['tests/', 'tools/', 'docs/', 'blueprints/', '.claude/', '.git/', 'node_modules/'];
  const bannedFiles = ['README.md', 'package.json', 'vercel.json', '.gitignore', '.gitattributes', 'CLAUDE.md', 'AGENTS.md', '.workspace-applied'];
  for (const rel of published) {
    for (const d of bannedDirs) assert.ok(!rel.startsWith(d), `dist contiene ${rel}`);
    assert.ok(!bannedFiles.includes(rel), `dist contiene ${rel}`);
    assert.ok(!rel.endsWith('CREDITOS.md') && !rel.endsWith('.gitkeep'), `dist contiene ${rel}`);
  }
});

test('recursos completos: todo href/src local y todo url() de fonts.css existen en dist', () => {
  const htmlFiles = published.filter((f) => f.endsWith('.html'));
  assert.equal(htmlFiles.length, 7);
  for (const rel of htmlFiles) {
    const html = fs.readFileSync(path.join(dist, rel), 'utf8').replace(/<script\b(?![^>]*\bsrc=)[\s\S]*?<\/script>/g, '');
    const dir = rel === '404.html' ? '' : path.posix.dirname(rel);
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const ref = m[1];
      if (ref === '/' || /^(https?:|tel:|mailto:|#)/.test(ref)) continue;
      const file = ref.split('#')[0].split('?')[0];
      const resolved = path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, file));
      assert.ok(published.includes(resolved), `${rel}: ${ref} no existe en dist`);
    }
  }
  const fontsCss = fs.readFileSync(path.join(dist, 'css/fonts.css'), 'utf8');
  const urls = [...fontsCss.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const u of urls) {
    const resolved = path.posix.normalize(path.posix.join('css', u));
    assert.ok(published.includes(resolved), `fonts.css: ${u} no existe en dist`);
  }
});
