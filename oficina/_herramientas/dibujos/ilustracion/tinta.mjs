// Kit de dibujo del elenco BiPlot HQ: tinta, tubos, credenciales y utilidades compartidas.
export const C = {
  tinta: '#0B1726',
  niebla: '#F2F4F7', blanco: '#FFFFFF',
  a900: '#091D33', a800: '#0E2A47', a700: '#17446F', a600: '#35679A', a500: '#4F6F95',
  a400: '#6B7A8C', a300: '#B9C8D8', a200: '#C4D2E0', a150: '#D5E2EE', a50: '#EDF1F5',
  cian: '#17C3B2', c800: '#077068', c700: '#0A8A7E', c300: '#7FD8CF', c100: '#DDF4F1',
  coral: '#FF6B4A',
  papel: '#F4ECD8', arena: '#E8DFC8', arenaS: '#CFC2A3',
  grafito: '#1F2733', grafitoS: '#141A23', gris: '#8E99A8', grisS: '#6F7A89',
  // pieles
  p1: '#F3CFB0', p1s: '#DDAE8C',
  p2: '#E0AC82', p2s: '#C48C63',
  p3: '#C68A5E', p3s: '#A56E45',
  p4: '#98613D', p4s: '#7A4A2B',
  p5: '#7E4E30', p5s: '#633A22',
  mejilla: 'rgba(214, 96, 80, .28)'
};

const T = C.tinta;
export const R = (n) => Math.round(n * 10) / 10;

// Forma con contorno de tinta.
// Con peso: una copia en tinta desplazada abajo-derecha engrosa ese lado del trazo, como entintado a mano.
export function forma(d, fill, w = 2.6, extra = '', peso = true) {
  const sombra = peso && fill !== 'none'
    ? `<path d="${d}" fill="${T}" stroke="${T}" stroke-width="${R(w + 1.6)}" stroke-linejoin="round" transform="translate(1.3 1.6)"/>`
    : '';
  return sombra + `<path d="${d}" fill="${fill}" stroke="${T}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
}
// Forma sin peso extra (detalles interiores).
export function plana(d, fill, w = 2.2, extra = '') { return forma(d, fill, w, extra, false); }
// Forma sin contorno (sombras, brillos).
export function mancha(d, fill, extra = '') {
  return `<path d="${d}" fill="${fill}"${extra}/>`;
}
// Línea de tinta.
export function linea(d, w = 2.4, color = T, extra = '') {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
}
// Tubo con borde (brazos, mechones, cables): tinta debajo, color encima.
export function tubo(d, color, w, borde = 2.6) {
  return `<g transform="translate(1.2 1.5)">${linea(d, w + borde * 2 + 0.6, T)}</g>` + linea(d, w + borde * 2, T) + linea(d, w, color);
}
// Credencial con cordón cian. (x, y) es la esquina superior del centro de la placa.
export function credencial(x, y, codigo, cordon, s = 1) {
  let out = '<g class="hq-placa">';
  if (cordon) out += linea(cordon, 2.6, C.cian);
  out += `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<rect x="-12" y="0" width="24" height="31" rx="3.5" fill="${C.niebla}" stroke="${T}" stroke-width="2"/>` +
    `<path d="M-12 9 V3.5 a3.5 3.5 0 0 1 3.5 -3.5 H8.5 a3.5 3.5 0 0 1 3.5 3.5 V9 Z" fill="${C.a800}"/>` +
    `<circle cx="6.5" cy="4.5" r="1.8" fill="${C.cian}"/>` +
    `<text x="0" y="24" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="9.5" fill="${C.a800}">${codigo}</text>` +
    `</g></g>`;
  return out;
}
// Sombra del suelo.
export function suelo(cx, cy, rx) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${R(rx * 0.12)}" fill="${C.a900}" opacity=".5"/>`;
}
// Ojo con párpado pesado: (cx, cy) centro, a ancho, h alto, px/py desplazamiento de pupila, lid 0..1 cuánto cubre el párpado.
export function ojo(cx, cy, a, h, px = 0, py = 0, lid = 0.35, piel = '#E0AC82', pr = null) {
  const x0 = cx - a / 2, x1 = cx + a / 2;
  const blanco = `M${x0} ${cy} Q${cx} ${cy - h} ${x1} ${cy} Q${cx} ${cy + h * 0.9} ${x0} ${cy} Z`;
  const r = pr || Math.min(a, h) * 0.34;
  const ly = cy - h + h * 2 * lid; // alto del borde del párpado
  const parpado = `M${x0 - 1} ${cy} Q${cx} ${ly - h * 0.35} ${x1 + 1} ${cy}`;
  const id = `o${Math.round(cx * 7 + cy * 13)}`;
  return `<g class="hq-ojo"><clipPath id="${id}"><path d="${blanco}"/></clipPath>` +
    `<path d="${blanco}" fill="${C.blanco}"/>` +
    `<g clip-path="url(#${id})"><circle cx="${R(cx + px)}" cy="${R(cy + py)}" r="${R(r)}" fill="${T}"/>` +
    `<circle cx="${R(cx + px - r * 0.35)}" cy="${R(cy + py - r * 0.4)}" r="${R(r * 0.32)}" fill="${C.blanco}"/>` +
    (lid > 0 ? `<path d="M${x0 - 2} ${cy - h - 4} H${x1 + 2} V${R(ly)} Q${cx} ${R(ly + h * 0.5)} ${x0 - 2} ${R(ly)} Z" fill="${piel}"/>` : '') +
    `</g>` +
    `<path d="${blanco}" fill="none" stroke="${T}" stroke-width="1.6"/>` +
    linea(lid > 0 ? `M${x0 - 2} ${R(ly + (cy - ly) * 0.15)} Q${cx} ${R(ly + h * 0.35)} ${x1 + 2} ${R(ly + (cy - ly) * 0.15)}` : `M${x0 - 1} ${cy} Q${cx} ${cy - h - 0.5} ${x1 + 1} ${cy}`, 2.8) +
    `</g>`;
}
// Credencial ancha para textos largos (PRENSA).
export function credencialAncha(x, y, texto, cordon, s = 1) {
  let out = '<g class="hq-placa">';
  if (cordon) out += linea(cordon, 2.6, C.cian);
  out += `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<rect x="-21" y="0" width="42" height="28" rx="3.5" fill="${C.niebla}" stroke="${T}" stroke-width="2"/>` +
    `<path d="M-21 8 V3.5 a3.5 3.5 0 0 1 3.5 -3.5 H17.5 a3.5 3.5 0 0 1 3.5 3.5 V8 Z" fill="${C.a800}"/>` +
    `<circle cx="15" cy="4.2" r="1.8" fill="${C.cian}"/>` +
    `<text x="0" y="21.5" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="8.2" letter-spacing=".4" fill="${C.a800}">${texto}</text>` +
    `</g></g>`;
  return out;
}
