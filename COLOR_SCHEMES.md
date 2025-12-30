# CreativeWaves Color Schemes

## Light Mode Colors

### Primary Palette
- **Primary**: `hsl(42, 86%, 54%)` - Golden yellow (brand color)
- **Primary Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Secondary**: `hsl(286, 44%, 29%)` - Deep purple
- **Secondary Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Accent**: `hsl(286, 44%, 29%)` - Deep purple
- **Accent Foreground**: `hsl(0, 100%, 99%)` - Near white

### Backgrounds
- **Background**: `hsl(0, 100%, 99%)` - Off-white
- **Card**: `hsl(0, 0%, 100%)` - Pure white
- **Card Foreground**: `hsl(204, 33%, 9%)` - Very dark blue
- **Popover**: `hsl(0, 0%, 100%)` - Pure white
- **Popover Foreground**: `hsl(204, 33%, 9%)` - Very dark blue

### Text
- **Foreground**: `hsl(204, 33%, 9%)` - Very dark blue (primary text)
- **Muted**: `hsl(210, 15%, 94%)` - Light gray background
- **Muted Foreground**: `hsl(210, 15%, 35%)` - Medium gray text

### Interactive Elements
- **Confirm** (Green Gradient): `hsl(142, 71%, 45%)` - Medium green
- **Confirm Foreground**: `hsl(0, 0%, 100%)` - Pure white
- **Destructive**: `hsl(0, 72%, 51%)` - Red
- **Destructive Foreground**: `hsl(0, 0%, 98%)` - Near white

### Borders
- **Border**: `hsl(210, 20%, 88%)` - Light gray
- **Card Border**: `hsl(210, 15%, 92%)` - Very light gray
- **Popover Border**: `hsl(210, 15%, 92%)` - Very light gray
- **Input**: `hsl(210, 20%, 75%)` - Medium gray

### Sidebar
- **Sidebar**: `hsl(0, 10%, 97%)` - Very light warm gray
- **Sidebar Foreground**: `hsl(204, 33%, 9%)` - Very dark blue
- **Sidebar Border**: `hsl(210, 15%, 90%)` - Light gray
- **Sidebar Primary**: `hsl(42, 86%, 54%)` - Golden yellow
- **Sidebar Primary Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Sidebar Accent**: `hsl(210, 15%, 92%)` - Very light gray
- **Sidebar Accent Foreground**: `hsl(204, 33%, 12%)` - Dark blue

### Charts
- **Chart 1**: `hsl(42, 86%, 54%)` - Golden yellow
- **Chart 2**: `hsl(286, 44%, 50%)` - Purple
- **Chart 3**: `hsl(200, 70%, 50%)` - Blue
- **Chart 4**: `hsl(270, 50%, 55%)` - Violet
- **Chart 5**: `hsl(30, 75%, 60%)` - Orange

---

## Dark Mode Colors

### Primary Palette
- **Primary**: `hsl(42, 86%, 54%)` - Golden yellow (brand color)
- **Primary Foreground**: `hsl(204, 33%, 9%)` - Very dark blue
- **Secondary**: `hsl(286, 44%, 45%)` - Lighter purple
- **Secondary Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Accent**: `hsl(286, 44%, 45%)` - Lighter purple
- **Accent Foreground**: `hsl(0, 100%, 99%)` - Near white

### Backgrounds
- **Background**: `hsl(204, 33%, 9%)` - Very dark blue
- **Card**: `hsl(210, 23%, 13%)` - Dark blue-gray
- **Card Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Popover**: `hsl(210, 23%, 13%)` - Dark blue-gray
- **Popover Foreground**: `hsl(0, 100%, 99%)` - Near white

### Text
- **Foreground**: `hsl(0, 100%, 99%)` - Near white (primary text)
- **Muted**: `hsl(210, 23%, 18%)` - Dark gray background
- **Muted Foreground**: `hsl(0, 0%, 65%)` - Light gray text

### Interactive Elements
- **Confirm** (Green Gradient): `hsl(142, 71%, 48%)` - Brighter green for dark mode
- **Confirm Foreground**: `hsl(0, 0%, 100%)` - Pure white
- **Destructive**: `hsl(0, 72%, 51%)` - Red
- **Destructive Foreground**: `hsl(0, 0%, 98%)` - Near white

### Borders
- **Border**: `hsl(210, 23%, 20%)` - Dark gray
- **Card Border**: `hsl(210, 23%, 18%)` - Darker gray
- **Popover Border**: `hsl(210, 23%, 20%)` - Dark gray
- **Input**: `hsl(210, 23%, 25%)` - Medium dark gray

