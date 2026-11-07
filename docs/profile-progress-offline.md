# Kinderprofile, Spielerwechsel und Offlinebetrieb

## Verhalten

Alle vier Spiele verwenden die feste ID des im Menü ausgewählten Kinderprofils.
Eine Runde gehört zu diesem Profil, auch im Zweispielermodus. Die beiden
Teilnehmernamen einer Zweispielerrunde dienen der Punkteanzeige; sie erzeugen
keine weiteren Profile. „Verrückt gesucht!“ bleibt ein Einzelspiel.

- Richtige Bilder bzw. Paare geben einen Punkt und einen weiteren Zug.
- Nach einem falschen Bild oder Fehlpaar übernimmt das andere Kind erst mit
  „Ich bin bereit“. Es gibt keinen automatischen Übergabetimer.
- Die Satzaufgabe beim Wortmemory und die Ja-/Nein-Frage beim Synonymmemory
  dürfen ohne zusätzlichen Punktabzug korrigiert werden.
- Beim Eigenschaften-Spiel bleibt dieselbe Frage nach einem Fehler bestehen.
- Laufende Runden werden unter dem aktiven Profil gespeichert. Nach erneutem
  Öffnen kann das Kind zwischen „Weiterspielen“ und „Neue Runde“ wählen.
- Bereits verdiente Treffer überstehen eine unterbrochene Animation. Beim
  Fortsetzen wird die Animation übersprungen, ohne den Punkt erneut zu vergeben.
- Die Galerie und der Überraschungszyklus von „Verrückt gesucht!“ gehören
  ausschließlich zum aktiven Kind. Neue Bilder speichern einen Aufbauplan;
  Bilddateien bzw. eingebettete Grafiken werden nicht pro Zwischenbild dupliziert.

## Bestehende gemeinsame Bilder

Das Menü fragt ausdrücklich, wem die bisherigen Bilder gehören. Es gibt keine
vorbelegte Auswahl. „Später entscheiden“ lässt die Daten unzugeordnet stehen.
Die Zuordnung geschieht einmalig über die Profil-ID. Der ursprüngliche Schlüssel
`verrueckt-gesucht-rewards-v1` bleibt unverändert als Sicherung erhalten; auch
bei der Zuordnung werden die großen Bilddaten nicht kopiert. Nur das gewählte
Kind erbt diese Bilder. Seine neuen Fortschritte werden separat gespeichert.

## Speicherformat

- Profile: `fuehlmemory-profiles-v1` (unverändert).
- Fortschritt: `memory-progress-v1:<profil-id>` mit `rounds` und `rewards`.
- Alte Bilder zugeordnet an: `memory-legacy-rewards-owner-v1` mit `ownerId`.
- Checkpoints sind versioniert. Namen sind keine Speicherschlüssel.
- Fehlgeschlagene Schreibzugriffe zeigen eine sichtbare Warnung; bei einer
  fehlgeschlagenen Zuordnung bleiben die alten Daten unzugeordnet.

Die Speicherung ist lokal. Gelöschte Website-Daten löschen auch diese Daten;
Browser-Profile und eine spätere Android-App teilen ihren Speicher nicht
automatisch. Browser-Tabs reagieren auf einen Profilwechsel in einem anderen Tab:
Sie sichern unter dem bisherigen Besitzer und laden die neue Auswahl.

## Offline und Aktualisierungen

Ein gemeinsamer Service Worker verwaltet alle vier Spiele, Karten,
Fortschrittsgeschichten, Eingangsvideos und Jubelanimationen. Die frühere
Unterregistrierung von „Verrückt gesucht!“ wird beim Laden des neuen Clients
abgemeldet. Alte Nutzerdaten und Kinderprofile werden dabei nicht gelöscht.

Die vollständige Dateiliste und ein Fingerabdruck aller Anwendungsdateien werden
erzeugt mit:

```sh
node scripts/build-offline.cjs
```

Diesen Befehl nach jeder Änderung an Anwendungsdateien ausführen und
`offline-files.js` mit einchecken. Eine neue Version installiert in einen eigenen
Cache. Scheitert eine Datei, wird nur der unvollständige neue Cache verworfen.
Die bisherige Version bleibt erhalten. Eine wartende Version wird nur über den
Aktualisierungsbutton im Menü aktiviert, nicht mitten in einer Runde.
„Offline bereit – alle vier Spiele“ setzt die Prüfung aller Dateieinträge voraus.
Videos unterstützen Byte-Range-Anfragen auch aus dem Offline-Cache.

Der vollständige Bestand umfasst derzeit etwa 200 MB unkomprimierte Dateien.
Der erste Download und Updates können deshalb dauern und freien Speicher
benötigen. Für eine spätere Android-App sollen diese Dateien lokal mitgeliefert
werden; ein Android-Projekt/AAB ist nicht Teil dieser Änderung.

## Prüfen

Mit lokalem Server im Repository auf Port 8765 und installiertem Playwright:

```sh
node verify.cjs
node verify-pwa.cjs
node tests/progress-store.cjs
node tests/service-worker-update.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-memory-four-games.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-progress.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-offline.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-reward-resume.cjs
```

Die Browsertests prüfen Profiltrennung und die ausdrückliche Altbildzuordnung,
Übergabe und Wiederaufnahme, offene Leseaufgaben, vollständige Runden und den
allerersten Aufruf aller vier Spiele ohne Netzwerk. Das ersetzt keinen Test auf
einem physischen Android-Gerät oder einen Beobachtungstest mit Kindern.
