import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Celda "Byte" · Datos y métricas · E3.
// Herencia del cubo-planilla: el pelo cortado en cubo, la chaqueta cuadriculada con celdas que se encienden, el plumero.
export function celda() {
  const piel = C.p4, pielS = C.p4s;
  const chaq = C.a700, chaqS = '#0F3558', grilla = C.a600;
  const pelo = '#22252F', peloS = '#12141B', peloL = '#3E4458';
  const pant = C.a900, pantS = '#06121F';
  let s = suelo(150, 503, 76);

  // Pantalón ancho recortado
  s += forma('M112 318 L150 318 L148 348 L144 458 L106 458 C106 410 108 360 112 318 Z', pant);
  s += forma('M150 318 L190 318 C194 360 196 410 196 458 L158 458 L154 348 Z', pant);
  s += mancha('M176 322 L190 322 C194 362 196 410 196 456 L182 456 C184 410 182 364 176 322 Z', pantS);
  s += linea('M128 340 L126 452 M172 340 L176 452', 1.6, '#23456B');
  // Tobillos
  s += forma('M116 456 L136 456 L136 474 L116 474 Z', piel, 2.2);
  s += forma('M166 456 L186 456 L186 474 L166 474 Z', piel, 2.2);
  // Zapatillas cuadradas de plataforma
  s += forma('M104 470 L142 470 L144 490 L144 502 L96 502 L96 490 Z', C.niebla);
  s += mancha('M96 490 L144 490 L144 502 L96 502 Z', C.a300);
  s += linea('M96 490 H144', 2);
  s += forma('M160 470 L198 470 L206 490 L206 502 L158 502 L158 490 Z', C.niebla);
  s += mancha('M158 490 L206 490 L206 502 L158 502 Z', C.a300);
  s += linea('M158 490 H206', 2);

  // Chaqueta cuadriculada, cuadrada de hombros
  s += forma('M100 176 L200 176 L206 190 L204 326 L96 326 L94 190 Z', chaq);
  // Grilla de planilla
  let g = '';
  for (let x = 108; x <= 196; x += 16) g += `M${x} 178 V324 `;
  for (let y = 192; y <= 320; y += 16) g += `M96 ${y} H204 `;
  s += `<clipPath id="celda-chaq"><path d="M100 176 L200 176 L206 190 L204 326 L96 326 L94 190 Z"/></clipPath>`;
  s += `<g clip-path="url(#celda-chaq)">`;
  // celdas encendidas
  [[108, 208], [172, 192], [124, 272], [188, 240], [108, 304], [172, 304], [140, 224]].forEach(([x, y], i) => {
    s += `<rect class="hq-luz" x="${x + 1.5}" y="${y + 1.5}" width="13" height="13" rx="2" fill="${i % 3 === 1 ? C.c300 : C.cian}"/>`;
  });
  s += linea(g, 1.4, grilla);
  s += mancha('M184 176 L200 176 L206 190 L204 326 L186 326 Z', chaqS, ' opacity=".55"');
  s += `</g>`;
  s += `<path d="M100 176 L200 176 L206 190 L204 326 L96 326 L94 190 Z" fill="none" stroke="${C.tinta}" stroke-width="2.6" stroke-linejoin="round"/>`;
  // Polera blanca y solapas
  s += plana('M132 176 L168 176 L162 250 L138 250 Z', C.blanco);
  s += linea('M138 250 L162 250', 2);
  s += plana('M132 176 L146 176 L140 232 L122 196 Z', chaqS);
  s += plana('M168 176 L154 176 L160 232 L178 196 Z', chaqS);

  // Cuello
  s += forma('M140 140 L160 140 L160 178 C154 184 146 184 140 178 Z', piel);
  s += mancha('M152 142 L160 142 L160 176 C156 180 153 180 152 179 Z', pielS);

  // Credencial E3
  s += credencial(150, 214, 'E3', 'M140 178 C142 196 146 206 148 216 M160 178 C158 196 154 206 152 216');

  // Brazo derecho (esp. izq.): plumero al hombro
  s += tubo('M102 186 C90 212 88 236 96 252 C102 262 114 258 120 246', chaq, 24);
  s += forma('M112 236 C118 230 130 232 130 242 C130 250 120 254 114 250 Z', piel);
  s += linea('M116 244 L84 128', 5, C.a300);
  // Plumas
  s += forma('M86 132 C70 124 62 104 70 92 C80 104 88 118 88 132 Z', C.c300, 2);
  s += forma('M88 130 C86 112 94 94 108 92 C106 108 98 122 90 132 Z', C.niebla, 2);
  s += forma('M86 132 C76 114 78 92 90 82 C96 98 94 118 88 132 Z', C.cian, 2);
  s += plana('M82 128 L92 126 L94 136 L84 138 Z', C.a600, 1.6);

  // Brazo izquierdo: tableta con gráfico de barras
  s += tubo('M198 186 C214 214 218 252 208 278 C204 286 198 290 194 290', chaq, 24);
  s += forma('M160 246 L206 254 L200 300 L154 292 Z', C.a800);
  s += plana('M164 252 L200 258 L195 294 L159 288 Z', C.a900, 1.6);
  s += mancha('M168 282 L174 283 L176 272 L170 271 Z', C.a600);
  s += mancha('M177 284 L183 285 L186 266 L180 265 Z', C.c700);
  s += mancha('M186 285 L192 286 L196 260 L190 259 Z', C.cian);
  s += forma('M186 286 C190 278 202 280 202 290 C202 298 192 300 188 296 Z', piel);

  // Cabeza, mandíbula firme
  s += forma('M122 104 C120 80 180 78 180 104 L179 122 C177 138 166 150 150 152 C134 150 123 138 121 122 Z', piel);
  s += mancha('M168 86 C176 92 180 98 180 106 L179 122 C177 138 166 150 150 152 C162 144 170 132 172 118 C174 104 172 94 168 86 Z', pielS);
  // Orejas con aros cuadrados
  s += forma('M122 110 C114 108 114 126 122 128', piel, 2.2);
  s += forma('M179 110 C187 108 187 126 179 128', piel, 2.2);
  s += `<rect x="113" y="129" width="7" height="7" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1.2"/><rect x="181" y="129" width="7" height="7" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1.2"/>`;
  // Ojos atentos
  s += ojo(137, 117, 14, 6.5, 1, 0, 0.3, piel);
  s += ojo(164, 117, 14, 6.5, 1, 0, 0.3, piel);
  // Lentes cuadrados
  s += `<rect x="125" y="107" width="24" height="19" rx="3" fill="${C.c100}" fill-opacity=".25" stroke="${C.tinta}" stroke-width="3"/>`;
  s += `<rect x="152" y="107" width="24" height="19" rx="3" fill="${C.c100}" fill-opacity=".25" stroke="${C.tinta}" stroke-width="3"/>`;
  s += linea('M149 113 L152 113', 3);
  s += linea('M129 111 L135 111', 1.6, C.blanco, ' opacity=".8"');
  // Cejas rectas
  s += linea('M126 101 L146 100', 3.6);
  s += linea('M155 100 L175 101', 3.6);
  // Nariz y boca segura
  s += linea('M151 122 C150 128 148 132 147 134 C150 136 154 136 156 134', 2.2);
  s += forma('M140 141 C146 145 156 145 162 140 C158 147 144 148 140 141 Z', '#6B2E2A', 1.8);

  // Pelo en cubo (afro cortado en cubo), borde de rulos
  s += forma('M110 108 Q105.0 102.7 110.0 97.3 Q105.0 92.0 110.0 86.7 Q105.0 81.3 110.0 76.0 Q105.0 70.7 110.0 65.3 Q105.0 60.0 110.0 54.7 Q105.0 49.3 110.0 44.0 Q115.0 39.0 120.0 44.0 Q125.0 39.0 130.0 44.0 Q135.0 39.0 140.0 44.0 Q145.0 39.0 150.0 44.0 Q155.0 39.0 160.0 44.0 Q165.0 39.0 170.0 44.0 Q175.0 39.0 180.0 44.0 Q185.0 39.0 190.0 44.0 Q195.0 49.3 190.0 54.7 Q195.0 60.0 190.0 65.3 Q195.0 70.7 190.0 76.0 Q195.0 81.3 190.0 86.7 Q195.0 92.0 190.0 97.3 Q195.0 102.7 190.0 108.0 C186 98 182 92 178 90 L178 82 L122 82 L122 90 C118 92 114 98 110 108 Z', pelo);
  s += mancha('M176 46 L188 46 L188 104 C186 98 182 92 178 90 Z', peloS);
  s += forma('M110 44 Q111.4 37.5 118.0 37.0 Q119.4 30.5 126.0 30.0 Q130.9 26.0 135.8 30.0 Q140.6 26.0 145.5 30.0 Q150.4 26.0 155.2 30.0 Q160.1 26.0 165.0 30.0 Q169.9 26.0 174.8 30.0 Q179.6 26.0 184.5 30.0 Q189.4 26.0 194.2 30.0 Q199.1 26.0 204.0 30.0 L190 44 Z', peloL, 2.2);
  s += forma('M190 44 L204 30 Q208.0 35.3 204.0 40.7 Q208.0 46.0 204.0 51.3 Q208.0 56.7 204.0 62.0 Q208.0 67.3 204.0 72.7 Q208.0 78.0 204.0 83.3 Q208.0 88.7 204.0 94.0 L190 108 Z', peloS, 2.2);
  // Textura de rulos
  s += linea('M122 56 q4 -5 8 0 M142 66 q4 -5 8 0 M160 54 q4 -5 8 0 M128 74 q4 -5 8 0 M166 72 q4 -5 8 0 M146 48 q4 -5 8 0 M116 90 q4 -5 8 0', 2, peloL);
  s += linea('M138 36 q4 -3 8 0 M166 36 q4 -3 8 0', 1.8, '#5A6178');
  // Peineta cian clavada
  s += plana('M176 22 L184 22 L184 50 L176 50 Z', C.cian, 1.8);
  s += linea('M178 50 L178 58 M182 50 L182 58', 2, C.cian);

  return s;
}
