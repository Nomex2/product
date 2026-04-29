const TERMS_JSON_URL = "terms.json";
const CUSTOM_TERMS_KEY = "labGlossary.customTerms";
const THEME_KEY = "labGlossary.theme";

const state = {
  baseTerms: [],
  customTerms: [],
  terms: [],
  selectedTag: "all",
  searchText: "",
  selectedId: null,
  currentView: "browse",
  canSaveRemote: false
};

const elements = {
  themeToggle: document.querySelector("#themeToggle"),
  browseTab: document.querySelector("#browseTab"),
  addTab: document.querySelector("#addTab"),
  browseView: document.querySelector("#browseView"),
  addView: document.querySelector("#addView"),
  searchInput: document.querySelector("#searchInput"),
  resultStats: document.querySelector("#resultStats"),
  tagList: document.querySelector("#tagList"),
  allTagButton: document.querySelector('[data-tag="all"]'),
  activeFilter: document.querySelector("#activeFilter"),
  termList: document.querySelector("#termList"),
  termDetail: document.querySelector("#termDetail"),
  termForm: document.querySelector("#termForm"),
  saveModeLabel: document.querySelector("#saveModeLabel"),
  formMessage: document.querySelector("#formMessage")
};

boot();

async function boot() {
  applyStoredTheme();
  state.customTerms = loadCustomTerms();

  try {
    if (location.protocol === "file:") {
      state.baseTerms = loadTermsFromEmbeddedHtml();
    } else {
      state.baseTerms = await loadTermsFromJson();
      state.canSaveRemote = true;
    }
  } catch (error) {
    console.warn(error);
    state.baseTerms = loadTermsFromEmbeddedHtml();
  }

  syncTerms();
  state.selectedId = state.terms[0]?.id ?? null;
  bindEvents();
  render();
}

async function loadTermsFromJson() {
  const response = await fetch(TERMS_JSON_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`terms.jsonを読み込めませんでした: ${response.status}`);
  }

  const terms = await response.json();

  if (!Array.isArray(terms)) {
    throw new Error("terms.jsonの形式が正しくありません。");
  }

  return terms.map((term) => ({
    ...term,
    tags: Array.isArray(term.tags) ? term.tags : [],
    links: Array.isArray(term.links) ? term.links : [],
    source: "json"
  }));
}

function loadTermsFromEmbeddedHtml() {
  const dataNode = document.querySelector("#embeddedTerms");

  if (!dataNode?.textContent?.trim()) {
    throw new Error("HTML内の用語データが見つかりません。");
  }

  const terms = JSON.parse(dataNode.textContent);

  if (!Array.isArray(terms)) {
    throw new Error("HTML内の用語データ形式が正しくありません。");
  }

  return terms.map((term) => ({
    ...term,
    source: "embedded"
  }));
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.searchText = event.target.value.trim().toLowerCase();
    state.selectedId = filteredTerms()[0]?.id ?? null;
    render();
  });

  elements.allTagButton.addEventListener("click", () => {
    state.selectedTag = "all";
    state.selectedId = filteredTerms()[0]?.id ?? null;
    render();
  });

  elements.browseTab.addEventListener("click", () => switchView("browse"));
  elements.addTab.addEventListener("click", () => switchView("add"));
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.termForm.addEventListener("submit", handleTermSubmit);
}

function loadCustomTerms() {
  try {
    const terms = JSON.parse(localStorage.getItem(CUSTOM_TERMS_KEY) ?? "[]");
    return Array.isArray(terms) ? terms : [];
  } catch {
    return [];
  }
}

function saveCustomTerms() {
  localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(state.customTerms));
}

function syncTerms() {
  state.terms = [...state.baseTerms, ...state.customTerms]
    .sort((a, b) => a.term.localeCompare(b.term, "ja"));
}

function switchView(view) {
  state.currentView = view;
  renderView();
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

function applyStoredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  setTheme(storedTheme ?? (prefersDark ? "dark" : "light"));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.textContent = theme === "dark" ? "L" : "D";
  elements.themeToggle.title = theme === "dark" ? "ライトに切替" : "ダークに切替";
}

async function handleTermSubmit(event) {
  event.preventDefault();

  const formData = new FormData(elements.termForm);
  const term = String(formData.get("term") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const links = parseLinks(String(formData.get("links") ?? ""));

  if (!term || !description) {
    showFormMessage("用語と解説を入力してください。", true);
    return;
  }

  const newTerm = {
    id: makeTermId(),
    term,
    description,
    tags,
    links,
    source: "local"
  };

  if (state.canSaveRemote) {
    try {
      const remoteTerm = { ...newTerm, source: "json" };
      await saveTermsToJson([...state.baseTerms, remoteTerm]);
      state.baseTerms.push(remoteTerm);
      afterTermAdded(remoteTerm, "共有JSONに保存しました。");
      return;
    } catch (error) {
      console.warn(error);
      showFormMessage("共有JSONに保存できないため、ブラウザ保存に切り替えました。", true);
    }
  }

  state.customTerms.push(newTerm);
  saveCustomTerms();
  afterTermAdded(newTerm, "追加しました。");
}

async function saveTermsToJson(terms) {
  const response = await fetch(TERMS_JSON_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: `${JSON.stringify(terms.map(sanitizeTerm), null, 2)}\n`
  });

  if (!response.ok) {
    throw new Error(`terms.jsonへの保存に失敗しました: ${response.status}`);
  }
}

function sanitizeTerm(term) {
  return {
    id: term.id,
    term: term.term,
    description: term.description,
    tags: term.tags,
    links: term.links
  };
}

function afterTermAdded(term, message) {
  syncTerms();
  state.selectedTag = "all";
  state.searchText = "";
  elements.searchInput.value = "";
  state.selectedId = term.id;
  elements.termForm.reset();
  showFormMessage(message, false);
  state.currentView = "browse";
  render();
}

