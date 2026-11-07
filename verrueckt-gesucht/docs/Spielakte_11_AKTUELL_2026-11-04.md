# Spielakte 11 – Verrückt gesucht!

**Stand:** 04.11.2026  · **Produktstatus:** In Entwicklung / Testphase · **Repository:** https://github.com/hamthor-web/Verruecktes_lesen_und_finden

## 1. Bestand

- 20 Motivgruppen mit jeweils 6 Karten: **120 Bildkarten**; 6/9/12 Bilder pro Runde.
- 3 Schwierigkeitsstufen: ein Merkmal; zwei Merkmale; zwei Merkmale mit Ausschluss.
- 10 Aufgaben je Runde, 11 Fortschrittsgeschichten: Pfau, verrückter Baum, Knurpsel, Rakete, zauberhafte Blumenwiese, Wundereiche, Chaos im Kinderzimmer, Marsmission, gemütliches Baumhaus, Unterwasserwelt, Knurpsel auf der Matschwiese.
- Zufallsauswahl und gezielte Wahl der Fortschrittsgeschichte; lokale Galerie bereits gespielter Geschichten. Nicht mit der Auswahl von Motivgruppen für Suchaufgaben verwechseln: diese wurde im neuen Quellstand entfernt.

## 2. Bestätigte Entscheidungen vom 04.11.2026

1. Keine Motivgruppen-Auswahl in der Kinderoberfläche; weiterhin bunt gemischte Suchrunden.
2. Auswahl der **Fortschrittsgeschichten** bleibt erhalten.
3. Pfau: Fragezeichenmarker muss vor dem neuen Element verschwinden; auftauchende Elementnamen/Textartefakte sind unerwünscht.
4. Verrückter Baum: Fragezeichenkreise auf ungefähr halbe Größe.
5. Bei aufeinanderfolgenden vollständigen Bildern sanfte, gleichmäßige Überblendung statt Hüpfen. Frühere ruhige Animation als Maßstab.
6. Drei Jungenkarten mit großer, klar eckiger, zum Gesicht passender Brille sind als neue Illustration von der Nutzerin freigegeben, *nicht* als überlagerte HTML-Brille.
7. Bestehende Dateien und Repos nicht ungeprüft ersetzen oder löschen.

## 3. Jungenbilder: Freigabe und Einbauzustand

| Karten-ID | Merkmale | Freigegebene neue Datei | Technischer Stand |
|---|---|---|---|
| VG-11-02 | rote Mütze, gelbe Schuhe, eckige Brille | junge_eckige_brille_rot_gelb.webp | In GitHub `assets/` hochgeladen und in `data.js` zugeordnet |
| VG-11-04 | rote Mütze, grüne Schuhe, eckige Brille | junge_eckige_brille_rot_gruen.webp | In GitHub `assets/` hochgeladen und in `data.js` zugeordnet |
| VG-11-06 | blaue Mütze, grüne Schuhe, eckige Brille | junge_eckige_brille_blau_gruen.webp | In GitHub `assets/` hochgeladen und in `data.js` zugeordnet |

Die drei runden Brillenbilder VG-11-01, -03, -05 bleiben unverändert. Die Bilddateien wurden am 04.11.2026 hochgeladen und in der Kartensteuerung verknüpft. Vollständige Geräteprüfung bleibt offen.

## 4. Technische Änderungen auf GitHub am 04.11.2026

Die folgenden **sieben UTF-8-Quelldateien** wurden auf `main` geändert und anschließend direkt vom Repository erneut gelesen:

- `index.html`: Auswahl von Such-Motivgruppen entfernt; Skript-/Stylesheet-Cacheparameter aktualisiert.
- `app.js`: gemischte Motivgruppen als Standard (`group:0`), ohne entfallenes Gruppen-Dropdown.
- `style.css`: kleinere Fortschrittsmarker, Bildfehlerdarstellung und stabile Bildlage.
- `pfau.js`: Beschriftungs-/Alternativtext bei grafischen Pfau-Elementen unterdrückt.
- `tree.js`: Marker vor der Einblendung entfernen, Element ruhig einblenden, begrenztes Bildwarten.
- `data.js`: die Karten `VG-11-02`, `VG-11-04`, `VG-11-06` verweisen auf die drei freigegebenen neuen WebP-Bilder.
- `knurpsel.js`: ruhige Überblendung von aufeinanderfolgenden Ganzbildern und begrenzte Ladezeit. Gilt über gemeinsame `View`-Klasse für Knurpsel, Rakete, Matschwiese, Baumhaus, Marsmission, Unterwasserwelt, Blumenwiese, Wundereiche und Kinderzimmer.

**Abgrenzung:** Es wurde keine vollständig gerenderte Browserprüfung aller elf Fortschrittsgeschichten durchgeführt. Die lokal erstellte letzte HTML-Testfassung ist nicht identisch mit der modularen GitHub-Version. Die Bilddateien wurden anschließend hochgeladen. Eine vollständig getestete Browser-/Geräte-Veröffentlichung wird deshalb noch nicht behauptet.

## 5. Noch offen

