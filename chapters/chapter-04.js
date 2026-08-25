window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[4] = {
  mount(ctx) {
    const GIFT_NUMBER = 1;
    const UNLOCK_CODE = "BLUME";
    const FINAL_LOCK_CODE = "3183";

    const riddles = [
      {
        id: 1,
        type: "input",
        question: "Wie oft waren wir gemeinsam im Urlaub?",
        placeholder: "Zahl eingeben...",
        answers: ["3"],
        digit: "3"
      },
      {
        id: 2,
        type: "months",
        question: "In welchem Monat warst du mit deinem Vater Skifahren?",
        answers: ["JANUAR"],
        digit: "1"
      },
      {
        id: 3,
        type: "pokemon",
        question: "Wie heißt dieses Pokémon?",
        answers: ["GENGAR"],
        digit: "8",
        image: "images/chapter-04-gengar.png"
      },
      {
        id: 4,
        type: "input",
        question: "Was ist deine „Übertreibzahl“?",
        placeholder: "Zahl eingeben...",
        answers: ["3"],
        digit: "3"
      }
    ];

    let current = 0;
    const discovered = ["?", "?", "?", "?"];
    let finishedRiddles = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-04">
        <header class="chapter-header chapter-04-header">
          <span class="chapter-kicker">Kapitel 04</span>
          <h2>Der Code</h2>
          <p>
            Vier Erinnerungen. Vier Zahlen. Ein Schloss.
            Löse alle vier Aufgaben und finde den Code.
          </p>
        </header>

        <section class="chapter-04-game">
          <div class="chapter-04-code-display" aria-label="Gefundener Code">
            ${discovered.map((digit, index) => `
              <div class="chapter-04-code-slot" data-code-slot="${index}">
                <span>${digit}</span>
              </div>
            `).join("")}
          </div>

          <div class="chapter-04-mini-progress">
            <span id="chapter04ProgressText">Rätsel 1 von 4</span>
            <div class="chapter-04-mini-track">
              <div id="chapter04ProgressBar" class="chapter-04-mini-bar"></div>
            </div>
          </div>

          <div id="chapter04RiddleCard" class="chapter-04-riddle-card"></div>

          <div id="chapter04LockSection" class="chapter-04-lock-section hidden">
            <div class="chapter-04-lock-icon" aria-hidden="true">
              <div class="chapter-04-lock-shackle"></div>
              <div class="chapter-04-lock-body">🔒</div>
            </div>

            <span class="chapter-04-lock-label">FINALER CODE</span>
            <h3>Stell das Schloss richtig ein.</h3>

            <form id="chapter04LockForm" class="chapter-04-lock-form">
              ${[0,1,2,3].map(index => `
                <input
                  class="chapter-04-lock-digit"
                  data-lock-digit="${index}"
                  inputmode="numeric"
                  maxlength="1"
                  pattern="[0-9]*"
                  aria-label="Ziffer ${index + 1}"
                >
              `).join("")}
              <button class="primary-button chapter-04-lock-button" type="submit">
                Schloss öffnen
              </button>
            </form>

            <p id="chapter04LockFeedback" class="chapter-04-feedback" aria-live="polite"></p>
          </div>

          <div id="chapter04GiftReveal" class="chapter-04-gift-reveal hidden">
            <div class="chapter-04-success-heart">♥</div>
            <span class="chapter-04-complete-label">SCHLOSS GEÖFFNET 🔓</span>
            <h3>Du hast den Code geknackt.</h3>
            <p>Dein nächstes Geschenk wartet auf dich …</p>

            <div class="chapter-04-gift-box" aria-hidden="true">
              <div class="chapter-04-gift-lid"></div>
              <div class="chapter-04-gift-body"></div>
              <div class="chapter-04-gift-ribbon-v"></div>
              <div class="chapter-04-gift-ribbon-h"></div>
            </div>

            <div class="chapter-04-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
            </div>

            <div class="chapter-04-key-section">
              <p>
                Finde den Schlüssel in deinem Geschenk und gib ihn hier ein,
                um Kapitel 5 zu öffnen. 🔐
              </p>

              <form id="chapter04KeyForm" class="chapter-04-key-form">
                <input
                  id="chapter04KeyInput"
                  class="chapter-04-key-input"
                  type="text"
                  autocomplete="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  placeholder="Schlüssel eingeben..."
                >
                <button class="primary-button" type="submit">Kapitel 5 freischalten</button>
              </form>

              <p id="chapter04KeyFeedback" class="chapter-04-feedback" aria-live="polite"></p>
            </div>
          </div>
        </section>
      </article>
    `;

    const riddleCard = ctx.root.querySelector("#chapter04RiddleCard");
    const progressText = ctx.root.querySelector("#chapter04ProgressText");
    const progressBar = ctx.root.querySelector("#chapter04ProgressBar");
    const lockSection = ctx.root.querySelector("#chapter04LockSection");
    const giftReveal = ctx.root.querySelector("#chapter04GiftReveal");

    const normalize = value =>
      String(value ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    function updateCodeDisplay() {
      discovered.forEach((digit, index) => {
        const slot = ctx.root.querySelector(`[data-code-slot="${index}"]`);
        const span = slot.querySelector("span");
        span.textContent = digit;

        if (digit !== "?") {
          slot.classList.add("is-revealed");
          slot.classList.remove("reveal-pop");
          void slot.offsetWidth;
          slot.classList.add("reveal-pop");
        }
      });
    }

    function updateProgress() {
      progressText.textContent = finishedRiddles
        ? "4 von 4 Rätseln gelöst"
        : `Rätsel ${current + 1} von 4`;

      progressBar.style.width = `${(current / riddles.length) * 100}%`;
    }

    function renderRiddle() {
      if (current >= riddles.length) {
        finishedRiddles = true;
        progressBar.style.width = "100%";
        progressText.textContent = "4 von 4 Rätseln gelöst";
        riddleCard.classList.add("hidden");
        lockSection.classList.remove("hidden");
        lockSection.classList.add("chapter-04-lock-in");

        window.setTimeout(() => {
          ctx.root.querySelector('[data-lock-digit="0"]')?.focus();
        }, 500);
        return;
      }

      const riddle = riddles[current];

      let interaction = "";

      if (riddle.type === "input") {
        interaction = `
          <form class="chapter-04-answer-form" data-riddle-form>
            <input
              class="chapter-04-answer-input"
              data-riddle-input
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="${riddle.placeholder}"
            >
            <button class="primary-button" type="submit">Antwort prüfen</button>
          </form>
        `;
      }

      if (riddle.type === "months") {
        const months = [
          "Januar","Februar","März","April","Mai","Juni",
          "Juli","August","September","Oktober","November","Dezember"
        ];

        interaction = `
          <div class="chapter-04-month-grid" data-month-grid>
            ${months.map(month => `
              <button class="chapter-04-month" type="button" data-month="${month}">
                ${month}
              </button>
            `).join("")}
          </div>
        `;
      }

      if (riddle.type === "pokemon") {
        interaction = `
          <div class="chapter-04-pokemon-wrap">
            <img src="${riddle.image}" alt="Pokémon für das Rätsel">
          </div>
          <form class="chapter-04-answer-form" data-riddle-form>
            <input
              class="chapter-04-answer-input"
              data-riddle-input
              type="text"
              autocomplete="off"
              spellcheck="false"
              placeholder="Name des Pokémon..."
            >
            <button class="primary-button" type="submit">Antwort prüfen</button>
          </form>
        `;
      }

      riddleCard.innerHTML = `
        <span class="chapter-04-riddle-number">RÄTSEL ${current + 1}</span>
        <h3>${riddle.question}</h3>
        ${interaction}
        <p class="chapter-04-feedback" data-riddle-feedback aria-live="polite"></p>
      `;

      riddleCard.classList.remove("hidden", "chapter-04-riddle-out");
      riddleCard.classList.add("chapter-04-riddle-in");
      updateProgress();

      const form = riddleCard.querySelector("[data-riddle-form]");
      const input = riddleCard.querySelector("[data-riddle-input]");
      const feedback = riddleCard.querySelector("[data-riddle-feedback]");

      if (form) {
        form.addEventListener("submit", event => {
          event.preventDefault();
          checkAnswer(input.value, feedback, input);
        });

        window.setTimeout(() => input.focus(), 120);
      }

      riddleCard.querySelectorAll("[data-month]").forEach(button => {
        button.addEventListener("click", () => {
          checkAnswer(button.dataset.month, feedback, button);
        });
      });
    }

    function checkAnswer(value, feedback, sourceElement) {
      const riddle = riddles[current];
      const typed = normalize(value);
      const accepted = riddle.answers.map(normalize);

      if (!accepted.includes(typed)) {
        feedback.textContent = "Das passt noch nicht 👀❤️";
        feedback.className = "chapter-04-feedback is-wrong";

        sourceElement?.classList.remove("shake");
        void sourceElement?.offsetWidth;
        sourceElement?.classList.add("shake");
        return;
      }

      feedback.textContent = `Richtig — du bekommst die Zahl ${riddle.digit}.`;
      feedback.className = "chapter-04-feedback is-correct";
      discovered[current] = riddle.digit;
      updateCodeDisplay();

      riddleCard.querySelectorAll("input, button").forEach(el => {
        el.disabled = true;
      });

      window.setTimeout(() => {
        riddleCard.classList.add("chapter-04-riddle-out");

        window.setTimeout(() => {
          current++;
          renderRiddle();
        }, 330);
      }, 850);
    }

    const lockForm = ctx.root.querySelector("#chapter04LockForm");
    const lockDigits = [...ctx.root.querySelectorAll(".chapter-04-lock-digit")];
    const lockFeedback = ctx.root.querySelector("#chapter04LockFeedback");

    lockDigits.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);

        if (input.value && lockDigits[index + 1]) {
          lockDigits[index + 1].focus();
        }
      });

      input.addEventListener("keydown", event => {
        if (event.key === "Backspace" && !input.value && lockDigits[index - 1]) {
          lockDigits[index - 1].focus();
        }
      });
    });

    lockForm.addEventListener("submit", event => {
      event.preventDefault();

      const code = lockDigits.map(input => input.value).join("");

      if (code !== FINAL_LOCK_CODE) {
        lockFeedback.textContent = "Das Schloss bleibt zu. 🔒";
        lockFeedback.className = "chapter-04-feedback is-wrong";

        lockForm.classList.remove("shake");
        void lockForm.offsetWidth;
        lockForm.classList.add("shake");
        return;
      }

      lockFeedback.textContent = "Klick… 🔓";
      lockFeedback.className = "chapter-04-feedback is-correct";

      lockDigits.forEach(input => input.disabled = true);
      lockForm.querySelector("button").disabled = true;

      const lockIcon = ctx.root.querySelector(".chapter-04-lock-icon");
      lockIcon.classList.add("is-open");

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);

      window.setTimeout(() => {
        lockSection.classList.add("hidden");
        giftReveal.classList.remove("hidden");
        giftReveal.classList.add("chapter-04-gift-in");
        giftReveal.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 1100);
    });

    const keyForm = ctx.root.querySelector("#chapter04KeyForm");
    const keyInput = ctx.root.querySelector("#chapter04KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter04KeyFeedback");

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      if (normalize(keyInput.value).replace(/\s+/g, "") !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-04-feedback is-wrong";

        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 5 ist offen. 🔓";
      keyFeedback.className = "chapter-04-feedback is-correct";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;

      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();

      window.setTimeout(() => {
        ctx.showToast("Kapitel 5 wurde freigeschaltet ❤️");
      }, 250);
    });

    if (ctx.debug) {
      const debugBox = document.createElement("div");
      debugBox.className = "chapter-04-debug";
      debugBox.innerHTML = `
        <strong>Debug:</strong>
        Urlaub = 3 · Januar = 1 · Gengar = 8 · Übertreibzahl = 3 ·
        Schloss = 3183 · Schlüssel = BLUME
      `;
      ctx.root.querySelector(".chapter-04-game").appendChild(debugBox);
    }

    updateCodeDisplay();
    renderRiddle();
  },

  unmount() {}
};
