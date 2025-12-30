import { db } from "../server/db";

async function main() {
    console.log("Migrating users to include points and streak fields...\n");

    try {
        const snapshot = await db.collection('users').get();
        const batch = db.batch();
        let updateCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const updates: any = {};

            if (data.totalPoints === undefined) {
                updates.totalPoints = 0;
            }

            if (data.streakCount === undefined) {
                updates.streakCount = 0;
            }

            if (Object.keys(updates).length > 0) {
                console.log(`Updating user ${doc.id} (${data.email}):`, updates);
                batch.update(doc.ref, updates);
                updateCount++;
            }
        }

        if (updateCount > 0) {
            await batch.commit();
            console.log(`\n✅ Successfully updated ${updateCount} users.`);
        } else {
            console.log("\nAll users already have points and streak fields.");
        }

    } catch (error) {
        console.error("Error:", error);
    }

    process.exit(0);
}

main().catch(console.error);
