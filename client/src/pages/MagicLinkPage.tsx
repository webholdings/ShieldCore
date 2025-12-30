import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MagicLinkPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/auth/magic-link');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // Get token from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setError('Missing authentication token');
        setIsVerifying(false);
        return;
      }

      try {
        // Call the API endpoint to verify the magic link
        const response = await fetch(`/api/auth/verify-magic-link?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'include',
          redirect: 'manual' // Don't follow redirects automatically
        });

        if (response.type === 'opaqueredirect' || response.status === 0) {
          // Redirect was successful, navigate to dashboard
          window.location.href = '/';
          return;
        }

        if (response.ok) {
          // Successfully verified, redirect to dashboard
          window.location.href = '/';
        } else {
          const errorText = await response.text();
          setError(errorText || 'Invalid or expired magic link');
          setIsVerifying(false);
        }
      } catch (err: any) {
        console.error('Magic link verification error:', err);
        setError('Error verifying magic link. Please try again.');
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-md glass-card-lg border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading font-bold">Verifying Login Link</CardTitle>
          <CardDescription className="text-lg">
            {isVerifying ? 'Please wait while we log you in...' : 'Authentication'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="loader-verifying" />
              <p className="text-center text-muted-foreground">
                Verifying your magic link...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Verification Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <p className="text-xs text-muted-foreground pt-2">
                  Magic links expire after 15 minutes and can only be used once.
                </p>
              </div>
              <button
                onClick={() => navigate('/auth')}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                data-testid="button-back-to-login"
              >
                Back to Login
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
