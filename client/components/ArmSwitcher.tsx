import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    id: "gameforge",
    name: "AeThex | GameForge",
    label: "GameForge",
    color: "#22C55E",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    href: "/gameforge",
  },
  {
    id: "labs",
    name: "AeThex | Labs",
    label: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    href: "/labs",
  },
  {
    id: "devlink",
    name: "AeThex | Dev-Link",
    label: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
    href: "/dev-link",
  },
  {
    id: "foundation",
    name: "AeThex | Foundation",
    label: "Foundation",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    href: "/foundation",
  },
  {
    id: "corp",
    name: "AeThex | Corp",
    label: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    href: "/corp",
  },
  {
    id: "nexus",
    name: "AeThex | Nexus",
    label: "Nexus",
    color: "#A855F7",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    href: "/nexus",
  },
  {
    id: "staff",
    name: "AeThex | Staff",
    label: "Staff",
    color: "#7c3aed",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    href: "/staff",
  },
];

const LOGO_URLS: Record<string, string> = {
  staff:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
  labs: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800",
  gameforge:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
  corp: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800",
  foundation:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
  devlink:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
  nexus:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
};

export default function ArmSwitcher() {
  const navigate = useNavigate();

  const handleArmClick = (href: string) => {
    navigate(href);
  };

  return (
    <>
      {/* Desktop Version - Horizontal Layout (lg+) */}
      <div className="hidden lg:flex items-center gap-8 xl:gap-12">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm.href)}
            className="group relative h-12 w-12 flex items-center justify-center rounded-lg hover:scale-120 transition-transform duration-200 flex-shrink-0"
            title={arm.name}
          >
            <div
              className={`absolute inset-0 rounded-lg ${arm.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />

            <img
              src={LOGO_URLS[arm.id]}
              alt={arm.label}
              className="relative h-10 w-10 object-contain transition-all duration-200"
            />

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
            </div>
          </button>
        ))}
      </div>

      {/* Tablet Version - Show all arms (md to lg) */}
      <div className="hidden md:flex lg:hidden items-center gap-3">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm.href)}
            className="group relative h-11 w-11 flex items-center justify-center rounded-lg hover:scale-110 transition-transform duration-200 flex-shrink-0"
            title={arm.name}
          >
            <img
              src={LOGO_URLS[arm.id]}
              alt={arm.label}
              className="relative h-7 w-7 object-contain transition-all duration-200"
            />

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Version - Use main logo button for arm selection */}
      {/* Arm selection handled by main logo in Layout.tsx */}
    </>
  );
}
