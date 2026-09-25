// El equipo en vector, versión oficina. Mismo diseño que los sprites pixel (pixel/equipo.mjs),
// con curvas y el trazo de tinta del elenco.
import { figura, cara, zapatillas, piernas, credencial, rr, elipse, engranaje, puntos, T, BLANCO } from './kit.mjs';

// ───────── Lupe · Diagnóstico ─────────
export function lupe() {
  const K = {
    s: '#F3CFB0', S: '#DDAE8C', h: '#DCE3EA', H: '#FFFFFF', d: '#A9B5C3', lap: '#35679A', punta: '#F4ECD8',
    ci: '#17C3B2', lente: '#DDF4F1', g: '#E8DFC8', gs: '#CFC2A3', gl: '#F4ECD8', gd: '#B9AD8E', az: '#17446F', az2: '#35679A',
    med: '#091D33', bota: '#17446F', suela: '#0E2A47', papel: '#F4ECD8', gris: '#B9C8D8', ru: '#EBA08A', boca: '#7A2E2A'
  };
  const f = figura();
  // Medias y botines
  f.forma(rr(12, 41, 3, 5.6, 0.3), K.med); f.forma(rr(18.2, 41, 3, 5.6, 0.3), K.med);
  zapatillas(f, 46.2, K.bota, K.suela);
  // Gabardina acampanada con solapas, botones y cinturón
  f.forma('M9.4 24C11.5 23.1 21.6 23.1 23.4 24Q24.2 24.4 24.1 25.6L24.4 31L25.2 41.6Q16.5 42.8 7.8 41.6L8.8 31L9 25.6Q8.9 24.4 9.4 24Z', K.g);
  f.mancha('M22.2 24.2C23.2 24.3 24 24.8 24.1 25.6L24.4 31L25.1 41.5L23.3 41.7L22.7 31Z', K.gs);
  f.linea('M17.1 29.4V42.2', 0.4, K.gd);
  f.forma('M12.6 24.2Q14.6 26.6 16.9 29.3L16.5 25.3Q15.1 24.3 14.2 24.1Z', K.gl, { w: 0.35, sil: false });
  f.forma('M21.4 24.2Q19.4 26.6 17.3 29.3L17.7 25.3Q19.1 24.3 19.9 24.1Z', K.gl, { w: 0.35, sil: false });
  f.mancha(puntos([[14.4, 30.8], [19.8, 30.8], [14.4, 33.4], [19.8, 33.4]], 0.45), K.az);
  f.forma('M8.9 35H24.5L24.6 36.4H8.8Z', K.gs, { w: 0.4, sil: false });
  f.forma(rr(15.9, 34.7, 2, 1.9, 0.3), K.gris, { w: 0.3, sil: false });
  f.forma('M15 36.2H16L15.7 38.6H14.8Z', K.gs, { w: 0.3, sil: false });
  credencial(f, 20.6, 26.6);
  // Brazo con el portapapeles
  f.tubo('M9.2 25.2Q8.6 28.6 9.3 31.2', K.g, 2.2);
  f.forma(rr(2.8, 27.8, 6.2, 8.4, 0.6), K.az2);
  f.forma(rr(3.7, 28.9, 4.4, 6.4, 0.3), K.papel, { w: 0.3, sil: false });
  f.linea('M4.6 30.6H7.2', 0.4, K.gris); f.linea('M4.6 32.1H7.2', 0.4, K.gris);
  f.linea('M4.6 33.9L5.4 34.6L6.9 33.1', 0.5, K.ci);
  f.forma(rr(4.8, 27.2, 2.2, 1.3, 0.3), K.az, { w: 0.35 });
  f.forma(elipse(9.1, 31.9, 1.2, 1.1), K.s, { w: 0.4 });
  // Brazo en alto: el dedo que pregunta
  f.tubo('M23.4 25.2Q26.3 23.8 26.3 18.4', K.g, 2.4);
  f.forma(rr(24.8, 16.8, 3, 1.5, 0.5), K.gl, { w: 0.4 });
  f.forma(rr(25.6, 9.2, 1.3, 4.8, 0.65), K.s, { w: 0.45 });
  f.forma(rr(24.9, 12.8, 2.9, 4.2, 1), K.s, { w: 0.45 });
  // Cuello de camisa y humita azul
  f.forma('M14.8 22.8L17 24.6L19.2 22.8Z', BLANCO, { w: 0.35 });
  f.forma('M14.3 23.3L16.6 24.3L14.3 25.4Z', K.az2, { w: 0.35 });
  f.forma('M19.7 23.3L17.4 24.3L19.7 25.4Z', K.az2, { w: 0.35 });
  f.forma(rr(16.3, 23.6, 1.4, 1.3, 0.3), K.az, { w: 0.3 });
  // Moño plateado enrollado, con el lápiz clavado en diagonal
  f.tubo('M4.6 2.2L13.8 -6.2', K.lap, 1.05, { cab: true, cap: 'butt' });
  f.forma('M13.6 -7L15.3 -7.6L14.4 -5.9Z', K.punta, { cab: true, w: 0.3 });
  f.forma(elipse(9.6, -1.4, 3.3, 2.9), K.h, { cab: true });
  f.mancha('M11.6 -3.6C12.9 -2.6 13.2 -0.6 12.2 0.8C11.6 1.3 10.6 1.5 9.6 1.5C11.2 0.6 12.2 -1.4 11.6 -3.6Z', K.d, { cab: true });
  f.linea('M9.6 -2.6C10.9 -2.6 11.2 -0.8 9.8 -0.5C8.5 -0.3 8 -1.8 9 -2.2', 0.45, K.d, { cab: true });
  f.linea('M7.4 -3.4Q8.6 -4.4 10.2 -4.1', 0.45, K.H, { cab: true });
  f.tubo('M4.6 2.2L7.9 -0.8', K.lap, 1.05, { cab: true, cap: 'butt', sil: false });
  f.forma(elipse(4.2, 2.6, 0.75, 0.65), '#E58C8C', { cab: true, w: 0.35 });
  // Cara con la lupa de joyero
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: null, rubor: K.ru });
  f.mancha(elipse(14, 14.6, 0.72, 0.95), T, { cab: true });
  f.mancha(elipse(13.75, 14.15, 0.26, 0.3), BLANCO, { cab: true });
  f.linea('M12.7 12.5Q13.9 11.9 15.1 12.4', 0.5, K.d, { cab: true });
  f.linea('M11 18.6Q12.3 19.2 13.5 18.2', 0.45, K.boca, { cab: true });
  f.forma(elipse(8.4, 13.7, 2.65, 2.65), K.ci, { cab: true, w: 0.5 });
  f.forma(elipse(8.4, 13.7, 1.85, 1.85), K.lente, { cab: true, w: 0.35, sil: false });
  f.mancha(elipse(8.6, 14, 1.15, 1.4), T, { cab: true });
  f.mancha(elipse(8.15, 13.35, 0.45, 0.5), BLANCO, { cab: true });
  f.linea('M6.9 12.6Q7.3 12 8 11.9', 0.35, BLANCO, { cab: true });
  f.linea('M6.2 10.5Q8 9.8 9.9 10.3', 0.55, K.d, { cab: true });
  f.mancha(elipse(1.6, 17.5, 0.5, 0.5), K.ci, { cab: true });
  // Pelo plateado
  f.forma('M1.9 12.9C1.1 9 1.4 4.2 4.2 2C6.4 0.3 13.6 0.3 16 2C18.4 3.8 18.7 8 18.2 11.8L17.2 11.9C17.2 10 16.6 8.8 15.6 8.4C13.4 8.7 11 8.9 9.4 8.4C8 8 6.6 8 5.8 8.8C4.9 9.7 4.4 11 4.2 12.9Z', K.h, { cab: true });
  f.mancha('M16.6 3.2C18 4.8 18.5 8 18.1 11.6L17.3 11.7C17.3 9.6 16.8 8.4 16.1 8C16.8 6.4 16.9 4.8 16.6 3.2Z', K.d, { cab: true });
  f.linea('M4.4 4.6Q6.6 2.6 9.4 2.4', 0.6, K.H, { cab: true });
  f.linea('M11.6 3.4Q13.6 3.6 15 4.8', 0.45, K.d, { cab: true });
  return f;
}

