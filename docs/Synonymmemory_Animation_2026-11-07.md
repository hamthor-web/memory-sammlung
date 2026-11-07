# Eingangsanimation – 1 Sache, 2 Bezeichnungen

Am 07.11.2026 von Heike beauftragt und bereitgestellt: `Wuerstchen_Kartenwirbel.mp4`. Unveränderte Originaldatei, H.264, 640×560 Pixel, 7,6 Sekunden, 394451 Bytes. SHA-256: `1eb654c7297c1eee454769bf8968d0f1c820efd134a6fb7b00c79776034650da`.

Nach „Spiel starten“ auf der dritten Kachel im gemeinsamen Startbildschirm läuft das Video einmal. Wie bei den beiden anderen Spielen bleibt das Schlussbild zwei Sekunden sichtbar; danach öffnet sich die Oberfläche für Spielmodus und Paarzahl. „Überspringen“ führt sofort weiter. Bei einem Wiedergabefehler greift die vorhandene Weiterleitung. Keine Schleife, kein erneutes Intro beim Start einer einzelnen Runde.

Datei: `assets/intro/synonymmemory.mp4`; Zuordnung: `intro-animations.js`. Offline-Cache v43 enthält das Video. Die gemeinsame Intro-Anzeige reserviert genügend Höhe für die Schaltfläche auch im flachen Handy-Querformat.

Prüfung: Originaldatei und Kopie stimmen bytegenau überein. JavaScript-Syntax erfolgreich. Vorhandene PWA-Prüfung erfolgreich: 106 Offline-Dateien, Manifest und Video-Teilabrufe. Browserprüfung: einmalige Wiedergabe mit automatischem Übergang, Überspringen, Handy-Hochformat (393×780), Handy-Querformat (780×393), Tablet-Hochformat (768×1024), Tablet-Querformat (1024×768). Im Querformat wurde der zunächst abgeschnittene Überspringen-Knopf durch angepasste Videohöhe behoben. Spielmechanik und Zuordnung der anderen Videos unverändert.
