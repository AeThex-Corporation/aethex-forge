import { useState, useEffect, useRef } from "react";
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
  BriefcaseIcon,
  Code,
  Sparkles,
  Zap,
  Users,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Database,
  Cloud,
  Settings,
  BarChart3,
  Puzzle,
  Rocket,
  Globe,
} from "lucide-react";

export default function DevelopmentConsulting() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePackage, setActivePackage] = useState(0);

  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Development Consulting services loaded");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const consultingServices = [
    {
      title: "Technical Architecture Review",
      description:
        "Comprehensive analysis of your system architecture and scalability",
      icon: Database,
      duration: "2-4 weeks",
      price: "Starting at $8,000",
      features: [
        "System architecture audit",
        "Performance bottleneck analysis",
        "Scalability recommendations",
        "Security assessment",
        "Technology stack evaluation",
      ],
      color: "from-fuchsia-500 to-rose-500",
    },
    {
      title: "DevOps & Infrastructure",
      description:
        "Streamline your development pipeline and cloud infrastructure",
      icon: Cloud,
      duration: "3-6 weeks",
      price: "Starting at $12,000",
      features: [
        "CI/CD pipeline setup",
        "Cloud migration strategy",
        "Monitoring & alerting",
        "Container orchestration",
        "Infrastructure as code",
      ],
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      title: "Code Quality & Optimization",
      description: "Improve code quality, performance, and maintainability",
      icon: Code,
      duration: "2-8 weeks",
      price: "Starting at $6,000",
      features: [
        "Code review & refactoring",
        "Performance optimization",
        "Testing strategy",
        "Documentation improvement",
        "Best practices implementation",
      ],
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Team & Process Consulting",
      description: "Optimize development workflows and team productivity",
      icon: Users,
      duration: "4-12 weeks",
      price: "Starting at $15,000",
      features: [
        "Agile methodology implementation",
        "Team structure optimization",
        "Workflow automation",
        "Knowledge transfer",
        "Leadership coaching",
      ],
      color: "from-fuchsia-400 to-pink-600",
    },
  ];

  const expertise = [
    {
      category: "Frontend Technologies",
      technologies: [
        "React",
        "Vue.js",
        "Angular",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
      ],
      icon: Puzzle,
      projects: "200+ projects",
    },
    {
      category: "Backend & APIs",
      technologies: ["Node.js", "Python", "Java", "Go", "GraphQL", "REST APIs"],
      icon: Settings,
      projects: "150+ systems",
    },
    {
      category: "Cloud & Infrastructure",
      technologies: [
        "AWS",
        "Azure",
        "GCP",
        "Docker",
        "Kubernetes",
        "Terraform",
      ],
      icon: Cloud,
      projects: "100+ deployments",
    },
    {
      category: "Databases & Analytics",
      technologies: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Elasticsearch",
        "BigQuery",
      ],
      icon: Database,
      projects: "80+ implementations",
    },
  ];

  const packages = [
    {
      name: "Quick Assessment",
      description: "Rapid technical evaluation for immediate insights",
      price: "$2,500",
      duration: "1 week",
      features: [
        "Initial system review",
        "Key recommendations",
        "Priority action items",
        "Executive summary",
        "30-min follow-up call",
      ],
      popular: false,
      color: "from-pink-400 via-fuchsia-500 to-rose-500",
    },
    {
      name: "Comprehensive Audit",
      description: "Deep-dive analysis with detailed roadmap",
      price: "$8,000",
      duration: "3-4 weeks",
      features: [
        "Full technical audit",
        "Detailed recommendations",
        "Implementation roadmap",
        "Risk assessment",
        "Team presentation",
        "3 months email support",
      ],
      popular: true,
      color: "from-fuchsia-500 via-pink-500 to-rose-500",
    },
    {
      name: "Strategic Partnership",
      description: "Ongoing consulting with hands-on implementation",
      price: "Custom",
      duration: "3-12 months",
      features: [
        "Dedicated consultant",
        "Monthly strategy sessions",
        "Implementation support",
        "Team training",
        "Priority support",
        "Quarterly reviews",
      ],
      popular: false,
      color: "from-rose-500 via-fuchsia-600 to-pink-700",
    },
  ];

  const caseStudies = [
    {
      title: "E-commerce Platform Scaling",
      client: "Fortune 500 Retailer",
      challenge: "10x traffic growth causing system failures",
      solution: "Microservices architecture with auto-scaling",
      results: [
        "99.99% uptime achieved",
        "50% cost reduction",
        "3x faster load times",
      ],
      tech: ["Kubernetes", "Redis", "CDN"],
    },
    {
      title: "FinTech Security Overhaul",
      client: "Financial Services Startup",
      challenge: "Security compliance for banking regulations",
      solution: "Zero-trust architecture with enhanced monitoring",
      results: ["SOC 2 compliance", "Zero breaches", "40% faster audits"],
      tech: ["OAuth 2.0", "Vault", "Istio"],
    },
    {
      title: "Legacy System Modernization",
      client: "Healthcare Provider",
      challenge: "20-year-old system blocking innovation",
      solution: "Gradual migration to cloud-native architecture",
      results: [
        "6 months migration",
        "60% performance boost",
        "Modern API ecosystem",
      ],
      tech: ["Docker", "GraphQL", "Postgres"],
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Development Consulting..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/40 via-transparent to-slate-950/60" />
          <div className="absolute inset-0 opacity-10">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-400/60 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${8 + Math.random() * 6}px`,
                }}
              >
                {"⚡🔧📊💡".charAt(Math.floor(Math.random() * 4))}
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-fuchsia-500/60 text-pink-200 animate-bounce-gentle"
              >
                <BriefcaseIcon className="h-3 w-3 mr-1" />
                Development Consulting Division
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-fuchsia-300 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Strategic Technology Consulting
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Expert guidance to optimize your development processes, scale
                your systems, and accelerate your digital transformation
                journey.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-600 hover:via-pink-500 hover:to-rose-500/90 shadow-[0_0_35px_rgba(236,72,153,0.45)] hover-lift"
                >
                  <Link
                    to="/engage#development-consulting"
                    className="flex items-center space-x-2"
                  >
                    <Target className="h-5 w-5" />
                    <span>Get Free Assessment</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-pink-400/50 text-pink-200 hover:border-pink-400 hover:bg-pink-500/10 hover-lift"
                >
                  <Link to="/docs">Case Studies</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 sm:py-20 bg-pink-500/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Consulting Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Specialized expertise to solve complex technical challenges
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {consultingServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={index}
                    className="relative overflow-hidden border-border/50 hover:border-pink-400/50 transition-all duration-500 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${service.color}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <CheckCircle className="h-3 w-3 text-pink-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-semibold text-pink-400">
                          <DollarSign className="h-4 w-4" />
                          <span>{service.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Our Technical Expertise
              </h2>
              <p className="text-lg text-muted-foreground">
                Deep knowledge across the modern technology stack
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {expertise.map((area, index) => {
                const Icon = area.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card/30 border-border/50 hover:border-pink-400/50 transition-all duration-300 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="text-center">
                      <Icon className="h-12 w-12 text-pink-400 mx-auto mb-3" />
                      <CardTitle className="text-lg">{area.category}</CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs border-pink-400/40 text-pink-200"
                      >
                        {area.projects}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {area.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs bg-pink-500/10 text-pink-100"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Consulting Packages */}
        <section className="py-16 sm:py-20 bg-rose-500/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Consulting Packages
              </h2>
              <p className="text-lg text-muted-foreground">
                Flexible engagement models to fit your needs and budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden transition-all duration-500 hover-lift animate-scale-in ${
                    pkg.popular
                      ? "border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.45)] scale-105"
                      : "border-border/50 hover:border-pink-400/50"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => setActivePackage(index)}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white px-3 py-1 text-xs font-semibold">
                      MOST POPULAR
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {pkg.description}
                    </CardDescription>
                    <div className="mt-4">
                      <div
                        className={`text-3xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}
                      >
                        {pkg.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.duration}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-pink-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className={`w-full ${
                        pkg.popular
                          ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-600 hover:via-pink-500 hover:to-rose-500/90"
                          : "border-pink-400/50 text-pink-200 hover:border-pink-400 hover:bg-pink-500/10"
                      }`}
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      <Link to="/engage#development-consulting">
                        Get Started
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-muted-foreground">
                Real results from our consulting engagements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {caseStudies.map((study, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-pink-400/50 transition-all duration-300 hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <Badge
                      variant="outline"
                      className="w-fit mb-2 border-pink-400/40 text-pink-200"
                    >
                      {study.client}
                    </Badge>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <CardDescription className="text-sm">
                      <strong>Challenge:</strong> {study.challenge}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Solution:</h4>
                      <p className="text-sm text-muted-foreground">
                        {study.solution}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Results:</h4>
                      <ul className="space-y-1">
                        {study.results.map((result, resultIndex) => (
                          <li
                            key={resultIndex}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <TrendingUp className="h-3 w-3 text-pink-400 flex-shrink-0" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {study.tech.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs bg-pink-500/10 text-pink-100"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-pink-500/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-fuchsia-300 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Ready to Accelerate Your Development?
              </h2>
              <p className="text-xl text-muted-foreground">
                Let our experts analyze your current setup and provide a roadmap
                for optimal performance and scalability.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-600 hover:via-pink-500 hover:to-rose-500/90 shadow-[0_0_35px_rgba(236,72,153,0.45)] hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link
                    to="/engage#development-consulting"
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Get Free Consultation</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-pink-400/50 text-pink-200 hover:border-pink-400 hover:bg-pink-500/10 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link to="/docs">Download Case Studies</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Confidential</h3>
                  <p className="text-sm text-muted-foreground">
                    NDAs & security first
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Global Expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    World-class consultants
                  </p>
                </div>
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Proven Results</h3>
                  <p className="text-sm text-muted-foreground">
                    500+ successful projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
