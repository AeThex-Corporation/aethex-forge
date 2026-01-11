import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Boxes,
  BookOpen,
  Rocket,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  Users,
  Trophy,
  Database,
  Gamepad2,
  Code2,
  Zap,
  Globe,
} from "lucide-react";

const ecosystemPillars = [
  {
    icon: Boxes,
    title: "Six Realms",
    description: "Specialized APIs for every use case",
    href: "/realms",
    gradient: "from-purple-500 via-purple-600 to-indigo-600",
    accentColor: "hsl(var(--primary))",
  },
  {
    icon: Database,
    title: "Developer APIs",
    description: "REST APIs for all platforms",
    href: "/dev-platform/api-reference",
    gradient: "from-blue-500 via-blue-600 to-cyan-600",
    accentColor: "hsl(var(--primary))",
  },
  {
    icon: Terminal,
    title: "SDK & Tools",
    description: "Ship faster with TypeScript SDK",
    href: "/dev-platform/quick-start",
    gradient: "from-cyan-500 via-teal-600 to-emerald-600",
    accentColor: "hsl(var(--primary))",
  },
  {
    icon: Layers,
    title: "Marketplace",
    description: "Premium plugins & integrations",
    href: "/dev-platform/marketplace",
    gradient: "from-emerald-500 via-green-600 to-lime-600",
    accentColor: "hsl(var(--primary))",
  },
  {
    icon: Users,
    title: "Community",
    description: "12K+ developers building together",
    href: "/community",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    accentColor: "hsl(var(--primary))",
  },
  {
    icon: Trophy,
    title: "Opportunities",
    description: "Get paid to build",
    href: "/opportunities",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    accentColor: "hsl(var(--primary))",
  },
];

const stats = [
  { value: "12K+", label: "Developers" },
  { value: "2.5M+", label: "API Calls/Day" },
  { value: "150+", label: "Code Examples" },
  { value: "6", label: "Realms" },
];

