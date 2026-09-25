// Las salas de proyecto del piso 1, cada una con la esencia de su negocio.
// Se dibujan al tamaño real del piso (4,6 × 4,3) para armar el piso completo y los primeros planos.
import { escena, P, C } from './maqueta.mjs';
const TW = 32, TH = 16, ZH = 39;
const r1 = (n) => Math.round(n * 10) / 10;
export const W = 4.6, D = 4.3, HM = 1.9;
const FUENTE = `font-family="'Space Grotesk','DejaVu Sans',sans-serif"`, MONO = `font-family="'Space Mono','DejaVu Sans Mono',monospace"`;

// Envoltorio con origen: todo lo de una sala se dibuja en coordenadas locales
function local(E, ox, oy, oz = 0, bajo = false, kb = 0) {
  // kb: base de profundidad de la sala; todo lo de una sala se dibuja junto, de atrás hacia adelante
  const g = (x, y, z = 0) => [x + ox, y + oy, z + oz];
  const L = {
    E, bajo,
    P: (x, y, z = 0) => P(x + ox, y + oy, z + oz),
    caja: (x, y, z, w, d, h, col, k) => E.caja(x + ox, y + oy, z + oz, w, d, h, col, kb + (k ?? x + w / 2 + y + d / 2 + z * 0.5)),
    cil: (x, y, z, r, h, top, lado, k) => E.cilindro(x + ox, y + oy, z + oz, r, h, top, lado, kb + (k ?? x + y + 0.1 + z * 0.5)),
    planta: (x, y, z = 0, k, t = 0.75) => E.planta(x + ox, y + oy, z + oz, kb + (k ?? x + y + 0.1), t),
    poly: (pts, attr) => E.poly(pts.map(([x, y, z]) => g(x, y, z)), attr),
    add: (k, svg) => E.add(kb + k, svg),
    // Contenido 2D sobre un plano vertical y = y0 (u a lo largo de +x, v hacia abajo; 100 = 1 unidad)
    planoY(x0, y0, zTop, ancho, alto, svg, k) {
      const enMuro = y0 < 0.1;
      if (L.bajo && enMuro) return L;
      const [px, py] = P(x0 + ox, y0 + oy, zTop + oz);
      E.marca(x0 + ox, y0 + oy, zTop + oz); E.marca(x0 + ox + ancho / 100, y0 + oy, zTop + oz - alto / 100);
      return L.add(k ?? (enMuro ? -40 : x0 + ancho / 200 + y0 + 0.05), `<g transform="matrix(${TW / 100},${TH / 100},0,${ZH / 100},${r1(px)},${r1(py)})">${svg}</g>`);
    },
    // Contenido 2D sobre el muro x = 0 (u desde y0 hacia el fondo)
    planoX(y0, zTop, ancho, alto, svg, k) {
      if (L.bajo) return L;
      const [px, py] = P(ox + 0.02, y0 + oy, zTop + oz);
      E.marca(ox, y0 + oy, zTop + oz); E.marca(ox, y0 + oy - ancho / 100, zTop + oz - alto / 100);
      return L.add(k ?? -40, `<g transform="matrix(${TW / 100},${-TH / 100},0,${ZH / 100},${r1(px)},${r1(py)})">${svg}</g>`);
    },
    // Contenido 2D sobre el piso (o sobre una superficie horizontal a la altura z)
    piso(x0, y0, svg, k, z = 0.03) {
      const [px, py] = P(x0 + ox, y0 + oy, z + oz);
      return L.add(k ?? -55, `<g transform="matrix(${TW / 100},${TH / 100},${-TW / 100},${TH / 100},${r1(px)},${r1(py)})">${svg}</g>`);
    },
    linea(pts, color, w, k, extra = '') {
      const d = pts.map(([x, y, z], i) => { const q = P(x + ox, y + oy, z + oz); E.marca(x + ox, y + oy, z + oz); return (i ? 'L' : 'M') + r1(q[0]) + ' ' + r1(q[1]); }).join('');
      return L.add(k, `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`);
    },
    luz: (x, y, z, rx, ry, color, k) => { const [px, py] = P(x + ox, y + oy, z + oz); return L.add(k, `<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${rx}" ry="${ry}" fill="${color}"/>`); },
    cartel: (x, y, z, t, o) => E.cartel(x + ox, y + oy, z + oz, t, o),
    pj: (id, x, y, z, dir, e, k) => E.pj(id, x + ox, y + oy, z + oz, dir, e, kb + (k ?? x + y + 0.2)),
    // Todo lo que dibuja fn queda en un solo <g class>, para animarlo con CSS (oficina.css, «p1-…»)
    anim(clase, fn) {
      const antes = E.piezas.length;
      fn();
      const nuevas = E.piezas.splice(antes).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
      if (nuevas.length) E.piezas.push([Math.max(...nuevas.map(p => p[0])), 1e6 + E.piezas.length, `<g class="${clase}">${nuevas.map(p => p[2]).join('')}</g>`]);
      return L;
    }
  };
  return L;
}

// Piso y muros de atrás, en tramos para que el orden por profundidad no falle
function base(L, piso, o = {}) {
  L.add(-60, L.poly([[0, 0, 0.015], [W, 0, 0.015], [W, D, 0.015], [0, D, 0.015]], `fill="${piso}"`));
  const s = 0.46, mY = o.muroY || '#15395E', mX = o.muroX || '#10304F', H = L.bajo ? 0.45 : HM;
  for (let x = 0; x < W - 0.01; x += s) {
    const b = Math.min(W, x + s);
    L.add(-50 + b * 0.01, L.poly([[x, 0, 0], [b, 0, 0], [b, 0, H], [x, 0, H]], `fill="${mY}"`) + L.poly([[x, 0, H], [b, 0, H], [b, -0.1, H], [x, -0.1, H]], `fill="#2A5A88"`));
  }
  for (let y = 0; y < D - 0.01; y += s) {
    const b = Math.min(D, y + s);
    L.add(-50 + b * 0.01, L.poly([[0, y, 0], [0, b, 0], [0, b, H], [0, y, H]], `fill="${mX}"`) + L.poly([[0, y, H], [0, b, H], [-0.1, b, H], [-0.1, y, H]], `fill="#2A5A88"`));
  }
}
const txt = (x, y, t, fs, color, extra = '', largo) => `<text x="${x}" y="${y}" ${FUENTE} font-weight="700" font-size="${fs}" fill="${color}"${largo ? ` textLength="${largo}" lengthAdjust="spacingAndGlyphs"` : ''}${extra}>${t}</text>`;
const mono = (x, y, t, fs, color, extra = '') => `<text x="${x}" y="${y}" ${MONO} font-weight="700" font-size="${fs}" fill="${color}"${extra}>${t}</text>`;
const MADERA = { t: '#8B6A4E', l: '#6E5238', r: '#5A4330' };
const OSCURO = { t: '#3A424E', l: '#2A3038', r: '#1E232A' };

