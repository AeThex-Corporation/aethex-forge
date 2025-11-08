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
  Headphones,
  MessageCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Book,
  Video,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Settings,
  Bug,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default function Support() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Support center loaded successfully");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const supportOptions = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "< 5 minutes",
      bestFor: "Urgent issues, quick questions",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Email Support",
      description: "Detailed assistance for complex problems",
      icon: Mail,
      availability: "Business hours",
      responseTime: "< 4 hours",
      bestFor: "Technical issues, account problems",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Phone Support",
      description: "Direct conversation with technical experts",
      icon: Phone,
      availability: "Mon-Fri 9AM-6PM PST",
      responseTime: "Immediate",
      bestFor: "Enterprise customers, urgent issues",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Community Forum",
      description: "Get help from the community and experts",
      icon: Headphones,
      availability: "24/7",
      responseTime: "< 2 hours",
      bestFor: "General questions, discussions",
      color: "from-orange-500 to-red-600",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first AeThex project?",
          answer:
            "Install the AeThex CLI with 'npm install -g @aethex/cli', then run 'aethex create my-project' to get started.",
          helpful: 89,
        },
        {
          question: "What are the system requirements?",
          answer:
            "AeThex works on Windows 10+, macOS 10.15+, and Ubuntu 18.04+. You'll need Node.js 16+ and 4GB RAM minimum.",
          helpful: 76,
        },
      ],
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "My game is running slowly, how can I optimize it?",
          answer:
            "Check our performance optimization guide. Common fixes include reducing texture sizes, optimizing scripts, and using object pooling.",
          helpful: 94,
        },
        {
          question: "How do I fix deployment errors?",
          answer:
            "Most deployment errors are due to configuration issues. Check your environment variables and API keys in the AeThex dashboard.",
          helpful: 82,
        },
      ],
    },
    {
      category: "Billing & Account",
      questions: [
        {
          question: "How do I upgrade my plan?",
          answer:
            "Visit your account dashboard and click 'Upgrade Plan'. Changes take effect immediately with prorated billing.",
          helpful: 91,
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel anytime from your account settings. You'll retain access until the end of your billing period.",
          helpful: 88,
        },
      ],
    },
  ];

  const resources = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API references",
      icon: Book,
      link: "/docs",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step visual learning",
      icon: Video,
      link: "/tutorials",
      color: "from-red-500 to-pink-600",
    },
    {
      title: "System Status",
      description: "Real-time service status and updates",
      icon: Settings,
      link: "/status",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Feature Requests",
      description: "Suggest new features and improvements",
      icon: Sparkles,
      link: "/feedback",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const categories = [
    "all",
    "getting-started",
    "technical",
    "billing",
    "account",
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) =>
          faq.category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .includes(selectedCategory.replace("-", " ")),
        );

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Support Center..."
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
                <Headphones className="h-3 w-3 mr-1" />
                Support Center
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">We're Here to Help</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get the support you need to succeed with AeThex. Our team of
                experts is ready to help you overcome any challenge.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Choose Your Support Channel
              </h2>
              <p className="text-lg text-muted-foreground">
                Multiple ways to get help based on your needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${option.color}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {option.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {option.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Availability:
                          </span>
                          <span className="font-semibold text-aethex-400">
                            {option.availability}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Response Time:
                          </span>
                          <span className="font-semibold text-aethex-400">
                            {option.responseTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Best For:
                          </span>
                          <span className="font-semibold">
                            {option.bestFor}
                          </span>
                        </div>
                      </div>

                      <Button asChild className="w-full">
                        <Link to="/contact">
                          Get Support
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

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category, index) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`animate-scale-in ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-aethex-500 to-neon-blue"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category.charAt(0).toUpperCase() +
                      category.slice(1).replace("-", " ")}
                  </Button>
                ))}
              </div>

              {/* FAQ Cards */}
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xl font-semibold text-gradient mb-4">
                      {category.category}
                    </h3>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <Card
                          key={faqIndex}
                          className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 animate-slide-right"
                          style={{ animationDelay: `${faqIndex * 0.1}s` }}
                        >
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-lg">
                                  {faq.question}
                                </h4>
                                <HelpCircle className="h-5 w-5 text-aethex-400 flex-shrink-0 mt-0.5" />
                              </div>
                              <p className="text-muted-foreground">
                                {faq.answer}
                              </p>
                              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span>{faq.helpful}% found this helpful</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="ghost">
                                    👍 Helpful
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    👎 Not helpful
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Self-Help Resources
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to succeed with AeThex
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
                      <Button asChild size="sm" className="w-full">
                        <Link to={resource.link}>
                          Access Resource
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
                    <Zap className="h-8 w-8 text-red-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-4">
                  Critical Issue?
                </h3>
                <p className="text-muted-foreground mb-6">
                  If you're experiencing a critical production issue that's
                  affecting your users, contact our emergency support line for
                  immediate assistance.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600">
                    <Phone className="h-5 w-5 mr-2" />
                    Emergency Hotline
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Bug className="h-5 w-5 mr-2" />
                    Report Critical Bug
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Still Need Help?
              </h2>
              <p className="text-xl text-muted-foreground">
                Our support team is standing by to help you succeed. Don't
                hesitate to reach out with any questions or concerns.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-lg px-8 py-6"
                >
                  <Link to="/contact" className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Support</span>
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

              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">24/7 Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Always here for you
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Expert Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Technical specialists
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Comprehensive Docs</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed guides
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
