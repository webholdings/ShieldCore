import { db } from "../server/db";

// This script fixes IQ question translations by replacing [DE]/[FR]/[PT] placeholders with real translations

async function main() {
    console.log("Fixing IQ Question Translations...\n");

    try {
        // Get all IQ questions with placeholder translations
        const snapshot = await db.collection('iqQuestions').get();

        const batch = db.batch();
        let fixedCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const lang = data.language;

            // Skip English questions
            if (lang === 'en') continue;

            // Check if this has placeholder content
            if (data.question?.startsWith('[DE]') || data.question?.startsWith('[FR]') || data.question?.startsWith('[PT]')) {
                console.log(`Deleting placeholder question: ${doc.id} [${lang}]`);
                batch.delete(doc.ref);
                fixedCount++;
            }
        }

        if (fixedCount > 0) {
            await batch.commit();
            console.log(`\n✓ Deleted ${fixedCount} placeholder IQ questions\n`);
        }

        // Now create proper translations for key IQ questions
        console.log("Creating proper IQ question translations...\n");

        const properTranslations = [
            // Logic question 1
            {
                id: "iq_logic_1_de",
                question: "John ist größer als Peter. Peter ist kleiner als Tom. Tom ist kleiner als John. Wer ist der Größte?",
                options: ["John", "Peter", "Tom", "Nicht genug Informationen"],
                correctAnswer: 0,
                difficulty: "easy",
                category: "logic",
                language: "de",
                createdAt: new Date()
            },
            {
                id: "iq_logic_1_fr",
                question: "John est plus grand que Peter. Peter est plus petit que Tom. Tom est plus petit que John. Qui est le plus grand?",
                options: ["John", "Peter", "Tom", "Pas assez d'informations"],
                correctAnswer: 0,
                difficulty: "easy",
                category: "logic",
                language: "fr",
                createdAt: new Date()
            },
            {
                id: "iq_logic_1_pt",
                question: "John é mais alto que Peter. Peter é mais baixo que Tom. Tom é mais baixo que John. Quem é o mais alto?",
                options: ["John", "Peter", "Tom", "Informação insuficiente"],
                correctAnswer: 0,
                difficulty: "easy",
                category: "logic",
                language: "pt",
                createdAt: new Date()
            },

            // Pattern question
            {
                id: "iq_pattern_1_de",
                question: "Welche Zahl kommt als nächstes in der Reihe: 2, 4, 8, 16, ?",
                options: ["20", "24", "32", "64"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "pattern",
                language: "de",
                createdAt: new Date()
            },
            {
                id: "iq_pattern_1_fr",
                question: "Quel nombre vient ensuite dans la séquence: 2, 4, 8, 16, ?",
                options: ["20", "24", "32", "64"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "pattern",
                language: "fr",
                createdAt: new Date()
            },
            {
                id: "iq_pattern_1_pt",
                question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?",
                options: ["20", "24", "32", "64"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "pattern",
                language: "pt",
                createdAt: new Date()
            },

            // Verbal question
            {
                id: "iq_verbal_1_de",
                question: "Welches Wort ist ein Synonym für 'Glücklich'?",
                options: ["Traurig", "Freudig", "Wütend", "Müde"],
                correctAnswer: 1,
                difficulty: "easy",
                category: "verbal",
                language: "de",
                createdAt: new Date()
            },
            {
                id: "iq_verbal_1_fr",
                question: "Quel mot est un synonyme de 'Heureux'?",
                options: ["Triste", "Joyeux", "En colère", "Fatigué"],
                correctAnswer: 1,
                difficulty: "easy",
                category: "verbal",
                language: "fr",
                createdAt: new Date()
            },
            {
                id: "iq_verbal_1_pt",
                question: "Qual palavra é sinônimo de 'Feliz'?",
                options: ["Triste", "Alegre", "Zangado", "Cansado"],
                correctAnswer: 1,
                difficulty: "easy",
                category: "verbal",
                language: "pt",
                createdAt: new Date()
            },

            // Math question
            {
                id: "iq_math_1_de",
                question: "Was ist 15% von 200?",
                options: ["20", "25", "30", "35"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "math",
                language: "de",
                createdAt: new Date()
            },
            {
                id: "iq_math_1_fr",
                question: "Combien font 15% de 200?",
                options: ["20", "25", "30", "35"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "math",
                language: "fr",
                createdAt: new Date()
            },
            {
                id: "iq_math_1_pt",
                question: "Quanto é 15% de 200?",
                options: ["20", "25", "30", "35"],
                correctAnswer: 2,
                difficulty: "easy",
                category: "math",
                language: "pt",
                createdAt: new Date()
            }
        ];

        const batch2 = db.batch();
        for (const question of properTranslations) {
            const ref = db.collection('iqQuestions').doc(question.id);
            batch2.set(ref, question);
            console.log(`✓ Created: ${question.id} [${question.language}]`);
        }

        await batch2.commit();
        console.log(`\n✅ Successfully created ${properTranslations.length} properly translated IQ questions!`);
        console.log("\nNote: This is a sample set. You may want to add more IQ questions with proper translations.");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
