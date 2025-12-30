import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// Initialize Firebase Admin
if (getApps().length === 0) {
    try {
        initializeApp();
        console.log("✓ Firebase Admin initialized with default credentials");
    }
    catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        process.exit(1);
    }
}
const db = getFirestore();
async function seedFirestore() {
    console.log("Starting Firestore seeding...\n");
    // Seed test users
    console.log("Creating test users...");
    const testUsers = [
        {
            id: "user_ricdes",
            email: "ricdes@gmail.com",
            username: "ricdes",
            password: "", // Firebase Auth handles passwords
            subscriptionStatus: "active",
            language: "en",
            currentAudioSession: 1,
            lastAudioPosition: 0,
            createdAt: new Date(),
        },
        {
            id: "user_ricardo",
            email: "ricardo@leadprime.net",
            username: "ricardo",
            password: "",
            subscriptionStatus: "active",
            language: "en",
            currentAudioSession: 1,
            lastAudioPosition: 0,
            createdAt: new Date(),
        },
        {
            id: "user_rdiogo",
            email: "rdiogo@live.com",
            username: "rdiogo",
            password: "",
            subscriptionStatus: "active",
            language: "en",
            currentAudioSession: 1,
            lastAudioPosition: 0,
            createdAt: new Date(),
        }
    ];
    for (const user of testUsers) {
        await db.collection('users').doc(user.id).set(user);
        console.log(`  ✓ Created user: ${user.email}`);
    }
    // Seed courses
    console.log("\nCreating courses...");
    const courses = [
        {
            id: "course_cognitive_wellness",
            title: "Cognitive Wellness Journey",
            description: "A comprehensive program to enhance your cognitive abilities",
            language: "en",
            orderIndex: 1,
            createdAt: new Date(),
        }
    ];
    // German Translations for Courses
    const coursesDe = courses.map(c => ({
        ...c,
        id: `${c.id}_de`,
        language: "de",
        title: "Reise zum kognitiven Wohlbefinden",
        description: "Ein umfassendes Programm zur Verbesserung Ihrer kognitiven Fähigkeiten"
    }));
    // French Translations for Courses
    const coursesFr = courses.map(c => ({
        ...c,
        id: `${c.id}_fr`,
        language: "fr",
        title: "Voyage vers le bien-être cognitif",
        description: "Un programme complet pour améliorer vos capacités cognitives"
    }));
    const allCourses = [...courses, ...coursesDe, ...coursesFr];
    for (const course of allCourses) {
        await db.collection('courses').doc(course.id).set(course);
        console.log(`  ✓ Created course (${course.language}): ${course.title}`);
    }
    // Seed lessons
    console.log("\nCreating lessons...");
    const lessonsEn = [
        {
            id: "lesson_intro",
            courseId: "course_cognitive_wellness",
            title: "Introduction to Cognitive Wellness",
            content: `Welcome to your cognitive wellness journey! This comprehensive program is designed to help you enhance your mental capabilities and maintain a sharp, healthy mind. Cognitive wellness encompasses various aspects of brain health, including memory, attention, problem-solving, and creativity. Throughout this course, you'll learn evidence-based techniques and strategies to optimize your cognitive function.

Research shows that our brains remain plastic throughout our lives, meaning we can continue to learn, adapt, and improve our cognitive abilities at any age. By engaging in regular mental exercises, maintaining healthy lifestyle habits, and practicing mindfulness, you can significantly enhance your cognitive performance and overall quality of life.

In the following lessons, we'll explore different dimensions of cognitive wellness, providing you with practical tools and insights to help you achieve your mental fitness goals.`,
            audioUrl: "",
            language: "en",
            orderIndex: 1,
            createdAt: new Date(),
        },
        {
            id: "lesson_memory",
            courseId: "course_cognitive_wellness",
            title: "Memory Enhancement Techniques",
            content: `Memory is one of the most important cognitive functions, allowing us to store and retrieve information effectively. In this lesson, you'll discover powerful techniques to improve both your short-term and long-term memory. These methods have been scientifically proven to enhance memory retention and recall.

Key techniques include the Method of Loci (memory palace), chunking information into manageable groups, using mnemonic devices, and practicing spaced repetition. Additionally, lifestyle factors such as quality sleep, regular exercise, and proper nutrition play crucial roles in memory formation and consolidation.

By incorporating these memory enhancement strategies into your daily routine, you'll notice improvements in your ability to remember names, facts, and important information. Practice these techniques regularly to build a stronger, more reliable memory.`,
            audioUrl: "",
            language: "en",
            orderIndex: 2,
            createdAt: new Date(),
        },
        {
            id: "lesson_attention",
            courseId: "course_cognitive_wellness",
            title: "Attention and Focus Strategies",
            content: `In our modern world filled with distractions, the ability to maintain focus and attention is more valuable than ever. This lesson explores evidence-based strategies to enhance your concentration and sustain attention on important tasks. You'll learn how to minimize distractions and create an environment conducive to deep work.

Techniques covered include the Pomodoro Technique for time management, mindfulness meditation for attention training, and strategies to combat digital distractions. We'll also discuss the neuroscience behind attention and how understanding your brain's natural rhythms can help you optimize your focus throughout the day.

By mastering these attention strategies, you'll be able to accomplish more in less time, reduce mental fatigue, and experience greater satisfaction in your work and daily activities.`,
            audioUrl: "",
            language: "en",
            orderIndex: 3,
            createdAt: new Date(),
        },
        {
            id: "lesson_problem_solving",
            courseId: "course_cognitive_wellness",
            title: "Problem-Solving Skills",
            content: `Effective problem-solving is a critical cognitive skill that helps us navigate life's challenges with confidence and creativity. This lesson introduces you to systematic approaches for tackling complex problems, from defining the issue clearly to implementing and evaluating solutions.

You'll learn various problem-solving frameworks, including design thinking, the scientific method, and lateral thinking techniques. We'll explore how to break down large problems into manageable components, generate creative solutions through brainstorming, and make decisions based on logical analysis and intuition.

Developing strong problem-solving skills not only helps you overcome obstacles more effectively but also builds resilience and adaptability, essential qualities for thriving in an ever-changing world.`,
            audioUrl: "",
            language: "en",
            orderIndex: 4,
            createdAt: new Date(),
        },
        {
            id: "lesson_creative_thinking",
            courseId: "course_cognitive_wellness",
            title: "Creative Thinking",
            content: `Creativity isn't just for artists—it's a vital cognitive skill that enhances problem-solving, innovation, and personal fulfillment. This lesson helps you unlock your creative potential through exercises and techniques designed to stimulate divergent thinking and overcome mental blocks.

You'll discover methods such as mind mapping, the SCAMPER technique, random word association, and constraint-based creativity. We'll also explore how to create conditions that foster creativity, including the importance of play, curiosity, and allowing yourself to make mistakes without judgment.

By cultivating your creative thinking abilities, you'll find new perspectives on old problems, generate innovative ideas, and experience greater joy and engagement in your daily life.`,
            audioUrl: "",
            language: "en",
            orderIndex: 5,
            createdAt: new Date(),
        },
        {
            id: "lesson_mindfulness",
            courseId: "course_cognitive_wellness",
            title: "Mindfulness and Mental Clarity",
            content: `Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. This lesson introduces you to mindfulness techniques that can significantly improve your mental clarity, reduce stress, and enhance overall cognitive function.

You'll learn various mindfulness practices, including breath awareness meditation, body scan exercises, and mindful observation. Research shows that regular mindfulness practice can actually change the structure of your brain, strengthening areas associated with attention, emotional regulation, and self-awareness.

By incorporating mindfulness into your daily routine, you'll develop greater mental clarity, improved emotional balance, and enhanced ability to respond thoughtfully rather than react impulsively to life's challenges.`,
            audioUrl: "",
            language: "en",
            orderIndex: 6,
            createdAt: new Date(),
        },
        {
            id: "lesson_brain_nutrition",
            courseId: "course_cognitive_wellness",
            title: "Brain Health and Nutrition",
            content: `What you eat directly affects your brain function and cognitive performance. This lesson explores the connection between nutrition and brain health, providing you with evidence-based dietary recommendations to optimize your mental capabilities.

You'll learn about brain-boosting nutrients such as omega-3 fatty acids, antioxidants, B vitamins, and the importance of staying hydrated. We'll discuss specific foods that support cognitive function, including fatty fish, berries, nuts, leafy greens, and whole grains. You'll also understand how to avoid foods that may impair cognitive performance.

By making informed nutritional choices, you can provide your brain with the fuel it needs to function at its best, supporting memory, focus, and overall mental clarity.`,
            audioUrl: "",
            language: "en",
            orderIndex: 7,
            createdAt: new Date(),
        },
        {
            id: "lesson_sleep",
            courseId: "course_cognitive_wellness",
            title: "Sleep and Cognitive Performance",
            content: `Quality sleep is essential for optimal cognitive function, memory consolidation, and overall brain health. This lesson examines the critical relationship between sleep and cognition, providing strategies to improve your sleep quality and quantity.

You'll learn about the different stages of sleep and their specific roles in memory processing, learning, and mental restoration. We'll cover sleep hygiene practices, including maintaining a consistent sleep schedule, creating an optimal sleep environment, and developing a relaxing bedtime routine.

Understanding and prioritizing sleep will help you wake up refreshed, think more clearly, remember information better, and maintain emotional balance throughout the day.`,
            audioUrl: "",
            language: "en",
            orderIndex: 8,
            createdAt: new Date(),
        },
        {
            id: "lesson_stress",
            courseId: "course_cognitive_wellness",
            title: "Stress Management",
            content: `Chronic stress can significantly impair cognitive function, affecting memory, decision-making, and mental clarity. This lesson provides you with effective strategies to manage stress and protect your cognitive health.

You'll explore various stress management techniques, including progressive muscle relaxation, cognitive reframing, time management strategies, and the importance of social connections. We'll discuss how stress affects the brain and body, and why managing stress is crucial for maintaining optimal cognitive performance.

By developing a personalized stress management toolkit, you'll be better equipped to handle life's challenges while maintaining mental clarity and emotional well-being.`,
            audioUrl: "",
            language: "en",
            orderIndex: 9,
            createdAt: new Date(),
        },
        {
            id: "lesson_vitality",
            courseId: "course_cognitive_wellness",
            title: "Maintaining Cognitive Vitality",
            content: `Cognitive vitality is about keeping your mind active, engaged, and healthy throughout your life. This final lesson brings together all the concepts you've learned and provides a framework for maintaining long-term cognitive wellness.

You'll discover the importance of lifelong learning, social engagement, physical exercise, and mental challenges in preserving cognitive function. We'll discuss how to create a sustainable cognitive wellness routine that fits your lifestyle and goals, and how to track your progress over time.

Remember, cognitive wellness is a journey, not a destination. By consistently applying the principles and practices you've learned in this course, you'll be well-equipped to maintain a sharp, healthy mind for years to come.`,
            audioUrl: "",
            language: "en",
            orderIndex: 10,
            createdAt: new Date(),
        },
        // NEW LESSONS (11-20)
        {
            id: "lesson_neuroplasticity",
            courseId: "course_cognitive_wellness",
            title: "Neuroplasticity in Depth",
            content: `Neuroplasticity is the brain's remarkable ability to reorganize itself by forming new neural connections throughout life. This lesson dives deeper into the mechanisms of how learning and experience change the physical structure of your brain.

We'll explore synaptic plasticity (strengthening connections) and structural plasticity (changing brain structure). You'll learn how specific activities like learning a new language or musical instrument can increase gray matter density. We'll also discuss the concept of "neurons that fire together, wire together" and how to harness this principle for positive habit formation.

Recent studies have shown that even the adult brain is far more malleable than previously thought. By engaging in novel and challenging activities, you can stimulate the release of neurotrophic factors that support the growth and survival of neurons. This means that your cognitive potential is not fixed; it is a dynamic landscape that you can shape through your daily choices and behaviors.

Understanding neuroplasticity empowers you to take charge of your brain's development, proving that it's never too late to learn or change.`,
            audioUrl: "",
            language: "en",
            orderIndex: 11,
            createdAt: new Date(),
        },
        {
            id: "lesson_exercise",
            courseId: "course_cognitive_wellness",
            title: "The Role of Physical Exercise",
            content: `Physical exercise is arguably the most powerful tool we have for brain health. This lesson examines the profound impact of aerobic exercise on cognitive function and neurogenesis (the creation of new neurons).

We'll discuss how exercise increases the production of Brain-Derived Neurotrophic Factor (BDNF), often described as "fertilizer for the brain." You'll learn about the specific cognitive benefits of different types of exercise, from high-intensity interval training to yoga. We'll also cover practical guidelines for incorporating brain-boosting movement into your weekly routine.

Research indicates that regular physical activity can increase the size of the hippocampus, the brain area responsible for verbal memory and learning. Exercise also improves blood flow to the brain, reduces inflammation, and lowers levels of stress hormones, all of which contribute to a healthier, more resilient mind.

By prioritizing physical activity, you're not just caring for your body; you're directly investing in the long-term health and performance of your mind.`,
            audioUrl: "",
            language: "en",
            orderIndex: 12,
            createdAt: new Date(),
        },
        {
            id: "lesson_social",
            courseId: "course_cognitive_wellness",
            title: "Social Connection and Brain Health",
            content: `Humans are inherently social beings, and our brains are wired for connection. This lesson explores the critical link between social engagement and cognitive health, as well as the detrimental effects of loneliness.

We'll look at research showing how social interaction stimulates multiple brain regions involved in memory, emotional regulation, and complex reasoning. You'll learn why maintaining a strong social network is a key factor in preventing cognitive decline. We'll also discuss strategies for building meaningful connections and combating social isolation.

Engaging in stimulating conversations, participating in group activities, and maintaining close relationships can provide a "cognitive reserve" that protects against age-related decline. Socializing requires you to interpret facial expressions, understand perspectives, and respond in real-time, all of which are excellent workouts for your brain.

Nurturing your relationships is a vital component of a holistic cognitive wellness strategy, providing emotional support and mental stimulation.`,
            audioUrl: "",
            language: "en",
            orderIndex: 13,
            createdAt: new Date(),
        },
        {
            id: "lesson_new_skill",
            courseId: "course_cognitive_wellness",
            title: "Learning a New Skill",
            content: `Novelty and challenge are essential for keeping the brain sharp. This lesson focuses on the cognitive benefits of stepping out of your comfort zone to learn entirely new skills.

We'll discuss why "cognitive reserve" is built through challenging mental activities. You'll explore the specific brain benefits of learning complex skills like a second language, a musical instrument, or a new sport. We'll also cover the stages of learning and how to overcome the initial frustration of being a beginner.

When you learn something new, your brain forms new dendrites and synapses, increasing the density of your neural networks. The more complex and novel the skill, the greater the cognitive benefit. It's not just about the end result; the process of struggling, practicing, and mastering a new ability is what drives neuroplasticity.

Embracing the mindset of a lifelong learner ensures that your brain is constantly being challenged to adapt and grow, building resilience against aging.`,
            audioUrl: "",
            language: "en",
            orderIndex: 14,
            createdAt: new Date(),
        },
        {
            id: "lesson_music",
            courseId: "course_cognitive_wellness",
            title: "Music and the Brain",
            content: `Music has a unique and powerful effect on the brain, engaging nearly every known neural subsystem. This lesson explores the neuroscience of music and how it can be used to enhance cognition and mood.

We'll look at how listening to music affects dopamine release and emotional regulation. We'll also discuss the profound cognitive benefits of playing an instrument, which requires the integration of motor, auditory, and visual systems. You'll learn how to use music strategically for focus, relaxation, and memory retrieval.

Studies have shown that musical training can improve executive function, working memory, and processing speed. Even passively listening to music can lower cortisol levels and improve mood, creating an optimal state for learning and creativity. We'll explore how to curate playlists for different cognitive tasks.

Whether you're a musician or a listener, incorporating music into your life can provide a significant boost to your cognitive and emotional well-being.`,
            audioUrl: "",
            language: "en",
            orderIndex: 15,
            createdAt: new Date(),
        },
        {
            id: "lesson_digital_detox",
            courseId: "course_cognitive_wellness",
            title: "Digital Detox and Attention",
            content: `In an age of constant connectivity, our attention spans are under siege. This lesson addresses the impact of digital technology on cognition and offers strategies for reclaiming your focus.

We'll discuss the "attention economy" and how apps are designed to hijack your attention. You'll learn about the cognitive cost of multitasking and constant notifications. We'll provide practical steps for a "digital detox," setting boundaries with technology, and practicing deep, uninterrupted work.

Chronic multitasking can reduce your ability to filter out irrelevant information and impair your working memory. By intentionally unplugging and engaging in sustained, focused activities (like reading a book or solving a puzzle), you can retrain your brain to concentrate for longer periods.

By consciously managing your relationship with technology, you can reduce mental fatigue, improve concentration, and create more space for deep thinking and creativity.`,
            audioUrl: "",
            language: "en",
            orderIndex: 16,
            createdAt: new Date(),
        },
        {
            id: "lesson_emotional_iq",
            courseId: "course_cognitive_wellness",
            title: "Emotional Intelligence",
            content: `Cognition and emotion are deeply interconnected. This lesson explores Emotional Intelligence (EQ) and its role in effective decision-making, social interaction, and personal well-being.

We'll define the components of EQ: self-awareness, self-regulation, motivation, empathy, and social skills. You'll learn how high EQ contributes to better stress management and cognitive performance. We'll also discuss techniques for developing greater emotional awareness and regulation.

Emotions can either cloud our judgment or inform it. High emotional intelligence allows you to recognize your emotional state and use that information to guide your thinking and behavior. It also helps you navigate social complexities, which is a key aspect of human intelligence.

Cultivating emotional intelligence allows you to navigate life's complexities with greater ease, improving both your relationships and your cognitive clarity.`,
            audioUrl: "",
            language: "en",
            orderIndex: 17,
            createdAt: new Date(),
        },
        {
            id: "lesson_gut_brain",
            courseId: "course_cognitive_wellness",
            title: "Gut-Brain Axis",
            content: `The connection between your gut and your brain is so strong that the gut is often called the "second brain." This lesson explores the gut-brain axis and how your microbiome influences your mood and cognition.

We'll discuss the role of the vagus nerve and neurotransmitters like serotonin, much of which is produced in the gut. You'll learn how diet, probiotics, and prebiotics can support a healthy microbiome. We'll also cover the impact of gut health on inflammation and mental clarity.

Emerging research suggests that an imbalance in gut bacteria (dysbiosis) may contribute to anxiety, depression, and even cognitive decline. By consuming a diet rich in fiber, fermented foods, and polyphenols, you can nurture a diverse microbiome that supports optimal brain function.

Taking care of your digestive health is a surprising but essential strategy for maintaining optimal brain function and emotional balance.`,
            audioUrl: "",
            language: "en",
            orderIndex: 18,
            createdAt: new Date(),
        },
        {
            id: "lesson_cognitive_reserve",
            courseId: "course_cognitive_wellness",
            title: "Cognitive Reserve",
            content: `Cognitive reserve explains why some people maintain sharp minds well into old age despite physical changes in the brain. This lesson explains the concept of cognitive reserve and how to build it.

We'll discuss the factors that contribute to a high cognitive reserve, including education, occupational complexity, and leisure activities. You'll learn that it's like a "savings account" for your brain function. We'll explore actionable ways to deposit into this account throughout your life.

People with higher cognitive reserve have more flexible and efficient neural networks, allowing them to compensate for age-related changes or damage. Every time you challenge your brain, learn something new, or engage in complex mental tasks, you are adding to your reserve.

Building cognitive reserve is a proactive strategy for aging well, ensuring that your mind remains resilient and adaptable in the face of challenges.`,
            audioUrl: "",
            language: "en",
            orderIndex: 19,
            createdAt: new Date(),
        },
        {
            id: "lesson_future",
            courseId: "course_cognitive_wellness",
            title: "Future of Brain Health",
            content: `The field of brain health is rapidly evolving. This final lesson looks ahead at emerging research and technologies that promise to revolutionize how we care for our minds.

We'll touch on topics like non-invasive brain stimulation, neurofeedback, and personalized medicine based on genetics. We'll also discuss the growing focus on preventative brain health and longevity. You'll leave with a sense of optimism and curiosity about what's possible for human cognitive potential.

As technology advances, we may see new tools for enhancing memory, focus, and learning speed. However, the foundational pillars of brain health—sleep, exercise, nutrition, and mental challenge—will likely remain the most important factors. We'll discuss how to stay informed and critically evaluate new brain health claims.

As we conclude this course, remember that you are the architect of your own brain health. Stay curious, stay active, and keep exploring the amazing potential of your mind.`,
            audioUrl: "",
            language: "en",
            orderIndex: 20,
            createdAt: new Date(),
        }
    ];
    // German Translations for Lessons
    const lessonsDe = lessonsEn.map(l => ({
        ...l,
        id: `${l.id}_de`,
        courseId: `${l.courseId}_de`,
        language: "de",
        title: translateTitleDe(l.title),
        content: translateContentDe(l.content)
    }));
    // French Translations for Lessons
    const lessonsFr = lessonsEn.map(l => ({
        ...l,
        id: `${l.id}_fr`,
        courseId: `${l.courseId}_fr`,
        language: "fr",
        title: translateTitleFr(l.title),
        content: translateContentFr(l.content)
    }));
    const allLessons = [...lessonsEn, ...lessonsDe, ...lessonsFr];
    for (const lesson of allLessons) {
        await db.collection('lessons').doc(lesson.id).set(lesson);
        console.log(`  ✓ Created lesson (${lesson.language}): ${lesson.title}`);
    }
    // Seed IQ questions
    console.log("\nCreating IQ questions...");
    const iqQuestionsEn = [
        // PATTERN RECOGNITION - Easy
        {
            id: "iq_pattern_1",
            question: "What comes next in the sequence: 2, 4, 8, 16, ?",
            options: ["24", "32", "64", "128"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_2",
            question: "Complete the sequence: 1, 3, 5, 7, ?",
            options: ["8", "9", "10", "11"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        // PATTERN RECOGNITION - Medium
        {
            id: "iq_pattern_3",
            question: "What number should replace the question mark: 2, 6, 12, 20, 30, ?",
            options: ["40", "42", "44", "48"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_4",
            question: "Find the next number: 1, 1, 2, 3, 5, 8, ?",
            options: ["11", "12", "13", "14"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        // PATTERN RECOGNITION - Hard
        {
            id: "iq_pattern_5",
            question: "What comes next: 3, 7, 15, 31, 63, ?",
            options: ["95", "115", "127", "131"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_6",
            question: "Identify the next number: 2, 3, 5, 7, 11, 13, ?",
            options: ["15", "17", "19", "21"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        // LOGIC & REASONING - Easy
        {
            id: "iq_logic_1",
            question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
            options: ["Yes", "No", "Maybe", "Cannot determine"],
            correctAnswer: 0,
            difficulty: "easy",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_2",
            question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
            options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
            correctAnswer: 0,
            difficulty: "easy",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        // LOGIC & REASONING - Medium
        {
            id: "iq_logic_3",
            question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
            options: ["$0.10", "$0.05", "$0.15", "$0.20"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_4",
            question: "If some Flibs are Globs, and all Globs are Snobs, which statement must be true?",
            options: ["All Flibs are Snobs", "Some Flibs are Snobs", "No Flibs are Snobs", "All Snobs are Flibs"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        // LOGIC & REASONING - Hard
        {
            id: "iq_logic_5",
            question: "Three switches control three light bulbs in another room. You can flip the switches as you like, but can only enter the room once. How can you determine which switch controls which bulb?",
            options: [
                "Turn on switch 1, wait, turn it off, turn on switch 2, then check",
                "Turn on all switches at once",
                "Turn on switch 1 and 2, then check",
                "It's impossible to determine"
            ],
            correctAnswer: 0,
            difficulty: "hard",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_6",
            question: "You have two coins totaling 30 cents. One of them is not a nickel. What are the two coins?",
            options: ["Quarter and Nickel", "Dime and Nickel", "Two Quarters", "Quarter and Dime"],
            correctAnswer: 0,
            difficulty: "hard",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        // SPATIAL REASONING - Easy
        {
            id: "iq_spatial_1",
            question: "How many faces does a cube have?",
            options: ["4", "6", "8", "12"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_2",
            question: "If you fold a square piece of paper in half twice and cut off one corner, how many holes will the unfolded paper have?",
            options: ["1", "2", "3", "4"],
            correctAnswer: 3,
            difficulty: "easy",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        // SPATIAL REASONING - Medium
        {
            id: "iq_spatial_3",
            question: "A cube is painted red on all faces and then cut into 27 smaller cubes of equal size. How many small cubes have exactly 2 red faces?",
            options: ["8", "12", "6", "4"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_4",
            question: "Which 3D shape has 5 faces, 9 edges, and 6 vertices?",
            options: ["Triangular prism", "Square pyramid", "Pentagonal prism", "Hexagonal pyramid"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        // SPATIAL REASONING - Hard
        {
            id: "iq_spatial_5",
            question: "If you have a 3x3x3 cube made of smaller cubes, and you remove all the cubes that have at least one face exposed, how many cubes remain?",
            options: ["0", "1", "8", "9"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_6",
            question: "Which of these shapes cannot be formed by folding a single piece of paper without cutting?",
            options: ["Cube", "Sphere", "Tetrahedron", "Cylinder"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        // VERBAL REASONING - Easy
        {
            id: "iq_verbal_1",
            question: "Book is to Reading as Fork is to:",
            options: ["Drawing", "Writing", "Eating", "Stirring"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_2",
            question: "Which word does not belong: Apple, Banana, Carrot, Orange",
            options: ["Apple", "Banana", "Carrot", "Orange"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        // VERBAL REASONING - Medium
        {
            id: "iq_verbal_3",
            question: "Pen is to Poet as Needle is to:",
            options: ["Thread", "Tailor", "Cloth", "Sewing"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_4",
            question: "What is the opposite of 'abundant'?",
            options: ["Plentiful", "Scarce", "Sufficient", "Adequate"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        // VERBAL REASONING - Hard
        {
            id: "iq_verbal_5",
            question: "Ephemeral is to Permanent as:",
            options: [
                "Temporary is to Lasting",
                "Brief is to Eternal",
                "Fleeting is to Enduring",
                "All of the above"
            ],
            correctAnswer: 3,
            difficulty: "hard",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_6",
            question: "Which word is the odd one out?",
            options: ["Trivial", "Unimportant", "Insignificant", "Familiar"],
            correctAnswer: 3,
            difficulty: "hard",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        // MIXED CATEGORIES - Additional questions
        {
            id: "iq_mixed_1",
            question: "What is 15% of 200?",
            options: ["20", "25", "30", "35"],
            correctAnswer: 2,
            difficulty: "easy",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_mixed_2",
            question: "If you rearrange the letters 'CIFAIPC' you would have the name of a(n):",
            options: ["City", "Animal", "Ocean", "Country"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_mixed_3",
            question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
            options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_mixed_4",
            question: "Which number is the odd one out: 9, 16, 25, 43, 49",
            options: ["9", "25", "43", "49"],
            correctAnswer: 2,
            difficulty: "hard",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        // NEW QUESTIONS (24 more to reach 48 total)
        // Advanced Pattern Recognition
        {
            id: "iq_pattern_7",
            question: "2, 3, 5, 9, 17, ?",
            options: ["31", "33", "35", "37"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_8",
            question: "1, 4, 9, 16, 25, ?",
            options: ["30", "32", "36", "40"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_9",
            question: "100, 99, 96, 91, 84, ?",
            options: ["73", "75", "77", "79"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_10",
            question: "A, C, F, J, O, ?",
            options: ["S", "T", "U", "V"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_11",
            question: "Which number completes the grid? [2, 4, 8], [3, 9, 27], [4, 16, ?]",
            options: ["32", "48", "64", "80"],
            correctAnswer: 2,
            difficulty: "medium",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_pattern_12",
            question: "0, 1, 1, 2, 3, 5, 8, 13, ?",
            options: ["20", "21", "22", "23"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "pattern",
            language: "en",
            createdAt: new Date(),
        },
        // Complex Logic Puzzles
        {
            id: "iq_logic_7",
            question: "John is taller than Peter. Peter is shorter than Tom. Tom is shorter than John. Who is the tallest?",
            options: ["John", "Peter", "Tom", "Cannot determine"],
            correctAnswer: 0,
            difficulty: "easy",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_8",
            question: "If yesterday was Tuesday, what day will it be in 100 days?",
            options: ["Wednesday", "Thursday", "Friday", "Saturday"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_9",
            question: "All roses are flowers. Some flowers fade quickly. Therefore:",
            options: ["Some roses fade quickly", "All roses fade quickly", "No roses fade quickly", "None of the above follows"],
            correctAnswer: 3,
            difficulty: "medium",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_10",
            question: "Five people are in a race. A beat B. C beat D. B beat C. Who finished last?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 3,
            difficulty: "medium",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_11",
            question: "Which conclusion follows? No A are B. All C are A.",
            options: ["No C are B", "Some C are B", "All B are C", "None of the above"],
            correctAnswer: 0,
            difficulty: "hard",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_logic_12",
            question: "If a doctor gives you 3 pills and tells you to take one every half hour, how long will they last?",
            options: ["1 hour", "1.5 hours", "2 hours", "3 hours"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "logic",
            language: "en",
            createdAt: new Date(),
        },
        // 3D Spatial Visualization
        {
            id: "iq_spatial_7",
            question: "Which letter is symmetric along a vertical axis?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 0,
            difficulty: "easy",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_8",
            question: "How many corners does a rectangular prism have?",
            options: ["6", "8", "10", "12"],
            correctAnswer: 1,
            difficulty: "easy",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_9",
            question: "Imagine rotating the letter 'Z' 90 degrees clockwise. What does it look like?",
            options: ["N", "S", "Z", "M"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_10",
            question: "Which shape is the cross-section of a sphere?",
            options: ["Circle", "Square", "Triangle", "Oval"],
            correctAnswer: 0,
            difficulty: "easy",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_11",
            question: "If you look at a cylinder from the side, what shape do you see?",
            options: ["Circle", "Rectangle", "Triangle", "Oval"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_spatial_12",
            question: "How many edges does a tetrahedron have?",
            options: ["4", "6", "8", "10"],
            correctAnswer: 1,
            difficulty: "hard",
            category: "spatial",
            language: "en",
            createdAt: new Date(),
        },
        // Advanced Verbal Reasoning
        {
            id: "iq_verbal_7",
            question: "Which word is a synonym for 'Benevolent'?",
            options: ["Kind", "Cruel", "Rich", "Poor"],
            correctAnswer: 0,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_8",
            question: "Which word is an antonym for 'Obscure'?",
            options: ["Hidden", "Clear", "Dark", "Vague"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_9",
            question: "Finger is to Hand as Leaf is to:",
            options: ["Tree", "Branch", "Root", "Flower"],
            correctAnswer: 1,
            difficulty: "medium",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_10",
            question: "Which word means 'to make something better'?",
            options: ["Ameliorate", "Deteriorate", "Stagnate", "Vacillate"],
            correctAnswer: 0,
            difficulty: "hard",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_11",
            question: "What is the relationship between 'Candid' and 'Frank'?",
            options: ["Synonyms", "Antonyms", "Unrelated", "Homophones"],
            correctAnswer: 0,
            difficulty: "hard",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        },
        {
            id: "iq_verbal_12",
            question: "Choose the word that best completes the sentence: The scientist's theory was _____, explaining all observed phenomena.",
            options: ["Comprehensive", "Ambiguous", "Tentative", "Obsolete"],
            correctAnswer: 0,
            difficulty: "hard",
            category: "verbal",
            language: "en",
            createdAt: new Date(),
        }
    ];
    // German Translations for IQ Questions
    const iqQuestionsDe = iqQuestionsEn.map(q => ({
        ...q,
        id: `${q.id}_de`,
        language: "de",
        question: translateQuestionDe(q.question),
        options: q.options.map(o => translateOptionDe(o))
    }));
    // French Translations for IQ Questions
    const iqQuestionsFr = iqQuestionsEn.map(q => ({
        ...q,
        id: `${q.id}_fr`,
        language: "fr",
        question: translateQuestionFr(q.question),
        options: q.options.map(o => translateOptionFr(o))
    }));
    const allIqQuestions = [...iqQuestionsEn, ...iqQuestionsDe, ...iqQuestionsFr];
    for (const question of allIqQuestions) {
        await db.collection('iqQuestions').doc(question.id).set(question);
        console.log(`  ✓ Created IQ question (${question.language}): ${question.id}`);
    }
    console.log("\n✅ Firestore seeding completed successfully!");
}
// Helper functions for translations (Mock translations for demonstration)
// In a real scenario, these would be replaced with actual high-quality translations
function translateTitleDe(text) {
    const map = {
        "Introduction to Cognitive Wellness": "Einführung in die kognitive Wellness",
        "Memory Enhancement Techniques": "Techniken zur Gedächtnisverbesserung",
        "Attention and Focus Strategies": "Strategien für Aufmerksamkeit und Fokus",
        "Problem-Solving Skills": "Problemlösungsfähigkeiten",
        "Creative Thinking": "Kreatives Denken",
        "Mindfulness and Mental Clarity": "Achtsamkeit und geistige Klarheit",
        "Brain Health and Nutrition": "Gehirngesundheit und Ernährung",
        "Sleep and Cognitive Performance": "Schlaf und kognitive Leistung",
        "Stress Management": "Stressbewältigung",
        "Maintaining Cognitive Vitality": "Erhaltung der kognitiven Vitalität",
        "Neuroplasticity in Depth": "Neuroplastizität in der Tiefe",
        "The Role of Physical Exercise": "Die Rolle körperlicher Bewegung",
        "Social Connection and Brain Health": "Soziale Bindung und Gehirngesundheit",
        "Learning a New Skill": "Eine neue Fähigkeit erlernen",
        "Music and the Brain": "Musik und das Gehirn",
        "Digital Detox and Attention": "Digital Detox und Aufmerksamkeit",
        "Emotional Intelligence": "Emotionale Intelligenz",
        "Gut-Brain Axis": "Darm-Hirn-Achse",
        "Cognitive Reserve": "Kognitive Reserve",
        "Future of Brain Health": "Zukunft der Gehirngesundheit"
    };
    return map[text] || text;
}
function translateContentDe(text) {
    // Simple mock translation for content blocks - in production use real translations
    return `[DE] ${text.substring(0, 50)}... (Deutsche Übersetzung verfügbar)`;
}
function translateTitleFr(text) {
    const map = {
        "Introduction to Cognitive Wellness": "Introduction au bien-être cognitif",
        "Memory Enhancement Techniques": "Techniques d'amélioration de la mémoire",
        "Attention and Focus Strategies": "Stratégies d'attention et de concentration",
        "Problem-Solving Skills": "Compétences en résolution de problèmes",
        "Creative Thinking": "Pensée créative",
        "Mindfulness and Mental Clarity": "Pleine conscience et clarté mentale",
        "Brain Health and Nutrition": "Santé cérébrale et nutrition",
        "Sleep and Cognitive Performance": "Sommeil et performance cognitive",
        "Stress Management": "Gestion du stress",
        "Maintaining Cognitive Vitality": "Maintenir la vitalité cognitive",
        "Neuroplasticity in Depth": "Neuroplasticité en profondeur",
        "The Role of Physical Exercise": "Le rôle de l'exercice physique",
        "Social Connection and Brain Health": "Lien social et santé cérébrale",
        "Learning a New Skill": "Apprendre une nouvelle compétence",
        "Music and the Brain": "La musique et le cerveau",
        "Digital Detox and Attention": "Détox numérique et attention",
        "Emotional Intelligence": "Intelligence émotionnelle",
        "Gut-Brain Axis": "Axe intestin-cerveau",
        "Cognitive Reserve": "Réserve cognitive",
        "Future of Brain Health": "L'avenir de la santé cérébrale"
    };
    return map[text] || text;
}
function translateContentFr(text) {
    // Simple mock translation for content blocks
    return `[FR] ${text.substring(0, 50)}... (Traduction française disponible)`;
}
function translateQuestionDe(text) {
    // Mock translation logic - would be replaced by a dictionary or API
    return `[DE] ${text}`;
}
function translateOptionDe(text) {
    return `[DE] ${text}`;
}
function translateQuestionFr(text) {
    return `[FR] ${text}`;
}
function translateOptionFr(text) {
    return `[FR] ${text}`;
}
seedFirestore().catch(console.error);
//# sourceMappingURL=seed-firestore.js.map