import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BASE_URL = 'https://www.creativewaves.me/mp3files/sleep';

// Sleep sound tracks with descriptive names
// These names are designed to evoke relaxation and sleep
const sleepTracks = [
    { id: 1, nameKey: 'sleep_track_1', defaultName: 'Deep Sleep Waves' },
    { id: 2, nameKey: 'sleep_track_2', defaultName: 'Gentle Rain' },
    { id: 3, nameKey: 'sleep_track_3', defaultName: 'Ocean Lullaby' },
    { id: 4, nameKey: 'sleep_track_4', defaultName: 'Forest Night' },
    { id: 5, nameKey: 'sleep_track_5', defaultName: 'Starlight Meditation' },
    { id: 6, nameKey: 'sleep_track_6', defaultName: 'Peaceful Dreams' },
    { id: 7, nameKey: 'sleep_track_7', defaultName: 'Soft Piano Drift' },
    { id: 8, nameKey: 'sleep_track_8', defaultName: 'Nature Harmony' },
    { id: 9, nameKey: 'sleep_track_9', defaultName: 'Midnight Calm' },
    { id: 10, nameKey: 'sleep_track_10', defaultName: 'Distant Thunder' },
    { id: 11, nameKey: 'sleep_track_11', defaultName: 'River Flow' },
    { id: 12, nameKey: 'sleep_track_12', defaultName: 'Mountain Breeze' },
    { id: 13, nameKey: 'sleep_track_13', defaultName: 'Cosmic Journey' },
    { id: 14, nameKey: 'sleep_track_14', defaultName: 'Loving Kindness' },
    { id: 15, nameKey: 'sleep_track_15', defaultName: 'Dream Melodies' },
    { id: 16, nameKey: 'sleep_track_16', defaultName: 'Garden Serenity' },
    { id: 17, nameKey: 'sleep_track_17', defaultName: 'Lunar Tides' },
    { id: 18, nameKey: 'sleep_track_18', defaultName: 'Tropical Rainfall' },
    { id: 19, nameKey: 'sleep_track_19', defaultName: 'Tide Pools' },
    { id: 20, nameKey: 'sleep_track_20', defaultName: 'Whispering Wind' },
];

interface SleepSoundsPlayerProps {
    compact?: boolean;
}

export function SleepSoundsPlayer({ compact = false }: SleepSoundsPlayerProps) {
    const { t } = useLanguage();
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(70);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Get translated track name or fallback to default
    const getTrackName = (track: typeof sleepTracks[0]) => {
        return (t.sleep as any)?.[track.nameKey] || track.defaultName;
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePrevious = () => {
        const newTrack = currentTrack > 0 ? currentTrack - 1 : sleepTracks.length - 1;
        setCurrentTrack(newTrack);
        setCurrentTime(0);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleNext = () => {
        const newTrack = currentTrack < sleepTracks.length - 1 ? currentTrack + 1 : 0;
        setCurrentTrack(newTrack);
        setCurrentTime(0);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleTrackSelect = (index: number) => {
        setCurrentTrack(index);
        setCurrentTime(0);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleSeek = (value: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentTrackData = sleepTracks[currentTrack];

    return (
        <div className="w-full space-y-6">
            {/* Header - only show if not compact */}
            {!compact && (
                <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-3">
                        <Moon className="h-8 w-8 text-indigo-500" />
                        {t.sleep?.sleep_sounds_title || 'Sleep Sounds'}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        {t.sleep?.sleep_sounds_desc || 'Relaxing audio to help you fall asleep'}
                    </p>
                </div>
            )}

            {/* Main Player Card */}
            <Card className="glass-card-lg border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white">
                    <div className="text-center space-y-2">
                        <div className="text-sm opacity-80 uppercase tracking-wider font-medium">
                            {t.sleep?.now_playing || 'Now Playing'} • {currentTrack + 1} / {sleepTracks.length}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-semibold">
                            {getTrackName(currentTrackData)}
                        </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 space-y-2">
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={1}
                            onValueChange={([value]) => handleSeek(value)}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm opacity-80 font-medium">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mt-6">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handlePrevious}
                            className="h-14 w-14 rounded-full hover:bg-white/20 text-white transition-colors"
                        >
                            <SkipBack className="h-6 w-6" />
                        </Button>

                        <Button
                            size="icon"
                            onClick={togglePlay}
                            className="h-20 w-20 rounded-full bg-white text-indigo-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            {isPlaying ? (
                                <Pause className="h-8 w-8" />
                            ) : (
                                <Play className="h-8 w-8 ml-1" />
                            )}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleNext}
                            className="h-14 w-14 rounded-full hover:bg-white/20 text-white transition-colors"
                        >
                            <SkipForward className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-4 max-w-xs mx-auto mt-6 bg-white/20 p-3 rounded-full">
                        <Volume2 className="h-5 w-5 flex-shrink-0 ml-2" />
                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            onValueChange={([value]) => setVolume(value)}
                            className="flex-1 mr-2"
                        />
                    </div>

                    <audio
                        ref={audioRef}
                        src={`${BASE_URL}/${currentTrackData.id}.mp3`}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onEnded={handleNext}
                    />
                </div>
            </Card>

            {/* Track List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl md:text-2xl font-heading font-semibold">
                        {t.sleep?.all_tracks || 'All Sleep Sounds'}
                    </h3>
                    <div className="text-sm text-muted-foreground bg-white/30 px-3 py-1 rounded-full">
                        {sleepTracks.length} {t.sleep?.tracks || 'tracks'}
                    </div>
                </div>

                <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                    {sleepTracks.map((track, index) => (
                        <Button
                            key={track.id}
                            variant={currentTrack === index ? "secondary" : "ghost"}
                            className={`justify-start h-auto py-4 px-6 text-left border-0 transition-all hover-elevate ${currentTrack === index
                                ? 'glass-card bg-indigo-500/10 hover:bg-indigo-500/15'
                                : 'glass-card bg-white/40 hover:bg-white/60'
                                }`}
                            onClick={() => handleTrackSelect(index)}
                        >
                            <div className="flex items-center gap-4 w-full">
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg flex-shrink-0 transition-colors ${currentTrack === index
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white/50 text-muted-foreground'
                                    }`}>
                                    {track.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-lg font-medium truncate ${currentTrack === index ? 'text-foreground' : 'text-muted-foreground'
                                        }`}>
                                        {getTrackName(track)}
                                    </div>
                                    <div className={`text-sm font-medium truncate ${currentTrack === index ? 'text-indigo-600' : 'text-muted-foreground'
                                        }`}>
                                        {currentTrack === index
                                            ? (t.sleep?.now_playing || 'Now Playing')
                                            : (t.audio?.click_to_play || 'Click to play')}
                                    </div>
                                </div>
                                {currentTrack === index && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-4">
                                        <div className="w-1 bg-indigo-600 rounded animate-pulse" style={{ height: '100%', animationDelay: '0ms' }} />
                                        <div className="w-1 bg-indigo-600 rounded animate-pulse" style={{ height: '60%', animationDelay: '150ms' }} />
                                        <div className="w-1 bg-indigo-600 rounded animate-pulse" style={{ height: '80%', animationDelay: '300ms' }} />
                                    </div>
                                )}
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SleepSoundsPlayer;
