import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { StatCard } from "@/components/dev-platform/ui/StatCard";
import { ApiKeyCard } from "@/components/dev-platform/ApiKeyCard";
import { CreateApiKeyDialog } from "@/components/dev-platform/CreateApiKeyDialog";
import { UsageChart } from "@/components/dev-platform/UsageChart";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/dev-platform/ui/Callout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Key,
  Plus,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at?: string | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  expires_at?: string | null;
}

interface DeveloperProfile {
  user_id: string;
  company_name?: string;
  website_url?: string;
  github_username?: string;
  is_verified: boolean;
  plan_tier: string;
  max_api_keys: number;
}

export default function DeveloperDashboard() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load API keys
      const keysRes = await fetch("/api/developer/keys");
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setKeys(keysData.keys || []);
      }

      // Load developer profile
      const profileRes = await fetch("/api/developer/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
      }

      // Calculate overall stats
      const totalRequests = keys.reduce((sum, key) => sum + key.usage_count, 0);
      const activeKeys = keys.filter((k) => k.is_active).length;
      const recentlyUsed = keys.filter(
        (k) => k.last_used_at && Date.now() - new Date(k.last_used_at).getTime() < 24 * 60 * 60 * 1000
      ).length;

      setStats({
        totalRequests,
        activeKeys,
        recentlyUsed,
        totalKeys: keys.length,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (data: {
    name: string;
    scopes: string[];
    expiresInDays?: number;
  }) => {
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return { error: result.error || "Failed to create API key" };
      }

      toast({
        title: "API Key Created",
        description: "Your new API key has been generated successfully",
      });

      await loadDashboardData();
      return { full_key: result.key.full_key };
    } catch (error) {
      console.error("Error creating API key:", error);
      return { error: "Network error. Please try again." };
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/developer/keys/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete key");
      }

      toast({
        title: "API Key Deleted",
        description: "The API key has been permanently deleted",
      });

      await loadDashboardData();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/developer/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!res.ok) {
        throw new Error("Failed to update key");
      }

      toast({
        title: isActive ? "API Key Activated" : "API Key Deactivated",
        description: `The API key has been ${isActive ? "activated" : "deactivated"}`,
      });

      await loadDashboardData();
    } catch (error) {
      console.error("Error toggling key:", error);
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  const handleViewStats = (id: string) => {
    // TODO: Navigate to detailed stats page or open modal
    console.log("View stats for key:", id);
    toast({
      title: "Coming Soon",
      description: "Detailed statistics view is under development",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <SEO pageTitle="Developer Dashboard" description="Manage your API keys and monitor usage" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const expiringSoon = keys.filter((k) => {
    if (!k.expires_at) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(k.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry < 30;
  });

  return (
    <Layout>
      <SEO pageTitle="Developer Dashboard" description="Manage your API keys and monitor usage" />
      <div className="space-y-8">
        {/* Warning for expiring keys */}
        {expiringSoon.length > 0 && (
          <Callout variant="warning">
            <p className="font-medium">
              {expiringSoon.length} API key{expiringSoon.length > 1 ? "s" : ""} expiring
              soon
            </p>
            <p className="text-sm mt-1">
              Review your keys and regenerate them before they expire to avoid service
              interruptions.
            </p>
          </Callout>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Requests"
            value={stats?.totalRequests?.toLocaleString() || "0"}
            icon={Activity}
            trend={
              stats?.totalRequests > 0
                ? { value: 12.5, label: "vs last week" }
                : undefined
            }
          />
          <StatCard
            title="Active Keys"
            value={`${stats?.activeKeys || 0}/${profile?.max_api_keys || 3}`}
            icon={Key}
          />
          <StatCard
            title="Recently Used"
            value={stats?.recentlyUsed || 0}
            subtitle="Last 24 hours"
            icon={Clock}
          />
          <StatCard
            title="Plan"
            value={profile?.plan_tier || "free"}
            icon={TrendingUp}
            valueClassName="capitalize"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your API Keys</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage access to the AeThex platform
                </p>
              </div>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                disabled={keys.length >= (profile?.max_api_keys || 3)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </div>

            {keys.length === 0 ? (
              <Callout variant="info">
                <p className="font-medium">No API keys yet</p>
                <p className="text-sm mt-1">
                  Create your first API key to start building with AeThex. You can
                  create up to {profile?.max_api_keys || 3} keys on your current plan.
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="mt-4"
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Key
                </Button>
              </Callout>
            ) : (
              <div className="grid gap-4">
                {keys.map((key) => (
                  <ApiKeyCard
                    key={key.id}
                    apiKey={key}
                    onDelete={handleDeleteKey}
                    onToggleActive={handleToggleActive}
                    onViewStats={handleViewStats}
                  />
                ))}
              </div>
            )}

            {keys.length >= (profile?.max_api_keys || 3) && (
              <Callout variant="warning">
                <p className="font-medium">API Key Limit Reached</p>
                <p className="text-sm mt-1">
                  You've reached the maximum number of API keys for your plan. Delete
                  an existing key to create a new one, or upgrade your plan for more
                  keys.
                </p>
              </Callout>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Usage Analytics</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor your API usage over time
              </p>
            </div>

            {stats?.totalRequests > 0 ? (
              <div className="grid gap-6">
                <UsageChart
                  data={{
                    "2026-01-01": 45,
                    "2026-01-02": 52,
                    "2026-01-03": 38,
                    "2026-01-04": 65,
                    "2026-01-05": 78,
                    "2026-01-06": 95,
                    "2026-01-07": 120,
                  }}
                  title="Requests per Day (Last 7 Days)"
                  chartType="bar"
                />

                <Callout variant="info">
                  <p className="text-sm">
                    <strong>Note:</strong> Real-time analytics are coming soon. This
                    preview shows sample data.
                  </p>
                </Callout>
              </div>
            ) : (
              <Callout variant="info">
                <p className="font-medium">No usage data yet</p>
                <p className="text-sm mt-1">
                  Start making API requests to see your usage analytics here.
                </p>
              </Callout>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create API Key Dialog */}
      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateKey={handleCreateKey}
      />
    </Layout>
  );
}
