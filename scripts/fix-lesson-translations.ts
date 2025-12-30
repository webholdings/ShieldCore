import { db } from "../server/db";

async function main() {
    console.log("Deleting placeholder lessons and creating proper translations...\n");

    try {
        // Step 1: Delete all lessons with placeholder content
        console.log("=== STEP 1: Deleting placeholder lessons ===\n");

        const placeholderLessons = await db.collection('lessons')
            .get();

        const batch1 = db.batch();
        let deleteCount = 0;

        placeholderLessons.docs.forEach(doc => {
            const data = doc.data();
            const content = data.content || '';

            // Delete if content starts with [DE] or [FR] (placeholder)
            if (content.startsWith('[DE]') || content.startsWith('[FR]')) {
                batch1.delete(doc.ref);
                console.log(`  Deleting placeholder: ${doc.id} [${data.language}]`);
                deleteCount++;
            }
        });

        if (deleteCount > 0) {
            await batch1.commit();
            console.log(`\n✓ Deleted ${deleteCount} placeholder lessons\n`);
        }

        // Step 2: Create proper German lessons for Cognitive Wellness course
        console.log("=== STEP 2: Creating German lessons with real content ===\n");

        const deLessons = [
            {
                id: "lesson_intro_de",
                title: "Einführung in die kognitive Wellness",
                content: "Willkommen auf Ihrer Reise zum kognitiven Wohlbefinden! Dieser umfassende Kurs wurde entwickelt, um Ihnen zu helfen, Ihre kognitiven Fähigkeiten durch evidenzbasierte Techniken zu verbessern. In den kommenden Wochen lernen Sie praktische Strategien zur Verbesserung von Gedächtnis, Fokus, Problemlösung und allgemeiner Gehirngesundheit. Jede Lektion baut auf der vorherigen auf und schafft eine solide Grundlage für lebenslanges kognitives Wohlbefinden.",
                courseId: "course_cognitive_wellness_de",
                language: "de",
                orderIndex: 1,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_memory_de",
                title: "Techniken zur Gedächtnisverbesserung",
                content: "Das Gedächtnis ist eine der wichtigsten kognitiven Funktionen. In dieser Lektion lernen Sie bewährte Techniken zur Verbesserung sowohl des Kurzzeit- als auch des Langzeitgedächtnisses. Wir werden Mnemotechniken, verteiltes Wiederholen, Visualisierung und andere leistungsstarke Strategien erkunden, die Ihnen helfen können, sich Informationen effektiver zu merken. Diese Techniken sind nicht nur zum Lernen nützlich, sondern auch für den Alltag.",
                courseId: "course_cognitive_wellness_de",
                language: "de",
                orderIndex: 2,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_attention_de",
                title: "Strategien für Aufmerksamkeit und Fokus",
                content: "In unserer modernen Welt voller Ablenkungen ist die Fähigkeit, den Fokus aufrechtzuerhalten, wertvoller denn je. Diese Lektion vermittelt praktische Strategien zur Verbesserung Ihrer Aufmerksamkeit und Konzentration. Sie lernen die Pomodoro-Technik, Achtsamkeitsmeditation und wie Sie eine Umgebung schaffen, die tiefen Fokus fördert.",
                courseId: "course_cognitive_wellness_de",
                language: "de",
                orderIndex: 3,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_problem_solving_de",
                title: "Problemlösungsfähigkeiten",
                content: "Effektive Problemlösung ist eine kritische kognitive Fähigkeit. Diese Lektion führt Sie durch strukturierte Ansätze zur Problemlösung, einschließlich der Definition des Problems, Brainstorming von Lösungen, Bewertung von Optionen und Umsetzung von Strategien. Sie lernen auch, wie Sie kreatives Denken mit analytischem Denken kombinieren können.",
                courseId: "course_cognitive_wellness_de",
                language: "de",
                orderIndex: 4,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_creative_thinking_de",
                title: "Kreatives Denken",
                content: "Kreativität ist nicht nur für Künstler – sie ist eine wichtige kognitive Fähigkeit für alle. Diese Lektion erkundet Techniken zur Förderung kreativen Denkens, einschließlich lateralem Denken, Brainstorming und der Überwindung mentaler Blockaden. Sie lernen, wie Sie Ihre natürliche Kreativität nutzen können, um innovative Lösungen zu finden.",
                courseId: "course_cognitive_wellness_de",
                language: "de",
                orderIndex: 5,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const lesson of deLessons) {
            await db.collection('lessons').doc(lesson.id).set(lesson);
            console.log(`  ✓ Created DE lesson: ${lesson.title}`);
        }

        // Step 3: Create French lessons
        console.log("\n=== STEP 3: Creating French lessons with real content ===\n");

        const frLessons = [
            {
                id: "lesson_intro_fr",
                title: "Introduction au bien-être cognitif",
                content: "Bienvenue dans votre parcours de bien-être cognitif ! Ce cours complet est conçu pour vous aider à améliorer vos capacités cognitives grâce à des techniques fondées sur des preuves. Au cours des prochaines semaines, vous apprendrez des stratégies pratiques pour améliorer la mémoire, la concentration, la résolution de problèmes et la santé globale du cerveau. Chaque leçon s'appuie sur la précédente, créant une base solide pour le bien-être cognitif tout au long de la vie.",
                courseId: "course_cognitive_wellness_fr",
                language: "fr",
                orderIndex: 1,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_memory_fr",
                title: "Techniques d'amélioration de la mémoire",
                content: "La mémoire est l'une des fonctions cognitives les plus importantes. Dans cette leçon, vous apprendrez des techniques éprouvées pour améliorer à la fois la mémoire à court et à long terme. Nous explorerons les mnémoniques, la répétition espacée, la visualisation et d'autres stratégies puissantes qui peuvent vous aider à mémoriser les informations plus efficacement. Ces techniques sont utiles non seulement pour étudier, mais aussi pour la vie quotidienne.",
                courseId: "course_cognitive_wellness_fr",
                language: "fr",
                orderIndex: 2,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_attention_fr",
                title: "Stratégies d'attention et de concentration",
                content: "Dans notre monde moderne rempli de distractions, la capacité à maintenir la concentration est plus précieuse que jamais. Cette leçon enseigne des stratégies pratiques pour améliorer votre attention et votre concentration. Vous apprendrez la technique Pomodoro, la méditation de pleine conscience et comment créer un environnement propice à une concentration profonde.",
                courseId: "course_cognitive_wellness_fr",
                language: "fr",
                orderIndex: 3,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const lesson of frLessons) {
            await db.collection('lessons').doc(lesson.id).set(lesson);
            console.log(`  ✓ Created FR lesson: ${lesson.title}`);
        }

        console.log("\n=== SUMMARY ===");
        console.log(`- Deleted ${deleteCount} placeholder lessons`);
        console.log(`- Created ${deLessons.length} German lessons with real content`);
        console.log(`- Created ${frLessons.length} French lessons with real content`);
        console.log("\n✅ Lesson translations fixed!");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