// ───────── Bucle (Kilo) · Desarrollo ─────────
export function bucle() {
  const K = {
    s: '#C68A5E', S: '#A56E45', r: '#27467A', rs: '#18305A', rl: '#4A7BB5', ci: '#17C3B2', cid: '#0A8A7E', bb: '#1B2433',
    p: '#17446F', ps: '#0F3558', pl: '#1F5A92', jo: '#1E2F45', jos: '#142236', ni: '#F2F4F7', vapor: '#B9C8D8', boca: '#6B2E2A'
  };
  const f = figura();
  // Joggers y zapatillas
  f.forma('M10.8 36.2H22.6L22.5 38.4H10.9Z', K.jo);
  piernas(f, 37.4, 45.6, K.jo, K.jos);
  f.forma(rr(10.9, 44.6, 5.3, 1.5, 0.4), K.jos, { w: 0.4 }); f.forma(rr(17.3, 44.6, 5.2, 1.5, 0.4), K.jos, { w: 0.4 });
  zapatillas(f, 46.1, K.ni, K.ci);
  // Polerón
  f.forma('M9 24C11 23 22.4 23 24.4 24Q25.3 24.5 25.2 25.8L24.3 36.4H9.6L8.6 25.8Q8.4 24.5 9 24Z', K.p);
  f.mancha('M22.6 24.1C23.9 24.3 25.1 24.9 25.2 25.9L24.3 36.3H22.8Z', K.ps);
  credencial(f, 18.8, 25.8);
  // Brazos: uno al bolsillo, otro con la taza
  f.tubo('M24.6 25.4Q24.9 29.8 22.6 32.4', K.p, 2.3);
  f.forma(rr(11.8, 30.6, 10.2, 3.9, 0.8), K.pl, { w: 0.45 });
  f.linea('M12.3 31.3H21.5', 0.4, K.ps);
  f.forma(rr(9.4, 34.9, 15.1, 1.8, 0.5), K.ps, { w: 0.45 });
  f.tubo('M9 25.3Q8.3 29 10.6 30.5Q11.6 31.1 12.4 30.8', K.p, 2.3);
  f.tubo('M14.8 26.9Q16.3 27.1 16.2 28.1Q16.1 29.1 14.8 29.2', K.ni, 0.5);
  f.forma(rr(10.9, 25.6, 3.9, 4.5, 0.5), K.ni);
  f.mancha('M11.15 26.7H14.55V27.7H11.15Z', K.ci);
  f.linea('M12 28.5L11.5 29L12 29.5M13.7 28.5L14.2 29L13.7 29.5', 0.28, T);
  f.forma(elipse(12.9, 30.5, 1.15, 1), K.s, { w: 0.4 });
  f.linea('M12.2 25.1Q11.7 24.5 12.3 24', 0.4, K.vapor);
  // Audífonos al cuello
  f.linea('M10.6 23.4Q16.6 21.2 22.9 23.4', 0.7, T);
  f.forma(rr(9.3, 22.5, 2.5, 3.3, 0.9), K.ci, { w: 0.45 }); f.forma(rr(22, 22.5, 2.5, 3.3, 0.9), K.ci, { w: 0.45 });
  f.mancha(rr(10.2, 23.3, 0.8, 1.7, 0.4), K.cid); f.mancha(rr(22.8, 23.3, 0.8, 1.7, 0.4), K.cid);
  // Moño de rastas (detrás del domo)
  f.forma(elipse(9.8, -2.4, 3.7, 2.7), K.r, { cab: true });
  f.linea('M7.6 -3.4Q8.4 -1.8 8.2 -0.4', 0.4, K.rs, { cab: true }); f.linea('M11.4 -3.8Q12 -2 11.8 -0.4', 0.4, K.rs, { cab: true });
  f.linea('M7.2 -3.8Q9 -5 11 -4.6', 0.45, K.rl, { cab: true });
  // Cara tranquila, sin oreja (la tapan las rastas)
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: null, oreja: false, cejas: K.bb, cejasY: 12 });
  for (const x of [9, 14]) {
    f.mancha(elipse(x, 14.6, 0.95, 0.62), T, { cab: true });
    f.linea(`M${x - 1.2} 14.1Q${x} 13.4 ${x + 1.2} 14.1`, 0.45, K.S, { cab: true });
  }
  f.linea('M10.4 18.5Q12 19.4 13.6 18.2', 0.5, K.boca, { cab: true });
  f.mancha('M10.1 20.2Q11.7 19.7 13.1 20.2Q12.7 21.9 11.5 22Q10.4 21.6 10.1 20.2Z', K.bb, { cab: true });
  // Domo hecho de rastas en abanico desde la coronilla, con la cinta del moño
  const puntas = [-2.8, -0.3, 2.3, 4.9, 7.5, 10.1, 12.7, 15.3, 17.9, 20.5];
  const orden = [0, 9, 1, 8, 2, 7, 3, 6, 4, 5];
  for (const k of orden) {
    const bx = puntas[k], lado = Math.abs(bx - 9.8), by = 8.4 + (lado > 10 ? 1 : 0);
    const tx = 9.8 + (bx - 9.8) * 0.22, cx = 9.8 + (bx - 9.8) * 1.12, cy = 0.2 + lado * 0.1;
    f.tubo(`M${tx.toFixed(2)} 0.2Q${cx.toFixed(2)} ${cy.toFixed(2)} ${bx} ${by}`, k % 3 === 1 ? K.rl : K.r, 2.3, { cab: true, borde: 0.4 });
    if (k % 3 !== 1) f.linea(`M${(tx + (bx - tx) * 0.35 - 0.5).toFixed(2)} ${(2.6 + lado * 0.05).toFixed(2)}L${(tx + (bx - tx) * 0.35 + 0.5).toFixed(2)} ${(3 + lado * 0.05).toFixed(2)}`, 0.3, K.rs, { cab: true });
  }
  f.forma(rr(6.6, -1.2, 6.6, 1.3, 0.55), K.ci, { cab: true, w: 0.4, sil: false });
  // Cuerdas que caen y se enroscan como tentáculos
  const cuerdas = ['M-2.3 8.6C-3.3 13 -3.1 18.6 -2.6 22.6Q-2.4 24.8 -4.2 25.2', 'M0.7 8.8C0.3 12.2 0.5 16.8 0.9 20.2Q1 21.5 0 22', 'M17.3 8.8C17.7 12.2 17.5 16.8 17.1 20.2Q17 21.5 18 22', 'M20.3 8.6C21.3 13 21.1 18.6 20.6 22.6Q20.4 24.8 22.2 25.2'];
  for (const d of cuerdas) f.tubo(d, K.r, 1.5, { cab: true });
  for (const [x, y] of [[-2.8, 12], [-2.9, 16.4], [0.5, 13], [17.5, 13], [20.8, 12], [20.9, 17.8]]) f.linea(`M${x - 0.7} ${y}L${x + 0.7} ${y + 0.4}`, 0.35, K.rs, { cab: true });
  f.forma(rr(-3.8, 17.4, 1.6, 1.3, 0.4), K.ci, { cab: true, w: 0.3, sil: false });
  f.forma(rr(20, 14.8, 1.6, 1.3, 0.4), K.ci, { cab: true, w: 0.3, sil: false });
  return f;
}

