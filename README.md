# Lesen mit Memories – vier Lernspiele

Dieses Repository enthält den gemeinsamen Einstieg [index.html](index.html) mit gemeinsamer Namensauswahl und vier Spielen:

| Spiel | Einstieg | Umfang |
|---|---|---|
| **Eigenschaften merken und finden** | [eigenschaften.html](eigenschaften.html) | 30 Bildkarten, drei Schwierigkeitsstufen; Runden mit 6/12/18 Karten, abhängig von den geeigneten Karten der Stufe |
| **Ein Wort, zwei Bilder** | [wortmemory/index.html](wortmemory/index.html) | 20 Wortpaare mit 40 Bildbedeutungen und 80 Fragesätzen; Auswahl von 6/8/10/12 Paaren |

| **Zwei Wörter, eine Sache** | [synonymmemory/index.html](synonymmemory/index.html) | Wortpaare mit ergänzendem Bildvergleich |
| **Verrückt gesucht!** | [verrueckt-gesucht/index.html](verrueckt-gesucht/index.html) | 10 Leseaufgaben pro Runde; persönliche Fortschrittsbilder |

Die aktualisierten Regeln für Profile, Wiederaufnahme, Altbildzuordnung und Offlinebetrieb stehen in [Kinderprofile, Spielerwechsel und Offlinebetrieb](docs/profile-progress-offline.md). Die folgenden historischen Detailbeschreibungen werden dadurch ergänzt.

Stand der älteren Detailbeschreibung: 30.10.2026, mit den vorhandenen Quellen abgeglichen. Die aktuelle Oberfläche und das Manifest nennen die Sammlung **Lesen mit Memories**. Die eigenständige Android-App verwendet `de.heikeamthor.memoriesammlung`; die Testfassung verwendet `de.heikeamthor.memoriesammlung.test`.

## Namen und Pflegeorte

**Fühlmemory / Fuehlmemory** ist eine ältere Bezeichnung des Eigenschaften-Spiels und des Repositorys. Einige Seitentitel und interne Speicher-/Cache-Namen verwenden diesen Namen weiterhin. Sie wurden bei dieser Dokumentationskorrektur nicht geändert.

