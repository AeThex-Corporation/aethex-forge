import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export type AdminServiceStatus = {
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  responseTime: number;
  icon: LucideIcon;
};

export type AdminOverallStatus = {
  label: string;
  accentClass: string;
  badgeClass: string;
  Icon: LucideIcon;
};

interface AdminStatusOverviewProps {
  services: AdminServiceStatus[];
  overall: AdminOverallStatus;
  onViewStatus: () => void;
}

const statusBadgeClass: Record<AdminServiceStatus["status"], string> = {
  operational: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  degraded: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  outage: "border-red-500/40 bg-red-500/10 text-red-200",
};

export default function AdminStatusOverview({
  services,
  overall,
  onViewStatus,
}: AdminStatusOverviewProps) {
  const averageResponse =
    services.length > 0
      ? Math.round(
          services.reduce((total, service) => total + service.responseTime, 0) /
            services.length,
        )
      : null;

  const uptimeAccumulator = services.reduce(
    (acc, service) => {
      const asNumber = Number.parseFloat(service.uptime);
      if (Number.isFinite(asNumber)) {
        return { total: acc.total + asNumber, count: acc.count + 1 };
      }
      return acc;
    },
    { total: 0, count: 0 },
  );

  const averageUptime =
    uptimeAccumulator.count > 0
      ? uptimeAccumulator.total / uptimeAccumulator.count
      : null;

  const healthyServices = services.filter(
    (service) => service.status === "operational",
  ).length;

  const OverallIcon = overall.Icon;

  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`${overall.badgeClass} flex h-10 w-10 items-center justify-center rounded-full border`}
            >
              <OverallIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">System health</CardTitle>
              <CardDescription className={`${overall.accentClass} font-medium`}>
                {overall.label}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onViewStatus}>
            View detailed status
          </Button>
        </div>
        <CardDescription>
          Live uptime, latency, and reliability snapshot across AeThex
          infrastructure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-border/30 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Avg response
            </p>
            <p className="text-xl font-semibold text-foreground">
              {averageResponse !== null ? `${averageResponse} ms` : "—"}
            </p>
          </div>
          <div className="rounded border border-border/30 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Avg uptime
            </p>
            <p className="text-xl font-semibold text-foreground">
              {averageUptime !== null ? `${averageUptime.toFixed(2)}%` : "—"}
            </p>
          </div>
          <div className="rounded border border-border/30 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Healthy services
            </p>
            <p className="text-xl font-semibold text-foreground">
              {services.length ? `${healthyServices}/${services.length}` : "—"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {services.map((service) => {
            const ServiceIcon = service.icon;
            return (
              <div
                key={service.name}
                className="flex flex-wrap items-center justify-between gap-3 rounded border border-border/30 bg-background/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/60">
                    <ServiceIcon className="h-5 w-5 text-aethex-300" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.responseTime} ms • {service.uptime} uptime
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusBadgeClass[service.status]}
                  variant="outline"
                >
                  {service.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
