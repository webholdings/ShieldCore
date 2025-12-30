import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seed() {
    const email = "ricdes@gmail.com";
    console.log(`Checking for user: ${email}`);

    const existing = await storage.getUserByEmail(email);
    if (existing) {
        console.log("User already exists:", existing.id);
        // Ensure subscription is active for testing
        await storage.updateSubscriptionStatus(existing.id, "active", "manual-test");
        console.log("Updated subscription to active");
        process.exit(0);
    }

    console.log("Creating new user...");
    const user = await storage.createUser({
        username: "ricdes",
        email: email,
        password: await hashPassword("temp123"), // Password won't be used for Google/Magic Link but required by schema
        language: "en"
    });

    // Set active subscription
    await storage.updateSubscriptionStatus(user.id, "active", "manual-test");

    console.log("User created successfully:", user.id);
    process.exit(0);
}

seed().catch(console.error);
