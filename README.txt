BIRTHDAY QUEST – GRUNDGERÜST MIT 9 KAPITELN

Enthalten:
- 9 komplett getrennte Kapitel
- pro Kapitel eigene JS-Datei
- pro Kapitel eigene CSS-Datei
- Fortschritt über localStorage
- standardmäßig nur Kapitel 1 freigeschaltet
- Debug/Testmodus

DEBUG:
Online einfach ?debug=1 an die URL hängen.
Beispiel:
https://deine-seite.github.io/projekt/?debug=1

Im Debugmodus:
- alle Kapitel sind anklickbar
- Kapitel können testweise abgeschlossen werden
- nächste Kapitel können manuell freigeschaltet werden
- Fortschritt kann zurückgesetzt werden

WICHTIG:
Die endgültigen Geschenknummern und Unlock-Codes sind absichtlich noch NICHT eingetragen.
Die kommen später nur in data/game-data.js.

Dateien:
app.js                  = Grundsystem
data/game-data.js       = zentrale Kapitel-/Geschenk-Daten
chapters/chapter-01.js  = nur Kapitel 1
styles/chapter-01.css   = nur Design Kapitel 1
... usw. bis Kapitel 9
