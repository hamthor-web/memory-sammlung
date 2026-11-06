# Memory-Sammlung – Beschilderte Schaltflächen (06.11.2026)

## Bestätigte Gestaltung
- Das helle Papierschild mit Würstchen und orangefarbenen Bildkarten gehört zu **Ein Wort – zwei Bedeutungen**; Beschriftungen sind **schwarz**.
- Das blaue, strukturierte Schild mit Würstchen und Kartenmotiven gehört zum **Eigenschaften-Memory / Fühlmemory**; Beschriftungen sind **weiß** und kontrastreich.
- Die beiden Originalzeichnungen der Nutzerin wurden als komprimierte, selbstenthaltende SVG-Bilddateien eingebunden: `assets/buttons/memory-paper.svg` und `assets/buttons/memory-blue.svg`.
- Für breite Buttons wird der Bildhintergrund im mittleren Bereich gedehnt. Linker und rechter Bildrand mit Figuren/Karten bleibt beim horizontalen Skalieren geschützt (CSS `border-image` mit neun Bildzonen).
- Einsatz bei großen Spielauswahl-, Auswahl-, Start- und Ergebnis-Schaltflächen. Kleine Steuerknöpfe für Zoom, Profil und Navigation bleiben schlicht, um ausreichend Platz für Beschriftung und Berührung zu halten.
- Die Bildkarten und Fragekarten selbst sind keine dekorativen Aktionsbuttons und bleiben unverändert.
- Große Schrift, ausreichender Kontrast, Hoch- und Querformat sowie unabhängige Text-/Spielfeldgrößen bleiben verbindliche Prüfkriterien.

## Betroffene Dateien
- `index.html`, `menu.css` – gemeinsame Spielauswahl;
- `style.css` – Eigenschaften-Memory;
- `wortmemory/index.html`, `wortmemory/test-zweispieler-2026-11-06.html` – Wortmemory;
- `sw.js` – Offline-Cache v22.

## Prüfung und Vorbehalte
- Beide SVG-Dateien: selbstenthaltendes WebP-Bild mit korrektem RIFF-/WEBP-Header und konsistenter Dateilänge.
- CSS-Layout in einer isolierten Chromium-Darstellung auf breitem und schmalem Button ausprobiert. Kein vollständiger E2E-/Smartphone-/Tablet-Test der veröffentlichten App.
- Die SVG-Assets basieren auf komprimierten Versionen der eingereichten PNGs; eine spätere Variante mit höherer Auflösung kann bei Bedarf die Bildschärfe verbessern.
- Bestehende Spielmechanik und Daten wurden nicht verändert.

## Projektverwaltung
Spielakte Eigenschaften-Memory, Spielakte Ein Wort – zwei Bedeutungen sowie Masterübersicht benötigen die Ergänzung. Bestehende Projektquellen wurden nicht überschrieben.
