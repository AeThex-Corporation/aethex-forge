import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, X } from "lucide-react";
import ArmSwitcherModal from "./ArmSwitcherModal";

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
    name: "AeThex | Labs",
    label: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    href: "/labs",
  },
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
    id: "corp",
    name: "AeThex | Corp",
    label: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    href: "/corp",
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
    id: "devlink",
    name: "AeThex | Dev-Link",
    label: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
    href: "/dev-link",
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
  nexus:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
};

export default function ArmSwitcher() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleArmClick = (href: string) => {
    navigate(href);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Desktop Version - Horizontal Layout (lg+) */}
      <div className="hidden lg:flex items-center gap-6 sm:gap-10 lg:gap-12">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm.href)}
            className="group relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-lg hover:scale-125 transition-transform duration-200"
            title={arm.name}
          >
            <div
              className={`absolute inset-0 rounded-lg ${arm.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            />

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

      {/* Tablet Version - Spaced Horizontal Layout (md to lg) */}
      <div className="hidden md:flex lg:hidden items-center gap-6 sm:gap-10">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            onClick={() => handleArmClick(arm.href)}
            className="group relative h-12 w-12 flex items-center justify-center rounded-lg hover:scale-125 transition-transform duration-200"
            title={arm.name}
          >
            <img
              src={LOGO_URLS[arm.id]}
              alt={arm.label}
              className="relative h-8 w-8 object-contain transition-all duration-200"
            />

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
              {arm.name}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Version - Expandable Icon (< md) */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative h-12 w-12 flex items-center justify-center rounded-lg transition-all duration-300 ${
            isExpanded
              ? "bg-gradient-to-r from-yellow-500/20 via-green-500/20 to-blue-500/20 scale-110"
              : "bg-gray-700/40 hover:bg-gray-600/50"
          }`}
          title="Toggle Arm Switcher"
        >
          <div
            className={`absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 ${
              isExpanded ? "border-purple-400/50 animate-spin" : ""
            }`}
            style={{
              animation: isExpanded ? "spin 3s linear infinite" : "none",
            }}
          />

          <img
            src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=256&dpr=1&quality=100&sign=6c7576ce&sv=2"
            alt="AeThex Arms"
            className={`relative h-8 w-8 object-contain transition-all duration-300 ${
              isExpanded ? "rotate-180 scale-90" : "rotate-0"
            }`}
          />
        </button>

        {/* Expanded Mobile Menu */}
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />

            {/* Expanded Arms Menu */}
            <div className="absolute top-full right-0 mt-2 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 w-80 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="grid grid-cols-1 gap-3">
                {ARMS.map((arm) => (
                  <button
                    key={arm.id}
                    onClick={() => handleArmClick(arm.href)}
                    className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${arm.bgColor} border border-transparent hover:border-white/20 hover:scale-105`}
                  >
                    <img
                      src={LOGO_URLS[arm.id]}
                      alt={arm.label}
                      className="h-8 w-8 object-contain"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-white">
                        {arm.label}
                      </span>
                      <span className="text-xs text-gray-400">{arm.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
