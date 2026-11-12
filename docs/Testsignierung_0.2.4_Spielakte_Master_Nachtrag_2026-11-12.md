# Lesen mit Memories – Spielakte & Masterübersicht: Android-Testsignierung 0.2.4

**Datum:** 12.11.2026 · **Repository:** hamthor-web/memory-sammlung · **Status:** signierte lokale Test-APK bereitgestellt, Handyinstallation nicht geprüft.

## Betroffene Spielakte
Die Änderungen der Video-Wiedergabe vom 12.11.2026 sind in allen vier Spielen im GitHub-Quellstand enthalten und zuvor in `docs/Video_Wiedergabe_Spielakte_Master_2026-11-12.md` dokumentiert. Die folgende Signierung ändert keine Spielregeln, Grafiken oder Animationsdateien.

## Signierter Teststand
- **Android-Paketkennung:** `de.heikeamthor.memoriesammlung.test`.
- **Version:** `0.2.4-test`, **versionCode:** `6` (gegenüber 0.2.3-test / 5).
- **Datei:** `Lesen_mit_Memories_0.2.4_Test_signiert.apk`, 145.025.552 Byte.
- **APK SHA-256:** `73aa354b5503ca7dd86242da75720acfff1cc95fed0f9410385cabf1f30f2127`.
- **Testzertifikat SHA-256:** `0204dd28e5ef684e161b9c745897c670d7f81b3f9cbeaeb9631b4b46cf57c708`.
- Der Testschlüssel wurde ausschließlich aus einer privaten Sicherung verwendet und **nicht** ins Repository übertragen.
- Die APK wurde aus der vorhandenen Test-APK 0.2.3 abgeleitet. Die sechs geänderten Web-Skript-/Stildateien wurden bytegenau auf den aktuellen GitHub-Stand gebracht, Offline-Hashes aktualisiert und die Android-Version erhöht. Die übrigen 962 von insgesamt 970 APK-Einträgen blieben unverändert; keine native Codeänderung.
- Kryptografische APK-v2-Signatur und signierter Inhaltsdigest, Zertifikatsgleichheit der 0.2.3-/0.2.4-Pakete, ZIP-Integrität, JavaScript-Syntax und Dateipayload geprüft.
- **Offen:** Installation und reale Wiedergabe auf Android-Smartphone; kein erneuter Gradle-Build und keine Prüfung mit dem Android-SDK-Tool `apksigner`. Kein Google-Play-Release und kein automatisches GitHub-Binary-Artefakt.

## Masterübersicht – Status
**Lesen mit Memories:** GitHub-Quellstand 0.2.4 vorbereitet; signierte Test-APK 0.2.4 für denselben bestehenden Test-Schlüssel manuell erstellt und im Chat bereitgestellt. Nutzerseitige Installation und Video-/Zoom-/Hoch-/Querformat-Prüfung ausstehend. Private Testsignierung für zukünftige automatische GitHub-Action-Downloads weiterhin **nicht** als Repository-Secret eingerichtet.

Die bestehende Masterakte und frühere Spielakten bleiben unverändert; dieser Nachtrag dokumentiert den zusätzlichen Schritt.