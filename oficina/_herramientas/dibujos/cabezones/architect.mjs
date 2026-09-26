// The Architect en vector, versión oficina: visor cian, pelo desordenado con degradado, barba corta italiana,
// polerón carbón con la «A», credencial E2, jeans con cadena y zapatillas de caña.
import { figura, cara, zapatillas, piernas, credencial, rr, elipse, T, BLANCO } from './kit.mjs';

const K = {
  h: '#2A211C', H: '#5A4434', j: '#17110D', f: '#8A6A55', s: '#E0AC82', S: '#C48C63',
  v: '#A8EDE4', V: '#3FD3C4', e: '#0A6F66', b: '#46372D', B: '#2E231C', m: '#7A3A32',
  p: '#2F3640', P: '#20252D', q: '#3D4652', t: '#17C3B2', W: '#F2F4F7',
  J: '#3D5A80', JK: '#2A4262', JL: '#5677A0', c: '#B9C8D8', z: '#1F252E'
};

export function architect() {
  const f = figura();
  // Jeans con cadena y zapatillas de caña
  f.forma('M10.8 36.2H22.7L22.6 38.8H10.9Z', K.J);
  piernas(f, 37.4, 46.6, K.J, K.JK, [11, 16.1], [17.3, 22.5]);
  f.linea('M12.4 40.2V44.8', 0.55, K.JL); f.linea('M18.7 40.2V44.8', 0.55, K.JL);
  f.linea('M22.3 37.3Q24.6 38.3 23.8 39.7Q23.1 40.8 21.9 40.5', 0.45, K.c, { sil: true });
  zapatillas(f, 46.2, K.z, K.W, K.W);
  // Polerón carbón
  f.forma('M9.6 23.8C11.6 22.9 22.2 22.9 24.2 23.8Q25.3 24.3 25.1 25.8L24.2 36.1H9.8L8.7 25.8Q8.6 24.3 9.6 23.8Z', K.p);
  f.mancha('M22.3 24C23.7 24.2 24.9 24.9 25 25.9L24.2 36H22.5Z', K.P);
  // Cordones cian
  f.linea('M14.6 24.4V27.8', 0.45, K.t); f.linea('M19.3 24.4V27.1', 0.45, K.t);
  f.forma(rr(14.2, 27.6, 0.8, 1.2, 0.3), K.W, { w: 0.25, sil: false });
  f.forma(rr(18.9, 26.9, 0.8, 1.2, 0.3), K.W, { w: 0.25, sil: false });
  // La «A»
  f.linea('M15.3 31L17.2 27.3L19.1 31', 0.75, K.t); f.linea('M16.2 29.6H18.3', 0.55, K.t);
  credencial(f, 20.8, 27.8);
  // Brazos con las manos en el bolsillo canguro
  f.tubo('M9.3 25.2Q9.4 29.6 11.2 32.9', K.p, 2.3);
  f.tubo('M24.5 25.3Q24.6 29.6 22.8 32.8', K.P, 2.3);
  f.forma('M12.2 31.3H21.8Q22.6 31.3 22.6 32.1V34.9H11.4V32.1Q11.4 31.3 12.2 31.3Z', K.q, { w: 0.45 });
  f.linea('M12 32H22', 0.4, K.P);
  // Ribete inferior cian
  f.forma(rr(9.7, 34.8, 14.6, 2, 0.5), K.P, { w: 0.45 });
  f.mancha('M10.1 35.05H23.9V35.9H10.1Z', K.t);
  // Capucha: borde oscuro con forro cian alrededor del cuello
  f.forma('M10.7 24C11.5 21.7 22.3 21.7 23.1 24C21.1 25.4 12.7 25.4 10.7 24Z', K.p);
  f.mancha('M12.2 23.7C13 22.5 20.8 22.5 21.6 23.7C19.8 24.5 14 24.5 12.2 23.7Z', K.t);

  // Cabeza
  cara(f, { piel: K.s, sombra: K.S, ojos: null, boca: null });
  // Barba corta italiana: una franja fina por la mandíbula, bigote delgado y mentón
  f.mancha('M3.2 16.1C3.6 19.9 6.9 22.2 10.7 22.2C14.3 22.1 16.8 19.8 17 16L16.3 16.5C15.9 19 13.9 20.6 10.8 20.7C7.6 20.7 4.7 19.1 4 16.5Z', '#4A3A2E', { cab: true });
  f.mancha('M9.3 20.9Q10.9 19.9 12.6 20.8Q11 21.5 9.3 20.9Z', '#4A3A2E', { cab: true });
  f.mancha('M10.2 17.55Q11.9 17 13.6 17.45Q11.9 17.9 10.2 17.55Z', '#4A3A2E', { cab: true });
  f.linea('M11 18.7Q12.1 19.15 13.1 18.5', 0.42, '#5A2A24', { cab: true });
  f.linea(CONTORNO_CARA, 0.5, T, { cab: true });
  // Visor envolvente
  f.forma('M2.4 11.2Q10 10.3 18.4 10.9Q19.3 11 19.1 12.1L18.8 13.9Q18.6 14.8 17.6 14.7Q10.6 14.3 3 14.7Q2 14.8 1.9 13.8L1.8 12.1Q1.8 11.3 2.4 11.2Z', K.V, { cab: true, w: 0.55 });
  f.mancha('M2.5 11.8Q10 10.9 18.3 11.4L18.2 12.7Q10.4 12.3 2.5 12.8Z', K.v, { cab: true });
  f.mancha(elipse(9, 13.35, 0.8, 0.55), K.e, { cab: true }); f.mancha(elipse(14, 13.35, 0.8, 0.55), K.e, { cab: true });
  f.linea('M3.5 12.05L6.4 11.85', 0.45, BLANCO, { cab: true });
  // Pelo corto y desordenado, con degradado sobre la oreja
  f.forma('M1.2 12.2C0.5 10 0.4 7.6 1 5.8Q1.4 3.2 3.2 1.2Q3.6 2 4.6 2.1Q5.2 0.4 6.6 -0.6Q6.9 0.5 8.3 1Q9 -0.4 10.2 -0.9Q10.8 0.2 12 0.8Q12.8 -0.2 13.8 -0.6Q14.1 0.8 15.4 1.6Q16.2 1.1 17 0.9Q17.2 1.9 18.2 2.6Q18.9 2.7 19.4 3.2Q19.1 3.8 19.3 4.6C19.9 6.6 19.7 8.8 19 10.6C18.5 11 17.9 11 17.4 10.6C17 10.3 16.5 10.2 16 10.4Q15.8 11.3 14.9 11.9Q15.2 10.9 14.4 10.2C13.1 9.8 11.9 9.9 11 10.2Q10.6 11.1 9.6 11.6Q9.9 10.6 9.2 10C8.2 9.7 7.2 9.9 6.6 10.3Q6.2 11.1 5.2 11.5Q5.5 10.6 4.8 10.2Q3.8 10.3 3.1 11.5C2.4 12 1.8 12.2 1.2 12.2Z', K.h, { cab: true });
  f.mancha('M0.9 7.6C0.7 9.4 0.9 11 1.3 12.1C1.9 12.2 2.6 12 3.1 11.5C3 10.2 2.7 8.8 2.2 7.4C1.7 7.2 1.2 7.3 0.9 7.6Z', '#5C4A3E', { cab: true });
  f.linea('M1.2 9.2Q1.8 9.1 2.4 9.3M1.3 10.6Q1.9 10.5 2.6 10.7', 0.3, '#6E5A4C', { cab: true });
  f.mancha('M17.9 3.4C19 4.6 19.7 7.2 18.9 10.4C18.5 10.8 18 10.8 17.7 10.5C18.4 8.2 18.6 5.6 17.9 3.4Z', K.j, { cab: true });
  f.linea('M3.4 5Q4.6 3.4 6.4 2.6', 0.55, K.H, { cab: true });
  f.linea('M9.2 2.4Q10.8 1.3 12.4 1.8', 0.55, K.H, { cab: true });
  f.linea('M14.7 3.2Q16.1 3.4 17.1 4.4', 0.5, K.H, { cab: true });
  f.linea('M7.6 4.3Q8.5 6.2 7.9 8.4', 0.4, K.j, { cab: true });
  f.linea('M12.4 4Q13.4 6 12.9 8.2', 0.4, K.j, { cab: true });
  f.linea('M16.1 5.2Q17 7 16.7 8.9', 0.4, K.j, { cab: true });
  return f;
}
// Contorno de la mandíbula, para devolverle el borde que tapa la barba.
const CONTORNO_CARA = 'M3.1 15.3C3.1 19.5 6.6 22.2 10.7 22.2C14.3 22.1 17 19.4 17 15.2';