const features = [
  {
    icon: Layers,
    title: "Cross-Platform Integration",
    description: "One API for all metaverse platforms",
  },
  {
    icon: Code2,
    title: "Enterprise Developer Tools",
    description: "Production-ready SDK and APIs",
  },
  {
    icon: Gamepad2,
    title: "Six Specialized Realms",
    description: "Unique APIs for every use case",
  },
  {
    icon: Trophy,
    title: "Monetize Your Skills",
    description: "12K+ developers earning on AeThex",
  },
  {
    icon: Users,
    title: "Creator Economy",
    description: "Collaborate and grow your reputation",
  },
  {
    icon: Rocket,
    title: "Ship Fast",
    description: "150+ examples and one-click deployment",
  },
];

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <Layout hideFooter>
      <SEO
        pageTitle="AeThex | Developer Ecosystem"
        description="Build powerful applications on the AeThex ecosystem. Access 6 specialized realms, comprehensive APIs, and a thriving developer community."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[128px] opacity-20 bg-primary/30"
          style={{
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[128px] opacity-20 bg-primary/40"
          style={{
            right: -100,
            top: 200,
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-[128px] opacity-15 bg-primary/35"
          style={{
            left: -100,
            bottom: -100,
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Scanlines */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.1) 2px, hsl(var(--primary) / 0.1) 4px)",
          }}
        />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 border-t-2 border-l-2 border-primary/30" />
        <div className="absolute top-0 right-0 w-64 h-64 border-t-2 border-r-2 border-primary/30" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border-b-2 border-l-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 w-64 h-64 border-b-2 border-r-2 border-primary/30" />
      </div>

      <div className="relative space-y-40 pb-40">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="relative text-center max-w-6xl mx-auto space-y-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge 
                className="text-sm px-6 py-2 backdrop-blur-xl bg-primary/10 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all uppercase tracking-wider font-bold"
              >
                <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
                AeThex Developer Ecosystem
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                Build on
                <br />
                <span className="relative inline-block mt-4">
                  <span className="relative z-10 text-primary drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]" style={{ textShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}>
                    AeThex
                  </span>
                  <motion.div
                    className="absolute -inset-8 bg-primary blur-3xl opacity-40"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light"
            >
              The <span className="text-primary font-bold">integration layer</span> connecting all metaverse platforms.
              <br className="hidden md:block" />
              Six specialized realms. <span className="text-primary font-semibold">12K+ developers</span>. One powerful ecosystem.
            </motion.p>
            
            {/* Platform Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm md:text-base max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/5 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Gamepad2 className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-foreground/90 font-bold uppercase tracking-wide">Roblox</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/5 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Boxes className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-foreground/90 font-bold uppercase tracking-wide">Minecraft</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/5 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Globe className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-foreground/90 font-bold uppercase tracking-wide">Meta Horizon</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/5 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Zap className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-foreground/90 font-bold uppercase tracking-wide">Fortnite</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/5 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <Users className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-foreground/90 font-bold uppercase tracking-wide">Zepeto</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-primary/10 px-4 py-2 rounded-full border-2 border-primary/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
                <span className="text-foreground/90 font-black uppercase tracking-wide">& More</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center pt-8"
            >
              <Link to="/dev-platform/quick-start">
                <Button 
                  size="lg" 
                  className="text-base px-8 h-12 bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] hover:scale-105 transition-all duration-300 font-bold uppercase tracking-wide border-2 border-primary/50"
                >
                  Start Building
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/dev-platform/api-reference">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 h-12 backdrop-blur-xl bg-background/50 border-2 border-primary/40 hover:bg-primary/10 hover:border-primary/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-105 transition-all duration-300 font-bold uppercase tracking-wide"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore APIs
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                  className="relative group"
                >
                  <div className="relative backdrop-blur-xl bg-background/30 border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                    <p className="text-4xl md:text-5xl font-black text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.5, duration: 0.5 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-primary rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </section>

        <section className="space-y-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-black text-primary">
              The AeThex Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Six interconnected realms with unique APIs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ecosystemPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={pillar.href}>
                  <Card className="group relative overflow-hidden h-full border-2 hover:border-transparent transition-all duration-300">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10"
                    />
                    
                    {hoveredCard === index && (
                      <motion.div
                        className="absolute inset-0 blur-xl opacity-30 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    
                    <div className="relative p-8 space-y-4 backdrop-blur-sm">
                      <div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                        style={{
                          boxShadow: `0 20px 40px hsl(var(--primary) / 0.4)`,
                        }}
                      >
                        <pillar.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-all duration-300">
                          {pillar.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-sm font-medium mr-2">Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-black text-primary">
              Why Build on AeThex?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for creators and developers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-10 space-y-8 backdrop-blur-xl bg-background/50 border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/50">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl max-w-6xl mx-auto border-2 border-primary/40"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background/50 backdrop-blur-xl" />
            
            {/* Animated Grid */}
            <div 
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            
            {/* Glowing Orb */}
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/30 blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative z-10 p-12 md:p-20 text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="text-sm px-6 py-2 bg-primary/20 border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] uppercase tracking-wider font-bold mb-6">
                  <Terminal className="w-4 h-4 mr-2 inline" />
                  Start Building Today
                </Badge>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
              >
                Ready to Build Something
                <br />
                <span className="text-primary drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">Epic?</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light"
              >
                Get your API key and start deploying across <span className="text-primary font-semibold">5+ metaverse platforms</span> in minutes
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center pt-6"
              >
                <Link to="/dev-platform/dashboard">
                  <Button 
                    size="lg" 
                    className="text-base px-8 h-12 bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] hover:scale-105 transition-all duration-300 font-bold uppercase tracking-wide border-2 border-primary/50"
                  >
                    Get Your API Key
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/realms">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base px-8 h-12 backdrop-blur-xl bg-background/50 border-2 border-primary/40 hover:bg-primary/10 hover:border-primary/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-105 transition-all duration-300 font-bold uppercase tracking-wide"
                  >
                    Explore Realms
                    <Boxes className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}