// ───────── Fundos 360 · venta de parcelas ─────────
const araucaria = (x, y, s) => { const q = (n) => r1(n * s); return `<path d="M${x} ${y}V${r1(y - 33 * s)}" stroke="#1F3B2A" stroke-width="${q(3)}"/>` +
  `<path d="M${r1(x - 19 * s)} ${r1(y - 29 * s)}C${r1(x - 12 * s)} ${r1(y - 38 * s)} ${r1(x + 12 * s)} ${r1(y - 38 * s)} ${r1(x + 19 * s)} ${r1(y - 29 * s)}Z" fill="#1F3B2A"/>` +
  `<path d="M${r1(x - 11 * s)} ${r1(y - 36 * s)}C${r1(x - 7 * s)} ${r1(y - 43 * s)} ${r1(x + 7 * s)} ${r1(y - 43 * s)} ${r1(x + 11 * s)} ${r1(y - 36 * s)}Z" fill="#1F3B2A"/>`; };
export function fundos(L) {
  base(L, '#2B4A3B');
  L.piso(1, 1.3, `<rect width="270" height="190" rx="14" fill="#335A47"/>`, -55);
  // Plano de loteo en el muro: disponibles, reservadas y vendidas
  let lotes = '';
  const est = ['d', 'v', 'd', 'r', 'v', 'v', 'd', 'd', 'v', 'r'];
  est.forEach((e, i) => {
    const c = i % 5, f = Math.floor(i / 5), x = 14 + c * 50, y = 38 + f * 40;
    const col = e === 'v' ? '#17446F' : e === 'r' ? '#E0B341' : '#9CCB8F';
    lotes += `<rect${i === 2 ? ' class="p1-lote"' : ''} x="${x}" y="${y}" width="44" height="30" fill="${col}" stroke="#0B1726" stroke-width="2"/>` + mono(x + 5, y + 19, 12 + i, 11, e === 'v' ? '#F2F4F7' : '#0B1726');
  });
  L.planoY(0.25, 0.02, 1.8, 275, 120, `<rect width="275" height="120" rx="5" fill="#F4ECD8" stroke="#0B1726" stroke-width="4"/>` + txt(14, 26, 'FUNDOS 360 · LOTEO', 14, '#0E2A47', '', 160) + lotes + `<rect x="10" y="70" width="255" height="6" fill="#CFC2A3"/>`);
  // Pantalla del proyecto: el ciclo de venta completo, del lead a la posventa
  L.planoY(3.3, 0.02, 1.7, 112, 80, `<rect width="112" height="80" rx="6" fill="#0B2B45" stroke="#0B1726" stroke-width="4"/>` + mono(9, 16, 'CICLO DE VENTA', 7, '#7FD8CF') +
    [['Lead', 64, '#9CCB8F'], ['Reserva', 28, '#E0B341'], ['Escritura', 16, '#7FD8CF'], ['Posventa', 9, '#6FA0D0']].map(([t, n, c], i) => mono(9, 32 + i * 13, t, 6.4, '#B9C8D8') + `<rect x="50" y="${26 + i * 13}" width="${r1(n * 0.6)}" height="7" rx="2" fill="${c}"/>` + mono(r1(54 + n * 0.6), 32 + i * 13, n, 6.4, '#F2F4F7')).join(''));
  // Ventana al fundo: volcán, araucarias y cerco
  L.planoX(3.9, 1.75, 330, 110, `<rect width="330" height="110" rx="6" fill="#1E5C8A" stroke="#0B1726" stroke-width="4"/><circle cx="286" cy="26" r="11" fill="#F2C14E"/>` +
    `<path d="M110 86L176 24H194L264 86Z" fill="#6B7A8C"/><path d="M176 24H194L207 36L198 41L188 33L178 41L165 35Z" fill="#F2F4F7"/>` +
    `<path d="M4 80Q80 46 160 72T326 64V106H4Z" fill="#3E7A4E"/><path d="M4 92Q120 64 220 90T326 86V106H4Z" fill="#2F6440"/>` +
    araucaria(36, 98, 1) + araucaria(62, 100, 0.72) + araucaria(298, 96, 0.9) +
    `<path d="M96 100V89M120 100V89M144 100V89M168 100V89" stroke="#CFC2A3" stroke-width="3"/><path d="M92 93H172" stroke="#CFC2A3" stroke-width="2"/>`);
  // La maqueta del loteo: mesa de madera con el terreno por curvas de nivel, parcelas y pines
  L.caja(1.2, 1.5, 0, 2.3, 1.5, 0.62, MADERA);
  L.caja(1.3, 1.6, 0.62, 2.1, 1.3, 0.08, { t: '#4E8A55', l: '#3E7046', r: '#325C39' }, 4.62);
  L.caja(1.55, 1.75, 0.7, 1.6, 1.0, 0.07, { t: '#6FAF6B', l: '#4E8A55', r: '#3E7046' }, 4.63);
  L.piso(1.55, 1.75, `<g stroke="#2F6440" stroke-width="1.6" fill="none"><path d="M40 0V100M80 0V100M120 0V100M0 50H160"/></g>`, 4.64, 0.771);
  L.caja(1.85, 1.95, 0.77, 1.0, 0.6, 0.06, { t: '#9CCB8F', l: '#6FAF6B', r: '#4E8A55' }, 4.65);
  L.piso(1.85, 1.95, `<g stroke="#4E8A55" stroke-width="1.6" fill="none"><path d="M50 0V60M0 30H100"/></g>`, 4.66, 0.831);
  const sobre = (x, y) => x > 1.85 && x < 2.85 && y > 1.95 && y < 2.55 ? 0.83 : x > 1.55 && x < 3.15 && y > 1.75 && y < 2.75 ? 0.77 : 0.7;
  [[1.75, 1.95, '#17C3B2'], [2.35, 2.1, '#17446F'], [3.0, 2.2, '#17C3B2'], [2.2, 2.4, '#E0B341'], [2.7, 2.45, '#17C3B2'], [1.7, 2.5, '#E0B341']].forEach(([x, y, c]) => {
    const z = sobre(x, y), k = 4.7 + (x + y) * 0.01;
    L.linea([[x, y, z], [x, y, z + 0.28]], '#0B1726', 1.6, k);
    L.cil(x, y, z + 0.28, 0.06, 0.06, c, c, k + 0.001);
  });
  L.anim('p1-pin', () => { const x = 2.45, y = 2.25, z = sobre(x, y), k = 4.7 + (x + y) * 0.01; L.linea([[x, y, z], [x, y, z + 0.28]], '#0B1726', 1.6, k); L.cil(x, y, z + 0.28, 0.06, 0.06, '#E0B341', '#E0B341', k + 0.001); });
  for (const [x, y] of [[1.4, 2.7], [3.25, 1.7], [3.3, 2.8]]) { const k = 4.7 + (x + y) * 0.01; L.cil(x, y, 0.7, 0.03, 0.08, '#6E5238', '#5A4330', k); L.luz(x, y, 0.93, 7, 7, '#2F6440', k + 0.001); L.luz(x, y, 0.99, 5, 5, '#4E8A55', k + 0.002); }
  // Teodolito de topógrafo y letrero de venta
  L.linea([[3.95, 3.3, 1.05], [3.7, 3.15, 0]], '#B9C8D8', 2.4, 7.3); L.linea([[3.95, 3.3, 1.05], [4.2, 3.2, 0]], '#B9C8D8', 2.4, 7.3); L.linea([[3.95, 3.3, 1.05], [3.95, 3.62, 0]], '#B9C8D8', 2.4, 7.6);
  L.caja(3.85, 3.2, 1.05, 0.22, 0.18, 0.2, { t: '#F2C14E', l: '#E0B341', r: '#B8902E' }, 7.7);
  L.caja(0.5, 3.75, 0, 0.07, 0.07, 1.0, MADERA, 4.3);
  L.caja(0.2, 3.72, 0.62, 0.7, 0.05, 0.36, { t: '#F2F4F7', l: '#F2F4F7', r: '#C4D2E0' }, 4.4);
  L.planoY(0.22, 3.775, 0.96, 66, 32, txt(6, 22, 'SE VENDE', 15, '#0E2A47', '', 54), 4.45);
}

