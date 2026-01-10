import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiEndpointCardProps {
  method: HttpMethod;
  endpoint: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-blue-500 hover:bg-blue-600",
  POST: "bg-green-500 hover:bg-green-600",
  PUT: "bg-yellow-500 hover:bg-yellow-600",
  DELETE: "bg-red-500 hover:bg-red-600",
  PATCH: "bg-purple-500 hover:bg-purple-600",
};

export function ApiEndpointCard({
  method,
  endpoint,
  description,
  className,
  onClick,
}: ApiEndpointCardProps) {
  return (
    <Card
      className={cn(
        "p-4 transition-all hover:border-primary/50 hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Badge
          className={cn(
            "shrink-0 font-mono text-xs font-bold",
            methodColors[method]
          )}
        >
          {method}
        </Badge>
        <div className="flex-1 space-y-1">
          <code className="text-sm font-mono text-foreground">{endpoint}</code>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
