import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Beaker,
  Briefcase,
  Heart,
  Network,
  Lock,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";

export default function About() {
  const pillars = [
    {
      id: "labs",
      name: "Labs",
      color: "from-yellow-500 to-orange-500",
      icon: Beaker,
      tagline: "The Innovation Engine",
      description:
        "Bleeding-edge R&D focused on proprietary technology and thought leadership",
      focus: [
        "Advanced AI & Machine Learning",
        "Next-gen Web Architectures",
        "Procedural Content Generation",
        "Graphics & Performance Optimization",
      ],
      function:
        "High-burn speculative research creating lasting competitive advantage",
    },
    {
      id: "corp",
      name: "Corp",
      color: "from-blue-500 to-cyan-500",
      icon: Briefcase,
      tagline: "The Profit Engine",
      description:
        "High-margin consulting and enterprise solutions subsidizing R&D investment",
      focus: [
        "Custom Software Development",
        "Enterprise Consulting",
        "Game Development Services",
        "Digital Transformation",
      ],
      function:
        "Stable revenue generation and financial discipline for investor confidence",
    },
    {
      id: "foundation",
      name: "Foundation",
      color: "from-red-500 to-pink-500",
      icon: Heart,
      tagline: "Community & Education",
      description:
        "Open-source and educational mission building goodwill and talent pipeline",
      focus: [
        "Open-Source Code Repositories",
        "Educational Curriculum",
        "Community Workshops",
        "Talent Development",
      ],
      function:
        "Goodwill moat, specialized talent pipeline, and ecosystem growth",
    },
    {
      id: "devlink",
      name: "Dev-Link",
      color: "from-cyan-500 to-blue-500",
      icon: Network,
      tagline: "Talent Network",
      description:
        "B2B SaaS platform for specialized professional networking and recruitment",
      focus: [
        "Recruitment Platform",
        "Talent Matching",
        "Professional Network",
        "Career Development",
      ],
      function:
        "Access-based moat and lock-in effect for specialized human capital",
    },
  ];

  const moats = [
    {
      title: "Technological Moat",
      description:
        "Labs creates proprietary AI and architectural innovations licensed to Corp and Dev-Link",
      icon: Shield,
      color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
    },
    {
      title: "Talent Moat",
      description:
        "Dev-Link and Foundation establish curated access to specialized immersive developers",
      icon: Users,
      color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
    },
    {
      title: "Community Moat",
      description:
        "Foundation builds trust and goodwill through open-source and educational mission",
      icon: Heart,
      color: "bg-red-500/20 border-red-500/40 text-red-300",
    },
  ];

  const benefits = [
    {
      title: "Risk Segregation",
      description:
        "Labs' high-burn R&D is isolated from operational liabilities, protecting core assets",
      icon: Lock,
    },
    {
      title: "Tax Optimization",
      description:
        "Corp and Dev-Link as profit centers, Foundation as 501(c)(3), optimizing UBIT exposure",
      icon: TrendingUp,
    },
    {
      title: "Investor Confidence",
      description:
        "Low burn multiples demonstrated through profitable Corp operations subsidizing R&D",
      icon: TrendingUp,
    },
    {
      title: "IP Centralization",
      description:
        "Labs acts as IP holding company with licensing to subsidiaries via transfer pricing",
      icon: Shield,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="py-16 lg:py-24 border-b border-gray-800">
          <div className="container mx-auto max-w-6xl px-4">
            <h1 className="text-5xl lg:text-7xl font-black mb-6">
              Building an Integrated{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-blue-300 to-red-300 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              AeThex operates as a unified four-pillar organization that
              combines speculative innovation, profitable operations, community
              impact, and specialized talent acquisition. This structure creates
              multiple reinforcing competitive moats while managing risk and
              maintaining investor confidence.
            </p>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-16 border-b border-gray-800">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-12">The Four Pillars</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card
                    key={pillar.id}
                    className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pillar.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>
                        <div className="text-2xl font-black">{pillar.name}</div>
                        <div className="text-sm font-normal text-gray-400 mt-1">
                          {pillar.tagline}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{pillar.description}</p>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">
                          KEY AREAS
                        </p>
                        <ul className="space-y-1">
                          {pillar.focus.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-400">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-800">
                        <p className="text-xs font-semibold text-gray-400 mb-2">
                          STRATEGIC FUNCTION
                        </p>
                        <p className="text-sm text-gray-300">
                          {pillar.function}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Competitive Moats */}
        <section className="py-16 border-b border-gray-800">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-6">
              Integrated Competitive Moats
            </h2>
            <p className="text-gray-300 mb-12 max-w-3xl">
              While competitors can replicate technology, the AeThex structure
              creates multiple, mutually-reinforcing barriers to entry that are
              far more resilient and defensible.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {moats.map((moat, idx) => {
                const Icon = moat.icon;
                return (
                  <Card
                    key={idx}
                    className={`border ${moat.color.split(" ")[1]} ${moat.color.split(" ")[0]} bg-black/40`}
                  >
                    <CardHeader>
                      <Icon className="h-8 w-8 mb-4" />
                      <CardTitle className="text-lg">{moat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        {moat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Benefits */}
        <section className="py-16 border-b border-gray-800">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-12">Strategic Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <Card key={idx} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Icon className="h-6 w-6 text-blue-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Governance & Compliance */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-6">Governance & Compliance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Parent Company Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Benefit Corporation status legally protects our dual mission
                    of profit and public benefit, enabling strategic investment
                    in research and community regardless of leadership or
                    capital changes.
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    Benefit Corp
                  </Badge>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Liability Isolation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Wholly-owned C-Corporation subsidiaries with separate
                    boards, bank accounts, and intercompany agreements maintain
                    the corporate veil and protect parent assets from
                    operational liabilities.
                  </p>
                  <Badge className="bg-yellow-500/20 text-yellow-300">
                    Risk Segregation
                  </Badge>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>IP Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Labs acts as IP Holding Company with formal licensing
                    agreements to Corp and Dev-Link at Fair Market Value,
                    enabling tax-efficient transfer pricing and centralized IP
                    control.
                  </p>
                  <Badge className="bg-green-500/20 text-green-300">
                    IPCo Strategy
                  </Badge>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Foundation Governance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Independent board majority, Fund Accounting, and
                    related-party transaction safeguards prevent private
                    inurement and maintain 501(c)(3) tax-exempt status.
                  </p>
                  <Badge className="bg-red-500/20 text-red-300">
                    Compliance First
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