// ───────── Haru 360 · restaurante de cocina japonesa ─────────
const sakura = (cx, cy, r) => [0, 72, 144, 216, 288].map(a => { const t = (a - 90) * Math.PI / 180; return `<circle cx="${r1(cx + Math.cos(t) * r)}" cy="${r1(cy + Math.sin(t) * r)}" r="${r1(r * 0.72)}" fill="#F2F4F7"/>`; }).join('') + `<circle cx="${cx}" cy="${cy}" r="${r1(r * 0.42)}" fill="#F5B7C5"/>`;
export function haru(L) {
  base(L, '#6E4A30');
  L.piso(0, 0, `<g stroke="#5E3F28" stroke-width="2">${[35, 70, 105, 140, 175, 210, 245, 280, 315, 350, 385, 420].map(x => `<path d="M${x} 0V430"/>`).join('')}</g>`, -55);
  // La cocina detrás del noren, con la flor de Haru («primavera»)
  L.planoY(0.35, 0.02, 1.78, 100, 150, `<rect width="100" height="150" fill="#0B1726"/><rect x="-5" y="0" width="110" height="6" rx="2" fill="#8B6A4E"/>` +
    [3, 35, 67].map(x => `<rect x="${x}" y="6" width="30" height="56" fill="#22407A"/>`).join('') + sakura(50, 32, 7.5));
  // Riel de comandas y pantalla de pedidos por canal
  L.planoY(1.55, 0.02, 1.86, 160, 30, `<path d="M0 5H160" stroke="#B9C8D8" stroke-width="3"/>` + [14, 66, 118].map(x => `<g${x === 14 ? ' class="p1-comanda"' : ''}><rect x="${x}" y="5" width="26" height="22" fill="#F2F4F7" stroke="#0B1726" stroke-width="1.5"/><path d="M${x + 5} 13H${x + 21}M${x + 5} 19H${x + 17}" stroke="#8FA3B8" stroke-width="2"/></g>`).join(''));
  L.planoY(3.35, 0.02, 1.72, 112, 78, `<rect width="112" height="78" rx="6" fill="#0B2B45" stroke="#0B1726" stroke-width="4"/>` +
    [['Local', '#F2C14E'], ['Delivery', '#17C3B2'], ['App', '#7FD8CF']].map(([t, c], i) => { const x = 7 + i * 33; return `<rect x="${x}" y="9" width="31" height="60" rx="3" fill="#123459"/><rect x="${x}" y="9" width="31" height="10" rx="3" fill="${c}"/>` + mono(x + 2, 17, t, 5.6, '#0E2A47') + `<path d="M${x + 4} 29H${x + 25}M${x + 4} 36H${x + 20}M${x + 4} 43H${x + 23}" stroke="#35679A" stroke-width="2"/><rect x="${x + 4}" y="51" width="23" height="12" rx="2" fill="#17446F"/>`; }).join(''));
  // La barra de sushi: vitrina de pescados, ramen humeante y nigiris en su tabla
  L.caja(0.3, 0.1, 0, 2.9, 0.6, 0.9, { t: '#E8D2A8', l: '#8B6A4E', r: '#6E5238' }, 1.0);
  L.add(1.001, L.poly([[0.3, 0.7, 0.9], [3.2, 0.7, 0.9], [3.2, 0.7, 0.84], [0.3, 0.7, 0.84]], `fill="#C9A27A"`));
  ['#F29A6B', '#C8474A', '#F2F4F7', '#F7B58E', '#F29A6B'].forEach((c, i) => L.caja(1.62 + i * 0.24, 0.22, 0.9, 0.17, 0.13, 0.05, { t: c, l: c, r: c }, 1.01 + i * 0.001));
  const [gx0, gx1, gy0, gy1, gz0, gz1] = [1.5, 2.85, 0.16, 0.42, 0.9, 1.1];
  L.add(1.02, L.poly([[gx0, gy1, gz0], [gx1, gy1, gz0], [gx1, gy1, gz1], [gx0, gy1, gz1]], `fill="rgba(221,244,241,.16)" stroke="rgba(221,244,241,.6)" stroke-width="1"`) +
    L.poly([[gx1, gy0, gz0], [gx1, gy1, gz0], [gx1, gy1, gz1], [gx1, gy0, gz1]], `fill="rgba(221,244,241,.1)" stroke="rgba(221,244,241,.45)" stroke-width="1"`) +
    L.poly([[gx0, gy0, gz1], [gx1, gy0, gz1], [gx1, gy1, gz1], [gx0, gy1, gz1]], `fill="rgba(221,244,241,.12)" stroke="rgba(221,244,241,.6)" stroke-width="1"`));
  L.cil(0.75, 0.42, 0.9, 0.14, 0.09, '#F2F4F7', '#C4D2E0', 1.03); L.luz(0.75, 0.42, 0.99, 4.6, 2.3, '#E0B341', 1.031);
  L.linea([[0.66, 0.3, 1.03], [0.98, 0.46, 1.0]], '#3A2E26', 1.4, 1.032); L.linea([[0.66, 0.34, 1.03], [0.98, 0.5, 1.0]], '#3A2E26', 1.4, 1.033);
  L.anim('p1-vapor', () => { L.linea([[0.72, 0.42, 1.03], [0.68, 0.42, 1.2], [0.75, 0.42, 1.36]], 'rgba(242,244,247,.7)', 1.5, 1.034); L.linea([[0.8, 0.42, 1.03], [0.84, 0.42, 1.2]], 'rgba(242,244,247,.55)', 1.3, 1.034); });
  L.caja(1.02, 0.46, 0.9, 0.36, 0.16, 0.03, { t: '#C9A27A', l: '#A8845E', r: '#8C6D4A' }, 1.04);
  for (const [x, c] of [[1.11, '#F29A6B'], [1.2, '#C8474A'], [1.29, '#F29A6B']]) { L.luz(x, 0.54, 0.95, 3.2, 1.8, '#F2F4F7', 1.041); L.luz(x, 0.54, 0.97, 2.8, 1.4, c, 1.042); }
  // Pisos de barra
  for (const x of [0.85, 1.65, 2.45]) { L.cil(x, 1.02, 0, 0.035, 0.46, '#3A424E', '#2A3038'); L.cil(x, 1.02, 0.46, 0.15, 0.06, '#C9A27A', '#8B6A4E'); }
  // Retiro de delivery: repisa con bolsas listas
  L.caja(3.4, 0.1, 0, 0.95, 0.4, 0.6, MADERA);
  for (const x of [3.5, 3.8, 4.1]) { L.caja(x, 0.18, 0.6, 0.2, 0.16, 0.24, { t: '#D9B98C', l: '#C4A06E', r: '#A8845E' }, 4.4 + x * 0.01); L.linea([[x + 0.05, 0.26, 0.84], [x + 0.1, 0.26, 0.9], [x + 0.15, 0.26, 0.84]], '#8C6D4A', 1.4, 4.41 + x * 0.01); }
  L.planoY(3.45, 0.505, 0.5, 86, 16, `<rect width="86" height="16" rx="3" fill="#0B2B45"/>` + mono(6, 11.5, 'DELIVERY', 9, '#7FD8CF', ` textLength="74" lengthAdjust="spacingAndGlyphs"`), 4.5);
  // Carta en pizarra
  L.planoX(3.9, 1.72, 220, 105, `<rect width="220" height="105" rx="5" fill="#1F2A26" stroke="#8B6A4E" stroke-width="6"/>` + txt(14, 26, 'HARU 360', 15, '#F2C14E', '', 72) + mono(150, 26, 'CARTA', 10, '#B9C8D8') +
    ['Sushi', 'Ramen', 'Gyozas', 'Temaki'].map((t, i) => mono(14, 46 + i * 15, t, 10, '#E8DFC8') + `<path d="M${64} ${43 + i * 15}H200" stroke="#6B7A8C" stroke-width="1.5" stroke-dasharray="2 4"/>`).join('') + sakura(196, 20, 4));
  // Mesas con ramen y nigiris, bajo faroles de papel rojo
  const mesa = (x, y) => {
    L.cil(x - 0.62, y, 0, 0.15, 0.42, '#C9A27A', '#8B6A4E'); L.cil(x + 0.62, y, 0, 0.15, 0.42, '#C9A27A', '#8B6A4E');
    L.caja(x - 0.07, y - 0.07, 0, 0.14, 0.14, 0.58, { t: '#3A2E26', l: '#3A2E26', r: '#2A211C' });
    L.caja(x - 0.4, y - 0.4, 0.58, 0.8, 0.8, 0.05, { t: '#C9A27A', l: '#A8845E', r: '#8C6D4A' });
    const k = x + y + 0.35;
    L.luz(x, y, 0.64, 22, 11, 'rgba(242,120,90,.16)', k);
    L.cil(x - 0.14, y + 0.08, 0.63, 0.12, 0.08, '#F2F4F7', '#C4D2E0', k + 0.01); L.luz(x - 0.14, y + 0.08, 0.71, 4, 2, '#E0B341', k + 0.011);
    L.linea([[x - 0.3, y - 0.1, 0.64], [x + 0.02, y - 0.16, 0.64]], '#3A2E26', 1.3, k + 0.012); L.linea([[x - 0.3, y - 0.06, 0.64], [x + 0.02, y - 0.12, 0.64]], '#3A2E26', 1.3, k + 0.013);
    L.cil(x + 0.18, y + 0.14, 0.63, 0.13, 0.02, '#F2F4F7', '#C4D2E0', k + 0.014);
    L.luz(x + 0.14, y + 0.14, 0.66, 3, 1.6, '#F29A6B', k + 0.015); L.luz(x + 0.22, y + 0.14, 0.66, 3, 1.6, '#C8474A', k + 0.016);
    L.cil(x + 0.24, y - 0.2, 0.63, 0.035, 0.12, '#3A2E26', '#5A2A22', k + 0.017);
    // La carta con QR: se pide desde la mesa
    L.caja(x + 0.14, y + 0.3, 0.63, 0.16, 0.03, 0.17, { t: '#F2F4F7', l: '#F2F4F7', r: '#C4D2E0' }, k + 0.018);
    L.planoY(x + 0.15, y + 0.331, 0.785, 14, 14, [[1, 1], [9, 1], [1, 9], [6, 6], [10, 9], [5, 1], [1, 5], [10, 5]].map(([a, b]) => `<rect x="${a}" y="${b}" width="3.4" height="3.4" fill="#0B1726"/>`).join(''), k + 0.019);
    L.anim('p1-farol', () => {
      L.linea([[x, y, 2.3], [x, y, 1.48]], '#3A424E', 1.4, k + 0.1);
      L.cil(x, y, 1.13, 0.09, 0.03, '#1E232A', '#1E232A', k + 0.101);
      L.cil(x, y, 1.15, 0.16, 0.3, '#E0524A', '#C8423A', k + 0.102);
      const [cx, c0] = L.P(x, y, 0), rx = 0.16 * 32 * 1.41, ry = 0.16 * 16 * 1.41;
      L.add(k + 0.103, [1.23, 1.32, 1.4].map(z => { const cy = c0 - z * 39; return `<path d="M${r1(cx - rx)} ${r1(cy)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(cy)}" fill="none" stroke="#A8352F" stroke-width="1"/>`; }).join(''));
      L.cil(x, y, 1.45, 0.09, 0.03, '#1E232A', '#1E232A', k + 0.104);
    });
  };
  mesa(1.45, 2.75); mesa(3.2, 3.15);
  // Bambú en la esquina
  L.cil(0.18, 0.98, 0, 0.13, 0.3, '#3A424E', '#2A3038', 1.2);
  L.add(1.21, [[0.13, 1.25], [0.19, 1.45], [0.25, 1.15]].map(([dx, h]) => { const [a, b] = L.P(dx, 0.98, 0.28), [, c] = L.P(dx, 0.98, h); return `<path d="M${r1(a)} ${r1(b)}V${r1(c)}" stroke="#4E8A55" stroke-width="2.6"/><path d="M${r1(a)} ${r1(c + 9)}l7 -5M${r1(a)} ${r1(c + 17)}l-7 -4" stroke="#6FAF6B" stroke-width="2.2" stroke-linecap="round"/>`; }).join(''));
}

