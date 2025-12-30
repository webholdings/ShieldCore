import { QuizResult } from "@shared/schema";

/**
 * Extracts important questions from quiz results for AI assistant and welcome screen
 * @param quizResult The quiz result to extract from
 * @returns Structured object with key insights
 */
export function extractImportantQuestions(quizResult: QuizResult | undefined): {
    age: string | null;
    cognitiveStruggles: string | null;
    improvementGoals: string[] | null;
    rawAnswers: any[];
} {
    if (!quizResult || !quizResult.answers) {
        return {
            age: null,
            cognitiveStruggles: null,
            improvementGoals: null,
            rawAnswers: []
        };
    }

    const answers = quizResult.answers;

    // Extract specific questions by key
    const q1 = answers.find((a: any) => a.key === 'q1' || a.id === '1');
    const q2 = answers.find((a: any) => a.key === 'q2' || a.id === '2');
    const q16 = answers.find((a: any) => a.key === 'q16' || a.id === '16');

    return {
        age: q1?.answer || null,
        cognitiveStruggles: q2?.answer || null,
        improvementGoals: Array.isArray(q16?.answer) ? q16.answer : (q16?.answer ? [q16.answer] : null),
        rawAnswers: answers
    };
}
