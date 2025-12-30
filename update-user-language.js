import { storage } from './server/storage.js';

async function updateUserLanguage() {
    try {
        const user = await storage.getUserByEmail('ricdes@gmail.com');

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log(`Current language: ${user.language}`);

        const updated = await storage.updateUserLanguage(user.id, 'de');

        console.log(`✅ Updated language to: de`);
        console.log('Updated user:', updated);
    } catch (error) {
        console.error('Error:', error);
    }
}

updateUserLanguage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
