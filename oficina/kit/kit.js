/*
 * Kit para Instagram de la oficina BiPlot.
 * Sin parámetros: galería con todas las piezas. Con ?pieza=<id>&formato=<4x5|9x16|og>: una sola pieza al tamaño
 * exacto, lista para capturar (window.KIT_LISTO = true cuando cargaron las fuentes). La exporta
 * _herramientas/exportar-kit.mjs.
 * En redes el equipo va en ilustración (ilustraciones.js); el cabezón queda para la oficina y la credencial.
 */
(function () {
  'use strict';

  var D = window.OFICINA_DATOS, E = window.Elenco, I = window.Ilustraciones;
  var PERSONAL = {}; D.personal.concat(D.mascotas).forEach(function (p) { PERSONAL[p.id] = p; });
  var FORMATOS = { '4x5': [1080, 1350], '9x16': [1080, 1920], og: [1200, 630] };
  var PIEZAS = E.ids.map(function (id) { return 'ficha-' + id; }).concat(['oficina', 'elenco', 'motor', 'quien']);

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ISO = '<svg class="k-iso" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="bp-sq-k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c426d"/><stop offset="1" stop-color="#0d2642"/></linearGradient></defs>' +
    E.isotipo.replace('url(#bp-sq)', 'url(#bp-sq-k)') + '</svg>';

  function pie(texto) {
    return '<footer class="k-pie"><span class="k-marca">' + ISO + '<span class="bp-wordmark"><span class="bi">Bi</span><span class="plot">Plot</span></span></span>' +
      '<span class="k-url">' + (texto || 'biplot.cl/oficina') + '</span></footer>';
  }
  // Ilustración completa, o sólo la cabeza con «cabeza».
  function ilustracion(id, clase, cabeza) {
    var il = I[id];
    return '<svg class="' + clase + '" viewBox="' + (cabeza ? il.cabeza : il.vb) + '" aria-hidden="true">' + il.svg + '</svg>';
  }
  // Cabeza y torso del cabezón de la oficina
  function cabezon(id) {
    var a = E.alto[id], w = E.ancho[id], masc = E.mascotas.indexOf(id) > -1;
    var vb = masc ? [-w / 2 - 8, -a - 8 - (w > a ? (w - a) / 2 : 0), w + 16, Math.max(w, a) + 16] : [-66, -a - 4, 132, 132];
    return '<svg viewBox="' + vb.map(Math.round).join(' ') + '" aria-hidden="true">' + E.svg(id).replace('class="pj ', 'class="pj pj-retrato ') + '</svg>';
  }
  // Nombre grande que siempre cabe en el ancho de la pieza
  function tamNombre(t, base, ancho) { return Math.min(base, Math.floor(ancho / (t.length * 0.56))); }

  /* ── Fichas del equipo ── */
  function ficha(id, f) {
    var p = PERSONAL[id], fs = tamNombre(p.nombre, f === '9x16' ? 190 : 172, 900);
    return '<div class="k-halo"></div>' +
      '<p class="k-eyebrow">El equipo</p>' +
      '<h1 class="k-nombre" style="font-size:' + fs + 'px">' + esc(p.nombre) + '</h1>' +
      '<p class="k-rol">' + esc(p.rol) + '<span class="k-fases">' + (p.fases.length ? p.fases.join(' · ') : esc(p.placa)) + '</span></p>' +
      '<p class="k-lema">' + esc(p.lema) + '</p>' +
      ilustracion(id, 'k-pj') +
      '<div class="k-burbuja">«' + esc(p.frase) + '»</div>' +
      '<svg class="k-placa" viewBox="0 0 300 190" aria-hidden="true">' + E.defs() + E.placaTarjeta(p, true).replace(/class="pj pj-/g, 'class="pj pj-retrato pj-') + '</svg>' +
      '<ul class="k-rasgos">' + p.rasgos.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
      pie(f === '9x16' ? (p.genero === 'f' ? 'Conócela' : 'Conócelo') + ' en <b>biplot.cl/oficina</b>' : null);
  }

  /* ── La oficina ── */
  function oficina(f) {
    var titulo = f === 'og' ? 'La oficina de BiPlot' : 'Pasa.<br>Así trabajamos.';
    return '<div class="k-halo"></div>' +
      '<p class="k-eyebrow">La oficina</p>' +
      '<h1 class="k-titulo">' + titulo + '</h1>' +
      '<p class="k-bajada">Una oficina que puedes recorrer: el equipo trabajando y una sala por proyecto.</p>' +
      (f === 'og' ? '<p class="k-url-og">biplot.cl/oficina</p>' : '') +
      '<svg class="k-escena" id="k-escena" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>' +
      (f === 'og' ? '' : pie('Recórrela en <b>biplot.cl/oficina</b>'));
  }
  var ENCUADRE = { '4x5': '-660 -150 1450 880', '9x16': '-340 10 900 835', og: '-520 -150 1320 885' };

  /* ── El equipo completo ── */
  function elenco(f) {
    var alto = f === '9x16';
    var filas = alto
      ? [['lupe', 'architect', 'celda', 'engine'], ['grilla', 'bucle', 'tamandua'], ['faro', 'pepa', 'aby']]
      : [['lupe', 'architect', 'celda', 'engine', 'grilla'], ['bucle', 'tamandua', 'faro', 'pepa', 'aby']];
    var k = alto ? 0.47 : 0.6, dy = alto ? 290 : 380, y0 = 0, paso = alto ? 250 : 206, s = '';
    filas.forEach(function (fila, i) {
      fila.forEach(function (id, j) {
        var p = PERSONAL[id], cx = (j - (fila.length - 1) / 2) * paso, y = y0 + i * dy;
        s += '<g transform="translate(' + (cx - 150 * k) + ' ' + y + ') scale(' + k + ')">' + I[id].svg + '</g>' +
          '<g transform="translate(' + cx + ' ' + (y + 520 * k + 6) + ')"><rect x="-92" y="-22" width="184" height="40" rx="20" fill="#0E2A47" stroke="rgba(127,216,207,.6)" stroke-width="1.5"/>' +
          '<text x="' + (p.placa.length > 3 ? -30 : -14) + '" y="5" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="' + (p.nombre.length > 9 ? 17 : 21) + '" fill="#F2F4F7">' + esc(p.nombre) + '</text>' +
          '<rect x="' + (p.placa.length > 3 ? 26 : 44) + '" y="-13" width="' + (p.placa.length > 3 ? 60 : 38) + '" height="24" rx="6" fill="#17C3B2"/><text x="' + (p.placa.length > 3 ? 56 : 63) + '" y="4" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="' + (p.placa.length > 3 ? 12 : 14) + '" fill="#0E2A47">' + p.placa + '</text></g>';
      });
    });
    var h = y0 + filas.length * dy;
    return '<div class="k-halo"></div><p class="k-eyebrow">La oficina</p><h1 class="k-titulo">El equipo</h1>' +
      '<p class="k-bajada">Diez integrantes, uno por parte del trabajo. Los reconoces por su placa.</p>' +
      '<svg class="k-grupo" viewBox="-540 -10 1080 ' + (h + 10) + '" aria-hidden="true">' + s + '</svg>' +
      pie(alto ? 'Conócelos en <b>biplot.cl/oficina</b>' : null);
  }

  /* ── ¿Quién hace qué? ── */
  function motor(f) {
    var filas = D.fases.map(function (fa) {
      return '<li><span class="k-cod">' + fa.id + '</span><span class="k-fase"><b>' + esc(fa.nombre) + '</b>' + esc(fa.texto) + '</span><span class="k-quien">' +
        fa.quien.map(function (q) { return ilustracion(q, '', true); }).join('') + '</span></li>';
    }).join('');
    return '<div class="k-halo"></div><p class="k-eyebrow">El motor</p><h1 class="k-titulo">¿Quién hace qué?</h1>' +
      '<ol class="k-motor">' + filas + '</ol>' +
      '<p class="k-cierre">Tú hablas con una persona del equipo. <span>El motor hace el resto, fase por fase.</span></p>' + pie();
  }

  /* ── ¿Quién es real? ── */
  function quien(f) {
    var ids = E.ids;
    return '<div class="k-halo"></div><p class="k-eyebrow">La oficina</p><h1 class="k-titulo">¿Quién es real?</h1>' +
      '<p class="k-bajada">Aby dice que ella. Los demás no contestan.</p>' +
      '<ul class="k-caras">' + ids.map(function (id) {
        return '<li' + (id === 'aby' ? ' class="aby"' : '') + '><span class="k-cara">' + ilustracion(id, '', true) + '</span><b>' + esc(PERSONAL[id].nombre) + '</b></li>';
      }).join('') + '</ul>' +
      '<p class="k-cierre">Pasa a la oficina y decide tú. <span>Nadie lo confirma. Nadie lo desmiente.</span></p>' +
      pie(f === '9x16' ? 'Averígualo en <b>biplot.cl/oficina</b>' : null);
  }

  function contenido(pieza, f) {
    if (pieza.indexOf('ficha-') === 0) return ficha(pieza.slice(6), f);
    if (pieza === 'oficina') return oficina(f);
    if (pieza === 'elenco') return elenco(f);
    if (pieza === 'motor') return motor(f);
    if (pieza === 'quien') return quien(f);
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
