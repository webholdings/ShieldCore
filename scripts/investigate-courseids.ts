import { db } from "../server/db";

async function main() {
    console.log("Detailed courseId investigation...\n");

    try {
        const lessonsSnapshot = await db.collection('lessons').limit(5).get();

        console.log("Sample lessons:");
        lessonsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`\nID: ${doc.id}`);
            console.log(`  courseId: "${data.courseId}"`);
            console.log(`  language: "${data.language}"`);
            console.log(`  title: "${data.title}"`);
        });

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
