
export const getSleepProgramContent = (t: any) => ({
    1: {
        title: t.sleep?.day1_title || "Sleep Assessment",
        focus: t.sleep?.day1_focus || "Establish your baseline by logging tonight's sleep honestly.",
        protocol: t.sleep?.day1_protocol || "Go to bed only when sleepy. Set a fixed wake time and stick to it.",
        exercise: t.sleep?.day1_exercise || "Calculate your sleep window: Average sleep hours + 30 min = time in bed."
    },
    2: {
        title: t.sleep?.day2_title || "Sleep Restriction",
        focus: t.sleep?.day2_focus || "If efficiency < 85%, reduce time in bed to match actual sleep time.",
        protocol: t.sleep?.day2_protocol || "Set a fixed wake time. Only go to bed when truly sleepy. No naps.",
        exercise: t.sleep?.day2_exercise || "Create your new sleep schedule based on yesterday's data."
    },
    3: {
        title: t.sleep?.day3_title || "Stimulus Control",
        focus: t.sleep?.day3_focus || "Strengthen the bed-sleep connection.",
        protocol: t.sleep?.day3_protocol || "Use bed only for sleep. If awake > 20 min, get up and do something calm.",
        exercise: t.sleep?.day3_exercise || "Remove all screens and work materials from the bedroom."
    },
    4: {
        title: t.sleep?.day4_title || "Relaxation Training",
        focus: t.sleep?.day4_focus || "Practice pre-sleep relaxation techniques.",
        protocol: t.sleep?.day4_protocol || "Do the breathing exercise 30 minutes before bed.",
        exercise: t.sleep?.day4_exercise || "4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s. Repeat 4x."
    },
    5: {
        title: t.sleep?.day5_title || "Cognitive Restructuring",
        focus: t.sleep?.day5_focus || "Challenge negative thoughts about sleep.",
        protocol: t.sleep?.day5_protocol || "Replace 'I must get 8 hours' with 'My body will get what it needs'.",
        exercise: t.sleep?.day5_exercise || "Write down 3 sleep worries and reframe them positively."
    },
    6: {
        title: t.sleep?.day6_title || "Sleep Hygiene",
        focus: t.sleep?.day6_focus || "Optimize your sleep environment and habits.",
        protocol: t.sleep?.day6_protocol || "Keep bedroom cool (16-19°C), dark, and quiet. No caffeine after 2pm.",
        exercise: t.sleep?.day6_exercise || "Create a 30-minute wind-down routine to do every night."
    },
    7: {
        title: t.sleep?.day7_title || "Integration & Maintenance",
        focus: t.sleep?.day7_focus || "Review your progress and create a sustainable plan.",
        protocol: t.sleep?.day7_protocol || "Gradually extend sleep window if efficiency > 90% for 5+ days.",
        exercise: t.sleep?.day7_exercise || "Write your personal sleep rules to follow going forward."
    }
});
