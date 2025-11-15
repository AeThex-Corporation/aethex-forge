import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, ArrowRight, Gamepad2, Users, Zap } from "lucide-react";

export default function GameForgeDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-green-950/20 to-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Rocket className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                GAMEFORGE Project Studio
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                This is the future home for your active game sprints, team Kanban boards, and build submissions per our GameForge Plan.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/30">
              <CardContent className="p-12 space-y-8">
                {/* Status */}
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                    <p className="text-sm font-semibold text-green-300">Coming Soon</p>
                  </div>
                  <p className="text-gray-300 text-lg">
                    The full bespoke GAMEFORGE dashboard with project management, team boards, and build tracking is currently in development per our Phase 3 Roadmap.
                  </p>
                </div>

                {/* Guiding CTA */}
                <div className="bg-black/40 rounded-lg p-8 border border-green-500/20 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-green-400" />
                      Join the Next Sprint!
                    </h3>
                    <p className="text-gray-300">
                      The GAMEFORGE is already active! Go to the FOUNDATION's community hub to apply for a mentor and join the next 1-month game jam.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/dashboard/foundation")}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-base group"
                  >
                    Go to FOUNDATION
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-950/30 border-green-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">🎮</p>
                  <p className="font-semibold text-white">Active Sprints</p>
                  <p className="text-sm text-gray-400">1-month game development cycles</p>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">👥</p>
                  <p className="font-semibold text-white">Team Collaboration</p>
                  <p className="text-sm text-gray-400">Kanban boards & sprint planning</p>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">🚀</p>
                  <p className="font-semibold text-white">Build Submissions</p>
                  <p className="text-sm text-gray-400">Ship your final game builds</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