// ───────── Celda (Byte) · Datos y métricas ─────────
export function celda() {
  const K = {
    s: '#98613D', S: '#7A4A2B', a: '#22252F', al: '#3E4458', as: '#12141B', at: '#5A6178', ci: '#17C3B2', cid: '#0A8A7E', c3: '#7FD8CF', ne: '#F2F4F7',
    ch: '#17446F', cg: '#35679A', cs: '#0F3558', pa: '#091D33', pas: '#06121F', su: '#B9C8D8', sus: '#8FA3B8', tab: '#0E2A47', lente: '#DDF4F1', boca: '#5A2320'
  };
  const f = figura();
  // Pantalón ancho, tobillos y zapatillas de plataforma
  f.forma('M10.8 37.2H22.6L22.5 39.2H10.9Z', K.pa);
  f.forma('M10.9 38.4H16.1L16.3 45.2H10L10.6 41.6Z', K.pa); f.forma('M17.3 38.4H22.4L23.2 45.2H17.1Z', K.pa);
  f.mancha('M15.1 38.6H16L16.2 45H15.2Z', K.pas); f.mancha('M21.4 38.6H22.3L23 45H21.8Z', K.pas);
  f.forma(rr(11.8, 44.8, 3.2, 1.6, 0.4), K.s, { w: 0.4 }); f.forma(rr(18.2, 44.8, 3.2, 1.6, 0.4), K.s, { w: 0.4 });
  for (const x of [0, 7]) {
    f.forma(`M${11 + x} 46H${15.4 + x}Q${16.5 + x} 46.5 ${16.9 + x} 47.7H${10.4 + x}Q${10.3 + x} 46.4 ${11 + x} 46Z`, K.ne);
    f.forma(rr(10.1 + x, 47.4, 7, 2.9, 0.6), K.su);
    f.mancha(`M${10.4 + x} 49.1H${16.8 + x}V49.9Q${16.8 + x} 50 ${16.6 + x} 50H${10.6 + x}Q${10.4 + x} 50 ${10.4 + x} 49.8Z`, K.sus);
  }
  // Chaqueta cuadriculada con celdas encendidas, abierta sobre una polera blanca
  f.forma('M9.2 23.2C11 22.4 22.6 22.4 24.4 23.2Q25.2 23.6 25.1 24.8L24.8 37.8H9L8.6 24.8Q8.5 23.6 9.2 23.2Z', K.ch);
  for (const x of [12.4, 15.4, 18.4, 21.4]) f.linea(`M${x} 23.6V37.6`, 0.4, K.cg);
  for (const y of [26.4, 29.4, 32.4, 35.4]) f.linea(`M8.9 ${y}H24.9`, 0.4, K.cg);
  f.mancha(rr(12.75, 26.75, 2.3, 2.3, 0.3), K.ci); f.mancha(rr(18.75, 29.75, 2.3, 2.3, 0.3), K.c3);
  f.mancha(rr(21.75, 32.75, 2.5, 2.3, 0.3), K.ci); f.mancha(rr(9.4, 32.75, 2.6, 2.3, 0.3), K.c3);
  f.forma('M15 22.7H19L19.2 30.6Q17.1 31.5 14.8 30.6Z', K.ne, { w: 0.4, sil: false });
  f.mancha('M23.2 23.4Q24.9 23.7 25.1 24.8L24.8 37.7H23.4Z', K.cs, { op: 0.8 });
  credencial(f, 20.6, 24.2);
  // Brazo con la tableta
  f.tubo('M24.8 24.8Q25.7 29 25.4 32.4', K.ch, 2.3);
  f.linea('M24.3 29.2H26.5', 0.5, K.cg);
  f.forma(rr(19.8, 30.8, 6.2, 6.4, 0.6), K.tab);
  f.mancha(rr(21, 34.2, 0.8, 1.8, 0.2), K.cg); f.mancha(rr(22.3, 33.1, 0.8, 2.9, 0.2), K.ci); f.mancha(rr(23.6, 32.1, 0.8, 3.9, 0.2), K.c3);
  f.forma(elipse(25.8, 33.5, 1.1, 1), K.s, { w: 0.4 });
  // Brazo en alto con el plumero
  f.tubo('M6.4 14.8L6.2 3.4', K.su, 0.8);
  f.forma('M6.2 -3.8C8.7 -2.1 9.5 0.6 8.5 2.5C7.7 3.7 6.9 4.1 6.2 4.3C5.5 4.1 4.6 3.7 3.8 2.5C2.8 0.6 3.7 -2.1 6.2 -3.8Z', K.c3);
  f.linea('M6.2 -2.6V3.6', 0.4, K.ci); f.linea('M4.5 -0.2Q5.4 1.4 6.2 2.3', 0.35, K.ci); f.linea('M7.9 -0.2Q7 1.4 6.2 2.3', 0.35, K.ci);
  f.mancha(elipse(5.2, -0.9, 0.55, 1.1), K.ne);
  f.tubo('M9 24.6Q6.6 23.6 6.4 18.2', K.ch, 2.3);
  f.forma(rr(5, 17.4, 2.9, 1.3, 0.4), K.cg, { w: 0.4 });
  f.forma(rr(5, 14.5, 2.9, 3.1, 0.9), K.s, { w: 0.45 });
  // Peineta cian, antes del cubo
  f.forma(rr(15.8, -12.6, 1.9, 5.2, 0.3), K.ci, { cab: true, w: 0.4 });
  f.linea('M16.4 -12V-8.6M17.1 -12V-8.6', 0.25, K.cid, { cab: true });
  // Cara con lentes cuadrados y aros cian
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: 'sonrisa', labio: K.boca });
  f.forma(rr(4.7, 11.9, 5.1, 3.8, 0.5), K.lente, { cab: true, w: 0.6, sil: false });
  f.forma(rr(11.9, 11.9, 4.1, 3.8, 0.5), K.lente, { cab: true, w: 0.6, sil: false });
  f.mancha(elipse(7.8, 14, 0.75, 0.95), T, { cab: true }); f.mancha(elipse(14, 14, 0.7, 0.95), T, { cab: true });
  f.linea('M5.5 12.8L6.4 12.5', 0.35, BLANCO, { cab: true }); f.linea('M12.6 12.8L13.3 12.5', 0.35, BLANCO, { cab: true });
  f.linea('M9.8 12.9H11.9', 0.55, T, { cab: true }); f.linea('M4.7 12.6L2.8 12.3', 0.55, T, { cab: true });
  f.forma(rr(0.9, 16.6, 1.3, 1.5, 0.35), K.ci, { cab: true, w: 0.3, sil: false });
  // Afro cortado en cubo: cara de adelante, tapa y costado
  f.forma('M0.8 -5H18V8.6H0.8Z', K.a, { cab: true });
  f.forma('M0.8 -5L3.8 -8.2H21L18 -5Z', K.al, { cab: true });
  f.forma('M18 -5L21 -8.2V5.4L18 8.6Z', K.as, { cab: true });
  for (const [x, y] of [[3.4, -3], [7.4, -1.2], [11.6, -3.6], [15, -0.4], [4.8, 2.6], [9.8, 3.8], [13.8, 1.8], [2.8, 6], [8.4, 6.4], [12.8, 5.2], [16.2, 4.6], [6, -3.8]]) f.linea(`M${x - 0.55} ${y}q0.55 -0.65 1.1 0`, 0.4, K.at, { cab: true });
  f.forma(rr(0.8, 8.2, 2.1, 3.2, 0.5), K.a, { cab: true, w: 0.4 });
  f.forma(rr(16.3, 8.2, 1.7, 2.2, 0.5), K.a, { cab: true, w: 0.4 });
  return f;
}

