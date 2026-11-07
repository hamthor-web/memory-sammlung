# Memory-Sammlung – Zweiebenen-Buttons (07.11.2026)

**Repository:** `hamthor-web/memory-sammlung`  
**Offline-Cache:** v65

## Bestätigte Gestaltung
Auf der gemeinsamen Spielauswahl sind die beiden rechten Buttons als drei unabhängige Ebenen aufgebaut: flexible Papierfläche, Beschriftung und proportional skalierte Dekoration.

- **Ein Wort – zwei Bedeutungen:** Heikes neu hochgeladenes Kartenmotiv rechts, „Spiel öffnen“.
- **Verrückt gesucht!:** Heikes neu hochgeladenes Würstchen links, „Los geht’s“.
- Die beiden linken Schilder, Spielemechanik und Animationen bleiben unverändert.
- Unter 361 CSS-Pixeln ist eine einspaltige Anordnung vorgesehen, damit Beschriftungen und Motive erreichbar bleiben; sonst zwei Spalten.

## Umsetzung
- `index.html`: getrennte Bild- und Textebenen
- `menu-layered-buttons.css`: flexibler Papiergrund und proportionale Motive
- `assets/buttons/cards-overlay-standalone.svg` und `assets/buttons/wuerstchen-overlay-standalone.svg`: eigenständige transparente Motive
- `sw.js`: neuer Offline-Cache v65

## Tests und Grenzen
GitHub-Dateien und Verknüpfungen erneut gelesen; eingebettete Bilder lokal dekodiert und gerendert. Lokale Musteransichten bei 320/393/768/1024 CSS-Pixeln geprüft, anschließend schmalen 320px-Fall mit Einspaltenregel abgesichert. Vollständige visuelle Prüfung der tatsächlich veröffentlichten GitHub-Pages-Fassung und echte Smartphone-/Tablet-Tests stehen aus. Diese Änderung verändert keinen Master-Status.

Ältere Entwicklungsstände bleiben als GitHub-Historie erhalten.


## Nachtrag 07.11.2026 – Papierhoehe unabhaengig von Dekoration (v67)

Heike hat auf dem Handy festgestellt, dass die beiden neuen Papierflaechen rechts hoeher erscheinen als die Original-Papierflaechen links. Verbindliche Praezisierung: **Die Papierhoehe wird ausschliesslich nach den sichtbaren Papierflaechen der beiden linken Buttons bemessen**, nicht nach den aufgelegten Dekorationen. Die Klickflaeche darf hoeher bleiben. Karten (rechts oben) und Wuerstchen (rechts unten) duerfen oben/unten ueber die Papierflaeche hinausragen, muessen aber proportional bleiben.

In `menu-layered-buttons.css` liegen deshalb die Papierflaechen als eigene Pseudoelemente zentriert innerhalb einer weiterhin 95px hohen Tippflaeche. Sichtbare Papierhoehe: 56px auf schmalen Geraeten, 66px bei breiteren Formaten. Die beiden Dekorationsbilder bleiben unabhaengige Ebenen. Beide linken Buttons bleiben unveraendert. Offline-Cache in `sw.js`: v67.

Code und Cache-Inhalte auf GitHub gegengeprueft. Die optische Endabnahme am echten Handy/Tablet ist offen. Alte Versionen bleiben in der Git-Historie erhalten.


## Nachtrag – Kartenmotiv auch innerhalb von „Ein Wort – zwei Bedeutungen“ (07.11.2026, v68)

Heike bestätigt die Papierhöhe und die aufliegenden Figuren der gemeinsamen Startseite im Smartphone-Test als passend; Tablet-Test der Startseite steht weiterhin aus.

Neuer Auftrag: Auf den bereits gestalteten großen Papierschildern **innerhalb des Spiels „Ein Wort – zwei Bedeutungen“** rechts das Kartenmotiv als eigene, proportional skalierte Dekoration ergänzen. **Sämtliche bisherigen Breiten, Höhen, Abstände, Schriftgrößen und Zoomfunktionen bleiben unverändert.** Kleine Zoom- und Systembuttons werden nicht dekoriert.

Umgesetzt über eine ausschließlich auf das Wortmemory begrenzte CSS-Ergänzung in `button-schilder.css`. Vorhandene `banner-button banner-paper`-Schilder werden verwendet; die transparente Kartenillustration `assets/buttons/cards-overlay-standalone.svg` liegt rechts als nicht interaktive Bildebene über dem Schild. Keine Änderung an der großen, eingebetteten Spiel-HTML-Datei oder an der Spiellogik. Offline-Cache `v68` in `sw.js`.

GitHub-Dateien und Referenzen kontrolliert. **Praktische Darstellung, Textüberdeckung bei unterschiedlichen Schriftgrößen sowie Smartphone- und Tablet-Abnahme sind noch offen.**