// ───────── Eleven 360 · gimnasio ─────────
export function eleven(L) {
  base(L, '#23282E');
  L.piso(0, 0, `<rect x="16" y="16" width="428" height="398" fill="none" stroke="#17C3B2" stroke-width="3" opacity=".7"/>` + txt(150, 412, '11', 150, '#2E353F', ` stroke="#17C3B2" stroke-width="4"`, 150), -45);
  // Espejo y horario de clases
  L.planoY(0.2, 0.02, 1.8, 235, 160, `<rect width="235" height="160" fill="#9FC3D9" stroke="#0B1726" stroke-width="4"/><path d="M78 0V160M156 0V160" stroke="#7FA6BF" stroke-width="3"/>` +
    `<path d="M20 150L70 10M40 150L90 10M110 150L150 40M180 150L220 20" stroke="#DDF4F1" stroke-width="6" opacity=".6"/>`);
  L.planoY(2.75, 0.02, 1.72, 165, 100, `<rect width="165" height="100" rx="6" fill="#0B2B45" stroke="#0B1726" stroke-width="4"/>` + mono(10, 19, 'CLASES DE HOY', 10, '#7FD8CF') +
    [['07:00', 'Funcional', '12/20'], ['12:30', 'Yoga', '8/15'], ['19:00', 'Spinning', '18/20']].map(([h, c, q], i) => mono(10, 42 + i * 20, h, 9, '#B9C8D8') + txt(50, 42 + i * 20, c, 10, '#F2F4F7') + `<rect x="118" y="${32 + i * 20}" width="38" height="13" rx="6" fill="#17C3B2"/>` + (i === 2 ? mono(123, 42 + i * 20, q, 8, '#0E2A47', ' class="p1-a"') + mono(123, 42 + i * 20, '19/20', 8, '#0E2A47', ' class="p1-b"') : mono(123, 42 + i * 20, q, 8, '#0E2A47'))).join(''));
  // Nombre en el muro y rack de mancuernas
  L.planoX(4.0, 1.75, 380, 50, txt(20, 40, 'ELEVEN 360', 34, '#F2F4F7', '', 230));
  L.caja(0.1, 0.9, 0, 0.55, 2.4, 0.7, OSCURO);
  for (let i = 0; i < 5; i++) { const y = 1.1 + i * 0.45; L.caja(0.2, y, 0.7, 0.35, 0.12, 0.08, { t: '#B9C8D8', l: '#8FA3B8', r: '#6B7A8C' }, 0.8 + y); L.cil(0.2, y + 0.06, 0.7, 0.1, 0.14, i % 2 ? '#17C3B2' : '#35679A', i % 2 ? '#0A8A7E' : '#17446F', 0.81 + y); L.cil(0.55, y + 0.06, 0.7, 0.1, 0.14, i % 2 ? '#17C3B2' : '#35679A', i % 2 ? '#0A8A7E' : '#17446F', 0.82 + y); }
  // Trotadora
  L.caja(1.9, 1.15, 0, 1.55, 0.7, 0.2, OSCURO);
  const franjas = (xs, clase) => `<g class="${clase}">` + xs.map(x => L.poly([[x, 1.22, 0.215], [x, 1.78, 0.215]], `stroke="#2F3945" stroke-width="2"`)).join('') + '</g>';
  L.add(3.4, L.poly([[1.98, 1.22, 0.21], [3.2, 1.22, 0.21], [3.2, 1.78, 0.21], [1.98, 1.78, 0.21]], `fill="#141A23"`) + franjas([2.2, 2.6, 3.0], 'p1-cinta') + franjas([2.4, 2.8], 'p1-cinta p1-cinta-b'));
  L.caja(3.3, 1.18, 0.2, 0.1, 0.64, 1.0, OSCURO, 4.6);
  L.caja(3.12, 1.25, 1.12, 0.3, 0.5, 0.14, { t: '#17C3B2', l: '#0A8A7E', r: '#077068' }, 4.7);
  // Banca, pesas rusas y botella
  L.caja(2.0, 2.3, 0, 1.3, 0.42, 0.38, { t: '#17446F', l: '#0F3558', r: '#0B2B45' });
  for (const [x, y, t, l] of [[0.95, 3.55, '#17C3B2', '#0A8A7E'], [1.25, 3.7, '#35679A', '#17446F']]) { L.cil(x, y, 0, 0.14, 0.2, t, l); L.linea([[x - 0.08, y, 0.2], [x - 0.08, y, 0.3], [x + 0.08, y, 0.3], [x + 0.08, y, 0.2]], l, 2.4, x + y + 0.2); }
  L.cil(3.0, 2.45, 0.38, 0.05, 0.2, '#7FD8CF', '#17C3B2', 5.9);
  // Torniquete de ingreso con el lector de huella de siempre: Eleven 360 trabaja antes y después de la huella
  L.caja(4.05, 3.55, 0, 0.14, 0.14, 0.95, { t: '#B9C8D8', l: '#8FA3B8', r: '#6B7A8C' });
  L.caja(3.97, 3.5, 0.95, 0.3, 0.24, 0.05, { t: '#0B2B45', l: '#0B2B45', r: '#091D33' }, 7.7);
  L.piso(3.99, 3.52, `<g class="p1-huella" fill="none" stroke="#17C3B2" stroke-width="2.6" stroke-linecap="round"><path d="M5 17Q5 4 13 4Q21 4 21 17"/><path d="M9 18Q9 8 13 8Q17 8 17 18"/><path d="M13 12V19"/></g>`, 7.8, 1.005);
  L.linea([[4.12, 3.7, 0.55], [4.12, 4.2, 0.55]], '#B9C8D8', 3, 7.9);
}

