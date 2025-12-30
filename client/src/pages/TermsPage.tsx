import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Scale, FileText, AlertCircle, ExternalLink } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/5 shadow-xl backdrop-blur-sm">
              <Scale className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground drop-shadow-sm">Terms & Conditions</h1>
          <p className="text-xl text-muted-foreground font-light">Please read these terms carefully before using our platform</p>
        </div>

        <div className="glass-card-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FileText className="h-96 w-96" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/40 p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure & Compliant</span>
              </div>
              <span>Last updated: October 28, 2025</span>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                  By accessing and using CreativeWaves, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">2</span>
                  Use License
                </h2>
                <div className="pl-11 space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Permission is granted to temporarily access the materials on CreativeWaves for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {['Modify or copy the materials', 'Use the materials for any commercial purpose', 'Attempt to decompile or reverse engineer', 'Remove any copyright notations', 'Transfer or mirror the materials'].map((item, i) => (
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
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">3</span>
                  User Account
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                  You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. CreativeWaves reserves the right to refuse service, terminate accounts, or remove content at our sole discretion.
                </p>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">4</span>
                  Content Disclaimer
                </h2>
                <div className="pl-11">
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-6 flex gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground leading-relaxed">
                      All audio sessions, educational courses, brain training games, and other content provided through CreativeWaves are for informational and wellness purposes only. They are not intended to diagnose, treat, cure, or prevent any medical condition. Always consult with a qualified healthcare professional before making any health-related decisions.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">5</span>
                  Limitations & Modifications
                </h2>
                <div className="pl-11 space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    In no event shall CreativeWaves or its suppliers be liable for any damages arising out of the use or inability to use CreativeWaves.
                  </p>
                  <p>
                    CreativeWaves may revise these terms of service at any time without notice. By using this platform you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>
              </section>

              <Separator className="bg-border/50" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold flex items-center gap-3 text-primary">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-sm font-bold">6</span>
                  Contact Information
                </h2>
                <div className="pl-11">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms & Conditions, please contact us at{' '}
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
