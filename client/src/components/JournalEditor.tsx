import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, X, Bold, Italic, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface JournalEditorProps {
    onClose: () => void;
    initialData?: {
        id?: string;
        title: string;
        content: string;
        mood?: string;
        tags?: string[];
    };
}

export function JournalEditor({ onClose, initialData }: JournalEditorProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [mood, setMood] = useState(initialData?.mood || "");

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            if (initialData?.id) {
                return apiRequest("PATCH", `/api/journal/${initialData.id}`, data);
            } else {
                return apiRequest("POST", "/api/journal", data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
            toast({
                title: t.journal?.entry_saved || t.common?.saved || "Saved",
                description: t.journal?.entry_saved_desc || "Journal entry saved successfully.",
            });
            onClose();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: t.common?.error || "Error",
                description: error.message,
            });
        },
    });

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            toast({
                variant: "destructive",
                title: t.journal?.validation_error || "Validation Error",
                description: t.journal?.validation_desc || "Title and content are required.",
            });
            return;
        }
        saveMutation.mutate({ title, content, mood });
    };

    return (
        <Card className="glass-card-lg border-0 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{initialData?.id ? t.journal?.edit_entry : t.journal?.new_entry}</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <Input
                    placeholder={t.journal?.title_placeholder || "Title"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold bg-white/50"
                />

                {/* Optional Mood Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        {t.mood?.title} (optional)
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { value: 'happy', emoji: '😊', color: 'bg-chart-5/10 border-chart-5 text-chart-5' },
                            { value: 'calm', emoji: '😌', color: 'bg-chart-1/10 border-chart-1 text-chart-1' },
                            { value: 'anxious', emoji: '😰', color: 'bg-chart-3/10 border-chart-3 text-chart-3' },
                            { value: 'sad', emoji: '😢', color: 'bg-chart-4/10 border-chart-4 text-chart-4' },
                            { value: 'energized', emoji: '⚡', color: 'bg-chart-2/10 border-chart-2 text-chart-2' },
                            { value: 'angry', emoji: '😠', color: 'bg-red-500/10 border-red-500 text-red-500' },
                            { value: 'grateful', emoji: '🥰', color: 'bg-pink-500/10 border-pink-500 text-pink-500' },
                            { value: 'tired', emoji: '😴', color: 'bg-slate-500/10 border-slate-500 text-slate-500' },
                            { value: 'confused', emoji: '😕', color: 'bg-orange-500/10 border-orange-500 text-orange-500' },
                            { value: 'loved', emoji: '❤️', color: 'bg-rose-500/10 border-rose-500 text-rose-500' },
                        ].map((m) => (
                            <button
                                key={m.value}
                                type="button"
                                onClick={() => setMood(mood === m.value ? '' : m.value)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${mood === m.value
                                    ? `${m.color} scale-105 shadow-md`
                                    : 'bg-muted/20 border-transparent hover:scale-105'
                                    }`}
                            >
                                <span className="text-2xl">{m.emoji}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col border rounded-md overflow-hidden bg-white/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                const textarea = document.querySelector('textarea');
                                if (!textarea) return;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = textarea.value;
                                const before = text.substring(0, start);
                                const selection = text.substring(start, end);
                                const after = text.substring(end);
                                setContent(`${before}**${selection || 'bold'}**${after}`);
                                setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 2, end + 2 + (selection ? 0 : 4));
                                }, 0);
                            }}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                const textarea = document.querySelector('textarea');
                                if (!textarea) return;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = textarea.value;
                                const before = text.substring(0, start);
                                const selection = text.substring(start, end);
                                const after = text.substring(end);
                                setContent(`${before}_${selection || 'italic'}_${after}`);
                                setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 1, end + 1 + (selection ? 0 : 6));
                                }, 0);
                            }}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                const textarea = document.querySelector('textarea');
                                if (!textarea) return;
                                const start = textarea.selectionStart;
                                const text = textarea.value;
                                const before = text.substring(0, start);
                                const after = text.substring(start);
                                setContent(`${before}\n- ${after}`);
                                setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 3, start + 3);
                                }, 0);
                            }}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Textarea
                        placeholder={t.journal?.content_placeholder || "Write your thoughts..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 resize-none border-0 focus-visible:ring-0 bg-transparent min-h-[200px] p-4"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        {t.journal?.cancel || t.common?.cancel || "Cancel"}
                    </Button>
                    <Button onClick={handleSave} disabled={saveMutation.isPending}>
                        {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {t.journal?.save || t.common?.save || "Save"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
