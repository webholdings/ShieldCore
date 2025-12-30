---
description: Step-by-step plan to translate courses and IQ content to Portuguese
---

# Portuguese Content Translation Plan

## Overview
This workflow guides you through translating all course lessons and IQ test questions/answers to Portuguese (pt-BR).

---

## Part 1: IQ Questions Translation

### Step 1: Examine IQ Translation Structure
```bash
# View the current IQ translations file
cat server/iq-translations.ts
```

**What to look for:**
- `iqTranslationsPt` object (line ~328)
- Compare with `iqTranslationsDe` and `iqTranslationsFr` to see the pattern
- Check if Portuguese translations are already present or empty

### Step 2: Extract English IQ Questions for Translation
```bash
# Create a temporary file with all English questions
node -e "
const fs = require('fs');
const content = fs.readFileSync('server/iq-translations.ts', 'utf8');
const deSection = content.match(/export const iqTranslationsDe[^}]+}/s)[0];
const questions = [...deSection.matchAll(/\"([^\"]+)\":/g)].map(m => m[1]);
fs.writeFileSync('iq-questions-to-translate.txt', questions.join('\n'));
console.log('Extracted', questions.length, 'IQ questions to translate');
"
```

### Step 3: Translate IQ Questions with Gemini
1. Open Gemini AI (https://gemini.google.com)
2. Use this prompt:

```
I need you to translate IQ test questions and answers from English to Brazilian Portuguese (pt-BR).

Rules:
- Maintain the exact same meaning and difficulty level
- Use formal but clear language appropriate for cognitive assessments
- Keep technical terms accurate
- Preserve any numbers, symbols, or mathematical notation exactly

Here are the questions to translate:
[Paste content from iq-questions-to-translate.txt]

Please provide the translations in the same order, one per line.
```

3. Save Gemini's response to `iq-questions-pt.txt`

### Step 4: Update iq-translations.ts
1. Open `server/iq-translations.ts`
2. Find the `iqTranslationsPt` object (around line 328)
3. Compare with `iqTranslationsDe` structure
4. Replace each English key with its Portuguese translation from `iq-questions-pt.txt`
5. Format: `"English question": "Portuguese translation",`

### Step 5: Verify IQ Translations Build
```bash
cd functions
npm run build
```

Fix any TypeScript errors if they appear.

---

## Part 2: Course Content Translation

### Step 6: Examine Course Content Structure
```bash
# View the English course content
cat server/content/translations/en/content.json | head -100
```

**Structure to understand:**
- JSON format with course objects
- Each course has: title, description, lessons array
- Each lesson has: title, content (HTML/markdown)

### Step 7: Extract Course Content for Translation
```bash
# Pretty-print for easier reading
cat server/content/translations/en/content.json | python3 -m json.tool > courses-en-readable.json
```

### Step 8: Count Translation Workload
```bash
# Get stats on content to translate
node -e "
const courses = require('./server/content/translations/en/content.json');
console.log('Total courses:', courses.length || Object.keys(courses).length);
let totalLessons = 0;
let totalChars = 0;
Object.values(courses).forEach(course => {
  if (course.lessons) {
    totalLessons += course.lessons.length;
    course.lessons.forEach(lesson => {
      totalChars += (lesson.content || '').length;
    });
  }
});
console.log('Total lessons:', totalLessons);
console.log('Total characters:', totalChars);
console.log('Estimated Gemini sessions needed:', Math.ceil(totalChars / 30000)); // Gemini context window consideration
"
```

### Step 9: Translate Courses in Batches with Gemini

**For each course (do one at a time):**

1. Extract one course to a file:
```bash
# Example for first course
node -e "
const courses = require('./server/content/translations/en/content.json');
const course = courses[0]; // Change index for each course
console.log(JSON.stringify(course, null, 2));
" > course-to-translate.json
```

2. Use Gemini with this prompt:

```
I need you to translate a cognitive wellness course from English to Brazilian Portuguese (pt-BR).

Translation Guidelines:
- Maintain scientific accuracy for cognitive/wellness terms
- Use warm, encouraging tone suitable for personal development
- Keep HTML tags exactly as they are (don't translate tag names)
- Preserve all formatting, links, and special characters
- Use "você" (informal you) for a friendly, personal touch

Course to translate:
[Paste content from course-to-translate.json]

Please return the complete translated JSON with the same structure.
```

3. Save each translated course to a temporary file: `course-pt-1.json`, `course-pt-2.json`, etc.

### Step 10: Combine Translated Courses
```bash
# Combine all translated courses into one JSON file
node -e "
const fs = require('fs');
const courses = [];
let i = 1;
while (fs.existsSync(\`course-pt-\${i}.json\`)) {
  courses.push(JSON.parse(fs.readFileSync(\`course-pt-\${i}.json\`, 'utf8')));
  i++;
}
fs.writeFileSync('server/content/translations/pt/content.json', JSON.stringify(courses, null, 2));
console.log('Combined', courses.length, 'courses into pt/content.json');
"
```

### Step 11: Validate Course JSON
```bash
# Verify JSON is valid
node -e "
try {
  const pt = require('./server/content/translations/pt/content.json');
  const en = require('./server/content/translations/en/content.json');
  console.log('✓ Portuguese JSON is valid');
  console.log('English courses:', en.length || Object.keys(en).length);
  console.log('Portuguese courses:', pt.length || Object.keys(pt).length);
  if (en.length === pt.length) {
    console.log('✓ Course count matches!');
  } else {
    console.log('⚠ Course count mismatch!');
  }
} catch (e) {
  console.error('✗ JSON error:', e.message);
  process.exit(1);
}
"
```

---

## Part 3: Testing & Deployment

### Step 12: Test Locally
```bash
# Build functions
cd functions
npm run build

# Check for errors
echo $?  # Should output 0 if successful
```

### Step 13: Test IQ Questions in Browser
1. Start local server: `npm run dev`
2. Navigate to `/iq-test`
3. Switch language to Portuguese (pt)
4. Start a test and verify questions appear in Portuguese
5. Check that answers are also translated

### Step 14: Test Courses in Browser
1. Navigate to `/courses`
2. Switch language to Portuguese
3. Verify course titles and descriptions are in Portuguese
4. Click into a course
5. Open a lesson and verify content is in Portuguese
6. Check that all formatting preserved correctly

### Step 15: Deploy to Production
```bash
# Commit changes
git add server/iq-translations.ts server/content/translations/pt/
git commit -m "Add Portuguese translations for IQ questions and course content"

# Push
git push origin main
```

Wait 2-3 minutes for GitHub Actions to deploy.

### Step 16: Verify in Production
1. Visit https://app2.creativewaves.me
2. Change language to Portuguese
3. Test IQ questions
4. Test course navigation and lesson content
5. Verify all translations render correctly

---

## Cleanup

### Step 17: Remove Temporary Files
```bash
# Remove translation working files
rm -f iq-questions-to-translate.txt
rm -f iq-questions-pt.txt
rm -f courses-en-readable.json
rm -f course-to-translate.json
rm -f course-pt-*.json
```

---

## Quality Checklist

Before marking complete, verify:
- [ ] All IQ questions translated (check count matches DE/FR)
- [ ] All IQ answers translated
- [ ] All course titles translated
- [ ] All course descriptions translated
- [ ] All lesson titles translated
- [ ] All lesson content translated
- [ ] HTML formatting preserved in lessons
- [ ] No broken JSON syntax
- [ ] Tested in browser (local)
- [ ] Tested in production
- [ ] No console errors when selecting Portuguese
- [ ] Professional, consistent tone across all content

---

## Troubleshooting

**Problem: JSON syntax error**
```bash
# Use a JSON validator
cat server/content/translations/pt/content.json | python3 -m json.tool
```

**Problem: Gemini output is truncated**
- Break content into smaller chunks
- Translate one lesson at a time instead of entire courses

**Problem: Special characters broken**
- Ensure you're using UTF-8 encoding
- Check for escaped characters: `\"`, `\n`, etc.

**Problem: Translations don't appear in app**
- Clear browser cache
- Check language selector is working
- Verify file path: `server/content/translations/pt/content.json`
- Check that server code loads pt translations

---

## Estimated Time

- IQ Questions: 2-3 hours (including verification)
- Course Content: 6-10 hours (depending on volume)
- Testing: 1-2 hours
- **Total: 9-15 hours**

You can do this in multiple sessions - translations are saved incrementally.
