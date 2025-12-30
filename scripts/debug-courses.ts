
import { db } from "../server/db";
import { storage } from "../server/storage";

async function main() {
    console.log("Debugging Courses...");

    try {
        // Test getting courses for 'en'
        console.log("\n--- Testing 'en' ---");
        const coursesEn = await storage.getCourses('en');
        console.log(`Found ${coursesEn.length} courses for 'en'`);
        coursesEn.forEach(c => console.log(`- ${c.id} (${c.title}) [lang: ${c.language}]`));

        // Test getting courses for 'de'
        console.log("\n--- Testing 'de' ---");
        const coursesDe = await storage.getCourses('de');
        console.log(`Found ${coursesDe.length} courses for 'de'`);
        coursesDe.forEach(c => console.log(`- ${c.id} (${c.title}) [lang: ${c.language}]`));

        // Test getting all courses (raw query)
        console.log("\n--- Raw Query (All Courses) ---");
        const snapshot = await db.collection('courses').get();
        console.log(`Total courses in DB: ${snapshot.size}`);
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- ${doc.id}: lang=${data.language}, title=${data.title}`);
        });
    } catch (error) {
        console.error("Error during debug:", error);
    }

    process.exit(0);
}

main().catch(console.error);