// ───────── Grilla (Pixel) · Diseño ─────────
export function grilla() {
  const K = {
    s: '#E0AC82', S: '#C48C63', pe: '#B87A55', h: '#17C3B2', hs: '#0A8A7E', hl: '#7FD8CF', la: '#35679A', ne: '#F2F4F7', ra: '#B9C8D8',
    j: '#0A8A7E', js: '#077068', jl: '#12A596', hu: '#F4ECD8', bo: '#091D33', lente: '#DDF4F1'
  };
  const f = figura();
  // Piernas largas y botas de plataforma
  f.forma('M11.6 36.4H22L21.9 38.6H11.7Z', K.j);
  piernas(f, 37.6, 49.4, K.j, K.js, [11.8, 16], [17.8, 22]);
  f.mancha(rr(12.1, 46.6, 3.4, 1.3, 0.3), K.jl); f.mancha(rr(18.1, 46.6, 3.4, 1.3, 0.3), K.jl);
  for (const x of [0, 7.2]) {
    f.forma(`M${11.2 + x} 48.8H${15.8 + x}Q${16.4 + x} 50 ${17 + x} 50.6Q${17.4 + x} 51.2 ${17.3 + x} 52V53H${10.6 + x}V49.6Q${10.6 + x} 48.8 ${11.2 + x} 48.8Z`, K.bo);
    f.forma(rr(10.6 + x, 52, 6.7, 1.1, 0.3), K.ne, { w: 0.35 });
    f.linea(`M${12 + x} 50.3H${13.9 + x}`, 0.5, K.h);
  }
  // Polera a rayas y jardinera
  f.forma('M10.6 24C12.2 23.3 21.2 23.3 22.8 24L23 36.8H10.8Z', K.ne);
  for (let y = 25.4; y < 36.6; y += 2) f.mancha(`M10.8 ${y}H22.95V${y + 0.9}H10.8Z`, K.ra);
  f.forma('M13 29H20.4V36.9H12.8Z', K.j);
  f.mancha('M19.3 29.2H20.3V36.8H19.3Z', K.js);
  f.forma(rr(15, 30.6, 3.6, 2.2, 0.4), K.jl, { w: 0.35, sil: false });
  f.forma('M11.6 23.8H13L13.4 29.2H12Z', K.j, { w: 0.4, sil: false }); f.forma('M20.6 23.8H22L21.6 29.2H20.2Z', K.j, { w: 0.4, sil: false });
  f.mancha(puntos([[12.7, 28.7], [21, 28.7]], 0.5), K.ne);
  credencial(f, 15.4, 33.2);
  // Brazo con el celular
  f.tubo('M11 24.6Q9 26.8 9.8 30.4', K.ra, 2.2);
  f.linea('M8.8 26.8H10.8M8.9 28.8H10.9', 0.5, K.ne);
  f.forma(rr(8.8, 30.2, 2.9, 1.3, 0.4), K.ne, { w: 0.4 });
  f.forma(rr(10.9, 25.6, 3, 5.4, 0.5), K.bo);
  f.mancha(rr(11.5, 26.4, 1.8, 3.8, 0.2), K.hl);
  f.forma(elipse(11.9, 31.6, 1.1, 1.1), K.s, { w: 0.4 });
  // Brazo con el pulgar arriba
  f.tubo('M22.8 25Q25.4 25.6 25.2 21.2', K.ra, 2.2);
  f.linea('M24.2 23.4H26.2', 0.5, K.ne);
  f.forma(rr(23.8, 20.2, 2.9, 1.3, 0.4), K.ne, { w: 0.4 });
  f.forma(rr(24.7, 14.8, 1.3, 3.2, 0.6), K.s, { w: 0.4 });
  f.forma(rr(23.8, 17.3, 3, 3.1, 0.9), K.s, { w: 0.45 });
  // Huincha de medir de bufanda
  f.forma('M12 22.6Q16.4 24.4 21 22.6L21.2 23.8Q16.4 25.6 11.8 23.8Z', K.hu, { w: 0.4 });
  f.forma('M19.2 23.8H21L21 33.2H19.2Z', K.hu, { w: 0.4 });
  f.linea('M13.4 23.4V24.2M15.4 23.9V24.7M17.4 23.9V24.7M19.6 25.2H20.3M19.6 27.2H20.3M19.6 29.2H20.3M19.6 31.2H20.3', 0.3, T);
  f.forma(rr(19, 33, 2.2, 1, 0.3), K.la, { w: 0.35 });
  // Antenas de lápiz (antes del pelo)
  f.tubo('M13.6 2Q11.2 -1.4 9.6 -5.2', K.la, 0.9);
  f.forma(elipse(9.3, -6, 1, 1), K.h, { w: 0.4 });
  f.tubo('M20 2Q22.6 -1.2 24.2 -5.2', K.la, 0.9);
  f.forma(elipse(24.5, -6, 1, 1), K.ne, { w: 0.4 });
  // Cara con lentes redondos y pecas
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: 'dientes' });
  f.mancha(puntos([[4.8, 16.5], [6.4, 16.5], [5.6, 17.3], [15.3, 16.5], [14.6, 17.3]], 0.3), K.pe, { cab: true });
  f.forma(elipse(8.4, 13.9, 1.95, 1.95), K.lente, { cab: true, w: 0.55, sil: false });
  f.forma(elipse(13.9, 13.9, 1.75, 1.95), K.lente, { cab: true, w: 0.55, sil: false });
  f.mancha(elipse(8.6, 14.1, 0.8, 1), T, { cab: true }); f.mancha(elipse(14, 14.1, 0.75, 1), T, { cab: true });
  f.mancha(elipse(8.3, 13.6, 0.3, 0.33), BLANCO, { cab: true }); f.mancha(elipse(13.75, 13.6, 0.28, 0.33), BLANCO, { cab: true });
  f.linea('M10.3 13.6Q11.2 13.1 12.2 13.6', 0.5, T, { cab: true });
  f.linea('M7.2 11.2Q8.3 10.8 9.4 11.1M12.8 11.1Q13.8 10.8 14.8 11.2', 0.45, K.hs, { cab: true });
  // Pelo teñido cian
  f.forma('M1 11.6C0.4 6.8 2.2 1.4 7.4 0.4C11.4 -0.4 15.8 0.6 17.6 4C18.6 6 18.6 9 18.3 11.4L17.2 11.4C17.1 9.8 16.6 9 16 8.8C14.4 9.6 12.4 10 10.6 9.9C8.4 9.7 6.4 9.1 5.4 8.4C4.4 9.2 3.8 10.4 3.4 11.8C2.6 11.9 1.7 11.9 1 11.6Z', K.h, { cab: true });
  f.mancha('M16.2 2.6C17.6 3.8 18.6 6.6 18.3 11.3L17.3 11.3C17.2 9.4 16.7 8.8 16.2 8.6C16.8 6.8 16.8 4.6 16.2 2.6Z', K.hs, { cab: true });
  f.linea('M3.6 4.4Q5.6 2 8.8 1.6', 0.6, K.hl, { cab: true });
  return f;
}

