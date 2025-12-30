
import { storage } from "../server/storage";

async function main() {
    const email = "muk.gruenberg@gmx.net";
    const username = "muk.gruenberg";

    console.log(`Checking if user ${email} exists...`);
    const existingUser = await storage.getUserByEmail(email);

    if (existingUser) {
        console.log(`User ${email} already exists with ID ${existingUser.id}`);
        return;
    }

    console.log(`Creating user ${email}...`);
    try {
        const user = await storage.createUser({
            username,
            password: "firebase-managed",
            email,
            language: "de", // Assuming German based on name/domain
            totalPoints: 0,
            streakCount: 0,
            subscriptionStatus: 'active', // Granting access by default? Or 'free'? Let's stick to default behavior which is usually free/active.
            // storage.createUser handles defaults, but we can be explicit if needed.
            // Actually, looking at storage.ts, createUser takes InsertUser.
        });
        console.log(`Successfully created user:`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Username: ${user.username}`);
        console.log(`Language: ${user.language}`);
    } catch (error) {
        console.error("Failed to create user:", error);
    }
}

main().catch(console.error);
