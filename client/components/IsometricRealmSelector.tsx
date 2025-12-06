import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import IsometricRealmCard, { RealmData } from "./IsometricRealmCard";

function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayText, text, started]);

  return (
    <>
      {displayText}
      {displayText.length < text.length && <span className="cursor-blink">|</span>}
    </>
  );
}

const REALM_COLORS = [
  "hsl(250, 100%, 60%)",
  "hsl(120, 100%, 70%)",
  "hsl(280, 100%, 70%)",
  "hsl(50, 100%, 70%)",
  "hsl(210, 100%, 70%)",
  "hsl(250, 100%, 70%)",
  "hsl(180, 100%, 60%)",
];

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
    color: "hsl(250, 100%, 60%)",
    route: "/dashboard/nexus",
    icon: "🌐",
    description: "The marketplace hub. Find opportunities, contracts, and commissions.",
    features: ["Browse opportunities", "Submit proposals", "Track contracts"],
  },
  {
    id: "gameforge",
    label: "GAMEFORGE",
    color: "hsl(120, 100%, 70%)",
    route: "/gameforge",
    icon: "🎮",
    description: "Game development powerhouse. Build immersive experiences together.",
    features: ["Sprint management", "Team collaboration", "Asset pipeline"],
  },
  {
    id: "foundation",
    label: "FOUNDATION",
    color: "hsl(0, 70%, 55%)",
    route: "/foundation",
    icon: "🏛️",
    description: "Learn and grow. Courses, mentorship, and achievement tracking.",
    features: ["Structured courses", "1-on-1 mentorship", "Skill badges"],
  },
  {
    id: "labs",
    label: "LABS",
    color: "hsl(50, 100%, 70%)",
    route: "/dashboard/labs",
    icon: "🔬",
    description: "Research & experimentation. Push the boundaries of what's possible.",
    features: ["Experimental features", "R&D projects", "Tech deep-dives"],
  },
  {
    id: "corp",
    label: "CORP",
    color: "hsl(210, 100%, 70%)",
    route: "/corp",
    icon: "🏢",
    description: "Enterprise solutions. Managed services for teams and organizations.",
    features: ["Dedicated support", "Custom integrations", "SLA guarantees"],
  },
  {
    id: "staff",
    label: "STAFF",
    color: "hsl(250, 100%, 70%)",
    route: "/staff",
    icon: "⚡",
    description: "Internal operations and team management for AeThex staff members.",
    features: ["Team coordination", "Admin tools", "Operations hub"],
  },
  {
    id: "devlink",
    label: "DEV-LINK",
    color: "hsl(180, 100%, 60%)",
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
      {/* Scanline overlay */}
      <div className="scanline-overlay" />
      {/* Tech grid overlay */}
      <div className="grid-overlay" />
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
          <h1 className="main-headline">
            <TypeWriter text="The Platform for Builders" delay={400} />
          </h1>
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
          font-family: var(--font-sans, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif);
          color: hsl(var(--foreground));
          position: relative;
          overflow-x: hidden;
          padding-bottom: 60px;
          background: hsl(var(--background));
        }

        .scanline-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(var(--foreground) / 0.02) 2px,
            hsl(var(--foreground) / 0.02) 4px
          );
          z-index: 100;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(hsl(var(--aethex-500) / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--aethex-500) / 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 1;
        }

        .cursor-blink {
          animation: blink 0.8s infinite;
          color: hsl(var(--aethex-400));
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .ambient-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 2;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
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
          background: hsl(var(--muted) / 0.6);
          border: 1px solid hsl(var(--aethex-500) / 0.2);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 40px hsl(var(--aethex-500) / 0.1), inset 0 1px 0 hsl(var(--foreground) / 0.05);
        }

        .tagline {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: hsl(var(--aethex-400));
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 12px;
          padding: 6px 14px;
          background: hsl(var(--aethex-500) / 0.15);
          border: 1px solid hsl(var(--aethex-500) / 0.3);
          border-radius: 20px;
        }

        .main-headline {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          margin-bottom: 14px;
          background: linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--aethex-400)) 40%, hsl(var(--neon-blue)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .sub-headline {
          font-size: 15px;
          color: hsl(var(--muted-foreground));
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
          background: linear-gradient(135deg, hsl(var(--aethex-500)) 0%, hsl(var(--aethex-400)) 100%);
          color: white;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px hsl(var(--aethex-500) / 0.4), 0 4px 12px hsl(var(--background) / 0.3);
          border: 1px solid hsl(var(--aethex-400) / 0.5);
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px hsl(var(--aethex-500) / 0.6), 0 8px 20px hsl(var(--background) / 0.4);
        }

        .cta-secondary {
          padding: 12px 28px;
          border-radius: 10px;
          border: 1px solid hsl(var(--neon-blue) / 0.3);
          background: hsl(var(--muted) / 0.8);
          color: hsl(var(--neon-blue));
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .cta-secondary:hover {
          background: hsl(var(--neon-blue) / 0.1);
          border-color: hsl(var(--neon-blue) / 0.5);
          transform: translateY(-2px);
          box-shadow: 0 0 20px hsl(var(--neon-blue) / 0.2);
        }

        .hero-text {
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-text h2 {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          margin-bottom: 8px;
          color: hsl(var(--foreground));
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-text p {
          font-size: 14px;
          color: hsl(var(--muted-foreground));
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

        @media (max-width: 768px) {
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
        }
      `}</style>
    </div>
  );
}
