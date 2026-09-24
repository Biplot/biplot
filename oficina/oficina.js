/*
 * Oficina BiPlot · interfaz
 * Cámara (arrastrar, rueda, pellizco, teclado), menú "Recorre la oficina", recorrido guiado y paneles.
 * Todo lo que se puede hacer con el mouse en la escena también se puede hacer desde el menú con teclado.
 */
(function () {
  'use strict';

  var D = window.OFICINA_DATOS, E = window.Elenco;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var PERSONAL = {}; D.personal.forEach(function (p) { PERSONAL[p.id] = p; });
  var PROYECTOS = {}; D.proyectos.forEach(function (p) { PROYECTOS[p.id] = p; });
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function guardar(k, v) { try { localStorage.setItem('oficina-' + k, v); } catch (e) { /* sin almacenamiento */ } }
  function leer(k) { try { return localStorage.getItem('oficina-' + k); } catch (e) { return null; } }

  /* ── Escena ── */
  var escenaEl = $('#escena'), svg = $('#svg-escena');
  var esc3 = window.Escena.construir(svg, { animado: !reducido });
  var raiz = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  raiz.id = 'escena-raiz';
  // Mueve todo lo dibujado a un grupo con id, para reutilizarlo en las vistas de los paneles con <use>.
  Array.prototype.slice.call(svg.childNodes).forEach(function (n) {
    if (n.nodeName === 'defs' || n.nodeName === 'title' || n.nodeName === 'desc') return;
    raiz.appendChild(n);
  });
  svg.appendChild(raiz);
  var L = esc3.limites, P = esc3.P;
  var capaResalte = svg.querySelector('.capa-resalte');

  /* ── Sprites de avatares (quietos) ── */
  var sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('class', 'sprite-quieto'); sprite.setAttribute('aria-hidden', 'true');
  sprite.innerHTML = E.ids.map(function (id) { return '<symbol id="av-' + id + '" viewBox="-135 -270 270 285">' + E.svg(id) + '</symbol>'; }).join('');
  document.body.appendChild(sprite);
  function avatar(id, clase) { return '<svg class="avatar ' + (clase || '') + '" viewBox="0 0 270 285" aria-hidden="true" focusable="false"><use href="#av-' + id + '" width="270" height="285"/></svg>'; }

  /* ── Cámara ── */
  var cam = { x: (L.x0 + L.x1) / 2, y: (L.y0 + L.y1) / 2, z: 1 }, vuelo = null;
  function rect() { return svg.getBoundingClientRect(); }
  function margenes() {
    var r = rect(), m = { izq: 0, der: 0, arr: 0, aba: 0 };
    var nav = $('#recorrer'), panel = $('#panel');
    var ancho = window.innerWidth >= 900;
    if (ancho && nav && !nav.classList.contains('cerrado')) m.izq = nav.getBoundingClientRect().right - r.left + 8;
    if (panel && !panel.hidden) {
      var pr = panel.getBoundingClientRect();
      if (ancho) m.der = r.right - pr.left + 8; else m.aba = r.bottom - pr.top;
    }
    var guia = $('#guia'); if (guia && !guia.hidden && !m.aba) m.aba = r.bottom - guia.getBoundingClientRect().top + 8;
    var intro = $('#intro'); if (intro && !intro.hidden && !m.aba) m.aba = r.bottom - intro.getBoundingClientRect().top + 8;
    return m;
  }
  function zAjuste() {
    var r = rect(), m = margenes();
    var w = Math.max(200, r.width - m.izq - m.der), h = Math.max(200, r.height - m.arr - m.aba);
    return Math.min(w / (L.x1 - L.x0), h / (L.y1 - L.y0));
  }
  function limitesZ() { var a = zAjuste(); return [a * 0.85, Math.max(4, a * 6)]; }
  function aplicar() {
    var r = rect(); if (!r.width) return;
    var lz = limitesZ(); cam.z = Math.max(lz[0], Math.min(lz[1], cam.z));
    var w = r.width / cam.z, h = r.height / cam.z;
    // Mantiene la oficina a la vista: el centro no se sale de los límites.
    cam.x = Math.max(L.x0, Math.min(L.x1, cam.x)); cam.y = Math.max(L.y0, Math.min(L.y1, cam.y));
    svg.setAttribute('viewBox', [cam.x - w / 2, cam.y - h / 2, w, h].map(function (n) { return Math.round(n * 100) / 100; }).join(' '));
    moverRotulo();
  }
  // Centro de cámara que deja el punto (sx, sy) al centro del área libre (descontando menú y panel).
  function centroPara(sx, sy, z) {
    var m = margenes();
    return { x: sx - (m.izq - m.der) / 2 / z, y: sy - (m.arr - m.aba) / 2 / z };
  }
  function volar(sx, sy, z, dur) {
    var c = centroPara(sx, sy, z), desde = { x: cam.x, y: cam.y, z: cam.z }, t0 = performance.now();
    if (vuelo) cancelAnimationFrame(vuelo);
    if (reducido || dur === 0) { cam.x = c.x; cam.y = c.y; cam.z = z; aplicar(); return; }
    dur = dur || 700;
    (function cuadro(t) {
      var k = Math.min(1, (t - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      // Interpola el zoom en escala logarítmica para que no "salte".
      cam.z = Math.exp(Math.log(desde.z) + (Math.log(z) - Math.log(desde.z)) * e);
      cam.x = desde.x + (c.x - desde.x) * e; cam.y = desde.y + (c.y - desde.y) * e;
      aplicar();
      if (k < 1) vuelo = requestAnimationFrame(cuadro); else vuelo = null;
    })(t0);
  }
  function verTodo(dur) { var z = zAjuste(); volar((L.x0 + L.x1) / 2, (L.y0 + L.y1) / 2 + 10, z, dur); }
  function zPara(ventana) {
    var r = rect(), m = margenes(), lz = limitesZ();
    var w = Math.max(160, r.width - m.izq - m.der), h = Math.max(160, r.height - m.arr - m.aba);
    return Math.max(lz[0], Math.min(lz[1], Math.min(w / ventana, h / (ventana * .62))));
  }
  function zonaPorId(id) { return esc3.zonas.filter(function (z) { return z.id === id; })[0]; }
  function irA(obj, dur) {
    if (obj.tipo === 'actor') {
      var a = esc3.actores[obj.id], p = P(a.x, a.y, 0.9);
      volar(p[0], p[1], zPara(window.innerWidth < 700 ? 330 : 360), dur);
    } else {
      var zn = zonaPorId(obj.id); if (!zn) return;
      var q = P(zn.foco[0], zn.foco[1], zn.foco[2]);
      volar(q[0], q[1], zPara(zn.id === 'muro' || zn.id === 'recepcion' ? 560 : 520), dur);
    }
  }

  /* ── Resalte y rótulo ── */
  var resaltado = null;
  function resaltar(obj) {
    resaltado = obj; capaResalte.innerHTML = '';
    if (!obj) { ocultarRotulo(); return; }
    var ns = 'http://www.w3.org/2000/svg';
    if (obj.tipo === 'zona') {
      var zn = zonaPorId(obj.id);
      var pg = document.createElementNS(ns, 'polygon'); pg.setAttribute('points', zn.silueta); pg.setAttribute('class', 'resalte');
      var pb = document.createElementNS(ns, 'polygon'); pb.setAttribute('points', zn.suelo); pb.setAttribute('class', 'resalte-suelo');
      capaResalte.appendChild(pb); capaResalte.appendChild(pg);
    } else {
      var el = document.createElementNS(ns, 'ellipse'); el.setAttribute('class', 'resalte-actor'); el.setAttribute('rx', 30); el.setAttribute('ry', 13);
      capaResalte.appendChild(el);
    }
    moverRotulo();
  }
  var rotulo = $('#rotulo');
  function textoRotulo(obj) {
    if (obj.tipo === 'actor') { var p = PERSONAL[obj.id]; return '<b>' + esc(p.nombre) + '</b><span>' + esc(p.rol) + ' · ' + p.placa + '</span>'; }
    var zn = zonaPorId(obj.id); return '<b>' + esc(zn.nombre) + '</b><span>' + (PROYECTOS[obj.id] ? 'Entrar a la sala' : 'Ver más') + '</span>';
  }
  function moverRotulo() {
    if (!resaltado) return;
    var r = rect(), vb = svg.viewBox.baseVal, sx, sy;
    if (resaltado.tipo === 'actor') {
      var a = esc3.actores[resaltado.id], p0 = P(a.x, a.y, 0), p1 = P(a.x, a.y, 2.0);
      var el = capaResalte.querySelector('.resalte-actor'); if (el) { el.setAttribute('cx', p0[0]); el.setAttribute('cy', p0[1]); }
      sx = p1[0]; sy = p1[1];
    } else {
      var zn = zonaPorId(resaltado.id), b = zn.caja, t = P((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, b[4] + .35);
      sx = t[0]; sy = t[1];
    }
    var cx = (sx - vb.x) * (r.width / vb.width), cy = (sy - vb.y) * (r.height / vb.height);
    if (!rotulo.hidden && rotulo.dataset.clave === resaltado.tipo + resaltado.id) { rotulo.style.transform = 'translate(' + Math.round(cx) + 'px,' + Math.round(cy) + 'px)'; return; }
    rotulo.innerHTML = '<div class="rotulo-caja">' + textoRotulo(resaltado) + '</div>'; rotulo.dataset.clave = resaltado.tipo + resaltado.id; rotulo.hidden = false;
    rotulo.style.transform = 'translate(' + Math.round(cx) + 'px,' + Math.round(cy) + 'px)';
  }
  function ocultarRotulo() { rotulo.hidden = true; rotulo.dataset.clave = ''; }
  // El rótulo sigue al actor que camina
  (function seguir() { if (resaltado && resaltado.tipo === 'actor') moverRotulo(); requestAnimationFrame(seguir); })();

  /* ── Entrada: arrastrar, rueda, pellizco, clic ── */
  var punteros = {}, arrastre = null;
  // Las siluetas de salas vecinas se traslapan (la cara de vidrio de una tapa el piso de la otra):
  // manda la sala cuyo piso está bajo el puntero; si no hay piso de sala ahí, la silueta tocada.
  function zonaEnPiso(clx, cly) {
    var r = rect(), vb = svg.viewBox.baseVal;
    var sx = vb.x + (clx - r.left) * vb.width / r.width, sy = vb.y + (cly - r.top) * vb.height / r.height;
    var x = (sx / 32 + sy / 16) / 2, y = (sy / 16 - sx / 32) / 2;
    var z = esc3.zonas.filter(function (zn) { var b = zn.caja; return x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]; })[0];
    return z ? { tipo: 'zona', id: z.id } : null;
  }
  function objetoEn(el, clx, cly) {
    if (!el || !el.closest) return null;
    var a = el.closest('.actor'); if (a) return { tipo: 'actor', id: a.getAttribute('data-actor') };
    if (el.classList && el.classList.contains('zona-hit')) return (clx !== undefined && zonaEnPiso(clx, cly)) || { tipo: 'zona', id: el.getAttribute('data-zona') };
    return null;
  }
  svg.addEventListener('pointerdown', function (e) {
    punteros[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(punteros);
    if (ids.length === 1) arrastre = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, movio: false, obj: objetoEn(e.target, e.clientX, e.clientY) };
    else if (ids.length === 2) {
      var a = punteros[ids[0]], b = punteros[ids[1]];
      arrastre = { pellizco: true, d: Math.hypot(a.x - b.x, a.y - b.y), z: cam.z, movio: true };
    }
    if (vuelo) { cancelAnimationFrame(vuelo); vuelo = null; }
  });
  window.addEventListener('pointermove', function (e) {
    if (punteros[e.pointerId]) punteros[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (!arrastre) {
      if (e.pointerType === 'mouse' && e.target && svg.contains(e.target)) {
        var o = objetoEn(e.target, e.clientX, e.clientY);
        if (!o && resaltado && resaltado.origen === 'mouse') resaltar(null);
        else if (o && (!resaltado || resaltado.id !== o.id)) { o.origen = 'mouse'; resaltar(o); }
      }
      return;
    }
    if (arrastre.pellizco) {
      var ids = Object.keys(punteros); if (ids.length < 2) return;
      var a = punteros[ids[0]], b = punteros[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomEn((a.x + b.x) / 2, (a.y + b.y) / 2, arrastre.z * d / arrastre.d / cam.z);
      return;
    }
    var dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    if (!arrastre.movio && Math.hypot(dx, dy) > 6) { arrastre.movio = true; escenaEl.classList.add('arrastrando'); }
    if (arrastre.movio) { cam.x = arrastre.cx - dx / cam.z; cam.y = arrastre.cy - dy / cam.z; aplicar(); }
  });
  function soltar(e) {
    delete punteros[e.pointerId];
    if (!arrastre) return;
    if (!arrastre.movio && arrastre.obj && e.type === 'pointerup') abrir(arrastre.obj, true);
    if (!Object.keys(punteros).length) { arrastre = null; escenaEl.classList.remove('arrastrando'); }
    else if (arrastre.pellizco) { var k = Object.keys(punteros)[0]; arrastre = { x: punteros[k].x, y: punteros[k].y, cx: cam.x, cy: cam.y, movio: true }; }
  }
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
  function zoomEn(clx, cly, factor) {
    var r = rect(), lz = limitesZ(), z2 = Math.max(lz[0], Math.min(lz[1], cam.z * factor));
    var wx = cam.x + (clx - r.left - r.width / 2) / cam.z, wy = cam.y + (cly - r.top - r.height / 2) / cam.z;
    cam.z = z2; cam.x = wx - (clx - r.left - r.width / 2) / z2; cam.y = wy - (cly - r.top - r.height / 2) / z2;
    aplicar();
  }
  svg.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (vuelo) { cancelAnimationFrame(vuelo); vuelo = null; }
    var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomEn(e.clientX, e.clientY, Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0016)));
  }, { passive: false });
  escenaEl.addEventListener('keydown', function (e) {
    var paso = 90 / cam.z, r = rect(), usado = true;
    if (e.key === 'ArrowLeft') cam.x -= paso; else if (e.key === 'ArrowRight') cam.x += paso;
    else if (e.key === 'ArrowUp') cam.y -= paso; else if (e.key === 'ArrowDown') cam.y += paso;
    else if (e.key === '+' || e.key === '=') zoomEn(r.left + r.width / 2, r.top + r.height / 2, 1.25);
    else if (e.key === '-' || e.key === '_') zoomEn(r.left + r.width / 2, r.top + r.height / 2, 0.8);
    else if (e.key === '0') verTodo();
    else usado = false;
    if (usado) { e.preventDefault(); aplicar(); }
  });

  /* ── Controles ── */
  $('#controles').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var r = rect(), acc = b.getAttribute('data-accion');
    if (acc === 'acercar') zoomEn(r.left + r.width / 2, r.top + r.height / 2, 1.35);
    if (acc === 'alejar') zoomEn(r.left + r.width / 2, r.top + r.height / 2, 0.74);
    if (acc === 'todo') verTodo();
    if (acc === 'pausa') pausar(b.getAttribute('aria-pressed') !== 'true');
  });
  function pausar(si) {
    var b = $('#controles [data-accion="pausa"]');
    b.setAttribute('aria-pressed', si ? 'true' : 'false');
    b.querySelector('.txt').textContent = si ? 'Seguir' : 'Pausar';
    b.setAttribute('aria-label', si ? 'Reanudar la animación' : 'Pausar la animación');
    document.documentElement.classList.toggle('oficina-quieta', si);
    if (si) esc3.detener(); else esc3.iniciar();
    guardar('pausa', si ? '1' : '0');
  }

  /* ── Menú: recorre la oficina ── */
  var SALAS_MENU = [
    ['recepcion', 'Recepción', 'Donde todo parte'], ['sala-e1', 'Sala E1', 'Cómo trabajamos'],
    ['estanteria', 'Estantería del núcleo', 'Casos de referencia'], ['muro', 'Muro del personal', 'Los siete'],
    ['socios', 'Oficina de los socios', 'Quién te atiende']
  ];
  var PROY_MENU = [['nuhome', 'Nu Home 360'], ['fundos', 'Fundos 360'], ['haru', 'Haru Isidora'], ['eleven', 'Eleven Club'], ['rumbo', 'Rumbo']];
  function construirMenu() {
    var h = '<h2 class="menu-t" id="recorrer-t">Recorre la oficina</h2>' +
      '<button type="button" class="menu-guia" data-guia="1"><span class="ico" aria-hidden="true">' + icono('ruta') + '</span>Hacer el recorrido guiado</button>' +
      '<h3 class="menu-sub">El personal</h3><ul class="menu-lista menu-personal">';
    E.ids.forEach(function (id) {
      var p = PERSONAL[id];
      h += '<li><button type="button" data-tipo="actor" data-id="' + id + '">' + avatar(id) + '<span class="mt"><b>' + esc(p.nombre) + '</b><span>' + esc(p.rol) + '</span></span><span class="placa-mini">' + p.placa + '</span></button></li>';
    });
    h += '</ul><h3 class="menu-sub">Las salas</h3><ul class="menu-lista">';
    SALAS_MENU.forEach(function (s) { h += '<li><button type="button" data-tipo="zona" data-id="' + s[0] + '"><span class="mt"><b>' + s[1] + '</b><span>' + s[2] + '</span></span></button></li>'; });
    h += '</ul><h3 class="menu-sub">Salas de proyecto</h3><ul class="menu-lista">';
    PROY_MENU.forEach(function (s) {
      var pr = PROYECTOS[s[0]];
      h += '<li><button type="button" data-tipo="zona" data-id="' + s[0] + '"><span class="punto" style="background:' + pr.acento + '" aria-hidden="true"></span><span class="mt"><b>' + s[1] + '</b><span>' + esc(pr.rubro) + '</span></span></button></li>';
    });
    h += '</ul>';
    $('#recorrer-cuerpo').innerHTML = h;
  }
  construirMenu();
  var menu = $('#recorrer');
  menu.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'recorrer-toggle') { alternarMenu(); return; }
    if (b.hasAttribute('data-guia')) { if (window.innerWidth < 900) alternarMenu(false); iniciarGuia(0); return; }
    var obj = { tipo: b.getAttribute('data-tipo'), id: b.getAttribute('data-id') };
    if (window.innerWidth < 900) alternarMenu(false);
    abrir(obj, false, b);
  });
  // Al recorrer el menú con teclado, la cámara muestra dónde está cada cosa.
  menu.addEventListener('focusin', function (e) {
    var b = e.target.closest('button[data-id]'); if (!b || !b.matches(':focus-visible')) return;
    var obj = { tipo: b.getAttribute('data-tipo'), id: b.getAttribute('data-id') };
    resaltar(obj); irA(obj);
  });
  function alternarMenu(abrirlo) {
    var cerrado = menu.classList.contains('cerrado');
    if (abrirlo === undefined) abrirlo = cerrado;
    menu.classList.toggle('cerrado', !abrirlo);
    $('#recorrer-toggle').setAttribute('aria-expanded', abrirlo ? 'true' : 'false');
    guardar('menu', abrirlo ? '1' : '0');
  }

  /* ── Panel ── */
  var panel = $('#panel'), panelCuerpo = $('#panel-cuerpo'), invocador = null, abierto = null;
  function abrir(obj, desdeEscena, boton) {
    detenerMedios();
    invocador = boton || document.activeElement;
    abierto = obj;
    panelCuerpo.innerHTML = obj.tipo === 'actor' ? htmlPersonaje(obj.id) : htmlZona(obj.id);
    panel.hidden = false;
    panel.setAttribute('aria-label', obj.tipo === 'actor' ? PERSONAL[obj.id].nombre : zonaPorId(obj.id).nombre);
    panel.scrollTop = 0; panelCuerpo.scrollTop = 0;
    activarMedios();
    resaltar(obj);
    requestAnimationFrame(function () { irA(obj); });
    var t = $('#panel-titulo'); if (t) t.focus({ preventScroll: true });
    cerrarIntro();
  }
  function cerrarPanel() {
    detenerMedios();
    panel.hidden = true; abierto = null; resaltar(null);
    if (invocador && invocador.focus && document.contains(invocador)) invocador.focus({ preventScroll: true });
    aplicar();
  }
  $('#panel-cerrar').addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($('#lightbox') && !$('#lightbox').hidden) { cerrarLightbox(); return; }
    if (!panel.hidden) cerrarPanel();
    else if (!$('#guia').hidden) terminarGuia();
  });
  panelCuerpo.addEventListener('click', function (e) {
    var b = e.target.closest('[data-abrir]');
    if (b) { e.preventDefault(); var v = b.getAttribute('data-abrir').split(':'); abrir({ tipo: v[0], id: v[1] }, false, invocador); return; }
    var g = e.target.closest('[data-grande]');
    if (g) { e.preventDefault(); abrirLightbox(g.getAttribute('data-grande'), g.getAttribute('data-grande-v')); }
  });

  function icono(n) {
    var I = {
      ruta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/></svg>',
      afuera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
    };
    return I[n] || '';
  }
  function enlaceExterno(t, url) {
    var interno = /^(\.\.\/|casos\/)/.test(url);
    return '<a class="bp-btn" href="' + esc(url) + '"' + (interno ? '' : ' target="_blank" rel="noopener"') + '>' + esc(t) + (interno ? '' : '<span class="ico" aria-hidden="true">' + icono('afuera') + '</span><span class="sr">(se abre en otra pestaña)</span>') + '</a>';
  }
  function chipsEquipo(ids) {
    return '<ul class="equipo">' + ids.map(function (id) {
      var p = PERSONAL[id];
      return '<li><a href="#" data-abrir="actor:' + id + '">' + avatar(id) + '<span><b>' + esc(p.nombre) + '</b>' + esc(p.rol) + '</span></a></li>';
    }).join('') + '</ul>';
  }
  function vistaSala(id) {
    var zn = zonaPorId(id), b = zn.caja;
    var pts = [P(b[0], b[1], b[4] + .6), P(b[2], b[1], b[4] + .6), P(b[2], b[3], 0), P(b[0], b[3], 0), P(b[2], b[1], 0), P(b[0], b[1], 0)];
    var x0 = Math.min.apply(null, pts.map(function (p) { return p[0]; })) - 30, x1 = Math.max.apply(null, pts.map(function (p) { return p[0]; })) + 30;
    var y0 = Math.min.apply(null, pts.map(function (p) { return p[1]; })) - 20, y1 = Math.max.apply(null, pts.map(function (p) { return p[1]; })) + 20;
    var w = x1 - x0, h = w * 9 / 16, cy = (y0 + y1) / 2;
    return '<div class="media media-sala"><svg viewBox="' + [x0, cy - h / 2, w, h].map(Math.round).join(' ') + '" role="img" aria-label="Vista de la sala ' + esc(zn.nombre) + '"><use href="#escena-raiz"/></svg></div>';
  }
  function htmlMedia(pr) {
    if (!pr.media) return vistaSala(pr.id);
    return '<div class="media"><video class="panel-video" muted loop playsinline preload="none" poster="' + esc(pr.media.poster) + '" data-src="' + esc(pr.media.h) + '" aria-label="Video de ' + esc(pr.nombre) + '"></video>' +
      '<button type="button" class="media-grande" data-grande="' + esc(pr.media.h) + '" data-grande-v="' + esc(pr.media.v || '') + '">' + icono('play') + 'Ver con sonido</button></div>';
  }

  function htmlPersonaje(id) {
    var p = PERSONAL[id], proys = D.proyectos.filter(function (pr) { return pr.equipo.indexOf(id) > -1; });
    var fases = D.fases.filter(function (f) { return f.quien.indexOf(id) > -1; });
    var ahora = p.ahora[Math.floor(Math.random() * p.ahora.length)];
    return '<div class="ficha-hero"><svg class="ficha-pj" viewBox="-140 -275 280 290" role="img" aria-label="' + esc(p.nombre + ': ' + p.look) + '">' + E.svg(id) + '</svg>' +
      '<svg class="ficha-placa" viewBox="0 0 300 190" aria-hidden="true">' + E.placaTarjeta(p, true).replace('class="pj pj-', 'class="pj pj-retrato pj-') + '</svg></div>' +
      '<p class="bp-etiqueta">' + esc(p.rol) + ' · ' + p.fases.join(' · ') + '</p>' +
      '<h2 id="panel-titulo" tabindex="-1">' + esc(p.nombre) + '</h2>' +
      '<p class="lema">' + esc(p.lema) + '</p>' +
      '<p class="ahora"><span class="pulso" aria-hidden="true"></span>Ahora: ' + esc(ahora) + '</p>' +
      '<h3>Qué hace</h3><p>' + esc(p.resumen) + '</p>' +
      '<h3>Cómo es</h3><ul class="rasgos">' + p.rasgos.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
      '<blockquote class="frase">«' + esc(p.frase) + '»</blockquote>' +
      '<h3>En el motor</h3><ul class="fases-mini">' + fases.map(function (f) { return '<li><span class="cod">' + f.id + '</span>' + esc(f.nombre) + '</li>'; }).join('') + '</ul>' +
      (proys.length ? '<h3>Trabajó en</h3><ul class="chips">' + proys.map(function (pr) { return '<li><a href="#" data-abrir="zona:' + pr.id + '">' + esc(pr.nombre) + '</a></li>'; }).join('') + '</ul>' : '') +
      '<p class="look"><b>Cómo reconocerlo:</b> ' + esc(p.look) + '</p>';
  }

  function htmlZona(id) {
    if (PROYECTOS[id]) {
      var pr = PROYECTOS[id];
      return htmlMedia(pr) +
        '<p class="bp-etiqueta">' + esc(pr.rubro) + '</p>' +
        '<h2 id="panel-titulo" tabindex="-1">' + esc(pr.nombre) + '</h2>' +
        '<p class="lema">' + esc(pr.cliente) + ' · <span class="estado">' + esc(pr.estado) + '</span></p>' +
        '<p>' + esc(pr.resumen) + '</p>' +
        '<ul class="puntos">' + pr.puntos.map(function (x) { return '<li><b>' + esc(x[0]) + '</b>' + esc(x[1]) + '</li>'; }).join('') + '</ul>' +
        (pr.enlaces.length ? '<div class="acciones">' + pr.enlaces.map(function (l) { return enlaceExterno(l.texto, l.url); }).join('') + '</div>' : '') +
        (pr.nota ? '<p class="nota">' + esc(pr.nota) + '</p>' : '') +
        '<h3>Quién trabajó aquí</h3>' + chipsEquipo(pr.equipo);
    }
    var cta = '<a class="bp-btn" href="' + esc(D.cta.url) + '" target="_blank" rel="noopener">Escríbenos por WhatsApp<span class="ico" aria-hidden="true">' + icono('afuera') + '</span><span class="sr">(se abre en otra pestaña)</span></a>';
    if (id === 'recepcion') {
      return '<div class="media"><video class="panel-video" muted loop playsinline preload="none" poster="../assets/casos/teaser-biplot-h.jpg" data-src="../assets/casos/teaser-biplot-h.mp4" aria-label="Teaser de BiPlot"></video>' +
        '<button type="button" class="media-grande" data-grande="../assets/casos/teaser-biplot-h.mp4" data-grande-v="../assets/casos/teaser-biplot-v.mp4">' + icono('play') + 'Ver con sonido</button></div>' +
        '<p class="bp-etiqueta">Recepción</p><h2 id="panel-titulo" tabindex="-1">Pasa, esta es la oficina</h2>' +
        '<p>Somos dos socios. Detrás hay un equipo de siete: cada uno lleva una parte del trabajo, desde el primer diagnóstico hasta guardar lo que sirve para el próximo cliente.</p>' +
        '<p>Aquí te recibe Lupe. Antes de hablar de software, pregunta cómo trabajas hoy.</p>' +
        chipsEquipo(['lupe']) +
        '<h3>Cómo moverte</h3><ul class="rasgos"><li>Arrastra para moverte y usa la rueda o los botones para acercarte.</li><li>Toca a alguien del personal o una sala para ver más.</li><li>Con teclado: el menú «Recorre la oficina», las flechas y las teclas + y −.</li></ul>';
    }
    if (id === 'sala-e1') {
      return vistaSala('sala-e1') + '<p class="bp-etiqueta">Sala E1 · Cómo trabajamos</p><h2 id="panel-titulo" tabindex="-1">Diez fases, siete especialistas</h2>' +
        '<p>Todo proyecto pasa por el mismo motor. Primero entendemos tu negocio. Después elegimos lo justo. A veces la respuesta no es más software.</p>' +
        '<ol class="motor">' + D.fases.map(function (f) {
          return '<li><span class="cod">' + f.id + '</span><div><b>' + esc(f.nombre) + '</b><span>' + esc(f.texto) + '</span></div><span class="quien">' +
            f.quien.map(function (q) { return '<a href="#" data-abrir="actor:' + q + '" title="' + esc(PERSONAL[q].nombre) + '">' + avatar(q) + '<span class="sr">' + esc(PERSONAL[q].nombre) + '</span></a>'; }).join('') + '</span></li>';
        }).join('') + '</ol>' +
        '<p class="nota">Tú hablas con los socios. Ellos arman el proyecto contigo y se lo pasan al equipo.</p>';
    }
    if (id === 'socios') {
      return vistaSala('socios') + '<p class="bp-etiqueta">Oficina de los socios</p><h2 id="panel-titulo" tabindex="-1">Aquí te atienden los socios</h2>' +
        '<p>Los socios no salen en los dibujos: los conoces en persona. Son tus jefes de proyecto. Arman el proyecto contigo, se lo pasan al equipo y responden por el resultado.</p>' +
        '<ul class="puntos"><li><b>Parte con 45 minutos</b>una conversación sin costo para ver si tiene sentido trabajar juntos</li>' +
        '<li><b>Después, el diagnóstico</b>tu proceso real, lo que te cuesta en horas y pesos, y por dónde partir</li>' +
        '<li><b>Un solo interlocutor</b>no tienes que hablar con siete: el equipo trabaja detrás</li></ul>' +
        '<div class="acciones">' + cta + '</div>';
    }
    if (id === 'estanteria') {
      return vistaSala('estanteria') + '<p class="bp-etiqueta">Estantería del núcleo</p><h2 id="panel-titulo" tabindex="-1">Lo que ya sabemos hacer</h2>' +
        '<p>Aquí Pepa guarda lo que sirvió en un proyecto y le sirve al siguiente. Por eso cada sistema nuevo parte con ventaja.</p>' +
        '<h3>Casos de referencia</h3><ul class="casos">' + D.casos.map(function (c) {
          return '<li><span class="num">' + c.num + '</span><div><b>' + esc(c.nombre) + '</b><span class="rubro">' + esc(c.rubro) + ' · ' + esc(c.camino) + '</span><p>' + esc(c.hallazgo) + '</p>' +
            '<p class="links"><a href="' + esc(c.demo) + '">Ver la demo</a> · <a href="' + esc(c.caso) + '">Leer el caso</a></p></div></li>';
        }).join('') + '</ul><p class="nota">Son negocios ilustrativos, armados sobre la operación real de empresas de ese tamaño. No son clientes.</p>' +
        '<h3>También en la estantería</h3><ul class="otros">' + D.estanteria.map(function (x) { return '<li>' + enlaceExterno(x.texto, x.url) + '<span>' + esc(x.detalle) + '</span></li>'; }).join('') + '</ul>' +
        chipsEquipo(['pepa']);
    }
    if (id === 'muro') {
      return '<p class="bp-etiqueta">Muro del personal</p><h2 id="panel-titulo" tabindex="-1">El personal</h2>' +
        '<p>Siete especialistas, uno por parte del trabajo. Los reconoces por su placa: la fase del motor que llevan.</p>' +
        '<ul class="muro">' + E.ids.map(function (i) { var p = PERSONAL[i]; return '<li><a href="#" data-abrir="actor:' + i + '">' + avatar(i) + '<b>' + esc(p.nombre) + '</b><span>' + esc(p.rol) + '</span><span class="placa-mini">' + p.placa + '</span></a></li>'; }).join('') + '</ul>';
    }
    return '';
  }

  /* ── Videos ── */
  function activarMedios() {
    var v = panelCuerpo.querySelector('video.panel-video'); if (!v) return;
    v.src = v.getAttribute('data-src');
    var auto = !reducido && window.innerWidth >= 900 && !(navigator.connection && navigator.connection.saveData);
    if (auto) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.setAttribute('controls', '');
  }
  function detenerMedios() { var v = panelCuerpo.querySelector('video'); if (v) { v.pause(); v.removeAttribute('src'); v.load(); } }
  var lightbox = $('#lightbox'), lbVideo = $('#lightbox video');
  function abrirLightbox(h, v) {
    lbVideo.src = (v && window.innerHeight > window.innerWidth) ? v : h;
    lightbox.hidden = false; lbVideo.muted = false;
    var pr = lbVideo.play(); if (pr && pr.catch) pr.catch(function () {});
    $('#lightbox-cerrar').focus();
  }
  function cerrarLightbox() { lbVideo.pause(); lbVideo.removeAttribute('src'); lbVideo.load(); lightbox.hidden = true; var b = panelCuerpo.querySelector('.media-grande'); if (b) b.focus(); }
  $('#lightbox-cerrar').addEventListener('click', cerrarLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) cerrarLightbox(); });

  /* ── Recorrido guiado ── */
  var GUIA = [
    ['zona', 'recepcion', 'Recepción', 'Entras y te recibe Lupe. Antes de hablar de software, pregunta cómo trabajas hoy.'],
    ['zona', 'sala-e1', 'Sala E1', 'Aquí se hace el diagnóstico: el proceso real, los dolores en horas y pesos, y la línea base contra la que se mide todo.'],
    ['actor', 'celda', 'Celda · Datos', 'Abre tus planillas y exportaciones, encuentra lo que no cuadra y deja los datos listos.'],
    ['actor', 'grilla', 'Grilla · Diseño', 'Dibuja la maqueta antes de construir, para que la pruebes con tu equipo.'],
    ['actor', 'bucle', 'Bucle · Desarrollo', 'Construye por rebanadas: entregas cortas que funcionan solas.'],
    ['actor', 'tamandua', 'Tamandúa · Validación', 'Prueba todo en cuatro pantallas y con cada perfil antes de que llegue a ti.'],
    ['actor', 'faro', 'Faro · Puesta en marcha', 'Sube cada entrega a producción y enseña a usarla.'],
    ['zona', 'estanteria', 'Estantería del núcleo', 'Pepa guarda aquí lo que sirve para el próximo cliente. También están los casos de referencia.'],
    ['zona', 'nuhome', 'Sala Nu Home 360', 'Casas modulares: del primer contacto a la entrega, en una sola plataforma.'],
    ['zona', 'fundos', 'Sala Fundos 360', 'Venta de parcelas: contacto, reserva, escritura y posventa, conectados.'],
    ['zona', 'haru', 'Sala Haru Isidora', 'Un restaurante con ventas, cocina, delivery y caja en un solo sistema.'],
    ['zona', 'eleven', 'Sala Eleven Club', 'Una propuesta para que un gimnasio gane socios y los retenga.'],
    ['zona', 'rumbo', 'Sala Rumbo', 'Nuestra app para ordenar la vida personal.'],
    ['zona', 'socios', 'Oficina de los socios', 'Y aquí te atienden los socios. ¿Conversamos?']
  ];
  var guia = $('#guia'), pasoGuia = 0;
  function iniciarGuia(i) {
    if (!panel.hidden) { detenerMedios(); panel.hidden = true; }
    cerrarIntro();
    guia.hidden = false; mostrarPaso(i || 0);
    $('#guia-sig').focus({ preventScroll: true });
  }
  function mostrarPaso(i) {
    pasoGuia = Math.max(0, Math.min(GUIA.length - 1, i));
    var g = GUIA[pasoGuia], obj = { tipo: g[0], id: g[1] };
    $('#guia-n').textContent = (pasoGuia + 1) + ' de ' + GUIA.length;
    $('#guia-t').textContent = g[2];
    $('#guia-txt').textContent = g[3];
    $('#guia-ant').disabled = pasoGuia === 0;
    $('#guia-sig').textContent = pasoGuia === GUIA.length - 1 ? 'Terminar' : 'Siguiente';
    resaltar(obj);
    requestAnimationFrame(function () { irA(obj, 900); });
  }
  function terminarGuia() { guia.hidden = true; resaltar(null); verTodo(); }
  $('#guia-ant').addEventListener('click', function () { mostrarPaso(pasoGuia - 1); });
  $('#guia-sig').addEventListener('click', function () { if (pasoGuia === GUIA.length - 1) terminarGuia(); else mostrarPaso(pasoGuia + 1); });
  $('#guia-mas').addEventListener('click', function () { var g = GUIA[pasoGuia]; guia.hidden = true; abrir({ tipo: g[0], id: g[1] }, false, $('#recorrer-toggle')); });
  $('#guia-salir').addEventListener('click', terminarGuia);

  /* ── Bienvenida ── */
  var intro = $('#intro');
  function cerrarIntro() { if (!intro.hidden) { intro.hidden = true; guardar('visto', '1'); } }
  $('#intro-guia').addEventListener('click', function () { iniciarGuia(0); });
  $('#intro-libre').addEventListener('click', function () { cerrarIntro(); encuadreInicial(true); escenaEl.focus({ preventScroll: true }); });
  if (leer('visto') === '1') intro.hidden = true;

  /* ── Inicio ── */
  if (window.innerWidth < 900 || leer('menu') === '0') alternarMenu(false);
  window.addEventListener('resize', function () { aplicar(); });
  if (leer('pausa') === '1' || reducido) pausar(true); else esc3.iniciar();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) esc3.detener(); else if (!document.documentElement.classList.contains('oficina-quieta')) esc3.iniciar();
  });
  // Encuadre inicial: toda la oficina en escritorio; la recepción en celular.
  function encuadreInicial(animar) {
    if (window.innerWidth < 700) { var p = P(19.5, 15.5, 0.8); volar(p[0], p[1], zPara(620), animar ? 600 : 0); }
    else verTodo(animar ? 600 : 0);
  }
  requestAnimationFrame(function () { encuadreInicial(false); document.documentElement.classList.add('lista'); });
  // Enlace directo: oficina/#nuhome o #lupe
  function desdeHash() {
    var h = decodeURIComponent(location.hash.replace('#', '')); if (!h) return;
    if (PERSONAL[h]) abrir({ tipo: 'actor', id: h }); else if (zonaPorId(h)) abrir({ tipo: 'zona', id: h });
  }
  setTimeout(desdeHash, 60);
  window.addEventListener('hashchange', desdeHash);
})();
