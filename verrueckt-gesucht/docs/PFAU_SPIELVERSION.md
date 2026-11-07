# Fortschrittspfau im Spiel „Verrückt gesucht!“

Zehn Aufgaben pro Runde; 6/8/10/12 Karten je Aufgabe. Richtige Antworten ergänzen genau ein Teil; Fehler und Doppelklicks ergänzen keines. Pfau ist Standard, Baum bleibt wählbar.

## Aktuelles Layout 5

Sieben von acht Federplätzen, zwei von drei Schmuckplätzen und ein Schuhplatz werden einmal pro Runde ausgewählt. Federkiele sitzen an festen anatomischen Ansatzpunkten hinter dem Vorderkörper; deren Pivotwerte stehen in dist/pfau-art.js. Originalpositionen sind unter originalSlots dokumentiert. Die 13 zusätzlichen Federn sind als transparente, verlustfrei gespeicherte WebP-Dateien im assets-Ordner aktiv. Pro Runde werden vier zusätzliche und drei bisherige Federn ohne Wiederholung zufällig auf sieben von acht Plätzen verteilt. Auswahl und Ansatzpunkte bleiben während der Runde fest. Alle Federn sind gegenüber der ersten Vorschau zweimal um 5 % vergrößert (Faktor 1,1025). Für jede zusätzliche Feder sind acht passende Positionen, Drehungen und Pivotwerte hinterlegt.

Heikes hochgeladene Krone sowie Regenbogenstiefel, gelbe Stiefel, Rollschuhe und Stiefel mit Spritzern ersetzen die entsprechenden bisherigen Bilder. Weiße Hintergründe wurden mit Bildbearbeitung freigestellt. Die PNG-Fassungen liegen in entwicklung/pfau-zubehoer; optimierte transparente WebP-Bilder sind in pfau-art.js eingebettet. Krone und jede Schuhvariante besitzen eigene Position, Größe und Pivotwerte. Der einzelne Stiefel mit Spritzern wird zweimal, links gespiegelt, eingesetzt. Pro Runde wird genau eine der fünf Schuhvarianten gewählt und bleibt fest. Grundbild und Vorderkörper bleiben die Originalbilder mit vollständigen Beinen. Eine CSS-Polygonmaske blendet ausschließlich den unteren Zehen-/Krallenbereich zwischen x=36–66 % ab y=89,2 % aus. Die bisherigen Fassungen ohne Füße werden nicht mehr benutzt. Schuhvarianten sind etwas kleiner und tiefer an den vollständigen Unterschenkeln befestigt.

Bereits verdiente Teile behalten ihre DOM-Knoten. Nach dem Einflug wird pfau-flight entfernt und animation:none gesetzt, bei der doppelten Stiefelvariante für beide Bilder. Beim Vergrößern und Verkleinern fliegen alte Teile nicht erneut ein. Nach jeder richtigen Antwort bleibt das Fortschrittsbild groß, bis das Kind es antippt oder Weiter wählt. Es schließt nie zeitgesteuert. Antippen während des Einflugs schließt es noch nicht. Das gilt für Pfau und Baum; nach Aufgabe zehn führt das Antippen zum Rundenabschluss.

## Prüfung

node test_engine.cjs: 1080 Grundaufgaben, 7560 Formulierungen und 2520 Kartenauslagen.
node test_tree.cjs: 1000 Baumpläne, 1000 Pfaupläne und 24 vollständige simulierte Spielrunden. Alle fünf Schuhvarianten, feste Rundenplanung, Fehler, Doppelwahl, Ebenenwechsel, beständige Teile, abgeschaltete Animationen beider Stiefel, Abschluss und Neustart geprüft.

Statische Zusammensetzung aller fünf Schuhvarianten mit der neuen Krone visuell geprüft. Kein Browser- oder Gerätetest in dieser Umgebung verfügbar.

## Zusätzliche aktive Elemente

Kopfplatz: Krone, Zipfelmütze oder Kopfschleife. Gesichtsplatz: Brille oder schielende Augen. Halsplatz: bestehende Halsschleife. Pro Runde werden zwei der drei Plätze gewählt, Varianten und Plätze bleiben innerhalb der Runde fest. Der Fußplatz wählt Regenbogenstiefel, gelbe Stiefel, Rollschuhe, Stiefel mit Spritzern oder rote Schuhe. Zehn Fortschrittsschritte bleiben unverändert. Alte Beinbilder werden nicht ausgeschnitten oder verändert; nur die Krallenmaske ist Code. Die schielenden Augen überdecken die originalen Augen.

