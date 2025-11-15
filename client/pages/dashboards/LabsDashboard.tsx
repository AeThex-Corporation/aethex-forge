import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, ArrowRight, Sparkles } from "lucide-react";

export default function LabsDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/20 to-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <Code2 className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                LABS R&D Hub
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                This is the future home for all LABS R&D projects, IP management, and whitepaper publications.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/30">
              <CardContent className="p-12 space-y-8">
                {/* Status */}
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <p className="text-sm font-semibold text-amber-300">Coming Soon</p>
                  </div>
                  <p className="text-gray-300 text-lg">
                    The full bespoke LABS dashboard with research project tracking, IP management, and publication tools is currently in development per our Phase 3 Roadmap.
                  </p>
                </div>

                {/* Guiding CTA */}
                <div className="bg-black/40 rounded-lg p-8 border border-amber-500/20 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      Explore Our Research
                    </h3>
                    <p className="text-gray-300">
                      You don't have to wait for the dashboard. You can read all our latest technical deep-dives and whitepapers on our official AeThex Blog right now.
                    </p>
                  </div>
                  <Button
                    onClick={() => window.open("https://aethex.blog", "_blank")}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-6 text-base group"
                  >
                    Go to AeThex Blog
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-amber-950/30 border-amber-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">📚</p>
                  <p className="font-semibold text-white">Research Projects</p>
                  <p className="text-sm text-gray-400">Track active R&D initiatives</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">🔒</p>
                  <p className="font-semibold text-white">IP Management</p>
                  <p className="text-sm text-gray-400">Secure access to our vault</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">📖</p>
                  <p className="font-semibold text-white">Publications</p>
                  <p className="text-sm text-gray-400">Whitepapers & technical docs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
