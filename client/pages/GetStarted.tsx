import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus,
  Settings,
  LayoutDashboard,
  BookOpen,
  Users,
  LifeBuoy,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Trophy,
  Bot,
  IdCard,
  Zap,
  Shield,
  Globe,
  Gamepad2,
  Building2,
  FlaskConical,
  Building,
  Wrench,
  Link2,
  Play,
  ChevronDown,
  ChevronUp,
  Quote,
  Star,
} from "lucide-react";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 300);
    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);
  
  return <>{count.toLocaleString()}</>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/40 hover:border-aethex-400/30 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function GetStarted() {
  const steps = [
    {
      title: "Create your account",
      description: "Sign up with email or GitHub/Google.",
      icon: UserPlus,
      points: [
        "Secure auth via Supabase",
        "Email verification",
        "OAuth supported",
      ],
      cta: { label: "Join AeThex", href: "/onboarding" },
      color: "from-aethex-500 to-neon-blue",
    },
    {
      title: "Complete onboarding",
      description: "Tell us what you build to personalize your experience.",
      icon: Settings,
      points: ["Profile basics", "Interests & skills", "Realm & level"],
      cta: { label: "Start Onboarding", href: "/onboarding" },
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      title: "Explore your dashboard",
      description: "Manage profile, projects, applications, and rewards.",
      icon: LayoutDashboard,
      points: [
        "Profile & settings",
        "Community feed",
        "Achievements & rewards",
      ],
      cta: { label: "Open Dashboard", href: "/dashboard" },
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const platformFeatures = [
    {
      title: "XP & Leveling",
      description: "Earn XP and level up to unlock features",
      icon: Trophy,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "AI Agents",
      description: "10 specialized AI personas for guidance",
      icon: Bot,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Creator Passports",
      description: "Portable profile with achievements and skills",
      icon: IdCard,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Real-time Community",
      description: "Connect with fellow builders through posts, comments, and direct collaboration. Share progress and find teammates.",
      icon: Users,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Achievement Badges",
      description: "Unlock badges for milestones like first post, mentorship, event attendance, and project completions.",
      icon: Sparkles,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Secure & Private",
      description: "Enterprise-grade security with Supabase authentication, role-based access, and encrypted data storage.",
      icon: Shield,
      color: "from-slate-500 to-gray-600",
    },
  ];

  const realms = [
    {
      id: "nexus",
      label: "NEXUS",
      description: "The marketplace hub for opportunities, contracts, and commissions.",
      icon: Globe,
      color: "from-violet-500 to-purple-600",
      features: ["Job board", "Contracts", "Proposals"],
    },
    {
      id: "gameforge",
      label: "GAMEFORGE",
      description: "Game development powerhouse for building immersive experiences.",
      icon: Gamepad2,
      color: "from-green-500 to-emerald-600",
      features: ["Sprints", "Assets", "Playtests"],
    },
    {
      id: "foundation",
      label: "FOUNDATION",
      description: "Learn and grow through courses, mentorship, and skill tracking.",
      icon: Building2,
      color: "from-red-500 to-rose-600",
      features: ["Courses", "Mentors", "Badges"],
    },
    {
      id: "labs",
      label: "LABS",
      description: "Research and experimentation pushing the boundaries of possible.",
      icon: FlaskConical,
      color: "from-yellow-500 to-amber-600",
      features: ["R&D", "Experiments", "Deep-dives"],
    },
    {
      id: "corp",
      label: "CORP",
      description: "Enterprise solutions with managed services for organizations.",
      icon: Building,
      color: "from-blue-500 to-cyan-600",
      features: ["Support", "SLAs", "Integrations"],
    },
    {
      id: "staff",
      label: "STAFF",
      description: "Internal operations and team management for AeThex members.",
      icon: Wrench,
      color: "from-purple-500 to-violet-600",
      features: ["Admin", "Ops", "Tools"],
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Indie Game Developer",
      avatar: "🎮",
      quote: "AeThex transformed how I find collaborators. The Passport system makes it easy to showcase my work and connect with the right people.",
      rating: 5,
    },
    {
      name: "Sarah Mitchell",
      role: "Full Stack Engineer",
      avatar: "👩‍💻",
      quote: "The AI agents are incredible. Having specialized guidance for different aspects of development saves me hours of research every week.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Studio Lead @ PixelForge",
      avatar: "🚀",
      quote: "We've onboarded our entire team to AeThex. The GameForge realm is perfect for managing our sprint cycles and asset pipelines.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      avatar: "🎨",
      quote: "Love the XP system! It gamifies professional growth in a way that actually motivates me to engage more with the community.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Is AeThex free to use?",
      answer: "Yes! AeThex offers a generous free tier that includes full access to community features, XP & leveling, basic AI agent access, and your Creator Passport. Pro ($9/mo) and Council ($29/mo) tiers unlock additional AI personas and premium features.",
    },
    {
      question: "What are Realms and how do they work?",
      answer: "Realms are specialized areas of the platform, each designed for different aspects of building and collaboration. You can explore all 6 realms freely, but you'll set a primary realm during onboarding that personalizes your dashboard and recommendations.",
    },
    {
      question: "How does the XP system work?",
      answer: "You earn XP through various activities: daily logins (25 XP + streak bonus), completing your profile (100 XP), creating posts (20 XP), earning badges (200 XP), and more. Every 1000 XP you level up, unlocking recognition and features.",
    },
    {
      question: "Can I use AeThex for my team or studio?",
      answer: "Absolutely! The Corp realm offers enterprise solutions with dedicated support, custom integrations, and SLA guarantees. Teams can also collaborate freely in GameForge for game development or Nexus for general projects.",
    },
    {
      question: "What are AI Intelligent Agents?",
      answer: "AeThex includes 10 specialized AI personas powered by advanced language models. Each agent is tailored for specific domains like networking, game development, ethics, curriculum design, and more. Free users get access to core agents, while Pro/Council unlock the full roster.",
    },
    {
      question: "How do Creator Passports work?",
      answer: "Your Creator Passport is a portable profile that aggregates your achievements, verified skills, project contributions, and mentorship history. It serves as your professional identity across the AeThex ecosystem and can be shared externally.",
    },
  ];

  const quickLinks = [
    {
      title: "Documentation",
      desc: "Guides and API reference",
      icon: BookOpen,
      href: "/docs",
      color: "from-cyan-500 to-sky-500",
    },
    {
      title: "Community",
      desc: "Share progress & find collaborators",
      icon: Users,
      href: "/community",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Support",
      desc: "We're here to help",
      icon: LifeBuoy,
      href: "/support",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user && profile) navigate("/dashboard", { replace: true });
    if (user && !profile) navigate("/onboarding", { replace: true });
  }, [user, profile, loading, navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/40 via-background to-neon-blue/10" />
        <div className="container mx-auto px-4 relative z-10 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300">
              Join 12,000+ builders
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              <span className="text-gradient">Get Started with AeThex</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your account, personalize your experience, and ship faster
              with the platform built for builders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift"
              >
                <Link to="/onboarding" className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Join AeThex Free
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-aethex-400/50 hover:border-aethex-400"
              >
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-y border-border/30 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={12000} />+
              </div>
              <div className="text-sm text-muted-foreground">Builders</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border/50" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={500} />+
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border/50" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={6} duration={1000} />
              </div>
              <div className="text-sm text-muted-foreground">Realms</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border/50" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={10} duration={1000} />
              </div>
              <div className="text-sm text-muted-foreground">AI Agents</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border/50" />
            <div className="text-center flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300 mb-4">
              See it in action
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Watch the <span className="text-gradient">Platform Tour</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Get a quick overview of everything AeThex has to offer
            </p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-card/60 group cursor-pointer hover:border-aethex-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/60 via-background/80 to-neon-blue/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-aethex-500/30">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-muted-foreground text-sm">Video coming soon</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Platform Tour</span>
              <span>~3 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Steps */}
      <section className="py-12 sm:py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Get Up and Running in <span className="text-gradient">3 Steps</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              From signup to shipping in minutes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card
                  key={idx}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group"
                >
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardHeader className="space-y-3 pt-14">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {step.title}
                      </CardTitle>
                      <div
                        className={`w-10 h-10 rounded-md bg-gradient-to-r ${step.color} grid place-items-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {step.points.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-aethex-400/70" />{" "}
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${step.color}`}
                    >
                      <Link
                        to={step.cta.href}
                        className="flex items-center justify-center gap-2"
                      >
                        {step.cta.label}
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

      {/* Platform Features */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300 mb-4">
              Why AeThex
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Everything You Need to <span className="text-gradient-purple">Build & Grow</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              A comprehensive platform designed for creators, developers, and teams
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} grid place-items-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Realms Overview */}
      <section className="py-12 sm:py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300 mb-4">
              Explore the Ecosystem
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              <span className="text-gradient">6 Realms</span> for Every Builder
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Each realm is designed for different aspects of building and collaboration
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {realms.map((realm) => {
              const Icon = realm.icon;
              return (
                <Card
                  key={realm.id}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${realm.color} opacity-0 group-hover:opacity-15 transition-opacity`}
                  />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-md bg-gradient-to-r ${realm.color} grid place-items-center shrink-0`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{realm.label}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {realm.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {realm.features.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-aethex-400/50 hover:border-aethex-400">
              <Link to="/" className="flex items-center gap-2">
                Explore All Realms <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300 mb-4">
              Community Love
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              What <span className="text-gradient">Builders</span> Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <Card
                key={idx}
                className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/30 transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-aethex-400/30" />
                  <p className="text-muted-foreground leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aethex-500/20 to-neon-blue/20 flex items-center justify-center text-xl">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-aethex-400/40 text-aethex-300 mb-4">
              FAQ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Common <span className="text-gradient-purple">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gradient-purple">
              Helpful Resources
            </h2>
            <p className="text-sm text-muted-foreground">
              Jump into docs, community, or support
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickLinks.map((q) => {
              const Icon = q.icon;
              return (
                <Card
                  key={q.title}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${q.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-md bg-gradient-to-r ${q.color} grid place-items-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{q.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {q.desc}
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-border/60 hover:border-aethex-400/60"
                    >
                      <Link
                        to={q.href}
                        className="flex items-center justify-center gap-2"
                      >
                        Open
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

      {/* Footer CTA */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <Badge
            variant="outline"
            className="border-aethex-400/40 text-aethex-300"
          >
            Ready to build?
          </Badge>
          <h3 className="text-3xl sm:text-4xl font-bold">
            Join the <span className="text-gradient">AeThex Community</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create your free account today and start building with thousands of developers, designers, and innovators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift"
            >
              <Link to="/onboarding" className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> Get Started Free
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-aethex-400/50 hover:border-aethex-400"
            >
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
