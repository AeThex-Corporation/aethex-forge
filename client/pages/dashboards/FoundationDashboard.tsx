import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/LoadingScreen";
import {
  BookOpen,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Clock,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function FoundationDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = (await (window as any).supabaseClient.auth.getSession()).data?.session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load courses
      const coursesRes = await fetch(`${API_BASE}/api/foundation/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(Array.isArray(data) ? data : []);
      }

      // Load mentorships
      const mentorRes = await fetch(`${API_BASE}/api/foundation/mentorships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mentorRes.ok) {
        const data = await mentorRes.json();
        setMentorships(data.as_mentee || []);
      }
    } catch (error: any) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading FOUNDATION..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-red-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
              Join FOUNDATION
            </h1>
            <p className="text-gray-400">Learn from industry experts and mentors</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const enrolledCourses = courses.filter((c: any) => c.userEnrollment);
  const completedCourses = enrolledCourses.filter((c: any) => c.userEnrollment?.status === "completed");
  const activeMentor = mentorships.find((m: any) => m.status === "accepted");

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  FOUNDATION University
                </h1>
                <p className="text-gray-400 text-lg">
                  Learn, grow, and earn achievement badges
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Courses Enrolled</p>
                      <p className="text-2xl font-bold text-white mt-1">{enrolledCourses.length}</p>
                    </div>
                    <BookOpen className="h-6 w-6 text-orange-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
                      <p className="text-2xl font-bold text-white mt-1">{completedCourses.length}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-amber-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Achievements</p>
                      <p className="text-2xl font-bold text-white mt-1">{achievements.length}</p>
                    </div>
                    <Award className="h-6 w-6 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${activeMentor ? 'from-green-950/40 to-green-900/20 border-green-500/20' : 'from-gray-950/40 to-gray-900/20 border-gray-500/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Mentor</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {activeMentor ? '✓' : '—'}
                      </p>
                    </div>
                    <Users className="h-6 w-6" style={{
                      color: activeMentor ? '#22c55e' : '#666',
                      opacity: 0.5
                    }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-red-950/30 border border-red-500/20 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* Active Mentorship */}
              {activeMentor ? (
                <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Your Mentor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={activeMentor.mentor?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                        alt={activeMentor.mentor?.full_name}
                        className="w-16 h-16 rounded-full border-2 border-green-500/40"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{activeMentor.mentor?.full_name}</h3>
                        <p className="text-sm text-gray-400 mb-4">Connected since {new Date(activeMentor.accepted_at).toLocaleDateString()}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                        >
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Find a Mentor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">
                      Having a mentor accelerates your learning. Browse mentors in your field and request guidance.
                    </p>
                    <Button
                      onClick={() => navigate("/mentors")}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      Find Mentor
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recent Courses */}
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                  <CardDescription>Resume your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                      <p className="text-gray-400">No courses yet. Browse our curriculum!</p>
                      <Button
                        onClick={() => navigate("/foundation/curriculum")}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        Explore Courses
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.slice(0, 4).map((course: any) => (
                        <div
                          key={course.id}
                          className="p-4 bg-black/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition cursor-pointer group"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white group-hover:text-orange-300 transition">{course.title}</h4>
                            <CheckCircle className="h-5 w-5" style={{
                              color: course.userEnrollment?.status === "completed" ? "#22c55e" : "#666"
                            }} />
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{course.category}</p>
                          <div className="w-full bg-black/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition"
                              style={{ width: `${course.userEnrollment?.progress_percent || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{course.userEnrollment?.progress_percent || 0}% complete</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>All your enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400 mb-4">Not enrolled in any courses yet</p>
                      <Button onClick={() => navigate("/foundation/curriculum")}>
                        Browse Curriculum
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enrolledCourses.map((course: any) => (
                        <div key={course.id} className="p-4 bg-black/30 rounded-lg border border-orange-500/10 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{course.title}</h4>
                              <p className="text-sm text-gray-400">{course.description?.substring(0, 80)}...</p>
                            </div>
                            <Badge variant="outline" className={
                              course.userEnrollment?.status === "completed" 
                                ? "bg-green-500/20 border-green-500/30 text-green-300"
                                : ""
                            }>
                              {course.userEnrollment?.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress</span>
                              <span>{course.userEnrollment?.progress_percent || 0}%</span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                                style={{ width: `${course.userEnrollment?.progress_percent || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentorship Tab */}
            <TabsContent value="mentorship" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardHeader>
                  <CardTitle>Mentorship</CardTitle>
                  <CardDescription>Your mentor relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  {mentorships.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <Users className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                      <p className="text-gray-400">No mentors yet</p>
                      <Button onClick={() => navigate("/mentors")}>
                        Find a Mentor
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mentorships.map((m: any) => (
                        <div key={m.id} className="p-4 bg-black/30 rounded-lg border border-orange-500/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <img
                                src={m.mentor?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop"}
                                alt={m.mentor?.full_name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-semibold text-white">{m.mentor?.full_name}</p>
                                <p className="text-xs text-gray-400">{m.mentor?.email}</p>
                              </div>
                            </div>
                            <Badge>{m.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges earned through learning and growth</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <Award className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                      <p className="text-gray-400">Complete courses to earn achievements!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {achievements.map((ach: any) => (
                        <div key={ach.id} className="text-center p-4 bg-black/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition">
                          <div className="text-3xl mb-2">{ach.icon}</div>
                          <p className="font-semibold text-sm text-white">{ach.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{ach.category}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
