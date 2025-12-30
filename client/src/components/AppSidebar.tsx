import { useLocation, Link } from 'wouter';
import {
  Headphones, Brain, BookOpen, Heart, Wind,
  Lightbulb, User, Home, Palette, Shield, MessageCircle, Zap, Lock, Moon, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationGroups = [
  /*
  {
    id: 'wellness',
    labelKey: 'wellness' as const,
    items: [
      { path: '/audio', icon: Headphones, labelKey: 'audio' as const, testId: 'nav-audio' },
      { path: '/mental-health', icon: ShieldCheck, labelKey: 'mental_health' as const, testId: 'nav-mental-health' },
      { path: '/express', icon: Zap, labelKey: 'express_upgrade' as const, testId: 'nav-express', showLock: true },
      { path: '/breathing', icon: Wind, labelKey: 'breathing' as const, testId: 'nav-breathing' },
      // { path: '/journal', icon: BookOpen, labelKey: 'journal' as const, testId: 'nav-journal' },
      { path: '/sleep', icon: Moon, labelKey: 'sleep' as const, testId: 'nav-sleep' },
      { path: '/recovery', icon: Shield, labelKey: 'recovery' as const, testId: 'nav-recovery', restricted: true },
      { path: '/ai-assistant', icon: MessageCircle, labelKey: 'ai_assistant' as const, testId: 'nav-ai-assistant' },
    ]
  },
  {
    id: 'learning',
    labelKey: 'learning' as const,
    items: [
      { path: '/courses', icon: BookOpen, labelKey: 'courses' as const, testId: 'nav-courses' },
      { path: '/iq-test', icon: Lightbulb, labelKey: 'iq_test' as const, testId: 'nav-iq-test' },
    ]
  },
  {
    id: 'brain_training',
    labelKey: 'brain_training' as const,
    items: [
      { path: '/games', icon: Brain, labelKey: 'games' as const, testId: 'nav-games' },
    ]
  },
  {
    id: 'creative',
    labelKey: 'creative' as const,
    items: [
      { path: '/mandala', icon: Palette, labelKey: 'mandala' as const, testId: 'nav-mandala' },
    ]
  },
  */
  {
    id: 'account',
    labelKey: 'account' as const,
    items: [
      { path: '/profile', icon: User, labelKey: 'profile' as const, testId: 'nav-profile' },
    ]
  }
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const isPathActive = (path: string, currentLocation: string) => {
    if (path === '/') {
      return currentLocation === '/' || currentLocation === '/dashboard';
    }
    return currentLocation === path || currentLocation.startsWith(path + '/');
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Home/Dashboard Link */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isPathActive('/', location)}
                className={`nav-pill mb-1 ${isPathActive('/', location) ? 'nav-pill-active' : 'nav-pill-inactive'}`}
              >
                <Link href="/" data-testid="nav-home" onClick={handleLinkClick}>
                  <Home className="h-5 w-5" />
                  <span className="text-base">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin Link (Only for ricdes@gmail.com) */}
        {user?.email === 'ricdes@gmail.com' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold px-4 mb-2 text-red-500">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isPathActive('/admin', location)}
                    className={`nav-pill mb-1 ${isPathActive('/admin', location) ? 'nav-pill-active' : 'nav-pill-inactive'}`}
                  >
                    <Link href="/admin" onClick={handleLinkClick}>
                      <Shield className="h-5 w-5" />
                      <span className="text-base">User Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Grouped Navigation */}
        {navigationGroups.map((group) => {
          // Check if running on localhost (dev mode)
          const isLocalDev = typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

          // Filter items based on user role and environment
          const filteredItems = group.items.filter(item => {
            // Hide devOnly items in production unless user is admin or enabled features
            // IMPORTANT: For sleep, we are enabling it for all for now as per instructions implies it's a key feature being worked on.
            // But let's respect the flag if it is strictly set.
            // The original code had: if ((item as any).devOnly && !isLocalDev && !isAdmin) return false;
            // The user wants to see "SleepWaves" menu entry.
            const isAdmin = user?.email === 'ricdes@gmail.com';
            if ((item as any).devOnly && !isLocalDev && !isAdmin) {
              return false;
            }
            if ((item as any).restricted && !user?.recoveryUser) {
              return false;
            }
            return true;
          });

          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel className="text-sm font-semibold px-4 mb-2">
                {t.nav[group.labelKey]}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 px-2">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isPathActive(item.path, location);
                    const showLock = (item as any).showLock;



                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}`}
                        >
                          <Link href={item.path} data-testid={item.testId} onClick={handleLinkClick}>
                            <Icon className="h-5 w-5" />
                            <span className="text-base flex-1">{t.nav[item.labelKey] || item.labelKey}</span>
                            {showLock && <Lock className="h-4 w-4 text-amber-500" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
        {/* Spacer for bottom visibility */}
        <div className="h-24" />
      </SidebarContent>
    </Sidebar>
  );
}
