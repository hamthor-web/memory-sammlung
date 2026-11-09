# Memory-Sammlung – vier Belohnungsbäume: Spielakte und Master-Nachtrag

Stand: 09.11.2026. Ziel: **Ein Wort – zwei Bedeutungen**, technische Spielseite `wortmemory/index.html` im Repository `hamthor-web/memory-sammlung`. Nicht mit dem Synonymspiel „1 Sache, 2 Bezeichnungen“ verwechseln.

## Verbindlicher Auftrag und Ablauf

Heike beauftragt den Einbau der vier vorhandenen Fassungen **Herbstbaum**, **Mondbaum**, **Rosa Zauberbaum** und **Zauberbaum**. Nach einer vollständig abgeschlossenen Einzelspielrunde läuft die vorhandene Abschlussanimation. Anschließend: „Schau dir an, was zu deinem Baum dazukommt!“ mit wechselnder Frage und dem Button **„Will ich sehen“**. Danach erscheint der gespeicherte Baum; genau ein neues Element wird groß vorgestellt und an seinen Platz bewegt. Vorhandene Elemente erscheinen gemeinsam an ihren bisherigen Positionen und werden nicht nacheinander erneut aufgebaut. Zehn Elemente vervollständigen einen Baum, unabhängig von der gewählten Paarzahl.

Bestätigte Regeln bleiben erhalten: getrennte Kinderprofile; keine Baummechanik im Zweispielermodus, dort weiterhin gefundene Paare je Kind. Die Spielkarten, Satz-Bild-Aufgaben und Paarwertungen bleiben erhalten.

## Auswahl und Speicherung

- **Zufälliger Baum:** wählt einen noch nicht vollständigen Baum. Ein bereits vorhandener Teilfortschritt wird weiterverwendet.
- **Baum fortsetzen:** ausgegraut, solange kein Baum mit 1–9 Elementen vorhanden ist; bei mehreren begonnenen Bäumen wählt das Kind einen aus.
- **Meinen Baum wählen:** zeigt die vier Bäume samt individuellem Fortschritt.
- **Meine Bäume ansehen:** zusätzliche Ansicht für gespeicherte Zwischenstände und fertige Bäume.

Ein Wechsel setzt keinen Baum zurück. Fertige Bäume bleiben mit zehn Elementen gespeichert und können angesehen werden. Sind alle vier vollständig, bleibt normales Spielen möglich. Es gibt keinen automatischen Reset.

Die Daten stehen unter der stabilen Profil-ID im bestehenden lokalen Profildatensatz (`wordTrees`). Die vorhandene exportierbare Profilsicherung übernimmt sie ebenfalls. Das ist lokale Speicherung im jeweiligen Browser/App-Speicher; keine automatische Synchronisierung zwischen Geräten.

Jede Runde erhält eine eindeutige Kennung. Eine Wiederholung des Abschlussaufrufs zählt dieselbe Runde nicht nochmals. Eine verdiente, aber noch nicht angesehene Überraschung bleibt gespeichert. Der Rundenzustand enthält die Baumzuordnung; ein gespeicherter Abschluss kann nach Neuladen wieder aufgenommen werden. Speicherfehler erhalten einen Wiederholungsweg. Vor einer neuen Runde muss eine noch offene Überraschung zunächst angesehen werden.

## Wechselnde Fragen

1. Bist du schon auf die nächste Überraschung gespannt?
2. Wer zieht wohl heute in deinen Baum ein?
3. Was hat sich zwischen den Zweigen versteckt?
4. Welche kleine Zauberei wartet diesmal auf dich?
5. Möchtest du entdecken, wie dein Baum weiterwächst?

Zufällige Auswahl, keine unmittelbare Wiederholung derselben Frage.

## Übernommene Grafikstände

Die vier eigenständigen Vorschauen bleiben erhalten. Ihre zuletzt abgerufenen Quellstände sind:

| Baum | Sites-Projekt | Quellcommit (Kurzform) |
| --- | --- | --- |
| Herbstbaum mit korrigiertem Äffchen | appgprj_6af20ab154d081919c9eec0945411253 | 11c808d |
| Mondbaum | appgprj_6af204288a608191a4e4c78311958272 | cfe580d |
| Rosa Zauberbaum | appgprj_6af1ed6876b48191845601e4080d0e5f | d0f899c |
| Erster Zauberbaum | appgprj_6af1b64d4564819199e597f881607dea | 961cce7 |

Die Baumseiten werden lokal mit dem Spiel ausgeliefert. Hintergrund und Sprites werden vor der neuen Vorstellung geladen. Die Größenregler für Baum und Schrift bleiben getrennt. Die Vorschauknöpfe zum freien Hinzufügen und Zurücksetzen sind im integrierten Ablauf ausgeblendet; Fortschrittsvergabe erfolgt ausschließlich im Spiel.

