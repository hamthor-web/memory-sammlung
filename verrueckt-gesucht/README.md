# Verrückt gesucht! – Lesen und Bilder finden

Spielversion 2026-10-11: vollständiger Lese- und Suchspielprototyp mit 120 Bildkarten in 20 Motivgruppen, drei Schwierigkeitsstufen sowie Pfau, Baum, Knurpsel und Rakete als Fortschrittsanzeige.

## Spielen

`index.html` ist der Einstieg. Alle Bilder liegen im Unterordner `assets/`; die Dateien benötigen keinen Build-Schritt und keine Bibliotheken. Für einen lokalen Webserver im Repository `python3 -m http.server 8000` starten und `http://localhost:8000` öffnen. Das Spiel benötigt keine KI und keine Online-Abfragen während der Runde. Diese Fassung richtet keine App-Installation oder Service-Worker-Zwischenspeicherung ein.

## Ablauf

6, 8, 10 oder 12 Karten; zehn Aufgaben pro Runde. Für jede Aufgabe wird eine neue passende Kartenauslage zusammengestellt. Einfach: ein Merkmal. Mittel: zwei Merkmale. Schwer: zwei Merkmale und der Ausschluss einer dritten Eigenschaft. Die Frage hat genau eine passende Antwort; alle abgefragten Merkmale sind für die Auswahl notwendig. 1080 Grundaufgaben mit 7560 unterschiedlichen Formulierungen.

Eine richtige Antwort ergänzt genau ein Detail am Pfau oder Baum. Fehler ergänzen keines. Bereits verdiente Teile bleiben sichtbar und fliegen nicht erneut ein. Nach jeder richtigen Antwort bleibt die Figur groß, bis sie oder Weiter angetippt wird. Erst danach kann die nächste Aufgabe gewählt werden. Nach Aufgabe zehn führt das Antippen zum Rundenabschluss.

Der Pfau verwendet sieben von acht Federplätzen, zwei Schmuckplätze und einen Schuhplatz pro Runde. Kopf: Krone, Zipfelmütze oder Kopfschleife. Gesicht: Brille oder schielende Augen. Hals: rote Schleife. Füße: Regenbogenstiefel, gelbe Stiefel, Rollschuhe, Stiefel mit Spritzern oder rote Schuhe. Die Beine bleiben erhalten; nur der untere Zehen-/Krallenbereich wird bei Schuhen ausgeblendet. Geometrie und Rundenplanung sind fest. Die 13 zusätzlich vorhandenen Federbilder bleiben Entwicklerbestand und werden noch nicht im Spiel eingesetzt.

## Dateien

- `data.js`, `card-plan.json`: Bildkarten und verbindliche Motivmerkmale; die Mädchen bleiben Entwurf.
- `engine.js`, `questions.json`: Fragenmatrix und Auslagenerzeugung.
- `app.js`: Spielablauf.
- `pfau-art.js`, `pfau.js`, `tree-art.js`, `tree.js`: Bilder, Positionen und Belohnungen.
- `assets/`: unveränderte optimierte Bilddaten aus der freigegebenen Spielversion, als einzelne Dateien statt eingebettet.
- `docs/PFAU_SPIELVERSION.md`: aktueller Pfau-Stand.
- `docs/PFAU_SLOTS.md`: historische Referenz des früheren Bestands.

## Prüfung

`node test_engine.cjs` prüft 1080 Fragen, 7560 Formulierungen und 2520 Kartenauslagen.
`node test_tree.cjs` prüft 1000 Baumpläne, 1000 Pfaupläne und 24 vollständige simulierte Spielrunden einschließlich Fehlversuchen, Doppelklicks, Variantenwahl, erhaltenen Beinen, dauerhaften Teilen und Abschlussanzeige. Bilddateien und lokale Bildverweise sind zusätzlich geprüft. Kein automatisierter Browser-/Gerätetest verfügbar.

## Knurpsel

Als dritte Fortschrittsfigur wählbar. Ein Startbild und zehn feste Bildstufen aus Heikes ZIP: Punkte, Nasenklingel, kleine Ohren, großes Ohr, Flügel, gelbe Flosse, blaue Flosse, Propeller, Leuchtbauch mit Augenglas, Nebel mit Mondgesicht. Originalbilder bleiben unverändert und werden auf einer einheitlichen weißen Fläche angezeigt. Beim Wechsel schrumpft und verschwimmt das alte Bild; das neue wächst und wird scharf (eine Sekunde). Bei reduzierter Bewegung wird der Wechsel ohne Animation gezeigt. Danach bleibt die Figur unbegrenzt groß, bis Weiter oder das Bild angetippt wird. Nach Stufe zehn bleibt das fertige Monster bis zum manuellen Rundenabschluss sichtbar.

