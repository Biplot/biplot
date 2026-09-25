import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Faro · Puesta en marcha · E7. El farero.
// Herencia del faro: alto y derecho, suéter a rayas de faro, la luz cian (un farol), el manual bajo el brazo.
export function faro() {
  const piel = C.p1, pielS = C.p1s;
  const abrigo = C.a800, abrigoS = C.a900, abrigoL = C.a700;
  const barba = '#EEF2F6', barbaS = '#BCC7D3';
  let s = suelo(150, 503, 80);

  // Pantalón y botas
  s += forma('M118 330 L150 330 L148 470 L120 470 Z', C.grafito);
  s += forma('M150 330 L182 330 L180 470 L152 470 Z', C.grafito);
  s += mancha('M168 334 L182 334 L180 468 L170 468 Z', C.grafitoS);
  s += forma('M114 452 L150 452 C156 470 156 490 152 502 L100 502 C96 488 102 466 114 452 Z', '#3A2E28');
  s += mancha('M100 494 L152 494 L152 502 L100 502 Z', '#241C18');
  s += forma('M152 452 L188 452 C200 466 206 488 202 502 L150 502 C146 490 146 470 152 452 Z', '#3A2E28');
  s += mancha('M150 494 L202 494 L202 502 L150 502 Z', '#241C18');
  s += linea('M122 460 L140 460 M160 460 L178 460', 1.8, C.a300);

  // Suéter a rayas (se ve al centro)
  s += forma('M118 176 L182 176 L186 336 L114 336 Z', C.niebla);
  s += `<clipPath id="faro-sw"><path d="M118 176 L182 176 L186 336 L114 336 Z"/></clipPath>`;
  let r = '';
  for (let y = 196; y < 340; y += 26) r += `M100 ${y} H200 `;
  s += `<g clip-path="url(#faro-sw)">${linea(r, 12, C.a700)}</g>`;
  s += `<path d="M118 176 L182 176 L186 336 L114 336 Z" fill="none" stroke="${C.tinta}" stroke-width="2.4" stroke-linejoin="round"/>`;
  // Cuello del suéter
  s += forma('M126 170 C132 188 168 188 174 170 L176 180 C168 196 132 196 124 180 Z', C.a700);

  // Abrigo marinero abierto (doble botonadura)
  s += forma('M96 184 C104 168 124 164 134 166 L136 200 L128 350 L94 348 L90 220 Z', abrigo);
  s += forma('M204 184 C196 168 176 164 166 166 L164 200 L172 350 L206 348 L210 220 Z', abrigo);
  s += mancha('M188 172 C198 176 204 184 206 198 L210 220 L206 346 L192 348 C198 300 198 220 188 172 Z', abrigoS);
  // Solapas
  s += plana('M134 166 L140 208 L124 196 L116 172 Z', abrigoL);
  s += plana('M166 166 L160 208 L176 196 L184 172 Z', abrigoL);
  // Botones dorados → niebla (marca)
  [[112, 232], [112, 262], [112, 292], [188, 232], [188, 262], [188, 292]].forEach(([x, y]) => {
    s += `<circle cx="${x}" cy="${y}" r="3.8" fill="${C.a300}" stroke="${C.tinta}" stroke-width="1.6"/>`;
  });
  // Bolsillo
  s += linea('M168 308 L190 306', 2.2);

  // Credencial E7 en la solapa
  s += credencial(178, 204, 'E7', null, 0.85);

  // Brazo izquierdo (esp. der.) con el manual bajo el brazo
  s += tubo('M198 186 C212 216 214 250 206 276', abrigo, 26);
  s += mancha('M206 196 C214 220 214 250 208 272 L212 260 C216 238 214 214 206 196 Z', abrigoS);
  s += forma('M166 240 L214 236 L218 292 L170 296 Z', C.a600);
  s += plana('M170 244 L210 241 L213 288 L173 291 Z', C.papel, 1.6);
  s += plana('M166 240 L170 244 L173 291 L170 296 Z', C.a700, 1.6);
  s += `<text x="192" y="270" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="8.5" fill="${C.a800}" transform="rotate(-4 192 270)">MANUAL</text>`;
  s += linea('M178 278 L206 276', 1.4, C.a300);
  s += forma('M196 286 C200 280 212 280 214 288 C214 296 204 298 198 294 Z', piel);

  // Brazo derecho (esp. izq.) con el farol encendido
  s += tubo('M102 186 C88 216 84 250 90 282', abrigo, 26);
  s += forma('M80 280 C80 272 100 272 100 280 C100 288 80 288 80 280 Z', piel);
  // Farol
  s += linea('M90 286 L90 300', 2.4);
  s += `<circle cx="90" cy="344" r="46" fill="${C.cian}" opacity=".16"/>`;
  s += plana('M74 300 L106 300 L102 310 L78 310 Z', C.a800);
  s += forma('M78 310 L102 310 L106 360 L74 360 Z', C.c300);
  s += mancha('M80 314 L100 314 L102 356 L78 356 Z', C.cian);
  s += mancha('M84 318 L88 318 L88 350 L84 350 Z', C.blanco, ' opacity=".7"');
  s += linea('M90 310 L90 360 M76 334 L104 334', 2.2);
  s += plana('M72 358 L108 358 L108 368 L72 368 Z', C.a800);
  s += forma('M84 292 C84 286 96 286 96 292', 'none', 2.4);

  // Cuello
  s += forma('M138 140 L162 140 L162 172 C156 178 144 178 138 172 Z', piel);

  // Cabeza
  s += forma('M120 100 C118 70 182 68 182 100 L181 126 C179 146 166 160 150 162 C134 160 121 146 119 126 Z', piel);
  s += mancha('M170 76 C180 84 182 92 182 102 L181 126 C179 146 166 160 150 162 C162 152 170 140 172 124 C174 108 174 88 170 76 Z', pielS);
  s += `<ellipse cx="130" cy="124" rx="8" ry="5" fill="${C.mejilla}"/><ellipse cx="170" cy="124" rx="8" ry="5" fill="${C.mejilla}"/>`;
  // Orejas
  s += forma('M120 108 C111 106 111 126 121 128', piel, 2.2);
  s += forma('M181 108 C190 106 190 126 180 128', piel, 2.2);
  // Barba blanca grande
  s += forma('M118 118 C118 150 130 186 150 196 C170 186 182 150 182 118 C176 132 170 138 162 138 C156 134 144 134 138 138 C130 138 124 132 118 118 Z', barba);
  s += mancha('M164 140 C172 136 178 128 182 118 C182 150 170 186 150 196 C164 178 170 160 164 140 Z', barbaS);
  s += linea('M140 156 C142 166 146 174 150 180 M158 150 C160 162 158 172 156 178 M130 146 C132 156 136 164 140 170', 1.6, barbaS);
  // Bigote
  s += forma('M132 134 C138 126 146 128 150 132 C154 128 162 126 168 134 C162 140 154 138 150 136 C146 138 138 140 132 134 Z', barba, 2);
  // Nariz redonda
  s += forma('M143 118 C143 110 157 110 157 118 C157 126 143 126 143 118 Z', C.p1s, 2);
  // Ojos amables (medialuna)
  s += linea('M128 112 C132 106 140 106 143 112', 3);
  s += linea('M157 112 C160 106 168 106 172 112', 3);
  s += linea('M126 115 L123 118 M174 115 L177 118', 1.4, pielS);
  // Cejas blancas pobladas
  s += forma('M124 104 C128 95 142 95 146 102 C140 100 130 101 124 104 Z', barba, 1.8);
  s += forma('M154 102 C158 95 172 95 176 104 C170 101 160 100 154 102 Z', barba, 1.8);

  // Gorro marinero
  s += forma('M116 92 C112 60 128 40 150 40 C172 40 188 60 184 92 Z', C.a700);
  s += mancha('M164 44 C178 50 188 68 184 92 L172 92 C176 74 172 56 164 44 Z', C.a800);
  s += forma('M112 82 L188 82 L188 97 L112 97 Z', C.a600, 2.4);
  s += linea('M126 84 L126 95 M140 84 L140 95 M154 84 L154 95 M168 84 L168 95', 1.4, C.a700);
  // Luz de faro en el gorro: un botón cian
  s += `<circle cx="150" cy="48" r="7" fill="${C.cian}" stroke="${C.tinta}" stroke-width="2"/><circle cx="148" cy="46" r="2.2" fill="${C.blanco}"/>`;

  return s;
}
