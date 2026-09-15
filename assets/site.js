(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ SCROLL REVEALS ============ */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); revealIO.unobserve(entry.target); } });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal, .reveal-group').forEach(el => revealIO.observe(el));

  /* ============ METHOD STEPS (light dots on view) ============ */
  const methodSteps = [...document.querySelectorAll('[data-step]')];
  if (methodSteps.length) {
    const stepIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
    }, { threshold: 0.4 });
    methodSteps.forEach(s => stepIO.observe(s));
  }

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('[data-faq]').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('[data-faq].open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ============ HERO VIDEO: autoplay muted + unmute toggle ============ */
  const heroVid = document.getElementById('heroVideo');
  const heroSound = document.getElementById('heroSound');
  if (heroVid && heroSound) {
    // ensure autoplay kicks in on browsers that need a nudge
    heroVid.play().catch(() => {});
    heroSound.addEventListener('click', () => {
      heroVid.muted = !heroVid.muted;
      const on = !heroVid.muted;
      heroSound.classList.toggle('on', on);
      heroSound.setAttribute('aria-pressed', String(on));
      heroSound.setAttribute('aria-label', on ? 'Silenciar el video' : 'Activar sonido del video');
      if (on) heroVid.play().catch(() => {});
    });
  }

  /* ============ CONTACT FORM (WhatsApp) ============ */
  const WA_NUMBER = '56966275675';
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => { const el = form.querySelector('#' + id); return el && el.value ? el.value.trim() : ''; };
    const name = val('name'), email = val('email'), message = val('message');
    let text = 'Hola BiPlot 👋';
    if (name) text += ', soy ' + name;
    text += '. Quiero agendar un diagnóstico.';
    if (message) text += '\n\nMi proceso: ' + message;
    if (email) text += '\n\nMi correo: ' + email;
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.classList.add('hide');
    if (formSuccess) formSuccess.classList.add('show');
  });

  /* ============ CASES: expanding panels ============ */
  (function initCasePanels() {
    const wrap = document.getElementById('casePanels');
    if (!wrap) return;
    const panels = [...wrap.querySelectorAll('.panel')];
    if (!panels.length) return;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    function setActive(i) {
      panels.forEach((p, pi) => {
        const on = pi === i;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-expanded', String(on));
        const v = p.querySelector('video');
        if (v) { if (on) { v.play().catch(() => {}); } else { try { v.pause(); } catch (e) {} } }
      });
    }
    panels.forEach((p, i) => {
      p.addEventListener('click', () => setActive(i));
      p.addEventListener('focus', () => setActive(i));
      p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } });
      if (fine) p.addEventListener('mouseenter', () => setActive(i));
    });
    setActive(0);

    /* lightbox: watch a case video full-size, with sound + controls */
    const lb = document.getElementById('vlightbox');
    const lbVid = document.getElementById('vlightboxVideo');
    const lbClose = document.getElementById('vlightboxClose');
    function openLB(src) {
      if (!lb || !lbVid || !src) return;
      lbVid.src = src;
      lb.classList.add('open');
      lbVid.play().catch(() => {});
      document.body.style.overflow = 'hidden';
    }
    function closeLB() {
      if (!lb) return;
      lb.classList.remove('open');
      try { lbVid.pause(); } catch (e) {}
      lbVid.removeAttribute('src');
      lbVid.load();
      document.body.style.overflow = '';
    }
    document.querySelectorAll('.panel-play').forEach((btn) => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openLB(btn.dataset.src); });
    });
    if (lbClose) lbClose.addEventListener('click', closeLB);
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });
  })();

  /* pause offscreen/hidden-tab animation loops */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
  });
})();
