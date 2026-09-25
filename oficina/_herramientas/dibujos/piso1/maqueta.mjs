// Motor de maquetas isométricas (misma proyección que escena.js). Lo usa salas.mjs para dibujar el piso 1.
import { readFileSync } from 'fs';
const MED = JSON.parse(readFileSync(new URL('../cabezones/medidas.json', import.meta.url), 'utf8'));
const TW = 32, TH = 16, ZH = 39;
const r1 = (n) => Math.round(n * 10) / 10;
export const P = (x, y, z = 0) => [(x - y) * TW, (x + y) * TH - z * ZH];

const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mezcla = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const sombra = (c, t) => mezcla(c, '#061525', t);

export const C = {
  losa: '#163A60', losaIzq: '#0E2A47', losaDer: '#091D33', sala: '#1B4670', salaB: '#21507D', muro: '#2A5A88',
  planos: '#12506A', planosLinea: 'rgba(127,216,207,.35)', maquinas: '#2C323B', maquinasLinea: 'rgba(245,136,58,.45)',
  proy: '#17446F', proyTope: '#7FD8CF', cian: '#17C3B2', cian2: '#7FD8CF', naranjo: '#F5883A', niebla: '#F2F4F7',
  mesa: '#D5E2EE', pasto: '#12344F', camino: '#1D4A72', obra: '#E0B341', tinta: '#0B1726'
};

