import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "purple" | "orange" | "red";
  actions?: React.ReactNode;
}

const toneConfig: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  blue: "text-sky-300",
  green: "text-emerald-300",
  purple: "text-purple-300",
  orange: "text-orange-300",
  red: "text-rose-300",
};

export const AdminStatCard = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  tone = "blue",
  actions,
}: AdminStatCardProps) => {
  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-foreground/90">
            {title}
          </CardTitle>
          <Badge
            variant="outline"
            className="border-border/40 text-xs text-muted-foreground"
          >
            Admin metric
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-gradient">{value}</div>
          <Icon className={`h-8 w-8 ${toneConfig[tone]}`} />
        </div>
        {trend ? (
          <p className="text-xs text-muted-foreground">{trend}</p>
        ) : null}
      </CardHeader>
      {(description || actions) && (
        <CardContent className="space-y-3">
          {description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : null}
          {actions}
        </CardContent>
      )}
    </Card>
  );
};

export default AdminStatCard;
