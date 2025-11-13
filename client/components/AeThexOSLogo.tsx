import { cn } from "@/lib/utils";

interface AeThexOSLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
  variant?: "default" | "light" | "header" | "footer";
}

const GRADIENTS = {
  default: { id: "osGradient_default", stops: [{ offset: "0%", color: "#a78bfa" }, { offset: "100%", color: "#60a5fa" }] },
  light: { id: "osGradient_light", stops: [{ offset: "0%", color: "#e9d5ff" }, { offset: "100%", color: "#bfdbfe" }] },
  header: { id: "osGradient_header", stops: [{ offset: "0%", color: "#a78bfa" }, { offset: "100%", color: "#60a5fa" }] },
  footer: { id: "osGradient_footer", stops: [{ offset: "0%", color: "#818cf8" }, { offset: "100%", color: "#a78bfa" }] },
};

const SIZES = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

export default function AeThexOSLogo({
  size = "md",
  animate = false,
  className,
  variant = "default",
}: AeThexOSLogoProps) {
  const gradient = GRADIENTS[variant];
  const glowId = `glow_${variant}_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      className={cn(
        SIZES[size],
        animate && "transition-all duration-300 hover:scale-110",
        className
      )}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gradient.id}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {gradient.stops.map((stop, idx) => (
            <stop key={idx} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* OS Window Frame */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="6"
        fill="none"
        stroke={`url(#${gradient.id})`}
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Title Bar */}
      <rect
        x="6"
        y="6"
        width="52"
        height="12"
        rx="6"
        fill={`url(#${gradient.id})`}
        opacity="0.15"
      />
      <line
        x1="6"
        y1="18"
        x2="58"
        y2="18"
        stroke={`url(#${gradient.id})`}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* System Dots */}
      <circle cx="12" cy="12" r="1.5" fill="#a78bfa" opacity="0.7" />
      <circle cx="18" cy="12" r="1.5" fill="#60a5fa" opacity="0.7" />
      <circle cx="24" cy="12" r="1.5" fill="#c4b5fd" opacity="0.7" />

      {/* Central OS Symbol */}
      <g transform="translate(32, 35)">
        {/* Bright white glow background for the symbol */}
        <circle cx="0" cy="-2" r="8" fill="#ffffff" opacity="0.15" />

        {/* Main symbol lines - using white for visibility */}
        <line
          x1="-6"
          y1="6"
          x2="0"
          y2="-8"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          opacity="0.95"
        />
        <line
          x1="6"
          y1="6"
          x2="0"
          y2="-8"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          opacity="0.95"
        />
        <line
          x1="-3"
          y1="0"
          x2="3"
          y2="0"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          opacity="0.95"
        />
        {/* Accent circles with bright colors */}
        <circle cx="-6" cy="6" r="2" fill="#fbbf24" opacity="1" />
        <circle cx="6" cy="6" r="2" fill="#06b6d4" opacity="1" />
      </g>
    </svg>
  );
}
