import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// The Engine · Ejecución y sistemas · E4. Según su hoja de estilo:
// polera carbón con el ícono de motor, audífonos al cuello, pantalón cargo, botas, tablet encendida y un engranaje.
// El naranjo "motor" (#F5883A) no es coral: el coral queda sólo para agendar.
export const MOTOR = '#F5883A', MOTOR_S = '#C9661F';

export function engine() {
  const piel = '#D49A6A', pielS = '#B67C4D';
  const pol = '#343A41', polS = '#23282E', polL = '#454D56';
  const cargo = '#4B5140', cargoS = '#363B2E', cargoL = '#5E6650';
  const pelo = '#3A2A20', peloS = '#22170F', peloL = '#5A4434';
  let s = suelo(160, 503, 104);

  // Engranaje apoyado en el suelo
  let dientes = '';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const x = 240 + Math.cos(a) * 30, y = 474 + Math.sin(a) * 30;
    dientes += `<rect x="${(x - 5).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="10" height="10" rx="2" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${C.a300}" stroke="${C.tinta}" stroke-width="1.8"/>`;
  }
  s += dientes;
  s += `<circle cx="240" cy="474" r="28" fill="${C.a300}" stroke="${C.tinta}" stroke-width="2.6"/>`;
  s += mancha('M258 456 C268 470 266 488 252 496 C262 484 262 468 258 456 Z', C.a400);
  s += `<circle cx="240" cy="474" r="10" fill="${C.a600}" stroke="${C.tinta}" stroke-width="2.2"/>`;

  // Pantalón cargo
  s += forma('M116 300 L152 300 L150 340 L148 466 L118 466 C116 410 114 350 116 300 Z', cargo);
  s += forma('M150 300 L186 300 C188 350 186 410 184 466 L154 466 L152 340 Z', cargo);
  s += mancha('M172 304 L186 304 C188 350 186 410 184 464 L172 464 C174 410 176 350 172 304 Z', cargoS);
  s += linea('M132 330 C132 380 131 420 131 452', 1.6, cargoS);
  s += linea('M124 404 C130 408 140 408 146 404 M156 404 C162 408 172 408 180 404', 1.6, cargoS);
  // Bolsillos laterales
  s += forma('M106 356 L126 354 L126 396 L108 398 Z', cargoL, 2.2);
  s += plana('M106 356 L126 354 L126 364 L106 366 Z', cargoS, 1.6);
  s += forma('M176 354 L196 356 L194 398 L176 396 Z', cargoL, 2.2);
  s += plana('M176 354 L196 356 L196 366 L176 364 Z', cargoS, 1.6);
  // Botas
  s += forma('M114 458 L150 458 L152 486 L152 503 L100 503 C98 490 104 472 114 458 Z', '#2B2622');
  s += mancha('M100 495 L152 495 L152 503 L100 503 Z', '#171412');
  s += linea('M122 466 L142 466 M121 473 L142 473 M121 480 L142 480', 1.8, MOTOR);
  s += forma('M152 458 L188 458 C200 472 206 490 204 503 L152 503 L152 486 Z', '#2B2622');
  s += mancha('M152 495 L204 495 L204 503 L152 503 Z', '#171412');
  s += linea('M160 466 L180 466 M160 473 L181 473 M160 480 L182 480', 1.8, MOTOR);

  // Cinturón
  s += plana('M112 296 L190 296 L190 310 L112 310 Z', '#3A2E26', 2.2);
  s += plana('M144 294 L158 294 L158 312 L144 312 Z', C.a300, 1.8);

  // Polera carbón, hombros anchos
  s += forma('M104 170 C116 160 184 160 196 170 L208 212 L196 216 L192 300 L108 300 L104 216 L92 212 Z', pol);
  s += mancha('M178 164 C192 166 200 172 204 186 L208 212 L196 216 L192 298 L180 298 C188 262 188 208 178 164 Z', polS);
  s += linea('M104 216 L108 204 M196 216 L192 204', 1.8, polS);
  // Cuello de la polera
  s += forma('M132 160 C136 176 164 176 168 160 L172 166 C166 186 134 186 128 166 Z', polL, 2.2);
  // Ícono de motor naranjo y el nombre
  // Pictograma de motor: tapa, bloque, soporte y ventilador
  s += mancha('M141 194 H159 V199 H141 Z M147 199 H153 V205 H147 Z', MOTOR);
  s += mancha('M134 205 H166 V226 H134 Z', MOTOR);
  s += mancha('M127 210 H134 V221 H127 Z M123 206 H127 V225 H123 Z', MOTOR);
  s += mancha('M166 209 L176 202 V229 L166 222 Z', MOTOR);
  s += mancha('M140 211 H160 V214 H140 Z M140 217 H154 V220 H140 Z', pol, ' opacity=".55"');
  s += `<text x="150" y="238" text-anchor="middle" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="8.4" letter-spacing=".5" fill="${MOTOR}">THE ENGINE</text>`;

  // Credencial E4 al cinturón
  s += credencial(186, 300, 'E4', null, 0.78);

  // Brazos
  s += tubo('M100 214 C94 232 94 248 104 258 C110 264 118 268 124 270', piel, 20);
  s += mancha('M96 226 C94 238 96 250 102 256 L100 246 C98 240 97 232 96 226 Z', pielS);
  s += tubo('M200 214 C208 230 208 246 200 254 C194 260 188 262 182 264', piel, 20);
  s += mancha('M206 226 C208 238 206 248 200 254 L204 242 C205 236 206 230 206 226 Z', pielS);
  // Mangas cortas
  s += forma('M92 212 L104 170 C96 176 88 196 86 212 C90 218 98 220 104 216 Z', pol, 2.4);
  s += forma('M208 212 L196 170 C204 176 212 196 214 212 C210 218 202 220 196 216 Z', pol, 2.4);
  s += plana('M86 208 C92 214 100 216 106 214 L104 220 C98 222 90 220 86 216 Z', polS, 1.6);
  s += plana('M214 208 C208 214 200 216 194 214 L196 220 C202 222 210 220 214 216 Z', polS, 1.6);

  // Tablet encendida
  s += `<path d="M112 236 L200 228 L206 296 L118 306 Z" fill="${C.cian}" opacity=".25" style="filter:blur(10px)"/>`;
  s += forma('M114 244 L196 236 L200 290 L118 298 Z', '#1B222B');
  s += plana('M121 249 L189 242 L192 284 L124 291 Z', '#0C3A48', 1.6);
  s += linea('M130 262 L146 260 M146 260 L150 272 M150 272 L166 270 M166 270 L172 256 M172 256 L184 255', 1.8, C.cian);
  [[130, 262], [146, 260], [150, 272], [166, 270], [172, 256], [184, 255]].forEach(([x, y], i) => {
    s += `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" rx="1.5" fill="${i === 5 ? C.c300 : C.cian}"/>`;
  });
  s += linea('M130 280 L160 277 M130 286 L150 284', 1.6, C.c300, ' opacity=".7"');
  // Manos en los bordes de la tablet
  s += forma('M110 258 C112 250 124 250 126 258 L126 278 C120 286 110 284 108 276 Z', piel, 2.2);
  s += linea('M112 262 L124 262 M112 268 L124 268', 1.3, pielS);
  s += forma('M190 250 C192 242 204 244 204 252 L204 272 C198 280 188 278 188 270 Z', piel, 2.2);
  s += linea('M190 256 L202 256 M190 262 L202 262', 1.3, pielS);

  // Cuello
  s += forma('M139 136 L161 136 L162 170 C154 176 146 176 138 170 Z', piel);
  s += mancha('M152 138 L161 138 L161 168 C157 172 154 172 152 171 Z', pielS);

  // Audífonos naranjos al cuello
  s += tubo('M122 174 C128 194 172 194 178 174', '#2A3040', 5);
  s += forma('M106 170 C104 161 124 158 128 166 L131 184 C132 193 112 196 110 188 Z', MOTOR, 2.4);
  s += mancha('M112 171 L122 169 L124 184 L114 186 Z', '#2A3040');
  s += forma('M194 170 C196 161 176 158 172 166 L169 184 C168 193 188 196 190 188 Z', MOTOR, 2.4);
  s += mancha('M188 171 L178 169 L176 184 L186 186 Z', '#2A3040');
  s += mancha('M108 172 C108 166 112 163 118 163 L114 168 Z', '#FFB070', ' opacity=".8"');

  // Cabeza
  s += forma('M122 94 C120 64 180 62 180 94 L179 114 C177 130 168 142 150 146 C132 142 123 130 121 114 Z', piel);
  s += mancha('M168 70 C178 78 180 86 180 96 L179 114 C177 130 168 142 150 146 C160 138 168 126 170 112 C172 96 172 82 168 70 Z', pielS);
  // Barba de pocos días
  s += mancha('M122 112 C124 132 136 144 150 146 C164 144 176 132 178 112 C174 124 166 130 158 131 C154 127 146 127 142 131 C134 130 126 124 122 112 Z', '#5A4638', ' opacity=".42"');
  // Orejas
  s += forma('M122 100 C113 98 113 116 122 118', piel, 2.2);
  s += forma('M179 100 C188 98 188 116 179 118', piel, 2.2);
  // Ojos atentos, cejas rectas y serias
  s += ojo(137, 106, 15, 7, 0, 0.5, 0.28, piel);
  s += ojo(164, 106, 15, 7, 0, 0.5, 0.28, piel);
  s += linea('M126 95 L147 94', 4.2);
  s += linea('M154 94 L175 95', 4.2);
  s += linea('M128 114 C132 116 138 116 143 114 M158 114 C162 116 168 116 172 114', 1.3, pielS);
  // Nariz y media sonrisa
  s += linea('M151 104 C151 112 148 118 146 122 C149 125 154 125 157 122', 2.2);
  s += linea('M140 134 C146 136 154 136 162 131', 2.6);

  // Pelo corto con jopo texturizado y lados rebajados
  s += forma('M120 98 C114 78 122 60 140 54 C156 48 178 52 186 68 C190 78 186 90 180 96 C176 86 170 80 160 78 C152 82 140 82 132 80 C126 84 122 90 120 98 Z', pelo);
  s += mancha('M172 56 C184 62 190 76 184 94 L180 96 C180 84 178 68 172 56 Z', peloS);
  s += forma('M128 70 C124 56 136 44 154 44 C170 44 180 52 182 62 C170 56 156 56 146 60 C138 62 132 66 128 70 Z', pelo, 2);
  s += linea('M138 64 C146 58 158 56 170 60 M136 72 C146 68 156 68 166 70', 1.8, peloL);
  s += mancha('M121 98 L126 90 L126 108 L121 108 Z', peloS, ' opacity=".55"');
  s += mancha('M179 98 L174 90 L174 108 L179 108 Z', peloS, ' opacity=".55"');

  return s;
}
