import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Grilla "Pixel" · Diseño · E5.
// Herencia del grillo: la más alta y flaca, rodillas de grillo, pelo teñido cian, dos lápices-antena, lentes redondos, huincha de bufanda.
export function grilla() {
  const piel = C.p2, pielS = C.p2s;
  const jard = C.c700, jardS = C.c800, jardL = '#12A596';
  const pelo = C.cian, peloS = C.c700, peloL = C.c300;
  let s = suelo(150, 503, 72);

  // Piernas del jardinero: largas, la derecha (esp.) con la rodilla hacia adentro
  s += forma('M118 292 L148 292 L146 380 L144 470 L118 470 L118 380 Z', jard);
  s += linea('M132 300 L131 460', 1.6, jardS);
  s += forma('M152 292 L184 292 L186 376 C184 392 178 404 176 420 L178 470 L152 470 L152 420 C150 400 156 386 160 376 Z', jard);
  s += mancha('M172 296 L184 296 L186 376 C184 392 178 404 176 420 L178 468 L168 468 L166 420 C166 400 172 388 174 374 Z', jardS);
  // Basta doblada
  s += plana('M116 452 L146 452 L146 466 L116 466 Z', jardL);
  s += plana('M150 452 L180 452 L180 466 L150 466 Z', jardL);

  // Botas de plataforma
  s += forma('M112 464 L148 464 C154 474 154 486 152 494 L104 494 C102 480 106 470 112 464 Z', C.a900);
  s += forma('M100 492 L154 492 L154 503 L100 503 Z', C.niebla, 2.2);
  s += linea('M122 470 L138 470 M122 477 L138 477', 1.8, C.cian);
  s += forma('M150 464 L184 464 C194 470 200 482 198 494 L148 494 C146 482 146 472 150 464 Z', C.a900);
  s += forma('M146 492 L200 492 L200 503 L146 503 Z', C.niebla, 2.2);
  s += linea('M160 470 L176 470 M160 477 L176 477', 1.8, C.cian);

  // Polera a rayas (manga larga)
  s += forma('M114 166 C124 158 176 158 186 166 L190 200 L186 300 L114 300 L110 200 Z', C.niebla);
  s += `<clipPath id="grilla-pol"><path d="M114 166 C124 158 176 158 186 166 L190 200 L186 300 L114 300 L110 200 Z"/></clipPath>`;
  let rayas = '';
  for (let y = 174; y < 300; y += 12) rayas += `M100 ${y} H200 `;
  s += `<g clip-path="url(#grilla-pol)">${linea(rayas, 4, C.a300)}</g>`;
  s += `<path d="M114 166 C124 158 176 158 186 166 L190 200 L186 300 L114 300 L110 200 Z" fill="none" stroke="${C.tinta}" stroke-width="2.6" stroke-linejoin="round"/>`;

  // Peto del jardinero
  s += forma('M124 214 L176 214 L180 300 L120 300 Z', jard);
  s += mancha('M164 214 L176 214 L180 300 L168 300 Z', jardS);
  s += plana('M136 226 L164 226 L162 250 L138 250 Z', jardL);
  s += linea('M140 234 L160 234', 1.6, jardS);
  // Tirantes
  s += tubo('M126 216 L120 166', jard, 8);
  s += tubo('M174 216 L180 166', jard, 8);
  s += `<circle cx="128" cy="218" r="4" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="1.6"/><circle cx="172" cy="218" r="4" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="1.6"/>`;
  // Cintura
  s += linea('M118 288 L182 288', 2, jardS);

  // Credencial E5 prendida en el peto
  s += credencial(150, 256, 'E5', null, 0.85);

  // Cuello largo
  s += forma('M142 128 L158 128 L158 166 C152 172 148 172 142 166 Z', piel);
  s += mancha('M151 130 L158 130 L158 164 C155 168 153 168 151 167 Z', pielS);

  // Huincha de medir como bufanda
  s += forma('M124 160 C130 176 170 176 176 160 L180 170 C172 190 128 190 120 170 Z', C.papel, 2.2);
  s += forma('M160 180 L172 176 L178 246 L166 250 Z', C.papel, 2.2);
  s += forma('M150 182 L162 182 L158 226 L146 226 Z', C.papel, 2.2);
  let ticks = '';
  for (let y = 186; y < 246; y += 6) ticks += `M${167 + (y - 186) * 0.1} ${y} l${y % 12 === 0 ? 6 : 3} -0.6 `;
  for (let y = 188; y < 224; y += 6) ticks += `M${151 - (y - 188) * 0.05} ${y} l${y % 12 === 0 ? 6 : 3} 0 `;
  s += linea(ticks, 1.2);
  s += plana('M144 224 L160 224 L160 232 L144 232 Z', C.a600, 1.4);

  // Brazo derecho (esp. izq.): el celular con la maqueta
  s += tubo('M116 172 C100 196 94 226 100 250 C104 262 116 262 122 252', C.niebla, 18);
  s += linea('M102 196 L112 194 M98 210 L108 209 M97 224 L107 224 M98 238 L108 239', 3.2, C.a300);
  s += forma('M100 214 L126 206 L136 256 L110 264 Z', C.a900);
  s += plana('M104 218 L124 212 L132 252 L112 258 Z', C.niebla, 1.4);
  s += mancha('M107 222 L122 218 L124 226 L109 230 Z', C.cian);
  s += mancha('M110 234 L125 230 L126 234 L111 238 Z', C.a300);
  s += mancha('M111 241 L126 237 L127 241 L112 245 Z', C.a300);
  s += mancha('M114 249 L124 246 L125 251 L115 254 Z', C.a600);
  s += forma('M112 250 C116 244 126 244 128 252 C128 260 120 262 114 258 Z', piel);

  // Brazo izquierdo: pulgar arriba
  s += tubo('M184 172 C200 194 210 214 206 232', C.niebla, 18);
  s += linea('M190 186 L200 184 M196 198 L206 197 M200 210 L210 211', 3.2, C.a300);
  s += forma('M196 226 C198 216 216 216 218 228 L218 242 C214 250 200 250 198 242 Z', piel);
  s += forma('M200 226 L198 206 C198 200 206 200 207 206 L210 224 Z', piel, 2.2);
  s += linea('M200 234 L216 234 M200 240 L215 240', 1.4, pielS);

  // Cabeza larga y joven
  s += forma('M126 78 C124 48 176 46 176 78 L175 98 C173 116 164 128 150 132 C136 128 127 116 125 98 Z', piel);
  s += mancha('M166 58 C174 64 176 70 176 80 L175 98 C173 116 164 128 150 132 C160 122 166 110 168 96 C170 82 170 68 166 58 Z', pielS);
  // Orejas
  s += forma('M126 86 C118 84 118 100 126 102', piel, 2.2);
  s += forma('M175 86 C183 84 183 100 175 102', piel, 2.2);
  // Pecas
  s += `<g fill="${pielS}"><circle cx="134" cy="104" r="1.2"/><circle cx="138" cy="107" r="1.2"/><circle cx="131" cy="108" r="1.1"/><circle cx="163" cy="104" r="1.2"/><circle cx="167" cy="107" r="1.2"/><circle cx="160" cy="107" r="1.1"/></g>`;
  // Ojos grandes detrás de los lentes
  s += ojo(138, 90, 13, 7, 1.5, 0.5, 0.18, piel);
  s += ojo(163, 90, 13, 7, 1.5, 0.5, 0.18, piel);
  // Lentes redondos
  s += `<circle cx="138" cy="90" r="13" fill="${C.c100}" fill-opacity=".22" stroke="${C.tinta}" stroke-width="2.6"/>`;
  s += `<circle cx="163" cy="90" r="13" fill="${C.c100}" fill-opacity=".22" stroke="${C.tinta}" stroke-width="2.6"/>`;
  s += linea('M151 89 C150 86 151 86 150 89', 2.6);
  s += linea('M131 83 A9 9 0 0 1 137 80', 1.6, C.blanco);
  // Cejas finas arqueadas
  s += linea('M127 73 C131 69 139 68 146 71', 2.6);
  s += linea('M155 71 C161 67 169 68 174 72', 2.6);
  // Nariz respingada
  s += linea('M151 96 C150 102 148 106 148 108 C150 110 153 110 155 108', 2);
  // Sonrisa pícara con dientes
  s += forma('M139 116 C146 122 158 121 164 113 C160 124 144 126 139 116 Z', C.blanco, 1.8);
  s += linea('M138 115 C146 120 156 120 165 112', 2.4);

  // Pelo corto cian, flequillo barrido
  s += forma('M122 86 C114 56 132 34 154 36 C178 38 190 60 180 86 C176 72 168 64 160 62 C148 72 132 74 124 74 C124 78 123 82 122 86 Z', pelo);
  s += mancha('M164 40 C180 46 188 62 180 86 C178 74 172 66 166 62 C168 54 168 46 164 40 Z', peloS);
  s += forma('M124 74 C132 72 146 68 158 60 C150 74 140 80 128 82 Z', peloS, 2);
  s += linea('M134 46 C142 42 152 42 160 46 M140 54 C148 52 156 54 162 58', 2, peloL);
  // Lápices-antena
  s += linea('M136 44 C128 26 120 16 108 10', 5.5, C.tinta) + linea('M136 44 C128 26 120 16 108 10', 3, C.a600);
  s += `<circle cx="107" cy="9" r="5.2" fill="${C.cian}" stroke="${C.tinta}" stroke-width="2"/>`;
  s += linea('M164 42 C172 26 182 18 196 14', 5.5, C.tinta) + linea('M164 42 C172 26 182 18 196 14', 3, C.a600);
  s += `<circle cx="197" cy="13" r="5.2" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="2"/>`;

  return s;
}
