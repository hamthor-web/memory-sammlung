# Lesen mit Memories – Nachtrag Fortschrittsbilder im Querformat

**Datum:** 12.11.2026
**Repository:** https://github.com/hamthor-web/memory-sammlung
**Status:** auf GitHub gespeichert; Android-Testversion 0.2.5 lokal signiert und in ChatGPT-Bibliothek bereitgestellt; Gerätetest offen.

## Bestätigte Änderung
Heikes Rückmeldung: Die Fortschrittsbilder sollen zumindest im Querformat scrollbar sein, weil sie selbst in der kleinsten Zoomstufe teilweise nicht vollständig auf den Bildschirm passen. Vergrößerung und Schriftgrößen bleiben voneinander unabhängig. Inhalte, Animationen und Bedienelemente dürfen nicht abgeschnitten werden.

## Umsetzung in den betroffenen Spielakten

| Spiel / Ansicht | Änderung |
| --- | --- |
| Verrückt gesucht! – Fortschrittsgeschichte während des Spiels | `#treeLarge` in `verrueckt-gesucht/style.css` ist in Hoch-/Querformat scrollbar; die „Weiter“-Schaltfläche bleibt getrennt vom Bildbereich. |
| Verrückt gesucht! – gespeicherte Geschichten in „Meine Bilder“ | `#galleryPicture` ist scrollbar, während Navigation und Bildzähler außerhalb des Bildbereichs bleiben. Die Überblendeffekte und Bilderreihenfolge bleiben unverändert. |
| Eigenschaften-Memory – Fortschrittspuzzle | `.puzzle-board-viewport` erhält eine beschränkte Bildschirmhöhe und vertikales/horizontales Scrollen. Die bestehende Spielfeld-Zoomfunktion und Puzzleteilmechanik bleiben erhalten. |
| Zwei Wörter, ein Ding – Wunderwesen-Lichtung | `.scene-wrap` lässt sich bei geringer Bildschirmhöhe vertikal und horizontal scrollen. Die Wesen-Animationen und Bild-Zoomregler bleiben erhalten. |
| Ein Wort – zwei Bedeutungen – Zauberbäume | Bestehende scrollbare `canvas-wrap`-/`scene-scroll`-Bereiche wurden geprüft; kein unnötiger Umbau. |
| Zwei Wörter, ein Ding – Märchenhaus | Bereits vorhandener gesonderter Scrollbereich der Geschichten bleibt erhalten. |

## Tests

- Automatisierte Chromium-Layoutchecks bei 844 × 390 und 915 × 412 Pixeln: Scrollbereiche der Fortschrittsgeschichten, Galerie, Puzzle und Lichtung sind scrollbar.
- Bei Fortschrittsgeschichte und Galerie bleiben die äußeren Weiter-/Navigationsschaltflächen im sichtbaren Bildschirm.
- Weitere Bildmaße 390 × 844 und 768 × 1024 geprüft; wo das Bild passt, kein unnötiger Scrollbedarf.
- ZIP-Integrität, APK-v2-Signatur und kompletter Inhaltsdigest der lokalen Android-Test-APK überprüft; das Testzertifikat entspricht der Version 0.2.4.
- **Offen:** reales Android-Gerät, verschiedene Smartphone-/Tabletgrößen und die praktische Bedienung beim Ziehen/Scrollen der Puzzleteile.

## Android-Stand

- **Neue Test-APK:** Lesen_mit_Memories_0.2.5_Test_signiert.apk, 145.072.987 Byte.
- **Android-App:** Testpaket `de.heikeamthor.memoriesammlung.test`; Versionsname `0.2.5-test`, Versionscode `7`, Update von Code `5` oder `6` mit gleichem Schlüssel möglich.
- **SHA-256 APK:** `99282aaa42c974169bc71ab29b42df8dc38628cda5ef4e95747c070a32d9cd12`.
- **Öffentlicher Zertifikatsfingerabdruck:** `0204dd28e5ef684e161b9c745897c670d7f81b3f9cbeaeb9631b4b46cf57c708`.
- Lokale APK von der signierten 0.2.4 abgeleitet. Die drei geänderten Styles/HTML stimmen bytegenau mit GitHub überein; lokales Offline-Manifest aktualisiert; Android-Version angepasst. Übrige bisherige Spielinhalte erhalten.
- Der private Schlüssel verbleibt außerhalb von GitHub. Eine installierbare APK wird durch den GitHub-CI-Lauf weiterhin nicht automatisch ausgeliefert, solange das Repository-Secret nicht vorhanden ist. Kein Play-Store-Release.

## Aktualisierung der Masterübersicht

**Lesen mit Memories:** Fortschrittsbilder im Querformat scrollbar; Quellcode und Offline-Stand v76 auf GitHub aktualisiert; neue Android-Test-APK 0.2.5 signiert. Realen Querformat-Test und App-Update am Handy noch durchführen. Spielmechanik/Belohnungsstände unverändert. Der bisherige Master und ältere Spielakten bleiben bestehen; dieser Nachtrag ergänzt sie.
