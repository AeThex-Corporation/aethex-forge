import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Database, ArrowRight, Briefcase, Users, Zap } from "lucide-react";

export default function DevLinkDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-cyan-950/20 to-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <Database className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                DEV-LINK Roblox Network
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                This is the future home for your specialized Roblox portfolio, team management, and B2B job feed per our EdTech GTM plan.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/30">
              <CardContent className="p-12 space-y-8">
                {/* Status */}
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                    <p className="text-sm font-semibold text-cyan-300">Coming Soon</p>
                  </div>
                  <p className="text-gray-300 text-lg">
                    The full bespoke DEV-LINK dashboard with Roblox-specific portfolio tools, team management, and B2B job feeds is currently in development per our Phase 3 Roadmap.
                  </p>
                </div>

                {/* Guiding CTA */}
                <div className="bg-black/40 rounded-lg p-8 border border-cyan-500/20 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                      Find a Roblox Job Today
                    </h3>
                    <p className="text-gray-300">
                      The DEV-LINK job board is already live! You can browse all open Roblox developer opportunities on our NEXUS marketplace right now.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/dashboard/nexus")}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-6 text-base group"
                  >
                    Go to NEXUS Marketplace
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-cyan-950/30 border-cyan-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">🎨</p>
                  <p className="font-semibold text-white">Roblox Portfolio</p>
                  <p className="text-sm text-gray-400">Showcase your creations & experiences</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">👥</p>
                  <p className="font-semibold text-white">Team Management</p>
                  <p className="text-sm text-gray-400">Collaborate with Roblox teams</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">💼</p>
                  <p className="font-semibold text-white">Job Feed</p>
                  <p className="text-sm text-gray-400">B2B opportunities & contracts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