`knurpsel.js` nutzt den gemeinsamen Fortschrittszähler und Dialog. `assets/knurpsel/stufe-00.png` bis `stufe-10.png` sind die elf Bilder. `node test_knurpsel.cjs` prüft zwölf vollständige Runden (alle Kartenzahlen und Schwierigkeitsstufen), Fehlversuche, Doppeltipps, Tastaturbedienung, Betrachtungspausen, Abschluss und Abbruch. Die bisherigen Tests für Pfau, Baum und Fragenmatrix bestehen weiterhin. Kein Browser-/Gerätetest verfügbar.

## Rakete

Vierte auswählbare Fortschrittsfigur mit zehn Originalbildern aus dem Raketenpaket. Vor der ersten Lösung erscheint ein Fragezeichen, danach nach Aufgabe n genau `assets/rakete/rakete-nn.png`. Die Bildfolge bleibt fest: Rakete, Flamme, erstes Auge, zweites Auge, Mund mit Zunge, großer Haken, Leiter, Astronaut, Sternschnuppe, Sternenhimmel. Ein 650-ms-Übergang lässt das vorige Bild schrumpfen und verschwimmen und das nächste wachsen. Alle Bilder werden vollständig und unverzerrt in einer quadratischen Fläche angezeigt. Nach dem Bildwechsel bleibt die Anzeige ruhig und wartet auf Weiter oder das Antippen des Bildes. Auch der Sternenhimmel nach Aufgabe zehn bleibt bis zum manuellen Abschluss sichtbar.

`rakete.js` nutzt den vorhandenen Knurpsel-Bildfolgencontroller mit eigener Bildfolge, Dauer und Beschriftung. `rakete-fortschritt.json` beschreibt die Originalfolge. Kein Service Worker vorhanden. `node test_rakete.cjs` prüft alle zwölf Kombinationen von Schwierigkeit und Kartenzahl, die zehn Bildstufen, die leere Ausgangsanzeige, falsche Antworten, Doppeltipps, Betrachtungspausen, Tastatur, Abschluss und Abbruch. Alle bisherigen Tests bestehen weiterhin. Die Darstellung wurde anhand der Bilder und des Layoutcodes geprüft; kein Browser-/Gerätetest verfügbar.

Rakete und Knurpsel verwenden zwei Sekunden pro Bildwechsel. Die Zwischenbilder erscheinen ohne Überschrift. Nur am Ende steht „Deine Rakete ist jetzt fertig.“ beziehungsweise „Dein Knurpsel ist jetzt fertig.“ Die Anzeige bleibt bis zum Weiterklicken sichtbar.

## Matschwiese

Fünfte Fortschrittsgeschichte: zehn unveränderte JPEG-Bilder in fester Reihenfolge. Vor jedem Wechsel bleibt das vorherige Bild im großen Dialog volle zwei Sekunden unverändert sichtbar, auch bei reduzierter Bewegung. Danach 1,5 Sekunden sanfte Überblendung. Das neue Bild bleibt bis Weiter oder bewusstem Antippen sichtbar. Keine erklärenden Zwischenüberschriften; nur zum Abschluss „Deine Matschgeschichte ist jetzt fertig!“. Die gemeinsame Steuerung gibt auch Knurpsel und Rakete die Betrachtungspause von zwei Sekunden und blendet deren Zwischenüberschriften aus. Pfau und Baum zeigen ihre Überschriften weiterhin.

`node test_matschwiese.cjs` prüft zwölf Runden, Reihenfolge, Titel, manuelle Betrachtung, Fehlversuche, Mehrfachtipps, Tastatur, Abschluss und Abbruch.

## Unterwasserwelt

Zusätzliche Fortschrittsauswahl mit zehn Bildstufen. Start: Fragezeichen; die erste Lösung zeigt das leere Meer, die zehnte die offene Schatztruhe. Das bisherige Bild bleibt im Dialog zwei Sekunden unverändert stehen. Danach überblenden die ausgerichteten Bilder zwei Sekunden lang. Das neue Bild bleibt bis zum Antippen von Weiter sichtbar. Nur am Ende erscheint „Du hast den Schatz gefunden!“. Die Originalbilder wurden mit 1000 × 1000 Pixeln als WebP gespeichert. `node test_unterwasserwelt.cjs` prüft die vollständigen Runden und den Ablauf mit kontrollierten Timern.

## Baumhaus

