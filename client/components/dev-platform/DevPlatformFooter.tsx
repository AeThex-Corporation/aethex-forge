import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, Twitter, MessageCircle, Heart } from "lucide-react";

export interface DevPlatformFooterProps {
  className?: string;
}

export function DevPlatformFooter({ className }: DevPlatformFooterProps) {
  const currentYear = new Date().getFullYear();

  const ecosystemLinks = [
    { name: "aethex.net", href: "https://aethex.net", description: "Game Development Hub" },
    { name: "aethex.info", href: "https://aethex.info", description: "Company & Philosophy" },
    { name: "aethex.foundation", href: "https://aethex.foundation", description: "Non-Profit Guardian" },
    { name: "aethex.studio", href: "https://aethex.studio", description: "R&D Skunkworks" },
  ];

  const resourceLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api-reference" },
    { name: "SDK", href: "/sdk" },
    { name: "Templates", href: "/templates" },
    { name: "Changelog", href: "/changelog" },
    { name: "Status", href: "/status" },
  ];

  const communityLinks = [
    { name: "Creators", href: "/creators" },
    { name: "Community", href: "/community" },
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/support" },
  ];

  const companyLinks = [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Trust & Security", href: "/trust" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/AeThex-Corporation", icon: Github },
    { name: "Twitter", href: "https://twitter.com/aethexcorp", icon: Twitter },
    { name: "Discord", href: "https://discord.gg/aethex", icon: MessageCircle },
  ];

  return (
    <footer
      className={cn(
        "border-t border-border/40 bg-background",
        className
      )}
    >
      <div className="container py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Branding */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                aethex<span className="text-primary">.dev</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The complete developer platform for building cross-platform games with AeThex.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AeThex Ecosystem */}
        <div className="mt-12 border-t border-border/40 pt-8">
          <h3 className="text-sm font-semibold mb-4">AeThex Ecosystem</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystemLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-border/40 p-4 transition-colors hover:border-border hover:bg-accent/50"
              >
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {link.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {link.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} AeThex Corporation. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with
            <Heart className="h-3 w-3 fill-primary text-primary" />
            by AeThex
          </p>
        </div>
      </div>
    </footer>
  );
}
