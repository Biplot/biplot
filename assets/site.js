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

  /* ============ PORTFOLIO VIDEOS: horizontal (desktop) / vertical (mobile) ============ */
  const vertical = window.matchMedia('(max-width:700px)').matches;
  document.querySelectorAll('.case-video').forEach((v) => {
    const src = vertical ? v.dataset.v : v.dataset.h;
    const poster = vertical ? v.dataset.pv : v.dataset.ph;
    if (poster) v.setAttribute('poster', poster);
    if (src) v.setAttribute('src', src);
  });

  /* ============ CASES CAROUSEL ============ */
  (function initCasesCarousel() {
    const track = document.getElementById('casesTrack');
    if (!track) return;
    const slides = [...track.querySelectorAll('.case-slide')];
    const dotsWrap = document.getElementById('casesDots');
    const prevBtn = document.getElementById('casesPrev');
    const nextBtn = document.getElementById('casesNext');
    const total = slides.length;
    let index = 0;

    if (total < 2) {
      // one case: no controls needed
      if (dotsWrap) dotsWrap.style.display = 'none';
      const arrows = document.querySelector('.cases-arrows');
      if (arrows) arrows.style.display = 'none';
      return;
    }

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.setAttribute('aria-label', 'Ir al caso ' + (i + 1));
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
      });
    }
    const dots = dotsWrap ? [...dotsWrap.children] : [];

    function go(i) {
      index = (i + total) % total;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      slides.forEach((s, si) => {
        if (si !== index) { const v = s.querySelector('video'); if (v) { try { v.pause(); } catch (e) {} } }
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1));

    /* swipe */
    let startX = null;
    const vp = track.parentElement;
    vp.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    go(0);
  })();

  /* pause offscreen/hidden-tab animation loops */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
  });
})();
