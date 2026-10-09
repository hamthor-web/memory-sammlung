# Lesefreude – zwei Memory-Spiele

Der gemeinsame Einstieg liegt in `index.html`: Profilwahl, dann Eigenschaften-Memory (`eigenschaften.html`) oder Ein Wort – zwei Bedeutungen (`wortmemory/index.html`). Beide Spiele sind im gemeinsamen Offline-Paket enthalten. Das Wortmemory stammt aus hamthor-web/Memory; dessen Originalrepository bleibt erhalten. Bestehende lokale Fühlmemory-Profile werden weiterverwendet. Das Wortmemory erhält keine zusätzliche Profilstatistik.

# Fühlmemory

Eigenschaften-Memory mit 30 Bildkarten, drei Schwierigkeitsstufen und Kinderprofilen auf dem jeweiligen Gerät.

## GitHub Pages

Unter **Settings → Pages → Build and deployment** „Deploy from a branch“, Branch **main**, Ordner **/ (root)** wählen und speichern. Die App-Adresse ist anschließend https://hamthor-web.github.io/Fuehlmemory/.

## Installation und Offlinebetrieb

Die App einmal mit Internet öffnen und warten, bis unten **Offline bereit** steht. Beim ersten Besuch werden alle Bilder und Animationen heruntergeladen (rund 55 MB). Danach funktionieren Spiel und Animationen ohne Internet.

- Chrome/Edge und Android: **App installieren** oder die Installationsfunktion des Browsers wählen.
- iPhone/iPad: in Safari **Teilen → Zum Home-Bildschirm** wählen.

Die Installation benötigt HTTPS oder localhost. Eine direkt geöffnete HTML-Datei unterstützt keinen Service Worker. Löscht man Browser-/Website-Daten, gehen die lokalen Profile und das Offline-Paket verloren. Browser können gespeicherte Daten bei Platzmangel entfernen; dann die App erneut mit Internet öffnen.

Updates werden im Hintergrund vorbereitet. **App aktualisieren** lädt die neue Version und beginnt eine neue Runde. Bei Änderungen an veröffentlichten Dateien auch `VERSION` in `sw.js` erhöhen.

## Spiel

Bildkarten ansehen, **Ich bin bereit!** wählen und eine der Fragekarten auswählen. Bei sechs Bildern liegen acht Fragekarten bereit. Fragen werden aus den noch verfügbaren Karten erzeugt. Eine falsche Karte bleibt offen, bis man sie erneut antippt. Eine richtige Karte bleibt während der zwei Sekunden Lesezeit und der anschließenden zufälligen Papierkorb-Animation sichtbar; erst danach verblasst sie.

Die Eigenschaftsmatrix steht in `CARD_MATRIX.csv`. Der Bernhardiner ist schwer und kuschelig. Karten, Rückseiten und Animationen stammen aus den bereitgestellten Dateien.

## Lokale Vorschau und Prüfung

Im Projektordner `python -m http.server 8765 --bind 127.0.0.1` starten, dann http://127.0.0.1:8765/ öffnen. Mit installiertem Node.js: `node verify.cjs` und `node verify-pwa.cjs` ausführen.

Profile und Einstellungen liegen im lokalen Speicher des Browsers; die statische App überträgt diese Daten nicht an einen Anmeldeserver. Profile sind keine geschützten Benutzerkonten. Nutzungsrechte an den bereitgestellten Grafiken und Animationen werden durch dieses Repository nicht erweitert.
