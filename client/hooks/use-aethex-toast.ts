import { toast as baseToast } from "@/components/ui/use-toast";

interface AethexToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const useAethexToast = () => {
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

  const success = (options: AethexToastOptions) => {
    return baseToast({
      title: `✅ ${options.title || "Success"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "success" as any,
    });
  };

  const error = (options: AethexToastOptions) => {
    return baseToast({
      title: `⚡ ${options.title || "Error"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "destructive",
    });
  };

  const warning = (options: AethexToastOptions) => {
    return baseToast({
      title: `⚠️ ${options.title || "Warning"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "warning" as any,
    });
  };

  const info = (options: AethexToastOptions) => {
    return baseToast({
      title: `ℹ️ ${options.title || "Information"}`,
      description: normalize(options.description),
      duration: options.duration || 5000,
      variant: "info" as any,
    });
  };

  const aethex = (options: AethexToastOptions) => {
    return baseToast({
      title: `✨ ${options.title || "AeThex OS"}`,
      description: options.description,
      duration: options.duration || 6000,
      variant: "aethex" as any,
    });
  };

  const system = (message: string) => {
    return baseToast({
      title: "🔧 AeThex OS",
      description: message,
      duration: 4000,
      variant: "aethex" as any,
    });
  };

  return {
    success,
    error,
    warning,
    info,
    aethex,
    system,
    toast: baseToast,
  };
};
