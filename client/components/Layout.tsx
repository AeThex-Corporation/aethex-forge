import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/onboarding" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-aethex-gradient">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-aethex-400 to-neon-blue flex items-center justify-center">
                <span className="text-sm font-bold text-white">Ae</span>
              </div>
              <span className="text-xl font-bold text-gradient">AeThex</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-aethex-400",
                  location.pathname === item.href
                    ? "text-aethex-500"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90">
              <Link to="/onboarding">Join AeThex</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-gradient-to-br from-aethex-400 to-neon-blue flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Ae</span>
                </div>
                <span className="font-bold text-gradient">AeThex</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pushing the boundaries of technology through cutting-edge research and breakthrough discoveries.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/game-development" className="hover:text-aethex-400 transition-colors">Game Development</Link></li>
                <li><Link to="/consulting" className="hover:text-aethex-400 transition-colors">Development Consulting</Link></li>
                <li><Link to="/mentorship" className="hover:text-aethex-400 transition-colors">Mentorship Programs</Link></li>
                <li><Link to="/research" className="hover:text-aethex-400 transition-colors">Research & Labs</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/docs" className="hover:text-aethex-400 transition-colors">Documentation</Link></li>
                <li><Link to="/blog" className="hover:text-aethex-400 transition-colors">Blog</Link></li>
                <li><Link to="/community" className="hover:text-aethex-400 transition-colors">Community</Link></li>
                <li><Link to="/support" className="hover:text-aethex-400 transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Queen Creek, Arizona</li>
                <li>info@aethex.biz</li>
                <li>(530) 784-1287</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © 2024 AeThex Corporation. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-aethex-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-aethex-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