PNG-Grafiken wurden in verlustfreie WebP-Dateien konvertiert. Die dekodierten sichtbaren Farbwerte und sämtliche Alphawerte wurden verglichen und sind gleich; lediglich unsichtbare Farbwerte vollständig transparenter Pixel dürfen entfallen. Ein nicht verwendetes fertiges Referenzbild wird nicht ausgeliefert. Die mitgelieferten Baumgrafiken umfassen etwa 16,1 MB. Gesamtes Produktionspaket etwa 132,3 MB unkomprimiert. Bestehende Paketgrößengrenze für die übrige Sammlung bleibt erhalten; die Bäume erhalten eine eigene Größenkontrolle. Quellen und Prüfergebnis stehen zusätzlich in `word-tree-art-conversion.json`.

## Nachgewiesene Prüfungen

Bestanden:

- 40 Fortschrittsvergaben für vier Bäume mit jeweils zehn Elementen.
- Genau-einmal-Zählung, Obergrenze zehn, Erhalt offener Überraschungen nach erneutem Laden.
- Trennung zweier Kinderprofile und Erhalt anderer gespeicherter Spielfortschritte.
- Fehlgeschlagene Speicherzugriffe und Schutz vorhandener beschädigter Daten vor Überschreiben.
- Baumfortschritt, Auswahl und offene Überraschung in der exportierbaren Profilsicherung.
- Bestehende Profil-, Fortschritts- und Sicherungstests.
- JavaScript-Syntax der neuen Dateien sowie eingebetteter Baumskripte; Bildprüfsummen, lokale Verweise und Einbeziehung in Offline-/Android-Paket.
- Produktionspaket, unveränderte Wortkarten-/Frageninhalte und bestehende Matrix-/Fragenprüfung.
- PWA-Dateiliste mit 486 Dateien, Manifest und Video-Teilabrufe.

**Nicht bestanden / noch nicht ausführbar:** keine Behauptung eines erfolgreich absolvierten vollständigen Browser-Spielablaufs. Der erste Browserstart scheiterte an einer Laufzeitbeschränkung. Das anschließende Öffnen der lokalen Testseite wurde durch die automatische Freigabeprüfung blockiert; die ursprüngliche Meldung nannte ein Nutzungslimit. Der erneute Versuch nach Heikes „Mach weiter“ wurde ebenfalls abgelehnt. Keine Umgehung des gesperrten Browserzugangs.

**Offen vor Freigabe:** Browserablauf einer vollständigen Runde einschließlich Abschlussvideo, neuer Meldung, Einflug und Rückweg; Wiederaufnahme nach Neuladen; alle vier Bäume in 393×780, 780×393, 768×1024 und 1024×768 mit beiden Zoomreglern; Erreichbarkeit aller Inhalte; Profilwechsel; Zweispielermodus; echte Smartphone-/Tablet-Abnahme. Ein ausführbares Browserprüfskript ist vorbereitet, aber nicht als bestanden verbucht.

## Masterübersicht – aktueller Status

**Ein Wort – zwei Bedeutungen / vier Belohnungsbäume:** Einbau mit zufälliger Baumwahl, Fortsetzen, gezielter Wahl, Galerie und getrennt gespeichertem Kinderfortschritt im Entwicklungsbranch `feature/profile-reward-trees` vorbereitet. Speicher-, Inhalts-, Paket- und PWA-Prüfungen bestanden. **Noch nicht auf `main` übernommen und noch nicht live veröffentlicht**, da die verbindliche Bildschirm-/Browserprüfung blockiert bleibt. Keine vollständige Freigabe. Basisstand des abgeglichenen Repositories: `7e7e648`.

Dieser Nachtrag ergänzt bestehende Akten und die Masterübersicht. Bestehende Projektquellen werden nicht ersetzt oder gelöscht.

## Sicherung und zusätzliche Uploadsperre

Lokaler Implementierungscommit: `d3115224fe007697c39824b0a6a49691b9aa3a07` (der Nachtrag zu diesem Abschnitt wird separat lokal gesichert). Der Versuch, den neuen Entwicklungsbranch zu `https://github.com/hamthor-web/memory-sammlung.git` hochzuladen, wurde durch die automatische Freigabeprüfung abgelehnt. Begründung der Prüfung: Repository/Ziel und konkreter externer Upload seien nicht ausdrücklich zur Veröffentlichung freigegeben. **Kein erfolgreicher Push, kein Pull Request und keine Live-Veröffentlichung werden behauptet.** Für den nächsten Versuch ist die ausdrückliche Freigabe zum Upload des Entwicklungsbranches mit Code, Baumgrafiken, Tests und Dokumentation erforderlich. Der Upload soll `main` und die Live-App nicht ändern.

Ein ZIP mit allen neuen bzw. geänderten Dateien und diesem Spielakten-/Master-Nachtrag wird zur Fortsetzung bereitgestellt. Die noch offene Browserfreigabe ist davon unabhängig.
