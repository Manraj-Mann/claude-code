"use strict";

const manifestUrl = new URL("./manifest.json", document.baseURI);
const grid = document.querySelector("#module-grid");
const searchInput = document.querySelector("#search-input");
const countLabel = document.querySelector("#library-count");
const readerDialog = document.querySelector("#reader-dialog");
const readerTitle = document.querySelector("#reader-title");
const readerCategory = document.querySelector("#reader-category");
const readerDate = document.querySelector("#reader-date");
const readerBody = document.querySelector("#reader-body");
const themeLink = document.querySelector("#highlight-theme");

let modules = [];
let activeFilter = "All";

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.querySelector("#theme-toggle").setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#0b1115" : "#f2f6f1";
  themeLink.href = isDark
    ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css"
    : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css";
}

function initTheme() {
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("learning-garden-theme-v2");
  } catch (error) {
    console.warn("Could not read the saved theme preference.", error);
  }
  setTheme(savedTheme === "light" ? "light" : "dark");
}

function saveTheme(theme) {
  try {
    localStorage.setItem("learning-garden-theme-v2", theme);
  } catch (error) {
    console.warn("Could not save the theme preference.", error);
  }
}

function dateLabel(date) {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(parsed);
}

function renderCard(module, index) {
  const button = document.createElement("button");
  button.className = "module-card";
  button.type = "button";
  button.style.setProperty("--card-index", index);
  button.setAttribute("aria-label", `Read ${module.title}`);

  const top = document.createElement("div");
  top.className = "card-topline";
  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = module.category;
  const status = document.createElement("span");
  status.className = "status-tag";
  status.dataset.status = module.status;
  status.textContent = module.status;
  top.append(category, status);

  const title = document.createElement("h3");
  title.textContent = module.title;
  const summary = document.createElement("p");
  summary.className = "card-summary";
  summary.textContent = module.summary;

  const footer = document.createElement("div");
  footer.className = "card-footer";
  const date = document.createElement("span");
  date.textContent = dateLabel(module.date);
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  footer.append(date, arrow);

  button.append(top, title, summary, footer);
  button.addEventListener("click", () => openModule(module));
  return button;
}

function renderAddCard() {
  const link = document.createElement("a");
  link.className = "module-card add-card";
  link.href = "./README.md";
  link.setAttribute("aria-label", "Learn how to add a new module");
  const content = document.createElement("span");
  content.className = "add-card-inner";
  const mark = document.createElement("span");
  mark.className = "add-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "+";
  const title = document.createElement("span");
  title.className = "add-card-title";
  title.textContent = "Add a new module";
  const description = document.createElement("span");
  description.className = "add-card-description";
  description.textContent = "Drop in a Markdown file and add it to your garden.";
  content.append(mark, title, description);
  link.append(content);
  return link;
}

function visibleModules() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  return modules.filter((module) => {
    const matchesCategory = activeFilter === "All"
      || module.category.toLocaleLowerCase() === activeFilter.toLocaleLowerCase()
      || (activeFilter === "Notes" && module.category.toLocaleLowerCase() === "note");
    const searchableText = [module.title, module.summary, module.category, module.status].join(" ").toLocaleLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });
}

function renderModules() {
  const shown = visibleModules();
  grid.replaceChildren();
  shown.forEach((module, index) => grid.append(renderCard(module, index)));
  if (shown.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = modules.length ? "No notes match this view. Try another filter or search." : "Your garden is ready for its first note.";
    grid.append(empty);
  }
  grid.append(renderAddCard());
  countLabel.textContent = `${shown.length} ${shown.length === 1 ? "NOTE" : "NOTES"}`;
}

function setReaderMessage(message, className) {
  readerBody.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = message;
  readerBody.append(paragraph);
}

function addHeadingAnchors() {
  const usedIds = new Set();
  readerBody.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const baseId = heading.textContent
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_ -]/gu, "")
      .trim()
      .replace(/\s/g, "-");
    let id = baseId;
    let suffix = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    heading.id = id;
  });
}

function addCodeControls() {
  readerBody.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-button")) return;
    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-button";
    copy.textContent = "Copy";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code")?.textContent ?? pre.textContent);
        copy.textContent = "Copied";
        window.setTimeout(() => { copy.textContent = "Copy"; }, 1400);
      } catch (error) {
        console.error("Could not copy this code block.", error);
        copy.textContent = "Copy failed";
        window.setTimeout(() => { copy.textContent = "Copy"; }, 1800);
      }
    });
    toolbar.append(copy);
    pre.append(toolbar);
  });
}

async function openModule(module) {
  readerTitle.textContent = module.title;
  readerCategory.textContent = module.category.toLocaleUpperCase();
  readerDate.textContent = dateLabel(module.date);
  setReaderMessage("Gathering your note…", "reader-loading");
  readerDialog.showModal();
  try {
    if (!window.marked || !window.DOMPurify) {
      throw new Error("The Markdown renderer could not be loaded. Check your connection and refresh the page.");
    }
    const fileUrl = new URL(module.file, document.baseURI);
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Could not load ${module.file} (HTTP ${response.status}).`);
    const markdown = await response.text();
    const html = window.marked.parse(markdown, { gfm: true, breaks: false });
    readerBody.innerHTML = window.DOMPurify.sanitize(html);
    addHeadingAnchors();
    if (window.hljs) {
      readerBody.querySelectorAll("pre code").forEach((block) => window.hljs.highlightElement(block));
    }
    addCodeControls();
  } catch (error) {
    console.error(`Unable to open note "${module.title}".`, error);
    setReaderMessage(error instanceof Error ? error.message : "Something went wrong while loading this note.", "reader-error");
  }
}

async function loadManifest() {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error(`Could not load manifest.json (HTTP ${response.status}).`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("manifest.json must contain a JSON array of notes.");
    const requiredFields = ["title", "category", "status", "date", "summary", "file"];
    modules = data.map((item, index) => {
      if (!item || requiredFields.some((field) => typeof item[field] !== "string" || !item[field].trim())) {
        throw new Error(`Note ${index + 1} is missing a required text field (${requiredFields.join(", ")}).`);
      }
      return item;
    });
    renderModules();
  } catch (error) {
    console.error("Unable to load the learning garden manifest.", error);
    grid.replaceChildren();
    const alert = document.createElement("div");
    alert.className = "load-error";
    const heading = document.createElement("strong");
    heading.textContent = "The notes could not be loaded.";
    const detail = document.createElement("span");
    detail.textContent = error instanceof Error ? error.message : "Check that manifest.json is valid and available.";
    alert.append(heading, detail);
    grid.append(alert, renderAddCard());
    countLabel.textContent = "UNAVAILABLE";
  }
}

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  saveTheme(nextTheme);
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderModules();
  });
});

searchInput.addEventListener("input", renderModules);
document.querySelector("#close-reader").addEventListener("click", () => readerDialog.close());
readerDialog.addEventListener("click", (event) => {
  if (event.target === readerDialog) readerDialog.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

initTheme();
loadManifest();