// ───────── Nu Home 360 · casas modulares ─────────
export function nuhome(L) {
  base(L, '#56687B');
  L.piso(0, 0, `<g stroke="#4A5B6D" stroke-width="2"><path d="M115 0V430M230 0V430M345 0V430M0 107H460M0 215H460M0 322H460"/></g>`, -55);
  // Catálogo de módulos y configurador
  const mod = (x, t, c) => `<rect x="${x}" y="8" width="52" height="74" rx="4" fill="#F2F4F7" stroke="#0B1726" stroke-width="2"/><path d="M${x + 12} 36L${x + 26} 28L${x + 40} 36V52L${x + 26} 60L${x + 12} 52Z" fill="${c}" stroke="#0B1726" stroke-width="1.5"/><path d="M${x + 12} 36L${x + 26} 44L${x + 40} 36M${x + 26} 44V60" stroke="#0B1726" stroke-width="1.5" fill="none"/>` + mono(x + 4, 74, t, 7.5, '#0E2A47');
  L.planoY(0.25, 0.02, 1.8, 236, 92, `<rect width="236" height="92" rx="5" fill="#17446F" stroke="#0B1726" stroke-width="4"/>` + mod(6, 'M1 Dorm.', '#E9EEF2') + mod(64, 'M2 Cocina', '#C9A27A') + mod(122, 'M3 Baño', '#7FD8CF') + mod(180, 'M4 Living', '#E0B341'));
  L.planoY(2.8, 0.02, 1.7, 160, 86, `<rect width="160" height="86" rx="6" fill="#0B2B45" stroke="#0B1726" stroke-width="4"/>` + mono(10, 18, 'TU CASA', 9, '#7FD8CF') +
    `<g fill="none" stroke="#17C3B2" stroke-width="2.5"><path d="M24 62V40H58V62ZM58 62V40H92V62ZM24 40V24H58V40Z"/><path class="p1-b" d="M58 40V24H92V40"/></g>` +
    `<g class="p1-a">` + txt(102, 44, '3 módulos', 11, '#F2F4F7') + mono(102, 60, '54 m²', 10, '#B9C8D8') + '</g><g class="p1-b">' + txt(102, 44, '4 módulos', 11, '#F2F4F7') + mono(102, 60, '72 m²', 10, '#B9C8D8') + '</g>');
  // La fábrica a la vista: carta Gantt de los módulos en producción
  L.planoX(3.9, 1.72, 215, 100, `<rect width="215" height="100" rx="5" fill="#0B3A5C" stroke="#0B1726" stroke-width="4"/>` + mono(12, 19, 'FÁBRICA', 9, '#7FD8CF') +
    [['M1', 30, 70, '#9CCB8F'], ['M2', 52, 64, '#9CCB8F'], ['M3', 88, 58, '#E0B341'], ['M4', 120, 60, '#35679A']].map(([t, x, w, c], i) => mono(12, 38 + i * 15, t, 8, '#B9C8D8') + `<rect x="${x}" y="${30 + i * 15}" width="${w}" height="9" rx="3" fill="${c}"/>`).join('') +
    `<path d="M112 26V90" stroke="#F2F4F7" stroke-width="1.6" stroke-dasharray="3 3"/>` + mono(116, 96, 'hoy', 7, '#F2F4F7'));
  // La casa armándose: plataforma, módulos y la grúa bajando el cuarto
  L.caja(0.9, 1.2, 0, 2.7, 2.1, 0.16, { t: '#B98B5E', l: '#9C7B55', r: '#7E6242' });
  const ventanas = (x, y, z, w, d, h) => L.add(x + w + y + d + 0.4, L.poly([[x + 0.18, y + d + 0.001, z + 0.2], [x + 0.48, y + d + 0.001, z + 0.2], [x + 0.48, y + d + 0.001, z + h - 0.12], [x + 0.18, y + d + 0.001, z + h - 0.12]], `fill="#0B2B45"`) +
    L.poly([[x + w + 0.001, y + 0.2, z + 0.2], [x + w + 0.001, y + 0.55, z + 0.2], [x + w + 0.001, y + 0.55, z + h - 0.12], [x + w + 0.001, y + 0.2, z + h - 0.12]], `fill="rgba(127,216,207,.55)"`));
  L.caja(1.1, 1.35, 0.16, 1.0, 0.8, 0.62, { t: '#E9EEF2', l: '#C4D2E0', r: '#9FB2C4' }); ventanas(1.1, 1.35, 0.16, 1.0, 0.8, 0.62);
  L.caja(2.2, 1.35, 0.16, 1.0, 0.8, 0.62, { t: '#C9A27A', l: '#A8845E', r: '#8C6D4A' }); ventanas(2.2, 1.35, 0.16, 1.0, 0.8, 0.62);
  L.caja(2.2, 1.35, 0.78, 1.0, 0.8, 0.5, { t: '#F2F4F7', l: '#D5E2EE', r: '#B9C8D8' }, 2.2 + 1.0 + 1.35 + 0.8 + 0.5); ventanas(2.2, 1.35, 0.78, 1.0, 0.8, 0.5);
  L.add(2.2 + 1.0 + 1.35 + 0.8 + 0.6, L.poly([[1.1, 2.25, 0.165], [2.1, 2.25, 0.165], [2.1, 3.1, 0.165], [1.1, 3.1, 0.165]], `fill="none" stroke="#F2F4F7" stroke-width="1.6" stroke-dasharray="5 4"`));
  L.caja(0.55, 3.25, 0, 0.12, 0.12, 2.05, { t: '#E0B341', l: '#B8902E', r: '#8C6D22' }, 4.0);
  L.linea([[0.61, 3.31, 2.02], [1.62, 2.68, 2.02]], '#E0B341', 3.6, 5.2);
  L.anim('p1-grua', () => {
    L.linea([[1.6, 2.68, 2.0], [1.6, 2.68, 1.72]], '#3A424E', 1.4, 5.25);
    L.caja(1.15, 2.3, 1.22, 0.9, 0.75, 0.5, { t: '#E9EEF2', l: '#C4D2E0', r: '#9FB2C4' }, 5.3);
  });
  L.planta(4.25, 0.45, 0, undefined, 0.6);
  // Muestras de materiales
  L.caja(3.95, 3.55, 0, 0.06, 0.06, 0.7, MADERA, 7.5);
  L.caja(3.72, 3.62, 0.5, 0.55, 0.04, 0.5, { t: '#F2F4F7', l: '#F2F4F7', r: '#C4D2E0' }, 7.9);
  L.planoY(3.74, 3.665, 0.98, 51, 46, [['#C9A27A', 4, 4], ['#8FA3B8', 27, 4], ['#F2F4F7', 4, 25], ['#3A424E', 27, 25]].map(([c, x, y]) => `<rect x="${x}" y="${y}" width="20" height="17" fill="${c}" stroke="#0B1726" stroke-width="1.2"/>`).join(''), 7.95);
}

