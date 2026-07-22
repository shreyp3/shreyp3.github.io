/* ================================================================
   PROJECT RENDERING — turns the PROJECTS array (js/projects-data.js)
   into HTML. Runs on both index.html (#projectsGrid) and
   project.html (#projectDetail). You shouldn't need to edit this
   file to add a project — see js/projects-data.js for that.
   ================================================================ */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

/* Image with automatic fallback to a placeholder icon if the file
   doesn't exist yet (e.g. before you've added real project photos). */
function projectImageTag(src, alt) {
  return `
    <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
    <div class="img-placeholder"><i class="fas fa-image"></i></div>
  `;
}

function renderTags(tags) {
  if (!tags || !tags.length) return "";
  return `<div class="project-tech">${tags
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("")}</div>`;
}

/* ── HOMEPAGE PROJECT GRID ─────────────────────────────────────── */
function renderProjectCards() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  if (!PROJECTS.length) {
    grid.innerHTML = `<p class="projects-empty">No projects yet — add some to js/projects-data.js</p>`;
    return;
  }

  grid.innerHTML = PROJECTS.map((p) => `
    <a class="project-card-link${p.featured ? " featured" : ""}" href="project.html?id=${encodeURIComponent(p.id)}">
      <div class="project-card-link-image">
        ${projectImageTag(p.thumbnail, p.title)}
        <div class="project-card-link-overlay"><span>View Project <i class="fas fa-arrow-right"></i></span></div>
      </div>
      <div class="project-card-link-body">
        <div class="project-card-link-top">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          ${p.date ? `<span class="project-date"><i class="fas fa-calendar"></i> ${escapeHtml(p.date)}</span>` : ""}
        </div>
        ${p.subtitle ? `<p class="project-card-subtitle">${escapeHtml(p.subtitle)}</p>` : ""}
        <p class="project-desc">${escapeHtml(p.summary)}</p>
        ${renderTags(p.tags)}
      </div>
    </a>
  `).join("");
}

/* ── PROJECT DETAIL PAGE ──────────────────────────────────────── */
function renderProjectDetail() {
  const container = document.getElementById("projectDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    container.innerHTML = `
      <div class="project-not-found">
        <i class="fas fa-triangle-exclamation"></i>
        <h1>Project not found</h1>
        <p>Couldn't find a project with id "${escapeHtml(id || "")}".</p>
        <a href="index.html#projects" class="btn btn-primary">Back to Projects</a>
      </div>
    `;
    return;
  }

  document.title = `${project.title} | Shrey Patel`;

  const detailsRows = project.details
    ? Object.entries(project.details)
        .filter(([, v]) => v)
        .map(([k, v]) => `
          <div class="project-detail">
            <strong>${escapeHtml(k.charAt(0).toUpperCase() + k.slice(1))}:</strong> ${escapeHtml(v)}
          </div>
        `).join("")
    : "";

  const descriptionHtml = (project.description || [])
    .map((para) => `<p>${escapeHtml(para)}</p>`)
    .join("");

  const galleryHtml = (project.gallery || [])
    .map((src, i) => `
      <button type="button" class="project-gallery-item" data-full="${escapeHtml(src)}">
        ${projectImageTag(src, `${project.title} photo ${i + 1}`)}
      </button>
    `).join("");

  const videosHtml = (project.videos || [])
    .map((v) => `
      <figure class="project-video">
        <div class="video-embed">
          <iframe
            src="https://www.youtube.com/embed/${encodeURIComponent(v.youtubeId)}"
            title="${escapeHtml(v.caption || project.title)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        ${v.caption ? `<figcaption>${escapeHtml(v.caption)}</figcaption>` : ""}
      </figure>
    `).join("");

  const links = project.links || {};
  const linksHtml = `
    <div class="project-detail-links">
      ${links.github ? `<a href="${escapeHtml(links.github)}" class="btn btn-primary" target="_blank" rel="noopener"><i class="fab fa-github"></i> View Code</a>` : ""}
      ${links.demo ? `<a href="${escapeHtml(links.demo)}" class="btn btn-outline" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ""}
    </div>
  `;

  container.innerHTML = `
    <a href="index.html#projects" class="back-link"><i class="fas fa-arrow-left"></i> All Projects</a>

    <div class="project-hero">
      ${project.date ? `<p class="project-date"><i class="fas fa-calendar"></i> ${escapeHtml(project.date)}</p>` : ""}
      <h1>${escapeHtml(project.title)}</h1>
      ${project.subtitle ? `<p class="project-hero-subtitle">${escapeHtml(project.subtitle)}</p>` : ""}
      ${renderTags(project.tags)}
    </div>

    <div class="project-hero-image">
      ${projectImageTag(project.thumbnail, project.title)}
    </div>

    <div class="project-body">
      <p class="project-summary">${escapeHtml(project.summary)}</p>
      ${descriptionHtml}
    </div>

    ${detailsRows ? `<div class="project-details">${detailsRows}</div>` : ""}

    ${galleryHtml ? `<h2 class="project-section-title">Gallery</h2><div class="project-gallery">${galleryHtml}</div>` : ""}

    ${videosHtml ? `<h2 class="project-section-title">Demo Videos</h2><div class="project-videos">${videosHtml}</div>` : ""}

    ${linksHtml}
  `;

  initLightbox(container);
}

/* ── SIMPLE LIGHTBOX for gallery images ──────────────────────── */
function initLightbox(scope) {
  const items = scope.querySelectorAll(".project-gallery-item");
  if (!items.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `<button type="button" class="lightbox-close" aria-label="Close"><i class="fas fa-xmark"></i></button><img alt="" />`;
  document.body.appendChild(overlay);

  const img = overlay.querySelector("img");

  function open(src, alt) {
    img.src = src;
    img.alt = alt;
    overlay.classList.add("open");
  }
  function close() {
    overlay.classList.remove("open");
  }

  items.forEach((btn) => {
    btn.addEventListener("click", () =>
      open(btn.dataset.full, btn.querySelector("img") ? btn.querySelector("img").alt : ""));
  });
  overlay.addEventListener("click", close);
}

/* ── RUN ──────────────────────────────────────────────────────── */
renderProjectCards();
renderProjectDetail();
