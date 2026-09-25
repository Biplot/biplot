// Kit de los personajes de oficina en vector: mismo diseño cabezón de los sprites pixel,
// dibujado con curvas. Coordenadas "de personaje" en unidades de pixel (1 unidad = 1 pixel del sprite),
// así calzan en los mismos lugares que la versión pixel. Cabeza local = (x - 7, y - 1).
export const T = '#0B1726';
export const BLANCO = '#FFFFFF';
const r = (n) => Math.round(n * 100) / 100;

// Rectángulo redondeado como path.
export function rr(x, y, w, h, k = 1) {
  k = Math.min(k, w / 2, h / 2);
  return `M${r(x + k)} ${r(y)}H${r(x + w - k)}Q${r(x + w)} ${r(y)} ${r(x + w)} ${r(y + k)}V${r(y + h - k)}Q${r(x + w)} ${r(y + h)} ${r(x + w - k)} ${r(y + h)}H${r(x + k)}Q${r(x)} ${r(y + h)} ${r(x)} ${r(y + h - k)}V${r(y + k)}Q${r(x)} ${r(y)} ${r(x + k)} ${r(y)}Z`;
}
export function elipse(cx, cy, rx, ry) {
  return `M${r(cx - rx)} ${r(cy)}A${r(rx)} ${r(ry)} 0 1 0 ${r(cx + rx)} ${r(cy)}A${r(rx)} ${r(ry)} 0 1 0 ${r(cx - rx)} ${r(cy)}Z`;
}

// Figura: junta capas y arma la silueta. Todo lo que es borde de la figura va con sil (contorno grueso
// de tinta por fuera, más cargado abajo a la derecha); los trazos de adentro son finos.
export function figura() {
  const capas = [];
  const cab = (d) => `<g transform="translate(7 1)">${d}</g>`;
  const f = {
    capas,
    // Forma con borde fino; por defecto también arma la silueta.
    forma(d, fill, o = {}) { capas.push({ tipo: 'forma', d, fill, w: o.w ?? 0.5, sil: o.sil !== false, cab: !!o.cab, op: o.op }); return f; },
    // Mancha sin borde (sombras y brillos).
    mancha(d, fill, o = {}) { capas.push({ tipo: 'mancha', d, fill, sil: !!o.sil, cab: !!o.cab, op: o.op }); return f; },
    // Trazo (tubos: brazos, cuerdas, antenas). Con borde de tinta propio.
    tubo(d, color, w, o = {}) { capas.push({ tipo: 'tubo', d, color, w, borde: o.borde ?? 0.5, sil: o.sil !== false, cab: !!o.cab, cap: o.cap || 'round' }); return f; },
    // Línea de tinta o de color, sin borde.
    linea(d, w = 0.45, color = T, o = {}) { capas.push({ tipo: 'linea', d, color, w, sil: !!o.sil, cab: !!o.cab, cap: o.cap || 'round', op: o.op }); return f; },
    // Algo que va encima y sin contorno (brillos translúcidos, hélices).
    luz(d, fill) { capas.push({ tipo: 'mancha', d, fill, sil: false, luz: true }); return f; },
    // Marcado ya armado, sin silueta (ojos agrupados para el parpadeo)
    raw(svg, o = {}) { capas.push({ tipo: 'raw', svg, sil: false, cab: !!o.cab }); return f; },
    svg(o = {}) {
      const S = o.silueta ?? 1.7;
      const envolver = (c, s) => c.cab ? cab(s) : s;
      const sil = capas.filter(c => c.sil).map(c => {
        if (c.tipo === 'tubo' || c.tipo === 'linea') return envolver(c, `<path d="${c.d}" fill="none" stroke="${T}" stroke-width="${r(c.w + (c.tipo === 'tubo' ? c.borde * 2 : 0) + S)}" stroke-linecap="${c.cap}" stroke-linejoin="round"/>`);
        return envolver(c, `<path d="${c.d}" fill="${T}" stroke="${T}" stroke-width="${S}" stroke-linejoin="round"/>`);
      }).join('');
      const color = capas.map(c => {
        const op = c.op != null ? ` opacity="${c.op}"` : '';
        if (c.tipo === 'raw') return envolver(c, c.svg);
        if (c.tipo === 'forma') return envolver(c, `<path d="${c.d}" fill="${c.fill}" stroke="${T}" stroke-width="${c.w}" stroke-linejoin="round" stroke-linecap="round"${op}/>`);
        if (c.tipo === 'mancha') return envolver(c, `<path d="${c.d}" fill="${c.fill}"${op}/>`);
        if (c.tipo === 'tubo') return envolver(c, `<path d="${c.d}" fill="none" stroke="${T}" stroke-width="${r(c.w + c.borde * 2)}" stroke-linecap="${c.cap}" stroke-linejoin="round"/><path d="${c.d}" fill="none" stroke="${c.color}" stroke-width="${c.w}" stroke-linecap="${c.cap}" stroke-linejoin="round"/>`);
        return envolver(c, `<path d="${c.d}" fill="none" stroke="${c.color}" stroke-width="${c.w}" stroke-linecap="${c.cap}" stroke-linejoin="round"${op}/>`);
      }).join('');
      // Silueta con peso: una copia corrida abajo a la derecha engruesa ese lado, como entintado a mano.
      // Con o.partes devuelve la silueta (compacta, con los atributos comunes en el grupo) y el color por separado.
      if (o.partes) {
        const silC = capas.filter(c => c.sil).map(c => {
          if (c.tipo === 'tubo' || c.tipo === 'linea') return envolver(c, `<path d="${c.d}" fill="none" stroke-width="${r(c.w + (c.tipo === 'tubo' ? c.borde * 2 : 0) + S)}" stroke-linecap="${c.cap}"/>`);
          return envolver(c, `<path d="${c.d}"/>`);
        }).join('');
        // Color compacto: uniones y puntas redondas se heredan del grupo
        const colorC = capas.map(c => {
          const op = c.op != null ? ` opacity="${c.op}"` : '';
          if (c.tipo === 'raw') return envolver(c, c.svg);
          if (c.tipo === 'forma') return envolver(c, `<path d="${c.d}" fill="${c.fill}" stroke="${T}" stroke-width="${c.w}"${op}/>`);
          if (c.tipo === 'mancha') return envolver(c, `<path d="${c.d}" fill="${c.fill}"${op}/>`);
          const cap = c.cap === 'round' ? '' : ` stroke-linecap="${c.cap}"`;
          if (c.tipo === 'tubo') return envolver(c, `<path d="${c.d}" fill="none" stroke="${T}" stroke-width="${r(c.w + c.borde * 2)}"${cap}/><path d="${c.d}" fill="none" stroke="${c.color}" stroke-width="${c.w}"${cap}/>`);
          return envolver(c, `<path d="${c.d}" fill="none" stroke="${c.color}" stroke-width="${c.w}"${cap}${op}/>`);
        }).join('');
        return { sil: `<g fill="${T}" stroke="${T}" stroke-width="${S}" stroke-linejoin="round">${silC}</g>`, color: `<g stroke-linejoin="round" stroke-linecap="round">${colorC}</g>` };
      }
      return `<g>${sil}</g><g transform="translate(.28 .36)">${sil}</g>${color}`;
    }
  };
  return f;
}

