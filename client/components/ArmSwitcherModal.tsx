import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Arm {
  id: string;
  label: string;
  color: string;
  bgGradient: string;
  textColor: string;
  href: string;
  icon: string;
  tip: string;
}

const ARMS: Arm[] = [
  {
    id: "staff",
    label: "Admin",
    color: "#7c3aed",
    bgGradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    href: "/admin",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
    tip: "Admin panel & staff management",
  },
  {
    id: "labs",
    label: "Labs",
    color: "#FBBF24",
    bgGradient: "from-yellow-600 to-yellow-400",
    textColor: "text-yellow-400",
    href: "/labs",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800",
    tip: "R&D pushing innovation boundaries",
  },
  {
    id: "gameforge",
    label: "GameForge",
    color: "#22C55E",
    bgGradient: "from-green-600 to-green-400",
    textColor: "text-green-400",
    href: "/gameforge",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
    tip: "Games shipped monthly at speed",
  },
  {
    id: "corp",
    label: "Corp",
    color: "#3B82F6",
    bgGradient: "from-blue-600 to-blue-400",
    textColor: "text-blue-400",
    href: "/corp",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
    tip: "Enterprise solutions for scale",
  },
  {
    id: "foundation",
    label: "Foundation",
    color: "#EF4444",
    bgGradient: "from-red-600 to-red-400",
    textColor: "text-red-400",
    href: "/foundation",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
    tip: "Community & education initiatives",
  },
  {
    id: "devlink",
    label: "Dev-Link",
    color: "#06B6D4",
    bgGradient: "from-cyan-600 to-cyan-400",
    textColor: "text-cyan-400",
    href: "/dev-link",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
    tip: "Professional network for creators",
  },
  {
    id: "nexus",
    label: "Nexus",
    color: "#A855F7",
    bgGradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    href: "/nexus",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
    tip: "Talent marketplace & collaboration",
  },
];

interface ArmSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArmSwitcherModal({
  isOpen,
  onClose,
}: ArmSwitcherModalProps) {
  const navigate = useNavigate();
  const [selectedArm, setSelectedArm] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSelectArm = (armId: string) => {
    setSelectedArm(armId);
  };

  const handleProceed = () => {
    if (selectedArm) {
      const arm = ARMS.find((a) => a.id === selectedArm);
      if (arm) {
        setIsNavigating(true);
        setTimeout(() => {
          navigate(arm.href);
          onClose();
          setSelectedArm(null);
          setIsNavigating(false);
        }, 600);
      }
    }
  };

  const handleBack = () => {
    if (selectedArm) {
      setSelectedArm(null);
    } else {
      onClose();
    }
  };

  const selectedArmData = selectedArm
    ? ARMS.find((a) => a.id === selectedArm)
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="w-full sm:max-w-sm bg-gray-950/95 border border-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[600px]" style={{ animation: 'slideUp 0.3s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-800/50 flex-shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {selectedArm ? "Back" : "Close"}
          </button>
          <h1 className="text-xs font-semibold text-white">
            {selectedArm ? selectedArmData?.label : "Select Arm"}
          </h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-start flex-1 min-h-0">
          {!selectedArm ? (
            // Arm Grid - Minimal
            <div className="w-full space-y-0.5 sm:space-y-1">
              {ARMS.map((arm) => (
                <button
                  key={arm.id}
                  type="button"
                  onClick={() => handleSelectArm(arm.id)}
                  className="w-full p-2 sm:p-3 rounded-lg border border-gray-700/50 bg-gray-900/30 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={arm.icon}
                      alt={arm.label}
                      className="w-8 h-8 object-contain group-hover:scale-110 transition-transform flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-xs sm:text-sm ${arm.textColor}`}>
                        {arm.label}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate">{arm.tip}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : selectedArmData && !isNavigating ? (
            // Landing Page - Minimal
            <div className="w-full space-y-6 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${selectedArmData.bgGradient} p-4`}
                  style={{
                    boxShadow: `0 0 40px ${selectedArmData.color}40`,
                  }}
                >
                  <img
                    src={selectedArmData.icon}
                    alt={selectedArmData.label}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Title & Tip */}
              <div className="space-y-3">
                <h2 className={`text-3xl font-bold ${selectedArmData.textColor}`}>
                  {selectedArmData.label}
                </h2>
                <p className="text-sm text-gray-400">{selectedArmData.tip}</p>
              </div>

              {/* Progress Bars */}
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`${selectedArmData.textColor.replace("text-", "bg-")} rounded-full opacity-80`}
                    style={{
                      width: "8px",
                      height: `${16 + i * 8}px`,
                      animation: "pulse 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Loading State
            <div className="w-full space-y-6 text-center">
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`${selectedArmData?.textColor.replace("text-", "bg-") || "bg-purple-400"} rounded-full`}
                    style={{
                      width: "8px",
                      height: `${16 + i * 8}px`,
                      animation: "pulse 1s ease-in-out infinite",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">Initializing...</p>
            </div>
          )}
        </div>

        {/* Footer - Buttons */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-800/50 space-y-2 flex-shrink-0">
          {selectedArm && !isNavigating ? (
            <>
              <button
                type="button"
                onClick={handleProceed}
                className={`w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 text-white bg-gradient-to-r ${selectedArmData?.bgGradient} hover:shadow-lg active:scale-95`}
              >
                Proceed to {selectedArmData?.label}
              </button>
              <button
                type="button"
                onClick={() => setSelectedArm(null)}
                className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 text-gray-300 bg-gray-800/40 hover:bg-gray-700/40 active:scale-95"
              >
                Choose Different
              </button>
            </>
          ) : !isNavigating ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 text-gray-300 bg-gray-800/40 hover:bg-gray-700/40 active:scale-95"
            >
              Close
            </button>
          ) : null}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.4;
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @media (min-width: 640px) {
            @keyframes slideUp {
              from {
                transform: scale(0.95);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          }
        `}</style>
      </div>
    </div>
  );
}
