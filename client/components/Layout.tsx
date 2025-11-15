import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SupabaseStatus from "./SupabaseStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import ArmSwitcher from "./ArmSwitcher";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  User,
  Settings,
  LogOut,
  Sparkles,
  UserCircle,
  Menu,
  BookOpen,
  Shield,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const ARMS = [
  { id: "staff", label: "Staff", color: "#7c3aed", href: "/staff" },
  { id: "labs", label: "Labs", color: "#FBBF24", href: "/labs" },
  { id: "gameforge", label: "GameForge", color: "#22C55E", href: "/gameforge" },
  { id: "corp", label: "Corp", color: "#3B82F6", href: "/corp" },
  {
    id: "foundation",
    label: "Foundation",
    color: "#EF4444",
    href: "/foundation",
  },
  { id: "devlink", label: "Dev-Link", color: "#06B6D4", href: "/dev-link" },
  { id: "nexus", label: "Nexus", color: "#A855F7", href: "/nexus" },
];

const ARM_LOGOS: Record<string, string> = {
  staff:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
  labs: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800",
  gameforge:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
  corp: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800",
  foundation:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
  devlink:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
  nexus:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
};

export default function CodeLayout({ children, hideFooter }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading, profileComplete } = useAuth();
  const { theme } = useArmTheme();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Realms", href: "/realms" },
    { name: "Get Started", href: "/onboarding" },
    { name: "Engage", href: "/engage" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Projects", href: "/projects" },
    { name: "Teams", href: "/teams" },
    { name: "Squads", href: "/squads" },
    { name: "Mentee Hub", href: "/mentee-hub" },
    { name: "Directory", href: "/directory" },
    { name: "Developers", href: "/developers" },
    { name: "Creators", href: "/creators" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" },
    { name: "Documentation", href: "/docs" },
  ];

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Realms", href: "/realms" },
    { name: "Teams", href: "/teams" },
    { name: "Squads", href: "/squads" },
    { name: "Mentee Hub", href: "/mentee-hub" },
    { name: "Feed", href: "/feed" },
    { name: "Engage", href: "/engage" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Projects", href: "/projects" },
    { name: "Developers", href: "/developers" },
    { name: "Creators", href: "/creators" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "My Applications", href: "/profile/applications" },
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isSubdomainHost = (() => {
    try {
      const hostname =
        typeof window !== "undefined" ? window.location.hostname : "";
      if (!hostname) return false;
      if (hostname.includes("aethex.me") || hostname.includes("aethex.space")) {
        const parts = hostname.split(".");
        return parts.length > 2;
      }
      return false;
    } catch (e) {
      return false;
    }
  })();

  const passportHref = isSubdomainHost
    ? "/"
    : profile?.username
      ? `/passport/${profile.username}`
      : "/passport/me";

  const navItems: { name: string; href: string }[] = [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-200",
        theme.wallpaperClass,
      )}
    >
      <header
        className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down overflow-hidden transition-all duration-200"
        style={{
          borderBottomColor: theme.accentHex,
          borderBottomWidth: "2px",
          boxShadow: `0 8px 32px ${theme.accentHex}15`,
        }}
      >
        <div className="container mx-auto max-w-7xl flex min-h-16 h-auto items-center justify-between px-3 md:px-4 py-2 gap-1 md:gap-3 lg:gap-4 min-w-0 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center shrink-0 relative">
            {/* Desktop - Regular Link */}
            <Link
              to="/"
              className="hover-glow group inline-block hidden sm:block"
            >
              <svg
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="osGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* OS Window Frame */}
                <rect
                  x="6"
                  y="6"
                  width="52"
                  height="52"
                  rx="6"
                  fill="none"
                  stroke="url(#osGradient)"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Title Bar */}
                <rect
                  x="6"
                  y="6"
                  width="52"
                  height="12"
                  rx="6"
                  fill="url(#osGradient)"
                  opacity="0.15"
                />
                <line
                  x1="6"
                  y1="18"
                  x2="58"
                  y2="18"
                  stroke="url(#osGradient)"
                  strokeWidth="1"
                  opacity="0.3"
                />

                {/* System Dots (Traffic Light Style) */}
                <circle cx="12" cy="12" r="1.5" fill="#a78bfa" opacity="0.7" />
                <circle cx="18" cy="12" r="1.5" fill="#60a5fa" opacity="0.7" />
                <circle cx="24" cy="12" r="1.5" fill="#c4b5fd" opacity="0.7" />

                {/* Central OS Symbol - Abstract "A" */}
                <g transform="translate(32, 35)">
                  {/* Left diagonal */}
                  <line
                    x1="-6"
                    y1="6"
                    x2="0"
                    y2="-8"
                    stroke="url(#osGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  {/* Right diagonal */}
                  <line
                    x1="6"
                    y1="6"
                    x2="0"
                    y2="-8"
                    stroke="url(#osGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  {/* Crossbar */}
                  <line
                    x1="-3"
                    y1="0"
                    x2="3"
                    y2="0"
                    stroke="url(#osGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  {/* Bottom connecting */}
                  <circle cx="-6" cy="6" r="1.5" fill="#a78bfa" opacity="0.9" />
                  <circle cx="6" cy="6" r="1.5" fill="#60a5fa" opacity="0.9" />
                </g>
              </svg>
            </Link>

            {/* Mobile - Spinning Logo Button */}
            <button
              type="button"
              onClick={() => navigate("/arms")}
              className="sm:hidden relative h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-aethex-600 to-purple-700 hover:from-aethex-500 hover:to-purple-600 shadow-lg shadow-aethex-500/30 border-2 border-aethex-400/40 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-aethex-400 hover:scale-110"
              title="Select Arm"
            >
              <div
                className="absolute inset-0 rounded-xl border-2 border-aethex-400/60 opacity-60 group-hover:opacity-100"
                style={{
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
              <svg
                className="relative h-8 w-8 z-10"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="mobileOSGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#c7d2fe" />
                    <stop offset="100%" stopColor="#dbeafe" />
                  </linearGradient>
                  <filter id="glowMobile">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* OS Window Frame */}
                <rect
                  x="6"
                  y="6"
                  width="52"
                  height="52"
                  rx="6"
                  fill="none"
                  stroke="url(#mobileOSGradient)"
                  strokeWidth="2"
                  opacity="0.9"
                />

                {/* Title Bar */}
                <rect
                  x="6"
                  y="6"
                  width="52"
                  height="12"
                  rx="6"
                  fill="url(#mobileOSGradient)"
                  opacity="0.2"
                />
                <line
                  x1="6"
                  y1="18"
                  x2="58"
                  y2="18"
                  stroke="url(#mobileOSGradient)"
                  strokeWidth="1"
                  opacity="0.4"
                />

                {/* System Dots */}
                <circle cx="12" cy="12" r="1.5" fill="#c7d2fe" opacity="0.8" />
                <circle cx="18" cy="12" r="1.5" fill="#dbeafe" opacity="0.8" />
                <circle cx="24" cy="12" r="1.5" fill="#e0e7ff" opacity="0.8" />

                {/* Central OS Symbol */}
                <g transform="translate(32, 35)">
                  <line
                    x1="-6"
                    y1="6"
                    x2="0"
                    y2="-8"
                    stroke="url(#mobileOSGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glowMobile)"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="0"
                    y2="-8"
                    stroke="url(#mobileOSGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glowMobile)"
                  />
                  <line
                    x1="-3"
                    y1="0"
                    x2="3"
                    y2="0"
                    stroke="url(#mobileOSGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glowMobile)"
                  />
                  <circle cx="-6" cy="6" r="1.5" fill="#c7d2fe" opacity="1" />
                  <circle cx="6" cy="6" r="1.5" fill="#dbeafe" opacity="1" />
                </g>
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center mx-3" />

          {/* Animated Arm Switcher */}
          <div className="flex items-center shrink-0">
            <ArmSwitcher />
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-1 md:gap-3 animate-slide-left shrink-0 overflow-visible">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border/60 bg-background/80 backdrop-blur hover:bg-background"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black/98 backdrop-blur-lg border-gray-800/50 p-3"
                >
                  <SheetHeader className="text-left mb-3">
                    <SheetTitle className="text-xs font-semibold">
                      Navigate
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-0.5 mb-3">
                    {(user ? userNavigation : publicNavigation).map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          to={item.href}
                          onClick={scrollToTop}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="border-t border-gray-800/50 pt-2 space-y-1.5">
                    {loading ? (
                      <div className="h-8 bg-gray-800/40 rounded-md animate-pulse" />
                    ) : user ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            onClick={scrollToTop}
                            className="block rounded-md bg-gradient-to-r from-aethex-500 to-neon-blue px-2.5 py-1.5 text-xs font-semibold text-white"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            type="button"
                            className="w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            onClick={() => signOut()}
                          >
                            Sign out
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/onboarding"
                            onClick={scrollToTop}
                            className="block rounded-md bg-gradient-to-r from-aethex-500 to-neon-blue px-2.5 py-1.5 text-xs font-semibold text-white"
                          >
                            Join AeThex
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/login"
                            onClick={scrollToTop}
                            className="block rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                          >
                            Sign In
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {!loading && (
              <>
                {user ? (
                  // Logged in - always show Dashboard button; show avatar menu if profile exists
                  <div className="flex items-center space-x-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover-lift hidden sm:inline-flex"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    {!profileComplete && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift glow-blue hidden sm:inline-flex"
                      >
                        <Link to="/onboarding">Complete Setup</Link>
                      </Button>
                    )}
                    <NotificationBell />
                    {!profile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover-lift"
                        onClick={() => signOut()}
                        title="Sign out"
                      >
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Sign out</span>
                      </Button>
                    )}
                    {profile && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="relative h-8 w-8 rounded-full hover-lift"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={profile.avatar_url || undefined}
                                alt={profile.full_name || profile.username}
                              />
                              <AvatarFallback>
                                {(profile.full_name || profile.username || "U")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                          <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              <p className="font-medium">
                                {profile.full_name || profile.username}
                              </p>
                              <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/profile" className="cursor-pointer">
                              <UserCircle className="mr-2 h-4 w-4" />
                              My Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={passportHref} className="cursor-pointer">
                              <Sparkles className="mr-2 h-4 w-4" />
                              AeThex Passport
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to="/dashboard?tab=profile#settings"
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Account Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="cursor-pointer">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Control Center
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to="/internal-docs"
                              className="cursor-pointer"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Internal Docs
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => signOut()}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  // Not logged in - show sign in/join buttons
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="hidden sm:inline-flex hover-lift interactive-scale"
                    >
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue"
                    >
                      <Link to="/onboarding">Join AeThex</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {!hideFooter && (
        <footer
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up transition-all duration-200"
          style={{
            borderTopColor: theme.accentHex,
            borderTopWidth: "1px",
            boxShadow: `inset 0 1px 0 ${theme.accentHex}20`,
          }}
        >
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-3 group">
                  <svg
                    className="h-6 w-6 transition-all duration-300 group-hover:scale-110"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="footerOSGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                      <filter id="glowFooter">
                        <feGaussianBlur
                          stdDeviation="1.5"
                          result="coloredBlur"
                        />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* OS Window Frame */}
                    <rect
                      x="6"
                      y="6"
                      width="52"
                      height="52"
                      rx="6"
                      fill="none"
                      stroke="url(#footerOSGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                    />

                    {/* Title Bar */}
                    <rect
                      x="6"
                      y="6"
                      width="52"
                      height="12"
                      rx="6"
                      fill="url(#footerOSGradient)"
                      opacity="0.1"
                    />
                    <line
                      x1="6"
                      y1="18"
                      x2="58"
                      y2="18"
                      stroke="url(#footerOSGradient)"
                      strokeWidth="1"
                      opacity="0.2"
                    />

                    {/* System Dots */}
                    <circle
                      cx="12"
                      cy="12"
                      r="1.5"
                      fill="#818cf8"
                      opacity="0.5"
                    />
                    <circle
                      cx="18"
                      cy="12"
                      r="1.5"
                      fill="#a78bfa"
                      opacity="0.5"
                    />
                    <circle
                      cx="24"
                      cy="12"
                      r="1.5"
                      fill="#c4b5fd"
                      opacity="0.5"
                    />

                    {/* Central OS Symbol */}
                    <g transform="translate(32, 35)">
                      <line
                        x1="-6"
                        y1="6"
                        x2="0"
                        y2="-8"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="0"
                        y2="-8"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <line
                        x1="-3"
                        y1="0"
                        x2="3"
                        y2="0"
                        stroke="url(#footerOSGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#glowFooter)"
                      />
                      <circle
                        cx="-6"
                        cy="6"
                        r="1.5"
                        fill="#818cf8"
                        opacity="0.7"
                      />
                      <circle
                        cx="6"
                        cy="6"
                        r="1.5"
                        fill="#a78bfa"
                        opacity="0.7"
                      />
                    </g>
                  </svg>
                  <span className="font-bold text-gradient group-hover:animate-pulse">
                    AeThex
                  </span>
                </div>
                <p className="text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                  Pushing the boundaries of technology through cutting-edge
                  research and breakthrough discoveries.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    Queen Creek, Arizona
                  </p>
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    <a
                      href="mailto:info@aethex.biz"
                      className="transition-colors"
                      style={{
                        color: "var(--muted-foreground)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--muted-foreground)")
                      }
                    >
                      info@aethex.biz
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `${theme.accentHex}B3` }}
                    />
                    (346) 556-7100
                  </p>
                </div>
              </div>

              {/* Services */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Services
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/gameforge"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Game Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/corp"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Development Consulting
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mentorship"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Mentorship Programs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/research"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{
                        color: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Research & Labs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Company
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/about"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      About AeThex
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunities"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/community"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Community Hub
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/changelog"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/status"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      System Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/investors"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Investors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                  Resources
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/docs"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tutorials"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trust"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Transparency
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/press"
                      onClick={scrollToTop}
                      className="transition-all duration-300 hover:translate-x-1 inline-block"
                      style={{ color: "inherit" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = theme.accentHex)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "inherit")
                      }
                    >
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center animate-fade-in transition-all duration-200"
              style={{
                animationDelay: "0.4s",
                borderTopColor: theme.accentHex,
                borderTopWidth: "1px",
              }}
            >
              <p className="text-xs text-muted-foreground transition-colors">
                © 2024 AeThex Corporation. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground transition-all duration-300 hover:scale-105"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.accentHex)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "inherit")
                  }
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground transition-all duration-300 hover:scale-105"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.accentHex)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "inherit")
                  }
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Supabase Configuration Status */}
      <SupabaseStatus />

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
