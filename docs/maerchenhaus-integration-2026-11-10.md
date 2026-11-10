# Zwei Wörter, ein Ding – Märchenhaus: Einbau und Master-Nachtrag

Stand: 10.11.2026. Zuständiges Repository: hamthor-web/memory-sammlung, Spiel synonymmemory. Grundlage: Hauptbranch f5699a0ea0e03dc72d5f346f67b810b237c940c0; freigegebene Märchenhaus-Vorschau aa1dbcbabe0953ec1e2093ca55d4cd23c69e3ed7. Ältere Spielakten vom 06./07.11. unterscheiden; der aktuelle Einbau erweitert den vorhandenen Wunderwesen-Stand vom 09.11.

## Bestätigter Ablauf

1. Nur eine vollständig abgeschlossene Einzelspielrunde berechtigt zur nächsten Belohnung. Die bestehende Jubelanimation läuft zuerst.
2. Danach erscheint ein zufällig wechselndes Lob mit Einladung zur Geschichte. „Will ich sehen“ öffnet das Märchenhaus und vergibt höchstens ein Fenster für diese Runde.
3. Beim ersten Besuch erscheint zuerst die vorhandene Lichtung. Daraus wächst das Haus in die Höhe; währenddessen bleiben alle Fenster gesperrt. Erst danach ist Fenster 1 erreichbar.
4. Bei späteren Runden steht das Haus bereits. Genau das nächste Fenster wird freigeschaltet. Vorherige Fenster leuchten und sind wiederholbar. Insgesamt zehn Fenster.
5. Fenster öffnet sich, Kamera fährt in die Geschichte. „Pause“ hält Bildanimation, Überblendungen und Lesetext beliebig lange an. „Weiter“ setzt fort. Beim Wechsel zu einer anderen App wird automatisch pausiert.
6. Nach dem Ende fährt die Kamera zurück; der Märchenbildschirm schließt sich. Dann folgt „Bist du neugierig, was sich hinter dem nächsten Fenster versteckt?“ mit „Jetzt neues Spiel starten!“.
7. Das Märchenhaus lässt sich auch aus den Einstellungen ansehen; dabei entstehen keine zusätzlichen Belohnungen.

## Auswahl wie beim Puzzle

- Zufälliges Erfolgsbild: Auswahl aus noch nicht vollständigen Bildern.
- Ich wähle selbst: Auswahl mit Vorschau und Zähler.
- Angefangenes Bild fertigstellen: nur Bilder mit 1–9 Teilen/Fenstern/Wesen; ohne begonnenes Bild deaktiviert und grau.

Für dieses Spiel sind Märchenhaus und die bestehende Wunderwesen-Lichtung verfügbar. Die Zauberbäume gehören weiterhin zum anderen Wortspiel und die Puzzles zum Eigenschaftenspiel. Vollständige Bilder bleiben besuchbar. Die Auswahl für eine begonnene Runde wird mit dieser Runde gespeichert; sie wechselt beim Fortsetzen nicht zufällig.

## Speicherung und Wiederaufnahme

Fortschritt gehört zur stabilen Kind-ID, niemals nur zum Namen. Haus, Lichtung, Wahlstrategie und gespeicherte Kartenrunde werden im vorhandenen Profil-Fortschritt geführt. Vorhandene Sicherung/Import nimmt die neuen Felder mit. Abbruch und Neuladen vergeben kein Fenster. Beim nächsten Start kann das Kind „Weiterspielen“ wählen: Kartenanordnung, bereits gefundene Paare, Zug, Punkte, offene Lesekarten und Belohnungswelt werden wiederhergestellt. Erst nach dem vollständigen Abschluss ist die neue Geschichte verfügbar. Eine Runden-ID kann auch bei wiederholtem Klicken oder Neuladen nur eine Welt belohnen.

Die Speicherung erfolgt im jeweiligen Browser bzw. auf dem Gerät. Ein Gerätewechsel braucht die vorhandene Sicherungs-/Importfunktion; keine automatische geräteübergreifende Synchronisation. Die bisherige Regel des Wunderwesen-Einbaus bleibt erhalten: Zweispieler behält Paarpunkte, ohne zusätzliche Bildbelohnung.

## Bilder und Texte

Alle zehn freigegebenen Geschichten übernommen. Rapunzel nutzt die drei gemalten Bilder mit korrigierter Scherenhand und Hauswand anstelle des rechten Mondhimmels. Die Texte sind genau den drei Bildern zugeordnet:

1. Rapunzel schaut aus dem Fenster. Ihr langer Zopf hängt aus dem Fenster.
2. Sie nimmt die Schere in die Hand und schneidet sich den Zopf ab. Sie ist es leid, den Prinzen an ihrem Zopf hochklettern zu lassen.
3. Jetzt ist sie glücklich über ihre hübsche Frisur mit kurzen Haaren.

Rapunzel-Lesezeiten: 10 / 22 / 10 Sekunden, durch Pause verlängerbar. Aschenputtel und Froschkönig verwenden ebenfalls die freigegebenen Überblendungen. Bild- und Schriftgröße bleiben unabhängig regelbar. Neue Bilddateien für den mobilen Offline-Einsatz komprimiert; keine Motive anderer Spiele ersetzt.

## Prüfung und technische Übergabe

