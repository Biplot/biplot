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
  /* ---- Formato estándar de planos Fundos (igual para todos los proyectos) ----
     Solo cambian la geometría (lib/planos.js) y las categorías de precio (lib/manifest.js). */
  var PLANO = {
    predio: "#A2A3A1",     // base del predio bajo los lotes
    vendida: "#A8A8A8",    // lotes vendidos
    marcaVendida: "V",     // marca de vendido, como en los masterplan
    agua: "#3E9FD6"
  };
  var HEART = "M0 3.6C-3.9 1-5.2-.9-5.2-2.5a2.6 2.6 0 0 1 5.2-.8 2.6 2.6 0 0 1 5.2.8C5.2-.9 3.9 1 0 3.6Z";
  function tituloPrecios(p) {
    var cats = p.categorias || {};
    return Object.keys(cats).some(function (k) { return cats[k].lista; }) ? "Precio oferta" : "Precios";
  }
  // Holgura típica de los lotes (percentil 20, en unidades del plano): define la escala legible
  function planR20(P) {
    var rs = Object.keys((P && P.lotes) || {}).map(function (k) { return P.lotes[k].r || 20; }).sort(function (a, b) { return a - b; });
    return rs.length ? rs[Math.floor(rs.length * 0.2)] : 20;
  }
  // Plano con el lenguaje de los masterplan de Fundos: terreno, colores por precio, vendidas y números.
  // Los números (pins) se dibujan a tamaño fijo en pantalla: la variable --u los reescala al hacer zoom.
  function svgPlan(p) {
    var P = (B.planos || {})[p.id];
    if (!P) return '<p class="noscript">El plano de ' + esc(p.nombre) + " estará disponible pronto.</p>";
    var vb = P.viewBox, lots = [];
    p.lotes.forEach(function (l) { var q = P.lotes[l.n]; if (q) lots.push({ l: l, d: q.d, cx: q.l[0], cy: q.l[1] }); });
    var calles = P.calles || [], agua = P.agua || [], camino = P.caminoPrincipal || "", contorno = P.contorno;
    var cats = p.categorias || {};
    var s = [];
    s.push('<svg class="plan-svg" viewBox="' + vb.join(" ") + '" data-base="' + vb.join(" ") + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Plano de lotes de ' + esc(p.nombre) + '. Usa las flechas para moverte entre lotes y Enter para ver el detalle.">');
    s.push('<defs>' +
      '<filter id="pl-terreno" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="4"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.17  0 0 0 0 0.09  1.4 0 0 0 -0.45"/></filter>' +
      '<filter id="pl-grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 0.9 -0.42"/></filter>' +
      '<filter id="pl-sombra" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".45"/></filter>' +
      '<pattern id="lot-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#E9E3D7" fill-opacity=".85"/><rect width="2.6" height="7" fill="#8C8474"/></pattern>' +
      (contorno ? '<clipPath id="pl-predio"><path d="' + contorno + '"/></clipPath>' : "") + "</defs>");
    var full = 'x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '"';
    var wide = 'x="' + (vb[0] - vb[2]) + '" y="' + (vb[1] - vb[3]) + '" width="' + (vb[2] * 3) + '" height="' + (vb[3] * 3) + '"';
    s.push('<rect ' + wide + ' fill="#1A2317"/><rect ' + wide + ' filter="url(#pl-terreno)" opacity=".9"/>');
    // Predio: base uniforme con sombra suave y borde, igual en todos los planos
    if (contorno) s.push('<path class="pl-predio" d="' + contorno + '" filter="url(#pl-sombra)"/>');
    s.push('<g' + (contorno ? ' clip-path="url(#pl-predio)"' : "") + '><rect ' + full + ' fill="' + PLANO.predio + '"/><rect ' + full + ' filter="url(#pl-grano)" opacity=".35"/></g>');
    s.push('<g class="lots">');
    lots.forEach(function (o) {
      var l = o.l, c = cats[l.cat];
      var fill = l.estado === "vendida" ? PLANO.vendida : (c ? c.color : "#C8A165");
      var aria = "Lote " + l.n + ", " + ESTADO[l.estado].toLowerCase() + (l.precio && l.estado !== "vendida" ? ", " + clp(l.precio) : "");
      s.push('<path class="lot st-' + l.estado + '" style="--c:' + fill + '" data-n="' + l.n + '" tabindex="-1" role="button" aria-label="' + esc(aria) + '" d="' + o.d + '"/>');
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
    // Pins: disponible = disco blanco con el color de su precio; vendida = cápsula discreta "V · n"
    s.push('<g class="pl-pins" aria-hidden="true">');
    lots.forEach(function (o) {
      var l = o.l, n = l.n, c = cats[l.cat];
      var st = 'style="transform:translate(' + o.cx + "px," + o.cy + "px) scale(var(--u,1))" + (c ? ";--c:" + c.color : "") + '"';
      if (l.estado === "vendida") {
        var two = String(n).length > 1, w = two ? 36 : 30;
        s.push('<g class="pin pin-vendida" data-n="' + n + '" ' + st + '><rect class="pin-b" x="' + (-w / 2) + '" y="-9" width="' + w + '" height="18" rx="9"/>' +
          '<text class="pin-v" x="' + (-w / 2 + 9.5) + '">' + PLANO.marcaVendida + '</text><text class="pin-t" x="' + (w / 2 - (two ? 11.5 : 8.5)) + '">' + n + "</text></g>");
        return;
      }
      s.push('<g class="pin pin-' + l.estado + '" data-n="' + n + '" ' + st + '><circle class="pin-sh" r="12.5" cy="1.4"/><circle class="pin-b" r="12"/>' +
        '<text class="pin-t">' + n + '</text><g class="pin-fav" transform="translate(10.5 -10.5)"><circle r="6.8"/><path d="' + HEART + '"/></g></g>');
    });
    s.push("</g></svg>");
    return s.join("");
  }
  // Barra de precios sobre el plano: cada categoría es un filtro
  function catsHtml(p) {
    var cats = p.categorias || {}, disp = disponibles(p);
    var h = ['<p class="pl-title">' + tituloPrecios(p) + '</p><div class="pl-cats" role="group" aria-label="Filtrar por precio">'];
    Object.keys(cats).forEach(function (k) {
      var c = cats[k], n = disp.filter(function (l) { return l.cat === k; }).length;
      h.push('<button type="button" class="pl-cat" data-cat="' + k + '" aria-pressed="false"' + (n ? "" : " disabled") + ' style="--c:' + c.color + '">' +
        '<i class="sw" aria-hidden="true"></i><span class="pl-price">' + (c.lista ? '<s><span class="sr-only">Antes </span>' + clp(c.lista) + "</s> " : "") + "<b>" + clp(c.precio) + "</b></span>" +
        "<small>" + (n ? n + (n === 1 ? " disponible" : " disponibles") : "Agotado") + "</small></button>");
    });
    h.push("</div>");
    return h.join("");
  }
  // Leyenda estándar bajo el plano: encabezado con cifras y simbología
  function legendHtml(p) {
    var P = (B.planos || {})[p.id] || {};
    var nDisp = disponibles(p).length;
    var nVend = p.lotes.filter(function (l) { return l.estado === "vendida"; }).length;
    var nRes = p.lotes.filter(function (l) { return l.estado === "reservada"; }).length;
    var h = ['<div class="pl-head"><div><p class="pl-kicker">Plano de loteo</p><p class="pl-name">Fundos de ' + esc(p.nombre) + "</p></div>" +
      '<p class="pl-stats"><span><b>' + nDisp + "</b> " + (nDisp === 1 ? "disponible" : "disponibles") + "</span>" + (nRes ? "<span><b>" + nRes + "</b> " + (nRes === 1 ? "reservada" : "reservadas") + "</span>" : "") +
      "<span><b>" + nVend + "</b> " + (nVend === 1 ? "vendida" : "vendidas") + "</span><span><b>" + p.lotes.length + "</b> parcelas</span></p></div>"];
    h.push('<ul class="pl-symbols">');
    h.push('<li><i class="sym sym-disp" aria-hidden="true">7</i>Disponible (color según precio)</li>');
    h.push('<li><i class="sym sym-v" aria-hidden="true">' + PLANO.marcaVendida + " 12</i>Vendida</li>");
    if (nRes) h.push('<li><i class="sw sw-reservada" aria-hidden="true"></i>Reservada</li>');
    if ((P.calles || []).length) h.push('<li><i class="sw sw-servidumbre" aria-hidden="true"></i>Servidumbre de tránsito</li>');
    if (P.caminoPrincipal) h.push('<li><i class="sw sw-principal" aria-hidden="true"></i>Camino principal</li>');
    (P.agua || []).forEach(function (a) { h.push('<li><i class="sw sw-agua" aria-hidden="true"></i>' + esc(a.nombre) + "</li>"); });
    h.push('<li><i class="sym sym-fav" aria-hidden="true"><svg viewBox="-7 -7 14 14"><path d="' + HEART + '"/></svg></i>Tu favorito</li></ul>');
    return h.join("");
  }

  function initPlan() {
    var root = $("[data-plan]");
    if (!root) return;
    var canvas = $("[data-canvas]", root), list = $("[data-list]", root), stage = $("[data-stage]", root);
    var tip = $("[data-tip]", root), prev = $("[data-preventa-panel]", root), legend = $("[data-legend]", root), hint = $("[data-hint]", root);
    var cats = $("[data-cats]", root), empty = $("[data-plan-empty]", root), live = $("[data-plan-live]", root);
    var summary = $("[data-summary]", root), clearBtn = $("[data-clear-filters]", root);
    var price = $("[data-price]", root), priceOut = $("[data-price-out]", root);
    var tabs = $$("[data-tab]", root), views = $$("[data-view]", root);
    var viewToggle = $(".view-toggle", root), filtersBox = $("[data-filters]", root), statusBox = $(".status-filter", root);
    var fToggle = $("[data-filters-toggle]", root), fCount = $("[data-filter-count]", root);
    var checks = $$(".status-filter input", root);
    var zoomUi = $("[data-zoom-ui]", root);
    var panel = $("[data-panel]"), pEmpty = $("[data-panel-empty]"), pDetail = $("[data-panel-detail]"), pStats = $("[data-panel-stats]"), pShort = $("[data-panel-short]");
    var backdrop = $("[data-sheet-backdrop]"), grab = $("[data-sheet-grab]");
    var d = {
      project: $("[data-d-project]"), title: $("[data-d-title]"), status: $("[data-d-status]"), sector: $("[data-d-sector]"),
      price: $("[data-d-price]"), m2: $("[data-d-m2]"), reserva: $("[data-d-reserva]"), saldo: $("[data-d-saldo]"),
      m2price: $("[data-d-m2price]"), reserve: $("[data-d-reserve]"), wa: $("[data-d-wa]"), fav: $("[data-d-fav]"),
      sim: $("[data-d-sim]"), close: $("[data-panel-close]"), facts: $(".lot-facts", pDetail), alts: $("[data-d-alts]"), toast: $("[data-d-toast]")
    };
    var favBox = $("[data-favs]"), favCount = $("[data-favs-count]"), favLabel = $("[data-favs-label]");
    var favList = $("[data-favs-list]"), favSend = $("[data-favs-send]"), favClear = $("[data-favs-clear]");
    var favMain = $("[data-favs-main]"), favUndo = $("[data-favs-undo]"), favRestore = $("[data-favs-restore]");

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
    function PL() { return (B.planos || {})[S.id]; }
    function pt(n) { var q = PL() && PL().lotes[n]; return q ? q.l : null; }
    function lotOf(p, n) { for (var i = 0; i < p.lotes.length; i++) if (p.lotes[i].n === n) return p.lotes[i]; return null; }
    // Un lote pasa los filtros; el tope de precio y la categoría solo aplican a lotes con precio (los vendidos no)
    function passes(l) {
      return !!S.est[l.estado] && (S.max === Infinity || (l.precio != null && l.estado !== "vendida" && l.precio <= S.max)) &&
        (S.sector === "" || l.cat === S.sector);
    }
    function filtersActive() { return S.max < Infinity || S.sector !== "" || !S.est.disponible || !S.est.reservada || !S.est.vendida; }
    function isFav(id, n) { return favs.indexOf(id + ":" + n) > -1; }
    function navBottom() { var nv = $(".nav"); return nv ? Math.max(0, nv.getBoundingClientRect().bottom) : 0; }
    // Salto sin animación (al abrir un enlace directo)
    function jumpTo(y) {
      var html = document.documentElement, prevB = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prevB;
    }
    function announce(t) { if (live) { live.textContent = ""; window.setTimeout(function () { live.textContent = t; }, 30); } }
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
      if (cats) cats.innerHTML = catsHtml(p);
      if (legend) legend.innerHTML = legendHtml(p);
      var svg = $("svg", canvas);
      shapes = {};
      $$(".lot", svg).forEach(function (el) { shapes[el.getAttribute("data-n")] = { path: el }; });
      $$(".pin", svg).forEach(function (el) { var s = shapes[el.getAttribute("data-n")]; if (s) s.pin = el; });
      ring = $(".lot-ring", svg);
      root.classList.toggle("is-wide", isWide());
      layoutPlan(true);
    }
    function isWide() { var b = (PL() && PL().viewBox) || [0, 0, 1000, 640]; return b[2] / b[3] > 2; }

    /* ---- Zoom y desplazamiento del plano ----
       Botones + / − / completo, pellizco, arrastre, doble clic y Ctrl + rueda.
       En pantallas chicas el plano parte a una escala donde cada lote se puede tocar, centrado en los disponibles. */
    var Z = { base: null, W: 0, H: 0, fitW: 0, fitH: 0, k: 1, cx: 0, cy: 0, anim: 0, r20: 20 };
    var MAXK = 6;
    function isSmall() { return window.innerWidth < 720; }
    function layoutPlan(reset) {
      var svg = $("svg", canvas);
      if (!svg || canvas.hidden) return;
      var b = (svg.getAttribute("data-base") || "0 0 1000 640").split(" ").map(Number);
      Z.base = b;
      Z.r20 = planR20(PL());
      var W = canvas.clientWidth || 1;
      var H = W * b[3] / b[2];
      if (isSmall()) H = clamp(H * 1.5, 260, Math.min(window.innerHeight * 0.6, 460));
      if (!reset && Z.W === W && Z.H) H = Z.H;    // la barra del navegador móvil cambia innerHeight: la altura no salta
      canvas.style.height = Math.round(H) + "px";
      Z.W = W; Z.H = H;
      var a = W / H;
      if (b[2] / b[3] > a) { Z.fitW = b[2]; Z.fitH = b[2] / a; } else { Z.fitH = b[3]; Z.fitW = b[3] * a; }
      if (reset) {
        Z.k = 1; Z.cx = b[0] + b[2] / 2; Z.cy = b[1] + b[3] / 2;
        if (isSmall()) {
          // lotes de ~36 px: se pueden tocar sin errar
          Z.k = clamp((18 / Z.r20) * Z.fitW / W, 1, MAXK);
          var pts = disponibles(P()).map(function (l) { return pt(l.n); }).filter(Boolean);
          if (pts.length) {
            Z.cx = pts.reduce(function (t, q) { return t + q[0]; }, 0) / pts.length;
            Z.cy = pts.reduce(function (t, q) { return t + q[1]; }, 0) / pts.length;
          }
        }
      }
      applyView();
    }
    function clampView() {
      var b = Z.base, vw = Z.fitW / Z.k, vh = Z.fitH / Z.k;
      Z.cx = vw >= b[2] ? b[0] + b[2] / 2 : clamp(Z.cx, b[0] + vw / 2, b[0] + b[2] - vw / 2);
      Z.cy = vh >= b[3] ? b[1] + b[3] / 2 : clamp(Z.cy, b[1] + vh / 2, b[1] + b[3] - vh / 2);
    }
    function applyView() {
      var svg = $("svg", canvas);
      if (!svg || !Z.base) return;
      Z.k = clamp(Z.k, 1, MAXK);
      clampView();
      var vw = Z.fitW / Z.k, vh = Z.fitH / Z.k;
      svg.setAttribute("viewBox", [(Z.cx - vw / 2).toFixed(2), (Z.cy - vh / 2).toFixed(2), vw.toFixed(2), vh.toFixed(2)].join(" "));
      // Pins a tamaño constante en pantalla; se achican un poco si los lotes se ven muy chicos
      var upp = vw / Z.W, clearPx = Z.r20 / upp;
      svg.style.setProperty("--u", (upp * clamp(clearPx / 15, 0.62, 1)).toFixed(4));
      svg.classList.toggle("is-dense", clearPx < 11);
      canvas.classList.toggle("is-zoomed", Z.k > 1.01);
      if (zoomUi) {
        $('[data-zoom="in"]', zoomUi).disabled = Z.k >= MAXK - 0.01;
        $('[data-zoom="out"]', zoomUi).disabled = Z.k <= 1.01;
        $('[data-zoom="fit"]', zoomUi).disabled = Z.k <= 1.01;
      }
    }
    // Punto de la pantalla -> coordenadas del plano
    function toPlan(clientX, clientY) {
      var r = canvas.getBoundingClientRect(), vw = Z.fitW / Z.k, vh = Z.fitH / Z.k;
      return [Z.cx - vw / 2 + (clientX - r.left) / r.width * vw, Z.cy - vh / 2 + (clientY - r.top) / r.height * vh];
    }
    // Acerca o aleja manteniendo fijo el punto (px, py) del plano
    function zoomAt(k, px, py) {
      var k0 = Z.k;
      k = clamp(k, 1, MAXK);
      if (px == null) { px = Z.cx; py = Z.cy; }
      Z.cx = px - (px - Z.cx) * k0 / k;
      Z.cy = py - (py - Z.cy) * k0 / k;
      Z.k = k;
      applyView();
    }
    function animateTo(k, cx, cy, done) {
      window.cancelAnimationFrame(Z.anim);
      if (reduced) { Z.k = k; Z.cx = cx; Z.cy = cy; applyView(); if (done) done(); return; }
      var s0 = { k: Z.k, cx: Z.cx, cy: Z.cy }, t0 = performance.now();
      (function step(t) {
        var u = Math.min(1, (t - t0) / 260), e = 1 - Math.pow(1 - u, 3);
        Z.k = s0.k + (k - s0.k) * e; Z.cx = s0.cx + (cx - s0.cx) * e; Z.cy = s0.cy + (cy - s0.cy) * e;
        applyView();
        if (u < 1) Z.anim = window.requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function zoomBy(f, px, py) {
      var k = clamp(Z.k * f, 1, MAXK), k0 = Z.k;
      if (px == null) { px = Z.cx; py = Z.cy; }
      animateTo(k, px - (px - Z.cx) * k0 / k, py - (py - Z.cy) * k0 / k);
      hideHint();
    }
    // Lleva un lote a la vista si quedó fuera o bajo los controles (lista, teclado, enlaces, alternativas)
    function reveal(n, done) {
      var q = pt(n);
      if (!q || !Z.base || canvas.hidden) { if (done) done(); return; }
      var vw = Z.fitW / Z.k, vh = Z.fitH / Z.k, x = q[0], y = q[1];
      var safeB = zoomUi ? (zoomUi.offsetHeight + 16) / Z.H * vh : 0;
      var inside = x > Z.cx - vw / 2 + vw * 0.1 && x < Z.cx + vw / 2 - vw * 0.1 &&
        y > Z.cy - vh / 2 + vh * 0.1 && y < Z.cy + vh / 2 - Math.max(vh * 0.1, safeB);
      if (inside) { if (done) done(); return; }
      animateTo(Z.k, x, y, done);
    }
    if (zoomUi) zoomUi.addEventListener("click", function (e) {
      var b = e.target.closest("[data-zoom]");
      if (!b || b.disabled) return;
      var a = b.getAttribute("data-zoom");
      if (a === "in") zoomBy(1.6);
      else if (a === "out") zoomBy(1 / 1.6);
      else { animateTo(1, Z.base[0] + Z.base[2] / 2, Z.base[1] + Z.base[3] / 2); hideHint(); }
    });
    canvas.addEventListener("wheel", function (e) {
      if (!(e.ctrlKey || e.metaKey) || canvas.hidden) return;   // la rueda sola sigue desplazando la página
      e.preventDefault();
      var q = toPlan(e.clientX, e.clientY);
      zoomAt(Z.k * Math.exp(-e.deltaY * 0.0022), q[0], q[1]);
      hideHint();
    }, { passive: false });
    // Doble clic acerca solo con mouse: en pantallas táctiles el primer toque ya abre el lote
    var lastPtr = "mouse";
    canvas.addEventListener("dblclick", function (e) {
      if (lastPtr !== "mouse") return;
      var q = toPlan(e.clientX, e.clientY);
      zoomBy(Z.k >= MAXK - 0.01 ? 1 / MAXK : 2, q[0], q[1]);
    });
    // Arrastre (mouse o un dedo en horizontal) y pellizco (dos dedos)
    var ptrs = {}, drag = null, moved = false;
    canvas.addEventListener("pointerdown", function (e) {
      lastPtr = e.pointerType;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      moved = false;
      var ids = Object.keys(ptrs);
      if (ids.length === 1) drag = { x: e.clientX, y: e.clientY, cx: Z.cx, cy: Z.cy };
      else if (ids.length === 2) {
        var a = ptrs[ids[0]], c = ptrs[ids[1]];
        drag = { pinch: Math.hypot(a.x - c.x, a.y - c.y), k: Z.k, mid: toPlan((a.x + c.x) / 2, (a.y + c.y) / 2) };
        hideHint();
      }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!ptrs[e.pointerId] || !drag) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs), r = canvas.getBoundingClientRect();
      if (ids.length >= 2 && drag.pinch) {
        var a = ptrs[ids[0]], c = ptrs[ids[1]], dd = Math.hypot(a.x - c.x, a.y - c.y);
        Z.k = clamp(drag.k * dd / drag.pinch, 1, MAXK);
        var vw = Z.fitW / Z.k, vh = Z.fitH / Z.k, mx = (a.x + c.x) / 2 - r.left, my = (a.y + c.y) / 2 - r.top;
        Z.cx = drag.mid[0] - (mx / r.width - 0.5) * vw;
        Z.cy = drag.mid[1] - (my / r.height - 0.5) * vh;
        moved = true;
        applyView();
        return;
      }
      if (Z.k <= 1.01 || drag.pinch) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      if (!moved) { moved = true; hideHint(); try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ } }
      canvas.classList.add("is-dragging");
      Z.cx = drag.cx - dx / r.width * (Z.fitW / Z.k);
      Z.cy = drag.cy - dy / r.height * (Z.fitH / Z.k);
      tip.hidden = true;
      applyView();
    });
    function endPtr(e) {
      delete ptrs[e.pointerId];
      var ids = Object.keys(ptrs);
      if (!ids.length) { drag = null; canvas.classList.remove("is-dragging"); }
      else if (ids.length === 1) { var q = ptrs[ids[0]]; drag = { x: q.x, y: q.y, cx: Z.cx, cy: Z.cy }; }
    }
    canvas.addEventListener("pointerup", endPtr);
    canvas.addEventListener("pointercancel", endPtr);
    // Un arrastre no debe seleccionar el lote donde termina
    canvas.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); moved = false; } }, true);
    var rzT = 0, lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      window.clearTimeout(rzT);
      rzT = window.setTimeout(function () {
        var crossed = (lastW < 720) !== isSmall();
        lastW = window.innerWidth;
        layoutPlan(crossed);
      }, 120);
    });

    // Aviso de gestos (táctil): se oculta con la primera interacción y no vuelve en la sesión
    var hintKey = "fundos-plan-hint";
    function hideHint() {
      if (!hint || hint.hidden) return;
      hint.hidden = true;
      try { window.sessionStorage.setItem(hintKey, "1"); } catch (e) { /* sin almacenamiento */ }
    }
    function showHint() {
      if (!hint) return;
      var seen = false;
      try { seen = window.sessionStorage.getItem(hintKey) === "1"; } catch (e) { seen = false; }
      hint.hidden = seen || S.view !== "plano" || !mm("(pointer: coarse)").matches;
    }

    function renderList() {
      var p = P();
      var key = function (l) { return S.sort === "precio" ? (l.estado === "vendida" || !l.precio ? 1e12 : l.precio) : l[S.sort]; };
      var rows = p.lotes.filter(passes).sort(function (a, b) { return (key(a) - key(b)) * S.dir || a.n - b.n; });
      if (!rows.length) { list.innerHTML = '<p class="list-empty">No hay lotes con estos filtros. <button type="button" class="link-btn" data-clear-filters>Limpiar filtros</button></p>'; return; }
      var hasLista = p.lotes.some(function (l) { return l.lista && l.estado !== "vendida"; });
      var m2s = p.lotes.map(function (l) { return l.m2; }), sameM2 = m2s.every(function (v) { return v === m2s[0]; });
      var arrow = function (k) { return S.sort === k ? (S.dir > 0 ? " ↑" : " ↓") : ""; };
      var sortAttr = function (k) { return ' aria-sort="' + (S.sort === k ? (S.dir > 0 ? "ascending" : "descending") : "none") + '"'; };
      var h = ['<table class="lot-table"><caption class="sr-only">Lotes de ' + esc(p.nombre) + (sameM2 ? ", todos de " + m2(m2s[0]) : "") + '</caption><thead><tr>',
        '<th scope="col"' + sortAttr("n") + '><button type="button" data-sort="n">Lote' + arrow("n") + "</button></th>",
        '<th scope="col"' + sortAttr("precio") + '><button type="button" data-sort="precio">Precio' + arrow("precio") + "</button></th>",
        hasLista ? '<th scope="col" class="t-sector">Antes</th>' : "",
        sameM2 ? "" : '<th scope="col" class="t-m2"' + sortAttr("m2") + '><button type="button" data-sort="m2">Superficie' + arrow("m2") + "</button></th>",
        '<th scope="col">Estado</th><th scope="col"><span class="sr-only">Acción</span></th></tr></thead><tbody>'];
      rows.forEach(function (l) {
        var sold = l.estado === "vendida", c = (p.categorias || {})[l.cat];
        h.push('<tr data-n="' + l.n + '"' + (S.sel === l.n ? ' class="is-active"' : "") + ">" +
          '<td class="t-num">' + l.n + (isFav(p.id, l.n) ? ' <svg class="i t-fav" aria-label="Favorito" role="img"><use href="#i-heart"/></svg>' : "") + "</td>" +
          '<td class="t-price">' + (sold ? '<span class="t-muted">—</span>' : '<i class="t-cat" style="--c:' + (c ? c.color : "transparent") + '"></i>' + clp(l.precio)) + "</td>" +
          (hasLista ? '<td class="t-sector">' + (l.lista && !sold ? "<s>" + clp(l.lista) + "</s>" : "") + "</td>" : "") +
          (sameM2 ? "" : '<td class="t-m2">' + m2(l.m2) + "</td>") +
          '<td><span class="dot st-' + l.estado + '">' + ESTADO[l.estado] + "</span></td>" +
          '<td class="t-sel"><button type="button" data-n="' + l.n + '" aria-label="Ver lote ' + l.n + '">Ver</button></td></tr>');
      });
      h.push("</tbody></table>");
      list.innerHTML = h.join("");
    }

    /* ---- Estado visual ---- */
    function applyFilters() {
      var p = P(), any = false;
      p.lotes.forEach(function (l) {
        var sh = shapes[l.n];
        if (!sh) return;
        var ok = passes(l);
        any = any || ok;
        sh.path.classList.toggle("is-dim", !ok);
        if (sh.pin) sh.pin.classList.toggle("is-dim", !ok);
      });
      $$(".pl-cat", cats).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cat") === S.sector ? "true" : "false"); });
      if (empty) empty.hidden = any || S.view !== "plano" || !p.lotes.length;
      if (S.view === "lista") renderList();
      rover();
      updateSummary();
    }
    function updateSummary() {
      var p = P();
      if (!p.lotes.length) { summary.textContent = "Preventa · plano y precios muy pronto"; if (clearBtn) clearBtn.hidden = true; return; }
      var all = p.lotes.length, disp = disponibles(p).length, act = filtersActive();
      if (!act) summary.textContent = disp + " de " + all + " lotes disponibles · desde " + clp(desde(p));
      else {
        var hits = p.lotes.filter(passes), dh = hits.filter(function (l) { return l.estado === "disponible"; }).length;
        var tope = S.max < Infinity ? " hasta " + clp(S.max) : "";
        summary.textContent = S.est.disponible
          ? (!dh ? "Ningún lote disponible con estos filtros"
            : dh === disp ? "Mostrando " + (disp === 1 ? "el lote disponible" : "los " + disp + " lotes disponibles")
            : dh + (dh === 1 ? " lote disponible" : " lotes disponibles") + tope + " · de " + disp)
          : hits.length + (hits.length === 1 ? " lote" : " lotes") + " con estos filtros";
      }
      if (clearBtn) clearBtn.hidden = !act;
      var n = (S.max < Infinity ? 1 : 0) + (S.sector ? 1 : 0) + (["disponible", "reservada", "vendida"].filter(function (k) { return !S.est[k]; }).length ? 1 : 0);
      if (fCount) fCount.textContent = n ? " · " + n : "";
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
    function clearFilters() {
      S.est = { disponible: true, reservada: true, vendida: true };
      checks.forEach(function (c) { c.checked = true; });
      S.max = Infinity; S.sector = "";
      syncPrice();
      applyFilters();
    }

    /* ---- Teclado: una sola parada de Tab en el plano y flechas que siguen el mapa ---- */
    function rover(n) {
      var p = P(), target = null;
      if (n != null && shapes[n]) target = n;
      else if (S.sel != null && shapes[S.sel] && passes(lotOf(p, S.sel))) target = S.sel;
      else {
        var cands = p.lotes.filter(function (l) { return passes(l) && shapes[l.n]; });
        var av = cands.filter(function (l) { return l.estado === "disponible"; }).sort(function (a, b) { return a.precio - b.precio; });
        target = (av[0] || cands[0] || {}).n;
      }
      Object.keys(shapes).forEach(function (k) { shapes[k].path.setAttribute("tabindex", +k === target ? "0" : "-1"); });
      return target;
    }
    function spatialNext(n, key) {
      var o = pt(n);
      if (!o) return null;
      var dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[key];
      var best = null;
      P().lotes.forEach(function (l) {
        if (l.n === n || !passes(l)) return;
        var q = pt(l.n);
        if (!q) return;
        var vx = q[0] - o[0], vy = q[1] - o[1];
        var along = vx * dir[0] + vy * dir[1], perp = Math.abs(vx * dir[1] - vy * dir[0]);
        if (along <= 0 || perp > along * 1.6) return;
        var score = along + perp * 2.2;
        if (!best || score < best.s) best = { n: l.n, s: score };
      });
      return best && best.n;
    }

    /* ---- Panel de detalle ---- */
    function shortlistHtml(p) {
      var av = disponibles(p).slice().sort(function (a, b) { return a.precio - b.precio || a.n - b.n; }).slice(0, 6);
      if (!av.length) return "";
      return '<p class="lot-short-title">Disponibles desde el menor precio</p><div class="lot-short-list">' + av.map(function (l) {
        var c = (p.categorias || {})[l.cat];
        return '<button type="button" class="lot-pick" data-pick="' + l.n + '"><i class="sw" style="--c:' + (c ? c.color : "#C8A165") + '" aria-hidden="true"></i><span>Lote ' + l.n + "</span><b>" + clp(l.precio) + "</b></button>";
      }).join("") + "</div>";
    }
    function alternatives(l, k) {
      var o = pt(l.n);
      return disponibles(P()).map(function (x) {
        var q = pt(x.n);
        return { l: x, dist: o && q ? Math.hypot(q[0] - o[0], q[1] - o[1]) : Math.abs(x.n - l.n) * 40 };
      }).sort(function (a, b) { return a.dist - b.dist; }).slice(0, k || 3).map(function (a) { return a.l; });
    }
    function resetPanel() {
      S.sel = null;
      pDetail.hidden = true;
      pEmpty.hidden = false;
      if (ring) ring.style.display = "none";
      if (pShort) pShort.innerHTML = shortlistHtml(P());
      closeSheet(true);
    }
    function fillPanel(p, l) {
      var sold = l.estado === "vendida";
      pEmpty.hidden = true;
      pDetail.hidden = false;
      d.project.textContent = p.nombre + " · " + p.region;
      d.title.textContent = "Lote " + l.n;
      d.status.textContent = ESTADO[l.estado];
      d.status.setAttribute("data-estado", l.estado);
      d.sector.innerHTML = sold ? "Este lote ya tiene dueño. Estos están disponibles cerca:" : (l.lista ? "Precio anterior <s>" + clp(l.lista) + "</s>" : "Precio de venta");
      d.price.hidden = sold;
      d.price.textContent = sold ? "" : clp(l.precio);
      if (d.facts) d.facts.hidden = sold;
      d.m2.textContent = m2(l.m2);
      d.reserva.textContent = clp(RESERVA);
      d.saldo.textContent = l.precio ? clp(l.precio - RESERVA) : "—";
      d.m2price.textContent = l.precio ? clp(l.precio / l.m2) : "—";
      pDetail.classList.toggle("is-closed", l.estado !== "disponible");
      pDetail.classList.toggle("is-sold", sold);
      d.reserve.hidden = sold;
      if (l.estado === "disponible") d.reserve.textContent = "Reservar este lote";
      else if (l.estado === "reservada") d.reserve.textContent = "Avísame si se libera";
      d.reserve.setAttribute("href", "#visita");
      if (d.alts) {
        d.alts.hidden = !sold;
        d.alts.innerHTML = sold ? alternatives(l, 3).map(function (x) {
          var c = (p.categorias || {})[x.cat];
          return '<button type="button" class="lot-pick" data-pick="' + x.n + '"><i class="sw" style="--c:' + (c ? c.color : "#C8A165") + '" aria-hidden="true"></i><span>Lote ' + x.n + "</span><b>" + clp(x.precio) + "</b></button>";
        }).join("") : "";
      }
      $("span", d.wa).textContent = sold ? "Consultar por lotes similares" : "Consultar";
      d.wa.href = waHref(sold
        ? "Hola Fundos, vi que el lote " + l.n + " de " + p.nombre + " está vendido. ¿Me recomiendan uno similar?"
        : "Hola Fundos, me interesa el lote " + l.n + " de " + p.nombre + " (" + m2(l.m2) + ", " + clp(l.precio) + "). ¿Me pueden dar más información?" + lotLink(p, l));
      d.fav.hidden = sold;
      d.sim.hidden = sold;
      if (d.toast) d.toast.hidden = true;
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
      $$(".pin.is-active", canvas).forEach(function (el) { el.classList.remove("is-active"); });
      var sh = shapes[n];
      if (sh && ring) {
        sh.path.classList.add("is-active");
        if (sh.pin) sh.pin.classList.add("is-active");
        ring.setAttribute("d", sh.path.getAttribute("d"));
        ring.style.display = "";
      }
      $$("tr.is-active", list).forEach(function (tr) { tr.classList.remove("is-active"); });
      var row = $('tr[data-n="' + n + '"]', list);
      if (row) row.classList.add("is-active");
      fillPanel(p, l);
      rover(n);
      hideHint();
      announce("Lote " + l.n + ", " + ESTADO[l.estado].toLowerCase() + (l.estado !== "vendida" ? ", " + clp(l.precio) : ""));
      if (opts.hash !== false) {
        try { history.replaceState(null, "", "#lote-" + p.id + "-" + n); } catch (e) { /* marco sin historial */ }
      }
      if (!desktop.matches && opts.sheet !== false) openSheet(n);
      else reveal(n);
    }

    /* ---- Hoja inferior (móvil): vista compacta, fondo, bloqueo de scroll, foco y deslizar para cerrar ---- */
    function sheetMode() { return !desktop.matches; }
    function keepVisible(n) {
      // El lote queda a la vista entre la barra superior y la hoja
      var sh = shapes[n];
      if (!sh || !panel.classList.contains("is-open")) return;
      var el = sh.pin || sh.path, r = el.getBoundingClientRect();
      var top = navBottom() + 12, bottom = window.innerHeight - panel.offsetHeight - 12;
      if (bottom - top < 40) return;
      var mid = r.top + r.height / 2;
      if (mid < top || mid > bottom) window.scrollBy({ top: mid - (top + bottom) / 2, behavior: reduced ? "auto" : "smooth" });
    }
    function openSheet(n) {
      tip.hidden = true;
      var was = panel.classList.contains("is-open");
      panel.classList.add("is-open");
      panel.classList.remove("is-expanded");
      if (grab) grab.setAttribute("aria-expanded", "false");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "lot-title");
      if (backdrop) backdrop.hidden = false;
      document.body.classList.add("sheet-open");
      document.dispatchEvent(new CustomEvent("fundos:sheet"));
      reveal(n, function () { window.setTimeout(function () { keepVisible(n); }, was ? 0 : 380); });
      if (!was) window.setTimeout(function () { if (d.close) d.close.focus({ preventScroll: true }); }, 80);
    }
    function closeSheet(silent) {
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open", "is-expanded");
      panel.style.transform = "";
      panel.removeAttribute("role");
      panel.removeAttribute("aria-modal");
      panel.removeAttribute("aria-labelledby");
      if (backdrop) backdrop.hidden = true;
      document.body.classList.remove("sheet-open");
      document.dispatchEvent(new CustomEvent("fundos:sheet"));
      var sh = shapes[S.sel];
      if (!silent && sh && document.activeElement && panel.contains(document.activeElement)) sh.path.focus({ preventScroll: true });
    }
    function expandSheet(on) {
      panel.classList.toggle("is-expanded", on);
      if (grab) grab.setAttribute("aria-expanded", on ? "true" : "false");
    }
    if (backdrop) backdrop.addEventListener("click", function () { closeSheet(); });
    if (grab) {
      grab.addEventListener("click", function () { if (!grabMoved) expandSheet(!panel.classList.contains("is-expanded")); });
      var gy = null, gdy = 0, grabMoved = false;
      grab.addEventListener("pointerdown", function (e) { gy = e.clientY; gdy = 0; grabMoved = false; try { grab.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ } });
      grab.addEventListener("pointermove", function (e) {
        if (gy == null) return;
        gdy = e.clientY - gy;
        if (Math.abs(gdy) > 6) grabMoved = true;
        if (gdy > 0) panel.style.transform = "translateY(" + gdy + "px)";
      });
      var gend = function () {
        if (gy == null) return;
        panel.style.transform = "";
        if (gdy > 70) closeSheet();
        else if (gdy < -30) expandSheet(true);
        gy = null;
        window.setTimeout(function () { grabMoved = false; }, 0);
      };
      grab.addEventListener("pointerup", gend);
      grab.addEventListener("pointercancel", gend);
    }
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !sheetMode() || !panel.classList.contains("is-open")) return;
      var f = $$("a[href], button:not([disabled])", panel).filter(function (el) { return !el.closest("[hidden]") && el.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });

    /* ---- Favoritos ---- */
    var undoT = 0, undoCopy = null;
    function refreshFavs() {
      Object.keys(shapes).forEach(function (n) { if (shapes[n].pin) shapes[n].pin.classList.toggle("is-fav", isFav(S.id, +n)); });
      if (S.view === "lista") renderList();
      syncFavButton();
      favBox.hidden = favs.length === 0 && !undoCopy;
      if (favMain) favMain.hidden = !favs.length;
      if (!favs.length) return;
      favCount.textContent = favs.length;
      favLabel.textContent = favs.length === 1 ? "lote guardado" : "lotes guardados";
      var lines = [];
      favList.innerHTML = favs.map(function (k) {
        var parts = k.split(":"), p = proyecto(parts[0]), l = p && lotOf(p, +parts[1]);
        if (!l) return "";
        lines.push("• " + p.nombre + ", lote " + l.n + " (" + m2(l.m2) + ", " + precioTxt(l) + ")" + lotLink(p, l));
        return '<button type="button" class="fav-chip" data-fav="' + esc(k) + '">' + esc(p.nombre) + " " + l.n + "</button>";
      }).join("");
      favSend.href = waHref("Hola Fundos, guardé estos lotes y me gustaría recibir más información:\n" + lines.join("\n"));
    }
    function toggleFav(id, n) {
      var k = id + ":" + n, i = favs.indexOf(k), added = i < 0;
      if (!added) favs.splice(i, 1); else favs.push(k);
      saveFavs(favs);
      refreshFavs();
      if (d.toast) {
        d.toast.hidden = !added;
        if (added) d.toast.innerHTML = "Guardado en tus favoritos. <a href=\"#plan-favs\" data-favs-jump>Ver lista (" + favs.length + ")</a>";
      }
      announce(added ? "Lote " + n + " guardado en favoritos" : "Lote " + n + " quitado de favoritos");
    }

    /* ---- Proyecto activo ---- */
    function setProject(id, opts) {
      opts = opts || {};
      var p = proyecto(id);
      if (!p) return;
      S.id = id;
      if (!opts.keepFilters) {                     // al cambiar de proyecto todos los filtros vuelven a cero
        S.est = { disponible: true, reservada: true, vendida: true };
        S.max = Infinity; S.sector = "";
      }
      checks.forEach(function (c) { c.checked = !!S.est[c.value]; });
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        if (on) stage.setAttribute("aria-labelledby", t.id);
      });
      var pre = !p.lotes.length;
      root.classList.toggle("is-preventa", pre);
      prev.hidden = !pre;
      [viewToggle, filtersBox, panel].forEach(function (el) { if (el) el.hidden = pre; });
      if (zoomUi) zoomUi.hidden = pre || S.view !== "plano";
      if (legend) legend.hidden = pre || S.view !== "plano";
      if (cats) cats.hidden = pre;
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
      if (pre) {
        resetPanel();
        if (hint) hint.hidden = true;
        if (empty) empty.hidden = true;
        canvas.hidden = true;
        list.hidden = true;
        canvas.innerHTML = "";
        shapes = {};
        updateSummary();
        return;
      }
      canvas.hidden = S.view !== "plano";
      list.hidden = S.view !== "lista";
      prices = p.lotes.filter(function (l) { return l.estado !== "vendida"; }).map(function (l) { return l.precio; })
        .filter(function (v, i, a) { return v && a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
      syncPrice();
      // solo se muestran los estados que existen en este proyecto
      checks.forEach(function (c) { var lbl = c.closest("label"); if (lbl) lbl.hidden = !p.lotes.some(function (l) { return l.estado === c.value; }); });
      renderSvg();
      resetPanel();
      applyFilters();
      refreshFavs();
      showHint();
    }
    function setView(v) {
      S.view = v;
      views.forEach(function (b) { var on = b.getAttribute("data-view") === v; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
      if (!P().lotes.length) return;
      canvas.hidden = v !== "plano";
      list.hidden = v !== "lista";
      if (legend) legend.hidden = v !== "plano";
      if (zoomUi) zoomUi.hidden = v !== "plano";
      if (v === "lista") { renderList(); if (hint) hint.hidden = true; if (empty) empty.hidden = true; }
      else { layoutPlan(!Z.base); applyFilters(); showHint(); }
    }

    /* ---- Eventos ---- */
    tabs.forEach(function (t, i) {
      t.id = t.id || "tab-" + t.getAttribute("data-tab");
      t.setAttribute("aria-controls", "plan-stage");
      var p = proyecto(t.getAttribute("data-tab"));
      if (p && !$("small", t)) t.insertAdjacentHTML("beforeend", "<small>" + (p.lotes.length ? disponibles(p).length + " disp." : "Preventa") + "</small>");
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
    if (cats) cats.addEventListener("click", function (e) {
      var b = e.target.closest(".pl-cat");
      if (!b || b.disabled) return;
      var k = b.getAttribute("data-cat");
      S.sector = S.sector === k ? "" : k;
      applyFilters();
    });
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-clear-filters]")) clearFilters();
    });
    if (fToggle) fToggle.addEventListener("click", function () {
      var open = fToggle.getAttribute("aria-expanded") !== "true";
      fToggle.setAttribute("aria-expanded", open ? "true" : "false");
      filtersBox.classList.toggle("is-open", open);
    });

    // Plano: clic, teclado y tooltip
    canvas.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el) select(+el.getAttribute("data-n"));
    });
    canvas.addEventListener("keydown", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (!el) return;
      var n = +el.getAttribute("data-n"), nx = null;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(n); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomBy(1.6); return; }
      if (e.key === "-") { e.preventDefault(); zoomBy(1 / 1.6); return; }
      if (/^Arrow/.test(e.key)) nx = spatialNext(n, e.key);
      else if (e.key === "Home" || e.key === "End") {
        var av = disponibles(P()).filter(passes).sort(function (a, b) { return a.precio - b.precio; });
        nx = av.length ? (e.key === "Home" ? av[0] : av[av.length - 1]).n : null;
      } else return;
      e.preventDefault();
      if (nx != null && shapes[nx]) { rover(nx); shapes[nx].path.focus({ preventScroll: true }); }
    });
    // Tooltip siempre dentro del plano (se da vuelta arriba/abajo y se corre en los bordes)
    function placeTip(x, y) {
      var sw = stage.clientWidth, tw = tip.offsetWidth, th = tip.offsetHeight;
      var cx = clamp(x, tw / 2 + 8, sw - tw / 2 - 8), below = y - th - 18 < 8;
      tip.classList.toggle("is-below", below);
      tip.style.left = cx + "px";
      tip.style.top = (below ? y + 20 : y) + "px";
      tip.style.setProperty("--ax", clamp(x - cx, -tw / 2 + 12, tw / 2 - 12) + "px");
    }
    function showTip(el, x, y) {
      var p = P(), l = lotOf(p, +el.getAttribute("data-n"));
      if (!l) return;
      tip.innerHTML = l.estado === "vendida"
        ? "Lote " + l.n + " · Vendido<small>Haz clic y te mostramos alternativas cerca</small>"
        : "Lote " + l.n + " · " + clp(l.precio) + "<small>" + ESTADO[l.estado] + " · " + m2(l.m2) + (l.lista ? " · antes " + clp(l.lista) : "") + "</small>";
      tip.hidden = false;
      placeTip(x, y);
    }
    function tipAt(el) {
      if (!fineHover) return;
      var sh = shapes[el.getAttribute("data-n")], t = (sh && sh.pin) || el;
      var r = t.getBoundingClientRect(), s = stage.getBoundingClientRect();
      showTip(el, r.left + r.width / 2 - s.left, r.top - s.top - 2);
    }
    canvas.addEventListener("mouseover", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el && !el.contains(e.relatedTarget) && !drag) tipAt(el);
    });
    canvas.addEventListener("mousemove", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (!el || tip.hidden) return;
      var s = stage.getBoundingClientRect();
      placeTip(e.clientX - s.left, e.clientY - s.top);
    });
    canvas.addEventListener("mouseout", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (el && !el.contains(e.relatedTarget)) tip.hidden = true;
    });
    canvas.addEventListener("focusin", function (e) {
      var el = e.target.closest && e.target.closest(".lot");
      if (!el) return;
      var n = +el.getAttribute("data-n");
      reveal(n, function () { if (document.activeElement === el) tipAt(el); });
    });
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
    panel.addEventListener("click", function (e) {
      var pk = e.target.closest("[data-pick]");
      if (pk) {
        var n = +pk.getAttribute("data-pick");
        select(n, { sheet: sheetMode() });
        if (!sheetMode() && shapes[n]) shapes[n].path.focus({ preventScroll: true });
        return;
      }
      var fj = e.target.closest("[data-favs-jump]");
      if (fj) closeSheet(true);
    });
    d.reserve.addEventListener("click", function () {
      var p = P(), l = lotOf(p, S.sel);
      if (!l) return;
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
    desktop.addEventListener && desktop.addEventListener("change", function () { closeSheet(true); layoutPlan(true); });
    favList.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fav]");
      if (!b) return;
      var parts = b.getAttribute("data-fav").split(":");
      if (parts[0] !== S.id) setProject(parts[0]);
      if (S.view !== "plano") setView("plano");
      var r = canvas.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top - navBottom() - 12, behavior: reduced ? "auto" : "smooth" });
      window.setTimeout(function () { select(+parts[1]); }, reduced ? 0 : 350);
    });
    favClear.addEventListener("click", function () {
      undoCopy = favs.slice();
      favs = []; saveFavs(favs);
      if (favUndo) favUndo.hidden = false;
      refreshFavs();
      window.clearTimeout(undoT);
      undoT = window.setTimeout(function () { undoCopy = null; if (favUndo) favUndo.hidden = true; refreshFavs(); }, 6000);
    });
    if (favRestore) favRestore.addEventListener("click", function () {
      if (undoCopy) { favs = undoCopy; saveFavs(favs); }
      undoCopy = null;
      window.clearTimeout(undoT);
      if (favUndo) favUndo.hidden = true;
      refreshFavs();
    });

    /* ---- API para otros módulos ---- */
    Plan.show = function (id) { if (id !== S.id) setProject(id); };
    Plan.apply = function (o) {
      S.est = o.soloDisponibles ? { disponible: true, reservada: false, vendida: false } : { disponible: true, reservada: true, vendida: true };
      S.max = o.max || Infinity;
      S.sector = "";
      setProject(o.id, { keepFilters: true });
    };

    // Enlace directo a un lote: #lote-malalcahuello-12 (al cargar y al hacer clic en enlaces internos)
    function fromHash(atLoad) {
      var m = /^#lote-([a-z0-9-]+)-(\d+)$/.exec(location.hash);
      var p = m && proyecto(m[1]);
      if (!p || !p.lotes.length) return false;
      if (p.id !== S.id || atLoad) setProject(p.id);
      if (S.view !== "plano") setView("plano");
      var n = +m[2], ok = !!lotOf(p, n);
      window.setTimeout(function () {
        var r = stage.getBoundingClientRect();
        jumpTo(window.scrollY + r.top - navBottom() - 12);
        if (ok) select(n, { hash: false });
        else summary.textContent = "No encontramos el lote " + m[2] + " de " + p.nombre + ". Elige otro en el plano.";
      }, atLoad ? 120 : 0);
      return true;
    }
    window.addEventListener("hashchange", function () { fromHash(false); });
    if (!fromHash(true)) setProject(S.id);
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
    var bar = $("[data-mbar]"), hero = $("[data-hero]"), visit = $("#visita"), fab = $(".wa-float");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var pastHero = false, atVisit = false;
    // En pantallas bajas (teléfono horizontal) la barra aparece apenas se desplaza la página
    function short() { return window.innerHeight < 600 && window.scrollY > 40; }
    function update() {
      bar.classList.toggle("is-visible", (pastHero || short()) && !atVisit && !document.body.classList.contains("sheet-open"));
      if (fab) fab.classList.toggle("is-hidden", atVisit);   // el botón flotante no tapa el formulario
    }
    new IntersectionObserver(function (en) { pastHero = en[0].intersectionRatio < 0.3; update(); }, { threshold: [0, 0.3] }).observe(hero);
    if (visit) new IntersectionObserver(function (en) { atVisit = en[0].isIntersecting; update(); }, { threshold: 0.12 }).observe(visit);
    document.addEventListener("fundos:sheet", update);
    window.addEventListener("scroll", function () { if (window.innerHeight < 600) update(); }, { passive: true });
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
