window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[7] = {
  mount(ctx) {
    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-07">
        <header class="chapter-header">
          <span class="chapter-kicker">Kapitel 07</span>
          <h2>Noch geheim</h2>
          <p>
            Dieser Bereich ist absichtlich noch ein Platzhalter.
            Alles, was später zu Kapitel 7 gehört, bleibt in
            <strong>chapters/chapter-07.js</strong> und
            <strong>styles/chapter-07.css</strong>.
          </p>
        </header>

        <div class="chapter-placeholder">
          <div class="chapter-placeholder-icon">🧩</div>
          <h3>Kapitel 7 wartet auf sein Rätsel</h3>
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
              Kapitel 8 testweise freischalten
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
