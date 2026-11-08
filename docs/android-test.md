# Android-Testversion

Die Test-App heißt „Memory & Lesen – Test“ und verwendet `de.heikeamthor.lesespiele.test`. Die spätere Store-Fassung hat eine eigene Kennung (`de.heikeamthor.lesespiele`). Beide können nebeneinander installiert werden; ihre Daten werden nicht automatisch geteilt. Fortschritte lassen sich über die Sicherungsdatei übertragen.

## Technischer Aufbau

- Capacitor 8, Android ab API 24 (Android 7), Ziel-API 36, Java 21. Android System WebView muss mindestens Version 105 haben; bei älteren Versionen ist vor dem Spielen ein WebView-Update nötig.
- `dist/` wird vollständig in die APK kopiert. Keine externe Startadresse und kein Internetdownload zum ersten Spielen nötig.
- Die native Fassung registriert keinen Web-Service-Worker und zeigt keine Browser-Installations-/Updatebuttons. Updates erfolgen über eine neue APK beziehungsweise später den Play Store.
- Android-Zurück verwendet den vorhandenen Navigationsablauf. Auf der Startseite wird zunächst das oberste Fenster geschlossen, danach die App minimiert. Hintergrundwechsel sichern den Fortschritt; WebView-Timer werden während einer unterbrochenen Activity pausiert.
- `MemoryDocuments` öffnet `ACTION_CREATE_DOCUMENT` und `ACTION_OPEN_DOCUMENT`. Es werden keine pauschalen Dateisystem- oder Cloud-Zugriffsrechte verlangt. Android bietet die auf dem Gerät eingebundenen Dokumentanbieter an, z. B. lokale Ordner oder OneDrive. Die Auswahl und gegebenenfalls Anmeldung übernimmt der jeweilige Anbieter.
- Speichern meldet Erfolg erst nach geschlossenem Ausgabestrom; Abbruch verändert die Spieldaten nicht. Inhalte werden auf 32 MB begrenzt. Der Import verwendet dieselbe Prüfsumme, Inhaltsprüfung und ergänzende Wiederherstellung wie die Website.
- Externe Website-Links öffnen den Browser, E-Mail öffnet den eingerichteten E-Mail-Client. Nur die in der App verwendete Website und Kontaktadresse sind für die native Linkfunktion freigegeben.
- Automatische Cloud-/Geräteübertragung der App-Daten ist deaktiviert. Sicherungen werden vom Nutzer ausdrücklich über den Dateidialog veranlasst.

## Lokaler Build

Voraussetzungen: Node ab 22, JDK 21 mit `javac`, Android-SDK mit Plattform 36 und Build-Tools 35.0.0. `ANDROID_HOME` oder `android/local.properties` verweist auf das eigene SDK.

```sh
npm ci
npm run android:apk
```

Ergebnis: `android/app/build/outputs/apk/debug/app-debug.apk`. Die GitHub-Action „Android test APK“ baut und prüft dieselbe Variante. Ihre Artefakte dienen der Build-Prüfung; für fortlaufende Handy-Tests die bereitgestellte APK mit aufbewahrter Test-Signierung verwenden.

Für fortlaufend installierbare Test-Updates muss dieselbe Test-Signierung verwendet werden. Lokal kann `MEMORY_TEST_KEYSTORE` auf einen aufbewahrten Debug-Keystore zeigen (Standard-Debug-Alias und -Passwörter). Keine privaten Signierschlüssel einchecken. Ohne Vorgabe verwendet Gradle den Debug-Keystore der jeweiligen Build-Umgebung; APKs aus unterschiedlichen Umgebungen sind daher nicht automatisch untereinander updatefähig. Vor Wechsel der Signierung Fortschritte als Datei sichern.

Die Test-APK ist keine signierte Play-Store-Fassung. Produktionssignierung und ein AAB für den Store werden gesondert eingerichtet.

## Auf dem Handy prüfen

1. APK herunterladen und installieren; die Installation aus dieser Quelle bei Bedarf in Android erlauben.
2. Ersten Start im Flugmodus durchführen, ein Testprofil anlegen und alle vier Spiele starten.
3. Eine Runde unterbrechen, die App in den Hintergrund legen und erneut öffnen. Danach auch nach vollständigem Beenden erneut öffnen und fortsetzen.
4. Eine Sicherung lokal speichern, anschließend bei Bedarf OneDrive oder einen anderen eingebundenen Anbieter wählen. Den erfolgreichen Upload im Anbieter prüfen.
5. Datei wieder auswählen, Vorschau und Abbruch testen; danach Profile ergänzend wiederherstellen und Bilder/Runden prüfen.
6. Browser-/E-Mail-Links, Zurückgeste, Bildschirmdrehung und Schriftgröße testen.
7. Ein späteres Test-Update mit derselben Signierung installieren und prüfen, dass alle Daten erhalten bleiben.

Die Browserprüfung der nativen Schnittstelle verwendet einen simulierten Android-Bridge. Sie ersetzt die oben genannten Geräte-/Anbietertests nicht. Ein echter OneDrive-Speicherort kann nur auf einem Gerät mit entsprechendem Anbieter geprüft werden.

## Bereitstellung für Handy-Tests

Der manuell gestartete Workflow „Android test APK“ baut zunächst unabhängig eine Vergleichs-APK und prüft sie. Für die eigentliche Bereitstellung kann er eine bereits lokal signierte APK über einen geprüften Transfer übernehmen. Dabei werden nur APK-Daten, Prüfsummen und Referenzen auf temporäre Repository-Objekte übertragen, keine Signierschlüssel. Die enthaltenen Web-Dateien und die Capacitor-Konfiguration müssen bytegleich zum unabhängigen Build sein.

Alternativ kann die Kontoinhaberin den Repository-Secret `ANDROID_TEST_KEYSTORE` für eine dauerhafte Test-Signierung hinterlegen. Die derzeitige GitHub-Anbindung darf diesen Secret nicht selbst schreiben. Ohne vorbereitete, lokal signierte APK oder eingerichteten Testschlüssel erfolgt keine Auslieferung einer kurzlebig signierten CI-APK.

Nach erfolgreicher Prüfung lädt der Workflow APK, Prüfsumme und Installationshilfe in den privaten Release-Entwurf `android-test-0.1.0`. Es erfolgt keine automatische öffentliche Freigabe und kein Play-Store-Upload. Der Signierschlüssel selbst gehört weder in den Quellcode noch in die Release-Dateien. Die bereitgestellten ersten Handy-APKs verwenden den außerhalb des Repositories aufbewahrten lokalen Testschlüssel.
