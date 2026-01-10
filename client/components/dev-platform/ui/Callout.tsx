import React from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export type CalloutType = "info" | "warning" | "success" | "error";

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig: Record<
  CalloutType,
  { icon: React.ElementType; className: string }
> = {
  info: {
    icon: Info,
    className: "bg-blue-500/10 border-blue-500/50 text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-500/10 border-yellow-500/50 text-yellow-500",
  },
  success: {
    icon: CheckCircle,
    className: "bg-green-500/10 border-green-500/50 text-green-500",
  },
  error: {
    icon: XCircle,
    className: "bg-red-500/10 border-red-500/50 text-red-500",
  },
};

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4",
        config.className,
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        {title && (
          <div className="font-semibold text-foreground">{title}</div>
        )}
        <div className="text-sm text-foreground/90 [&>p]:m-0">
          {children}
        </div>
      </div>
    </div>
  );
}
