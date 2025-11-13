import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import LoadingScreen from "@/components/LoadingScreen";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Heart,
  LogOut,
  Home,
  Shield,
  Clock,
} from "lucide-react";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { info: toastInfo } = useAethexToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check if user is @aethex.dev (primary or linked email)
    if (!loading && user) {
      const email = user.email || profile?.email || "";
      const hasDevEmail =
        email.endsWith("@aethex.dev") ||
        (profile as any)?.is_dev_account ||
        user.identities?.some((identity: any) =>
          identity.identity_data?.email?.endsWith("@aethex.dev"),
        );

      if (!hasDevEmail) {
        navigate("/staff/login", { replace: true });
        return;
      }
      setIsLoading(false);
    }
  }, [user, profile, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toastInfo({
      title: "Signed out",
      description: "You have been signed out of the staff portal.",
    });
    navigate("/staff/login", { replace: true });
  };

  if (loading || isLoading) {
    return (
      <LoadingScreen
        message="Loading staff dashboard..."
        showProgress={true}
        duration={3000}
        accentColor="from-purple-500 to-purple-400"
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Staff Dashboard
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Welcome, {profile?.full_name || user?.email}
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Users</p>
                    <p className="text-3xl font-bold text-purple-400">2.4K</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">System Status</p>
                    <p className="text-3xl font-bold text-green-400">Healthy</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Reviews</p>
                    <p className="text-3xl font-bold text-yellow-400">8</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Health Score</p>
                    <p className="text-3xl font-bold text-pink-400">94%</p>
                  </div>
                  <Heart className="w-8 h-8 text-pink-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle>Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                  <TabsTrigger value="overview" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="moderation" className="gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Moderation</span>
                  </TabsTrigger>
                  <TabsTrigger value="mentorship" className="gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Mentorship</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      System Overview
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">
                            API Response Time
                          </span>
                          <Badge className="bg-green-500/20 text-green-300">
                            95ms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Database Health</span>
                          <Badge className="bg-green-500/20 text-green-300">
                            100%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Cache Hit Rate</span>
                          <Badge className="bg-green-500/20 text-green-300">
                            87%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Error Rate</span>
                          <Badge className="bg-yellow-500/20 text-yellow-300">
                            0.2%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Moderation Tab */}
                <TabsContent value="moderation" className="space-y-6 mt-6">
                  <Alert className="border-yellow-500/30 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="ml-2 text-yellow-600">
                      8 user reports pending review
                    </AlertDescription>
                  </Alert>
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                    <p className="text-gray-400">
                      Moderation tools and user reports will appear here
                    </p>
                  </div>
                </TabsContent>

                {/* Mentorship Tab */}
                <TabsContent value="mentorship" className="space-y-6 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          Active Mentorships
                        </p>
                        <p className="text-2xl font-bold text-purple-400">24</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Pending Requests
                        </p>
                        <p className="text-2xl font-bold text-yellow-400">6</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Users</span>
                        <span className="text-xl font-bold text-purple-400">
                          2,487
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Active This Week</span>
                        <span className="text-xl font-bold text-green-400">
                          1,234
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">New This Month</span>
                        <span className="text-xl font-bold text-blue-400">
                          287
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Navigation Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              onClick={() => navigate("/staff/directory")}
            >
              <Users className="w-4 h-4 mr-2" />
              View Staff Directory
            </Button>
            <Button
              variant="outline"
              className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              onClick={() => navigate("/staff/admin")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Tools
            </Button>
            <Button
              variant="outline"
              className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              onClick={() => navigate("/staff")}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Staff Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
