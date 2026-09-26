import { C, forma, plana, mancha, linea } from './tinta.mjs';

// Atlas · la mascota de The Architect. Un orbe de vidrio con un globo terráqueo de líneas y un corazón de plasma,
// visor de LED y un anillo en órbita con dos satélites. Ve la oficina entera desde arriba: su placa dice 360°.
// Marco 300×320 (igual que Plotty).

export const ESTADOS_ATLAS = ['mira', 'feliz', 'proyecta', 'escanea', 'encuentra', 'cielo'];

const px = (celdas, color = C.cian) => celdas.map(([x, y]) => `<rect x="${x}" y="${y}" width="5.4" height="5.4" rx="1.4" fill="${color}"/>`).join('');

function ojos(estado) {
  const I = 116, D = 166, Y = 126; // esquina de cada ojo
  const bloque = (x, y) => [[x, y], [x + 6.4, y], [x, y + 6.4], [x + 6.4, y + 6.4]];
  switch (estado) {
    case 'feliz':
      return px([[I + 6.4, Y], [I, Y + 6.4], [I + 12.8, Y + 6.4], [D + 6.4, Y], [D, Y + 6.4], [D + 12.8, Y + 6.4]]);
    case 'proyecta':
      return px([...bloque(I + 3, Y + 7), ...bloque(D + 3, Y + 7)]);
    case 'escanea': {
      const fila = [];
      for (let x = 96; x <= 198; x += 6.4) fila.push([x, Y + 5]);
      return px(fila) + px([[I + 3, Y - 2], [D + 3, Y - 2]], C.c300);
    }
    case 'encuentra':
      return px(bloque(I + 3, Y)) +
        `<g stroke="${C.cian}" stroke-width="2.2" fill="none"><circle cx="${D + 9.5}" cy="${Y + 6}" r="7.5"/><path d="M${D + 9.5} ${Y - 4} V${Y + 16} M${D - 0.5} ${Y + 6} H${D + 19.5}"/></g>`;
    case 'cielo':
      return px([[I, Y + 6.4], [I + 6.4, Y + 6.4], [I + 12.8, Y + 6.4], [D, Y + 6.4], [D + 6.4, Y + 6.4], [D + 12.8, Y + 6.4]]).replace(/fill="#17C3B2"/g, `fill="${C.c300}" opacity=".6"`);
    default:
      return px([...bloque(I + 3, Y), ...bloque(D + 3, Y)]);
  }
}

// Cruz del Sur (cielo de Chile) alrededor del orbe.
function cruzDelSur() {
  const estrella = (x, y, r) => `<path d="M${x} ${y - r} L${x + r * .28} ${y - r * .28} L${x + r} ${y} L${x + r * .28} ${y + r * .28} L${x} ${y + r} L${x - r * .28} ${y + r * .28} L${x - r} ${y} L${x - r * .28} ${y - r * .28} Z" fill="${C.niebla}"/>`;
  let s = `<g opacity=".95">`;
  s += linea('M232 34 L240 96 M214 70 L262 62', 1, C.c300, ' opacity=".35" stroke-dasharray="2 4"');
  s += estrella(232, 34, 7) + estrella(240, 96, 8.5) + estrella(214, 70, 6) + estrella(262, 62, 6.5) + estrella(246, 74, 3.5);
  [[40, 60, 3], [62, 30, 2.4], [30, 120, 2.6], [276, 150, 2.4], [58, 250, 2.2], [262, 236, 2.8], [96, 36, 2]].forEach(([x, y, r]) => {
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.c300}"/>`;
  });
  return s + '</g>';
}

