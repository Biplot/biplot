// Aby en vector, versión oficina: urbana (bomber, celular con aro de luz) y elegante (vestido esmeralda, micrófono).
// Ondas largas con balayage y partidura al medio, sonrisa amplia, aros dorados.
import { figura, cara, rr, elipse, T, BLANCO } from './kit.mjs';

const K = {
  s: '#F3CFB0', S: '#DDAE8C', ru: '#E9967A', ce: '#4A3222', la: '#D24E63',
  r: '#7A5334', b: '#C9924E', d: '#8E6236', l: '#EBC98F', L: '#F4DDA8', or: '#D9A441', ors: '#A87A22', ci: '#17C3B2'
};

// Pelo largo por detrás (antes del cuerpo)
function peloAtras(f) {
  f.forma('M0.4 9.6C-0.6 16 -0.5 23.6 0.4 30.2Q4.2 32 9.8 31.1Q15.4 32 19.4 30.2C20.3 23.6 20.4 16 19.4 9.6Z', K.d, { cab: true });
  f.mancha('M0.3 27.4Q4.2 29.4 9.8 28.6Q15.4 29.4 19.5 27.4L19.4 30.2Q15.4 32 9.8 31.1Q4.2 32 0.4 30.2Z', K.l, { cab: true });
}
// Cara, flequillo con partidura al medio y cortinas onduladas sobre los hombros
function cabeza(f, pinza) {
  cara(f, { piel: K.s, sombra: K.S, ojos: 'grandes', cejas: K.ce, boca: 'dientes', labio: K.la, rubor: K.ru, oreja: false });
  f.linea('M7.9 13.2L7 12.5M15.3 13.2L16.1 12.5', 0.4, T, { cab: true });
  // Aro dorado
  f.linea('M2.5 16A1 1.2 0 1 0 2.6 18.4', 0.55, K.or, { cab: true });
  // Parte de arriba, raíz más oscura
  f.forma('M2 10C1 4.6 4.4 0.3 9.6 0.1C14.8 0.3 18.4 4.4 17.8 10C16.8 8.6 15.2 7.4 13.4 6.8C12 6.3 10.8 5.4 9.9 4.5C9 5.4 7.6 6.4 6.2 6.8C4.6 7.4 3.2 8.6 2 10Z', K.b, { cab: true });
  f.mancha('M6.2 1.2C7.4 0.6 8.6 0.4 9.6 0.4C10.8 0.4 12 0.6 13.2 1.2C12 1.4 10.9 2.2 9.9 3.6C8.9 2.2 7.6 1.4 6.2 1.2Z', '#A87A45', { cab: true });
  f.linea('M9.9 0.6V4.4', 0.4, K.r, { cab: true });
  f.linea('M4.2 7.2Q6.4 5.8 8.6 3.6M11.2 3.6Q13.4 5.8 15.6 7.2', 0.45, K.l, { cab: true });
  // Cortinas onduladas: base miel, luz continua que sigue la ola, puntas claras
  f.forma('M2.2 9.2C0.6 12.8 0.8 17.8 1.4 21.8C1.9 25.2 0.8 28.2 1.8 30.6Q3.4 31.3 4.6 30.2C4.1 27.4 5 24.6 4.6 21.2C4.2 17.4 3.9 13.2 4.8 9.4Z', K.b, { cab: true });
  f.forma('M17.6 9.2C19.2 12.8 19 17.8 18.4 21.8C17.9 25.2 19 28.2 18 30.6Q16.4 31.3 15.2 30.2C15.7 27.4 14.8 24.6 15.2 21.2C15.6 17.4 15.9 13.2 15 9.4Z', K.b, { cab: true });
  f.linea('M3 10.8C2.2 14 3.4 16.6 2.6 19.6C1.9 22.6 3.3 25.2 2.6 28.2', 0.55, K.l, { cab: true });
  f.linea('M16.8 10.8C17.6 14 16.4 16.6 17.2 19.6C17.9 22.6 16.5 25.2 17.2 28.2', 0.55, K.l, { cab: true });
  f.mancha('M1.5 27.6Q3 28.3 4.4 27.4C4.3 28.4 4.4 29.4 4.6 30.2Q3.4 31.3 1.8 30.6C1.5 29.6 1.4 28.6 1.5 27.6Z', K.L, { cab: true });
  f.mancha('M18.3 27.6Q16.8 28.3 15.4 27.4C15.5 28.4 15.4 29.4 15.2 30.2Q16.4 31.3 18 30.6C18.3 29.6 18.4 28.6 18.3 27.6Z', K.L, { cab: true });
  if (pinza) f.forma(rr(3.2, 5.4, 3.2, 1, 0.45), K.ci, { cab: true, w: 0.35, sil: false });
}

