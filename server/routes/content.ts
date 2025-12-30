import { Router, Response } from "express";
import { storage } from "../storage";
import { AuthenticatedRequest, verifyToken } from "../middleware";

const router = Router();

// Seed courses endpoint (only available in development)
router.post("/seed-courses", async (req, res) => {
    try {
        console.log("Manual seed request received...");
        // Dynamic import with fallback for production
        try {
            const { seedFirestore } = await import("../seed-firestore");
            await seedFirestore();
            res.json({ success: true, message: "Database seeded successfully" });
        } catch (importError: any) {
            // Seed module not available (e.g., in Cloud Functions)
            res.status(503).json({
                error: "Seed functionality not available",
                message: "Use 'npm run seed:firestore' locally instead"
            });
        }
    } catch (error: any) {
        console.error("Seeding error:", error);
        res.status(500).json({ error: "Failed to seed database", message: error.message });
    }
});

// GET version for browser access
router.get("/seed-courses", async (req, res) => {
    try {
        console.log("Manual seed request received (GET)...");
        // Dynamic import with fallback for production
        try {
            const { seedFirestore } = await import("../seed-firestore");
            await seedFirestore();
            res.json({ success: true, message: "Database seeded successfully" });
        } catch (importError: any) {
            res.status(503).json({
                error: "Seed functionality not available",
                message: "Use 'npm run seed:firestore' locally instead"
            });
        }
    } catch (error: any) {
        console.error("Seeding error:", error);
        res.status(500).json({ error: "Failed to seed database", message: error.message });
    }
});

// Course endpoints (authenticated)
router.get("/courses", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userLanguage = req.user!.language || 'en';
        const courses = await storage.getCourses(userLanguage);
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/courses/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userLanguage = req.user!.language || 'en';
        const course = await storage.getCourse(req.params.id, userLanguage);
        if (!course) return res.sendStatus(404);
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/courses/:courseId/lessons", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userLanguage = req.user!.language || 'en';
        const lessons = await storage.getLessonsByCourse(req.params.courseId, userLanguage);
        res.json(lessons);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/courses/:courseId/progress", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const progress = await storage.getUserProgress(req.user!.id, req.params.courseId);
        res.json(progress);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get a random lesson (for "Start Lesson" feature)
router.get("/lessons/random", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userLanguage = req.user!.language || 'en';
        const courses = await storage.getCourses(userLanguage);

        if (courses.length === 0) {
            return res.status(404).json({ error: "No courses found" });
        }

        // Pick random course
        const randomCourse = courses[Math.floor(Math.random() * courses.length)];

        // Get lessons for this course
        const lessons = await storage.getLessonsByCourse(randomCourse.id, userLanguage);

        if (lessons.length === 0) {
            // Try another course if this one is empty (simple retry once)
            const anotherCourse = courses[Math.floor(Math.random() * courses.length)];
            const moreLessons = await storage.getLessonsByCourse(anotherCourse.id, userLanguage);

            if (moreLessons.length === 0) {
                return res.status(404).json({ error: "No lessons found" });
            }
            const randomLesson = moreLessons[Math.floor(Math.random() * moreLessons.length)];
            return res.json({ courseId: anotherCourse.id, lessonId: randomLesson.id });
        }

        // Pick random lesson
        const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];

        res.json({ courseId: randomCourse.id, lessonId: randomLesson.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/lessons/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const lesson = await storage.getLesson(req.params.id);
        if (!lesson) return res.sendStatus(404);
        res.json(lesson);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/lessons/:id/complete", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const progress = await storage.markLessonComplete(req.user!.id, req.params.id);
        res.json(progress);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/audio/progress", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { session, position } = req.body;
        const user = await storage.updateUserAudioProgress(req.user!.id, session, position);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
