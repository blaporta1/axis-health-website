'use strict';

/* ============================================================
   Axis Health — Apple-style Script v3
   ============================================================ */

// ---- Sticky nav ----
const nav   = document.getElementById('nav');
const btt   = document.getElementById('btt');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  btt.hidden = y < 500;
}, { passive: true });

// ---- Mobile hamburger ----
const ham     = document.getElementById('ham');
const mobMenu = document.getElementById('mob-menu');

const toggleMenu = (force) => {
  const open = typeof force === 'boolean' ? force : ham.getAttribute('aria-expanded') !== 'true';
  ham.setAttribute('aria-expanded', String(open));
  ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobMenu.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};

ham.addEventListener('click', () => toggleMenu());
mobMenu.querySelectorAll('.ml').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ham.getAttribute('aria-expanded') === 'true') toggleMenu(false);
});

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// ---- Scroll-reveal ----
const revealEls = document.querySelectorAll('.reveal, .reveal-right, .reveal-left, .reveal-slow');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ---- Count-up animation ----
const countEls = document.querySelectorAll('.count[data-target]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(ease * target);
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

// ---- Active nav link ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nl');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ---- Back to top ----
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Contact form validation ----
const form       = document.getElementById('contact-form');
const cfBtn      = document.getElementById('cf-btn');
const cfSuccess  = document.getElementById('cf-success');

const rules = {
  'cf-name': {
    el: document.getElementById('cf-name'),
    err: document.getElementById('ce-name'),
    validate(v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
  },
  'cf-email': {
    el: document.getElementById('cf-email'),
    err: document.getElementById('ce-email'),
    validate(v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
  },
  'cf-subject': {
    el: document.getElementById('cf-subject'),
    err: document.getElementById('ce-subject'),
    validate(v) { return v ? '' : 'Please select a subject.'; },
  },
  'cf-msg': {
    el: document.getElementById('cf-msg'),
    err: document.getElementById('ce-msg'),
    validate(v) {
      if (!v.trim()) return 'Please enter a message.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    },
  },
};

const setField = (rule, error) => {
  rule.el.classList.toggle('error', !!error);
  rule.el.classList.toggle('valid', !error);
  rule.err.textContent = error;
};

Object.values(rules).forEach(rule => {
  rule.el.addEventListener('blur', () => setField(rule, rule.validate(rule.el.value)));
  rule.el.addEventListener('input', () => {
    if (rule.el.classList.contains('error')) setField(rule, rule.validate(rule.el.value));
  });
});

const validateAll = () => {
  let valid = true, first = null;
  Object.values(rules).forEach(rule => {
    const err = rule.validate(rule.el.value);
    setField(rule, err);
    if (err && !first) first = rule.el;
    if (err) valid = false;
  });
  if (first) first.focus();
  return valid;
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateAll()) return;
  const btnText = cfBtn.querySelector('.cf-btn-text');
  const btnSpin = cfBtn.querySelector('.cf-btn-spin');
  cfBtn.disabled = true;
  btnText.hidden = true;
  btnSpin.hidden = false;
  await new Promise(r => setTimeout(r, 1300));
  cfBtn.disabled = false;
  btnText.hidden = false;
  btnSpin.hidden = true;
  cfSuccess.hidden = false;
  form.reset();
  Object.values(rules).forEach(r => {
    r.el.classList.remove('error', 'valid');
    r.err.textContent = '';
  });
  cfSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { cfSuccess.hidden = true; }, 7000);
});
