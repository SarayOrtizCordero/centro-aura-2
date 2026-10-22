// Lista lo que aún falta por rellenar antes de publicar: los datos legales marcados con
// class="pendiente" y el dominio provisional (deja de contar cuando se ejecuta `npm run domain`).
// Uso: npm run pendientes
// Salida: 0 no queda nada · 1 queda algo pendiente · 70 error inesperado (nunca coincide con el 1 documentado).
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fail = (error) => {
  console.error('Error inesperado: ' + (error && error.message ? error.message : error));
  process.exit(70);
};
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROVISIONAL = ['https://TU-DOMINIO.es', 'https://centro-aura-2.vercel.app'];
const files = ['index.html', '404.html', 'robots.txt', 'sitemap.xml'];
for (const f of await readdir(path.join(ROOT, 'pages'))) {
  if (f.endsWith('.html')) files.push(path.join('pages', f));
}

let found = 0;
for (const rel of files) {
  const text = await readFile(path.join(ROOT, rel), 'utf8');
  const marks = [...text.matchAll(/<mark class="pendiente">([^<]*)<\/mark>/g)].map((m) => m[1]);
  const domains = PROVISIONAL.reduce((n, d) => n + text.split(d).length - 1, 0);
  if (marks.length || domains) console.log(`\n${rel}`);
  marks.forEach((m) => console.log(`  · ${m}`));
  if (domains) console.log(`  · dominio provisional (${domains} veces): npm run domain -- https://tudominio.es`);
  found += marks.length + (domains ? 1 : 0);
}
console.log(found ? `\nPendiente: ${found} cosas.` : 'No queda nada pendiente.');
process.exitCode = found ? 1 : 0;
