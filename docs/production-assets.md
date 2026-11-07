# Produktionsbestand und Paketbau

Die Bereinigung reduziert den Quellbestand ohne Git und erzeugte Ausgaben von etwa 200 auf 124 MB. Das vollständige Offline-/Produktionspaket schrumpft von etwa 199 auf 113 MB (rund 43 Prozent).

48 ungenutzte Bilddateien wurden entfernt. 80 PNG-Dateien wurden verlustfrei in WebP umgewandelt. Bildmaße und sichtbare sRGB-RGBA-Pixel wurden vor und nach jeder Umwandlung verglichen; transparente, unsichtbare Farbwerte werden dabei normalisiert. Es gibt keine Verkleinerung der Bildauflösung. Animationen bleiben erhalten. `production-assets.json` enthält Größen, Prüfsummen, Pixelprüfungen und die Zuordnung alter Bildadressen. Originaldateien bleiben in der Git-Historie.

## Gepflegte Einstiegspunkte

- Wortmemory: `wortmemory/index.html`, `app.js`, `data.js`, `style.css`. Die bisher eingebetteten JPEG-Bilder liegen bytegleich und dedupliziert in `wortmemory/assets/`.
- Verrückt gesucht: `verrueckt-gesucht/index.html`, `app.js`, `style.css`.
- Die datierte Wortmemory-Adresse und frühere Suchspiel-Skript-/Stiladressen bleiben als kleine Kompatibilitätsdateien erhalten.

Gespeicherte Fortschrittsbilder können noch PNG-Adressen enthalten. `CollectionSession.rewriteAssetMarkup` ersetzt bekannte Adressen vor dem Einfügen in die Galerie. Der Service Worker unterstützt alte Bildadressen auch offline. Ursprüngliche gespeicherte Galerie- und Profildaten werden dabei nicht überschrieben.

## Bauen und prüfen

```sh
node scripts/build-production.cjs
node tests/production-package.cjs
python3 -m http.server 8765 --directory dist --bind 127.0.0.1
```

`dist/` ist ein reproduzierbarer Web-Dateibestand für Hosting oder ein späteres Android-webDir. Der Ordner enthält keine Tests, Dokumentation, Entwicklungsskripte oder Git-Historie und wird nicht eingecheckt. Ein Android-Projekt oder signiertes AAB wird dadurch noch nicht erzeugt.

`scripts/production-files.cjs` bestimmt den benötigten Bestand anhand der Einstiegspunkte, Ressourcenverweise, dynamischen Spielmodule und ausdrücklich erhaltenen Kompatibilitätsdateien. `scripts/prepare-runtime.cjs` erzeugt die Adresszuordnung und Kompatibilitätsdateien; `scripts/build-offline.cjs` erzeugt daraus das versionierte Offline-Manifest. Der Produktionsbau führt diese Schritte automatisch aus. Die CI prüft die Spiele gegen `dist/`.

`tests/production-package.cjs` prüft Inhalt, Größen, Bildprüfsummen und den unveränderten Wortmemory-Inhaltsvertrag. Browserprüfungen decken alle vier Spiele, alte HTML-/Bildadressen, wiederholte Fortschrittsbilder, alle elf Geschichten und Erststarts ohne Netz ab.

`scripts/optimize-assets.cjs` ist ein Entwicklungswerkzeug für erneute Bildbereinigung und benötigt Sharp. Der normale Paketbau und die CI benötigen Sharp nicht. Nach neuen Ressourcen immer Produktionsbestand und Offline-Manifest neu erzeugen und die Browserprüfungen ausführen.
