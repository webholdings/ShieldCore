import { useQuery } from "@tanstack/react-query";
import { Addiction } from "@shared/schema";
import { AddictionCard } from "@/components/addiction/AddictionCard";
import { AddTrackerDialog } from "@/components/addiction/AddTrackerDialog";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Heart, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddictionRecovery() {
    const { t } = useLanguage();
    const { data: addictions, isLoading } = useQuery<Addiction[]>({
        queryKey: ["/api/addictions"],
    });

    if (isLoading) {
        return <div className="p-8 text-center">{t.recovery.loading}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t.recovery.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t.recovery.subtitle}
                    </p>
                </div>
                <AddTrackerDialog />
            </div>

            {addictions && addictions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addictions.map((addiction) => (
                        <AddictionCard key={addiction.id} addiction={addiction} />
                    ))}
                </div>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <ShieldCheck className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t.recovery.start_journey}</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            {t.recovery.journey_quote}
                        </p>
                        <AddTrackerDialog />
                    </CardContent>
                </Card>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Brain className="h-8 w-8 text-blue-500 mb-3" />
                        <h3 className="font-semibold mb-2">{t.recovery.rewire_title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t.recovery.rewire_desc}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-900/20 border-none">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <ShieldCheck className="h-8 w-8 text-green-500 mb-3" />
                        <h3 className="font-semibold mb-2">{t.recovery.track_title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t.recovery.track_desc}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Heart className="h-8 w-8 text-purple-500 mb-3" />
                        <h3 className="font-semibold mb-2">{t.recovery.kind_title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t.recovery.kind_desc}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
