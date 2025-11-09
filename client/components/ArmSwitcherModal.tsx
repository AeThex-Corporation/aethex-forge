import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Arm {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  bgGradient: string;
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
    bgGradient: "from-yellow-600 to-yellow-400",
    textColor: "text-yellow-400",
    href: "/labs",
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

const ARM_DESCRIPTIONS: Record<string, string> = {
  labs: "Research & Development - Pushing the boundaries of innovation",
  gameforge:
    "Game Development - Shipping games at the speed of thought with monthly cycles",
  corp: "Enterprise Solutions - Consulting for large-scale transformations",
  foundation:
    "Community & Education - Building open-source and talent pipelines",
  devlink:
    "Professional Networking - LinkedIn for Roblox developers and creators",
  nexus: "Talent Marketplace - Cross-arm collaboration and opportunities",
};

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

  const handleProceed = () => {
    if (selectedArm) {
      const arm = ARMS.find((a) => a.id === selectedArm);
      if (arm) {
        navigate(arm.href);
        onClose();
        setSelectedArm(null);
      }
    }
  };

  const handleBack = () => {
    setSelectedArm(null);
    onClose();
  };

  const selectedArmData = selectedArm
    ? ARMS.find((a) => a.id === selectedArm)
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Full screen background */}
      <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-md" />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold text-white">Choose Your Arm</h1>
          <div className="w-12" />
        </div>

        {/* Body - Show selected arm details or grid */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!selectedArm ? (
            // Grid of all arms
            <div className="space-y-3">
              {ARMS.map((arm) => (
                <button
                  key={arm.id}
                  onClick={() => setSelectedArm(arm.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 active:scale-95 ${
                    arm.bgColor
                  } border-gray-700 hover:border-white/30`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={LOGO_URLS[arm.id]}
                      alt={arm.label}
                      className="w-12 h-12 object-contain flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-base">
                        {arm.label}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {ARM_DESCRIPTIONS[arm.id]}
                      </p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full mt-1 ${arm.textColor}`}
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : selectedArmData ? (
            // Selected arm detail view
            <div className="space-y-6">
              {/* Large logo */}
              <div className="flex justify-center py-8">
                <div
                  className={`w-32 h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br ${selectedArmData.bgGradient} p-4`}
                >
                  <img
                    src={LOGO_URLS[selectedArmData.id]}
                    alt={selectedArmData.label}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>

              {/* Title and description */}
              <div className="text-center space-y-3">
                <h2
                  className={`text-3xl font-bold ${selectedArmData.textColor}`}
                >
                  {selectedArmData.label}
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  {ARM_DESCRIPTIONS[selectedArmData.id]}
                </p>
              </div>

              {/* Features */}
              <div
                className={`p-4 rounded-lg ${selectedArmData.bgColor} border border-gray-700`}
              >
                <h3 className="text-sm font-semibold text-gray-200 mb-3">
                  What you'll get:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span
                      className={`text-lg mt-0.5 ${selectedArmData.textColor}`}
                    >
                      ✨
                    </span>
                    <span className="text-sm text-gray-300">
                      Access to exclusive opportunities
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className={`text-lg mt-0.5 ${selectedArmData.textColor}`}
                    >
                      🚀
                    </span>
                    <span className="text-sm text-gray-300">
                      Connect with like-minded creators
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className={`text-lg mt-0.5 ${selectedArmData.textColor}`}
                    >
                      🎯
                    </span>
                    <span className="text-sm text-gray-300">
                      Discover resources tailored to your interests
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer - Back/Proceed buttons */}
        <div className="px-4 py-6 border-t border-gray-800 space-y-3">
          {selectedArm ? (
            <>
              <button
                onClick={handleProceed}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-white bg-gradient-to-r ${selectedArmData?.bgGradient} hover:shadow-lg active:scale-95`}
              >
                Proceed to {selectedArmData?.label}
              </button>
              <button
                onClick={() => setSelectedArm(null)}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-200 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 active:scale-95"
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
