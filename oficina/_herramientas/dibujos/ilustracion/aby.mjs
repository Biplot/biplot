import { C, forma, plana, mancha, linea, tubo, credencialAncha, suelo } from './tinta.mjs';

// Aby · La corresponsal (community manager). La única cara real de BiPlot HQ.
// Rasgos: ondas largas con balayage (raíz castaña, largos miel), sonrisa amplia,
// ojos cafés almendrados, cejas arqueadas, aros dorados. Dos vestuarios: elegante y urbano.

const P = { piel: C.p1, pielS: C.p1s };
const PELO = { base: '#C9924E', sombra: '#8E6236', raiz: '#7A5334', luz: '#EBC98F', brillo: '#F4DDA8' };
const ORO = '#D9A441', ORO_S = '#A87A22', LABIO = '#D24E63';

function peloAtras() {
  let s = forma('M150 50 C178 50 196 70 192 100 C198 124 204 148 198 176 C206 200 208 228 198 254 C192 268 176 268 168 256 L132 256 C124 268 108 268 102 254 C92 228 94 200 102 176 C96 148 102 124 108 100 C104 70 122 50 150 50 Z', PELO.base);
  s += mancha('M182 110 C192 130 198 152 194 176 C202 200 204 226 196 250 C192 258 184 262 178 258 C188 236 190 206 180 180 C186 156 186 132 182 110 Z', PELO.sombra);
  s += mancha('M100 236 C102 248 110 258 120 256 L132 256 C124 266 110 266 102 254 Z', PELO.luz);
  s += mancha('M200 236 C198 248 190 258 180 256 L168 256 C176 266 190 266 198 254 Z', PELO.luz);
  s += linea('M108 190 C100 210 102 230 108 246 M192 186 C200 208 198 232 190 248', 2, PELO.luz, ' opacity=".8"');
  return s;
}

function cara() {
  const { piel, pielS } = P;
  let s = '';
  // Cuello largo
  s += forma('M141 136 L159 136 L160 172 C154 178 146 178 140 172 Z', piel);
  s += mancha('M152 138 L159 138 L159 170 C156 174 154 174 152 173 Z', pielS);
  // Rostro ovalado
  s += forma('M122 102 C121 74 179 72 179 102 C179 125 167 143 150 147 C133 143 121 125 122 102 Z', piel);
  s += mancha('M166 80 C176 86 179 94 179 104 C179 125 167 143 150 147 C161 137 169 125 171 111 C173 99 172 88 166 80 Z', pielS);
  s += `<ellipse cx="131" cy="120" rx="7" ry="4" fill="${C.mejilla}"/><ellipse cx="169" cy="120" rx="7" ry="4" fill="${C.mejilla}"/>`;
  // Ojos almendrados que sonríen, pestañas con cola
  const ojo = (cx, lado) => {
    const x0 = cx - 8, x1 = cx + 8;
    return `<path d="M${x0} 106 Q${cx} 100 ${x1} 106 Q${cx} 110.5 ${x0} 106 Z" fill="${C.blanco}"/>` +
      `<circle cx="${cx + 0.6}" cy="105.6" r="3.6" fill="#3B2418"/><circle cx="${cx - 0.4}" cy="104.4" r="1.2" fill="${C.blanco}"/>` +
      linea(`M${x0 - 1} 106 Q${cx} 98.5 ${x1 + 1} 105`, 2.8) +
      linea(lado < 0 ? `M${x0 - 1} 106 L${x0 - 5} 102.5` : `M${x1 + 1} 105 L${x1 + 5} 101.5`, 2.2) +
      linea(`M${x0 + 2} 109.5 Q${cx} 112.5 ${x1 - 2} 109.5`, 1.3, P.pielS);
  };
  s += ojo(137, -1) + ojo(163, 1);
  // Cejas arqueadas
  s += linea('M127 96 Q135 90 145 94', 3.2, '#4A3222');
  s += linea('M155 94 Q165 90 173 96', 3.2, '#4A3222');
  // Nariz fina
  s += linea('M151 106 C151 113 149 117 147 119 C149 121 153 121 155 119', 2);
  // Sonrisa amplia con dientes
  s += forma('M139.5 127 Q150 124 160.5 127 Q157.5 136.5 150 137.5 Q142.5 136.5 139.5 127 Z', '#7A2A30', 1.6, '', false);
  s += mancha('M141.5 127.6 Q150 125.6 158.5 127.6 L157.4 130.6 Q150 131.8 142.6 130.6 Z', C.blanco);
  s += linea('M139.5 127 Q145 125 150 126 Q155 125 160.5 127', 2.2, LABIO);
  s += linea('M142.5 133.2 Q150 139 157.5 133.2', 2.8, LABIO);
  s += linea('M138.6 126.2 L137 124.6 M161.4 126.2 L163 124.6', 1.3, P.pielS);
  return s;
}

