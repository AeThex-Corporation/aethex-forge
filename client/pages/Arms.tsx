import { useNavigate, useLocation } from "react-router-dom";
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

export default function Arms() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectArm = (href: string) => {
    navigate(href);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(120, 58, 237, .05) 25%, rgba(120, 58, 237, .05) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .05) 75%, rgba(120, 58, 237, .05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(120, 58, 237, .05) 25%, rgba(120, 58, 237, .05) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .05) 75%, rgba(120, 58, 237, .05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header / Back Button */}
      <div className="relative z-10 flex items-center px-4 sm:px-6 py-4 border-b border-gray-800/50">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Choose Your Arm
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">
            Select the arm that best matches your interests and goals
          </p>
        </div>

        {/* Arms Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ARMS.map((arm) => (
            <button
              key={arm.id}
              onClick={() => handleSelectArm(arm.href)}
              className="group relative p-6 sm:p-8 rounded-xl border border-gray-800 bg-gray-950/50 hover:bg-gray-900/80 hover:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            >
              {/* Gradient Glow on Hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${arm.color}20, ${arm.color}10)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-gradient-to-br ${arm.bgGradient} p-3`}
                  style={{
                    boxShadow: `0 0 20px ${arm.color}40`,
                  }}
                >
                  <img
                    src={arm.icon}
                    alt={arm.label}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Label */}
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${arm.textColor}`}>
                    {arm.label}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {arm.tip}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className={`text-xs sm:text-sm ${arm.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
