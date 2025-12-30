import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JournalEditor } from "@/components/JournalEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Book, Calendar, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDateShort } from "@/lib/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Journal() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any>(null);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/journal/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
            toast({
                title: t.mood.deleted || "Deleted",
                description: "Journal entry deleted successfully.",
            });
        },
    });

    const { data: entries, isLoading } = useQuery<any[]>({
        queryKey: ["/api/journal"],
    });

    if (isEditing) {
        return (
            <div className="container mx-auto p-4 max-w-4xl h-[calc(100vh-100px)]">
                <JournalEditor
                    onClose={() => {
                        setIsEditing(false);
                        setSelectedEntry(null);
                    }}
                    initialData={selectedEntry}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">{t.journal.title}</h1>
                    <p className="text-muted-foreground">{t.journal.subtitle}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t.journal.new_entry}
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : entries?.length === 0 ? (
                <Card className="glass-card border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Book className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t.journal.no_entries}</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        {t.journal.empty_state}
                    </p>
                    <Button onClick={() => setIsEditing(true)}>{t.journal.create_first}</Button>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {entries?.map((entry: any) => {
                        const moodEmojis: Record<string, string> = {
                            happy: '😊',
                            calm: '😌',
                            anxious: '😰',
                            sad: '😢',
                            energized: '⚡',
                            angry: '😠',
                            grateful: '🥰',
                            tired: '😴',
                            confused: '😕',
                            loved: '❤️'
                        };

                        return (
                            <Card
                                key={entry.id}
                                className="glass-card hover-elevate cursor-pointer transition-all"
                                onClick={() => {
                                    setSelectedEntry(entry);
                                    setIsEditing(true);
                                }}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                {entry.mood && (
                                                    <span className="text-xl" title={entry.mood}>
                                                        {moodEmojis[entry.mood]}
                                                    </span>
                                                )}
                                                <CardTitle className="text-lg line-clamp-1">{entry.title}</CardTitle>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {formatDateShort(entry.createdAt)}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(t.common.confirm || "Are you sure?")) {
                                                    deleteMutation.mutate(entry.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {entry.content}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
