# Eigenschaften-Memory – Puzzle-Belohnung

Stand: 09.11.2026 · Projekt Lesespiele – Entwicklung und Verwaltung.
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