// ───────── Rumbo · app de desarrollo personal ─────────
export function rumbo(L) {
  base(L, '#1D4F55');
  // El camino en el piso, con hitos, hasta la escalera; y la rosa de los vientos
  L.piso(0, 0, `<path d="M45 370C110 335 140 300 190 275S300 285 365 320" fill="none" stroke="#7FD8CF" stroke-width="9" stroke-dasharray="2 17" stroke-linecap="round"/>` +
    `<path class="p1-camino" d="M45 370C110 335 140 300 190 275S300 285 365 320" fill="none" stroke="#DDF4F1" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"/>` +
    [[45, 370, 'Día 1', 20, 5], [190, 275, 'Día 7', -18, -22], [365, 320, 'Día 30', -28, 40]].map(([x, y, t, dx, dy]) => `<circle cx="${x}" cy="${y}" r="15" fill="#0E2A47" stroke="#7FD8CF" stroke-width="4"/>` + mono(x + dx, y + dy, t, 16, '#DDF4F1')).join('') +
    `<g transform="translate(100 255)"><circle r="44" fill="none" stroke="#7FD8CF" stroke-width="3" opacity=".6"/><path d="M0 -40L9 0L0 40L-9 0Z" fill="#DDF4F1"/><path d="M-40 0L0 -9L40 0L0 9Z" fill="#7FD8CF"/><path d="M0 -40L9 0H-9Z" fill="#17C3B2"/></g>`, -55);
  // Mural de montaña y el celular gigante con la app
  L.planoY(0.2, 0.02, 1.78, 215, 125, `<rect width="215" height="125" rx="5" fill="#15546A" stroke="#0B1726" stroke-width="4"/><path d="M0 125L60 55L100 90L150 30L215 110V125Z" fill="#2A7C78"/><path d="M0 125L45 92L90 118L140 70L215 125Z" fill="#1F5F5C"/><path d="M150 30L150 8" stroke="#F2F4F7" stroke-width="3"/><path d="M150 8L172 15L150 22Z" fill="#17C3B2"/>` + txt(12, 28, 'RUMBO', 18, '#DDF4F1', '', 64));
  L.planoY(2.55, 0.02, 1.86, 112, 165, `<rect width="112" height="165" rx="16" fill="#0B1726"/><rect x="7" y="9" width="98" height="147" rx="10" fill="#0E2A47"/>` + mono(18, 30, 'HOY', 9, '#7FD8CF') +
    `<circle cx="56" cy="70" r="24" fill="none" stroke="#17446F" stroke-width="7"/><path d="M56 46A24 24 0 1 1 33 76" fill="none" stroke="#17C3B2" stroke-width="7" stroke-linecap="round"/>` + txt(45, 76, '12', 16, '#F2F4F7', ' class="p1-a"') + txt(45, 76, '13', 16, '#F2F4F7', ' class="p1-b"') + mono(34, 106, 'días de racha', 7, '#B9C8D8') +
    ['Leer 20 min', 'Caminar', 'Agradecer'].map((t, i) => `<rect x="16" y="${114 + i * 13}" width="8" height="8" rx="2" fill="${i < 2 ? '#17C3B2' : 'none'}"${i === 2 ? ' class="p1-habito"' : ''} stroke="#17C3B2" stroke-width="1.5"/>` + mono(30, 121 + i * 13, t, 7, '#DDF4F1')).join(''));
  // Frase en el otro muro
  L.planoX(3.8, 1.6, 240, 60, txt(8, 42, 'Un paso al día.', 30, '#DDF4F1', '', 220));
  // La escalera al final del camino: un peldaño por paso, con la bandera arriba
  for (let j = 3; j >= 0; j--) L.caja(3.2, 2.5 - j * 0.4, 0, 0.9, 0.4, 0.2 * (j + 1), { t: '#3E9C95', l: '#2A7C78', r: '#1F5F5C' });
  L.linea([[3.65, 1.5, 0.8], [3.65, 1.5, 1.38]], '#F2F4F7', 2, 5.2);
  L.anim('p1-bandera', () => L.add(5.21, L.poly([[3.65, 1.5, 1.38], [3.97, 1.5, 1.29], [3.65, 1.5, 1.2]], `fill="#17C3B2"`)));
  // Cojín de meditación, mesa baja con la libreta y una planta
  L.cil(0.95, 1.4, 0, 0.36, 0.14, '#E8DFC8', '#CFC2A3');
  L.caja(1.45, 0.62, 0, 0.62, 0.46, 0.28, MADERA);
  L.add(2.2, L.poly([[1.55, 0.69, 0.29], [1.75, 0.69, 0.29], [1.75, 0.98, 0.29], [1.55, 0.98, 0.29]], `fill="#F4ECD8"`) + L.poly([[1.75, 0.69, 0.29], [1.95, 0.69, 0.29], [1.95, 0.98, 0.29], [1.75, 0.98, 0.29]], `fill="#E8DFC8"`));
  L.planta(0.5, 0.5);
}

