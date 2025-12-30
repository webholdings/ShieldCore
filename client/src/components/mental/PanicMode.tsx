import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface PanicModeProps {
    onExit: () => void;
}

export function PanicMode({ onExit }: PanicModeProps) {
    const { t } = useLanguage();
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [timer, setTimer] = useState(0);
    const [cycles, setCycles] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showExitPrompt, setShowExitPrompt] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 4-7-8 Breathing
    const PHASE_DURATIONS = {
        inhale: 4,
        hold: 7,
        exhale: 8
    };

    useEffect(() => {
        // Auto-play audio on mount
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                const newTime = prev + 0.1;
                if (newTime >= PHASE_DURATIONS[phase]) {
                    // Next phase
                    if (phase === 'inhale') setPhase('hold');
                    else if (phase === 'hold') setPhase('exhale');
                    else {
                        setPhase('inhale');
                        setCycles(c => c + 1);
                    }
                    return 0;
                }
                return newTime;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    // Show exit prompt after 3 cycles
    useEffect(() => {
        if (cycles >= 3 && !showExitPrompt) {
            setShowExitPrompt(true);
        }
    }, [cycles, showExitPrompt]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return t.breathing?.inhale || "Breathe In";
            case 'hold': return t.breathing?.hold || "Hold";
            case 'exhale': return t.breathing?.exhale || "Breathe Out";
        }
    };

    const getScale = () => {
        const progress = timer / PHASE_DURATIONS[phase];
        if (phase === 'inhale') return 1 + progress * 0.5;
        if (phase === 'hold') return 1.5;
        if (phase === 'exhale') return 1.5 - progress * 0.5;
        return 1;
    };

    const getGradient = () => {
        if (phase === 'inhale') return 'from-blue-400 to-cyan-400';
        if (phase === 'hold') return 'from-purple-400 to-indigo-400';
        return 'from-green-400 to-emerald-400';
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src="https://www.creativewaves.me/mp3files/sleep/1.mp3"
                loop
            />

            {/* Top controls */}
            <div className="absolute top-6 right-6 flex gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onExit}
                    className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Cycle counter */}
            <div className="absolute top-6 left-6 text-white/60 text-sm">
                {t.mental_health?.cycle_label || "Cycle"} {cycles + 1}
            </div>

            <div className="text-center space-y-8 max-w-md w-full">
                {/* Title - subtle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    className="text-white/70 text-lg"
                >
                    {t.mental_health?.follow_rhythm || "Follow the rhythm..."}
                </motion.p>

                {/* Main Visualizer */}
                <div className="relative h-72 w-72 mx-auto flex items-center justify-center">
                    {/* Outer glow ring */}
                    <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} blur-3xl opacity-20`}
                        animate={{ scale: getScale() * 1.2 }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                    {/* Middle ring */}
                    <motion.div
                        className={`absolute inset-8 rounded-full bg-gradient-to-br ${getGradient()} opacity-30`}
                        animate={{ scale: getScale() }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                    {/* Inner circle */}
                    <motion.div
                        className={`absolute inset-16 rounded-full bg-gradient-to-br ${getGradient()} opacity-50`}
                        animate={{ scale: getScale() * 0.9 }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                    {/* Center text */}
                    <div className="relative z-10 text-center">
                        <div className="text-4xl font-light text-white mb-2">
                            {getInstruction()}
                        </div>
                        <div className="text-6xl font-light text-white/80 font-mono">
                            {Math.ceil(PHASE_DURATIONS[phase] - timer)}
                        </div>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-3">
                    {['inhale', 'hold', 'exhale'].map((p) => (
                        <div
                            key={p}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${phase === p ? 'bg-white scale-150' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Exit button - becomes more prominent after cycles */}
                <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: showExitPrompt ? 1 : 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        onClick={onExit}
                        size="lg"
                        variant="outline"
                        className={`
                            w-full h-14 text-lg font-medium rounded-full border-2 transition-all duration-500
                            ${showExitPrompt
                                ? 'border-green-400 text-green-400 hover:bg-green-400/20'
                                : 'border-white/30 text-white/50 hover:bg-white/10'
                            }
                        `}
                    >
                        <Heart className={`mr-2 h-5 w-5 ${showExitPrompt ? 'animate-pulse' : ''}`} />
                        {t.mental_health?.im_okay || "I'm Feeling Better"}
                    </Button>
                </motion.div>

                {showExitPrompt && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400/70 text-sm"
                    >
                        {(t.mental_health?.great_job || "Great job completing {count} cycles. Ready when you are.").replace('{count}', String(cycles))}
                    </motion.p>
                )}
            </div>
        </div>
    );
}
