import { Badge } from "@/components/ui/badge";

const ARM_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  labs: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-300",
    icon: "🔬",
  },
  gameforge: {
    bg: "bg-green-500/10",
    text: "text-green-300",
    icon: "🎮",
  },
  corp: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    icon: "💼",
  },
  foundation: {
    bg: "bg-red-500/10",
    text: "text-red-300",
    icon: "🎓",
  },
  devlink: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    icon: "🔗",
  },
};

export interface ArmBadgeProps {
  arm: string;
  size?: "sm" | "md" | "lg";
}

export function ArmBadge({ arm, size = "md" }: ArmBadgeProps) {
  const colors = ARM_COLORS[arm.toLowerCase()] || ARM_COLORS.labs;
  const sizeClass =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <Badge className={`${colors.bg} border-0 ${colors.text} ${sizeClass}`}>
      {colors.icon} {arm.charAt(0).toUpperCase() + arm.slice(1)}
    </Badge>
  );
}
