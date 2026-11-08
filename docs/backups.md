# Sicherung und Wiederherstellung

## Bedienung

1. „App verwalten“ öffnen. Das funktioniert auch vor der Auswahl eines Kindes.
2. „Sicherung speichern“ wählen und den Download oder Speicherdialog abschließen. Prüfen, ob die Datei tatsächlich gespeichert wurde. Für Schutz bei Geräteverlust eine Kopie außerhalb des Geräts aufbewahren.
3. Zum Wiederherstellen „Sicherung auswählen“ öffnen. Die Datei wird vollständig lokal geprüft; die Vorschau zeigt Datum, Namen, Bildanzahl und laufende Runden.
4. „Profile hinzufügen“ wählen. Vorhandene Profile und Bilder bleiben erhalten. Gleiche Namen erhalten „(Sicherung)“ beziehungsweise eine Nummer. Mit „Abbrechen“ wird nichts importiert. Nach erfolgreichem Import „Zu den Spielen“ wählen.

Die Datei enthält Namen und Bilder im Klartext. Sie wird nicht automatisch hochgeladen oder geteilt und ist nicht passwortverschlüsselt. Speichere sie privat. Die großen Spielgrafiken und Videos sind nicht enthalten, da die App sie selbst bereitstellt.

## Inhalt und Kompatibilität

Dateityp: JSON, Formatkennung `memory-lesespiele-backup`, Version 1, höchstens 32 MiB. Ein SHA-256-Prüfwert erkennt versehentliche Änderungen. Er ist keine Echtheits-Signatur; importierte Inhalte werden zusätzlich geprüft und bereinigt.

Gesichert werden alle registrierten Kinderprofile mit Schwierigkeit und Kartenanzahl, alle vier gespeicherten Runden sowie alle elf Fortschrittsgeschichten. Pfau und Baum behalten ihre verschiedenen Modelle in derselben Reihenfolge; unveränderte Geschichten behalten ihre Abschlusszähler und bereits abgeschlossenen Rundenkennungen. Ältere Bilder mit HTML-/Frame-Schnappschüssen bleiben enthalten. Verweise auf eine gemeinsam gespeicherte alte Galerie werden im Export aufgelöst, ohne die ursprünglichen Daten auf dem Quellgerät zu ändern.

Noch nicht zugeordnete ältere Bilder werden ausdrücklich separat exportiert. Bei der Wiederherstellung erhalten sie das eigene Profil „Bisherige Bilder“, damit sie nicht stillschweigend einem Kind zugeordnet werden.

Importierte Profile erhalten neue interne Kennungen. Bestehende gleichnamige Kinder werden nicht automatisch zusammengeführt oder überschrieben. Bereits vorhandene identische Inhalte und wiederholte Importe desselben Profilstands werden erkannt. Eine andere Sicherung mit einem abweichenden Stand wird als zusätzliches Profil hinzugefügt. So bleibt eine jüngere Runde auf dem Zielgerät erhalten.

Neu erstellte Wortmemory-Spielstände speichern auch die Zuordnung bereits gesammelter Paare zu den beiden Kindern. Ältere Spielstände ohne diese Angabe behalten Punkte und Kartenstand; die damals nicht gespeicherte Zuordnung kann nicht nachträglich rekonstruiert werden.

Globale gerätespezifische Schriftvorlieben werden nicht als eigenständige Geräteeinstellungen übertragen. In einer gespeicherten Runde vorhandene Schrift-/Spielfeldwerte bleiben Teil dieser Runde.

## Schutz vorhandener Daten

- Der Import prüft Formatversion, Größen-/Verschachtelungsgrenzen, Profile, Rundendaten und Bildmodelle vor der Bestätigung.
- Ältere HTML-Bilder werden mit lokal mitgeliefertem DOMPurify bereinigt. Aktive Inhalte werden entfernt, Bildadressen auf lokale App-Grafiken normalisiert und SVG-interne Verweise erhalten. Ein fremdes Bild wird nicht aus dem Internet geladen.
- Neue Fortschrittsdaten werden zuerst unter neuen Kennungen geschrieben. Erst danach wird die vollständige Profilliste mit einem einzelnen Speichervorgang sichtbar gemacht. Bereits vorhandene Fortschritts-Schlüssel werden nicht beschrieben.
- Bei Speicherfehlern werden die neu geschriebenen Daten entfernt. Ein kleines Wiederherstellungsjournal ermöglicht die Bereinigung nach einem Prozessabbruch. Bereits vollständig übernommene Profile bleiben erhalten.
- Änderungen der Profilliste nach der Vorschau führen zum Abbruch mit erneuter Dateiauswahl. Gleichzeitige Importbestätigungen werden bei verfügbarer Web-Locks-API serialisiert.
- Ein voller lokaler App-Speicher kann den Import verhindern; eine Datei allein vergrößert das Speicherkontingent nicht. Die bisher gespeicherten Daten bleiben erhalten.

## Prüfung

`node tests/backup-store.cjs` prüft vollständige und wiederholte Sicherungen, alte Galeriezuordnungen, unveränderte bestehende Daten, Namenskonflikte, Dateibeschädigung, Speicherfehler an jedem Schreibschritt und Prozessabbruch vor/nach dem Übernehmen der Profilliste.

`tests/browser-backup.cjs` prüft den echten Dateidownload und Dateiimport einschließlich Vorschau/Abbruch, Wiederaufnahme aller vier Spiele, Zweispieler-Paarzuordnung, beide Bildversionen, Abschlusszähler, alte SVG-/Bildverweise und absichtlich manipulierte HTML-/Fragetext-Inhalte. Der Offline-Browsertest lädt außerdem eine Sicherungsdatei ohne Netz herunter.

Android: Die Kernfunktion ist unabhängig von der Website-Adresse und damit für die manuelle Übernahme in die künftige App geeignet. Die native Hülle braucht funktionierende Datei-Downloads und Dateiauswahl; diese Funktionen und das Wiederherstellen müssen mit dem tatsächlichen Android-Paket geprüft werden. Noch keine automatische Cloud-Synchronisation oder Android-Gerätesicherung eingerichtet.