// Escena: junta piezas con su profundidad y lleva la cuenta de los bordes para el viewBox.
export function escena() {
  const piezas = [];
  const caja0 = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const marca = (x, y, z) => { const [a, b] = P(x, y, z); caja0.x0 = Math.min(caja0.x0, a); caja0.x1 = Math.max(caja0.x1, a); caja0.y0 = Math.min(caja0.y0, b); caja0.y1 = Math.max(caja0.y1, b); };
  const pts = (a) => a.map(([x, y, z]) => { marca(x, y, z); const q = P(x, y, z); return r1(q[0]) + ',' + r1(q[1]); }).join(' ');
  const poly = (a, attr) => `<polygon points="${pts(a)}" ${attr}/>`;
  let base = 0;
  const E = {
    piezas, poly, marca, txt: 1,
    // Nivel (piso): todo lo de un nivel se dibuja antes que lo del nivel de arriba
    nivel(n) { base = n * 100000; return E; },
    // k: profundidad (se dibuja de menor a mayor)
    add(k, svg) { piezas.push([k >= 5000 ? k + 900000 : k + base, piezas.length, svg]); return E; },
    caja(x, y, z, w, d, h, col, k) {
      const t = col.t || col, l = col.l || sombra(t, .22), r = col.r || sombra(t, .42);
      return E.add(k ?? (x + w + y + d) / 2 + z * 0.5,
        poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], `fill="${l}"`) +
        poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], `fill="${r}"`) +
        poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], `fill="${t}"`));
    },
    // Losa de piso con canto (se dibuja primero en su nivel)
    losa(x, y, w, d, z, col = C.losa, k) {
      return E.add(k ?? -1000, poly([[x, y + d, z - 0.3], [x + w, y + d, z - 0.3], [x + w, y + d, z], [x, y + d, z]], `fill="${C.losaIzq}"`) +
        poly([[x + w, y, z - 0.3], [x + w, y + d, z - 0.3], [x + w, y + d, z], [x + w, y, z]], `fill="${C.losaDer}"`) +
        poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], `fill="${col}"`));
    },
    // Piso de una sala con muros bajos atrás. estado: lista | disponible | obra
    sala(x0, y0, x1, y1, z, o = {}) {
      const g = 0.09, a = x0 + g, b = y0 + g, c = x1 - g, d = y1 - g, zz = z + 0.02;
      const k = o.k ?? -500 + (x0 + y0) * 0.01;
      let s = '';
      if (o.estado === 'disponible') {
        s += poly([[a, b, zz], [c, b, zz], [c, d, zz], [a, d, zz]], `fill="rgba(23,195,178,.07)" stroke="${C.cian2}" stroke-width="2" stroke-dasharray="7 6"`);
      } else if (o.estado === 'obra') {
        s += poly([[a, b, zz], [c, b, zz], [c, d, zz], [a, d, zz]], `fill="url(#obra-rayas)" stroke="${C.obra}" stroke-width="1.6"`);
      } else {
        s += poly([[a, b, zz], [c, b, zz], [c, d, zz], [a, d, zz]], `fill="${o.color || C.sala}"`);
        if (o.lineas) s += o.lineas;
      }
      const hm = o.muro ?? 0.32;
      if (hm > 0 && o.estado !== 'disponible') {
        const m = o.muroCol || C.muro;
        s += poly([[a, b, zz], [a, d, zz], [a, d, zz + hm], [a, b, zz + hm]], `fill="${sombra(m, .35)}"`);
        s += poly([[a, b, zz], [c, b, zz], [c, b, zz + hm], [a, b, zz + hm]], `fill="${sombra(m, .15)}"`);
      }
      return E.add(k, s);
    },
    // Texto de cartel, siempre de frente (en x, y, z de la escena)
    cartel(x, y, z, texto, o = {}) {
      const [px, py] = P(x, y, z); const t = String(texto);
      const fs = Math.round((o.fs || 17) * E.txt), w = Math.max(40, t.length * fs * 0.58 + 22), h = fs + 13;
      const fondo = o.fondo || 'rgba(9,29,51,.92)', borde = o.borde || C.cian2, color = o.color || C.niebla;
      marca(x, y, z);
      caja0.x0 = Math.min(caja0.x0, px - w / 2); caja0.x1 = Math.max(caja0.x1, px + w / 2); caja0.y0 = Math.min(caja0.y0, py - h / 2);
      return E.add(o.k ?? 5000, `<g transform="translate(${r1(px)} ${r1(py)})"><rect x="${r1(-w / 2)}" y="${r1(-h / 2)}" width="${r1(w)}" height="${h}" rx="${o.rx ?? 7}" fill="${fondo}" stroke="${borde}" stroke-width="${o.bw ?? 1.6}"${o.dash ? ' stroke-dasharray="5 4"' : ''}/><text x="0" y="${r1(fs * 0.36)}" text-anchor="middle" font-family="'Space Grotesk','DejaVu Sans',sans-serif" font-weight="600" font-size="${fs}" fill="${color}">${t.replace(/&/g, '&amp;')}</text></g>`);
    },
    // Personaje vectorial (definido una vez en el documento como #v-id)
    pj(id, x, y, z = 0, dir = 'd', e = 1.4, k) {
      const m = MED[id]; const [px, py] = P(x, y, z); const [fx, fy] = P(x, y, 0);
      const flota = z > 0;
      marca(x, y, z + (m.alto * e) / ZH);
      const sombraPiso = `<ellipse cx="${r1(fx)}" cy="${r1(fy)}" rx="${r1(e * (flota ? 8 : 11))}" ry="${r1(e * (flota ? 3 : 4))}" fill="#091D33" opacity="${flota ? .3 : .45}"/>`;
      return E.add(k ?? x + y + 0.2, sombraPiso + `<g transform="translate(${r1(px)} ${r1(py)}) scale(${dir === 'i' ? -e : e} ${e}) translate(${-m.cx} ${-m.pie})"><use href="#v-${id}"/></g>`);
    },
    // Cilindro vertical (torre, maceteros, mesas redondas)
    cilindro(x, y, z, r, h, top, lado, k) {
      const [cx, cb] = P(x, y, z), [, ct] = P(x, y, z + h), rx = r * TW * 1.41, ry = r * TH * 1.41;
      marca(x - r, y - r, z + h); marca(x + r, y + r, z);
      return E.add(k ?? x + y + 0.1, `<path d="M${r1(cx - rx)} ${r1(ct)}V${r1(cb)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(cb)}V${r1(ct)}Z" fill="${lado}"/><ellipse cx="${r1(cx)}" cy="${r1(ct)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${top}"/>`);
    },
    planta(x, y, z = 0, k, t = 1) {
      E.cilindro(x, y, z, 0.28 * t, 0.35 * t, '#C4D2E0', '#8FA3B8', k);
      const [cx, cy] = P(x, y, z + 0.75 * t);
      return E.add((k ?? x + y + 0.1) + 0.01, `<circle cx="${r1(cx - 5 * t)}" cy="${r1(cy + 2 * t)}" r="${r1(13 * t)}" fill="#168A86"/><circle cx="${r1(cx + 7 * t)}" cy="${r1(cy - 4 * t)}" r="${r1(11 * t)}" fill="#0A8A7E"/><circle cx="${r1(cx + t)}" cy="${r1(cy - 9 * t)}" r="${r1(9 * t)}" fill="#17C3B2"/>`);
    },
    // Losa o sala por venir: sólo el contorno punteado
    fantasma(x0, y0, x1, y1, z, k, o = {}) {
      const g = o.g ?? 0.09;
      return E.add(k ?? -600, E.poly([[x0 + g, y0 + g, z], [x1 - g, y0 + g, z], [x1 - g, y1 - g, z], [x0 + g, y1 - g, z]], `fill="${o.fill || 'rgba(127,216,207,.035)'}" stroke="rgba(127,216,207,.5)" stroke-width="1.6" stroke-dasharray="6 6"`));
    },
    svg(pad = 24, extra = '') {
      const vb = [caja0.x0 - pad, caja0.y0 - pad - 30, caja0.x1 - caja0.x0 + pad * 2, caja0.y1 - caja0.y0 + pad * 2 + 30].map(r1);
      const cuerpo = piezas.sort((p, q) => p[0] - q[0] || p[1] - q[1]).map(p => p[2]).join('');
      return { vb: vb.join(' '), svg: cuerpo + extra, ancho: vb[2], alto: vb[3] };
    }
  };
  return E;
}

