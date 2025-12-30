import { db } from "../server/db";

async function main() {
    console.log("Fixing all lesson courseIds...\n");

    try {
        const lessonsSnapshot = await db.collection('lessons').get();
        const batch = db.batch();
        let count = 0;

        lessonsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const lang = data.language || 'en';

            // Determine correct courseId based on language
            let newCourseId = '';
            if (lang === 'en') {
                newCourseId = 'course_cognitive_wellness';
            } else if (lang === 'de') {
                newCourseId = 'course_cognitive_wellness_de';
            } else if (lang === 'fr') {
                newCourseId = 'course_cognitive_wellness_fr';
            } else if (lang === 'pt') {
                newCourseId = 'course_cognitive_wellness_pt';
            }

            if (newCourseId && data.courseId !== newCourseId) {
                batch.update(doc.ref, { courseId: newCourseId });
                console.log(`  ${doc.id} [${lang}]: ${data.courseId} -> ${newCourseId}`);
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`\n✅ Updated ${count} lessons with correct courseIds!`);
        } else {
            console.log("All lessons already have correct courseIds!");
        }

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
