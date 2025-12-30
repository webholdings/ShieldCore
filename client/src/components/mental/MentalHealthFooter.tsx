import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Phone } from "lucide-react";

export function MentalHealthFooter() {
    const { language, t } = useLanguage();

    const getCrisisNumber = () => {
        switch (language) {
            case 'de': return "0800 111 0 111 (Telefonseelsorge)";
            case 'pt': return "213 544 545 (SOS Voz Amiga)";
            case 'fr': return "01 45 39 40 00 (Suicide Écoute)";
            default: return "988 (Suicide & Crisis Lifeline)";
        }
    };

    const getCrisisLabel = () => {
        switch (language) {
            case 'de': return "Krisenunterstützung";
            case 'pt': return "Apoio em Crise";
            case 'fr': return "Soutien de Crise";
            default: return "Crisis Support";
        }
    };

    const getDisclaimer = () => {
        switch (language) {
            case 'de': return "Diese App bietet Selbsthilfe-Tools und ersetzt keine professionelle Therapie.";
            case 'pt': return "Este aplicativo oferece ferramentas de autoajuda e não substitui a terapia profissional.";
            case 'fr': return "Cette application propose des outils d'auto-assistance et ne remplace pas une thérapie professionnelle.";
            default: return "This app offers self-help tools and does not replace professional therapy.";
        }
    };

    return (
        <div className="w-full mt-12 py-8 border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 text-center space-y-4">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm font-medium opacity-80 max-w-lg mx-auto">
                        {getDisclaimer()}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary/80">
                    <Phone className="h-4 w-4" />
                    <span>{getCrisisLabel()}: {getCrisisNumber()}</span>
                </div>
            </div>
        </div>
    );
}
