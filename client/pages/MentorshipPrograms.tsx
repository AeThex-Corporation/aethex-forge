import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
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
  Users,
  BookOpen,
  Star,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Heart,
  Sparkles,
  Code,
  Rocket,
  Globe,
  Award,
  Calendar,
  MessageCircle,
  Video,
  GraduationCap,
} from "lucide-react";

export default function MentorshipPrograms() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(0);

  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Mentorship Programs loaded successfully");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const programs = [
    {
      title: "Individual Mentorship",
      description:
        "One-on-one guidance tailored to your specific goals and challenges",
      icon: User,
      duration: "3-12 months",
      commitment: "2 hours/week",
      price: "Starting at $300/month",
      features: [
        "Weekly 1-on-1 sessions",
        "Personalized learning path",
        "Code reviews & feedback",
        "Career guidance",
        "Portfolio development",
        "24/7 chat support",
      ],
      color: "from-blue-500 to-purple-600",
      participants: "1:1",
    },
    {
      title: "Group Workshops",
      description:
        "Collaborative learning with peers in structured group sessions",
      icon: Users,
      duration: "8-16 weeks",
      commitment: "4 hours/week",
      price: "Starting at $150/month",
      features: [
        "Weekly group sessions",
        "Peer collaboration",
        "Project-based learning",
        "Industry guest speakers",
        "Team challenges",
        "Group portfolio projects",
      ],
      color: "from-green-500 to-blue-600",
      participants: "6-12 people",
    },
    {
      title: "Intensive Boot Camps",
      description:
        "Fast-track your skills with immersive, intensive training programs",
      icon: Rocket,
      duration: "12-24 weeks",
      commitment: "20+ hours/week",
      price: "Starting at $2,500",
      features: [
        "Full-time immersive program",
        "Industry-standard projects",
        "Job placement assistance",
        "Capstone project",
        "Certification",
        "Alumni network access",
      ],
      color: "from-orange-500 to-red-600",
      participants: "15-25 people",
    },
    {
      title: "Corporate Training",
      description: "Upskill your team with customized training programs",
      icon: Trophy,
      duration: "4-52 weeks",
      commitment: "Flexible",
      price: "Custom pricing",
      features: [
        "Customized curriculum",
        "On-site or remote delivery",
        "Team assessments",
        "Progress tracking",
        "Certification programs",
        "Ongoing support",
      ],
      color: "from-purple-500 to-pink-600",
      participants: "10-100+ people",
    },
  ];

  const tracks = [
    {
      name: "Game Development",
      description: "Master game development from concept to publishing",
      icon: Code,
      skills: [
        "Unity/Unreal",
        "C#/C++",
        "Game Design",
        "3D Modeling",
        "Audio",
        "Publishing",
      ],
      level: "Beginner to Advanced",
      duration: "6-12 months",
      projects: 5,
    },
    {
      name: "Web Development",
      description:
        "Build modern web applications with cutting-edge technologies",
      icon: Globe,
      skills: [
        "React/Vue",
        "Node.js",
        "Databases",
        "Cloud Deploy",
        "Testing",
        "DevOps",
      ],
      level: "Beginner to Expert",
      duration: "4-8 months",
      projects: 8,
    },
    {
      name: "Mobile Development",
      description: "Create native and cross-platform mobile applications",
      icon: Rocket,
      skills: [
        "React Native",
        "Flutter",
        "iOS/Android",
        "API Integration",
        "Publishing",
        "Analytics",
      ],
      level: "Intermediate to Advanced",
      duration: "5-10 months",
      projects: 6,
    },
    {
      name: "Data Science & AI",
      description: "Harness the power of data and artificial intelligence",
      icon: Sparkles,
      skills: [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "Neural Networks",
        "Big Data",
        "Visualization",
      ],
      level: "Beginner to Expert",
      duration: "8-16 months",
      projects: 10,
    },
  ];

  const mentors = [
    {
      name: "Sarah Chen",
      title: "Senior Game Developer",
      company: "Epic Games",
      experience: "12 years",
      specialty: "Unreal Engine, C++",
      students: 85,
      rating: 4.9,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b029?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Marcus Rodriguez",
      title: "Full Stack Architect",
      company: "Netflix",
      experience: "15 years",
      specialty: "React, Node.js, AWS",
      students: 120,
      rating: 4.8,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Dr. Aisha Patel",
      title: "AI Research Scientist",
      company: "Google DeepMind",
      experience: "10 years",
      specialty: "Machine Learning, Python",
      students: 95,
      rating: 5.0,
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Junior Developer → Senior Developer",
      company: "Stripe",
      content:
        "The mentorship program completely transformed my career. Within 8 months, I went from struggling with basic concepts to landing a senior role at a top tech company.",
      program: "Individual Mentorship",
      mentor: "Marcus Rodriguez",
    },
    {
      name: "Jamie Wu",
      role: "Career Changer → Game Developer",
      company: "Indie Studio",
      content:
        "Coming from a marketing background, I never thought I could become a game developer. The boot camp gave me the skills and confidence to launch my own indie studio.",
      program: "Intensive Boot Camp",
      mentor: "Sarah Chen",
    },
    {
      name: "Taylor Davis",
      role: "Student → ML Engineer",
      company: "OpenAI",
      content:
        "The AI track mentorship opened doors I never knew existed. The hands-on projects and expert guidance helped me land my dream job in machine learning.",
      program: "Group Workshop",
      mentor: "Dr. Aisha Patel",
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Mentorship Programs..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <>
      <SEO
        pageTitle="Mentorship"
        description="AeThex mentorship programs: 1:1 guidance, workshops, and boot camps to accelerate your journey."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient">
          {/* Hero Section */}
          <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-emerald-400/80 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    fontSize: `${8 + Math.random() * 6}px`,
                  }}
                >
                  {"🎓📚💡🚀".charAt(Math.floor(Math.random() * 4))}
                </div>
              ))}
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-8">
                <Badge
                  variant="outline"
                  className="border-emerald-400/50 text-emerald-300 animate-bounce-gentle"
                >
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Mentorship & Education Division
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-emerald-300 via-aethex-400 to-neon-blue bg-clip-text text-transparent">
                    Accelerate Your Tech Journey
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Learn from industry experts through personalized mentorship,
                  hands-on workshops, and intensive boot camps designed to
                  fast-track your technology career.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-emerald-400 to-neon-blue shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:from-emerald-500 hover:to-aethex-500 hover-lift"
                  >
                    <Link
                      to="/engage#mentorship"
                      className="flex items-center space-x-2"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Apply Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-emerald-400/50 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/10 hover-lift"
                  >
                    <Link to="/docs">Program Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Programs Overview */}
          <section className="py-16 sm:py-20 bg-background/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                  Mentorship Programs
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the learning format that best fits your schedule and
                  goals
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <Card
                      key={index}
                      className="relative overflow-hidden border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-r ${program.color}`}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {program.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {program.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {program.participants}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {program.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                          <div className="text-center">
                            <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {program.duration}
                            </div>
                          </div>
                          <div className="text-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {program.commitment}
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-semibold text-emerald-400">
                              {program.price}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Learning Tracks */}
          <section className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                  Specialized Learning Tracks
                </h2>
                <p className="text-lg text-muted-foreground">
                  Focused curricula designed by industry experts
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {tracks.map((track, index) => {
                  const Icon = track.icon;
                  const isSelected = selectedTrack === index;
                  return (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-300 hover-lift animate-scale-in ${
                        isSelected
                          ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-105"
                          : "border-border/50 hover:border-emerald-400/60"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedTrack(index)}
                    >
                      <CardHeader className="text-center">
                        <Icon className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                        <CardTitle
                          className={`text-lg ${
                            isSelected
                              ? "bg-gradient-to-r from-emerald-400 to-aethex-500 bg-clip-text text-transparent"
                              : ""
                          }`}
                        >
                          {track.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {track.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {track.skills.slice(0, 4).map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-center space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {track.level}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {track.duration} • {track.projects} projects
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Mentors */}
          <section className="py-16 sm:py-20 bg-background/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                  Meet Our Expert Mentors
                </h2>
                <p className="text-lg text-muted-foreground">
                  Learn from industry leaders at top technology companies
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {mentors.map((mentor, index) => (
                  <Card
                    key={index}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-emerald-400/20"
                      />
                      <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-400 to-aethex-500 bg-clip-text text-transparent">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {mentor.title}
                      </p>
                      <p className="text-sm font-medium text-emerald-400">
                        {mentor.company}
                      </p>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Experience:</span>
                          <span className="font-medium">
                            {mentor.experience}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Students Mentored:</span>
                          <span className="font-medium">
                            {mentor.students}+
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="font-medium">{mentor.rating}</span>
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className="mt-3 text-xs">
                        {mentor.specialty}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                  Success Stories
                </h2>
                <p className="text-lg text-muted-foreground">
                  Real career transformations from our mentorship programs
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 via-aethex-500 to-neon-blue flex items-center justify-center text-white font-semibold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.company}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <blockquote className="text-sm italic text-muted-foreground">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Program: {testimonial.program}</span>
                        <span>Mentor: {testimonial.mentor}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-20 bg-background/30">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-300 via-aethex-400 to-neon-blue bg-clip-text text-transparent">
                  Start Your Learning Journey Today
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of developers who have accelerated their
                  careers through our mentorship programs.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-emerald-400 to-neon-blue shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:from-emerald-500 hover:to-aethex-500 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                  >
                    <Link
                      to="/engage#mentorship"
                      className="flex items-center space-x-2"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Apply for Mentorship</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-emerald-400/60 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/10 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                  >
                    <Link to="/docs/curriculum">View Curriculum</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="font-semibold">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Always available
                    </p>
                  </div>
                  <div className="text-center">
                    <Video className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="font-semibold">Live Sessions</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive learning
                    </p>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="font-semibold">Certification</h3>
                    <p className="text-sm text-muted-foreground">
                      Industry recognized
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