// ───────── Tamandúa · Validación ─────────
export function tamandua() {
  const K = {
    s: '#E0AC82', S: '#C48C63', ba: '#A07A60', h: '#2B2622', hs: '#1A1613', ca: '#B9C8D8', lb: '#091D33', lh: '#F2F4F7', ci: '#17C3B2',
    cr: '#F4ECD8', crs: '#CFC2A3', v: '#1F2733', vs: '#141A23', vl: '#343F4F', cg: '#35679A', cgs: '#17446F', ze: '#B9C8D8', zes: '#6B7A8C',
    vid: '#DDF4F1', tapa: '#35679A', bo: '#091D33', boca: '#7A2E2A'
  };
  const f = figura();
  // Cargo y zapatillas
  f.forma('M10.8 36.4H22.6L22.5 38.6H10.9Z', K.cg);
  piernas(f, 37.4, 47.6, K.cg, K.cgs);
  f.forma(rr(9.8, 40, 2.2, 3.8, 0.4), K.cgs, { w: 0.4 }); f.forma(rr(21.4, 40, 2.2, 3.8, 0.4), K.cgs, { w: 0.4 });
  zapatillas(f, 47.2, K.ze, K.zes);
  // Polera crema con el chaleco negro de oso hormiguero
  f.forma('M9.6 23.8C11.6 22.9 22.2 22.9 24.2 23.8Q25 24.3 24.9 25.6L24 36.8H9.9L9 25.6Q8.9 24.3 9.6 23.8Z', K.cr);
  f.mancha('M18.8 23.2H19.6V36.7H18.8Z', K.crs);
  f.forma('M9.6 23.8C10.8 23.3 12.6 23.1 14 23.1L14.2 36.8H9.9L9 25.6Q8.9 24.3 9.6 23.8Z', K.v);
  f.forma('M24.2 23.8C23 23.3 21.2 23.1 19.8 23.1L19.6 36.8H24L24.9 25.6Q25 24.3 24.2 23.8Z', K.v);
  f.mancha('M22.6 23.6Q24.8 23.9 24.9 25.6L24 36.7H22.6Z', K.vs);
  f.linea('M13.6 23.6V36.4M20.2 23.6V36.4', 0.45, K.vl);
  f.linea('M10.8 30.6H13', 0.5, K.vl);
  f.linea('M11.5 28.2V30.3', 0.55, K.ci); f.mancha(elipse(12.3, 29.6, 0.35, 0.35), K.lh);
  f.forma(rr(9.7, 35.8, 14.5, 1.1, 0.4), K.vs, { w: 0.4 });
  credencial(f, 15.8, 25.8);
  // Brazo con el frasco de bichos
  f.tubo('M24.4 25Q25.6 28.6 24.2 31.6', K.cr, 2.3);
  f.forma(rr(19.2, 33.8, 5.6, 6.2, 1), K.vid);
  f.mancha(puntos([[20.8, 35.6], [22.8, 36.3], [21.6, 38.2], [23.6, 37.6]], 0.42), T);
  f.linea('M20.3 35.6H21.3M22.3 36.3H23.3M21.1 38.2H22.1M23.1 37.6H24.1', 0.25, T);
  f.linea('M19.9 34.8V37.4', 0.45, BLANCO);
  f.forma(rr(19.6, 32.6, 4.8, 1.4, 0.4), K.tapa, { w: 0.45 });
  f.forma(elipse(23.9, 32.6, 1.1, 1), K.s, { w: 0.4 });
  // Brazo en alto con el celular
  f.tubo('M9.4 24.8Q7 23.6 7 19.2', K.cr, 2.3);
  f.forma(rr(5.4, 16.6, 3, 2.5, 0.9), K.s, { w: 0.45 });
  f.forma(rr(4.4, 10.8, 3.6, 6.2, 0.5), K.bo);
  f.mancha(rr(5, 11.6, 2.4, 4, 0.2), K.lh); f.mancha(elipse(5.8, 13.2, 0.45, 0.45), K.ci);
  // Cara: nariz larga, mirada desconfiada y barba de días
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: 'linea', labio: K.boca, nariz: false });
  f.forma('M13.4 14.1Q17.4 14.2 19.6 16.4Q19.9 17.8 18.1 17.8Q15.6 17.6 13.8 16.9Z', K.s, { cab: true, w: 0.5 });
  f.mancha('M14.4 16.7Q16.6 17.3 18.6 17.5Q19.3 17.4 19.4 16.9Q16.9 17.1 14.4 16.7Z', K.S, { cab: true });
  f.mancha(elipse(9, 14.3, 0.7, 0.9), T, { cab: true }); f.mancha(elipse(13.3, 14.3, 0.6, 0.9), T, { cab: true });
  f.linea('M7.6 11.7Q8.8 11.7 10 12.5', 0.6, K.h, { cab: true }); f.linea('M12.4 12.5Q13.5 11.7 14.8 11.7', 0.6, K.h, { cab: true });
  f.mancha(puntos([[4.2, 18], [5.4, 19.4], [7, 20.6], [8.8, 21.3], [10.8, 21.5], [12.8, 21], [14.6, 19.9], [15.8, 18.5], [9.8, 20.4], [11.8, 20.4]], 0.28), K.ba, { cab: true });
  // Pelo desordenado con la mecha gris y la linterna en la frente
  f.forma('M1.4 11.4C0.6 7.4 1.2 3 4.4 1.2Q4.6 0 5.6 -0.6Q5.8 0.4 6.4 0.6Q7.4 -0.4 8.8 -0.8Q8.8 0 9.4 0.4Q10.6 -0.4 12 -0.4Q11.8 0.4 12.2 0.8Q14.8 0.8 16.6 2.6C18.4 4.6 18.6 8 18.2 10.8L17.4 10.9L17 9.8H4.2L3.4 11Z', K.h, { cab: true });
  f.mancha('M16.4 3.2C17.8 4.8 18.4 7.6 18.1 10.6L17.4 10.7L17.1 9.6C17.3 7.6 17.1 5.2 16.4 3.2Z', K.hs, { cab: true });
  f.mancha('M3.2 3.4Q5.6 2.4 7.8 3.6Q6 4.6 4.4 7Q3.6 5.2 3.2 3.4Z', K.ca, { cab: true });
  f.forma('M1.2 8.9Q10 7.9 18.6 8.7L18.6 10.1Q10 9.3 1.2 10.3Z', K.lb, { cab: true, w: 0.4 });
  f.forma(rr(6.6, 5.6, 4.4, 4.4, 0.8), K.lh, { cab: true, w: 0.45 });
  f.forma(elipse(8.8, 7.8, 1.35, 1.35), K.ci, { cab: true, w: 0.35, sil: false });
  f.mancha(elipse(8.4, 7.4, 0.45, 0.45), BLANCO, { cab: true });
  return f;
}

