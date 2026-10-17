/* ================================================================
   SHREY PATEL — PORTFOLIO JAVASCRIPT
   ================================================================ */

/* ── TYPED TEXT ANIMATION ─────────────────────────────────────
   Edit the strings array to change what gets typed in the hero
   ─────────────────────────────────────────────────────────── */
const typedStrings = [
  'Computer Engineer',
  'Embedded Systems Dev',
  'Hardware + Software',
  'GT Yellow Jacket',
];

(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  let strIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 45;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 400;

  function tick() {
    const current = typedStrings[strIndex];
    el.textContent = isDeleting
      ? current.slice(0, charIndex--)
      : current.slice(0, charIndex++);

    if (!isDeleting && charIndex > current.length) {
      isDeleting = true;
      setTimeout(tick, pauseAfterType);
      return;
    }
    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      strIndex = (strIndex + 1) % typedStrings.length;
      setTimeout(tick, pauseAfterDelete);
      return;
    }
    setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
  }

  setTimeout(tick, 600);
})();


/* ── SCROLL PROGRESS BAR ──────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


/* Hero background is now a WebGL scene — see js/hero-3d.js */


/* ── MAGNETIC HERO BUTTONS ────────────────────────────────────── */
(function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.hero-cta .btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ── NAVBAR: scroll shadow + active link ─────────────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');
  const links   = navMenu ? navMenu.querySelectorAll('a') : [];

  // Add shadow when scrolled
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) navMenu.classList.remove('open');
    });
  }

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = navMenu && navMenu.querySelector(`a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();


/* ── FADE-IN ON SCROLL (Intersection Observer) ───────────────── */
(function initFadeIn() {
  // Add fade-in class to key elements automatically
  const targets = document.querySelectorAll(
    '.project-card-link, .skill-category, .timeline-item, .step-card, ' +
    '.contact-item, .highlight-item, .education-card, .about-grid > *'
  );
  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -15% 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ── SKILL BAR ANIMATION ─────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level || 0;
        entry.target.style.width = level + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ── CONTACT FORM (Formspree integration) ───────────────────────
   HOW TO ACTIVATE:
   1. Go to https://formspree.io and sign up (free)
   2. Create a new form and copy your Form ID (looks like: xpwzrjkb)
   3. Replace YOUR_FORM_ID below with your actual ID
   ─────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const FORMSPREE_ID = 'YOUR_FORM_ID'; // <-- Replace this

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      showFormMessage(form, 'error',
        'Form not yet configured. See the note in js/main.js to set up Formspree.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res  = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        body:    data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        showFormMessage(form, 'success', 'Message sent! I\'ll get back to you soon.');
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      showFormMessage(form, 'error', 'Something went wrong. Try emailing me directly.');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  function showFormMessage(form, type, text) {
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = `
      font-size: 0.88rem;
      padding: 10px 14px;
      border-radius: 6px;
      margin-top: -10px;
      background: ${type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'};
      color: ${type === 'success' ? '#10b981' : '#ef4444'};
      border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
    `;
    form.appendChild(msg);
  }
})();


/* ── FOOTER YEAR ─────────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── SMOOTH SCROLL for anchor links (Safari fallback) ────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
