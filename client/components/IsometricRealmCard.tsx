import { useRef, useState, useCallback, CSSProperties } from "react";
import { motion } from "framer-motion";

export interface RealmData {
  id: string;
  label: string;
  color: string;
  route: string;
  icon: string;
  description: string;
  features: string[];
}

interface IsometricRealmCardProps {
  realm: RealmData;
  index: number;
  onClick: (realm: RealmData) => void;
  isSelected: boolean;
  isFeatured?: boolean;
}

export default function IsometricRealmCard({
  realm,
  index,
  onClick,
  isSelected,
  isFeatured = false,
}: IsometricRealmCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -20, y: x * 20 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const cardStyle: CSSProperties = {
    perspective: "1000px",
    transformStyle: "preserve-3d",
  };

  const innerStyle: CSSProperties = {
    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "translateZ(20px)" : "translateZ(0)"}`,
    transformStyle: "preserve-3d",
    transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      style={cardStyle}
      className="realm-card-wrapper"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(realm)}
        style={innerStyle}
        className={`realm-card ${isSelected ? "selected" : ""}`}
      >
        {/* Background glow layer */}
        <div
          className="card-glow"
          style={{
            background: `radial-gradient(ellipse at center, ${realm.color}30 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.3,
            transform: `translateZ(-10px) translateX(${tilt.y * 2}px) translateY(${tilt.x * -2}px)`,
          }}
        />

        {/* Main card surface */}
        <div
          className={`card-surface ${isFeatured ? 'is-featured' : ''}`}
          style={{
            borderColor: isHovered || isSelected ? realm.color : `${realm.color}40`,
            boxShadow: isHovered
              ? `0 25px 50px -12px ${realm.color}40, 0 0 0 1px ${realm.color}60, inset 0 1px 0 ${realm.color}20`
              : `0 10px 40px -15px ${realm.color}20`,
            '--card-color': realm.color,
          } as CSSProperties}
        >
          {/* Shimmer effect */}
          <div className="card-shimmer" />
          
          {/* Corner accents */}
          <div className="corner-accent tl" style={{ borderColor: realm.color }} />
          <div className="corner-accent tr" style={{ borderColor: realm.color }} />
          <div className="corner-accent bl" style={{ borderColor: realm.color }} />
          <div className="corner-accent br" style={{ borderColor: realm.color }} />
          
          {/* Ambient particles inside card */}
          <div className="card-particles">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="card-particle"
                style={{
                  background: realm.color,
                  animationDelay: `${i * 0.8}s`,
                  left: `${20 + i * 20}%`,
                }}
              />
            ))}
          </div>
          
          {/* Floating icon layer */}
          <div
            className="card-icon-layer"
            style={{
              transform: `translateZ(40px) translateX(${tilt.y * 3}px) translateY(${tilt.x * -3}px)`,
            }}
          >
            <div
              className="card-icon"
              style={{
                background: `linear-gradient(135deg, ${realm.color}20 0%, ${realm.color}05 100%)`,
                borderColor: `${realm.color}40`,
                boxShadow: isHovered ? `0 0 30px ${realm.color}50` : "none",
              }}
            >
              <span style={{ fontSize: 32 }}>{realm.icon}</span>
            </div>
          </div>

          {/* Text layer */}
          <div
            className="card-text-layer"
            style={{
              transform: `translateZ(25px) translateX(${tilt.y * 1.5}px) translateY(${tilt.x * -1.5}px)`,
            }}
          >
            <h3
              className="card-title"
              style={{ color: realm.color }}
            >
              {realm.label}
            </h3>
            <p className="card-description">{realm.description}</p>
          </div>

          {/* Features layer */}
          <div
            className="card-features-layer"
            style={{
              transform: `translateZ(15px) translateX(${tilt.y * 0.8}px) translateY(${tilt.x * -0.8}px)`,
            }}
          >
            {realm.features.slice(0, 3).map((feature, i) => (
              <div
                key={i}
                className="card-feature"
                style={{
                  borderColor: `${realm.color}30`,
                  background: `${realm.color}08`,
                }}
              >
                <span
                  className="feature-dot"
                  style={{ background: realm.color }}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA layer */}
          <div
            className="card-cta-layer"
            style={{
              transform: `translateZ(30px) translateX(${tilt.y * 2}px) translateY(${tilt.x * -2}px)`,
            }}
          >
            <button
              className="card-cta"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${realm.color} 0%, ${realm.color}cc 100%)`
                  : `${realm.color}20`,
                borderColor: realm.color,
                color: isHovered ? "#030712" : realm.color,
              }}
            >
              Enter {realm.label}
              <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Reflection layer */}
        <div
          className="card-reflection"
          style={{
            background: `linear-gradient(180deg, ${realm.color}08 0%, transparent 100%)`,
            transform: `translateZ(-5px) rotateX(180deg) translateY(-100%)`,
            opacity: isHovered ? 0.4 : 0.15,
          }}
        />
      </div>

      <style>{`
        .realm-card-wrapper {
          width: 100%;
          max-width: 320px;
        }

        .realm-card {
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
        }

        .card-glow {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.4s ease;
          transform-style: preserve-3d;
        }

        .card-surface {
          position: relative;
          padding: 28px 24px;
          border-radius: 20px;
          border: 2px solid;
          background: linear-gradient(
            145deg,
            hsl(var(--muted) / 0.9) 0%,
            hsl(var(--card) / 0.7) 50%,
            hsl(var(--muted) / 0.9) 100%
          );
          backdrop-filter: blur(12px);
          transform-style: preserve-3d;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .card-surface::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          padding: 2px;
          background: linear-gradient(
            var(--gradient-angle, 0deg),
            transparent 0%,
            var(--card-color) 25%,
            transparent 50%,
            var(--card-color) 75%,
            transparent 100%
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          opacity: 0;
          animation: borderRotate 4s linear infinite;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .realm-card:hover .card-surface::before {
          opacity: 0.8;
        }

        @property --gradient-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes borderRotate {
          0% { --gradient-angle: 0deg; }
          100% { --gradient-angle: 360deg; }
        }

        .card-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            hsl(var(--foreground) / 0.03) 45%,
            hsl(var(--foreground) / 0.06) 50%,
            hsl(var(--foreground) / 0.03) 55%,
            transparent 60%
          );
          transform: translateX(-100%);
          pointer-events: none;
          border-radius: 18px;
        }

        .realm-card:hover .card-shimmer {
          animation: cardShimmer 2s ease-in-out;
        }

        @keyframes cardShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .corner-accent {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .corner-accent.tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
        .corner-accent.tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
        .corner-accent.bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
        .corner-accent.br { bottom: 6px; right: 6px; border-left: none; border-top: none; }

        .realm-card:hover .corner-accent {
          opacity: 0.6;
        }

        .card-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          border-radius: 18px;
        }

        .card-particle {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0;
        }

        .realm-card:hover .card-particle {
          animation: floatUp 3s ease-in-out infinite;
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-200px); opacity: 0; }
        }

        .card-surface.is-featured {
          animation: featuredPulse 2s ease-in-out infinite;
        }

        @keyframes featuredPulse {
          0%, 100% { box-shadow: 0 0 20px var(--card-color, transparent); }
          50% { box-shadow: 0 0 40px var(--card-color, transparent); }
        }

        .card-icon-layer {
          transform-style: preserve-3d;
          margin-bottom: 20px;
        }

        .card-icon {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.3s ease;
        }

        .card-text-layer {
          transform-style: preserve-3d;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 13px;
          color: hsl(var(--muted-foreground));
          line-height: 1.5;
        }

        .card-features-layer {
          transform-style: preserve-3d;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .card-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: hsl(var(--foreground) / 0.8);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid;
        }

        .feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .card-cta-layer {
          transform-style: preserve-3d;
        }

        .card-cta {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .realm-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        .card-reflection {
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: -60px;
          height: 60px;
          border-radius: 20px;
          pointer-events: none;
          transition: opacity 0.4s ease;
          filter: blur(8px);
        }

        .realm-card.selected .card-surface {
          border-width: 3px;
        }
      `}</style>
    </motion.div>
  );
}
