/*
 * Oficina BiPlot · escena isométrica
 * Dibuja la oficina en un <svg> (proyección 2:1), ubica al personal y lo hace caminar. Sin librerías.
 * La usan la oficina (oficina.js, con cámara e interfaz) y el kit de Instagram (kit/, en modo quieto).
 *
 * Coordenadas del mundo: x hacia abajo a la derecha, y hacia abajo a la izquierda, z hacia arriba.
 * La planta mide ANCHO × FONDO baldosas. El orden de dibujo es por profundidad (x + y), en capas.
 *
 * Escena.construir(svg, { animado }) → { zonas, actores, limites, P, detener() }
 */
(function () {
  'use strict';

  var E = window.Elenco, C = E.C;
  var TW = 32, TH = 16, ZH = 39;          // medio ancho y medio alto de baldosa; px por unidad de altura
  var ANCHO = 24, FONDO = 20, ALTO_MURO = 3, ALTO_VIDRIO = 2.2;
  var ESCALA_ACTOR = 0.34;

  // Materiales (todos salen de la escala azul y cian de la marca)
  var M = {
    piso: '#163A60', pisoLinea: 'rgba(23,195,178,.09)', losaIzq: '#0E2A47', losaDer: '#091D33',
    muroX: '#10304F', muroY: '#15395E', muroTope: '#2A5A88', zocalo: '#0B2440',
    alfombra: '#1B4670', alfombra2: '#21507D',
    vidrio: 'rgba(127,216,207,.07)', vidrioBorde: 'rgba(127,216,207,.38)', marco: '#2F5F8C',
    mesa: '#D5E2EE', mesaIzq: '#8FA3B8', mesaDer: '#6B7A8C',
    oscuro: '#35679A', pantalla: '#0B2B45', planta: '#168A86', planta2: '#0A8A7E', maceta: '#C4D2E0'
  };

  function r1(n) { return Math.round(n * 10) / 10; }
  function P(x, y, z) { return [(x - y) * TW, (x + y) * TH - (z || 0) * ZH]; }
  function pts(a) { return a.map(function (p) { var q = P(p[0], p[1], p[2]); return r1(q[0]) + ',' + r1(q[1]); }).join(' '); }
  function poly(a, attr) { return '<polygon points="' + pts(a) + '" ' + (attr || '') + '/>'; }

  function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mezcla(a, b, t) {
    var x = hex2rgb(a), y = hex2rgb(b);
    return '#' + x.map(function (v, i) { return ('0' + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2); }).join('');
  }
  function sombreado(c, t) { return mezcla(c, '#061525', t); }

  // Caja con tres caras visibles: arriba, izquierda (+y) y derecha (+x).
  function caja(x, y, z, w, d, h, col, extra) {
    var t = col.t || col, l = col.l || sombreado(t, .22), r = col.r || sombreado(t, .42);
    return '<g ' + (extra || '') + '>' +
      poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], 'fill="' + l + '"') +
      poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], 'fill="' + r + '"') +
      poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], 'fill="' + t + '"') +
      '</g>';
  }

  // Planos verticales y horizontales para dibujar en 2D sobre la escena (100 unidades locales = 1 baldosa).
  function planoY(x0, y0, zTop) { var p = P(x0, y0, zTop); return 'matrix(' + TW / 100 + ',' + TH / 100 + ',0,' + ZH / 100 + ',' + r1(p[0]) + ',' + r1(p[1]) + ')'; }
  function planoX(x0, y0, zTop) { var p = P(x0, y0, zTop); return 'matrix(' + TW / 100 + ',' + (-TH / 100) + ',0,' + ZH / 100 + ',' + r1(p[0]) + ',' + r1(p[1]) + ')'; }
  function planoZ(x0, y0, z0) { var p = P(x0, y0, z0); return 'matrix(' + TW / 100 + ',' + TH / 100 + ',' + (-TW / 100) + ',' + TH / 100 + ',' + r1(p[0]) + ',' + r1(p[1]) + ')'; }
  function enPlano(tr, contenido, extra) { return '<g transform="' + tr + '" ' + (extra || '') + '>' + contenido + '</g>'; }

  function texto(x, y, t, tam, color, peso, extra) {
    return '<text x="' + x + '" y="' + y + '" font-family="Space Grotesk, sans-serif" font-weight="' + (peso || 600) + '" font-size="' + tam + '" fill="' + color + '" ' + (extra || '') + '>' + t + '</text>';
  }
  function mono(x, y, t, tam, color, extra) {
    return '<text x="' + x + '" y="' + y + '" font-family="Space Mono, monospace" font-weight="700" font-size="' + tam + '" fill="' + color + '" ' + (extra || '') + '>' + t + '</text>';
  }

  // Cilindro vertical visto en isométrico (centro en el piso, radio en baldosas).
  function cilindro(cx, cy, z, r, h, col, extra) {
    var p0 = P(cx, cy, z), p1 = P(cx, cy, z + h), rx = r1(r * TW * Math.SQRT2), ry = r1(r * TH * Math.SQRT2);
    var lado = col.l || sombreado(col.t || col, .3), tope = col.t || col;
    return '<g ' + (extra || '') + '><path d="M' + r1(p0[0] - rx) + ' ' + r1(p0[1]) + ' A' + rx + ' ' + ry + ' 0 0 0 ' + r1(p0[0] + rx) + ' ' + r1(p0[1]) +
      ' V' + r1(p1[1]) + ' H' + r1(p1[0] - rx) + ' Z" fill="' + lado + '"/>' +
      '<ellipse cx="' + r1(p1[0]) + '" cy="' + r1(p1[1]) + '" rx="' + rx + '" ry="' + ry + '" fill="' + tope + '"/></g>';
  }

  function planta(x, y, alto, z) {
    alto = alto || 1; z = z || 0;
    var b = P(x, y, z + 0.45 * Math.min(alto, 1)), s = '';
    s += cilindro(x, y, z, 0.28 * Math.min(alto, 1), 0.45 * Math.min(alto, 1), { t: M.maceta, l: '#8FA3B8' });
    var hojas = [[-14, -26, 10, 22, -24], [12, -28, 9, 21, 26], [0, -38, 9, 24, 0], [-22, -14, 8, 16, -52], [20, -14, 8, 16, 50]];
    s += '<g transform="translate(' + r1(b[0]) + ' ' + r1(b[1]) + ') scale(' + alto + ')">';
    hojas.forEach(function (h, i) {
      s += '<ellipse cx="' + h[0] + '" cy="' + h[1] + '" rx="' + h[2] + '" ry="' + h[3] + '" fill="' + (i % 2 ? M.planta2 : M.planta) + '" transform="rotate(' + h[4] + ' ' + h[0] + ' ' + h[1] + ')"/>';
    });
    s += '<ellipse cx="4" cy="-44" rx="6" ry="15" fill="' + C.cian + '" opacity=".8" transform="rotate(12 4 -44)"/></g>';
    return s;
  }

  function vidrio(x0, y0, x1, y1, h, extra) {
    // tramo de vidrio entre dos puntos del piso (recto en x o en y)
    return '<g ' + (extra || '') + '>' + poly([[x0, y0, 0], [x1, y1, 0], [x1, y1, h], [x0, y0, h]], 'fill="' + M.vidrio + '" stroke="' + M.vidrioBorde + '" stroke-width="1"') +
      '<polyline points="' + pts([[x0, y0, h], [x1, y1, h]]) + '" stroke="' + M.marco + '" stroke-width="3" fill="none"/>' +
      '<polyline points="' + pts([[x0, y0, 0.02], [x1, y1, 0.02]]) + '" stroke="' + M.marco + '" stroke-width="2.5" fill="none"/></g>';
  }

  // Tramos de vidrio de a una baldosa, para que el orden por profundidad no falle con muros largos.
  function tramos(agregar, x0, y0, x1, y1, h, puerta) {
    var largo = Math.abs(x1 - x0) + Math.abs(y1 - y0), n = Math.ceil(largo), dx = (x1 - x0) / largo, dy = (y1 - y0) / largo;
    for (var i = 0; i < n; i++) {
      var a = i, b = Math.min(i + 1, largo);
      if (puerta) {
        if (b <= puerta[0] || a >= puerta[1]) { /* tramo completo */ } else {
          if (a < puerta[0]) agregar(0, 0, vidrio(x0 + dx * a, y0 + dy * a, x0 + dx * puerta[0], y0 + dy * puerta[0], h), x0 + dx * (a + puerta[0]) / 2, y0 + dy * (a + puerta[0]) / 2);
          if (b > puerta[1]) agregar(0, 0, vidrio(x0 + dx * puerta[1], y0 + dy * puerta[1], x0 + dx * b, y0 + dy * b, h), x0 + dx * (puerta[1] + b) / 2, y0 + dy * (puerta[1] + b) / 2);
          continue;
        }
      }
      agregar(0, 0, vidrio(x0 + dx * a, y0 + dy * a, x0 + dx * b, y0 + dy * b, h), x0 + dx * (a + b) / 2, y0 + dy * (a + b) / 2);
    }
    if (puerta) {
      // dintel sobre la puerta
      var pa = [x0 + dx * puerta[0], y0 + dy * puerta[0]], pb = [x0 + dx * puerta[1], y0 + dy * puerta[1]];
      agregar(0, 0, '<polyline points="' + pts([[pa[0], pa[1], h], [pb[0], pb[1], h]]) + '" stroke="' + M.marco + '" stroke-width="3" fill="none"/>' +
        poly([[pa[0], pa[1], h - 0.18], [pb[0], pb[1], h - 0.18], [pb[0], pb[1], h], [pa[0], pa[1], h]], 'fill="' + M.vidrio + '" stroke="' + M.vidrioBorde + '" stroke-width="1"'), (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2);
    }
  }

  // Pantalla en un plano: marco, fondo y contenido en coordenadas locales (ancho × alto en centésimas).
  function pantallaY(xa, xb, y, zTop, zBot, contenido) {
    var w = (xb - xa) * 100, h = (zTop - zBot) * 100;
    return enPlano(planoY(xa, y, zTop), '<rect x="-4" y="-4" width="' + (w + 8) + '" height="' + (h + 8) + '" rx="4" fill="' + C.grafito + '"/>' +
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="' + M.pantalla + '"/>' + contenido(w, h));
  }
  function pantallaX(x, ya, yb, zTop, zBot, contenido) {
    // plano x = x, se dibuja de ya (izquierda en pantalla) a yb (derecha), con ya > yb
    var w = (ya - yb) * 100, h = (zTop - zBot) * 100;
    return enPlano(planoX(x, ya, zTop), '<rect x="-4" y="-4" width="' + (w + 8) + '" height="' + (h + 8) + '" rx="4" fill="' + C.grafito + '"/>' +
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="' + M.pantalla + '"/>' + contenido(w, h));
  }

  /* ─────────── Contenidos de pantallas ─────────── */
  var PANTALLAS = {
    nuhome: function (w, h) {
      var s = texto(10, 22, 'NU HOME 360', 15, C.niebla, 600, 'letter-spacing="2"');
      var barras = [[0, .45], [.2, .5], [.35, .4], [.55, .35], [.6, .38]];
      barras.forEach(function (b, i) {
        s += '<rect x="' + (14 + b[0] * (w - 28)) + '" y="' + (34 + i * 15) + '" width="' + (b[1] * (w - 28)) + '" height="9" rx="3" fill="' + (i === 2 ? C.cian : C.a300) + '" opacity="' + (i === 2 ? 1 : .8) + '"/>';
      });
      return s + '<path d="M' + (w * .62) + ' 30 V' + (h - 6) + '" stroke="' + C.c300 + '" stroke-width="2" stroke-dasharray="4 4"/>';
    },
    fundos: function (w, h) {
      var s = texto(10, 22, 'FUNDOS 360', 15, '#C8A165', 600, 'letter-spacing="2"'), col = (w - 20) / 4;
      for (var c = 0; c < 4; c++) {
        s += '<rect x="' + (10 + c * col) + '" y="30" width="' + (col - 6) + '" height="' + (h - 38) + '" rx="3" fill="#123754"/>';
        for (var k = 0; k < 3 - (c % 2); k++) s += '<rect x="' + (14 + c * col) + '" y="' + (36 + k * 18) + '" width="' + (col - 14) + '" height="12" rx="2" fill="' + (c === 2 && k === 0 ? '#C8A165' : C.a300) + '" opacity=".85"/>';
      }
      return s;
    },
    haru: function (w, h) {
      var s = texto(10, 22, 'HARU 360', 15, C.niebla, 600, 'letter-spacing="2"');
      for (var i = 0; i < 4; i++) {
        s += '<rect x="12" y="' + (32 + i * 16) + '" width="12" height="11" rx="2" fill="' + (i % 2 ? '#7FA35B' : C.a300) + '"/>' +
          '<rect x="30" y="' + (34 + i * 16) + '" width="' + (w * .42) + '" height="6" rx="3" fill="' + C.a300 + '" opacity=".75"/>';
      }
      s += '<rect x="' + (w - 62) + '" y="34" width="50" height="50" rx="3" fill="' + C.niebla + '"/>';
      var q = [[0, 0], [1, 2], [2, 1], [3, 3], [0, 3], [3, 0], [1, 1], [2, 3]];
      q.forEach(function (c) { s += '<rect x="' + (w - 58 + c[0] * 11) + '" y="' + (38 + c[1] * 11) + '" width="9" height="9" fill="' + C.a900 + '"/>'; });
      return s;
    },
    eleven: function (w, h) {
      var s = mono(10, h - 12, '11', 46, '#F2C14E'), cw = (w - 80) / 7;
      for (var c = 0; c < 7; c++) for (var r = 0; r < 4; r++) {
        var on = (c * 3 + r * 5) % 4 === 0;
        s += '<rect x="' + (74 + c * cw) + '" y="' + (14 + r * 17) + '" width="' + (cw - 4) + '" height="12" rx="2" fill="' + (on ? '#F2C14E' : '#1D4468') + '"/>';
      }
      return s;
    },
    rumbo: function (w, h) {
      var cx = w * .3, cy = h * .55, R = Math.min(h * .38, 44), s = '';
      for (var k = 1; k <= 3; k++) {
        var pp = []; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i - Math.PI / 2; pp.push(r1(cx + Math.cos(a) * R * k / 3) + ',' + r1(cy + Math.sin(a) * R * k / 3)); }
        s += '<polygon points="' + pp.join(' ') + '" fill="none" stroke="#2A5A88" stroke-width="1.5"/>';
      }
      var val = [.9, .6, .8, .5, .75, .65], q = [];
      val.forEach(function (v, i) { var a = Math.PI / 3 * i - Math.PI / 2; q.push(r1(cx + Math.cos(a) * R * v) + ',' + r1(cy + Math.sin(a) * R * v)); });
      s += '<polygon points="' + q.join(' ') + '" fill="rgba(127,216,207,.35)" stroke="' + C.c300 + '" stroke-width="2"/>';
      for (var d = 0; d < 7; d++) s += '<circle cx="' + (w * .62 + d * 13) + '" cy="' + (h * .4) + '" r="4.5" fill="' + (d < 5 ? C.cian : '#2A5A88') + '"/>';
      return s + texto(w * .6, h * .72, 'RUMBO', 13, C.c300, 600, 'letter-spacing="2"');
    },
    datos: function (w, h) {
      var s = '', cols = 8, filas = 5, cw = (w - 20) / cols, ch = (h - 34) / filas;
      s += texto(10, 20, 'datos_limpios.csv', 13, C.c300, 500);
      for (var c = 0; c < cols; c++) for (var r = 0; r < filas; r++) {
        s += '<rect x="' + (10 + c * cw) + '" y="' + (28 + r * ch) + '" width="' + (cw - 3) + '" height="' + (ch - 3) + '" fill="#123754"/>';
      }
      [[1, 1], [4, 0], [6, 3], [2, 4], [5, 2], [7, 1]].forEach(function (p, i) {
        s += '<rect class="dato-luz" style="animation-delay:' + (i * .6).toFixed(1) + 's" x="' + (10 + p[0] * cw) + '" y="' + (28 + p[1] * ch) + '" width="' + (cw - 3) + '" height="' + (ch - 3) + '" fill="' + C.cian + '"/>';
      });
      return s;
    },
    diseno: function (w, h) {
      var s = '<rect x="14" y="12" width="' + (w * .22) + '" height="' + (h - 24) + '" rx="8" fill="none" stroke="' + C.niebla + '" stroke-width="2.4"/>';
      s += '<rect x="22" y="' + (h * .3) + '" width="' + (w * .22 - 16) + '" height="10" rx="3" fill="' + C.cian + '"/>';
      s += '<path class="traza" d="M' + (w * .34) + ' ' + (h * .7) + ' L' + (w * .46) + ' ' + (h * .45) + ' L' + (w * .58) + ' ' + (h * .55) + ' L' + (w * .72) + ' ' + (h * .25) + '" stroke="' + C.cian + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
      for (var g = 1; g < 6; g++) s += '<path d="M' + (w * .3 + g * w * .11) + ' 10 V' + (h - 10) + '" stroke="#2A5A88" stroke-width="1" opacity=".7"/>';
      [C.cian, C.niebla, C.a600, C.c300].forEach(function (c, i) { s += '<circle cx="' + (w * .86) + '" cy="' + (18 + i * 20) + '" r="7" fill="' + c + '"/>'; });
      return s;
    },
    codigo: function (w, h) {
      var s = '', lineas = [[0, .5], [1, .34], [1, .6], [2, .28], [2, .44], [1, .3], [0, .22], [1, .5]];
      lineas.forEach(function (l, i) {
        s += '<rect class="codigo-linea" style="animation-delay:' + (i * .35).toFixed(2) + 's" x="' + (10 + l[0] * 14) + '" y="' + (10 + i * ((h - 14) / lineas.length)) + '" width="' + (l[1] * (w - 20)) + '" height="6" rx="3" fill="' + (i % 3 === 1 ? C.cian : C.a300) + '"/>';
      });
      return s;
    },
    qa: function (w, h) {
      var s = '', dev = [[.04, .2, .34, .62], [.42, .28, .26, .5], [.72, .3, .14, .46], [.9, .4, .07, .32]];
      dev.forEach(function (d, i) {
        s += '<rect x="' + (d[0] * w) + '" y="' + (d[1] * h) + '" width="' + (d[2] * w) + '" height="' + (d[3] * h) + '" rx="3" fill="#123754" stroke="' + C.a300 + '" stroke-width="2"/>' +
          '<path class="qa-ok" style="animation-delay:' + (i * .8) + 's" d="M' + ((d[0] + d[2] * .3) * w) + ' ' + ((d[1] + d[3] * .5) * h) + ' l' + (d[2] * w * .15) + ' ' + (d[2] * w * .15) + ' l' + (d[2] * w * .3) + ' -' + (d[2] * w * .3) + '" stroke="' + C.cian + '" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      });
      return s;
    },
    despliegue: function (w, h) {
      var s = texto(8, 18, 'producción', 12, C.c300, 500);
      for (var i = 0; i < 3; i++) s += '<rect x="8" y="' + (28 + i * 14) + '" width="' + (w - 30) + '" height="7" rx="3" fill="' + C.a300 + '" opacity=".7"/><circle cx="' + (w - 12) + '" cy="' + (31.5 + i * 14) + '" r="4" fill="' + C.cian + '"/>';
      return s;
    }
  };

  /* ─────────── Construcción ─────────── */
  function construir(svg, opciones) {
    opciones = opciones || {};
    var animado = opciones.animado !== false;
    var NS = 'http://www.w3.org/2000/svg';
    var BUCKETS = (ANCHO + FONDO) * 2 + 8;
    var cubos = []; for (var i = 0; i < BUCKETS; i++) cubos.push('');
    var piso = '', muros = '', hits = '';

    function agregar(_a, _b, contenido, x, y) {
      var k = Math.max(0, Math.min(BUCKETS - 1, Math.floor((x + y) * 2)));
      cubos[k] += contenido;
    }
    function obj(x, y, contenido) { agregar(0, 0, contenido, x, y); }

    /* Piso y losa */
    piso += poly([[0, 0, 0], [ANCHO, 0, 0], [ANCHO, FONDO, 0], [0, FONDO, 0]], 'fill="' + M.piso + '"');
    var lineas = '';
    for (var gx = 1; gx < ANCHO; gx++) lineas += '<polyline points="' + pts([[gx, 0, 0], [gx, FONDO, 0]]) + '"/>';
    for (var gy = 1; gy < FONDO; gy++) lineas += '<polyline points="' + pts([[0, gy, 0], [ANCHO, gy, 0]]) + '"/>';
    piso += '<g stroke="' + M.pisoLinea + '" stroke-width="1" fill="none">' + lineas + '</g>';
    piso += poly([[0, FONDO, 0], [ANCHO, FONDO, 0], [ANCHO, FONDO, -0.4], [0, FONDO, -0.4]], 'fill="' + M.losaIzq + '"');
    piso += poly([[ANCHO, 0, 0], [ANCHO, FONDO, 0], [ANCHO, FONDO, -0.4], [ANCHO, 0, -0.4]], 'fill="' + M.losaDer + '"');
    piso += '<polyline points="' + pts([[0, FONDO, 0], [ANCHO, FONDO, 0], [ANCHO, 0, 0]]) + '" stroke="rgba(127,216,207,.45)" stroke-width="1.5" fill="none"/>';

    // Luz en el piso bajo cada estación
    [[8.8, 9.2, 2.2], [13.8, 9.2, 2.2], [8.8, 13.2, 2.2], [13.8, 13.2, 2.2], [21.4, 9.2, 2.4], [20.6, 16.8, 2.8], [2.7, 13.2, 2.2]].forEach(function (l) {
      var p = P(l[0], l[1], 0);
      piso += '<ellipse cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" rx="' + r1(l[2] * TW * 1.35) + '" ry="' + r1(l[2] * TH * 1.35) + '" fill="url(#luz-piso)"/>';
    });

    /* Alfombras de salas */
    function alfombra(x0, y0, x1, y1, color, borde) {
      piso += poly([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], 'fill="' + color + '"' + (borde ? ' stroke="' + borde + '" stroke-width="1.5"' : ''));
    }
    var proyectos = (window.OFICINA_DATOS && window.OFICINA_DATOS.proyectos) || [];
    var acento = {}; proyectos.forEach(function (p) { acento[p.id] = p.acento; });
    var SALAS = ['nuhome', 'fundos', 'haru', 'eleven', 'rumbo'];
    SALAS.forEach(function (id, i) { alfombra(4 + i * 4 + 0.12, 0.1, 8 + i * 4 - 0.12, 4.5, M.alfombra, acento[id] ? hexA(acento[id], .45) : null); });
    alfombra(0.1, 10.9, 5.3, 15.5, M.alfombra, 'rgba(23,195,178,.35)');
    alfombra(0.1, 15.7, 5.3, 19.9, M.alfombra2, 'rgba(23,195,178,.35)');
    alfombra(20.3, 17.7, 23.8, 19.8, '#17446F', 'rgba(23,195,178,.5)');
    piso += enPlano(planoZ(20.3, 17.7, 0), texto(70, 128, 'PASA', 62, 'rgba(242,244,247,.8)', 700, 'letter-spacing="10"'));
    // rosa de los vientos en Rumbo
    piso += enPlano(planoZ(20, 0, 0), '<circle cx="200" cy="300" r="70" fill="none" stroke="' + C.c300 + '" stroke-width="3" opacity=".6"/>' +
      '<path d="M200 214 L214 300 L200 386 L186 300 Z M114 300 L200 286 L286 300 L200 314 Z" fill="' + C.c300 + '" opacity=".45"/>');
    // colchoneta en Eleven
    alfombra(16.3, 2.9, 19.2, 4.3, '#0E2A47', 'rgba(242,193,78,.5)');

    /* Muros de fondo */
    // muro izquierdo (plano x = 0) y muro derecho (plano y = 0)
    muros += poly([[0, 0, 0], [0, FONDO, 0], [0, FONDO, ALTO_MURO], [0, 0, ALTO_MURO]], 'fill="' + M.muroX + '"');
    muros += poly([[0, 0, 0], [ANCHO, 0, 0], [ANCHO, 0, ALTO_MURO], [0, 0, ALTO_MURO]], 'fill="' + M.muroY + '"');
    muros += poly([[0, 0, 0], [0, FONDO, 0], [0, FONDO, .14], [0, 0, .14]], 'fill="' + M.zocalo + '"');
    muros += poly([[0, 0, 0], [ANCHO, 0, 0], [ANCHO, 0, .14], [0, 0, .14]], 'fill="' + M.zocalo + '"');
    muros += poly([[-0.3, -0.3, ALTO_MURO], [ANCHO, -0.3, ALTO_MURO], [ANCHO, 0, ALTO_MURO], [0, 0, ALTO_MURO], [0, FONDO, ALTO_MURO], [-0.3, FONDO, ALTO_MURO]], 'fill="' + M.muroTope + '"');
    muros += poly([[-0.3, FONDO, -0.4], [0, FONDO, -0.4], [0, FONDO, ALTO_MURO], [-0.3, FONDO, ALTO_MURO]], 'fill="#1E4A75"');
    muros += poly([[ANCHO, -0.3, -0.4], [ANCHO, 0, -0.4], [ANCHO, 0, ALTO_MURO], [ANCHO, -0.3, ALTO_MURO]], 'fill="#0E2A47"');

    // Ventanas altas con la cordillera de noche
    function cordillera(w, h, semilla) {
      var s = '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="url(#cielo)"/>';
      var pp = ['0,' + h], x = 0, k = semilla;
      while (x < w) {
        k = (k * 9301 + 49297) % 233280; var alto = 18 + (k / 233280) * 40;
        pp.push(r1(x + 22) + ',' + r1(h - alto)); x += 44 + (k % 30);
        pp.push(r1(x) + ',' + r1(h - 10 - (k % 14)));
      }
      pp.push(w + ',' + h);
      s += '<polygon points="' + pp.join(' ') + '" fill="#0B2340"/>';
      for (var e = 0; e < w / 90; e++) { k = (k * 9301 + 49297) % 233280; s += '<circle cx="' + r1((e * 90 + k % 80)) + '" cy="' + r1(6 + k % 20) + '" r="1.6" fill="' + C.niebla + '" opacity=".7"/>'; }
      for (var m = 60; m < w; m += 150) s += '<rect x="' + m + '" y="0" width="5" height="' + h + '" fill="' + M.zocalo + '"/>';
      return s + '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="none" stroke="' + M.zocalo + '" stroke-width="5"/>';
    }
    muros += enPlano(planoX(0, 19.6, 2.8), cordillera(1920, 66, 7));
    muros += enPlano(planoY(0.4, 0, 2.8), cordillera(2320, 66, 3) + '<circle cx="1760" cy="24" r="11" fill="' + C.niebla + '" opacity=".9"/><circle cx="1765" cy="20" r="10" fill="#10304F" opacity=".9"/>');

    /* ── Café (esquina del fondo) ── */
    obj(1.5, 0.4, caja(0.3, 0.05, 0, 3.4, 0.75, 0.95, { t: M.mesa, l: '#6B7A8C', r: '#5B6B7F' }));
    obj(2.8, 0.4, caja(2.35, 0.12, 0.95, 0.7, 0.45, 0.6, C.grafito) + (function () { var p = P(2.9, 0.57, 1.35); return '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="2.5" fill="' + C.cian + '"/>'; })());
    obj(1.4, 0.5, cilindro(1.2, 0.4, 0.95, 0.1, 0.18, { t: C.niebla, l: C.a300 }) + cilindro(1.55, 0.35, 0.95, 0.1, 0.18, { t: C.c300, l: C.c600 }));
    // reloj de pared con la hora de Chile
    muros += enPlano(planoY(1.0, 0, 2.0), '<circle cx="60" cy="42" r="36" fill="' + C.niebla + '" stroke="' + C.a800 + '" stroke-width="5"/>' +
      '<g id="reloj-horas"><line x1="60" y1="42" x2="60" y2="22" stroke="' + C.a800 + '" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g id="reloj-min"><line x1="60" y1="42" x2="60" y2="12" stroke="' + C.c700 + '" stroke-width="3" stroke-linecap="round"/></g><circle cx="60" cy="42" r="4" fill="' + C.a800 + '"/>');
    obj(1.7, 2.7, cilindro(1.7, 2.7, 0, 0.08, 0.72, { t: C.a300, l: C.a500 }) + cilindro(1.7, 2.7, 0.72, 0.55, 0.06, { t: M.mesa, l: M.mesaDer }));
    obj(1.0, 3.2, cilindro(1.0, 3.2, 0, 0.22, 0.48, { t: C.a600, l: C.a700 }));
    obj(2.5, 3.1, cilindro(2.5, 3.1, 0, 0.22, 0.48, { t: C.a600, l: C.a700 }));
    obj(0.6, 3.9, planta(0.6, 3.9, 1.25));
    muros += enPlano(planoY(0.5, 0, 1.55), '<rect x="0" y="0" width="160" height="26" rx="4" fill="' + C.a800 + '"/>' + texto(14, 19, 'CAFÉ', 16, C.niebla, 600, 'letter-spacing="4"'));

    /* ── Salas de proyecto ── */
    SALAS.forEach(function (id, i) {
      var x0 = 4 + i * 4, x1 = x0 + 4;
      muros += pantallaY(x0 + 0.55, x1 - 0.55, 0, 2.0, 0.85, PANTALLAS[id]);
      // tabique lateral izquierdo de cada sala
      tramos(agregar, x0, 0, x0, 4.6, ALTO_VIDRIO);
      // frente con puerta al centro
      tramos(agregar, x0, 4.6, x1, 4.6, ALTO_VIDRIO, [1.4, 2.6]);
      // placa sobre la puerta
      var ac = acento[id] || C.cian;
      var nombre = (proyectos.filter(function (p) { return p.id === id; })[0] || { nombre: id }).nombre.toUpperCase();
      obj(x0 + 2, 4.7, enPlano(planoY(x0 + 0.45, 4.62, 2.55), '<rect x="0" y="0" width="310" height="34" rx="5" fill="' + C.a800 + '" stroke="' + ac + '" stroke-width="2"/>' +
        '<rect x="10" y="10" width="14" height="14" rx="3" fill="' + ac + '"/>' + texto(34, 24, nombre, 17, C.niebla, 600, 'letter-spacing="2.5"')));
    });

    // Nu Home: mesa con maqueta de casa modular y un módulo que baja
    obj(5.7, 2.2, caja(4.8, 1.6, 0, 1.9, 1.2, 0.75, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer }));
    obj(5.6, 2.2, caja(5.0, 1.8, 0.75, 0.8, 0.8, 0.42, { t: '#EDF1F5', l: C.a200, r: C.a300 }) + caja(4.95, 1.75, 1.17, 0.9, 0.9, 0.06, C.a700) +
      enPlano(planoY(5.15, 2.6, 1.08), '<rect x="0" y="0" width="30" height="20" fill="' + C.cian + '" opacity=".8"/>'));
    obj(6.4, 2.3, '<g class="modulo-baja">' + caja(5.9, 1.9, 1.0, 0.6, 0.6, 0.3, { t: C.niebla, l: C.a200, r: C.a300 }) + '</g>');
    obj(7.4, 4.0, planta(7.4, 4.0, 1));

    // Fundos: maqueta del terreno con parcelas
    obj(10, 2.3, caja(8.7, 1.4, 0, 2.6, 1.8, 0.7, { t: '#1D4468', l: '#123754', r: '#0E2A47' }) +
      enPlano(planoZ(8.7, 1.4, 0.7), (function () {
        var s = '';
        for (var c = 0; c < 4; c++) for (var r = 0; r < 3; r++) s += '<rect x="' + (12 + c * 60) + '" y="' + (12 + r * 52) + '" width="54" height="46" fill="' + ((c === 2 && r === 1) ? C.cian : (c + r) % 2 ? '#2A5A88' : '#35679A') + '" opacity=".95"/>';
        return s + '<path d="M0 118 C80 110 160 124 260 104" stroke="#C8A165" stroke-width="5" fill="none"/>';
      })()));
    [[9.0, 1.6], [9.4, 3.0], [11.0, 1.6], [10.4, 3.0]].forEach(function (a) {
      var p = P(a[0], a[1], 0.7);
      obj(a[0], a[1] + .01, '<path d="M' + r1(p[0]) + ' ' + r1(p[1] - 22) + ' l7 20 h-14 Z" fill="' + C.c600 + '"/>');
    });
    obj(11.5, 4.0, planta(11.5, 4.0, .9));

    // Haru: barra de sushi, faroles y pisos
    obj(14, 1.55, caja(12.6, 1.15, 0, 2.8, 0.75, 0.95, { t: '#C4D2E0', l: '#17446F', r: '#0E2A47' }));
    [12.95, 13.75, 14.55].forEach(function (x) {
      obj(x + .2, 1.5, cilindro(x + .2, 1.5, 0.95, 0.2, 0.03, { t: C.niebla, l: C.a300 }) + (function () {
        var p = P(x + .2, 1.5, 0.99);
        return '<rect x="' + r1(p[0] - 7) + '" y="' + r1(p[1] - 6) + '" width="6" height="6" rx="1.5" fill="' + C.niebla + '" stroke="' + C.a900 + '" stroke-width="1.5"/><rect x="' + r1(p[0] + 1) + '" y="' + r1(p[1] - 6) + '" width="6" height="6" rx="1.5" fill="#7FA35B" stroke="' + C.a900 + '" stroke-width="1.5"/>';
      })());
    });
    [13.0, 14.0, 15.0].forEach(function (x) { obj(x, 2.35, cilindro(x, 2.35, 0, 0.18, 0.6, { t: C.a600, l: C.a700 })); });
    (function () {
      var p = P(15.3, 3.2, 1.9);
      obj(15.3, 3.2, '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1] - 40) + '" x2="' + r1(p[0]) + '" y2="' + r1(p[1] - 14) + '" stroke="' + C.a900 + '" stroke-width="2"/>' +
        '<ellipse class="farol" cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" rx="12" ry="16" fill="' + C.niebla + '"/>' +
        '<rect x="' + r1(p[0] - 12) + '" y="' + r1(p[1] - 3) + '" width="24" height="5" fill="#7FA35B"/>' +
        '<rect x="' + r1(p[0] - 7) + '" y="' + r1(p[1] - 19) + '" width="14" height="4" rx="1" fill="' + C.a900 + '"/><rect x="' + r1(p[0] - 7) + '" y="' + r1(p[1] + 15) + '" width="14" height="4" rx="1" fill="' + C.a900 + '"/>');
    })();

    // Eleven: saco de box y rack de mancuernas
    (function () {
      var top = P(17.1, 2.2, 2.2);
      obj(17.1, 2.2, '<line x1="' + r1(top[0]) + '" y1="' + r1(top[1] - 30) + '" x2="' + r1(top[0]) + '" y2="' + r1(top[1]) + '" stroke="' + C.a300 + '" stroke-width="2"/>' +
        '<g class="saco">' + cilindro(17.1, 2.2, 0.6, 0.32, 1.55, { t: '#22303F', l: C.grafito }) +
        (function () { var q = P(17.1, 2.2, 1.35), rx = r1(0.32 * TW * Math.SQRT2); return '<rect x="' + r1(q[0] - rx) + '" y="' + r1(q[1] - 4) + '" width="' + r1(rx * 2) + '" height="8" fill="#F2C14E"/>'; })() + '</g>');
    })();
    obj(19, 1.3, caja(18.2, 0.95, 0, 1.5, 0.6, 0.62, { t: C.a600, l: C.a700, r: C.a800 }));
    [18.45, 18.85, 19.25].forEach(function (x) {
      var p = P(x + .1, 1.25, 0.66);
      obj(x + .1, 1.26, '<rect x="' + r1(p[0] - 9) + '" y="' + r1(p[1] - 5) + '" width="18" height="4" rx="2" fill="' + C.a300 + '"/><rect x="' + r1(p[0] - 11) + '" y="' + r1(p[1] - 8) + '" width="5" height="10" rx="2" fill="' + C.grafito + '"/><rect x="' + r1(p[0] + 6) + '" y="' + r1(p[1] - 8) + '" width="5" height="10" rx="2" fill="' + C.grafito + '"/>');
    });

    // Rumbo: sillón, lámpara y mesita
    obj(21.6, 2.8, caja(21.0, 2.3, 0, 1.3, 1.0, 0.42, { t: C.a600, l: C.a700, r: C.a800 }) + caja(21.0, 2.3, 0.42, 1.3, 0.28, 0.55, { t: '#3F72A6', l: C.a700, r: C.a800 }) +
      caja(21.0, 2.3, 0.42, 0.22, 1.0, 0.28, { t: '#3F72A6', l: C.a700, r: C.a800 }) + caja(22.08, 2.3, 0.42, 0.22, 1.0, 0.28, { t: '#3F72A6', l: C.a700, r: C.a800 }));
    (function () {
      var b = P(23.3, 1.1, 0), t = P(23.3, 1.1, 1.9);
      obj(23.3, 1.1, '<line x1="' + r1(b[0]) + '" y1="' + r1(b[1]) + '" x2="' + r1(t[0]) + '" y2="' + r1(t[1]) + '" stroke="' + C.a300 + '" stroke-width="2.5"/>' +
        '<circle cx="' + r1(t[0]) + '" cy="' + r1(t[1] + 8) + '" r="26" fill="url(#halo-cian)"/>' +
        '<path d="M' + r1(t[0] - 14) + ' ' + r1(t[1] + 6) + ' L' + r1(t[0] - 8) + ' ' + r1(t[1] - 10) + ' H' + r1(t[0] + 8) + ' L' + r1(t[0] + 14) + ' ' + r1(t[1] + 6) + ' Z" fill="' + C.c300 + '"/>');
    })();
    obj(22.9, 3.6, cilindro(22.9, 3.6, 0, 0.3, 0.5, { t: M.mesa, l: M.mesaDer }) + (function () { var p = P(22.9, 3.6, 0.52); return '<rect x="' + r1(p[0] - 5) + '" y="' + r1(p[1] - 12) + '" width="10" height="16" rx="2" fill="' + C.grafito + '"/><rect x="' + r1(p[0] - 3.5) + '" y="' + r1(p[1] - 10) + '" width="7" height="11" rx="1" fill="' + C.cian + '"/>'; })());

    /* ── Estantería del núcleo (muro izquierdo) ── */
    [[4.9, 6.7], [6.8, 8.6], [8.7, 10.5]].forEach(function (u, k) {
      obj(0.4, (u[0] + u[1]) / 2, caja(0.05, u[0], 0, 0.7, u[1] - u[0] - 0.08, 2.5, { t: '#2A5A88', l: '#17446F', r: '#0E2A47' }) +
        enPlano(planoX(0.75, u[1] - 0.08, 2.5), (function () {
          var w = (u[1] - u[0] - 0.08) * 100, s = '<rect x="0" y="0" width="' + w + '" height="250" fill="#0B2440"/>';
          for (var e = 1; e < 4; e++) s += '<rect x="0" y="' + (e * 62 - 6) + '" width="' + w + '" height="7" fill="#2A5A88"/>';
          var colores = [C.a300, C.c600, C.niebla, C.a600, C.c300, C.a200, C.cian, C.a500];
          for (var f = 0; f < 4; f++) {
            var x = 8, n = 0;
            while (x < w - 18 && n < 9) {
              var ancho = 10 + ((f * 7 + n * 5 + k * 3) % 3) * 4, altoL = 34 + ((f + n + k) % 3) * 6;
              if (k === 1 && f === 1 && n < 4) {
                s += '<rect x="' + x + '" y="' + (f * 62 + 50 - 44) + '" width="24" height="44" rx="2" fill="' + C.cian + '"/>' + mono(x + 12, f * 62 + 50 - 12, '0' + (n + 1), 11, C.a900, 'text-anchor="middle"');
                x += 28;
              } else {
                s += '<rect x="' + x + '" y="' + (f * 62 + 50 - altoL) + '" width="' + ancho + '" height="' + altoL + '" rx="1.5" fill="' + colores[(f * 3 + n + k) % colores.length] + '"/>';
                x += ancho + 3;
              }
              n++;
            }
          }
          return s;
        })()));
    });
    muros += enPlano(planoX(0.02, 10.4, 2.95), '<rect x="0" y="0" width="560" height="30" rx="5" fill="' + C.a800 + '"/>' + texto(16, 21, 'ESTANTERÍA DEL NÚCLEO', 16, C.c300, 600, 'letter-spacing="3"'));
    // escalera apoyada
    (function () {
      var a = P(1.35, 7.4, 0), b = P(0.8, 7.4, 2.5), c = P(1.35, 7.95, 0), d = P(0.8, 7.95, 2.5), s = '';
      s += '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" stroke="' + C.a300 + '" stroke-width="3"/>';
      s += '<line x1="' + r1(c[0]) + '" y1="' + r1(c[1]) + '" x2="' + r1(d[0]) + '" y2="' + r1(d[1]) + '" stroke="' + C.a300 + '" stroke-width="3"/>';
      for (var t = 0.15; t < 1; t += 0.17) s += '<line x1="' + r1(a[0] + (b[0] - a[0]) * t) + '" y1="' + r1(a[1] + (b[1] - a[1]) * t) + '" x2="' + r1(c[0] + (d[0] - c[0]) * t) + '" y2="' + r1(c[1] + (d[1] - c[1]) * t) + '" stroke="' + C.a300 + '" stroke-width="2"/>';
      obj(1.2, 7.7, s);
    })();
    // mesa de lectura con el Recetario abierto
    obj(3.3, 7.8, caja(2.4, 7.2, 0, 1.8, 1.2, 0.75, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer }) +
      enPlano(planoZ(2.8, 7.5, 0.76), '<path d="M0 0 L50 -6 L50 44 L0 50 Z" fill="' + C.niebla + '"/><path d="M50 -6 L100 0 L100 50 L50 44 Z" fill="#EDF1F5"/>' +
        '<path d="M8 12 L42 8 M8 22 L42 18 M58 10 L92 14 M58 20 L92 24" stroke="' + C.a300 + '" stroke-width="3"/>') +
      (function () { var p = P(3.9, 7.4, 0.75); return '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(p[0] + 4) + '" y2="' + r1(p[1] - 24) + '" stroke="' + C.a300 + '" stroke-width="2.5"/><circle cx="' + r1(p[0] + 4) + '" cy="' + r1(p[1] - 20) + '" r="18" fill="url(#halo-cian)"/><path d="M' + r1(p[0] - 6) + ' ' + r1(p[1] - 20) + ' l10 -10 l8 8 Z" fill="' + C.c300 + '"/>'; })());
    obj(4.3, 5.1, planta(4.3, 5.1, 1.1));

    /* ── Sala E1 ── */
    muros += pantallaX(0, 15.0, 11.4, 2.05, 0.85, function (w, h) {
      var s = '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="' + C.niebla + '"/>' + texto(12, 24, 'EL MOTOR', 15, C.a800, 700, 'letter-spacing="3"');
      s += '<line x1="18" y1="' + (h * .6) + '" x2="' + (w - 18) + '" y2="' + (h * .6) + '" stroke="' + C.a300 + '" stroke-width="3"/>';
      for (var f = 0; f < 10; f++) {
        var x = 18 + f * (w - 36) / 9;
        s += '<circle cx="' + x + '" cy="' + (h * .6) + '" r="' + (f === 1 ? 9 : 6) + '" fill="' + (f === 1 ? C.cian : f === 9 ? C.c600 : C.a600) + '"/>' + mono(x, h * .6 + 26, 'E' + f, 11, C.a700, 'text-anchor="middle"');
      }
      s += '<rect x="' + (w * .55) + '" y="12" width="44" height="30" fill="' + C.c300 + '"/><rect x="' + (w * .72) + '" y="16" width="44" height="30" fill="' + C.a150 + '"/>';
      return s;
    });
    obj(2.6, 13.2, caja(1.4, 12.3, 0, 2.4, 1.8, 0.75, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer }) +
      (function () { var p = P(2.2, 12.9, 0.76); return '<path d="M' + r1(p[0]) + ' ' + r1(p[1]) + ' l14 7 l14 -7 l-14 -7 Z" fill="' + C.a300 + '"/><path d="M' + r1(p[0] + 14) + ' ' + r1(p[1] - 7) + ' l14 -7 v-16 l-14 7 Z" fill="' + C.grafito + '"/>'; })() +
      cilindro(3.3, 13.6, 0.75, 0.08, 0.14, { t: C.niebla, l: C.a300 }));
    [[1.0, 12.8], [1.0, 13.7], [4.2, 12.8], [4.2, 13.7]].forEach(function (s) { obj(s[0], s[1], caja(s[0] - 0.22, s[1] - 0.22, 0, 0.44, 0.44, 0.45, { t: C.a600, l: C.a700, r: C.a800 })); });
    tramos(agregar, 0, 10.8, 5.4, 10.8, ALTO_VIDRIO);
    tramos(agregar, 5.4, 10.8, 5.4, 15.6, ALTO_VIDRIO, [1.8, 2.8]);
    tramos(agregar, 0, 15.6, 5.4, 15.6, ALTO_VIDRIO);
    obj(5.5, 13.0, enPlano(planoX(5.42, 14.1, 2.6), '<rect x="0" y="0" width="190" height="32" rx="5" fill="' + C.a800 + '" stroke="' + C.cian + '" stroke-width="2"/>' + texto(14, 22, 'SALA E1', 17, C.niebla, 600, 'letter-spacing="3"')));

    /* ── Oficina de los socios ── */
    obj(2.2, 17.1, caja(1.0, 16.6, 0, 2.4, 1.0, 0.75, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer }) +
      enPlano(planoY(1.3, 16.8, 1.25), '<rect x="0" y="0" width="70" height="45" rx="3" fill="' + C.grafito + '"/><rect x="4" y="4" width="62" height="37" fill="#123754"/>') +
      enPlano(planoY(2.35, 16.8, 1.25), '<rect x="0" y="0" width="70" height="45" rx="3" fill="' + C.grafito + '"/><rect x="4" y="4" width="62" height="37" fill="#123754"/>') +
      cilindro(2.1, 17.3, 0.75, 0.08, 0.14, { t: C.niebla, l: C.a300 }) + cilindro(2.45, 17.35, 0.75, 0.08, 0.14, { t: C.c300, l: C.c600 }));
    [[1.6, 16.15], [2.9, 16.15]].forEach(function (s) { obj(s[0], s[1], caja(s[0] - 0.25, s[1] - 0.25, 0, 0.5, 0.5, 0.45, { t: C.a600, l: C.a700, r: C.a800 }) + caja(s[0] - 0.25, s[1] - 0.25, 0.45, 0.5, 0.12, 0.55, { t: C.a600, l: C.a700, r: C.a800 })); });
    [[1.6, 18.4], [2.9, 18.4]].forEach(function (s) { obj(s[0], s[1], caja(s[0] - 0.22, s[1] - 0.22, 0, 0.44, 0.44, 0.45, { t: '#3F72A6', l: C.a700, r: C.a800 })); });
    muros += enPlano(planoX(0, 19.2, 2.0), '<rect x="0" y="0" width="120" height="80" fill="' + C.niebla + '"/><rect x="8" y="8" width="104" height="64" fill="' + C.a800 + '"/>' +
      '<path d="M20 58 L44 40 L64 46 L92 22" stroke="' + C.cian + '" stroke-width="4" fill="none" stroke-linecap="round"/>');
    obj(4.7, 19.4, planta(4.7, 19.4, 1.1));
    tramos(agregar, 5.4, 15.6, 5.4, 20, ALTO_VIDRIO, [1.6, 2.6]);
    obj(5.5, 17.6, enPlano(planoX(5.42, 18.5, 2.6), '<rect x="0" y="0" width="170" height="32" rx="5" fill="' + C.a800 + '" stroke="' + C.cian + '" stroke-width="2"/>' + texto(14, 22, 'SOCIOS', 17, C.niebla, 600, 'letter-spacing="3"')));

    /* ── Estaciones del equipo ── */
    function panel(xa, xb, y, contenido) {
      obj((xa + xb) / 2, y, caja(xa + 0.2, y - 0.08, 0, 0.12, 0.08, 0.4, C.a500) + caja(xb - 0.32, y - 0.08, 0, 0.12, 0.08, 0.4, C.a500) +
        caja(xa, y - 0.18, 0.4, xb - xa, 0.18, 1.8, { t: '#2A5A88', l: '#1D4468', r: '#123754' }) +
        pantallaY(xa + 0.12, xb - 0.12, y, 2.1, 0.52, contenido));
    }
    function escritorio(xa, ya, xb, yb) { obj((xa + xb) / 2, (ya + yb) / 2, caja(xa, ya, 0, xb - xa, yb - ya, 1.05, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer })); }
    panel(7.2, 10.2, 7.15, PANTALLAS.datos); escritorio(7.4, 7.55, 9.6, 8.35);
    panel(12.2, 15.2, 7.15, PANTALLAS.diseno); escritorio(12.4, 7.55, 14.6, 8.35);
    panel(7.2, 10.2, 11.15, PANTALLAS.codigo); escritorio(7.4, 11.55, 9.6, 12.35);
    panel(12.2, 15.2, 11.15, PANTALLAS.qa); escritorio(12.4, 11.55, 14.6, 12.35);
    // cosas sobre los escritorios
    function sobre(x, y, z, contenido) { var p = P(x, y, z); obj(x, y + 0.01, '<g transform="translate(' + r1(p[0]) + ' ' + r1(p[1]) + ')">' + contenido + '</g>'); }
    sobre(8.2, 7.95, 1.05, '<path d="M-14 0 l14 7 l14 -7 l-14 -7 Z" fill="' + C.a300 + '"/><path d="M0 -7 l14 -7 v-16 l-14 7 Z" fill="' + C.grafito + '"/><path d="M2 -9 l10 -5 v-11 l-10 5 Z" fill="' + C.c700 + '"/>');
    sobre(9.1, 7.9, 1.05, '<path d="M-10 0 l10 5 l10 -5 l-10 -5 Z" fill="' + C.niebla + '"/><path d="M-6 0 l10 5 l6 -3 l-10 -5 Z" fill="' + C.niebla + '" transform="translate(2 -3)"/>');
    sobre(13.2, 7.95, 1.05, '<path d="M-18 0 l18 9 l18 -9 l-18 -9 Z" fill="' + C.grafito + '"/><path d="M-12 0 l12 6 l12 -6 l-12 -6 Z" fill="#123754"/><path d="M-6 1 l6 -8" stroke="' + C.cian + '" stroke-width="2"/>');
    sobre(14.1, 7.9, 1.05, '<circle cx="-6" cy="0" r="4" fill="' + C.cian + '"/><circle cx="3" cy="-2" r="4" fill="' + C.niebla + '"/><circle cx="11" cy="1" r="4" fill="' + C.a600 + '"/>');
    sobre(8.4, 11.95, 1.05, '<path d="M-20 0 l20 10 l20 -10 l-20 -10 Z" fill="' + C.grafito + '"/><path d="M-15 0 l15 7.5 l15 -7.5 l-15 -7.5 Z" fill="#2B2B2E"/>');
    sobre(9.2, 11.8, 1.05, '<rect x="-5" y="-12" width="10" height="12" rx="2" fill="' + C.niebla + '"/><rect x="-5" y="-8" width="10" height="3" fill="' + C.cian + '"/>');
    sobre(13.0, 11.95, 1.05, '<rect x="-8" y="-20" width="16" height="20" rx="4" fill="rgba(127,216,207,.3)" stroke="' + C.c300 + '" stroke-width="1.5"/><rect x="-9" y="-23" width="18" height="4" rx="1.5" fill="' + C.a300 + '"/>' +
      '<circle class="bicho" cx="-3" cy="-8" r="1.8" fill="' + C.a900 + '"/><circle class="bicho bicho-2" cx="3" cy="-12" r="1.8" fill="' + C.a900 + '"/><circle cx="1" cy="-5" r="1.6" fill="' + C.a900 + '"/>');
    sobre(14.0, 11.9, 1.05, '<path d="M-10 0 l10 5 l10 -5 l-10 -5 Z" fill="' + C.niebla + '"/><path d="M-6 -1 l3 2 l5 -4" stroke="' + C.c700 + '" stroke-width="1.6" fill="none"/>');
    obj(11.2, 9.9, planta(11.2, 9.9, 1));
    obj(6.3, 5.6, planta(6.3, 5.6, 1.15));
    obj(16.5, 5.6, planta(16.5, 5.6, 1.05));

    /* ── Despliegue: tubo a producción ── */
    obj(19.7, 7.55, caja(19.2, 7.2, 0, 1.0, 0.7, 1.0, { t: C.a600, l: C.a700, r: C.a800 }) + enPlano(planoY(19.28, 7.9, 1.55), '<rect x="0" y="0" width="84" height="50" rx="3" fill="' + C.grafito + '"/><g transform="translate(4 4)">' + PANTALLAS.despliegue(76, 42) + '</g>'));
    piso += enPlano(planoZ(21.4, 9.2, 0), '<circle cx="0" cy="0" r="120" fill="rgba(23,195,178,.1)" stroke="' + C.cian + '" stroke-width="3" opacity=".8"/><circle class="anillo" cx="0" cy="0" r="80" fill="none" stroke="' + C.cian + '" stroke-width="3"/>');
    (function () {
      var r = 0.55, b = P(21.4, 9.2, 0), t = P(21.4, 9.2, 3.7), rx = r1(r * TW * Math.SQRT2), ry = r1(r * TH * Math.SQRT2);
      var s = '<path d="M' + r1(b[0] - rx) + ' ' + r1(b[1]) + ' A' + rx + ' ' + ry + ' 0 0 0 ' + r1(b[0] + rx) + ' ' + r1(b[1]) + ' V' + r1(t[1]) + ' H' + r1(b[0] - rx) + ' Z" fill="rgba(127,216,207,.1)"/>';
      s += '<g class="paquete' + (animado ? '' : ' quieto') + '" id="paquete"><g transform="translate(' + r1(b[0]) + ' ' + r1(b[1] - 20) + ')"><path d="M-12 -6 l12 -6 l12 6 l-12 6 Z" fill="' + C.niebla + '"/><path d="M-12 -6 v12 l12 6 v-12 Z" fill="' + C.a200 + '"/><path d="M12 -6 v12 l-12 6 v-12 Z" fill="' + C.a300 + '"/><path d="M-6 -9 l12 6 v12" stroke="' + C.cian + '" stroke-width="3" fill="none"/></g></g>';
      s += '<line x1="' + r1(b[0] - rx) + '" y1="' + r1(b[1]) + '" x2="' + r1(b[0] - rx) + '" y2="' + r1(t[1]) + '" stroke="' + C.c300 + '" stroke-width="2" opacity=".7"/>' +
        '<line x1="' + r1(b[0] + rx) + '" y1="' + r1(b[1]) + '" x2="' + r1(b[0] + rx) + '" y2="' + r1(t[1]) + '" stroke="' + C.c300 + '" stroke-width="2" opacity=".7"/>' +
        '<ellipse cx="' + r1(t[0]) + '" cy="' + r1(t[1]) + '" rx="' + rx + '" ry="' + ry + '" fill="rgba(127,216,207,.18)" stroke="' + C.c300 + '" stroke-width="2"/>' +
        '<path d="M' + r1(b[0] - rx) + ' ' + r1(b[1]) + ' A' + rx + ' ' + ry + ' 0 0 0 ' + r1(b[0] + rx) + ' ' + r1(b[1]) + '" stroke="' + C.c300 + '" stroke-width="2" fill="none"/>';
      for (var k = 1; k < 4; k++) { var q = P(21.4, 9.2, k * 0.9); s += '<ellipse cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + C.c300 + '" stroke-width="1" opacity=".35"/>'; }
      s += '<g transform="translate(' + r1(t[0]) + ' ' + r1(t[1] - 30) + ')"><rect x="-58" y="-14" width="116" height="24" rx="12" fill="' + C.a800 + '" stroke="' + C.cian + '" stroke-width="1.5"/>' +
        texto(0, 3, 'A PRODUCCIÓN', 10.5, C.c300, 600, 'text-anchor="middle" letter-spacing="1.5"') + '</g>';
      obj(21.4, 9.2, s);
    })();
    [[20.6, 11.4], [21.0, 11.9]].forEach(function (c) { obj(c[0], c[1], caja(c[0] - 0.25, c[1] - 0.25, 0, 0.5, 0.5, 0.45, { t: C.a150, l: C.a300, r: C.a400 }) + poly([[c[0] - 0.25, c[1], 0.451], [c[0] + 0.25, c[1], 0.451]], 'stroke="' + C.cian + '" stroke-width="3"')); });

    /* ── Muro del personal ── */
    (function () {
      // Un tramo por integrante, cada uno con su retrato: así el orden por profundidad no tapa ninguno.
      var ids = E.ids, xa = 6.8, y = 16.25;
      ids.forEach(function (id, k) {
        var x = xa + k, s = caja(x, y - 0.25, 0, 1, 0.25, 1.75, { t: '#2A5A88', l: '#1D4468', r: '#123754' });
        s += enPlano(planoY(x, y, 1.58), '<rect x="9" y="0" width="82" height="122" rx="6" fill="' + C.niebla + '"/>' +
          '<rect x="9" y="0" width="82" height="16" rx="6" fill="' + C.a800 + '"/><rect x="9" y="10" width="82" height="6" fill="' + C.a800 + '"/>' +
          '<g transform="translate(50 114) scale(.36)">' + E.svg(id).replace('class="pj ', 'class="pj pj-retrato ') + '</g>');
        if (k === ids.length - 1) {
          s += enPlano(planoY(xa + 0.15, y, 2.1), '<rect x="0" y="0" width="230" height="30" rx="5" fill="' + C.a800 + '" stroke="' + C.cian + '" stroke-width="2"/>' +
            texto(14, 21, 'EL PERSONAL', 16, C.c300, 600, 'letter-spacing="3"'));
        }
        obj(x + 0.5, y - 0.12, s);
      });
    })();

    /* ── Recepción ── */
    obj(20.6, 16.05, caja(18.6, 15.6, 0, 4.0, 0.9, 1.05, { t: M.mesa, l: '#17446F', r: '#0E2A47' }) +
      enPlano(planoY(18.6, 16.5, 0.8), '<rect x="0" y="0" width="400" height="8" fill="' + C.cian + '" opacity=".85"/>'));
    sobre(19.3, 15.95, 1.05, '<path d="M-6 0 a6 4 0 0 0 12 0 Z" fill="' + C.a300 + '"/><circle cx="0" cy="-4.5" r="5.5" fill="' + C.a200 + '"/><circle cx="0" cy="-10" r="1.8" fill="' + C.a300 + '"/>');
    sobre(21.9, 16.0, 1.05, '<path d="M-14 0 l14 7 l14 -7 l-14 -7 Z" fill="' + C.grafito + '"/><path d="M-10 0 l10 5 l10 -5 l-10 -5 Z" fill="' + C.c700 + '"/>');
    obj(22.35, 15.96, planta(22.35, 15.95, .55, 1.05));
    // tótem con el isotipo (sin deformar: mira de frente)
    (function () {
      var cx = 23.1, cy = 14.2;
      var s = cilindro(cx, cy, 0, 0.42, 2.7, { t: '#2A5A88', l: '#123754' });
      var p = P(cx, cy, 1.9);
      s += '<g transform="translate(' + r1(p[0] - 21) + ' ' + r1(p[1] - 30) + ') scale(.42)">' + E.isotipo + '</g>';
      s += '<text x="' + r1(p[0]) + '" y="' + r1(p[1] + 28) + '" text-anchor="middle" font-weight="700" font-size="12.5"><tspan font-family="Space Mono, monospace" fill="' + C.niebla + '" letter-spacing="-.7">Bi</tspan><tspan font-family="Space Grotesk, sans-serif" fill="' + C.cian + '">Plot</tspan></text>';
      obj(cx, cy, s);
    })();
    // sala de espera
    obj(16.4, 17.85, caja(15.2, 17.4, 0, 2.4, 0.9, 0.42, { t: C.a600, l: C.a700, r: C.a800 }) + caja(15.2, 17.4, 0.42, 2.4, 0.25, 0.55, { t: '#3F72A6', l: C.a700, r: C.a800 }) +
      caja(15.2, 17.4, 0.42, 0.22, 0.9, 0.25, { t: '#3F72A6', l: C.a700, r: C.a800 }) + caja(17.38, 17.4, 0.42, 0.22, 0.9, 0.25, { t: '#3F72A6', l: C.a700, r: C.a800 }));
    obj(16.4, 19.1, caja(15.7, 18.8, 0, 1.4, 0.6, 0.4, { t: M.mesa, l: M.mesaIzq, r: M.mesaDer }));
    obj(18.1, 19.4, planta(18.1, 19.4, 1.15));
    obj(14.6, 19.3, planta(14.6, 19.3, .95));
    obj(23.5, 12.6, planta(23.5, 12.6, 1.1));
    obj(6.1, 19.3, planta(6.1, 19.3, 1));

    /* ── Zonas interactivas ── */
    var zonas = [
      { id: 'recepcion', nombre: 'Recepción', caja: [18.0, 14.6, 24, 20, 2.6], foco: [20.8, 16.6, 1.0], zoom: 1.7 },
      { id: 'muro', nombre: 'Muro del personal', caja: [6.8, 15.8, 13.8, 16.5, 2.0], foco: [10.3, 16.2, 1.0], zoom: 1.9 },
      { id: 'sala-e1', nombre: 'Sala de diagnóstico', caja: [0, 10.8, 5.4, 15.6, 2.2], foco: [2.7, 13.2, 0.8], zoom: 1.9 },
      { id: 'estanteria', nombre: 'Estantería del núcleo', caja: [0, 4.7, 4.6, 10.6, 2.6], foco: [1.8, 7.7, 1.2], zoom: 1.8 },
      { id: 'socios', nombre: 'Oficina de los socios', caja: [0, 15.6, 5.4, 20, 2.2], foco: [2.7, 17.8, 0.8], zoom: 1.9 },
      { id: 'nuhome', nombre: 'Nu Home 360', caja: [4, 0, 8, 4.6, 2.3], foco: [6, 2.3, 1.1], zoom: 2.1 },
      { id: 'fundos', nombre: 'Fundos 360', caja: [8, 0, 12, 4.6, 2.3], foco: [10, 2.3, 1.1], zoom: 2.1 },
      { id: 'haru', nombre: 'Haru 360', caja: [12, 0, 16, 4.6, 2.3], foco: [14, 2.3, 1.1], zoom: 2.1 },
      { id: 'eleven', nombre: 'Eleven 360', caja: [16, 0, 20, 4.6, 2.3], foco: [18, 2.3, 1.1], zoom: 2.1 },
      { id: 'rumbo', nombre: 'Rumbo', caja: [20, 0, 24, 4.6, 2.3], foco: [22, 2.3, 1.1], zoom: 2.1 }
    ];
    zonas.forEach(function (z) {
      var b = z.caja;
      z.silueta = pts([[b[0], b[1], b[4]], [b[2], b[1], b[4]], [b[2], b[1], 0], [b[2], b[3], 0], [b[0], b[3], 0], [b[0], b[3], b[4]]]);
      z.suelo = pts([[b[0], b[1], 0], [b[2], b[1], 0], [b[2], b[3], 0], [b[0], b[3], 0]]);
      hits += '<polygon class="zona-hit" data-zona="' + z.id + '" points="' + z.silueta + '"/>';
    });

    /* ── Montaje del SVG ── */
    var defs = E.defs().replace('</defs>',
      '<radialGradient id="luz-piso"><stop offset="0" stop-color="#17C3B2" stop-opacity=".16"/><stop offset="1" stop-color="#17C3B2" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="halo-cian"><stop offset="0" stop-color="#17C3B2" stop-opacity=".45"/><stop offset="1" stop-color="#17C3B2" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081A2E"/><stop offset="1" stop-color="#1A4670"/></linearGradient>' +
      '</defs>');
    var html = defs + '<g class="capa-piso">' + piso + '</g><g class="capa-muros">' + muros + '</g><g class="capa-hit">' + hits + '</g><g class="capa-obj">';
    for (var c = 0; c < BUCKETS; c++) html += '<g data-p="' + c + '">' + cubos[c] + '</g>';
    html += '</g><g class="capa-resalte"></g>';
    svg.innerHTML = html;

    var capaObj = svg.querySelector('.capa-obj');
    function cubo(x, y) { var k = Math.max(0, Math.min(BUCKETS - 1, Math.floor((x + y + 0.3) * 2))); return capaObj.children[k]; }

    /* ── Actores ── */
    var POS = {
      lupe: [20.6, 15.1], celda: [10.4, 8.1], grilla: [15.4, 8.1], bucle: [10.45, 12.05],
      tamandua: [15.4, 12.05], faro: [20.0, 10.2], pepa: [1.95, 6.3]
    };
    var RUTAS = {
      lupe: [[20.6, 15.1, 9], [18.0, 15.1], [18.0, 17.0], [6.3, 17.0], [6.3, 13.1], [4.5, 13.1, 7], [6.3, 13.1], [6.3, 17.0], [18.0, 17.0], [18.0, 15.1]],
      tamandua: [[15.4, 12.05, 10], [16.0, 13.4], [11.2, 13.4, 3.5, 'toma'], [16.0, 13.4], [18.4, 11.6], [19.3, 11.55, 3.5, 'entrega'], [18.4, 11.6], [16.0, 13.4]],
      pepa: [[1.95, 6.3, 8], [2.0, 9.6], [6.6, 9.55], [10.7, 9.45, 3, 'recoge'], [6.6, 9.55], [2.0, 9.6]]
    };
    var actores = {};
    E.ids.forEach(function (id) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'actor');
      g.setAttribute('data-actor', id);
      g.innerHTML = '<g class="actor-dir"><g class="actor-anda">' + E.svg(id) + '</g></g>' +
        '<rect class="actor-hit" x="-80" y="-' + (E.alto[id] + 10) + '" width="160" height="' + (E.alto[id] + 20) + '" rx="30"/>';
      var a = { id: id, g: g, x: POS[id][0], y: POS[id][1], ruta: RUTAS[id] || null, i: 0, espera: 0, der: true, cubo: null };
      actores[id] = a;
      ubicar(a);
    });
    function ubicar(a) {
      var p = P(a.x, a.y, 0);
      a.g.setAttribute('transform', 'translate(' + r1(p[0]) + ' ' + r1(p[1]) + ') scale(' + ESCALA_ACTOR + ')');
      var k = cubo(a.x, a.y);
      if (k !== a.cubo) { k.appendChild(a.g); a.cubo = k; }
    }
    // Faro y Tamandúa miran hacia la izquierda de entrada donde conviene
    function mirar(a, der) { if (a.der === der) return; a.der = der; a.g.firstChild.setAttribute('transform', der ? '' : 'scale(-1 1)'); }
    mirar(actores.faro, true); mirar(actores.pepa, true);

    /* ── Animación: recorridos ── */
    var VEL = 1.25, corriendo = false, ultimo = 0, raf = 0;
    var eventos = { toma: function () {}, entrega: lanzar, recoge: function () {} };
    function lanzar() {
      var pq = svg.querySelector('#paquete'); if (!pq) return;
      pq.classList.remove('sube'); void pq.getBBox(); pq.classList.add('sube');
      var luz = actores.faro.g; luz.classList.add('destello'); setTimeout(function () { luz.classList.remove('destello'); }, 1600);
    }
    function paso(t) {
      if (!corriendo) return;
      var dt = Math.min(0.05, (t - (ultimo || t)) / 1000); ultimo = t;
      Object.keys(actores).forEach(function (id) {
        var a = actores[id]; if (!a.ruta) return;
        if (a.espera > 0) { a.espera -= dt; if (a.espera <= 0) a.g.classList.remove('parado'); return; }
        var sig = a.ruta[(a.i + 1) % a.ruta.length], dx = sig[0] - a.x, dy = sig[1] - a.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.02) {
          a.i = (a.i + 1) % a.ruta.length; a.x = sig[0]; a.y = sig[1];
          if (sig[2]) { a.espera = sig[2]; a.g.classList.remove('camina'); a.g.classList.add('parado'); if (sig[3] && eventos[sig[3]]) eventos[sig[3]](a); }
          ubicar(a); return;
        }
        var d = Math.min(dist, VEL * dt);
        a.x += dx / dist * d; a.y += dy / dist * d;
        mirar(a, (dx - dy) >= 0);
        a.g.classList.add('camina');
        ubicar(a);
      });
      raf = requestAnimationFrame(paso);
    }
    function iniciar() { if (corriendo) return; corriendo = true; ultimo = 0; raf = requestAnimationFrame(paso); }
    function detener() {
      corriendo = false; cancelAnimationFrame(raf);
      Object.keys(actores).forEach(function (id) { actores[id].g.classList.remove('camina'); });
    }
    // Ruta: cada actor parte en su primer punto con su espera
    Object.keys(actores).forEach(function (id) { var a = actores[id]; if (a.ruta) a.espera = (a.ruta[0][2] || 0) * (0.3 + Math.random() * 0.5); });
    var lanzador = setInterval(function () { if (corriendo) lanzar(); }, 14000);

    // Reloj con la hora de Chile
    function reloj() {
      var h = 10, m = 10;
      try {
        var partes = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
        partes.forEach(function (p) { if (p.type === 'hour') h = +p.value; if (p.type === 'minute') m = +p.value; });
      } catch (e) { /* sin Intl: queda en 10:10 */ }
      var hh = svg.querySelector('#reloj-horas'), mm = svg.querySelector('#reloj-min');
      if (hh) hh.setAttribute('transform', 'rotate(' + ((h % 12) * 30 + m / 2) + ' 60 42)');
      if (mm) mm.setAttribute('transform', 'rotate(' + (m * 6) + ' 60 42)');
    }
    reloj(); var relojInt = setInterval(reloj, 30000);

    var limites = { x0: -680, y0: -150, x1: 800, y1: 735 };
    svg.setAttribute('viewBox', [limites.x0, limites.y0, limites.x1 - limites.x0, limites.y1 - limites.y0].join(' '));

    return {
      zonas: zonas, actores: actores, limites: limites, P: P, iniciar: iniciar, detener: detener, lanzar: lanzar,
      destruir: function () { detener(); clearInterval(lanzador); clearInterval(relojInt); },
      corriendo: function () { return corriendo; }
    };
  }

  function hexA(hex, a) { var c = hex2rgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  window.Escena = { construir: construir, P: P, ESCALA_ACTOR: ESCALA_ACTOR };
})();