function peloFrente(clip = false) {
  let s = '';
  // Raíz más oscura y partidura casi al medio
  s += forma('M114 98 C112 70 130 52 150 52 C170 52 188 70 186 98 C182 90 176 82 168 78 C160 75 154 76 150 81 C146 76 140 75 132 78 C124 82 118 90 114 98 Z', PELO.raiz, 2.4);
  s += mancha('M122 70 C132 60 142 56 150 56 C142 62 136 70 132 78 C126 80 120 86 118 90 C118 82 120 76 122 70 Z', PELO.base, ' opacity=".55"');
  s += mancha('M178 70 C168 60 158 56 150 56 C158 62 164 70 168 78 C174 80 180 86 182 90 C182 82 180 76 178 70 Z', PELO.base, ' opacity=".55"');
  s += linea('M150 56 C150 64 150 72 150 80', 1.4, '#4A3222');
  s += linea('M138 60 C132 66 128 74 126 82 M162 60 C168 66 172 74 174 82', 1.4, PELO.luz, ' opacity=".8"');
  // Mechón izquierdo (espectador): enmarca la cara y cae al hombro
  s += forma('M146 60 C128 60 114 74 112 98 C110 118 106 136 110 152 C114 166 108 178 102 190 C98 200 102 210 110 212 C107 200 112 192 118 180 C124 168 121 152 120 136 C119 118 119 100 126 86 C132 76 140 66 146 60 Z', PELO.base);
  s += mancha('M146 60 C136 64 126 70 120 80 C116 90 114 100 114 110 C120 94 130 78 146 64 Z', PELO.raiz, ' opacity=".85"');
  // Mechón derecho: más largo, cae por delante del hombro hasta el pecho
  s += forma('M154 60 C172 60 186 74 188 98 C190 118 194 134 190 150 C186 166 194 182 200 196 C206 212 200 230 190 240 C193 226 189 214 181 204 C173 192 180 176 180 160 C180 140 181 118 176 96 C172 82 162 68 154 60 Z', PELO.base);
  s += mancha('M154 60 C164 64 174 70 180 80 C184 90 186 100 186 110 C180 94 170 78 154 64 Z', PELO.raiz, ' opacity=".85"');
  s += mancha('M184 150 C190 166 198 184 200 200 C202 214 198 226 192 234 C194 216 188 204 184 196 C180 184 184 168 184 150 Z', PELO.sombra, ' opacity=".7"');
  // Puntas más claras (balayage)
  s += mancha('M104 192 C100 200 102 208 110 212 C108 204 110 198 114 190 Z', PELO.luz);
  s += mancha('M196 206 C200 218 198 230 190 240 C192 230 190 222 186 214 Z', PELO.luz);
  // Ondas: hebras claras
  s += linea('M118 98 C114 114 116 130 114 144 C112 158 108 170 106 184', 1.8, PELO.brillo, ' opacity=".9"');
  s += linea('M182 98 C186 114 188 130 186 148 C184 166 190 182 194 198 C198 212 196 224 192 232', 1.8, PELO.brillo, ' opacity=".9"');
  s += linea('M128 84 C132 76 138 70 144 66 M170 84 C166 76 160 70 154 66', 1.6, PELO.luz);
  if (clip) {
    // Pinza cian a un lado
    s += plana('M118 84 L132 78 L135 86 L121 92 Z', C.cian, 1.8);
    s += linea('M120 86 L132 81 M122 90 L134 85', 1.2, C.c800);
  }
  return s;
}

