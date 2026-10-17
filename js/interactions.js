/* ================================================================
   GLOBAL INTERACTIONS — runs on every page (index.html, project.html):
   a custom cursor that reacts to what it's hovering, a small particle
   burst on click, and 3D tilt-with-glare on cards.

   Automatically skipped on touch devices (no mouse to react to) and
   scaled back when the user has requested reduced motion.
   ================================================================ */

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(pointer: fine)").matches;

/* ── CUSTOM CURSOR ─────────────────────────────────────────────
   A small dot that tracks the mouse exactly, and a larger ring
   that lags behind it and grows over anything clickable.
   ─────────────────────────────────────────────────────────── */
(function initCustomCursor() {
  if (!FINE_POINTER || REDUCE_MOTION) return;

  document.documentElement.classList.add("custom-cursor-active");

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const HOVER_TARGETS = "a, button, .project-card-link, input, textarea, .project-gallery-item, .lightbox-close";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(HOVER_TARGETS)) ring.classList.add("cursor-ring-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(HOVER_TARGETS)) ring.classList.remove("cursor-ring-hover");
  });
  document.addEventListener("mousedown", () => ring.classList.add("cursor-ring-click"));
  document.addEventListener("mouseup", () => ring.classList.remove("cursor-ring-click"));

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();


/* ── CLICK BURST ───────────────────────────────────────────────
   A short-lived ring + a handful of sparks fired from the click
   point. Pure DOM/CSS — no persistent canvas or animation loop.
   ─────────────────────────────────────────────────────────── */
(function initClickBurst() {
  if (REDUCE_MOTION) return;

  document.addEventListener("click", (e) => {
    const burst = document.createElement("div");
    burst.className = "click-burst";
    burst.style.left = e.clientX + "px";
    burst.style.top = e.clientY + "px";

    const ring = document.createElement("span");
    ring.className = "click-burst-ring";
    burst.appendChild(ring);

    const SPARK_COUNT = 8;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = (360 / SPARK_COUNT) * i + (Math.random() * 24 - 12);
      const dist = 26 + Math.random() * 22;
      const rad = (angle * Math.PI) / 180;

      const spark = document.createElement("span");
      spark.className = "click-burst-spark";
      spark.style.setProperty("--dx", Math.cos(rad) * dist + "px");
      spark.style.setProperty("--dy", Math.sin(rad) * dist + "px");
      spark.style.background = i % 2 === 0 ? "var(--accent)" : "var(--accent-2)";
      burst.appendChild(spark);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 650);
  });
})();


/* ── 3D TILT + GLARE CARDS ─────────────────────────────────────
   Cards rotate slightly toward the cursor with a soft light glare
   following it, like light catching a physical surface.
   ─────────────────────────────────────────────────────────── */
(function initTiltCards() {
  if (!FINE_POINTER || REDUCE_MOTION) return;

  const TILT_SELECTOR = ".project-card-link, .skill-category, .step-card";
  const TILT_MAX_DEG = 8;

  function setupTilt(card) {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = "true";

    const glare = document.createElement("div");
    glare.className = "tilt-glare";
    card.appendChild(glare);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -TILT_MAX_DEG;
      const ry = (px - 0.5) * TILT_MAX_DEG;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.12), transparent 55%)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      glare.style.opacity = "0";
    });
  }

  document.querySelectorAll(TILT_SELECTOR).forEach(setupTilt);
})();
