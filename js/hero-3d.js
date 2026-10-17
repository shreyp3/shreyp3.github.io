/* ================================================================
   HERO 3D SCENE — a WebGL scene (Three.js, loaded via CDN in
   index.html) rendered behind the hero content: a rotating wireframe
   core, two orbit rings, and a drifting particle field, all with a
   subtle parallax that follows the cursor.

   If Three.js failed to load or WebGL isn't available, this quietly
   does nothing — the hero still looks fine with just its CSS glow.
   ================================================================ */
(function initHero3D() {
  const container = document.getElementById("hero3d");
  const hero = container ? container.closest(".hero") : null;
  if (!container || !hero || typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }

  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 22;

  function size() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* Faceted wireframe core — kept subtle so it reads as background
     atmosphere behind the hero text, not foreground clutter */
  const coreGeo = new THREE.IcosahedronGeometry(6, 1);
  const core = new THREE.LineSegments(
    new THREE.EdgesGeometry(coreGeo),
    new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 })
  );
  scene.add(core);

  /* Faint solid fill so the core reads as a volume, not just lines */
  const coreFill = new THREE.Mesh(
    coreGeo,
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.035 })
  );
  scene.add(coreFill);

  /* Two thin orbit rings */
  const ringGroup = new THREE.Group();
  [
    { radius: 10, color: 0x00d4ff, tiltX: Math.PI / 2 + 0.15, tiltY: 0.1 },
    { radius: 12.5, color: 0x7c3aed, tiltX: Math.PI / 2 + 0.6, tiltY: 0.5 },
  ].forEach((cfg) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.radius, 0.018, 8, 120),
      new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.28 })
    );
    ring.rotation.x = cfg.tiltX;
    ring.rotation.y = cfg.tiltY;
    ringGroup.add(ring);
  });
  scene.add(ringGroup);

  /* Ambient particle field, scattered in a spherical shell around the core */
  const PARTICLE_COUNT = 220;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 14 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.16, transparent: true, opacity: 0.5, sizeAttenuation: true })
  );
  scene.add(particles);

  /* Mouse-driven parallax target */
  const mouse = { x: 0, y: 0 };
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  });
  hero.addEventListener("mouseleave", () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  let heroVisible = true;
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }, { threshold: 0 }).observe(hero);

  function tick() {
    if (heroVisible) {
      const targetRotY = mouse.x * 0.4;
      const targetRotX = mouse.y * 0.25;
      core.rotation.y += (targetRotY - core.rotation.y) * 0.04;
      core.rotation.x += (targetRotX - core.rotation.x) * 0.04;
      core.rotation.z += 0.0015;
      coreFill.rotation.copy(core.rotation);

      ringGroup.rotation.z += 0.0012;
      ringGroup.rotation.y += 0.0008;

      particles.rotation.y += 0.0004;
      particles.rotation.x += 0.0002;

      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }

  size();
  window.addEventListener("resize", size);
  renderer.render(scene, camera); // initial static frame — used as-is if reduced motion is requested
  if (!reduceMotion) requestAnimationFrame(tick);
})();
