---
description: Automated plan to translate all missing course and lesson content to German, French, and Portuguese using Google Gemini
---

# Multilingual Content Translation Plan

This workflow outlines the steps to automatically translate all remaining courses and lessons into supported languages (German, French, Portuguese) using Google's Gemini API.

## Prerequisites

- Google AI Studio API Key (You need a `GOOGLE_API_KEY`)
- Node.js environment

## Step 1: Run the Translation Script

We have prepared a script at `server/translate-lessons.ts` that will:
1. Read the English source content from `server/content/translations/en/content.json`
2. Check `de`, `fr`, and `pt` directories for existing translations
3. Identify any missing courses or lessons
4. Translate only the missing items using **Gemini 1.5 Pro**
5. Save the updated JSON files

Run the command below (replace `your_key_here` with your actual Google API Key):

```bash
GOOGLE_API_KEY=your_key_here npx tsx server/translate-lessons.ts
```

> **Note:** The script uses `p-limit` to handle concurrent requests. Gemini has generous rate limits so this should be fast.

## Step 2: Verify Translations

Once the script completes, verify that the content files have been populated:

```bash
# Check file sizes
ls -lh server/content/translations/*/content.json
```

## Step 3: Seed the Database

After the translation files are updated, you need to update the Firestore database with the new content.

```bash
npx tsx server/seed-firestore.ts
```

## Step 4: Verification

1. Start the application locally:
   ```bash
   npm run dev
   ```
2. Open the app in your browser
3. Switch languages to French/German/Portuguese
4. Navigate to "Courses"
5. Verify that titles, descriptions, and lesson content appear in the selected language.

## Cleanup

No cleanup is strictly necessary, as the generated JSON files are part of the codebase source of truth.
