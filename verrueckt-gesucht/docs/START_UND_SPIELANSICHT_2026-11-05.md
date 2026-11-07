# Verrückt gesucht! – Nachtrag zur Spielakte
Datum: 5. November 2026
Bereich: Startbildschirm, Spielansicht, mobile Lesbarkeit

## Bestätigter Änderungsauftrag
- Startbildschirm im Handy-Hochformat: Einführung mit den drei Beispielbildern oberhalb des Auswahlbereichs statt zwei enger nebeneinander liegender Spalten.
- Spielfläche: Aufgaben und Bildkarten auf hohen Displays mittiger bzw. über die verfügbare Höhe verteilt, ohne Karten bei kleinen Displays abzuschneiden.
- Leseaufgabe: Schrift größer und mit direkt sichtbaren A− / 100 % / A+ Schaltflächen in der Fragebox zoombar; Einstellung bleibt lokal auf dem Gerät erhalten.
- Spielmechanik, Lernkarten, Animationen und gespeicherte Fortschritte bleiben unverändert.

## Technischer Stand
In `main` umgesetzt:
- `style.css`: einspaltiger Startbereich für Hochformat bis 950px, sichtbar bleibende Beispielbilder, responsives Höhenlayout des Spiels, Schriftgröße und Zoombedienung.
- `index.html`: drei barrierefrei beschriftete Schriftgrößenschalter, aktualisierte CSS/JS-Versionen.
- `app.js`: Textgröße in Stufen von 85 bis 160 Prozent, dauerhafte Speicherung in `localStorage`, Rückstellung auf 100 Prozent.
- `sw.js`: Offline-Version `2026-11-05-mobile-layout-text-zoom-1` für Update der installierten Web-App.

## Kontrolle und offen
Quellcode, Dateiverweise und JavaScript-Syntax im Repository geprüft. Darstellungsprüfung auf realem Handy/Tablet (Hoch-/Querformat, 6/9/12 Karten, verschiedene Schriftgrößen) steht noch aus. Die zentrale Projektverwaltung/Masterübersicht wurde nicht automatisch überschrieben; dieser Nachtrag ist für die Ablage bestimmt.

## Nachprüfung und Korrektur, 05.11.2026
Ein aktueller Handy-Screenshot zeigte trotz des vorherigen CSS-Updates weiterhin zwei Spalten. Deshalb wurde die Hochformat-Regel verstärkt und zusätzlich direkt in `index.html` aufgenommen (bis 1200 CSS-Pixel sowie dynamische Handy-Erkennung in `app.js`). Die Startseite soll jetzt Einführung und Beispielbilder oberhalb der Spielauswahl anzeigen.

Für die Navigation wurde der Browser-/PWA-Verlauf in `app.js` um interne Ansichten ergänzt. Browser- oder Android-Zurück führt aus Spielansichten zur vorherigen App-Ansicht; zusätzlich ist ein deutliches Wischen nach rechts im Inhalt als Zurückgeste vorgesehen. Einschränkung: Vom Android-Betriebssystem reservierte Randgesten lassen sich in einer PWA nicht zuverlässig übersteuern. Auf der Startseite gibt es keinen vorherigen internen Bildschirm.

`sw.js` erhielt eine neue Version und lädt App-JavaScript sowie CSS bei bestehender Netzverbindung bevorzugt frisch, mit Offline-Rückfall auf den Cache. Die Spielaufgaben, Bilder, Belohnungen und Speicherstände sind unverändert. Ein neuer Gerätetest der Hochformatumstellung und Gestennavigation ist noch erforderlich.

## Ergänzung: Startschrift und wieder funktionsfähiger Spielstart – 05.11.2026
Auf Nutzerwunsch steht nun auch auf der Startseite neben „So möchtest du spielen“ eine eigene Schriftgrößensteuerung mit A−, Prozentanzeige und A+. Die Einstellung wird unabhängig von der Aufgabenschrift im Gerät gespeichert. Betroffen sind `index.html`, `style.css` und `app.js`.

