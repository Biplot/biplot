import { C, forma, plana, mancha, linea, tubo, suelo } from './tinta.mjs';

// Plotty · E0 · Calificación. El ícono de BiPlot que cobró vida: un dron con pantalla-cara de LED,
// dos rotores (el "Bi") y un núcleo de plasma cian. La antena se pone coral sólo cuando te invita a agendar.
// Marco 300×320.

const CARAS = {
  hola: [
    '............',
    '............',
    '...o....o...',
    '..o.o..o.o..',
    '............',
    '............',
    '.........o..',
    '..o.....o...',
    '...ooooo....',
    '............'
  ],
  atento: [
    '............',
    '............',
    '..oo....oo..',
    '..oo....oo..',
    '..oo....oo..',
    '............',
    '............',
    '....oooo....',
    '............',
    '............'
  ],
  pensando: [
    '............',
    '...oo....oo.',
    '...oo....oo.',
    '............',
    '............',
    '............',
    '............',
    '...o.o.o....',
    '............',
    '............'
  ],
  califica: [
    '............',
    '...o....o...',
    '..ooo..ooo..',
    '...o....o...',
    '............',
    '.o........o.',
    '.oo......oo.',
    '..oooooooo..',
    '...oooooo...',
    '............'
  ],
  bicho: [
    '............',
    '..o.o..o.o..',
    '...o....o...',
    '..o.o..o.o..',
    '............',
    '............',
    '..o...o...o.',
    '...o.o.o.o..',
    '....o...o...',
    '............'
  ],
  durmiendo: [
    '............',
    '............',
    '............',
    '..ooo..ooo..',
    '............',
    '............',
    '............',
    '.....oo.....',
    '............',
    '............'
  ],
  guino: [
    '............',
    '........oo..',
    '...o....oo..',
    '..o.o...oo..',
    '............',
    '............',
    '.........o..',
    '..o.....o...',
    '...ooooo....',
    '............'
  ]
};

export const ESTADOS = Object.keys(CARAS);

function pantalla(estado, id) {
  const cara = CARAS[estado] || CARAS.hola;
  const paso = 9, lado = 7.4;
  const x0 = 150 - 6 * paso + (paso - lado) / 2, y0 = 92;
  let apagados = '', prendidos = '';
  for (let f = 0; f < 10; f++) {
    for (let c = 0; c < 12; c++) {
      const x = (x0 + c * paso).toFixed(1), y = (y0 + f * paso).toFixed(1);
      if (cara[f][c] === 'o') prendidos += `<rect x="${x}" y="${y}" width="${lado}" height="${lado}" rx="2"/>`;
      else apagados += `<rect x="${x}" y="${y}" width="${lado}" height="${lado}" rx="2"/>`;
    }
  }
  const brillo = estado === 'durmiendo' ? '.45' : '1';
  return `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c426d"/><stop offset="1" stop-color="#0d2642"/></linearGradient>` +
    `<clipPath id="${id}-c"><rect x="90" y="84" width="120" height="104" rx="30"/></clipPath></defs>` +
    `<rect x="90" y="84" width="120" height="104" rx="30" fill="url(#${id}-g)"/>` +
    `<g clip-path="url(#${id}-c)"><g fill="${C.a700}" opacity=".55">${apagados}</g>` +
    `<g fill="${C.cian}" opacity="${brillo}" style="filter:drop-shadow(0 0 3px rgba(23,195,178,.9))">${prendidos}</g>` +
    `<path d="M92 116 L208 100 L208 84 L92 84 Z" fill="${C.blanco}" opacity=".06"/></g>` +
    `<rect x="90" y="84" width="120" height="104" rx="30" fill="none" stroke="#7fd8cf" stroke-width="2.6"/>`;
}

