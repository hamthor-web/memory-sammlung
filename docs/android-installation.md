# memoriesammlung – Android-Testversion 0.2.1

1. `memoriesammlung-0.2.1-test.apk` auf dem Android-Handy herunterladen und öffnen.
2. Falls Android nachfragt, die Installation aus dieser Quelle erlauben und die App installieren.
3. „memoriesammlung – Test“ öffnen. Zunächst ein Testprofil anlegen und alle vier Spiele im Flugmodus starten.
4. Unter „App verwalten“ eine Sicherung speichern. Der Android-Dateidialog bietet die auf dem Gerät eingerichteten Speicheranbieter an. OneDrive muss auf dem Handy installiert/eingebunden und bei Bedarf angemeldet sein.
5. Datei erneut auswählen, Vorschau und Wiederherstellung testen. Vorhandene Profile werden ergänzt und nicht überschrieben.
6. Zurückgeste, Hintergrundwechsel, Neustart und Schriftgröße ausprobieren.

Die Spiele und Bilder sind vollständig lokal in der APK enthalten. Die App braucht zum Spielen keinen ersten Internetdownload. Die Test-App hat eine eigene Kennung; Browser-Spielstände werden über eine Sicherungsdatei übertragen. Später kann die Store-App daneben installiert werden.

Build und Signatur sind geprüft; die Spielabläufe und Dateianbindung bestehen die automatischen Prüfungen. Die Android-Dateianbieterdialoge (insbesondere OneDrive), Gerätewechsel und echte Handy-Lebenszyklusabläufe müssen auf dem Gerät überprüft werden. Es wurde noch keine Veröffentlichung im Play Store veranlasst.

Diese APK ist mit einer Test-Signierung versehen. Für weitere Updates dieser Test-App muss dieselbe Signierung verwendet werden. Bei einem notwendigen Signaturwechsel zuerst Fortschritte als Datei sichern. Die spätere Play-Store-App erhält eine gesonderte Produktionssignierung.

VersionCode: 3. Enthält die vier Belohnungsbäume sowie die aktuelle Wunderwesen-Lichtung und das Märchenhaus. Ein Update einer vorhandenen Test-App benötigt deren bisherigen Signierschlüssel. Nicht deinstallieren, wenn vorhandene Fortschritte erhalten bleiben sollen; vorher eine Sicherungsdatei exportieren.

Seit Version 0.2.1: eigenständige Paketkennung `de.heikeamthor.memoriesammlung.test`. Die neue Test-App wird zusätzlich zu älteren Testfassungen installiert. Vorhandene Fortschritte bleiben in der bisherigen App erhalten und können über deren Sicherungsdatei in die neue App übernommen werden.

Wichtig: Das frühere AAB 0.2.0 verwendete noch `de.heikeamthor.lesespiele`, dieselbe Kennung wie „Lesen, entdecken, erzählen“. Für die eigenständige App ausschließlich die neuen 0.2.1-Dateien mit `de.heikeamthor.memoriesammlung` verwenden.