// ───────── Faro · Puesta en marcha ─────────
export function faro() {
  const K = {
    s: '#F3CFB0', S: '#DDAE8C', ru: '#E9967A', nz: '#E0806E', ba: '#EEF2F6', bas: '#BCC7D3', go: '#17446F', gos: '#0E2A47', gor: '#35679A', ci: '#17C3B2',
    ne: '#F2F4F7', az: '#17446F', ab: '#0E2A47', abs: '#091D33', abl: '#1F4F80', bot: '#B9C8D8', pa: '#1F2733', pas: '#141A23', bo: '#3A2E28', bos: '#241C18',
    fm: '#0E2A47', fv: '#7FD8CF', fl: '#17C3B2', ma: '#35679A', mp: '#F4ECD8'
  };
  const f = figura();
  // Pantalón y botas
  f.forma('M10.8 38.4H22.6L22.5 40.6H10.9Z', K.pa);
  piernas(f, 39.6, 46.4, K.pa, K.pas);
  zapatillas(f, 46.2, K.bo, K.bos, K.bot);
  // Abrigo marinero con el suéter a rayas de faro
  f.forma('M9.2 23.8C11.2 22.9 22.4 22.9 24.4 23.8Q25.2 24.3 25.1 25.6L24.6 39H9.2L8.7 25.6Q8.6 24.3 9.2 23.8Z', K.ab);
  f.mancha('M22.8 23.8Q25 24.1 25.1 25.6L24.6 38.9H23Z', K.abs);
  f.forma('M14 23.4H19L19.2 39H13.8Z', K.ne, { w: 0.4, sil: false });
  for (const y of [27, 31, 35]) f.mancha(`M13.95 ${y}H19.1V${y + 2}H13.95Z`, K.az);
  f.forma('M11.9 24.2Q13.4 26.6 14 29.8V23.6Z', K.abl, { w: 0.4, sil: false });
  f.forma('M21.3 24.2Q19.8 26.6 19.2 29.8V23.6Z', K.abl, { w: 0.4, sil: false });
  f.mancha(puntos([[11.2, 31.4], [11.2, 34.4], [21.8, 31.4], [21.8, 34.4]], 0.5), K.bot);
  credencial(f, 20.4, 25.6);
  // Brazo con el manual bajo el brazo
  f.forma(rr(19.8, 28.6, 6.4, 5.2, 0.5), K.ma);
  f.mancha(rr(20.6, 29.4, 4.6, 3.4, 0.3), K.mp);
  f.linea('M21.4 30.4H24.2M21.4 31.7H24.2', 0.35, K.bot);
  f.tubo('M24.6 25.2Q25.7 30 24.8 34.4', K.ab, 2.3);
  f.forma(elipse(24.8, 35.2, 1.1, 1), K.s, { w: 0.4 });
  // Brazo con el farol encendido
  f.tubo('M9 25.2Q7.2 29.4 7.2 33.6', K.ab, 2.3);
  f.forma(elipse(7, 34.9, 1.1, 1.1), K.s, { w: 0.4 });
  f.forma(rr(4.8, 37.8, 4.4, 5.2, 0.4), K.fv);
  f.forma('M7 38.9Q8.2 40.2 7.8 41.4Q7 42.2 6.2 41.4Q5.8 40.2 7 38.9Z', K.fl, { w: 0.3, sil: false });
  f.mancha(elipse(6.7, 40.3, 0.3, 0.45), BLANCO);
  f.linea('M4.9 37.9V43M9.1 37.9V43', 0.6, K.fm);
  f.forma('M4.9 37.6Q7 35.8 9.1 37.6V38.1H4.9Z', K.fm, { w: 0.4 });
  f.linea('M6 36.6Q7 35.4 8 36.6', 0.45, K.fm);
  f.forma(rr(4.2, 42.8, 5.6, 1.2, 0.3), K.fm, { w: 0.4 });
  // Cara: ojos felices, cejas blancas, nariz roja y gran barba
  cara(f, { piel: K.s, sombra: K.S, ojos: 'felices', ojosX: [8.6, 13.8], boca: null, nariz: false, rubor: K.ru });
  f.forma('M5.8 11.7Q8.4 9.4 11 11.3Q8.4 11.2 5.8 11.7Z', K.ba, { cab: true, w: 0.35, sil: false });
  f.forma('M12.2 11.3Q14.3 9.6 16.3 11.5Q14.3 11.2 12.2 11.3Z', K.ba, { cab: true, w: 0.35, sil: false });
  f.forma('M3.1 15.6C3.5 15.9 4.5 16.2 5.6 16.2C7.4 17.2 9.6 17.4 11.4 16.8C13 17.4 15 16.8 16.9 15.6C17.2 18.4 16.6 21 15 22.6C13.6 24.6 12 26.6 10.4 28.4C9.2 26.6 7.2 24.6 5.4 22.8C3.8 21.2 2.9 18.6 3.1 15.6Z', K.ba, { cab: true, w: 0.5 });
  for (const [x, y] of [[6.4, 19.6], [9, 21.6], [12.4, 19.4], [8.4, 24.6], [11.4, 23.6], [14.4, 21.4], [5.4, 18]]) f.linea(`M${x - 0.6} ${y}q0.6 0.7 1.2 0`, 0.35, K.bas, { cab: true });
  f.forma('M8.6 17.3Q10.6 16 12.4 17Q13.9 16.2 15.5 17.3Q14 18.5 12.2 18.1Q10.4 18.7 8.6 17.3Z', K.ba, { cab: true, w: 0.35, sil: false });
  f.linea('M11.2 19.2Q12 19.6 12.8 19.2', 0.4, '#7A2E2A', { cab: true });
  f.forma(elipse(13.5, 15.5, 1.25, 1), K.nz, { cab: true, w: 0.35, sil: false });
  f.forma(elipse(1.8, 11, 1.4, 1.1), K.ba, { cab: true, w: 0.4 }); f.forma(elipse(17.6, 10.7, 1.1, 1), K.ba, { cab: true, w: 0.4 });
  // Gorro marinero con la luz de faro arriba
  f.forma(elipse(9.8, -1.3, 1.4, 1.1), K.ci, { cab: true, w: 0.4 });
  f.forma('M1.8 8.8C1.2 3.4 4.8 -0.6 9.8 -0.8C14.8 -0.6 18.4 3.2 18 8.8Z', K.go, { cab: true });
  f.mancha('M15.4 1.4C17.2 2.8 18.3 5.4 18 8.7H16.4C16.8 6 16.4 3.4 15.4 1.4Z', K.gos, { cab: true });
  f.forma(rr(0.8, 7.2, 18.4, 3.2, 1), K.gor, { cab: true });
  for (let x = 2.2; x < 18.4; x += 1.45) f.linea(`M${x.toFixed(2)} 7.8V9.8`, 0.4, K.go, { cab: true });
  f.luz(elipse(16.8, 0, 3.6, 3.6), 'rgba(23,195,178,.22)');
  f.luz(elipse(7, 40.4, 5, 5), 'rgba(23,195,178,.2)');
  return f;
}

