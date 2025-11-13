import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Briefcase, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CorpAbout() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/corp")}
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
              >
                ← Back to Corp
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-blue-300 sm:text-5xl mb-4">
                About AeThex Corp
              </h1>
              <p className="text-lg text-blue-100/80 max-w-2xl">
                Enterprise solutions for game development studios
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-lg border border-blue-400/30 bg-blue-950/20 p-8 mb-12">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Our Mission</h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  AeThex Corp provides world-class consulting and enterprise solutions to help studios scale their 
                  operations, optimize their infrastructure, and navigate the complexities of enterprise game development. 
                  We partner with industry leaders to deliver transformative results.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-blue-950/20 border-blue-400/30">
                  <CardHeader>
                    <Target className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Strategic guidance aligned with your business goals
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-950/20 border-blue-400/30">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Deep industry expertise and proven methodologies
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-950/20 border-blue-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Partnership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      True partnership to achieve your objectives together
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-950/20 border-blue-400/30">
                  <CardHeader>
                    <Award className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Measurable outcomes that drive real business value
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
