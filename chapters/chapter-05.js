window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[5] = {
  mount(ctx) {
    const GIFT_NUMBER = 6;
    const UNLOCK_CODE = "BOMBE";
    const START_SECONDS = 5 * 60;

    const wirePool = [
      { id: "blue",   label: "Blau",  color: "#4f86d9" },
      { id: "green",  label: "Grün",  color: "#61a978" },
      { id: "yellow", label: "Gelb",  color: "#e4bd4f" },
      { id: "pink",   label: "Rosa",  color: "#df7fa8" },
      { id: "red",    label: "Rot",   color: "#cf5c63" },
      { id: "white",  label: "Weiß",  color: "#f3f0ec" }
    ];

    function shuffled(items) {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }

      // Verhindert absichtlich die triviale Reihenfolge Blau → Grün → Gelb → Rosa → Rot → Weiß.
      const trivial = ["blue", "green", "yellow", "pink", "red", "white"];
      if (copy.every((wire, index) => wire.id === trivial[index])) {
        [copy[0], copy[3]] = [copy[3], copy[0]];
      }

      return copy;
    }

    // Die Positionen der Kabel im Gerät sind zufällig.
    const wires = shuffled(wirePool);

    // Die richtige Schnitt-Reihenfolge bleibt logisch dieselbe.
    const solution = ["blue", "green", "yellow", "pink", "red", "white"];

    const clues = [
      "Blau wird direkt vor Grün durchtrennt.",
      "Zwischen Grün und Rosa liegt genau ein Kabel.",
      "Gelb wird vor Rosa durchtrennt.",
      "Rot kommt nach Rosa, aber nicht als letztes Kabel.",
      "Weiß wird nach Rot durchtrennt.",
      "Blau ist das erste Kabel."
    ];

    let step = 0;
    let secondsLeft = START_SECONDS;
    let timer = null;
    let resetting = false;
    let defused = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-05">
        <header class="chapter-header chapter-05-header">
          <span class="chapter-kicker">Kapitel 05</span>
          <h2>Bombenentschärfung</h2>
          <p>
            Das Sicherheitssystem hat dein nächstes Geschenk gesperrt.
            Finde die richtige Reihenfolge und trenne alle sechs Kabel. 💣
          </p>
        </header>

        <section class="chapter-05-game">
          <div id="chapter05BombPanel" class="chapter-05-bomb-panel">
            <div class="chapter-05-statusbar">
              <div>
                <span class="chapter-05-status-label">SYSTEMSTATUS</span>
                <strong id="chapter05Status">SCHARF</strong>
              </div>

              <div class="chapter-05-timer-wrap">
                <span>VERBLEIBENDE ZEIT</span>
                <strong id="chapter05Timer">05:00</strong>
              </div>
            </div>

            <div class="chapter-05-main">
              <div class="chapter-05-device">
                <div class="chapter-05-device-top">
                  <span class="chapter-05-led"></span>
                  <span>SECURITY UNIT // 05</span>
                  <span class="chapter-05-led"></span>
                </div>

                <div class="chapter-05-screen">
                  <span>SEQUENZ</span>
                  <strong id="chapter05Sequence">0 / 6</strong>
                  <small id="chapter05ScreenText">WARTE AUF EINGABE</small>
                </div>

                <div id="chapter05Wires" class="chapter-05-wires">
                  ${wires.map((wire, index) => `
                    <button
                      class="chapter-05-wire"
                      type="button"
                      data-wire="${wire.id}"
                      aria-label="${wire.label}es Kabel durchtrennen"
                    >
                      <span class="chapter-05-wire-number">${String.fromCharCode(65 + index)}</span>
                      <span class="chapter-05-wire-line" style="--wire-color:${wire.color}">
                        <span class="chapter-05-wire-left"></span>
                        <span class="chapter-05-wire-cutmark">✂</span>
                        <span class="chapter-05-wire-right"></span>
                      </span>
                      <span class="chapter-05-wire-name">${wire.label}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              <aside class="chapter-05-clues">
                <span class="chapter-05-clue-kicker">ENTSCHÄRFUNGSANLEITUNG</span>
                <h3>Hinweise</h3>
                <p>Die Kabel müssen in einer ganz bestimmten Reihenfolge getrennt werden.</p>

                <ol>
                  ${clues.map(clue => `<li>${clue}</li>`).join("")}
                </ol>

                <div class="chapter-05-warning">
                  ⚠️ Ein falsches Kabel setzt das System zurück.
                </div>
              </aside>
            </div>

            <p id="chapter05Feedback" class="chapter-05-feedback" aria-live="polite">
              Lies die Hinweise und wähle das erste Kabel.
            </p>

            <div id="chapter05Explosion" class="chapter-05-explosion hidden" aria-hidden="true">
              <div class="chapter-05-explosion-symbol">💥</div>
              <strong>SYSTEMFEHLER</strong>
              <span>NEUSTART…</span>
            </div>
          </div>

          <div id="chapter05Success" class="chapter-05-success hidden">
            <div class="chapter-05-success-check">✓</div>
            <span class="chapter-05-complete-label">SYSTEM ENTSCHÄRFT</span>
            <h3>Sehr gut gemacht!</h3>
            <p>Das Sicherheitssystem gibt dein nächstes Geschenk frei.</p>

            <div class="chapter-05-gift-box" aria-hidden="true">
              <div class="chapter-05-gift-lid"></div>
              <div class="chapter-05-gift-body"></div>
              <div class="chapter-05-gift-ribbon-v"></div>
              <div class="chapter-05-gift-ribbon-h"></div>
            </div>

            <div class="chapter-05-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. ${GIFT_NUMBER}</strong>
            </div>

            <div class="chapter-05-key-section">
              <p>
                Finde den Schlüssel in deinem Geschenk und gib ihn hier ein,
                um Kapitel 6 zu öffnen. 🔐
              </p>

              <form id="chapter05KeyForm" class="chapter-05-key-form">
                <input
                  id="chapter05KeyInput"
                  class="chapter-05-key-input"
                  type="text"
                  autocomplete="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  placeholder="Schlüssel eingeben..."
                >
                <button class="primary-button" type="submit">Kapitel 6 freischalten</button>
              </form>

              <p id="chapter05KeyFeedback" class="chapter-05-feedback" aria-live="polite"></p>
            </div>
          </div>
        </section>
      </article>
    `;

    const panel = ctx.root.querySelector("#chapter05BombPanel");
    const status = ctx.root.querySelector("#chapter05Status");
    const timerEl = ctx.root.querySelector("#chapter05Timer");
    const sequenceEl = ctx.root.querySelector("#chapter05Sequence");
    const screenText = ctx.root.querySelector("#chapter05ScreenText");
    const feedback = ctx.root.querySelector("#chapter05Feedback");
    const explosion = ctx.root.querySelector("#chapter05Explosion");
    const success = ctx.root.querySelector("#chapter05Success");
    const wireButtons = [...ctx.root.querySelectorAll(".chapter-05-wire")];

    function formatTime(total) {
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function renderTime() {
      timerEl.textContent = formatTime(secondsLeft);
      timerEl.classList.toggle("is-low", secondsLeft <= 30);
    }

    function startTimer() {
      clearInterval(timer);
      renderTime();

      timer = window.setInterval(() => {
        if (resetting || defused) return;

        secondsLeft--;
        renderTime();

        if (secondsLeft <= 0) {
          clearInterval(timer);
          triggerReset("ZEIT ABGELAUFEN");
        }
      }, 1000);
    }

    function resetWires() {
      step = 0;
      secondsLeft = START_SECONDS;
      sequenceEl.textContent = "0 / 6";
      screenText.textContent = "WARTE AUF EINGABE";
      status.textContent = "SCHARF";
      panel.classList.remove("is-alarm");

      wireButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove("is-cut", "is-wrong");
      });

      feedback.textContent = "System zurückgesetzt. Versuch es nochmal. ❤️";
      feedback.className = "chapter-05-feedback";
      resetting = false;
      startTimer();
    }

    function triggerReset(reason) {
      if (resetting || defused) return;
      resetting = true;
      clearInterval(timer);

      status.textContent = "FEHLER";
      screenText.textContent = reason;
      feedback.textContent = "⚠️ FEHLERHAFTE VERBINDUNG";
      feedback.className = "chapter-05-feedback is-error";
      panel.classList.add("is-alarm");

      wireButtons.forEach(button => button.disabled = true);

      explosion.classList.remove("hidden", "explode");
      void explosion.offsetWidth;
      explosion.classList.add("explode");

      window.setTimeout(() => {
        explosion.classList.add("hidden");
        resetWires();
      }, 1700);
    }

    function cutWire(button) {
      if (resetting || defused || button.classList.contains("is-cut")) return;

      const id = button.dataset.wire;
      const expected = solution[step];

      if (id !== expected) {
        button.classList.add("is-wrong");
        triggerReset("FALSCHE VERBINDUNG");
        return;
      }

      button.classList.add("is-cut");
      button.disabled = true;
      step++;

      sequenceEl.textContent = `${step} / ${solution.length}`;
      screenText.textContent = step < solution.length
        ? "VERBINDUNG GETRENNT"
        : "SEQUENZ VOLLSTÄNDIG";

      feedback.textContent = step < solution.length
        ? `Kabel ${step} korrekt getrennt. ✂️`
        : "Alle Verbindungen getrennt…";
      feedback.className = "chapter-05-feedback is-good";

      if (step === solution.length) {
        defuse();
      }
    }

    function defuse() {
      defused = true;
      clearInterval(timer);

      status.textContent = "SICHER";
      screenText.textContent = "SYSTEM ENTSCHÄRFT";
      panel.classList.add("is-defused");

      ctx.completeChapter();
      ctx.unlockGift(GIFT_NUMBER);

      window.setTimeout(() => {
        panel.classList.add("chapter-05-panel-out");

        window.setTimeout(() => {
          panel.classList.add("hidden");
          success.classList.remove("hidden");
          success.classList.add("chapter-05-success-in");
          success.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 550);
      }, 950);
    }

    wireButtons.forEach(button => {
      button.addEventListener("click", () => cutWire(button));
    });

    const normalize = value =>
      String(value ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

    const keyForm = ctx.root.querySelector("#chapter05KeyForm");
    const keyInput = ctx.root.querySelector("#chapter05KeyInput");
    const keyFeedback = ctx.root.querySelector("#chapter05KeyFeedback");

    keyForm.addEventListener("submit", event => {
      event.preventDefault();

      if (normalize(keyInput.value) !== normalize(UNLOCK_CODE)) {
        keyFeedback.textContent = "Dieser Schlüssel passt noch nicht. 🔒";
        keyFeedback.className = "chapter-05-feedback is-error";
        keyInput.classList.remove("shake");
        void keyInput.offsetWidth;
        keyInput.classList.add("shake");
        keyInput.select();
        return;
      }

      keyFeedback.textContent = "Schlüssel akzeptiert. Kapitel 6 ist offen. 🔓";
      keyFeedback.className = "chapter-05-feedback is-good";
      keyInput.disabled = true;
      keyForm.querySelector("button").disabled = true;

      ctx.registerKey(UNLOCK_CODE);
      ctx.unlockNext();

      window.setTimeout(() => {
        ctx.showToast("Kapitel 6 wurde freigeschaltet ❤️");
      }, 250);
    });

    if (ctx.debug) {
      const debugBox = document.createElement("div");
      debugBox.className = "chapter-05-debug";
      debugBox.innerHTML = `
        <strong>Debug:</strong>
        Schnittfolge: Blau → Grün → Gelb → Rosa → Rot → Weiß · Kabelpositionen werden bei jedem Laden gemischt · Geschenk 6 · Schlüssel: BOMBE
      `;
      ctx.root.querySelector(".chapter-05-game").appendChild(debugBox);
    }

    startTimer();

    // Stoppt den Timer, wenn das Kapitel verlassen wird.
    this._cleanup = () => clearInterval(timer);
  },

  unmount() {
    if (this._cleanup) this._cleanup();
  }
};
