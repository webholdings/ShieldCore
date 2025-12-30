import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, readdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import { iqTranslationsDe, iqTranslationsFr, iqTranslationsPt } from "./iq-translations";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
if (getApps().length === 0) {
    try {
        // Only try to load service account file if we're in a local environment
        // In Cloud Functions, this will automatically use default credentials
        const serviceAccountPath = resolve(__dirname, "../service-account.json");

        // Check if file exists before trying to read it
        try {
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
            initializeApp({
                credential: cert(serviceAccount)
            });
            console.log("✓ Firebase Admin initialized with service account");
        } catch (fileError) {
            // Service account file doesn't exist (e.g., in Cloud Functions)
            // Use default credentials instead
            initializeApp();
            console.log("✓ Firebase Admin initialized with default credentials");
        }
    } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        process.exit(1);
    }
}

const db = getFirestore();

// Helper to load JSON files
function loadJSON(path: string) {
    return JSON.parse(readFileSync(resolve(__dirname, path), "utf-8"));
}

export async function seedFirestore() {
    console.log("Starting Firestore seeding...\\n");

    // === STEP 1: DELETE OLD COURSES AND LESSONS ===
    console.log("🗑️  Deleting old courses and lessons...");
    const coursesSnapshot = await db.collection('courses').get();
    const lessonsSnapshot = await db.collection('lessons').get();

    const deleteBatch = db.batch();
    coursesSnapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
    lessonsSnapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();

    console.log(`   Deleted ${coursesSnapshot.size} courses and ${lessonsSnapshot.size} lessons\n`);

    // === STEP 2: LOAD NEW CONTENT STRUCTURE ===
    console.log("📚 Loading new course content...");

    const courses = loadJSON("content/courses.json");
    const contentEn = loadJSON("content/translations/en/content.json");

    // Load all lesson metadata
    const lessonMetadata: Record<string, any> = {};
    const contentDir = resolve(__dirname, "content/lessons");

    for (const courseId of ["cognitive_fitness", "mindfulness_meditation", "addiction_recovery", "emotional_intelligence", "productivity_focus"]) {
        const lessonDir = join(contentDir, courseId);
        const lessonFiles = readdirSync(lessonDir).filter(f => f.endsWith(".json"));

        for (const file of lessonFiles) {
            const lessonData = JSON.parse(readFileSync(join(lessonDir, file), "utf-8"));
            lessonMetadata[lessonData.id] = lessonData;
        }
    }

    console.log(`   Loaded ${Object.keys(lessonMetadata).length} lessons\n`);

    // === STEP 3: SEED COURSES (ALL LANGUAGES) ===
    console.log("Creating courses...");

    const languages = ["en", "de", "fr", "pt"];
    const courseBatch = db.batch();

    for (const course of courses) {
        for (const lang of languages) {
            const courseId = lang === "en" ? course.id : `${course.id}_${lang}`;
            const courseRef = db.collection('courses').doc(courseId);

            const courseData = {
                ...course,
                id: courseId,
                language: lang,
                title: getCourseTitleForLang(course.id, lang),
                description: getCourseDescriptionForLang(course.id, lang),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            courseBatch.set(courseRef, courseData);
        }
        console.log(`  ✓ Created course: ${course.id} (4 languages)`);
    }

    await courseBatch.commit();
    console.log(`\\n✅ Created ${courses.length * 4} course documents\n`);

    // === STEP 4: SEED LESSONS (ALL LANGUAGES) ===
    console.log("Creating lessons...");

    const lessonBatch = db.batch();
    let lessonCount = 0;

    for (const [lessonId, metadata] of Object.entries(lessonMetadata)) {
        for (const lang of languages) {
            const localizedLessonId = lang === "en" ? lessonId : `${lessonId}_${lang}`;
            const courseId = lang === "en" ? metadata.courseId : `${metadata.courseId}_${lang}`;

            const lessonRef = db.collection('lessons').doc(localizedLessonId);

            const lessonData = {
                id: localizedLessonId,
                courseId: courseId,
                orderIndex: metadata.orderIndex,
                estimatedMinutes: metadata.estimatedMinutes,
                language: lang,
                title: getLessonTitleForLang(lessonId, lang),
                content: getLessonContentForLang(lessonId, lang),
                youtubeVideos: metadata.youtubeVideos || [],
                audioUrl: "",
                createdAt: new Date()
            };

            lessonBatch.set(lessonRef, lessonData);
            lessonCount++;
        }
    }

    await lessonBatch.commit();
    console.log(`\\n✅ Created ${lessonCount} lesson documents\n`);

    // === STEP 5: SEED IQ QUESTIONS (keep existing logic) ===
    console.log("Creating IQ questions...");
    await seedIQQuestions();

    console.log("\\n✅ Firestore seeding completed successfully!");
}

// Helper functions for translations
function getCourseTitleForLang(courseId: string, lang: string): string {
    const contentPath = `content/translations/${lang}/content.json`;
    try {
        const content = loadJSON(contentPath);
        return content.courses[courseId]?.title || courseId;
    } catch {
        // Fallback if translation file doesn't exist yet
        const enContent = loadJSON("content/translations/en/content.json");
        return enContent.courses[courseId]?.title || courseId;
    }
}

function getCourseDescriptionForLang(courseId: string, lang: string): string {
    const contentPath = `content/translations/${lang}/content.json`;
    try {
        const content = loadJSON(contentPath);
        return content.courses[courseId]?.description || "";
    } catch {
        const enContent = loadJSON("content/translations/en/content.json");
        return enContent.courses[courseId]?.description || "";
    }
}

function getLessonTitleForLang(lessonId: string, lang: string): string {
    const contentPath = `content/translations/${lang}/content.json`;
    try {
        const content = loadJSON(contentPath);
        return content.lessons[lessonId]?.title || lessonId;
    } catch {
        const enContent = loadJSON("content/translations/en/content.json");
        return enContent.lessons[lessonId]?.title || lessonId;
    }
}

function getLessonContentForLang(lessonId: string, lang: string): string {
    const contentPath = `content/translations/${lang}/content.json`;
    try {
        const content = loadJSON(contentPath);
        return content.lessons[lessonId]?.content || "Content coming soon...";
    } catch {
        const enContent = loadJSON("content/translations/en/content.json");
        return enContent.lessons[lessonId]?.content || "Content coming soon...";
    }
}

// IQ question seeding with comprehensive multilingual dataset
async function seedIQQuestions() {
    // Load the full dataset (200+ questions across all languages)
    const allQuestions = loadJSON("content/iq-questions-all.json");

    // Delete existing IQ questions first to ensure clean state
    const existingQuestions = await db.collection('iqQuestions').get();
    if (!existingQuestions.empty) {
        const deleteBatch = db.batch();
        existingQuestions.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log(`  Deleted ${existingQuestions.size} existing IQ questions`);
    }

    const batch = db.batch();
    let questionCount = 0;

    for (const question of allQuestions) {
        const questionRef = db.collection('iqQuestions').doc(question.id);

        // Ensure options are stored as JSON string to match schema/client expectations
        const optionsString = Array.isArray(question.options)
            ? JSON.stringify(question.options)
            : question.options;

        const questionData = {
            ...question,
            options: optionsString, // Overwrite with stringified version
            createdAt: new Date()
        };

        batch.set(questionRef, questionData);
        questionCount++;
    }

    await batch.commit();
    console.log(`  ✓ Created ${questionCount} IQ questions from comprehensive dataset`);
}

// Run the seeding function
seedFirestore()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exit(1);
    });

