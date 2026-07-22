/* ================================================================
   PROJECT DATA — this is the ONLY file you need to touch to add,
   edit, or remove a project. Both the homepage project grid and
   every project's detail page (project.html) are generated from
   this array automatically — no new HTML files needed per project.

   TO ADD A NEW PROJECT:
   1. Copy the EXAMPLE object below and paste it into the PROJECTS
      array as a new entry.
   2. Give it a unique `id` (used in the URL as project.html?id=...
      and as the folder name for its images).
   3. Drop your images in assets/images/projects/<id>/ and point
      `thumbnail` / `gallery` at them. Until real images exist,
      broken paths automatically fall back to a placeholder icon.
   4. For demo videos, upload to YouTube (Unlisted is fine so it's
      not publicly searchable) and paste just the video ID — the
      part of the URL after "v=".
      e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ -> "dQw4w9WgXcQ"
   5. Save the file and refresh the page — no build step.

   FIELD REFERENCE:
   id          (required) unique slug — used in the URL and image folder name
   title       (required) project name
   subtitle    (optional) short one-line tagline shown under the title
   date        (optional) e.g. "Spring 2026" or "Jan 2026 – Mar 2026"
   featured    (optional) true/false — featured projects get a larger card
   thumbnail   (required) path to the image shown on the homepage card
   tags        (optional) array of tech/tool strings shown as pills
   summary     (required) 2–4 sentence overview shown on the card + detail page
   description (optional) array of paragraph strings for the full write-up
   details     (optional) { goal, approach, results, impact } highlight blocks
   gallery     (optional) array of image paths for the detail page gallery
   videos      (optional) array of { youtubeId, caption } demo videos
   links       (optional) { github, demo } URLs
   ================================================================ */

const PROJECTS = [

  // ── EXAMPLE PROJECT — replace with your own, or delete this once
  //    you have at least one real project in the array ────────────
  {
    id: "example-project",
    title: "Example Project Title",
    subtitle: "A one-line tagline describing what it does",
    date: "Spring 2026",
    featured: true,
    thumbnail: "assets/images/projects/example-project/thumb.jpg",
    tags: ["C++", "FPGA", "Embedded Systems"],
    summary:
      "A 2-4 sentence overview of the project. What problem does it solve, " +
      "what does it do, and what inspired you to build it?",
    description: [
      "First paragraph of the full write-up. Set the scene — what was the " +
        "goal, and why did you take it on?",
      "Second paragraph — walk through your approach, the architecture, " +
        "and any interesting technical decisions you made.",
      "Third paragraph — challenges you ran into, how you solved them, " +
        "and what you'd do differently next time.",
    ],
    details: {
      goal: "What was the main objective of the project?",
      approach: "Briefly describe your methodology or technical approach.",
      results: "What did you achieve? Quantify it if you can.",
      impact: "Why does this work matter? Who benefits?",
    },
    gallery: [
      "assets/images/projects/example-project/photo-1.jpg",
      "assets/images/projects/example-project/photo-2.jpg",
      "assets/images/projects/example-project/photo-3.jpg",
    ],
    videos: [
      { youtubeId: "dQw4w9WgXcQ", caption: "Full demo walkthrough" },
    ],
    links: {
      github: "https://github.com/shreyp3/example-project",
      demo: "",
    },
  },

  // ── Add more projects below this line ───────────────────────

];
