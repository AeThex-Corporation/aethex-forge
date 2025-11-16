import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
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
import { CoursesWidget } from "@/components/CoursesWidget";
import { MentorshipWidget } from "@/components/MentorshipWidget";
import { AchievementsWidget } from "@/components/AchievementsWidget";

const getApiBase = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export default function FoundationDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      try {
        const coursesRes = await fetch(`${apiBase}/api/foundation/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          coursesRes.ok &&
          coursesRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await coursesRes.json();
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        // Silently ignore API errors - dashboard will render with empty data
      }

      try {
        const apiBase = getApiBase();
        if (!apiBase) {
          console.warn("[Foundation] No API base available");
          return;
        }
        const mentorRes = await fetch(`${apiBase}/api/foundation/mentorships`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          mentorRes.ok &&
          mentorRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await mentorRes.json();
          setMentorships(data.as_mentee || []);
        }
      } catch (err: any) {
        // Silently ignore API errors - dashboard will render with empty data
      }
    } catch (error: any) {
      // Silently ignore errors
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
            <p className="text-gray-400">
              Learn from industry experts and mentors
            </p>
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
  const completedCourses = enrolledCourses.filter(
    (c: any) => c.userEnrollment?.status === "completed",
  );
  const activeMentor = mentorships.find((m: any) => m.status === "accepted");

  return (
    <Layout>
      <div
        className={`min-h-screen bg-gradient-to-b from-black to-black py-8 ${theme.fontClass}`}
        style={{ backgroundImage: theme.wallpaperPattern }}
      >
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1
                  className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.accentColor} bg-clip-text text-transparent`}
                >
                  FOUNDATION University
                </h1>
                <p className="text-gray-400 text-lg">
                  Learn, grow, and earn achievement badges
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Courses Enrolled
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {enrolledCourses.length}
                      </p>
                    </div>
                    <BookOpen className="h-6 w-6 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {completedCourses.length}
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Achievements
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {achievements.length}
                      </p>
                    </div>
                    <Award className="h-6 w-6 text-red-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-gradient-to-br ${activeMentor ? "from-green-950/40 to-green-900/20 border-green-500/20" : "from-gray-950/40 to-gray-900/20 border-gray-500/20"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Mentor
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {activeMentor ? "✓" : "—"}
                      </p>
                    </div>
                    <Users
                      className="h-6 w-6"
                      style={{
                        color: activeMentor ? "#22c55e" : "#666",
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-4 bg-red-950/30 border border-red-500/20 p-1"
              style={{ fontFamily: theme.fontFamily }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* Mentorship Widget */}
              <MentorshipWidget
                mentorships={mentorships.map((m: any) => ({
                  id: m.id,
                  mentor: {
                    id: m.mentor?.id,
                    name: m.mentor?.full_name,
                    avatar: m.mentor?.avatar_url,
                    expertise: m.mentor?.role_title,
                  },
                  status: m.status,
                  connectedSince: m.accepted_at
                    ? new Date(m.accepted_at).toLocaleDateString()
                    : null,
                  lastSession: m.last_session_date,
                  nextSession: m.next_session_date,
                }))}
                title="Your Mentorship"
                description="Connect with industry experts"
                accentColor="red"
                onFindMentor={() => navigate("/mentors")}
              />

              {/* Courses Widget */}
              <CoursesWidget
                courses={enrolledCourses.map((c: any) => ({
                  id: c.id,
                  title: c.title,
                  description: c.description,
                  category: c.category,
                  progress: c.userEnrollment?.progress_percent || 0,
                  status: c.userEnrollment?.status || "not_started",
                  duration: c.duration,
                  lessons_total: c.lessons_total,
                  lessons_completed: c.userEnrollment?.lessons_completed || 0,
                  instructor: c.instructor?.full_name,
                  thumbnail_url: c.thumbnail_url,
                }))}
                title="Continue Learning"
                description="Resume your courses"
                accentColor="red"
                onViewCourse={(courseId) => navigate(`/courses/${courseId}`)}
              />
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4 animate-fade-in">
              <CoursesWidget
                courses={enrolledCourses.map((c: any) => ({
                  id: c.id,
                  title: c.title,
                  description: c.description,
                  category: c.category,
                  progress: c.userEnrollment?.progress_percent || 0,
                  status: c.userEnrollment?.status || "not_started",
                  duration: c.duration,
                  lessons_total: c.lessons_total,
                  lessons_completed: c.userEnrollment?.lessons_completed || 0,
                  instructor: c.instructor?.full_name,
                  thumbnail_url: c.thumbnail_url,
                }))}
                title="My Courses"
                description="All your enrollments"
                accentColor="red"
                onViewCourse={(courseId) => navigate(`/courses/${courseId}`)}
              />
            </TabsContent>

            {/* Mentorship Tab */}
            <TabsContent
              value="mentorship"
              className="space-y-4 animate-fade-in"
            >
              <MentorshipWidget
                mentorships={mentorships.map((m: any) => ({
                  id: m.id,
                  mentor: {
                    id: m.mentor?.id,
                    name: m.mentor?.full_name,
                    avatar: m.mentor?.avatar_url,
                    expertise: m.mentor?.role_title,
                  },
                  status: m.status,
                  connectedSince: m.accepted_at
                    ? new Date(m.accepted_at).toLocaleDateString()
                    : null,
                  lastSession: m.last_session_date,
                  nextSession: m.next_session_date,
                }))}
                title="Mentorship"
                description="Your mentor relationships"
                accentColor="red"
                onFindMentor={() => navigate("/mentors")}
              />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent
              value="achievements"
              className="space-y-4 animate-fade-in"
            >
              <AchievementsWidget
                achievements={achievements.map((a: any) => ({
                  id: a.id,
                  name: a.name,
                  description: a.description,
                  icon: a.icon,
                  rarity: a.rarity || "common",
                  earnedDate: a.earned_date,
                  category: a.category,
                }))}
                title="Your Achievements"
                description="Badges earned through learning and growth"
                accentColor="red"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
