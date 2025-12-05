import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import IsometricRealmCard, { RealmData } from "./IsometricRealmCard";

const REALM_COLORS = ["#a855f7", "#22c55e", "#ef4444", "#eab308", "#3b82f6"];

interface ParticleData {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  xOffset: number;
}

function generateParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    top: 10 + Math.random() * 80,
    size: 2 + Math.random() * 4,
    color: REALM_COLORS[Math.floor(Math.random() * REALM_COLORS.length)],
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 4,
    xOffset: Math.sin(i) * 20,
  }));
}

const realms: RealmData[] = [
  {
    id: "nexus",
    label: "NEXUS",
    color: "#a855f7",
    route: "/dashboard/nexus",
    icon: "🌐",
    description: "The marketplace hub. Find opportunities, contracts, and commissions.",
    features: ["Browse opportunities", "Submit proposals", "Track contracts"],
  },
  {
    id: "gameforge",
    label: "GAMEFORGE",
    color: "#22c55e",
    route: "/gameforge",
    icon: "🎮",
    description: "Game development powerhouse. Build immersive experiences together.",
    features: ["Sprint management", "Team collaboration", "Asset pipeline"],
  },
  {
    id: "foundation",
    label: "FOUNDATION",
    color: "#ef4444",
    route: "/foundation",
    icon: "🏛️",
    description: "Learn and grow. Courses, mentorship, and achievement tracking.",
    features: ["Structured courses", "1-on-1 mentorship", "Skill badges"],
  },
  {
    id: "labs",
    label: "LABS",
    color: "#eab308",
    route: "/dashboard/labs",
    icon: "🔬",
    description: "Research & experimentation. Push the boundaries of what's possible.",
    features: ["Experimental features", "R&D projects", "Tech deep-dives"],
  },
  {
    id: "corp",
    label: "CORP",
    color: "#3b82f6",
    route: "/corp",
    icon: "🏢",
    description: "Enterprise solutions. Managed services for teams and organizations.",
    features: ["Dedicated support", "Custom integrations", "SLA guarantees"],
  },
];

export default function IsometricRealmSelector() {
  const navigate = useNavigate();
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const particles = useMemo(() => generateParticles(20), []);

  useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      lastUpdate = now;
      
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleRealmClick = useCallback(
    (realm: RealmData) => {
      setSelectedRealm(realm.id);
      setTimeout(() => navigate(realm.route), 400);
    },
    [navigate]
  );

  const backgroundGradient = `
    radial-gradient(
      ellipse 80% 50% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
      rgba(59, 130, 246, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 60% 40% at ${100 - mousePosition.x * 100}% ${100 - mousePosition.y * 100}%,
      rgba(168, 85, 247, 0.06) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, #030712 0%, #0f172a 50%, #030712 100%)
  `;

  return (
    <div
      className="realm-selector"
      style={{ background: backgroundGradient }}
    >
      {/* Ambient particles */}
      <div className="ambient-layer">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              y: [0, -30, 0],
              x: [0, particle.xOffset, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              background: particle.color,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="selector-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">AeThex</span>
          </div>
          <span className="version-tag">OS v5.0</span>
        </div>
        <div className="header-right">
          <Link to="/login" className="connect-btn">
            Connect Passport
          </Link>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="selector-main">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>Select Your Realm</h1>
          <p>Each realm unlocks a unique experience tailored to your journey</p>
        </motion.div>

        <div className="realms-grid">
          {realms.map((realm, index) => (
            <IsometricRealmCard
              key={realm.id}
              realm={realm}
              index={index}
              onClick={handleRealmClick}
              isSelected={selectedRealm === realm.id}
            />
          ))}
        </div>

        <motion.div
          className="footer-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link to="/community">Community</Link>
          <span className="divider">•</span>
          <Link to="/developers">Developers</Link>
          <span className="divider">•</span>
          <Link to="/roadmap">Roadmap</Link>
          <span className="divider">•</span>
          <Link to="/realms">All Realms</Link>
        </motion.div>
      </main>

      <style>{`
        .realm-selector {
          min-height: 100vh;
          width: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e5e7eb;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 60px;
        }

        .ambient-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          position: relative;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .logo-icon {
          color: #38bdf8;
          font-size: 24px;
        }

        .version-tag {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: #7dd3fc;
          letter-spacing: 0.1em;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .connect-btn {
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid #38bdf8;
          background: rgba(14, 165, 233, 0.1);
          color: #e0f2fe;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .connect-btn:hover {
          background: rgba(14, 165, 233, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
        }

        .selector-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 40px;
        }

        .hero-text {
          text-align: center;
          margin-bottom: 50px;
        }

        .hero-text h1 {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #e5e7eb 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 16px;
          color: #64748b;
          max-width: 500px;
          margin: 0 auto;
        }

        .realms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          justify-items: center;
          perspective: 2000px;
        }

        @media (min-width: 1200px) {
          .realms-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1600px) {
          .realms-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 60px;
          font-size: 14px;
        }

        .footer-links a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #e5e7eb;
        }

        .footer-links .divider {
          color: #334155;
        }

        @media (max-width: 768px) {
          .selector-header {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
          }

          .selector-main {
            padding: 20px;
          }

          .hero-text {
            margin-bottom: 32px;
          }

          .realms-grid {
            gap: 24px;
          }

          .footer-links {
            flex-wrap: wrap;
            margin-top: 40px;
          }
        }
      `}</style>
    </div>
  );
}
