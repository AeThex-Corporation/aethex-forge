import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

interface Arm {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  href: string;
}

const ARMS: Arm[] = [
  {
    id: "labs",
    name: "Aethex Labs",
    label: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    href: "/labs",
  },
  {
    id: "gameforge",
    name: "GameForge",
    label: "GameForge",
    color: "#22C55E",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    href: "/game-development",
  },
  {
    id: "corp",
    name: "Aethex Corp",
    label: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    href: "/consulting",
  },
  {
    id: "foundation",
    name: "Aethex Foundation",
    label: "Foundation",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    href: "/community",
  },
  {
    id: "devlink",
    name: "Dev-Link",
    label: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
    href: "/dev-link",
  },
];

export default function ArmSwitcher() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isAnimating || isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARMS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAnimating, isHovering]);

  const currentArm = ARMS[currentIndex];

  const handleArmClick = (href: string) => {
    navigate(href);
  };

  return (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => handleArmClick(currentArm.href)}
    >
      {/* Animated Icon Container */}
      <div className="relative h-10 w-10 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-lg ${currentArm.bgColor} transition-all duration-500`}
        />

        {/* Temporary Logo - Simple geometric shape */}
        {currentArm.id === "devlink" ? (
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800"
            alt={currentArm.label}
            className="relative h-8 w-8 rounded transition-all duration-500"
          />
        ) : (
          <div
            className="relative h-8 w-8 rounded flex items-center justify-center font-bold text-white transition-all duration-500"
            style={{ backgroundColor: currentArm.color }}
          >
            {currentArm.label[0].toUpperCase()}
          </div>
        )}

        {/* Animated border indicator */}
        <div
          className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: currentArm.color }}
        />
      </div>

      {/* Text Label - Shows on hover/click or always visible */}
      <div className="hidden sm:flex flex-col gap-0.5 overflow-hidden">
        <div className="text-xs font-semibold text-gray-400 transition-colors duration-500">
          {currentArm.label}
        </div>
        <div
          className={`text-xs font-medium transition-colors duration-500 ${currentArm.textColor}`}
        >
          {currentArm.name}
        </div>
      </div>

      {/* Indicator dots - Shows on mobile */}
      <div className="sm:hidden flex gap-1">
        {ARMS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-3 bg-aethex-400" : "w-1.5 bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Click to navigate
      </div>
    </div>
  );
}
