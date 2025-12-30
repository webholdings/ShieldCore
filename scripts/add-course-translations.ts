import { db } from "../server/db";

async function main() {
    console.log("Adding missing course translations...\n");

    const newCourses = [
        // German translations for missing courses
        {
            id: "course_stress_management_de",
            title: "Stressbewältigung",
            description: "Techniken zur Bewältigung von Stress und Angst im täglichen Leben.",
            language: "de",
            category: "Wellness",
            difficulty: "Mittelstufe",
            duration: "3 Wochen",
            orderIndex: 2,
            icon: "heart",
            color: "text-rose-500",
            imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "course_cognitive_fitness_de",
            title: "Kognitive Fitness",
            description: "Übungen, um Ihr Gehirn scharf und agil zu halten.",
            language: "de",
            category: "Gehirngesundheit",
            difficulty: "Alle Stufen",
            duration: "Fortlaufend",
            orderIndex: 3,
            icon: "activity",
            color: "text-purple-500",
            imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        // French translations for missing courses
        {
            id: "course_cognitive_fitness_fr",
            title: "Forme Cognitive",
            description: "Des exercices pour garder votre cerveau vif et agile.",
            language: "fr",
            category: "Santé Cérébrale",
            difficulty: "Tous Niveaux",
            duration: "En continu",
            orderIndex: 3,
            icon: "activity",
            color: "text-purple-500",
            imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        // Portuguese translations for all courses
        {
            id: "course_mindfulness_basics_pt",
            title: "Fundamentos de Mindfulness",
            description: "Aprenda os fundamentos da atenção plena e meditação.",
            language: "pt",
            category: "Mindfulness",
            difficulty: "Iniciante",
            duration: "4 semanas",
            orderIndex: 1,
            icon: "moon",
            color: "text-blue-500",
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "course_stress_management_pt",
            title: "Gestão de Stress",
            description: "Técnicas para lidar com o stress e ansiedade no dia a dia.",
            language: "pt",
            category: "Bem-estar",
            difficulty: "Intermediário",
            duration: "3 semanas",
            orderIndex: 2,
            icon: "heart",
            color: "text-rose-500",
            imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "course_cognitive_fitness_pt",
            title: "Fitness Cognitivo",
            description: "Exercícios para manter seu cérebro afiado e ágil.",
            language: "pt",
            category: "Saúde Cerebral",
            difficulty: "Todos os Níveis",
            duration: "Contínuo",
            orderIndex: 3,
            icon: "activity",
            color: "text-purple-500",
            imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "course_cognitive_wellness_pt",
            title: "Jornada do Bem-Estar Cognitivo",
            description: "Um programa abrangente para melhorar suas habilidades cognitivas.",
            language: "pt",
            category: "Bem-estar Cognitivo",
            difficulty: "Todos os Níveis",
            duration: "8 semanas",
            orderIndex: 1,
            icon: "apple",
            color: "text-green-500",
            imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    try {
        console.log(`Adding ${newCourses.length} new course translations...\n`);

        for (const course of newCourses) {
            await db.collection('courses').doc(course.id).set(course);
            console.log(`✓ Added: [${course.language.toUpperCase()}] ${course.title}`);
        }

        console.log(`\n✅ Successfully added ${newCourses.length} course translations!`);

    } catch (error) {
        console.error("Error adding courses:", error);
    }

    process.exit(0);
}

main().catch(console.error);
