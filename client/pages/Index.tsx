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
  const [statsVisible, setStatsVisible] = useState(false);
  const [pathsVisible, setPathsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const statsTimer = setTimeout(() => {
      setStatsVisible(true);
    }, 2000);

    const pathsTimer = setTimeout(() => {
      setPathsVisible(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
      clearTimeout(pathsTimer);
    };
  }, []);

  const stats = [
    { value: "3", label: "Subsidiaries", icon: Target },
    { value: "1M+", label: "Community Members", icon: Users },
    { value: "50+", label: "Active Projects", icon: TrendingUp },
    { value: "99.9%", label: "Uptime Guarantee", icon: Zap },
  ];

  const userPaths = [
    {
      id: 'game-developer',
      title: 'Game Developer',
      description: 'Join our development community with access to tools, mentorship, and collaborative projects.',
      icon: GamepadIcon,
      features: ['Development Tools', 'Expert Mentorship', 'Project Collaboration', 'Technical Workshops'],
      color: 'from-neon-purple to-aethex-500'
    },
    {
      id: 'client',
      title: 'Client',
      description: 'Partner with us for custom game development and technical consulting services.',
      icon: BriefcaseIcon,
      features: ['Custom Development', 'Technical Consulting', 'Project Management', 'End-to-End Solutions'],
      color: 'from-neon-blue to-aethex-400'
    },
    {
      id: 'member',
      title: 'Community Member',
      description: 'Access cutting-edge research, networking opportunities, and exclusive content.',
      icon: UsersIcon,
      features: ['Research Access', 'Professional Network', 'Exclusive Events', 'Innovation Labs'],
      color: 'from-neon-green to-aethex-600'
    },
    {
      id: 'customer',
      title: 'Customer',
      description: 'Explore our games, tools, and products designed for enhanced experiences.',
      icon: ShoppingCartIcon,
      features: ['Premium Games', 'Development Tools', 'Beta Access', 'Community Support'],
      color: 'from-neon-yellow to-aethex-700'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
                <Sparkles className="h-3 w-3 mr-1" />
                Innovation & Technology
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">The Home of Innovation</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Welcome to AeThex Corporation, the central hub for our family of companies
                dedicated to pushing the boundaries of development, automation, and technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue">
                <Link to="/onboarding" className="flex items-center space-x-2">
                  <span>Join AeThex</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border/50">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border border-aethex-400/20">
                      <Icon className="h-6 w-6 text-aethex-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Paths Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Choose Your Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're a developer, client, community member, or customer,
              we have a tailored experience designed just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {userPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card
                  key={path.id}
                  className="group hover:scale-105 transition-all duration-300 bg-card/50 border-border/50 hover:border-aethex-400/50 hover:glow-purple"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${path.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {path.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {path.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-aethex-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90">
                      <Link to="/onboarding" className="flex items-center justify-center space-x-2">
                        <span>Get Started as {path.title}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research & Labs Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-neon-yellow/50 text-neon-yellow">
                Research & Experimental Division
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="text-gradient">AeThex | L.A.B.S.</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Pushing the boundaries of technology through cutting-edge research
                and breakthrough discoveries that shape the future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="outline" size="lg" className="border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/10">
                <Link to="/research">Access Research</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-neon-yellow to-aethex-600 hover:from-neon-yellow/90 hover:to-aethex-700">
                <Link to="/labs">Visit Mainframe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers, clients, and innovators who are already
              part of the AeThex ecosystem. Your future in technology starts here.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue text-lg px-8 py-6">
              <Link to="/onboarding" className="flex items-center space-x-2">
                <span>Begin Onboarding</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
