// Arranca tools/serve.mjs, comprueba el código HTTP de unas rutas y lo detiene.
// Uso:  node tools/smoke.mjs <carpeta> <puerto> <ruta>=<código> [<ruta>=<código> …]
//       node tools/smoke.mjs . 4179 ./=200 no-existe=404
//       node tools/smoke.mjs dist 4179 ./=200 pages/tienda.html=200
// Las rutas se escriben SIN barra inicial ("./" es la portada): Git Bash en Windows convierte
// los argumentos que empiezan por "/" en rutas de disco y el código nunca llegaría a la comprobación.
// Salida: 0 todo correcto · 1 algún código no coincide · 2 uso incorrecto · 3 el servidor no arrancó ·
//         70 error inesperado (nunca coincide con un código documentado).
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let server;
const fail = (error) => {
  console.error('Error inesperado: ' + (error && error.message ? error.message : error));
  if (server) server.kill();
  process.exit(70);
};
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [dir, portArg, ...pairs] = process.argv.slice(2);
const port = Number(portArg);
const checks = pairs
  .map((p) => p.match(/^([^/=\s][^=\s]*)=(\d{3})$/))
  .map((m) => m && [m[1] === './' ? '/' : '/' + m[1], Number(m[2])]);

if (!dir || !Number.isInteger(port) || port < 1024 || port > 65535 || !pairs.length || checks.includes(null)) {
  console.error('Uso: node tools/smoke.mjs <carpeta> <puerto 1024-65535> <ruta>=<código> […]');
  process.exit(2);
}

const base = `http://127.0.0.1:${port}`;
const busy = await fetch(base + '/').then(() => true, () => false);
if (busy) {
  console.error(`El puerto ${port} ya está en uso: elige otro.`);
  process.exit(3);
}

server = spawn(process.execPath, [path.join(ROOT, 'tools', 'serve.mjs')], {
  cwd: ROOT,
  env: { ...process.env, PORT: String(port), AURA_SERVE_DIR: dir },
  stdio: 'ignore'
});
let exited = false;
server.on('exit', () => { exited = true; });

async function waitReady() {
  for (let i = 0; i < 50 && !exited; i++) {
    try {
      await fetch(base + '/');
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return false;
}

let code = 0;
if (!(await waitReady())) {
  console.error(`El servidor no arrancó en el puerto ${port}.`);
  code = 3;
} else {
  for (const [route, expected] of checks) {
    const status = (await fetch(base + route)).status;
    const ok = status === expected;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${route} → ${status} (esperado ${expected})`);
    if (!ok) code = 1;
  }
}
// Sin process.exit(): en Windows, salir de golpe con conexiones abiertas rompe libuv (código 127).
// Se marca el código y se deja que el bucle de eventos termine cuando el servidor ya se ha parado.
process.exitCode = code;
server.kill();
