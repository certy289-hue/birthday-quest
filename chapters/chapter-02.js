window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[2] = {
  mount(ctx) {
    const rounds = [
      {
        image: "images/chapter-02-01.jpg",
        question: "Was ist hier zu sehen?",
        answers: ["LILIE"]
      },
      {
        image: "images/chapter-02-02.jpg",
        question: "Wann habe ich dieses Bild aufgenommen?",
        answers: ["GEBURTSTAG", "LINUS GEBURTSTAG", "LINUSGEBURTSTAG"]
      },
      {
        image: "images/chapter-02-03.jpg",
        question: "Wo war das?",
        answers: ["SYLT", "BADEZIMMER"]
      },
      {
        image: "images/chapter-02-04.jpg",
        question: "Was ist hier zu sehen?",
        answers: ["MUNIA"]
      },
      {
        image: "images/chapter-02-05.jpg",
        question: "Welche Marke?",
        answers: ["FERRARI"]
      }
    ];

    const GIFT_NUMBER = 3;
    const UNLOCK_CODE = "2908";

    // Je kleiner die Zahl, desto stärker ist die Pixelation.
    const pixelLevels = [10, 16, 24, 36, 54, 90, 180, 320];

    let roundIndex = 0;
    let pixelLevelIndex = 0;
    let solved = 0;
    let currentImage = null;
    let imageLoaded = false;
    let giftRevealed = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-02">
        <header class="chapter-header chapter-02-header">
          <span class="chapter-kicker">Kapitel 02</span>
          <h2>Erkennst du es?</h2>
          <p>
            Fünf Bilder. Fünf Erinnerungen. Am Anfang siehst du fast nichts —
            aber jeder falsche Versuch macht das Bild ein kleines bisschen klarer.
          </p>
        </header>

        <section class="chapter-02-game">
          <div class="chapter-02-progress">
            <div class="chapter-02-progress-top">
              <span id="chapter02Counter">Bild 1 von ${rounds.length}</span>
              <span id="chapter02HeartCounter">0 / ${rounds.length} ❤️</span>
            </div>
            <div class="chapter-02-progress-track">
              <div id="chapter02ProgressBar" class="chapter-02-progress-bar"></div>
            </div>
          </div>

          <div id="chapter02RoundCard" class="chapter-02-round-card">
            <div class="chapter-02-image-frame">
              <canvas id="chapter02Canvas" class="chapter-02-canvas" width="900" height="650"></canvas>
              <div id="chapter02Loading" class="chapter-02-loading">Bild wird geladen…</div>
              <div id="chapter02ClearFlash" class="chapter-02-clear-flash hidden">Richtig ❤️</div>
            </div>

            <div class="chapter-02-round-copy">
              <span id="chapter02ImageLabel" class="chapter-02-image-label">BILD 1</span>
              <h3 id="chapter02Question">${rounds[0].question}</h3>

              <form id="chapter02AnswerForm" class="chapter-02-answer-form">
                <input
                  id="chapter02AnswerInput"
                  class="chapter-02-answer-input"
                  type="text"
                  autocomplete="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  placeholder="Deine Antwort..."
                >
                <button class="primary-button" type="submit">Antwort prüfen</button>
              </form>

              <p id="chapter02Feedback" class="chapter-02-feedback" aria-live="polite"></p>
            </div>
          </div>

          <div id="chapter02GiftReveal" class="chapter-02-gift-reveal hidden">
            <div class="chapter-02-success-heart">♥</div>
            <span class="chapter-02-complete-label">5 / 5 ❤️</span>
            <h3>Du hast sie alle erkannt.</h3>
            <p>Dein nächstes Geschenk wartet auf dich …</p>

            <div class="chapter-02-gift-box" aria-hidden="true">
              <div class="chapter-02-gift-lid"></div>
              <div class="chapter-02-gift-body"></div>
              <div class="chapter-02-gift-ribbon-v"></div>
              <div class="chapter-02-gift-ribbon-h"></div>
            </div>

            <div class="chapter-02-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
            </div>

            <div class="chapter-02-key-section">
              <p>
                Finde den Schlüssel in deinem Geschenk und gib ihn hier ein,
                um Kapitel 3 zu öffnen. 🔐
              </p>

              <form id="chapter02KeyForm" class="chapter-02-key-form">
                <input
                  id="chapter02KeyInput"
                  class="chapter-02-answer-input"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Schlüssel eingeben..."
                >
                <button class="primary-button" type="submit">Kapitel 3 freischalten</button>
              </form>

              <p id="chapter02KeyFeedback" class="chapter-02-feedback" aria-live="polite"></p>
            </div>
          </div>
        </section>
      </article>
    `;

    const canvas = ctx.root.querySelector("#chapter02Canvas");
    const canvasCtx = canvas.getContext("2d");
    const loading = ctx.root.querySelector("#chapter02Loading");
    const clearFlash = ctx.root.querySelector("#chapter02ClearFlash");
    const counter = ctx.root.querySelector("#chapter02Counter");
    const heartCounter = ctx.root.querySelector("#chapter02HeartCounter");
    const progressBar = ctx.root.querySelector("#chapter02ProgressBar");
    const label = ctx.root.querySelector("#chapter02ImageLabel");
    const question = ctx.root.querySelector("#chapter02Question");
    const answerForm = ctx.root.querySelector("#chapter02AnswerForm");
    const answerInput = ctx.root.querySelector("#chapter02AnswerInput");
    const feedback = ctx.root.querySelector("#chapter02Feedback");
    const roundCard = ctx.root.querySelector("#chapter02RoundCard");
    const giftReveal = ctx.root.querySelector("#chapter02GiftReveal");
    const keyForm = ctx.root.querySelector("#chapter02KeyForm");
    const keyInput = ctx.root.querySelector("#chapter02KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter02KeyFeedback");

    const normalize = value =>
      value
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    function updateProgress() {
      counter.textContent = `Bild ${Math.min(roundIndex + 1, rounds.length)} von ${rounds.length}`;
      heartCounter.textContent = `${solved} / ${rounds.length} ❤️`;
      progressBar.style.width = `${(solved / rounds.length) * 100}%`;
      label.textContent = `BILD ${Math.min(roundIndex + 1, rounds.length)}`;
    }

    function drawPixelated(levelOverride = null) {
      if (!currentImage || !imageLoaded) return;

      const targetPixels = levelOverride ?? pixelLevels[pixelLevelIndex];
      const aspect = currentImage.naturalWidth / currentImage.naturalHeight;

      let smallW;
      let smallH;

      if (aspect >= 1) {
        smallW = targetPixels;
        smallH = Math.max(1, Math.round(targetPixels / aspect));
      } else {
        smallH = targetPixels;
        smallW = Math.max(1, Math.round(targetPixels * aspect));
      }

      const offscreen = document.createElement("canvas");
      offscreen.width = smallW;
      offscreen.height = smallH;
      const offCtx = offscreen.getContext("2d");

      offCtx.imageSmoothingEnabled = true;
      offCtx.drawImage(currentImage, 0, 0, smallW, smallH);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.imageSmoothingEnabled = false;

      // Bild passend in das Canvas einpassen.
      const canvasAspect = canvas.width / canvas.height;
      let drawW, drawH, drawX, drawY;

      if (aspect > canvasAspect) {
        drawW = canvas.width;
        drawH = canvas.width / aspect;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * aspect;
        drawY = 0;
        drawX = (canvas.width - drawW) / 2;
      }

      canvasCtx.fillStyle = "#fff8fb";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.drawImage(offscreen, drawX, drawY, drawW, drawH);
    }

    function drawClear() {
      if (!currentImage || !imageLoaded) return;

      const aspect = currentImage.naturalWidth / currentImage.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;

      let drawW, drawH, drawX, drawY;

      if (aspect > canvasAspect) {
        drawW = canvas.width;
        drawH = canvas.width / aspect;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * aspect;
        drawY = 0;
        drawX = (canvas.width - drawW) / 2;
      }

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = "#fff8fb";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.imageSmoothingEnabled = true;
      canvasCtx.drawImage(currentImage, drawX, drawY, drawW, drawH);
    }

    function loadRound() {
      if (roundIndex >= rounds.length) {
        revealGift();
        return;
      }

      imageLoaded = false;
      loading.classList.remove("hidden");
      feedback.textContent = "";
      feedback.className = "chapter-02-feedback";
      answerInput.value = "";
      pixelLevelIndex = 0;

      question.textContent = rounds[roundIndex].question;
      updateProgress();

      currentImage = new Image();
      currentImage.onload = () => {
        imageLoaded = true;
        loading.classList.add("hidden");
        drawPixelated();
        window.setTimeout(() => answerInput.focus(), 120);
      };
      currentImage.onerror = () => {
        loading.textContent = "Das Bild konnte nicht geladen werden.";
      };
      currentImage.src = rounds[roundIndex].image;
    }

    function revealGift() {
      if (giftRevealed) return;
      giftRevealed = true;

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);

      roundCard.classList.add("hidden");
      giftReveal.classList.remove("hidden");
      giftReveal.classList.add("chapter-02-gift-in");

      window.setTimeout(() => keyInput.focus(), 1200);
    }

    answerForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!imageLoaded) return;

      const typed = normalize(answerInput.value);
      const accepted = rounds[roundIndex].answers.map(normalize);

      if (!typed) {
        feedback.textContent = "Du musst schon etwas eingeben 😭❤️";
        feedback.className = "chapter-02-feedback is-wrong";
        return;
      }

      if (!accepted.includes(typed)) {
        feedback.textContent = "Noch nicht. Das Bild wird etwas klarer.";
        feedback.className = "chapter-02-feedback is-wrong";
        pixelLevelIndex = Math.min(pixelLevelIndex + 1, pixelLevels.length - 1);
        drawPixelated();

        answerInput.classList.remove("shake");
        void answerInput.offsetWidth;
        answerInput.classList.add("shake");
        answerInput.select();
        return;
      }

      feedback.textContent = "Richtig ❤️";
      feedback.className = "chapter-02-feedback is-correct";
      solved++;
      updateProgress();
      drawClear();

      clearFlash.classList.remove("hidden");
      clearFlash.classList.remove("flash-in");
      void clearFlash.offsetWidth;
      clearFlash.classList.add("flash-in");

      window.setTimeout(() => {
        clearFlash.classList.add("hidden");
        roundCard.classList.add("chapter-02-card-out");

        window.setTimeout(() => {
          roundIndex++;
          roundCard.classList.remove("chapter-02-card-out");
          loadRound();
        }, 360);
      }, 1250);
    });

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      if (normalize(keyInput.value) !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-02-feedback is-wrong";
        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 3 ist offen. 🔓";
      keyFeedback.className = "chapter-02-feedback is-correct";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;

      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();

      window.setTimeout(() => {
        ctx.showToast("Kapitel 3 wurde freigeschaltet ❤️");
      }, 250);
    });

    if (ctx.debug) {
      const debugBox = document.createElement("div");
      debugBox.className = "chapter-02-debug";
      debugBox.innerHTML = `
        <strong>Debug:</strong>
        LILIE · GEBURTSTAG/LINUS GEBURTSTAG · SYLT/BADEZIMMER · MUNIA · FERRARI · Schlüssel: 2908
      `;
      ctx.root.querySelector(".chapter-02-game").appendChild(debugBox);
    }

    loadRound();
  },

  unmount() {}
};
