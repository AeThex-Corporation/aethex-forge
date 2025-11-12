import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />

        <main className="relative z-10">
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-7xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/hub/client")}
                className="mb-4 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <h1 className="text-3xl font-bold">Dashboard</h1>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-6">
                    Advanced dashboard analytics coming soon
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/hub/client")}
                  >
                    Back to Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
