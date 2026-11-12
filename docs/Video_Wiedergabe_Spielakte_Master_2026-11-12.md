# Lesen mit Memories – Nachtrag zu Spielakten und Masterübersicht (12.11.2026)

**Anlass:** In der installierten Android-App zeigt das Eigenschaften-Memory beim Übergang zur Papierkorb-/Würstchenanimation kurz ein natives Videosymbol. Prüfung auf alle vier Spiele ausgedehnt.

**Repository:** `hamthor-web/memory-sammlung`. **Quellstand:** Android 0.2.4 / Code 6; PWA-Offline-Manifest v75. **Kein fertiges, auf Heikes Handy installiertes Update nachgewiesen.**

## Befund
Elf MP4s (vier Papierkorbclips, drei Jubelclips, vier Intros) sind bereits klein, zusammen rund 2,33 MB. Die Dateien enthalten die MP4-Startmetadaten am Anfang. Android erhält seine Videos im lokalen Capacitor-Dateipaket, nicht als fortlaufende Internetdownloads. Eine Rekodierung wäre daher wenig hilfreich und könnte die Animationen verschlechtern. Alle Originaldateien bleiben unverändert.

## Technische Änderungen
- Eigenschaften-Memory: zufällige Papierkorb-/Jubelanimation schon beim Öffnen der Erfolgs-Lesephase vorbereiten; das Video erst bei tatsächlicher Wiedergabe sichtbar machen. Die bisherige starre 6,5-Sekunden-Abschaltung durch eine laufzeitbezogene Sicherheitsgrenze ersetzen. Die bestehende Zufallsauswahl ohne direkte Wiederholung bleibt.
- Ein Wort – zwei Bedeutungen: Jubelclip als vorab geladenes Videoelement wiederverwenden, Ereignislistener nach jeder Runde entfernen.
- Zwei Wörter – eine Bedeutung: Jubelclip vorladen, störendes Startbild vermeiden, Sicherheitszeitgrenze ergänzen.
- Verrückt gesucht! und drei Memories: vier Intros bei Pointer-/Fokusabsicht vorbereiten und erst beim Abspielen einblenden. Die eigentlichen Fortschrittsanimationen und Spielabläufe von Verrückt gesucht! nicht ändern.
- Native WebKit-Videosteuerelemente für Intros und Papierkorb ausblenden. Offline-Cache v75 erzwingt frischen Download der sechs geänderten Programm-/Styledateien. Die Android-Anwendungskennung bleibt erhalten.

## Prüfung und offene Punkte
JavaScript-Syntax und Quellstand von vier geänderten Skripten sowie PWA-Manifest/Android-Version geprüft. `scripts/verify-video-playback.cjs` prüft die elf MP4-Dateien auf Vorhandensein und Metadatenlage und schützt gegen Wiedereinführung der 6,5-Sekunden-Grenze. Der Android-Workflow führt ihn vor der Paketierung aus.

**Offen:** Erfolgreicher GitHub-Actions-Android-Build, APK mit der bisherigen Testsignatur, reale Wiedergabeprüfung aller Intros und Zwischenclips auf Android einschließlich Neustart, wiederholter Runden und Querformat. Keine Google-Play-Freigabe erteilt. Keine alten Dateien oder Animationen löschen.

## Masterübersicht
**Lesen mit Memories – vier Spiele / weiterhin Entwicklung:** Video-Startoptimierungen am 12.11.2026 im GitHub-Quellstand eingespielt, Android 0.2.4 / Code 6, Web-/PWA-Manifest v75. **Gerätetest und signiertes Installationspaket offen.** Dieser Nachtrag ergänzt ältere Projektakten ohne Überschreiben.
