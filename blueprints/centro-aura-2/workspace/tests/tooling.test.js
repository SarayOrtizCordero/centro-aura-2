const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, read } = require('./helpers.js');

const pkg = JSON.parse(read('package.json'));

test('node: la versión que ejecuta los tests es la 24 o superior', () => {
  assert.ok(Number(process.versions.node.split('.')[0]) >= 24, `Node ${process.versions.node}`);
});

test('package.json: engines >=24, cero dependencias y los seis scripts', () => {
  assert.equal(pkg.engines.node, '>=24');
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.devDependencies, undefined);
  assert.deepEqual(Object.keys(pkg.scripts).sort(), ['build', 'domain', 'fonts', 'pendientes', 'serve', 'test']);
});

test('package.json: los tests se buscan solo en tests/ (nunca en blueprints/)', () => {
  assert.equal(pkg.scripts.test, 'node --test "tests/**/*.test.js"');
});

test('vercel.json: construye con tools/build.mjs y publica dist', () => {
  const cfg = JSON.parse(read('vercel.json'));
  assert.equal(cfg.buildCommand, 'node tools/build.mjs');
  assert.equal(cfg.outputDirectory, 'dist');
  assert.equal(cfg.framework, null);
});

test('.gitignore: ignora lo local y NO ignora nada de lo que el proyecto llama commiteado', () => {
  const lines = read('.gitignore').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const needed of ['node_modules/', 'dist/', '.playwright-mcp/', '.claude/settings.local.json', '.workspace-applied']) {
    assert.ok(lines.includes(needed), `falta ${needed}`);
  }
  for (const forbidden of ['.claude/', 'blueprints/', 'assets/', 'css/', '*.woff2', '*.webp', 'css/fonts.css']) {
    assert.ok(!lines.includes(forbidden), `${forbidden} no puede estar ignorado`);
  }
});

test('cada archivo de tests ejecuta al menos un test (un archivo vacío no puede pasar)', () => {
  const dir = path.join(ROOT, 'tests');
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.test.js'))) {
    assert.match(fs.readFileSync(path.join(dir, f), 'utf8'), /\btest\(/, `${f} no contiene ninguna llamada a test(`);
  }
});

test('las herramientas del proyecto existen', () => {
  for (const f of ['build', 'serve', 'smoke', 'fetch-fonts', 'set-domain', 'pendientes']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'tools', `${f}.mjs`)), `tools/${f}.mjs`);
  }
});
