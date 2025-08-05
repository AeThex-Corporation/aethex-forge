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
  BookOpen,
  Code,
  Terminal,
  Download,
  ExternalLink,
  ArrowRight,
  Search,
  FileText,
  Video,
  Headphones,
  Github,
  Play,
} from "lucide-react";

export default function Documentation() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Documentation center loaded");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const docCategories = [
    {
      title: "Getting Started",
      description: "Quick start guides and tutorials for beginners",
      icon: Play,
      docs: 12,
      color: "from-green-500 to-emerald-600",
      sections: [
        "Installation",
        "First Steps",
        "Basic Concepts",
        "Hello World",
      ],
    },
    {
      title: "API Reference",
      description: "Complete API documentation with examples",
      icon: Code,
      docs: 45,
      color: "from-blue-500 to-cyan-600",
      sections: ["Authentication", "Endpoints", "SDKs", "Rate Limits"],
    },
    {
      title: "Tutorials",
      description: "Step-by-step guides for common use cases",
      icon: BookOpen,
      docs: 28,
      color: "from-purple-500 to-indigo-600",
      sections: [
        "Game Development",
        "Web Apps",
        "Mobile Apps",
        "AI Integration",
      ],
    },
    {
      title: "CLI Tools",
      description: "Command-line interface documentation",
      icon: Terminal,
      docs: 15,
      color: "from-orange-500 to-red-600",
      sections: ["Installation", "Commands", "Configuration", "Scripts"],
    },
  ];

  const quickStart = [
    {
      title: "Install AeThex SDK",
      command: "npm install @aethex/sdk",
      description: "Get started with our JavaScript SDK",
    },
    {
      title: "Initialize Project",
      command: "aethex init my-project",
      description: "Create a new AeThex project",
    },
    {
      title: "Deploy to Cloud",
      command: "aethex deploy --env production",
      description: "Deploy your application to AeThex Cloud",
    },
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Visual learning with step-by-step video guides",
      icon: Video,
      count: "50+ videos",
      link: "/tutorials",
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Podcast Series",
      description: "Deep dives into AeThex technology and best practices",
      icon: Headphones,
      count: "20+ episodes",
      link: "/podcast",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Code Examples",
      description: "Production-ready code samples and templates",
      icon: Github,
      count: "100+ repos",
      link: "/examples",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Downloads",
      description: "SDKs, tools, and assets for development",
      icon: Download,
      count: "Latest releases",
      link: "/downloads",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Documentation..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400 animate-bounce-gentle"
              >
                <FileText className="h-3 w-3 mr-1" />
                Documentation Center
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">
                  Developer Documentation
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive guides, API references, and tutorials to help you
                build amazing applications with AeThex technologies.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Browse Documentation
              </h2>
              <p className="text-lg text-muted-foreground">
                Find the information you need organized by category
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {docCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {category.title}
                            </CardTitle>
                            <Badge variant="outline">
                              {category.docs} docs
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {category.sections.map((section, sectionIndex) => (
                          <Button
                            key={sectionIndex}
                            variant="ghost"
                            size="sm"
                            className="justify-start text-xs h-8"
                          >
                            {section}
                          </Button>
                        ))}
                      </div>

                      <Button asChild className="w-full">
                        <Link
                          to={`/docs/${category.title.toLowerCase().replace(" ", "-")}`}
                        >
                          View {category.title}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Quick Start Guide
              </h2>
              <p className="text-lg text-muted-foreground">
                Get up and running with AeThex in minutes
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {quickStart.map((step, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 animate-slide-right"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gradient mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        <div className="bg-background/50 border border-border/30 rounded-lg p-3 font-mono text-sm">
                          <span className="text-muted-foreground">$ </span>
                          <span className="text-aethex-400">
                            {step.command}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Learning Resources
              </h2>
              <p className="text-lg text-muted-foreground">
                Multiple ways to learn and master AeThex technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={index}
                    className="text-center border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div
                        className={`mx-auto w-16 h-16 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-4">
                        {resource.count}
                      </Badge>
                      <Button asChild size="sm" className="w-full">
                        <Link to={resource.link}>
                          Explore
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Need Help Getting Started?
              </h2>
              <p className="text-xl text-muted-foreground">
                Our documentation is continuously updated. Can't find what
                you're looking for? Our support team is here to help.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-lg px-8 py-6"
                >
                  <Link to="/support" className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Get Support</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-lg px-8 py-6"
                >
                  <Link to="/community">Join Community</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
