/*
 * Oficina BiPlot · elenco
 * Dibuja a cada integrante del personal en SVG. Coordenadas locales: pies en (0, 0), cuerpo hacia y negativo,
 * unos 200 a 250 de alto. La escena los usa a ~0,3 y el kit de Instagram a ~3: todo son formas planas.
 * Paleta: sólo tintas de marca (04-marca/tokens.css). Coral no aparece: es del botón "Agenda tu diagnóstico".
 *
 * Elenco.svg(id)          → contenido <g> del personaje (sin <svg>), con clases para animar (oficina.css)
 * Elenco.defs()           → <defs> compartidos (una vez por documento)
 * Elenco.placaTarjeta(p)  → credencial grande para fichas y paneles
 */
(function () {
  'use strict';

  var C = {
    niebla: '#F2F4F7', blanco: '#FFFFFF', grafito: '#1C1C1E',
    a900: '#091D33', a800: '#0E2A47', a700: '#17446F', a600: '#35679A', a500: '#5B6B7F',
    a400: '#6B7A8C', a300: '#B9C8D8', a200: '#C4D2E0', a150: '#D5E2EE', a50: '#EDF1F5',
    cian: '#17C3B2', c700: '#0A8A7E', c600: '#168A86', c300: '#7FD8CF', vidrio: '#DDF4F1'
  };

  function f(n) { return Math.round(n * 10) / 10; }

  function ojo(cx, cy, rx, ry, r, dx, dy, extra) {
    dx = dx || 0; dy = dy || 0;
    return '<g class="pj-ojo">' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + C.niebla + '"/>' +
      '<circle cx="' + f(cx + dx) + '" cy="' + f(cy + dy) + '" r="' + r + '" fill="' + C.a900 + '"/>' +
      '<circle cx="' + f(cx + dx - r * 0.35) + '" cy="' + f(cy + dy - r * 0.38) + '" r="' + f(r * 0.34) + '" fill="' + C.blanco + '"/>' +
      (extra || '') + '</g>';
  }

  // Credencial chica que cuelga de un cordón cian (o va prendida si no hay cuello).
  function placa(x, y, codigo, cordon) {
    var s = '<g class="pj-placa">';
    if (cordon) {
      s += '<path d="M' + cordon[0] + ' ' + cordon[1] + ' L' + (x - 5) + ' ' + (y + 1) + ' M' + cordon[2] + ' ' + cordon[3] + ' L' + (x + 5) + ' ' + (y + 1) +
        '" stroke="' + C.cian + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="8" height="6" rx="1.5" fill="' + C.a300 + '"/>';
    }
    s += '<rect x="' + (x - 11) + '" y="' + y + '" width="22" height="28" rx="3.5" fill="' + C.niebla + '" stroke="' + C.a800 + '" stroke-width="1.2"/>' +
      '<path d="M' + (x - 11) + ' ' + (y + 8) + ' V' + (y + 3.5) + ' a3.5 3.5 0 0 1 3.5 -3.5 H' + (x + 7.5) + ' a3.5 3.5 0 0 1 3.5 3.5 V' + (y + 8) + ' Z" fill="' + C.a800 + '"/>' +
      '<circle cx="' + (x + 6) + '" cy="' + (y + 4) + '" r="1.7" fill="' + C.cian + '"/>' +
      '<text x="' + x + '" y="' + (y + 22) + '" text-anchor="middle" font-family="Space Mono, ui-monospace, monospace" font-weight="700" font-size="9" fill="' + C.a800 + '">' + codigo + '</text>' +
      '</g>';
    return s;
  }

  function sombra(rx) {
    return '<ellipse class="pj-sombra" cx="0" cy="0" rx="' + rx + '" ry="' + f(rx * 0.22) + '" fill="' + C.a900 + '" opacity=".55"/>';
  }

  // Brazo con borde: un trazo oscuro debajo y el color encima.
  function brazo(d, color, borde, ancho) {
    return '<path d="' + d + '" stroke="' + borde + '" stroke-width="' + (ancho + 4) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + d + '" stroke="' + color + '" stroke-width="' + ancho + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  var DIBUJOS = {
    /* Lupe · Diagnóstico: criatura de un ojo que es una lupa. */
    lupe: function () {
      return sombra(56) +
        // piernas
        '<rect x="-31" y="-34" width="19" height="30" rx="8" fill="' + C.a700 + '"/>' +
        '<rect x="12" y="-34" width="19" height="30" rx="8" fill="' + C.a700 + '"/>' +
        '<ellipse cx="-22" cy="-5" rx="17" ry="7" fill="' + C.a800 + '"/><ellipse cx="22" cy="-5" rx="17" ry="7" fill="' + C.a800 + '"/>' +
        '<g class="pj-cuerpo">' +
          // brazo izquierdo con portapapeles
          brazo('M-60 -96 Q-78 -82 -80 -64', C.niebla, C.a300, 9) +
          '<g class="lupe-tabla"><rect x="-108" y="-92" width="38" height="48" rx="5" fill="' + C.a600 + '"/>' +
          '<rect x="-103" y="-85" width="28" height="35" rx="2" fill="' + C.niebla + '"/>' +
          '<path d="M-99 -76 H-80 M-99 -68 H-84 M-99 -60 H-82" stroke="' + C.a300 + '" stroke-width="2.6" stroke-linecap="round"/>' +
          '<path d="M-99 -52 l3 3 l6 -7" stroke="' + C.c700 + '" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<rect x="-96" y="-97" width="14" height="8" rx="2.5" fill="' + C.a800 + '"/></g>' +
          '<circle cx="-78" cy="-64" r="7.5" fill="' + C.niebla + '" stroke="' + C.a300 + '" stroke-width="2"/>' +
          // cuerpo huevo
          '<path d="M0 -202 C50 -202 72 -152 72 -104 C72 -52 44 -24 0 -24 C-44 -24 -72 -52 -72 -104 C-72 -152 -50 -202 0 -202 Z" fill="' + C.niebla + '"/>' +
          '<path d="M30 -194 C60 -178 72 -142 72 -104 C72 -52 44 -24 0 -24 C30 -34 54 -62 56 -104 C58 -144 50 -174 30 -194 Z" fill="' + C.a200 + '" opacity=".9"/>' +
          // ceja curiosa
          '<path class="lupe-ceja" d="M-26 -181 Q0 -196 26 -183" stroke="' + C.a700 + '" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
          // lupa-ojo
          '<circle cx="0" cy="-128" r="39" fill="' + C.vidrio + '"/>' +
          '<g class="pj-ojo"><circle cx="0" cy="-126" r="18" fill="' + C.a700 + '"/><circle cx="2" cy="-125" r="9.5" fill="' + C.a900 + '"/>' +
          '<circle cx="-5" cy="-132" r="4.2" fill="' + C.blanco + '"/></g>' +
          '<circle cx="0" cy="-128" r="39" fill="none" stroke="' + C.cian + '" stroke-width="8"/>' +
          '<path class="lupe-brillo" d="M-24 -150 A31 31 0 0 1 -8 -160" stroke="' + C.blanco + '" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".85"/>' +
          // boca y humita
          '<path d="M-11 -78 Q0 -70 11 -78" stroke="' + C.a700 + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<path d="M0 -56 L-19 -66 L-19 -46 Z M0 -56 L19 -66 L19 -46 Z" fill="' + C.a700 + '"/><circle cx="0" cy="-56" r="5.5" fill="' + C.a800 + '"/>' +
          placa(34, -92, 'E1') +
          // brazo derecho: la mano que pregunta
          '<g class="lupe-mano">' + brazo('M62 -100 Q82 -108 88 -128', C.niebla, C.a300, 9) +
          '<rect x="84" y="-160" width="8" height="22" rx="4" fill="' + C.niebla + '" stroke="' + C.a300 + '" stroke-width="2"/>' +
          '<circle cx="88" cy="-132" r="8.5" fill="' + C.niebla + '" stroke="' + C.a300 + '" stroke-width="2"/></g>' +
        '</g>';
    },

    /* Celda · Datos: un cubo con cuerpo de planilla. */
    celda: function () {
      var s = sombra(62) +
        '<rect x="-42" y="-38" width="17" height="32" rx="6" fill="' + C.a900 + '"/><rect x="25" y="-38" width="17" height="32" rx="6" fill="' + C.a900 + '"/>' +
        '<ellipse cx="-33" cy="-6" rx="15" ry="6.5" fill="' + C.a900 + '"/><ellipse cx="33" cy="-6" rx="15" ry="6.5" fill="' + C.a900 + '"/>' +
        '<g class="pj-cuerpo">' +
        // brazo izquierdo con plumero
        '<g class="celda-plumero">' + brazo('M-58 -92 Q-80 -86 -88 -70', C.a600, C.a800, 8) +
        '<path d="M-88 -70 L-104 -124" stroke="' + C.a300 + '" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="-107" cy="-134" rx="9" ry="14" fill="' + C.c300 + '" transform="rotate(-20 -107 -134)"/>' +
        '<ellipse cx="-98" cy="-138" rx="7" ry="12" fill="' + C.niebla + '" transform="rotate(12 -98 -138)"/>' +
        '<ellipse cx="-114" cy="-128" rx="6" ry="11" fill="' + C.a150 + '" transform="rotate(-44 -114 -128)"/>' +
        '<circle cx="-88" cy="-70" r="7" fill="' + C.a600 + '"/></g>' +
        // cubo
        '<path d="M-58 -152 L58 -152 L80 -168 L-36 -168 Z" fill="' + C.a600 + '"/>' +
        '<path d="M58 -152 L80 -168 L80 -52 L58 -36 Z" fill="' + C.a800 + '"/>' +
        '<rect x="-58" y="-152" width="116" height="116" fill="' + C.a700 + '"/>';
      // grilla 4×4 y celdas que se encienden
      var luces = [[0, 0], [3, 1], [2, 3], [0, 2], [3, 3], [2, 0]];
      luces.forEach(function (c, i) {
        s += '<rect class="celda-luz" style="animation-delay:' + (i * 0.55).toFixed(2) + 's" x="' + (-58 + c[0] * 29 + 3) + '" y="' + (-152 + c[1] * 29 + 3) + '" width="23" height="23" rx="3" fill="' + C.cian + '"/>';
      });
      s += '<path d="M-29 -152 V-36 M0 -152 V-36 M29 -152 V-36 M-58 -123 H58 M-58 -94 H58 M-58 -65 H58" stroke="' + C.a600 + '" stroke-width="2.2"/>' +
        '<rect x="-58" y="-152" width="116" height="116" fill="none" stroke="' + C.a600 + '" stroke-width="2.5"/>' +
        '<path d="M-52 -83 h10 M-52 -76 h16 M34 -140 h14 M34 -133 h8" stroke="' + C.c300 + '" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>' +
        // ojos en dos celdas
        '<g class="pj-ojo"><rect x="-27" y="-121" width="25" height="25" rx="7" fill="' + C.niebla + '"/><circle cx="-12" cy="-107" r="6.5" fill="' + C.a900 + '"/><circle cx="-14.5" cy="-109.5" r="2.2" fill="' + C.blanco + '"/>' +
        '<rect x="2" y="-121" width="25" height="25" rx="7" fill="' + C.niebla + '"/><circle cx="17" cy="-107" r="6.5" fill="' + C.a900 + '"/><circle cx="14.5" cy="-109.5" r="2.2" fill="' + C.blanco + '"/></g>' +
        // boca-cajón
        '<g class="celda-cajon"><rect x="-24" y="-60" width="48" height="19" rx="4" fill="' + C.a900 + '"/><rect x="-8" y="-54" width="16" height="4.5" rx="2" fill="' + C.a300 + '"/></g>' +
        placa(43, -91, 'E3') +
        // cursor de planilla sobre la cabeza
        '<rect class="celda-cursor" x="15" y="-190" width="6" height="22" rx="1.5" fill="' + C.cian + '"/>' +
        // brazo derecho con planilla
        brazo('M80 -92 Q98 -84 104 -66', C.a600, C.a800, 8) +
        '<rect x="96" y="-92" width="34" height="42" rx="3" fill="' + C.niebla + '" transform="rotate(8 113 -71)"/>' +
        '<path d="M100 -80 H127 M100 -70 H127 M100 -60 H127 M109 -90 V-52 M118 -90 V-52" stroke="' + C.a300 + '" stroke-width="1.6" transform="rotate(8 113 -71)"/>' +
        '<circle cx="104" cy="-66" r="7" fill="' + C.a600 + '"/>' +
        '</g>';
      return s;
    },

    /* Grilla · Diseño: grillo alto, lentes redondos y huincha de medir de bufanda. */
    grilla: function () {
      return sombra(46) +
        // piernas largas
        '<path d="M-12 -52 L-26 -28 L-18 -6" stroke="' + C.c700 + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M12 -52 L26 -28 L20 -6" stroke="' + C.c700 + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<ellipse cx="-22" cy="-5" rx="13" ry="5.5" fill="' + C.a800 + '"/><ellipse cx="24" cy="-5" rx="13" ry="5.5" fill="' + C.a800 + '"/>' +
        '<g class="pj-cuerpo">' +
        // alas plegadas
        '<ellipse cx="-30" cy="-92" rx="15" ry="48" fill="' + C.c300 + '" opacity=".75" transform="rotate(14 -30 -92)"/>' +
        // cuerpo
        '<ellipse cx="0" cy="-92" rx="31" ry="46" fill="' + C.cian + '"/>' +
        '<path d="M14 -134 C34 -120 34 -64 12 -48 C24 -70 26 -110 14 -134 Z" fill="' + C.c700 + '" opacity=".55"/>' +
        '<path d="M-22 -74 Q0 -66 22 -74 M-18 -60 Q0 -53 18 -60" stroke="' + C.c700 + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>' +
        // brazo izquierdo con lápiz
        '<g class="grilla-lapiz">' + brazo('M-26 -112 Q-46 -104 -54 -92', C.cian, C.c700, 6) +
        '<rect x="-66" y="-134" width="11" height="58" rx="2" fill="' + C.niebla + '"/>' +
        '<path d="M-66 -76 L-55 -76 L-60.5 -62 Z" fill="' + C.a300 + '"/><path d="M-62.5 -67 L-58.5 -67 L-60.5 -62 Z" fill="' + C.grafito + '"/>' +
        '<rect x="-66" y="-140" width="11" height="8" rx="2" fill="' + C.a300 + '"/>' +
        '<circle cx="-56" cy="-92" r="6.5" fill="' + C.cian + '" stroke="' + C.c700 + '" stroke-width="2"/></g>' +
        // brazo derecho con tarjeta de grilla
        brazo('M26 -112 Q44 -104 50 -94', C.cian, C.c700, 6) +
        '<rect x="44" y="-124" width="44" height="32" rx="3" fill="' + C.niebla + '" stroke="' + C.a300 + '" stroke-width="1.5"/>' +
        '<path d="M55 -124 V-92 M66 -124 V-92 M77 -124 V-92 M44 -113 H88 M44 -102 H88" stroke="' + C.c300 + '" stroke-width="1.4"/>' +
        '<rect x="56" y="-112" width="20" height="9" rx="2" fill="' + C.cian + '"/>' +
        '<circle cx="50" cy="-94" r="6.5" fill="' + C.cian + '" stroke="' + C.c700 + '" stroke-width="2"/>' +
        // huincha de medir
        '<rect x="-27" y="-140" width="54" height="11" rx="5.5" fill="' + C.niebla + '"/>' +
        '<path d="M-20 -140 v4 M-12 -140 v6 M-4 -140 v4 M4 -140 v6 M12 -140 v4 M20 -140 v6" stroke="' + C.a700 + '" stroke-width="1.6"/>' +
        '<rect x="12" y="-133" width="10" height="38" rx="3" fill="' + C.niebla + '"/>' +
        '<path d="M12 -124 h4 M12 -116 h6 M12 -108 h4 M12 -100 h6" stroke="' + C.a700 + '" stroke-width="1.6"/>' +
        placa(-8, -118, 'E2', [-14, -130, -2, -130]) +
        // cabeza
        '<g class="grilla-antena"><path d="M-10 -196 C-18 -222 -34 -232 -44 -240" stroke="' + C.c700 + '" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="-45" cy="-241" r="6" fill="' + C.niebla + '"/></g>' +
        '<g class="grilla-antena grilla-antena-2"><path d="M10 -196 C14 -224 24 -236 32 -246" stroke="' + C.c700 + '" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="33" cy="-247" r="6" fill="' + C.cian + '" stroke="' + C.niebla + '" stroke-width="2"/></g>' +
        '<circle cx="0" cy="-168" r="34" fill="' + C.cian + '"/>' +
        '<path d="M16 -198 C38 -186 40 -150 18 -138 C30 -154 30 -182 16 -198 Z" fill="' + C.c700 + '" opacity=".55"/>' +
        ojo(-13, -170, 10, 11, 5.2, 1.5, 1) + ojo(15, -170, 10, 11, 5.2, 1.5, 1) +
        '<circle cx="-13" cy="-170" r="14.5" fill="none" stroke="' + C.a900 + '" stroke-width="3.4"/><circle cx="15" cy="-170" r="14.5" fill="none" stroke="' + C.a900 + '" stroke-width="3.4"/>' +
        '<path d="M1.5 -171 Q1 -175 0.5 -171" stroke="' + C.a900 + '" stroke-width="3" fill="none"/>' +
        '<path d="M-9 -148 Q1 -141 11 -148" stroke="' + C.a900 + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
        '</g>';
    },

    /* Bucle · Desarrollo: pulpo con audífonos y taza. */
    bucle: function () {
      function tentaculo(d, cls) {
        return '<path class="' + (cls || '') + '" d="' + d + '" stroke="' + C.a600 + '" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      return sombra(60) +
        '<g class="pj-cuerpo">' +
        // tentáculos de apoyo
        tentaculo('M-26 -84 C-30 -48 -36 -24 -54 -14 C-64 -9 -66 -20 -58 -22') +
        tentaculo('M26 -84 C30 -48 36 -24 54 -14 C64 -9 66 -20 58 -22') +
        tentaculo('M-9 -84 C-12 -50 -16 -24 -8 -10 C-4 -3 4 -6 2 -12') +
        tentaculo('M9 -84 C12 -52 16 -28 22 -12 C25 -4 32 -8 29 -14') +
        '<path d="M-54 -14 m-3 -2 a2.6 2.6 0 1 0 0.1 0 M-40 -24 a2.6 2.6 0 1 0 0.1 0 M40 -24 a2.6 2.6 0 1 0 0.1 0" fill="' + C.a300 + '"/>' +
        // brazo izquierdo con taza
        '<g class="bucle-taza">' + tentaculo('M-44 -94 C-66 -92 -84 -96 -92 -112') +
        '<rect x="-112" y="-134" width="26" height="28" rx="5" fill="' + C.niebla + '"/>' +
        '<rect x="-112" y="-124" width="26" height="6" fill="' + C.cian + '"/>' +
        '<path d="M-86 -128 a8 8 0 0 1 0 14" stroke="' + C.niebla + '" stroke-width="4.5" fill="none"/>' +
        '<path class="bucle-vapor" d="M-104 -140 q-5 -8 0 -15 q5 -7 0 -14 M-94 -142 q-5 -8 0 -14" stroke="' + C.a200 + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>' +
        // brazo derecho que teclea
        '<g class="bucle-teclea">' + tentaculo('M44 -94 C66 -92 82 -84 92 -66 C96 -58 88 -54 84 -60') + '</g>' +
        // cabeza
        '<path d="M-64 -122 C-64 -182 -36 -214 0 -214 C36 -214 64 -182 64 -122 C64 -98 50 -86 36 -82 L-36 -82 C-50 -86 -64 -98 -64 -122 Z" fill="' + C.a600 + '"/>' +
        '<path d="M26 -208 C52 -194 64 -160 64 -122 C64 -98 50 -86 36 -82 L20 -82 C44 -96 52 -140 26 -208 Z" fill="' + C.a700 + '" opacity=".75"/>' +
        '<circle cx="-30" cy="-178" r="7" fill="' + C.a300 + '" opacity=".45"/><circle cx="-44" cy="-152" r="5" fill="' + C.a300 + '" opacity=".45"/>' +
        '<circle cx="22" cy="-192" r="5" fill="' + C.a300 + '" opacity=".45"/><circle cx="-12" cy="-196" r="3.6" fill="' + C.a300 + '" opacity=".45"/>' +
        // ojos concentrados
        ojo(-21, -130, 13, 14, 6.2, 2, 3, '<path d="M-34 -132 A13 14 0 0 1 -8 -132 Z" fill="' + C.a600 + '"/>') +
        ojo(21, -130, 13, 14, 6.2, 2, 3, '<path d="M8 -132 A13 14 0 0 1 34 -132 Z" fill="' + C.a600 + '"/>') +
        '<path d="M-7 -102 Q0 -97 7 -102" stroke="' + C.a900 + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        // audífonos
        '<path d="M-66 -130 C-68 -236 68 -236 66 -130" stroke="' + C.grafito + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<rect x="-80" y="-150" width="20" height="38" rx="9" fill="' + C.grafito + '"/><rect x="-76" y="-144" width="12" height="26" rx="6" fill="none" stroke="' + C.cian + '" stroke-width="2.5"/>' +
        '<rect x="60" y="-150" width="20" height="38" rx="9" fill="' + C.grafito + '"/><rect x="64" y="-144" width="12" height="26" rx="6" fill="none" stroke="' + C.cian + '" stroke-width="2.5"/>' +
        placa(0, -74, 'E5', [-18, -84, 18, -84]) +
        '</g>';
    },

    /* Tamandúa · Validación: oso hormiguero con chaleco de nacimiento y linterna. */
    tamandua: function () {
      return sombra(58) +
        '<rect x="-28" y="-30" width="19" height="26" rx="8" fill="' + C.a400 + '"/><rect x="9" y="-30" width="19" height="26" rx="8" fill="' + C.a400 + '"/>' +
        '<ellipse cx="-19" cy="-5" rx="15" ry="6.5" fill="' + C.a500 + '"/><ellipse cx="19" cy="-5" rx="15" ry="6.5" fill="' + C.a500 + '"/>' +
        '<path d="M-28 -4 v-4 M-22 -3 v-5 M10 -4 v-4 M16 -3 v-5" stroke="' + C.niebla + '" stroke-width="2" stroke-linecap="round"/>' +
        '<g class="pj-cuerpo">' +
        // cola
        '<g class="tama-cola"><path d="M-30 -44 C-64 -52 -98 -96 -92 -150 C-88 -168 -70 -168 -66 -150 C-62 -118 -50 -84 -22 -64 Z" fill="' + C.a400 + '"/>' +
        '<path d="M-84 -146 C-84 -118 -70 -92 -46 -72 M-76 -154 C-72 -128 -62 -104 -40 -84" stroke="' + C.a300 + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></g>' +
        // cuerpo y chaleco
        '<ellipse cx="0" cy="-82" rx="45" ry="62" fill="' + C.a300 + '"/>' +
        '<path d="M26 -134 C46 -118 50 -66 30 -30 C42 -62 40 -104 26 -134 Z" fill="' + C.a400 + '" opacity=".55"/>' +
        '<path d="M-45 -92 C-44 -120 -30 -138 -12 -142 L-18 -116 C-24 -96 -26 -74 -34 -52 C-42 -62 -46 -78 -45 -92 Z" fill="' + C.a900 + '"/>' +
        '<path d="M45 -92 C44 -120 30 -138 12 -142 L18 -116 C24 -96 26 -74 34 -52 C42 -62 46 -78 45 -92 Z" fill="' + C.a900 + '"/>' +
        placa(0, -112, 'E6', [-12, -134, 12, -134]) +
        // brazo izquierdo con tablet
        brazo('M-40 -104 Q-56 -94 -60 -80', C.a300, C.a500, 9) +
        '<rect x="-94" y="-104" width="38" height="28" rx="4" fill="' + C.grafito + '"/><rect x="-90" y="-100" width="30" height="20" rx="2" fill="' + C.a600 + '"/>' +
        '<path d="M-86 -92 h14 M-86 -86 h20" stroke="' + C.c300 + '" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="-60" cy="-80" r="7.5" fill="' + C.a300 + '" stroke="' + C.a500 + '" stroke-width="2"/>' +
        // brazo derecho con celular
        brazo('M40 -104 Q56 -98 62 -86', C.a300, C.a500, 9) +
        '<rect x="56" y="-120" width="22" height="38" rx="5" fill="' + C.grafito + '"/><rect x="59" y="-115" width="16" height="27" rx="2" fill="' + C.c700 + '"/>' +
        '<path class="tama-check" d="M62 -101 l3.5 3.5 l6.5 -8" stroke="' + C.niebla + '" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="62" cy="-86" r="7.5" fill="' + C.a300 + '" stroke="' + C.a500 + '" stroke-width="2"/>' +
        // cabeza con hocico largo
        '<g class="tama-cabeza">' +
        '<ellipse cx="-10" cy="-174" rx="8" ry="10" fill="' + C.a400 + '"/><ellipse cx="16" cy="-178" rx="8" ry="10" fill="' + C.a400 + '"/>' +
        '<g class="tama-hocico"><path d="M22 -162 L86 -180 C94 -182 97 -170 90 -166 L28 -142 Z" fill="' + C.a300 + '"/>' +
        '<path d="M30 -146 L89 -167" stroke="' + C.a400 + '" stroke-width="2.2" opacity=".7"/><ellipse cx="91" cy="-174" rx="5.5" ry="4.5" fill="' + C.a900 + '"/></g>' +
        '<ellipse cx="4" cy="-152" rx="30" ry="25" fill="' + C.a300 + '"/>' +
        ojo(-6, -155, 6.5, 7, 3.6, 1.2, 0.5) + ojo(15, -157, 6, 6.5, 3.4, 1.2, 0.5) +
        '<path d="M-22 -164 Q4 -174 30 -168" stroke="' + C.grafito + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="4" cy="-172" r="7.5" fill="' + C.niebla + '" stroke="' + C.grafito + '" stroke-width="2"/><circle class="tama-luz" cx="4" cy="-172" r="4.2" fill="' + C.cian + '"/>' +
        '</g>' +
        '</g>';
    },

    /* Faro · Puesta en marcha: faro a rayas con la lámpara cian. */
    faro: function () {
      var L = function (y) { return 54 - 16 * ((-14 - y) / 162); };
      var banda = function (y1, y2, color) {
        return '<path d="M' + f(-L(y1)) + ' ' + y1 + ' L' + f(L(y1)) + ' ' + y1 + ' L' + f(L(y2)) + ' ' + y2 + ' L' + f(-L(y2)) + ' ' + y2 + ' Z" fill="' + color + '"/>';
      };
      return sombra(60) +
        '<g class="faro-haz"><path d="M0 -205 L170 -236 L170 -176 Z" fill="' + C.cian + '" opacity=".13"/><path d="M0 -205 L120 -222 L120 -190 Z" fill="' + C.cian + '" opacity=".12"/></g>' +
        '<ellipse cx="-28" cy="-9" rx="24" ry="10" fill="' + C.a800 + '"/><ellipse cx="28" cy="-9" rx="24" ry="10" fill="' + C.a800 + '"/>' +
        '<g class="pj-cuerpo">' +
        banda(-14, -54, C.a700) + banda(-54, -94, C.niebla) + banda(-94, -134, C.a700) + banda(-134, -176, C.niebla) +
        '<path d="M16 -14 L54 -14 L38 -176 L12 -176 Z" fill="' + C.a900 + '" opacity=".2"/>' +
        // cara
        ojo(-14, -157, 7.5, 8.5, 4.4, 0.8, 0.8) + ojo(14, -157, 7.5, 8.5, 4.4, 0.8, 0.8) +
        '<ellipse cx="-14" cy="-157" rx="7.5" ry="8.5" fill="none" stroke="' + C.a300 + '" stroke-width="1.6"/><ellipse cx="14" cy="-157" rx="7.5" ry="8.5" fill="none" stroke="' + C.a300 + '" stroke-width="1.6"/>' +
        '<path d="M-9 -143 Q0 -136 9 -143" stroke="' + C.a700 + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
        // balcón y linterna
        '<rect x="-49" y="-184" width="98" height="9" rx="3" fill="' + C.a900 + '"/>' +
        '<path d="M-44 -184 V-196 M-29 -184 V-196 M-14 -184 V-196 M0 -184 V-196 M14 -184 V-196 M29 -184 V-196 M44 -184 V-196 M-47 -196 H47" stroke="' + C.a900 + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle class="faro-halo" cx="0" cy="-206" r="30" fill="url(#pj-halo)"/>' +
        '<rect x="-28" y="-224" width="56" height="30" rx="6" fill="' + C.c300 + '" opacity=".38" stroke="' + C.a900 + '" stroke-width="3"/>' +
        '<circle class="faro-luz" cx="0" cy="-208" r="11" fill="' + C.cian + '"/>' +
        '<path d="M-10 -224 V-196 M10 -224 V-196" stroke="' + C.a900 + '" stroke-width="2" opacity=".6"/>' +
        '<path d="M-33 -223 Q0 -252 33 -223 Z" fill="' + C.a900 + '"/><path d="M0 -248 V-258" stroke="' + C.a900 + '" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-260" r="4" fill="' + C.a900 + '"/>' +
        // credencial colgando del balcón
        placa(-4, -128, 'E7', [-16, -176, 8, -176]) +
        // brazos: manual bajo el brazo y saludo
        brazo('M-46 -110 Q-62 -98 -66 -86', C.a700, C.a900, 8) +
        '<g class="faro-manual"><rect x="-92" y="-104" width="28" height="36" rx="3" fill="' + C.niebla + '" transform="rotate(-10 -78 -86)"/>' +
        '<rect x="-92" y="-104" width="6" height="36" fill="' + C.a700 + '" transform="rotate(-10 -78 -86)"/>' +
        '<path d="M-82 -94 h12 M-82 -88 h9 M-82 -82 h11" stroke="' + C.a300 + '" stroke-width="2" transform="rotate(-10 -78 -86)"/></g>' +
        '<circle cx="-66" cy="-86" r="7" fill="' + C.a700 + '"/>' +
        '<g class="faro-saludo">' + brazo('M46 -112 Q62 -120 66 -138', C.a700, C.a900, 8) + '<circle cx="66" cy="-140" r="7.5" fill="' + C.a700 + '"/></g>' +
        '</g>';
    },

    /* Pepa · Cosecha: degú con delantal y canasto de pepas. */
    pepa: function () {
      return sombra(52) +
        '<g class="pepa-cola"><path d="M-30 -30 C-78 -30 -108 -62 -102 -112" stroke="' + C.a500 + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="-101" cy="-120" rx="9" ry="15" fill="' + C.a900 + '" transform="rotate(8 -101 -120)"/></g>' +
        '<ellipse cx="-21" cy="-8" rx="17" ry="8" fill="' + C.a500 + '"/><ellipse cx="21" cy="-8" rx="17" ry="8" fill="' + C.a500 + '"/>' +
        '<g class="pj-cuerpo">' +
        '<path d="M0 -150 C40 -150 58 -110 58 -70 C58 -34 34 -18 0 -18 C-34 -18 -58 -34 -58 -70 C-58 -110 -40 -150 0 -150 Z" fill="' + C.a500 + '"/>' +
        '<ellipse cx="0" cy="-66" rx="34" ry="40" fill="' + C.a200 + '"/>' +
        // delantal
        '<path d="M-22 -134 L-30 -112 M22 -134 L30 -112" stroke="' + C.a700 + '" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M-31 -113 L31 -113 L40 -32 Q0 -20 -40 -32 Z" fill="' + C.a700 + '"/>' +
        '<rect x="-18" y="-72" width="36" height="22" rx="5" fill="' + C.a800 + '"/>' +
        '<circle cx="-8" cy="-72" r="4.5" fill="' + C.cian + '"/><circle cx="1" cy="-73" r="4.5" fill="' + C.c300 + '"/>' +
        '<path d="M9 -71 C9 -80 11 -88 14 -94" stroke="' + C.c600 + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="19" cy="-94" rx="7" ry="4" fill="' + C.c600 + '" transform="rotate(-30 19 -94)"/><ellipse cx="9" cy="-92" rx="6" ry="3.5" fill="' + C.cian + '" transform="rotate(30 9 -92)"/>' +
        placa(-24, -108, 'E9') +
        // brazo izquierdo
        brazo('M-44 -104 Q-60 -92 -62 -78', C.a500, C.a700, 9) + '<circle cx="-62" cy="-78" r="7.5" fill="' + C.a500 + '"/>' +
        // canasto
        '<g class="pepa-canasto">' + brazo('M44 -104 Q58 -94 62 -80', C.a500, C.a700, 9) +
        '<path d="M60 -80 Q82 -110 104 -80" stroke="' + C.a600 + '" stroke-width="4.5" fill="none"/>' +
        '<circle cx="70" cy="-84" r="7" fill="' + C.cian + '"/><circle cx="83" cy="-88" r="7" fill="' + C.c300 + '"/><circle cx="95" cy="-84" r="7" fill="' + C.niebla + '"/>' +
        '<path d="M56 -80 L108 -80 L100 -48 L64 -48 Z" fill="' + C.a600 + '"/>' +
        '<path d="M60 -70 L104 -70 M62 -59 L102 -59 M72 -80 L74 -48 M84 -80 L84 -48 M96 -80 L94 -48" stroke="' + C.a800 + '" stroke-width="2" opacity=".7"/>' +
        '<circle cx="62" cy="-80" r="7.5" fill="' + C.a500 + '"/></g>' +
        // cabeza
        '<circle cx="-32" cy="-192" r="16" fill="' + C.a500 + '"/><circle cx="-32" cy="-192" r="9.5" fill="' + C.a300 + '"/>' +
        '<circle cx="32" cy="-192" r="16" fill="' + C.a500 + '"/><circle cx="32" cy="-192" r="9.5" fill="' + C.a300 + '"/>' +
        '<circle cx="0" cy="-160" r="40" fill="' + C.a500 + '"/>' +
        '<path d="M22 -194 C42 -182 46 -150 30 -128 C38 -150 36 -176 22 -194 Z" fill="' + C.a700 + '" opacity=".35"/>' +
        '<g class="pj-ojo"><circle cx="-16" cy="-167" r="9" fill="' + C.a900 + '"/><circle cx="-19" cy="-170" r="3.2" fill="' + C.blanco + '"/>' +
        '<circle cx="16" cy="-167" r="9" fill="' + C.a900 + '"/><circle cx="13" cy="-170" r="3.2" fill="' + C.blanco + '"/></g>' +
        '<ellipse cx="0" cy="-145" rx="20" ry="14" fill="' + C.a300 + '"/>' +
        '<ellipse cx="0" cy="-151" rx="6" ry="4.2" fill="' + C.a900 + '"/>' +
        '<rect x="-5.5" y="-139" width="5" height="8" rx="1.5" fill="' + C.niebla + '"/><rect x="0.5" y="-139" width="5" height="8" rx="1.5" fill="' + C.niebla + '"/>' +
        '<g class="pepa-bigote"><path d="M-14 -148 L-34 -152 M-14 -144 L-34 -142 M14 -148 L34 -152 M14 -144 L34 -142" stroke="' + C.a300 + '" stroke-width="1.6" stroke-linecap="round"/></g>' +
        '</g>';
    }
  };

  // Alto aproximado de cada uno (para ubicar etiquetas y encuadres).
  var ALTO = { lupe: 205, celda: 192, grilla: 252, bucle: 216, tamandua: 190, faro: 262, pepa: 210 };
  var ANCHO = { lupe: 210, celda: 250, grilla: 170, bucle: 210, tamandua: 200, faro: 190, pepa: 220 };

  function defs() {
    return '<defs><radialGradient id="pj-halo"><stop offset="0" stop-color="' + C.cian + '" stop-opacity=".55"/><stop offset="1" stop-color="' + C.cian + '" stop-opacity="0"/></radialGradient></defs>';
  }

  function svg(id) {
    var d = DIBUJOS[id];
    return d ? '<g class="pj pj-' + id + '">' + d() + '</g>' : '';
  }

  // Credencial grande (placa) para paneles y fichas: 300 × 190.
  function placaTarjeta(p, retrato) {
    var cabeza = { lupe: [0, -125, .9], celda: [10, -110, .75], grilla: [0, -170, .95], bucle: [0, -150, .78], tamandua: [20, -150, .82], faro: [0, -190, .8], pepa: [0, -165, .82] }[p.id] || [0, -120, .8];
    return '<g class="placa-grande">' +
      '<rect x="0" y="0" width="300" height="190" rx="16" fill="' + C.niebla + '"/>' +
      '<path d="M0 44 V16 a16 16 0 0 1 16 -16 H284 a16 16 0 0 1 16 16 V44 Z" fill="' + C.a800 + '"/>' +
      '<g transform="translate(14 8) scale(.28)">' + ISO + '</g>' +
      '<text x="50" y="30" font-family="Space Mono, monospace" font-weight="700" font-size="18" fill="' + C.niebla + '" letter-spacing="-1">Bi<tspan font-family="Space Grotesk, sans-serif" fill="' + C.cian + '" letter-spacing="0">Plot</tspan></text>' +
      '<text x="284" y="29" text-anchor="end" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="11" letter-spacing="3" fill="' + C.a300 + '">PERSONAL</text>' +
      '<rect x="16" y="58" width="92" height="116" rx="10" fill="' + C.a800 + '"/>' +
      '<g transform="translate(' + (62 + cabeza[0] * cabeza[2] * .3) + ' ' + (160 - (cabeza[1] + 120) * .3) + ') scale(' + (cabeza[2] * .52) + ')">' + (retrato ? '<g class="pj pj-' + p.id + '">' + DIBUJOS[p.id]() + '</g>' : '') + '</g>' +
      '<text x="124" y="92" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="30" fill="' + C.a800 + '" letter-spacing="-.5">' + p.nombre + '</text>' +
      '<text x="124" y="118" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="15" fill="' + C.c700 + '">' + p.rol + '</text>' +
      '<rect x="124" y="136" width="58" height="30" rx="8" fill="' + C.cian + '"/>' +
      '<text x="153" y="157" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="17" fill="' + C.a800 + '">' + p.placa + '</text>' +
      '<path d="M196 160 L214 146 L232 150 L252 134 L270 138" stroke="' + C.a300 + '" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>';
  }

  // Isotipo oficial (04-marca/logo/isotipo.svg), sin cambios de color ni de forma. Usa el degradado #bp-sq.
  var ISO = '<rect x="4" y="4" width="92" height="92" rx="22" fill="url(#bp-sq)" stroke="#7fd8cf" stroke-width="2.4"/>' +
    '<path d="M27 23V75H80" fill="none" stroke="#35679a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M31 67L45 53L59 57L72 35" fill="none" stroke="#168a86" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="31" cy="67" r="5.6" fill="#17C3B2"/><circle cx="45" cy="53" r="5.6" fill="#17C3B2"/>' +
    '<circle cx="59" cy="57" r="5.6" fill="#17C3B2"/><circle cx="72" cy="35" r="7" fill="#FF6B4A"/>';
  var ISO_DEFS = '<linearGradient id="bp-sq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c426d"/><stop offset="1" stop-color="#0d2642"/></linearGradient>';

  window.Elenco = {
    C: C, svg: svg, defs: function () { return defs().replace('</defs>', ISO_DEFS + '</defs>'); },
    placaTarjeta: placaTarjeta, alto: ALTO, ancho: ANCHO, isotipo: ISO,
    ids: ['lupe', 'celda', 'grilla', 'bucle', 'tamandua', 'faro', 'pepa']
  };
})();
