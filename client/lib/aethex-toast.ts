import { toast } from "@/hooks/use-toast";

interface AethexToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const aethexToast = {
  success: (options: AethexToastOptions) => {
    return toast({
      title: `✅ ${options.title || "Success"}`,
      description: options.description,
      duration: options.duration || 5000,
      variant: "success" as any,
    });
  },

  error: (options: AethexToastOptions) => {
    return toast({
      title: `⚡ ${options.title || "Error"}`,
      description: options.description,
      duration: options.duration || 5000,
      variant: "destructive",
    });
  },

  warning: (options: AethexToastOptions) => {
    return toast({
      title: `⚠️ ${options.title || "Warning"}`,
      description: options.description,
      duration: options.duration || 5000,
      variant: "warning" as any,
    });
  },

  info: (options: AethexToastOptions) => {
    return toast({
      title: `ℹ️ ${options.title || "Information"}`,
      description: options.description,
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

  system: (message: string) => {
    return toast({
      title: "🔧 AeThex OS",
      description: message,
      duration: 4000,
      variant: "aethex" as any,
    });
  },
};
