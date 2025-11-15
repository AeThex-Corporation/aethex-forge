import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface CTAButton {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

interface CTAButtonGroupProps {
  buttons: CTAButton[];
  layout?: "horizontal" | "vertical" | "grid";
  gap?: "small" | "medium" | "large";
  centered?: boolean;
}

export function CTAButtonGroup({
  buttons,
  layout = "horizontal",
  gap = "medium",
  centered = false,
}: CTAButtonGroupProps) {
  const gapClass =
    gap === "small" ? "gap-2" : gap === "large" ? "gap-4" : "gap-3";

  let containerClass = `flex ${gapClass}`;
  if (layout === "vertical") {
    containerClass = `flex flex-col ${gapClass}`;
  } else if (layout === "grid") {
    containerClass = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`;
  }

  if (centered) {
    containerClass += " justify-center items-center";
  }

  return (
    <div className={containerClass}>
      {buttons.map((btn, idx) => {
        const sizeClass =
          btn.size === "sm"
            ? "text-sm px-3 py-1"
            : btn.size === "lg"
              ? "text-lg px-6 py-3"
              : "px-4 py-2";

        const variantClass =
          btn.variant === "outline"
            ? "border border-opacity-30 text-opacity-75 hover:bg-opacity-10"
            : btn.variant === "secondary"
              ? "bg-opacity-50 hover:bg-opacity-75"
              : "";

        const widthClass = btn.fullWidth ? "w-full" : "";

        const Element = btn.href ? "a" : "button";

        const Icon = btn.icon;

        const baseProps = {
          key: idx,
          className: `${sizeClass} ${variantClass} ${widthClass}`,
          onClick: btn.onClick,
          ...(btn.href && {
            href: btn.href,
            target: "_blank",
            rel: "noopener noreferrer",
          }),
        };

        return (
          <Button
            {...(baseProps as any)}
            variant={btn.variant === "outline" ? "outline" : "default"}
          >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {btn.label}
          </Button>
        );
      })}
    </div>
  );
}

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  children?: ReactNode;
  gradient: string;
  centered?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
}

export function CTASection({
  title,
  subtitle,
  buttons,
  children,
  gradient,
  centered = true,
  layout = "vertical",
}: CTASectionProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-lg border p-8 text-center space-y-4`}
    >
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      {subtitle && <p className="text-gray-300">{subtitle}</p>}
      {children && <div className="my-4">{children}</div>}
      <CTAButtonGroup buttons={buttons} layout={layout} centered={centered} />
    </div>
  );
}

export default {
  CTAButtonGroup,
  CTASection,
};
