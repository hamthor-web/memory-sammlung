# Eigenschaften-Memory – Puzzle-Belohnung

Stand: 09.11.2026 · Korrektur zum selbstständigen Puzzeln siehe letzter Abschnitt. Projekt Lesespiele – Entwicklung und Verwaltung.
Repository: https://github.com/hamthor-web/memory-sammlung
Spiel: Eigenschaften merken und finden (`eigenschaften.html`).

Dieser Nachtrag aktualisiert die Eigenschaften-Spielakte und den zugehörigen Masterstatus. Die früheren Originalakten und Entwicklungsstände bleiben als Historie erhalten. Maßgebliche Ausgangsquellen: Memory-Sammlung-Spielakte (mit Nachträgen bis 07.11.), Tagesdokumentation 07.11., verbindliche Gestaltungsrichtlinien und der tatsächliche Repository-Stand `1727576c81b8b86666e8b86d2cbf78ce6f12ffd4`.

## Ergänzung 09.11.2026 – Knurpsel

Auf Heikes Wunsch kommt das bereits erstellte **Knurpsel-Puzzle mit sechs Originalteilen** als achtes Motiv hinzu. Es steht bei eigener Auswahl, Zufallsauswahl, Fortsetzung und in „Meine Puzzle ansehen“ zur Verfügung. Die Originalkonturen und das vollständige Knurpselbild werden übernommen. Vorhandene Profil-Fortschritte und Vergabebelege behalten ihre IDs und Teilestände. Die Regeln für Belohnungen und Zweispielermodus gelten unverändert. Die Offline-Liste enthält jetzt 465 Produktionsdateien.

## Bestätigte Entscheidung vom 09.11.2026

Puzzles dienen im Einzelspiel als Bestätigung und Motivation nach einem vollständig beendeten Durchgang. Leicht bringt ein neues Teil, Knifflig zwei, Sehr knifflig drei. Ein Abbruch bringt kein Teil. Fortschritt gehört zum jeweiligen Kind, anhand seiner vorhandenen Profil-ID. Beim nächsten Einstieg lassen sich begonnene Puzzles fortsetzen. Im Zweispielermodus bleibt es bei der bisherigen Anzeige der gefundenen Karten und der Spielerauswertung; es gibt keine Puzzle-Belohnung.

Ablauf: Durchgang fertig → vorhandene Abschlussanimation → „Prima!“ oder wechselnder Jubeltext mit Konfetti → neue Teile werden farbig → „Bald ist dein Bild fertig! Noch ein Spiel?“ → Button „Zur Spielauswahl“. Bei vollständigem Bild lautet die Rückmeldung entsprechend „Dein Bild ist fertig!“.

Drei große Schaltflächen im Spielmenü, angelehnt an die Auswahl in „Verrückt gesucht!“:

1. Puzzle selbst wählen: Motivauswahl mit gespeichertem Teilestand.
2. Zufallspuzzle: zufällige Auswahl aus den noch nicht fertigen Motiven.
3. Puzzle fertigstellen: Auswahl aller begonnenen Bilder; deaktiviert und grau, wenn kein angefangenes Bild vorhanden ist.

Zusätzlich „Meine Puzzle ansehen“: alle Motive in einer Galerie; fertige Bilder farbig und vergrößerbar, noch nicht fertige Bilder vollständig grau mit Angabe des Teilestands.

## Umsetzung und ergänzende technische Entscheidungen

