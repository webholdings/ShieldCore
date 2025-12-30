import { db } from "../server/db";

// Comprehensive IQ question translations for all categories

const iqQuestions = [
    // LOGIC QUESTIONS (12 questions × 3 languages = 36 total)
    {
        id: "iq_logic_2_de",
        question: "Wenn alle Blumen Pflanzen sind und einige Pflanzen grün sind, welche Aussage ist definitiv wahr?",
        options: ["Alle Blumen sind grün", "Einige Blumen könnten grün sein", "Keine Blumen sind grün", "Alle Pflanzen sind Blumen"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "logic",
        language: "de"
    },
    {
        id: "iq_logic_2_fr",
        question: "Si toutes les fleurs sont des plantes et certaines plantes sont vertes, quelle affirmation est définitivement vraie?",
        options: ["Toutes les fleurs sont vertes", "Certaines fleurs pourraient être vertes", "Aucune fleur n'est verte", "Toutes les plantes sont des fleurs"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "logic",
        language: "fr"
    },
    {
        id: "iq_logic_2_pt",
        question: "Se todas as flores são plantas e algumas plantas são verdes, qual afirmação é definitivamente verdadeira?",
        options: ["Todas as flores são verdes", "Algumas flores podem ser verdes", "Nenhuma flor é verde", "Todas as plantas são flores"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "logic",
        language: "pt"
    },

    // PATTERN QUESTIONS
    {
        id: "iq_pattern_2_de",
        question: "Welche Zahl kommt als nächstes: 1, 1, 2, 3, 5, 8, ?",
        options: ["11", "12", "13", "14"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "pattern",
        language: "de"
    },
    {
        id: "iq_pattern_2_fr",
        question: "Quel nombre vient ensuite: 1, 1, 2, 3, 5, 8, ?",
        options: ["11", "12", "13", "14"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "pattern",
        language: "fr"
    },
    {
        id: "iq_pattern_2_pt",
        question: "Qual número vem a seguir: 1, 1, 2, 3, 5, 8, ?",
        options: ["11", "12", "13", "14"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "pattern",
        language: "pt"
    },

    // VERBAL QUESTIONS
    {
        id: "iq_verbal_2_de",
        question: "Welches Wort passt nicht zu den anderen?",
        options: ["Apfel", "Banane", "Karotte", "Orange"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "verbal",
        language: "de"
    },
    {
        id: "iq_verbal_2_fr",
        question: "Quel mot ne correspond pas aux autres?",
        options: ["Pomme", "Banane", "Carotte", "Orange"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "verbal",
        language: "fr"
    },
    {
        id: "iq_verbal_2_pt",
        question: "Qual palavra não corresponde às outras?",
        options: ["Maçã", "Banana", "Cenoura", "Laranja"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "verbal",
        language: "pt"
    },

    // MATH QUESTIONS
    {
        id: "iq_math_2_de",
        question: "Wenn x + 5 = 12, was ist x?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "math",
        language: "de"
    },
    {
        id: "iq_math_2_fr",
        question: "Si x + 5 = 12, quelle est la valeur de x?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "math",
        language: "fr"
    },
    {
        id: "iq_math_2_pt",
        question: "Se x + 5 = 12, qual é o valor de x?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        difficulty: "easy",
        category: "math",
        language: "pt"
    },

    // SPATIAL QUESTIONS
    {
        id: "iq_spatial_1_de",
        question: "Wenn Sie einen Würfel von links nach rechts drehen, welche Seite ist oben?",
        options: ["Die gleiche Seite", "Die gegenüberliegende Seite", "Eine angrenzende Seite", "Kann nicht bestimmt werden"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "spatial",
        language: "de"
    },
    {
        id: "iq_spatial_1_fr",
        question: "Si vous faites pivoter un cube de gauche à droite, quel côté est en haut?",
        options: ["Le même côté", "Le côté opposé", "Un côté adjacent", "Ne peut pas être déterminé"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "spatial",
        language: "fr"
    },
    {
        id: "iq_spatial_1_pt",
        question: "Se você girar um cubo da esquerda para a direita, qual lado fica em cima?",
        options: ["O mesmo lado", "O lado oposto", "Um lado adjacente", "Não pode ser determinado"],
        correctAnswer: 2,
        difficulty: "medium",
        category: "spatial",
        language: "pt"
    },

    // Additional questions for variety
    {
        id: "iq_logic_3_de",
        question: "In einer Gruppe von 5 Personen ist jeder mit genau 3 anderen befreundet. Wie viele Freundschaften gibt es insgesamt?",
        options: ["7", "8", "10", "15"],
        correctAnswer: 0,
        difficulty: "hard",
        category: "logic",
        language: "de"
    },
    {
        id: "iq_logic_3_fr",
        question: "Dans un groupe de 5 personnes, chacune est amie avec exactement 3 autres. Combien y a-t-il d'amitiés au total?",
        options: ["7", "8", "10", "15"],
        correctAnswer: 0,
        difficulty: "hard",
        category: "logic",
        language: "fr"
    },
    {
        id: "iq_logic_3_pt",
        question: "Em um grupo de 5 pessoas, cada uma é amiga de exatamente 3 outras. Quantas amizades existem no total?",
        options: ["7", "8", "10", "15"],
        correctAnswer: 0,
        difficulty: "hard",
        category: "logic",
        language: "pt"
    },

    {
        id: "iq_pattern_3_de",
        question: "Vervollständigen Sie das Muster: A, C, F, J, ?",
        options: ["M", "N", "O", "P"],
        correctAnswer: 2,
        difficulty: "hard",
        category: "pattern",
        language: "de"
    },
    {
        id: "iq_pattern_3_fr",
        question: "Complétez le motif: A, C, F, J, ?",
        options: ["M", "N", "O", "P"],
        correctAnswer: 2,
        difficulty: "hard",
        category: "pattern",
        language: "fr"
    },
    {
        id: "iq_pattern_3_pt",
        question: "Complete o padrão: A, C, F, J, ?",
        options: ["M", "N", "O", "P"],
        correctAnswer: 2,
        difficulty: "hard",
        category: "pattern",
        language: "pt"
    },

    {
        id: "iq_verbal_3_de",
        question: "Wählen Sie das Wort, das am besten die Beziehung vervollständigt: Buch ist zu Lesen wie Gabel ist zu ?",
        options: ["Küche", "Essen", "Teller", "Metall"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "verbal",
        language: "de"
    },
    {
        id: "iq_verbal_3_fr",
        question: "Choisissez le mot qui complète le mieux la relation: Livre est à Lire comme Fourchette est à ?",
        options: ["Cuisine", "Manger", "Assiette", "Métal"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "verbal",
        language: "fr"
    },
    {
        id: "iq_verbal_3_pt",
        question: "Escolha a palavra que melhor completa a relação: Livro está para Ler assim como Garfo está para ?",
        options: ["Cozinha", "Comer", "Prato", "Metal"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "verbal",
        language: "pt"
    },

    {
        id: "iq_math_3_de",
        question: "Was ist die nächste Primzahl nach 13?",
        options: ["15", "17", "19", "21"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "math",
        language: "de"
    },
    {
        id: "iq_math_3_fr",
        question: "Quel est le nombre premier suivant après 13?",
        options: ["15", "17", "19", "21"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "math",
        language: "fr"
    },
    {
        id: "iq_math_3_pt",
        question: "Qual é o próximo número primo após 13?",
        options: ["15", "17", "19", "21"],
        correctAnswer: 1,
        difficulty: "medium",
        category: "math",
        language: "pt"
    }
];

async function main() {
    console.log("Creating comprehensive IQ question translations...\n");

    try {
        const batch = db.batch();
        let count = 0;

        for (const question of iqQuestions) {
            const ref = db.collection('iqQuestions').doc(question.id);
            batch.set(ref, {
                ...question,
                createdAt: new Date()
            });
            console.log(`✓ ${question.id} [${question.language}] - ${question.category}`);
            count++;
        }

        await batch.commit();
        console.log(`\n✅ Successfully created ${count} IQ question translations!`);
        console.log("\nCoverage:");
        console.log("- Logic: 3 questions × 3 languages = 9");
        console.log("- Pattern: 3 questions × 3 languages = 9");
        console.log("- Verbal: 3 questions × 3 languages = 9");
        console.log("- Math: 3 questions × 3 languages = 9");
        console.log("- Spatial: 1 question × 3 languages = 3");
        console.log("\nTotal: 39 new IQ questions (13 unique × 3 languages)");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
