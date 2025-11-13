import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

interface ArmConfig {
  message: string;
  accentColor: string;
  armLogo?: string;
  bootMessage?: string;
}

const getArmConfig = (pathname: string): ArmConfig => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return {
      message: "Initializing Research Module...",
      bootMessage: "Research Subsystem Active",
      accentColor: "from-yellow-500 to-yellow-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800",
    };
  }
  if (pathname.includes("/gameforge")) {
    return {
      message: "Booting GameForge Engine...",
      bootMessage: "GameForge Module Loaded",
      accentColor: "from-green-500 to-green-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
    };
  }
  if (pathname.includes("/corp")) {
    return {
      message: "Engaging Corp Systems...",
      bootMessage: "Corp Systems Online",
      accentColor: "from-blue-500 to-blue-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800",
    };
  }
  if (pathname.includes("/foundation")) {
    return {
      message: "Connecting Foundation Network...",
      bootMessage: "Foundation Network Active",
      accentColor: "from-red-500 to-red-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
    };
  }
  if (pathname.includes("/dev-link")) {
    return {
      message: "Loading Dev-Link Platform...",
      bootMessage: "Dev-Link Interface Ready",
      accentColor: "from-cyan-500 to-cyan-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
    };
  }
  if (pathname.includes("/staff")) {
    return {
      message: "Authorizing Staff Access...",
      bootMessage: "Staff Portal Initialized",
      accentColor: "from-purple-500 to-purple-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
    };
  }
  if (pathname.includes("/nexus")) {
    return {
      message: "Linking Nexus Hub...",
      bootMessage: "Nexus Interface Active",
      accentColor: "from-pink-500 to-pink-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
    };
  }
  return {
    message: "Initializing AeThex OS...",
    bootMessage: "AeThex OS Booting",
    accentColor: "from-aethex-500 to-neon-blue",
  };
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const config = getArmConfig(location.pathname);

  useEffect(() => {
    setIsTransitioning(true);
    setVisible(false);

    const transitionTimer = setTimeout(() => {
      setVisible(true);
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(transitionTimer);
  }, [location.pathname]);

  return (
    <>
      {!visible && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen
            message={config.message}
            variant="overlay"
            accentColor={config.accentColor}
            armLogo={config.armLogo}
            showOSLogo={true}
          />

          {/* OS-style Terminal Boot Text (optional decorative element) */}
          {isTransitioning && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
              <div className="text-xs text-muted-foreground font-mono opacity-60 animate-pulse">
                &gt; {config.bootMessage}...
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`transition-opacity duration-300 ease-out transform-gpu will-change-[opacity] ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
