import React, { createContext, useContext, useState } from "react";

type ThemeType = "professional" | "brand";

interface ThemeColors {
  background: string;
  foreground: string;
  sidebar: string;
  sidebarText: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarActiveBg: string;
  accent: string;
  accentHover: string;
  border: string;
  cardBg: string;
  cardBorder: string;
  buttonBg: string;
  buttonText: string;
  inputBg: string;
  inputBorder: string;
  headingColor: string;
  textMuted: string;
}

const professionalTheme: ThemeColors = {
  background: "bg-white",
  foreground: "text-gray-900",
  sidebar: "bg-gradient-to-b from-gray-50 to-white",
  sidebarText: "text-gray-800",
  sidebarHover: "hover:bg-gray-200",
  sidebarActive: "text-black",
  sidebarActiveBg: "bg-blue-100",
  accent: "text-blue-600",
  accentHover: "hover:text-blue-700",
  border: "border-gray-300",
  cardBg: "bg-gray-50",
  cardBorder: "border-gray-300",
  buttonBg: "bg-black",
  buttonText: "text-white",
  inputBg: "bg-white border border-gray-300",
  inputBorder: "border-gray-300",
  headingColor: "text-gray-900",
  textMuted: "text-gray-700",
};

const brandTheme: ThemeColors = {
  background: "bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950",
  foreground: "text-white",
  sidebar: "bg-slate-900",
  sidebarText: "text-slate-300",
  sidebarHover: "hover:bg-purple-800/30",
  sidebarActive: "text-cyan-400",
  sidebarActiveBg: "bg-purple-900/50",
  accent: "text-cyan-400",
  accentHover: "hover:text-cyan-300",
  border: "border-purple-700",
  cardBg: "bg-slate-800/50",
  cardBorder: "border-purple-700",
  buttonBg: "bg-gradient-to-r from-purple-600 to-cyan-500",
  buttonText: "text-white",
  inputBg: "bg-slate-800/50",
  inputBorder: "border-purple-600",
  headingColor: "text-white",
  textMuted: "text-slate-400",
};

interface DocsThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const DocsThemeContext = createContext<DocsThemeContextType | undefined>(
  undefined,
);

export function DocsThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("professional");

  const colors = theme === "professional" ? professionalTheme : brandTheme;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "professional" ? "brand" : "professional"));
  };

  return (
    <DocsThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme() {
  const context = useContext(DocsThemeContext);
  if (!context) {
    throw new Error("useDocsTheme must be used within DocsThemeProvider");
  }
  return context;
}