// ───────── Urbana ─────────
export function abyUrbana() {
  const U = {
    bom: '#17446F', boms: '#0F3558', cu: '#17C3B2', te: '#F2F4F7', ca: '#E8DFC8', cas: '#CFC2A3', ze: '#F2F4F7',
    bol: '#091D33', ri: '#7FD8CF', pr: '#FFFFFF', prn: '#0E2A47', fono: '#091D33'
  };
  const f = figura();
  peloAtras(f);
  // Cargo ancho de tiro alto y zapatillas gruesas
  f.forma('M9.9 33.6H17L16.3 46.4H9.6Z', U.ca); f.forma('M17 33.6H23.9L24.4 46.4H17.7Z', U.ca);
  f.mancha('M15.4 34H16.6L16 46.2H14.9Z', U.cas); f.mancha('M22.6 34H23.8L24.2 46.2H23Z', U.cas);
  f.forma(rr(8.7, 38, 2.2, 4.1, 0.4), U.cas, { w: 0.35 }); f.forma(rr(23.3, 38, 2.2, 4.1, 0.4), U.cas, { w: 0.35 });
  for (const x of [0, 7.6]) {
    f.forma(`M${10.2 + x} 45.6H${15.6 + x}Q${16.7 + x} 46.2 ${17.1 + x} 47.5V48.1H${9.7 + x}V46.4Q${9.7 + x} 45.6 ${10.2 + x} 45.6Z`, U.ze);
    f.forma(rr(9.2 + x, 47.7, 8.3, 2.4, 0.7), U.cu);
    f.linea(`M${11 + x} 46.7H${13.6 + x}`, 0.4, '#B9C8D8');
  }
  // Polera corta y bomber abierta
  f.forma('M13.6 23H20.2L20.4 33.2H13.4Z', U.te);
  f.mancha(elipse(15.9, 28.4, 0.7, 0.45), U.prn); f.mancha(elipse(18, 28.4, 0.45, 0.45), U.cu);
  f.forma('M9.2 24C10.4 23.3 12.2 23 13.8 23L13.6 33.4H9.8L8.7 25.6Q8.6 24.4 9.2 24Z', U.bom);
  f.forma('M24.6 24C23.4 23.3 21.6 23 20 23L20.2 33.4H24L25.1 25.6Q25.2 24.4 24.6 24Z', U.bom);
  f.mancha('M22.8 23.4Q25.1 23.7 25.1 25.6L24 33.3H22.6Z', U.boms);
  f.linea('M13.7 23.2V25M20.1 23.2V25', 0.8, U.cu);
  f.forma(rr(9.6, 32.8, 14.8, 1.5, 0.45), U.cu, { w: 0.4 });
  // Pase de PRENSA en el bomber
  f.forma(rr(10.5, 25.7, 3, 3.3, 0.4), U.pr, { w: 0.35, sil: false });
  f.mancha('M10.7 25.9H13.3V26.9H10.7Z', U.prn);
  // Correa cruzada y bolso
  f.linea('M19.4 24.4Q21.8 28.4 22.6 32.8', 0.7, U.bol);
  f.forma(rr(20.9, 33.6, 4.6, 4.2, 0.6), U.bol);
  f.linea('M21.9 35.2H24.4', 0.5, U.cu);
  // Brazo derecho a la correa, con el parche de Plotty
  f.tubo('M24.3 25Q26.5 28.4 25.3 32.1', U.bom, 2.3);
  f.forma(rr(25, 26.5, 1.8, 1.7, 0.35), U.te, { w: 0.3, sil: false }); f.mancha(elipse(25.9, 27.3, 0.35, 0.35), U.cu);
  f.forma(rr(23.9, 31.6, 2.9, 1.2, 0.4), U.cu, { w: 0.35 });
  f.forma(elipse(24.6, 33.6, 1.1, 1), K.s, { w: 0.4 });
  // Cabeza
  cabeza(f, true);
  // Brazo en alto con el celular y el aro de luz
  f.tubo('M9.2 24.8Q6.6 23.4 6.4 19.2', U.bom, 2.3);
  f.forma(rr(5, 18.3, 2.9, 1.2, 0.4), U.cu, { w: 0.35 });
  f.forma(rr(5.1, 15.2, 2.7, 3.2, 0.9), K.s, { w: 0.45 });
  f.forma(rr(4.1, 8, 3.8, 7, 0.6), U.fono);
  f.mancha(rr(4.7, 8.8, 2.6, 5, 0.3), U.ri); f.linea('M5.3 9.6V11.2', 0.35, BLANCO);
  f.tubo('M3.4 6.3A2.6 1.3 0 1 0 8.6 6.3A2.6 1.3 0 1 0 3.4 6.3', U.ri, 0.6);
  return f;
}

