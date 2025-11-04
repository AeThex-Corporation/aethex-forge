import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import {
  GraduationCap,
  Star,
  Users,
  Trophy,
  Target,
  Calendar,
  MessageCircle,
  ArrowRight,
  Search,
  BookOpen,
} from "lucide-react";

export default function MenteeHub() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentors, setMentors] = useState<any[]>([
    {
      id: "1",
      name: "ByteSage",
      specialty: "Game Development",
      bio: "10+ years shipping games across 8 platforms",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ByteSage",
      rating: 4.9,
      reviews: 48,
      hourlyRate: "$50/hr",
      availability: "Mon-Fri, 6-9pm EST",
      students: 12,
    },
    {
      id: "2",
      name: "AriaNova",
      specialty: "Platform Engineering",
      bio: "Lead architect at AeThex Platform",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriaNova",
      rating: 4.8,
      reviews: 35,
      hourlyRate: "$60/hr",
      availability: "Flexible",
      students: 8,
    },
    {
      id: "3",
      name: "FluxPilot",
      specialty: "Community & Growth",
      bio: "Built communities of 100k+ creators",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FluxPilot",
      rating: 4.7,
      reviews: 52,
      hourlyRate: "$45/hr",
      availability: "Anytime",
      students: 15,
    },
  ]);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading || isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)] py-10">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6 space-y-6">
          {/* Header */}
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">
                  Mentee Hub
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect with experienced mentors and accelerate your growth
                </p>
              </div>
              <div className="hidden sm:block p-3 rounded-2xl bg-gradient-to-br from-aethex-500/10 to-neon-blue/10">
                <GraduationCap className="h-6 w-6 text-aethex-400" />
              </div>
            </div>
          </section>

          {/* Your Mentorship Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Hours Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Goals Achieved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/40 bg-gradient-to-br from-aethex-500/5 to-neon-blue/5 backdrop-blur shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-aethex-400" />
                  Learning Path
                </CardTitle>
                <CardDescription>
                  Set your learning goals and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-aethex-500/20 hover:bg-aethex-500/30 text-aethex-300">
                  Create Learning Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  Programs
                </CardTitle>
                <CardDescription>
                  Explore structured mentorship programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300"
                >
                  <Link to="/mentorship-programs">
                    Browse Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Find a Mentor */}
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Find Your Mentor
            </h2>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/60 border-border/40"
              />
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMentors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No mentors found matching your search
                  </p>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
                  <Card
                    key={mentor.id}
                    className="group border-border/40 bg-background/80 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-aethex-400/50 flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="group-hover:text-aethex-300 transition-colors">
                            {mentor.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {mentor.specialty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {mentor.bio}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span>{mentor.rating}</span>
                          <span className="text-muted-foreground">
                            ({mentor.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-aethex-400" />
                          <span>{mentor.students} active students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {mentor.availability}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <p className="font-semibold text-aethex-300 mb-3">
                          {mentor.hourlyRate}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border/40 hover:bg-background/50"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-aethex-500/10 hover:bg-aethex-500/20 text-aethex-300"
                          >
                            Request
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Mentee Benefits */}
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Why Get a Mentor?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-aethex-500/5 border border-aethex-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-aethex-400" />
                  <span className="font-semibold text-foreground">
                    Personalized Guidance
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get tailored advice based on your specific goals and
                  challenges
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-5 w-5 text-neon-blue/60" />
                  <span className="font-semibold text-foreground">
                    Accelerated Growth
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn from experienced professionals and avoid common pitfalls
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-green-500/60" />
                  <span className="font-semibold text-foreground">
                    Network Building
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with industry leaders and expand your professional
                  network
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
