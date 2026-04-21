'use strict';

/* ============================================================
   Axis Health — Main Script
   ============================================================ */

// ---- Sticky Header ----
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  bttBtn.hidden = window.scrollY < 400;
};
window.addEventListener('scroll', onScroll, { passive: true });

// ---- Mobile Nav ----
const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobile-nav');
const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link, .mobile-cta');

const toggleMenu = (force) => {
  const open = typeof force === 'boolean' ? force : hamburger.getAttribute('aria-expanded') !== 'true';
  hamburger.setAttribute('aria-expanded', open);
  mobileNav.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};

hamburger.addEventListener('click', () => toggleMenu());
mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') toggleMenu(false);
});

// ---- Smooth Scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// ---- Intersection Observer: fade-in animations ----
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger siblings in the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 80, 320));
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach(el => observer.observe(el));

// ---- Back to Top ----
const bttBtn = document.getElementById('back-to-top');
bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Contact Form Validation ----
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('form-submit');
const successMsg = document.getElementById('form-success');

const rules = {
  'field-name': {
    el: document.getElementById('field-name'),
    errEl: document.getElementById('name-error'),
    validate(v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
  },
  'field-email': {
    el: document.getElementById('field-email'),
    errEl: document.getElementById('email-error'),
    validate(v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
  },
  'field-subject': {
    el: document.getElementById('field-subject'),
    errEl: document.getElementById('subject-error'),
    validate(v) {
      if (!v) return 'Please select a subject.';
      return '';
    },
  },
  'field-message': {
    el: document.getElementById('field-message'),
    errEl: document.getElementById('message-error'),
    validate(v) {
      if (!v.trim()) return 'Please enter a message.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    },
  },
};

const setFieldState = (rule, error) => {
  rule.el.classList.toggle('error', !!error);
  rule.el.classList.toggle('valid', !error);
  rule.errEl.textContent = error;
};

// Live validation on blur
Object.values(rules).forEach(rule => {
  rule.el.addEventListener('blur', () => {
    const error = rule.validate(rule.el.value);
    setFieldState(rule, error);
  });
  rule.el.addEventListener('input', () => {
    if (rule.el.classList.contains('error')) {
      const error = rule.validate(rule.el.value);
      setFieldState(rule, error);
    }
  });
});

const validateAll = () => {
  let valid = true;
  let firstInvalid = null;
  Object.values(rules).forEach(rule => {
    const error = rule.validate(rule.el.value);
    setFieldState(rule, error);
    if (error && !firstInvalid) firstInvalid = rule.el;
    if (error) valid = false;
  });
  if (firstInvalid) firstInvalid.focus();
  return valid;
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateAll()) return;

  // Loading state
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = true;
  btnText.hidden   = true;
  btnLoader.hidden = false;

  // Simulate async submission (replace with real endpoint)
  await new Promise(r => setTimeout(r, 1200));

  // Reset loading state
  submitBtn.disabled = false;
  btnText.hidden   = false;
  btnLoader.hidden = true;

  // Show success
  successMsg.hidden = false;
  form.reset();
  Object.values(rules).forEach(rule => {
    rule.el.classList.remove('error', 'valid');
    rule.errEl.textContent = '';
  });

  successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success after 6s
  setTimeout(() => { successMsg.hidden = true; }, 6000);
});

// ---- Active nav link highlighting on scroll ----
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.style.color = isActive ? 'var(--deep-ocean)' : '';
        link.style.background = isActive ? 'var(--deep-ocean-10)' : '';
      });
    });
  },
  { threshold: 0.45 }
);
sections.forEach(s => sectionObserver.observe(s));

// ---- Phone health bar animation on visibility ----
const healthBars = document.querySelectorAll('.health-bar-fill');
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const width = target.style.width;
      target.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { target.style.width = width; }, 100);
      });
      barObserver.unobserve(target);
    });
  },
  { threshold: 0.5 }
);
healthBars.forEach(bar => barObserver.observe(bar));
