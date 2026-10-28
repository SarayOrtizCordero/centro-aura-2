const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, read, webpSize } = require('./helpers.js');
const images = require('./fixtures/images.json');

// Los iconos del sprite: el HTML los usa con <use href="…/sprite.svg#i-<nombre>">
const ICONS = [
  'spa', 'barro', 'alisado', 'tijeras', 'tricologia', 'regalo', 'reloj', 'pin',
  'telefono', 'whatsapp', 'instagram', 'flecha', 'check', 'menu', 'cerrar', 'lista', 'cuadricula', 'filtro'
];

for (const img of images) {
  test(`assets/img/${img.name}.webp es WebP de ${img.width}×${img.height}`, () => {
    const file = path.join(ROOT, 'assets', 'img', `${img.name}.webp`);
    assert.ok(fs.existsSync(file), 'falta la imagen: viene en workspace/assets/img y no la crea ningún paso');
    const buf = fs.readFileSync(file);
    assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
    assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
    assert.deepEqual(webpSize(buf), [img.width, img.height]);
  });
}

test('créditos de las fotos: cada imagen está citada', () => {
  const credits = read('assets/img/CREDITOS.md');
  for (const img of images) assert.ok(credits.includes(`${img.name}.webp`), img.name);
});

test('iconos SVG de marca', () => {
  assert.match(read('assets/icons/loto.svg'), /<svg[^>]*viewBox="0 0 64 40"/);
  assert.match(read('assets/icons/favicon.svg'), /<svg[^>]*viewBox="0 0 64 64"/);
});

test('sprite de iconos: un <symbol> por icono, un solo juego, trazo con currentColor', () => {
  const sprite = read('assets/icons/sprite.svg');
  for (const name of ICONS) {
    assert.match(sprite, new RegExp(`<symbol id="i-${name}" viewBox="0 0 24 24"`), `falta i-${name}`);
  }
  const ids = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...ids].sort(), ICONS.map((n) => `i-${n}`).sort(), 'símbolos de más o de menos');
  assert.doesNotMatch(sprite, /#[0-9a-fA-F]{3,8}\b/, 'los colores vienen de currentColor, nunca de un hex');
  assert.match(sprite, /stroke="currentColor"/);
  assert.match(sprite, /stroke-width="1\.5"/);
});
