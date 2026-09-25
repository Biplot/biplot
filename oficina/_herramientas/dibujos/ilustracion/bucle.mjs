import { C, forma, plana, mancha, linea, tubo, credencial, suelo, ojo } from './tinta.mjs';

// Bucle "Kilo" · Desarrollo · E5. Marco 300×520, suelo en y=505.
// Herencia del pulpo: rastas azules que caen y se enroscan como tentáculos, audífonos al cuello, la taza.
export function bucle() {
  const piel = C.p3, pielS = C.p3s;
  const polera = C.a700, poleraS = '#0F3558', poleraL = '#1F5A92';
  const pelo = '#27467A', peloS = '#18305A', peloL = '#4A7BB5';
  const pant = '#1E2F45', pantS = '#142236';
  let s = suelo(150, 503, 82);

  // Rastas de atrás
  [
    'M124 92 C108 116 102 150 108 184 C112 200 124 204 128 194 C131 186 124 182 120 188',
    'M134 86 C122 118 118 158 124 190 C126 198 132 200 134 194',
    'M178 90 C194 114 202 148 196 182 C192 198 180 202 176 192 C174 184 182 180 186 186',
    'M168 86 C180 118 184 156 178 188 C176 196 170 198 168 192'
  ].forEach(d => { s += tubo(d, pelo, 11); });

  // Pierna derecha (espectador) algo doblada hacia afuera, pierna izquierda recta
  s += forma('M152 300 L188 300 C190 340 192 372 196 398 C198 420 196 446 194 470 L170 470 C170 446 168 424 164 404 C160 380 156 350 152 330 Z', pant);
  s += mancha('M176 304 L188 304 C190 342 192 372 196 398 C198 420 196 446 194 468 L184 468 C186 440 186 414 182 394 C178 366 178 334 176 304 Z', pantS);
  s += forma('M114 300 L152 300 L150 330 C148 366 146 420 144 470 L118 470 C116 420 114 366 114 300 Z', pant);
  s += linea('M132 330 C132 380 131 420 131 452', 1.6, pantS);
  // Puños del jogger
  s += plana('M116 456 L145 456 L145 472 L116 472 Z', pantS);
  s += plana('M168 456 L195 456 L195 472 L168 472 Z', pantS);

  // Zapatillas grandes, en pato
  s += forma('M118 470 L146 470 C150 482 150 494 148 502 L88 502 C84 490 96 476 118 470 Z', C.niebla);
  s += mancha('M89 494 L148 494 L148 502 L88 502 Z', C.cian);
  s += linea('M104 482 L118 478 M110 488 L124 484', 1.6);
  s += forma('M168 470 L196 470 C216 476 226 490 222 502 L166 502 C163 492 164 480 168 470 Z', C.niebla);
  s += mancha('M166 494 L223 494 L222 502 L166 502 Z', C.cian);
  s += linea('M190 478 L204 482 M184 484 L198 488', 1.6);

  // Polerón oversize, hombros caídos (el izquierdo más bajo)
  s += forma('M104 164 C118 150 186 148 200 160 L210 196 L204 312 L100 312 L96 200 Z', polera);
  s += mancha('M178 156 C192 156 200 162 204 176 L210 198 L204 310 L186 310 C194 272 192 210 178 156 Z', poleraS);
  s += linea('M126 200 C130 230 128 262 124 290 M170 206 C168 236 170 262 176 290', 1.6, poleraS);
  // Bolsillo canguro
  s += plana('M120 252 L180 252 L188 294 L112 294 Z', poleraL);
  s += linea('M120 252 L112 294 M180 252 L188 294', 2.6);
  // Elástico inferior
  s += forma('M100 302 L204 302 L204 316 L100 316 Z', poleraS, 2.4);

  // Cuello
  s += forma('M139 124 L161 124 L162 152 C154 158 146 158 138 152 Z', piel);
  s += mancha('M153 126 L161 126 L161 150 C157 154 154 154 152 153 Z', pielS);
  // Capucha abajo
  s += forma('M112 160 C116 138 184 138 188 160 C182 178 118 178 112 160 Z', poleraL);
  s += mancha('M122 160 C130 150 170 150 178 160 C168 168 132 168 122 160 Z', poleraS);

  // Audífonos al cuello
  s += tubo('M122 176 C128 194 172 194 178 176', '#2A3444', 5);
  s += forma('M106 170 C104 162 124 158 128 166 L132 186 C134 194 114 198 112 190 Z', C.cian, 2.4);
  s += forma('M194 170 C196 162 176 158 172 166 L168 186 C166 194 186 198 188 190 Z', C.cian, 2.4);
  s += mancha('M112 170 L124 167 L127 186 L116 189 Z', C.c700);
  s += mancha('M188 170 L176 167 L173 186 L184 189 Z', C.c700);

  // Cordones
  s += linea('M140 176 C139 196 137 208 136 222', 2.4, C.niebla) + linea('M136 220 L136 228', 4.4, C.cian);
  s += linea('M160 176 C161 194 163 206 164 216', 2.4, C.niebla) + linea('M164 214 L164 222', 4.4, C.cian);

  // Credencial E5
  s += credencial(172, 214, 'E5', 'M146 178 C152 196 162 206 172 216 M156 178 C164 192 170 202 174 216');

  // Brazo derecho: codo afuera, mano al bolsillo
  s += tubo('M198 172 C214 198 220 236 206 262 C198 274 188 276 180 272', polera, 24);
  s += mancha('M206 186 C216 210 218 238 208 256 L214 246 C220 226 216 202 206 186 Z', poleraS);
  s += linea('M178 262 L186 282', 2.6);

  // Brazo izquierdo con la taza
  s += tubo('M106 172 C88 196 80 232 90 254 C98 266 110 262 116 250', polera, 24);
  s += plana('M98 240 L120 232 L124 252 L104 258 Z', poleraS);
  // Taza con </>
  s += forma('M112 206 L142 206 L140 244 C138 250 116 250 114 244 Z', C.niebla);
  s += `<text x="134" y="236" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="9" fill="${C.a700}">&lt;/&gt;</text>`;
  s += plana('M142 214 C154 214 154 234 141 234', 'none', 3);
  s += linea('M122 198 C118 190 126 186 122 178 M132 196 C128 188 136 184 132 176', 2, C.a300);
  // Mano
  s += forma('M106 226 C110 218 124 218 126 226 L126 242 C120 248 108 246 106 240 Z', piel);
  s += linea('M111 229 L124 229 M110 235 L124 235', 1.6, pielS);

  // Cabeza alargada, pómulos marcados (inclinada)
  s += '<g transform="rotate(-5 150 150)">';
  s += forma('M122 86 C120 60 180 56 181 84 L180 106 C179 118 172 128 164 134 L152 140 C144 140 136 136 130 130 C124 122 122 112 122 100 Z', piel);
  s += mancha('M168 66 C178 72 182 80 181 90 L180 106 C179 118 172 128 164 134 L152 140 C160 132 166 122 170 110 C174 96 174 80 168 66 Z', pielS);
  // Orejas
  s += forma('M122 94 C112 92 112 112 123 114', piel, 2.4);
  s += forma('M180 94 C190 92 190 112 179 114', piel, 2.4);
  // Barbita
  s += plana('M145 130 C147 136 155 136 158 129 C158 138 154 142 151 142 C148 142 145 138 145 130 Z', '#1B2433', 1.6);
  // Ojos con ojeras
  s += ojo(137, 101, 17, 7.5, 2.5, 1, 0.45, piel);
  s += ojo(166, 100, 17, 7.5, 2.5, 1, 0.45, piel);
  s += linea('M130 110 C135 113 141 113 145 110 M159 109 C164 112 170 112 174 109', 1.5, pielS);
  // Cejas
  s += linea('M127 91 C133 86 141 86 146 90', 4);
  s += linea('M157 89 C163 84 171 85 176 90', 4);
  // Nariz con quiebre
  s += linea('M152 98 C151 106 150 112 147 118 C150 121 154 121 157 118', 2.4);
  // Boca: media sonrisa ladeada
  s += linea('M141 127 C148 129 155 128 162 122', 2.8);
  s += linea('M161 120 L164 124', 2);

  // Pelo: masa de arriba con moño de rastas y cinta cian
  s += forma('M116 94 C106 62 128 40 154 42 C180 44 196 64 186 96 C180 84 170 76 158 76 C148 84 134 80 126 76 C120 82 118 88 116 94 Z', pelo);
  s += mancha('M164 48 C180 54 192 70 186 94 C182 84 176 78 170 76 C172 66 170 56 164 48 Z', peloS);
  s += linea('M132 54 C138 62 146 64 152 60 M160 54 C164 62 170 66 178 66 M128 68 C134 72 140 74 146 72', 2, peloL);
  // Moño de rastas arriba
  s += tubo('M150 44 C146 30 152 18 164 16 C176 14 182 26 176 34 C172 40 164 38 164 32', pelo, 11);
  s += tubo('M144 44 C134 34 126 36 124 28 C122 20 132 16 136 22', pelo, 10);
  s += plana('M142 40 L160 38 L162 48 L144 50 Z', C.cian, 2);
  // Rastas de adelante que se enroscan
  s += tubo('M124 76 C112 94 108 116 112 136 C114 150 126 152 128 144 C130 136 122 134 118 140', pelo, 10);
  s += tubo('M180 76 C192 94 196 118 192 138 C190 152 178 154 176 146 C174 138 182 136 186 142', pelo, 10);
  s += linea('M114 104 C112 114 112 122 113 130 M190 104 C192 114 192 122 191 130', 1.8, peloL);

  s += '</g>';
  return s;
}
