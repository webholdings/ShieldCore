import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Cigarette,
    Wine,
    Smartphone,
    Coffee,
    Candy,
    Gamepad2,
    ShoppingBag,
    Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { Addiction } from "@shared/schema";

interface AddTrackerDialogProps {
    initialData?: Addiction;
    trigger?: React.ReactNode;
}

export function AddTrackerDialog({ initialData, trigger }: AddTrackerDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const formSchema = z.object({
        type: z.string(),
        name: z.string().min(2, t.recovery.name_error),
        quitDate: z.string(),
        dailyGoal: z.string().optional(),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: initialData?.type || "custom",
            name: initialData?.name || "",
            quitDate: initialData?.quitDate ? new Date(initialData.quitDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            dailyGoal: initialData?.dailyGoal || "",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            if (initialData) {
                const res = await apiRequest("PATCH", `/api/addictions/${initialData.id}`, data);
                return res.json();
            } else {
                const res = await apiRequest("POST", "/api/addictions", data);
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/addictions"] });
            toast({
                title: initialData ? ((t.recovery as any)?.tracker_updated || "Tracker Updated") : t.recovery.tracker_created,
                description: initialData ? ((t.recovery as any)?.tracker_updated_desc || "Tracker updated successfully") : t.recovery.tracker_created_desc,
            });
            setOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            toast({
                title: t.common.error,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        createMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t.recovery.add_tracker}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? ((t.recovery as any)?.edit_tracker || "Edit Tracker") : t.recovery.new_tracker}</DialogTitle>
                    <DialogDescription>
                        {t.recovery.tracker_description}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.recovery.type_label} (Icon)</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { value: 'alcohol', icon: Wine, label: t.recovery.type_alcohol },
                                                { value: 'smoking', icon: Cigarette, label: t.recovery.type_smoking },
                                                { value: 'social_media', icon: Smartphone, label: t.recovery.type_social_media },
                                                { value: 'sugar', icon: Candy, label: t.recovery.type_sugar },
                                                { value: 'caffeine', icon: Coffee, label: t.recovery.type_caffeine },
                                                { value: 'gaming', icon: Gamepad2, label: t.recovery.type_gaming },
                                                { value: 'shopping', icon: ShoppingBag, label: t.recovery.type_shopping },
                                                { value: 'custom', icon: Activity, label: t.recovery.type_custom },
                                            ].map((item) => (
                                                <div
                                                    key={item.value}
                                                    onClick={() => {
                                                        field.onChange(item.value);
                                                        // Always set name to the type label
                                                        form.setValue('name', item.label);
                                                    }}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent ${field.value === item.value
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-transparent bg-muted/50'
                                                        }`}
                                                >
                                                    <item.icon className={`h-6 w-6 mb-1 ${field.value === item.value ? 'text-primary' : 'text-muted-foreground'}`} />
                                                    <span className="text-[10px] text-center font-medium leading-tight truncate w-full">
                                                        {item.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="quitDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.recovery.start_date_label}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dailyGoal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.recovery.daily_goal_label}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t.recovery.daily_goal_placeholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                            {createMutation.isPending ? (initialData ? ((t.common as any)?.saving || "Saving...") : t.recovery.creating_button) : (initialData ? (t.common?.save || "Save") : t.recovery.create_button)}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
