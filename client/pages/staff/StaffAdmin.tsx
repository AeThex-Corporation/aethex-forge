import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Settings,
  GitBranch,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function StaffAdmin() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login");
      return;
    }
    const isAdmin = roles?.some((r) =>
      ["owner", "admin", "founder"].includes(r.toLowerCase()),
    );
    if (!isAdmin) {
      navigate("/staff/dashboard");
    }
  }, [user, roles, loading, navigate]);

  if (loading)
    return (
      <Layout>
        <div className="container py-20">Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Tools</h1>
            <p className="text-slate-400">
              Manage users, roles, and platform configuration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Management */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="h-5 w-5 text-blue-400" />
                      Users
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage team members and roles
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Shield className="h-5 w-5 text-purple-400" />
                      Permissions
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Configure role-based access
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Manage Roles
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="h-5 w-5 text-indigo-400" />
                      Settings
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Platform configuration
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Edit Settings
                </Button>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <GitBranch className="h-5 w-5 text-green-400" />
                      API Keys
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage authentication tokens
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View API Keys
                </Button>
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="h-5 w-5 text-yellow-400" />
                      Audit Log
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Platform activity history
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  View Logs
                </Button>
              </CardContent>
            </Card>

            {/* Maintenance */}
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <RefreshCw className="h-5 w-5 text-red-400" />
                      Maintenance
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      System operations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  System Maintenance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
