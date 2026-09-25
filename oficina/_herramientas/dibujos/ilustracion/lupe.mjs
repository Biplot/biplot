import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Lupe · Diagnóstico · E1. La detective de procesos.
// Herencia: el ojo-lupa (una lupa de joyero que le agranda el ojo), la humita azul, el portapapeles, el cuerpo de huevo (gabardina).
export function lupe() {
  const piel = C.p1, pielS = C.p1s;
  const gab = C.arena, gabS = C.arenaS, gabL = C.papel;
  const pelo = '#DCE3EA', peloS = '#A9B5C3';
  let s = suelo(150, 503, 74);

  // Piernas (medias oscuras) y botines
  s += forma('M128 420 L144 420 L143 482 L129 482 Z', C.a900);
  s += forma('M156 420 L172 420 L171 482 L157 482 Z', C.a900);
  s += forma('M128 476 L146 476 C150 486 150 496 148 502 L108 502 C106 492 116 482 128 476 Z', C.a700);
  s += mancha('M108 496 L148 496 L148 502 L108 502 Z', C.a900);
  s += forma('M156 476 L174 476 C186 482 194 492 192 502 L154 502 C152 494 152 484 156 476 Z', C.a700);
  s += mancha('M154 496 L192 496 L192 502 L154 502 Z', C.a900);

  // Gabardina acampanada (el huevo)
  s += forma('M112 240 C124 230 176 230 188 240 C202 290 214 360 220 426 C190 438 110 438 80 426 C86 360 98 290 112 240 Z', gab);
  s += mancha('M170 236 C182 238 188 242 192 252 C204 300 214 362 220 426 C206 431 192 434 178 435 C188 380 186 300 170 236 Z', gabS);
  // Abertura central y solapas
  s += linea('M150 262 L150 432', 2.4);
  s += plana('M124 238 L150 262 L136 300 L118 250 Z', gabL);
  s += plana('M176 238 L150 262 L164 300 L182 250 Z', gabS);
  // Cinturón
  s += plana('M92 330 L208 330 L210 346 L90 346 Z', gabS);
  s += plana('M140 326 L160 326 L160 350 L140 350 Z', C.a300);
  s += linea('M146 350 C144 368 138 380 132 388 M154 350 C158 368 164 378 170 386', 3, gabS);
  // Botones
  [[138, 282], [162, 282], [138, 306], [162, 306], [138, 372], [162, 372]].forEach(([x, y]) => {
    s += `<circle cx="${x}" cy="${y}" r="3.6" fill="${C.a700}" stroke="${C.tinta}" stroke-width="1.6"/>`;
  });
  // Bolsillos
  s += linea('M104 384 L126 380 M174 380 L196 384', 2.2);

  // Cuello y camisa
  s += forma('M140 214 L160 214 L160 236 C154 242 146 242 140 236 Z', piel);
  s += plana('M134 232 L150 250 L166 232 L160 226 L150 236 L140 226 Z', C.blanco);
  // Humita azul
  s += forma('M150 240 L132 230 L132 252 Z', C.a600);
  s += forma('M150 240 L168 230 L168 252 Z', C.a600);
  s += forma('M145 235 L155 235 L155 245 L145 245 Z', C.a800, 2);

  // Cronómetro colgando
  s += linea('M138 236 C132 262 134 284 142 298', 1.8, C.a600);
  s += plana('M137 296 L147 296 L147 302 L137 302 Z', C.a600, 1.6);
  s += forma('M128 310 C128 300 156 300 156 310 C156 322 128 322 128 310 Z', C.cian, 2.2);
  s += `<circle cx="142" cy="311" r="8.5" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="1.6"/>`;
  s += linea('M142 311 L142 305 M142 311 L147 313', 1.6);

  // Credencial prendida en la solapa
  s += credencial(176, 262, 'E1', null, 0.9);

  // Brazo derecho (espectador izq.) con portapapeles
  s += tubo('M114 250 C98 280 96 310 108 330 C114 338 124 336 128 330', gab, 24);
  s += mancha('M102 290 C100 306 104 320 112 328 L108 316 C104 306 104 298 102 290 Z', gabS);
  s += forma('M86 300 L128 294 L134 352 L92 358 Z', C.a600);
  s += plana('M92 306 L124 302 L128 348 L96 352 Z', C.papel);
  s += linea('M98 316 L120 313 M99 324 L118 322 M100 332 L121 329', 2, C.a300);
  s += linea('M100 341 l3 3 l7 -7', 2.2, C.c700);
  s += plana('M101 294 L117 292 L118 300 L102 302 Z', C.a800, 1.6);
  s += forma('M118 318 C124 314 134 316 134 324 C134 332 124 334 118 330 Z', piel);

  // Brazo izquierdo levantado: el dedo que pregunta
  s += tubo('M186 250 C204 262 212 240 210 214', gab, 22);
  s += mancha('M196 252 C206 250 210 236 210 222 L214 224 C214 240 208 254 196 256 Z', gabS);
  s += forma('M200 202 C200 194 216 192 218 202 L218 214 C214 222 202 222 200 214 Z', piel);
  s += forma('M205 196 L205 172 C205 166 213 166 213 172 L213 198 Z', piel, 2.2);
  s += linea('M203 206 L216 206', 1.4, pielS);

  // Cabeza redonda con pómulos
  s += forma('M118 176 C116 146 184 144 184 176 C185 200 172 220 150 222 C128 220 116 202 118 176 Z', piel);
  s += mancha('M170 154 C180 160 185 168 184 180 C184 200 172 220 150 222 C164 214 174 200 176 184 C178 172 176 162 170 154 Z', pielS);
  s += `<ellipse cx="130" cy="196" rx="7" ry="4" fill="${C.mejilla}"/><ellipse cx="170" cy="196" rx="7" ry="4" fill="${C.mejilla}"/>`;
  // Orejas con aros cian
  s += forma('M118 180 C110 178 110 196 119 198', piel, 2.2);
  s += forma('M184 180 C192 178 192 196 183 198', piel, 2.2);
  s += `<circle cx="116" cy="200" r="2.6" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1"/><circle cx="186" cy="200" r="2.6" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1"/>`;
  // Ojo normal (izquierdo de ella) entrecerrado, pícaro
  s += ojo(165, 181, 15, 6.5, -1.5, 0.5, 0.5, piel);
  s += linea('M157 172 C162 168 169 168 174 171', 3.2);
  // Nariz puntuda y arrugas de sonrisa
  s += linea('M152 180 C152 188 148 196 146 199 C149 202 154 202 157 199', 2.2);
  s += linea('M128 206 C131 210 131 214 129 217 M172 206 C169 210 169 214 171 217', 1.4, pielS);
  // Sonrisa ladeada
  s += linea('M139 208 C146 212 155 212 163 205', 2.6);
  // Lupa de joyero: aro grueso cian, ojo agrandado
  s += `<circle cx="136" cy="181" r="17" fill="${C.c100}" stroke="${C.tinta}" stroke-width="2.6"/>`;
  s += `<circle cx="136" cy="182" r="10" fill="${C.a700}"/><circle cx="137" cy="183" r="5.6" fill="${C.tinta}"/><circle cx="133" cy="179" r="2.6" fill="${C.blanco}"/>`;
  s += `<circle cx="136" cy="181" r="17" fill="none" stroke="${C.cian}" stroke-width="5"/>`;
  s += `<circle cx="136" cy="181" r="20" fill="none" stroke="${C.tinta}" stroke-width="1.6"/>`;
  s += linea('M125 172 A13 13 0 0 1 132 167', 2.4, C.blanco);
  s += linea('M119 180 C114 176 112 170 114 164', 1.8, C.a600);
  // Ceja alzada sobre la lupa
  s += linea('M122 158 C128 151 138 150 146 154', 3.4);

  // Pelo plateado tirado atrás, tomate alto con lápiz
  s += forma('M116 178 C110 150 128 134 150 134 C174 134 192 150 184 178 C180 166 170 156 150 154 C132 156 122 164 116 178 Z', pelo);
  s += mancha('M160 138 C176 142 188 156 184 176 C180 164 174 158 166 154 C166 148 164 142 160 138 Z', peloS);
  s += linea('M130 146 C138 142 146 142 152 144 M156 144 C164 144 172 148 176 152', 1.8, peloS);
  // Tomate
  s += forma('M132 132 C130 112 170 110 168 132 C166 140 134 140 132 132 Z', pelo);
  s += mancha('M154 114 C166 116 170 126 166 134 C160 128 158 120 154 114 Z', peloS);
  // Lápiz atravesado
  s += plana('M118 126 L178 112 L180 118 L120 132 Z', C.a600, 2);
  s += plana('M178 112 L188 112 L180 118 Z', C.papel, 1.6);
  s += plana('M112 128 L118 126 L120 132 L114 134 Z', C.a300, 1.6);
  // Mechón suelto
  s += linea('M120 172 C114 182 116 192 112 200', 2, peloS);

  return s;
}
