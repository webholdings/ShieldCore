import { db } from "../server/db";

async function main() {
    console.log("Checking course translations...\n");

    try {
        // Get all courses
        const snapshot = await db.collection('courses').get();
        console.log(`Total courses in DB: ${snapshot.size}\n`);

        const coursesByLang: Record<string, any[]> = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const lang = data.language || 'unknown';
            if (!coursesByLang[lang]) {
                coursesByLang[lang] = [];
            }
            coursesByLang[lang].push({
                id: doc.id,
                title: data.title,
                description: data.description,
                orderIndex: data.orderIndex
            });
        });

        // Display by language
        for (const [lang, courses] of Object.entries(coursesByLang)) {
            console.log(`\n=== ${lang.toUpperCase()} (${courses.length} courses) ===`);
            courses.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            courses.forEach(c => {
                console.log(`  ${c.orderIndex}. ${c.title}`);
                console.log(`     ${c.description.substring(0, 60)}...`);
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
