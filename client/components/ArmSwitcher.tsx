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

const LOGO_URLS: Record<string, string> = {
  labs: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800",
  gameforge:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
  corp: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
  foundation:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
  devlink:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
};

export default function ArmSwitcher() {
  const navigate = useNavigate();

  const handleArmClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {ARMS.map((arm) => (
        <button
          key={arm.id}
          onClick={() => handleArmClick(arm.href)}
          className="group relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-lg hover:scale-125 transition-transform duration-200"
          title={arm.name}
        >
          <div className={`absolute inset-0 rounded-lg ${arm.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

          <img
            src={LOGO_URLS[arm.id]}
            alt={arm.label}
            className="relative h-10 w-10 sm:h-12 sm:w-12 object-contain transition-all duration-200"
          />

          {/* Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
            {arm.name}
          </div>
        </button>
      ))}
    </div>
  );
}
