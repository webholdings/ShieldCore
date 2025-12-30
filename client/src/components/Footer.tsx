import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Defensive null check for translations that may not be loaded yet
  const footer = t?.footer;
  if (!footer) {
    return null;
  }

  return (
    <footer className="bg-muted/30 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CreativeWaves. {footer.all_rights_reserved}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-terms"
            >
              {footer.terms}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-privacy"
            >
              {footer.privacy}
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-support"
            >
              {footer.support}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
