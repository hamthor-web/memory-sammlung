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

## Gemeinsame Bedienung

Die Spielauswahl zeigt auf dem Handy eine Karte pro Zeile, auf Tablets zwei.
Alle Karten verwenden „Spielen“. Die sichtbaren Namen sind „Eigenschaften merken und finden“,
„Ein Wort, zwei Bilder“, „Zwei Wörter, eine Sache“ und „Verrückt gesucht!“.
Profil-IDs und Speicherzuordnungen bleiben erhalten. Der gepflegte Einstieg ist
`wortmemory/index.html`; die frühere datierte Testadresse leitet dorthin weiter.

Die Einstellungen folgen der Reihenfolge Spielmodus, Schwierigkeit (wo
vorhanden), Kartenanzahl und beim Suchspiel Geschichte. Die Stufen heißen
„Leicht“, „Knifflig“ und „Sehr knifflig“; Paarzahlen nennen auch die Kartenanzahl.
Der Startbutton heißt überall „Spiel starten“, die Wiederholung „Noch einmal
spielen“. App-Verwaltung liegt in einem eigenen Fenster, auch aus der
Namensauswahl erreichbar. „Kind wechseln“ öffnet die gemeinsame Namensauswahl.
Schriftgrößen- und vorhandene Kartenzoom-Regler öffnen überall über „Aa“.

Jedes Spiel hat eine sichtbare gemeinsame Navigationsleiste: „Alle Spiele“
führt zur Sammlung, „Einstellungen“ zur Einrichtung dieses Spiels. Laufende
Runden werden vor dem Wechsel gesichert. Browser-Zurück und die native
Android-Zurückgeste schließen zunächst ein Fenster, gehen dann zu den
Einstellungen und schließlich zur Sammlung. Es gibt keinen zusätzlichen
Touch-Handler, der dieselbe Android-Geste doppelt als Zurück ausführen könnte.

Geschlossene Leseaufgaben bleiben über „Weiterlesen“ erreichbar, geschlossene
Belohnungsbilder über „Bild ansehen“. Das Schließen überspringt keine Aufgabe
und vergibt keinen zusätzlichen Punkt. Timer öffnen ein bewusst geschlossenes
Lesefenster nicht erneut. Eine verpflichtende Spielerübergabe bleibt bis zur
Bestätigung bestehen. Die gemeinsame Browser-History ersetzt die früher
getrennte History des Suchspiels.

## Mehrfach abgeschlossene Fortschrittsgeschichten

Pfau und Baum bewahren jeden vollständig abgeschlossenen Durchgang als eigene
Version mit dem genauen Aufbauplan auf. Die Übersicht zeigt einen Bilderstapel
mit der Anzahl. Antippen öffnet eine Auswahl mit allen Vorschaubildern, neueste
Version zuerst. Von der Wiedergabe führt „Andere Version wählen“ zurück zur
Auswahl. Neue Durchgänge verändern keine älteren Bilder.

Die neun Geschichten mit festem Bildablauf behalten eine Vorschau und zeigen
„2-mal geschafft“ usw. Jede Geschichte lässt sich weiterhin beliebig erneut
spielen und ansehen. Abgebrochene Runden erhöhen den Zähler nicht.

Ein bereits vorhandenes einzelnes Sammelbild zählt als ein bekannter Abschluss.
Frühere Wiederholungen, deren Bilder überschrieben wurden, können nicht
nachträglich rekonstruiert werden. Alte HTML-/Frame-Schnappschüsse bleiben auch
als erste Version abspielbar. Zugeordnete gemeinsame Altbilder werden weiterhin
aus ihrer unveränderten Sicherung gelesen und nicht in jede Version kopiert.

Jede neue Runde bekommt eine feste Abschlusskennung im Checkpoint. Ein nach
Unterbrechung erneut ausgeführter Abschluss wird dadurch nur einmal gezählt.
Schlägt das Speichern fehl, bleiben vorherige Bilder erhalten und ein erneuter
Versuch mit derselben Kennung zählt genau einmal. Die Speicherung bleibt pro
Kinderprofil getrennt. Variable Bilder liegen unter `finished.<geschichte>.versions`
(neueste zuerst); feste Geschichten behalten einen Aufbauplan mit `count` und
den gespeicherten Abschlusskennungen.

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

Beim Übergang aus einer älteren gespeicherten Spielseite ergänzt der Spielcode
fehlende Galerieelemente vor dem Registrieren der Klickaktionen. Dadurch kann
auch altes HTML zusammen mit dem aktuellen Galeriecode starten. Neue Seiten
verwenden die gepflegte Datei `app.js`; frühere Skriptadressen bleiben als kleine Kompatibilitätsdateien erhalten.
Der Regressionstest `tests/browser-cached-gallery.cjs` stellt die zuvor
beobachtete Kombination aus altem HTML und neuem JavaScript gezielt nach.

Das Produktionspaket umfasst nach der Bereinigung etwa 113 MB unkomprimierte Dateien (zuvor etwa 199 MB).
Der erste Download und Updates können deshalb dauern und freien Speicher
benötigen. Für eine spätere Android-App sollen diese Dateien lokal mitgeliefert
werden; ein Android-Projekt/AAB ist nicht Teil dieser Änderung. Der Befehl
`node scripts/build-production.cjs` erstellt dafür den Ordner `dist/`.
Details: [Produktionsbestand](production-assets.md).

## Prüfen

Mit lokalem Server im Repository auf Port 8765 und installiertem Playwright:

```sh
node verify.cjs
node verify-pwa.cjs
node tests/progress-store.cjs
node tests/reward-history.cjs
node tests/service-worker-update.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-memory-four-games.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-navigation.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-reading-back.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-progress.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-offline.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-reward-resume.cjs
CHROME_BIN=/usr/bin/chromium node tests/browser-reward-history.cjs
```

Die Browsertests prüfen Profiltrennung und die ausdrückliche Altbildzuordnung,
Übergabe und Wiederaufnahme, offene Leseaufgaben, vollständige Runden und den
allerersten Aufruf aller vier Spiele ohne Netzwerk. Das ersetzt keinen Test auf
einem physischen Android-Gerät oder einen Beobachtungstest mit Kindern.
