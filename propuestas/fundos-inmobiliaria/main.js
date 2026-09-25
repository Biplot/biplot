(function () {
  "use strict";

  /* =============================================================
     Fundos Inmobiliaria — interacciones
     Todo el contenido crítico está en el HTML; este archivo solo lo enriquece.
     Datos: lib/manifest.js (window.__BRAND__)
     ============================================================= */

  var B = window.__BRAND__ || {};
  var contacto = B.contacto || {};
  var proyectos = B.proyectos || [];
  var RESERVA = B.reserva || 1000000;

  var mm = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {} }; };
  var reduced = mm("(prefers-reduced-motion: reduce)").matches;
  var fineHover = mm("(hover: hover) and (pointer: fine)").matches;
  var desktop = mm("(min-width: 960px)");

  /* ---------- Utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); } }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function miles(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function clp(n) { return "$" + miles(n); }
  function m2(n) { return miles(n) + " m²"; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pct(n) { return String(n).replace(".", ",") + "\u00A0%"; }
  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }
  function waHref(text) {
    return "https://wa.me/" + (contacto.whatsapp || "") + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function proyecto(id) {
    for (var i = 0; i < proyectos.length; i++) if (proyectos[i].id === id) return proyectos[i];
    return null;
  }
  function disponibles(p) { return (p && p.lotes || []).filter(function (l) { return l.estado === "disponible"; }); }
  function desde(p) {
    var d = disponibles(p);
    return d.length ? Math.min.apply(null, d.map(function (l) { return l.precio; })) : 0;
  }
  var ESTADO = { disponible: "Disponible", reservada: "Reservado", vendida: "Vendido" };

  // El precio de cada lote sale de su categoría (colores del masterplan)
  proyectos.forEach(function (p) {
    var cats = p.categorias || {};
    (p.lotes || []).forEach(function (l) {
      var c = cats[l.cat];
      l.precio = c ? c.precio : null;
      l.lista = c && c.lista ? c.lista : null;
      l.m2 = l.m2 || 5000;
    });
  });
  function precioTxt(l) { return l.precio ? clp(l.precio) : "Vendido"; }

  function paintRange(input) {
    var min = +input.min || 0, max = +input.max || 100, v = +input.value;
    input.style.setProperty("--p", ((v - min) / ((max - min) || 1) * 100) + "%");
  }

  // Favoritos: solo en este navegador (comodidad personal, no dato crítico)
  var FKEY = "fundos-favoritos";
  function loadFavs() {
    try {
      var v = JSON.parse(window.localStorage.getItem(FKEY) || "[]");
      return Array.isArray(v) ? v.filter(function (k) { return typeof k === "string"; }) : [];
    } catch (e) { return []; }
  }
  function saveFavs(list) { try { window.localStorage.setItem(FKEY, JSON.stringify(list)); } catch (e) { /* sin almacenamiento */ } }

  // API compartida entre módulos (se completa en cada init)
  var Visit = { prefill: function () {} };
  var Plan = { apply: function () {}, show: function () {} };
  var Sim = { set: function () {} };
  var Tour = { open: function () {} };
  var Video = { open: function () {} };

  /* =============================================================
     Contacto: un solo lugar para número, correo y horario
     ============================================================= */
  function initContact() {
    var msg = "Hola Fundos, quiero información sobre sus parcelas.";
    $$("[data-wa]").forEach(function (a) { a.href = waHref(a.getAttribute("data-wa-msg") || msg); });
    if (contacto.whatsappVisible) $$("[data-wa-visible]").forEach(function (a) { a.textContent = contacto.whatsappVisible; });
    if (contacto.email) $$("[data-email]").forEach(function (a) { a.href = "mailto:" + contacto.email; a.textContent = contacto.email; });
    if (contacto.horario) $$("[data-horario]").forEach(function (p) { p.textContent = contacto.horario; });
  }

  /* =============================================================
     Navegación + menú móvil
     ============================================================= */
  function initNav() {
    var nav = $("[data-nav]");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-solid", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Sección actual en el menú
    var links = $$(".nav-links a");
    if ("IntersectionObserver" in window && links.length) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-current"); });
          if (byId[en.target.id]) byId[en.target.id].classList.add("is-current");
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }

    // Menú móvil (dialog nativo: foco atrapado y Esc gratis)
    var menu = $("#menu"), openBtn = $("[data-menu-open]");
    if (!menu || !openBtn) return;
    var open = function () {
      if (typeof menu.showModal === "function") menu.showModal(); else menu.setAttribute("open", "");
      openBtn.setAttribute("aria-expanded", "true");
    };
    var close = function () {
      if (typeof menu.close === "function") menu.close(); else menu.removeAttribute("open");
      openBtn.setAttribute("aria-expanded", "false");
    };
    openBtn.addEventListener("click", open);
    $$("[data-menu-close], [data-menu-link]", menu).forEach(function (b) { b.addEventListener("click", close); });
    menu.addEventListener("close", function () { openBtn.setAttribute("aria-expanded", "false"); });
    desktop.addEventListener && desktop.addEventListener("change", function (e) { if (e.matches && menu.open) close(); });
  }

  /* =============================================================
     Apariciones al hacer scroll (umbral bajo + red de seguridad)
     ============================================================= */
  function initReveals() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () {
      els.forEach(function (e) {
        if (!e.classList.contains("is-visible") && e.getBoundingClientRect().top < window.innerHeight) e.classList.add("is-visible");
      });
    }, 6000);

    var visit = $(".visit");
    if (visit) {
      var io2 = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { visit.classList.add("is-drawn"); io2.disconnect(); }
      }, { threshold: 0.05 });
      io2.observe(visit);
    }
  }

  /* =============================================================
     Hero: el paisaje se mueve por capas (cursor + scroll)
     ============================================================= */
  function initHero() {
    var hero = $("[data-hero]");
    if (!hero || reduced) return;
    var svg = $(".hero-scene", hero), inner = $(".hero-inner", hero);
    var layers = $$(".layer", svg).map(function (g) { return { g: g, d: parseFloat(g.getAttribute("data-depth")) || 0 }; });
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = true, lastY = -1;

    if (fineHover) {
      hero.addEventListener("pointermove", function (e) {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        kick();
      });
      hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
    }
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(hero);
    }

    function kick() { if (!raf && visible) raf = window.requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      var sy = Math.max(0, window.scrollY);
      var k = 900 / ((svg.getBoundingClientRect().height) || 900); // px → unidades del viewBox
      layers.forEach(function (L) {
        var x = -cx * L.d * 38;
        var y = -cy * L.d * 10 + sy * (1 - L.d) * 0.3 * k;
        L.g.setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ")");
      });
      if (inner) {
        inner.style.transform = "translate3d(0," + (sy * -0.12).toFixed(1) + "px,0)";
        inner.style.opacity = String(clamp(1 - sy / (hero.offsetHeight * 0.8), 0, 1));
      }
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 || sy !== lastY) { lastY = sy; kick(); }
    }
    kick();
  }

  /* =============================================================
     Tarjetas de proyecto
     ============================================================= */
  function initProjects() {
    // Cifras siempre sincronizadas con los datos
    proyectos.forEach(function (p) {
      var card = $('.project[data-project="' + p.id + '"]');
      if (!card || p.estado !== "venta") return;
      var badge = $(".badge", card), dd = $(".facts div:first-child dd", card);
      if (badge) badge.textContent = disponibles(p).length + " disponibles";
      if (dd && desde(p)) dd.textContent = clp(desde(p));
    });

    if (fineHover) {
      $$(".project").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((((e.clientX - r.left) / r.width) - 0.5) * 2).toFixed(3));
        });
        card.addEventListener("pointerleave", function () { card.style.setProperty("--mx", "0"); });
      });
    }

    $$("[data-goto-plan]").forEach(function (a) {
      a.addEventListener("click", function () { Plan.show(a.getAttribute("data-goto-plan")); });
    });
    $$("[data-preventa]").forEach(function (a) {
      a.addEventListener("click", function () {
        var p = proyecto(a.getAttribute("data-preventa"));
        Visit.prefill({ proyecto: p ? p.nombre : "", mensaje: "Quiero inscribirme en la preventa de " + (p ? p.nombre : "su próximo proyecto") + "." });
      });
    });
  }

  /* =============================================================
     Buscador del hero
     ============================================================= */
  function initFinder() {
    var form = $("[data-finder]");
    if (!form) return;
    var dest = $("#f-destino", form), bud = $("#f-presupuesto", form);
    var count = $("[data-finder-count]", form), label = $("[data-finder-label]", form), cta = $("[data-finder-cta]", form);

    function matches(p, max) {
      return disponibles(p).filter(function (l) { return l.precio <= max; }).length;
    }
    function result() {
      var id = dest.value, max = +bud.value || Infinity;
      var p = proyecto(id);
      if (p && p.estado === "preventa") return { preventa: p };
      var list = id === "todos" ? proyectos.filter(function (x) { return x.estado === "venta"; }) : [p];
      var best = null, bestN = -1, total = 0;
      list.forEach(function (x) {
        if (!x) return;
        var n = matches(x, max);
        total += n;
        if (n > bestN) { bestN = n; best = x; }
      });
      return { n: total, max: max, target: best };
    }
    function countTo(to) {
      var from = parseInt(count.textContent, 10) || 0;
      if (reduced || from === to) { count.textContent = to; return; }
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 420);
        count.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) window.requestAnimationFrame(step);
      })(t0);
    }
    function update() {
      var r = result();
      if (r.preventa) {
        count.hidden = true;
        label.textContent = "Preventa abierta: recibe el plano y los precios antes que nadie.";
        cta.textContent = "Inscribirme";
        return;
      }
      count.hidden = false;
      countTo(r.n);
      if (r.n === 0) label.textContent = "sin parcelas en ese rango. Prueba otro presupuesto.";
      else label.textContent = (r.n === 1 ? "parcela disponible" : "parcelas disponibles") + (r.max < Infinity ? " en tu presupuesto" : " hoy");
      cta.textContent = r.n === 0 ? "Ver el plano" : "Ver parcelas";
    }
    dest.addEventListener("change", update);
    bud.addEventListener("change", update);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = result();
      if (r.preventa) {
        Visit.prefill({ proyecto: r.preventa.nombre, mensaje: "Quiero inscribirme en la preventa de " + r.preventa.nombre + "." });
        scrollToEl($("#visita"));
        return;
      }
      if (r.target) Plan.apply({ id: r.target.id, max: r.max, soloDisponibles: r.n > 0 });
      scrollToEl($("#plano"));
    });
    update();
  }

  /* =============================================================
     Plano interactivo de lotes
     ============================================================= */
  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  // Curva suave (Catmull-Rom) que pasa por los puntos de control
  function spline(pts, seg) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
      for (var k = 0; k < seg; k++) {
        var t = k / seg, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(function (j) {
          return 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
        }));
      }
    }
    out.push(pts[pts.length - 1].slice());
    return out;
  }
  function track(ctrl) {
    var P = spline(ctrl, 40), cum = [0];
    for (var i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    var L = cum[cum.length - 1];
    function at(s) {
      s = clamp(s, 0, L);
      var lo = 0, hi = cum.length - 1;
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
      var t = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1);
      return [P[lo][0] + (P[hi][0] - P[lo][0]) * t, P[lo][1] + (P[hi][1] - P[lo][1]) * t];
    }
    function offset(s, d) {
      var a = at(s - 3), b = at(s + 3), p = at(s);
      var tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
      return [p[0] - (ty / m) * d, p[1] + (tx / m) * d];
    }
    return { L: L, at: at, offset: offset, points: P };
  }
  function pathD(pts, close) {
    return "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + (close ? "Z" : "");
  }

  function geometry(p) {
    var cfg = p.plano, R = rng(hash(p.id));
    var road = track(cfg.camino);
    var out = { road: road, lots: [], tags: [] };
    var idx = 0;
    cfg.filas.forEach(function (fila, fi) {
      var s0 = 46, s1 = road.L - 34, n = fila.lotes, ws = [], sum = 0, i;
      for (i = 0; i < n; i++) { var w = 0.86 + R() * 0.28; ws.push(w); sum += w; }
      var edges = [s0], acc = s0;
      for (i = 0; i < n; i++) { acc += (s1 - s0) * ws[i] / sum; edges.push(acc); }
      var phase = R() * 6.28;
      var far = function (s) { return fila.hasta * (1 + 0.07 * Math.sin(s / 64 + phase)); };
      for (i = 0; i < n; i++) {
        var l = p.lotes[idx++];
        if (!l) continue;
        var a = edges[i], b = edges[i + 1], near = [], farPts = [];
        for (var k = 0; k <= 6; k++) {
          var s = a + (b - a) * k / 6;
          near.push(road.offset(s, fila.lado * fila.desde));
          farPts.push(road.offset(s, fila.lado * far(s)));
        }
        var poly = near.concat(farPts.slice().reverse());
        var cx = 0, cy = 0, fx = 0, fy = 0;
        poly.forEach(function (q) { cx += q[0]; cy += q[1]; });
        farPts.forEach(function (q) { fx += q[0]; fy += q[1]; });
        cx /= poly.length; cy /= poly.length; fx /= farPts.length; fy /= farPts.length;
        out.lots.push({ l: l, d: pathD(poly, true), cx: cx, cy: cy, dx: cx + (fx - cx) * 0.6, dy: cy + (fy - cy) * 0.6 });
      }
      var tp = road.offset((s0 + s1) / 2, fila.lado * (fila.hasta + 26));
      out.tags.push({ x: tp[0], y: tp[1], t: p.sectores[fi] || "" });
    });
    return out;
  }

  function wavy(y0, amp, f, ph) {
    var pts = [];
    for (var x = -20; x <= 1020; x += 20) pts.push([x, y0 + amp * Math.sin(x / f + ph) + amp * 0.45 * Math.sin(x / (f * 0.43) + ph * 1.7)]);
    return pathD(pts, false);
  }
  function blob(cx, cy, r, ph) {
    var pts = [];
    for (var i = 0; i < 48; i++) {
      var a = i / 48 * Math.PI * 2;
      var rr = r * (1 + 0.09 * Math.sin(3 * a + ph) + 0.05 * Math.sin(5 * a + ph * 2));
      pts.push([cx + Math.cos(a) * rr * 1.35, cy + Math.sin(a) * rr]);
    }
    return pathD(pts, true);
  }

  function baseLayers(p, R) {
    var s = [], i;
    if (p.plano.tipo === "rio") {
      for (i = 0; i < 7; i++) s.push('<path class="pl-contour' + (i % 3 === 0 ? " strong" : "") + '" d="' + wavy(40 + i * 95 + R() * 20, 10 + R() * 12, 90 + R() * 60, R() * 6) + '"/>');
      var rio = track(p.plano.rio), rd = pathD(rio.points, false);
      s.push('<path id="rio-path" class="pl-water" stroke-width="48" d="' + rd + '"/>');
      s.push('<path class="pl-water" stroke-width="30" style="stroke:#DEE5DB" d="' + rd + '"/>');
      s.push('<path class="pl-water-line" d="' + rd + '"/>');
      s.push('<text class="pl-label pl-label-water" dy="7"><textPath href="#rio-path" xlink:href="#rio-path" startOffset="24%">Río Lolén</textPath></text>');
      // Bosque: punteado más denso hacia el borde, como en un plano grabado
      s.push('<g class="pl-forest">');
      for (i = 0; i < 260; i++) {
        var fy = 528 + Math.pow(R(), 0.7) * 118;
        s.push('<circle cx="' + (R() * 1010 - 5).toFixed(0) + '" cy="' + fy.toFixed(0) + '" r="' + (2.6 + R() * 4.6).toFixed(1) + '" fill-opacity="' + (0.1 + R() * 0.2).toFixed(2) + '"/>');
      }
      for (i = 0; i < 70; i++) s.push('<circle cx="' + (R() * 1010 - 5).toFixed(0) + '" cy="' + (R() * 24).toFixed(0) + '" r="' + (2.4 + R() * 3.8).toFixed(1) + '" fill-opacity="' + (0.1 + R() * 0.16).toFixed(2) + '"/>');
      s.push("</g>");
      s.push('<text class="pl-label" x="560" y="604" text-anchor="middle">Bosque nativo</text>');
    } else {
      s.push('<g>');
      [[820, 560, 5, 34, 1.2], [170, 120, 4, 30, 2.4], [600, 70, 3, 26, 0.6]].forEach(function (h) {
        for (var j = 1; j <= h[2]; j++) s.push('<path class="pl-contour' + (j === h[2] ? " strong" : "") + '" d="' + blob(h[0], h[1], h[3] * j, h[4] + j * 0.3) + '"/>');
      });
      for (i = 0; i < 3; i++) s.push('<path class="pl-contour" d="' + wavy(250 + i * 150 + R() * 30, 12 + R() * 10, 110 + R() * 40, R() * 6) + '"/>');
      s.push("</g>");
      s.push('<clipPath id="vz1"><path d="M0 0H330V40Q230 140 100 186L0 214Z"/></clipPath>');
      s.push('<clipPath id="vz2"><path d="M690 640H1000V452Q900 470 820 520Q750 575 690 640Z"/></clipPath>');
      var lines = [];
      for (i = -30; i < 80; i++) lines.push("M" + (i * 15) + " 0L" + (i * 15 - 160) + " 640");
      s.push('<g class="pl-vines" clip-path="url(#vz1)"><path d="' + lines.join("") + '"/></g>');
      s.push('<g class="pl-vines" clip-path="url(#vz2)"><path d="' + lines.join("") + '"/></g>');
      s.push('<g class="pl-mirador"><circle cx="600" cy="84" r="5" fill="#7A5D33"/><text class="pl-label" x="614" y="90">Mirador</text></g>');
    }
    return s.join("");
  }

  function svgString(p, g) {
    var R = rng(hash(p.id + ":fondo"));
    var s = [];
    s.push('<svg class="plan-svg" viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="group" aria-label="Plano de lotes de ' + esc(p.nombre) + '">');
    s.push('<defs><pattern id="lot-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#ECE6DB"/><rect width="2.4" height="7" fill="#C9C0B0"/></pattern></defs>');
    s.push('<rect class="pl-paper" width="1000" height="640"/>');
    s.push(baseLayers(p, R));
    var rd = pathD(g.road.points, false);
    s.push('<path class="pl-road-casing" d="' + rd + '"/><path class="pl-road" d="' + rd + '"/><path class="pl-road-mid" d="' + rd + '"/>');
    var st = g.road.at(0);
    s.push('<rect class="pl-gate" x="' + (st[0] - 7).toFixed(1) + '" y="' + (st[1] - 7).toFixed(1) + '" width="14" height="14" rx="2"/>');

    s.push('<g class="lots">');
    g.lots.forEach(function (o) {
      var l = o.l;
      var aria = "Lote " + l.n + ", " + ESTADO[l.estado].toLowerCase() + ", " + m2(l.m2) + ", " + clp(l.precio) + (p.sectores[l.sector] ? ", " + p.sectores[l.sector] : "");
      s.push('<path class="lot st-' + l.estado + '" data-n="' + l.n + '" tabindex="0" role="button" aria-label="' + esc(aria) + '" d="' + o.d + '"/>');
    });
    s.push("</g>");
    s.push('<path class="lot-ring" d="M0 0" style="display:none"/>');
    s.push('<g aria-hidden="true">');
    g.lots.forEach(function (o) {
      s.push('<text class="lot-num' + (o.l.estado === "vendida" ? " on-dark" : "") + '" data-n="' + o.l.n + '" x="' + o.cx.toFixed(1) + '" y="' + o.cy.toFixed(1) + '">' + o.l.n + "</text>");
      s.push('<circle class="lot-fav" data-n="' + o.l.n + '" cx="' + o.dx.toFixed(1) + '" cy="' + o.dy.toFixed(1) + '" r="6.5"/>');
    });
    s.push('<text class="pl-tag" transform="translate(' + (st[0] - 20).toFixed(1) + " " + st[1].toFixed(1) + ') rotate(-90)" text-anchor="middle">Acceso</text>');
    g.tags.forEach(function (t) {
      if (t.t) s.push('<text class="pl-tag pl-sector" x="' + t.x.toFixed(1) + '" y="' + t.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle">' + esc(t.t) + "</text>");
    });
    s.push("</g>");
    s.push('<g class="pl-compass" transform="translate(952 52)" aria-hidden="true"><circle r="19"/><path d="M0 -13L5 5L0 2L-5 5Z"/><text y="-25">N</text></g>');
    s.push('<g transform="translate(852 610)" aria-hidden="true"><rect x="-12" y="-24" width="136" height="38" rx="6" fill="#F7F5F0" fill-opacity=".92"/><path class="pl-scale" d="M0 -2V4H71V-2M35.5 4V0"/><text class="pl-scale-t" x="82" y="5">50 m</text></g>');
    s.push("</svg>");
    return s.join("");
  }

  /* ---- Formato estándar de planos Fundos (igual para todos los proyectos) ----
     Solo cambian la geometría (lib/planos.js) y las categorías de precio (lib/manifest.js). */
  var PLANO = {
    predio: "#A2A3A1",     // base del predio bajo los lotes
    vendida: "#A8A8A8",    // lotes vendidos
    marcaVendida: "V",     // marca de vendido, como en los masterplan
    agua: "#3E9FD6"
  };
  // Radio de los números según el tamaño típico de lote del plano (legibles sin tapar el lote)
  function badgeR(lots) {
    var dims = lots.map(function (o) {
      var v = (o.d.match(/-?\d+(\.\d+)?/g) || []).map(Number), xs = [], ys = [];
      for (var i = 0; i + 1 < v.length; i += 2) { xs.push(v[i]); ys.push(v[i + 1]); }
      return Math.min(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys));
    }).sort(function (a, b) { return a - b; });
    var q = dims[Math.floor(dims.length * 0.25)] || 44;
    return clamp(q * 0.34, 10, 16);
  }
  function tituloPrecios(p) {
    var cats = p.categorias || {};
    return Object.keys(cats).some(function (k) { return cats[k].lista; }) ? "Precio oferta" : "Precios";
  }
  // Plano con el lenguaje de los masterplan de Fundos: terreno, colores por precio, vendidas y números
  function svgPlan(p) {
    var P = (B.planos || {})[p.id], vb, lots, calles, agua = [], camino = "", contorno = null;
    if (P) {
      vb = P.viewBox;
      lots = [];
      p.lotes.forEach(function (l) { var q = P.lotes[l.n]; if (q) lots.push({ l: l, d: q.d, cx: q.l[0], cy: q.l[1] }); });
      calles = P.calles || []; agua = P.agua || []; camino = P.caminoPrincipal || ""; contorno = P.contorno;
    } else {
      var g = geometry(p);
      vb = [0, 0, 1000, 640];
      lots = g.lots.map(function (o) { return { l: o.l, d: o.d, cx: o.cx, cy: o.cy }; });
      calles = [{ tipo: "eje", d: pathD(g.road.points, false) }];
    }
    var R = badgeR(lots), FS = +(R * 0.84).toFixed(1), SUB = +(R * 0.62).toFixed(1);
    var cats = p.categorias || {};
    var s = [];
    s.push('<svg class="plan-svg" viewBox="' + vb.join(" ") + '" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Plano de lotes de ' + esc(p.nombre) + '">');
    s.push('<defs>' +
      '<filter id="pl-terreno" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="4"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.17  0 0 0 0 0.09  1.4 0 0 0 -0.45"/></filter>' +
      '<filter id="pl-grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 0.9 -0.42"/></filter>' +
      '<filter id="pl-sombra" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".45"/></filter>' +
      '<pattern id="lot-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#E9E3D7" fill-opacity=".85"/><rect width="2.6" height="7" fill="#8C8474"/></pattern>' +
      (contorno ? '<clipPath id="pl-predio"><path d="' + contorno + '"/></clipPath>' : "") + "</defs>");
    var full = 'x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '"';
    s.push('<rect ' + full + ' fill="#1A2317"/><rect ' + full + ' filter="url(#pl-terreno)" opacity=".9"/>');
    // Predio: base uniforme con sombra suave y borde, igual en todos los planos
    if (contorno) s.push('<path class="pl-predio" d="' + contorno + '" filter="url(#pl-sombra)"/>');
    s.push('<g' + (contorno ? ' clip-path="url(#pl-predio)"' : "") + '><rect ' + full + ' fill="' + PLANO.predio + '"/><rect ' + full + ' filter="url(#pl-grano)" opacity=".35"/></g>');
    s.push('<g class="lots">');
    lots.forEach(function (o) {
      var l = o.l, c = cats[l.cat];
      var fill = l.estado === "vendida" ? PLANO.vendida : (c ? c.color : "#C8A165");
      var aria = "Lote " + l.n + ", " + ESTADO[l.estado].toLowerCase() + (l.precio ? ", " + clp(l.precio) : "") + ", " + m2(l.m2);
      s.push('<path class="lot st-' + l.estado + '" style="--c:' + fill + '" data-n="' + l.n + '" tabindex="0" role="button" aria-label="' + esc(aria) + '" d="' + o.d + '"/>');
    });
    s.push("</g>");
    s.push('<g class="pl-hatch" aria-hidden="true">');
    lots.forEach(function (o) { if (o.l.estado === "reservada") s.push('<path d="' + o.d + '" fill="url(#lot-hatch)" opacity=".75"/>'); });
    s.push("</g>");
    s.push('<g aria-hidden="true">');
    agua.forEach(function (a) { s.push('<path class="pl-agua" d="' + a.d + '" fill-rule="evenodd" fill="' + PLANO.agua + '"/>'); });
    // Todas las vías con el mismo lenguaje: servidumbres en arena con borde punteado
    calles.forEach(function (k) {
      if (k.tipo === "servidumbre") s.push('<path class="pl-servidumbre" d="' + k.d + '" fill-rule="evenodd"/>');
      else s.push('<path class="pl-via-borde" d="' + k.d + '"/><path class="pl-via" d="' + k.d + '"/>');
    });
    if (camino) s.push('<path class="pl-principal-borde" d="' + camino + '"/><path class="pl-principal" d="' + camino + '"/>');
    if (contorno) s.push('<path class="pl-limite" d="' + contorno + '"/>');
    s.push("</g>");
    s.push('<path class="lot-ring" d="M0 0" style="display:none"/>');
    s.push('<g class="pl-labels" aria-hidden="true">');
    lots.forEach(function (o) {
      var x = o.cx, y = o.cy, n = o.l.n;
      if (o.l.estado === "vendida") {
        // Vendida: "V" en un círculo y el número debajo
        s.push('<circle class="pl-badge pl-badge-v" data-n="' + n + '" cx="' + x + '" cy="' + y + '" r="' + (R - 1.5).toFixed(1) + '"/>');
        s.push('<text class="lot-num lot-v" data-n="' + n + '" x="' + x + '" y="' + (y + 0.5) + '" font-size="' + FS + '">' + PLANO.marcaVendida + "</text>");
        s.push('<text class="lot-sub" data-n="' + n + '" x="' + x + '" y="' + (y + R + SUB * 0.75).toFixed(1) + '" font-size="' + SUB + '">' + n + "</text>");
        return;
      }
      s.push('<circle class="pl-badge" data-n="' + n + '" cx="' + x + '" cy="' + y + '" r="' + R.toFixed(1) + '"/>');
      s.push('<text class="lot-num" data-n="' + n + '" x="' + x + '" y="' + (y + 0.5) + '" font-size="' + FS + '">' + n + "</text>");
      s.push('<circle class="lot-fav" data-n="' + n + '" cx="' + (x + R * 0.8).toFixed(1) + '" cy="' + (y - R * 0.8).toFixed(1) + '" r="' + (R * 0.34).toFixed(1) + '"/>');
    });
    s.push("</g></svg>");
    return s.join("");
  }
  // Leyenda estándar: encabezado con cifras, precios por categoría y simbología
  function legendHtml(p) {
    var cats = p.categorias || {}, P = (B.planos || {})[p.id] || {};
    var disp = p.lotes.filter(function (l) { return l.estado === "disponible"; });
    var nVend = p.lotes.filter(function (l) { return l.estado === "vendida"; }).length;
    var nRes = p.lotes.filter(function (l) { return l.estado === "reservada"; }).length;
    var h = ['<div class="pl-head"><div><p class="pl-kicker">Plano de loteo</p><p class="pl-name">Fundos de ' + esc(p.nombre) + "</p></div>" +
      '<p class="pl-stats"><span><b>' + disp.length + "</b> " + (disp.length === 1 ? "disponible" : "disponibles") + "</span>" + (nRes ? "<span><b>" + nRes + "</b> " + (nRes === 1 ? "reservada" : "reservadas") + "</span>" : "") +
      "<span><b>" + nVend + "</b> " + (nVend === 1 ? "vendida" : "vendidas") + "</span><span><b>" + p.lotes.length + "</b> parcelas</span></p></div>"];
    h.push('<div class="pl-prices"><p class="pl-title">' + tituloPrecios(p) + "</p><ul>");
    Object.keys(cats).forEach(function (k) {
      var c = cats[k], n = disp.filter(function (l) { return l.cat === k; }).length;
      h.push('<li><i class="sw" style="--c:' + c.color + '"></i><span class="pl-price">' + (c.lista ? "<s>" + clp(c.lista) + "</s> " : "") + "<b>" + clp(c.precio) + "</b></span>" +
        (n ? "<small>" + n + (n === 1 ? " disponible" : " disponibles") + "</small>" : '<small class="is-out">Agotado</small>') + "</li>");
    });
    h.push('</ul></div><ul class="pl-symbols">');
    h.push('<li><i class="sw sw-v">' + PLANO.marcaVendida + "</i>Vendida</li>");
    if (nRes) h.push('<li><i class="sw sw-reservada"></i>Reservada</li>');
    if ((P.calles || []).length) h.push('<li><i class="sw sw-servidumbre"></i>Servidumbre de tránsito</li>');
    if (P.caminoPrincipal) h.push('<li><i class="sw sw-principal"></i>Camino principal</li>');
    (P.agua || []).forEach(function (a) { h.push('<li><i class="sw sw-agua"></i>' + esc(a.nombre) + "</li>"); });
    h.push('<li><i class="sw sw-fav"></i>Tu favorito</li></ul>');
    return h.join("");
  }

  function initPlan() {
    var root = $("[data-plan]");
    if (!root) return;
    var canvas = $("[data-canvas]", root), list = $("[data-list]", root), stage = $("[data-stage]", root);
    var tip = $("[data-tip]", root), prev = $("[data-preventa-panel]", root), legend = $("[data-legend]", root), hint = $("[data-hint]", root);
    var summary = $("[data-summary]", root), price = $("[data-price]", root), priceOut = $("[data-price-out]", root);
    var sectorSel = $("[data-sector]", root), tabs = $$("[data-tab]", root), views = $$("[data-view]", root);
    var viewToggle = $(".view-toggle", root), statusBox = $(".status-filter", root), rangeBox = $(".range", root), sectorBox = $(".select-sm", root);
    var checks = $$(".status-filter input", root);
    var panel = $("[data-panel]"), pEmpty = $("[data-panel-empty]"), pDetail = $("[data-panel-detail]"), pStats = $("[data-panel-stats]");
    var d = {
      project: $("[data-d-project]"), title: $("[data-d-title]"), status: $("[data-d-status]"), sector: $("[data-d-sector]"),
      price: $("[data-d-price]"), m2: $("[data-d-m2]"), reserva: $("[data-d-reserva]"), saldo: $("[data-d-saldo]"),
      m2price: $("[data-d-m2price]"), reserve: $("[data-d-reserve]"), wa: $("[data-d-wa]"), fav: $("[data-d-fav]"),
      sim: $("[data-d-sim]"), close: $("[data-panel-close]")
    };
    var favBox = $("[data-favs]"), favCount = $("[data-favs-count]"), favLabel = $("[data-favs-label]");
    var favList = $("[data-favs-list]"), favSend = $("[data-favs-send]"), favClear = $("[data-favs-clear]");

    var first = proyectos.filter(function (p) { return p.lotes && p.lotes.length; })[0];
    var S = {
      id: first ? first.id : (proyectos[0] && proyectos[0].id),
      est: { disponible: true, reservada: true, vendida: true },
      max: Infinity, sector: "", view: "plano", sel: null, sort: "n", dir: 1
    };
    var favs = loadFavs().filter(function (k) {
      var parts = k.split(":"), p = proyecto(parts[0]);
      return p && p.lotes.some(function (l) { return String(l.n) === parts[1]; });
    });
    var shapes = {}, ring = null, prices = [];

    function P() { return proyecto(S.id); }
    function lotOf(p, n) { for (var i = 0; i < p.lotes.length; i++) if (p.lotes[i].n === n) return p.lotes[i]; return null; }
    function passes(l) { return !!S.est[l.estado] && (l.precio || 0) <= S.max && (S.sector === "" || l.cat === S.sector); }
    function isFav(id, n) { return favs.indexOf(id + ":" + n) > -1; }
    // Enlace directo al lote; dentro de un marco (vista previa) se omite
    function lotLink(p, l) {
      var framed = true;
      try { framed = window.self !== window.top; } catch (e) { framed = true; }
      return framed ? "" : " " + location.href.split("#")[0] + "#lote-" + p.id + "-" + l.n;
    }

    /* ---- Render ---- */
    function renderSvg() {
      var p = P();
      canvas.innerHTML = svgPlan(p);
      if (legend) legend.innerHTML = legendHtml(p);
      var svg = $("svg", canvas);
      shapes = {};
      $$(".lot", svg).forEach(function (el) { shapes[el.getAttribute("data-n")] = { path: el }; });
      $$(".lot-num", svg).forEach(function (el) { var s = shapes[el.getAttribute("data-n")]; if (s) s.num = el; });
      $$(".lot-sub", svg).forEach(function (el) { var s = shapes[el.getAttribute("data-n")]; if (s) s.sub = el; });
      $$(".lot-fav", svg).forEach(function (el) { var s = shapes[el.getAttribute("data-n")]; if (s) s.dot = el; });
      ring = $(".lot-ring", svg);
      scaleLabels();
    }
    // En pantallas chicas el plano mantiene un ancho legible y se desliza de lado
    function scaleLabels() {
      var svg = $("svg", canvas);
      if (!svg) return;
      var vb = svg.viewBox.baseVal, wide = vb && vb.width / vb.height > 2;
      var min = window.innerWidth < 720 ? (wide ? 980 : 640) : 0;
      svg.style.minWidth = min ? min + "px" : "";
      if (hint) hint.hidden = !min || S.view !== "plano";
    }
    function renderList() {
      var p = P();
      var key = function (l) { return S.sort === "precio" ? (l.precio || 1e12) : l[S.sort]; };
      var rows = p.lotes.filter(passes).sort(function (a, b) { return (key(a) - key(b)) * S.dir || a.n - b.n; });
      if (!rows.length) { list.innerHTML = '<p class="list-empty">No hay lotes con estos filtros. Prueba ampliando el precio o los estados.</p>'; return; }
      var arrow = function (k) { return S.sort === k ? (S.dir > 0 ? " ↑" : " ↓") : ""; };
      var h = ['<table class="lot-table"><caption class="sr-only">Lotes de ' + esc(p.nombre) + '</caption><thead><tr>',
        '<th scope="col"><button type="button" data-sort="n">Lote' + arrow("n") + '</button></th>',
        '<th scope="col" class="t-sector">Precio lista</th>',
        '<th scope="col" class="t-m2"><button type="button" data-sort="m2">Superficie' + arrow("m2") + '</button></th>',
        '<th scope="col"><button type="button" data-sort="precio">Precio' + arrow("precio") + '</button></th>',
        '<th scope="col">Estado</th><th scope="col"><span class="sr-only">Acción</span></th></tr></thead><tbody>'];
      rows.forEach(function (l) {
        h.push('<tr data-n="' + l.n + '"' + (S.sel === l.n ? ' class="is-active"' : "") + '>' +
          '<td class="t-num">' + l.n + (isFav(p.id, l.n) ? ' <svg class="i t-fav" aria-label="Favorito" role="img"><use href="#i-heart"/></svg>' : "") + "</td>" +
          '<td class="t-sector">' + (l.lista ? "<s>" + clp(l.lista) + "</s>" : "") + "</td>" +
          '<td class="t-m2">' + m2(l.m2) + "</td>" +
          '<td class="t-price"><i class="t-cat" style="--c:' + ((p.categorias[l.cat] || {}).color || "transparent") + '"></i>' + (l.precio ? clp(l.precio) : "—") + "</td>" +
          '<td><span class="dot st-' + l.estado + '">' + ESTADO[l.estado] + "</span></td>" +
          '<td class="t-sel"><button type="button" data-n="' + l.n + '" aria-label="Ver lote ' + l.n + '">Ver</button></td></tr>');
      });
      h.push("</tbody></table>");
      list.innerHTML = h.join("");
    }

    /* ---- Estado visual ---- */
    function applyFilters() {
      var p = P();
      p.lotes.forEach(function (l) {
        var sh = shapes[l.n];
        if (!sh) return;
        var ok = passes(l);
        sh.path.classList.toggle("is-dim", !ok);
        sh.path.setAttribute("tabindex", ok ? "0" : "-1");
        if (sh.num) sh.num.classList.toggle("is-dim", !ok);
        if (sh.sub) sh.sub.classList.toggle("is-dim", !ok);
      });
      if (S.view === "lista") renderList();
      updateSummary();
    }
    function updateSummary() {
      var p = P();
      if (!p.lotes.length) { summary.textContent = "Preventa · plano y precios muy pronto"; return; }
      var all = p.lotes.length, disp = disponibles(p).length, shown = p.lotes.filter(passes).length;
      summary.textContent = shown !== all
        ? "Mostrando " + shown + " de " + all + " lotes" + (S.max < Infinity ? " hasta " + clp(S.max) : "")
        : disp + " de " + all + " lotes disponibles · desde " + clp(desde(p));
      var dds = $$("dd", pStats);
      if (dds[0]) dds[0].textContent = disp;
      if (dds[1]) dds[1].textContent = clp(desde(p));
    }
    function syncPrice() {
      var i = prices.length;
      if (S.max < Infinity) {
        i = -1;
        for (var k = 0; k < prices.length; k++) if (prices[k] <= S.max) i = k;
        i = Math.max(i, 0);
        S.max = prices[i];
      }
      price.max = prices.length;
      price.value = i;
      priceOut.textContent = i >= prices.length ? "Sin tope" : "Hasta " + clp(prices[i]);
      paintRange(price);
    }

    /* ---- Panel de detalle ---- */
    function resetPanel() {
      S.sel = null;
      pDetail.hidden = true;
      pEmpty.hidden = false;
      if (ring) ring.style.display = "none";
      closeSheet(true);
    }
    function fillPanel(p, l) {
      pEmpty.hidden = true;
      pDetail.hidden = false;
      d.project.textContent = p.nombre + " · " + p.region;
      d.title.textContent = "Lote " + l.n;
      d.status.textContent = ESTADO[l.estado];
      d.status.setAttribute("data-estado", l.estado);
      d.sector.innerHTML = l.lista ? "Precio lista <s>" + clp(l.lista) + "</s>" : (l.precio ? "Precio de venta" : "Este lote ya tiene dueño.");
      d.price.textContent = precioTxt(l);
      d.m2.textContent = m2(l.m2);
      d.reserva.textContent = l.precio ? clp(RESERVA) : "—";
      d.saldo.textContent = l.precio ? clp(l.precio - RESERVA) : "—";
      d.m2price.textContent = l.precio ? clp(l.precio / l.m2) : "—";
      pDetail.classList.toggle("is-closed", l.estado !== "disponible");
      if (l.estado === "disponible") { d.reserve.textContent = "Reservar este lote"; d.reserve.setAttribute("href", "#visita"); }
      else if (l.estado === "reservada") { d.reserve.textContent = "Avísame si se libera"; d.reserve.setAttribute("href", "#visita"); }
      else { d.reserve.textContent = "Ver un lote similar disponible"; d.reserve.setAttribute("href", "#plano"); }
      d.wa.href = waHref("Hola Fundos, me interesa el lote " + l.n + " de " + p.nombre + " (" + m2(l.m2) + ", " + precioTxt(l) + "). ¿Me pueden dar más información?" + lotLink(p, l));
      d.sim.hidden = l.estado === "vendida";
      syncFavButton();
    }
    function syncFavButton() {
      if (S.sel == null) return;
      var on = isFav(S.id, S.sel);
      d.fav.setAttribute("aria-pressed", on ? "true" : "false");
      var span = $("span", d.fav);
      if (span) span.textContent = on ? "Guardado" : "Guardar";
    }
    function select(n, opts) {
      opts = opts || {};
      var p = P(), l = lotOf(p, n);
      if (!l) return;
      S.sel = n;
      $$(".lot.is-active", canvas).forEach(function (el) { el.classList.remove("is-active"); });
      var sh = shapes[n];
      if (sh && ring) {
        sh.path.classList.add("is-active");
        ring.setAttribute("d", sh.path.getAttribute("d"));
        ring.style.display = "";
      }
      $$("tr.is-active", list).forEach(function (tr) { tr.classList.remove("is-active"); });
      var row = $('tr[data-n="' + n + '"]', list);
      if (row) row.classList.add("is-active");
      fillPanel(p, l);
      if (opts.hash !== false) {
        try { history.replaceState(null, "", "#lote-" + p.id + "-" + n); } catch (e) { /* marco sin historial */ }
      }
      if (!desktop.matches && opts.sheet !== false) openSheet();
    }
    function openSheet() {
      tip.hidden = true;
      panel.classList.add("is-open");
      document.body.classList.add("sheet-open");
      document.dispatchEvent(new CustomEvent("fundos:sheet"));
      window.setTimeout(function () { if (d.close) d.close.focus({ preventScroll: true }); }, 60);
    }
    function closeSheet(silent) {
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      document.body.classList.remove("sheet-open");
      document.dispatchEvent(new CustomEvent("fundos:sheet"));
      var sh = shapes[S.sel];
      if (!silent && sh && document.activeElement && panel.contains(document.activeElement)) sh.path.focus({ preventScroll: true });
    }
    function nearestAvailable(l) {
      var best = null;
      disponibles(P()).forEach(function (x) {
        var score = (l.precio ? Math.abs(x.precio - l.precio) : 0) + Math.abs(x.n - l.n) * 1000;
        if (!best || score < best.score) best = { l: x, score: score };
      });
      return best && best.l;
    }

    /* ---- Favoritos ---- */
    function refreshFavs() {
      Object.keys(shapes).forEach(function (n) { if (shapes[n].dot) shapes[n].dot.classList.toggle("is-on", isFav(S.id, +n)); });
      if (S.view === "lista") renderList();
      syncFavButton();
      favBox.hidden = favs.length === 0;
      if (!favs.length) return;
      favCount.textContent = favs.length;
      favLabel.textContent = favs.length === 1 ? "lote guardado" : "lotes guardados";
      var groups = {}, lines = [];
      favs.forEach(function (k) {
        var parts = k.split(":"), p = proyecto(parts[0]), l = p && lotOf(p, +parts[1]);
        if (!l) return;
        (groups[p.nombre] = groups[p.nombre] || []).push(l.n);
        lines.push("• " + p.nombre + ", lote " + l.n + " (" + m2(l.m2) + ", " + precioTxt(l) + ")");
      });
      favList.textContent = "· " + Object.keys(groups).map(function (g) { return g + ": " + groups[g].sort(function (a, b) { return a - b; }).join(", "); }).join(" · ");
      favSend.href = waHref("Hola Fundos, guardé estos lotes y me gustaría recibir más información:\n" + lines.join("\n"));
    }
    function toggleFav(id, n) {
      var k = id + ":" + n, i = favs.indexOf(k);
      if (i > -1) favs.splice(i, 1); else favs.push(k);
      saveFavs(favs);
      refreshFavs();
    }

    /* ---- Proyecto activo ---- */
    function setProject(id, opts) {
      opts = opts || {};
      var p = proyecto(id);
      if (!p) return;
      S.id = id;
      S.sector = "";
      if (!opts.keepMax) S.max = Infinity;
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        if (on) stage.setAttribute("aria-labelledby", t.id);
      });
      var pre = !p.lotes.length;
      root.classList.toggle("is-preventa", pre);
      prev.hidden = !pre;
      [viewToggle, statusBox, rangeBox, sectorBox, panel].forEach(function (el) { if (el) el.hidden = pre; });
      if (legend) legend.hidden = pre || S.view !== "plano";
      var ppArt = $("[data-preventa-art]", root);
      if (pre) {
        var ppKick = $("[data-preventa-kicker]", root), ppBtn = $("[data-preventa]", prev);
        if (ppKick) ppKick.textContent = "Preventa · " + p.nombre;
        if (ppBtn) ppBtn.setAttribute("data-preventa", p.id);
        if (ppArt && ppArt.getAttribute("data-for") !== id) {
          var src = $('.project[data-project="' + id + '"] .project-art svg');
          ppArt.innerHTML = "";
          if (src) ppArt.appendChild(src.cloneNode(true));
          ppArt.setAttribute("data-for", id);
        }
      }
      resetPanel();
      if (pre) {
        if (hint) hint.hidden = true;
        canvas.hidden = true;
        list.hidden = true;
        canvas.innerHTML = "";
        shapes = {};
        updateSummary();
        return;
      }
      canvas.hidden = S.view !== "plano";
      list.hidden = S.view !== "lista";
      prices = p.lotes.map(function (l) { return l.precio; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
      syncPrice();
      sectorSel.innerHTML = '<option value="">Todas las categorías</option>' + Object.keys(p.categorias || {}).map(function (k) { var c = p.categorias[k]; return '<option value="' + k + '">' + clp(c.precio) + (c.lista ? " (antes " + clp(c.lista) + ")" : "") + "</option>"; }).join("");
      // solo se muestran los estados que existen en este proyecto
      checks.forEach(function (c) { var lbl = c.closest("label"); if (lbl) lbl.hidden = !p.lotes.some(function (l) { return l.estado === c.value; }); });
      renderSvg();
      applyFilters();
      refreshFavs();
    }
    function setView(v) {
      S.view = v;
      views.forEach(function (b) { var on = b.getAttribute("data-view") === v; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
      if (!P().lotes.length) return;
      canvas.hidden = v !== "plano";
      list.hidden = v !== "lista";
      if (legend) legend.hidden = v !== "plano";
      if (v === "lista") renderList();
      scaleLabels();
    }

    /* ---- Eventos ---- */
    tabs.forEach(function (t, i) {
      t.id = t.id || "tab-" + t.getAttribute("data-tab");
      t.setAttribute("aria-controls", "plan-stage");
      t.addEventListener("click", function () { setProject(t.getAttribute("data-tab")); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var nx = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        nx.focus();
        setProject(nx.getAttribute("data-tab"));
      });
    });
    stage.id = "plan-stage";
    stage.setAttribute("role", "tabpanel");
    views.forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
    checks.forEach(function (c) { c.addEventListener("change", function () { S.est[c.value] = c.checked; applyFilters(); }); });
    price.addEventListener("input", function () {
      var i = +price.value;
      S.max = i >= prices.length ? Infinity : prices[i];
      priceOut.textContent = i >= prices.length ? "Sin tope" : "Hasta " + clp(prices[i]);
      paintRange(price);
      applyFilters();
    });
    sectorSel.addEventListener("change", function () { S.sector = sectorSel.value; applyFilters(); });

    // Plano: clic, teclado y tooltip
    canvas.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el) select(+el.getAttribute("data-n"));
    });
    canvas.addEventListener("keydown", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (!el) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(+el.getAttribute("data-n")); return; }
      var dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var all = $$(".lot:not(.is-dim)", canvas), i = all.indexOf(el);
      var nx = all[(i + dir + all.length) % all.length];
      if (nx) nx.focus();
    });
    function showTip(el, x, y) {
      var p = P(), l = lotOf(p, +el.getAttribute("data-n"));
      if (!l) return;
      tip.innerHTML = "Lote " + l.n + " · " + precioTxt(l) + "<small>" + (l.lista ? "Antes " + clp(l.lista) + " · " : "") + ESTADO[l.estado] + "</small>";
      tip.hidden = false;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    }
    function tipAt(el) {
      if (!fineHover) return;
      var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
      showTip(el, r.left + r.width / 2 - s.left, r.top - s.top + 6);
    }
    canvas.addEventListener("mouseover", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el && !el.contains(e.relatedTarget)) tipAt(el);
    });
    canvas.addEventListener("mousemove", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (!el) return;
      var s = stage.getBoundingClientRect();
      tip.style.left = (e.clientX - s.left) + "px";
      tip.style.top = (e.clientY - s.top) + "px";
    });
    canvas.addEventListener("mouseout", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el && !el.contains(e.relatedTarget)) tip.hidden = true;
    });
    canvas.addEventListener("focusin", function (e) { var el = e.target.closest && e.target.closest(".lot"); if (el) tipAt(el); });
    canvas.addEventListener("focusout", function () { tip.hidden = true; });

    // Lista
    list.addEventListener("click", function (e) {
      var sb = e.target.closest("[data-sort]");
      if (sb) {
        var k = sb.getAttribute("data-sort");
        S.dir = S.sort === k ? -S.dir : 1;
        S.sort = k;
        renderList();
        var again = $('[data-sort="' + k + '"]', list);
        if (again) again.focus();
        return;
      }
      var tr = e.target.closest("tr[data-n]");
      if (tr) select(+tr.getAttribute("data-n"));
    });

    // Panel
    d.reserve.addEventListener("click", function (e) {
      var p = P(), l = lotOf(p, S.sel);
      if (!l) return;
      if (l.estado === "vendida") {
        e.preventDefault();
        var alt = nearestAvailable(l);
        if (alt) { select(alt.n, { sheet: !desktop.matches }); if (shapes[alt.n]) shapes[alt.n].path.focus({ preventScroll: true }); }
        return;
      }
      Visit.prefill({
        proyecto: p.nombre,
        mensaje: l.estado === "disponible"
          ? "Quiero reservar el lote " + l.n + " de " + p.nombre + " (" + m2(l.m2) + ", " + precioTxt(l) + ")."
          : "Me interesa el lote " + l.n + " de " + p.nombre + ". Avísenme si se libera."
      });
      closeSheet(true);
    });
    d.fav.addEventListener("click", function () { if (S.sel != null) toggleFav(S.id, S.sel); });
    d.sim.addEventListener("click", function () {
      var l = lotOf(P(), S.sel);
      if (l) Sim.set(S.id, l.precio);
      closeSheet(true);
    });
    if (d.close) d.close.addEventListener("click", function () { closeSheet(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });
    desktop.addEventListener && desktop.addEventListener("change", function () { closeSheet(true); scaleLabels(); });
    favClear.addEventListener("click", function () { favs = []; saveFavs(favs); refreshFavs(); });

    var rt = 0;
    window.addEventListener("resize", function () { window.cancelAnimationFrame(rt); rt = window.requestAnimationFrame(scaleLabels); });

    /* ---- API para otros módulos ---- */
    Plan.show = function (id) { if (id !== S.id) setProject(id); };
    Plan.apply = function (o) {
      if (o.soloDisponibles) {
        S.est = { disponible: true, reservada: false, vendida: false };
        checks.forEach(function (c) { c.checked = !!S.est[c.value]; });
      }
      S.max = o.max || Infinity;
      setProject(o.id, { keepMax: true });
    };

    // Enlace directo a un lote: #lote-malalcahuello-12
    var m = /^#lote-([a-z0-9-]+)-(\d+)$/.exec(location.hash);
    if (m && proyecto(m[1]) && proyecto(m[1]).lotes.length) {
      setProject(m[1]);
      select(+m[2], { hash: false, sheet: false });
      window.setTimeout(function () { scrollToEl($("#plano")); }, 80);
    } else {
      setProject(S.id);
    }
  }

  /* =============================================================
     Simulador
     ============================================================= */
  function initSim() {
    var form = $("[data-sim]");
    if (!form) return;
    var fin = B.financiamiento || {};
    var selP = $("[data-s-project]", form), price = $("[data-s-price]", form), priceOut = $("[data-s-price-out]", form);
    var pie = $("[data-s-pie]", form), pieOut = $("[data-s-pie-out]", form), plazosBox = $("[data-s-plazos]", form);
    var modeWrap = $("[data-s-mode-wrap]", form), creditEls = $$("[data-s-credit]", form);
    var out = {
      reserva: $("[data-s-reserva]", form), rowPie: $("[data-s-row-pie]", form), pie: $("[data-s-pie-val]", form),
      saldoLabel: $("[data-s-saldo-label]", form), saldo: $("[data-s-saldo]", form), rowCuota: $("[data-s-row-cuota]", form),
      cuota: $("[data-s-cuota]", form), note: $("[data-s-note]", form), send: $("[data-s-send]", form),
      bRes: $('[data-s-b="res"]', form), bPie: $('[data-s-b="pie"]', form), bRest: $('[data-s-b="rest"]', form),
      lPie: $("[data-s-b-pie-l]", form), lRest: $("[data-s-b-rest-l]", form)
    };
    function bar(res, pieNeto, rest) {
      if (!out.bRes) return;
      out.bRes.style.flexBasis = (res * 100).toFixed(2) + "%";
      out.bPie.style.flexBasis = (pieNeto * 100).toFixed(2) + "%";
      out.bRest.style.flexBasis = (rest * 100).toFixed(2) + "%";
    }
    var conLotes = proyectos.filter(function (p) { return p.lotes && p.lotes.length; });
    selP.innerHTML = conLotes.map(function (p) { return '<option value="' + p.id + '">' + esc(p.nombre) + "</option>"; }).join("");

    if (!fin.habilitado) { modeWrap.hidden = true; }
    if (fin.plazos && fin.plazos.length) {
      var def = fin.plazos[Math.min(2, fin.plazos.length - 1)];
      plazosBox.innerHTML = fin.plazos.map(function (n) {
        return '<label><input type="radio" name="plazo" value="' + n + '"' + (n === def ? " checked" : "") + "><span>" + n + " m</span></label>";
      }).join("");
    }
    pie.min = Math.round((fin.pieMinimo || 0.2) * 100);
    if (+pie.value < +pie.min) pie.value = pie.min;

    function range(p, value) {
      var ps = p.lotes.map(function (l) { return l.precio; }).filter(Boolean);
      var mn = Math.min.apply(null, ps), mx = Math.max.apply(null, ps);
      price.min = mn;
      price.max = mx;
      price.step = 100000;
      if (value == null) {
        var disp = disponibles(p).map(function (l) { return l.precio; }).sort(function (a, b) { return a - b; });
        value = disp.length ? disp[Math.floor(disp.length / 2)] : mn;
      }
      price.value = clamp(value, mn, mx);
    }
    function calc() {
      var p = proyecto(selP.value);
      var modo = $('input[name="modo"]:checked', form);
      var v = +price.value, credito = !modeWrap.hidden && !!modo && modo.value === "credito";
      priceOut.textContent = clp(v);
      pieOut.textContent = pct(+pie.value);
      creditEls.forEach(function (el) { el.hidden = !credito; });
      $$('input[type="range"]', form).forEach(paintRange);
      out.reserva.textContent = clp(RESERVA);
      out.rowPie.hidden = !credito;
      out.rowCuota.hidden = !credito;
      var msg;
      if (!credito) {
        out.saldoLabel.textContent = "Saldo a la escritura";
        out.saldo.textContent = clp(v - RESERVA);
        out.note.textContent = "Más gastos de escrituración (notaría y Conservador), que te informamos antes de firmar.";
        msg = "Hola Fundos, simulé una parcela en " + p.nombre + " de " + clp(v) + " pagando al contado. ¿Me pueden asesorar?";
        bar(RESERVA / v, 0, (v - RESERVA) / v);
        if (out.lPie) out.lPie.hidden = true;
        if (out.lRest) out.lRest.textContent = "Saldo a la escritura";
      } else {
        var plazo = $('input[name="plazo"]:checked', form);
        var n = +(plazo && plazo.value) || 36;
        var i = +fin.tasaMensual || 0;
        var pieTotal = v * (+pie.value / 100);
        var fin$ = v - pieTotal;
        var cuota = i ? fin$ * i / (1 - Math.pow(1 + i, -n)) : fin$ / n;
        out.pie.textContent = clp(Math.max(0, pieTotal - RESERVA));
        out.saldoLabel.textContent = "Monto a financiar";
        out.saldo.textContent = clp(fin$);
        out.cuota.textContent = clp(cuota) + " × " + n;
        out.note.textContent = "Cuota referencial en " + n + " meses con tasa de " + pct((i * 100).toFixed(1)) + " mensual. Más gastos de escrituración.";
        msg = "Hola Fundos, simulé una parcela en " + p.nombre + " de " + clp(v) + " con pie de " + pie.value + "% y " + n + " cuotas de aprox. " + clp(cuota) + ". ¿Me pueden asesorar?";
        bar(RESERVA / v, Math.max(0, pieTotal - RESERVA) / v, fin$ / v);
        if (out.lPie) out.lPie.hidden = false;
        if (out.lRest) out.lRest.textContent = "Financiado en cuotas";
      }
      out.send.href = waHref(msg);
    }
    selP.addEventListener("change", function () { range(proyecto(selP.value)); calc(); });
    form.addEventListener("input", calc);
    form.addEventListener("change", calc);
    range(proyecto(selP.value));
    calc();

    Sim.set = function (id, precio) {
      var p = proyecto(id);
      if (!p || !p.lotes.length) return;
      selP.value = id;
      range(p, precio);
      calc();
    };
  }

  /* =============================================================
     Formulario de visita → WhatsApp
     ============================================================= */
  function initVisit() {
    var form = $("[data-visit]");
    if (!form) return;
    var ok = $("[data-visit-ok]", form), fb = $("[data-visit-fallback]", form), again = $("[data-visit-again]", form);
    var okMsg = $("[data-visit-msg]", form);
    var el = form.elements;
    var today = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    if (el.fecha) el.fecha.min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());

    // Mensajes de error asociados a cada campo
    $$("[data-error-for]", form).forEach(function (e, i) {
      var key = e.getAttribute("data-error-for");
      var input = document.getElementById(key) || el[key];
      e.id = e.id || "err-" + i;
      if (input && input.setAttribute) input.setAttribute("aria-describedby", e.id);
    });

    var rules = {
      nombre: function (v) { return v.trim().length >= 2; },
      telefono: function (v) { var d = v.replace(/\D/g, ""); return d.length >= 8 && d.length <= 15; },
      correo: function (v) { v = v.trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
      acepto: function (_, input) { return input.checked; }
    };
    function check(name) {
      var input = el[name];
      if (!input) return true;
      var good = rules[name](input.value || "", input);
      var err = $('[data-error-for="' + (input.id || name) + '"]', form);
      var field = input.closest(".field");
      if (field) field.classList.toggle("has-error", !good);
      if (err) err.classList.toggle("is-shown", !good);
      input.setAttribute("aria-invalid", good ? "false" : "true");
      return good;
    }
    Object.keys(rules).forEach(function (name) {
      var input = el[name];
      if (!input) return;
      input.addEventListener(input.type === "checkbox" ? "change" : "input", function () {
        if (input.getAttribute("aria-invalid") === "true") check(name);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = Object.keys(rules).filter(function (n) { return !check(n); });
      if (bad.length) { el[bad[0]].focus(); return; }
      var fecha = "";
      if (el.fecha.value) {
        var parts = el.fecha.value.split("-");
        var dt = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        try { fecha = dt.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" }); } catch (err) { fecha = el.fecha.value; }
      }
      var horario = (form.querySelector('input[name="horario"]:checked') || {}).value || "";
      var proyectoTxt = el.proyecto.value;
      var msg = "Hola Fundos, soy " + el.nombre.value.trim() + ". " +
        (proyectoTxt === "Aún no lo sé" ? "Quiero agendar una visita y conocer sus proyectos" : "Quiero agendar una visita a " + proyectoTxt) +
        (fecha ? " el " + fecha : "") + (horario ? " (" + horario + ")" : "") + "." +
        (el.mensaje.value.trim() ? " " + el.mensaje.value.trim() : "") +
        " Mi teléfono: " + el.telefono.value.trim() + "." +
        (el.correo && el.correo.value.trim() ? " Mi correo: " + el.correo.value.trim() + "." : "");
      // Se muestra el mensaje y se envía con un enlace real (sin ventanas emergentes)
      fb.href = waHref(msg);
      if (okMsg) okMsg.textContent = msg;
      ok.hidden = false;
      ok.focus();
    });
    if (again) again.addEventListener("click", function () { ok.hidden = true; el.nombre.focus(); });

    Visit.prefill = function (o) {
      if (o.proyecto) {
        var opt = Array.prototype.filter.call(el.proyecto.options, function (x) { return x.value === o.proyecto; })[0];
        if (opt) el.proyecto.value = o.proyecto;
      }
      if (o.mensaje) el.mensaje.value = o.mensaje;
      ok.hidden = true;
      form.classList.remove("is-prefilled");
      void form.offsetWidth;
      form.classList.add("is-prefilled");
      window.setTimeout(function () {
        form.classList.remove("is-prefilled");
        if (fineHover) el.nombre.focus({ preventScroll: true });
      }, 1600);
    };
  }

  /* =============================================================
     Ficha de proyecto (dialog)
     ============================================================= */
  function initDialog() {
    var dlg = $("[data-pdialog]");
    if (!dlg || typeof dlg.showModal !== "function") return; // sin soporte: los enlaces navegan normal
    var art = $("[data-pd-art]", dlg), logo = $("[data-pd-logo]", dlg);
    var f = {
      meta: $("[data-pd-meta]", dlg), title: $("[data-pd-title]", dlg), desc: $("[data-pd-desc]", dlg),
      list: $("[data-pd-list]", dlg), near: $("[data-pd-near]", dlg), note: $("[data-pd-near-note]", dlg),
      map: $("[data-pd-map]", dlg), actions: $("[data-pd-actions]", dlg)
    };
    var check = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>';
    var arrow = '<svg class="i i-go" aria-hidden="true"><use href="#i-arrow"/></svg>';

    function open(id) {
      var p = proyecto(id);
      if (!p) return;
      var src = $('.project[data-project="' + id + '"] .project-art svg');
      art.innerHTML = "";
      if (src) art.appendChild(src.cloneNode(true));
      if (logo) {
        logo.hidden = !p.logo;
        if (p.logo) { logo.src = p.logo; logo.alt = "Fundos de " + p.nombre; }
      }
      f.meta.textContent = p.region + " · " + p.zona;
      f.title.textContent = p.nombre;
      f.desc.textContent = p.descripcion;
      f.list.innerHTML = (p.destacados || []).map(function (x) { return "<li>" + check + "<span>" + esc(x) + "</span></li>"; }).join("");
      f.near.innerHTML = (p.cercanias || []).map(function (c) { return "<li><span>" + esc(c[0]) + "</span><span>aprox. " + esc(c[1]) + "</span></li>"; }).join("");
      f.note.textContent = p.cercaniasNota || "";
      f.map.href = p.mapa || "#";
      f.actions.innerHTML = p.estado === "preventa"
        ? '<a class="btn btn-gold" href="#visita" data-act="preventa">Inscribirme en la preventa' + arrow + '</a><a class="btn btn-line" href="' + esc(waHref("Hola Fundos, quiero saber más de la preventa de " + p.nombre + ".")) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a>'
        : '<a class="btn btn-dark" href="#plano" data-act="plano">Ver lotes disponibles' + arrow + '</a><a class="btn btn-line" href="#visita" data-act="visita">Agendar una visita</a>';
      if (p.video) f.actions.insertAdjacentHTML("beforeend", '<button class="btn btn-line" type="button" data-act="video"><svg class="i" aria-hidden="true"><use href="#i-play"/></svg>Ver video</button>');
      if (p.tour) f.actions.insertAdjacentHTML("beforeend", '<a class="btn btn-line" href="#recorrido" data-act="tour"><svg class="i" aria-hidden="true"><use href="#i-360"/></svg>Recorrido 360°</a>');
      $$("[data-act]", f.actions).forEach(function (a) {
        a.addEventListener("click", function () {
          var act = a.getAttribute("data-act");
          if (act === "plano") Plan.show(p.id);
          if (act === "tour") Tour.open(p.id, true);
          if (act === "video") { dlg.close(); Video.open(p.id); return; }
          if (act === "visita") Visit.prefill({ proyecto: p.nombre, mensaje: "" });
          if (act === "preventa") Visit.prefill({ proyecto: p.nombre, mensaje: "Quiero inscribirme en la preventa de " + p.nombre + "." });
          dlg.close();
        });
      });
      dlg.showModal();
      dlg.scrollTop = 0;
    }
    $$("[data-open-project]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(a.getAttribute("data-open-project")); });
    });
    $("[data-pd-close]", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* =============================================================
     Recorrido virtual 360°: se abre dentro de la página
     El marco se crea solo cuando la persona entra (no carga nada antes)
     ============================================================= */
  function initTour() {
    var root = $("[data-tour]");
    if (!root) return;
    var stage = $("[data-tour-stage]", root), poster = $("[data-tour-poster]", root), frame = $("[data-tour-frame]", root);
    var lens = $("[data-tour-enter]", root), status = $("[data-tour-status]", root), fullBtn = $("[data-tour-full]", root);
    var picks = $$("[data-tour-pick]", root);
    var first = proyectos.filter(function (p) { return p.tour; })[0];
    if (!stage || !first) return;
    var cur = "", blocked = false, iframe = null, timer = 0, token = 0;

    function T() { return proyecto(cur); }
    function state(v) { if (v) stage.setAttribute("data-state", v); return stage.getAttribute("data-state"); }
    function setText(sel, txt) { $$(sel, root).forEach(function (el) { el.textContent = txt; }); }
    function art(id) { return $('.project[data-project="' + id + '"] .project-art svg'); }

    // Miniaturas del selector, tomadas de la ilustración de cada proyecto
    picks.forEach(function (a) {
      var p = proyecto(a.getAttribute("data-tour-pick"));
      if (!p || !p.tour) { a.hidden = true; return; }
      a.href = p.tour;
      var src = art(p.id), box = $(".tour-pick-art", a);
      if (src && box) box.appendChild(src.cloneNode(true));
      a.addEventListener("click", function (e) {
        if (blocked) return; // sin marco: el enlace abre el recorrido en otra pestaña
        e.preventDefault();
        select(p.id, state() === "live" || state() === "loading");
      });
    });

    function select(id, go) {
      var p = proyecto(id);
      if (!p || !p.tour) return;
      var changed = id !== cur;
      cur = id;
      picks.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("data-tour-pick") === id ? "true" : "false"); });
      if (changed) {
        poster.innerHTML = "";
        var src = art(id);
        if (src) poster.appendChild(src.cloneNode(true));
        setText("[data-tour-name], [data-tour-hud-name], [data-tour-dock-name]", p.nombre);
        setText("[data-tour-region]", p.region + " · " + p.zona);
        setText("[data-tour-label]", "al recorrido 360° de " + p.nombre);
        lens.href = p.tour;
        $$("[data-tour-newtab]", root).forEach(function (a) { a.href = p.tour; });
        var share = $("[data-tour-share]", root);
        if (share) share.href = "https://wa.me/?text=" + encodeURIComponent("Mira el recorrido 360° de " + p.nombre + " de Fundos Inmobiliaria: " + p.tour);
      }
      if (go) enter();
      else if (changed) leave();
    }

    // Centro del portal: la lente
    function center() {
      var s = stage.getBoundingClientRect(), l = lens.getBoundingClientRect();
      if (!l.width) return;
      stage.style.setProperty("--cx", Math.round(l.left + l.width / 2 - s.left) + "px");
      stage.style.setProperty("--cy", Math.round(l.top + l.height / 2 - s.top) + "px");
    }
    function drop(f, wait) {
      window.setTimeout(function () { if (f && f.parentNode) f.parentNode.removeChild(f); }, wait);
    }

    function enter() {
      if (blocked) return;
      var p = T(), my = ++token;
      window.clearTimeout(timer);
      if (state() === "live") { state("loading"); drop(iframe, reduced ? 0 : 650); iframe = null; }
      else { drop(iframe, 0); iframe = null; }
      center();
      state("loading");
      setText("[data-tour-cta]", "Cargando");
      status.textContent = "Cargando el recorrido de " + p.nombre + "…";
      var f = document.createElement("iframe");
      f.src = p.tour;
      f.title = "Recorrido virtual 360° de " + p.nombre;
      f.setAttribute("allow", "fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking; autoplay");
      f.setAttribute("allowfullscreen", "");
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      f.addEventListener("load", function () { window.setTimeout(function () { reveal(my); }, 180); });
      // Se espera al cierre del portal anterior antes de montar el nuevo
      window.setTimeout(function () { if (my === token && !blocked) { frame.appendChild(f); iframe = f; } }, frame.firstChild ? (reduced ? 0 : 650) : 0);
      timer = window.setTimeout(function () { reveal(my); }, 12000);
    }
    function reveal(my) {
      if (my !== token || blocked || state() !== "loading") return;
      window.clearTimeout(timer);
      state("live");
      setText("[data-tour-cta]", "Entrar");
      status.textContent = "Recorrido de " + T().nombre + " abierto. Arrastra para mirar alrededor.";
    }
    function leave() {
      token++;
      window.clearTimeout(timer);
      if (blocked) return;
      var was = state();
      state("poster");
      setText("[data-tour-cta]", "Entrar");
      exitFull();
      drop(iframe, was === "live" && !reduced ? 700 : 0); // el marco se retira al cerrarse el portal
      iframe = null;
      if (was === "live") status.textContent = "Saliste del recorrido.";
    }

    // Donde no se permite incrustar otros sitios (política de seguridad), se ofrece abrirlo aparte
    document.addEventListener("securitypolicyviolation", function (e) {
      var d = e.effectiveDirective || e.violatedDirective || "";
      if (blocked || state() !== "loading" || !/^(frame|child|default)-src/.test(d)) return;
      blocked = true;
      token++;
      window.clearTimeout(timer);
      drop(iframe, 0); iframe = null;
      state("blocked");
      setText("[data-tour-cta]", "Abrir");
      status.textContent = "El recorrido no se puede mostrar aquí. Puedes abrirlo en una pestaña nueva.";
    });

    lens.addEventListener("click", function (e) {
      if (blocked) return;
      e.preventDefault();
      if (state() === "poster") enter();
    });
    $("[data-tour-close]", root).addEventListener("click", function () { leave(); lens.focus({ preventScroll: true }); });

    // Pantalla completa: nativa si el navegador la permite; si no, a toda la ventana
    function isFull() { return document.fullscreenElement === stage || stage.classList.contains("is-immersive"); }
    function syncFull() {
      var on = isFull();
      fullBtn.setAttribute("aria-label", on ? "Salir de pantalla completa" : "Ver en pantalla completa");
      fullBtn.title = on ? "Salir de pantalla completa" : "Pantalla completa";
      $("use", fullBtn).setAttribute("href", on ? "#i-shrink" : "#i-expand");
    }
    function immersive() { stage.classList.add("is-immersive"); document.body.classList.add("tour-lock"); syncFull(); }
    function exitFull() {
      if (document.fullscreenElement === stage && document.exitFullscreen) {
        var r = document.exitFullscreen();
        if (r && r.catch) r.catch(function () {});
      }
      stage.classList.remove("is-immersive");
      document.body.classList.remove("tour-lock");
      syncFull();
    }
    fullBtn.addEventListener("click", function () {
      if (isFull()) { exitFull(); return; }
      if (stage.requestFullscreen && document.fullscreenEnabled) {
        var r = stage.requestFullscreen();
        if (r && r.then) r.then(syncFull, immersive);
      } else immersive();
    });
    document.addEventListener("fullscreenchange", syncFull);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && stage.classList.contains("is-immersive")) exitFull(); });

    // La ilustración responde al cursor mientras espera
    if (fineHover && !reduced) {
      stage.addEventListener("pointermove", function (e) {
        if (state() === "live") return;
        var r = stage.getBoundingClientRect();
        stage.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        stage.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
    }

    // Acciones de cierre
    var plan = $("[data-tour-plan]", root), visit = $("[data-tour-visit]", root);
    if (plan) plan.addEventListener("click", function () { Plan.show(cur); });
    if (visit) visit.addEventListener("click", function () {
      Visit.prefill({ proyecto: T().nombre, mensaje: "Vi el recorrido 360° de " + T().nombre + " y me gustaría visitarlo." });
    });

    // Conexión anticipada a los recorridos cuando la sección se acerca
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        var seen = {};
        proyectos.forEach(function (p) {
          if (!p.tour) return;
          var o = p.tour.split("/").slice(0, 3).join("/");
          if (seen[o]) return;
          seen[o] = 1;
          var l = document.createElement("link");
          l.rel = "preconnect"; l.href = o;
          document.head.appendChild(l);
        });
      }, { rootMargin: "600px 0px" });
      io.observe(root);
    }

    // Accesos desde otras partes de la página
    Tour.open = function (id, go) { select(id, go); };
    $$("[data-tour-open]").forEach(function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("data-tour-open");
        if (id === "plan") {
          var t = $('#plano [data-tab][aria-selected="true"]');
          id = t ? t.getAttribute("data-tab") : cur;
        }
        select(id, true);
      });
    });

    var m = /^#recorrido-([a-z0-9-]+)$/.exec(location.hash);
    select(m && proyecto(m[1]) ? m[1] : first.id, false);
    if (m) window.setTimeout(function () { scrollToEl($("#recorrido")); }, 80);
  }

  /* =============================================================
     Videos: portada del hero y visor para cada proyecto
     Se configuran en lib/manifest.js (videoPortada y video de cada proyecto)
     ============================================================= */
  function videoSource(src) {
    var m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/.exec(src);
    if (m) return { frame: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0&playsinline=1", link: "https://www.youtube.com/watch?v=" + m[1] };
    m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(src);
    if (m) return { frame: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&title=0&byline=0&portrait=0", link: "https://vimeo.com/" + m[1] };
    return { file: src, link: src };
  }

  function initVideo() {
    // Portada: video de fondo sobre la ilustración (que queda como respaldo)
    var hv = B.videoPortada || {}, hero = $("[data-hero]"), heroArt = hero && $(".hero-art", hero);
    var conn = navigator.connection || {};
    var light = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
    if ((hv.mp4 || hv.webm) && heroArt && !reduced && !light) {
      var v = document.createElement("video"), toggle = $("[data-hero-video-toggle]");
      v.className = "hero-video";
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      v.preload = "auto";
      if (hv.poster) v.poster = hv.poster;
      [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(function (t) {
        if (!hv[t[0]]) return;
        var so = document.createElement("source");
        so.src = hv[t[0]]; so.type = t[1];
        v.appendChild(so);
      });
      v.addEventListener("playing", function () {
        hero.classList.add("has-video");
        if (toggle) toggle.hidden = false;
      });
      heroArt.insertBefore(v, $(".hero-grain", heroArt));
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
      if (toggle) toggle.addEventListener("click", function () {
        var paused = !v.paused;
        if (paused) v.pause(); else v.play();
        toggle.setAttribute("aria-label", paused ? "Reproducir el video de portada" : "Pausar el video de portada");
        $("use", toggle).setAttribute("href", paused ? "#i-play" : "#i-pause");
      });
    }

    // Visor
    var dlg = $("[data-vdialog]");
    if (!dlg || typeof dlg.showModal !== "function") return;
    var box = $("[data-vd-frame]", dlg), title = $("[data-vd-title]", dlg);
    var blockedMsg = $("[data-vd-blocked]", dlg), link = $("[data-vd-link]", dlg);
    var loading = false;

    function stop() { box.innerHTML = ""; loading = false; }
    function open(id) {
      var p = proyecto(id);
      if (!p || !p.video) return;
      var s = videoSource(p.video);
      title.textContent = p.nombre + " en video";
      link.href = s.link;
      blockedMsg.hidden = true;
      box.hidden = false;
      stop();
      if (s.frame) {
        var f = document.createElement("iframe");
        f.src = s.frame;
        f.title = "Video de " + p.nombre;
        f.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
        f.setAttribute("allowfullscreen", "");
        f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        loading = true;
        box.appendChild(f);
      } else {
        var v = document.createElement("video");
        v.src = s.file; v.controls = true; v.autoplay = true; v.playsInline = true;
        v.setAttribute("playsinline", "");
        box.appendChild(v);
      }
      dlg.showModal();
    }
    Video.open = open;
    // Si el sitio no permite incrustar reproductores externos, se ofrece el enlace
    document.addEventListener("securitypolicyviolation", function (e) {
      var d = e.effectiveDirective || e.violatedDirective || "";
      if (!loading || !dlg.open || !/^(frame|child|default)-src/.test(d)) return;
      stop();
      box.hidden = true;
      blockedMsg.hidden = false;
    });
    $("[data-vd-close]", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", stop);

    $$("[data-video-open]").forEach(function (b) {
      var p = proyecto(b.getAttribute("data-video-open"));
      if (!p || !p.video) return;
      b.hidden = false;
      b.addEventListener("click", function () { open(p.id); });
    });
  }

  /* =============================================================
     Barra de acción móvil
     ============================================================= */
  function initMobileBar() {
    var bar = $("[data-mbar]"), hero = $("[data-hero]"), visit = $("#visita");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var pastHero = false, atVisit = false;
    function update() {
      bar.classList.toggle("is-visible", pastHero && !atVisit && !document.body.classList.contains("sheet-open"));
    }
    new IntersectionObserver(function (en) { pastHero = en[0].intersectionRatio < 0.3; update(); }, { threshold: [0, 0.3] }).observe(hero);
    if (visit) new IntersectionObserver(function (en) { atVisit = en[0].isIntersecting; update(); }, { threshold: 0.12 }).observe(visit);
    document.addEventListener("fundos:sheet", update);
  }

  /* =============================================================
     Preguntas: una abierta a la vez
     ============================================================= */
  function initFaq() {
    var items = $$(".faq details");
    items.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* =============================================================
     Arranque
     ============================================================= */
  function boot() {
    document.documentElement.classList.add("js");
    safe(initContact, "initContact");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initHero, "initHero");
    safe(initProjects, "initProjects");
    safe(initVisit, "initVisit");
    safe(initSim, "initSim");
    safe(initPlan, "initPlan");
    safe(initTour, "initTour");
    safe(initVideo, "initVideo");
    safe(initFinder, "initFinder");
    safe(initDialog, "initDialog");
    safe(initMobileBar, "initMobileBar");
    safe(initFaq, "initFaq");
    $$('input[type="range"]').forEach(paintRange);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
