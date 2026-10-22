// Cambia el dominio del sitio en canonical, og:url, og:image, JSON-LD, sitemap.xml y robots.txt.
// Sustituye el dominio que haya ahora (el provisional TU-DOMINIO.es o el último que se puso),
// así que se puede repetir cuando cambie la URL.
// Uso: npm run domain -- https://www.centroaura.es
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.AURA_ROOT
  ? path.resolve(process.env.AURA_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLACEHOLDER = 'https://TU-DOMINIO.es';
const VALID = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i;

const domain = (process.argv[2] || '').replace(/\/+$/, '');
if (!VALID.test(domain)) {
  console.error('Uso: npm run domain -- https://www.tudominio.es   (con https:// y sin barra final ni ruta)');
  process.exit(1);
}

const files = ['index.html', '404.html', 'robots.txt', 'sitemap.xml'];
try {
  for (const f of await readdir(path.join(ROOT, 'pages'))) {
    if (f.endsWith('.html')) files.push(path.join('pages', f));
  }
} catch {
  // sin carpeta pages: solo se procesan los archivos de la raíz
}

// El dominio actual es el origen del canonical de la portada.
let current = PLACEHOLDER;
try {
  const home = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  const m = home.match(/<link rel="canonical" href="(https:\/\/[^"/]+)/);
  if (m) current = m[1];
} catch {
  console.error('No encuentro index.html en ' + ROOT);
  process.exit(1);
}

if (current.toLowerCase() === domain.toLowerCase()) {
  console.log(`El sitio ya usa ${domain}: nada que cambiar.`);
  process.exit(0);
}

// Se sustituye el dominio actual y, por si quedara alguno suelto, el provisional.
const olds = [...new Set([current, PLACEHOLDER])];
let total = 0;
for (const rel of files) {
  const file = path.join(ROOT, rel);
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    continue;
  }
  let count = 0;
  for (const old of olds) {
    const parts = text.split(old);
    count += parts.length - 1;
    text = parts.join(domain);
  }
  if (!count) continue;
  await writeFile(file, text);
  total += count;
  console.log(`${rel}: ${count}`);
}
console.log(total
  ? `Listo: ${total} sustituciones, de ${current} a ${domain}`
  : 'No había ningún dominio que sustituir.');
