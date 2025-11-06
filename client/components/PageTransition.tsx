import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const getArmColor = (
  pathname: string
): {
  color: string;
  glowColor: string;
  shadowColor: string;
} => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return {
      color: "#fbbf24",
      glowColor: "rgba(251, 191, 36, 0.6)",
      shadowColor: "rgba(251, 191, 36, 0.3)",
    };
  }
  if (pathname.includes("/game-development")) {
    return {
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.6)",
      shadowColor: "rgba(34, 197, 94, 0.3)",
    };
  }
  if (pathname.includes("/consulting")) {
    return {
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.6)",
      shadowColor: "rgba(59, 130, 246, 0.3)",
    };
  }
  if (pathname.includes("/community")) {
    return {
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.6)",
      shadowColor: "rgba(239, 68, 68, 0.3)",
    };
  }
  if (pathname.includes("/dev-link")) {
    return {
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.6)",
      shadowColor: "rgba(6, 182, 212, 0.3)",
    };
  }
  return {
    color: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "rgba(255, 255, 255, 0.1)",
  };
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const armColor = getArmColor(location.pathname);

  useEffect(() => {
    setIsTransitioning(true);
    setVisible(false);

    const transitionTimer = setTimeout(() => {
      setVisible(true);
      const visibleTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(visibleTimer);
    }, 50);

    return () => clearTimeout(transitionTimer);
  }, [location.pathname]);

  return (
    <>
      {/* Colored transition overlay */}
      {isTransitioning && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: `radial-gradient(circle at center, ${armColor.glowColor} 0%, transparent 70%)`,
            animation: `transitionPulse 600ms ease-out`,
          }}
        />
      )}

      {/* Main content with fade transition */}
      <div
        className={`transition-all duration-500 ease-out transform-gpu will-change-[opacity,filter] ${
          visible
            ? "opacity-100 blur-none"
            : "opacity-0 blur-sm"
        }`}
        style={{
          filter: visible ? "none" : `drop-shadow(0 0 20px ${armColor.shadowColor})`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes transitionPulse {
          0% {
            opacity: 0;
            background: radial-gradient(
              circle at center,
              ${armColor.glowColor} 0%,
              transparent 50%
            );
          }
          50% {
            opacity: 1;
            background: radial-gradient(
              circle at center,
              ${armColor.glowColor} 0%,
              transparent 70%
            );
          }
          100% {
            opacity: 0;
            background: radial-gradient(
              circle at center,
              ${armColor.glowColor} 0%,
              transparent 100%
            );
          }
        }
      `}</style>
    </>
  );
}