Der zuvor als wirkungslos gemeldete „Los geht's“-Button wurde mit einer gesicherten Startfunktion und sichtbarer Fehlermeldung versehen. Im isolierten JavaScript-Funktionstest wurden Originalmodule geladen und ein Klick simuliert; die erste Runde mit sechs Bildkarten wurde erfolgreich erstellt. Ein realer Browser-/Gerätetest ist weiterhin erforderlich, insbesondere für zuvor zwischengespeicherte Versionen.

`sw.js`: Offline-Version auf `2026-11-05-setup-font-start-repair-1` erhöht. Die ursprünglichen Spielinhalte und gespeicherten Fortschritte bleiben unangetastet.

## 05.11.2026 – Spielstart auf dem Gerät weiterhin nicht ausführbar (noch nicht abschließend bestätigt)
Nach Rückmeldung, dass der Startknopf weiterhin nicht reagiert, wurde die bisherige syntaktische bzw. simulierte Prüfung ausdrücklich als unzureichend eingeordnet. Zur Ausschaltung alter zwischengespeicherter App-Dateien werden die JS/CSS-Dateien zusätzlich mit eindeutigen neuen Dateinamen ausgeliefert: `app-release-20261105-b.js` und `style-release-20261105-b.css`. Die Startseite bindet diese Dateien direkt ein. Die neue Service-Worker-Version `2026-11-05-start-release-b-2` nimmt sie in den Offline-Cache auf.

Frühe JavaScript- und Ladefehler sowie Fälle, in denen kein Start-Handler registriert wurde oder der Klick nicht zur Spielansicht führt, werden jetzt sichtbar auf der Startseite angezeigt. Alle vorhandenen Bilder, Inhalte und gespeicherten Spielstände bleiben erhalten.

**Status: Quellen aktualisiert, praktische Prüfung auf dem betroffenen Gerät weiterhin offen.** Ursache kann ohne Fehleranzeige aus der echten Laufzeitumgebung nicht als endgültig geklärt gelten.

## 05.11.2026 – Ursache des scheinbar nicht funktionierenden Spielstarts gefunden

Die Nutzerin stellte fest, dass die Spielansicht tatsächlich geöffnet wurde, während die Einführung darüber weiter sichtbar blieb. Ursache war die nachträglich eingefügte Porträt-Regel `.setup{display:grid!important}`, die das standardmäßige `[hidden]{display:none!important}` wegen Kaskaden-/Spezifitätskonflikten überstimmte. Damit blieb der Startbereich trotz `hidden` sichtbar.

Technische Korrektur:
- `#setup[hidden], #play[hidden], #gallery[hidden], #finish[hidden]` mit explizitem `display:none!important` in Start-HTML und neuer CSS-Datei.
- Start, Spiel, Galerie und Ergebnis werden als getrennte Ansichten behandelt. Während Spiel und Galerie werden Kopfbereich und Fußzeile ausgeblendet.
- `← Zur Auswahl` ist als eigener, erreichbarer Button in der Spielfläche eingebaut.
- Galerie erhält bildschirmfüllendes Layout mit vertikal mittiger Bildauswahl; die bereits vorhandene Vollbild-Bildbetrachtung bleibt erhalten.
- Neue veröffentlichte Assets `app-release-20261105-c.js`, `style-release-20261105-c.css` und neue SW-Version `2026-11-05-screens-exclusive-c-1`.

Die Bilder und Spielmechanik bleiben unverändert, Spielstände bleiben erhalten. Quellverweise und JavaScript-Syntax im Repo geprüft; reale Geräteabnahme noch offen.

## 05.11.2026 – Bildschirmwechsel robust gemacht, ausführlicher Test

Die Nutzerin meldete erneut, dass Start- und Galerieansicht unterhalb der Startseite erscheinen und Scrollen nach unten erfordern. Die vorige Korrektur mittels `hidden` und hochspezifischem CSS genügte auf dem tatsächlichen Gerät nicht.

