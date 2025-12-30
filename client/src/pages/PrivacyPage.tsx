import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, FileText, AlertCircle, ExternalLink } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/5 shadow-xl backdrop-blur-sm">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground drop-shadow-sm">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground font-light">Your privacy and data security are our top priorities</p>
        </div>

        <div className="glass-card-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FileText className="h-96 w-96" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/40 p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <span>Last updated: October 28, 2025</span>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">1</span>
                  Information We Collect
                </h2>
                <div className="pl-11 space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {['Account information (email, password, language)', 'Usage data (audio progress, game scores)', 'Course progress and completion data', 'Device and browser information'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground bg-white/30 p-3 rounded-lg border border-white/10 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">2</span>
                  How We Use Your Information
                </h2>
                <div className="pl-11 space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Provide, maintain, and improve our services',
                      'Track your progress across audio sessions, courses, games, and tests',
                      'Personalize your experience based on your preferences',
                      'Send you technical notices and support messages',
                      'Respond to your comments and questions',
                      'Analyze usage patterns to improve our platform'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">3</span>
                  Information Sharing
                </h2>
                <div className="pl-11 space-y-4">
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-6 flex gap-4">
                    <Eye className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">We do not sell, trade, or rent your personal information to third parties.</strong> We may share your information only in limited circumstances: with your consent, to comply with legal obligations, to protect our rights, or in connection with a business transaction.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">4</span>
                  Data Security
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">5</span>
                  Your Rights
                </h2>
                <div className="pl-11">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Access and receive a copy of your data',
                      'Correct inaccurate or incomplete data',
                      'Request deletion of your personal data',
                      'Object to or restrict processing',
                      'Withdraw consent at any time'
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-muted-foreground bg-white/30 p-3 rounded-lg border border-white/10 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">6</span>
                  Contact Us
                </h2>
                <div className="pl-11">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a
                      href="mailto:support@creativewaves.me"
                      className="text-primary font-medium hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      support@creativewaves.me
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
