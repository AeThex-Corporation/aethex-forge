import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

const getArmConfig = (
  pathname: string
): { message: string; accentColor: string } => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return {
      message: "Initializing Research Module...",
      accentColor: "from-yellow-500 to-yellow-400",
    };
  }
  if (pathname.includes("/game-development")) {
    return {
      message: "Booting GameForge Engine...",
      accentColor: "from-green-500 to-green-400",
    };
  }
  if (pathname.includes("/consulting")) {
    return {
      message: "Engaging Corp Systems...",
      accentColor: "from-blue-500 to-blue-400",
    };
  }
  if (pathname.includes("/community")) {
    return {
      message: "Connecting Foundation Network...",
      accentColor: "from-red-500 to-red-400",
    };
  }
  if (pathname.includes("/dev-link")) {
    return {
      message: "Loading Dev-Link Platform...",
      accentColor: "from-cyan-500 to-cyan-400",
    };
  }
  return {
    message: "Initializing AeThex OS...",
    accentColor: "from-aethex-500 to-neon-blue",
  };
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const config = getArmConfig(location.pathname);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
      {!visible && (
        <LoadingScreen
          message={config.message}
          variant="overlay"
          accentColor={config.accentColor}
        />
      )}
      <div
        className={`transition-opacity duration-300 ease-out transform-gpu will-change-[opacity] ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
