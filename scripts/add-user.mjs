// Simple script to add user to Firestore
import admin from 'firebase-admin';

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS env var)
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

async function addUser() {
    const email = 'rdiogo@live.com';
    const username = 'rdiogo';

    try {
        console.log('Checking if user exists...');

        // Check if user already exists
        const existingSnapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            console.log('✅ User already exists!');
            console.log(existingSnapshot.docs[0].data());
            process.exit(0);
        }

        console.log('Creating new user...');

        // Create new user
        const userId = db.collection('users').doc().id;
        const newUser = {
            id: userId,
            email,
            username,
            password: 'magic-link-auth',
            language: 'en',
            totalPoints: 0,
            streakCount: 0,
            currentAudioSession: 1,
            lastAudioPosition: 0,
            subscriptionStatus: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('users').doc(userId).set(newUser);

        console.log('✅ User created successfully!');
        console.log('User ID:', userId);
        console.log('Email:', email);
        console.log('Username:', username);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addUser();
