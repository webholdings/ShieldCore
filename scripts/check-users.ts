import { db } from "../server/db";

async function main() {
    console.log("Checking for duplicate users...\n");

    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`Total users: ${users.length}`);

        const emailMap = new Map<string, any[]>();

        for (const user of users) {
            const email = (user as any).email;
            if (email) {
                const normalized = email.toLowerCase();
                if (!emailMap.has(normalized)) {
                    emailMap.set(normalized, []);
                }
                emailMap.get(normalized)?.push(user);
            }
        }

        let duplicatesFound = false;
        for (const [email, userList] of emailMap.entries()) {
            if (userList.length > 1) {
                duplicatesFound = true;
                console.log(`\n⚠️ Duplicate accounts found for email: ${email}`);
                userList.forEach(u => {
                    console.log(`- ID: ${u.id}, Username: ${u.username}, Points: ${u.totalPoints}, Streak: ${u.streakCount}, Created: ${u.createdAt?.toDate?.() || u.createdAt}`);
                });
            }
        }

        if (!duplicatesFound) {
            console.log("\nNo duplicate emails found (case-insensitive check).");
        }

        // List all users for manual inspection
        console.log("\n--- All Users ---");
        users.forEach((u: any) => {
            console.log(`[${u.id}] ${u.email} | Points: ${u.totalPoints} | Streak: ${u.streakCount}`);
        });

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
