import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface Arm {
  id: string;
  label: string;
  color: string;
  bgGradient: string;
  textColor: string;
  href: string;
  icon: string;
  tip: string;
  shadowColor: string;
  glowColor: string;
}

const ARMS: Arm[] = [
  {
    id: "staff",
    label: "Staff",
    color: "#7c3aed",
    bgGradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    href: "/staff",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800",
    tip: "Staff operations & internal portal",
    shadowColor: "shadow-purple-500/50",
    glowColor: "rgba(168, 85, 247, 0.3)",
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
    shadowColor: "shadow-yellow-500/50",
    glowColor: "rgba(251, 191, 36, 0.3)",
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
    shadowColor: "shadow-green-500/50",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
  {
    id: "corp",
    label: "Corp",
    color: "#3B82F6",
    bgGradient: "from-blue-600 to-blue-400",
    textColor: "text-blue-400",
    href: "/corp",
    icon: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800",
    tip: "Enterprise solutions for scale",
    shadowColor: "shadow-blue-500/50",
    glowColor: "rgba(59, 130, 246, 0.3)",
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
    shadowColor: "shadow-red-500/50",
    glowColor: "rgba(239, 68, 68, 0.3)",
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
    shadowColor: "shadow-cyan-500/50",
    glowColor: "rgba(6, 182, 212, 0.3)",
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
    shadowColor: "shadow-purple-500/50",
    glowColor: "rgba(168, 85, 247, 0.3)",
  },
];

export default function Arms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredArm, setHoveredArm] = useState<string | null>(null);

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
      {/* Multiple Animated Background Layers */}
      <div className="absolute inset-0 opacity-30">
        {/* Radial gradient overlays for each arm */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(120, 58, 237, .05) 25%, rgba(120, 58, 237, .05) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .05) 75%, rgba(120, 58, 237, .05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(120, 58, 237, .05) 25%, rgba(120, 58, 237, .05) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .05) 75%, rgba(120, 58, 237, .05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
            animation: "float 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20"
            style={{
              background: `hsl(${i * 45}, 100%, 50%)`,
              left: `${i * 12.5 + 5}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Header / Back Button */}
      <div className="relative z-20 flex items-center px-4 sm:px-6 py-4 border-b border-purple-500/20 bg-black/60 backdrop-blur-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 space-y-6">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs sm:text-sm text-purple-300">
                Select Your Arm
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 leading-tight">
              Choose Your Arm
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Select the arm that best matches your interests and goals. Each
              arm represents a unique pillar of the AeThex ecosystem with its
              own mission, team, and opportunities.
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px bg-gradient-to-r from-transparent to-purple-500 w-12" />
            <div className="h-px bg-gradient-to-r from-purple-500 to-cyan-500 w-24" />
            <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent w-12" />
          </div>
        </div>

        {/* Arms Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ARMS.map((arm) => (
            <button
              key={arm.id}
              onClick={() => handleSelectArm(arm.href)}
              onMouseEnter={() => setHoveredArm(arm.id)}
              onMouseLeave={() => setHoveredArm(null)}
              className="group relative p-6 sm:p-8 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-950/60 to-black/80 backdrop-blur-sm hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3"
            >
              {/* Dynamic Glow Background */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                style={{
                  background: arm.glowColor,
                  zIndex: -1,
                }}
              />

              {/* Border Glow on Hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${arm.color}20, ${arm.color}10)`,
                  pointerEvents: "none",
                  borderRadius: "1rem",
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                  background: `linear-gradient(90deg, transparent, ${arm.color}80, transparent)`,
                }}
              />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-5">
                {/* Icon Container with multiple glow layers */}
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{
                      background: arm.glowColor,
                      zIndex: -1,
                    }}
                  />
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br ${arm.bgGradient} p-4 transform group-hover:scale-110 transition-transform duration-500`}
                    style={{
                      boxShadow: `0 0 40px ${arm.color}60, inset 0 0 20px ${arm.color}20`,
                    }}
                  >
                    <img
                      src={arm.icon}
                      alt={arm.label}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Label */}
                <div className="space-y-2">
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${arm.textColor} group-hover:text-white transition-colors duration-500`}
                  >
                    {arm.label}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500 line-clamp-2">
                    {arm.tip}
                  </p>
                </div>

                {/* Pulsing indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: arm.color,
                      opacity: hoveredArm === arm.id ? 1 : 0.5,
                    }}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${arm.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  >
                    Enter
                  </span>
                </div>
              </div>

              {/* Corner accent - top right */}
              <div
                className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  border: `2px solid ${arm.color}40`,
                  borderRadius: "0.25rem",
                }}
              />

              {/* Corner accent - bottom left */}
              <div
                className="absolute bottom-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  border: `2px solid ${arm.color}40`,
                  borderRadius: "0.25rem",
                }}
              />
            </button>
          ))}
        </div>

        {/* Footer text */}
        <div className="mt-16 sm:mt-20 text-center text-gray-500 text-xs sm:text-sm max-w-xl">
          <p>Click any arm to explore its unique offerings and community</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
