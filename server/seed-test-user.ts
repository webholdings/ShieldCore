import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seedTestUser() {
    const email = "test@example.com";
    console.log(`Checking for user: ${email}`);

    const existing = await storage.getUserByEmail(email);
    if (existing) {
        console.log("Test user already exists:", existing.id);
        // Ensure subscription is active for testing
        await storage.updateSubscriptionStatus(existing.id, "active", "manual-test");
        console.log("Updated subscription to active");
        process.exit(0);
    }

    console.log("Creating test user...");
    const user = await storage.createUser({
        username: "testuser",
        email: email,
        password: await hashPassword("test123"), // Password won't be used for Magic Link but required by schema
        language: "en",
        detoxStartDate: null
    });

    // Set active subscription
    await storage.updateSubscriptionStatus(user.id, "active", "manual-test");

    console.log("✅ Test user created successfully!");
    console.log("   Email: test@example.com");
    console.log("   User ID:", user.id);
    console.log("   Subscription: active");
    process.exit(0);
}

seedTestUser().catch(console.error);