Aktueller Pflegeort beider Spiele ist **hamthor-web/memory-sammlung**. Das ältere Wortmemory-Repository [hamthor-web/Memory](https://github.com/hamthor-web/Memory) bleibt als archivierter Vorläufer erhalten. Es ist kein weiterer aktiver Pflegeort.

Die separate [Spielesammlung-fuer-Lesefreude-](https://github.com/hamthor-web/Spielesammlung-fuer-Lesefreude-) enthält die sieben Spiele der großen App. Die beiden Memory-Spiele gehören nicht automatisch zu deren Spielumfang.

## Eigenschaften merken und finden

Das Kind betrachtet zunächst alle Bildkarten ohne feste Lernzeit. Mit **Ich bin bereit!** werden die Karten verdeckt. Danach wählt es eine Fragekarte und sucht eine passende Bildkarte.

- Stufe 1 fragt nach einer Eigenschaft, Stufe 2 nach zwei Eigenschaften, Stufe 3 nach Kombinationen und Ausschlüssen.
- Die Eigenschaftsmatrix steht in [CARD_MATRIX.csv](CARD_MATRIX.csv), die Bildkarten in [cards.js](cards.js). Der Bernhardiner ist dort schwer und kuschelig.
- Die Rundenauswahl bietet 6, 12 oder 18 Bildkarten. Je nach geeigneten Karten kann der Code eine Auswahl deaktivieren oder herabsetzen.
- Pro Runde gibt es zwei Fragekarten mehr als Bildkarten; bei sechs Bildern also acht Fragekarten.
- Eine falsche Bildkarte bleibt offen, bis **dieselbe Karte erneut angetippt** wird. Andere Bildkarten bleiben währenddessen gesperrt.
- Eine richtige Karte bleibt ohne Zeitlimit zum Lesen sichtbar. Mit „Weiter“ folgt die Papierkorb-/Kartenanimation; anschließend wird sie ausgegraut.
- Die vier kurzen Papierkorb-Animationen mit dem Würstchen sind MP4-Dateien (höflicher Papierkorb, hüpfender Deckel, Zaubertrick mit geschwenktem Zauberstab und frecher Papierkorb). Nach „Weiter“ wird zufällig eine davon abgespielt; die unmittelbar zuvor gewählte Animation ist bei der nächsten Auswahl ausgeschlossen. Beim letzten Treffer bleibt die bisherige Jubelanimation als Rundenabschluss erhalten.

## Ein Wort, zwei Bilder

Zwei Bildbedeutungen desselben Wortes bilden ein Paar. Nach einem Treffer liest das Kind einen Satz und ordnet ihn einer der beiden Bildbedeutungen zu.

- Zwei ungleiche offene Karten erscheinen in einer vergrößerten Vergleichsansicht. Das Kind bestimmt die Betrachtungszeit und schließt sie durch Antippen.
- Eine dritte Karte bleibt gesperrt, bis beide Karten des Fehlpaars geschlossen sind. Es gibt keine automatische Schließzeit von fünf oder zwei Sekunden.
- Bei einem richtigen Paar schließt sich die große Vergleichsansicht. Die gefundenen Karten bleiben auf dem Spielfeld sichtbar und werden als Treffer markiert.
- Auf die kurze Trefferbestätigung folgt **Welches Bild passt zu diesem Satz?** Eine falsche Zuordnung darf korrigiert werden.
- Der Brettzoom ist im Code von 35 bis 115 Prozent einstellbar; die Spaltenzahl hängt von Zoom und Ausrichtung ab.
- Das optische Linsenbild verwendet ein Fernrohr in Piratenumgebung. Der zugehörige Satz lautet: „Das Fernrohr vergrößert mit seinen Linsen Dinge, die weit entfernt sind.“

## Lokale Profile und Speicherung

Auf dem Handy stehen die vier Spiele untereinander, auf Tablets in zwei Spalten. „Alle Spiele“ und „Einstellungen“ führen in jedem Spiel zum selben Ziel. Schriftgröße ist über „Aa“, Installation und Aktualisierung über „App verwalten“ erreichbar.

Alle vier Spiele verwenden das im Menü ausgewählte Kinderprofil. Laufende Runden und die Fortschrittsbilder von „Verrückt gesucht!“ werden pro Profil-ID gespeichert. Nach erneutem Öffnen bietet das Spiel „Weiterspielen“ oder „Neue Runde“ an. Beim Profilwechsel bleibt die bisherige Runde erhalten.

Bisher gemeinsam gespeicherte Fortschrittsbilder werden erst nach ausdrücklicher Auswahl einem Kind zugeordnet. Die ursprünglichen Daten bleiben als Sicherung erhalten. Profile sind lokale Einstellungen und keine geschützten Benutzerkonten; es gibt keine automatische Cloud-Synchronisierung. Schreibfehler im lokalen Speicher werden sichtbar gemeldet.

Pfau und Baum sammeln jede fertige Gestaltung als eigene auswählbare Version. Geschichten mit unverändertem Bildablauf zeigen stattdessen die Anzahl der Abschlüsse. Vorhandene Einzelbilder bleiben erhalten und zählen als erster bekannter Abschluss.

Zu zweit gilt in allen Memory-Spielen: Ein Treffer gibt einen Punkt und einen weiteren Zug. Nach einem Fehler bestätigt das nächste Kind die Übergabe mit „Ich bin bereit“. Ergänzende Leseaufgaben dürfen ohne zusätzlichen Punktabzug korrigiert werden.

## Installation und Offlinebetrieb

Alle vier Spiele, Kartenbilder und Animationen sind im gemeinsamen Offline-Paket vorgesehen. Die Startseite online öffnen und warten, bis **Offline bereit** erscheint. Danach Installation und erneutes Öffnen ohne Netz auf dem vorgesehenen Gerät prüfen.

- Android und unterstützte Desktopbrowser: die angebotene **App installieren**-Funktion oder die Installationsfunktion des Browsers verwenden.
- iPhone/iPad: Safari → **Teilen → Zum Home-Bildschirm**.

Service Worker benötigen HTTPS oder localhost. Direktes Öffnen einer HTML-Datei bietet kein gemeinsames Offline-Paket. Gelöschte Browser-/Websitedaten oder automatische Speicherbereinigung können Profile und Offline-Dateien entfernen; ein anderer Browser oder eine andere Adresse übernimmt vorhandene Daten nicht automatisch.

Unter **App verwalten → Auf Aktualisierung prüfen** lässt sich eine vorbereitete neue Version aktivieren. Dabei wird neu geladen. Die Version wird aus den Anwendungsdateien automatisch erzeugt. Der ältere technische Präfix `fuehlmemory:` ist weiterhin vorhanden. Nach Änderungen an **Anwendungsdateien** `node scripts/build-offline.cjs` ausführen und `offline-files.js` mit einchecken; die README selbst gehört nicht zum Cachebestand.

## Vorschau und GitHub Pages

Für die lokale Vorschau im Repository-Ordner:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Dann http://127.0.0.1:8765/ öffnen.

Für GitHub Pages das aktuelle Repository **memory-sammlung**, Branch **main**, Ordner **/(root)** als Quelle verwenden, sofern Pages aus diesem Branch bereitgestellt werden soll. Bei der üblichen Repository-Pages-Adresse wäre der Pfad:

https://hamthor-web.github.io/memory-sammlung/

Die frühere Adresse mit `/Fuehlmemory/` ist eine historische Angabe. Die tatsächlich aktive Pages-/Domainkonfiguration und Live-Erreichbarkeit wurden bei dieser README-Korrektur nicht neu geprüft.

## Wortmemory-Arbeitsmaterial

Unter [docs/wortmemory](docs/wortmemory/README.md) bleiben historische Ergänzungsdaten und Bedeutungserklärungen erhalten. Sie sind Arbeitsmaterial und werden nicht vom Spiel oder Offline-Paket geladen. Maßgeblich für das aktuelle Wortmemory ist [wortmemory/index.html](wortmemory/index.html), einschließlich des später korrigierten Fernrohrsatzes.

## Prüfung und Nutzungsrechte

Vorhandene Prüfskripte lassen sich mit installiertem Node.js im Repository-Ordner aufrufen:

```sh
node verify.cjs
node verify-pwa.cjs
```

Einzelne Prüfungen benötigen den vollständigen lokalen Dateibestand. Die Befehle werden hier dokumentiert; sie wurden bei dieser reinen README-Korrektur nicht erneut ausgeführt. Sie ersetzen keine Geräte-, Bildinhalts- oder Offlineprüfung.

Karten, Rückseiten und Animationen stammen aus den bereitgestellten Materialien. Dieses Repository erweitert keine Nutzungsrechte daran.

## Produktionspaket

`node scripts/build-production.cjs` erstellt `dist/` mit ausschließlich den benötigten Spieldateien (etwa 113 MB). Tests, Dokumentation und Entwicklungsskripte werden nicht mitverpackt. Die Bereinigung, Bildprüfung und Kompatibilität älterer Fortschrittsbilder sind unter [Produktionsbestand](docs/production-assets.md) dokumentiert.

## Sicherung und Wiederherstellung

Unter **App verwalten → Sicherung speichern** lassen sich alle Kinderprofile, laufenden Runden und Fortschrittsbilder als JSON-Datei sichern. Die Datei enthält auch die verschiedenen Bildversionen und die Wiederholungszähler. Bitte den erfolgreichen Download beziehungsweise das Speichern auf dem Gerät prüfen und die Datei privat aufbewahren.

Auf demselben oder einem anderen Gerät **App verwalten → Sicherung auswählen** öffnen, die Vorschau prüfen und **Profile hinzufügen** wählen. Vorhandene Profile bleiben erhalten; bei Namensgleichheit entsteht beispielsweise „Anna (Sicherung)“. Bereits vorhandene oder bereits importierte unveränderte Profile werden nicht doppelt angelegt. Anschließend **Zu den Spielen** wählen.

Dies ist eine manuelle Dateiübertragung ohne Cloud-Dienst. Das tatsächliche Speichern auf ein anderes Gerät oder einen externen Datenträger muss selbst veranlasst werden. Details und technische Grenzen: [Sicherungsdateien](docs/backups.md).

## Android-Testversion

Das Android-Projekt verwendet den lokalen Produktionsbestand und native System-Dateidialoge für Sicherungen. Build, Test-Signierung und die Abnahme auf dem Handy sind unter [Android-Testversion](docs/android-test.md) beschrieben. Es wurde noch nichts in den Play Store hochgeladen.
