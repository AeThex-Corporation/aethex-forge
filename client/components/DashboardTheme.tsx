import { ReactNode } from "react";

export type ArmKey =
  | "nexus"
  | "corp"
  | "foundation"
  | "gameforge"
  | "labs"
  | "devlink"
  | "staff";

interface ThemeConfig {
  arm: ArmKey;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  tabsListBg: string;
  headerGradient: string;
  fontFamily?: string;
  fontStyle?: string;
}

const themeConfig: Record<ArmKey, ThemeConfig> = {
  nexus: {
    arm: "nexus",
    primaryColor: "purple",
    secondaryColor: "blue",
    accentColor: "purple-500",
    bgGradient: "from-black via-purple-950/20 to-black",
    borderColor: "purple-500/20",
    tabsListBg: "purple-950/30",
    headerGradient: "from-purple-300 via-blue-300 to-purple-300",
    fontFamily: "font-sans",
  },
  corp: {
    arm: "corp",
    primaryColor: "blue",
    secondaryColor: "cyan",
    accentColor: "blue-500",
    bgGradient: "from-black via-blue-950/20 to-black",
    borderColor: "blue-500/20",
    tabsListBg: "blue-950/30",
    headerGradient: "from-blue-300 via-cyan-300 to-blue-300",
    fontFamily: "font-sans",
  },
  foundation: {
    arm: "foundation",
    primaryColor: "red",
    secondaryColor: "orange",
    accentColor: "red-500",
    bgGradient: "from-black via-red-950/20 to-black",
    borderColor: "red-500/20",
    tabsListBg: "red-950/30",
    headerGradient: "from-red-300 via-orange-300 to-red-300",
    fontFamily: "font-serif",
  },
  gameforge: {
    arm: "gameforge",
    primaryColor: "green",
    secondaryColor: "emerald",
    accentColor: "green-500",
    bgGradient: "from-black via-green-950/20 to-black",
    borderColor: "green-500/20",
    tabsListBg: "green-950/30",
    headerGradient: "from-green-300 to-emerald-300",
    fontFamily: "font-mono",
    fontStyle: "retro",
  },
  labs: {
    arm: "labs",
    primaryColor: "amber",
    secondaryColor: "yellow",
    accentColor: "amber-500",
    bgGradient: "from-black via-amber-950/20 to-black",
    borderColor: "amber-500/20",
    tabsListBg: "amber-950/30",
    headerGradient: "from-amber-300 to-yellow-300",
    fontFamily: "font-mono",
  },
  devlink: {
    arm: "devlink",
    primaryColor: "cyan",
    secondaryColor: "blue",
    accentColor: "cyan-500",
    bgGradient: "from-black via-cyan-950/20 to-black",
    borderColor: "cyan-500/20",
    tabsListBg: "cyan-950/30",
    headerGradient: "from-cyan-300 to-blue-300",
    fontFamily: "font-sans",
  },
  staff: {
    arm: "staff",
    primaryColor: "purple",
    secondaryColor: "pink",
    accentColor: "purple-500",
    bgGradient: "from-black via-purple-950/20 to-black",
    borderColor: "purple-500/20",
    tabsListBg: "purple-950/30",
    headerGradient: "from-purple-300 to-pink-300",
    fontFamily: "font-sans",
  },
};

export function getTheme(arm: ArmKey): ThemeConfig {
  return themeConfig[arm];
}

interface DashboardThemeProviderProps {
  arm: ArmKey;
  children: ReactNode;
}

export function DashboardThemeProvider({
  arm,
  children,
}: DashboardThemeProviderProps) {
  const theme = getTheme(arm);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} ${theme.fontFamily}`}
    >
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  arm: ArmKey;
  title: string;
  subtitle?: string;
}

export function DashboardHeader({
  arm,
  title,
  subtitle,
}: DashboardHeaderProps) {
  const theme = getTheme(arm);

  return (
    <div className="space-y-4 animate-slide-down">
      <div className="space-y-2">
        <h1
          className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.headerGradient} bg-clip-text text-transparent`}
        >
          {title}
        </h1>
        {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}

interface ColorPaletteConfig {
  arm: ArmKey;
  variant?: "default" | "alt";
}

