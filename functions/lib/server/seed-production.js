import { db } from "./db";
import { courses, lessons, iqQuestions } from "@shared/schema";
import { sql } from "drizzle-orm";
// Import the full course data from the multilingual seed file
import { seedCoursesAndLessons } from "./seed-courses-multilingual";
import { seedIQQuestionsMultilingual } from "./seed-iq-questions-multilingual";
export async function seedProductionDatabase() {
    console.log("🌱 Starting production database seeding...");
    try {
        // Check if data already exists
        const existingCourses = await db.select().from(courses).limit(1);
        const existingIQQuestions = await db.select().from(iqQuestions).limit(1);
        let seededCourses = false;
        let seededIQ = false;
        // Seed courses and lessons if not already present
        if (existingCourses.length === 0) {
            console.log("📚 Seeding courses and lessons...");
            await seedCoursesAndLessons();
            seededCourses = true;
            console.log("✅ Courses and lessons seeded successfully");
        }
        else {
            console.log("⏭️  Courses already exist, skipping course seeding");
        }
        // Seed IQ questions if not already present
        if (existingIQQuestions.length === 0) {
            console.log("🧠 Seeding multilingual IQ questions...");
            await seedIQQuestionsMultilingual();
            seededIQ = true;
            console.log("✅ Multilingual IQ questions seeded successfully");
        }
        else {
            console.log("⏭️  IQ questions already exist, skipping IQ seeding");
        }
        // Get counts
        const courseCount = await db.select({ count: sql `count(*)` }).from(courses);
        const lessonCount = await db.select({ count: sql `count(*)` }).from(lessons);
        const iqCount = await db.select({ count: sql `count(*)` }).from(iqQuestions);
        const summary = {
            seededCourses,
            seededIQ,
            totals: {
                courses: courseCount[0].count,
                lessons: lessonCount[0].count,
                iqQuestions: iqCount[0].count
            }
        };
        console.log("🎉 Production database seeding complete!");
        console.log("📊 Summary:", JSON.stringify(summary, null, 2));
        return summary;
    }
    catch (error) {
        console.error("❌ Error seeding production database:", error);
        throw error;
    }
}
//# sourceMappingURL=seed-production.js.map