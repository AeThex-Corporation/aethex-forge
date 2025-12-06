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

// Animated counter component
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(animate, 500);
    return () => clearTimeout(timer);
  }, [target, duration]);
  
  return <>{count.toLocaleString()}</>;
}

export default function IsometricRealmSelector() {
  const navigate = useNavigate();
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const particles = useMemo(() => generateParticles(20), []);
  
  // Auto-rotate featured realm
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % realms.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

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

        {/* Live Stats Strip */}
        <motion.div
          className="stats-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="stat-item">
            <span className="stat-number"><AnimatedCounter target={12000} />+</span>
            <span className="stat-label">Builders</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number"><AnimatedCounter target={500} />+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number"><AnimatedCounter target={7} duration={1000} /></span>
            <span className="stat-label">Realms</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number pulse-dot">●</span>
            <span className="stat-label">Live Now</span>
          </div>
        </motion.div>

        {/* Featured Realm Spotlight Carousel */}
        <motion.div
          className="featured-realm-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="featured-header">
            <h2>Featured Realm</h2>
            <div className="carousel-indicators">
              {realms.map((realm, index) => (
                <button
                  key={realm.id}
                  className={`indicator ${index === featuredIndex ? 'active' : ''}`}
                  onClick={() => setFeaturedIndex(index)}
                  style={{ '--indicator-color': realm.color } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
          
          <div className="featured-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={realms[featuredIndex].id}
                className="featured-card"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ '--featured-color': realms[featuredIndex].color } as React.CSSProperties}
              >
                <div className="featured-glow" />
                <div className="featured-shimmer" />
                <div className="featured-content">
                  <div className="featured-icon-wrapper">
                    <span className="featured-icon">{realms[featuredIndex].icon}</span>
                    <div className="featured-particles">
                      {[...Array(6)].map((_, i) => (
                        <span key={i} className="featured-particle" style={{ '--i': i } as React.CSSProperties} />
                      ))}
                    </div>
                  </div>
                  <div className="featured-info">
                    <div className="featured-badge">
                      <span className="online-dot" />
                      <span>{Math.floor(Math.random() * 200 + 50)} online</span>
                    </div>
                    <h3 className="featured-title">{realms[featuredIndex].label}</h3>
                    <p className="featured-description">{realms[featuredIndex].description}</p>
                    <div className="featured-features">
                      {realms[featuredIndex].features.map((feature, i) => (
                        <span key={i} className="featured-feature">{feature}</span>
                      ))}
                    </div>
                    <button 
                      className="featured-cta"
                      onClick={() => handleRealmClick(realms[featuredIndex])}
                    >
                      Enter {realms[featuredIndex].label}
                      <span className="cta-arrow">→</span>
                    </button>
                  </div>
                </div>
                <div className="featured-corner tl" />
                <div className="featured-corner tr" />
                <div className="featured-corner bl" />
                <div className="featured-corner br" />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>All Realms</h2>
          <p>Explore every realm and find your place in the ecosystem</p>
        </motion.div>

        <div className="realms-grid">
          {realms.map((realm, index) => (
            <IsometricRealmCard
              key={realm.id}
              realm={realm}
              index={index}
              onClick={handleRealmClick}
              isSelected={selectedRealm === realm.id}
              isFeatured={index === featuredIndex}
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

        .stats-strip {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
          padding: 16px 32px;
          background: hsl(var(--muted) / 0.4);
          border: 1px solid hsl(var(--border) / 0.3);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: hsl(var(--foreground));
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stat-divider {
          width: 1px;
          height: 32px;
          background: hsl(var(--border) / 0.5);
        }

        .pulse-dot {
          color: hsl(120, 100%, 50%);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Featured Realm Carousel */
        .featured-realm-section {
          margin-bottom: 60px;
        }

        .featured-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .featured-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: hsl(var(--foreground));
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .carousel-indicators {
          display: flex;
          gap: 8px;
        }

        .indicator {
          width: 32px;
          height: 4px;
          border-radius: 2px;
          background: hsl(var(--muted));
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: var(--indicator-color);
          box-shadow: 0 0 10px var(--indicator-color);
        }

        .indicator:hover {
          background: var(--indicator-color);
          opacity: 0.7;
        }

        .featured-carousel {
          position: relative;
          min-height: 280px;
        }

        .featured-card {
          position: relative;
          padding: 32px;
          border-radius: 20px;
          background: linear-gradient(145deg, hsl(var(--muted) / 0.8) 0%, hsl(var(--card) / 0.6) 100%);
          border: 2px solid var(--featured-color, hsl(var(--aethex-500)));
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .featured-glow {
          position: absolute;
          inset: -100px;
          background: radial-gradient(ellipse at 30% 30%, var(--featured-color) 0%, transparent 50%);
          opacity: 0.15;
          pointer-events: none;
        }

        .featured-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            hsl(var(--foreground) / 0.05) 45%,
            hsl(var(--foreground) / 0.1) 50%,
            hsl(var(--foreground) / 0.05) 55%,
            transparent 60%
          );
          transform: translateX(-100%);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .featured-content {
          position: relative;
          display: flex;
          gap: 32px;
          align-items: center;
          z-index: 1;
        }

        .featured-icon-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .featured-icon {
          font-size: 80px;
          display: block;
          filter: drop-shadow(0 0 20px var(--featured-color));
        }

        .featured-particles {
          position: absolute;
          inset: -20px;
          pointer-events: none;
        }

        .featured-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--featured-color);
          opacity: 0.6;
          animation: float-particle 3s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.5s);
        }

        .featured-particle:nth-child(1) { top: 0; left: 50%; }
        .featured-particle:nth-child(2) { top: 25%; right: 0; }
        .featured-particle:nth-child(3) { bottom: 25%; right: 0; }
        .featured-particle:nth-child(4) { bottom: 0; left: 50%; }
        .featured-particle:nth-child(5) { bottom: 25%; left: 0; }
        .featured-particle:nth-child(6) { top: 25%; left: 0; }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(5px, -10px) scale(1.2); opacity: 1; }
        }

        .featured-info {
          flex: 1;
        }

        .featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: hsl(120, 100%, 50%, 0.15);
          border: 1px solid hsl(120, 100%, 50%, 0.3);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: hsl(120, 100%, 60%);
          margin-bottom: 12px;
        }

        .online-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: hsl(120, 100%, 50%);
          animation: pulse 2s ease-in-out infinite;
        }

        .featured-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--featured-color);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }

        .featured-description {
          font-size: 15px;
          color: hsl(var(--muted-foreground));
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .featured-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .featured-feature {
          padding: 6px 12px;
          background: var(--featured-color, hsl(var(--aethex-500)));
          background: color-mix(in srgb, var(--featured-color) 15%, transparent);
          border: 1px solid var(--featured-color);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: hsl(var(--foreground));
        }

        .featured-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--featured-color);
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          color: hsl(var(--background));
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .featured-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px color-mix(in srgb, var(--featured-color) 50%, transparent);
        }

        .featured-cta .cta-arrow {
          transition: transform 0.2s ease;
        }

        .featured-cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        .featured-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--featured-color);
          opacity: 0.6;
        }

        .featured-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
        .featured-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
        .featured-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
        .featured-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

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

          .stats-strip {
            gap: 16px;
            padding: 12px 16px;
            flex-wrap: wrap;
          }

          .stat-number {
            font-size: 16px;
          }

          .stat-label {
            font-size: 10px;
          }

          .stat-divider {
            height: 24px;
          }

          .featured-realm-section {
            margin-bottom: 40px;
          }

          .featured-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .featured-content {
            flex-direction: column;
            text-align: center;
          }

          .featured-icon {
            font-size: 60px;
          }

          .featured-title {
            font-size: 24px;
          }

          .featured-features {
            justify-content: center;
          }

          .featured-cta {
            width: 100%;
            justify-content: center;
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
