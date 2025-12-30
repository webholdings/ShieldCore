import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import logoUrl from "@assets/shieldcore_logo.png";
import { LanguageToggle } from '@/components/LanguageToggle';

// Admin email that must use Google Sign-In only
const GOOGLE_ONLY_EMAIL = 'ricdes@gmail.com';

export default function AuthPage() {
  const { user, loginWithGoogleMutation } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      if (user.isSleepCustomer) {
        setLocation('/sleep');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [user, setLocation]);

  // Email login mutation - simple: just email, no password
  const emailLoginMutation = useMutation({
    mutationFn: async (emailInput: string) => {
      const normalizedEmail = emailInput.toLowerCase().trim();

      // Block admin from email login
      if (normalizedEmail === GOOGLE_ONLY_EMAIL) {
        throw new Error('GOOGLE_ONLY');
      }

      // Call simple-login API
      const res = await fetch("/api/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();

      // Sign in with the custom token
      const { signInWithCustomToken } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signInWithCustomToken(auth, data.token);

      return true;
    },
    onSuccess: () => {
      toast({
        title: t.auth.login_success_title,
        description: t.auth.login_success_desc,
      });
      // Force redirect after successful login with delay to ensure auth state is updated
      setTimeout(() => {
        // We reload to root, letting the app's auth logic redirect to the correct home (dashboard or sleep)
        window.location.href = '/';
      }, 500);
    },
    onError: (error: Error) => {
      if (error.message === 'GOOGLE_ONLY') {
        toast({
          title: "Use Google Sign-In",
          description: "Please use the Google Sign-In button above to access your account.",
        });
      } else if (error.message === 'Account not found') {
        toast({
          variant: 'destructive',
          title: "Account Not Found",
          description: "No account found with this email. Please check your email or contact support.",
        });
      } else if (error.message === 'Subscription inactive') {
        toast({
          variant: 'destructive',
          title: "Subscription Inactive",
          description: "Your subscription is not active. Please renew to continue.",
        });
      } else {
        toast({
          variant: 'destructive',
          title: "Login Error",
          description: error.message || "Unable to log in. Please try again.",
        });
      }
    }
  });

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogleMutation.mutateAsync();
      // Force redirect after successful Google login
      // Small delay to ensure Firebase auth state is updated
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (e) {
      // Error handled by the mutation
      console.error('Google login error:', e);
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      emailLoginMutation.mutate(email.trim());
    }
  };

  // Don't render if already logged in (redirect will happen)
  if (user) return null;

  const isLoading = emailLoginMutation.isPending || loginWithGoogleMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="w-full max-w-md flex flex-col gap-4">

        {/* Logo + Language Toggle */}
        <div className="flex items-center justify-between px-2">
          <img
            src={logoUrl}
            alt="ShieldCore"
            className="h-16 w-auto object-contain drop-shadow-sm"
          />
          <LanguageToggle />
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-muted-foreground text-base font-medium">{t.auth.tagline}</p>
        </div>

        <Card className="glass-card-lg border-0 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">{t.auth.welcome_back}</CardTitle>
            <CardDescription className="text-center text-base">
              {t.auth.enter_email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Google Login Button */}
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-primary/20 shadow-sm transition-all rounded-xl flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
            >
              {loginWithGoogleMutation.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {t.auth.sign_in_with_google}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  {t.auth.or_continue_with} Email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-base font-medium pl-1">
                  {t.auth.email_label}
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={t.auth.email_placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-lg bg-background/50 border-input focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                  data-testid="input-login-email"
                />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {t.auth.no_password}
              </p>

              <Button
                type="submit"
                variant="confirm"
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                disabled={isLoading || !email.trim()}
                data-testid="button-login"
              >
                {emailLoginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.auth.logging_in}
                  </>
                ) : (
                  <>
                    {t.auth.login_button} <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Support Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Having trouble?{' '}
                <a href="/support" className="text-primary hover:underline font-medium">
                  Contact Support
                </a>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} ShieldCore</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-primary transition-colors">{t.footer?.terms || "Terms"}</a>
            <a href="/privacy" className="hover:text-primary transition-colors">{t.footer?.privacy || "Privacy"}</a>
          </div>
        </div>

      </div>
    </div>
  );
}
