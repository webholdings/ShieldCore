import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddTrackerDialog } from "@/components/addiction/AddTrackerDialog";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    AlertCircle,
    Calendar,
    RefreshCw,
    Pencil,
    Trash2,
    Cigarette,
    Wine,
    Smartphone,
    Coffee,
    Candy,
    Activity,
    Gamepad2,
    ShoppingBag,
    HelpCircle
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { formatDateShort } from "@/lib/dateUtils";
import { Addiction, Course } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddictionCardProps {
    addiction: Addiction;
}

export function AddictionCard({ addiction }: AddictionCardProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const { t } = useLanguage();

    // Calculate streak
    const startDate = new Date(addiction.lastRelapseDate || addiction.quitDate);
    const daysClean = differenceInDays(new Date(), startDate);

    // Calculate milestone progress (e.g., next milestone at 7, 30, 90, 365 days)
    const milestones = [7, 30, 90, 365, 1000];
    const nextMilestone = milestones.find(m => m > daysClean) || daysClean + 100;
    const progress = (daysClean / nextMilestone) * 100;

    const checkinMutation = useMutation({
        mutationFn: async (status: 'clean' | 'relapsed') => {
            const res = await apiRequest("POST", `/api/addictions/${addiction.id}/checkin`, {
                status,
                date: new Date().toISOString().split('T')[0],
            });
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/addictions"] });
            toast({
                title: data.status === 'clean' ? t.dashboard.check_in_recorded : t.dashboard.relapse_logged,
                description: data.status === 'clean' ? t.dashboard.keep_up_work : t.dashboard.recovery_journey,
            });
        },
        onError: (error: any) => {
            toast({
                title: t.common.error,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("DELETE", `/api/addictions/${addiction.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/addictions"] });
            toast({
                title: t.dashboard.tracker_deleted,
                description: t.dashboard.tracker_deleted_desc,
            });
        },
        onError: (error: any) => {
            toast({
                title: t.common.error,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Fetch courses to show recommended course
    const { data: courses } = useQuery<Course[]>({
        queryKey: ["/api/courses"],
    });

    // Find relevant course based on addiction type
    const recommendedCourse = courses?.find(c => {
        if (addiction.type === 'alcohol' && c.title === 'Alcohol Freedom') return true;
        if (addiction.type === 'smoking' && c.title === 'Smoke-Free Life') return true;
        if (addiction.type === 'social_media' && c.title === 'Digital Balance') return true;
        return false;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'smoking': return <Cigarette className="h-5 w-5" />;
            case 'alcohol': return <Wine className="h-5 w-5" />;
            case 'social_media': return <Smartphone className="h-5 w-5" />;
            case 'caffeine': return <Coffee className="h-5 w-5" />;
            case 'sugar': return <Candy className="h-5 w-5" />;
            case 'gaming': return <Gamepad2 className="h-5 w-5" />;
            case 'shopping': return <ShoppingBag className="h-5 w-5" />;
            case 'custom': return <Activity className="h-5 w-5" />;
            default: return <HelpCircle className="h-5 w-5" />;
        }
    };

    const getTypeName = (type: string) => {
        const typeMap: Record<string, string> = {
            'smoking': t.recovery.type_smoking,
            'alcohol': t.recovery.type_alcohol,
            'social_media': t.recovery.type_social_media,
            'sugar': t.recovery.type_sugar,
            'caffeine': t.recovery.type_caffeine,
            'gaming': t.recovery.type_gaming,
            'shopping': t.recovery.type_shopping,
            'custom': t.recovery.type_custom
        };
        return typeMap[type] || type;
    };

    return (
        <Card className="overflow-hidden border-l-4 border-l-primary transition-all hover:shadow-md group">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                            {getIcon(addiction.type)}
                        </div>
                        <div>
                            <Badge variant="outline" className="mb-2 capitalize">
                                {getTypeName(addiction.type)}
                            </Badge>
                            <CardTitle className="text-xl">{addiction.name}</CardTitle>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <div className="text-3xl font-bold text-primary">{daysClean}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{t.dashboard.days_clean}</div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AddTrackerDialog
                                initialData={addiction}
                                trigger={
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                }
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                    if (confirm(t.dashboard.delete_confirm)) {
                                        deleteMutation.mutate();
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t.dashboard.next_milestone}: {nextMilestone} {t.common?.days || "days"}</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="w-full border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-900 dark:hover:bg-green-900/20"
                            onClick={() => checkinMutation.mutate('clean')}
                            disabled={checkinMutation.isPending}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                            {t.dashboard.check_in_clean}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                                if (confirm(t.dashboard.relapse_confirm)) {
                                    checkinMutation.mutate('relapsed');
                                }
                            }}
                            disabled={checkinMutation.isPending}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Log Relapse
                        </Button>
                    </div>

                    {recommendedCourse && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">{t.dashboard.recommended_course}</h4>
                            <div className="bg-muted/50 rounded-lg p-3 flex gap-3 items-center">
                                <img
                                    src={recommendedCourse.imageUrl}
                                    alt={recommendedCourse.title}
                                    className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{recommendedCourse.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{recommendedCourse.description}</div>
                                </div>
                                <Button size="sm" variant="secondary" asChild>
                                    <a href={`/courses/${recommendedCourse.id}`}>{t.dashboard.start}</a>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t.dashboard.started}: {formatDateShort(addiction.quitDate)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
