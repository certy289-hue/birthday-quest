window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[9] = {
  mount(ctx) {
    let finished = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-09">
        <section class="c9-intro" id="c9Intro" aria-live="polite">
          <div class="c9-intro-line c9-i1">8 Kapitel.</div>
          <div class="c9-intro-line c9-i2">8 Rätsel.</div>
          <div class="c9-intro-line c9-i3">8 Geschenke.</div>
          <div class="c9-intro-line c9-i4">Eine Sache fehlt noch. ❤️</div>
        </section>

        <section class="c9-main hidden" id="c9Main">
          <header class="chapter-header c9-header">
            <span class="chapter-kicker">Kapitel 09</span>
            <h2>Für dich.</h2>
            <p>Kein Rätsel mehr. Kein Code. Nur noch eine letzte Sache. ❤️</p>
          </header>

          <button class="c9-envelope-wrap" id="c9Envelope" type="button" aria-label="Briefumschlag öffnen">
            <div class="c9-envelope">
              <div class="c9-letter-preview">
                <span>Für dich</span>
                <small>❤️</small>
              </div>
              <div class="c9-envelope-back"></div>
              <div class="c9-envelope-paper"></div>
              <div class="c9-envelope-front"></div>
              <div class="c9-envelope-flap"></div>
              <div class="c9-seal">♥</div>
            </div>
            <span class="c9-tap">Zum Öffnen tippen</span>
          </button>

          <section class="c9-card hidden" id="c9Card">
            <div class="c9-heart">♥</div>
            <h3>Fast geschafft.</h3>
            <p>
              Das letzte Geschenk kann dir keine Website geben.
            </p>
            <p class="c9-soft">
              Keine Antwort. Kein Code. Kein Rätsel.
            </p>

            <div class="c9-gift-box" aria-hidden="true">
              <div class="c9-gift-lid"></div>
              <div class="c9-gift-body"></div>
              <div class="c9-gift-ribbon-v"></div>
              <div class="c9-gift-ribbon-h"></div>
            </div>

            <div class="c9-gift-number">
              <span>ÖFFNE</span>
              <strong>GESCHENK NR. 5</strong>
            </div>

            <button class="primary-button c9-found" id="c9Found" type="button">
              Ich habe ihn gefunden ❤️
            </button>
          </section>

          <section class="c9-finale hidden" id="c9Finale">
            <div class="c9-confetti" aria-hidden="true">
              <i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i>
            </div>
            <div class="c9-nine">9 <span>/</span> 9</div>
            <div class="c9-completed">BIRTHDAY QUEST COMPLETED ✓</div>
            <h3>Alles Gute zum Geburtstag, Baby. ❤️</h3>
            <p>
              Ich hoffe, du hattest genauso viel Spaß beim Lösen,<br>
              wie ich beim Erstellen hatte.
            </p>
            <div class="c9-final-heart">♥</div>
          </section>
        </section>
      </article>
    `;

    const intro = ctx.root.querySelector("#c9Intro");
    const main = ctx.root.querySelector("#c9Main");
    const envelope = ctx.root.querySelector("#c9Envelope");
    const card = ctx.root.querySelector("#c9Card");
    const found = ctx.root.querySelector("#c9Found");
    const finale = ctx.root.querySelector("#c9Finale");

    const introTimer = window.setTimeout(() => {
      intro.classList.add("c9-intro-out");
      window.setTimeout(() => {
        intro.classList.add("hidden");
        main.classList.remove("hidden");
        main.classList.add("c9-main-in");
      }, 650);
    }, 4700);

    envelope.addEventListener("click", () => {
      if (envelope.classList.contains("opened")) return;
      envelope.classList.add("opened");
      window.setTimeout(() => {
        envelope.classList.add("hidden");
        card.classList.remove("hidden");
        card.classList.add("c9-card-in");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1250);
    });

    found.addEventListener("click", () => {
      if (finished) return;
      finished = true;
      ctx.completeChapter();
      card.classList.add("c9-card-out");
      window.setTimeout(() => {
        card.classList.add("hidden");
        finale.classList.remove("hidden");
        finale.classList.add("c9-finale-in");
        finale.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    });

    this._cleanup = () => window.clearTimeout(introTimer);
  },

  unmount() {
    this._cleanup?.();
    this._cleanup = null;
  }
};
