// Descarga las tipografías de Google Fonts a assets/fonts/ y genera css/fonts.css,
// para servirlas desde el propio dominio (sin enviar la IP del visitante a Google).
// Solo se baja el subconjunto "latin": cubre el español completo (acentos, ñ, €).
// Requiere red. Uso: npm run fonts
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS_DIR = path.join(ROOT, 'assets', 'fonts');
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;700&display=swap';
// Con un navegador moderno como User-Agent, Google responde con WOFF2.
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const REQUIRED = ['Cormorant Garamond|normal', 'Cormorant Garamond|italic', 'DM Sans|normal'];

async function get(url, asBuffer) {
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  } catch (error) {
    throw new Error(`No hay conexión con Google Fonts (${url}): ${error.message}. Este paso necesita red.`);
  }
  if (!res.ok) throw new Error(`Google Fonts respondió ${res.status} para ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

const css = await get(CSS_URL, false);
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)]
  .filter((m) => m[1] === 'latin')
  .map((m) => m[2]);
if (!blocks.length) throw new Error('No se encontraron bloques "latin" en la respuesta de Google Fonts.');

// Google sirve fuentes variables: varios pesos pueden compartir el mismo archivo.
// Se agrupan por URL para guardar un solo archivo y declarar un rango de pesos.
const faces = new Map();
for (const block of blocks) {
  const url = block.match(/url\(([^)]+)\)/)[1];
  const weight = block.match(/font-weight:\s*(\d+)(?:\s+(\d+))?/);
  const face = faces.get(url) || {
    url,
    family: block.match(/font-family:\s*'([^']+)'/)[1],
    style: block.match(/font-style:\s*(\w+)/)[1],
    range: block.match(/unicode-range:\s*([^;]+);/)[1],
    weights: []
  };
  face.weights.push(Number(weight[1]));
  if (weight[2]) face.weights.push(Number(weight[2]));
  faces.set(url, face);
}

const present = new Set([...faces.values()].map((f) => `${f.family}|${f.style}`));
for (const need of REQUIRED) {
  if (!present.has(need)) throw new Error(`Falta en la respuesta de Google Fonts: ${need.replace('|', ' ')}.`);
}

// Nombre estable: familia-estilo.woff2. Solo si Google separase pesos en archivos distintos
// (fuente no variable) se añade el rango de pesos para no sobrescribir.
const perStyle = new Map();
for (const face of faces.values()) {
  const key = `${face.family}|${face.style}`;
  perStyle.set(key, (perStyle.get(key) || 0) + 1);
}

await mkdir(FONTS_DIR, { recursive: true });
const out = ['/* Generado por tools/fetch-fonts.mjs (npm run fonts). No editar a mano. */'];

for (const face of faces.values()) {
  const lo = Math.min(...face.weights);
  const hi = Math.max(...face.weights);
  const slug = `${face.family.toLowerCase().replace(/\s+/g, '-')}-${face.style}`;
  const split = perStyle.get(`${face.family}|${face.style}`) > 1;
  const file = `${slug}${split ? `-${lo}${lo === hi ? '' : `-${hi}`}` : ''}.woff2`;
  const bytes = await get(face.url, true);
  await writeFile(path.join(FONTS_DIR, file), bytes);
  console.log(`${file} (${bytes.length} bytes, pesos ${lo}-${hi})`);
  out.push(
    '@font-face {',
    `  font-family: '${face.family}';`,
    `  font-style: ${face.style};`,
    `  font-weight: ${lo === hi ? lo : lo + ' ' + hi};`,
    '  font-display: swap;',
    `  src: url('../assets/fonts/${file}') format('woff2');`,
    `  unicode-range: ${face.range};`,
    '}'
  );
}

await writeFile(path.join(ROOT, 'css', 'fonts.css'), out.join('\n') + '\n');
console.log('css/fonts.css generado.');
