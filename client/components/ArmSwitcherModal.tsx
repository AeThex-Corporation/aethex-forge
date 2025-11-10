import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

interface Arm {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  bgGradient: string;
  textColor: string;
  href: string;
  icon: string;
  tip: string;
}

const ARMS: Arm[] = [
  {
    id: "staff",
    name: "AeThex | Staff",
    label: "Staff",
    color: "#7c3aed",
    bgColor: "bg-purple-500/20",
    bgGradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    href: "/staff",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
    tip: "Internal operations and tools for AeThex employees",
  },
  {
    id: "labs",
    name: "AeThex | Labs",
    label: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    bgGradient: "from-yellow-600 to-yellow-400",
    textColor: "text-yellow-400",
    href: "/labs",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800",
    tip: "Research & Development - Pushing the boundaries of innovation",
  },
  {
    id: "gameforge",
    name: "AeThex | GameForge",
    label: "GameForge",
    color: "#22C55E",
    bgColor: "bg-green-500/20",
    bgGradient: "from-green-600 to-green-400",
    textColor: "text-green-400",
    href: "/gameforge",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
    tip: "Game Development - Shipping games at the speed of thought",
  },
  {
    id: "corp",
    name: "AeThex | Corp",
    label: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    bgGradient: "from-blue-600 to-blue-400",
    textColor: "text-blue-400",
    href: "/corp",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
    tip: "Enterprise Solutions - Consulting for large-scale transformations",
  },
  {
    id: "foundation",
    name: "AeThex | Foundation",
    label: "Foundation",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    bgGradient: "from-red-600 to-red-400",
    textColor: "text-red-400",
    href: "/foundation",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
    tip: "Community & Education - Building open-source and talent pipelines",
  },
  {
    id: "devlink",
    name: "AeThex | Dev-Link",
    label: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    bgGradient: "from-cyan-600 to-cyan-400",
    textColor: "text-cyan-400",
    href: "/dev-link",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
    tip: "Professional Networking - LinkedIn for Roblox developers and creators",
  },
  {
    id: "nexus",
    name: "AeThex | Nexus",
    label: "Nexus",
    color: "#A855F7",
    bgColor: "bg-purple-500/20",
    bgGradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    href: "/nexus",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800",
    tip: "Talent Marketplace - Cross-arm collaboration and opportunities",
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
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = () => {
    if (selectedArm) {
      const arm = ARMS.find((a) => a.id === selectedArm);
      if (arm) {
        setIsLoading(true);
        setTimeout(() => {
          navigate(arm.href);
          onClose();
          setSelectedArm(null);
          setIsLoading(false);
        }, 300);
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
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedArmData?.bgGradient || "from-purple-600 to-blue-600"} opacity-20`} />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_top,rgba(255,255,255,0.1)_0,transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-6 border-b border-gray-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{selectedArm ? "Back" : "Close"}</span>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            {selectedArm ? selectedArmData?.label : "Choose Your Arm"}
          </h1>
          <div className="w-12" />
        </div>

        {/* Body - Arm Grid or Landing Page */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
          {!selectedArm ? (
            // Arm Selection Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {ARMS.map((arm) => (
                <button
                  key={arm.id}
                  onClick={() => setSelectedArm(arm.id)}
                  className={`group p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95 backdrop-blur-sm ${
                    arm.bgColor
                  } border-gray-700 hover:border-white/30`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={arm.icon}
                      alt={arm.label}
                      className="w-16 h-16 object-contain flex-shrink-0 group-hover:scale-110 transition-transform"
                    />
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${arm.textColor} mb-2`}>
                        {arm.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {arm.tip}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-1 ${arm.textColor}`} />
                  </div>
                </button>
              ))}
            </div>
          ) : selectedArmData ? (
            // Arm Landing Page - Fullscreen Sci-Fi Experience
            <div className="max-w-2xl mx-auto space-y-8 py-8">
              {/* Large Logo */}
              <div className="flex justify-center">
                <div
                  className={`w-48 h-48 flex items-center justify-center rounded-3xl bg-gradient-to-br ${selectedArmData.bgGradient} p-8 shadow-2xl glow-effect`}
                  style={{
                    boxShadow: `0 0 60px ${selectedArmData.color}40, inset 0 0 30px ${selectedArmData.color}20`,
                  }}
                >
                  <img
                    src={selectedArmData.icon}
                    alt={selectedArmData.label}
                    className="w-32 h-32 object-contain animate-pulse"
                  />
                </div>
              </div>

              {/* Title and Description */}
              <div className="text-center space-y-4">
                <h2
                  className={`text-4xl sm:text-5xl font-black ${selectedArmData.textColor}`}
                >
                  {selectedArmData.label}
                </h2>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-base sm:text-lg">Initializing {selectedArmData.label} systems...</p>
                </div>
              </div>

              {/* Quick Tip Section */}
              <div
                className={`p-6 rounded-xl border-2 backdrop-blur-sm ${selectedArmData.bgColor} border-gray-700`}
              >
                <div className="flex gap-3">
                  <div className={`text-3xl flex-shrink-0 ${selectedArmData.textColor}`}>
                    ⚡
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedArmData.textColor} mb-2`}>
                      Quick Briefing
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedArmData.tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700 text-center">
                  <div className={`text-2xl mb-2 ${selectedArmData.textColor}`}>🚀</div>
                  <p className="text-sm text-gray-300">Get Started</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700 text-center">
                  <div className={`text-2xl mb-2 ${selectedArmData.textColor}`}>🎯</div>
                  <p className="text-sm text-gray-300">Explore</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700 text-center">
                  <div className={`text-2xl mb-2 ${selectedArmData.textColor}`}>✨</div>
                  <p className="text-sm text-gray-300">Connect</p>
                </div>
              </div>

              {/* Loading Animation */}
              {isLoading && (
                <div className="flex justify-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full animate-pulse ${selectedArmData.textColor.replace("text-", "bg-")}`}
                      style={{
                        height: `${20 + i * 10}px`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "1s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer - Action Buttons */}
        <div className="px-4 sm:px-6 py-6 border-t border-gray-800 space-y-3">
          {selectedArm ? (
            <>
              <button
                onClick={handleProceed}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-white bg-gradient-to-r ${selectedArmData?.bgGradient} hover:shadow-lg active:scale-95 disabled:opacity-50`}
              >
                {isLoading ? "Initializing..." : `Proceed to ${selectedArmData?.label}`}
              </button>
              <button
                onClick={() => setSelectedArm(null)}
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-200 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 active:scale-95 disabled:opacity-50"
              >
                Choose Different Arm
              </button>
            </>
          ) : (
            <button
              onClick={handleBack}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-200 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 active:scale-95"
            >
              Close Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
