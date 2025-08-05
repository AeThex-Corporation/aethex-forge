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

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40">
        <div className="container mx-auto px-4">
          {!statsVisible ? (
            <SkeletonStats />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center space-y-3 animate-scale-in hover-lift interactive-scale"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex justify-center">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border border-aethex-400/20 hover:border-aethex-400/50 transition-all duration-300 hover-glow">
                        <Icon className="h-6 w-6 text-aethex-400 animate-pulse-glow" />
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gradient animate-bounce-gentle">{stat.value}</div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* User Paths Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Choose Your Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're a developer, client, community member, or customer,
              we have a tailored experience designed just for you.
            </p>
          </div>

          {!pathsVisible ? (
            <SkeletonUserPath />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {userPaths.map((path, index) => {
                const Icon = path.icon;
                return (
                  <Card
                    key={path.id}
                    className={`group hover-lift interactive-scale transition-all duration-500 bg-card/50 border-border/50 hover:border-aethex-400/50 hover:${path.glowClass} animate-slide-up`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${path.color} transition-all duration-300 group-hover:scale-110 animate-pulse-glow`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-gradient transition-all duration-300">{path.title}</CardTitle>
                          <CardDescription className="mt-1 group-hover:text-muted-foreground/80 transition-all duration-300">
                            {path.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {path.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm text-muted-foreground opacity-0 animate-slide-left"
                            style={{ animationDelay: `${(index * 0.2) + (featureIndex * 0.1)}s`, animationFillMode: 'forwards' }}
                          >
                            <CheckCircle className="h-3 w-3 text-aethex-400 flex-shrink-0 animate-bounce-gentle" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 interactive-scale glow-blue">
                        <Link to="/onboarding" className="flex items-center justify-center space-x-2 group">
                          <span>Get Started as {path.title}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Research & Labs Section */}
      <section className="py-20 bg-background/50 relative overflow-hidden">
        {/* Background Matrix Effect */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-neon-yellow text-xs font-mono animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              {Math.random().toString(36).substring(2, 8)}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-slide-up">
              <Badge variant="outline" className="border-neon-yellow/50 text-neon-yellow hover-glow animate-bounce-gentle">
                Research & Experimental Division
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="text-gradient animate-pulse-glow">AeThex | L.A.B.S.</span>
              </h2>
              <p className="text-xl text-muted-foreground animate-fade-in">
                Pushing the boundaries of technology through cutting-edge research
                and breakthrough discoveries that shape the future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
              <Button asChild variant="outline" size="lg" className="border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/10 hover-lift interactive-scale glow-yellow">
                <Link to="/research">Access Research</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-neon-yellow to-aethex-600 hover:from-neon-yellow/90 hover:to-aethex-700 hover-lift interactive-scale glow-yellow">
                <Link to="/labs">Visit Mainframe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-aethex-400 to-neon-blue rounded-full animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-scale-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple animate-pulse-glow">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in">
              Join thousands of developers, clients, and innovators who are already
              part of the AeThex ecosystem. Your future in technology starts here.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue text-lg px-8 py-6 hover-lift interactive-scale animate-bounce-gentle">
              <Link to="/onboarding" className="flex items-center space-x-2 group">
                <span>Begin Onboarding</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
