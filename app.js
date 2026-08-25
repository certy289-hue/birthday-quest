(() => {
  const STORAGE_KEY = "birthdayQuestProgressV1";
  const params = new URLSearchParams(window.location.search);
  const DEBUG = params.get("debug") === "1";
  const RESET = params.get("reset") === "1";

  const homeView = document.getElementById("homeView");
  const chapterView = document.getElementById("chapterView");
  const chapterMount = document.getElementById("chapterMount");
  const chapterList = document.getElementById("chapterList");
  const backButton = document.getElementById("backButton");
  const resetButton = document.getElementById("resetButton");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const toast = document.getElementById("toast");

  let toastTimer = null;

  function defaultProgress() {
    return { completed: [], unlocked: [1], giftUnlocked: [], keysFound: [] };
  }

  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored ? { ...defaultProgress(), ...stored } : defaultProgress();
    } catch {
      return defaultProgress();
    }
  }

  if (RESET) {
    localStorage.removeItem(STORAGE_KEY);

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("reset");

    window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  let progress = loadProgress();

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function normalizeProgress() {
    progress.completed = [...new Set(progress.completed)].sort((a,b) => a-b);
    progress.unlocked = [...new Set(progress.unlocked)].sort((a,b) => a-b);
    progress.giftUnlocked = [...new Set(progress.giftUnlocked)].sort((a,b) => a-b);
    progress.keysFound = [...new Set(progress.keysFound)];
    saveProgress();
  }

  function isUnlocked(id) {
    return DEBUG || progress.unlocked.includes(id);
  }

  function isCompleted(id) {
    return progress.completed.includes(id);
  }

  function renderHome() {
    chapterList.innerHTML = "";
    const completedCount = progress.completed.length;
    const percent = Math.round((completedCount / BIRTHDAY_GAME.totalChapters) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${completedCount} / ${BIRTHDAY_GAME.totalChapters} Kapitel`;
    progressPercent.textContent = `${percent}%`;

    BIRTHDAY_GAME.chapters.forEach(chapter => {
      const unlocked = isUnlocked(chapter.id);
      const completed = isCompleted(chapter.id);

      const button = document.createElement("button");
      button.type = "button";
      button.className = `chapter-card${completed ? " completed" : ""}`;
      button.disabled = !unlocked;

      button.innerHTML = `
        <span class="chapter-index">${String(chapter.id).padStart(2,"0")}</span>
        <span>
          <span class="chapter-title">${chapter.title}</span>
          <span class="chapter-subtitle">${unlocked ? chapter.subtitle : "Noch verschlossen"}</span>
        </span>
        <span class="chapter-status">${completed ? "✓" : unlocked ? "→" : "🔒"}</span>
      `;

      if (unlocked) button.addEventListener("click", () => openChapter(chapter.id));
      chapterList.appendChild(button);
    });

    if (DEBUG) {
      document.querySelectorAll(".debug-only").forEach(el => el.classList.remove("hidden"));
    }
  }

  function openChapter(chapterId) {
    const chapter = BIRTHDAY_GAME.chapters.find(item => item.id === chapterId);
    const module = window.BIRTHDAY_CHAPTERS?.[chapterId];

    if (!chapter || !module) {
      showToast("Dieses Kapitel wurde noch nicht eingebaut.");
      return;
    }

    homeView.classList.add("hidden");
    chapterView.classList.remove("hidden");
    chapterMount.innerHTML = "";
    chapterMount.dataset.activeChapter = String(chapterId);

    module.mount({
      root: chapterMount,
      chapter,
      debug: DEBUG,
      progress: structuredClone(progress),
      completeChapter: () => completeChapter(chapterId),
      unlockNext: () => unlockNextChapter(chapterId),
      unlockGift,
      registerKey,
      showToast
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeChapter(chapterId) {
    if (!progress.completed.includes(chapterId)) progress.completed.push(chapterId);
    normalizeProgress();
    renderHome();
    showToast(`Kapitel ${chapterId} geschafft ❤️`);
  }

  function unlockNextChapter(chapterId) {
    const nextId = chapterId + 1;
    if (nextId <= BIRTHDAY_GAME.totalChapters && !progress.unlocked.includes(nextId)) {
      progress.unlocked.push(nextId);
      normalizeProgress();
      showToast(`Kapitel ${nextId} freigeschaltet 🔓`);
    }
  }

  function unlockGift(giftNumber) {
    if (giftNumber == null) return;
    if (!progress.giftUnlocked.includes(giftNumber)) {
      progress.giftUnlocked.push(giftNumber);
      normalizeProgress();
    }
  }

  function registerKey(key) {
    if (!key) return;
    if (!progress.keysFound.includes(key)) {
      progress.keysFound.push(key);
      normalizeProgress();
    }
  }

  function backHome() {
    const active = Number(chapterMount.dataset.activeChapter || 0);
    const module = window.BIRTHDAY_CHAPTERS?.[active];
    if (module?.unmount) module.unmount();

    chapterMount.innerHTML = "";
    delete chapterMount.dataset.activeChapter;
    chapterView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove("hidden");
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2600);
  }

  function resetProgress() {
    if (!DEBUG) return;
    localStorage.removeItem(STORAGE_KEY);
    progress = defaultProgress();
    normalizeProgress();
    renderHome();
    showToast("Test-Fortschritt zurückgesetzt.");
  }

  backButton.addEventListener("click", backHome);
  resetButton.addEventListener("click", resetProgress);

  window.BirthdayQuest = {
    getProgress: () => structuredClone(progress),
    openChapter,
    completeChapter,
    unlockNextChapter,
    unlockGift,
    registerKey,
    resetProgress,
    isDebug: () => DEBUG
  };

  renderHome();
})();
