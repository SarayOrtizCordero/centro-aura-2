const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function pageFiles() {
  const dir = path.join(ROOT, 'pages');
  const pages = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => 'pages/' + f)
    : [];
  return ['index.html', ...pages];
}

// Lee ancho y alto de un WebP (VP8, VP8L o VP8X) sin dependencias.
function webpSize(buf) {
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  throw new Error('Formato WebP desconocido: ' + chunk);
}

module.exports = { ROOT, read, pageFiles, webpSize };
