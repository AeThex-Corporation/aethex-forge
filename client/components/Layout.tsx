import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SupabaseStatus from "./SupabaseStatus";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Bell } from "lucide-react";
import { useEffect } from "react";
import { ensureDemoSeed } from "@/lib/demo-feed";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, profile, roles, signOut, loading } = useAuth();
  const isOwner = Array.isArray(roles) && roles.includes("owner");

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/onboarding" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Feed", href: "/feed" },
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => { try { ensureDemoSeed(); } catch {} }, []);

  return (
    <div className="min-h-screen bg-aethex-gradient">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-glow group">
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
          <nav className="hidden md:flex items-center space-x-8">
            {(() => {
              const navItems = user ? userNavigation : navigation;
              return navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-aethex-400 hover:scale-105 relative animate-fade-in",
                    location.pathname === item.href
                      ? "text-aethex-500 animate-pulse-glow"
                      : "text-muted-foreground",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-aethex-400 to-neon-blue animate-scale-in" />
                  )}
                </Link>
              ));
            })()}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4 animate-slide-left">
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
                    <Button variant="ghost" size="sm" className="hover-lift">
                      <Bell className="h-4 w-4" />
                    </Button>
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
                            <Link to="/dashboard" className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
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

      <main className="flex-1">{children}</main>

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

            {/* Resources */}
            <div
              className="space-y-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
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
                    to="/blog"
                    onClick={scrollToTop}
                    className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    onClick={scrollToTop}
                    className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    onClick={scrollToTop}
                    className="hover:text-aethex-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div
              className="space-y-4 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-semibold text-foreground hover:text-gradient transition-all duration-300">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-aethex-400 transition-colors">
                  Queen Creek, Arizona
                </li>
                <li className="hover:text-aethex-400 transition-colors">
                  info@aethex.biz
                </li>
                <li className="hover:text-aethex-400 transition-colors">
                  (530) 784-1287
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

      {/* Supabase Configuration Status */}
      <SupabaseStatus />
    </div>
  );
}