export function plotty(estado = 'hola', id = 'pl') {
  const agenda = estado === 'califica';
  const duerme = estado === 'durmiendo';
  let s = '';
  // Sombra y cono de luz del núcleo
  s += `<ellipse cx="150" cy="306" rx="${duerme ? 46 : 38}" ry="6" fill="${C.a900}" opacity=".55"/>`;
  s += `<defs><linearGradient id="${id}-cono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.cian}" stop-opacity=".45"/><stop offset="1" stop-color="${C.cian}" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="${id}-nucleo"><stop offset="0" stop-color="#E9FFFC"/><stop offset=".45" stop-color="${C.cian}"/><stop offset="1" stop-color="${C.cian}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}-coral"><stop offset="0" stop-color="#FFE3DB"/><stop offset=".5" stop-color="${C.coral}"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
  if (!duerme) s += `<path d="M138 240 L162 240 L186 304 L114 304 Z" fill="url(#${id}-cono)"/>`;

  const flota = duerme ? 'translate(0 8)' : '';
  s += `<g transform="${flota}">`;
  // Núcleo de plasma
  s += `<circle cx="150" cy="236" r="${duerme ? 16 : 26}" fill="url(#${id}-nucleo)" opacity="${duerme ? .4 : .9}"/>`;
  s += forma('M130 204 L170 204 L166 224 C160 230 140 230 134 224 Z', C.a300, 2.4);
  s += `<circle cx="150" cy="236" r="10" fill="${duerme ? C.c700 : C.cian}" stroke="${C.tinta}" stroke-width="2.4"/>`;
  s += `<circle cx="147" cy="233" r="3" fill="${C.blanco}" opacity="${duerme ? .4 : .9}"/>`;
  s += `<ellipse cx="150" cy="236" rx="19" ry="5" fill="none" stroke="${C.c300}" stroke-width="2" opacity=".8" transform="rotate(-12 150 236)"/>`;

  // Rotores (el "Bi"): brazos y hélices
  s += tubo('M92 76 L70 52', C.a300, 5, 2.2);
  s += tubo('M208 76 L230 52', C.a300, 5, 2.2);
  s += `<circle cx="70" cy="50" r="6" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2"/><circle cx="230" cy="50" r="6" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2"/>`;
  if (duerme) {
    s += plana('M48 48 L92 52 L92 56 L48 52 Z', C.a300, 1.6) + plana('M208 52 L252 48 L252 52 L208 56 Z', C.a300, 1.6);
  } else {
    s += `<ellipse cx="70" cy="46" rx="30" ry="5.5" fill="${C.c100}" opacity=".55" stroke="${C.tinta}" stroke-width="1.4"/>`;
    s += `<ellipse cx="230" cy="46" rx="30" ry="5.5" fill="${C.c100}" opacity=".55" stroke="${C.tinta}" stroke-width="1.4"/>`;
    s += linea('M50 46 L90 46 M210 46 L250 46', 2, C.a600, ' opacity=".7"');
  }

  // Antena con la punta que se enciende
  s += linea('M150 62 L150 34', 5.5) + linea('M150 62 L150 34', 2.6, C.a300);
  if (agenda) s += `<circle cx="150" cy="28" r="20" fill="url(#${id}-coral)"/>`;
  s += `<circle cx="150" cy="28" r="7.5" fill="${agenda ? C.coral : (duerme ? C.a600 : C.c300)}" stroke="${C.tinta}" stroke-width="2.2"/>`;
  s += `<circle cx="147.5" cy="25.5" r="2.2" fill="${C.blanco}" opacity=".85"/>`;

  // Carcasa (el ícono): squircle niebla con pantalla
  s += forma('M74 110 C74 76 92 62 122 62 L178 62 C208 62 226 76 226 110 L226 162 C226 194 208 208 178 208 L122 208 C92 208 74 194 74 162 Z', C.niebla, 3);
  s += mancha('M212 80 C222 90 226 100 226 112 L226 162 C226 194 208 208 178 208 L122 208 C104 208 90 202 82 190 C96 198 112 200 130 200 L176 200 C200 200 214 188 216 164 L216 110 C216 98 216 88 212 80 Z', C.a200);
  s += linea('M88 96 C92 80 104 72 118 70', 3, C.blanco, ' opacity=".9"');
  s += pantalla(estado, id);
  // Placa grabada
  s += `<text x="150" y="201" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="8.5" letter-spacing="1.5" fill="${C.a600}">PLOTTY · E0</text>`;

  // Manos flotantes
  if (estado === 'hola' || estado === 'guino') {
    s += forma('M232 118 C232 106 250 106 250 118 C250 130 232 130 232 118 Z', C.niebla, 2.4);
    s += linea('M254 104 C258 100 260 96 260 92 M256 116 L264 114', 2, C.c300);
    s += forma('M50 170 C50 160 66 160 66 170 C66 180 50 180 50 170 Z', C.niebla, 2.4);
  } else if (agenda) {
    s += forma('M236 158 C236 148 252 148 252 158 C252 168 236 168 236 158 Z', C.niebla, 2.4);
    s += forma('M250 154 L272 150 C276 150 276 158 272 158 L252 162 Z', C.niebla, 2);
    s += forma('M48 160 C48 150 64 150 64 160 C64 170 48 170 48 160 Z', C.niebla, 2.4);
  } else if (estado === 'pensando') {
    s += forma('M110 222 C110 212 126 212 126 222 C126 232 110 232 110 222 Z', C.niebla, 2.4);
    s += forma('M236 168 C236 158 252 158 252 168 C252 178 236 178 236 168 Z', C.niebla, 2.4);
  } else if (estado === 'bicho') {
    s += forma('M50 110 C50 100 66 100 66 110 C66 120 50 120 50 110 Z', C.niebla, 2.4);
    s += forma('M234 110 C234 100 250 100 250 110 C250 120 234 120 234 110 Z', C.niebla, 2.4);
    s += linea('M44 92 L38 84 M58 90 L60 80 M240 90 L238 80 M256 92 L262 84', 2, C.c300);
  } else if (!duerme) {
    s += forma('M50 168 C50 158 66 158 66 168 C66 178 50 178 50 168 Z', C.niebla, 2.4);
    s += forma('M234 168 C234 158 250 158 250 168 C250 178 234 178 234 168 Z', C.niebla, 2.4);
  }
  if (duerme) {
    s += `<text x="236" y="96" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="22" fill="${C.c300}">z</text>`;
    s += `<text x="252" y="74" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="16" fill="${C.c300}" opacity=".7">z</text>`;
  }
  if (estado === 'pensando') {
    s += `<circle cx="240" cy="92" r="4" fill="${C.c300}"/><circle cx="252" cy="76" r="6" fill="${C.c300}"/><circle cx="268" cy="56" r="9" fill="${C.c300}"/>`;
  }
  s += '</g>';
  return s;
}

// Ruta B · Orbe de plasma: esfera de vidrio con el núcleo adentro, visor de LED y un anillo con dos rotores.
export function plottyOrbe(id = 'pb') {
  let s = `<defs><radialGradient id="${id}-n"><stop offset="0" stop-color="#E9FFFC"/><stop offset=".35" stop-color="${C.cian}" stop-opacity=".9"/><stop offset="1" stop-color="${C.cian}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}-v" cx=".35" cy=".3"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".5"/><stop offset=".6" stop-color="${C.c100}" stop-opacity=".18"/><stop offset="1" stop-color="${C.a600}" stop-opacity=".35"/></radialGradient></defs>`;
  s += `<ellipse cx="150" cy="306" rx="40" ry="6" fill="${C.a900}" opacity=".55"/>`;
  // anillo de atrás
  s += `<ellipse cx="150" cy="170" rx="112" ry="26" fill="none" stroke="${C.tinta}" stroke-width="9" transform="rotate(-10 150 170)"/>`;
  s += `<ellipse cx="150" cy="170" rx="112" ry="26" fill="none" stroke="${C.a300}" stroke-width="4.5" transform="rotate(-10 150 170)"/>`;
  // esfera
  s += `<circle cx="150" cy="160" r="78" fill="${C.a800}" stroke="${C.tinta}" stroke-width="3"/>`;
  s += `<circle cx="150" cy="176" r="52" fill="url(#${id}-n)"/>`;
  s += linea('M122 196 C132 176 140 204 150 184 C160 164 168 196 178 176', 2, C.c300, ' opacity=".8"');
  s += `<circle cx="150" cy="186" r="12" fill="${C.cian}" stroke="${C.tinta}" stroke-width="2"/>`;
  s += `<circle cx="150" cy="160" r="78" fill="url(#${id}-v)"/>`;
  // visor
  s += forma('M86 118 C110 100 190 100 214 118 L208 146 C186 134 114 134 92 146 Z', C.a900, 2.6);
  s += `<g fill="${C.cian}" style="filter:drop-shadow(0 0 3px rgba(23,195,178,.9))"><rect x="120" y="116" width="8" height="8" rx="2"/><rect x="128" y="112" width="8" height="8" rx="2"/><rect x="136" y="116" width="8" height="8" rx="2"/>` +
    `<rect x="160" y="116" width="8" height="8" rx="2"/><rect x="168" y="112" width="8" height="8" rx="2"/><rect x="176" y="116" width="8" height="8" rx="2"/></g>`;
  s += linea('M104 76 C116 64 132 58 146 58', 4, C.blanco, ' opacity=".7"');
  // anillo de adelante con los dos rotores
  s += `<path d="M40 190 C60 214 250 184 262 150" fill="none" stroke="${C.tinta}" stroke-width="9"/>`;
  s += `<path d="M40 190 C60 214 250 184 262 150" fill="none" stroke="${C.a300}" stroke-width="4.5"/>`;
  s += `<circle cx="44" cy="190" r="9" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2"/><ellipse cx="44" cy="180" rx="22" ry="4" fill="${C.c100}" opacity=".6" stroke="${C.tinta}" stroke-width="1.2"/>`;
  s += `<circle cx="258" cy="152" r="9" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2"/><ellipse cx="258" cy="142" rx="22" ry="4" fill="${C.c100}" opacity=".6" stroke="${C.tinta}" stroke-width="1.2"/>`;
  return s;
}