Weitere Fortschrittsgeschichte mit zehn Originalseiten aus Heikes Canva-Serie. Vor der ersten Lösung erscheint ein Fragezeichen. Danach zeigen zehn Lösungen der Reihe nach den Baum, die Plattform, das alte Haus, Fenster und Blumen, Leiter, Tier auf der Leiter, Beleuchtung, Eule, Vögel und Sonne. Die Bilder bleiben vollständig und unverzerrt in der großen Anzeige. Das vorige Bild bleibt zunächst zwei Sekunden stehen; anschließend folgt eine ruhige zweisekündige Überblendung. Weitergehen erfolgt ausschließlich durch Antippen. Nur am Ende erscheint „Dein Baumhaus ist jetzt fertig!“. Alle Bilder liegen verlustfrei als WebP mit 1000 × 1000 Pixeln unter `assets/baumhaus/`.

`node test_baumhaus.cjs` prüft neun Runden, Bilddateien und Reihenfolge, Fehlversuche, Doppeltipps, Betrachtungspause, Überblenddauer, Tastaturbedienung, Abschluss und Abbruch.

## Chaos im Kinderzimmer

Weitere Fortschrittsgeschichte mit zehn Originalseiten aus Heikes Canva-Serie (DAHXvVnCyJc). Vor der ersten Lösung erscheint ein Fragezeichen. Die zehn Lösungen zeigen das Zimmer, den Wirbelsturm, das herumfliegende Chaos, die braune Pfütze, grünen Schleim, die Spinne, ein riesiges Eis, das schlafende Kind mit Traumblase, die Fee im dunklen Zimmer und das wieder ruhige Zimmer. Die 1000 × 1000 Pixel großen Originalbilder liegen verlustfrei als WebP unter `assets/kinderzimmer/`. Zwei Sekunden Betrachtung des vorigen Bildes, danach zwei Sekunden sanfte Überblendung in großer unverzerrter Darstellung. Das neue Bild bleibt bis Weiter oder bewusstem Antippen stehen. Nur nach der zehnten Lösung erscheint „War das alles nur ein Traum?“.

`node test_kinderzimmer.cjs` prüft neun vollständige Runden, feste Bildfolge, Fehlversuche, Doppeltipps, Betrachtungspausen, Abschluss, Tastaturbedienung und Abbruch sowie die beiden Übergangszeiten.

## Wundereiche

Zehn überarbeitete Canva-Seiten (DAHXxx3zRx0) erzählen vom Wachstum einer Eichel: Eichel, Erde, Winter, Keimling, Pflanze, junger Baum, großer Baum, Eichhörnchen im Baum, Eichhörnchen beim Vergraben und Sonne über den vergrabenen Eicheln. Eigene Auswahl „Die Wundereiche“. Vor der ersten Lösung erscheint ein Fragezeichen. Zwei Sekunden Betrachtung des vorigen Bildes, anschließend zwei Sekunden Überblendung; das neue Bild bleibt bis zum Antippen stehen. Große, vollständige quadratische Darstellung. Nur am Ende erscheint „… und jetzt entsteht etwas Neues. Bist auch du bereit?“.

## Blumenwiese (12.10.2026)

Zehn freigegebene Canva-Bilder zeigen den Vogel, das fallende Teilchen und die wachsende Blume bis zum Kind neben der Blüte. Die Folge steht in der manuellen Auswahl und im Zufallszyklus ohne Wiederholungen bereit. Nach Abschluss erscheint sie in „Meine Bilder noch einmal ansehen“. Vor jedem Bildwechsel bleibt die vorherige Stufe zwei Sekunden sichtbar; danach folgt der ruhige zweisekündige Übergang. Das große Bild bleibt bis zum Antippen stehen. Weiter öffnet direkt die nächste Aufgabe. Abschlusstext: „Aus etwas Kleinem ist etwas Schönes gewachsen!“

## Ruhige Überblendungen (12.10.2026)

Alle neun Bildfolgen verwenden dieselben Übergänge: Das vorherige Bild verblasst, während gleichzeitig das nächste bei unveränderter Größe sichtbar wird. Es gibt keine Zoombewegung oder Unschärfe. Die bisherigen Betrachtungspausen und Übergangsdauern bleiben erhalten. Beim Pfau und beim verrückten Baum erscheinen neue Elemente ebenfalls ohne Größenänderung direkt an ihrem vorgesehenen Platz.

## Galerie zum Durchblättern (12.10.2026)

„Meine Bilder noch einmal ansehen“ spielt fertige Geschichten ab dem Anfang erneut ab. Ein Antippen des Bildes oder „Nächstes Bild“ blendet zur folgenden Stufe über. „Vorheriges Bild“ geht zurück; am Ende startet „Noch einmal von vorn“ die Folge erneut. Ohne Antippen bleibt das Bild stehen. Die Galerie verändert weder den Spielfortschritt noch den Zufallszyklus. Neue Pfau- und Baumrunden speichern jede Zwischenstufe in der verdienten Reihenfolge. Bereits gespeicherte Bildfolgen verwenden ihre Originalbilder; ältere Pfau-/Baumbilder werden aus der Reihenfolge ihrer vorhandenen Elemente rekonstruiert.
