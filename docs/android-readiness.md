# Abschlussprüfung vor dem Android-Bau

Stand: 8. November 2026. Geprüft wird der lokale Produktionsbestand `dist/`, nicht eine native Android-App. Ein fehlerfreier Browserdurchlauf beweist keine Fehlerfreiheit auf allen Geräten.

## Behobene und geprüfte Punkte

- Alle vier Spiele funktionieren mit einem gemeinsamen Offline-Paket.
- Kinderprofile trennen laufende Runden und Fortschrittsgeschichten. Die Zuordnung älterer Bilder erfolgt ausdrücklich und bewahrt die Originaldaten.
- Pfau und Baum speichern wiederholte Abschlüsse als getrennte Versionen; unveränderte Geschichten zählen Wiederholungen.
- Alte Suchspiel-Seiten starten mit dem aktuellen Code ohne den früheren Fehler beim Registrieren von Klickaktionen.
- Zurück schließt zunächst Fenster, öffnet danach die Einstellungen und führt schließlich zur Spielauswahl. Unterbrochene Lesefenster lassen sich wieder öffnen.
- Wortmemory verwendet den regulären Einstieg `wortmemory/index.html`; frühere URLs bleiben erreichbar.
- Produktionspaket etwa 113 MB statt zuvor etwa 199 MB; 80 verlustfreie Bildkonvertierungen und 48 entfernte ungenutzte Dateien.
- Zusätzlich korrigiert: Alle fünf Einstiegsseiten verweisen auf dasselbe App-Manifest und dieselben gemeinsamen Icons. Wortmemory hatte bisher kein Manifest, das Suchspiel ein eigenes mit abweichender App-Identität. Alte Manifest- und Icon-Adressen bleiben für zwischengespeicherte Seiten im Offline-Paket.
- Einstellungen und Spielauswahl wurden zusätzlich bei 320, 360, 390 und 768 Pixel Breite auf horizontalen Überlauf kontrolliert.

Automatische Prüfungen: Daten-/Fragenlogik, Profiltrennung, Speicherfehler, Wiederaufnahme, Rückwege, Galerieversionen, alle elf Geschichten, alte HTML-/Bildadressen, Offline-Erststarts, Video-Teilabrufe, vollständige Updates und Rückfall bei fehlgeschlagenen Updates. `tests/app-identity.cjs` sichert den gemeinsamen Installationseinstieg ab.

## Icon

Das gewünschte Originalmotiv `App Icon Fröhlicher Memory-Karten-Kronenheld.png` wurde aus dem Repository übernommen und ohne Zuschnitt oder Nachzeichnung auf 192, 512 und für ältere Apple-Verweise 180 Pixel skaliert. Alle aktuellen Seiten und das App-Manifest verwenden das gemeinsame Motiv; frühere Icon-Adressen wurden ebenfalls aktualisiert. Versionierte Icon-Adressen ermöglichen das Aktualisieren zwischengespeicherter Icons. Das Original bleibt unverändert und wird nicht zusätzlich ins Produktions-/Offline-Paket aufgenommen.

Erneute Erzeugung: `node scripts/prepare-app-icons.cjs 'App Icon Fröhlicher Memory-Karten-Kronenheld.png'` (benötigt Sharp), danach `node scripts/build-production.cjs`.

Das 512-Pixel-Icon dient als Grundlage für den Play-Store-Eintrag. Ein adaptives Android-Icon braucht zusätzlich eine passende Vordergrund-/Hintergrundaufteilung und Prüfung der Sicherheitszone. Das vollständige Motiv wird deshalb als `any`, nicht ungeprüft als `maskable` angeboten.

## Vor dem ersten Android-Testpaket

1. Native Hülle anlegen, zum Beispiel mit Capacitor und `dist/` als lokalem `webDir`. Eine Verpackung, die nur die Website lädt, erfüllt den gewünschten vollständigen Offlinebetrieb ab dem ersten Start nicht.
2. Im nativen Paket die Web-Service-Worker-Registrierung überspringen: Die Dateien werden bereits lokal mitgeliefert. Ein zweiter vollständiger Offline-Cache würde Platz belegen und eine zusätzliche Update-Ebene schaffen. Die Website behält ihren Service Worker.
3. Android-Zurücktaste an die vorhandene Navigation anbinden; in Fenstern, Einstellungen, Übergaben und auf der Startseite prüfen. Ein Browser-History-Test ersetzt diesen nativen Test nicht.
4. Hintergrundwechsel, Bildschirmsperre, Prozessabbruch und Neustart prüfen: Runden, Punkte und Fortschrittsgeschichten müssen für das richtige Kind erhalten bleiben.
5. Systemleisten, Aussparungen, Tastatur, kleine Displays, Querformat und vergrößerte Systemschrift auf echten Android-Geräten prüfen.
6. Aus dem Originalmotiv Launcher-/adaptive Icons und Store-Icon erzeugen und auf verschiedenen Launcher-Masken prüfen.

## Vor einer Play-Store-Veröffentlichung

- Paketkennung, Anzeigename, Versionsfolge, Signierung/Upload-Schlüssel und sichere Schlüsselaufbewahrung festlegen; ein signiertes AAB erstellen. Das dann geltende Target-SDK erfüllen.
- Über internen Play-Test eine echte Neuinstallation ohne Netz sowie ein Update mit vorhandenen Kinderprofilen, Bildern und unterbrochenen Runden prüfen.
- Entscheiden, ob vorhandene Web-Spielstände übertragen werden sollen. Browser und native App haben getrennte Speicher. Dafür ist eine ausdrückliche Export-/Importfunktion nötig; aktuell gibt es keine automatische Übernahme.
- Eine Sicherungs-/Wiederherstellungsfunktion für wertvolle Kinderbilder ist vor breiter Nutzung empfehlenswert. Lokaler Speicher allein schützt nicht vor Deinstallation, Löschen der App-Daten oder Geräteverlust.
- Datenschutzerklärung, Daten-Sicherheitsangaben, Zielgruppe/Kinderangaben, Altersfreigabe und Store-Bilder passend zur tatsächlichen App ausfüllen. Derzeitige Laufzeitressourcen sind lokal; künftig eingebaute SDKs gesondert berücksichtigen.
- Kurzen Beobachtungstest mit Kindern der zweiten Klasse durchführen: Einstieg, Regelverständnis, Spielerwechsel, Fehlerkorrektur, Weiterlesen und Rückkehr zur Sammlung. Automatische Tests beurteilen nicht, ob die Begriffe und Aufgaben für jedes Kind verständlich sind.

Der Webbestand ist für den Bau eines Android-Testpakets vorbereitet. Eine Veröffentlichung im Play Store sollte erst nach den nativen Geräte- und Updateprüfungen erfolgen.
