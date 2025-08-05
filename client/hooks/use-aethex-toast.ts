import { toast as baseToast } from "@/components/ui/use-toast";
import { Zap, CheckCircle, AlertTriangle, Info, Sparkles } from "lucide-react";

interface AethexToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const useAethexToast = () => {
  const success = (options: AethexToastOptions) => {
    return baseToast({
      title: (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>{options.title || "Success"}</span>
        </div>
      ),
      description: options.description,
      duration: options.duration || 5000,
      variant: "success" as any,
    });
  };

  const error = (options: AethexToastOptions) => {
    return baseToast({
      title: (
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span>{options.title || "Error"}</span>
        </div>
      ),
      description: options.description,
      duration: options.duration || 5000,
      variant: "destructive",
    });
  };

  const warning = (options: AethexToastOptions) => {
    return baseToast({
      title: (
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{options.title || "Warning"}</span>
        </div>
      ),
      description: options.description,
      duration: options.duration || 5000,
      variant: "warning" as any,
    });
  };

  const info = (options: AethexToastOptions) => {
    return baseToast({
      title: (
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>{options.title || "Information"}</span>
        </div>
      ),
      description: options.description,
      duration: options.duration || 5000,
      variant: "info" as any,
    });
  };

  const aethex = (options: AethexToastOptions) => {
    return baseToast({
      title: (
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="text-gradient font-semibold">{options.title || "AeThex OS"}</span>
        </div>
      ),
      description: options.description,
      duration: options.duration || 6000,
      variant: "aethex" as any,
    });
  };

  return {
    success,
    error,
    warning,
    info,
    aethex,
    toast: baseToast, // Fallback to original toast
  };
};