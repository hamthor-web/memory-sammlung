# Memory-Sammlung – Wunderwesen: Spielakte und Master-Nachtrag

Stand: 09.11.2026 · Spiel „Zwei Wörter, eine Sache“ (auch „2 Wörter – ein Ding“, „1 Sache, 2 Bezeichnungen“).

## Bestätigter Ablauf

Ein vollständig beendeter Einzelspiel-Durchgang führt zur vorhandenen Abschlussanimation. Anschließend wird zufällig eine von fünf Einladungen angezeigt. „Will ich sehen“ öffnet die Lichtung und fügt genau ein neues Wunderwesen hinzu, unabhängig von der Paarzahl. Bereits gesammelte Wesen sind sofort sichtbar. Nur das neu hinzugefügte Wesen fliegt kurz ein (eine Sekunde nach dem Laden seines Bildes) und zeigt anschließend seine Bewegung am Platz. Der Weiter-Button bleibt erreichbar; es muss kein erneuter Aufbau aller bisherigen Wesen abgewartet werden.

Die fünf Einladungen:

- Schau dir an, was auf der Lichtung erscheint. Bist du schon auf das nächste Wesen gespannt?
- Wer wartet wohl heute auf deiner Lichtung auf dich?
- Ein neues Wunderwesen möchte bei dir einziehen. Möchtest du es kennenlernen?
- Auf deiner Lichtung funkelt etwas. Wer könnte sich dahinter verstecken?
- Welches Wesen kommt als Nächstes zu deiner Sammlung dazu?

Die unmittelbar vorherige Frage wird beim nächsten Abschluss nicht erneut ausgewählt. Nach bereits abgeholter Belohnung derselben Runde heißt der Button „Meine Lichtung ansehen“ und vergibt kein weiteres Wesen. Nach zehn Wesen ist die Lichtung vollständig und kann weiterhin besucht werden. Es wird nichts zurückgesetzt.

## Gestaltung und Interaktion

Die genehmigten Originaldateien der Vorschau wurden unverändert übernommen: zehn Wesen sowie Waldhintergrund. Insbesondere die korrigierten Ausschnitte bei Knuff, Mo, Stella, Pilz und Schmetterling bleiben erhalten. Drache, Fuchs und Pilz werden bei der Begrüßung sanft breiter und federn zurück. Knuff dreht sich spiralig um seine Mitte. Beim Drüberfahren, Antippen oder per Enter/Leertaste erscheinen Name und lokale Begrüßung mit Funkeln erneut; der Einflug wird nicht wiederholt.

Im Menü steht „Meine Lichtung ansehen“. Dort gibt es voneinander unabhängige Regler für Bild- und Schriftgröße. Schmale und breite Bildschirme nutzen unterschiedliche Plätze für die Wesen; vergrößerte Bilder bleiben innerhalb der Bildfläche scrollbar. Die Systemeinstellung für reduzierte Bewegung wird berücksichtigt.

Der Zweispielermodus bleibt bei den gefundenen Paaren beider Kinder; er vergibt keine Einzelspieler-Wunderwesen.

## Speicherung pro Kind

Die Sammlung gehört zur festen ID des ausgewählten Kinderprofils, nicht zu frei eingegebenen Spielernamen. Im vorhandenen Profilspeicher liegt ein kleiner Aufbauplan mit Zähler und vergebenen Runden-IDs; die Bilddateien müssen nicht für jedes Kind mehrfach gespeichert werden. Jede Runden-ID vergibt höchstens ein Wesen, auch nach Neuladen oder wiederholtem Öffnen. Unvollständige Runden vergeben kein Wesen. Eine abgeschlossene Einzelrunde mit noch offener Einladung bleibt fortsetzbar.

Die bestehende Sicherungs-/Wiederherstellungsfunktion umfasst auch die Lichtung. Speicherung erfolgt lokal im jeweiligen Browser/App-Speicher; ein automatischer Abgleich zwischen Geräten ist damit nicht verbunden. Bei fehlgeschlagenem Speichern wird kein neues Wesen als gesichert ausgegeben. Beschädigte vorhandene Daten werden nicht überschrieben.

## Technischer Einbau

Repository `hamthor-web/memory-sammlung`, Einstieg `synonymmemory/index.html`. Neue Dateien: `wonder-store.js`, `wonder-ui.js`, `wonder-clearing.html`, elf Originalbilder in `synonymmemory/wonder-assets/`. Die Darstellung ist als lokale Seite eingebunden; gespeicherter Fortschritt bleibt im Elternspiel. Das Einblenden der Lichtung erzeugt keinen eigenen zusätzlichen Browser-Zurückschritt. Produktionsinventar und Offline-Prüfsummen wurden erweitert. Andere Spiele, ihre Grafiken, Profile und Fortschritte bleiben erhalten.

## Nachweise und Masterstatus

- Speichertests bestanden: Profiltrennung, einmalige Vergabe pro Runde, Grenze zehn, Erhalt anderer Fortschritte, Sicherungsexport sowie Schreibfehler und beschädigte Daten.
- Browserintegration bestanden: tatsächliche komplette Sechs-Paare-Runden, vorhandene Abschlussanimation mit anschließendem Einladungsdialog, Fortsetzen vor und nach Abholung, eine neue Figur je Folgerunde, keine doppelte Vergabe, nur lokale Wiederholung und Zweispieler-Paaranzeige.
- Darstellung/Zoom geprüft bei 393×852, 852×393, 768×1024 und 1024×768 CSS-Pixeln mit vollständiger Sammlung; Bildzoom 170 %, Schriftzoom 150 %, gegenseitige Unabhängigkeit und keine horizontale Überbreite der Spielseite geprüft.
- Gemeinsame Profil-, Backup-, Fortschritts-, Produktionspaket-, PWA- und sichere Aktualisierungstests bestanden. Alle elf übertragenen Bilddateien wurden über ihre Git-Hashes mit den geprüften lokalen Originalen abgeglichen.
- Reale Smartphone-/Tablet-Abnahme und die native Android-Zurückgeste bleiben ergänzend offen. Kein neues APK/AAB gebaut.

**Masterstatus:** Die Wunderwesen-Belohnung ist vom separaten Entwurf in das Synonym-Memory integriert. Genehmigte Gestaltung und lokale Animationen übernommen; kindbezogene Speicherung und Wiederaufnahme ergänzt. Keine automatische Übernahme in andere Spiele.

Spiel: https://hamthor-web.github.io/memory-sammlung/synonymmemory/index.html
Sammlung: https://hamthor-web.github.io/memory-sammlung/
