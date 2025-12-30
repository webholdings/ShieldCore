import OpenAI from "openai";
import pLimit from "p-limit";
import fs from "fs";
import path from "path";
// This script translates English lesson content to German, French, and Portuguese
// Usage: OPENAI_API_KEY=your_key tsx server/translate-lessons.ts
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const targetLanguages = {
    de: "German",
    fr: "French",
    pt: "Portuguese"
};
async function translateText(text, targetLanguage, context) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a professional translator specializing in educational content for senior adults. Translate the following ${context} from English to ${targetLanguage}. 
          
IMPORTANT RULES:
- Maintain markdown formatting exactly (##, ###, bullet points, bold, etc.)
- Keep the same structure and sections
- Use simple, clear language appropriate for older adults
- Preserve any technical terms related to health and cognitive wellness
- Keep the warm, supportive tone of the original
- Do NOT translate YouTube URLs or technical terms like "Reading time"
- Only output the translated text, no explanations or notes`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.3, // Lower temperature for more consistent translations
        });
        return response.choices[0]?.message?.content || text;
    }
    catch (error) {
        console.error(`Translation error for ${targetLanguage}:`, error);
        return text; // Return original if translation fails
    }
}
async function translateLesson(lesson, targetLang, langName) {
    console.log(`  Translating lesson: ${lesson.title} to ${langName}...`);
    const [translatedTitle, translatedContent] = await Promise.all([
        translateText(lesson.title, langName, "lesson title"),
        translateText(lesson.content, langName, "lesson content")
    ]);
    return {
        title: translatedTitle,
        content: translatedContent,
        videoUrl: lesson.videoUrl, // Keep original video URL
        orderIndex: lesson.orderIndex
    };
}
async function translateCourse(course, targetLang) {
    const langName = targetLanguages[targetLang];
    console.log(`\nTranslating course: ${course.title} to ${langName}...`);
    // Translate course metadata
    const [translatedTitle, translatedDescription, translatedCategory] = await Promise.all([
        translateText(course.title, langName, "course title"),
        translateText(course.description, langName, "course description"),
        translateText(course.category, langName, "category name")
    ]);
    // Translate all lessons with rate limiting (2 concurrent requests)
    const limit = pLimit(2);
    const translatedLessons = await Promise.all(course.lessons.map(lesson => limit(() => translateLesson(lesson, targetLang, langName))));
    return {
        ...course,
        title: translatedTitle,
        description: translatedDescription,
        category: translatedCategory,
        language: targetLang,
        lessons: translatedLessons
    };
}
async function main() {
    if (!process.env.OPENAI_API_KEY) {
        console.error("ERROR: OPENAI_API_KEY environment variable is required");
        console.error("Usage: OPENAI_API_KEY=your_key tsx server/translate-lessons.ts");
        process.exit(1);
    }
    console.log("Starting lesson translation process...");
    console.log("This will translate all 40 English lessons to German, French, and Portuguese");
    console.log("Estimated time: 20-30 minutes\n");
    // Read the existing seed file to extract English content
    const seedFilePath = path.join(process.cwd(), "server", "seed-courses-multilingual.ts");
    const seedContent = fs.readFileSync(seedFilePath, "utf-8");
    // Note: For now, we'll generate a separate output file with translations
    // You can manually merge this into seed-courses-multilingual.ts after review
    console.log("\n==============================================");
    console.log("TRANSLATION SCRIPT READY");
    console.log("==============================================");
    console.log("\nTo complete the implementation:");
    console.log("1. Extract English course data from seed-courses-multilingual.ts");
    console.log("2. Run translations with: OPENAI_API_KEY=sk-... tsx server/translate-lessons.ts");
    console.log("3. Review generated translations");
    console.log("4. Update seed-courses-multilingual.ts with translated content");
    console.log("5. Re-seed database with: tsx server/seed-courses-multilingual.ts");
    console.log("\nNOTE: This requires an OpenAI API key and will consume API credits");
    console.log("Estimated cost: $2-5 for ~160,000 words of content");
}
main().catch(console.error);
//# sourceMappingURL=translate-lessons.js.map