// ───────── Cara estándar (cabeza local, mirando a la derecha en 3/4) ─────────
// Óvalo de la cara: frente ancha, mandíbula que baja hacia el mentón corrido a la derecha.
export const CARA = 'M3.1 9.6C3.1 6.4 16.9 6.4 16.9 9.6L17 15.2C17 19.4 14.3 22.1 10.7 22.2C6.6 22.2 3.1 19.5 3.1 15.3Z';
export const CARA_SOMBRA = 'M15.6 10.2C16.4 10.4 16.9 11.4 17 12.6L17 15.2C17 19 14.8 21.6 11.6 22.1C14.3 20.6 15.7 18.3 15.8 15.4Z';

export function cara(f, o) {
  const piel = o.piel, sombra = o.sombra;
  if (o.oreja !== false) {
    f.forma('M3.6 13.1C1.6 12.2 0.4 13.8 0.9 15.3C1.3 16.6 2.5 17.3 3.6 16.9Z', piel, { cab: true });
    f.linea('M2.9 14.2C2.1 14.3 1.9 15.3 2.6 15.8', 0.35, sombra, { cab: true });
  }
  f.forma(o.caraD || CARA, piel, { cab: true });
  f.mancha(o.sombraD || CARA_SOMBRA, sombra, { cab: true });
  if (o.rubor) { f.mancha(elipse(5.6, 17, 1.3, 0.75), o.rubor, { cab: true, op: 0.55 }); f.mancha(elipse(15.4, 16.9, 0.9, 0.7), o.rubor, { cab: true, op: 0.55 }); }
  const ojos = o.ojos === undefined ? 'grandes' : o.ojos;
  const E = o.ojosX || [9, 14];
  // Cada ojo en su grupo «pj-ojo»: oficina.css lo hace parpadear
  if (ojos === 'grandes') for (const x of E) f.raw(`<g class="pj-ojo"><path d="${elipse(x, 14.1, 0.95, 1.25)}" fill="${T}"/><path d="${elipse(x - 0.3, 13.55, 0.38, 0.42)}" fill="${BLANCO}"/></g>`, { cab: true });
  if (ojos === 'chicos') for (const x of E) f.raw(`<g class="pj-ojo"><path d="${elipse(x, 14.3, 0.7, 0.85)}" fill="${T}"/></g>`, { cab: true });
  if (ojos === 'felices') for (const x of E) f.linea(`M${x - 1.1} 14.6Q${x} 13.2 ${x + 1.1} 14.6`, 0.6, T, { cab: true });
  if (o.cejas) for (const x of E) f.linea(`M${x - 1.2} ${o.cejasY ?? 11.6}Q${x} ${(o.cejasY ?? 11.6) - 0.6} ${x + 1.2} ${o.cejasY ?? 11.6}`, 0.55, o.cejas, { cab: true });
  if (o.nariz !== false) f.linea('M13.4 15.9Q12.9 16.5 13.6 16.7', 0.4, sombra, { cab: true });
  const m = o.labio || '#7A2E2A';
  switch (o.boca === undefined ? 'sonrisa' : o.boca) {
    case 'sonrisa': f.linea('M10.1 18.1Q11.8 19.4 13.6 18', 0.5, m, { cab: true }); break;
    case 'media': f.linea('M10.3 18.6Q12 19 13.6 18.1', 0.5, m, { cab: true }); break;
    case 'linea': f.linea('M10.4 18.6H12.9', 0.5, m, { cab: true }); break;
    case 'dientes':
      f.forma('M9.9 17.6Q11.9 17.9 13.9 17.5Q13.5 20 11.8 20Q10.1 20 9.9 17.6Z', m, { cab: true, w: 0.35, sil: false });
      f.mancha('M10.4 17.85Q11.9 18.05 13.4 17.8L13.3 18.5Q11.9 18.75 10.5 18.5Z', BLANCO, { cab: true }); break;
    case 'paleta':
      f.linea('M10.1 17.8Q11.9 18.5 13.7 17.7', 0.5, m, { cab: true });
      f.forma(rr(11, 18.1, 1.8, 1.5, 0.3), BLANCO, { cab: true, w: 0.3, sil: false });
      f.linea('M11.9 18.2V19.5', 0.2, '#B9C8D8', { cab: true }); break;
  }
}