function aro(x, y, grande = false) {
  return grande
    ? `<circle cx="${x}" cy="${y + 7}" r="7.5" fill="none" stroke="${C.tinta}" stroke-width="4.6"/><circle cx="${x}" cy="${y + 7}" r="7.5" fill="none" stroke="${ORO}" stroke-width="2.6"/>`
    : `<circle cx="${x}" cy="${y}" r="5.4" fill="${ORO}" stroke="${C.tinta}" stroke-width="1.8"/><path d="M${x - 2.5} ${y - 2} a3 3 0 0 1 3 -2" stroke="#FFF1C9" stroke-width="1.4" fill="none"/>`;
}

// ───────── Vestuario elegante ─────────
export function abyElegante() {
  const { piel, pielS } = P;
  const ves = '#0D6B57', vesS = '#084A3C', vesL = '#3AA58A';
  let s = suelo(152, 503, 70);
  s += peloAtras();
  // Cola del pañuelo, cae por detrás al lado derecho
  s += forma('M164 160 C182 172 190 214 188 262 C186 290 190 312 196 330 L182 332 C176 300 178 268 178 232 C178 200 172 178 160 168 Z', ves);
  s += mancha('M180 200 C184 230 184 262 184 290 L182 330 L188 330 C184 300 188 250 180 200 Z', vesS);
  // Panel derecho de la falda (detrás de la pierna)
  s += forma('M172 262 C182 280 188 300 190 320 C196 370 204 420 212 474 C204 478 194 478 188 476 C190 440 190 400 186 372 Z', vesS);
  // Pierna por el tajo
  s += forma('M168 370 C174 366 184 368 188 374 C187 410 185 440 183 470 L173 470 C173 440 169 406 168 370 Z', piel);
  s += mancha('M180 372 C184 372 187 374 188 376 C187 410 185 440 183 468 L179 468 C181 440 182 404 180 372 Z', pielS);
  // Zapato de atrás asomando
  s += forma('M124 476 L140 476 C143 484 144 492 142 497 L118 497 C116 491 118 482 124 476 Z', ORO);
  s += linea('M138 497 L138 503', 2.6);
  // Panel delantero de la falda (satín)
  s += forma('M128 262 L172 262 C178 290 180 330 176 372 C172 410 168 446 166 478 C142 484 118 484 96 476 C104 420 110 350 116 304 C118 286 122 272 128 262 Z', ves);
  s += mancha('M160 266 L172 262 C178 290 180 330 176 372 C172 410 168 446 166 476 L154 478 C160 430 166 380 166 330 C166 300 164 280 160 266 Z', vesS);
  s += linea('M128 300 C122 350 116 410 112 466', 3.4, vesL, ' opacity=".55"');
  s += linea('M140 296 C138 350 134 410 132 470', 2, vesL, ' opacity=".4"');
  // Tacón delantero dorado
  s += forma('M172 468 L185 468 C190 477 196 485 202 491 L200 495 L180 495 C178 488 175 480 172 468 Z', ORO);
  s += linea('M176 486 L175 503', 2.6, C.tinta);
  s += linea('M173 474 L185 476', 1.6, ORO_S);

  // Hombros y pecho (halter)
  s += forma('M112 188 C122 178 136 174 142 168 L158 168 C164 174 178 178 188 188 C192 198 190 212 186 222 L114 222 C110 212 108 198 112 188 Z', piel);
  s += mancha('M174 180 C182 182 188 186 190 196 C190 208 188 216 186 222 L176 222 C180 208 180 192 174 180 Z', pielS);
  // Corpiño con escote drapeado
  s += forma('M140 168 L160 168 C168 186 178 200 184 216 C182 236 176 250 172 264 L128 264 C124 250 118 236 116 216 C122 200 132 186 140 168 Z', ves);
  s += mancha('M160 170 C168 186 178 200 184 216 C182 236 176 250 172 262 L164 262 C170 240 174 214 160 170 Z', vesS);
  s += linea('M128 202 Q150 218 172 202', 2, vesL, ' opacity=".8"');
  s += linea('M132 216 Q150 230 168 216', 2, vesS);
  s += linea('M136 230 Q150 240 164 230', 1.8, vesL, ' opacity=".6"');
  // Cintura
  s += linea('M128 262 Q150 268 172 262', 2, vesS);

  // Brazo del micrófono (espectador izq.)
  s += tubo('M117 192 C106 210 98 230 98 248 C98 236 100 222 104 208', piel, 15);
  s += mancha('M100 226 C98 236 98 244 99 248 L101 240 C101 234 101 230 100 226 Z', pielS);
  // Micrófono con bandera de BiPlot
  s += tubo('M104 204 L101 170', '#1F252E', 6, 2);
  s += `<circle cx="100.6" cy="163" r="8.5" fill="#3A424E" stroke="${C.tinta}" stroke-width="2.2"/>`;
  s += linea('M94 160 L107 160 M93.5 164 L107.5 164 M95 168 L106 168', 1, C.a300, ' opacity=".7"');
  s += forma('M92 174 L110 174 L110 190 L92 190 Z', C.cian, 2);
  s += `<g transform="translate(94 176) scale(.14)"><path d="M27 23V75H80" fill="none" stroke="#0E2A47" stroke-width="7" stroke-linecap="round"/><path d="M31 67L45 53L59 57L72 35" fill="none" stroke="#0E2A47" stroke-width="7" stroke-linecap="round"/></g>`;
  // Mano con brazalete dorado
  s += forma('M96 198 C96 190 110 190 112 198 L112 208 C108 214 98 214 96 208 Z', piel, 2.2);
  s += forma('M96 208 L112 208 L113 217 L97 217 Z', ORO, 2);
  s += linea('M99 212 L110 212', 1.2, ORO_S);
  // Brazo a la cadera (espectador der.)
  s += tubo('M184 192 C198 208 207 228 205 246 C203 262 194 276 184 284', piel, 15);
  s += mancha('M200 216 C206 230 206 246 202 258 L204 244 C205 234 204 224 200 216 Z', pielS);
  s += forma('M176 280 C178 272 192 272 192 282 C192 290 182 294 178 290 Z', piel, 2.2);

  s += cara();
  // Pañuelo anudado al cuello
  s += forma('M136 150 C140 157 160 157 164 150 L166 168 C158 174 142 174 134 168 Z', ves);
  s += linea('M137 159 C144 164 156 164 163 159', 1.8, vesL, ' opacity=".8"');
  s += mancha('M156 152 L164 150 L166 168 C162 170 160 170 158 171 Z', vesS);
  s += peloFrente(false);
  s += aro(122, 124, false);
  return s;
}

