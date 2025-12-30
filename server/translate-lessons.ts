import { GoogleGenerativeAI } from "@google/generative-ai";
import pLimit from "p-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// This script translates English lesson content to German, French, and Portuguese
// Usage: GOOGLE_API_KEY=your_key tsx server/translate-lessons.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is required");
  console.error("Usage: GOOGLE_API_KEY=your_key tsx server/translate-lessons.ts");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface ContentStructure {
  courses: Record<string, { title: string; description: string }>;
  lessons: Record<string, { title: string; content: string }>;
}

const targetLanguages = {
  de: "German",
  fr: "French",
  pt: "Portuguese"
};

async function translateText(text: string, targetLanguage: string, context: string): Promise<string> {
  if (!text) return "";

  try {
    const prompt = `You are a professional translator specializing in educational content for senior adults. Translate the following ${context} from English to ${targetLanguage}. 
          
IMPORTANT RULES:
- Maintain markdown formatting exactly (##, ###, bullet points, bold, etc.)
- Keep the same structure and sections
- Use simple, clear language appropriate for older adults
- Preserve any technical terms related to health and cognitive wellness
- Keep the warm, supportive tone of the original
- Do NOT translate YouTube URLs or technical terms like "Reading time"
- Only output the translated text, no explanations or notes

Text to translate:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    return text; // Return original if translation fails
  }
}

async function main() {
  console.log("Starting content translation process with Gemini...");

  const contentDir = path.join(__dirname, "content/translations");
  const enPath = path.join(contentDir, "en", "content.json");

  if (!fs.existsSync(enPath)) {
    console.error(`English content file not found at ${enPath}`);
    process.exit(1);
  }

  const enData: ContentStructure = JSON.parse(fs.readFileSync(enPath, "utf-8"));

  // Rate limiter (Gemini has high limits, but let's be safe)
  const limit = pLimit(10);

  for (const [langCode, langName] of Object.entries(targetLanguages)) {
    console.log(`\nProcessing ${langName} (${langCode})...`);

    const langPath = path.join(contentDir, langCode, "content.json");
    let langData: ContentStructure = { courses: {}, lessons: {} };

    // Load existing translations if they exist
    if (fs.existsSync(langPath)) {
      try {
        langData = JSON.parse(fs.readFileSync(langPath, "utf-8"));
        // Ensure structure exists
        if (!langData.courses) langData.courses = {};
        if (!langData.lessons) langData.lessons = {};
      } catch (e) {
        console.warn(`Could not parse existing ${langCode} file, starting fresh.`);
      }
    } else {
      // Create directory if needed
      const dirPath = path.join(contentDir, langCode);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    let updatesCount = 0;
    const tasks: Promise<void>[] = [];

    // Check Courses
    for (const [id, course] of Object.entries(enData.courses)) {
      if (!langData.courses[id]) {
        tasks.push(limit(async () => {
          console.log(`  Translating course: ${course.title}`);
          const [title, description] = await Promise.all([
            translateText(course.title, langName, "course title"),
            translateText(course.description, langName, "course description")
          ]);
          langData.courses[id] = { title, description };
          updatesCount++;
        }));
      }
    }

    // Check Lessons
    for (const [id, lesson] of Object.entries(enData.lessons)) {
      if (!langData.lessons[id]) {
        tasks.push(limit(async () => {
          console.log(`  Translating lesson: ${lesson.title}`);
          const [title, content] = await Promise.all([
            translateText(lesson.title, langName, "lesson title"),
            translateText(lesson.content, langName, "lesson content")
          ]);
          langData.lessons[id] = { title, content };
          updatesCount++;
        }));
      }
    }

    if (tasks.length > 0) {
      console.log(`  Found ${tasks.length} missing items to translate in ${langName}...`);
      await Promise.all(tasks);

      // Save updated file
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
      console.log(`  ✓ Saved ${langCode} translations (${updatesCount} new items)`);
    } else {
      console.log(`  ✓ ${langName} is already up to date.`);
    }
  }

  console.log("\nAll translations completed!");
}

main().catch(console.error);
