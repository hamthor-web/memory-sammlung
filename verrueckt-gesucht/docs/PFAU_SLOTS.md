# Belohnungspfau – verbindlicher Entwicklungsstand

**Kein eigenständiges Pfau-Spiel.** Bestandteil des Lese- und Suchspiels „Verrückt gesucht!“.

## Alte, manuell eingestellte Referenzpositionen
Historische Werte, deren Koordinatenbezug ohne ursprünglichen Code noch nicht verifiziert werden kann. Nicht stillschweigend als endgültige Pixelkoordinaten interpretieren.

| Feder | x (%) | y (%) | scale | Drehung (Grad) |
|---|---:|---:|---:|---:|
| f1_regenbogen | 30.1 | 61.7 | .295 | -120 |
| f2_gold | 33.7 | 55.7 | .345 | -83 |
| f3_sterne | 47.8 | 36.6 | .330 | -67 |
| f4_kariert | 41.7 | 41.3 | .330 | -88 |
| f5_violett_auge | 75.5 | 67.3 | .295 | 36 |
| f6_tuerkis | 68.1 | 51.7 | .325 | 1 |
| f7_spirale | 70.9 | 79.2 | .310 | 62 |
| f8_gestreift | 74.5 | 60.9 | .305 | 17 |

Weitere Referenzen:
- Krone: x=49.6, y=23.6, scale=.180
- Brille: x=51.7, y=37.3, scale=.190
- Halsschleife: x=48.5, y=55.3, scale=.210
- Rollschuhe/Füße: x=52.1, y=100.0, scale=.235, Drehung=-1. Die Fußdarstellung war noch nicht zufriedenstellend.

## Geplante Überarbeitung
1. Die neu gestalteten Federn nach Möglichkeit gerade ausrichten und als **separate Original-Assets** mit transparentem Hintergrund vorbereiten.
2. Jeder Feder eine lokale Kielbasis sowie Länge/Breite/Form zuordnen; Positionierung nur über geprüfte **Slots** mit Drehung, Skalierung, Z-Reihenfolge und optional Spiegelung.
3. Mehrere **vordefinierte** Federfächer-Layouts erlauben, aber innerhalb einer Spielrunde feste, nicht zufällig fliegende Zielplätze. Sichtbare Fragezeichen passen zur exakten Zahl der Aufgaben.
4. Federzusätze (Lippen, Spiegel, Elefant, Spiralen etc.) gehören zur jeweiligen Feder.
5. Für Schuhe/Strümpfe die Fußbasis-Punkte bzw. fest geprüfte Paar-Varianten verwenden, ggf. Körpergrafik ohne Originalfüße. Keine schwebenden Schuhe.
6. Entwickler-Testansicht mit drei Gruppen (Federn I, Federn II/Kopfzubehör, Füße/Schuhe) **nicht** mit der Kinderansicht verwechseln.
7. Erst alte Assets sowie die 13 neuen Federbilder und bisherigen zwei Test-Screenshots in das Projekt bringen; fehlende Originaldateien als fehlend kennzeichnen. Keine erfundenen Ersatzbilder als vermeintlichen Altbestand verwenden.
8. Ein neues Element fliegt immer an den vorgesehenen Platz; nie automatische „Restplatzierung“.

## Technische Umsetzung
Saubere Trennung von Grafikasset, Form/Anker und Slot/Layout. Eine prototypische Datenstruktur wäre:
```js
const placements = {
  f1_regenbogen: {x: 30.1, y: 61.7, scale: 0.295, rotationDeg: -120}
};
const layouts = {classic: ["slotA", "slotB"]};
```
Die bisherigen Werte nur mit Dokumentation ihres korrekten Bezugssystems übernehmen. Responsive Darstellung skaliert Pfau und Elemente gemeinsam.

## Bildmaterial, das noch einzupflegen ist
13 neue Einzel-Federn: blaues Pfauenauge, pinkes Schachbrett, hellgrünes Auge, Pastellfeder, Lippen, Smiley, Elefant, Spiegel, bunte Feder, Türkis/Orange, kleine Spirale, große Spirale, rot ohne Symbol. Zusätzlich zwei Screenshots mit Fehlpositionierungen. Das Originalmaterial liegt bislang nur im Chat-Paket, nicht hier.
