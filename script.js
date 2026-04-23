'use strict';

/* ============================================================
   Axis Health — World-Class Script v2
   ============================================================ */

// ---- Sticky header ----
const header = document.getElementById('site-header');
const bttBtn = document.getElementById('btt');

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 10);
  bttBtn.hidden = y < 500;
};
window.addEventListener('scroll', onScroll, { passive: true });

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

const toggleMenu = (force) => {
  const open = typeof force === 'boolean' ? force : hamburger.getAttribute('aria-expanded') !== 'true';
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};

hamburger.addEventListener('click', () => toggleMenu());
mobileNav.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') toggleMenu(false);
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

// ---- Fade-in on scroll ----
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.querySelectorAll('.fade-in') ?? [])];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 90, 350));
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

// ---- Stat counter animation ----
const statEls = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => counterObserver.observe(el));

// ---- Mouse-tracking radial gradient on features section ----
const featuresSection = document.getElementById('features');
const featuresTrack = document.getElementById('features-track');
if (featuresSection && featuresTrack) {
  featuresSection.addEventListener('mousemove', e => {
    const rect = featuresSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    featuresTrack.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(15,76,117,0.07), transparent 60%)`;
  });
  featuresSection.addEventListener('mouseleave', () => {
    featuresTrack.style.background = '';
  });
}

// ---- 3D tilt effect on tilt-cards ----
const tiltCards = document.querySelectorAll('.tilt-card');
const MAX_TILT = 8;

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotX = (-y * MAX_TILT).toFixed(2);
    const rotY = ( x * MAX_TILT).toFixed(2);
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
    // Inner radial glow tracking
    const glow = card.querySelector('.bento-glow');
    if (glow) {
      glow.style.left = `${(x + 0.5) * 100}%`;
      glow.style.top  = `${(y + 0.5) * 100}%`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.bento-glow');
    if (glow) { glow.style.left = ''; glow.style.top = ''; }
  });
  // Per-card mouse tracking for glass cards
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  });
});

// ---- Active nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.style.color = active ? 'var(--ocean)' : '';
    });
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ---- Back to top ----
bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Marquee pause on hover (already handled by CSS :hover) ----

// ---- Hero parallax shapes on mousemove ----
const heroShapes = document.querySelectorAll('.shape');
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const { innerWidth: w, innerHeight: h } = window;
    const cx = e.clientX / w - 0.5;
    const cy = e.clientY / h - 0.5;
    heroShapes.forEach((shape, i) => {
      const depth = (i + 1) * 6;
      shape.style.transform = `translateX(${cx * depth}px) translateY(${cy * depth}px) rotate(${shape.dataset.rot || 0}deg)`;
    });
  });
  heroSection.addEventListener('mouseleave', () => {
    heroShapes.forEach(shape => { shape.style.transform = ''; });
  });
}

// ---- Contact form validation ----
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');
const successMsg = document.getElementById('form-success');

const rules = {
  'f-name': {
    el: document.getElementById('f-name'),
    err: document.getElementById('e-name'),
    validate(v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
  },
  'f-email': {
    el: document.getElementById('f-email'),
    err: document.getElementById('e-email'),
    validate(v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
  },
  'f-subject': {
    el: document.getElementById('f-subject'),
    err: document.getElementById('e-subject'),
    validate(v) { return v ? '' : 'Please select a subject.'; },
  },
  'f-message': {
    el: document.getElementById('f-message'),
    err: document.getElementById('e-message'),
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
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;
  await new Promise(r => setTimeout(r, 1300));
  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoader.hidden = true;
  successMsg.hidden = false;
  form.reset();
  Object.values(rules).forEach(r => { r.el.classList.remove('error', 'valid'); r.err.textContent = ''; });
  successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { successMsg.hidden = true; }, 7000);
});