### Sidebar
- **Sidebar**: `hsl(204, 33%, 11%)` - Very dark blue
- **Sidebar Foreground**: `hsl(0, 100%, 99%)` - Near white
- **Sidebar Border**: `hsl(210, 23%, 16%)` - Dark gray
- **Sidebar Primary**: `hsl(42, 86%, 54%)` - Golden yellow
- **Sidebar Primary Foreground**: `hsl(204, 33%, 9%)` - Very dark blue
- **Sidebar Accent**: `hsl(210, 23%, 18%)` - Dark gray
- **Sidebar Accent Foreground**: `hsl(0, 0%, 90%)` - Light gray

### Charts
- **Chart 1**: `hsl(42, 86%, 54%)` - Golden yellow
- **Chart 2**: `hsl(286, 44%, 50%)` - Purple
- **Chart 3**: `hsl(200, 70%, 50%)` - Blue
- **Chart 4**: `hsl(270, 50%, 55%)` - Violet
- **Chart 5**: `hsl(30, 75%, 60%)` - Orange

---

## Elevation System

### Light Mode
- **Button Outline**: `rgba(0, 0, 0, 0.10)`
- **Badge Outline**: `rgba(0, 0, 0, 0.05)`
- **Elevate 1** (hover): `rgba(0, 0, 0, 0.03)`
- **Elevate 2** (active): `rgba(0, 0, 0, 0.08)`
- **Border Intensity**: `-8%` (darkens colors for borders)

### Dark Mode
- **Button Outline**: `rgba(255, 255, 255, 0.10)`
- **Badge Outline**: `rgba(255, 255, 255, 0.05)`
- **Elevate 1** (hover): `rgba(255, 255, 255, 0.04)`
- **Elevate 2** (active): `rgba(255, 255, 255, 0.09)`
- **Border Intensity**: `+9%` (lightens colors for borders)

---

## Shadow System

### Light Mode Shadows
```css
--shadow-2xs: 0px 1px 2px 0px hsl(220 15% 12% / 0.05)
--shadow-xs: 0px 1px 3px 0px hsl(220 15% 12% / 0.08)
--shadow-sm: 0px 2px 4px 0px hsl(220 15% 12% / 0.06), 0px 1px 2px -1px hsl(220 15% 12% / 0.06)
--shadow: 0px 4px 6px -1px hsl(220 15% 12% / 0.08), 0px 2px 4px -1px hsl(220 15% 12% / 0.06)
--shadow-md: 0px 6px 12px -2px hsl(220 15% 12% / 0.10), 0px 3px 6px -2px hsl(220 15% 12% / 0.08)
--shadow-lg: 0px 10px 20px -4px hsl(220 15% 12% / 0.12), 0px 6px 12px -4px hsl(220 15% 12% / 0.10)
--shadow-xl: 0px 20px 30px -8px hsl(220 15% 12% / 0.16), 0px 12px 20px -6px hsl(220 15% 12% / 0.12)
--shadow-2xl: 0px 30px 50px -12px hsl(220 15% 12% / 0.20)
```

### Dark Mode Shadows
```css
--shadow-2xs: 0px 1px 2px 0px hsl(0 0% 0% / 0.15)
--shadow-xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.20)
--shadow-sm: 0px 2px 4px 0px hsl(0 0% 0% / 0.18), 0px 1px 2px -1px hsl(0 0% 0% / 0.18)
--shadow: 0px 4px 6px -1px hsl(0 0% 0% / 0.22), 0px 2px 4px -1px hsl(0 0% 0% / 0.18)
--shadow-md: 0px 6px 12px -2px hsl(0 0% 0% / 0.26), 0px 3px 6px -2px hsl(0 0% 0% / 0.22)
--shadow-lg: 0px 10px 20px -4px hsl(0 0% 0% / 0.30), 0px 6px 12px -4px hsl(0 0% 0% / 0.26)
--shadow-xl: 0px 20px 30px -8px hsl(0 0% 0% / 0.35), 0px 12px 20px -6px hsl(0 0% 0% / 0.30)
--shadow-2xl: 0px 30px 50px -12px hsl(0 0% 0% / 0.40)
```

---

## Typography
- **Font Sans**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Font Serif**: Georgia, serif
- **Font Mono**: Menlo, monospace

## Border Radius
- **Default**: `0.5rem` (8px)

## Usage Notes

1. **Primary Color (Golden Yellow)**: Used for main CTAs, brand elements, and focus states
2. **Secondary/Accent (Purple)**: Used for secondary actions and accent elements
3. **Confirm (Green)**: Used for all confirmation actions (Login, Submit, Save, etc.)
4. **Destructive (Red)**: Used for delete/cancel actions
5. **Muted Colors**: Used for less important information and disabled states
6. **Automatic Border Computation**: Borders are automatically darkened/lightened based on the button background color using CSS `color-mix()` function
