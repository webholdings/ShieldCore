import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8 md:py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10 ring-4 ring-primary/5 shadow-xl backdrop-blur-sm">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground drop-shadow-sm">{t.support_page.title}</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">{t.support_page.subtitle}</p>
        </div>

        {/* Email Support Section */}
        <div className="glass-card-lg p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-heading font-semibold">{t.support_page.get_in_touch}</h2>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.support_page.intro}
          </p>

          <div className="bg-white/50 p-6 md:p-8 rounded-xl border border-white/20 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-heading font-semibold">{t.support_page.email_support}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t.support_page.email_desc}
            </p>
            <div className="pt-2">
              <a href="mailto:support@creativewaves.me" className="text-lg font-semibold text-primary hover:underline">
                support@creativewaves.me
              </a>
            </div>
            <Button
              asChild
              className="h-12 px-6 text-lg shadow-md hover:shadow-lg transition-all"
              data-testid="button-contact-support"
            >
              <a href="mailto:support@creativewaves.me">
                {t.support_page.contact_support}
              </a>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-heading font-semibold">{t.support_page.faq_title}</h2>
          </div>

          <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
            <AccordionItem value="item-1" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q1}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a1}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q2}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a2}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q3}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a3}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q4}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a4}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q5}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a5}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q6}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a6}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q7}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a7}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q8}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a8}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q9}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a9}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border-none">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {t.support_page.faq_q10}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t.support_page.faq_a10}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Support Hours */}
        <div className="bg-blue-50/50 border border-blue-200/50 p-6 rounded-xl flex gap-4 items-start backdrop-blur-sm">
          <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-base text-foreground leading-relaxed">
            <strong className="font-semibold">{t.support_page.support_hours}</strong> {t.support_page.support_hours_text}
          </p>
        </div>
      </div>
    </div>
  );
}