export function atlas(estado = 'mira', id = 'at') {
  const noche = estado === 'cielo';
  const cx = 150, cy = 158, R = 74;
  const rot = -12, rx = 118, ry = 27, ay = 172;
  const t = rot * Math.PI / 180;
  const izq = [cx - rx * Math.cos(t), ay - rx * Math.sin(t)], der = [cx + rx * Math.cos(t), ay + rx * Math.sin(t)];
  const f = (n) => n.toFixed(1);
  let s = `<defs>` +
    `<radialGradient id="${id}-plasma" cx=".5" cy=".58" r=".55"><stop offset="0" stop-color="#E9FFFC"/><stop offset=".22" stop-color="${C.cian}" stop-opacity=".95"/><stop offset=".7" stop-color="${C.cian}" stop-opacity=".25"/><stop offset="1" stop-color="${C.cian}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}-vidrio" cx=".32" cy=".26" r=".85"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".42"/><stop offset=".35" stop-color="${C.c100}" stop-opacity=".12"/><stop offset=".8" stop-color="#0A1B2E" stop-opacity=".1"/><stop offset="1" stop-color="#0A1B2E" stop-opacity=".45"/></radialGradient>` +
    `<linearGradient id="${id}-haz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.cian}" stop-opacity=".5"/><stop offset="1" stop-color="${C.cian}" stop-opacity=".05"/></linearGradient>` +
    `<clipPath id="${id}-esfera"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`;

  if (noche) s += cruzDelSur();
  // Sombra en el suelo
  s += `<ellipse cx="150" cy="306" rx="${noche ? 34 : 42}" ry="6" fill="${C.a900}" opacity=".55"/>`;
  if (!noche && estado !== 'proyecta') s += `<ellipse cx="150" cy="304" rx="26" ry="4" fill="${C.cian}" opacity=".18"/>`;

  // Haz que proyecta el mapa sobre la mesa
  if (estado === 'proyecta') {
    s += `<path d="M134 226 L166 226 L236 292 L64 292 Z" fill="url(#${id}-haz)"/>`;
    s += `<ellipse cx="150" cy="292" rx="90" ry="15" fill="${C.cian}" opacity=".16" stroke="${C.c300}" stroke-width="1.4"/>`;
    s += linea('M86 294 L114 286 L136 296 L162 284 L188 292 L214 286', 2, C.c300);
    [[86, 294], [114, 286], [136, 296], [162, 284], [188, 292], [214, 286]].forEach(([x, y], i) => {
      s += `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" rx="1.8" fill="${i === 3 ? C.niebla : C.cian}"/>`;
    });
  }
  // Haz de escaneo hacia adelante
  if (estado === 'escanea') s += `<path d="M206 140 L292 96 L292 196 Z" fill="${C.cian}" opacity=".12"/>` + linea('M206 140 L292 146', 1.6, C.c300, ' opacity=".7" stroke-dasharray="3 4"');

  // Anillo en órbita: mitad de atrás
  s += `<ellipse cx="${cx}" cy="${ay}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${ay})" fill="none" stroke="${C.tinta}" stroke-width="10"/>`;
  s += `<ellipse cx="${cx}" cy="${ay}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${ay})" fill="none" stroke="${C.a300}" stroke-width="5"/>`;

  // Esfera de vidrio con el globo y el plasma
  s += `<circle cx="${f(cx + 1.4)}" cy="${f(cy + 1.8)}" r="${R + 1.6}" fill="${C.tinta}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#123F66"/>`;
  s += `<g clip-path="url(#${id}-esfera)">`;
  s += `<circle cx="${cx}" cy="${cy + 8}" r="${noche ? 44 : 62}" fill="url(#${id}-plasma)" opacity="${noche ? .55 : 1}"/>`;
  // Meridianos y paralelos
  s += `<g fill="none" stroke="${C.c300}" stroke-width="1.3" opacity=".42">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="26" ry="${R}"/><ellipse cx="${cx}" cy="${cy}" rx="52" ry="${R}"/><path d="M${cx} ${cy - R} V${cy + R}"/>` +
    `<ellipse cx="${cx}" cy="${cy - 36}" rx="64" ry="9"/><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="12"/><ellipse cx="${cx}" cy="${cy + 36}" rx="64" ry="9"/></g>`;
  // Filamentos de plasma
  s += linea(`M118 196 C130 176 140 206 150 186 C160 166 170 198 182 176`, 2, C.c300, ` opacity="${noche ? .4 : .85}"`);
  s += linea(`M126 170 C136 184 146 160 156 176 C164 188 172 168 178 180`, 1.4, C.niebla, ` opacity="${noche ? .25 : .6}"`);
  s += `<circle cx="${cx}" cy="${cy + 20}" r="9.5" fill="${noche ? C.c700 : C.niebla}" stroke="${C.tinta}" stroke-width="1.8"/>`;
  s += `<circle cx="${cx}" cy="${cy + 20}" r="4.5" fill="${C.cian}"/>`;
  s += `</g>`;
  // Visor de LED
  s += forma('M82 122 C110 106 190 106 218 122 L214 150 C188 138 112 138 86 150 Z', '#0A1B2E', 2.4);
  s += ojos(estado);
  s += `<path d="M90 124 C114 112 186 112 210 124" fill="none" stroke="${C.blanco}" stroke-width="1.4" opacity=".25"/>`;
  // Vidrio encima
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}-vidrio)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.tinta}" stroke-width="3"/>`;
  s += linea('M100 108 C110 96 124 88 140 86', 4, C.blanco, ' opacity=".8"');
  s += `<circle cx="96" cy="118" r="3" fill="${C.blanco}" opacity=".7"/>`;

  // Anillo: mitad de adelante (pasa por delante de la esfera)
  const frente = `M${f(izq[0])} ${f(izq[1])} A${rx} ${ry} ${rot} 0 0 ${f(der[0])} ${f(der[1])}`;
  s += `<path d="${frente}" fill="none" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/>`;
  s += `<path d="${frente}" fill="none" stroke="${C.a300}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<path d="${frente}" fill="none" stroke="${C.niebla}" stroke-width="1.4" stroke-linecap="round" opacity=".7" transform="translate(0 -1.4)"/>`;
  // Dos satélites en los extremos del anillo
  [izq, der].forEach(([x, y]) => {
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="11" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2.4"/>`;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="4.6" fill="${noche ? C.c700 : C.cian}"/>`;
    s += `<circle cx="${f(x - 3)}" cy="${f(y - 3.4)}" r="2" fill="${C.blanco}" opacity=".7"/>`;
  });
  // Placa 360° colgando del anillo
  const bx = cx - 2, by = ay + ry - 2;
  s += `<g transform="rotate(${rot / 2} ${bx} ${by})"><rect x="${bx - 17}" y="${by}" width="34" height="17" rx="4" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="2"/>` +
    `<text x="${bx}" y="${by + 12.5}" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="10" fill="${C.a800}">360°</text></g>`;
  return s;
}