**Umgesetzte Reparatur (Release E):**
- Die zentrale Funktion `show()` setzt für jede inaktive Seite **sowohl `hidden` als auch ein Inline-`display:none!important`**. Für die aktive Seite wird dieses Inline-Display entfernt. Damit kann auch eine ältere Hochformat-CSS-Regel das Verbergen nicht unterlaufen.
- `body.dataset.screen` führt die Bildschirmzustände `setup`, `play`, `gallery`, `finish`.
- Beim Öffnen und nach dem nächsten Animationsframe wird die Scrollposition auf 0 zurückgestellt.
- Spiel und Galerie öffnen jeweils den eigenen Vollbildbereich ohne oberen Startkopf und Fußzeile; das Spiel nutzt die Höhe vertikal mittig.
- Die Galerie zeigt nur **tatsächlich fertig erspielte** Bilder, statt 11 leere Platzhalter anzuzeigen. Sind noch keine vorhanden, erscheint ein verständlicher Hinweis. Mit wenigen Bildern wird die Auswahl in der Bildschirmmitte angezeigt; bei vielen ist normales Scrollen möglich.
- Neue eindeutig benannte Ressourcen `app-release-20261105-e.js` und `style-release-20261105-e.css`, eingebunden in `index.html`. Der Offline-Service-Worker trägt `2026-11-05-exclusive-screens-tested-e-1`.
- Verbindlich: Keine Spiele, Bilddaten, Fortschrittsbilder oder Spielstände gelöscht.

**Testumfang:** Die echten JavaScript-Module einschließlich `app-release-20261105-e.js` wurden in einem isolierten DOM-Funktionstest ausgeführt. Durchlaufen: Startbildschirm, Spielstart mit 6/9/12 Karten, zurück zur Auswahl nach jeder Runde, Galerie aufrufen und zurück. In allen neun Zuständen wurde genau eine aktive Ansicht geprüft, alle inaktiven hatten `hidden` und Inline-`display:none!important`. Die drei Rundengrößen erzeugten 6, 9 und 12 Karten. Ein separater Chromium-Browsertest mit repräsentativen HTML-/CSS-Layouts wurde bei 360×780, 390×844, 430×932, 768×1024, 1024×768 und 1280×800 durchgeführt: Sichtbarkeit, obere Scrollposition, Ansichtwechsel und Galerie-Einstieg bestanden.

**Grenze:** Mangels direktem Browserzugriff auf GitHub Pages konnte der komplette veröffentlichte Stand einschließlich Originalbilddateien und Service-Worker-Verhalten auf dem konkreten Android-Gerät nicht getestet werden. Der Chromium-Test verwendete ein reduziertes Layoutmodell; er ersetzt keine Geräteabnahme. Deshalb keine Behauptung einer vollständig bestandenen Live-Geräteprüfung.

## 05.11.2026 – Würstchen-Bildbuttons (bestätigte Vorlagen)

Die Nutzerin hat zwei 1200×200-Pixel-Bildvorlagen geliefert und deren Einsatz ausdrücklich festgelegt:
- Vorlage mit links stehendem Würstchen: `Los geht’s` auf der Startseite.
- Vorlage mit rechts gehendem Würstchen: `Weiter` unter dem großen Fortschrittsanimationsbild.

Umgesetzt in `main` ohne Änderung der Spielfunktionen:
- Originalvorlagen als leicht komprimierte, eigenständige SVG-Dateien mit eingebettetem WebP im Repository: `assets/buttons/los-gehts-v1.svg`, `assets/buttons/weiter-v1.svg`. Die übrigen Bilder bleiben unangetastet.
- Startknopf `#start` und Fortschrittsdialog-Knopf `#treeContinue` als reguläre interaktive Buttons mit jeweiliger Hintergrundgrafik und gut lesbarer textlicher Beschriftung.
- Neue CSS-/JS-Release-Dateien: `style-release-20261105-f.css`, `app-release-20261105-f.js`; HTML und Service-Worker Version `2026-11-05-sausage-buttons-f-1` aktualisiert.
- Beschriftung `Weiter` wird bei Spielstart nicht mehr durch `Weiter →` ersetzt.

**Prüfung:** Beide eingebetteten Bilddateien mit gültigem Base64/RIFF-WebP-Header und Originalformatverhältnis 6:1 im Repository bestätigt. HTML-/CSS-Verweise und JS-Syntax kontrolliert. Die Button-Grafiken wurden in einem lokalen Chromium-Darstellungstest mit 390-Pixel-Handybreite und Beschriftung visualisiert. Kein Test des vollständigen Live-GitHub-Pages-Spiels auf dem Nutzergerät; diese Abnahme bleibt offen.
