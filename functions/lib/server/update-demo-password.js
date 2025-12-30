import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";
async function updateDemoPassword() {
    try {
        console.log("Updating demo user password...");
        const hashedPassword = await hashPassword("demo123");
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.username, "demo"));
        console.log("Demo user password updated successfully!");
        console.log("Username: demo");
        console.log("Password: demo123");
    }
    catch (error) {
        console.error("Error updating demo password:", error);
        process.exit(1);
    }
}
updateDemoPassword().then(() => {
    console.log("Update complete");
    process.exit(0);
});
//# sourceMappingURL=update-demo-password.js.map