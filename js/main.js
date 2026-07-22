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


/* ── HERO BACKGROUND: animated, mouse-reactive node network ──────
   Purely decorative canvas — bails out to a single static frame if
   the user has requested reduced motion.
   ─────────────────────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const hero = canvas ? canvas.closest('.hero') : null;
  if (!canvas || !hero) return;

  const ctx = ctxOrNull(canvas);
  if (!ctx) return;

  function ctxOrNull(c) {
    try { return c.getContext('2d'); } catch { return null; }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NODE_COUNT = 55;
  const LINK_DIST = 140;
  const MOUSE_DIST = 160;

  let w = 0, h = 0, dpr = 1;
  let nodes = [];
  const mouse = { x: null, y: null };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dx = a.x - mouse.x, dy = a.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.35 * (1 - dist / MOUSE_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(0, 212, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  makeNodes();
  frame();

  window.addEventListener('resize', () => { resize(); makeNodes(); });
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
})();


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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

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
