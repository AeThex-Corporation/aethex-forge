import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  variant?: 'full' | 'overlay' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  duration?: number;
}

export default function LoadingScreen({ 
  message = "Loading...", 
  variant = 'full',
  size = 'md',
  showProgress = false,
  duration = 3000
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (duration / 100));
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showProgress, duration]);

  useEffect(() => {
    const messages = [
      "Initializing AeThex systems...",
      "Loading quantum processors...",
      "Calibrating neural networks...",
      "Synchronizing data streams...",
      "Preparing your experience..."
    ];

    if (variant === 'full') {
      let index = 0;
      const interval = setInterval(() => {
        setCurrentMessage(messages[index % messages.length]);
        index++;
      }, 800);

      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-3">
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 rounded-full border-2 border-aethex-400/30"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-aethex-400 animate-spin"></div>
        </div>
        <span className="text-sm text-muted-foreground animate-pulse">{message}</span>
      </div>
    );
  }

  const containerClasses = variant === 'full' 
    ? "fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
    : "absolute inset-0 bg-background/80 backdrop-blur-sm z-40";

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          {/* Logo Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-aethex-400 to-neon-blue flex items-center justify-center animate-pulse-glow">
                <span className="text-2xl font-bold text-white">Ae</span>
              </div>
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-aethex-400 via-neon-blue to-aethex-600 opacity-30 blur animate-pulse"></div>
            </div>
          </div>

          {/* Animated Loading Bars */}
          <div className="space-y-2">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-aethex-400 rounded-full animate-pulse"
                  style={{
                    height: `${20 + (i * 10)}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-aethex-500 to-neon-blue transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{Math.round(progress)}%</div>
            </div>
          )}

          {/* Loading Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gradient animate-pulse">
              {currentMessage}
            </h3>
            <div className="text-sm text-muted-foreground loading-dots">
              Please wait while we prepare your experience
            </div>
          </div>

          {/* Matrix-style Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-aethex-400 text-xs font-mono animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              >
                {Math.random().toString(2).substr(2, 1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