// Ruta C · Mini-dron: cuerpo redondo con cuatro rotores, cara redonda de LED y patas de aterrizaje.
export function plottyDron(id = 'pc') {
  let s = `<ellipse cx="150" cy="306" rx="46" ry="6" fill="${C.a900}" opacity=".55"/>`;
  // brazos en X y rotores
  s += tubo('M110 120 L62 84 M190 120 L238 84 M112 196 L64 226 M188 196 L236 226', C.a600, 7, 2.2);
  [[62, 84], [238, 84], [64, 226], [236, 226]].forEach(([x, y]) => {
    s += `<circle cx="${x}" cy="${y}" r="9" fill="${C.a300}" stroke="${C.tinta}" stroke-width="2"/>`;
    s += `<ellipse cx="${x}" cy="${y - 9}" rx="30" ry="5" fill="${C.c100}" opacity=".55" stroke="${C.tinta}" stroke-width="1.2"/>`;
  });
  // patas
  s += linea('M122 216 L110 262 M178 216 L190 262', 5.5) + linea('M122 216 L110 262 M178 216 L190 262', 2.6, C.a300);
  s += linea('M92 262 L128 262 M172 262 L208 262', 6) + linea('M92 262 L128 262 M172 262 L208 262', 3, C.a300);
  // cuerpo
  s += `<circle cx="150" cy="160" r="66" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="3"/>`;
  s += mancha('M196 112 C212 128 218 150 214 172 C208 200 186 222 158 226 C188 212 206 186 206 158 C206 140 202 124 196 112 Z', C.a200);
  s += `<circle cx="150" cy="156" r="46" fill="#123459" stroke="#7fd8cf" stroke-width="2.6"/>`;
  s += `<g fill="${C.cian}" style="filter:drop-shadow(0 0 3px rgba(23,195,178,.9))"><rect x="128" y="138" width="8" height="12" rx="3"/><rect x="164" y="138" width="8" height="12" rx="3"/>` +
    `<rect x="130" y="166" width="7" height="7" rx="2"/><rect x="138" y="172" width="7" height="7" rx="2"/><rect x="146" y="172" width="7" height="7" rx="2"/><rect x="154" y="170" width="7" height="7" rx="2"/><rect x="162" y="164" width="7" height="7" rx="2"/></g>`;
  s += `<circle cx="150" cy="94" r="6" fill="${C.c300}" stroke="${C.tinta}" stroke-width="2"/>`;
  return s;
}