// ───────── Pepa · Cosecha ─────────
export function pepa() {
  const K = {
    s: '#C68A5E', S: '#A56E45', ru: '#D9786A', h: '#6E625B', hs: '#4E4540', hl: '#8E827A', ci: '#17C3B2', c3: '#7FD8CF', tal: '#0A8A7E',
    gr: '#8E99A8', grs: '#6F7A89', de: '#E8DFC8', des: '#CFC2A3', bo: '#17446F', bos: '#091D33', bol: '#35679A', ca: '#8B6A4E', cas: '#5E4633', ne: '#F2F4F7', boca: '#6B2E2A'
  };
  const f = figura();
  // Trenza que hace de cola, por detrás
  const eslabones = [[25.3, 16.6], [25.9, 18.7], [26.5, 20.8], [27, 22.9], [27.4, 25], [27.6, 27.1], [27.7, 29.2]];
  eslabones.forEach(([x, y], i) => f.forma(elipse(x, y, 1.25, 1.3), i % 2 ? K.hs : K.h, { w: 0.4 }));
  f.forma(rr(26.8, 30.3, 1.9, 1, 0.3), K.ci, { w: 0.35 });
  f.forma('M27 31.2Q27.8 33.8 28.6 31.2Z', K.hl, { w: 0.35 });
  // Rodillas y botas de agua
  f.forma(rr(11.8, 38, 3.4, 2.2, 0.5), K.s, { w: 0.4 }); f.forma(rr(18, 38, 3.4, 2.2, 0.5), K.s, { w: 0.4 });
  for (const x of [0, 6.4]) {
    f.forma(`M${10.8 + x} 39.6H${15.8 + x}V${43.6}Q${16.9 + x} 43.9 ${17.1 + x} 44.8V46.2H${10.3 + x}V44.4Q${10.5 + x} 43.9 ${10.8 + x} 43.6Z`, K.bo);
    f.mancha(rr(11 + x, 40.7, 4.6, 1.1, 0.2), K.bol);
    f.forma(rr(10.2 + x, 45.3, 7.1, 1, 0.3), K.bos, { w: 0.35 });
  }
  // Polerón gris y delantal
  f.forma('M9.2 23.8C11 22.9 21.6 22.9 23.4 23.8Q24.2 24.3 24.1 25.6L23.6 35.2H9.6L8.8 25.6Q8.7 24.3 9.2 23.8Z', K.gr);
  f.mancha('M21.8 23.8Q24 24.1 24.1 25.6L23.6 35.1H22Z', K.grs);
  f.forma('M12 25.6H21.6L21.8 38.9H11.8Z', K.de);
  f.mancha('M20.6 25.8H21.6L21.7 38.8H20.8Z', K.des);
  f.forma('M11.8 23H12.8V25.8H11.8Z', K.des, { w: 0.35, sil: false }); f.forma('M20.8 23H21.8V25.8H20.8Z', K.des, { w: 0.35, sil: false });
  f.forma(rr(14, 31, 5.6, 2.8, 0.4), K.des, { w: 0.35, sil: false });
  f.linea('M16.8 30.8V28.3', 0.5, K.tal);
  f.forma('M16.8 28.7Q15 28.3 14.4 26.9Q16.2 26.7 16.8 28.7Z', K.ci, { w: 0.3, sil: false });
  f.forma('M16.8 28.3Q18.4 27.5 18.8 26.3Q17.2 26.1 16.8 28.3Z', K.c3, { w: 0.3, sil: false });
  credencial(f, 18.2, 34.2);
  // Brazo con el canasto de pepas
  f.tubo('M23.6 25.2Q25.4 28.6 25 32.2', K.gr, 2.2);
  f.forma('M19.6 33.2H27.8L27 38.8Q23.7 39.6 20.4 38.8Z', K.ca);
  f.linea('M20.3 35.2H27.4M20.6 37.1H27.1', 0.4, K.cas);
  f.linea('M22.2 33.8V38.9M24.2 33.8V39.2M26.1 33.8V38.9', 0.3, K.cas);
  f.mancha(puntos([[21.3, 32.6], [23.1, 32.2], [24.9, 32.6]], 0.72), K.ci);
  f.mancha(puntos([[22.2, 32.9], [26.4, 32.5]], 0.62), K.c3);
  f.forma(rr(19.4, 32.9, 8.6, 1.1, 0.4), K.cas, { w: 0.35 });
  f.forma(elipse(24.4, 33.2, 1, 0.9), K.s, { w: 0.4 });
  // Brazo en alto con una pepa brillante
  f.tubo('M9 24.8Q6.8 23.6 7 19.6', K.gr, 2.2);
  f.forma(rr(5.6, 18.6, 2.9, 1.2, 0.4), K.grs, { w: 0.4 });
  f.forma(rr(5.7, 15.5, 2.8, 3.2, 0.9), K.s, { w: 0.45 });
  f.forma(elipse(7.1, 12.9, 1.55, 1.65), K.ci, { w: 0.45 });
  f.mancha(elipse(6.6, 12.3, 0.45, 0.5), K.ne);
  f.linea('M4.2 10.2V11.4M3.6 10.8H4.8M10 10V11M9.5 10.5H10.5M7.2 8.8V9.8M6.7 9.3H7.7', 0.35, K.c3);
  // Moños de degú (detrás del pelo)
  f.forma(elipse(3.2, -1.2, 2.3, 2.3), K.h, { cab: true });
  f.forma(elipse(15.6, -1.2, 2.3, 2.3), K.h, { cab: true });
  f.linea('M2.2 -2.2Q3 -2.9 3.9 -2.5M14.6 -2.2Q15.4 -2.9 16.3 -2.5', 0.45, K.hl, { cab: true });
  // Cara: ojos grandes, dientes de roedor y rubor
  cara(f, { piel: K.s, sombra: K.S, ojos: 'grandes', boca: 'paleta', labio: K.boca, rubor: K.ru });
  // Pelo con chasquilla recta
  f.forma('M1 13C0.4 7.8 2 1.6 9.4 1.2C16.8 1.6 18.8 7.8 18.2 13L17 13L16.8 10.6Q15.2 11 13.8 10.5Q12.2 11 10.6 10.5Q9 11 7.4 10.5Q5.8 11 4.4 10.5Q3.4 10.8 3 11L2.9 13Z', K.h, { cab: true });
  f.mancha('M16.4 3.6C17.8 5.2 18.6 8.4 18.2 12.9L17.1 12.9L16.9 10.5C17.4 8.4 17.2 5.6 16.4 3.6Z', K.hs, { cab: true });
  f.linea('M4 4.8Q6 2.8 9 2.6', 0.55, K.hl, { cab: true });
  f.linea('M11.6 6.4Q12.8 6.1 14 6.6', 0.4, K.hl, { cab: true });
  return f;
}

