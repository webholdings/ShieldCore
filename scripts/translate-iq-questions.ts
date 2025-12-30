import fetch from 'node-fetch';
import * as fs from 'fs';

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

interface TranslationMap {
    [key: string]: string;
}

async function translateText(text: string, targetLang: string): Promise<string> {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: targetLang,
            format: 'text'
        })
    });

    const data = await response.json();

    // Log the response to diagnose issues
    if (!data.data || !data.data.translations) {
        console.error('API Response:', JSON.stringify(data, null, 2));
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
    }

    return data.data.translations[0].translatedText;
}

async function translateBatch(texts: string[], targetLang: string): Promise<TranslationMap> {
    const translations: TranslationMap = {};

    console.log(`Translating ${texts.length} texts to ${targetLang}...`);

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        try {
            const translated = await translateText(text, targetLang);
            translations[text] = translated;
            console.log(`  [${i + 1}/${texts.length}] Translated: "${text.substring(0, 50)}..."`);

            // Increased delay to 2 seconds to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Error translating "${text}":`, error);
            translations[text] = `[${targetLang.toUpperCase()}] ${text}`;
        }
    }

    return translations;
}

async function generateTranslations() {
    // All unique texts from IQ questions
    const textsToTranslate = [
        // Questions
        "What comes next in the sequence: 2, 4, 8, 16, ?",
        "Complete the sequence: 1, 3, 5, 7, ?",
        "What number should replace the question mark: 2, 6, 12, 20, 30, ?",
        "Find the next number: 1, 1, 2, 3, 5, 8, ?",
        "What is the missing number in the sequence: 3, 9, 27, 81, ?",
        "Which number completes the pattern: 5, 10, 20, 40, ?",
        "2, 3, 5, 9, 17, ?",
        "1, 4, 9, 16, 25, ?",
        "100, 99, 96, 91, 84, ?",
        "A, C, F, J, O, ?",
        "Which number completes the grid? [2, 4, 8], [3, 9, 27], [4, 16, ?]",
        "0, 1, 1, 2, 3, 5, 8, 13, ?",
        "What is 15% of 200?",
        "If x + 5 = 12, what is x?",
        "What is the next prime number after 13?",
        "A rectangle has a length of 8 and a width of 4. What is its area?",
        "Solve for x: 2x + 3 = 3x - 5",
        "If a train travels 60 miles in 45 minutes, what is its speed in mph?",
        "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
        "Which statement is logically equivalent to: 'If it rains, then the ground is wet'?",
        "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
        "If some Flibs are Globs, and all Globs are Snobs, which statement must be true?",
        "Three switches control three light bulbs in another room. You can flip the switches as you like, but can only enter the room once. How can you determine which switch controls which bulb?",
        "You have two coins totaling 30 cents. One of them is not a nickel. What are the two coins?",
        "John is taller than Peter. Peter is shorter than Tom. Tom is shorter than John. Who is the tallest?",
        "If yesterday was Tuesday, what day will it be in 100 days?",
        "All roses are flowers. Some flowers fade quickly. Therefore:",
        "Five people are in a race. A beat B. C beat D. B beat C. Who finished last?",
        "Which conclusion follows? No A are B. All C are A.",
        "If a doctor gives you 3 pills and tells you to take one every half hour, how long will they last?",
        "How many faces does a cube have?",
        "If you fold a square piece of paper in half twice and cut off one corner, how many holes will the unfolded paper have?",
        "A cube is painted red on all faces and then cut into 27 smaller cubes of equal size. How many small cubes have exactly 2 red faces?",
        "Which 3D shape has 5 faces, 9 edges, and 6 vertices?",
        "If you have a 3x3x3 cube made of smaller cubes, and you remove all the cubes that have at least one face exposed, how many cubes remain?",
        "Which of these shapes cannot be formed by folding a single piece of paper without cutting?",
        "Which letter is symmetric along a vertical axis?",
        "How many corners does a rectangular prism have?",
        "Imagine rotating the letter 'Z' 90 degrees clockwise. What does it look like?",
        "Which shape is the cross-section of a sphere?",
        "If you look at a cylinder from the side, what shape do you see?",
        "How many edges does a tetrahedron have?",
        "Book is to Reading as Fork is to:",
        "Which word does not belong: Apple, Banana, Carrot, Orange",
        "Pen is to Poet as Needle is to:",
        "What is the opposite of 'abundant'?",
        "Ephemeral is to Permanent as:",
        "Which word is the odd one out?",
        "Which word is a synonym for 'Benevolent'?",
        "Which word is an antonym for 'Obscure'?",
        "Finger is to Hand as Leaf is to:",
        "Which word means 'to make something better'?",
        "What is the relationship between 'Candid' and 'Frank'?",
        "Choose the word that best completes the sentence: The scientist's theory was _____, explaining all observed phenomena.",
        "If you rearrange the letters 'CIFAIPC' you would have the name of a(n):",
        "A clock shows 3:15. What is the angle between the hour and minute hands?",
        "Which number is the odd one out: 9, 16, 25, 43, 49",

        // Options
        "True", "False", "Cannot be determined",
        "If the ground is not wet, then it did not rain",
        "If it does not rain, then the ground is not wet",
        "The ground is wet only if it rains",
        "None of the above",
        "All Flibs are Snobs", "Some Flibs are Snobs", "No Flibs are Snobs", "All Snobs are Flibs",
        "Turn on switch 1, wait, turn it off, turn on switch 2, then check",
        "Turn on all switches at once",
        "Turn on switch 1 and 2, then check",
        "It's impossible to determine",
        "Quarter and Nickel", "Dime and Nickel", "Two Quarters", "Quarter and Dime",
        "Triangular prism", "Square pyramid", "Pentagonal prism", "Hexagonal pyramid",
        "Cube", "Sphere", "Tetrahedron", "Cylinder",
        "Drawing", "Writing", "Eating", "Stirring",
        "Apple", "Banana", "Carrot", "Orange",
        "Thread", "Tailor", "Cloth", "Sewing",
        "Plentiful", "Scarce", "Sufficient", "Adequate",
        "Temporary is to Lasting", "Brief is to Eternal", "Fleeting is to Enduring", "All of the above",
        "Trivial", "Unimportant", "Insignificant", "Familiar",
        "City", "Animal", "Ocean", "Country",
        "John", "Peter", "Tom",
        "Wednesday", "Thursday", "Friday", "Saturday",
        "Some roses fade quickly", "All roses fade quickly", "No roses fade quickly", "None of the above follows",
        "No C are B", "Some C are B", "All B are C",
        "1 hour", "1.5 hours", "2 hours", "3 hours",
        "Circle", "Square", "Triangle", "Oval", "Rectangle",
        "Kind", "Cruel", "Rich", "Poor",
        "Hidden", "Clear", "Dark", "Vague",
        "Tree", "Branch", "Root", "Flower",
        "Ameliorate", "Deteriorate", "Stagnate", "Vacillate",
        "Synonyms", "Antonyms", "Unrelated", "Homophones",
        "Comprehensive", "Ambiguous", "Tentative", "Obsolete"
    ];

    // Generate translations for each language
    const deTrans = await translateBatch(textsToTranslate, 'de');
    const frTrans = await translateBatch(textsToTranslate, 'fr');
    const ptTrans = await translateBatch(textsToTranslate, 'pt');

    // Generate TypeScript file
    const output = `// Auto-generated IQ Test translations using Google Translate API
// Generated on: ${new Date().toISOString()}

export const iqTranslationsDe: Record<string, string> = ${JSON.stringify(deTrans, null, 2)};

export const iqTranslationsFr: Record<string, string> = ${JSON.stringify(frTrans, null, 2)};

export const iqTranslationsPt: Record<string, string> = ${JSON.stringify(ptTrans, null, 2)};
`;

    fs.writeFileSync('./server/iq-translations.ts', output);
    console.log('\n✅ Translations generated successfully!');
    console.log('📝 File saved to: ./server/iq-translations.ts');
}

generateTranslations().catch(console.error);
