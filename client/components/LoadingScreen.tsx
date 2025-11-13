import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AeThexOSLogo from "./AeThexOSLogo";

interface LoadingScreenProps {
  message?: string;
  variant?: "full" | "overlay" | "inline";
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  duration?: number;
  accentColor?: string;
  armLogo?: string;
  showOSLogo?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  variant = "full",
  size = "md",
  showProgress = false,
  duration = 3000,
  accentColor = "from-aethex-500 to-neon-blue",
  armLogo,
  showOSLogo = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / (duration / 100);
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showProgress, duration]);

  useEffect(() => {
    const messages = [
      "Initializing AeThex OS...",
      "Loading quantum processors...",
      "Calibrating neural networks...",
      "Synchronizing data streams...",
      "Preparing your experience...",
    ];

    if (variant === "full") {
      let index = 0;
      const interval = setInterval(() => {
        setCurrentMessage(messages[index % messages.length]);
        index++;
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center space-x-3">
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 rounded-full border-2 border-aethex-400/30"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-aethex-400 animate-spin"></div>
        </div>
        <span className="text-sm text-muted-foreground animate-pulse">
          {message}
        </span>
      </div>
    );
  }

  const containerClasses =
    variant === "full"
      ? "fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
      : "absolute inset-0 bg-background/80 backdrop-blur-sm z-40";

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center space-y-12 max-w-2xl mx-auto p-8">
          {/* Large OS Logo with Arm Logo Overlay */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Large OS Frame Background */}
              {showOSLogo && (
                <div className="absolute -inset-8 animate-pulse-glow">
                  <AeThexOSLogo
                    size="xl"
                    variant="default"
                    className="opacity-20"
                  />
                </div>
              )}

              {/* Arm Logo or Default - ENLARGED */}
              <div className={`relative h-32 w-32 rounded-xl bg-gradient-to-br ${
                accentColor.includes("yellow")
                  ? "from-yellow-400 to-yellow-500"
                  : accentColor.includes("green")
                  ? "from-green-400 to-green-500"
                  : accentColor.includes("blue")
                  ? "from-blue-400 to-blue-500"
                  : accentColor.includes("red")
                  ? "from-red-400 to-red-500"
                  : accentColor.includes("cyan")
                  ? "from-cyan-400 to-cyan-500"
                  : accentColor.includes("purple")
                  ? "from-purple-400 to-purple-500"
                  : accentColor.includes("pink")
                  ? "from-pink-400 to-pink-500"
                  : "from-aethex-400 to-neon-blue"
              } flex items-center justify-center animate-pulse-glow p-4 shadow-2xl border-2 border-current border-opacity-30`}>
                {armLogo ? (
                  <img
                    src={armLogo}
                    alt="Arm Logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <AeThexOSLogo
                    size="lg"
                    variant="default"
                    className="opacity-100"
                  />
                )}
              </div>
              <div className={`absolute -inset-4 rounded-xl bg-gradient-to-r ${accentColor} opacity-30 blur-lg animate-pulse`}></div>

              {/* Orbiting Decorative Elements */}
              <div className="absolute -inset-20 pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-3 h-3 rounded-full bg-gradient-to-r ${accentColor} animate-pulse`} style={{ animationDelay: "0s" }} />
                <div className={`absolute top-1/4 right-0 w-3 h-3 rounded-full bg-gradient-to-r ${accentColor} animate-pulse`} style={{ animationDelay: "0.3s" }} />
                <div className={`absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-gradient-to-r ${accentColor} animate-pulse`} style={{ animationDelay: "0.6s" }} />
                <div className={`absolute bottom-0 left-1/3 w-3 h-3 rounded-full bg-gradient-to-r ${accentColor} animate-pulse`} style={{ animationDelay: "0.9s" }} />
              </div>
            </div>
          </div>

          {/* Animated Loading Bars - LARGER */}
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[...Array(8)].map((_, i) => {
                const colorMap: Record<string, string> = {
                  "from-yellow-500 to-yellow-400": "bg-yellow-400",
                  "from-green-500 to-green-400": "bg-green-400",
                  "from-blue-500 to-blue-400": "bg-blue-400",
                  "from-red-500 to-red-400": "bg-red-400",
                  "from-cyan-500 to-cyan-400": "bg-cyan-400",
                  "from-purple-500 to-purple-400": "bg-purple-400",
                  "from-pink-500 to-pink-400": "bg-pink-400",
                  "from-aethex-500 to-neon-blue": "bg-aethex-400",
                };
                const barColor = colorMap[accentColor] || "bg-aethex-400";
                return (
                  <div
                    key={i}
                    className={`w-2 ${barColor} rounded-full animate-pulse`}
                    style={{
                      height: `${16 + i * 8}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "1.2s",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-lg">
                <div
                  className={`h-full bg-gradient-to-r ${accentColor} transition-all duration-300 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>
          )}

          {/* Loading Message - ENLARGED */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient animate-pulse mb-2">
                AeThex OS
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground animate-pulse">
                {currentMessage}
              </h3>
            </div>

            {/* System Status Info */}
            <div className="grid grid-cols-2 gap-4 text-sm font-mono text-muted-foreground bg-background/30 rounded-lg p-4 border border-border/50">
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70">KERNEL</span>
                <span className="text-foreground font-semibold">AeThex v2.0</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-70">STATUS</span>
                <span className="text-foreground font-semibold animate-pulse">BOOTING...</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground loading-dots">
              Please wait while we prepare your experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