// ───────── Sala libre · Tu proyecto aquí ─────────
export function libre(L) {
  base(L, '#0F3350');
  L.piso(0, 0, `<g stroke="rgba(127,216,207,.18)" stroke-width="2">${[50, 100, 150, 200, 250, 300, 350, 400].map(x => `<path d="M${x} 0V430"/>`).join('')}${[50, 100, 150, 200, 250, 300, 350, 400].map(y => `<path d="M0 ${y}H460"/>`).join('')}</g>` +
    `<rect x="120" y="110" width="220" height="200" fill="none" stroke="#7FD8CF" stroke-width="5" stroke-dasharray="14 10" class="p1-contorno"/>`, -55);
  L.planoY(0.3, 0.02, 1.75, 330, 128, `<rect width="330" height="84" rx="8" fill="rgba(127,216,207,.06)" stroke="#7FD8CF" stroke-width="4" stroke-dasharray="12 9"/>` + txt(24, 54, 'TU PROYECTO AQUÍ', 28, '#7FD8CF', '', 282) +
    `<rect x="0" y="96" width="190" height="32" rx="16" fill="#FF6B4A"/>` + txt(16, 118, 'Agenda tu diagnóstico', 15, '#0B1726', '', 158));
  L.planoX(3.9, 1.5, 200, 40, mono(0, 26, 'SALA DISPONIBLE', 18, '#35679A', ` textLength="180" lengthAdjust="spacingAndGlyphs"`));
  L.caja(1.85, 1.7, 0, 0.95, 0.95, 0.55, { t: '#17446F', l: '#0F3558', r: '#0B2B45' });
  L.caja(2.02, 1.87, 0.55, 0.6, 0.6, 0.45, { t: '#C9A27A', l: '#A8845E', r: '#8C6D4A' }, 4.5);
  L.add(4.55, L.poly([[2.02, 2.12, 1.0], [2.62, 2.12, 1.0], [2.62, 2.23, 1.0], [2.02, 2.23, 1.0]], `fill="#E8DFC8"`));
  L.anim('p1-flota', () => L.pj('plotty', 3.35, 2.75, 1.1, 'i', 1.6, 6.5));
}

