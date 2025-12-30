
import { db } from "../server/db";
import { storage } from "../server/storage";

async function main() {
    console.log("Debugging Lessons...");

    try {
        // 1. Get a course ID first
        console.log("\n--- Getting a Course ID ---");
        const courses = await storage.getCourses('en');
        if (courses.length === 0) {
            console.log("No courses found. Cannot test lessons.");
            process.exit(0);
        }
        const courseId = courses[0].id;
        console.log(`Using course ID: ${courseId} (${courses[0].title})`);

        // 2. Test getting lessons for this course
        console.log(`\n--- Testing getLessonsByCourse('${courseId}', 'en') ---`);
        const lessons = await storage.getLessonsByCourse(courseId, 'en');
        console.log(`Found ${lessons.length} lessons`);
        lessons.forEach(l => console.log(`- ${l.id} (${l.title}) [order: ${l.orderIndex}]`));

        // 3. Raw query to see if lessons exist at all for this course
        console.log(`\n--- Raw Query (Lessons for courseId=${courseId}) ---`);
        const snapshot = await db.collection('lessons')
            .where('courseId', '==', courseId)
            .get();
        console.log(`Total raw lessons found: ${snapshot.size}`);
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- ${doc.id}: lang=${data.language}, order=${data.orderIndex}, title=${data.title}`);
        });

    } catch (error) {
        console.error("Error during debug:", error);
    }

    process.exit(0);
}

main().catch(console.error);
