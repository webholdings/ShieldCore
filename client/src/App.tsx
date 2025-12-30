import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import logoUrl from "@assets/creativewaves_logo_1761910334299.png";
import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

// Lazy load pages
const DashboardLazy = lazy(() => import("@/pages/Dashboard"));
const HomeLazy = lazy(() => import("@/pages/Home"));
const GamesLazy = lazy(() => import("@/pages/Games"));
const MoodLazy = lazy(() => import("@/pages/Mood"));
const JournalLazy = lazy(() => import("@/pages/Journal"));
const ProfileLazy = lazy(() => import("@/pages/Profile"));
const CoursesLazy = lazy(() => import("@/pages/Courses"));
const CourseDetailLazy = lazy(() => import("@/pages/CourseDetail"));
const IQTestLazy = lazy(() => import("@/pages/IQTest"));
const BreathingExerciseLazy = lazy(() => import("@/pages/BreathingExercise"));
const AuthPageLazy = lazy(() => import("@/pages/AuthPage"));
const MagicLinkPageLazy = lazy(() => import("@/pages/MagicLinkPage"));
const TermsPageLazy = lazy(() => import("@/pages/TermsPage"));
const PrivacyPageLazy = lazy(() => import("@/pages/PrivacyPage"));
const SupportPageLazy = lazy(() => import("@/pages/SupportPage"));
const DailyPlanFunnelLazy = lazy(() => import("@/pages/DailyPlanFunnel"));
const SudokuLazy = lazy(() => import("@/pages/games/Sudoku"));
const MandalaStudioLazy = lazy(() => import("@/pages/MandalaStudio"));
const AdminUserManagementLazy = lazy(() => import("@/pages/AdminUserManagement"));
const AddictionRecoveryLazy = lazy(() => import("@/pages/AddictionRecovery"));
const AIAssistantLazy = lazy(() => import("@/pages/AIAssistant"));
const ExpressPlayerLazy = lazy(() => import("@/pages/ExpressPlayer"));
const SleepDashboardLazy = lazy(() => import("@/pages/SleepDashboard"));
const SleepSoundsLazy = lazy(() => import("@/pages/SleepSounds"));
const SleepPlanFunnelLazy = lazy(() => import("@/pages/SleepPlanFunnel"));
const MentalHealthDashboardLazy = lazy(() => import("@/pages/MentalHealthDashboard"));

// Wrapper components to satisfy wouter's component prop type
const Dashboard = () => <DashboardLazy />;
const Home = () => <HomeLazy />;
const Games = () => <GamesLazy />;
const Mood = () => <MoodLazy />;
const Journal = () => <JournalLazy />;
const Profile = () => <ProfileLazy />;
const Courses = () => <CoursesLazy />;
const CourseDetail = () => <CourseDetailLazy />;
const IQTest = () => <IQTestLazy />;
const BreathingExercise = () => <BreathingExerciseLazy />;
const MandalaStudio = () => <MandalaStudioLazy />;
const AdminUserManagement = () => <AdminUserManagementLazy />;
const AddictionRecovery = () => <AddictionRecoveryLazy />;
const AIAssistant = () => <AIAssistantLazy />;
const ExpressPlayer = () => <ExpressPlayerLazy />;
const SleepDashboard = () => <SleepDashboardLazy />;
const SleepSounds = () => <SleepSoundsLazy />;
const SleepPlanFunnel = () => <SleepPlanFunnelLazy />;
const MentalHealthDashboard = () => <MentalHealthDashboardLazy />;
const AuthPage = () => <AuthPageLazy />;

const MagicLinkPage = () => <MagicLinkPageLazy />;
const TermsPage = () => <TermsPageLazy />;
const PrivacyPage = () => <PrivacyPageLazy />;
const SupportPage = () => <SupportPageLazy />;
const DailyPlanFunnel = () => <DailyPlanFunnelLazy />;
const Sudoku = () => <SudokuLazy />;

