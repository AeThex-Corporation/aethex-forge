import { useArmTheme } from "@/contexts/ArmThemeContext";
import { aethexToast } from "@/lib/aethex-toast";

interface ArmToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useArmToast() {
  const { theme } = useArmTheme();

  return {
    /**
     * Show a toast with the current arm's accent color
     */
    show: (options: ArmToastOptions) => {
      return aethexToast.arm({
        ...options,
        accentColor: theme.accentHex,
      });
    },

    /**
     * Show a success toast with the current arm's accent color
     */
    success: (options: ArmToastOptions) => {
      return aethexToast.arm({
        title: options.title || "Success",
        description: options.description,
        duration: options.duration || 5000,
        accentColor: theme.accentHex,
      });
    },

    /**
     * Show an error toast with the current arm's accent color
     */
    error: (options: ArmToastOptions) => {
      return aethexToast.arm({
        title: options.title || "Error",
        description: options.description,
        duration: options.duration || 5000,
        accentColor: theme.accentHex,
      });
    },

    /**
   * Show a warning toast with the current arm's accent color
   */
  warning: (options: ArmToastOptions) => {
    return aethexToast.arm({
      title: options.title || "Warning",
      description: options.description,
      duration: options.duration || 5000,
      accentColor: theme.accentHex,
    });
  },

  /**
   * Show an AeThex OS system toast with the current arm's accent color
   */
  system: (message: string) => {
    return aethexToast.system(message, theme.accentHex);
  },
};
}
