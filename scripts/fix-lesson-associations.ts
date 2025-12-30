import { db } from "../server/db";

async function main() {
    console.log("Fixing lesson courseIds and adding proper translations...\n");

    try {
        // Step 1: Fix courseIds for existing lessons
        console.log("=== STEP 1: Fixing courseIds ===\n");

        const lessonsSnapshot = await db.collection('lessons').get();
        const batch1 = db.batch();
        let count = 0;

        lessonsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const lang = data.language || 'en';

            // Map to correct courseId based on language
            let newCourseId = '';
            if (lang === 'en') {
                newCourseId = 'course_cognitive_wellness';
            } else if (lang === 'de' || lang === 'cognitive') {
                newCourseId = 'course_cognitive_wellness_de';
            } else if (lang === 'fr') {
                newCourseId = 'course_cognitive_wellness_fr';
            }

            if (newCourseId && data.courseId !== newCourseId) {
                batch1.update(doc.ref, { courseId: newCourseId });
                console.log(`  Updating ${doc.id}: courseId -> ${newCourseId}`);
                count++;
            }
        });

        if (count > 0) {
            await batch1.commit();
            console.log(`\n✓ Updated ${count} lessons with correct courseIds\n`);
        }

        // Step 2: Delete lessons with bad language tags
        console.log("=== STEP 2: Cleaning up bad language tags ===\n");
        const batch2 = db.batch();
        let deleteCount = 0;

        const badLessons = await db.collection('lessons')
            .where('language', '==', 'cognitive')
            .get();

        badLessons.docs.forEach(doc => {
            batch2.delete(doc.ref);
            console.log(`  Deleting lesson with bad language tag: ${doc.id}`);
            deleteCount++;
        });

        if (deleteCount > 0) {
            await batch2.commit();
            console.log(`\n✓ Deleted ${deleteCount} lessons with bad language tags\n`);
        }

        // Step 3: Add Portuguese lessons for Cognitive Wellness course
        console.log("=== STEP 3: Adding Portuguese lessons ===\n");

        const ptLessons = [
            {
                id: "lesson_intro_pt",
                title: "Introdução ao Bem-Estar Cognitivo",
                content: "Bem-vindo à sua jornada de bem-estar cognitivo! Este curso abrangente foi projetado para ajudá-lo a melhorar suas habilidades cognitivas através de técnicas baseadas em evidências. Ao longo das próximas semanas, você aprenderá estratégias práticas para melhorar a memória, foco, resolução de problemas e saúde geral do cérebro. Cada lição baseia-se na anterior, criando uma base sólida para o bem-estar cognitivo ao longo da vida.",
                courseId: "course_cognitive_wellness_pt",
                language: "pt",
                orderIndex: 1,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_memory_pt",
                title: "Técnicas de Melhoria da Memória",
                content: "A memória é uma das funções cognitivas mais importantes. Nesta lição, você aprenderá técnicas comprovadas para melhorar tanto a memória de curto quanto de longo prazo. Exploraremos mnemônicos, repetição espaçada, visualização e outras estratégias poderosas que podem ajudá-lo a lembrar informações de forma mais eficaz. Essas técnicas são úteis não apenas para estudar, mas também para a vida cotidiana.",
                courseId: "course_cognitive_wellness_pt",
                language: "pt",
                orderIndex: 2,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lesson_attention_pt",
                title: "Estratégias de Atenção e Foco",
                content: "No nosso mundo moderno cheio de distrações, a capacidade de manter o foco é mais valiosa do que nunca. Esta lição ensina estratégias práticas para melhorar sua atenção e concentração. Você aprenderá sobre a técnica Pomodoro, meditação mindfulness e como criar um ambiente propício ao foco profundo.",
                courseId: "course_cognitive_wellness_pt",
                language: "pt",
                orderIndex: 3,
                videoUrl: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const lesson of ptLessons) {
            await db.collection('lessons').doc(lesson.id).set(lesson);
            console.log(`  ✓ Added PT lesson: ${lesson.title}`);
        }

        console.log(`\n✅ Successfully added ${ptLessons.length} Portuguese lessons!`);

        console.log("\n=== SUMMARY ===");
        console.log(`- Fixed ${count} lesson courseIds`);
        console.log(`- Deleted ${deleteCount} lessons with bad language tags`);
        console.log(`- Added ${ptLessons.length} Portuguese lessons`);

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
