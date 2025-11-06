import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const getArmGlowColor = (pathname: string): string => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return "rgba(251, 191, 36, 0.15)";
  }
  if (pathname.includes("/game-development")) {
    return "rgba(34, 197, 94, 0.15)";
  }
  if (pathname.includes("/consulting")) {
    return "rgba(59, 130, 246, 0.15)";
  }
  if (pathname.includes("/community")) {
    return "rgba(239, 68, 68, 0.15)";
  }
  if (pathname.includes("/dev-link")) {
    return "rgba(6, 182, 212, 0.15)";
  }
  return "rgba(255, 255, 255, 0)";
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const glowColor = getArmGlowColor(location.pathname);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ease-out transform-gpu will-change-[opacity] ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        boxShadow: visible ? `inset 0 0 80px ${glowColor}` : "none",
      }}
    >
      {children}
    </div>
  );
}
