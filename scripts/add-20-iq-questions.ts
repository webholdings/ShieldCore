import { db } from "../server/db";

// 20 unique IQ questions × 4 languages = 80 total questions

const iqQuestions = [
    // LOGIC QUESTIONS (5 unique × 4 languages = 20)
    {
        en: {
            id: "iq_logic_4_en",
            question: "If some cats are animals and all animals need food, which statement must be true?",
            options: ["All cats need food", "Some cats don't need food", "No cats are animals", "Animals are cats"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "logic",
            language: "en"
        },
        de: {
            id: "iq_logic_4_de",
            question: "Wenn einige Katzen Tiere sind und alle Tiere Nahrung brauchen, welche Aussage muss wahr sein?",
            options: ["Alle Katzen brauchen Nahrung", "Einige Katzen brauchen keine Nahrung", "Keine Katzen sind Tiere", "Tiere sind Katzen"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "logic",
            language: "de"
        },
        fr: {
            id: "iq_logic_4_fr",
            question: "Si certains chats sont des animaux et tous les animaux ont besoin de nourriture, quelle affirmation doit être vraie?",
            options: ["Tous les chats ont besoin de nourriture", "Certains chats n'ont pas besoin de nourriture", "Aucun chat n'est un animal", "Les animaux sont des chats"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "logic",
            language: "fr"
        },
        pt: {
            id: "iq_logic_4_pt",
            question: "Se alguns gatos são animais e todos os animais precisam de comida, qual afirmação deve ser verdadeira?",
            options: ["Todos os gatos precisam de comida", "Alguns gatos não precisam de comida", "Nenhum gato é animal", "Animais são gatos"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "logic",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_logic_5_en",
            question: "A is taller than B. C is shorter than B. Who is the shortest?",
            options: ["A", "B", "C", "Cannot be determined"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "en"
        },
        de: {
            id: "iq_logic_5_de",
            question: "A ist größer als B. C ist kleiner als B. Wer ist der Kleinste?",
            options: ["A", "B", "C", "Kann nicht bestimmt werden"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "de"
        },
        fr: {
            id: "iq_logic_5_fr",
            question: "A est plus grand que B. C est plus petit que B. Qui est le plus petit?",
            options: ["A", "B", "C", "Ne peut pas être déterminé"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "fr"
        },
        pt: {
            id: "iq_logic_5_pt",
            question: "A é mais alto que B. C é mais baixo que B. Quem é o mais baixo?",
            options: ["A", "B", "C", "Não pode ser determinado"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_logic_6_en",
            question: "If it rains, the ground gets wet. The ground is wet. What can we conclude?",
            options: ["It rained", "It might have rained", "It didn't rain", "The ground is dry"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "logic",
            language: "en"
        },
        de: {
            id: "iq_logic_6_de",
            question: "Wenn es regnet, wird der Boden nass. Der Boden ist nass. Was können wir schlussfolgern?",
            options: ["Es hat geregnet", "Es könnte geregnet haben", "Es hat nicht geregnet", "Der Boden ist trocken"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "logic",
            language: "de"
        },
        fr: {
            id: "iq_logic_6_fr",
            question: "S'il pleut, le sol devient mouillé. Le sol est mouillé. Que pouvons-nous conclure?",
            options: ["Il a plu", "Il a peut-être plu", "Il n'a pas plu", "Le sol est sec"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "logic",
            language: "fr"
        },
        pt: {
            id: "iq_logic_6_pt",
            question: "Se chover, o chão fica molhado. O chão está molhado. O que podemos concluir?",
            options: ["Choveu", "Pode ter chovido", "Não choveu", "O chão está seco"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "logic",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_logic_7_en",
            question: "All birds have feathers. Penguins have feathers. Therefore, penguins are:",
            options: ["Definitely birds", "Possibly birds", "Not birds", "Fish"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "en"
        },
        de: {
            id: "iq_logic_7_de",
            question: "Alle Vögel haben Federn. Pinguine haben Federn. Daher sind Pinguine:",
            options: ["Definitiv Vögel", "Möglicherweise Vögel", "Keine Vögel", "Fische"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "de"
        },
        fr: {
            id: "iq_logic_7_fr",
            question: "Tous les oiseaux ont des plumes. Les pingouins ont des plumes. Par conséquent, les pingouins sont:",
            options: ["Définitivement des oiseaux", "Possiblement des oiseaux", "Pas des oiseaux", "Des poissons"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "fr"
        },
        pt: {
            id: "iq_logic_7_pt",
            question: "Todas as aves têm penas. Pinguins têm penas. Portanto, pinguins são:",
            options: ["Definitivamente aves", "Possivelmente aves", "Não são aves", "Peixes"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_logic_8_en",
            question: "Three friends finish a race. Anna finishes before Bob but after Carol. Who finished first?",
            options: ["Anna", "Bob", "Carol", "Cannot determine"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "en"
        },
        de: {
            id: "iq_logic_8_de",
            question: "Drei Freunde beenden ein Rennen. Anna beendet vor Bob aber nach Carol. Wer wurde Erster?",
            options: ["Anna", "Bob", "Carol", "Kann nicht bestimmt werden"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "de"
        },
        fr: {
            id: "iq_logic_8_fr",
            question: "Trois amis terminent une course. Anna termine avant Bob mais après Carol. Qui a fini premier?",
            options: ["Anna", "Bob", "Carol", "Ne peut pas déterminer"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "fr"
        },
        pt: {
            id: "iq_logic_8_pt",
            question: "Três amigos terminam uma corrida. Anna termina antes de Bob mas depois de Carol. Quem terminou primeiro?",
            options: ["Anna", "Bob", "Carol", "Não pode determinar"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "logic",
            language: "pt"
        }
    },

    // PATTERN QUESTIONS (5 unique × 4 languages = 20)
    {
        en: {
            id: "iq_pattern_4_en",
            question: "What comes next in the sequence: 3, 6, 12, 24, ?",
            options: ["36", "48", "40", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "en"
        },
        de: {
            id: "iq_pattern_4_de",
            question: "Was kommt als nächstes in der Sequenz: 3, 6, 12, 24, ?",
            options: ["36", "48", "40", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "de"
        },
        fr: {
            id: "iq_pattern_4_fr",
            question: "Que vient ensuite dans la séquence: 3, 6, 12, 24, ?",
            options: ["36", "48", "40", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "fr"
        },
        pt: {
            id: "iq_pattern_4_pt",
            question: "O que vem a seguir na sequência: 3, 6, 12, 24, ?",
            options: ["36", "48", "40", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_pattern_5_en",
            question: "Complete the pattern: 100, 95, 85, 70, ?",
            options: ["50", "55", "60", "65"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "pattern",
            language: "en"
        },
        de: {
            id: "iq_pattern_5_de",
            question: "Vervollständigen Sie das Muster: 100, 95, 85, 70, ?",
            options: ["50", "55", "60", "65"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "pattern",
            language: "de"
        },
        fr: {
            id: "iq_pattern_5_fr",
            question: "Complétez le motif: 100, 95, 85, 70, ?",
            options: ["50", "55", "60", "65"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "pattern",
            language: "fr"
        },
        pt: {
            id: "iq_pattern_5_pt",
            question: "Complete o padrão: 100, 95, 85, 70, ?",
            options: ["50", "55", "60", "65"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "pattern",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_pattern_6_en",
            question: "What number should replace the question mark: 2, 5, 11, 23, ?",
            options: ["35", "41", "47", "53"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "en"
        },
        de: {
            id: "iq_pattern_6_de",
            question: "Welche Zahl sollte das Fragezeichen ersetzen: 2, 5, 11, 23, ?",
            options: ["35", "41", "47", "53"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "de"
        },
        fr: {
            id: "iq_pattern_6_fr",
            question: "Quel nombre devrait remplacer le point d'interrogation: 2, 5, 11, 23, ?",
            options: ["35", "41", "47", "53"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "fr"
        },
        pt: {
            id: "iq_pattern_6_pt",
            question: "Qual número deve substituir o ponto de interrogação: 2, 5, 11, 23, ?",
            options: ["35", "41", "47", "53"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_pattern_7_en",
            question: "Find the next letter: B, D, G, K, ?",
            options: ["M", "N", "P", "Q"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "en"
        },
        de: {
            id: "iq_pattern_7_de",
            question: "Finden Sie den nächsten Buchstaben: B, D, G, K, ?",
            options: ["M", "N", "P", "Q"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "de"
        },
        fr: {
            id: "iq_pattern_7_fr",
            question: "Trouvez la lettre suivante: B, D, G, K, ?",
            options: ["M", "N", "P", "Q"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "fr"
        },
        pt: {
            id: "iq_pattern_7_pt",
            question: "Encontre a próxima letra: B, D, G, K, ?",
            options: ["M", "N", "P", "Q"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_pattern_8_en",
            question: "What comes next: 1, 4, 9, 16, 25, ?",
            options: ["30", "32", "36", "40"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "pattern",
            language: "en"
        },
        de: {
            id: "iq_pattern_8_de",
            question: "Was kommt als nächstes: 1, 4, 9, 16, 25, ?",
            options: ["30", "32", "36", "40"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "pattern",
            language: "de"
        },
        fr: {
            id: "iq_pattern_8_fr",
            question: "Que vient ensuite: 1, 4, 9, 16, 25, ?",
            options: ["30", "32", "36", "40"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "pattern",
            language: "fr"
        },
        pt: {
            id: "iq_pattern_8_pt",
            question: "O que vem a seguir: 1, 4, 9, 16, 25, ?",
            options: ["30", "32", "36", "40"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "pattern",
            language: "pt"
        }
    },

    // MATH QUESTIONS (5 unique × 4 languages = 20)
    {
        en: {
            id: "iq_math_4_en",
            question: "If 3x + 7 = 22, what is x?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "en"
        },
        de: {
            id: "iq_math_4_de",
            question: "Wenn 3x + 7 = 22, was ist x?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "de"
        },
        fr: {
            id: "iq_math_4_fr",
            question: "Si 3x + 7 = 22, quelle est la valeur de x?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "fr"
        },
        pt: {
            id: "iq_math_4_pt",
            question: "Se 3x + 7 = 22, qual é o valor de x?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_math_5_en",
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "math",
            language: "en"
        },
        de: {
            id: "iq_math_5_de",
            question: "Was sind 25% von 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "math",
            language: "de"
        },
        fr: {
            id: "iq_math_5_fr",
            question: "Combien font 25% de 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "math",
            language: "fr"
        },
        pt: {
            id: "iq_math_5_pt",
            question: "Quanto é 25% de 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "math",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_math_6_en",
            question: "A rectangle has a length of 8 and width of 5. What is its area?",
            options: ["13", "26", "40", "45"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "en"
        },
        de: {
            id: "iq_math_6_de",
            question: "Ein Rechteck hat eine Länge von 8 und eine Breite von 5. Was ist seine Fläche?",
            options: ["13", "26", "40", "45"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "de"
        },
        fr: {
            id: "iq_math_6_fr",
            question: "Un rectangle a une longueur de 8 et une largeur de 5. Quelle est son aire?",
            options: ["13", "26", "40", "45"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "fr"
        },
        pt: {
            id: "iq_math_6_pt",
            question: "Um retângulo tem comprimento de 8 e largura de 5. Qual é sua área?",
            options: ["13", "26", "40", "45"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_math_7_en",
            question: "If a train travels 120 km in 2 hours, what is its average speed?",
            options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "en"
        },
        de: {
            id: "iq_math_7_de",
            question: "Wenn ein Zug 120 km in 2 Stunden fährt, was ist seine Durchschnittsgeschwindigkeit?",
            options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "de"
        },
        fr: {
            id: "iq_math_7_fr",
            question: "Si un train parcourt 120 km en 2 heures, quelle est sa vitesse moyenne?",
            options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "fr"
        },
        pt: {
            id: "iq_math_7_pt",
            question: "Se um trem viaja 120 km em 2 horas, qual é sua velocidade média?",
            options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "math",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_math_8_en",
            question: "What is the square root of 144?",
            options: ["10", "11", "12", "13"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "en"
        },
        de: {
            id: "iq_math_8_de",
            question: "Was ist die Quadratwurzel von 144?",
            options: ["10", "11", "12", "13"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "de"
        },
        fr: {
            id: "iq_math_8_fr",
            question: "Quelle est la racine carrée de 144?",
            options: ["10", "11", "12", "13"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "fr"
        },
        pt: {
            id: "iq_math_8_pt",
            question: "Qual é a raiz quadrada de 144?",
            options: ["10", "11", "12", "13"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "math",
            language: "pt"
        }
    },

    // VERBAL QUESTIONS (5 unique × 4 languages = 20)
    {
        en: {
            id: "iq_verbal_4_en",
            question: "Which word is the opposite of 'Ancient'?",
            options: ["Old", "Modern", "Historic", "Traditional"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "en"
        },
        de: {
            id: "iq_verbal_4_de",
            question: "Welches Wort ist das Gegenteil von 'Antik'?",
            options: ["Alt", "Modern", "Historisch", "Traditionell"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "de"
        },
        fr: {
            id: "iq_verbal_4_fr",
            question: "Quel mot est le contraire de 'Ancien'?",
            options: ["Vieux", "Moderne", "Historique", "Traditionnel"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "fr"
        },
        pt: {
            id: "iq_verbal_4_pt",
            question: "Qual palavra é o oposto de 'Antigo'?",
            options: ["Velho", "Moderno", "Histórico", "Tradicional"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_verbal_5_en",
            question: "Complete the analogy: Hot is to Cold as Day is to ?",
            options: ["Sun", "Night", "Light", "Morning"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "en"
        },
        de: {
            id: "iq_verbal_5_de",
            question: "Vervollständigen Sie die Analogie: Heiß ist zu Kalt wie Tag ist zu ?",
            options: ["Sonne", "Nacht", "Licht", "Morgen"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "de"
        },
        fr: {
            id: "iq_verbal_5_fr",
            question: "Complétez l'analogie: Chaud est à Froid comme Jour est à ?",
            options: ["Soleil", "Nuit", "Lumière", "Matin"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "fr"
        },
        pt: {
            id: "iq_verbal_5_pt",
            question: "Complete a analogia: Quente está para Frio assim como Dia está para ?",
            options: ["Sol", "Noite", "Luz", "Manhã"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_verbal_6_en",
            question: "Which word does NOT belong: Rose, Tulip, Oak, Daisy",
            options: ["Rose", "Tulip", "Oak", "Daisy"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "verbal",
            language: "en"
        },
        de: {
            id: "iq_verbal_6_de",
            question: "Welches Wort gehört NICHT dazu: Rose, Tulpe, Eiche, Gänseblümchen",
            options: ["Rose", "Tulpe", "Eiche", "Gänseblümchen"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "verbal",
            language: "de"
        },
        fr: {
            id: "iq_verbal_6_fr",
            question: "Quel mot n'appartient PAS: Rose, Tulipe, Chêne, Marguerite",
            options: ["Rose", "Tulipe", "Chêne", "Marguerite"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "verbal",
            language: "fr"
        },
        pt: {
            id: "iq_verbal_6_pt",
            question: "Qual palavra NÃO pertence: Rosa, Tulipa, Carvalho, Margarida",
            options: ["Rosa", "Tulipa", "Carvalho", "Margarida"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "verbal",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_verbal_7_en",
            question: "What is a synonym for 'Brave'?",
            options: ["Scared", "Courageous", "Weak", "Timid"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "en"
        },
        de: {
            id: "iq_verbal_7_de",
            question: "Was ist ein Synonym für 'Mutig'?",
            options: ["Ängstlich", "Tapfer", "Schwach", "Schüchtern"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "de"
        },
        fr: {
            id: "iq_verbal_7_fr",
            question: "Quel est un synonyme de 'Courageux'?",
            options: ["Effrayé", "Brave", "Faible", "Timide"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "fr"
        },
        pt: {
            id: "iq_verbal_7_pt",
            question: "Qual é um sinônimo de 'Corajoso'?",
            options: ["Assustado", "Valente", "Fraco", "Tímido"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "verbal",
            language: "pt"
        }
    },
    {
        en: {
            id: "iq_verbal_8_en",
            question: "Pen is to Write as Knife is to ?",
            options: ["Sharp", "Cut", "Metal", "Kitchen"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "en"
        },
        de: {
            id: "iq_verbal_8_de",
            question: "Stift ist zu Schreiben wie Messer ist zu ?",
            options: ["Scharf", "Schneiden", "Metall", "Küche"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "de"
        },
        fr: {
            id: "iq_verbal_8_fr",
            question: "Stylo est à Écrire comme Couteau est à ?",
            options: ["Tranchant", "Couper", "Métal", "Cuisine"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "fr"
        },
        pt: {
            id: "iq_verbal_8_pt",
            question: "Caneta está para Escrever assim como Faca está para ?",
            options: ["Afiado", "Cortar", "Metal", "Cozinha"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "pt"
        }
    }
];

async function main() {
    console.log("Adding 20 unique IQ questions across all languages...\n");

    try {
        const batch = db.batch();
        let count = 0;

        for (const questionSet of iqQuestions) {
            for (const [lang, data] of Object.entries(questionSet)) {
                const ref = db.collection('iqQuestions').doc(data.id);
                batch.set(ref, {
                    ...data,
                    createdAt: new Date()
                });
                console.log(`✓ ${data.id} [${lang}]`);
                count++;
            }
        }

        await batch.commit();
        console.log(`\n✅ Successfully created ${count} IQ questions!`);
        console.log("\nBreakdown:");
        console.log("- 20 unique questions");
        console.log("- 4 languages each (EN, DE, FR, PT)");
        console.log("- Total: 80 question versions");
        console.log("\nCategories:");
        console.log("- Logic: 5 questions × 4 languages = 20");
        console.log("- Pattern: 5 questions × 4 languages = 20");
        console.log("- Math: 5 questions × 4 languages = 20");
        console.log("- Verbal: 5 questions × 4 languages = 20");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
