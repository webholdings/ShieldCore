# CreativeWaves - Design Guidelines

## Design Approach: Material Design with Accessibility Enhancement

**Selected Framework**: Material Design 3 with significant accessibility adaptations for senior users

**Core Principles**:
- Therapeutic & Calming: Audio wellness focus requires soothing, non-distracting interface
- Maximum Accessibility: Large touch targets, high contrast, clear visual hierarchy
- Functional Clarity: Every element serves a purpose, minimal cognitive load
- Multilingual Ready: Flexible layouts accommodating varying text lengths across languages

---

## Color Palette

**Primary Colors (Dark Mode)**:
- Background: 220 15% 12% (deep blue-gray)
- Surface: 220 15% 18% (elevated surface)
- Primary Accent: 200 70% 55% (calming blue - audio controls)
- Primary Hover: 200 70% 65%

**Primary Colors (Light Mode)**:
- Background: 210 30% 98% (soft white)
- Surface: 0 0% 100% (white cards)
- Primary Accent: 200 80% 45% (deeper calming blue)
- Primary Hover: 200 80% 55%

**Semantic Colors**:
- Success (Game completion): 140 60% 50%
- Warning (Mood tracking): 35 80% 60%
- Info (Audio playback): 200 70% 55%
- Mood Colors: Happy (50 75% 60%), Calm (200 60% 65%), Anxious (35 70% 60%), Sad (220 30% 50%), Energized (280 65% 60%)

**Text Colors (Dark)**:
- Primary: 0 0% 95%
- Secondary: 0 0% 70%
- Tertiary: 0 0% 50%

**Text Colors (Light)**:
- Primary: 220 20% 15%
- Secondary: 220 15% 40%
- Tertiary: 220 10% 55%

---

## Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - excellent readability, modern
- Secondary: 'DM Sans' (Google Fonts) - friendly, approachable for headings

**Scale for Senior Accessibility**:
- Hero Heading: text-5xl md:text-6xl (60-72px) - App title, main headings
- Section Heading: text-3xl md:text-4xl (36-48px) - Section titles
- Card Heading: text-2xl md:text-3xl (30-36px) - Audio track titles, game names
- Body Large: text-xl md:text-2xl (20-24px) - Primary content, buttons
- Body: text-lg md:text-xl (18-20px) - Secondary content
- Caption: text-base md:text-lg (16-18px) - Metadata, timestamps

**Font Weights**:
- Bold (700): Headings, active states
- Semibold (600): Subheadings, important labels
- Medium (500): Body text, buttons
- Regular (400): Secondary text

---

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20 (large touch-friendly spacing)

**Container Strategy**:
- Max width: max-w-6xl (suitable for focused content)
- Section padding: py-16 md:py-24 (generous vertical breathing room)
- Card padding: p-8 md:p-12 (extra-large for senior-friendly touch targets)
- Component gaps: gap-6 md:gap-8 (clear visual separation)

**Touch Target Minimums**:
- Buttons: min-h-14 md:min-h-16 (56-64px minimum)
- Interactive cards: min-h-20 (80px minimum)
- Audio controls: min-w-16 min-h-16 (64px × 64px)

---

## Component Library

### Audio Player (Hero Component)
- **Layout**: Full-width card with elevated surface (shadow-xl)
- **Track Display**: Large album-style card with current track title (text-2xl), waveform visualization
- **Controls**: Extra-large play/pause (80px), skip buttons (64px), volume slider with large thumb
- **Playlist**: Scrollable list with numbered tracks, duration, large touch areas
- **Progress**: Thick progress bar (h-2), large draggable thumb, time display (text-xl)

### Mood Tracker
- **Daily Entry**: 5 large emotion cards (w-20 h-20 each) with icon + label, subtle hover scale
- **Visual**: Soft emoji-style emotion icons, selected state with primary accent ring
- **Notes**: Optional textarea with placeholder, large text input (text-lg)
- **Calendar View**: Monthly grid with color-coded emotion indicators, click to view details

### Brain Games
- **Memory Cards**: Large flip cards (min 120px × 120px), clear imagery/icons
- **Pattern Sequence**: Animated sequence display, large replay button, clear visual feedback
- **Word Association**: Card-based interface, large text (text-2xl), simple tap/click interaction
- **Shared Elements**: Progress indicator, timer (if needed, large display), completion celebration animation

### Navigation
- **Top Bar**: App logo/name (text-2xl), language switcher (flag icons + dropdown), user profile icon
- **Bottom Nav** (PWA): 4 large icons - Home (Audio), Games, Mood, Profile (min-h-16 each)
- **Sidebar** (Desktop): Vertical nav with icons + labels, current section highlighted

### Forms & Inputs
- **Input Fields**: Large height (min-h-14), clear labels (text-lg), prominent focus states
- **Buttons**: Primary (filled), Secondary (outlined with blur on images), large padding (px-8 py-4)
- **Language Switcher**: Dropdown with flag icons, current language clearly indicated

---

## Images

**Hero Section**:
- **Main Landing**: Large hero image (60% viewport height) showing serene meditation/wellness scene (elderly person with headphones in peaceful setting, soft natural lighting)
- **Treatment**: Subtle gradient overlay (top to bottom, opacity 40%) for text legibility
- **Placement**: Top of homepage, audio player overlaid on lower third

**Game Sections**:
- **Memory Game**: Colorful, high-contrast card backs with simple geometric patterns
- **Icons**: Large, clear icons for each game type (brain, lightbulb, puzzle pieces)

**Mood Tracker**:
- **Emotion Icons**: Simplified, friendly emoji-style illustrations (happy face, calm waves, etc.)
- **Background**: Subtle, calming nature textures for mood history view

**General**:
- All images: High contrast, simple compositions, avoid visual clutter
- No hero image on game/mood tracker pages - focus on functionality

---

## Animations

**Minimal & Purposeful Only**:
- Audio visualization: Gentle waveform animation during playback
- Mood selection: Subtle scale transform (scale-105) on hover/tap
- Game feedback: Brief success/error state animations (green checkmark, red shake)
- Page transitions: Simple fade (150ms duration)
- NO scroll-triggered animations - keep interface stable for seniors

---

## Accessibility & PWA

**Contrast Requirements**: WCAG AAA (7:1 for normal text, 4.5:1 for large)
**Focus Indicators**: Thick (3px) primary accent outline on all interactive elements
**Offline Support**: Cached audio files, games functional offline, clear offline/online status
**Install Prompt**: Prominent "Add to Home Screen" button on first visit
**Screen Reader**: Semantic HTML, comprehensive ARIA labels, skip links