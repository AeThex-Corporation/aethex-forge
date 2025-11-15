import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Briefcase,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Zap,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { type AethexUserProfile } from "@/lib/aethex-database-adapter";

interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "expert";
}

interface WorkExperienceItem {
  company: string;
  title: string;
  duration: string;
  description?: string;
}

interface PortfolioItem {
  title: string;
  url: string;
  description?: string;
}

interface ProfileEditorProps {
  profile: AethexUserProfile;
  onSave: (updates: Partial<AethexUserProfile>) => Promise<void>;
  isSaving?: boolean;
  username?: string;
}

const ARMS = [
  { id: "foundation", label: "Foundation", color: "bg-red-500" },
  { id: "gameforge", label: "GameForge", color: "bg-green-500" },
  { id: "labs", label: "Labs", color: "bg-yellow-500" },
  { id: "corp", label: "Corp", color: "bg-blue-500" },
  { id: "devlink", label: "Dev-Link", color: "bg-cyan-500" },
];

export function ProfileEditor({
  profile,
  onSave,
  isSaving = false,
  username,
}: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    bio_detailed: profile.bio_detailed || "",
    twitter_url: profile.twitter_url || "",
    linkedin_url: profile.linkedin_url || "",
    github_url: profile.github_url || "",
    portfolio_url: profile.portfolio_url || "",
    youtube_url: profile.youtube_url || "",
    twitch_url: profile.twitch_url || "",
    hourly_rate: profile.hourly_rate?.toString() || "",
    availability_status: profile.availability_status || "available",
    timezone: profile.timezone || "",
    location: profile.location || "",
    languages: (profile.languages as string[]) || [],
    skills_detailed: (profile.skills_detailed as SkillItem[]) || [],
    work_experience: (profile.work_experience as WorkExperienceItem[]) || [],
    portfolio_items: (profile.portfolio_items as PortfolioItem[]) || [],
    arm_affiliations: (profile.arm_affiliations as string[]) || [],
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "intermediate" as const,
  });
  const [newLanguage, setNewLanguage] = useState("");
  const [newWorkExp, setNewWorkExp] = useState({
    company: "",
    title: "",
    duration: "",
  });
  const [newPortfolio, setNewPortfolio] = useState({ title: "", url: "" });
  const [copied, setCopied] = useState(false);

  const profileUrl = username ? `https://${username}.aethex.me` : "";

  const handleSubmit = async () => {
    await onSave({
      ...formData,
      hourly_rate: formData.hourly_rate
        ? parseFloat(formData.hourly_rate)
        : undefined,
      skills_detailed: formData.skills_detailed,
      languages: formData.languages,
      work_experience: formData.work_experience,
      portfolio_items: formData.portfolio_items,
      arm_affiliations: formData.arm_affiliations,
    });
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setFormData({
        ...formData,
        skills_detailed: [...formData.skills_detailed, newSkill],
      });
      setNewSkill({ name: "", level: "intermediate" });
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills_detailed: formData.skills_detailed.filter((_, i) => i !== index),
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage],
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const addWorkExp = () => {
    if (newWorkExp.company.trim() && newWorkExp.title.trim()) {
      setFormData({
        ...formData,
        work_experience: [...formData.work_experience, newWorkExp],
      });
      setNewWorkExp({ company: "", title: "", duration: "" });
    }
  };

  const removeWorkExp = (index: number) => {
    setFormData({
      ...formData,
      work_experience: formData.work_experience.filter((_, i) => i !== index),
    });
  };

  const addPortfolio = () => {
    if (newPortfolio.title.trim() && newPortfolio.url.trim()) {
      setFormData({
        ...formData,
        portfolio_items: [...formData.portfolio_items, newPortfolio],
      });
      setNewPortfolio({ title: "", url: "" });
    }
  };

  const removePortfolio = (index: number) => {
    setFormData({
      ...formData,
      portfolio_items: formData.portfolio_items.filter((_, i) => i !== index),
    });
  };

  const toggleArmAffiliation = (armId: string) => {
    setFormData({
      ...formData,
      arm_affiliations: formData.arm_affiliations.includes(armId)
        ? formData.arm_affiliations.filter((a) => a !== armId)
        : [...formData.arm_affiliations, armId],
    });
  };

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="arms">Arms</TabsTrigger>
      </TabsList>

      {/* BASIC INFO TAB */}
      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Link</CardTitle>
            <CardDescription>Your public profile URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input value={profileUrl} disabled className="bg-muted" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyProfileUrl}
                title={copied ? "Copied!" : "Copy"}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio_detailed}
                onChange={(e) =>
                  setFormData({ ...formData, bio_detailed: e.target.value })
                }
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 mt-1 border rounded-lg bg-background"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timezone</label>
                <Input
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  placeholder="UTC-8 or America/Los_Angeles"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Hourly Rate
                </label>
                <Input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, hourly_rate: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Availability
                </label>
                <select
                  value={formData.availability_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availability_status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="available">Available Now</option>
                  <option value="limited">Limited Availability</option>
                  <option value="unavailable">Not Available</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SOCIAL TAB */}
      <TabsContent value="social" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social & Web Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Twitter</label>
              <Input
                value={formData.twitter_url}
                onChange={(e) =>
                  setFormData({ ...formData, twitter_url: e.target.value })
                }
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">LinkedIn</label>
              <Input
                value={formData.linkedin_url}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">GitHub</label>
              <Input
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Portfolio Website</label>
              <Input
                value={formData.portfolio_url}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio_url: e.target.value })
                }
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">YouTube</label>
              <Input
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
                placeholder="https://youtube.com/@username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Twitch</label>
              <Input
                value={formData.twitch_url}
                onChange={(e) =>
                  setFormData({ ...formData, twitch_url: e.target.value })
                }
                placeholder="https://twitch.tv/username"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SKILLS TAB */}
      <TabsContent value="skills" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Skills & Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Technical Skills</h3>
              <div className="space-y-2 mb-4">
                {formData.skills_detailed.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {skill.level}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(idx)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="Add skill"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) =>
                    setNewSkill({
                      ...newSkill,
                      level: e.target.value as
                        | "beginner"
                        | "intermediate"
                        | "expert",
                    })
                  }
                  className="px-2 border rounded-lg bg-background"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
                <Button size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-semibold mb-3">Languages</h3>
              <div className="space-y-2 mb-4">
                {formData.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <p className="font-medium">{lang}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(idx)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add language (e.g., English, Spanish)"
                />
                <Button size="sm" onClick={addLanguage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* EXPERIENCE TAB */}
      <TabsContent value="experience" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience & Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Work Experience */}
            <div>
              <h3 className="font-semibold mb-3">Work Experience</h3>
              <div className="space-y-2 mb-4">
                {formData.work_experience.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.duration}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExp(idx)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-3 border rounded-lg">
                <Input
                  value={newWorkExp.title}
                  onChange={(e) =>
                    setNewWorkExp({ ...newWorkExp, title: e.target.value })
                  }
                  placeholder="Job Title"
                />
                <Input
                  value={newWorkExp.company}
                  onChange={(e) =>
                    setNewWorkExp({ ...newWorkExp, company: e.target.value })
                  }
                  placeholder="Company"
                />
                <Input
                  value={newWorkExp.duration}
                  onChange={(e) =>
                    setNewWorkExp({ ...newWorkExp, duration: e.target.value })
                  }
                  placeholder="Duration (e.g., 2020-2023)"
                />
                <Button size="sm" onClick={addWorkExp} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </div>

            {/* Portfolio Items */}
            <div>
              <h3 className="font-semibold mb-3">Portfolio Items</h3>
              <div className="space-y-2 mb-4">
                {formData.portfolio_items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {item.url}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolio(idx)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-3 border rounded-lg">
                <Input
                  value={newPortfolio.title}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, title: e.target.value })
                  }
                  placeholder="Project Title"
                />
                <Input
                  value={newPortfolio.url}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, url: e.target.value })
                  }
                  placeholder="Project URL"
                />
                <Button size="sm" onClick={addPortfolio} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ARMS TAB */}
      <TabsContent value="arms" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Arm Affiliations
            </CardTitle>
            <CardDescription>
              Select the arms you're part of. They can also be auto-detected
              from your activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ARMS.map((arm) => (
                <button
                  key={arm.id}
                  onClick={() => toggleArmAffiliation(arm.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.arm_affiliations.includes(arm.id)
                      ? `border-${arm.color.split("-")[1]}-500 bg-${arm.color.split("-")[1]}-50`
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <Badge className={arm.color}>{arm.label}</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </Tabs>
  );
}
