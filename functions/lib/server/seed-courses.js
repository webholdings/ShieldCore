import { db } from "./db";
import { courses, lessons } from "@shared/schema";
const courseData = [
    {
        title: "Nutrition for Brain Health",
        description: "Learn how proper nutrition can boost your cognitive function and mental clarity",
        category: "Nutrition",
        icon: "apple",
        color: "text-green-600",
        orderIndex: 1,
        lessons: [
            {
                title: "Brain-Boosting Foods",
                content: "Discover the best foods for your brain, including omega-3 rich fish, berries, nuts, and leafy greens. Learn why these foods support memory and cognitive function.",
                orderIndex: 1
            },
            {
                title: "The Mediterranean Diet",
                content: "Explore the Mediterranean diet and its proven benefits for cognitive health. This eating pattern has been shown to reduce cognitive decline and support brain health.",
                orderIndex: 2
            },
            {
                title: "Hydration and Mental Performance",
                content: "Understand how staying properly hydrated affects your mental clarity, focus, and overall cognitive performance. Learn how much water you need daily.",
                orderIndex: 3
            },
            {
                title: "Antioxidants and Brain Protection",
                content: "Learn about antioxidant-rich foods that protect your brain from oxidative stress. Colorful fruits and vegetables are key to brain health.",
                orderIndex: 4
            },
            {
                title: "Vitamins for Cognitive Function",
                content: "Discover essential vitamins like B12, D, and E that support brain health. Learn which foods provide these vital nutrients.",
                orderIndex: 5
            },
            {
                title: "Reducing Processed Foods",
                content: "Understand how processed foods and added sugars can negatively impact cognitive function. Learn strategies to eat more whole foods.",
                orderIndex: 6
            },
            {
                title: "Meal Timing and Brain Energy",
                content: "Learn how meal timing affects your brain's energy levels throughout the day. Discover the best eating schedule for mental performance.",
                orderIndex: 7
            },
            {
                title: "Healthy Fats for Your Brain",
                content: "Explore the importance of healthy fats like omega-3s for brain structure and function. Learn which foods provide the best sources.",
                orderIndex: 8
            },
            {
                title: "Creating a Brain-Healthy Meal Plan",
                content: "Put it all together with a practical meal planning guide. Learn to create delicious, brain-healthy meals for the week.",
                orderIndex: 9
            },
            {
                title: "Supplements: What Works?",
                content: "Get evidence-based information about supplements for brain health. Learn which ones are worth considering and which to avoid.",
                orderIndex: 10
            }
        ]
    },
    {
        title: "Sleep for Cognitive Performance",
        description: "Optimize your sleep to enhance memory, focus, and mental sharpness",
        category: "Sleep",
        icon: "moon",
        color: "text-indigo-600",
        orderIndex: 2,
        lessons: [
            {
                title: "Why Sleep Matters for Your Brain",
                content: "Understand the crucial role sleep plays in memory consolidation, learning, and cognitive performance. Discover what happens to your brain during sleep.",
                orderIndex: 1
            },
            {
                title: "The Science of Sleep Cycles",
                content: "Learn about REM and non-REM sleep stages and how they contribute to mental restoration and memory processing.",
                orderIndex: 2
            },
            {
                title: "Creating the Perfect Sleep Environment",
                content: "Discover how to optimize your bedroom for better sleep: temperature, lighting, noise control, and comfort considerations.",
                orderIndex: 3
            },
            {
                title: "Establishing a Bedtime Routine",
                content: "Learn to create a consistent pre-sleep routine that signals your brain it's time to rest. Consistency is key to better sleep.",
                orderIndex: 4
            },
            {
                title: "Managing Screen Time Before Bed",
                content: "Understand how blue light affects your sleep and learn strategies to reduce screen exposure before bedtime.",
                orderIndex: 5
            },
            {
                title: "Foods and Drinks for Better Sleep",
                content: "Discover which foods promote better sleep and which ones to avoid. Learn about the timing of meals and beverages.",
                orderIndex: 6
            },
            {
                title: "Relaxation Techniques for Sleep",
                content: "Practice proven relaxation methods including progressive muscle relaxation, breathing exercises, and meditation for better sleep.",
                orderIndex: 7
            },
            {
                title: "Managing Sleep Disruptions",
                content: "Learn strategies to handle common sleep disruptions and what to do when you can't fall back asleep.",
                orderIndex: 8
            },
            {
                title: "Napping: Benefits and Best Practices",
                content: "Understand when and how to nap effectively to boost cognitive performance without affecting nighttime sleep.",
                orderIndex: 9
            },
            {
                title: "When to Seek Professional Help",
                content: "Learn to recognize signs of sleep disorders and understand when it's time to consult a healthcare professional.",
                orderIndex: 10
            }
        ]
    },
    {
        title: "Physical Exercise and Brain Health",
        description: "Discover how regular physical activity enhances cognitive function and mental well-being",
        category: "Exercise",
        icon: "activity",
        color: "text-red-600",
        orderIndex: 3,
        lessons: [
            {
                title: "Exercise and Brain Chemistry",
                content: "Learn how physical activity increases brain-derived neurotrophic factor (BDNF) and other chemicals that support cognitive health.",
                orderIndex: 1
            },
            {
                title: "Aerobic Exercise for Memory",
                content: "Discover how cardiovascular exercise improves memory and learning. Even moderate walking can make a difference.",
                orderIndex: 2
            },
            {
                title: "Strength Training and Cognition",
                content: "Understand the cognitive benefits of resistance training and how it supports brain health as we age.",
                orderIndex: 3
            },
            {
                title: "Balance and Coordination Exercises",
                content: "Learn exercises that challenge your balance and coordination, which are important for brain health and fall prevention.",
                orderIndex: 4
            },
            {
                title: "Starting an Exercise Routine",
                content: "Get practical guidance on beginning an exercise program safely, regardless of your current fitness level.",
                orderIndex: 5
            },
            {
                title: "Exercise Intensity and Duration",
                content: "Learn about the recommended intensity and duration of exercise for optimal brain health benefits.",
                orderIndex: 6
            },
            {
                title: "Outdoor Exercise Benefits",
                content: "Discover the additional cognitive benefits of exercising in nature and spending time outdoors.",
                orderIndex: 7
            },
            {
                title: "Social Exercise Activities",
                content: "Explore group activities like dancing, tai chi, or group walks that combine physical and social benefits.",
                orderIndex: 8
            },
            {
                title: "Staying Motivated to Exercise",
                content: "Learn strategies to maintain exercise consistency and overcome common barriers to regular physical activity.",
                orderIndex: 9
            },
            {
                title: "Creating Your Personal Exercise Plan",
                content: "Put everything together to create a sustainable, enjoyable exercise routine tailored to your abilities and preferences.",
                orderIndex: 10
            }
        ]
    },
    {
        title: "Stress Management for Mental Clarity",
        description: "Learn effective techniques to manage stress and protect your cognitive function",
        category: "Stress Management",
        icon: "heart",
        color: "text-purple-600",
        orderIndex: 4,
        lessons: [
            {
                title: "Understanding Stress and the Brain",
                content: "Learn how chronic stress affects cognitive function, memory, and decision-making. Understanding stress is the first step to managing it.",
                orderIndex: 1
            },
            {
                title: "Breathing Techniques for Calm",
                content: "Practice simple breathing exercises that can quickly reduce stress and anxiety. These techniques can be used anytime, anywhere.",
                orderIndex: 2
            },
            {
                title: "Mindfulness Meditation Basics",
                content: "Learn the fundamentals of mindfulness meditation and how regular practice can reduce stress and improve cognitive function.",
                orderIndex: 3
            },
            {
                title: "Progressive Muscle Relaxation",
                content: "Discover this powerful technique for releasing physical tension and calming your mind through systematic muscle relaxation.",
                orderIndex: 4
            },
            {
                title: "Time Management to Reduce Stress",
                content: "Learn practical time management strategies that reduce overwhelm and create more balance in your daily life.",
                orderIndex: 5
            },
            {
                title: "Setting Healthy Boundaries",
                content: "Understand the importance of boundaries in managing stress and learn how to say no without guilt.",
                orderIndex: 6
            },
            {
                title: "Social Connections and Support",
                content: "Discover how strong social relationships protect against stress and support cognitive health. Learn to nurture meaningful connections.",
                orderIndex: 7
            },
            {
                title: "Gratitude and Positive Thinking",
                content: "Learn how cultivating gratitude and positive thinking patterns can reduce stress and improve mental well-being.",
                orderIndex: 8
            },
            {
                title: "Hobbies and Creative Outlets",
                content: "Explore how engaging in enjoyable activities and creative pursuits helps manage stress and support brain health.",
                orderIndex: 9
            },
            {
                title: "Creating Your Stress Management Plan",
                content: "Develop a personalized stress management plan combining techniques that work best for you and your lifestyle.",
                orderIndex: 10
            }
        ]
    }
];
async function seedCourses() {
    console.log("Seeding courses and lessons...");
    for (const course of courseData) {
        const { lessons: lessonData, ...courseInfo } = course;
        // Check if course already exists
        const existingCourse = await db.query.courses.findFirst({
            where: (courses, { eq }) => eq(courses.title, courseInfo.title)
        });
        if (existingCourse) {
            console.log(`Course "${courseInfo.title}" already exists, skipping...`);
            continue;
        }
        // Insert course
        const [insertedCourse] = await db.insert(courses).values(courseInfo).returning();
        console.log(`Created course: ${insertedCourse.title}`);
        // Insert lessons
        for (const lesson of lessonData) {
            await db.insert(lessons).values({
                ...lesson,
                courseId: insertedCourse.id
            });
        }
        console.log(`  Added ${lessonData.length} lessons`);
    }
    console.log("Seeding complete!");
}
seedCourses().catch(console.error).finally(() => process.exit(0));
//# sourceMappingURL=seed-courses.js.map