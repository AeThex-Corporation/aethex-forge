import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, FileText, MessageSquare, Zap } from "lucide-react";

export default function StaffDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                STAFF Employee Portal
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                This is the future A-Corp internal dashboard for OKRs, benefits, and HR tools.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30">
              <CardContent className="p-12 space-y-8">
                {/* Status */}
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <p className="text-sm font-semibold text-purple-300">Coming Soon</p>
                  </div>
                  <p className="text-gray-300 text-lg">
                    The full bespoke STAFF dashboard with OKR tracking, benefits management, and HR tools is currently in development per our Phase 3 Roadmap.
                  </p>
                </div>

                {/* Guiding CTA */}
                <div className="bg-black/40 rounded-lg p-8 border border-purple-500/20 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      Access Internal Resources
                    </h3>
                    <p className="text-gray-300">
                      All A-Corp SOPs, Handbooks, and Benefit Guides are located in our Internal Doc Hub. All team chat happens in our private Slack.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => window.open("https://docs.aethex.dev", "_blank")}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 text-base group"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Open Internal Doc Hub
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                    </Button>
                    <Button
                      onClick={() => window.open("https://slack.com", "_blank")}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-base group"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Slack
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-purple-950/30 border-purple-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">🎯</p>
                  <p className="font-semibold text-white">OKRs & Goals</p>
                  <p className="text-sm text-gray-400">Track quarterly objectives</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-950/30 border-purple-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">💰</p>
                  <p className="font-semibold text-white">Benefits & Payroll</p>
                  <p className="text-sm text-gray-400">Manage compensation & benefits</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-950/30 border-purple-500/20">
                <CardContent className="p-6 space-y-3">
                  <p className="text-2xl">📚</p>
                  <p className="font-semibold text-white">Company Resources</p>
                  <p className="text-sm text-gray-400">SOPs, handbooks & guides</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
