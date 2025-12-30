import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MANTRAS = [
    { en: "I am capable of achieving great things.", de: "Ich bin fähig, Großes zu erreichen.", fr: "Je suis capable d'accomplir de grandes choses.", pt: "Eu sou capaz de conquistar grandes coisas." },
    { en: "Every day is a fresh start.", de: "Jeder Tag ist ein neuer Anfang.", fr: "Chaque jour est un nouveau départ.", pt: "Cada dia é um novo começo." },
    { en: "I choose to be happy today.", de: "Ich wähle heute, glücklich zu sein.", fr: "Je choisis d'être heureux aujourd'hui.", pt: "Eu escolho ser feliz hoje." },
    { en: "I am strong and resilient.", de: "Ich bin stark und widerstandsfähig.", fr: "Je suis fort et résilient.", pt: "Eu sou forte e resiliente." },
    { en: "My potential is limitless.", de: "Mein Potenzial ist grenzenlos.", fr: "Mon potentiel est illimité.", pt: "Meu potencial é ilimitado." },
    { en: "I radiate positivity and joy.", de: "Ich strahle Positivität und Freude aus.", fr: "Je rayonne de positivité et de joie.", pt: "Eu irradio positividade e alegria." },
    { en: "I am grateful for this moment.", de: "Ich bin dankbar für diesen Moment.", fr: "Je suis reconnaissant pour ce moment.", pt: "Eu sou grato por este momento." },
    { en: "I believe in myself.", de: "Ich glaube an mich.", fr: "Je crois en moi.", pt: "Eu acredito em mim." },
    { en: "I am creating a life I love.", de: "Ich erschaffe ein Leben, das ich liebe.", fr: "Je crée une vie que j'aime.", pt: "Eu estou criando uma vida que amo." },
    { en: "Peace begins with me.", de: "Frieden beginnt bei mir.", fr: "La paix commence avec moi.", pt: "A paz começa comigo." },
    { en: "I am enough just as I am.", de: "Ich bin genug, so wie ich bin.", fr: "Je suis assez tel que je suis.", pt: "Eu sou suficiente como sou." },
    { en: "I embrace the journey of life.", de: "Ich umarme die Reise des Lebens.", fr: "J'embrasse le voyage de la vie.", pt: "Eu abraço a jornada da vida." },
    { en: "I am surrounded by love.", de: "Ich bin von Liebe umgeben.", fr: "Je suis entouré d'amour.", pt: "Eu estou cercado de amor." },
    { en: "My mind is calm and clear.", de: "Mein Geist ist ruhig und klar.", fr: "Mon esprit est calme et clair.", pt: "Minha mente está calma e clara." },
    { en: "I attract abundance.", de: "Ich ziehe Fülle an.", fr: "J'attire l'abondance.", pt: "Eu atraio abundância." }
];

export function DailyMantra() {
    const { language, t } = useLanguage();
    const [mantra, setMantra] = useState({ en: "", de: "", fr: "", pt: "" });

    useEffect(() => {
        // Use the date to pick a consistent mantra for the day
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const mantraIndex = dayOfYear % MANTRAS.length;
        setMantra(MANTRAS[mantraIndex]);
    }, []);

    const currentMantra = mantra[language as keyof typeof mantra] || mantra.en;

    return (
        <Card className="glass-card border-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="rounded-full bg-background/50 p-2 md:p-3 shadow-sm">
                    <Quote className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-widest mb-1 md:mb-2">
                        {t.nav.daily_mantra}
                    </h3>
                    <p className="text-base md:text-2xl font-heading font-medium italic text-foreground">
                        "{currentMantra}"
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
