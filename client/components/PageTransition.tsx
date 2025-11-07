import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

const getArmConfig = (
  pathname: string,
): { message: string; accentColor: string; armLogo?: string } => {
  if (pathname.includes("/labs") || pathname.includes("/research")) {
    return {
      message: "Initializing Research Module...",
      accentColor: "from-yellow-500 to-yellow-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800",
    };
  }
  if (pathname.includes("/game-development")) {
    return {
      message: "Booting GameForge Engine...",
      accentColor: "from-green-500 to-green-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
    };
  }
  if (pathname.includes("/consulting")) {
    return {
      message: "Engaging Corp Systems...",
      accentColor: "from-blue-500 to-blue-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
    };
  }
  if (pathname.includes("/community")) {
    return {
      message: "Connecting Foundation Network...",
      accentColor: "from-red-500 to-red-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
    };
  }
  if (pathname.includes("/dev-link")) {
    return {
      message: "Loading Dev-Link Platform...",
      accentColor: "from-cyan-500 to-cyan-400",
      armLogo: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
    };
  }
  return {
    message: "Initializing AeThex OS...",
    accentColor: "from-aethex-500 to-neon-blue",
  };
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const config = getArmConfig(location.pathname);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
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
