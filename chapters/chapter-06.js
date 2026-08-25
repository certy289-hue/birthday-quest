window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[6] = {
  mount(ctx) {
    const GIFT_NUMBER = 8;
    const UNLOCK_CODE = "VOLLIDIOT";

    const rounds = [
      {
        audio: "audio/chapter-06-01.mp3",
        answer: "Kuh",
        options: ["Kuh", "Schaf", "Ziege", "Staubsauger"],
        success: "Leider richtig. Das sollte eine Kuh sein."
      },
      {
        audio: "audio/chapter-06-02.mp3",
        answer: "Rennauto",
        options: ["Biene", "Rennauto", "Elektrische Zahnbürste", "Rasenmäher"],
        success: "VROOOOM. Motorsport kann ich offenbar auch."
      },
      {
        audio: "audio/chapter-06-03.mp3",
        answer: "Polizeisirene",
        options: ["Feueralarm", "Polizeisirene", "Kaputter Drucker", "Möwe"],
        success: "..."
      },
      {
        audio: "audio/chapter-06-04.mp3",
        answer: "Hubschrauber",
        options: ["Hubschrauber", "Waschmaschine", "Motorrad", "Ventilator"],
        success: "Ich bin beeindruckt."
      },
      {
        audio: "audio/chapter-06-05.mp3",
        answer: "Knarzende Tür",
        options: ["Knarzende Tür", "Sterbender Dinosaurier", "Alte Schaukel", "Quietschende Bremse"],
        success: "JA. Eine Tür. Angeblich."
      }
    ];

    let current = 0;
    let wrongGuesses = 0;
    let audio = null;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-06">
        <header class="chapter-header">
          <span class="chapter-kicker">Kapitel 06</span>
          <h2>Was mache ich da nach?</h2>
          <p>Fünf Meisterwerke der Geräuschkunst. Du musst nur herausfinden, was sie darstellen sollen.</p>
        </header>

        <section class="chapter-06-game">
          <div class="chapter-06-progress">
            <span id="chapter06Progress">GERÄUSCH 1 / 5</span>
            <div class="chapter-06-track"><div id="chapter06Bar" class="chapter-06-bar"></div></div>
          </div>

          <div id="chapter06Round" class="chapter-06-card"></div>

          <div id="chapter06Success" class="chapter-06-success hidden">
            <div class="chapter-06-headphones">🎧</div>
            <span class="chapter-06-complete-label">5 / 5 ERKANNT</span>
            <h3>Du verstehst mich gut ;)</h3>
            <p>Eine Fähigkeit, auf die du wirklich nicht stolz sein solltest.</p>

            <div class="chapter-06-gift-box" aria-hidden="true">
              <div class="chapter-06-gift-lid"></div>
              <div class="chapter-06-gift-body"></div>
              <div class="chapter-06-gift-ribbon-v"></div>
              <div class="chapter-06-gift-ribbon-h"></div>
            </div>

            <div class="chapter-06-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
            </div>

            <div class="chapter-06-key-section">
              <p>Finde den Schlüssel im Geschenk und gib ihn hier ein, um Kapitel 7 zu öffnen. 🔐</p>
              <form id="chapter06KeyForm" class="chapter-06-key-form">
                <input id="chapter06KeyInput" class="chapter-06-key-input" type="text"
                  autocomplete="off" autocapitalize="characters" spellcheck="false"
                  placeholder="Schlüssel eingeben...">
                <button class="primary-button" type="submit">Kapitel 7 freischalten</button>
              </form>
              <p id="chapter06KeyFeedback" class="chapter-06-feedback" aria-live="polite"></p>
            </div>
          </div>
        </section>
      </article>
    `;

    const roundEl = ctx.root.querySelector("#chapter06Round");
    const progressEl = ctx.root.querySelector("#chapter06Progress");
    const barEl = ctx.root.querySelector("#chapter06Bar");
    const successEl = ctx.root.querySelector("#chapter06Success");

    function stopAudio() {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
      }
    }

    function renderRound() {
      stopAudio();
      const round = rounds[current];
      progressEl.textContent = `GERÄUSCH ${current + 1} / ${rounds.length}`;
      barEl.style.width = `${(current / rounds.length) * 100}%`;

      roundEl.innerHTML = `
        <span class="chapter-06-round-label">RUNDE ${current + 1}</span>
        <h3>Was versuche ich hier nachzumachen?</h3>

        <button class="chapter-06-play" id="chapter06Play" type="button">
          <span class="chapter-06-play-icon">▶</span>
          <span class="chapter-06-waves"><i></i><i></i><i></i><i></i><i></i></span>
          <strong>GERÄUSCH ABSPIELEN</strong>
        </button>

        <p class="chapter-06-replay-hint">Du kannst es so oft anhören, wie du willst.</p>

        <div class="chapter-06-options">
          ${round.options.map(option => `
            <button class="chapter-06-option" type="button" data-answer="${option}">
              ${option}
            </button>
          `).join("")}
        </div>

        <p id="chapter06Feedback" class="chapter-06-feedback" aria-live="polite"></p>
      `;

      roundEl.classList.remove("round-out");
      roundEl.classList.add("round-in");

      const playButton = roundEl.querySelector("#chapter06Play");
      const feedback = roundEl.querySelector("#chapter06Feedback");

      playButton.addEventListener("click", () => {
        stopAudio();
        audio = new Audio(round.audio);
        playButton.classList.add("is-playing");
        playButton.querySelector(".chapter-06-play-icon").textContent = "■";

        audio.addEventListener("ended", () => {
          playButton.classList.remove("is-playing");
          playButton.querySelector(".chapter-06-play-icon").textContent = "▶";
        }, { once: true });

        audio.play().catch(() => {
          playButton.classList.remove("is-playing");
          playButton.querySelector(".chapter-06-play-icon").textContent = "▶";
          feedback.textContent = "Die Aufnahme konnte gerade nicht abgespielt werden.";
        });
      });

      roundEl.querySelectorAll(".chapter-06-option").forEach(button => {
        button.addEventListener("click", () => {
          if (button.dataset.answer !== round.answer) {
            wrongGuesses++;
            button.classList.remove("wrong");
            void button.offsetWidth;
            button.classList.add("wrong");
            feedback.textContent = ["Nein..."][wrongGuesses % 3];
            feedback.className = "chapter-06-feedback is-wrong";
            return;
          }

          stopAudio();
          button.classList.add("correct");
          roundEl.querySelectorAll(".chapter-06-option").forEach(btn => btn.disabled = true);
          feedback.textContent = round.success;
          feedback.className = "chapter-06-feedback is-correct";

          window.setTimeout(() => {
            roundEl.classList.add("round-out");
            window.setTimeout(() => {
              current++;
              if (current < rounds.length) {
                renderRound();
              } else {
                finish();
              }
            }, 320);
          }, 900);
        });
      });
    }

    function finish() {
      barEl.style.width = "100%";
      progressEl.textContent = "5 / 5 GERÄUSCHE ERKANNT";
      roundEl.classList.add("hidden");
      successEl.classList.remove("hidden");
      successEl.classList.add("success-in");

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);
      successEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const normalize = value => String(value || "").trim().toUpperCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");

    const keyForm = ctx.root.querySelector("#chapter06KeyForm");
    const keyInput = ctx.root.querySelector("#chapter06KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter06KeyFeedback");

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      if (normalize(keyInput.value) !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-06-feedback is-wrong";
        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 7 ist offen. 🔓";
      keyFeedback.className = "chapter-06-feedback is-correct";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;
      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();
      ctx.showToast("Kapitel 7 wurde freigeschaltet ❤️");
    });

    if (ctx.debug) {
      const debug = document.createElement("div");
      debug.className = "chapter-06-debug";
      debug.innerHTML = "<strong>Debug:</strong> Kuh · Rennauto · Polizeisirene · Hubschrauber · Knarzende Tür · Geschenk 8 · Schlüssel VOLLIDIOT";
      ctx.root.querySelector(".chapter-06-game").appendChild(debug);
    }

    renderRound();
    this._cleanup = stopAudio;
  },

  unmount() {
    if (this._cleanup) this._cleanup();
  }
};
