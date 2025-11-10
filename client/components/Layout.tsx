import { useState } from "react";
import ArmSwitcherModal from "./ArmSwitcherModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SupabaseStatus from "./SupabaseStatus";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const ARMS = [
  { id: "staff", label: "Admin", color: "#7c3aed", href: "/admin" },
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
  corp: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
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
  const [isArmModalOpen, setIsArmModalOpen] = useState(false);

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

  const passportHref = profile?.username
    ? `/passport/${profile.username}`
    : "/passport/me";

  const navItems: { name: string; href: string }[] = [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-aethex-gradient">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
        <div className="container mx-auto max-w-7xl flex min-h-16 h-auto items-center justify-between px-4 py-2 gap-2 min-w-0">
          {/* Logo */}
          <div className="flex items-center shrink-0 relative">
            {/* Desktop - Regular Link */}
            <Link
              to="/"
              className="hover-glow group inline-block hidden sm:block"
            >
              <img
                src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=256&dpr=1&quality=100&sign=6c7576ce&sv=2"
                alt="AeThex Logo"
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
            </Link>

            {/* Mobile - Spinning Logo Button */}
            <button
              type="button"
              onClick={() => setIsArmModalOpen(true)}
              className={`sm:hidden relative h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-aethex-400 ${
                isArmModalOpen
                  ? "bg-gradient-to-r from-yellow-500/40 via-green-500/40 to-blue-500/40 scale-110 shadow-lg shadow-purple-500/50 border-2 border-purple-400/80"
                  : "bg-gradient-to-br from-aethex-600 to-purple-700 hover:from-aethex-500 hover:to-purple-600 shadow-lg shadow-aethex-500/30 border-2 border-aethex-400/40"
              }`}
              title="Select Arm"
            >
              {!isArmModalOpen && (
                <div
                  className="absolute inset-0 rounded-xl border-2 border-aethex-400/60 opacity-60 group-hover:opacity-100"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
              )}
              {isArmModalOpen && (
                <div
                  className="absolute inset-0 rounded-xl border-2 border-purple-400/80 animate-spin"
                  style={{
                    animation: "spin 3s linear infinite",
                  }}
                />
              )}
              <img
                src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=256&dpr=1&quality=100&sign=6c7576ce&sv=2"
                alt="AeThex Logo"
                className={`relative h-8 w-8 transition-all duration-300 z-10 ${
                  isArmModalOpen ? "rotate-180 scale-75" : "rotate-0"
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center flex-1 mx-3" />

          {/* Animated Arm Switcher */}
          <div className="flex items-center shrink-0">
            <ArmSwitcher />
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2 md:gap-4 animate-slide-left shrink-0">
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
                      className="hover-lift"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    {!profileComplete && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift glow-blue"
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
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
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
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Panel
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
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-3 group">
                  <img
                    src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=128&dpr=1&quality=100&sign=6c7576ce&sv=2"
                    alt="AeThex Logo"
                    className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  />
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
                    <span className="h-1.5 w-1.5 rounded-full bg-aethex-400/70" />
                    Queen Creek, Arizona
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-aethex-400/70" />
                    <a
                      href="mailto:info@aethex.biz"
                      className="hover:text-aethex-400 transition-colors"
                    >
                      info@aethex.biz
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-aethex-400/70" />
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
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Game Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/corp"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Development Consulting
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mentorship"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Mentorship Programs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/research"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
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
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      About AeThex
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunities"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/community"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Community Hub
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/changelog"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/status"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      System Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/investors"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
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
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tutorials"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trust"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Transparency
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/press"
                      onClick={scrollToTop}
                      className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="text-xs text-muted-foreground hover:text-aethex-400 transition-colors">
                © 2024 AeThex Corporation. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground hover:text-aethex-400 transition-all duration-300 hover:scale-105"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  onClick={scrollToTop}
                  className="text-xs text-muted-foreground hover:text-aethex-400 transition-all duration-300 hover:scale-105"
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

      {/* Arm Selector Modal - Rendered at root level */}
      <ArmSwitcherModal
        isOpen={isArmModalOpen}
        onClose={() => setIsArmModalOpen(false)}
      />

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
