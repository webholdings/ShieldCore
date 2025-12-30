import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/use-auth';

// Express audio tracks with colors matching the screenshot
const expressTracksConfig = [
    { id: 'WEALTH', color: 'from-emerald-500 to-emerald-600', labelKey: 'wealth' },
    { id: 'CREATIVITY', color: 'from-orange-500 to-orange-600', labelKey: 'creativity' },
    { id: 'LOVE', color: 'from-pink-500 to-pink-600', labelKey: 'love' },
    { id: 'POWER', color: 'from-blue-500 to-blue-600', labelKey: 'power' },
    { id: 'HEALTH', color: 'from-emerald-500 to-emerald-600', labelKey: 'health' },
    { id: 'WEIGHT', color: 'from-purple-500 to-purple-600', labelKey: 'weight' },
    { id: 'SMOKING', color: 'from-red-500 to-red-600', labelKey: 'smoking' },
    { id: 'FRIENDS', color: 'from-teal-500 to-teal-600', labelKey: 'friends' },
];

const BASE_URL = 'https://www.creativewaves.me/upgrademp3files/';

export default function ExpressPlayer() {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(70);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Get localized track labels
    const getTrackLabel = (trackId: string): string => {
        const labels: Record<string, Record<string, string>> = {
            WEALTH: { en: 'Wealth', de: 'Wohlstand', fr: 'Richesse', pt: 'Riqueza' },
            CREATIVITY: { en: 'Creativity', de: 'Kreativität', fr: 'Créativité', pt: 'Criatividade' },
            LOVE: { en: 'Love', de: 'Liebe', fr: 'Amour', pt: 'Amor' },
            POWER: { en: 'Power', de: 'Kraft', fr: 'Pouvoir', pt: 'Poder' },
            HEALTH: { en: 'Health', de: 'Gesundheit', fr: 'Santé', pt: 'Saúde' },
            WEIGHT: { en: 'Weight', de: 'Gewicht', fr: 'Poids', pt: 'Peso' },
            SMOKING: { en: 'Quit Smoking', de: 'Rauchen Aufhören', fr: 'Arrêter de Fumer', pt: 'Parar de Fumar' },
            FRIENDS: { en: 'Friendship', de: 'Freundschaften', fr: 'Amitié', pt: 'Amizade' },
        };
        return labels[trackId]?.[language] || labels[trackId]?.en || trackId;
    };

    // Determine if user has access
    // Determine if user has access
    // Existing users (createdAt before feature launch) get access automatically
    // New users need expressUpgradeEnabled = true
    const featureLaunchDate = new Date('2025-12-14'); // Users created before this date get automatic access

    // Robust date parsing to handle Firestore Timestamps, strings, or Date objects
    const getUserCreationDate = (createdAt: any) => {
        if (!createdAt) return null;
        if (createdAt instanceof Date) return createdAt;
        if (typeof createdAt === 'string') return new Date(createdAt);
        // Handle Firestore Timestamp { _seconds, _nanoseconds }
        if (typeof createdAt === 'object' && '_seconds' in createdAt) {
            return new Date(createdAt._seconds * 1000);
        }
        return new Date(createdAt);
    };

    const creationDate = getUserCreationDate(user?.createdAt);
    const isExistingUser = creationDate ? creationDate < featureLaunchDate : true;

    // Admin override for testing
    const isAdmin = user?.email === 'ricdes@gmail.com';

    const hasAccess = isExistingUser || user?.expressUpgradeEnabled === true || isAdmin;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleTrackSelect = (trackId: string) => {
        if (!hasAccess) return;

        setSelectedTrack(trackId);
        setCurrentTime(0);

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const togglePlay = () => {
        if (!audioRef.current || !selectedTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    // Localized titles
    const pageTitle: Record<string, string> = {
        en: 'CreativeWaves Express',
        de: 'CreativeWaves Express',
        fr: 'CreativeWaves Express',
        pt: 'CreativeWaves Express',
    };

    const pageSubtitle: Record<string, string> = {
        en: 'Subliminal audio sessions for rapid transformation',
        de: 'Subliminale Audiositzungen für schnelle Transformation',
        fr: 'Sessions audio subliminales pour une transformation rapide',
        pt: 'Sessões de áudio subliminar para transformação rápida',
    };

    const selectTrackText: Record<string, string> = {
        en: 'Select a track to begin',
        de: 'Wähle einen Track aus',
        fr: 'Sélectionnez une piste pour commencer',
        pt: 'Selecione uma faixa para começar',
    };

    const nowPlayingText: Record<string, string> = {
        en: 'Now Playing',
        de: 'Wird abgespielt',
        fr: 'Lecture en cours',
        pt: 'Reproduzindo agora',
    };

    const lockedTitle: Record<string, string> = {
        en: 'Express Upgrade Required',
        de: 'Express-Upgrade Erforderlich',
        fr: 'Mise à niveau Express requise',
        pt: 'Atualização Express necessária',
    };

    const lockedDescription: Record<string, string> = {
        en: 'This premium feature is available with the Express Upgrade. Contact support to unlock.',
        de: 'Diese Premium-Funktion ist mit dem Express-Upgrade verfügbar. Kontaktieren Sie den Support zum Freischalten.',
        fr: 'Cette fonctionnalité premium est disponible avec la mise à niveau Express. Contactez le support pour débloquer.',
        pt: 'Este recurso premium está disponível com a atualização Express. Entre em contato com o suporte para desbloquear.',
    };

    if (!hasAccess) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold">{pageTitle[language]}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground">{pageSubtitle[language]}</p>
                </div>

                <Card className="glass-card-lg border-0 shadow-xl">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Lock className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-heading font-semibold">{lockedTitle[language]}</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {lockedDescription[language]}
                        </p>
                    </CardContent>
                </Card>

                {/* Preview grid (greyed out) */}
                <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
                    {expressTracksConfig.map((track) => (
                        <div
                            key={track.id}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${track.color} text-white text-center`}
                        >
                            <div className="font-bold text-lg uppercase">{getTrackLabel(track.id)}</div>
                            <div className="text-sm opacity-80">({track.id})</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Premium</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold">{pageTitle[language]}</h2>
                <p className="text-lg md:text-xl text-muted-foreground">{pageSubtitle[language]}</p>
            </div>

            {/* Player Card */}
            {selectedTrack && (
                <Card className="glass-card-lg border-0 shadow-xl">
                    <CardContent className="p-8 md:p-12 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                                {nowPlayingText[language]}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
                                {getTrackLabel(selectedTrack)}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={1}
                                onValueChange={handleSeek}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground font-medium">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <Button
                                size="icon"
                                variant="default"
                                onClick={togglePlay}
                                className="h-20 w-20 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                {isPlaying ? (
                                    <Pause className="h-8 w-8" />
                                ) : (
                                    <Play className="h-8 w-8 ml-1" />
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 max-w-xs mx-auto bg-white/30 p-3 rounded-full backdrop-blur-sm">
                            <Volume2 className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
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
                            src={`${BASE_URL}${selectedTrack}.mp3`}
                            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                            onEnded={() => setIsPlaying(false)}
                        />
                    </CardContent>
                </Card>
            )}

            {!selectedTrack && (
                <Card className="glass-card border-0">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">{selectTrackText[language]}</p>
                    </CardContent>
                </Card>
            )}

            {/* Track Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
                {expressTracksConfig.map((track) => (
                    <button
                        key={track.id}
                        onClick={() => handleTrackSelect(track.id)}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${track.color} text-white text-center transition-all hover:scale-105 hover:shadow-xl cursor-pointer ${selectedTrack === track.id ? 'ring-4 ring-white/50 shadow-2xl scale-105' : ''
                            }`}
                    >
                        <div className="font-bold text-lg uppercase">{getTrackLabel(track.id)}</div>
                        <div className="text-sm opacity-80">({track.id})</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
