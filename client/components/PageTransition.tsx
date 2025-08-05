import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && (
        <LoadingScreen message="Transitioning..." variant="overlay" size="md" />
      )}
      <div
        className={`transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
