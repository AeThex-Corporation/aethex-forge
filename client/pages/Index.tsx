import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { SkeletonStats, SkeletonUserPath } from "@/components/Skeleton";
import { Link } from "react-router-dom";
import {
  GamepadIcon,
  BriefcaseIcon,
  UsersIcon,
  ShoppingCartIcon,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Users,
  TrendingUp
} from "lucide-react";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Neural Networks",
      description: "Advanced AI-powered development tools",
      icon: Zap,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Quantum Computing",
      description: "Next-generation processing capabilities",
      icon: Target,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Blockchain Integration",
      description: "Secure, decentralized solutions",
      icon: Users,
      color: "from-green-500 to-blue-600"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable, global deployment systems",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600"
    }
  ];

  const achievements = [
    { metric: "10K+", label: "Active Developers" },
    { metric: "500+", label: "Projects Deployed" },
    { metric: "99.99%", label: "System Uptime" },
    { metric: "24/7", label: "Global Support" }
  ];

  if (isLoading) {
    return <LoadingScreen message="Initializing AeThex Systems..." showProgress={true} duration={1200} />;
  }

  return (
    <Layout>
      {/* Hero Section - Geometric Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/50 via-background to-aethex-800/50" />
          <div className="absolute inset-0">
            {/* Large Logo-inspired Geometric Shape */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-96 h-96 opacity-5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=800"
                  alt="Background"
                  className="w-full h-full animate-float"
                />
              </div>
            </div>

            {/* Floating Geometric Elements */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-aethex-400/20 animate-float"
                style={{
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-12">
            {/* Logo and Title */}
            <div className="space-y-6 animate-scale-in">
              <div className="flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=800"
                  alt="AeThex Logo"
                  className="h-32 w-32 animate-pulse-glow hover:animate-bounce-gentle transition-all duration-500"
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold">
                  <span className="text-gradient-purple">AeThex</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl text-gradient animate-fade-in">
                  Crafting Digital Realities
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                  Where innovation meets execution. We build the future through advanced
                  technology, creative solutions, and limitless possibilities.
                </p>
              </div>
            </div>

            {/* Interactive Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeSection === index;
                return (
                  <Card
                    key={index}
                    className={`relative overflow-hidden border-2 transition-all duration-500 hover-lift cursor-pointer group ${
                      isActive
                        ? 'border-aethex-500 glow-blue scale-105'
                        : 'border-border/30 hover:border-aethex-400/50'
                    }`}
                    onClick={() => setActiveSection(index)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`mx-auto w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up">
              <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-lg px-8 py-6">
                <Link to="/onboarding" className="flex items-center space-x-2 group">
                  <Sparkles className="h-5 w-5" />
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-lg px-8 py-6">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-background/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Powering Innovation Worldwide
              </h2>
              <p className="text-lg text-muted-foreground">
                Our impact across the digital landscape
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center space-y-4 animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative">
                    <div className="text-4xl lg:text-5xl font-bold text-gradient-purple animate-pulse-glow">
                      {achievement.metric}
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-aethex-400/20 to-neon-blue/20 rounded-lg blur-xl opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/20 via-transparent to-neon-blue/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-6">
                Next-Generation Technology Stack
              </h2>
              <p className="text-lg text-muted-foreground">
                Built on cutting-edge frameworks and powered by advanced algorithms
              </p>
            </div>

            {/* Interactive Technology Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {[
                { name: "Quantum AI", status: "Active", color: "from-purple-500 to-blue-600" },
                { name: "Neural Networks", status: "Optimizing", color: "from-blue-500 to-green-600" },
                { name: "Blockchain Core", status: "Secure", color: "from-green-500 to-yellow-600" },
                { name: "Cloud Matrix", status: "Scaling", color: "from-yellow-500 to-red-600" },
                { name: "Data Fusion", status: "Processing", color: "from-red-500 to-purple-600" },
                { name: "Edge Computing", status: "Deployed", color: "from-purple-500 to-pink-600" }
              ].map((tech, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden bg-card/30 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gradient group-hover:animate-pulse">
                        {tech.name}
                      </h3>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tech.color} animate-pulse`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{tech.status}</p>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aethex-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-2xl font-bold text-gradient-purple">
                Ready to Build the Future?
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift interactive-scale">
                  <Link to="/onboarding" className="flex items-center space-x-2 group">
                    <Sparkles className="h-5 w-5" />
                    <span>Join AeThex</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-aethex-400/50 hover:border-aethex-400 hover-lift interactive-scale">
                  <Link to="/dashboard">Explore Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
