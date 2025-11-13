import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Search,
} from "lucide-react";
import { aethexToast } from "@/lib/aethex-toast";

interface Mentor {
  user_id: string;
  bio: string;
  expertise: string[];
  available: boolean;
  max_mentees: number;
  current_mentees: number;
  approval_status: "pending" | "approved" | "rejected";
  user_name?: string;
  user_email?: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  instructor_id: string;
  is_published: boolean;
  estimated_hours?: number;
  instructor_name?: string;
}

interface Achievement {
  id: string;
  name: string;
  description?: string;
  requirement_type: string;
  tier: number;
}

export default function AdminFoundationManager() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [searchMentor, setSearchMentor] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">(
    "approve",
  );

  useEffect(() => {
    fetchMentors();
    fetchCourses();
    fetchAchievements();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoadingMentors(true);
      const response = await fetch(`${API_BASE}/api/admin/foundation/mentors`);
      if (!response.ok) throw new Error("Failed to fetch mentors");
      const data = await response.json();
      setMentors(data || []);
    } catch (error) {
      aethexToast.error("Failed to load mentors");
      console.error(error);
    } finally {
      setLoadingMentors(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch(`${API_BASE}/api/admin/foundation/courses`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data || []);
    } catch (error) {
      aethexToast.error("Failed to load courses");
      console.error(error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      setLoadingAchievements(true);
      const response = await fetch(
        `${API_BASE}/api/admin/foundation/achievements`,
      );
      if (!response.ok) throw new Error("Failed to fetch achievements");
      const data = await response.json();
      setAchievements(data || []);
    } catch (error) {
      aethexToast.error("Failed to load achievements");
      console.error(error);
    } finally {
      setLoadingAchievements(false);
    }
  };

  const handleMentorApproval = async () => {
    if (!selectedMentor) return;

    try {
      const response = await fetch(
        `/api/admin/foundation/mentors/${selectedMentor.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approval_status: approvalAction }),
        },
      );

      if (!response.ok) throw new Error("Failed to update mentor");
      aethexToast.success(
        `Mentor ${approvalAction === "approve" ? "approved" : "rejected"}`,
      );
      setApprovalDialogOpen(false);
      setSelectedMentor(null);
      fetchMentors();
    } catch (error) {
      aethexToast.error("Failed to update mentor");
      console.error(error);
    }
  };

  const handlePublishCourse = async (courseId: string, publish: boolean) => {
    try {
      const response = await fetch(
        `/api/admin/foundation/courses/${courseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_published: publish }),
        },
      );

      if (!response.ok) throw new Error("Failed to update course");
      aethexToast.success(`Course ${publish ? "published" : "unpublished"}`);
      fetchCourses();
    } catch (error) {
      aethexToast.error("Failed to update course");
      console.error(error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(
        `/api/admin/foundation/courses/${courseId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete course");
      aethexToast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      aethexToast.error("Failed to delete course");
      console.error(error);
    }
  };

  const filteredMentors = mentors.filter((m) =>
    (m.user_name || "").toLowerCase().includes(searchMentor.toLowerCase()),
  );

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchCourse.toLowerCase()),
  );

  const pendingMentors = filteredMentors.filter(
    (m) => m.approval_status === "pending",
  );
  const approvedMentors = filteredMentors.filter(
    (m) => m.approval_status === "approved",
  );

  const publishedCourses = courses.filter((c) => c.is_published).length;
  const draftCourses = courses.filter((c) => !c.is_published).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {approvedMentors.length} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {pendingMentors.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mentors awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCourses} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total badge types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mentors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mentors
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* MENTORS TAB */}
        <TabsContent value="mentors" className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors..."
                value={searchMentor}
                onChange={(e) => setSearchMentor(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingMentors ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading mentors...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Pending Approvals */}
              {pendingMentors.length > 0 && (
                <Card className="border-yellow-500/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Pending Mentor Approvals
                    </CardTitle>
                    <CardDescription>
                      {pendingMentors.length} mentors awaiting review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingMentors.map((mentor) => (
                        <div
                          key={mentor.user_id}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{mentor.user_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {mentor.user_email}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {mentor.expertise.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            {mentor.bio && (
                              <p className="text-sm mt-2">{mentor.bio}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedMentor(mentor);
                              setApprovalAction("approve");
                              setApprovalDialogOpen(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approved Mentors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Approved Mentors ({approvedMentors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedMentors.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No approved mentors yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {approvedMentors.map((mentor) => (
                        <div
                          key={mentor.user_id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{mentor.user_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {mentor.current_mentees}/{mentor.max_mentees}{" "}
                              mentees
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* COURSES TAB */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchCourse}
                onChange={(e) => setSearchCourse(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingCourses ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading courses...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredCourses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">No courses found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-base">
                              {course.title}
                            </h4>
                            {course.is_published ? (
                              <Badge variant="outline" className="bg-green-50">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {course.description}
                          </p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>Category: {course.category}</span>
                            <span>•</span>
                            <span>Difficulty: {course.difficulty}</span>
                            {course.estimated_hours && (
                              <>
                                <span>•</span>
                                <span>{course.estimated_hours}h</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handlePublishCourse(
                                course.id,
                                !course.is_published,
                              )
                            }
                          >
                            {course.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-4">
          {loadingAchievements ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading achievements...</p>
              </CardContent>
            </Card>
          ) : achievements.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No achievements found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {achievement.requirement_type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Tier {achievement.tier}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <AlertDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            {approvalAction === "approve"
              ? "Approve Mentor?"
              : "Reject Mentor?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {approvalAction === "approve" ? (
              <>
                Are you sure you want to approve{" "}
                <strong>{selectedMentor?.user_name}</strong> as a mentor? They
                will be visible to mentees and can start receiving requests.
              </>
            ) : (
              <>
                Are you sure you want to reject{" "}
                <strong>{selectedMentor?.user_name}</strong>? They can reapply
                later.
              </>
            )}
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMentorApproval}>
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