Lokal bestanden: Produktionsinventar (124,6 MB), 511 Offline-Dateien, PWA-Prüfung, Karten-/Fragenlogik, Profile, Fortschritt, Sicherung/Import, Wunderwesen, Belohnungshistorie, sichere Service-Worker-Aktualisierung und Puzzle-Abdeckung. Neuer Speichertest prüft getrennte Kindstände, Abbruch, Doppelvergabe auch zwischen den Welten, Fortsetzung, Auswahl, Hausaufbau, Zehnergrenze, Sicherung, beschädigte Daten und Schreibfehler.

Im Browser geprüft: gespeicherte Runde mit letztem Paar fortgesetzt; Abschlussanimation, Einladung, erster Hausaufbau, gesperrte Folgefenster, Pause und automatische Rückkehr; zweite Runde mit vorhandenem Haus und genau zwei zugänglichen Fenstern. Bildschirmprüfung in Handy- und Tabletformaten, hoch und quer. Zusätzlicher GitHub-Browsertest prüft Abbruch/Wiederaufnahme, Pause über die normale Geschichtsdauer hinaus, wiederholtes Anschauen, zweites Fenster, getrennte Profile und beide Zooms in vier Formaten. Der vollständige GitHub-Regressionslauf 42883766529 zum Einbau-Commit cb6fc372cc758c2126bdfdd6e3befabb2dd99bbe ist bestanden; auch die Veröffentlichung ist erfolgreich. Echte Gerätetests durch Heike stehen noch aus.

## Masterübersicht – Änderung dieses Arbeitsschritts

| Spiel | Aktueller Bearbeitungsstand |
| --- | --- |
| Zwei Wörter, ein Ding | Märchenhaus mit zehn Geschichten in den tatsächlichen Spielablauf integriert; Wahl Haus/Lichtung, Kindfortschritt, Rundenspeicherung und Pause vorhanden. Einbau auf GitHub veröffentlicht; kompletter automatischer Regressionslauf bestanden. |
| Ein Wort – zwei Bedeutungen | Zauberbaum-System unverändert. |
| Eigenschaften-Memory | Puzzle-Auswahl als Vorbild übernommen; Puzzle-Inhalte und -Speicher unverändert. |
| Verrückt gesucht! | Unverändert. |

Die eigenständige Märchenhaus-Vorschau bleibt als Referenz erhalten. Dieser Einbau betrifft den Web-/Offline-Quellstand der Memory-Sammlung; eine installierte native Android-Fassung benötigt einen gesonderten App-Build.

## Ergänzung: sichtbarer Bildzoom und Handyhöhe

Heikes Rückmeldung vom 10.11.: Das Bild war auf dem Handy zu groß; untere Schaltflächen wurden teilweise aus dem Bildschirm geschoben. Bestätigte Änderung: Bildzoom direkt in jeder geöffneten Geschichte.

- „Bild −“, Regler und „Bild +“ oberhalb des Bildes; 50–200 Prozent in Zehnerschritten.
- 100 Prozent passt das komplette Bild in den verbleibenden Bildbereich ein. Schrift und Schaltflächen beanspruchen zuerst ihren nötigen Platz.
- Größere Bilder scrollen innerhalb des Bildbereichs; Pause/Weiter und Wiederholung bleiben außerhalb dieses Bereichs vollständig erreichbar.
- Im Handy-Querformat stehen Lesetext und Ablauf-Schaltflächen neben dem Bild. Bei sehr großer Schrift ist der Lesetext gesondert scrollbar.
- Bild- und Schriftzoom bleiben unabhängig; auch Pause, Überblendungen und Kindfortschritt bleiben erhalten.
- Auch der äußere Märchenhaus-Bildschirm nutzt die tatsächliche Resthöhe, statt dem eingebetteten Bild eine feste Mindesthöhe aufzuzwingen.
- Dieselbe Korrektur wird in der eigenständigen Märchenhaus-Vorschau veröffentlicht.

Zusätzlicher Browser-Regressionsfall: sechs Handy-/Tabletformate, je zwei Schriftgrößen und drei Bildgrößen, sowohl in der Vorschau als auch eingebettet im Spiel. Er prüft die vollständige Sichtbarkeit aller Schaltflächen und die Trennung von Text- und Bildzoom.

### Übergabe Bildzoom

Funktionsstand auf GitHub: 2437dcd59328a8323ed22fc1438a3b0c6f93f177. Der zusätzliche Zoomtest im Lauf 42891620579 ist bestanden: sechs Bildschirmformate × zwei Schriftgrößen × drei Bildgrößen, jeweils eigenständig und im Spiel eingebettet. Der restliche Lauf prüft danach die übrigen Spiele weiter. Die helle Profilüberschrift wurde zusätzlich gegen die bestehende globale Schriftfarbe abgesichert.

Märchenhaus-Vorschau erfolgreich veröffentlicht: https://maerchenhaus-bluetenfenster.stable-globe-1574.chatgpt.site – Quellcommit 183b7de0c10a32c3150d144933269a2eb9be2d37, Version appgprj_6af24b34aa34819180ccfb3560c0dc87~appgver_1ce3c563d2a08191877d5075256e43da.

Das Spiel selbst ist unter https://hamthor-web.github.io/memory-sammlung/synonymmemory/index.html eingebaut. Die alte eigenständige HTML-/ZIP-Referenz vom 09.11. bildet weiterhin den damaligen Vorschau-Stand ab; für den aktuellen Einbau und Bildzoom sind diese Ergänzung und der GitHub-Stand maßgeblich.
