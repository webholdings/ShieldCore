import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
    initializeApp();
}

const db = getFirestore();

async function updateUserLanguage() {
    try {
        // Update the user document directly by ID
        await db.collection('users').doc('user_ricdes').update({
            language: 'de'
        });

        console.log('✅ Successfully updated user language to German (de)');

        // Verify the update
        const userDoc = await db.collection('users').doc('user_ricdes').get();
        const userData = userDoc.data();
        console.log('Current language:', userData?.language);

    } catch (error) {
        console.error('Error updating language:', error);
    }
}

updateUserLanguage()
    .then(() => {
        console.log('\nDone! Please refresh your browser to see the changes.');
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
