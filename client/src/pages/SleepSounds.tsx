import { SleepSoundsPlayer } from "@/components/SleepSoundsPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SleepSounds() {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl min-h-[80vh] flex flex-col">
            <div className="mb-6">
                <Link href="/sleep">
                    <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                        {t.common?.back || "Back to Sleep Hub"}
                    </Button>
                </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">
                    <SleepSoundsPlayer />
                </div>
            </div>
        </div>
    );
}
