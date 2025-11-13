import { toast } from "@/hooks/use-toast";

interface AethexToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  accentColor?: string;
}

export const aethexToast = {
  success: (options: AethexToastOptions) => {
    const normalize = (d?: any) => {
      if (d == null) return undefined;
      if (typeof d === "string") return d;
      if (typeof d === "object") {
        if ((d as any).message) return String((d as any).message);
        try {
          return JSON.stringify(d);
        } catch (e) {
          return String(d);
        }
      }
      return String(d);
    };
    return toast({
      title: `✅ ${options.title || "Success"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "success" as any,
    });
  },

  error: (options: AethexToastOptions) => {
    const normalize = (d?: any) => {
      if (d == null) return undefined;
      if (typeof d === "string") return d;
      if (typeof d === "object") {
        if ((d as any).message) return String((d as any).message);
        try {
          return JSON.stringify(d);
        } catch (e) {
          return String(d);
        }
      }
      return String(d);
    };
    return toast({
      title: `⚡ ${options.title || "Error"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "destructive",
    });
  },

  warning: (options: AethexToastOptions) => {
    const normalize = (d?: any) => {
      if (d == null) return undefined;
      if (typeof d === "string") return d;
      if (typeof d === "object") {
        if ((d as any).message) return String((d as any).message);
        try {
          return JSON.stringify(d);
        } catch (e) {
          return String(d);
        }
      }
      return String(d);
    };
    return toast({
      title: `⚠️ ${options.title || "Warning"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "warning" as any,
    });
  },

  info: (options: AethexToastOptions) => {
    const normalize = (d?: any) => {
      if (d == null) return undefined;
      if (typeof d === "string") return d;
      if (typeof d === "object") {
        if ((d as any).message) return String((d as any).message);
        try {
          return JSON.stringify(d);
        } catch (e) {
          return String(d);
        }
      }
      return String(d);
    };
    return toast({
      title: `ℹ️ ${options.title || "Information"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "info" as any,
    });
  },

  aethex: (options: AethexToastOptions) => {
    return toast({
      title: `✨ ${options.title || "AeThex OS"}`,
      description: options.description,
      duration: options.duration || 6000,
      variant: "aethex" as any,
    });
  },

  system: (message: string, accentColor?: string) => {
    // If accentColor is provided, use arm variant
    if (accentColor) {
      return toast({
        title: "🔧 AeThex OS",
        description: message,
        duration: 4000,
        variant: "arm" as any,
        accentColor: accentColor,
      });
    }

    // Otherwise use default aethex variant
    return toast({
      title: "🔧 AeThex OS",
      description: message,
      duration: 4000,
      variant: "aethex" as any,
    });
  },

  arm: (options: AethexToastOptions & { accentColor: string }) => {
    const normalize = (d?: any) => {
      if (d == null) return undefined;
      if (typeof d === "string") return d;
      if (typeof d === "object") {
        if ((d as any).message) return String((d as any).message);
        try {
          return JSON.stringify(d);
        } catch (e) {
          return String(d);
        }
      }
      return String(d);
    };
    return toast({
      title: options.title,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "arm" as any,
      accentColor: options.accentColor,
    });
  },
};