- Die sieben Motive aus `Puzzles_7_Motive_je_6_Teile.zip` werden mit ihren Original-Puzzlekonturen verwendet: Birne, Huhn, Hund (Foto), Hund mit zwei Nasen, bunter Schmetterling, Schmetterling (Foto), Sofa/Couch. Jedes Bild hat sechs Teile. Keine Beschnitte oder verzerrten Proportionen; WebP-Dateien reduzieren den Speicherbedarf.
- Farbige Teile erscheinen an ihrer passenden Stelle über einer grauen Bildvorlage. Ein Drag-and-drop-Puzzle ist nicht Bestandteil dieses Belohnungsauftrags.
- Der Motivwechsel löscht keine bereits gesammelten Teile. Angefangene Motive sind einzeln fortsetzbar.
- Wenn mehr Teile verdient werden, als beim gewählten Bild noch fehlen, gehen übrige Teile ins nächste noch offene Motiv. Die Abschlussansicht zeigt dann beide betroffenen Bilder. Wenn alle acht Bilder fertig sind, meldet die App dies; weitere Spielrunden bleiben möglich.
- Eine eindeutige Kennung pro Runde verhindert doppelte Vergabe beim Wiederherstellen desselben Abschlusses.
- Unterbrochene letzte Lese-/Animationsphasen werden über den vorhandenen Runden-Checkpoint fortgesetzt. Eine schon abgeschlossene Runde wird nicht nachträglich wieder als offene Runde gespeichert.
- Puzzle-Fortschritt liegt im vorhandenen lokalen Profil-Fortschritt unter `propertyPuzzles`, getrennt von den Fortschrittsgeschichten aus „Verrückt gesucht!“. Die vorhandene Sicherung nimmt diesen Profilbestand mit auf. Lokale Speicherung bedeutet keine automatische Synchronisierung zwischen Geräten.
- Vor Einführung der Puzzle-Funktion gespeicherte Runden besitzen noch kein zugeordnetes Motiv; die Abschlussansicht erklärt, dass neue Teile ab der nächsten Runde gesammelt werden.
- Separate Spielfeldgrößenregelung ergänzt; Schrift und Spielfeld beeinflussen sich nicht gegenseitig. Große Auswahlbuttons ohne dehnbare Dekoration, scrollbar erreichbare Inhalte und Dialoge für Smartphone/Tablet in beiden Ausrichtungen.

Technische Dateien: `puzzle-data.js`, `puzzle-store.js`, `property-puzzles.js`, `property-puzzles.css`, `assets/puzzles/`, ergänzte Einbindung in `eigenschaften.html` und `app.js`. Die erzeugte Offline-Dateiliste enthält sämtliche neuen Dateien und Bilder.

## Prüfstand

Die lokalen Logikprüfungen für 1/2/3 Teile, Profiltrennung, doppelte Abschlüsse, Abbruch, Zweispielerausschluss, Restteile und Speicherfehler sind bestanden. Die bestehenden Prüfungen von Karten-/Fragenlogik, Profilen, Sicherungen, Produktionspaket und Offline-Dateien sind ebenfalls bestanden.

Der gezielte Browserlauf ist bestanden: alle drei Belohnungsstufen, finale Lesebestätigung, Abbruch/Fortsetzung, keine doppelte Vergabe, Galerie, Profilwechsel und Zweispielerwertung. Handy 393×852 und 852×393 sowie Tablet 768×1024 und 1024×768 CSS-Pixel geprüft, auch mit 200 % Schriftgröße; Schrift- und Spielfeldzoom über die echten Bedienelemente unabhängig geprüft. Bildschirmansichten der Abschlussseite und Motivauswahl visuell gesichtet. Der Sicherungs-Rundlauf bewahrt Teilestände und Vergabebelege.

Geprüfter Code-Commit: `ea4cdcceab0b55606bcd46ca798c71d1ae3f4b1d`. Gezielter Browserlauf: https://github.com/hamthor-web/memory-sammlung/actions/runs/42610124461. Offline-Fingerprint: `v74-12ff9e13fc64b865`, 464 Produktionsdateien. Auch der vollständige Sammlungstest ist bestanden: https://github.com/hamthor-web/memory-sammlung/actions/runs/42610124431. Er umfasst die vier Spiele, Navigation, Lesefenster, Profile, Rundenfortsetzung, Galerie-/Geschichtenversionen, alle elf Fortschrittsgeschichten sowie den ersten Offline-Einstieg. Der geprüfte Stand wird zusammen mit diesem Nachtrag nach `main` übernommen. Eine tatsächliche Freigabe auf Heikes Smartphone und Tablet bleibt ergänzend erforderlich.

