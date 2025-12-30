import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";
async function seedDemoUser() {
    try {
        console.log("Checking for existing demo user...");
        const existingUser = await db.select().from(users).where(eq(users.username, "demo")).limit(1);
        if (existingUser.length > 0) {
            console.log("Demo user already exists");
            return;
        }
        console.log("Creating demo user...");
        const hashedPassword = await hashPassword("demo123");
        await db.insert(users).values({
            username: "demo",
            password: hashedPassword,
            email: "demo@creativewaves.com",
            language: "en",
            currentAudioSession: 1,
            lastAudioPosition: 0,
        });
        console.log("Demo user created successfully!");
        console.log("Username: demo");
        console.log("Password: demo123");
    }
    catch (error) {
        console.error("Error seeding demo user:", error);
        process.exit(1);
    }
}
seedDemoUser().then(() => {
    console.log("Demo user seeding complete");
    process.exit(0);
});
//# sourceMappingURL=seed-demo-user.js.map