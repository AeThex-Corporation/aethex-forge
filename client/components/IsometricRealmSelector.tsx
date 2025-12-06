import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import IsometricRealmCard, { RealmData } from "./IsometricRealmCard";

const REALM_COLORS = ["#a855f7", "#22c55e", "#ef4444", "#eab308", "#3b82f6", "#7c3aed", "#06b6d4"];

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
  {
    id: "staff",
    label: "STAFF",
    color: "#7c3aed",
    route: "/staff",
    icon: "⚡",
    description: "Internal operations and team management for AeThex staff members.",
    features: ["Team coordination", "Admin tools", "Operations hub"],
  },
  {
    id: "devlink",
    label: "DEV-LINK",
    color: "#06b6d4",
    route: "/devlink",
    icon: "🔗",
    description: "Developer networking and collaboration. Connect with fellow builders.",
    features: ["Developer profiles", "Skill matching", "Collaboration tools"],
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
    <div className="realm-selector">
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

      {/* Main content */}
      <main className="selector-main">
        <motion.div
          className="hero-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="tagline">Build the Future</p>
          <h1 className="main-headline">The Platform for Builders</h1>
          <p className="sub-headline">
            AeThex is an advanced development platform and community where creators collaborate, 
            learn, and bring ideas to life. Join thousands of developers, designers, and innovators.
          </p>
          <div className="hero-cta">
            <Link to="/get-started" className="cta-primary">Get Started Free</Link>
            <Link to="/downloads" className="cta-secondary">Download Desktop App</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Select Your Realm</h2>
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

        .hero-intro {
          text-align: center;
          margin-bottom: 48px;
          padding: 32px 24px;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 40px rgba(124, 58, 237, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .tagline {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #c084fc;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 12px;
          padding: 6px 14px;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 20px;
        }

        .main-headline {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #f8fafc 0%, #c084fc 40%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .sub-headline {
          font-size: 15px;
          color: #94a3b8;
          max-width: 480px;
          margin: 0 auto 24px;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cta-primary {
          padding: 12px 28px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(168, 85, 247, 0.5);
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(124, 58, 237, 0.6), 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .cta-secondary {
          padding: 12px 28px;
          border-radius: 10px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          background: rgba(15, 23, 42, 0.8);
          color: #60a5fa;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .cta-secondary:hover {
          background: rgba(96, 165, 250, 0.1);
          border-color: rgba(96, 165, 250, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.2);
        }

        .hero-text {
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-text h2 {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          margin-bottom: 8px;
          color: #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-text p {
          font-size: 14px;
          color: #64748b;
          max-width: 400px;
          margin: 0 auto;
        }

        .realms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          justify-items: center;
          perspective: 2000px;
        }

        @media (min-width: 900px) {
          .realms-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .realms-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1600px) {
          .realms-grid {
            grid-template-columns: repeat(7, 1fr);
          }
        }

        .footer-section {
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid #1e293b;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 32px;
          margin-bottom: 40px;
        }

        .footer-col h4 {
          font-size: 13px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-col a {
          display: block;
          font-size: 14px;
          color: #64748b;
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s ease;
        }

        .footer-col a:hover {
          color: #a855f7;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid #1e293b;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom p {
          font-size: 13px;
          color: #475569;
        }

        .footer-links-simple {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .footer-links-simple a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links-simple a:hover {
          color: #e5e7eb;
        }

        .footer-links-simple .divider {
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

          .hero-intro {
            padding: 24px 20px;
            margin-bottom: 32px;
            margin-left: 0;
            margin-right: 0;
          }

          .sub-headline {
            font-size: 14px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .cta-primary, .cta-secondary {
            width: 100%;
            max-width: 260px;
            text-align: center;
          }

          .hero-text {
            margin-bottom: 32px;
          }

          .realms-grid {
            gap: 20px;
          }

          .footer-section {
            margin-top: 50px;
          }

          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
