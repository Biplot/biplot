import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// The Architect · Estratega y proyectos · E2. Según su hoja de estilo:
// lentes-visor cian, polerón carbón con la "A" y ribetes cian, jeans con cadena, zapatillas de caña,
// un pie arriba de una pila de equipos y planos.
// pose: 'pila' (ficha, con un pie arriba de la pila) u 'oficina' (de pie, sin utilería, para la escena).
export function architect(pose = 'pila') {
  const pila = pose !== 'oficina';
  const piel = C.p2, pielS = C.p2s;
  const pol = '#2B313A', polS = '#1C2129', polL = '#3A424E';
  const jean = '#3D5A80', jeanS = '#2A4262', jeanL = '#5677A0';
  const pelo = '#2A211C', peloS = '#17110D', peloL = '#4A3A30';
  const barba = '#3A2C24';
  let s = suelo(150, 503, 100);

  if (pila) {
  // Pila: rollos de planos y un servidor
  s += forma('M34 392 C34 386 50 386 50 392 L54 502 L38 502 Z', C.a600, 2.4);
  s += linea('M40 410 L50 409 M41 440 L51 439 M42 470 L52 469', 1.6, C.a300);
  s += forma('M44 446 L60 432 L150 432 L134 446 Z', C.a200, 2.4);
  s += forma('M134 446 L150 432 L150 490 L134 503 Z', C.a400, 2.4);
  s += forma('M44 446 L134 446 L134 503 L44 503 Z', C.a300, 2.6);
  s += linea('M54 462 H96 M54 470 H96 M54 478 H96 M54 486 H96', 2, C.a400);
  s += `<circle cx="120" cy="462" r="4" fill="${C.cian}" stroke="${C.tinta}" stroke-width="1.4"/>`;
  s += plana('M108 480 L126 480 L126 490 L108 490 Z', C.a400, 1.6);
  // Rollos acostados arriba
  s += forma('M58 418 L128 418 C134 418 134 432 128 432 L58 432 C52 432 52 418 58 418 Z', C.a600, 2.2);
  s += `<ellipse cx="58" cy="425" rx="4.5" ry="7" fill="${C.a300}" stroke="${C.tinta}" stroke-width="1.6"/>`;
  s += linea('M70 422 H120 M74 428 H112', 1.4, C.a300);

  }
  // Pierna de apoyo (derecha del espectador)
  s += forma('M150 296 L192 296 C194 340 192 380 190 410 L188 470 L160 470 L158 410 C156 378 152 340 150 296 Z', jean);
  s += mancha('M176 300 L192 300 C194 340 192 380 190 410 L188 468 L176 468 C178 420 180 360 176 300 Z', jeanS);
  s += linea('M168 330 C170 360 170 400 170 440', 1.6, jeanS);
  s += linea('M160 404 C168 408 176 408 186 404', 1.6, jeanL);
  if (pila) {
  // Pierna levantada sobre la pila
  s += forma('M120 296 L158 300 C150 330 132 358 114 384 L112 424 L84 424 L84 370 C94 342 108 318 120 296 Z', jean);
  s += mancha('M146 304 L158 302 C150 330 132 358 114 384 L112 422 L104 422 L104 382 C122 356 138 332 146 304 Z', jeanS);
  s += linea('M92 368 C98 374 106 378 114 380', 1.6, jeanL);
  } else {
    // Pierna izquierda (espectador) de pie, espejo de la de apoyo
    s += forma('M150 296 L108 296 C106 340 108 380 110 410 L112 470 L140 470 L142 410 C144 378 148 340 150 296 Z', jean);
    s += mancha('M138 300 L150 300 C148 340 144 378 142 410 L140 468 L132 468 C134 420 136 360 138 300 Z', jeanS);
    s += linea('M130 330 C128 360 128 400 128 440', 1.6, jeanS);
    s += linea('M112 404 C120 408 130 408 138 404', 1.6, jeanL);
  }
  // Cadena de billetera
  s += linea('M182 300 C188 322 176 332 196 340 C206 344 206 330 198 322', 2.4, C.a300);
  s += linea('M182 300 C188 322 176 332 196 340 C206 344 206 330 198 322', 1, C.tinta, ' stroke-dasharray="2 2.4"');

  if (pila) {
  // Zapatilla de caña, pie arriba (punta a la izquierda)
  s += forma('M84 408 L114 408 L116 432 C116 440 110 444 102 444 L70 444 C60 444 58 434 68 428 Z', '#1F252E');
  s += forma('M58 436 C58 428 68 426 78 428 L80 444 L70 444 C62 444 58 440 58 436 Z', C.niebla, 2);
  s += forma('M58 440 L116 440 L116 447 L60 447 Z', C.niebla, 2);
  s += linea('M88 414 L110 414 M88 420 L110 420 M89 426 L109 426', 1.6, C.niebla);
  s += `<circle cx="100" cy="434" r="3" fill="${C.niebla}" stroke="${C.tinta}" stroke-width="1.2"/>`;
  } else {
    // Zapatilla de caña del pie izquierdo (punta a la izquierda)
    s += forma('M140 462 L110 462 L108 486 C96 488 86 494 88 500 L142 500 C146 490 144 476 140 462 Z', '#1F252E');
    s += forma('M104 486 C94 486 86 492 88 500 L102 500 Z', C.niebla, 2);
    s += forma('M144 496 L86 496 L86 503 L144 503 Z', C.niebla, 2);
    s += linea('M136 468 L114 468 M136 474 L114 474 M135 480 L114 480', 1.6, C.niebla);
  }
  // Zapatilla de caña, pie de apoyo (punta a la derecha)
  s += forma('M160 462 L190 462 L192 486 C204 488 214 494 212 500 L158 500 C154 490 156 476 160 462 Z', '#1F252E');
  s += forma('M196 486 C206 486 214 492 212 500 L198 500 Z', C.niebla, 2);
  s += forma('M156 496 L214 496 L214 503 L156 503 Z', C.niebla, 2);
  s += linea('M164 468 L186 468 M164 474 L186 474 M165 480 L186 480', 1.6, C.niebla);

  // Polerón carbón
  s += forma('M104 172 C116 160 184 158 196 170 L206 206 L200 312 L100 312 L94 206 Z', pol);
  s += mancha('M176 164 C190 166 198 172 202 186 L206 206 L200 310 L184 310 C194 270 192 208 176 164 Z', polS);
  s += linea('M122 206 C126 236 126 262 122 290', 1.6, polS);
  // Elástico inferior con ribete cian
  s += forma('M100 300 L200 300 L200 314 L100 314 Z', polS, 2.4);
  s += linea('M102 303 H198', 2, C.cian);
  // Bolsillo canguro con ribetes cian y las manos adentro
  s += plana('M118 248 L182 248 L190 292 L110 292 Z', polL);
  s += linea('M118 248 L110 292 M182 248 L190 292', 3, C.cian);
  // Logo: la A
  s += linea('M138 214 L150 186 L162 214', 5, C.cian);
  s += linea('M143 204 Q150 197 157 204', 3.2, C.cian);
  s += `<text x="150" y="228" text-anchor="middle" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="7.4" letter-spacing=".4" fill="${C.cian}">THE ARCHITECT</text>`;

  // Brazos: codos afuera, manos en el bolsillo
  s += tubo('M106 180 C92 206 88 236 96 256 C102 266 112 266 120 262', pol, 24);
  s += mancha('M92 214 C88 232 90 248 96 256 L94 244 C92 234 92 224 92 214 Z', polL);
  s += tubo('M194 180 C208 206 212 236 204 256 C198 266 188 266 180 262', pol, 24);
  s += mancha('M206 196 C212 220 212 242 206 254 L210 240 C212 226 210 210 206 196 Z', polS);
  s += linea('M112 258 L122 266 M188 258 L178 266', 3, C.cian);

  // Capucha con forro cian y cordones
  s += forma('M112 166 C116 144 184 144 188 166 C182 184 118 184 112 166 Z', pol);
  s += mancha('M122 166 C130 154 170 154 178 166 C168 176 132 176 122 166 Z', C.c700);
  s += linea('M120 168 C132 180 168 180 180 168', 2.6, C.cian);
  s += linea('M136 176 C134 186 132 194 131 200 M164 176 C166 186 168 194 169 200', 2.4, C.cian);
  s += linea('M131 198 L131 205 M169 198 L169 205', 4.2, C.niebla);

  // Credencial E2
  s += credencial(190, 234, 'E2', 'M166 174 C172 196 180 214 187 236 M174 172 C180 194 188 212 193 236', 0.9);

  // Cuello
  s += forma('M139 126 L161 126 L162 160 C154 166 146 166 138 160 Z', piel);
  s += mancha('M152 128 L161 128 L161 158 C157 162 154 162 152 161 Z', pielS);

  // Cabeza angulosa
  s += forma('M122 86 C120 58 180 56 180 86 L179 106 C178 118 172 128 162 136 L150 142 L138 136 C128 128 122 118 121 106 Z', piel);
  s += mancha('M166 62 C176 70 180 78 180 88 L179 106 C178 118 172 128 162 136 L150 142 C160 132 166 120 168 106 C170 90 170 74 166 62 Z', pielS);
  // Orejas
  s += forma('M122 94 C113 92 113 110 122 112', piel, 2.2);
  s += forma('M179 94 C188 92 188 110 179 112', piel, 2.2);
  // Barba corta estilo italiano: línea de mejilla definida, bigote fino, casi sin volumen
  const dBarba = 'M122 104 L125.5 104 L136.5 122.6 C141 121.3 146 120.8 150 121.6 C154 120.8 159 121.3 163.5 122.6 L174.5 104 L178 104 L179 106 C178 118 172 128 162 136 L150 142 L138 136 C128 128 122 118 121 106 Z';
  s += mancha(dBarba, barba, ' opacity=".8"');
  s += linea('M125.5 104 L136.5 122.6 M174.5 104 L163.5 122.6', 1.1, '#2A1F18', ' opacity=".8"');
  s += linea('M121 106 C122 118 128 128 138 136 L150 142 L162 136 C172 128 178 118 179 106', 2.6);
  // Labios y mentón despejado bajo el labio
  s += forma('M142.5 125 C146 123.4 154 123.4 157.5 125 C155.5 129.4 144.5 129.4 142.5 125 Z', '#B36A5E', 1.4, '', false);
  s += linea('M143 125.4 C147 126.6 153 126.6 157 125.2', 1.6, '#6B2E2A');
  s += mancha('M146.5 131 C148 133.4 152 133.4 153.5 131 L152 129.2 L148 129.2 Z', piel);
  // Nariz
  s += linea('M151 100 C151 108 148 114 146 118 C149 121 154 121 157 118', 2.2);
  // Ojos detrás del visor (miran de lado, frescos)
  s += ojo(137, 99, 15, 6, 3, 0.5, 0.45, piel);
  s += ojo(164, 99, 15, 6, 3, 0.5, 0.45, piel);
  // Cejas algo fruncidas
  s += linea('M127 88 C132 84 140 85 146 88', 3.8);
  s += linea('M155 88 C161 85 168 84 174 88', 3.8);
  // Visor cian envolvente
  s += `<path d="M112 92 C128 86 172 86 188 92 L186 108 C170 114 130 114 114 108 Z" fill="${C.cian}" opacity=".18" transform="translate(0 1) scale(1.02)" style="filter:blur(3px)"/>`;
  s += `<path d="M112 92 C128 86 172 86 188 92 L186 108 C170 114 130 114 114 108 Z" fill="${C.c300}" fill-opacity=".5" stroke="${C.tinta}" stroke-width="2.4" stroke-linejoin="round"/>`;
  s += linea('M118 94 C132 90 168 90 182 94', 1.6, C.blanco, ' opacity=".85"');
  s += linea('M122 104 L134 96 M160 106 L170 98', 1.6, C.blanco, ' opacity=".55"');
  s += linea('M150 91 L150 110', 1.4, C.tinta, ' opacity=".35"');
  s += linea('M112 95 L118 96 M188 95 L182 96', 2.2);

  // Degradado a los lados, en pasos como de máquina
  s += mancha('M121 66 C119 72 119 78 120 82 L127 80 C126 76 127 70 129 66 Z', pelo);
  s += mancha('M120 82 C120 86 120 90 121 94 L126 93 C125 89 126 85 127 80 Z', pelo, ' opacity=".6"');
  s += mancha('M121 94 L121 100 L125 100 L126 93 Z', pelo, ' opacity=".3"');
  s += mancha('M179 66 C181 72 181 78 180 82 L173 80 C174 76 173 70 171 66 Z', pelo);
  s += mancha('M180 82 C180 86 180 90 179 94 L174 93 C175 89 174 85 173 80 Z', pelo, ' opacity=".6"');
  s += mancha('M179 94 L179 100 L175 100 L174 93 Z', pelo, ' opacity=".3"');
  // Arriba: corte corto y desordenado, mechones hacia adelante y un flequillo irregular
  s += forma('M121 70 C117 60 120 50 128 46 C126 40 132 36 138 38 C140 32 150 30 154 36 C160 31 170 34 170 40 C178 40 184 48 180 56 C184 62 183 68 181 72 L175 72 C172 76 168 78 164 76 L160 80 C156 78 152 74 150 72 L146 79 C142 78 139 74 138 71 L132 77 C130 74 128 71 127 70 L124 75 Z', pelo, 2.4);
  s += mancha('M166 36 C170 34 170 40 170 40 C178 40 184 48 180 56 C184 62 183 68 181 72 L175 72 C178 62 176 48 166 36 Z', peloS);
  s += linea('M130 52 C136 46 142 44 148 44 M146 40 C152 38 158 38 162 42 M134 62 C140 56 148 54 154 56 M158 52 C164 50 170 52 174 56 M140 68 C144 64 148 62 152 62', 1.8, peloL);

  return s;
}
