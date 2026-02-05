import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { Construction, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { aethexToast } from "@/lib/aethex-toast";

export default function MaintenanceToggle() {
  const { isMaintenanceMode, canBypass, toggleMaintenanceMode, loading } = useMaintenance();
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (!canBypass) {
      aethexToast.error({ title: "Only admins can toggle maintenance mode" });
      return;
    }

    setToggling(true);
    try {
      await toggleMaintenanceMode();
      aethexToast.success({
        title: isMaintenanceMode 
          ? "Maintenance mode disabled - site is now live" 
          : "Maintenance mode enabled - visitors will see maintenance page"
      });
    } catch (error: any) {
      aethexToast.error({ title: error?.message || "Failed to toggle maintenance mode" });
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/60 border-border/40 backdrop-blur">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card/60 border-border/40 backdrop-blur ${isMaintenanceMode ? 'border-yellow-500/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isMaintenanceMode 
                ? 'border-yellow-500/30 bg-yellow-500/10' 
                : 'border-emerald-500/30 bg-emerald-500/10'
            }`}>
              {isMaintenanceMode ? (
                <Construction className="h-5 w-5 text-yellow-400" />
              ) : (
                <Construction className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Maintenance Mode</CardTitle>
              <CardDescription>
                {isMaintenanceMode 
                  ? "Site is currently in maintenance mode" 
                  : "Site is live and accessible"}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={isMaintenanceMode 
              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" 
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            }
          >
            {isMaintenanceMode ? "Active" : "Off"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border border-border/30 bg-background/40 p-4">
          <div className="flex items-center gap-3">
            {isMaintenanceMode && (
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            )}
            <div>
              <p className="font-medium text-sm">
                {isMaintenanceMode 
                  ? "Visitors see maintenance page" 
                  : "All visitors can access the site"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isMaintenanceMode 
                  ? "Only admins can view the site. Toggle off to go live." 
                  : "Toggle on to show maintenance page to visitors."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {toggling && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch 
              checked={isMaintenanceMode} 
              onCheckedChange={handleToggle}
              disabled={toggling || !canBypass}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
