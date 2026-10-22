// Prepara la carpeta que se publica: copia SOLO los archivos de la web (lista blanca).
// Lo que no está aquí (tests, tools, docs, blueprints, README, package.json…) no llega al servidor.
// Uso: npm run build            → dist/
//      node tools/build.mjs DIR → DIR/
import { cp, mkdir, rm, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));

// Lo que forma la web. Para publicar algo nuevo, añádelo aquí.
const PUBLIC = [
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'pages',
  'css',
  'js',
  'assets'
];
// Dentro de lo publicado, esto no se sirve (notas internas, marcadores y archivos del sistema).
const SKIP = new Set(['CREDITOS.md', '.gitkeep', '.DS_Store', 'Thumbs.db']);

if (OUT === ROOT || ROOT.startsWith(OUT + path.sep)) {
  console.error('La carpeta de salida no puede ser la raíz del proyecto ni una carpeta que la contenga.');
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const entry of PUBLIC) {
  const from = path.join(ROOT, entry);
  try {
    await stat(from);
  } catch {
    console.error(`Falta ${entry}: la web no está completa.`);
    process.exit(1);
  }
  await cp(from, path.join(OUT, entry), {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src))
  });
}

async function count(dir) {
  let n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await count(path.join(dir, e.name)) : 1;
  }
  return n;
}
const files = await count(OUT);
console.log(`Listo: ${files} archivos en ${path.relative(ROOT, OUT) || '.'}`);
