
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
// Note: This requires GOOGLE_APPLICATION_CREDENTIALS to be set or service account path provided
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || join(__dirname, '../service-account.json');

try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({
        credential: cert(serviceAccount)
    });
} catch (error) {
    console.error('Error loading service account:', error);
    console.log('Please set GOOGLE_APPLICATION_CREDENTIALS or place service-account.json in the root directory.');
    process.exit(1);
}

const db = getFirestore();

const COURSES = [
    {
        title: "Mindfulness Basics",
        description: "Learn the fundamentals of mindfulness and meditation.",
        language: "en",
        category: "Mindfulness",
        difficulty: "Beginner",
        duration: "4 weeks",
        orderIndex: 1,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
    },
    {
        title: "Stress Management",
        description: "Techniques to handle stress and anxiety in daily life.",
        language: "en",
        category: "Wellness",
        difficulty: "Intermediate",
        duration: "3 weeks",
        orderIndex: 2,
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
    },
    {
        title: "Cognitive Fitness",
        description: "Exercises to keep your brain sharp and agile.",
        language: "en",
        category: "Brain Health",
        difficulty: "All Levels",
        duration: "Ongoing",
        orderIndex: 3,
        imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80"
    },
    {
        title: "Achtsamkeit Grundlagen",
        description: "Lernen Sie die Grundlagen der Achtsamkeit und Meditation.",
        language: "de",
        category: "Achtsamkeit",
        difficulty: "Anfänger",
        duration: "4 Wochen",
        orderIndex: 1,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
    },
    {
        title: "Stressbewältigung",
        description: "Techniken zur Bewältigung von Stress und Angst im Alltag.",
        language: "de",
        category: "Wohlbefinden",
        difficulty: "Mittelstufe",
        duration: "3 Wochen",
        orderIndex: 2,
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
    },
    {
        title: "Bases de la Pleine Conscience",
        description: "Apprenez les bases de la pleine conscience et de la méditation.",
        language: "fr",
        category: "Pleine Conscience",
        difficulty: "Débutant",
        duration: "4 semaines",
        orderIndex: 1,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
    },
    {
        title: "Gestion du Stress",
        description: "Techniques pour gérer le stress et l'anxiété au quotidien.",
        language: "fr",
        category: "Bien-être",
        difficulty: "Intermédiaire",
        duration: "3 semaines",
        orderIndex: 2,
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
    }
];

async function seedCourses() {
    console.log('Seeding courses...');
    const batch = db.batch();
    const collection = db.collection('courses');

    for (const course of COURSES) {
        const ref = collection.doc();
        batch.set(ref, {
            ...course,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    await batch.commit();
    console.log(`Successfully seeded ${COURSES.length} courses.`);
}

seedCourses().catch(console.error);
