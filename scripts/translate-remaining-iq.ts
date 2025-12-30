import fetch from 'node-fetch';
import * as fs from 'fs';

const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyAOiEvwPSbmbCnXisb7ec8vGlLMGweTnKc';

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

async function translateRemaining(existingTranslations: TranslationMap, targetLang: string): Promise<TranslationMap> {
    const updated: TranslationMap = { ...existingTranslations };
    const langPrefix = `[${targetLang.toUpperCase()}]`;

    // Find all texts that still have placeholder translations
    const toTranslate = Object.entries(existingTranslations)
        .filter(([_, translation]) => translation.startsWith(langPrefix))
        .map(([text, _]) => text);

    console.log(`\nFound ${toTranslate.length} items to translate to ${targetLang}...`);

    if (toTranslate.length === 0) {
        console.log('All items already translated!');
        return updated;
    }

    for (let i = 0; i < toTranslate.length; i++) {
        const text = toTranslate[i];
        try {
            const translated = await translateText(text, targetLang);
            updated[text] = translated;
            console.log(`  [${i + 1}/${toTranslate.length}] ✓ Translated: "${text.substring(0, 50)}..."`);

            // Increased delay to 5 seconds to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(`  [${i + 1}/${toTranslate.length}] ✗ Error translating "${text.substring(0, 50)}...":`, error.message);
            // Keep the placeholder on error
        }
    }

    return updated;
}

async function generateRemainingTranslations() {
    // Import existing translations
    const { iqTranslationsDe, iqTranslationsFr, iqTranslationsPt } = await import('../server/iq-translations');

    console.log('Starting translation of remaining IQ questions...\n');
    console.log('⏱️  Using 5-second delay between requests to avoid rate limits\n');

    // Translate remaining items for each language
    console.log('=== German (DE) ===');
    const deTrans = await translateRemaining(iqTranslationsDe, 'de');

    console.log('\n=== French (FR) ===');
    const frTrans = await translateRemaining(iqTranslationsFr, 'fr');

    console.log('\n=== Portuguese (PT) ===');
    const ptTrans = await translateRemaining(iqTranslationsPt, 'pt');

    // Generate TypeScript file
    const output = `// Auto-generated IQ Test translations using Google Translate API
// Generated on: ${new Date().toISOString()}

export const iqTranslationsDe: Record<string, string> = ${JSON.stringify(deTrans, null, 2)};

export const iqTranslationsFr: Record<string, string> = ${JSON.stringify(frTrans, null, 2)};

export const iqTranslationsPt: Record<string, string> = ${JSON.stringify(ptTrans, null, 2)};
`;

    fs.writeFileSync('./server/iq-translations.ts', output);
    console.log('\n✅ Translations updated successfully!');
    console.log('📝 File saved to: ./server/iq-translations.ts');
}

generateRemainingTranslations().catch(console.error);
