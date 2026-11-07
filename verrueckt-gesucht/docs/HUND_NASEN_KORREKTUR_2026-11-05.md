# Verrückt gesucht! – Korrektur Hundekarten (05.11.2026)

## Verbindliche Entscheidung
Der Hund zeigt entweder **zwei schwarze Nasen** oder **eine schwarze und eine deutlich gelbe Nase**. Die bisherige Kombination **schwarz/braun** wird wegen zu geringer Unterscheidbarkeit nicht mehr verwendet.

## Technische Umsetzung (main)
- `VG-01-05`: roter Halsschmuck, brauner Schwanz, zweite Nase gelb; Bild `assets/hund-gelbe-nase-05.svg`.
- `VG-01-06`: grüner Halsschmuck, blauer Schwanz, zweite Nase gelb; Bild `assets/hund-gelbe-nase-06.svg`.
- Die neuen SVG-Bilder verwenden jeweils die unveränderte ursprüngliche Hundeillustration als eingebettete Grundlage; ausschließlich der Bereich der zweiten Nase erhält eine gelbe Farbkorrektur. Die bisherigen WebP-Dateien bleiben erhalten.
- `data.js`: Bildverweise, Nasenmerkmale, positive und negative Fragenformulierungen auf **gelb** umgestellt.
- `card-plan.json`: Merkmals- und Textbeschreibungen entsprechend geändert.
- `index.html` und `sw.js`: neue Bilddateien und Datenfassung für die installierte Web-App eingebunden; Offline-Cache-Version erhöht.

## Prüfung / Grenzen
Im GitHub-Repository wurden die Bild- und Textverweise und die aktualisierten Quelldateien kontrolliert. Ein visueller Test der neuen SVG-Darstellung auf Mobilgerät und ein vollständiger Spieltest der Fragenmatrix stehen noch aus. Alte statische Exporte wie `questions.json` oder Downloads in der Library wurden nicht überschrieben.

## Erhalt der Bestände
Keine ursprünglichen Hundebilder gelöscht oder ersetzt; keine Spielstände verändert.