## Masterübersicht – aktualisierter Eintrag

Eigenschaften-Memory / Fühlmemory: Puzzle-Motivation für Einzelspieler eingebaut, acht Bilder mit je sechs Teilen, Belohnung 1/2/3 Teile nach vollständigem Durchgang. Drei Menüwege zur Puzzlewahl, Galerie mit grauen offenen und farbigen fertigen Motiven, lokaler Fortschritt pro Kinderprofil, keine Belohnung bei Abbruch oder im Zweispielermodus. Separate Spielfeld- und Schriftgrößenregelung. Status: technische Umsetzung mit bestandenen Logik-/Paketprüfungen; gezielte Browserprüfung und vollständiger Sammlungstest bestanden, Übernahme in die Hauptversion; echte Geräteabnahme offen. Andere Spiele und deren Belohnungsregeln bleiben erhalten.

Knurpsel-Ergänzung: Code `eb61e46f5f9e5551138a7a6d0a151686a7fb1119`, Offline-Fingerprint `v74-96055de56337dddc`. Logik-, Sicherungs- und Offlineprüfungen bestanden. Bestandener gezielter Browserlauf inklusive acht Motiven und Knurpsel nach drei bzw. sechs Teilen: https://github.com/hamthor-web/memory-sammlung/actions/runs/42611319896.

Auch der vollständige Sammlungstest mit allen acht Motiven ist bestanden: https://github.com/hamthor-web/memory-sammlung/actions/runs/42611319847. Der erste Knurpsel-Deploy blieb im Veröffentlichungsschritt stehen; ein erneuter Veröffentlichungslauf wird durch diesen Dokumentationsnachtrag angestoßen. Vorhandene Online- und Offline-Fortschritte werden dabei nicht verändert.

## Verbindliche Korrektur 09.11.2026 – Kind setzt das Puzzle selbst zusammen

Heike bestätigt nach Ankunft der Bilder: Die leere Puzzlefläche bleibt vollständig leer. Es gibt dort weder ein graues Vorlagenbild noch Konturen, Raster, Schatten der fehlenden Teile oder andere Zielmarkierungen. Verdiente Originalteile erscheinen ungeordnet auf der Fläche. Das Kind setzt das Puzzle selbst zusammen. Diese Entscheidung ersetzt ausdrücklich die oben beschriebene automatische Platzierung über einer grauen Vorlage und die frühere Einschränkung „kein Drag-and-drop“.

Umgesetzt: Freies Verschieben mit Maus oder Finger; alternativ Teil antippen und anschließend gewünschte Stelle antippen sowie Pfeiltastenbedienung. Passende Nachbarteile rasten an beliebiger Stelle des Tisches zusammen; verbundene Teile werden gemeinsam verschoben. Die Originalkonturen und die Proportionen aller acht Motive bleiben erhalten. Noch nicht verdiente Teile werden überhaupt nicht gezeichnet. Erst sechs tatsächlich verbundene Teile ergeben ein fertiges Bild; sechs gesammelte Teile allein gelten nicht als zusammengesetzt.

Der Legestand einschließlich frei liegender Teile wird pro Kinderprofil in `propertyPuzzles.layouts` gesichert und über die vorhandene Profil-Sicherung mitgenommen. Bereits verdiente Teile und Vergabebelege bleiben erhalten. Bestehende vollständig gesammelte Bilder können erstmals selbst zusammengesetzt werden. Die Regeln für 1/2/3 neue Teile je abgeschlossener Einzelspielrunde, Abbruch und Zweispielermodus bleiben bestehen.

Nach dem Rundenabschluss ist das Puzzle direkt bedienbar. Im Menü führt „Puzzle zusammensetzen“ zum großen Tisch; „Puzzle fertigstellen“ schließt auch Bilder mit sechs gesammelten, aber noch nicht zusammengesetzten Teilen ein. Die Galerie öffnet alle Motive mit vorhandenen Teilen. Puzzlegröße und Schriftgröße bleiben getrennt. Vergrößerte Tische sind im eigenen Bereich scrollbar.

