import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Pepa · Cosecha · E9. La que guarda lo que sirve.
// Herencia del degú: bajita y rápida, dos moños redondos como orejas, dientes de roedor, trenza-cola, delantal, canasto de pepas y un brote.
export function pepa() {
  const piel = C.p3, pielS = C.p3s;
  const poleron = C.gris, poleronS = C.grisS;
  const del = C.arena, delS = C.arenaS;
  const pelo = '#6E625B', peloS = '#4E4540', peloL = '#8E827A';
  let s = suelo(150, 503, 70);

  // Trenza-cola por detrás
  s += tubo('M174 214 C204 236 214 288 196 330 C188 348 196 366 212 372', pelo, 9);
  s += linea('M190 238 l6 4 M200 262 l7 2 M202 290 l7 0 M198 318 l7 -2', 2, peloS);
  s += plana('M206 366 L218 368 L216 380 L204 378 Z', C.cian, 1.8);

  // Botas de agua
  s += forma('M124 430 L148 430 L148 480 C152 488 152 496 150 502 L112 502 C110 490 118 482 124 478 Z', C.a700);
  s += mancha('M112 494 L150 494 L150 502 L112 502 Z', C.a900);
  s += forma('M152 430 L176 430 L176 478 C184 482 192 490 190 502 L152 502 C150 496 150 488 152 480 Z', C.a700);
  s += mancha('M152 494 L190 494 L190 502 L152 502 Z', C.a900);
  s += linea('M126 440 H146 M154 440 H174', 2, C.a600);

  // Pantalón corto bajo el delantal
  s += forma('M120 356 L180 356 L182 432 L152 432 L150 392 L148 432 L118 432 Z', C.a800);

  // Polerón gris
  s += forma('M110 256 C120 244 180 244 190 256 L196 290 L190 376 L110 376 L104 290 Z', poleron);
  s += mancha('M172 250 C184 252 190 258 194 272 L196 290 L190 374 L176 374 C184 340 184 282 172 250 Z', poleronS);
  // Delantal
  s += forma('M124 262 L176 262 L182 300 C186 330 186 366 184 400 L116 400 C114 366 114 330 118 300 Z', del);
  s += mancha('M168 264 L176 262 L182 300 C186 330 186 366 184 398 L172 398 C176 360 176 310 168 264 Z', delS);
  s += linea('M124 262 C128 252 136 246 142 244 M176 262 C172 252 164 246 158 244', 2.4, delS);
  // Bolsillo del delantal con brote
  s += forma('M130 324 L170 324 L168 356 L132 356 Z', delS, 2.2);
  s += linea('M150 324 L150 356', 1.6);
  s += linea('M140 324 C140 312 140 302 136 294', 2.4, C.c700);
  s += forma('M136 296 C126 292 122 282 126 276 C134 280 138 288 136 296 Z', C.cian, 1.8);
  s += forma('M138 300 C146 292 156 292 158 298 C152 304 144 304 138 300 Z', C.c300, 1.8);
  // Lazo en la cintura
  s += linea('M112 300 L118 300 M182 300 L190 300', 3, delS);

  // Credencial E9 en el tirante
  s += credencial(162, 272, 'E9', null, 0.8);

  // Cuello
  s += forma('M140 224 L160 224 L160 252 C154 258 146 258 140 252 Z', piel);

  // Brazo izquierdo (esp. der.): canasto de pepas a la cadera
  s += tubo('M186 262 C200 290 206 318 200 340', poleron, 20);
  s += forma('M166 334 C164 328 222 328 220 334 L214 372 C212 380 174 380 172 372 Z', '#8B6A4E');
  s += linea('M172 344 L216 344 M174 356 L214 356 M176 366 L212 366', 1.8, '#5E4633');
  s += linea('M180 334 L182 376 M194 334 L194 378 M208 334 L206 376', 1.6, '#5E4633');
  // Pepas brillantes
  [[176, 326, C.cian], [188, 322, C.c300], [200, 324, C.cian], [212, 327, C.niebla], [194, 316, C.cian], [206, 318, C.c300], [182, 318, C.niebla]].forEach(([x, y, c]) => {
    s += `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="4" fill="${c}" stroke="${C.tinta}" stroke-width="1.8"/>`;
  });
  s += forma('M166 336 C166 322 222 322 220 336', 'none', 3);
  s += forma('M196 338 C200 332 210 332 212 340 C212 348 202 350 198 346 Z', piel);

  // Brazo derecho (esp. izq.): muestra una pepa en alto
  s += tubo('M114 262 C98 262 88 244 92 222', poleron, 20);
  s += forma('M84 214 C84 204 102 204 102 214 C102 224 84 226 84 214 Z', piel);
  s += `<circle cx="93" cy="196" r="16" fill="${C.cian}" opacity=".18"/>`;
  s += `<rect x="85" y="188" width="16" height="16" rx="5" fill="${C.cian}" stroke="${C.tinta}" stroke-width="2"/>`;
  s += linea('M89 192 L93 192', 1.6, C.blanco);
  s += linea('M80 180 L76 174 M93 176 L93 168 M106 180 L110 174', 2, C.c300);

  // Cabeza redonda
  s += forma('M116 190 C114 160 186 158 184 190 C184 214 170 232 150 234 C130 232 116 214 116 190 Z', piel);
  s += mancha('M170 166 C180 174 184 182 184 192 C184 214 170 232 150 234 C164 224 172 210 174 196 C176 184 174 174 170 166 Z', pielS);
  s += `<ellipse cx="128" cy="206" rx="7" ry="4.5" fill="${C.mejilla}"/><ellipse cx="172" cy="206" rx="7" ry="4.5" fill="${C.mejilla}"/>`;
  // Ojos redondos y vivos
  s += `<ellipse cx="136" cy="192" rx="6.5" ry="7.5" fill="${C.blanco}" stroke="${C.tinta}" stroke-width="1.8"/><circle cx="137" cy="193" r="4" fill="${C.tinta}"/><circle cx="135.5" cy="191" r="1.4" fill="${C.blanco}"/>`;
  s += `<ellipse cx="164" cy="192" rx="6.5" ry="7.5" fill="${C.blanco}" stroke="${C.tinta}" stroke-width="1.8"/><circle cx="165" cy="193" r="4" fill="${C.tinta}"/><circle cx="163.5" cy="191" r="1.4" fill="${C.blanco}"/>`;
  s += linea('M128 180 C132 176 140 176 144 179', 2.8);
  s += linea('M156 179 C160 176 168 176 172 180', 2.8);
  // Naricita
  s += forma('M146 202 C146 198 154 198 154 202 C154 206 146 206 146 202 Z', '#6B3F2A', 1.4);
  // Sonrisa grande con dos dientes de roedor
  s += forma('M136 212 C142 222 158 222 164 212 Z', '#5A2320', 2.2);
  s += plana('M144 212 L150 212 L150 221 L144 220 Z', C.blanco, 1.6);
  s += plana('M150 212 L156 212 L156 220 L150 221 Z', C.blanco, 1.6);
  // Bigotes de degú (líneas sutiles en las mejillas)
  s += linea('M118 204 L108 202 M118 209 L108 210 M182 204 L192 202 M182 209 L192 210', 1.2, pielS);

  // Pelo con chasquilla y dos moños redondos (orejas de degú)
  s += forma('M112 196 C104 166 124 146 150 146 C176 146 196 166 188 196 C186 184 180 176 172 172 C166 178 156 180 148 176 C140 180 130 180 124 174 C118 180 114 188 112 196 Z', pelo);
  s += mancha('M164 150 C180 156 192 170 188 194 C186 184 180 176 172 172 C172 164 168 156 164 150 Z', peloS);
  s += linea('M126 160 C134 154 144 152 150 154 M154 154 C162 154 170 158 176 164', 2, peloL);
  s += forma('M108 150 C108 128 136 128 136 150 C136 168 108 168 108 150 Z', pelo);
  s += mancha('M126 134 C134 140 136 148 132 158 C128 150 128 142 126 134 Z', peloS);
  s += forma('M164 150 C164 128 192 128 192 150 C192 168 164 168 164 150 Z', pelo);
  s += mancha('M182 134 C190 140 192 148 188 158 C184 150 184 142 182 134 Z', peloS);
  s += linea('M114 144 C118 138 124 136 128 138 M170 144 C174 138 180 136 184 138', 1.8, peloL);

  return s;
}