// Zapatillas estándar (punta a la derecha): izquierda más atrás y chica, derecha adelante.
export function zapatillas(f, y, capa, suela, franja, o = {}) {
  const alto = o.alto ?? 4.2;
  f.forma(`M10.8 ${y}H15.6Q16.2 ${y + 1.3} 16.8 ${y + 1.9}Q17.2 ${y + 2.4} 17.1 ${y + alto - 1}L17.1 ${y + alto}H10.2V${y + 1.6}Q10.2 ${y} 10.8 ${y}Z`, capa);
  f.forma(`M17.8 ${y}H22.6Q23.3 ${y + 1.3} 24 ${y + 1.9}Q24.5 ${y + 2.4} 24.4 ${y + alto - 1}L24.4 ${y + alto}H17.4V${y + 1.6}Q17.4 ${y} 17.8 ${y}Z`, capa);
  if (suela) { f.forma(rr(10.2, y + alto - 1.1, 6.9, 1.1, 0.4), suela, { w: 0.4 }); f.forma(rr(17.4, y + alto - 1.1, 7, 1.1, 0.4), suela, { w: 0.4 }); }
  if (franja) { f.linea(`M11.6 ${y + 1.5}Q13 ${y + 1.2} 14.4 ${y + 1.6}`, 0.6, franja); f.linea(`M18.9 ${y + 1.5}Q20.3 ${y + 1.2} 21.7 ${y + 1.6}`, 0.6, franja); }
}

// Piernas estándar (dos columnas con sombra a la derecha).
export function piernas(f, y0, y1, color, sombra, izq = [11, 16], der = [17.4, 22.4]) {
  for (const [a, b] of [izq, der]) {
    f.forma(`M${a} ${y0}H${b}L${b - 0.1} ${y1}H${a + 0.2}Z`, color);
    f.mancha(`M${b - 1.1} ${y0 + 0.3}H${b - 0.25}L${b - 0.3} ${y1 - 0.25}H${b - 1.1}Z`, sombra);
  }
}

// Credencial chica (x, y = esquina de arriba a la izquierda).
export function credencial(f, x, y) {
  f.forma(rr(x, y, 2.2, 3, 0.4), '#F2F4F7', { w: 0.35, sil: false });
  f.mancha(`M${x + 0.2} ${y + 0.2}H${x + 2}V${y + 1}H${x + 0.2}Z`, '#0E2A47');
}

// Engranaje: n dientes entre el radio interior y el exterior.
export function engranaje(cx, cy, rIn, rOut, n = 8) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, paso = Math.PI * 2 / n;
    const a = [a0, a0 + paso * 0.18, a0 + paso * 0.32, a0 + paso * 0.68, a0 + paso * 0.82];
    pts.push([cx + rIn * Math.cos(a[0]), cy + rIn * Math.sin(a[0])]);
    pts.push([cx + rIn * Math.cos(a[1]), cy + rIn * Math.sin(a[1])]);
    pts.push([cx + rOut * Math.cos(a[2]), cy + rOut * Math.sin(a[2])]);
    pts.push([cx + rOut * Math.cos(a[3]), cy + rOut * Math.sin(a[3])]);
    pts.push([cx + rIn * Math.cos(a[4]), cy + rIn * Math.sin(a[4])]);
  }
  return 'M' + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join('L') + 'Z';
}
// Puntos sueltos (pecas, barba de días, textura).
export function puntos(lista, rad = 0.3) {
  return lista.map(([x, y]) => `M${r(x - rad)} ${r(y)}a${rad} ${rad} 0 1 0 ${r(rad * 2)} 0a${rad} ${rad} 0 1 0 ${r(-rad * 2)} 0Z`).join('');
}
