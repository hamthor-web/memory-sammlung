> **12.11.2026 – neuer Quellstand 0.2.4 / Versionscode 6:** Die Video-Wiedergabe wurde verbessert. Dieser GitHub-Quellstand ist noch keine geprüfte neue Installationsdatei. Die nachfolgende Anleitung für die zuletzt bereitgestellte, dauerhaft signierte 0.2.3-Test-APK bleibt gültig, bis eine 0.2.4-APK mit demselben Testschlüssel vorliegt. Keine APK mit anderem Debugschlüssel als direktes Update anbieten.

# Lesen mit Memories – Test-APK mit festem Schlüssel

Aktuelle Datei: **Lesen_mit_Memories_0.2.3_Test.apk**. Sie enthält den geprüften Stand 0.2.3 / Versionscode 5, wurde danach mit dem dauerhaft gesicherten Testschlüssel signiert und ist nicht identisch mit der automatisch signierten CI-APK.

Heike hat am 11.11.2026 erklärt, dass vorhandene Spielstände für diesen Wechsel keine Rolle spielen. Die beiden bereitgestellten älteren APKs 0.2.1 und 0.2.3 besitzen dieselbe Paketkennung, aber unterschiedliche Signaturen. Darum kann die bisherige Installation nicht unmittelbar aktualisiert werden.

1. Die bisherige **Test-App** deinstallieren.
2. **Lesen_mit_Memories_0.2.3_Test.apk** herunterladen und öffnen.
3. Falls Android nachfragt, die Installation aus dieser Quelle erlauben.
4. „Lesen mit Memories – Test“ öffnen.

Ab jetzt alle weiteren Test-Updates mit dem gesicherten Schlüssel signieren. Die technische Paketkennung bleibt de.heikeamthor.memoriesammlung.test. Der öffentliche Zertifikatsfingerabdruck ist in android/test-signing-certificate.sha256 dokumentiert. Die private Schlüsseldatei bleibt außerhalb des Repositories.

Die neue APK wurde mit dem offiziellen Android-apksigner geprüft (v2- und v3-Signatur gültig). Alle 539 geprüften Assets und kompilierten Hauptdateien sind gegenüber dem erfolgreichen Android-Build unverändert. Ein echter Installationsversuch auf Heikes Handy steht noch aus.

## Künftige automatische GitHub-Builds

Für automatisch installierbare Test-APKs muss einmalig der gesicherte Schlüssel als Repository-Secret ANDROID_TEST_KEYSTORE hinterlegt werden. Die private Schlüssel-Sicherung enthält dafür die Base64-Datei und eine Anleitung. Die verwendete GitHub-Anbindung kann dieses Secret nicht selbst anlegen. Bis dahin enthalten GitHub-Build-Artefakte keine APK mit kurzlebigem Schlüssel mehr; AAB und Lintbericht bleiben verfügbar. Alternativ neue Test-APKs lokal mit dem gesicherten Schlüssel nachsignieren.

Diese Testsignierung gehört nicht zur Produktionssignierung von Google Play. Die Release-AAB muss weiterhin mit dem eigenen Uploadschlüssel signiert werden.

---

## Frühere Installationshinweise (Historie)

# Lesen mit Memories – Android-Testversion 0.2.3

1. `app-debug.apk` aus dem GitHub-Artefakt `memoriesammlung-android-test` (Version 0.2.3) auf dem Android-Handy herunterladen und öffnen.
2. Falls Android nachfragt, die Installation aus dieser Quelle erlauben und die App installieren.
3. „Lesen mit Memories – Test“ öffnen. Zunächst ein Testprofil anlegen und alle vier Spiele im Flugmodus starten.
4. Unter „App verwalten“ eine Sicherung speichern. Der Android-Dateidialog bietet die auf dem Gerät eingerichteten Speicheranbieter an. OneDrive muss auf dem Handy installiert/eingebunden und bei Bedarf angemeldet sein.
5. Datei erneut auswählen, Vorschau und Wiederherstellung testen. Vorhandene Profile werden ergänzt und nicht überschrieben.
6. Zurückgeste, Hintergrundwechsel, Neustart und Schriftgröße ausprobieren.

Die Spiele und Bilder sind vollständig lokal in der APK enthalten. Die App braucht zum Spielen keinen ersten Internetdownload. Die Test-App hat eine eigene Kennung; Browser-Spielstände werden über eine Sicherungsdatei übertragen. Später kann die Store-App daneben installiert werden.

Build und Signatur sind geprüft; die Spielabläufe und Dateianbindung bestehen die automatischen Prüfungen. Die Android-Dateianbieterdialoge (insbesondere OneDrive), Gerätewechsel und echte Handy-Lebenszyklusabläufe müssen auf dem Gerät überprüft werden. Es wurde noch keine Veröffentlichung im Play Store veranlasst.

Diese APK ist mit einer Test-Signierung versehen. Für weitere Updates dieser Test-App muss dieselbe Signierung verwendet werden. Bei einem notwendigen Signaturwechsel zuerst Fortschritte als Datei sichern. Die spätere Play-Store-App erhält eine gesonderte Produktionssignierung.

VersionCode: 5. Enthält die vier Belohnungsbäume sowie die aktuelle Wunderwesen-Lichtung und das Märchenhaus. Ein Update einer vorhandenen Test-App benötigt deren bisherigen Signierschlüssel. Nicht deinstallieren, wenn vorhandene Fortschritte erhalten bleiben sollen; vorher eine Sicherungsdatei exportieren.

Seit Version 0.2.1: eigenständige Paketkennung `de.heikeamthor.memoriesammlung.test`. Die neue Test-App wird zusätzlich zu älteren Testfassungen installiert. Vorhandene Fortschritte bleiben in der bisherigen App erhalten und können über deren Sicherungsdatei in die neue App übernommen werden.

Wichtig: Das frühere AAB 0.2.0 verwendete noch `de.heikeamthor.lesespiele`, dieselbe Kennung wie „Lesen, entdecken, erzählen“. Für die eigenständige App ausschließlich Dateien ab Version 0.2.1 mit `de.heikeamthor.memoriesammlung` verwenden.

Version 0.2.2 enthält in allen vier Spielen die Anleitung „So wird gespielt“ am Ende der Spieleinstellungen. Erfolgsbilder und ihre Zugänge liegen darüber. Die Android-Paketprüfung vergleicht jede enthaltene Webdatei mit dem Produktionsbuild. APK und AAB stehen beim erfolgreichen GitHub-Actions-Lauf als Artefakt bereit (14 Tage). Das AAB muss für den Play Store weiterhin mit dem eigenen Produktionsschlüssel signiert werden. Ein direkt installierbares Update der vorhandenen Test-App setzt deren bisherige Signierung voraus; eine erfolgreiche CI-Paketprüfung bestätigt noch keine übereinstimmende Signierung mit der bereits installierten App.

Version 0.2.3: Anzeigename „Lesen mit Memories“, Untertitel „Wörter verstehen · Bilder finden · Zusammenhänge entdecken“. Technische Paketkennung und Profilspeicher bleiben unverändert.
