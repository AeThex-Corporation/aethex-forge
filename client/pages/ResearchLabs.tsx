import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Beaker,
  Brain,
  CheckCircle,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  Microscope,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Directive = {
  title: string;
  codename: string;
  summary: string;
  status: "Exploratory" | "Operational" | "In Testing" | "Stealth";
  command: string;
  output: string[];
  link: string;
};

type Facility = {
  name: string;
  location: string;
  equipment: string[];
  capacity: string;
  status: "Operational" | "Scaling" | "Prototype";
  link: string;
};

type Transmission = {
  headline: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Critical";
  link: string;
};

const directives: Directive[] = [
  {
    title: "Project CHIMERA",
    codename: "Synthetic Cognition",
    summary:
      "Fusion of quantum-inspired architectures with autonomous design heuristics for adaptive content generation.",
    status: "Operational",
    command: "$ run status --project=chimera",
    output: [
      "[SYSTEM] Quantum nodes linked",
      "[I/O] Creativity gradient stable at 0.97",
      "[SECURITY] Containment protocols verified",
    ],
    link: "https://labs.aethex.biz/projects/chimera",
  },
  {
    title: "Project ENIGMA",
    codename: "Neural Defense",
    summary:
      "Real-time anomaly detection fabric with on-device heuristics hardened for hostile simulation environments.",
    status: "In Testing",
    command: "$ run status --project=enigma",
    output: [
      "[BUILD] Secure enclave compiled",
      "[TELEMETRY] Latency delta: -38%",
      "[FLAG] Adversarial fingerprints neutralised",
    ],
    link: "https://labs.aethex.biz/projects/enigma",
  },
  {
    title: "Project GENESIS",
    codename: "Distributed Worlds",
    summary:
      "Composable metaverse tooling that stitches persistent realms with live player-authored logic streams.",
    status: "Exploratory",
    command: "$ run status --project=genesis",
    output: [
      "[SIM] Multi-realm handshake accepted",
      "[GRAPH] Temporal mesh integrity: 99.2%",
      "[NEXT] Requesting narrative assets",
    ],
    link: "https://labs.aethex.biz/projects/genesis",
  },
];

const facilities: Facility[] = [
  {
    name: "Signal Processing Bay",
    location: "Deck 03 · Node West",
    equipment: [
      "GPU swarm (A100 x32)",
      "Photonic inference cores",
      "Adaptive RF shield array",
    ],
    capacity: "12 researchers",
    status: "Operational",
    link: "https://labs.aethex.biz/facilities/signal-bay",
  },
  {
    name: "Quantum Prototyping Wing",
    location: "Deck 07 · Core Atrium",
    equipment: [
      "Superconducting qubit stack",
      "Cryogenic vacuum chambers",
      "Stabilised frequency lattice",
    ],
    capacity: "9 researchers",
    status: "Scaling",
    link: "https://labs.aethex.biz/facilities/quantum-wing",
  },
  {
    name: "Defense Simulation Hub",
    location: "Deck 05 · South Array",
    equipment: [
      "Adversarial scenario engine",
      "Distributed threat sandbox",
      "Neural trace visualisers",
    ],
    capacity: "15 researchers",
    status: "Prototype",
    link: "https://labs.aethex.biz/facilities/defense-hub",
  },
];

const transmissions: Transmission[] = [
  {
    headline: "Zero-latency voxel streaming achieved",
    description:
      "Joint deployment between Labs mainframe and AeThex Forge cut render latency by 63% across 11 test regions.",
    category: "Breakthrough",
    priority: "High",
    link: "https://labs.aethex.biz/updates/voxel-streaming",
  },
  {
    headline: "Neural defense telemetry sync online",
    description:
      "Edge devices now receive live threat heuristics every 4.7 seconds via Labs relay with autonomous fallback.",
    category: "Deployment",
    priority: "Critical",
    link: "https://labs.aethex.biz/updates/neural-defense",
  },
  {
    headline: "Genesis Realm Editor private preview",
    description:
      "Closed group of 120 creators mapping persistent storylines with distributed logic patches in real time.",
    category: "Programs",
    priority: "Medium",
    link: "https://labs.aethex.biz/updates/genesis-preview",
  },
];