// ───────── Vestuario urbano ─────────
export function abyUrbana() {
  const { piel, pielS } = P;
  const cha = C.a700, chaS = '#0F3558', chaL = '#1F5A92';
  const pan = C.arena, panS = C.arenaS;
  let s = suelo(150, 503, 76);
  s += peloAtras();
  // Pantalón cargo ancho de tiro alto
  s += forma('M124 258 L150 258 L148 300 L146 486 L102 486 C106 420 112 330 124 258 Z', pan);
  s += forma('M150 258 L176 258 C188 330 194 420 198 486 L154 486 L152 300 Z', pan);
  s += mancha('M168 262 L176 258 C188 330 194 420 198 484 L184 484 C182 420 176 330 168 262 Z', panS);
  s += linea('M130 290 C126 360 122 420 120 480 M170 290 C174 360 178 420 180 480', 1.6, panS);
  s += forma('M100 372 L124 370 L124 408 L102 410 Z', pan, 2.2);
  s += plana('M100 372 L124 370 L124 380 L100 382 Z', panS, 1.6);
  s += forma('M176 370 L200 372 L198 410 L176 408 Z', pan, 2.2);
  s += plana('M176 370 L200 372 L200 382 L176 380 Z', panS, 1.6);
  // Zapatillas gruesas
  s += forma('M104 478 L146 478 C150 486 150 494 148 500 L92 500 C88 492 94 482 104 478 Z', C.niebla);
  s += forma('M90 496 L150 496 L150 503 L90 503 Z', C.cian, 2);
  s += forma('M154 478 L196 478 C206 482 212 492 208 500 L152 500 C150 494 150 486 154 478 Z', C.niebla);
  s += forma('M150 496 L210 496 L210 503 L150 503 Z', C.cian, 2);
  s += linea('M112 484 L128 484 M162 484 L178 484', 1.6, C.a300);

  // Polera corta blanca
  s += forma('M124 182 L176 182 L180 262 L120 262 Z', C.niebla);
  s += `<text x="150" y="252" text-anchor="middle" font-family="'Space Mono', ui-monospace, monospace" font-weight="700" font-size="8" fill="${C.a700}">REC <tspan fill="${C.cian}">●</tspan></text>`;
  // Chaqueta bomber corta y amplia, abierta
  s += forma('M102 188 C112 176 128 172 136 174 L132 262 L104 264 C98 240 96 210 102 188 Z', cha);
  s += forma('M198 188 C188 176 172 172 164 174 L168 262 L196 264 C202 240 204 210 198 188 Z', cha);
  s += mancha('M186 180 C196 186 200 196 200 210 C202 232 200 250 196 262 L188 262 C194 236 194 204 186 180 Z', chaS);
  s += forma('M102 256 L134 254 L134 270 L104 272 Z', C.cian, 2.2);
  s += forma('M166 254 L198 256 L196 272 L166 270 Z', C.cian, 2.2);
  s += linea('M106 262 L132 260 M168 260 L194 262', 1.2, C.c800);
  s += forma('M124 168 C132 180 136 184 138 190 L132 196 C126 188 120 180 116 172 Z', C.cian, 2);
  s += forma('M176 168 C168 180 164 184 162 190 L168 196 C174 188 180 180 184 172 Z', C.cian, 2);
  // Correa del bolso cruzado y bolso
  s += tubo('M118 184 C140 220 166 256 184 286', C.a900, 5, 2);
  s += forma('M172 282 L204 280 L206 308 L174 310 Z', C.a900, 2.4);
  s += linea('M176 290 L202 288', 1.6, C.cian);
  // Credencial PRENSA
  s += credencialAncha(150, 208, 'PRENSA', 'M142 170 C142 186 144 200 146 210 M158 170 C158 186 156 200 154 210', 0.9);

  // Brazo derecho del espectador: mano en la correa
  s += tubo('M194 190 C210 212 214 240 204 258 C198 266 190 266 184 262', cha, 22);
  s += mancha('M208 204 C214 222 214 242 206 256 L210 240 C212 228 212 216 208 204 Z', chaS);
  // Parche de Plotty en la manga
  s += `<circle cx="204" cy="220" r="9" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="2"/><rect x="198" y="215" width="12" height="10" rx="3" fill="#123459"/>` +
    `<rect x="200.5" y="218" width="2.4" height="2.4" fill="${C.cian}"/><rect x="205" y="218" width="2.4" height="2.4" fill="${C.cian}"/><path d="M200.5 222.5 L207.6 222.5" stroke="${C.cian}" stroke-width="1.4"/>`;
  s += forma('M176 256 C178 248 192 248 194 256 L194 268 C188 274 178 272 176 266 Z', piel, 2.2);
  s += tubo('M186 250 L184 286', C.a900, 4, 1.6);
  // Brazo izquierdo del espectador: el celular en alto, grabando
  s += tubo('M108 190 C94 196 84 206 84 214 C86 200 86 184 86 170', cha, 22);
  s += forma('M72 170 L100 170 L100 180 L72 180 Z', C.cian, 2);
  s += forma('M76 156 C76 148 94 148 96 156 L96 168 C92 174 80 174 76 168 Z', piel, 2.2);
  // Celular con aro de luz
  s += forma('M72 110 L96 110 C99 110 100 111 100 114 L100 152 C100 155 99 156 96 156 L72 156 C69 156 68 155 68 152 L68 114 C68 111 69 110 72 110 Z', C.a900, 2.4);
  s += `<circle cx="75" cy="117" r="2.8" fill="${C.a600}" stroke="${C.tinta}" stroke-width="1.1"/><circle cx="82" cy="117" r="2" fill="${C.a600}"/>`;
  s += `<ellipse cx="84" cy="104" rx="15" ry="4.4" fill="none" stroke="${C.tinta}" stroke-width="4.4"/><ellipse cx="84" cy="104" rx="15" ry="4.4" fill="none" stroke="${C.c300}" stroke-width="2.4"/>`;
  s += linea('M84 108 L84 110', 2.4, C.tinta);

  s += cara();
  s += peloFrente(true);
  s += aro(122, 120, true);
  return s;
}
