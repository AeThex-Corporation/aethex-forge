import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, FileText, Zap, Award, MessageSquare } from "lucide-react";

export default function Staff() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/staff/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <Layout>
      <SEO
        title="AeThex Staff"
        description="Internal platform for AeThex employees and authorized contractors"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-20 text-center">
            <Badge className="mb-4 inline-block bg-purple-500/20 text-purple-300 border-purple-500/50">
              Internal Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AeThex Staff
            </h1>

            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto mb-12">
              The internal hub for AeThex employees and authorized contractors.
              Unified access to dashboards, tools, documentation, and
              collaboration features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/staff/login")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Lock className="mr-2 h-5 w-5" />
                Staff Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                Back to AeThex
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-100">
              Staff Tools & Features
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard */}
              <Card className="border-purple-500/30 bg-purple-950/30 backdrop-blur hover:border-purple-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-purple-500/20">
                      <Zap className="h-5 w-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-purple-100">Dashboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-200/70">
                    Real-time operations metrics, service status, and quick
                    access to common tools.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Directory */}
              <Card className="border-blue-500/30 bg-blue-950/30 backdrop-blur hover:border-blue-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-blue-500/20">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-blue-100">Directory</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-200/70">
                    Browse team members, view profiles, and find contact
                    information.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Admin Tools */}
              <Card className="border-indigo-500/30 bg-indigo-950/30 backdrop-blur hover:border-indigo-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-indigo-500/20">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <CardTitle className="text-indigo-100">
                      Admin Tools
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-indigo-200/70">
                    Manage users, roles, permissions, and platform
                    configuration.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Docs */}
              <Card className="border-cyan-500/30 bg-cyan-950/30 backdrop-blur hover:border-cyan-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-cyan-500/20">
                      <FileText className="h-5 w-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-cyan-100">Docs & API</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-cyan-200/70">
                    Internal documentation, API keys, credentials, and setup
                    guides.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-amber-500/30 bg-amber-950/30 backdrop-blur hover:border-amber-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-amber-500/20">
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>
                    <CardTitle className="text-amber-100">
                      Achievements
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-amber-200/70">
                    Track team accomplishments, milestones, and performance
                    metrics.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Collaboration */}
              <Card className="border-rose-500/30 bg-rose-950/30 backdrop-blur hover:border-rose-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded bg-rose-500/20">
                      <MessageSquare className="h-5 w-5 text-rose-400" />
                    </div>
                    <CardTitle className="text-rose-100">
                      Collaboration
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-rose-200/70">
                    Internal chat, team discussions, and project coordination.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info Section */}
          <div className="container mx-auto px-4 py-20 border-t border-purple-500/20">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-purple-100">
                  Who Can Access?
                </h3>
                <ul className="space-y-3 text-purple-200/80">
                  <li className="flex gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>AeThex employees (@aethex.dev)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>Authorized contractors (invited)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>Partners with special access</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-purple-100">
                  Getting Started
                </h3>
                <ol className="space-y-3 text-purple-200/80">
                  <li className="flex gap-2">
                    <span className="text-purple-400">1.</span>
                    <span>Click "Staff Login" to sign in with Google</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">2.</span>
                    <span>Use your @aethex.dev email address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">3.</span>
                    <span>Access your personalized dashboard</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="container mx-auto px-4 py-12 text-center border-t border-purple-500/20">
            <p className="text-purple-300 mb-6">
              Not a staff member? Visit the public platform.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              Back to Main Site
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
