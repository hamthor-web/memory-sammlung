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

## Android-Aktualisierung 0.2.2 – Auftrag vom 11.11.2026

Heike hat die Übernahme in die Android-App und die Veröffentlichung auf GitHub ausdrücklich beauftragt. Bereits der automatische Android-Lauf 43083556536 für Commit c4d2d4944bc936e9472780a49b22c17d37d3bb94 baute APK und AAB mit den neuen Anleitungen erfolgreich. Die Paketprüfung bestätigte alle enthaltenen Produktionsdateien bytegleich. Damit war die Änderung technisch bereits in den Android-Paketen enthalten, aber noch unter der vorherigen Versionsnummer 0.2.1.

Die neue, eindeutig bezeichnete Android-Fassung erhält Version 0.2.2 / versionCode 4. package.json, Lockdatei und Android-Konfiguration werden gemeinsam aktualisiert. Die Paketkennungen und das bestehende Speichermodell bleiben erhalten. Der GitHub-Workflow baut APK und AAB, führt Android-Lint sowie den vollständigen Inhaltsabgleich aus und stellt die Pakete im Build-Artefakt bereit. Die installierte native App übernimmt Webänderungen erst mit Installation eines neuen Android-Pakets.

Masterstatus: Spielanleitungen im Web veröffentlicht; Android-Aktualisierung auf 0.2.2 beauftragt und versioniert. Build-Ergebnis wird nach Abschluss ergänzt. Keine Play-Store-Veröffentlichung beauftragt. Die Updatefähigkeit einer vorhandenen Testinstallation hängt weiterhin von derselben Signierung ab; Geräte- und Zoomabnahme bleiben offen.

### Ergebnis Android 0.2.2

Commit 24e11e621dbfebbf9acc2db618aad0011cd9cdb7 auf main ist bestätigt. GitHub-Actions-Lauf 43086005739 hat assembleDebug, lintDebug und bundleRelease erfolgreich abgeschlossen. Der nachfolgende Paketvergleich aller Produktionsdateien in APK und AAB sowie die Kontrolle von Paketkennung, App-Name und Android-Version sind erfolgreich. Das Artefakt „memoriesammlung-android-test“ enthält app-debug.apk, app-release.aab und den Lintbericht. Abruf: https://github.com/hamthor-web/memory-sammlung/actions/runs/43086005739 (Aufbewahrung 14 Tage).

Masterstatus ergänzt: Android 0.2.2 / Versionscode 4 erfolgreich gebaut, geprüft und als GitHub-Artefakt bereitgestellt. Die Anleitungen sind vollständig in beiden Android-Paketen enthalten. Echte Geräte-/Zoomabnahme und Updateinstallation mit der bisherigen Signierung bleiben offen. Keine Veröffentlichung in Google Play und keine öffentliche Release-Freigabe erfolgt.
