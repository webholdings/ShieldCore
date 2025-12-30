import { db } from "../server/db";

async function main() {
    console.log("Checking lesson-course associations...\n");

    try {
        // Get all lessons
        const lessonsSnapshot = await db.collection('lessons').get();
        console.log(`Total lessons in DB: ${lessonsSnapshot.size}\n`);

        // Group by courseId and language
        const lessonsByCourse: Record<string, any[]> = {};

        lessonsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const key = `${data.courseId || 'NO_COURSE'}_${data.language || 'unknown'}`;
            if (!lessonsByCourse[key]) {
                lessonsByCourse[key] = [];
            }
            lessonsByCourse[key].push({
                id: doc.id,
                title: data.title,
                courseId: data.courseId,
                language: data.language,
                orderIndex: data.orderIndex,
                contentPreview: (data.content || '').substring(0, 100)
            });
        });

        // Display by course and language
        for (const [key, lessons] of Object.entries(lessonsByCourse)) {
            const [courseId, lang] = key.split('_');
            console.log(`\n=== ${courseId} [${lang}] (${lessons.length} lessons) ===`);
            lessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            lessons.forEach(l => {
                console.log(`  ${l.orderIndex}. ${l.title}`);
                console.log(`     Content: ${l.contentPreview}...`);
            });
        }

        // Get all courses to see what courseIds exist
        console.log("\n\n=== AVAILABLE COURSES ===");
        const coursesSnapshot = await db.collection('courses').get();
        coursesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`${doc.id} [${data.language}]: ${data.title}`);
        });

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
