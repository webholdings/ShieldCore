import { db } from "../server/db";

// Redistribute 20 lessons across 4 courses (5 lessons each)
// This fixes the issue where all lessons were associated with only one course

const lessonDistribution = {
    // MINDFULNESS BASICS - Lessons 1-5
    mindfulness_basics: [
        { id: "lesson_intro", orderIndex: 1 },
        { id: "lesson_mindfulness", orderIndex: 2 },
        { id: "lesson_attention", orderIndex: 3 },
        { id: "lesson_emotional_iq", orderIndex: 4 },
        { id: "lesson_social", orderIndex: 5 }
    ],

    // STRESS MANAGEMENT - Lessons 6-10
    stress_management: [
        { id: "lesson_stress", orderIndex: 1 },
        { id: "lesson_sleep", orderIndex: 2 },
        { id: "lesson_brain_nutrition", orderIndex: 3 },
        { id: "lesson_exercise", orderIndex: 4 },
        { id: "lesson_gut_brain", orderIndex: 5 }
    ],

    // COGNITIVE FITNESS - Lessons 11-15
    cognitive_fitness: [
        { id: "lesson_memory", orderIndex: 1 },
        { id: "lesson_problem_solving", orderIndex: 2 },
        { id: "lesson_creative_thinking", orderIndex: 3 },
        { id: "lesson_new_skill", orderIndex: 4 },
        { id: "lesson_music", orderIndex: 5 }
    ],

    // COGNITIVE WELLNESS JOURNEY - Lessons 16-20
    cognitive_wellness: [
        { id: "lesson_vitality", orderIndex: 1 },
        { id: "lesson_neuroplasticity", orderIndex: 2 },
        { id: "lesson_digital_detox", orderIndex: 3 },
        { id: "lesson_cognitive_reserve", orderIndex: 4 },
        { id: "lesson_future", orderIndex: 5 }
    ]
};

const courseMapping = {
    en: {
        mindfulness_basics: "course_mindfulness_basics",
        stress_management: "course_stress_management",
        cognitive_fitness: "course_cognitive_fitness",
        cognitive_wellness: "course_cognitive_wellness"
    },
    de: {
        mindfulness_basics: "course_achtsamkeit_grundlagen",
        stress_management: "course_stress_management_de",
        cognitive_fitness: "course_cognitive_fitness_de",
        cognitive_wellness: "course_cognitive_wellness_de"
    },
    fr: {
        mindfulness_basics: "course_bases_de_la_pleine_conscience",
        stress_management: "course_gestion_du_stress",
        cognitive_fitness: "course_cognitive_fitness_fr",
        cognitive_wellness: "course_cognitive_wellness_fr"
    },
    pt: {
        mindfulness_basics: "course_mindfulness_basics_pt",
        stress_management: "course_stress_management_pt",
        cognitive_fitness: "course_cognitive_fitness_pt",
        cognitive_wellness: "course_cognitive_wellness_pt"
    }
};

async function main() {
    console.log("Redistributing lessons across all courses...\n");

    try {
        const batch = db.batch();
        let updateCount = 0;

        for (const [courseKey, lessons] of Object.entries(lessonDistribution)) {
            console.log(`\n--- ${courseKey.toUpperCase().replace(/_/g, ' ')} ---`);

            for (const lesson of lessons) {
                for (const lang of ['en', 'de', 'fr', 'pt']) {
                    const lessonId = lang === 'en' ? lesson.id : `${lesson.id}_${lang}`;
                    const courseId = courseMapping[lang as 'en' | 'de' | 'fr' | 'pt'][courseKey as keyof typeof courseMapping.en];

                    const lessonRef = db.collection('lessons').doc(lessonId);

                    // Update only the courseId and orderIndex
                    batch.update(lessonRef, {
                        courseId: courseId,
                        orderIndex: lesson.orderIndex,
                        updatedAt: new Date()
                    });

                    console.log(`✓ ${lessonId} → ${courseId} (order: ${lesson.orderIndex})`);
                    updateCount++;
                }
            }
        }

        await batch.commit();
        console.log(`\n✅ Successfully redistributed ${updateCount} lesson versions across 4 courses!`);
        console.log("\nDistribution:");
        console.log("- Mindfulness Basics: 5 lessons × 4 languages = 20 versions");
        console.log("- Stress Management: 5 lessons × 4 languages = 20 versions");
        console.log("- Cognitive Fitness: 5 lessons × 4 languages = 20 versions");
        console.log("- Cognitive Wellness Journey: 5 lessons × 4 languages = 20 versions");
        console.log("\nTotal: 80 lesson versions evenly distributed");

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
