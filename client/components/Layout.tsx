import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SupabaseStatus from "./SupabaseStatus";
import { useAuth } from "@/contexts/AuthContext";
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

export default function CodeLayout({ children, hideFooter }: LayoutProps) {
  const location = useLocation();
  const { user, profile, roles, signOut, loading, profileComplete } = useAuth();
  const isOwner = Array.isArray(roles) && roles.includes("owner");

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/onboarding" },
    { name: "Engage", href: "/engage" },
    { name: "Developers", href: "/developers" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Feed", href: "/feed" },
    { name: "Engage", href: "/engage" },
    { name: "Developers", href: "/developers" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const passportHref = profile?.username
    ? `/passport/${profile.username}`
    : "/passport/me";

  const navItems = user ? userNavigation : navigation;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-aethex-gradient">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-2 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-glow group shrink-0">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=800"
                alt="AeThex Logo"
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="text-xl font-bold text-gradient group-hover:animate-pulse">
                AeThex
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center flex-1 mx-3 overflow-x-auto">
            <div className="flex items-center gap-6 flex-nowrap whitespace-nowrap">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={scrollToTop}
                  className={cn(
                    "relative shrink-0 px-1 text-sm font-medium transition-colors duration-200 hover:text-aethex-400",
                    location.pathname === item.href
                      ? "text-aethex-500"
                      : "text-muted-foreground",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-aethex-400 to-neon-blue" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

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
                  className="bg-background/95 backdrop-blur-xl border-border/40"
                >
                  <SheetHeader className="text-left">
                    <SheetTitle>Navigate AeThex</SheetTitle>
                    <SheetDescription>
                      Access any section without leaving your flow.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link
                          to={item.href}
                          onClick={scrollToTop}
                          className={cn(
                            "flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-base font-medium transition-colors",
                            location.pathname === item.href
                              ? "bg-aethex-500/15 text-aethex-200"
                              : "text-muted-foreground hover:border-aethex-400/40 hover:text-aethex-300",
                          )}
                        >
                          <span>{item.name}</span>
                          {location.pathname === item.href && (
                            <span className="text-xs font-semibold uppercase tracking-widest text-aethex-300">
                              Active
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-8 space-y-3 border-t border-border/40 pt-4">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-border/40" />
                        <div className="h-4 w-24 animate-pulse rounded bg-border/40" />
                      </div>
                    ) : user ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            onClick={scrollToTop}
                            className="block rounded-lg bg-gradient-to-r from-aethex-500 to-neon-blue px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-aethex-500/20"
                          >
                            Go to Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/profile"
                            onClick={scrollToTop}
                            className="block rounded-lg border border-border/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-aethex-400/40 hover:text-aethex-200"
                          >
                            View Profile
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard?tab=profile#settings"
                            onClick={scrollToTop}
                            className="block rounded-lg border border-border/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-aethex-400/40 hover:text-aethex-200"
                          >
                            Account Settings
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            type="button"
                            className="flex w-full items-center justify-start rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => signOut()}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
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
                            className="block rounded-lg bg-gradient-to-r from-aethex-500 to-neon-blue px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-aethex-500/20"
                          >
                            Join AeThex
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/login"
                            onClick={scrollToTop}
                            className="block rounded-lg border border-border/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-aethex-400/40 hover:text-aethex-200"
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
                          {isOwner && (
                            <DropdownMenuItem asChild>
                              <Link to="/admin" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Admin Panel
                              </Link>
                            </DropdownMenuItem>
                          )}
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center space-x-3 group">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=800"
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
                    to="/game-development"
                    onClick={scrollToTop}
                    className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Game Development
                  </Link>
                </li>
                <li>
                  <Link
                    to="/consulting"
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
    </div>
  );
}
