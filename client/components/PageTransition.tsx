import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

const getArmMessage = (pathname: string): string => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return "Initializing Research Module...";
  }
  if (pathname.includes("/game-development")) {
    return "Booting GameForge Engine...";
  }
  if (pathname.includes("/consulting")) {
    return "Engaging Corp Systems...";
  }
  if (pathname.includes("/community")) {
    return "Connecting Foundation Network...";
  }
  if (pathname.includes("/dev-link")) {
    return "Loading Dev-Link Platform...";
  }
  return "Initializing AeThex OS...";
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const message = getArmMessage(location.pathname);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
      {!visible && <LoadingScreen message={message} variant="overlay" />}
      <div
        className={`transition-opacity duration-300 ease-out transform-gpu will-change-[opacity] ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