export function getColorClasses(
  arm: ArmKey,
  variant: "default" | "alt" = "default",
) {
  const configs: Record<ArmKey, Record<string, Record<string, string>>> = {
    nexus: {
      default: {
        card: "bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20",
        cardAlt: "from-blue-950/40 to-blue-900/20 border-blue-500/20",
        text: "text-purple-300",
        border: "border-purple-500/20",
        accent: "bg-purple-600 hover:bg-purple-700",
      },
      alt: {
        card: "bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20",
        cardAlt: "from-purple-950/40 to-purple-900/20 border-purple-500/20",
        text: "text-blue-300",
        border: "border-blue-500/20",
        accent: "bg-blue-600 hover:bg-blue-700",
      },
    },
    corp: {
      default: {
        card: "bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20",
        cardAlt: "from-cyan-950/40 to-cyan-900/20 border-cyan-500/20",
        text: "text-blue-300",
        border: "border-blue-500/20",
        accent: "bg-blue-600 hover:bg-blue-700",
      },
      alt: {
        card: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20",
        cardAlt: "from-blue-950/40 to-blue-900/20 border-blue-500/20",
        text: "text-cyan-300",
        border: "border-cyan-500/20",
        accent: "bg-cyan-600 hover:bg-cyan-700",
      },
    },
    foundation: {
      default: {
        card: "bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20",
        cardAlt: "from-orange-950/40 to-orange-900/20 border-orange-500/20",
        text: "text-red-300",
        border: "border-red-500/20",
        accent: "bg-red-600 hover:bg-red-700",
      },
      alt: {
        card: "bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20",
        cardAlt: "from-red-950/40 to-red-900/20 border-red-500/20",
        text: "text-orange-300",
        border: "border-orange-500/20",
        accent: "bg-orange-600 hover:bg-orange-700",
      },
    },
    gameforge: {
      default: {
        card: "bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20",
        cardAlt: "from-emerald-950/40 to-emerald-900/20 border-emerald-500/20",
        text: "text-green-300",
        border: "border-green-500/20",
        accent: "bg-green-600 hover:bg-green-700",
      },
      alt: {
        card: "bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/20",
        cardAlt: "from-green-950/40 to-green-900/20 border-green-500/20",
        text: "text-emerald-300",
        border: "border-emerald-500/20",
        accent: "bg-emerald-600 hover:bg-emerald-700",
      },
    },
    labs: {
      default: {
        card: "bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20",
        cardAlt: "from-yellow-950/40 to-yellow-900/20 border-yellow-500/20",
        text: "text-amber-300",
        border: "border-amber-500/20",
        accent: "bg-amber-600 hover:bg-amber-700",
      },
      alt: {
        card: "bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20",
        cardAlt: "from-amber-950/40 to-amber-900/20 border-amber-500/20",
        text: "text-yellow-300",
        border: "border-yellow-500/20",
        accent: "bg-yellow-600 hover:bg-yellow-700",
      },
    },
    devlink: {
      default: {
        card: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20",
        cardAlt: "from-blue-950/40 to-blue-900/20 border-blue-500/20",
        text: "text-cyan-300",
        border: "border-cyan-500/20",
        accent: "bg-cyan-600 hover:bg-cyan-700",
      },
      alt: {
        card: "bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20",
        cardAlt: "from-cyan-950/40 to-cyan-900/20 border-cyan-500/20",
        text: "text-blue-300",
        border: "border-blue-500/20",
        accent: "bg-blue-600 hover:bg-blue-700",
      },
    },
    staff: {
      default: {
        card: "bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20",
        cardAlt: "from-pink-950/40 to-pink-900/20 border-pink-500/20",
        text: "text-purple-300",
        border: "border-purple-500/20",
        accent: "bg-purple-600 hover:bg-purple-700",
      },
      alt: {
        card: "bg-gradient-to-br from-pink-950/40 to-pink-900/20 border-pink-500/20",
        cardAlt: "from-purple-950/40 to-purple-900/20 border-purple-500/20",
        text: "text-pink-300",
        border: "border-pink-500/20",
        accent: "bg-pink-600 hover:bg-pink-700",
      },
    },
  };

  return configs[arm][variant];
}

export default {
  getTheme,
  getColorClasses,
  DashboardThemeProvider,
  DashboardHeader,
};
