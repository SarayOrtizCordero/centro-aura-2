// Servidor estático para ver la demo en local: npm run serve → http://localhost:4173
// Variables opcionales (ninguna es obligatoria):
//   PORT           puerto (por defecto 4173)
//   AURA_SERVE_DIR carpeta a servir, relativa a la raíz del proyecto o absoluta (por defecto la raíz;
//                  tools/smoke.mjs la usa para servir dist/)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = process.env.AURA_SERVE_DIR ? path.resolve(PROJECT, process.env.AURA_SERVE_DIR) : PROJECT;
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

http.createServer(async (req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('400 · URL no válida');
    return;
  }
  let file = path.join(ROOT, urlPath);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(path.join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 · No encontrado');
    }
  }
}).listen(PORT, () => console.log(`Centro Aura (demo B) → http://localhost:${PORT}`));
