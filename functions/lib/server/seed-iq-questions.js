import { db } from "./db";
import { iqQuestions } from "@shared/schema";
const iqQuestionsData = [
    // Pattern Recognition Questions
    { question: "What number comes next in the sequence: 2, 4, 8, 16, ?", questionType: "pattern", options: JSON.stringify(["24", "32", "20", "28"]), correctAnswer: "32", difficulty: 1 },
    { question: "Complete the pattern: A, C, E, G, ?", questionType: "pattern", options: JSON.stringify(["H", "I", "J", "K"]), correctAnswer: "I", difficulty: 1 },
    { question: "What comes next: 1, 1, 2, 3, 5, 8, ?", questionType: "pattern", options: JSON.stringify(["11", "13", "15", "17"]), correctAnswer: "13", difficulty: 2 },
    { question: "Which shape completes the pattern: Circle, Square, Triangle, Circle, Square, ?", questionType: "pattern", options: JSON.stringify(["Circle", "Triangle", "Square", "Pentagon"]), correctAnswer: "Triangle", difficulty: 1 },
    { question: "Complete: 100, 95, 85, 70, ?", questionType: "pattern", options: JSON.stringify(["50", "55", "60", "65"]), correctAnswer: "50", difficulty: 2 },
    { question: "What's next: Z, X, V, T, ?", questionType: "pattern", options: JSON.stringify(["S", "R", "Q", "P"]), correctAnswer: "R", difficulty: 3 },
    { question: "Complete: 3, 6, 12, 24, ?", questionType: "pattern", options: JSON.stringify(["36", "48", "40", "32"]), correctAnswer: "48", difficulty: 2 },
    { question: "What comes next: 1, 4, 9, 16, 25, ?", questionType: "pattern", options: JSON.stringify(["30", "36", "35", "49"]), correctAnswer: "36", difficulty: 2 },
    { question: "Complete the series: 2, 6, 12, 20, 30, ?", questionType: "pattern", options: JSON.stringify(["40", "42", "38", "44"]), correctAnswer: "42", difficulty: 3 },
    { question: "What's next: J, F, M, A, M, ?", questionType: "pattern", options: JSON.stringify(["J", "S", "A", "N"]), correctAnswer: "J", difficulty: 2 },
    // Logical Reasoning Questions
    { question: "If all roses are flowers and some flowers fade quickly, which statement must be true?", questionType: "logic", options: JSON.stringify(["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"]), correctAnswer: "Some roses may fade quickly", difficulty: 2 },
    { question: "John is taller than Mary. Mary is taller than Sarah. Who is shortest?", questionType: "logic", options: JSON.stringify(["John", "Mary", "Sarah", "Cannot determine"]), correctAnswer: "Sarah", difficulty: 1 },
    { question: "If it's raining, the ground is wet. The ground is wet. What can we conclude?", questionType: "logic", options: JSON.stringify(["It is raining", "It might be raining", "It is not raining", "None of the above"]), correctAnswer: "It might be raining", difficulty: 3 },
    { question: "All birds have feathers. Some things with feathers can fly. Therefore:", questionType: "logic", options: JSON.stringify(["All birds can fly", "Some birds can fly", "No birds can fly", "All flying things are birds"]), correctAnswer: "Some birds can fly", difficulty: 2 },
    { question: "If A is west of B, and B is west of C, what is the relationship between A and C?", questionType: "logic", options: JSON.stringify(["A is west of C", "A is east of C", "A equals C", "Cannot determine"]), correctAnswer: "A is west of C", difficulty: 1 },
    { question: "No cats are dogs. All dogs are animals. Therefore:", questionType: "logic", options: JSON.stringify(["No cats are animals", "All animals are dogs", "Some animals are not cats", "All cats are animals"]), correctAnswer: "Some animals are not cats", difficulty: 3 },
    { question: "If today is Monday, what day was it 10 days ago?", questionType: "logic", options: JSON.stringify(["Monday", "Friday", "Saturday", "Sunday"]), correctAnswer: "Friday", difficulty: 2 },
    { question: "A is older than B. C is younger than B. Who is youngest?", questionType: "logic", options: JSON.stringify(["A", "B", "C", "Cannot determine"]), correctAnswer: "C", difficulty: 1 },
    { question: "If some students are athletes and all athletes are healthy, what must be true?", questionType: "logic", options: JSON.stringify(["All students are healthy", "Some students are healthy", "No students are healthy", "All healthy people are students"]), correctAnswer: "Some students are healthy", difficulty: 2 },
    { question: "Red is darker than pink. Blue is darker than red. Which is lightest?", questionType: "logic", options: JSON.stringify(["Red", "Pink", "Blue", "Cannot determine"]), correctAnswer: "Pink", difficulty: 1 },
    // Mathematical Skills Questions
    { question: "What is 15% of 200?", questionType: "math", options: JSON.stringify(["20", "25", "30", "35"]), correctAnswer: "30", difficulty: 1 },
    { question: "If x + 5 = 12, what is x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1 },
    { question: "A shirt costs $40 after a 20% discount. What was the original price?", questionType: "math", options: JSON.stringify(["$45", "$48", "$50", "$55"]), correctAnswer: "$50", difficulty: 2 },
    { question: "What is the average of 10, 20, and 30?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1 },
    { question: "If 3x = 21, what is x?", questionType: "math", options: JSON.stringify(["5", "6", "7", "8"]), correctAnswer: "7", difficulty: 1 },
    { question: "What is 25% of 80?", questionType: "math", options: JSON.stringify(["15", "20", "25", "30"]), correctAnswer: "20", difficulty: 1 },
    { question: "A rectangle has length 8 and width 5. What is its area?", questionType: "math", options: JSON.stringify(["30", "35", "40", "45"]), correctAnswer: "40", difficulty: 1 },
    { question: "If y - 8 = 15, what is y?", questionType: "math", options: JSON.stringify(["20", "21", "22", "23"]), correctAnswer: "23", difficulty: 1 },
    { question: "What is 1/4 of 100?", questionType: "math", options: JSON.stringify(["20", "25", "30", "40"]), correctAnswer: "25", difficulty: 1 },
    { question: "A car travels 60 miles in 2 hours. What is its average speed?", questionType: "math", options: JSON.stringify(["25 mph", "30 mph", "35 mph", "40 mph"]), correctAnswer: "30 mph", difficulty: 2 },
    // Verbal Reasoning Questions
    { question: "Choose the word that is most opposite to DIFFICULT:", questionType: "verbal", options: JSON.stringify(["Hard", "Simple", "Complex", "Challenging"]), correctAnswer: "Simple", difficulty: 1 },
    { question: "Which word does not belong: Apple, Banana, Carrot, Orange", questionType: "verbal", options: JSON.stringify(["Apple", "Banana", "Carrot", "Orange"]), correctAnswer: "Carrot", difficulty: 1 },
    { question: "Choose the synonym for HAPPY:", questionType: "verbal", options: JSON.stringify(["Sad", "Joyful", "Angry", "Tired"]), correctAnswer: "Joyful", difficulty: 1 },
    { question: "Complete the analogy: Hot is to Cold as Day is to ?", questionType: "verbal", options: JSON.stringify(["Light", "Night", "Sun", "Moon"]), correctAnswer: "Night", difficulty: 1 },
    { question: "Which word is most similar to BRAVE:", questionType: "verbal", options: JSON.stringify(["Fearful", "Courageous", "Weak", "Timid"]), correctAnswer: "Courageous", difficulty: 1 },
    { question: "Complete: Cat is to Meow as Dog is to ?", questionType: "verbal", options: JSON.stringify(["Purr", "Bark", "Chirp", "Roar"]), correctAnswer: "Bark", difficulty: 1 },
    { question: "Choose the opposite of ANCIENT:", questionType: "verbal", options: JSON.stringify(["Old", "Modern", "Historic", "Traditional"]), correctAnswer: "Modern", difficulty: 1 },
    { question: "Which does not belong: Chair, Table, Desk, Apple", questionType: "verbal", options: JSON.stringify(["Chair", "Table", "Desk", "Apple"]), correctAnswer: "Apple", difficulty: 1 },
    { question: "Complete the analogy: Fish is to Water as Bird is to ?", questionType: "verbal", options: JSON.stringify(["Nest", "Air", "Tree", "Sky"]), correctAnswer: "Air", difficulty: 2 },
    { question: "Choose the synonym for DIFFICULT:", questionType: "verbal", options: JSON.stringify(["Easy", "Hard", "Simple", "Clear"]), correctAnswer: "Hard", difficulty: 1 },
    // Spatial Reasoning Questions
    { question: "How many faces does a cube have?", questionType: "spatial", options: JSON.stringify(["4", "6", "8", "12"]), correctAnswer: "6", difficulty: 1 },
    { question: "If you rotate a square 90 degrees, what shape do you get?", questionType: "spatial", options: JSON.stringify(["Rectangle", "Square", "Triangle", "Circle"]), correctAnswer: "Square", difficulty: 1 },
    { question: "How many sides does a pentagon have?", questionType: "spatial", options: JSON.stringify(["4", "5", "6", "7"]), correctAnswer: "5", difficulty: 1 },
    { question: "Which direction is opposite to North?", questionType: "spatial", options: JSON.stringify(["East", "West", "South", "Northeast"]), correctAnswer: "South", difficulty: 1 },
    { question: "How many corners does a triangle have?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "3", difficulty: 1 },
    { question: "If you fold a square in half, what shapes can you make?", questionType: "spatial", options: JSON.stringify(["Circle", "Rectangle", "Triangle", "Pentagon"]), correctAnswer: "Rectangle", difficulty: 2 },
    { question: "How many edges does a cube have?", questionType: "spatial", options: JSON.stringify(["6", "8", "10", "12"]), correctAnswer: "12", difficulty: 2 },
    { question: "What 3D shape has only one face?", questionType: "spatial", options: JSON.stringify(["Cube", "Sphere", "Cone", "Cylinder"]), correctAnswer: "Sphere", difficulty: 2 },
    { question: "How many right angles are in a square?", questionType: "spatial", options: JSON.stringify(["2", "3", "4", "5"]), correctAnswer: "4", difficulty: 1 },
    { question: "If you look at a clock from behind, which direction do the hands move?", questionType: "spatial", options: JSON.stringify(["Clockwise", "Counterclockwise", "Up", "Down"]), correctAnswer: "Counterclockwise", difficulty: 3 }
];
export async function seedIQQuestions() {
    console.log("🧠 Starting IQ questions seeding...");
    let questionsCreated = 0;
    for (const questionData of iqQuestionsData) {
        await db.insert(iqQuestions).values(questionData);
        questionsCreated++;
    }
    console.log(`✅ Created ${questionsCreated} IQ questions`);
    return questionsCreated;
}
// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    seedIQQuestions().catch(console.error).finally(() => process.exit(0));
}
//# sourceMappingURL=seed-iq-questions.js.map