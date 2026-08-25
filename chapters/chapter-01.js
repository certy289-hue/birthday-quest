window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[1] = {
  mount(ctx) {
    const questions = [
      {
        text: "Wo war unser erster gemeinsamer Urlaub?",
        answer: "SYLT"
      },
      {
        text: "Was habe ich dir bei unserem ersten Treffen gekauft?",
        answer: "MASCARA"
      },
      {
        text: "In welchem Monat haben wir uns kennengelernt?",
        answer: "AUGUST"
      },
      {
        text: "In welches Land würde ich gerne einmal reisen?",
        answer: "JAPAN"
      },
      {
        text: "Wie heißt die erste Serie, die wir gemeinsam geschaut haben?",
        answer: "DEXTER"
      }
    ];

    const GIFT_NUMBER = 7;
    const UNLOCK_CODE = "MUNIA";

    let currentQuestion = 0;
    let correctAnswers = 0;
    let giftRevealed = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-01">
        <header class="chapter-header chapter-01-header">
          <span class="chapter-kicker">Kapitel 01</span>
          <h2>Der Anfang</h2>
          <p>
            Bevor du dein erstes Geschenk bekommst, musst du erstmal beweisen,
            wie gut du uns eigentlich kennst.
          </p>
        </header>

        <section class="chapter-01-game">
          <div class="chapter-01-progress">
            <div class="chapter-01-progress-top">
              <span id="chapter01QuestionCounter">Frage 1 von ${questions.length}</span>
              <span id="chapter01HeartCounter">0 / ${questions.length} ❤️</span>
            </div>
            <div class="chapter-01-progress-track">
              <div id="chapter01ProgressBar" class="chapter-01-progress-bar"></div>
            </div>
          </div>

          <div id="chapter01QuestionCard" class="chapter-01-question-card">
            <span class="chapter-01-question-label">FRAGE 1</span>
            <h3 id="chapter01QuestionText">${questions[0].text}</h3>

            <form id="chapter01AnswerForm" class="chapter-01-answer-form">
              <input
                id="chapter01AnswerInput"
                class="chapter-01-answer-input"
                type="text"
                autocomplete="off"
                autocapitalize="characters"
                spellcheck="false"
                placeholder="Deine Antwort..."
                aria-label="Antwort eingeben"
              >
              <button class="primary-button chapter-01-submit" type="submit">
                Antwort prüfen
              </button>
            </form>

            <p id="chapter01Feedback" class="chapter-01-feedback" aria-live="polite"></p>
          </div>

          <div id="chapter01GiftReveal" class="chapter-01-gift-reveal hidden">
            <div class="chapter-01-success-heart">♥</div>
            <span class="chapter-01-complete-label">5 / 5 ❤️</span>
            <h3>Okay… du kennst uns wohl doch ganz gut.</h3>
            <p>Dein erstes Geschenk wartet auf dich.</p>

            <div class="chapter-01-gift-box" aria-hidden="true">
              <div class="chapter-01-gift-lid"></div>
              <div class="chapter-01-gift-body"></div>
              <div class="chapter-01-gift-ribbon-v"></div>
              <div class="chapter-01-gift-ribbon-h"></div>
            </div>

            <div class="chapter-01-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
            </div>

            <div class="chapter-01-key-section">
              <p>
                In deinem Geschenk befindet sich der Schlüssel zum nächsten Kapitel.
                Gib ihn hier ein, sobald du ihn gefunden hast. 🔐
              </p>

              <form id="chapter01KeyForm" class="chapter-01-key-form">
                <input
                  id="chapter01KeyInput"
                  class="chapter-01-answer-input"
                  type="text"
                  autocomplete="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  placeholder="Schlüssel eingeben..."
                >
                <button class="primary-button" type="submit">Kapitel 2 freischalten</button>
              </form>

              <p id="chapter01KeyFeedback" class="chapter-01-feedback" aria-live="polite"></p>
            </div>
          </div>
        </section>
      </article>
    `;

    const questionCounter = ctx.root.querySelector("#chapter01QuestionCounter");
    const heartCounter = ctx.root.querySelector("#chapter01HeartCounter");
    const progressBar = ctx.root.querySelector("#chapter01ProgressBar");
    const questionCard = ctx.root.querySelector("#chapter01QuestionCard");
    const questionLabel = ctx.root.querySelector(".chapter-01-question-label");
    const questionText = ctx.root.querySelector("#chapter01QuestionText");
    const answerForm = ctx.root.querySelector("#chapter01AnswerForm");
    const answerInput = ctx.root.querySelector("#chapter01AnswerInput");
    const feedback = ctx.root.querySelector("#chapter01Feedback");
    const giftReveal = ctx.root.querySelector("#chapter01GiftReveal");
    const keyForm = ctx.root.querySelector("#chapter01KeyForm");
    const keyInput = ctx.root.querySelector("#chapter01KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter01KeyFeedback");

    const normalize = value =>
      value
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    function updateProgress() {
      questionCounter.textContent = `Frage ${Math.min(currentQuestion + 1, questions.length)} von ${questions.length}`;
      heartCounter.textContent = `${correctAnswers} / ${questions.length} ❤️`;
      progressBar.style.width = `${(correctAnswers / questions.length) * 100}%`;
    }

    function showNextQuestion() {
      if (currentQuestion >= questions.length) {
        revealGift();
        return;
      }

      questionCard.classList.remove("chapter-01-card-out");
      questionLabel.textContent = `FRAGE ${currentQuestion + 1}`;
      questionText.textContent = questions[currentQuestion].text;
      answerInput.value = "";
      feedback.textContent = "";
      feedback.className = "chapter-01-feedback";
      updateProgress();

      window.setTimeout(() => answerInput.focus(), 120);
    }

    function revealGift() {
      if (giftRevealed) return;
      giftRevealed = true;

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);

      questionCard.classList.add("hidden");
      giftReveal.classList.remove("hidden");
      giftReveal.classList.add("chapter-01-gift-in");

      window.setTimeout(() => {
        keyInput.focus();
      }, 1200);
    }

    answerForm.addEventListener("submit", event => {
      event.preventDefault();

      const typed = normalize(answerInput.value);
      const expected = normalize(questions[currentQuestion].answer);

      if (!typed) {
        feedback.textContent = "Du musst schon etwas eingeben";
        feedback.className = "chapter-01-feedback is-wrong";
        return;
      }

      if (typed !== expected) {
        feedback.textContent = "Hmm… versuch's nochmal";
        feedback.className = "chapter-01-feedback is-wrong";
        answerInput.classList.remove("shake");
        void answerInput.offsetWidth;
        answerInput.classList.add("shake");
        answerInput.select();
        return;
      }

      correctAnswers++;
      feedback.textContent = "Richtig";
      feedback.className = "chapter-01-feedback is-correct";
      updateProgress();

      questionCard.classList.add("chapter-01-correct");

      window.setTimeout(() => {
        questionCard.classList.remove("chapter-01-correct");
        questionCard.classList.add("chapter-01-card-out");

        window.setTimeout(() => {
          currentQuestion++;
          showNextQuestion();
        }, 330);
      }, 650);
    });

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      const typed = normalize(keyInput.value);

      if (typed !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-01-feedback is-wrong";
        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 2 ist offen. 🔓";
      keyFeedback.className = "chapter-01-feedback is-correct";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;

      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();

      window.setTimeout(() => {
        ctx.showToast("Kapitel 2 wurde freigeschaltet ❤️");
      }, 250);
    });

    updateProgress();

    if (ctx.debug) {
      const debugBox = document.createElement("div");
      debugBox.className = "chapter-01-debug";
      debugBox.innerHTML = `
        <strong>Debug:</strong>
        Antworten: SYLT · MASCARA · AUGUST · JAPAN · DEXTER · Schlüssel: MUNIA
      `;
      ctx.root.querySelector(".chapter-01-game").appendChild(debugBox);
    }
  },

  unmount() {
    // Kapitel 1 nutzt aktuell keine laufenden Timer, die beim Verlassen gestoppt werden müssen.
  }
};