// New RootRedirect component
const RootRedirect = () => {
  const { user } = useAuth();

  if (user?.isSleepCustomer) {
    return <Redirect to="/sleep" />;
  }
  return <Redirect to="/dashboard" />;
};

function SidebarLayout() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const { toggleSidebar } = useSidebar();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide sidebar and header on auth pages and daily plan funnel
  const isAuthPage = location.startsWith('/auth');
  const isDailyPlanFunnel = location === '/daily-plan';
  const isMinimalLayout = isAuthPage || isDailyPlanFunnel;

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // Show header if scrolling up or at the top
      if (scrollDiff < 0 || currentScrollY < 50) {
        setIsHeaderVisible(true);
      }
      // Hide header if scrolling down and not at the top
      else if (scrollDiff > 0 && currentScrollY > 50) {
        setIsHeaderVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll position when navigating to a new route
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      setIsHeaderVisible(true);
    }
  }, [location]);

  if (isMinimalLayout) {
    return (
      <main className="flex-1 h-screen overflow-x-hidden overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route path="/auth/magic-link" component={MagicLinkPage} />
            <ProtectedRoute path="/daily-plan" component={DailyPlanFunnel} />
            <ProtectedRoute path="/games/sudoku" component={Sudoku} />
            {/* Allow access to public pages from auth flow if needed */}
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/support" component={SupportPage} />
          </Switch>
        </Suspense>
        {!isAuthPage && <PWAInstallPrompt />}
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <header
          className={`flex items-center justify-between gap-2 p-2 border-b absolute top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-shrink">
            <Button
              variant="outline"
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-3 py-2 text-base font-semibold hover-elevate flex-shrink-0"
              data-testid="button-sidebar-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <button
              onClick={() => setLocation('/dashboard')}
              className="flex items-center gap-2 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src={logoUrl} alt="CreativeWaves Logo" className="h-8 w-auto object-contain" />
            </button>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main
          ref={mainRef}
          className="flex-1 overflow-x-hidden overflow-y-auto bg-background pt-16"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <Switch>
              <ProtectedRoute path="/" component={RootRedirect} />
              <ProtectedRoute path="/dashboard" component={Dashboard} />
              <ProtectedRoute path="/audio" component={Home} />
              <ProtectedRoute path="/courses" component={Courses} />
              <ProtectedRoute path="/courses/:id" component={CourseDetail} />
              <ProtectedRoute path="/games" component={Games} />
              <ProtectedRoute path="/games/sudoku" component={Sudoku} />
              <ProtectedRoute path="/iq-test" component={IQTest} />
              <ProtectedRoute path="/breathing" component={BreathingExercise} />
              <ProtectedRoute path="/mood" component={Mood} />
              <ProtectedRoute path="/journal" component={Journal} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/mandala" component={MandalaStudio} />
              <ProtectedRoute path="/recovery" component={AddictionRecovery} />
              <ProtectedRoute path="/ai-assistant" component={AIAssistant} />
              <ProtectedRoute path="/express" component={ExpressPlayer} />
              <ProtectedRoute path="/sleep" component={SleepDashboard} />
              <ProtectedRoute path="/sleep-sounds" component={SleepSounds} />
              <ProtectedRoute path="/sleep-plan" component={SleepPlanFunnel} />
              <ProtectedRoute path="/mental-health" component={MentalHealthDashboard} />
              <ProtectedRoute path="/admin" component={AdminUserManagement} />
              {/* Auth routes are handled above, but kept here for completeness if needed, though unreachable due to isAuthPage check */}
              <Route path="/terms" component={TermsPage} />
              <Route path="/privacy" component={PrivacyPage} />
              <Route path="/support" component={SupportPage} />
            </Switch>
          </Suspense>
          <Footer />
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  );
}

function AppContent() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <SidebarLayout />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <AppContent />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