### Masterübersicht – neuer maßgeblicher Eintrag

Eigenschaften-Memory: Puzzle-Belohnung mit acht Motiven à sechs Teilen. **Jetzt selbst zusammensetzbares Puzzle mit ungeordneten Originalteilen auf leerer Fläche ohne Vorlage oder Zielkonturen.** Freie Kantenverbindungen, gemeinsam verschiebbare Teilgruppen, gespeicherter Legestand je Kind, eigene Puzzlegrößenregelung. Belohnungsregeln und frühere Fortschritte bleiben erhalten. Prüfung und Veröffentlichung: siehe abschließender Prüfnachtrag dieses Abschnitts.

### Abschließender Prüfstand der Korrektur

Gezielter Browserlauf bestanden: https://github.com/hamthor-web/memory-sammlung/actions/runs/42641596183 (Code `363ecd841d4af218d1ef21a6f5c66eae8c81994e`). Geprüft wurden vollständig leere Flächen ohne Bild-/Konturelemente, sechs ungeordnet liegende Originalteile, Zusammensetzen mit echten Maus- und Touch-Eingaben, Wiederherstellung nach Neuladen, Fertigmeldung nach Verbindung und die vier Formate 393×852, 852×393, 768×1024 und 1024×768 mit 200 % Schrift- und Spielfeldgröße. Die bestehenden Puzzleprüfungen für alle Belohnungsstufen, Knurpsel, Abbruch/Fortsetzung, Profilwechsel und Zweispielerausschluss sind ebenfalls bestanden. Bildschirmansichten wurden visuell gesichtet.

Vollständiger Sammlungstest des identischen Produktionsstands bestanden: https://github.com/hamthor-web/memory-sammlung/actions/runs/42641282407 (Produktionscode `879c5665a23986cc0ee823dc4b9bd1a765899a7f`; nachfolgend nur Touch-Testablauf und Dokumentation ergänzt). Er umfasst alle vier Spiele, Navigation, Lesefenster, Profile, Sicherungen, Fortsetzungen, sämtliche elf Fortschrittsgeschichten und den ersten Offline-Einstieg. Lokale Prüfungen einschließlich Sicherung/Wiederherstellung des Legestands, Produktionspaket und Offline-Dateiliste bestanden. Fingerprint: `v74-745c486f43323848`, 465 Produktionsdateien. Der geprüfte Stand wird in die Hauptversion übernommen. Eine Prüfung auf Heikes echten Geräten bleibt ergänzend offen.

### Letzte Nachbesserung – zufällige Verteilung und Fingerbedienung

Die Startpositionen werden nun frei über den gesamten Tisch ausgelost, mit möglichst wenig Überdeckung; es gibt keine festen Ablagereihen. Gespeicherte Teile bleiben an ihrer bisherigen Stelle. Jeder Puzzletisch öffnet oben bei Titel und Größenreglern. Beim Ziehen eines Teils wird die Berührung von der normalen Seiten-Scrollbewegung getrennt, damit vertikale Fingerbewegungen das Ziehen nicht abbrechen.

Auch dieser letzte Produktionsstand wurde im gezielten Browserlauf vollständig bestanden: https://github.com/hamthor-web/memory-sammlung/actions/runs/42642661329, Code `35f26948ea2d502269d3653eeae9e547f468221c`, Offline-Fingerprint `v74-b536726f73a417e7`. Die oben genannten Prüfungen für leere Fläche, Originalteile, Maus/Finger, gespeicherten Legestand, Fertigmeldung, vier Formate und beide Zooms sind dabei erneut bestanden. Spielakte und Masterstatus gelten mit diesen Nachbesserungen. Der Veröffentlichungsauftrag wird über die Hauptversion ausgeführt; GitHub Pages war beim letzten Abruf noch in Bearbeitung.


