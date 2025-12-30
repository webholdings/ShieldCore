import { storage } from "./storage";
async function diagnose() {
    console.log("🔍 Starting Database Diagnosis...");
    try {
        // 1. Test User Creation (or retrieval)
        console.log("\n👤 Testing User Access...");
        const testEmail = "diagnostic@test.com";
        let user = await storage.getUserByEmail(testEmail);
        if (!user) {
            console.log("   Creating test user...");
            user = await storage.createUser({
                username: "diagnostic",
                password: "password",
                email: testEmail,
                language: "en"
            });
        }
        console.log(`   ✅ User verified: ${user.id}`);
        // 2. Test Mood Entry Creation
        console.log("\n😊 Testing Mood Entry Creation...");
        const moodEntry = await storage.createMoodEntry({
            userId: user.id,
            mood: "happy",
            note: "Diagnostic test entry"
        });
        console.log(`   ✅ Mood entry created: ${moodEntry.id}`);
        // 3. Test Mood Entry Retrieval
        console.log("\n📖 Testing Mood Entry Retrieval...");
        const entries = await storage.getMoodEntries(user.id);
        const found = entries.find(e => e.id === moodEntry.id);
        if (found) {
            console.log(`   ✅ Mood entry retrieved successfully. Total entries: ${entries.length}`);
        }
        else {
            console.error("   ❌ FAILED: Created mood entry not found in retrieval!");
        }
        // 4. Test Courses Retrieval
        console.log("\n📚 Testing Courses Retrieval...");
        const languages = ['en', 'de', 'fr'];
        for (const lang of languages) {
            const courses = await storage.getCourses(lang);
            console.log(`   Language '${lang}': Found ${courses.length} courses`);
            if (courses.length > 0) {
                console.log(`      First course: ${courses[0].title}`);
                // Check lessons for first course
                const lessons = await storage.getLessonsByCourse(courses[0].id, lang);
                console.log(`      Lessons in first course: ${lessons.length}`);
            }
            else {
                console.warn(`      ⚠️ No courses found for language '${lang}'`);
            }
        }
        // Cleanup
        console.log("\n🧹 Cleaning up test data...");
        await storage.deleteMoodEntry(moodEntry.id);
        // We keep the user for future tests or you can delete it if you implement deleteUser
        console.log("\n✅ Diagnosis Complete.");
        process.exit(0);
    }
    catch (error) {
        console.error("\n❌ Diagnosis Failed:", error);
        process.exit(1);
    }
}
diagnose();
//# sourceMappingURL=diagnose-db.js.map