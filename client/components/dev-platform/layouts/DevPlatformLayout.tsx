import React from "react";
import { cn } from "@/lib/utils";
import { DevPlatformNav } from "../DevPlatformNav";
import { DevPlatformFooter } from "../DevPlatformFooter";

export interface DevPlatformLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function DevPlatformLayout({
  children,
  className,
  hideNav = false,
  hideFooter = false,
}: DevPlatformLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <DevPlatformNav />}
      
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      {!hideFooter && <DevPlatformFooter />}
    </div>
  );
}