- **VG-02 teilweise erledigt:** drei freigegebene Jungen-WebP-Bilder im Repo `assets/`; drei Kartenpfade in `data.js` umgestellt. Bild- und Zoomansicht visuell auf echten Geräten noch prüfen. Alte Dateien als Rückfall behalten.
- **VG-03:** alle elf Belohnungsfolgen bis zum Ende im echten Browser testen: Pfau-Assets, Fragezeichen-Timing, flüssige Überblendungen, Galerie, Fehlerbehandlung, Mobil/Tablet-Hoch-/Querformat.
- **VG-04:** alte Tests an heutige Oberfläche anpassen und automatisierte Tests neu ausführen.
- Mädchenkarten bleiben bis zu gesonderter Bildfreigabe als Entwürfe geführt.
- Danach Release-Stand technisch abnehmen und Spielakte abschließend aktualisieren.

## 6. Letzter bestätigter Repository-Bezug

Vorheriger `main`-Stand: `7b33f82a8df6268a61fd9cf693ebcd1c9f382e54`. Nach Übertragung aller drei Bilder und der Datenzuordnung am 04.11.2026: `fa9ef68b02797da0c862aac0aa7003850708e2ec` (vorbehaltlich späterer Änderungen).

Diese Akte erhält die frühere Akte als historische Quelle und dokumentiert aktuelle Entscheidungen getrennt vom nachgewiesenen technischen Stand.

## 7. Nachtrag – Installationsfunktion (04.11.2026)

**Bestätigter Auftrag:** Ein Installieren-Button wie bei „Lesedetektive“ soll auf der Start-/Auswahlseite verfügbar sein.

**Umgesetzt auf GitHub main:**
- index.html: Installieren-Button und Hinweisdialog auf der Spiele-Auswahlseite, Meta-Tags für Web-App-Installation.
- pwa.js: native Installationsaufforderung, sofern der Browser sie anbietet; gerätespezifische Hinweise für iPhone/iPad, Android, Firefox unter Windows, Safari auf Mac und Chrome/Edge.
- manifest.webmanifest: Name, Startpfad, Standalone-Darstellung und Farbgebung.
- icons/icon-192.png und icons/icon-512.png: neue PWA-Icons.
- sw.js: Service Worker für App-Grunddateien und nach Bedarf geladene Ressourcen (sämtliche großen Bildfolgen nicht automatisch offline verfügbar).
- style.css: Installationsfeld und Hilfedialog.

**GitHub-Commit der Installationsfunktion:** 46aa7b5741398740eff6706d4b58c1da55f0384f.

**Nachweis:** Alle sieben Pfade sind im Repository vorhanden; Manifest wird korrekt geparst, pwa.js und sw.js sind syntaktisch gültig, der Button ist in index.html eingebaut.
**Noch offen:** praktische Installation in Chrome/Edge unter Windows sowie Android/iPad; Firefox unter Windows muss eine Anleitung zeigen, da keine native PWA-Installation bereitsteht. Vollständige visuelle Abnahme aller elf Fortschrittsanimationen bleibt ebenfalls offen.


## 8. Nachtrag – Hundekarten mit schwarzer und gelber Nase (07.11.2026)

**Bestätigte Entscheidung:** Die Karten VG-01-05 und VG-01-06 bekommen neue Bilder im bisherigen freundlichen Hundestil. Die linke Nase ist schwarz, die rechte gelb; keine gelben Flecken auf der Schnauze; eine Zunge. Alle drei abgefragten Merkmale bleiben bestehen: Nasenfarben, Schwanzfarbe und Halsschleife. Eine Zungenfrage existiert in der aktuellen Hundemotiv-Gruppe nicht.

| Karte | Nasen | Schwanz | Halsschleife | Bilddatei |
|---|---|---|---|---|
| VG-01-05 | schwarz und gelb | braun | rot | `assets/hund-nasen-neu-05.webp` |
| VG-01-06 | schwarz und gelb | blau | grün | `assets/hund-nasen-neu-06.webp` |

**Technischer Stand:** In `hamthor-web/Verruecktes_lesen_und_finden` und der Kopie unter `hamthor-web/memory-sammlung/verrueckt-gesucht/` wurden die zwei Bilddateien eingebaut, `data.js` und `sw.js` aktualisiert und ausschließlich die beiden ersetzten Dateien `assets/hund-gelbe-nase-05.svg` und `assets/hund-gelbe-nase-06.svg` aus dem Dateibaum entfernt. Die vier anderen Hundekarten und alle Fragen bleiben unverändert. Die Bilder sind derzeit weboptimierte 256×256-WebP-Dateien; die ursprünglich neu erzeugten 800×800-Vorlagen bleiben außerhalb der Repositories erhalten. Cache der Memory-Sammlung: v69.

**Quellnachweis:** Quellrepository-Commit `e5d4b28001b91b1f507991949c16862d8929cd9b`; Bild-SHA-256 VG-01-05 `247310ea30cbccfecd7728d2f4deda3be3e8e5af721645ec4707e092e6a98fc0`, VG-01-06 `ecda7569c6441de7f777cbdf8b25e64514373c1ca00ea8d34727bc1d2d97dc26`. Eine vollständige visuelle Abnahme der veröffentlichten Version auf Smartphone und Tablet bleibt offen.