function parseTags(value) {
  return [...new Set(value.split(/[,\n、]+/).map((tag) => tag.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "ja"));
}

function parseLinks(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [rawTitle, rawUrl] = line.includes("|") ? line.split("|") : ["", line];
    const url = (rawUrl ?? "").trim();
    return {
      title: (rawTitle ?? "").trim() || url,
      url
    };
  }).filter((link) => link.url);
}

function makeTermId() {
  if (state.canSaveRemote) {
    const numericIds = state.baseTerms
      .map((term) => Number(term.id))
      .filter((id) => Number.isInteger(id));

    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : makeLocalId();
  }

  return makeLocalId();
}

function makeLocalId() {
  return `local-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

function showFormMessage(message, isError) {
  elements.formMessage.textContent = message;
  elements.formMessage.classList.toggle("error", isError);
}

function render() {
  renderView();
  renderSaveMode();
  renderTags();
  renderTermList();
  renderDetail();
  elements.resultStats.textContent = `${filteredTerms().length}件`;
  elements.activeFilter.textContent = state.selectedTag === "all" ? "すべて" : state.selectedTag;
  elements.allTagButton.classList.toggle("active", state.selectedTag === "all");
}

function renderSaveMode() {
  elements.saveModeLabel.textContent = state.canSaveRemote ? "共有JSON保存" : "ブラウザ保存";
}

function renderView() {
  const isBrowse = state.currentView === "browse";
  elements.browseView.classList.toggle("hidden", !isBrowse);
  elements.addView.classList.toggle("hidden", isBrowse);
  elements.browseTab.classList.toggle("active", isBrowse);
  elements.addTab.classList.toggle("active", !isBrowse);
}

function renderTags() {
  const tags = [...new Set(state.terms.flatMap((term) => term.tags))]
    .sort((a, b) => a.localeCompare(b, "ja"));

  elements.tagList.replaceChildren(...tags.map((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag-chip";
    button.textContent = tag;
    button.dataset.tag = tag;
    button.classList.toggle("active", state.selectedTag === tag);
    button.addEventListener("click", () => {
      state.selectedTag = tag;
      state.selectedId = filteredTerms()[0]?.id ?? null;
      render();
    });
    return button;
  }));
}

function renderTermList() {
  const terms = filteredTerms();

  if (terms.length === 0) {
    elements.termList.innerHTML = '<p class="empty-state">該当する用語がありません。</p>';
    return;
  }

  elements.termList.replaceChildren(...terms.map((term) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "term-card";
    button.classList.toggle("active", state.selectedId === term.id);
    button.addEventListener("click", () => {
      state.selectedId = term.id;
      render();
    });

    const title = document.createElement("strong");
    title.textContent = term.term;

    const description = document.createElement("p");
    description.textContent = term.description;

    const tags = document.createElement("div");
    tags.className = "mini-tags";
    tags.replaceChildren(...term.tags.map((tag) => {
      const span = document.createElement("span");
      span.className = "mini-tag";
      span.textContent = tag;
      return span;
    }));

    if (term.source === "local") {
      const badge = document.createElement("span");
      badge.className = "mini-tag local-badge";
      badge.textContent = "追加";
      tags.prepend(badge);
    }

    button.append(title, description, tags);
    return button;
  }));
}

function renderDetail() {
  const term = state.terms.find((item) => item.id === state.selectedId);

  if (!term) {
    elements.termDetail.innerHTML = '<p class="empty-state">用語を選択してください。</p>';
    return;
  }

  const title = document.createElement("h2");
  title.className = "detail-title";
  title.textContent = term.term;

  const description = document.createElement("p");
  description.className = "detail-description";
  description.textContent = term.description;

  const tagSection = document.createElement("section");
  tagSection.className = "detail-section";
  tagSection.innerHTML = "<h3>タグ</h3>";
  const tagWrap = document.createElement("div");
  tagWrap.className = "detail-tags";
  tagWrap.replaceChildren(...term.tags.map((tag) => {
    const span = document.createElement("span");
    span.className = "detail-tag";
    span.textContent = tag;
    return span;
  }));
  tagSection.append(tagWrap);

  const linkSection = document.createElement("section");
  linkSection.className = "detail-section";
  linkSection.innerHTML = "<h3>参考リンク</h3>";
  const linkList = document.createElement("ul");
  linkList.className = "reference-list";
  linkList.replaceChildren(...term.links.map((link) => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.title || link.url;
    item.append(anchor);
    return item;
  }));
  linkSection.append(linkList);

  const children = [title, description, tagSection, linkSection];

  if (term.source === "local") {
    const localActions = document.createElement("div");
    localActions.className = "detail-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button";
    deleteButton.textContent = "追加データを削除";
    deleteButton.addEventListener("click", () => deleteCustomTerm(term.id));
    localActions.append(deleteButton);
    children.push(localActions);
  }

  elements.termDetail.replaceChildren(...children);
}

function deleteCustomTerm(termId) {
  if (!confirm("このブラウザに保存された追加データを削除します。")) {
    return;
  }

  state.customTerms = state.customTerms.filter((term) => term.id !== termId);
  saveCustomTerms();
  syncTerms();
  state.selectedId = filteredTerms()[0]?.id ?? state.terms[0]?.id ?? null;
  render();
}

function filteredTerms() {
  return state.terms.filter((term) => {
    const matchesTag = state.selectedTag === "all" || term.tags.includes(state.selectedTag);
    const haystack = [term.term, term.description, ...term.tags].join(" ").toLowerCase();
    const matchesSearch = !state.searchText || haystack.includes(state.searchText);
    return matchesTag && matchesSearch;
  });
}
