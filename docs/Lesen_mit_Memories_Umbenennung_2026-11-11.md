# Lesen mit Memories – Name, Web und Android

Stand: 11.11.2026. Heike hat den Namen **Lesen mit Memories** und den Untertitel **Wörter verstehen · Bilder finden · Zusammenhänge entdecken** bestätigt und den Einbau in Web-App, APK und AAB beauftragt.

Angepasst: gemeinsamer Startbildschirm mit Untertitel, Infofenster, Webmanifest, Sammlungstitel und Apple-App-Beschriftungen in den Spielseiten sowie Updatehilfen, Capacitor-Appname, native Haupt- und Testbeschriftung. Repositoryname, Paketkennungen (de.heikeamthor.memoriesammlung und .test), Manifest-ID, Profilschlüssel, Spielinhalte und Animationen bleiben erhalten.

Android-Fassung: 0.2.3 / Versionscode 5. APK und AAB werden im bestehenden GitHub-Workflow gebaut und mit dem vollständigen Produktionsbestand abgeglichen. Ein Play-Store-Upload erfordert weiterhin die Release-Signierung. Geräteabnahme und Übereinstimmung der Testsignierung mit installierten Vorversionen sind gesondert.

Prüfstand: Produktionsbuild, production-package und app-identity erfolgreich; JavaScript-Syntax und git diff --check erfolgreich. Die lokale Browserprüfung scheitert am Chromium-Start (socket() failed: Operation not permitted). Die Prüfung auf fünf Handy-/Tabletformaten mit normaler und vergrößerter Grundschrift wird deshalb im GitHub-Browserworkflow ausgeführt; Ergebnis wird nach Abschluss ergänzt. Android-Build und GitHub-Veröffentlichung werden nach Abschluss ergänzt.

Die zentrale MASTER-SPIELAKTE wird unter ihrer bestehenden Identität fortgeschrieben. Der historische Quellenanhang bleibt unverändert.

## Browserprüfung auf GitHub

Die neue Namensprüfung besteht in Lauf 43108854125: 360×800, 393×780, 780×393, 768×1024 und 1024×768, jeweils normale und auf 150 % erhöhte Grundschrift. Name, Untertitel und vier Spielkacheln vorhanden, kein horizontaler Überlauf; Infofenster zeigt „Lesen mit Memories · Heike Amthor“. Der erste Testlauf war ausschließlich am noch geöffneten Profildialog gescheitert; der Test startet nun bewusst in der bereits freigegebenen Spielauswahl. Die Anwendung musste dafür nicht verändert werden. Die vorhandenen Vier-Spiele- und Baumprüfungen der Umbenennung bestehen ebenfalls.

## Android-Ergebnis

Android-Lauf 43108578382 für Commit 6efa7e5251152ad59bdc6ffc5ffa6b251783d46f ist vollständig erfolgreich. APK und AAB wurden erstellt; Android-Lint und vollständiger Bytevergleich aller Produktionsdateien einschließlich neuem Namen und Untertitel bestehen. Die Prüfung der kompilierten APK bestätigt App-Anzeigename „Lesen mit Memories – Test“, Version 0.2.3-test und bestehende Testpaketkennung. Download: https://github.com/hamthor-web/memory-sammlung/actions/runs/43108578382 – Artefakt memoriesammlung-android-test, 14 Tage. Die AAB verwendet den Hauptnamen „Lesen mit Memories“ in der mitgeprüften nativen Konfiguration und muss für Google Play weiter mit dem eigenen Uploadschlüssel signiert werden.

## Abschluss

Der vollständige Browserregressionslauf 43108854125 ist erfolgreich abgeschlossen: Namensdarstellung, Wunderwesen, Märchenhaus und Zoom, frei zusammensetzbare Puzzles, Profilwechsel, Wiederaufnahme, Navigation, Sicherung, ältere gespeicherte Seiten/Galerien und Offline-Start aller vier Spiele. Vier-Spiele-Smoke-Test und vier Baumwelten bestehen separat. GitHub Pages ist erfolgreich veröffentlicht. Die zentrale Master-Spielakte wurde im Hauptteil fortgeschrieben; der historische Quellenanhang bleibt erhalten. Reale Android-Geräteprüfung und die Release-Signierung für Google Play sind keine durch diesen Build bestätigten Schritte.