export default function ResearchLabs() {
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Labs mainframe linked");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Aligning with Labs mainframe..."
        showProgress={true}
        duration={900}
      />
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#facc15_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(250,204,21,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                  <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
                  Research & Development Uplink
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl lg:text-6xl">
                  AeThex | L.A.B.S. Interface
                </h1>

                <p className="text-lg text-yellow-100/90 sm:text-xl">
                  Real-time window into the AeThex Labs mainframe. Monitor
                  directives, facilities, and transmissions as they propagate
                  through the network.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.35)] transition hover:bg-yellow-300"
                  >
                    <a
                      href="https://labs.aethex.biz"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Microscope className="mr-2 h-5 w-5" />
                      Access Labs Mainframe
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <Link to="/docs">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Research Library
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-slate-800/80 bg-slate-900/60 text-yellow-200 hover:border-yellow-400/40"
                  >
                    <Link to="/contact">
                      <Beaker className="mr-2 h-5 w-5" />
                      Initiate Collaboration
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-yellow-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-12 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                    Core Directives
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-yellow-100/70 sm:text-base">
                    Programmes sourced from the Labs backbone. Tap into live
                    status feeds and request extended dossiers directly from the
                    Labs archive.
                  </p>
                </div>
                <Zap className="hidden h-10 w-10 text-yellow-400/70 sm:block" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {directives.map((directive) => (
                  <Card
                    key={directive.title}
                    className="flex h-full flex-col border border-yellow-400/20 bg-black/60 backdrop-blur"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-yellow-100">
                          {directive.title}
                        </CardTitle>
                        <Badge className="bg-yellow-500/10 text-xs text-yellow-300">
                          {directive.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm uppercase tracking-wide text-yellow-200/70">
                        {directive.codename}
                      </CardDescription>
                      <p className="text-sm text-yellow-100/80">
                        {directive.summary}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <div className="rounded border border-yellow-400/20 bg-black/70 p-4 font-mono text-xs text-green-400">
                        <div className="mb-2 text-yellow-200/80">
                          {directive.command}
                        </div>
                        <div className="space-y-1 text-green-300/90">
                          {directive.output.map((line) => (
                            <div key={line} className="truncate">
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="link"
                        className="justify-start px-0 text-yellow-300 hover:text-yellow-200"
                      >
                        <a
                          href={directive.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Request Full Report
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                    Labs Transmissions
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-yellow-100/70 sm:text-base">
                    Broadcasts directly from Labs operations. Filtered for
                    Research & Development stakeholders across AeThex networks.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="border-yellow-400/40 text-yellow-200 hover:bg-yellow-500/10"
                >
                  <a
                    href="https://labs.aethex.biz/updates"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Browse Labs Timeline
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="space-y-6">
                {transmissions.map((transmission) => (
                  <Card
                    key={transmission.headline}
                    className="border border-yellow-400/10 bg-black/70 backdrop-blur"
                  >
                    <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-yellow-400/70">
                          <span>{transmission.category}</span>
                          <span className="inline-flex items-center rounded-full border border-yellow-400/30 px-2 py-0.5 text-xs font-semibold text-yellow-200">
                            {transmission.priority} Priority
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-yellow-100">
                          {transmission.headline}
                        </h3>
                        <p className="max-w-3xl text-sm text-yellow-100/75">
                          {transmission.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-400/50 text-yellow-200 hover:bg-yellow-500/10"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Open Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-400/30 text-yellow-200"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Archive Packet
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="bg-yellow-400 text-black hover:bg-yellow-300"
                        >
                          <a
                            href={transmission.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Labs Detail
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-yellow-400/10 bg-black/85 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                  Research Facilities Network
                </h2>
                <p className="mt-3 text-sm text-yellow-100/70 sm:text-base">
                  Physical infrastructure tethered to Labs for rapid
                  prototyping, cyber defense simulations, and quantum-grade
                  production.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {facilities.map((facility) => (
                  <Card
                    key={facility.name}
                    className="flex h-full flex-col border border-yellow-400/15 bg-black/70 backdrop-blur"
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-yellow-100">
                          {facility.name}
                        </CardTitle>
                        <Badge className="bg-yellow-500/10 text-xs text-yellow-300">
                          {facility.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-yellow-200/70">
                        {facility.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-yellow-400/80">
                          Equipment Loadout
                        </p>
                        <div className="space-y-2">
                          {facility.equipment.map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-2 text-sm text-yellow-100/80"
                            >
                              <CheckCircle className="h-3 w-3 text-yellow-300" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-yellow-200/75">
                        Capacity:{" "}
                        <span className="font-semibold text-yellow-200">
                          {facility.capacity}
                        </span>
                      </div>
                      <Button
                        asChild
                        variant="link"
                        className="mt-auto justify-start px-0 text-yellow-300 hover:text-yellow-200"
                      >
                        <a
                          href={facility.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Inspect Facility
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto max-w-5xl px-4 text-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                  Sync With AeThex Labs
                </h2>
                <p className="mx-auto max-w-3xl text-sm text-yellow-100/70 sm:text-base">
                  Join the private Labs console for priority access to
                  directives, research packets, and sandbox environments crafted
                  by the Research & Development collective.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    <a
                      href="https://labs.aethex.biz/signup"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Request Labs Credentials
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-yellow-400/60 text-yellow-200 hover:bg-yellow-500/10"
                  >
                    <Link to="/community">
                      <Database className="mr-2 h-5 w-5" />
                      Meet the Research Community
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-8 pt-10 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Shield className="mx-auto h-8 w-8 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-100">
                      Secure Relay
                    </h3>
                    <p className="text-sm text-yellow-100/70">
                      Labs transmissions are signed and checksum verified every
                      90 seconds.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Cpu className="mx-auto h-8 w-8 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-100">
                      Adaptive Compute
                    </h3>
                    <p className="text-sm text-yellow-100/70">
                      Elastic compute mesh auto-balances workloads across Forge
                      and Labs infrastructure.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Beaker className="mx-auto h-8 w-8 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-100">
                      Rapid Experimentation
                    </h3>
                    <p className="text-sm text-yellow-100/70">
                      Prototype, validate, and deploy concepts with Labs-grade
                      toolchains in under 24 hours.
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-black/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300">
                    <span className="h-2 w-2 rounded-full bg-yellow-300 animate-pulse" />
                    System Nominal
                  </div>
                  <a
                    href="https://labs.aethex.biz/status"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-yellow-200 hover:text-yellow-100"
                  >
                    Labs Status Console
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