## Aktualisierungsabbruch – 09.11.2026

Heike meldet: Aktualisierung wegen langer Ladezeit abgebrochen; erneute Aktualisierung nicht abrufbar, neuer Puzzle-Stand fehlt auf ihrem Gerät. Die öffentliche Seite enthält bereits den Puzzle-Stand; der lokale Offline-Stand ist damit nicht gleichzusetzen.

Ergänzt: eigenständige Seite `aktualisieren.html`, erreichbar über direkten Link und künftig über „App verwalten“. Sie fordert eine neue Installation an, zeigt die geladenen Dateien, bietet bei Fehler oder ausbleibendem Fortschritt erneut einen aktiven Versuch und öffnet nach vollständiger Installation die Spielauswahl. Keine Löschung von Kinderprofilen, Spielständen oder Sicherungen. Der alte aktive Stand bleibt bis zur vollständigen Installation bestehen. Teilweise geladene Dateien derselben per Fingerprint bezeichneten Version werden beim erneuten Versuch weiterverwendet; jede Datei besitzt eine Zeitgrenze. Der normale Aktualisierungsbutton wird nach spätestens 15 Sekunden wieder bedienbar.

Masterstatus: Puzzle-Funktion bereits veröffentlicht; Wiederherstellung abgebrochener Offline-Aktualisierungen ergänzt. Lokale Logikprüfung für abgebrochenen Download, Wiederaufnahme nur der fehlenden Datei und Erhalt der aktiven Version bestanden. Produktionspaketprüfung bestanden. Gezielte Browserprüfung bestanden: absichtlich unterbrochener Download, aktiver erneuter Versuch, vollständige Installation, automatische Rückkehr zur Spielauswahl und unveränderte lokale Testdaten. Prüflauf: https://github.com/hamthor-web/memory-sammlung/actions/runs/42649849303. Abnahme auf Heikes betroffenem Gerät offen.


## Nachbesserung nach erneutem Hängen – 09.11.2026

Heike meldet nach etwa 15 Minuten weiterhin nur eine Aktualisierungsanzeige ohne Dateizähler. Die genaue Ursache auf ihrem Gerät lässt sich daraus noch nicht bestimmen. Der bisherige Downloadumfang bei jeder neuen Version betrug rund 116 MB.

Neue technische Fassung: Für jede Produktionsdatei wird eine SHA-256-Prüfsumme erzeugt. Der neue Service Worker prüft vorhandene Dateien früherer Versionen und übernimmt sie nur bei identischer Prüfsumme. Veränderte und fehlende Dateien werden neu geladen. Alte aktive Version und Profil-/Legestände bleiben bis zur vollständigen Installation erhalten.

Neue Reparaturadresse `aktualisierung-retten.html`, sichtbar bezeichnet als „Aktualisierung retten · Version 2“: eigener Dateizähler, verstrichene Sekunden und erneuter Versuch nach 45 Sekunden ohne Fortschritt. Der bisherige Reparaturpfad erhält ebenfalls diese Fassung; der neue Pfad vermeidet eine zwischengespeicherte alte Reparaturseite. Auch die Aktivierungsphase besitzt jetzt eine Zeitgrenze für eine bedienbare Rückmeldung.

Masterstatus: Wiederverwendung unveränderter Dateien über Versionswechsel ergänzt. Lokale Prüfungen bestätigen Wiederaufnahme, Übernahme identischer Altdaten, Neuladen geänderter Dateien und vollständige Offline-Dateiliste. Gezielte Browserprüfung bestanden: Abbruch und erneuter Versuch, neue Version mit vorhandener Altversion, keine erneuten Bild-/Videoanforderungen durch den Service Worker, vier Formate und Erhalt lokaler Testdaten. Prüflauf: https://github.com/hamthor-web/memory-sammlung/actions/runs/42662437520. Rückmeldung von Heikes betroffenem Gerät bleibt offen.
