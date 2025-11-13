import React, { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";

export type ArmType =
  | "labs"
  | "gameforge"
  | "corp"
  | "foundation"
  | "devlink"
  | "staff"
  | "nexus"
  | "default";

export interface ArmTheme {
  arm: ArmType;
  accentColor: string; // Tailwind color class
  accentHex: string; // Raw hex for SVG/canvas
  wallpaperClass: string; // CSS class for subtle background pattern
  wallpaperPattern: string; // SVG pattern or gradient description
  fontClass: string; // Font family class
  fontFamily: string; // CSS font-family value
  displayName: string;
}

const THEMES: Record<ArmType, ArmTheme> = {
  labs: {
    arm: "labs",
    accentColor: "from-yellow-500 to-yellow-400",
    accentHex: "#fbbf24",
    wallpaperClass: "wallpaper-labs",
    wallpaperPattern:
      "radial-gradient(circle, rgba(251, 191, 36, 0.08) 1px, transparent 1px)",
    fontClass: "font-labs",
    fontFamily: '"VT323", "Courier New", monospace',
    displayName: "Labs",
  },
  gameforge: {
    arm: "gameforge",
    accentColor: "from-green-500 to-green-400",
    accentHex: "#22c55e",
    wallpaperClass: "wallpaper-gameforge",
    wallpaperPattern:
      "linear-gradient(45deg, rgba(34, 197, 94, 0.06) 25%, transparent 25%, transparent 75%, rgba(34, 197, 94, 0.06) 75%), linear-gradient(45deg, rgba(34, 197, 94, 0.06) 25%, transparent 25%, transparent 75%, rgba(34, 197, 94, 0.06) 75%)",
    fontClass: "font-gameforge",
    fontFamily: '"Press Start 2P", "Arial Black", sans-serif',
    displayName: "GameForge",
  },
  corp: {
    arm: "corp",
    accentColor: "from-blue-500 to-blue-400",
    accentHex: "#3b82f6",
    wallpaperClass: "wallpaper-corp",
    wallpaperPattern:
      "linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
    fontClass: "font-corp",
    fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    displayName: "Corp",
  },
  foundation: {
    arm: "foundation",
    accentColor: "from-red-500 to-red-400",
    accentHex: "#ef4444",
    wallpaperClass: "wallpaper-foundation",
    wallpaperPattern:
      "repeating-linear-gradient(0deg, rgba(239, 68, 68, 0.04) 0px, rgba(239, 68, 68, 0.04) 1px, transparent 1px, transparent 2px)",
    fontClass: "font-foundation",
    fontFamily: '"Merriweather", "Georgia", serif',
    displayName: "Foundation",
  },
  devlink: {
    arm: "devlink",
    accentColor: "from-cyan-500 to-cyan-400",
    accentHex: "#06b6d4",
    wallpaperClass: "wallpaper-devlink",
    wallpaperPattern:
      "linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.08) 25%, rgba(6, 182, 212, 0.08) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.08) 75%, rgba(6, 182, 212, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.08) 25%, rgba(6, 182, 212, 0.08) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.08) 75%, rgba(6, 182, 212, 0.08) 76%, transparent 77%, transparent)",
    fontClass: "font-devlink",
    fontFamily: '"Roboto Mono", "Courier New", monospace',
    displayName: "Dev-Link",
  },
  staff: {
    arm: "staff",
    accentColor: "from-purple-500 to-purple-400",
    accentHex: "#a855f7",
    wallpaperClass: "wallpaper-staff",
    wallpaperPattern:
      "radial-gradient(circle, rgba(168, 85, 247, 0.08) 1px, transparent 1px)",
    fontClass: "font-staff",
    fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    displayName: "Staff",
  },
  nexus: {
    arm: "nexus",
    accentColor: "from-pink-500 to-pink-400",
    accentHex: "#ec4899",
    wallpaperClass: "wallpaper-nexus",
    wallpaperPattern:
      "linear-gradient(45deg, rgba(236, 72, 153, 0.06) 25%, transparent 25%, transparent 75%, rgba(236, 72, 153, 0.06) 75%), linear-gradient(45deg, rgba(236, 72, 153, 0.06) 25%, transparent 25%, transparent 75%, rgba(236, 72, 153, 0.06) 75%)",
    fontClass: "font-nexus",
    fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    displayName: "Nexus",
  },
  default: {
    arm: "default",
    accentColor: "from-aethex-500 to-neon-blue",
    accentHex: "#a78bfa",
    wallpaperClass: "wallpaper-default",
    wallpaperPattern: "none",
    fontClass: "font-default",
    fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    displayName: "AeThex",
  },
};

const detectArmFromPath = (pathname: string): ArmType => {
  if (pathname.includes("/labs")) return "labs";
  if (pathname.includes("/gameforge")) return "gameforge";
  if (pathname.includes("/corp")) return "corp";
  if (pathname.includes("/foundation")) return "foundation";
  if (pathname.includes("/dev-link")) return "devlink";
  if (pathname.includes("/staff")) return "staff";
  if (pathname.includes("/nexus")) return "nexus";
  return "default";
};

interface ArmThemeContextType {
  theme: ArmTheme;
  currentArm: ArmType;
}

const ArmThemeContext = createContext<ArmThemeContextType | undefined>(
  undefined
);

export function ArmThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const currentArm = detectArmFromPath(location.pathname);
  const theme = THEMES[currentArm];

  return (
    <ArmThemeContext.Provider value={{ theme, currentArm }}>
      {children}
    </ArmThemeContext.Provider>
  );
}

export function useArmTheme(): ArmThemeContextType {
  const context = useContext(ArmThemeContext);
  if (!context) {
    throw new Error("useArmTheme must be used within ArmThemeProvider");
  }
  return context;
}
