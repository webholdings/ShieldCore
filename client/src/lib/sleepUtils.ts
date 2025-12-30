
import { SleepEntry } from '@shared/schema';

// Helper to format time HH:mm
export const formatTime = (time: string) => time || '--:--';

// Sleep Cycle Calculator (90 min cycles)
export const calculateBedtimes = (wakeTime: string): string[] => {
    if (!wakeTime) return [];
    const [h, m] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    // Calculate for 5 and 6 cycles (7.5h and 9h sleep)
    const cycles = [5, 6];
    const bedtimes = cycles.map(c => {
        const d = new Date(wakeDate.getTime() - (c * 90 + 15) * 60000); // 15 min to fall asleep
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    });
    return bedtimes.reverse(); // Earliest first (9h then 7.5h)
};

// Calculate sleep efficiency: (sleep time / time in bed) * 100
export const calculateEfficiency = (
    bedtime: string,
    wakeTime: string,
    sleepOnsetMinutes: number,
    awakeningsMinutes: number
): number => {
    if (!bedtime || !wakeTime) return 0;

    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    // Calculate time in bed (minutes)
    let timeInBed = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
    if (timeInBed < 0) timeInBed += 24 * 60; // Handle overnight sleep

    // Calculate actual sleep time
    const sleepTime = timeInBed - sleepOnsetMinutes - awakeningsMinutes;

    if (timeInBed <= 0) return 0;
    return Math.round((sleepTime / timeInBed) * 100);
};

// Get heuristic AI coach advice based on sleep patterns
export const getCoachAdvice = (efficiency: number, entries: SleepEntry[], t: any): string => {
    if (entries.length === 0) {
        return t.sleep?.coach_start || "Start logging your sleep to receive personalized advice!";
    }

    if (efficiency >= 85) {
        return t.sleep?.coach_excellent || "Excellent sleep efficiency! Keep maintaining your consistent sleep schedule.";
    } else if (efficiency >= 75) {
        return t.sleep?.coach_good || "Good progress! Try to reduce time awake in bed by going to bed only when sleepy.";
    } else if (efficiency >= 60) {
        return t.sleep?.coach_improve || "Your sleep can improve. Consider limiting caffeine after 2pm and establishing a relaxing pre-sleep routine.";
    } else {
        return t.sleep?.coach_attention || "Your sleep needs attention. Try sleep restriction - go to bed later and wake at the same time daily.";
    }
};

// Helper to get chronotype details
export const getChronotypes = (t: any) => ({
    bear: {
        title: t.sleep?.bear_title || "The Bear",
        desc: t.sleep?.bear_desc || "You follow the sun. Best sleep: 11pm - 7am. Most productive: mid-morning.",
        icon: "🐻"
    },
    wolf: {
        title: t.sleep?.wolf_title || "The Wolf",
        desc: t.sleep?.wolf_desc || "Night owl. Best sleep: 12am - 8am+. Most productive: late afternoon/evening.",
        icon: "🐺"
    },
    lion: {
        title: t.sleep?.lion_title || "The Lion",
        desc: t.sleep?.lion_desc || "Early riser. Best sleep: 10pm - 6am. Most productive: early morning.",
        icon: "🦁"
    },
    dolphin: {
        title: t.sleep?.dolphin_title || "The Dolphin",
        desc: t.sleep?.dolphin_desc || "Light sleeper/Insomniac. Irregular schedule. Best Productive bursts.",
        icon: "🐬"
    }
});
