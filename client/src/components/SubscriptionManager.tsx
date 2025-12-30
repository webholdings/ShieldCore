import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, PauseCircle, PlayCircle, XCircle, Loader2, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Subscription {
    id: number;
    status: string;
    nextPaymentDate: string;
    billingPeriod: string;
    billingInterval: string;
    total: string;
    currency: string;
    startDate: string;
    endDate: string | null;
}

interface SubscriptionData {
    hasSubscription: boolean;
    status: string | null;
    subscription: Subscription | null;
}

export function SubscriptionManager() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<SubscriptionData>({
        queryKey: ['/api/subscription/status'],
        retry: 1,
    });

    const pauseMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest('POST', '/api/subscription/pause', {});
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
            toast({
                title: t.profile.subscription_paused,
                description: t.profile.subscription_paused_desc,
            });
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: t.common.error,
                description: error.message,
            });
        },
    });

    const resumeMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest('POST', '/api/subscription/resume', {});
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
            toast({
                title: t.profile.subscription_resumed,
                description: t.profile.subscription_resumed_desc,
            });
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: t.common.error,
                description: error.message,
            });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest('POST', '/api/subscription/cancel', {});
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
            toast({
                title: t.profile.subscription_cancelled,
                description: t.profile.subscription_cancelled_desc,
            });
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: t.common.error,
                description: error.message,
            });
        },
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t.profile.subscription_title}
                    </CardTitle>
                    <CardDescription>{t.profile.subscription_description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Check for grandfathered users (active but no subscriptionId)
    const isGrandfathered = !data?.hasSubscription && !data?.subscription;

    if (isGrandfathered) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t.profile.subscription_title}
                    </CardTitle>
                    <CardDescription>{t.profile.subscription_description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t.profile.subscription_status}:</span>
                        <Badge className="bg-green-500">{t.profile.status_active}</Badge>
                    </div>
                    <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            {t.profile.grandfathered_message || "You have lifetime access to CreativeWaves. Thank you for being an early supporter!"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data?.hasSubscription) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t.profile.subscription_title}
                    </CardTitle>
                    <CardDescription>{t.profile.subscription_description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{t.profile.no_subscription}</p>
                    <Button
                        onClick={() => window.open('https://buy.creativewaves.me/checkouts/checkout-page', '_blank')}
                    >
                        {t.profile.purchase_subscription}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const subscription = data.subscription!;
    const isActive = subscription.status === 'active';
    const isPaused = subscription.status === 'on-hold';
    const isCancelled = subscription.status === 'cancelled';

    const getStatusBadge = () => {
        switch (subscription.status) {
            case 'active':
                return <Badge className="bg-green-500">{t.profile.status_active}</Badge>;
            case 'on-hold':
                return <Badge className="bg-yellow-500">{t.profile.status_paused}</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">{t.profile.status_cancelled}</Badge>;
            case 'expired':
                return <Badge variant="secondary">{t.profile.status_expired}</Badge>;
            default:
                return <Badge variant="secondary">{subscription.status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t.profile.subscription_title}
                </CardTitle>
                <CardDescription>{t.profile.subscription_description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.profile.subscription_status}:</span>
                    {getStatusBadge()}
                </div>

                {/* Billing Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">{t.profile.billing_amount}</p>
                            <p className="font-semibold">{subscription.total} {subscription.currency.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                                {t.profile.every} {subscription.billingInterval} {subscription.billingPeriod}
                            </p>
                        </div>
                    </div>

                    {subscription.nextPaymentDate && !isCancelled && (
                        <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">{t.profile.next_payment}</p>
                                <p className="font-semibold">
                                    {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {isActive && (
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" disabled={pauseMutation.isPending}>
                                        {pauseMutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <PauseCircle className="mr-2 h-4 w-4" />
                                        )}
                                        {t.profile.pause_subscription}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t.profile.pause_confirm_title}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t.profile.pause_confirm_desc}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => pauseMutation.mutate()}>
                                            {t.profile.pause_subscription}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={cancelMutation.isPending}>
                                        {cancelMutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="mr-2 h-4 w-4" />
                                        )}
                                        {t.profile.cancel_subscription}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t.profile.cancel_confirm_title}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t.profile.cancel_confirm_desc}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => cancelMutation.mutate()}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {t.profile.cancel_subscription}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}

                    {isPaused && (
                        <Button onClick={() => resumeMutation.mutate()} disabled={resumeMutation.isPending}>
                            {resumeMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <PlayCircle className="mr-2 h-4 w-4" />
                            )}
                            {t.profile.resume_subscription}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