// ───────── The Engine · Ejecución y sistemas ─────────
export function engine(opc = {}) {
  const K = {
    s: '#D49A6A', S: '#B67C4D', ba: '#9A7052', h: '#3A2A20', hs: '#22170F', hl: '#5A4434', or: '#F5883A', ors: '#C9661F', hb: '#2A3040',
    t: '#343A41', ts: '#23282E', tl: '#454D56', ca: '#4B5140', cas: '#363B2E', cal: '#5E6650', bo: '#2B2622', bos: '#171412',
    tab: '#1B222B', pan: '#0C3A48', ci: '#17C3B2', eg: '#B9C8D8', egs: '#6B7A8C', egc: '#35679A', cin: '#3A2E26', heb: '#B9C8D8', boca: '#6B2E2A'
  };
  const f = figura();
  // Engranaje a los pies
  if (opc.engranaje !== false) {
    f.forma(engranaje(29.6, 46.6, 2.7, 3.5, 8), K.eg, { w: 0.45 });
    f.mancha('M31.4 44.4A2.9 2.9 0 0 1 30.9 49.2L30.3 48.3A1.8 1.8 0 0 0 30.8 45.4Z', K.egs);
    f.forma(elipse(29.6, 46.6, 1.1, 1.1), K.egc, { w: 0.35, sil: false });
  }
  // Cargo con bolsillos y botas con cordones naranjos
  f.forma('M10 36.6H23L22.9 38.6H10.1Z', K.ca);
  piernas(f, 37.6, 46.4, K.ca, K.cas, [10.2, 15.6], [17, 22.6]);
  f.forma(rr(8.8, 39.2, 2.4, 3.8, 0.4), K.cal, { w: 0.4 }); f.forma(rr(22, 39.2, 2.4, 3.8, 0.4), K.cal, { w: 0.4 });
  f.linea('M8.9 40H11.1M22.1 40H24.3', 0.4, K.cas);
  zapatillas(f, 46.1, K.bo, K.bos, K.or);
  // Polera carbón de manga corta con el motor naranjo
  f.forma('M9.4 23.8C11.4 22.9 22.2 22.9 24.2 23.8L27.6 25Q28.2 25.4 28 26.4L27.8 28.8H24.6L24.2 35.9H9.8L9.4 28.8H6.2L6 26.4Q5.8 25.4 6.4 25Z', K.t);
  f.mancha('M22.4 23.6Q24 23.7 24.2 23.8L27.6 25Q28.2 25.4 28 26.4L27.8 28.7H24.6L24.2 35.8H22.6Z', K.ts);
  f.linea('M13.6 23.5Q17 25.2 20.4 23.5', 0.6, K.tl);
  f.forma(rr(14.1, 26.8, 5.8, 2.6, 0.5), K.or, { w: 0.35, sil: false });
  f.forma(rr(15.5, 25.8, 3, 1.1, 0.3), K.or, { w: 0.3, sil: false });
  f.forma(rr(13.1, 27.4, 1.1, 1.4, 0.2), K.or, { w: 0.3, sil: false }); f.forma(rr(19.8, 27.4, 1.1, 1.4, 0.2), K.or, { w: 0.3, sil: false });
  f.mancha(elipse(17, 28.1, 0.6, 0.6), K.ors);
  // Brazos a la vista sosteniendo la tableta
  f.tubo('M7.6 28.4Q8 31.4 10.4 32.4', K.s, 2);
  f.tubo('M26.4 28.4Q26 31.4 23.6 32.4', K.s, 2);
  f.forma(rr(10.6, 29.6, 12.8, 6.3, 0.6), K.tab);
  f.mancha(rr(11.6, 30.6, 10.8, 4.3, 0.3), K.pan);
  f.linea('M12.6 33.6L14.6 33.6L16 32.4L17.6 33.3L19.2 31.6L21 32.2', 0.5, K.ci);
  f.forma(elipse(10.7, 32.5, 1.3, 1.2), K.s, { w: 0.4 }); f.forma(elipse(23.3, 32.5, 1.3, 1.2), K.s, { w: 0.4 });
  f.forma(rr(9.8, 35.6, 14.4, 1.3, 0.3), K.cin, { w: 0.4 });
  f.forma(rr(16, 35.5, 2, 1.5, 0.3), K.heb, { w: 0.3, sil: false });
  // Audífonos naranjos al cuello
  f.linea('M10.6 22.8Q17 20.6 23.4 22.8', 0.7, T);
  f.forma(rr(9, 21.6, 2.8, 3.8, 1), K.or, { w: 0.45 }); f.forma(rr(22.2, 21.6, 2.8, 3.8, 1), K.or, { w: 0.45 });
  f.mancha(rr(9.9, 22.4, 1, 2.2, 0.4), K.hb); f.mancha(rr(23.1, 22.4, 1, 2.2, 0.4), K.hb);
  // Cara: mirada tranquila, barba de pocos días y jopo
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: 'media', labio: K.boca, cejas: K.hs, cejasY: 12 });
  f.mancha(elipse(9, 14.4, 0.85, 0.78), T, { cab: true }); f.mancha(elipse(14, 14.4, 0.8, 0.78), T, { cab: true });
  f.mancha(elipse(8.75, 14.1, 0.26, 0.26), BLANCO, { cab: true }); f.mancha(elipse(13.75, 14.1, 0.24, 0.26), BLANCO, { cab: true });
  f.mancha('M3.1 16.2C3.6 19.9 6.9 22.2 10.7 22.2C14.3 22.1 16.8 19.8 17 16C16.2 18.8 13.8 20.8 10.8 20.9C7.6 20.9 4.4 19.2 3.1 16.2Z', K.ba, { cab: true, op: 0.55 });
  f.mancha(puntos([[4.6, 18.4], [6.2, 19.8], [8.2, 20.8], [10.4, 21.2], [12.6, 20.8], [14.4, 19.8], [15.8, 18.2], [9.4, 19.6], [11.6, 19.8]], 0.26), K.ba, { cab: true });
  // Pelo corto con jopo: sube adelante y se enrolla hacia la frente; los lados más cortos
  f.forma('M2.2 11C1.4 7.4 1.6 4.4 3.4 2.6Q5.4 0.6 8.6 0.2Q10.6 -1.6 13.8 -1.8Q17 -1.8 18.7 0.2Q19.3 1.4 18.4 2.3Q17.8 2.6 17.3 2.4Q18.6 3.6 18.5 5.6Q18.4 8.4 17.8 10.6L17 10.8L16.8 8.6Q12 7.4 6.6 7.8L4.4 8.6L3.4 11.2Z', K.h, { cab: true });
  f.mancha('M1.9 6.4C1.6 8 1.8 9.6 2.3 10.8L3.4 11.1L4.2 8.8C3.6 8 2.8 7 1.9 6.4Z', '#6B5646', { cab: true });
  f.mancha('M16.8 3C18.2 4.2 18.6 6.8 17.8 10.5L17.1 10.6L16.9 8.6C17.3 6.6 17.2 4.6 16.8 3Z', K.hs, { cab: true });
  f.linea('M6.4 2.6Q10.4 -0.4 15.2 -0.8Q17.4 -0.8 18 0.4', 0.6, K.hl, { cab: true });
  f.linea('M8 4.6Q11.6 3 15.6 3.6', 0.4, K.hl, { cab: true });
  f.linea('M12.4 1.6Q14.4 2.6 16.4 2.4', 0.35, K.hs, { cab: true });
  return f;
}
