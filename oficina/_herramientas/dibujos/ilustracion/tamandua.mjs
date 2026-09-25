import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Tamandúa · Validación · E6. El cazador de bichos.
// Herencia del oso hormiguero: alto y encorvado, nariz larga, chaleco negro sobre polera crema, linterna en la frente, el celular.
export function tamandua() {
  const piel = C.p2, pielS = C.p2s;
  const pol = C.papel, polS = C.arenaS;
  const chal = C.grafito, chalS = C.grafitoS, chalL = '#343F4F';
  const pant = C.a600, pantS = C.a700;
  const pelo = '#2B2622', peloS = '#1A1613';
  let s = suelo(150, 503, 76);

  // Pantalón cargo
  s += forma('M116 304 L150 304 L148 340 L146 468 L118 468 C116 410 114 350 116 304 Z', pant);
  s += forma('M150 304 L186 304 C188 350 186 410 184 468 L156 468 L154 340 Z', pant);
  s += mancha('M172 308 L186 308 C188 350 186 410 184 466 L172 466 C174 410 176 350 172 308 Z', pantS);
  // Bolsillos cargo con aparatos
  s += plana('M114 364 L138 362 L138 396 L116 398 Z', pantS);
  s += plana('M118 356 L132 355 L132 368 L118 369 Z', C.a900, 1.6);
  s += plana('M164 362 L188 364 L186 398 L164 396 Z', pantS);
  s += linea('M114 372 L138 370 M164 370 L188 372', 1.8);
  // Zapatillas grises
  s += forma('M118 466 L148 466 C152 478 152 492 150 502 L100 502 C96 490 104 474 118 466 Z', C.a300);
  s += mancha('M100 495 L150 495 L150 502 L100 502 Z', C.a400);
  s += forma('M154 466 L184 466 C198 474 206 490 202 502 L152 502 C150 492 150 478 154 466 Z', C.a300);
  s += mancha('M152 495 L202 495 L202 502 L152 502 Z', C.a400);

  // Torso encorvado: polera crema manga larga
  s += forma('M104 176 C114 160 180 156 194 170 L200 208 L190 312 L112 312 L100 212 Z', pol);
  s += mancha('M176 164 C188 166 194 172 196 184 L200 208 L190 310 L178 310 C188 270 188 210 176 164 Z', polS);
  // Chaleco negro del tamandúa: costados y hombros, V crema al centro
  s += forma('M104 180 C110 168 124 162 132 162 L150 232 L128 312 L112 312 L100 212 Z', chal);
  s += forma('M194 172 C188 166 176 162 168 162 L150 232 L172 312 L190 312 L200 208 Z', chal);
  s += mancha('M180 170 C190 172 196 180 198 192 L200 208 L190 310 L180 310 C190 270 190 210 180 170 Z', chalS);
  s += linea('M116 212 L124 268 M184 212 L176 268', 1.6, chalL);
  // Bolsillo del chaleco con lápices
  s += plana('M112 258 L128 256 L130 278 L114 280 Z', chalL, 1.8);
  s += linea('M116 258 L114 246 M121 257 L122 244', 2.6, C.cian);

  // Credencial E6
  s += credencial(150, 236, 'E6', 'M142 170 C144 196 146 220 148 238 M158 170 C156 196 154 220 152 238');

  // Brazo derecho (esp. izq.): el celular en alto
  s += tubo('M110 184 C92 208 84 236 92 252 C98 262 108 258 114 248', chal, 20);
  s += linea('M92 232 C90 240 92 248 96 252', 1.6, chalL);
  s += tubo('M112 250 C116 236 116 222 112 212', pol, 16);
  s += forma('M96 184 L120 180 L126 222 L102 226 Z', C.a900);
  s += plana('M100 188 L118 185 L123 218 L105 221 Z', C.niebla, 1.4);
  s += mancha('M103 192 L116 190 L117 196 L104 198 Z', C.cian);
  s += mancha('M104 202 L118 200 L118 204 L105 206 Z', C.a300);
  s += mancha('M105 210 L113 209 L114 214 L106 215 Z', C.a300);
  s += forma('M104 210 C106 204 118 204 120 212 L120 222 C116 228 106 226 104 220 Z', piel);

  // Brazo izquierdo: el frasco de bichos
  s += tubo('M192 184 C210 210 214 240 206 262', chal, 20);
  s += tubo('M206 258 C204 272 196 280 188 284', pol, 16);
  s += forma('M168 272 C168 266 204 266 204 272 L204 310 C204 318 168 318 168 310 Z', C.c100, 2.4, ' fill-opacity=".85"');
  s += plana('M166 264 L206 264 L206 274 L166 274 Z', C.a600, 2);
  // Bichos adentro (chicos, oscuros, con brillo cian)
  [[178, 290], [192, 298], [186, 306], [180, 302]].forEach(([x, y], i) => {
    s += `<g transform="translate(${x} ${y}) rotate(${i * 50})"><ellipse cx="0" cy="0" rx="4.4" ry="3.2" fill="${C.tinta}"/><circle cx="3.6" cy="0" r="1.8" fill="${C.tinta}"/>` +
      `<path d="M-2 -3 l-2 -3 M1 -3 l1 -3 M-2 3 l-2 3 M1 3 l1 3" stroke="${C.tinta}" stroke-width="1"/><circle cx="-1" cy="-1" r="1.1" fill="${C.cian}"/></g>`;
  });
  s += forma('M200 278 C208 280 210 296 204 300 L200 294 Z', piel, 2);
  s += mancha('M172 276 L176 276 L176 306 L172 306 Z', C.blanco, ' opacity=".6"');

  // Cuello adelantado
  s += forma('M136 136 L158 132 L160 168 C154 174 144 174 138 168 Z', piel);
  s += mancha('M150 134 L158 132 L160 166 C156 170 152 170 150 169 Z', pielS);

  // Cabeza alargada, adelantada y un poco inclinada
  s += '<g transform="rotate(-6 146 150)">';
  s += forma('M118 84 C116 54 172 52 174 84 L173 112 C171 130 160 142 146 146 C132 142 121 130 119 112 Z', piel);
  s += mancha('M162 62 C172 70 174 78 174 88 L173 112 C171 130 160 142 146 146 C156 136 164 124 166 110 C168 94 168 76 162 62 Z', pielS);
  // Barba de tres días
  s += mancha('M124 118 C130 136 140 142 146 144 C156 142 166 134 170 118 C166 128 158 134 146 136 C136 134 128 128 124 118 Z', '#5A4A40', ' opacity=".35"');
  // Orejas
  s += forma('M119 92 C110 90 110 108 120 110', piel, 2.2);
  s += forma('M173 92 C182 90 182 108 172 110', piel, 2.2);
  // Ojos chicos, desconfiados
  s += ojo(133, 96, 13, 6, -2.5, 1, 0.52, piel);
  s += ojo(159, 96, 13, 6, -2.5, 1, 0.52, piel);
  s += linea('M124 88 C129 84 136 84 141 87', 3.4);
  s += linea('M151 86 C156 82 164 82 169 87', 3.4);
  // Nariz larga: el hocico
  s += forma('M141 96 C140 108 134 118 130 124 C128 130 134 134 142 132 C150 134 156 130 154 124 C152 118 150 108 149 96 Z', piel, 2.2);
  s += mancha('M146 100 C148 110 152 118 153 124 C154 130 149 132 146 131 C149 122 148 110 146 100 Z', pielS);
  s += linea('M136 128 C138 130 140 130 141 129 M146 129 C148 130 150 130 152 128', 1.4);
  // Boca torcida
  s += linea('M134 138 C140 140 148 140 156 136', 2.4);
  // Pelo desordenado
  s += forma('M114 90 C104 60 124 40 148 40 C172 40 188 56 178 90 C174 76 166 68 156 68 C150 74 136 74 128 70 C122 76 118 82 114 90 Z', pelo);
  s += mancha('M160 44 C176 50 184 64 178 88 C176 78 170 70 164 68 C166 60 164 50 160 44 Z', peloS);
  s += linea('M124 50 C130 44 136 42 142 44 M146 40 C140 34 146 26 152 30 M156 42 C162 36 170 38 172 44', 2.4, pelo);
  // Mechón canoso
  s += linea('M132 56 C138 52 146 52 152 56', 2.4, C.a300);
  // Linterna de frente
  s += linea('M116 80 C126 72 166 70 178 80', 5, C.tinta) + linea('M116 80 C126 72 166 70 178 80', 2.6, C.a900);
  s += forma('M136 64 L158 62 L160 80 L138 82 Z', C.niebla, 2.2);
  s += `<circle cx="148" cy="72" r="6" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1.8"/><circle cx="146" cy="70" r="2" fill="${C.blanco}"/>`;
  s += '</g>';
  // Haz de luz hacia el celular
  s += mancha('M138 68 L96 182 L126 176 Z', C.cian, ' opacity=".14"');

  return s;
}
