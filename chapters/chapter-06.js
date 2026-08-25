window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[6] = {
  mount(ctx) {
    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-06">
        <header class="chapter-header">
          <span class="chapter-kicker">Kapitel 06</span>
          <h2>Noch geheim</h2>
          <p>
            Dieser Bereich ist absichtlich noch ein Platzhalter.
            Alles, was später zu Kapitel 6 gehört, bleibt in
            <strong>chapters/chapter-06.js</strong> und
            <strong>styles/chapter-06.css</strong>.
          </p>
        </header>

        <div class="chapter-placeholder">
          <div class="chapter-placeholder-icon">🧩</div>
          <h3>Kapitel 6 wartet auf sein Rätsel</h3>
          <p>
            Das Grundsystem funktioniert bereits. Dieses Kapitel können wir
            unabhängig von allen anderen gestalten und später jederzeit austauschen.
          </p>
        </div>

        ${ctx.debug ? `
          <div class="debug-controls">
            <button class="primary-button" data-debug-complete type="button">
              Kapitel testweise abschließen
            </button>
            
            <button class="ghost-button" data-debug-next type="button">
              Kapitel 7 testweise freischalten
            </button>
          </div>
        ` : ""}
      </article>
    `;

    if (ctx.debug) {
      ctx.root.querySelector("[data-debug-complete]")?.addEventListener("click", ctx.completeChapter);
      ctx.root.querySelector("[data-debug-next]")?.addEventListener("click", ctx.unlockNext);
    }
  },

  unmount() {
    // Später: Timer, Sounds oder Listener dieses Kapitels hier stoppen.
  }
};
