window.BIRTHDAY_CHAPTERS = window.BIRTHDAY_CHAPTERS || {};

window.BIRTHDAY_CHAPTERS[7] = {
  mount(ctx) {
    const GIFT_NUMBER = 2;
    const UNLOCK_CODE = "HANDY";
    const PIN = "4729";
    let pin = "";
    let clockTaps = 0;
    let trailStage = 0; // 0 gift unopened, 1 photos, 2 notes, 3 messages, 4 restored
    let dark = false;

    ctx.root.innerHTML = `
      <article class="chapter-shell chapter-07">
        <header class="chapter-header chapter-07-intro">
          <span class="chapter-kicker">Kapitel 07</span>
          <h2>Unbekanntes Gerät</h2>
          <p>Ich habe etwas gefunden, das dir weiterhelfen könnte. Es gibt nur ein kleines Problem … 📱</p>
        </header>

        <section class="c7-stage">
          <div id="c7Phone" class="c7-phone">
            <div class="c7-island"></div>
            <div class="c7-screen">
              <section id="c7Lock" class="c7-lock">
                <button id="c7Clock" class="c7-clock" type="button">09:41</button>
                <div class="c7-lockdate">Donnerstag, 29. August</div>
                <div class="c7-notifications">
                  <div class="c7-notification"><b>📅 Kalender</b><span>Termin verschoben auf den 4.</span></div>
                  <div class="c7-notification"><b>💬 Nachrichten</b><span>Von den 9 Stück sind noch 7 übrig.</span></div>
                  <div class="c7-notification"><b>📦 Lieferung</b><span>Sendung 2 von 6 wurde zugestellt.</span></div>
                  <div class="c7-notification"><b>🔋 Batterie</b><span>Noch 9 % verbleibend.</span></div>
                  <div class="c7-notification c7-note"><b>📝 Notizen</b><span>Kalender → Nachrichten → Lieferung → Batterie</span></div>
                </div>
                <button id="c7UnlockStart" class="c7-lock-button" type="button">Zum Entsperren tippen</button>
              </section>

              <section id="c7Pin" class="c7-pin hidden">
                <div class="c7-pin-lock">🔒</div>
                <h3>Code eingeben</h3>
                <div id="c7Dots" class="c7-dots">${[0,1,2,3].map(()=>'<i></i>').join('')}</div>
                <div class="c7-keypad">
                  ${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-num="${n}"><b>${n}</b></button>`).join('')}
                  <span></span><button type="button" data-num="0"><b>0</b></button><button id="c7Delete" type="button" class="c7-delete">⌫</button>
                </div>
                <p id="c7PinFeedback" class="c7-pin-feedback"></p>
                <button id="c7BackLock" class="c7-text-button" type="button">Benachrichtigungen ansehen</button>
              </section>

              <section id="c7Home" class="c7-home hidden">
                <div class="c7-status"><span id="c7HomeClock">09:41</span><span>●●● ᯤ 🔋</span></div>
                <div class="c7-appgrid">
                  ${app('photos','📷','Fotos')}${app('messages','💬','Nachrichten')}${app('notes','📝','Notizen')}${app('maps','🗺️','Karten')}
                  ${app('weather','🌤️','Wetter')}${app('music','🎵','Musik')}${app('settings','⚙️','Einstellungen')}${app('gift','🎁','???')}
                </div>
                <div class="c7-dock">${app('phone','📞','')}${app('browser','🌐','')}${app('camera','📸','')}</div>
              </section>

              <section id="c7App" class="c7-app hidden">
                <div class="c7-appbar"><button id="c7HomeBtn" type="button">‹ Home</button><strong id="c7AppTitle"></strong><span></span></div>
                <div id="c7AppBody" class="c7-appbody"></div>
              </section>
            </div>
            <div class="c7-homebar"></div>
          </div>
          <p id="c7OutsideHint" class="c7-outside-hint">Vielleicht verraten dir die Benachrichtigungen den Code.</p>
        </section>

        <section id="c7Reveal" class="c7-reveal hidden">
          <div class="c7-reveal-check">✓</div><span>DATEI WIEDERHERGESTELLT</span>
          <h3>Du hast gefunden, wonach du gesucht hast. ❤️</h3>
          <div class="c7-gift-box" aria-hidden="true">
            <div class="c7-gift-lid"></div>
            <div class="c7-gift-body"></div>
            <div class="c7-gift-ribbon-v"></div>
            <div class="c7-gift-ribbon-h"></div>
          </div>
          <div class="c7-gift"><small>ÖFFNE</small><strong>GESCHENK NR. ${GIFT_NUMBER}</strong></div>
          <p>Finde den Schlüssel im Geschenk und gib ihn hier ein, um Kapitel 8 zu öffnen. 🔐</p>
          <form id="c7KeyForm" class="c7-keyform"><input id="c7Key" placeholder="Schlüssel eingeben..." autocomplete="off"><button class="primary-button">Kapitel 8 freischalten</button></form>
          <p id="c7KeyFeedback" class="c7-key-feedback"></p>
        </section>
      </article>`;

    function app(id, icon, label){ return `<button class="c7-appicon" type="button" data-app="${id}"><span>${icon}</span>${label ? `<small>${label}</small>`:''}</button>`; }
    const $ = s => ctx.root.querySelector(s);
    const phone = $('#c7Phone'), lock=$('#c7Lock'), pinView=$('#c7Pin'), home=$('#c7Home'), appView=$('#c7App');

    $('#c7Clock').addEventListener('click',()=>{ if(++clockTaps===5){ $('#c7OutsideHint').textContent='Hör auf da draufzudrücken. 😭'; clockTaps=0; }});
    $('#c7UnlockStart').addEventListener('click',()=>{ lock.classList.add('hidden'); pinView.classList.remove('hidden'); });
    $('#c7BackLock').addEventListener('click',()=>{ pinView.classList.add('hidden'); lock.classList.remove('hidden'); pin=''; drawDots(); });
    ctx.root.querySelectorAll('[data-num]').forEach(b=>b.addEventListener('click',()=>{ if(pin.length<4) pin+=b.dataset.num; drawDots(); if(pin.length===4) setTimeout(checkPin,120); }));
    $('#c7Delete').addEventListener('click',()=>{ pin=pin.slice(0,-1); drawDots(); });
    function drawDots(){ [...$('#c7Dots').children].forEach((d,i)=>d.classList.toggle('filled',i<pin.length)); }
    function checkPin(){
      if(pin===PIN){ $('.c7-pin-lock').textContent='🔓'; $('#c7PinFeedback').textContent='Entsperrt'; phone.classList.add('unlocking'); setTimeout(()=>{ pinView.classList.add('hidden'); home.classList.remove('hidden'); phone.classList.remove('unlocking'); },700); }
      else { $('#c7PinFeedback').textContent='Code falsch'; $('#c7Dots').classList.add('shake'); setTimeout(()=>$('#c7Dots').classList.remove('shake'),350); pin=''; setTimeout(drawDots,250); }
    }

    ctx.root.querySelectorAll('[data-app]').forEach(b=>b.addEventListener('click',()=>openApp(b.dataset.app)));
    $('#c7HomeBtn').addEventListener('click',()=>{ appView.classList.add('hidden'); home.classList.remove('hidden'); });

    function openApp(name){
      home.classList.add('hidden'); appView.classList.remove('hidden');
      const title=$('#c7AppTitle'), body=$('#c7AppBody');
      const pages={
        weather:['Wetter',`<div class="c7-weather">🌤️<b>17°</b><h3>Hannover</h3><p>Gefühlte Temperatur: keine Ahnung.</p></div>`],
        maps:['Karten',`<div class="c7-map">🗺️<div class="c7-pinmark">📍</div><b>Aktueller Standort</b><p>Irgendwo hier.</p></div>`],
        music:['Musik',`<div class="c7-music">🎵<div class="c7-album">💿</div><b>Absolute Meisterwerke</b><p>0 Titel · erstaunlich ruhig hier</p><button type="button" class="c7-fakeplay">▶</button></div>`],
        phone:['Telefon',`<div class="c7-empty">📞<h3>Keine Anrufe</h3><p>Zum Glück.</p></div>`],
        browser:['Browser',`<div class="c7-empty">🌐<h3>Keine Internetverbindung</h3><p>Praktisch, dass das Rätsel offline funktioniert.</p></div>`],
        camera:['Kamera',`<div class="c7-camera">📸<p>Bitte lächeln.</p><div>●</div></div>`]
      };
      if(pages[name]){ [title.textContent,body.innerHTML]=pages[name]; return; }
      if(name==='settings') return settings(title,body);
      if(name==='photos') return photos(title,body);
      if(name==='notes') return notes(title,body);
      if(name==='messages') return messages(title,body);
      if(name==='gift') return gift(title,body);
    }

    function settings(title,body){ title.textContent='Einstellungen'; body.innerHTML=`<div class="c7-settings"><h3>Einstellungen</h3><label><span>🌙 Dark Mode</span><input id="c7Dark" type="checkbox" ${dark?'checked':''}><i></i></label><label><span>✈️ Flugmodus</span><input type="checkbox"><i></i></label><label><span>🔊 Geräusche</span><input type="checkbox" checked><i></i></label></div>`; $('#c7Dark').addEventListener('change',e=>{ dark=e.target.checked; phone.classList.toggle('dark',dark); }); }
    function photos(title,body){
      title.textContent='Fotos';
      body.innerHTML=`<div class="c7-gallery"><h3>Fotos</h3>${['🌅','🌸','🐚','🎀','🌙','🔎'].map((x,i)=>`<button type="button" data-photo="${i}">${x}</button>`).join('')}</div><p class="c7-apphint">${trailStage===1?'Vielleicht ist ein Bild anders als die anderen …':''}</p>`;
      body.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.photo==='5' && trailStage===1){ trailStage=2; body.innerHTML=`<div class="c7-found">🔎<h3>Gut gefunden.</h3><p>Jetzt dorthin, <b>wo Worte bleiben.</b></p></div>`; } else { b.classList.add('photo-pop'); }}));
    }
    function notes(title,body){
      title.textContent='Notizen';
      body.innerHTML=`<div class="c7-notelist"><h3>Notizen</h3><button data-note="shop"><b>Einkaufsliste</b><span>Heute</span></button><button data-note="random"><b>Wichtige Gedanken</b><span>Gestern</span></button>${trailStage>=2?'<button data-note="found"><b>Für dich</b><span>Gerade eben</span></button>':''}</div>`;
      body.querySelectorAll('[data-note]').forEach(b=>b.addEventListener('click',()=>{
        if(b.dataset.note==='shop') body.innerHTML=`<div class="c7-paper"><h3>Einkaufsliste</h3><p>☐ Milch<br>☐ Brot<br>☐ Weltherrschaft<br>☑ Geschenk verstecken</p></div>`;
        if(b.dataset.note==='random') body.innerHTML=`<div class="c7-paper"><h3>Wichtige Gedanken</h3><p>Warum heißt es eigentlich Gebäude, wenn es schon gebaut ist?</p></div>`;
        if(b.dataset.note==='found'){ trailStage=Math.max(trailStage,3); body.innerHTML=`<div class="c7-found">📝<h3>Fast geschafft.</h3><p><b>Frag jemanden.</b></p></div>`; }
      }));
    }
    function messages(title,body){
      title.textContent='Nachrichten';
      body.innerHTML=`<div class="c7-chat"><div class="c7-contact">💬 Unbekannt</div><div class="bubble them">Hey.</div><div class="bubble them">Du suchst doch etwas, oder?</div>${trailStage>=3?'<div class="bubble them">Vielleicht solltest du nochmal bei <b>🎁</b> vorbeischauen.</div>':'<div class="bubble them">Ich hab gerade nichts für dich.</div>'}</div>`;
      if(trailStage===3) trailStage=4;
    }
    function gift(title,body){
      title.textContent='???';
      if(trailStage===0){ body.innerHTML=`<div class="c7-vault">🎁<h3>GESCHÜTZTE DATEI</h3><p>Datei beschädigt. Wiederherstellungshinweis:</p><blockquote>„Beginne dort, wo Erinnerungen gespeichert werden.“</blockquote><button id="c7BeginTrail" class="c7-system-btn" type="button">Wiederherstellung starten</button></div>`; $('#c7BeginTrail').addEventListener('click',()=>{ trailStage=1; body.innerHTML=`<div class="c7-found">📷<h3>Wiederherstellung gestartet</h3><p>Beginne dort, wo Erinnerungen gespeichert werden.</p></div>`; }); return; }
      if(trailStage<4){ body.innerHTML=`<div class="c7-vault">🔐<h3>DATEI NOCH BESCHÄDIGT</h3><p>Der Wiederherstellungspfad ist noch nicht vollständig.</p></div>`; return; }
      body.innerHTML=`<div class="c7-restore"><div class="c7-spinner"></div><h3>DATEI WIRD WIEDERHERGESTELLT</h3><div class="c7-restorebar"><i id="c7RestoreBar"></i></div><b id="c7Percent">0 %</b></div>`;
      let p=0; const t=setInterval(()=>{ p+=5; $('#c7RestoreBar').style.width=p+'%'; $('#c7Percent').textContent=p+' %'; if(p>=100){ clearInterval(t); setTimeout(showReveal,500); }},65);
    }
    function showReveal(){
      trailStage=5; phone.classList.add('phone-done'); ctx.completeChapter(); ctx.unlockGift(GIFT_NUMBER);
      setTimeout(()=>{ $('.c7-stage').classList.add('hidden'); $('#c7Reveal').classList.remove('hidden'); $('#c7Reveal').scrollIntoView({behavior:'smooth',block:'start'}); },500);
    }

    const normalize=v=>String(v||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'');
    $('#c7KeyForm').addEventListener('submit',e=>{ e.preventDefault(); const input=$('#c7Key'), fb=$('#c7KeyFeedback'); if(normalize(input.value)!==UNLOCK_CODE){ fb.textContent='Dieser Schlüssel passt noch nicht. 🔒'; fb.className='c7-key-feedback wrong'; input.classList.add('shake'); setTimeout(()=>input.classList.remove('shake'),350); return; } fb.textContent='Schlüssel akzeptiert. Kapitel 8 ist offen. 🔓'; fb.className='c7-key-feedback good'; input.disabled=true; e.currentTarget.querySelector('button').disabled=true; ctx.registerKey(UNLOCK_CODE); ctx.unlockNext(); ctx.showToast('Kapitel 8 wurde freigeschaltet ❤️'); });

    if(ctx.debug){ const d=document.createElement('div'); d.className='c7-debug'; d.textContent='Debug: PIN 4729 · Geschenk 2 · Schlüssel HANDY'; ctx.root.querySelector('.chapter-07').appendChild(d); }
  },
  unmount() {}
};
