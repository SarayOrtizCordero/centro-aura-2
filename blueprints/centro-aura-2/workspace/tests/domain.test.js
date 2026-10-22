const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT } = require('./helpers.js');

const TOOL = path.join(ROOT, 'tools', 'set-domain.mjs');
const PROVISIONAL = 'https://centro-aura-2.vercel.app';

function site(origin) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-domain-'));
  fs.mkdirSync(path.join(dir, 'pages'));
  const page = (p) => `<link rel="canonical" href="${origin}${p}">\n<meta property="og:image" content="${origin}/assets/img/hero-salon.webp">\n`;
  fs.writeFileSync(path.join(dir, 'index.html'), page('/'));
  fs.writeFileSync(path.join(dir, 'pages', 'tienda.html'), page('/pages/tienda.html'));
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), `<loc>${origin}/</loc>\n<loc>${origin}/pages/tienda.html</loc>\n`);
  fs.writeFileSync(path.join(dir, 'robots.txt'), `Sitemap: ${origin}/sitemap.xml\n`);
  fs.writeFileSync(path.join(dir, '404.html'), '<h1>404</h1>\n');
  return dir;
}

const run = (dir, domain) => spawnSync(process.execPath, [TOOL, domain], {
  env: { ...process.env, AURA_ROOT: dir }, encoding: 'utf8'
});
const all = (dir) => ['index.html', 'pages/tienda.html', 'sitemap.xml', 'robots.txt']
  .map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');

test('set-domain: del dominio provisional de Vercel al propio, y se puede repetir', () => {
  const dir = site(PROVISIONAL);
  try {
    assert.equal(run(dir, 'https://www.centroaura.es').status, 0);
    let text = all(dir);
    assert.ok(!text.includes('vercel.app'), 'quedó el dominio provisional');
    assert.equal((text.match(/https:\/\/www\.centroaura\.es/g) || []).length, 7);

    // segunda vez: el dominio de partida ya es el anterior, y aun así cambia
    assert.equal(run(dir, 'https://centroaura.com').status, 0);
    text = all(dir);
    assert.ok(!text.includes('centroaura.es'), 'quedó el dominio anterior');
    assert.equal((text.match(/https:\/\/centroaura\.com/g) || []).length, 7);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('set-domain: no cambia nada si ya usa ese dominio y rechaza dominios inválidos con código 1', () => {
  const dir = site(PROVISIONAL);
  try {
    const before = all(dir);
    const same = run(dir, PROVISIONAL);
    assert.equal(same.status, 0);
    assert.match(same.stdout, /nada que cambiar/);
    assert.equal(all(dir), before);

    for (const bad of ['centroaura.es', 'http://centroaura.es', 'https://centroaura.es/ruta', '']) {
      assert.equal(run(dir, bad).status, 1, `"${bad}" debe salir con código 1 (uso incorrecto)`);
    }
    assert.equal(all(dir), before);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
