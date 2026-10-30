# Memory & Lesen – zwei Memory-Spiele

Dieses Repository enthält den gemeinsamen Einstieg [index.html](index.html) mit Profilwahl und zwei Spielen:

| Spiel | Einstieg | Umfang |
|---|---|---|
| **Eigenschaften-Memory** | [eigenschaften.html](eigenschaften.html) | 30 Bildkarten, drei Schwierigkeitsstufen; Runden mit 6/12/18 Karten, abhängig von den geeigneten Karten der Stufe |
| **Ein Wort – zwei Bedeutungen** | [wortmemory/index.html](wortmemory/index.html) | 20 Wortpaare mit 40 Bildbedeutungen und 80 Fragesätzen; Auswahl von 6/8/10/12 Paaren |

Stand dieser Beschreibung: 30.10.2026, mit den vorhandenen Quellen abgeglichen. Die aktuelle Oberfläche und das Manifest nennen die Sammlung **Memory & Lesen**.

## Namen und Pflegeorte

**Fühlmemory / Fuehlmemory** ist eine ältere Bezeichnung des Eigenschaften-Spiels und des Repositorys. Einige Seitentitel und interne Speicher-/Cache-Namen verwenden diesen Namen weiterhin. Sie wurden bei dieser Dokumentationskorrektur nicht geändert.

Aktueller Pflegeort beider Spiele ist **hamthor-web/memory-sammlung**. Das ältere Wortmemory-Repository [hamthor-web/Memory](https://github.com/hamthor-web/Memory) bleibt als archivierter Vorläufer erhalten. Es ist kein weiterer aktiver Pflegeort.

Die separate [Spielesammlung-fuer-Lesefreude-](https://github.com/hamthor-web/Spielesammlung-fuer-Lesefreude-) enthält die sieben Spiele der großen App. Die beiden Memory-Spiele gehören nicht automatisch zu deren Spielumfang.

## Eigenschaften-Memory

Das Kind betrachtet zunächst alle Bildkarten ohne feste Lernzeit. Mit **Ich bin bereit!** werden die Karten verdeckt. Danach wählt es eine Fragekarte und sucht eine passende Bildkarte.

- Stufe 1 fragt nach einer Eigenschaft, Stufe 2 nach zwei Eigenschaften, Stufe 3 nach Kombinationen und Ausschlüssen.
- Die Eigenschaftsmatrix steht in [CARD_MATRIX.csv](CARD_MATRIX.csv), die Bildkarten in [cards.js](cards.js). Der Bernhardiner ist dort schwer und kuschelig.
- Die Rundenauswahl bietet 6, 12 oder 18 Bildkarten. Je nach geeigneten Karten kann der Code eine Auswahl deaktivieren oder herabsetzen.
- Pro Runde gibt es zwei Fragekarten mehr als Bildkarten; bei sechs Bildern also acht Fragekarten.
- Eine falsche Bildkarte bleibt offen, bis **dieselbe Karte erneut angetippt** wird. Andere Bildkarten bleiben währenddessen gesperrt.
- Eine richtige Karte bleibt während zwei Sekunden Lesezeit und der anschließenden zufälligen Papierkorb-/Kartenanimation sichtbar; erst danach wird sie ausgegraut.
- Animationen bestehen aus einer animierten WebP-Datei und drei MP4-Dateien. Die unmittelbar zuvor gewählte Animation wird bei der nächsten Auswahl ausgeschlossen.

## Ein Wort – zwei Bedeutungen

Zwei Bildbedeutungen desselben Wortes bilden ein Paar. Nach einem Treffer liest das Kind einen Satz und ordnet ihn einer der beiden Bildbedeutungen zu.

- Zwei ungleiche offene Karten erscheinen in einer vergrößerten Vergleichsansicht. Das Kind bestimmt die Betrachtungszeit und schließt sie durch Antippen.
- Eine dritte Karte bleibt gesperrt, bis beide Karten des Fehlpaars geschlossen sind. Es gibt keine automatische Schließzeit von fünf oder zwei Sekunden.
- Bei einem richtigen Paar schließt sich die große Vergleichsansicht. Die gefundenen Karten bleiben auf dem Spielfeld sichtbar und werden als Treffer markiert.
- Auf die kurze Trefferbestätigung folgt **Welches Bild passt zu diesem Satz?** Eine falsche Zuordnung darf korrigiert werden.
- Der Brettzoom ist im Code von 35 bis 115 Prozent einstellbar; die Spaltenzahl hängt von Zoom und Ausrichtung ab.
- Das optische Linsenbild verwendet ein Fernrohr in Piratenumgebung. Der zugehörige Satz lautet: „Das Fernrohr vergrößert mit seinen Linsen Dinge, die weit entfernt sind.“

## Lokale Profile und Speicherung

Gemeinsames Menü und Eigenschaften-Spiel verwenden lokale Kinderprofile. Gespeichert werden Profil-ID, Name, Schwierigkeit und Kartenzahl. Beim Profilwechsel im Eigenschaften-Spiel beginnt eine neue Runde. Bestehende Fühlmemory-Profile werden über denselben Speicherschlüssel weiterverwendet.

Das Wortmemory besitzt keine eigene dauerhafte Profilstatistik. Aus der gemeinsamen Profilwahl folgen keine gespeicherten Wortmemory-Ergebnisse oder Ergebnistreppen.

Profile sind lokale Einstellungen, keine geschützten Benutzerkonten. Die statische App sendet sie nicht an einen Anmeldeserver; es gibt keine automatische Cloud-Synchronisierung. Ohne verfügbaren lokalen Speicher weist die Oberfläche auf Sitzungsbetrieb hin.

## Installation und Offlinebetrieb

Beide Spiele, Kartenbilder und Animationen sind im gemeinsamen Offline-Paket vorgesehen. Die Startseite online öffnen und warten, bis **Offline bereit** erscheint. Danach Installation und erneutes Öffnen ohne Netz auf dem vorgesehenen Gerät prüfen.

- Android und unterstützte Desktopbrowser: die angebotene **App installieren**-Funktion oder die Installationsfunktion des Browsers verwenden.
- iPhone/iPad: Safari → **Teilen → Zum Home-Bildschirm**.

Service Worker benötigen HTTPS oder localhost. Direktes Öffnen einer HTML-Datei bietet kein gemeinsames Offline-Paket. Gelöschte Browser-/Websitedaten oder automatische Speicherbereinigung können Profile und Offline-Dateien entfernen; ein anderer Browser oder eine andere Adresse übernimmt vorhandene Daten nicht automatisch.

Die Startseite kann **App aktualisieren** anbieten, sobald eine neue Version vorbereitet ist. Dabei wird neu geladen. Aktuelle Service-Worker-Version im Quellcode: **`v12`**. Der ältere technische Präfix `fuehlmemory:` ist weiterhin vorhanden. Bei Änderungen an den **Anwendungsdateien** auch `VERSION` in [sw.js](sw.js) berücksichtigen; die README selbst gehört nicht zum Cachebestand.

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
