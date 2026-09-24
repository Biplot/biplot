/*
 * Kit para Instagram de la oficina BiPlot.
 * Sin parámetros: galería con todas las piezas. Con ?pieza=<id>&formato=<4x5|9x16|og>: una sola pieza al tamaño
 * exacto, lista para capturar (window.KIT_LISTO = true cuando cargaron las fuentes). La exporta
 * _herramientas/exportar-kit.mjs.
 */
(function () {
  'use strict';

  var D = window.OFICINA_DATOS, E = window.Elenco;
  var PERSONAL = {}; D.personal.forEach(function (p) { PERSONAL[p.id] = p; });
  var FORMATOS = { '4x5': [1080, 1350], '9x16': [1080, 1920], og: [1200, 630] };
  var PIEZAS = E.ids.map(function (id) { return 'ficha-' + id; }).concat(['oficina', 'elenco', 'motor']);

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ISO = '<svg class="k-iso" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="bp-sq-k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c426d"/><stop offset="1" stop-color="#0d2642"/></linearGradient></defs>' +
    E.isotipo.replace('url(#bp-sq)', 'url(#bp-sq-k)') + '</svg>';

  function pie(texto) {
    return '<footer class="k-pie"><span class="k-marca">' + ISO + '<span class="bp-wordmark"><span class="bi">Bi</span><span class="plot">Plot</span></span></span>' +
      '<span class="k-url">' + (texto || 'biplot.cl/oficina') + '</span></footer>';
  }

  // Tarima isométrica bajo los pies (coordenadas locales del personaje).
  function tarima(ancho) {
    var a = ancho || 150, b = a / 2, h = 22;
    return '<g class="k-tarima"><polygon points="' + [-a + ',0', '0,' + (-b), a + ',0', '0,' + b].join(' ') + '" fill="#163A60"/>' +
      '<polygon points="' + [-a + ',0', '0,' + b, '0,' + (b + h), -a + ',' + h].join(' ') + '" fill="#0E2A47"/>' +
      '<polygon points="' + ['0,' + b, a + ',0', a + ',' + h, '0,' + (b + h)].join(' ') + '" fill="#091D33"/>' +
      '<g stroke="rgba(23,195,178,.16)" stroke-width="1.5"><line x1="' + (-a / 2) + '" y1="' + (-b / 2) + '" x2="' + (a / 2) + '" y2="' + (b / 2) + '"/>' +
      '<line x1="' + (-a / 2) + '" y1="' + (b / 2) + '" x2="' + (a / 2) + '" y2="' + (-b / 2) + '"/></g>' +
      '<polyline points="' + [-a + ',0', '0,' + b, a + ',0'].join(' ') + '" fill="none" stroke="rgba(127,216,207,.55)" stroke-width="2"/></g>';
  }
  function personaje(id, clase, ancho) {
    return '<svg class="' + (clase || 'k-pj') + '" viewBox="-175 -290 350 400" aria-hidden="true">' + E.defs() + tarima(ancho) + E.svg(id) + '</svg>';
  }

  /* ── Fichas del personal ── */
  function ficha(id, f) {
    var p = PERSONAL[id];
    return '<div class="k-halo"></div>' +
      '<p class="k-eyebrow">El personal</p>' +
      '<h1 class="k-nombre">' + esc(p.nombre) + '</h1>' +
      '<p class="k-rol">' + esc(p.rol) + '<span class="k-fases">' + p.fases.join(' · ') + '</span></p>' +
      '<p class="k-lema">' + esc(p.lema) + '</p>' +
      personaje(id, 'k-pj') +
      '<div class="k-burbuja">«' + esc(p.frase) + '»</div>' +
      '<svg class="k-placa" viewBox="0 0 300 190" aria-hidden="true">' + E.defs() + E.placaTarjeta(p, true).replace('class="pj pj-', 'class="pj pj-retrato pj-') + '</svg>' +
      '<ul class="k-rasgos">' + p.rasgos.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
      pie(f === '9x16' ? (p.genero === 'f' ? 'Conócela' : 'Conócelo') + ' en <b>biplot.cl/oficina</b>' : null);
  }

  /* ── La oficina ── */
  function oficina(f) {
    var titulo = f === 'og' ? 'La oficina de BiPlot' : 'Pasa.<br>Así trabajamos.';
    return '<div class="k-halo"></div>' +
      '<p class="k-eyebrow">' + 'La oficina' + '</p>' +
      '<h1 class="k-titulo">' + titulo + '</h1>' +
      '<p class="k-bajada">Dos socios y siete especialistas dibujados, en una oficina que puedes recorrer.</p>' +
      (f === 'og' ? '<p class="k-url-og">biplot.cl/oficina</p>' : '') +
      '<svg class="k-escena" id="k-escena" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>' +
      (f === 'og' ? '' : pie('Recórrela en <b>biplot.cl/oficina</b>'));
  }
  var ENCUADRE = { '4x5': '-660 -150 1450 880', '9x16': '-340 10 900 835', og: '-520 -150 1320 885' };

  /* ── El elenco ── */
  function elenco(f) {
    var filas = f === '9x16'
      ? [[['grilla', -260], ['faro', 0], ['bucle', 260]], [['celda', -175], ['tamandua', 175]], [['lupe', -175], ['pepa', 175]]]
      : [[['bucle', -375], ['grilla', -125], ['faro', 125], ['celda', 375]], [['tamandua', -250], ['lupe', 0], ['pepa', 250]]];
    var alto = f === '9x16' ? 1040 : 800, esc0 = f === '9x16' ? 0.92 : 0.86, dy = f === '9x16' ? 290 : 330, y0 = f === '9x16' ? 290 : 300;
    var s = '<svg class="k-grupo" viewBox="-540 0 1080 ' + alto + '" aria-hidden="true">' + E.defs();
    // tarima grande
    var tb = y0 + dy * (filas.length - 1) / 2 + 40, ta = 520, tbb = ta / 2;
    s += '<polygon points="' + [(-ta) + ',' + tb, '0,' + (tb - tbb), ta + ',' + tb, '0,' + (tb + tbb)].join(' ') + '" fill="#163A60"/>' +
      '<polygon points="' + [(-ta) + ',' + tb, '0,' + (tb + tbb), '0,' + (tb + tbb + 30), (-ta) + ',' + (tb + 30)].join(' ') + '" fill="#0E2A47"/>' +
      '<polygon points="' + ['0,' + (tb + tbb), ta + ',' + tb, ta + ',' + (tb + 30), '0,' + (tb + tbb + 30)].join(' ') + '" fill="#091D33"/>' +
      '<polyline points="' + [(-ta) + ',' + tb, '0,' + (tb + tbb), ta + ',' + tb].join(' ') + '" fill="none" stroke="rgba(127,216,207,.55)" stroke-width="2"/>';
    filas.forEach(function (fila, i) {
      var y = y0 + i * dy;
      fila.forEach(function (c) {
        var p = PERSONAL[c[0]];
        s += '<g transform="translate(' + c[1] + ' ' + y + ') scale(' + esc0 + ')">' + E.svg(c[0]) + '</g>' +
          '<g transform="translate(' + c[1] + ' ' + (y + 44) + ')"><rect x="-86" y="-24" width="172" height="40" rx="20" fill="#0E2A47" stroke="rgba(127,216,207,.6)" stroke-width="1.5"/>' +
          '<text x="-8" y="3" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="22" fill="#F2F4F7">' + esc(p.nombre) + '</text>' +
          '<rect x="' + (46 - (p.nombre.length > 6 ? -2 : 0)) + '" y="-15" width="34" height="22" rx="6" fill="#17C3B2"/><text x="' + (63 - (p.nombre.length > 6 ? -2 : 0)) + '" y="1" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="13" fill="#0E2A47">' + p.placa + '</text></g>';
      });
    });
    s += '</svg>';
    return '<div class="k-halo"></div><p class="k-eyebrow">La oficina</p><h1 class="k-titulo">El personal</h1>' +
      '<p class="k-bajada">Siete especialistas, uno por parte del trabajo. Los reconoces por su placa.</p>' + s +
      pie(f === '9x16' ? 'Conócelos en <b>biplot.cl/oficina</b>' : null);
  }

  /* ── ¿Quién hace qué? ── */
  function motor(f) {
    var filas = D.fases.map(function (fa) {
      return '<li><span class="k-cod">' + fa.id + '</span><span class="k-fase"><b>' + esc(fa.nombre) + '</b>' + esc(fa.texto) + '</span><span class="k-quien">' +
        fa.quien.map(function (q) { return '<svg viewBox="-150 -280 300 300" aria-hidden="true">' + E.svg(q) + '</svg>'; }).join('') + '</span></li>';
    }).join('');
    return '<div class="k-halo"></div><p class="k-eyebrow">El motor</p><h1 class="k-titulo">¿Quién hace qué?</h1>' +
      '<ol class="k-motor">' + filas + '</ol>' +
      '<p class="k-cierre">Tú hablas con los socios. <span>Ellos arman el proyecto contigo y se lo pasan al equipo.</span></p>' + pie();
  }

  function contenido(pieza, f) {
    if (pieza.indexOf('ficha-') === 0) return ficha(pieza.slice(6), f);
    if (pieza === 'oficina') return oficina(f);
    if (pieza === 'elenco') return elenco(f);
    if (pieza === 'motor') return motor(f);
    return '';
  }
  function montar(destino, pieza, f) {
    var tam = FORMATOS[f], div = document.createElement('div');
    div.className = 'pieza f-' + f + ' p-' + pieza.replace(/^ficha-.*/, 'ficha') + (pieza.indexOf('ficha-') === 0 ? ' pj-fondo-' + pieza.slice(6) : '');
    div.style.width = tam[0] + 'px'; div.style.height = tam[1] + 'px';
    div.innerHTML = contenido(pieza, f);
    destino.appendChild(div);
    var sv = div.querySelector('.k-escena');
    if (sv) {
      var e = window.Escena.construir(sv, { animado: false });
      sv.setAttribute('viewBox', ENCUADRE[f] || ENCUADRE['4x5']);
      sv.querySelector('#paquete') && sv.querySelector('#paquete').classList.add('quieto');
      div._escena = e;
    }
    return div;
  }

  var q = new URLSearchParams(location.search), pieza = q.get('pieza'), formato = q.get('formato') || '4x5';
  if (pieza && FORMATOS[formato]) {
    var lienzo = document.getElementById('lienzo');
    lienzo.hidden = false; document.body.classList.add('solo');
    montar(lienzo, pieza, formato);
    var listo = function () { window.KIT_LISTO = true; document.documentElement.setAttribute('data-listo', '1'); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(listo, 350); });
  } else {
    var g = document.getElementById('galeria'), grilla = document.getElementById('grilla');
    g.hidden = false;
    var lista = [];
    PIEZAS.forEach(function (p) { ['4x5', '9x16'].forEach(function (f) { lista.push([p, f]); }); });
    lista.push(['oficina', 'og']);
    lista.forEach(function (it) {
      var fig = document.createElement('figure'), tam = FORMATOS[it[1]], k = 300 / tam[0];
      fig.className = 'miniatura';
      var marco = document.createElement('div'); marco.className = 'marco'; marco.style.width = Math.round(tam[0] * k) + 'px'; marco.style.height = Math.round(tam[1] * k) + 'px';
      var escala = document.createElement('div'); escala.className = 'escala'; escala.style.transform = 'scale(' + k + ')';
      marco.appendChild(escala); fig.appendChild(marco);
      var nombre = it[0] + '-' + it[1];
      fig.insertAdjacentHTML('beforeend', '<figcaption><b>' + nombre + '</b> · ' + tam[0] + '×' + tam[1] + ' · <a href="png/' + nombre + '.png" download>PNG</a> · <a href="?pieza=' + it[0] + '&formato=' + it[1] + '">abrir</a></figcaption>');
      grilla.appendChild(fig);
      montar(escala, it[0], it[1]);
    });
  }
})();
