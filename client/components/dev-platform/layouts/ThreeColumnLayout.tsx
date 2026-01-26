import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar: React.ReactNode;
  aside?: React.ReactNode;
  sidebarClassName?: string;
  asideClassName?: string;
}

/**
 * Three-column layout for documentation and API reference
 * Left: Navigation sidebar
 * Center: Main content
 * Right: Table of contents or code examples (optional)
 */
export function ThreeColumnLayout({
  children,
  className,
  sidebar,
  aside,
  sidebarClassName,
  asideClassName,
}: ThreeColumnLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] md:gap-6 lg:gap-10">
      {/* Left Sidebar - Navigation */}
      <aside
        className={cn(
          "fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r border-border/40 md:sticky md:block",
          sidebarClassName
        )}
      >
        <ScrollArea className="h-full py-6 pr-6">
          {sidebar}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className={cn("relative py-6 lg:gap-10 lg:py-10", className)}>
        <div className="mx-auto w-full min-w-0">
          {children}
        </div>
      </main>

      {/* Right Sidebar - TOC or Code Examples */}
      {aside && (
        <aside
          className={cn(
            "fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 lg:sticky lg:block",
            asideClassName
          )}
        >
          <ScrollArea className="h-full py-6 pl-6 border-l border-border/40">
            {aside}
          </ScrollArea>
        </aside>
      )}
    </div>
  );
}
