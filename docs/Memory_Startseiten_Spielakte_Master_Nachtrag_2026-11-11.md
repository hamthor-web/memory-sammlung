# Memory-Sammlung – Spielakte und Master-Nachtrag: einheitliche Spielanleitungen

Stand: 11.11.2026. Repository: hamthor-web/memory-sammlung. Ausgangscommit: 05f19d8c26739d1b4096009f8d56efe6458280a8.

## Bestätigte Entscheidung von Heike

Alle vier Spielstartseiten erhalten den aufklappbaren Abschnitt „So wird gespielt“ als letzten Inhalt ihrer Spieleinstellungen. Hinweise, Auswahl und Zugänge zu Erfolgsbildern stehen darüber. Der bisherige Erwachsenen-/Begleitungsbereich ist nicht mehr erforderlich. Der Auftrag schließt das Hochladen auf GitHub ein.

## Umsetzung

- Eigenschaften merken und finden: kindgerechte Anleitung für Bilder merken, „Ich bin bereit!“, Fragekarte lesen, Bild finden und Zweispielermodus ergänzt.
- Ein Wort, zwei Bilder: Anleitung für gleichlautende Wörter mit verschiedenen Bedeutungen, Satz-Bild-Aufgabe und Zweispielermodus ergänzt. Die vorhandene Baumauswahl und Galerie stehen darüber.
- 1 Sache, 2 Bezeichnungen: vorhandene Anleitung und Spielmechanik beibehalten; einheitliche Darstellung ergänzt. Märchenhaus und Lichtung stehen weiterhin darüber.
- Verrückt gesucht!: „Für die Begleitung“ durch kindgerechte Spielanleitung ersetzt. Der Fragenmatrix-Download samt ausschließlich dafür benötigtem Klickhandler entfällt. Hilfreiche Hinweise zu Flossen und Radfarben bleiben in der Spielanleitung erhalten. „Meine Bilder ansehen“ steht darüber.
- Gemeinsame Gestaltung in play-instructions.css: große, kontrastreiche Schrift, mindestens 48 px hohe aufklappbare Überschrift, Zeilenumbruch und Anbindung an die jeweilige Schriftgrößenregelung. Spielfeldzoom bleibt unabhängig.
- Offline-Inventar neu generiert: v74-03fccd80a9d05212, 531 Dateien. Vorhandene Spielstände, Belohnungsbilder und Animationen werden durch diese Änderung nicht verändert.

## Prüfung und Grenzen

Erfolgreich: JavaScript-Syntaxprüfung der angepassten Suchspiel-Datei, vollständiger Produktionsbuild, vorhandene production-package-Prüfung (Dateiliste, Asset-Prüfsummen und unveränderte Wortfragen/Bilder), git diff --check. Alle vier HTML-Seiten binden die gemeinsame Gestaltung ein; ihre Anleitung ist jeweils das letzte Element der Spieleinstellungen.

Die Browserprüfung wurde versucht, aber nicht abgeschlossen: Chromium scheitert in dieser Umgebung beim Start mit „socket() failed: Operation not permitted“. Der separate Browser erreicht den lokalen Vorschau-Server nicht (ERR_CONNECTION_REFUSED). Deshalb sind Handy-/Tablet-Sichtprüfung in Hoch-/Querformat, reales Auf-/Zuklappen und Zoomdarstellung für diese Änderung noch offen. Keine vollständige Gerätefreigabe behaupten.

## Masterübersicht – aktueller Status

Vier Spiele weiterhin integriert und in Entwicklung. Spielanleitungen auf den vier Startseiten vereinheitlicht und an das Ende der Einstellungen gesetzt; Erfolgsbilder darüber. Produktionsprüfung bestanden, visuelle Geräteabnahme der Änderung offen. Kein neues APK/AAB Bestandteil dieses Auftrags. Ältere Projektakten und historische Entwicklungsstände bleiben erhalten.

## Ergänzende Liveprüfung nach Veröffentlichung

GitHub-Commit c4d2d4944bc936e9472780a49b22c17d37d3bb94 ist auf main bestätigt; alle acht hochgeladenen Dateien wurden mit dem lokalen Ergebnis abgeglichen. GitHub Pages meldet die Veröffentlichung als erfolgreich. Im separaten Browser konnten anschließend alle vier veröffentlichten Spielseiten geöffnet und die Anleitungen aufgeklappt werden. Auf jeder Seite steht die Anleitung zuletzt im Einstellungsbereich; die Erfolgsbilder-Zugänge liegen darüber. Die berechnete Grundschrift beträgt jeweils 20 px. Die Darstellung von „Verrückt gesucht!“ wurde zusätzlich per Bildschirmansicht kontrolliert. Der frühere lokale Browserfehler verhindert diese Liveprüfung somit nicht mehr. Offen bleiben die Prüfung unterschiedlicher Handy-/Tabletformate und die kombinierte Zoomprüfung. Die Änderung ist veröffentlicht, diese Geräteabnahme wird nicht als abgeschlossen dargestellt.
