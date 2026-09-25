// Mascotas en vector, versión oficina: Atlas (de The Architect) y Plotty (de The Engine).
// Flotan: la escena dibuja la sombra en el suelo.
import { figura, rr, elipse, T, BLANCO } from './kit.mjs';

// Atlas: orbe de vidrio con el corazón de plasma, visor de LED y el anillo con sus dos satélites.
export function atlas() {
  const K = { vi: '#123F66', vil: '#1D5C92', vz: '#0A1B2E', pl: '#17C3B2', pl2: '#7FD8CF', pc: '#E9FFFC', an: '#D5E2EE', ans: '#8FA3B8', sa: '#35679A', me: '#2A6A9E' };
  const f = figura();
  const cx = 19, cy = 13, R = 8.4;
  // Anillo: elipse inclinada, mitad de atrás antes del orbe y mitad de adelante después
  const punto = (a) => { const x = cx + 16 * Math.cos(a); return [x, cy + 3 + 3.4 * Math.sin(a) - (x - cx) * 0.22]; };
  const arco = (a0, a1) => { let d = ''; for (let i = 0; i <= 24; i++) { const [x, y] = punto(a0 + (a1 - a0) * i / 24); d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2); } return d; };
  f.tubo(arco(Math.PI, Math.PI * 2), K.ans, 0.9, { borde: 0.4 });
  // Orbe
  f.forma(elipse(cx, cy, R, R), K.vi, { w: 0.55 });
  f.mancha(`M${cx + R * 0.35} ${cy - R * 0.93}A${R} ${R} 0 0 1 ${cx - R * 0.6} ${cy + R * 0.8}A${R * 1.05} ${R * 1.05} 0 0 0 ${cx + R * 0.35} ${cy - R * 0.93}Z`, K.vz, { op: 0.55 });
  f.mancha(`M${cx - R * 0.8} ${cy - R * 0.2}A${R} ${R} 0 0 1 ${cx + R * 0.1} ${cy - R}A${R * 0.9} ${R * 0.9} 0 0 0 ${cx - R * 0.8} ${cy - R * 0.2}Z`, K.vil);
  f.linea(`M${cx} ${cy - R + 0.4}Q${cx - 2.6} ${cy} ${cx} ${cy + R - 0.4}`, 0.4, K.me);
  // Corazón de plasma
  f.mancha(elipse(cx, cy + 4, 3.4, 3.2), K.pl);
  f.mancha(elipse(cx, cy + 4, 2, 1.9), K.pl2);
  f.mancha(elipse(cx, cy + 4, 1.1, 1.05), K.pc);
  // Visor de LED con los ojos
  f.forma(`M${cx - 7.9} ${cy - 2.9}Q${cx} ${cy - 4} ${cx + 7.9} ${cy - 2.9}L${cx + 8.3} ${cy + 0.2}Q${cx} ${cy + 1.1} ${cx - 8.3} ${cy + 0.2}Z`, K.vz, { w: 0.45, sil: false });
  f.forma(rr(cx - 5.2, cy - 2.4, 1.9, 1.9, 0.5), K.pl, { w: 0, sil: false });
  f.forma(rr(cx + 2.2, cy - 2.4, 1.9, 1.9, 0.5), K.pl, { w: 0, sil: false });
  f.linea(`M${cx - 5.6} ${cy - 6}Q${cx - 4.2} ${cy - 7.2} ${cx - 2.6} ${cy - 7.3}`, 0.55, BLANCO);
  // Mitad de adelante del anillo y los satélites
  f.tubo(arco(0, Math.PI), K.an, 0.9, { borde: 0.4 });
  for (const a of [Math.PI, 0]) { const [x, y] = punto(a); f.forma(elipse(x, y, 1.1, 1.1), K.sa, { w: 0.4 }); f.mancha(elipse(x + 0.35, y - 0.35, 0.4, 0.4), K.pl); }
  return f;
}

// Plotty: el ícono de BiPlot hecho bot, con su cara de LED, dos rotores, antena y núcleo de plasma.
export function plotty(cara = 'hola') {
  const K = { ni: '#F2F4F7', nis: '#C4D2E0', pa: '#123459', pl: '#17C3B2', pl2: '#7FD8CF', an: '#B9C8D8', co: '#35679A', pc: '#E9FFFC', coral: '#FF6B4A' };
  const f = figura();
  // Brazos de los rotores y antena
  f.tubo('M8.2 8.8Q6 7.4 5.1 5.4', K.an, 0.8, { borde: 0.4 });
  f.tubo('M23.8 8.8Q26 7.4 26.9 5.4', K.an, 0.8, { borde: 0.4 });
  f.tubo('M16 7.2V3.4', K.an, 0.7, { borde: 0.4 });
  f.forma(elipse(16, 2.3, 1.25, 1.25), cara === 'califica' ? K.coral : K.pl2, { w: 0.45 });
  f.forma(elipse(4.9, 5, 1, 0.75), K.co, { w: 0.4 }); f.forma(elipse(27.1, 5, 1, 0.75), K.co, { w: 0.4 });
  // Cuello y núcleo de plasma
  f.forma(rr(14, 21.4, 4, 1.4, 0.3), K.an, { w: 0.4 });
  f.forma(elipse(16, 24.4, 2.3, 1.9), K.pl, { w: 0.45 });
  f.mancha(elipse(16, 24.3, 1, 0.8), K.pc);
  // Cuerpo redondeado y pantalla
  f.forma(rr(6.9, 6.9, 18.2, 15.2, 3.2), K.ni, { w: 0.55 });
  f.mancha('M22.4 7.4Q25 7.6 25 10.2V19Q25 21.9 22 21.9H9.9Q7.6 21.9 7.1 20.2Q9.4 20.9 21.6 20.6Q23.4 20.4 23.5 18.4V10Q23.5 8 22.4 7.4Z', K.nis);
  f.forma(rr(8.9, 8.9, 14.2, 10.2, 2), K.pa, { w: 0.45, sil: false });
  // Cara de LED
  f.mancha(rr(11, 11, 2.1, 2.1, 0.5), K.pl); f.mancha(rr(18.1, 11, 2.1, 2.1, 0.5), K.pl);
  if (cara === 'hola') f.linea('M11.6 15.3Q15.6 18.3 19.6 15.3', 0.85, K.pl);
  else f.linea('M12.4 16.4H18.8', 0.85, K.pl);
  f.linea('M10 10.3L11.4 9.9', 0.4, 'rgba(255,255,255,.35)');
  // Hélices translúcidas y brillo del núcleo, encima y sin contorno
  f.luz('M0.6 3.6Q4.9 2.3 9.2 3.6Q4.9 4.6 0.6 3.6Z', 'rgba(221,244,241,.8)');
  f.luz('M22.8 3.6Q27.1 2.3 31.4 3.6Q27.1 4.6 22.8 3.6Z', 'rgba(221,244,241,.8)');
  f.luz(elipse(16, 24.6, 3.6, 2.8), 'rgba(23,195,178,.3)');
  return f;
}
