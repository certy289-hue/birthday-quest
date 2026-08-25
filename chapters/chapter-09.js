window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[9] = {
  mount(ctx) {
    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-09">
        <header class="chapter-header">
          <span class="chapter-kicker">Kapitel 09</span>
          <h2>Für dich</h2>
          <p>
            Dieser Bereich ist absichtlich noch ein Platzhalter.
            Alles, was später zu Kapitel 9 gehört, bleibt in
            <strong>chapters/chapter-09.js</strong> und
            <strong>styles/chapter-09.css</strong>.
          </p>
        </header>

        <div class="chapter-placeholder">
          <div class="chapter-placeholder-icon">❤️</div>
          <h3>Kapitel 9 wartet auf sein Rätsel</h3>
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