export const SALAS = [
  { id: 'nuhome', nombre: 'Nu Home 360', rubro: 'Casas modulares', fn: nuhome, pos: [0.1, 0.1] },
  { id: 'fundos', nombre: 'Fundos 360', rubro: 'Venta de parcelas', fn: fundos, pos: [4.7, 0.1] },
  { id: 'haru', nombre: 'Haru 360', rubro: 'Restaurante de cocina japonesa', fn: haru, pos: [9.3, 0.1] },
  { id: 'eleven', nombre: 'Eleven 360', rubro: 'Gimnasio', fn: eleven, pos: [0.1, 5.6] },
  { id: 'rumbo', nombre: 'Rumbo', rubro: 'App de desarrollo personal', fn: rumbo, pos: [4.7, 5.6] },
  { id: 'libre', nombre: 'Tu proyecto aquí', rubro: 'Sala disponible', fn: libre, pos: [9.3, 5.6] }
];

// Piso 1 completo: tres salas atrás, el pasillo y tres salas adelante con muros bajos para ver adentro
export function piso1() {
  const E = escena(); E.txt = 1.05;
  E.losa(0, 0, 14, 10, 0);
  E.add(-900, E.poly([[0, 4.4, 0.012], [14, 4.4, 0.012], [14, 5.6, 0.012], [0, 5.6, 0.012]], `fill="#224F7B"`));
  const [px, py] = P(5.55, 4.6, 0.014);
  E.add(-890, `<g transform="matrix(${TW / 100},${TH / 100},${-TW / 100},${TH / 100},${r1(px)},${r1(py)})">${mono(0, 28, 'PISO 1 · PROYECTOS', 28, 'rgba(127,216,207,.55)', ' letter-spacing="3"')}</g>`);
  // Cada sala entera, de atrás hacia adelante (bases de profundidad bajo 5000: sobre eso van los carteles)
  [...SALAS].sort((a, b) => a.pos[0] + a.pos[1] - b.pos[0] - b.pos[1]).forEach((s, i) => s.fn(local(E, s.pos[0], s.pos[1], 0, s.pos[1] > 1, (i + 1) * 500)));
  // Carteles: los de atrás flotan sobre el muro; los de adelante, bajo el borde del piso
  for (const s of SALAS) {
    const atras = s.pos[1] < 1;
    E.cartel(s.pos[0] + W / 2, atras ? s.pos[1] : s.pos[1] + D + 0.1, atras ? HM + 1.0 : -1.15, s.nombre, { fs: 14, dash: s.id === 'libre', color: s.id === 'libre' ? C.cian2 : undefined });
  }
  // Zonas para la interfaz: caja [x0, y0, x1, y1, alto] y foco [x, y, z] de cada sala
  const zonas = SALAS.map(s => ({ id: s.id, nombre: s.nombre, caja: [s.pos[0], s.pos[1], s.pos[0] + W, s.pos[1] + D, s.pos[1] > 1 ? 0.45 : HM], foco: [s.pos[0] + W / 2, s.pos[1] + D / 2, 0.6] }));
  return { ...E.svg(20), zonas };
}
// Una sala sola, para el primer plano
export function salaSola(id) {
  const s = SALAS.find(x => x.id === id);
  const E = escena(); E.txt = 0.8;
  E.losa(-0.1, -0.1, W + 0.2, D + 0.2, 0);
  s.fn(local(E, 0, 0, 0));
  return E.svg(16);
}
