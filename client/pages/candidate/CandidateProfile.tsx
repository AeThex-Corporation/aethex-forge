import { useState, useEffect } from "react";
import { Link } from "wouter";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface WorkHistory {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number;
  current: boolean;
}

interface ProfileData {
  headline: string;
  bio: string;
  resume_url: string;
  portfolio_urls: string[];
  work_history: WorkHistory[];
  education: Education[];
  skills: string[];
  availability: string;
  desired_rate: number;
  rate_type: string;
  location: string;
  remote_preference: string;
  is_public: boolean;
  profile_completeness: number;
}

const DEFAULT_PROFILE: ProfileData = {
  headline: "",
  bio: "",
  resume_url: "",
  portfolio_urls: [],
  work_history: [],
  education: [],
  skills: [],
  availability: "",
  desired_rate: 0,
  rate_type: "hourly",
  location: "",
  remote_preference: "",
  is_public: false,
  profile_completeness: 0,
};

export default function CandidateProfile() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolio, setNewPortfolio] = useState("");

  useEffect(() => {
    if (session?.access_token) {
      fetchProfile();
    }
  }, [session?.access_token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/candidate/profile", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            ...DEFAULT_PROFILE,
            ...data.profile,
            portfolio_urls: Array.isArray(data.profile.portfolio_urls)
              ? data.profile.portfolio_urls
              : [],
            work_history: Array.isArray(data.profile.work_history)
              ? data.profile.work_history
              : [],
            education: Array.isArray(data.profile.education)
              ? data.profile.education
              : [],
            skills: Array.isArray(data.profile.skills)
              ? data.profile.skills
              : [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!session?.access_token) return;
    setSaving(true);

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const data = await response.json();
      setProfile((prev) => ({
        ...prev,
        profile_completeness: data.profile.profile_completeness,
      }));
      aethexToast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      aethexToast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addPortfolio = () => {
    if (newPortfolio.trim() && !profile.portfolio_urls.includes(newPortfolio.trim())) {
      setProfile((prev) => ({
        ...prev,
        portfolio_urls: [...prev.portfolio_urls, newPortfolio.trim()],
      }));
      setNewPortfolio("");
    }
  };

  const removePortfolio = (url: string) => {
    setProfile((prev) => ({
      ...prev,
      portfolio_urls: prev.portfolio_urls.filter((u) => u !== url),
    }));
  };

  const addWorkHistory = () => {
    setProfile((prev) => ({
      ...prev,
      work_history: [
        ...prev.work_history,
        {
          company: "",
          position: "",
          start_date: "",
          end_date: "",
          current: false,
          description: "",
        },
      ],
    }));
  };

  const updateWorkHistory = (index: number, field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      work_history: prev.work_history.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeWorkHistory = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      work_history: prev.work_history.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          field: "",
          start_year: new Date().getFullYear(),
          end_year: new Date().getFullYear(),
          current: false,
        },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <Layout>
        <SEO title="Edit Profile" description="Build your candidate profile" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Edit Profile" description="Build your candidate profile" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <Link href="/candidate">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-violet-500/20 border border-violet-500/30">
                    <User className="h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-violet-100">
                      Edit Profile
                    </h1>
                    <p className="text-violet-200/70">
                      Build your candidate profile to stand out
                    </p>
                  </div>
                </div>
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>

              {/* Profile Completeness */}
              <Card className="mt-6 bg-slate-800/50 border-violet-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-violet-100 font-medium">
                      Profile Completeness
                    </span>
                    <span className="text-violet-300 font-bold">
                      {profile.profile_completeness}%
                    </span>
                  </div>
                  <Progress value={profile.profile_completeness} className="h-2" />
                  {profile.profile_completeness === 100 && (
                    <div className="flex items-center gap-2 mt-2 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Profile complete!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="w-full bg-slate-800/50 border border-slate-700/50 p-1">
                <TabsTrigger
                  value="basic"
                  className="flex-1 data-[state=active]:bg-violet-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="flex-1 data-[state=active]:bg-violet-600"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex-1 data-[state=active]:bg-violet-600"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="flex-1 data-[state=active]:bg-violet-600"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Links
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-violet-100">
                      Basic Information
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Your headline and summary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-violet-200">Headline</Label>
                      <Input
                        value={profile.headline}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            headline: e.target.value,
                          }))
                        }
                        placeholder="e.g., Senior Full Stack Developer | React & Node.js"
                        className="bg-slate-700/50 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-violet-200">Bio</Label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        placeholder="Tell employers about yourself..."
                        rows={4}
                        className="bg-slate-700/50 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-violet-200">Location</Label>
                        <Input
                          value={profile.location}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="e.g., San Francisco, CA"
                          className="bg-slate-700/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-violet-200">
                          Remote Preference
                        </Label>
                        <Select
                          value={profile.remote_preference}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              remote_preference: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote_only">
                              Remote Only
                            </SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="on_site">On-Site</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-violet-200">Availability</Label>
                        <Select
                          value={profile.availability}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              availability: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">
                              Available Immediately
                            </SelectItem>
                            <SelectItem value="2_weeks">In 2 Weeks</SelectItem>
                            <SelectItem value="1_month">In 1 Month</SelectItem>
                            <SelectItem value="3_months">In 3 Months</SelectItem>
                            <SelectItem value="not_looking">
                              Not Currently Looking
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-violet-200">Desired Rate</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={profile.desired_rate || ""}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                desired_rate: parseFloat(e.target.value) || 0,
                              }))
                            }
                            placeholder="0"
                            className="bg-slate-700/50 border-slate-600 text-slate-100"
                          />
                          <Select
                            value={profile.rate_type}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev,
                                rate_type: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">/hour</SelectItem>
                              <SelectItem value="monthly">/month</SelectItem>
                              <SelectItem value="yearly">/year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <Label className="text-violet-200">Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill..."
                          className="bg-slate-700/50 border-slate-600 text-slate-100"
                          onKeyDown={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button
                          onClick={addSkill}
                          variant="outline"
                          className="border-violet-500/30 text-violet-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-violet-500/20 text-violet-300 border-violet-500/30"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 hover:text-red-400"
                            >
                              &times;
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Public Profile Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/30">
                      <div>
                        <p className="font-medium text-violet-100">
                          Public Profile
                        </p>
                        <p className="text-sm text-slate-400">
                          Allow employers to discover your profile
                        </p>
                      </div>
                      <Switch
                        checked={profile.is_public}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({ ...prev, is_public: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-violet-100">
                        Work Experience
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Your professional background
                      </CardDescription>
                    </div>
                    <Button
                      onClick={addWorkHistory}
                      variant="outline"
                      size="sm"
                      className="border-violet-500/30 text-violet-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.work_history.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        No work experience added yet
                      </p>
                    ) : (
                      profile.work_history.map((work, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 space-y-4"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-violet-100">
                              Position {index + 1}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWorkHistory(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-violet-200">Company</Label>
                              <Input
                                value={work.company}
                                onChange={(e) =>
                                  updateWorkHistory(
                                    index,
                                    "company",
                                    e.target.value,
                                  )
                                }
                                placeholder="Company name"
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-violet-200">Position</Label>
                              <Input
                                value={work.position}
                                onChange={(e) =>
                                  updateWorkHistory(
                                    index,
                                    "position",
                                    e.target.value,
                                  )
                                }
                                placeholder="Job title"
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-violet-200">
                                Start Date
                              </Label>
                              <Input
                                type="month"
                                value={work.start_date}
                                onChange={(e) =>
                                  updateWorkHistory(
                                    index,
                                    "start_date",
                                    e.target.value,
                                  )
                                }
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-violet-200">End Date</Label>
                              <Input
                                type="month"
                                value={work.end_date}
                                onChange={(e) =>
                                  updateWorkHistory(
                                    index,
                                    "end_date",
                                    e.target.value,
                                  )
                                }
                                disabled={work.current}
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={work.current}
                              onCheckedChange={(checked) =>
                                updateWorkHistory(index, "current", checked)
                              }
                            />
                            <Label className="text-violet-200">
                              I currently work here
                            </Label>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-violet-200">Description</Label>
                            <Textarea
                              value={work.description}
                              onChange={(e) =>
                                updateWorkHistory(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Describe your responsibilities..."
                              rows={3}
                              className="bg-slate-700/50 border-slate-600 text-slate-100"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-violet-100">Education</CardTitle>
                      <CardDescription className="text-slate-400">
                        Your academic background
                      </CardDescription>
                    </div>
                    <Button
                      onClick={addEducation}
                      variant="outline"
                      size="sm"
                      className="border-violet-500/30 text-violet-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.education.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        No education added yet
                      </p>
                    ) : (
                      profile.education.map((edu, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 space-y-4"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-violet-100">
                              Education {index + 1}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-violet-200">Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "institution",
                                  e.target.value,
                                )
                              }
                              placeholder="University or school name"
                              className="bg-slate-700/50 border-slate-600 text-slate-100"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-violet-200">Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(index, "degree", e.target.value)
                                }
                                placeholder="e.g., Bachelor's, Master's"
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-violet-200">
                                Field of Study
                              </Label>
                              <Input
                                value={edu.field}
                                onChange={(e) =>
                                  updateEducation(index, "field", e.target.value)
                                }
                                placeholder="e.g., Computer Science"
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-violet-200">
                                Start Year
                              </Label>
                              <Input
                                type="number"
                                value={edu.start_year}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "start_year",
                                    parseInt(e.target.value),
                                  )
                                }
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-violet-200">End Year</Label>
                              <Input
                                type="number"
                                value={edu.end_year}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "end_year",
                                    parseInt(e.target.value),
                                  )
                                }
                                disabled={edu.current}
                                className="bg-slate-700/50 border-slate-600 text-slate-100"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={edu.current}
                              onCheckedChange={(checked) =>
                                updateEducation(index, "current", checked)
                              }
                            />
                            <Label className="text-violet-200">
                              Currently studying
                            </Label>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Links Tab */}
              <TabsContent value="links">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-violet-100">
                      Portfolio & Links
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Your resume and portfolio links
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-violet-200">Resume URL</Label>
                      <Input
                        value={profile.resume_url}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            resume_url: e.target.value,
                          }))
                        }
                        placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                        className="bg-slate-700/50 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-violet-200">Portfolio Links</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newPortfolio}
                          onChange={(e) => setNewPortfolio(e.target.value)}
                          placeholder="GitHub, Behance, personal website..."
                          className="bg-slate-700/50 border-slate-600 text-slate-100"
                          onKeyDown={(e) =>
                            e.key === "Enter" && addPortfolio()
                          }
                        />
                        <Button
                          onClick={addPortfolio}
                          variant="outline"
                          className="border-violet-500/30 text-violet-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {profile.portfolio_urls.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-300 hover:text-violet-200 truncate flex-1"
                            >
                              {url}
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePortfolio(url)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button (Bottom) */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
