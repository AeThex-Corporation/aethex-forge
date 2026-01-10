import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Command,
  FileCode,
  BookOpen,
  Code2,
  Package,
  LayoutTemplate,
  Store,
  User,
  Menu,
  X,
} from "lucide-react";

export interface DevPlatformNavProps {
  className?: string;
}

export function DevPlatformNav({ className }: DevPlatformNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const location = useLocation();

  // Command palette keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    {
      name: "Docs",
      href: "/docs",
      icon: BookOpen,
      description: "Guides, tutorials, and API concepts",
    },
    {
      name: "API Reference",
      href: "/api-reference",
      icon: Code2,
      description: "Complete API documentation",
    },
    {
      name: "SDK",
      href: "/sdk",
      icon: Package,
      description: "Download SDKs for all platforms",
    },
    {
      name: "Templates",
      href: "/templates",
      icon: LayoutTemplate,
      description: "Project starters and boilerplates",
    },
    {
      name: "Marketplace",
      href: "/marketplace",
      icon: Store,
      description: "Plugins and extensions (coming soon)",
      comingSoon: true,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link
          to="/"
          className="mr-8 flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <FileCode className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">
            aethex<span className="text-primary">.dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link to={link.href}>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive(link.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.name}
                      {link.comingSoon && (
                        <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                          Soon
                        </span>
                      )}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <Button
              variant="outline"
              size="sm"
              className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-64"
              onClick={() => setSearchOpen(true)}
            >
              <Command className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search...</span>
              <span className="inline-flex lg:hidden">Search</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Dashboard link */}
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>

            {/* User menu */}
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 md:hidden">
          <div className="container space-y-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(link.href) && "bg-accent text-accent-foreground"
                )}
              >
                <link.icon className="mr-3 h-4 w-4" />
                {link.name}
                {link.comingSoon && (
                  <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    Soon
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-border/40 pt-4 mt-4">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette Placeholder - will be implemented separately */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-lg border bg-background p-8 shadow-lg">
              <p className="text-center text-muted-foreground">
                Command palette coming soon...
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Press Esc to close
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
