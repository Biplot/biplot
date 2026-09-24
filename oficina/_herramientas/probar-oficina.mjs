#!/usr/bin/env node
// Prueba funcional de la oficina con Edge sin interfaz (sin dependencias, Node 22+). Levanta su propio servidor
// estático sobre la raíz del repo y recorre la página en escritorio y celular: menú, recorrido guiado, teclado,
// enlaces directos (#lupe, #nuhome), Escape, pausa, movimiento reducido, errores de consola y desborde horizontal.
//
// Uso (desde la raíz del repo biplot):  node oficina/_herramientas/probar-oficina.mjs [--url http://…/oficina/]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json' };
const servidor = http.createServer((req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.join(raiz, ruta);
  if (!archivo.startsWith(raiz) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const url = arg('url', 'http://127.0.0.1:' + servidor.address().port + '/oficina/');

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'probar_'));
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`, '--no-first-run', '--disable-extensions', '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' });
let puerto = 0, objetivos = null;
for (let i = 0; i < 120 && !objetivos; i++) {
  try { if (!puerto) puerto = Number(fs.readFileSync(path.join(perfil, 'DevToolsActivePort'), 'utf8').split(/\r?\n/)[0]); if (puerto) objetivos = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json(); } catch { /* aún no */ }
  if (!objetivos) await sleep(250);
}
const ws = new WebSocket(objetivos.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pend = {}; let cargada = null; let consola = []; const recursos = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  const p = m.params || {};
  if (m.method === 'Page.loadEventFired' && cargada) cargada();
  if (m.method === 'Runtime.exceptionThrown') consola.push('Excepción: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text).split('\n')[0]);
  if (m.method === 'Runtime.consoleAPICalled' && p.type === 'error') consola.push(p.args.map((a) => a.value ?? a.description).join(' '));
  if (m.method === 'Network.responseReceived' && p.response.status >= 400) recursos.push(p.response.status + ' ' + p.response.url);
});
const cdp = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pend[id] = (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result)); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await cdp('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');

let fallas = 0;
const ok = (cond, texto) => { console.log((cond ? '  ✓ ' : '  ✗ ') + texto); if (!cond) fallas++; };
async function abrir(w, h, movil, reducir, hash) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: movil });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: movil });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducir ? 'reduce' : 'no-preference' }] });
  const listo = new Promise((r) => { cargada = r; setTimeout(r, 15000); });
  await cdp('Page.navigate', { url: url + (hash || '') });
  await listo; cargada = null;
  for (let i = 0; i < 60; i++) { try { if (await js("document.documentElement.classList.contains('lista') && document.querySelectorAll('.actor').length === 7")) break; } catch { /* navegando */ } await sleep(250); }
  await sleep(700);
}
const W = (ms) => `new Promise(r => setTimeout(r, ${ms}))`;

for (const [w, h, movil] of [[1440, 900, false], [1366, 768, false], [375, 812, true]]) {
  console.log(`\n${w}×${h}${movil ? ' (celular)' : ''}`);
  consola = [];
  await abrir(w, h, movil, false);
  await js("try{localStorage.clear()}catch(e){}; true"); await abrir(w, h, movil, false);
  ok(await js("!document.querySelector('#intro').hidden"), 'la bienvenida aparece en la primera visita');
  ok(await js('document.documentElement.scrollWidth <= innerWidth'), 'sin desborde horizontal');
  ok(await js("document.querySelectorAll('#recorrer [data-id]').length === 17"), 'el menú lista 7 integrantes y 10 salas');
  ok(await js("document.querySelectorAll('.actor').length === 7"), 'los 7 integrantes están en la escena');
  ok(await js("[...document.querySelectorAll('button, a[href]')].every(b => { const r = b.getBoundingClientRect(); return r.width === 0 || (r.width >= 24 && r.height >= 24); })"), 'todo botón o enlace visible mide al menos 24 px');
  // Recorrido guiado completo
  const pasos = await js(`(async () => { document.querySelector('#intro-guia').click(); await ${W(300)}; const t = [];
    for (let i = 0; i < 14; i++) { t.push(document.querySelector('#guia-t').textContent); document.querySelector('#guia-sig').click(); await ${W(120)}; }
    return { t, oculto: document.querySelector('#guia').hidden, intro: document.querySelector('#intro').hidden }; })()`);
  ok(pasos.t.length === 14 && pasos.oculto && pasos.intro, 'el recorrido guiado pasa por 14 paradas y se cierra (' + pasos.t[0] + ' → ' + pasos.t[13] + ')');
  // Cada entrada del menú abre su panel con título
  const paneles = await js(`(async () => { const r = []; for (const b of document.querySelectorAll('#recorrer [data-id]')) {
      b.click(); await ${W(150)}; const t = document.querySelector('#panel-titulo'); r.push([b.dataset.id, t ? t.textContent : null, !document.querySelector('#panel').hidden]); }
    return r; })()`);
  ok(paneles.every((p) => p[1] && p[2]), 'las 17 entradas del menú abren su panel con título');
  const desb = await js("document.querySelector('#panel-cuerpo').scrollWidth <= document.querySelector('#panel-cuerpo').clientWidth + 1");
  ok(desb, 'el panel no desborda a lo ancho');
  ok(await js(`(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await ${W(100)}; return document.querySelector('#panel').hidden; })()`), 'Escape cierra el panel');
  // Teclado sobre la escena
  ok(await js(`(async () => { const s = document.querySelector('#svg-escena'), e = document.querySelector('#escena'); e.focus(); const a = s.getAttribute('viewBox');
      e.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); e.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true })); await ${W(60)};
      return a !== s.getAttribute('viewBox'); })()`), 'las flechas y + mueven la cámara');
  // Pausa
  ok(await js(`(async () => { const b = document.querySelector('#controles [data-accion="pausa"]'); b.click(); await ${W(60)};
      const r = document.documentElement.classList.contains('oficina-quieta') && b.getAttribute('aria-pressed') === 'true'; b.click(); return r; })()`), 'el botón de pausa detiene la animación');
  // Clic real sobre una sala de la escena
  await js(`(async () => { document.querySelector('#panel-cerrar').click(); document.querySelector('#controles [data-accion="todo"]').click(); await ${W(900)}; return true; })()`);
  // Punto del piso de Fundos (x 10, y 2.3) llevado a coordenadas de pantalla
  const clic = await js(`(() => { const s = document.querySelector('#svg-escena'), r = s.getBoundingClientRect(), vb = s.viewBox.baseVal;
    const sx = (10 - 2.3) * 32, sy = (10 + 2.3) * 16; return [r.left + (sx - vb.x) * r.width / vb.width, r.top + (sy - vb.y) * r.height / vb.height]; })()`);
  for (const t of ['mousePressed', 'mouseReleased']) await cdp('Input.dispatchMouseEvent', { type: t, x: clic[0], y: clic[1], button: 'left', clickCount: 1, pointerType: 'mouse' });
  await sleep(300);
  ok(await js("!document.querySelector('#panel').hidden && document.querySelector('#panel-titulo')?.textContent === 'Fundos 360'"), 'un clic sobre el piso de Fundos abre su sala (' + (await js("document.querySelector('#panel').hidden ? 'panel cerrado' : document.querySelector('#panel-titulo')?.textContent")) + ')');
  // Enlaces directos
  await abrir(w, h, movil, false, '#lupe');
  ok((await js("document.querySelector('#panel-titulo')?.textContent")) === 'Lupe', 'oficina/#lupe abre la ficha de Lupe');
  await abrir(w, h, movil, false, '#nuhome');
  ok((await js("document.querySelector('#panel-titulo')?.textContent")) === 'Nu Home 360', 'oficina/#nuhome abre la sala de Nu Home');
  ok(consola.length === 0, 'sin errores de consola' + (consola.length ? ': ' + [...new Set(consola)].join(' | ') : ''));
}

console.log('\nMovimiento reducido');
await abrir(1440, 900, false, true);
ok(await js("getComputedStyle(document.querySelector('.pj-cuerpo')).animationName === 'none'"), 'el personal queda quieto');
ok(await js("document.querySelector('#controles [data-accion=\"pausa\"]').getAttribute('aria-pressed') === 'true'"), 'la animación parte pausada');

console.log('\nRecursos con error: ' + (recursos.length ? [...new Set(recursos)].join(', ') : 'ninguno'));
if (recursos.length) fallas++;
console.log(fallas ? `\n${fallas} prueba(s) fallaron` : '\nTodo OK');
try { ws.close(); } catch { /* */ }
edge.kill(); servidor.close(); await sleep(400);
for (let i = 0; i < 5; i++) { try { fs.rmSync(perfil, { recursive: true, force: true }); break; } catch { await sleep(300); } }
process.exit(fallas ? 1 : 0);