// ───────── Elegante ─────────
export function abyElegante() {
  const E = { ve: '#0D6B57', ves: '#084A3C', vel: '#3AA58A', mi: '#3A424E', mil: '#8E99A8', fl: '#17C3B2' };
  const f = figura();
  peloAtras(f);
  // Cola del pañuelo por detrás
  f.forma('M22.6 25Q24.7 30 24.1 40.4L22.8 40.8Q23 32 21.8 25.6Z', E.ves);
  // Tacos dorados
  f.forma('M12.2 47.6H15.2Q16 48.2 15.8 49.4V50.1H12.8L12.4 49.2Z', K.or, { w: 0.4 });
  f.forma('M18.4 47.6H21.4Q22.2 48.2 22 49.4V50.1H19L18.6 49.2Z', K.or, { w: 0.4 });
  f.linea('M12.9 49.4V50.6M19.1 49.4V50.6', 0.5, K.ors);
  // Hombros descubiertos y vestido de satín esmeralda con abertura
  f.forma('M9.6 25.6C10.6 24.2 12.6 23.6 13.8 23.6H20C21.2 23.6 23.2 24.2 24.2 25.6L23.8 27.2H10Z', K.s);
  f.forma('M12 33H21.8L23.4 41L24.1 47.9Q16.8 48.9 9.5 47.9L10.4 41Z', E.ve);
  f.mancha('M19.3 41.1H20.9L21.4 47.9L19.6 48.1Z', K.s);
  f.linea('M19.3 41.1L19.6 48M20.9 41.1L21.4 47.9', 0.4, T);
  f.linea('M13.6 35.4Q13.1 41 13.5 47', 0.6, E.vel);
  f.mancha('M22.2 33.4L23.4 41L24 47.7L22.6 47.9L21.6 41Z', E.ves, { op: 0.8 });
  f.forma('M11.8 25.8Q16.9 24.8 22 25.8L21.8 33.4H12Z', E.ve);
  f.linea('M14.2 28.2H19.4M15 30.2H18.6', 0.55, E.vel);
  f.forma(rr(11.9, 32.6, 10, 1, 0.3), E.ves, { w: 0.35, sil: false });
  // Pañuelo anudado al cuello
  f.forma('M13 22.8Q16.8 24.6 20.6 22.8L20.8 24.5Q16.8 26.1 12.8 24.5Z', E.ve, { w: 0.45 });
  f.forma(elipse(17.3, 24.9, 1, 0.8), E.vel, { w: 0.35 });
  // Brazo en la cintura
  f.tubo('M22.8 25.8Q25.5 28.4 24.6 31.6Q24.2 33 22.4 33.4', K.s, 2);
  // Cabeza
  cabeza(f, false);
  // Brazo con el micrófono y el brazalete
  f.tubo('M10.4 26Q8.3 28.6 9.6 31', K.s, 2);
  f.tubo('M9.6 31Q11.4 30.6 12.1 28.6', K.s, 1.8);
  f.linea('M8.7 30.9L10.3 30.3', 0.7, K.or);
  f.forma(rr(11.6, 24.6, 1.4, 4, 0.4), E.mi, { w: 0.4 });
  f.forma(rr(11, 24.3, 2.6, 1.1, 0.3), E.fl, { w: 0.3 });
  f.forma(elipse(12.3, 22.8, 1.6, 1.6), E.mi, { w: 0.45 });
  f.linea('M11.4 22.2Q12.2 21.6 13 22', 0.4, E.mil);
  f.forma(elipse(12.3, 28.9, 1, 1), K.s, { w: 0.4 });
  return f;
}
