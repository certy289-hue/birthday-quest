window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[3] = {
  mount(ctx) {
    const events = [
      { id: "kennen", title: "Kennengelernt", date: "August 2024", order: 1, emoji: "❤️" },
      { id: "treffen", title: "Erstes Treffen", date: "Oktober 2024", order: 2, emoji: "☕" },
      { id: "kuss", title: "Erster Kuss", date: "November 2024", order: 3, emoji: "💋" },
      { id: "kirche", title: "Lichtershow in der Kirche", date: "März 2025", order: 4, emoji: "✨" },
      { id: "sylt", title: "Sylt-Urlaub", date: "April 2025", order: 5, emoji: "🌊" },
      { id: "kuerbis", title: "Kürbis geschnitzt", date: "Oktober 2025", order: 6, emoji: "🎃" },
      { id: "tiktok", title: "250 TikTok-Flammen", date: "März 2026", order: 7, emoji: "🔥" },
      { id: "blitzer", title: "Geblitzt worden", date: "August 2026", order: 8, emoji: "🚗" }
    ];

    const GIFT_NUMBER = 4;
    const UNLOCK_CODE = "POLARLICHTER";

    let currentOrder = shuffle([...events]);
    let dragId = null;
    let touchDragId = null;
    let touchPlaceholderIndex = null;
    let solved = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-03">
        <header class="chapter-header chapter-03-header">
          <span class="chapter-kicker">Kapitel 03</span>
          <h2>Weißt du noch wann?</h2>
          <p>
            Acht Erinnerungen. Eine gemeinsame Geschichte. Bring sie in die richtige
            Reihenfolge – vom Anfang bis heute. ❤️
          </p>
        </header>

        <section class="chapter-03-game">
          <div class="chapter-03-hint">
            <span>↕</span>
            <p>Zieh die Karten nach oben oder unten, bis alles stimmt.</p>
          </div>

          <div id="chapter03Timeline" class="chapter-03-timeline"></div>

          <div class="chapter-03-actions">
            <button id="chapter03CheckButton" class="primary-button" type="button">
              Reihenfolge prüfen
            </button>
            <p id="chapter03Feedback" class="chapter-03-feedback" aria-live="polite"></p>
          </div>

          <div id="chapter03Solved" class="chapter-03-solved hidden">
            <div class="chapter-03-line-wrap">
              <div class="chapter-03-line"></div>
              <div id="chapter03SolvedList" class="chapter-03-solved-list"></div>
            </div>

            <div class="chapter-03-ending-copy">
              <div class="chapter-03-success-heart">♥</div>
              <h3>Manche Erinnerungen vergisst man eben nicht. ❤️</h3>
              <p>Dein nächstes Geschenk wartet auf dich …</p>

              <div class="chapter-03-gift-box" aria-hidden="true">
                <div class="chapter-03-gift-lid"></div>
                <div class="chapter-03-gift-body"></div>
                <div class="chapter-03-gift-ribbon-v"></div>
                <div class="chapter-03-gift-ribbon-h"></div>
              </div>

              <div class="chapter-03-gift-number">
                <span>ÖFFNE</span>
                <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
              </div>

              <div class="chapter-03-key-section">
                <p>
                  Finde den Schlüssel in deinem Geschenk und gib ihn hier ein,
                  um Kapitel 4 zu öffnen. 🔐
                </p>

                <form id="chapter03KeyForm" class="chapter-03-key-form">
                  <input
                    id="chapter03KeyInput"
                    class="chapter-03-key-input"
                    type="text"
                    autocomplete="off"
                    autocapitalize="characters"
                    spellcheck="false"
                    placeholder="Schlüssel eingeben..."
                  >
                  <button class="primary-button" type="submit">Kapitel 4 freischalten</button>
                </form>

                <p id="chapter03KeyFeedback" class="chapter-03-feedback" aria-live="polite"></p>
              </div>
            </div>
          </div>
        </section>
      </article>
    `;

    const timeline = ctx.root.querySelector("#chapter03Timeline");
    const checkButton = ctx.root.querySelector("#chapter03CheckButton");
    const feedback = ctx.root.querySelector("#chapter03Feedback");
    const solvedSection = ctx.root.querySelector("#chapter03Solved");
    const solvedList = ctx.root.querySelector("#chapter03SolvedList");

    function shuffle(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      // Sehr selten kann die zufällige Reihenfolge direkt korrekt sein.
      if (items.every((item, index) => item.order === index + 1)) {
        [items[0], items[1]] = [items[1], items[0]];
      }

      return items;
    }

    function renderTimeline() {
      timeline.innerHTML = "";

      currentOrder.forEach((event, index) => {
        const card = document.createElement("div");
        card.className = "chapter-03-card";
        card.draggable = true;
        card.dataset.id = event.id;
        card.dataset.index = index;

        card.innerHTML = `
          <span class="chapter-03-grip" aria-hidden="true">≡</span>
          <span class="chapter-03-card-emoji">${event.emoji}</span>
          <span class="chapter-03-card-title">${event.title}</span>
          <span class="chapter-03-card-position">${index + 1}</span>
        `;

        // Desktop drag & drop.
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragover", dragOver);
        card.addEventListener("drop", dropCard);
        card.addEventListener("dragend", dragEnd);

        // Touch handling for iPhone / Android.
        card.addEventListener("touchstart", touchStart, { passive: false });
        card.addEventListener("touchmove", touchMove, { passive: false });
        card.addEventListener("touchend", touchEnd, { passive: false });

        timeline.appendChild(card);
      });
    }

    function dragStart(event) {
      if (solved) return;
      dragId = event.currentTarget.dataset.id;
      event.currentTarget.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", dragId);
    }

    function dragOver(event) {
      if (solved) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      event.currentTarget.classList.add("drag-over");
    }

    function dropCard(event) {
      if (solved) return;
      event.preventDefault();

      const targetId = event.currentTarget.dataset.id;
      if (!dragId || dragId === targetId) return;

      moveItemBefore(dragId, targetId);
      clearDragClasses();
    }

    function dragEnd() {
      clearDragClasses();
      dragId = null;
    }

    function clearDragClasses() {
      timeline.querySelectorAll(".chapter-03-card").forEach(card => {
        card.classList.remove("is-dragging", "drag-over", "touch-dragging");
      });
    }

    function moveItemBefore(movingId, targetId) {
      const from = currentOrder.findIndex(item => item.id === movingId);
      const to = currentOrder.findIndex(item => item.id === targetId);
      if (from === -1 || to === -1) return;

      const [moved] = currentOrder.splice(from, 1);
      const adjustedTo = from < to ? to - 1 : to;
      currentOrder.splice(adjustedTo, 0, moved);

      renderTimeline();
    }

    function touchStart(event) {
      if (solved) return;
      event.preventDefault();

      const card = event.currentTarget;
      touchDragId = card.dataset.id;
      touchPlaceholderIndex = Number(card.dataset.index);
      card.classList.add("touch-dragging");
    }

    function touchMove(event) {
      if (solved || !touchDragId) return;
      event.preventDefault();

      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".chapter-03-card");
      if (!target || target.dataset.id === touchDragId) return;

      const targetIndex = Number(target.dataset.index);
      if (targetIndex === touchPlaceholderIndex) return;

      const from = currentOrder.findIndex(item => item.id === touchDragId);
      if (from === -1) return;

      const [moved] = currentOrder.splice(from, 1);
      currentOrder.splice(targetIndex, 0, moved);
      touchPlaceholderIndex = targetIndex;

      renderTimeline();

      const movedCard = timeline.querySelector(`[data-id="${touchDragId}"]`);
      movedCard?.classList.add("touch-dragging");
    }

    function touchEnd(event) {
      if (solved) return;
      event.preventDefault();
      touchDragId = null;
      touchPlaceholderIndex = null;
      clearDragClasses();
    }

    function isCorrectOrder() {
      return currentOrder.every((item, index) => item.order === index + 1);
    }

    function showSolvedTimeline() {
      solved = true;
      feedback.textContent = "";
      checkButton.disabled = true;

      timeline.classList.add("hidden");
      ctx.root.querySelector(".chapter-03-hint").classList.add("hidden");
      ctx.root.querySelector(".chapter-03-actions").classList.add("hidden");

      solvedList.innerHTML = "";

      [...events]
        .sort((a, b) => a.order - b.order)
        .forEach((event, index) => {
          const row = document.createElement("div");
          row.className = "chapter-03-solved-row";
          row.style.animationDelay = `${index * 0.18}s`;
          row.innerHTML = `
            <span class="chapter-03-solved-date">${event.date}</span>
            <span class="chapter-03-dot">♥</span>
            <span class="chapter-03-solved-title">${event.title}</span>
          `;
          solvedList.appendChild(row);
        });

      solvedSection.classList.remove("hidden");
      solvedSection.classList.add("chapter-03-solved-in");

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);

      window.setTimeout(() => {
        ctx.root.querySelector("#chapter03KeyInput")?.focus();
      }, 2100);
    }

    checkButton.addEventListener("click", () => {
      feedback.className = "chapter-03-feedback";

      if (!isCorrectOrder()) {
        feedback.textContent = "Da stimmt noch etwas nicht 👀❤️";
        feedback.classList.add("is-wrong");

        timeline.classList.remove("shake");
        void timeline.offsetWidth;
        timeline.classList.add("shake");
        return;
      }

      showSolvedTimeline();
    });

    const normalize = value =>
      value
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

    const keyForm = ctx.root.querySelector("#chapter03KeyForm");
    const keyInput = ctx.root.querySelector("#chapter03KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter03KeyFeedback");

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      if (normalize(keyInput.value) !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-03-feedback is-wrong";

        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 4 ist offen. 🔓";
      keyFeedback.className = "chapter-03-feedback is-correct";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;

      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();

      window.setTimeout(() => {
        ctx.showToast("Kapitel 4 wurde freigeschaltet ❤️");
      }, 250);
    });

    if (ctx.debug) {
      const debugBox = document.createElement("div");
      debugBox.className = "chapter-03-debug";
      debugBox.innerHTML = `
        <strong>Debug:</strong>
        Kennengelernt → Erstes Treffen → Erster Kuss → Lichtershow → Sylt →
        Kürbis → 250 TikTok-Flammen → Geblitzt · Schlüssel: POLARLICHTER
      `;
      ctx.root.querySelector(".chapter-03-game").appendChild(debugBox);
    }

    renderTimeline();
  },

  unmount() {}
};
