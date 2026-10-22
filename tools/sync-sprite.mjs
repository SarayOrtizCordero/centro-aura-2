// Incrusta el sprite de iconos (assets/icons/sprite.svg) dentro de cada página HTML.
// Por qué: con <use href="…/sprite.svg#i-x"> el navegador no pinta los iconos si la página
// se abre por file:// (doble clic) y los botones del menú y de WhatsApp parecen vacíos.
// Con el sprite incrustado y <use href="#i-x"> los iconos salen siempre.
// Se puede repetir: sustituye el sprite incrustado por el actual.
// Uso: node tools/sync-sprite.mjs        (tras cambiar assets/icons/sprite.svg o añadir una página)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sprite = await readFile(path.join(ROOT, 'assets/icons/sprite.svg'), 'utf8');
const symbols = [...sprite.matchAll(/<symbol\b[\s\S]*?<\/symbol>/g)].map((m) => m[0]);
if (!symbols.length) {
  console.error('assets/icons/sprite.svg no tiene ningún <symbol>.');
  process.exit(1);
}
const inline =
  '<svg class="sprite" aria-hidden="true" focusable="false">\n' +
  symbols.map((s) => '    ' + s.replace(/\n\s*/g, ' ')).join('\n') +
  '\n  </svg>';

const files = ['index.html', '404.html'];
for (const f of await readdir(path.join(ROOT, 'pages'))) {
  if (f.endsWith('.html')) files.push(path.join('pages', f));
}

let changed = 0;
for (const rel of files) {
  const file = path.join(ROOT, rel);
  const before = await readFile(file, 'utf8');
  let html = before.replace(/href="(?:\.\.\/)?assets\/icons\/sprite\.svg#/g, 'href="#');
  html = html.replace(/\n  <svg class="sprite"[\s\S]*?<\/svg>/, '');
  html = html.replace('<body>', `<body>\n  ${inline}`);
  if (html !== before) {
    await writeFile(file, html);
    changed++;
    console.log(rel);
  }
}
console.log(changed ? `Listo: sprite incrustado en ${changed} páginas.` : 'Nada que cambiar: el sprite ya estaba al día.');
