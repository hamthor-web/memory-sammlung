/* Canonical word pairs and sentences. Artwork is stored once as external files. */
const PAIRS = [
  {
    "id": "hahn",
    "word": "HAHN",
    "a": {
      "img": "assets/hahn-a.jpg",
      "label": "der Hahn"
    },
    "b": {
      "img": "assets/hahn-b.jpg",
      "label": "der Wasserhahn"
    },
    "questions": [
      {
        "text": "Der Hahn weckt die Familie jeden Morgen sehr früh.",
        "answer": "a"
      },
      {
        "text": "Zwischen den Hühnern läuft stolz der Hahn herum.",
        "answer": "a"
      },
      {
        "text": "Lena dreht den Hahn zu, um Wasser zu sparen.",
        "answer": "b"
      },
      {
        "text": "Paul füllt seine Trinkflasche am Hahn auf.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "schloss",
    "word": "SCHLOSS",
    "a": {
      "img": "assets/schloss-a.jpg",
      "label": "das Schloss"
    },
    "b": {
      "img": "assets/schloss-b.jpg",
      "label": "das Türschloss"
    },
    "questions": [
      {
        "text": "Rapunzels langer Zopf hängt aus dem Fenster des alten Schlosses.",
        "answer": "a"
      },
      {
        "text": "Im Schloss gibt es einen Saal mit schönen bunten Bildern.",
        "answer": "a"
      },
      {
        "text": "Der Schlüssel steckt fest im Schloss.",
        "answer": "b"
      },
      {
        "text": "Max schließt das Schloss ab, bevor er das Haus verlässt.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "blatt",
    "word": "BLATT",
    "a": {
      "img": "assets/blatt-a.jpg",
      "label": "das Blatt"
    },
    "b": {
      "img": "assets/blatt-b.jpg",
      "label": "das Blatt Papier"
    },
    "questions": [
      {
        "text": "Im Herbst färbt sich das Blatt gelb.",
        "answer": "a"
      },
      {
        "text": "Eine Raupe knabbert ein Loch in das Blatt.",
        "answer": "a"
      },
      {
        "text": "Auf dem Blatt steht, was Mia sich zum Geburtstag wünscht.",
        "answer": "b"
      },
      {
        "text": "Ben schreibt seinen Namen oben auf das Blatt.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "decke",
    "word": "DECKE",
    "a": {
      "img": "assets/decke-a.jpg",
      "label": "die Decke"
    },
    "b": {
      "img": "assets/decke-b.jpg",
      "label": "die Zimmerdecke"
    },
    "questions": [
      {
        "text": "Die Katze hat sich unter der warmen Decke versteckt.",
        "answer": "a"
      },
      {
        "text": "Paul legt Oma eine Decke über die Beine.",
        "answer": "a"
      },
      {
        "text": "An der Decke entdeckt Mia eine kleine Spinne.",
        "answer": "b"
      },
      {
        "text": "Der Luftballon schwebt bis hoch an die Decke.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "birne",
    "word": "BIRNE",
    "a": {
      "img": "assets/birne-a.jpg",
      "label": "die Birne"
    },
    "b": {
      "img": "assets/birne-b.jpg",
      "label": "die Glühbirne"
    },
    "questions": [
      {
        "text": "Paul nimmt die Birne aus der Brotdose und beißt hinein.",
        "answer": "a"
      },
      {
        "text": "Mia schneidet die Birne in kleine Stücke.",
        "answer": "a"
      },
      {
        "text": "Die Birne ist aus Glas und geht leicht kaputt.",
        "answer": "b"
      },
      {
        "text": "Papa wechselt die kaputte Birne aus.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "tor",
    "word": "TOR",
    "a": {
      "img": "assets/tor-a.jpg",
      "label": "das Tor"
    },
    "b": {
      "img": "assets/tor-b.jpg",
      "label": "das Gartentor"
    },
    "questions": [
      {
        "text": "Der Ball fliegt ins Netz. Paul hat ein Tor geschossen.",
        "answer": "a"
      },
      {
        "text": "Die Mannschaft jubelt über das dritte Tor.",
        "answer": "a"
      },
      {
        "text": "Am Abend wird das große Tor zum Hof geschlossen.",
        "answer": "b"
      },
      {
        "text": "Das Auto fährt langsam durch das offene Tor.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "nagel",
    "word": "NAGEL",
    "a": {
      "img": "assets/nagel-a.jpg",
      "label": "der Nagel"
    },
    "b": {
      "img": "assets/nagel-b.jpg",
      "label": "der Metallnagel"
    },
    "questions": [
      {
        "text": "Mia lackiert sich die Nägel bunt.",
        "answer": "a"
      },
      {
        "text": "Unter dem Nagel steckt ein bisschen Erde.",
        "answer": "a"
      },
      {
        "text": "Papa hängt das Bild an einen Nagel in der Wand.",
        "answer": "b"
      },
      {
        "text": "Der Nagel hält das kleine Regal an seinem Platz.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "schale",
    "word": "SCHALE",
    "a": {
      "img": "assets/schale-a.jpg",
      "label": "die Schale"
    },
    "b": {
      "img": "assets/schale-b.jpg",
      "label": "die Schale"
    },
    "questions": [
      {
        "text": "Mia füllt Erdbeeren in eine Schale.",
        "answer": "a"
      },
      {
        "text": "Auf dem Tisch steht eine Schale mit Nüssen.",
        "answer": "a"
      },
      {
        "text": "Mia legt die Schale der Melone weg.",
        "answer": "b"
      },
      {
        "text": "Ben zieht die Schale von der Mandarine ab.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "schirm",
    "word": "SCHIRM",
    "a": {
      "img": "assets/schirm-a.jpg",
      "label": "der Schirm"
    },
    "b": {
      "img": "assets/schirm-b.jpg",
      "label": "der Lampenschirm"
    },
    "questions": [
      {
        "text": "Der Wind zerrt Paul den Schirm aus der Hand.",
        "answer": "a"
      },
      {
        "text": "Draußen regnet es. Zum Glück hat Ben seinen Schirm dabei.",
        "answer": "a"
      },
      {
        "text": "Der Schirm macht das Licht der Lampe schöner.",
        "answer": "b"
      },
      {
        "text": "Oma hat für ihre Lampe einen neuen Schirm gekauft.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "schlange",
    "word": "SCHLANGE",
    "a": {
      "img": "assets/schlange-a.jpg",
      "label": "die Schlange"
    },
    "b": {
      "img": "assets/schlange-b.jpg",
      "label": "die Schlange"
    },
    "questions": [
      {
        "text": "Die Schlange versteckt sich zwischen zwei Steinen.",
        "answer": "a"
      },
      {
        "text": "Eine Schlange hat keine Beine.",
        "answer": "a"
      },
      {
        "text": "Zum Mittagessen bildet sich im Speisesaal eine lange Schlange.",
        "answer": "b"
      },
      {
        "text": "Diese Schlange hat viele Beine.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "strauss",
    "word": "STRAUSS",
    "a": {
      "img": "assets/strauss-a.jpg",
      "label": "der Strauß"
    },
    "b": {
      "img": "assets/strauss-b.jpg",
      "label": "der Blumenstrauß"
    },
    "questions": [
      {
        "text": "Der Strauß legt ein sehr großes Ei.",
        "answer": "a"
      },
      {
        "text": "Ein Strauß kann schneller laufen als ein Mensch.",
        "answer": "a"
      },
      {
        "text": "Kerstin bringt ihrer Mutti zum Geburtstag einen bunten Strauß mit.",
        "answer": "b"
      },
      {
        "text": "Auf dem Tisch steht ein Strauß aus roten und gelben Blumen.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "note",
    "word": "NOTE",
    "a": {
      "img": "assets/note-a.jpg",
      "label": "die Note"
    },
    "b": {
      "img": "assets/note-b.jpg",
      "label": "die Musiknote"
    },
    "questions": [
      {
        "text": "Ben freut sich über seine gute Note in der Klassenarbeit.",
        "answer": "a"
      },
      {
        "text": "Mia zeigt ihrer Oma stolz ihre gute Note.",
        "answer": "a"
      },
      {
        "text": "Die Sängerin singt eine besonders hohe Note.",
        "answer": "b"
      },
      {
        "text": "Paul erkennt die Note und spielt den richtigen Ton.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "strom",
    "word": "STROM",
    "a": {
      "img": "assets/strom-a.jpg",
      "label": "der Strom"
    },
    "b": {
      "img": "assets/strom-b.jpg",
      "label": "der Strom"
    },
    "questions": [
      {
        "text": "Der breite Strom fließt durch mehrere Länder.",
        "answer": "a"
      },
      {
        "text": "Viele Schiffe fahren auf dem großen Strom.",
        "answer": "a"
      },
      {
        "text": "Plötzlich sind die Lampe und der Kühlschrank aus. Es gibt keinen Strom.",
        "answer": "b"
      },
      {
        "text": "Ohne Strom kann Paul seinen Computer nicht einschalten.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "paar",
    "word": "PAAR",
    "a": {
      "img": "assets/paar-a.jpg",
      "label": "das Paar"
    },
    "b": {
      "img": "assets/paar-b.jpg",
      "label": "das Paar Schuhe"
    },
    "questions": [
      {
        "text": "Die beiden sind seit vielen Jahren ein Paar.",
        "answer": "a"
      },
      {
        "text": "Auf dem Fest tanzt ein Paar zusammen.",
        "answer": "a"
      },
      {
        "text": "Peter hat ein Paar unterschiedliche Socken an.",
        "answer": "b"
      },
      {
        "text": "Mia kauft sich ein Paar Handschuhe für den Winter.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "bad",
    "word": "BAD",
    "a": {
      "img": "assets/bad-a.jpg",
      "label": "das Bad"
    },
    "b": {
      "img": "assets/bad-b.jpg",
      "label": "das Bad"
    },
    "questions": [
      {
        "text": "Nach dem Spielen wäscht sich Ben im Bad die Hände.",
        "answer": "a"
      },
      {
        "text": "Mia sucht ihre Zahnbürste im Bad.",
        "answer": "a"
      },
      {
        "text": "Weil es heute so warm ist, gehen die Kinder nachmittags ins Bad.",
        "answer": "b"
      },
      {
        "text": "Am Wochenende verbringen die Kinder fast den ganzen Nachmittag im Bad.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "sieben",
    "word": "SIEBEN",
    "a": {
      "img": "assets/sieben-a.jpg",
      "label": "sieben"
    },
    "b": {
      "img": "assets/sieben-b.jpg",
      "label": "sieben"
    },
    "questions": [
      {
        "text": "Sieben Zwerge sitzen an einem Tisch.",
        "answer": "a"
      },
      {
        "text": "Heute um sieben Uhr höre ich Radio.",
        "answer": "a"
      },
      {
        "text": "Wir sieben den Sand in den Kasten.",
        "answer": "b"
      },
      {
        "text": "Mutti will das Mehl sieben.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "pflaster",
    "word": "PFLASTER",
    "a": {
      "img": "assets/pflaster-a.jpg",
      "label": "das Pflaster"
    },
    "b": {
      "img": "assets/pflaster-b.jpg",
      "label": "das Pflaster"
    },
    "questions": [
      {
        "text": "Mutti klebt ein Pflaster auf den Kratzer.",
        "answer": "a"
      },
      {
        "text": "Der Arzt hat lustige Pflaster mit Hunden und Katzen.",
        "answer": "a"
      },
      {
        "text": "Die Kutsche rattert über das Pflaster.",
        "answer": "b"
      },
      {
        "text": "Nach dem Regen glänzt das Pflaster in der Sonne.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "krone",
    "word": "KRONE",
    "a": {
      "img": "assets/krone-a.jpg",
      "label": "die Krone"
    },
    "b": {
      "img": "assets/krone-b.jpg",
      "label": "die Baumkrone"
    },
    "questions": [
      {
        "text": "Im Goldschatz des Drachen liegt eine Krone.",
        "answer": "a"
      },
      {
        "text": "Im Museum liegt eine prächtige Krone auf einem roten Kissen.",
        "answer": "a"
      },
      {
        "text": "In der Baumkrone sitzt ein Vogel.",
        "answer": "b"
      },
      {
        "text": "Die Kronen der Bäume bilden ein grünes Dach.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "linse",
    "word": "LINSE",
    "a": {
      "img": "assets/linse-a.jpg",
      "label": "die Linse"
    },
    "b": {
      "img": "linse-fernrohr.webp",
      "label": "die Linse"
    },
    "questions": [
      {
        "text": "Mutti kocht eine Suppe mit Linsen.",
        "answer": "a"
      },
      {
        "text": "Der Bäcker verkauft heute Brot mit roten Linsen.",
        "answer": "a"
      },
      {
        "text": "Das Fernrohr vergrößert mit seinen Linsen Dinge, die weit entfernt sind.",
        "answer": "b"
      },
      {
        "text": "Durch eine Linse sieht die Welt manchmal anders aus.",
        "answer": "b"
      }
    ]
  },
  {
    "id": "fluegel",
    "word": "FLÜGEL",
    "a": {
      "img": "assets/fluegel-a.jpg",
      "label": "der Flügel"
    },
    "b": {
      "img": "assets/fluegel-b.jpg",
      "label": "der Flügel"
    },
    "questions": [
      {
        "text": "Das kleine Vögelchen flattert mit seinen Flügeln.",
        "answer": "a"
      },
      {
        "text": "Mit seinen Flügeln kann der Vogel weit fliegen.",
        "answer": "a"
      },
      {
        "text": "Heute übt Mia am Flügel.",
        "answer": "b"
      },
      {
        "text": "Im Konzertsaal steht ein großer schwarzer Flügel.",
        "answer": "b"
      }
    ]
  }
];
const backImage = "assets/back.jpg";
