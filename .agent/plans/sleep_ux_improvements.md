# Sleep Module UX/Usability Improvements Plan

## Objective
Elevate the Visual Experience and Usability of the Sleep Module to match "Premium" standards, focusing on interactivity, visual feedback, and ease of use.

## 1. Visual Polish & "Wow" Factor
- **Circular Progress for Efficiency**: Replace the simple percentage text in "Sleep Efficiency" with a large, animated Circular Progress Ring (similar to fitness rings).
- **Entry Animations**: Implement `framer-motion` to stagger the appearance of cards when opening the dashboard or switching tabs.
- **Dynamic Backgrounds**: Subtle background gradients that shift slightly based on "Sleep" vs "Wake" mode (implied by time of day, though we might just stick to the current nice gradients for consistency).

## 2. Sleep Diary Form UX
- **Sliders for Estimations**: Replace numeric inputs for "Time to fall asleep" and "Number of awakenings" with smooth sliders. This feels less like a "form" and more like an "adjustment".
- **Visual Feedback**: Add a distinct "Success" animation when a log is saved (e.g., a checkmark morphing in).

## 3. 7-Day Program Visualization
- **Locked State Indicators**: Clearly show future days as "Locked" with a lock icon, increasing the gamification feel (unlocking progress).
- **Pulse Effect**: Enhance the "Current Day" pulse effect to be more inviting.

## 4. Mobile Responsiveness
- **Tab Scroll**: Ensure the main Tabs list is horizontally scrollable on small screens if it gets too cramped.
- **Touch Targets**: Ensure sliders and buttons have large touch targets.

## Implementation Checklist
- [ ] Install `recharts` or use existing SVG logic for Circular Progress.
- [ ] Refactor `SleepDashboard.tsx` "Insights" tab to use the new Circular/Radial Chart.
- [ ] Update `SleepDashboard.tsx` "Log" tab to use `Slider` component (need to check if we have it in `components/ui/slider`, if not, create it).
- [ ] Add `framer-motion` to `SleepDashboard.tsx` for layout transitions.
- [ ] Add "Lock" icons to the Day Progress strip.

## Questions for User
- Do you prefer a specific style for the Circular Progress (e.g., solid ring, segmented)?
- Should we add a specific "Night Mode" toggle that simplifies the UI for late-night usage (reducing blue light)?
