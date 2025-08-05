import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Brain, 
  Atom, 
  Cpu, 
  Database, 
  Shield, 
  Rocket,
  ArrowRight,
  CheckCircle,
  Eye,
  Download,
  ExternalLink,
  Beaker,
  Microscope
} from "lucide-react";

export default function ResearchLabs() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      aethexToast.system("Research & Labs division accessed");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const researchAreas = [
    {
      title: "Quantum Computing",
      description: "Advancing quantum algorithms for real-world applications",
      icon: Atom,
      status: "Active Research",
      papers: 12,
      breakthrough: "Quantum ML optimization algorithm",
      impact: "50% faster training",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Neural Architecture Search",
      description: "Automated discovery of optimal neural network designs",
      icon: Brain,
      status: "Production Ready",
      papers: 8,
      breakthrough: "AutoML framework",
      impact: "90% accuracy improvement",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Edge AI Systems",
      description: "Deploying AI models on resource-constrained devices",
      icon: Cpu,
      status: "Beta Testing",
      papers: 6,
      breakthrough: "Model compression technique",
      impact: "10x smaller models",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Blockchain Security",
      description: "Next-generation consensus algorithms and smart contract security",
      icon: Shield,
      status: "Research Phase",
      papers: 4,
      breakthrough: "Zero-knowledge protocols",
      impact: "Enhanced privacy",
      color: "from-orange-500 to-red-600"
    }
  ];

  const publications = [
    {
      title: "Quantum-Enhanced Machine Learning for Game AI",
      authors: "Dr. Sarah Chen, Dr. Marcus Zhang",
      journal: "Nature Quantum Information",
      year: "2024",
      citations: 127,
      type: "Peer Reviewed",
      impact: "High"
    },
    {
      title: "Efficient Neural Architecture Search Using Evolutionary Algorithms",
      authors: "Dr. Aisha Patel, Dr. John Liu",
      journal: "International Conference on Machine Learning",
      year: "2024",
      citations: 89,
      type: "Conference",
      impact: "Medium"
    },
    {
      title: "Edge Computing Framework for Real-time Game Analytics",
      authors: "Dr. Michael Chen, Dr. Lisa Wong",
      journal: "IEEE Transactions on Computers",
      year: "2023",
      citations: 156,
      type: "Peer Reviewed",
      impact: "High"
    }
  ];

  const labs = [
    {
      name: "Quantum AI Lab",
      location: "Building A, Floor 3",
      equipment: ["IBM Quantum System", "Superconducting Qubits", "Cryogenic Systems"],
      capacity: "12 researchers",
      status: "Operational"
    },
    {
      name: "Neural Networks Lab",
      location: "Building B, Floor 2", 
      equipment: ["GPU Clusters", "TPU Arrays", "High-Memory Systems"],
      capacity: "20 researchers",
      status: "Operational"
    },
    {
      name: "Blockchain Security Lab",
      location: "Building C, Floor 1",
      equipment: ["Security Testing Rigs", "Network Simulators", "Hardware Wallets"],
      capacity: "8 researchers",
      status: "Expanding"
    }
  ];

  if (isLoading) {
    return <LoadingScreen message="Accessing Research Division..." showProgress={true} duration={1000} />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-aethex-400 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${8 + Math.random() * 6}px`
                }}
              >
                {'⚛️🧠🔬⚡'.charAt(Math.floor(Math.random() * 4))}
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge variant="outline" className="border-neon-yellow/50 text-neon-yellow animate-bounce-gentle">
                <Beaker className="h-3 w-3 mr-1" />
                Research & Experimental Division
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">AeThex | L.A.B.S.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Pushing the boundaries of technology through cutting-edge research 
                and breakthrough discoveries that shape the future of digital innovation.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-neon-yellow to-aethex-600 hover:from-neon-yellow/90 hover:to-aethex-700 glow-yellow hover-lift">
                  <Link to="/contact" className="flex items-center space-x-2">
                    <Microscope className="h-5 w-5" />
                    <span>Collaborate With Us</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-border/50 hover-lift">
                  <Link to="/docs">Research Papers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Active Research Areas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Exploring frontiers in quantum computing, AI, and emerging technologies
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {researchAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <Card 
                    key={index}
                    className="relative overflow-hidden border-border/50 hover:border-neon-yellow/50 transition-all duration-500 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${area.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{area.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {area.status}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {area.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-gradient">{area.papers}</div>
                          <div className="text-xs text-muted-foreground">Publications</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-semibold">{area.breakthrough}</div>
                          <div className="text-xs text-muted-foreground">{area.impact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Publications */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Recent Publications
              </h2>
              <p className="text-lg text-muted-foreground">
                Our latest research contributions to the scientific community
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {publications.map((pub, index) => (
                <Card 
                  key={index}
                  className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gradient mb-2">{pub.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{pub.authors}</p>
                        <p className="text-sm font-medium">{pub.journal} • {pub.year}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={pub.impact === 'High' ? 'default' : 'secondary'}>
                          {pub.impact} Impact
                        </Badge>
                        <Badge variant="outline">{pub.type}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Citations: <span className="font-semibold text-aethex-400">{pub.citations}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Lab Facilities */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Research Facilities
              </h2>
              <p className="text-lg text-muted-foreground">
                State-of-the-art laboratories equipped with cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {labs.map((lab, index) => (
                <Card 
                  key={index}
                  className="border-border/50 hover:border-neon-yellow/50 transition-all duration-300 hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{lab.name}</CardTitle>
                      <Badge 
                        variant={lab.status === 'Operational' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {lab.status}
                      </Badge>
                    </div>
                    <CardDescription>{lab.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Equipment:</h4>
                      <div className="space-y-1">
                        {lab.equipment.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-aethex-400 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Capacity: <span className="font-medium">{lab.capacity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Join Our Research Community
              </h2>
              <p className="text-xl text-muted-foreground">
                Collaborate with world-class researchers and contribute to breakthrough discoveries 
                that will shape the future of technology.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-neon-yellow to-aethex-600 hover:from-neon-yellow/90 hover:to-aethex-700 glow-yellow hover-lift text-lg px-8 py-6">
                  <Link to="/contact" className="flex items-center space-x-2">
                    <Beaker className="h-5 w-5" />
                    <span>Research Partnership</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-neon-yellow/50 hover:border-neon-yellow hover-lift text-lg px-8 py-6">
                  <Link to="/docs">Access Publications</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Database className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Open Data</h3>
                  <p className="text-sm text-muted-foreground">Research datasets</p>
                </div>
                <div className="text-center">
                  <ExternalLink className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Collaborations</h3>
                  <p className="text-sm text-muted-foreground">University partnerships</p>
                </div>
                <div className="text-center">
                  <Rocket className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Breakthrough research</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
