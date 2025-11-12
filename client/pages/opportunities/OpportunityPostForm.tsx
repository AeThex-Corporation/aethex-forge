import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import { createOpportunity } from "@/api/opportunities";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import type { CreateOpportunityData } from "@/api/opportunities";

const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Freelance",
  "Internship",
  "Advisory",
];

const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead", "Any"];

const ARMS = [
  { value: "labs", label: "Labs (Research & Innovation)" },
  { value: "gameforge", label: "GameForge (Game Publishing)" },
  { value: "corp", label: "Corp (Enterprise Services)" },
  { value: "foundation", label: "Foundation (Education)" },
  { value: "nexus", label: "Nexus (Talent Marketplace)" },
];

export default function OpportunityPostForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useAethexToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateOpportunityData>({
    title: "",
    description: "",
    job_type: "Full-Time",
    salary_min: undefined,
    salary_max: undefined,
    experience_level: "Mid",
    arm_affiliation: "nexus",
  });

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Card className="bg-slate-900 border-slate-700 w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                You must be signed in to post opportunities.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/opportunities")}
                  className="flex-1"
                >
                  View Opportunities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.arm_affiliation) {
      newErrors.arm_affiliation = "Arm affiliation is required";
    }
    if (
      formData.salary_min &&
      formData.salary_max &&
      formData.salary_min > formData.salary_max
    ) {
      newErrors.salary = "Minimum salary must be less than maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newOpportunity = await createOpportunity(formData);
      toast({
        title: "Success",
        description: "Opportunity posted successfully!",
      });
      navigate(`/opportunities/${newOpportunity.id}`);
    } catch (error) {
      console.error("Failed to create opportunity:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post opportunity",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#a855f7_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(168,85,247,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-12 lg:py-16 border-b border-slate-800">
            <div className="container mx-auto max-w-4xl px-4">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 text-slate-400 hover:text-white"
                onClick={() => navigate("/opportunities")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-8 w-8 text-purple-400" />
                <h1 className="text-4xl font-bold text-purple-300">
                  Post an Opportunity
                </h1>
              </div>
              <p className="text-lg text-slate-300">
                Share a job opening, project, or collaboration opportunity with
                the AeThex community
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Opportunity Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Opportunity Title *
                      </label>
                      <Input
                        placeholder="e.g., Senior Game Developer - Roblox"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className={`bg-slate-800 border-slate-600 text-white placeholder-slate-500 ${
                          errors.title ? "border-red-500" : ""
                        }`}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-400">{errors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Description *
                      </label>
                      <Textarea
                        placeholder="Describe the opportunity, responsibilities, and requirements..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={6}
                        className={`bg-slate-800 border-slate-600 text-white placeholder-slate-500 ${
                          errors.description ? "border-red-500" : ""
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-400">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Arm Affiliation */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Arm Affiliation *
                      </label>
                      <Select
                        value={formData.arm_affiliation}
                        onValueChange={(value) =>
                          setFormData({ ...formData, arm_affiliation: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="Select an arm" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 text-white">
                          {ARMS.map((arm) => (
                            <SelectItem key={arm.value} value={arm.value}>
                              {arm.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.arm_affiliation && (
                        <p className="text-sm text-red-400">
                          {errors.arm_affiliation}
                        </p>
                      )}
                    </div>

                    {/* Job Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Job Type
                      </label>
                      <Select
                        value={formData.job_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, job_type: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 text-white">
                          {JOB_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Experience Level
                      </label>
                      <Select
                        value={formData.experience_level || "Mid"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, experience_level: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 text-white">
                          {EXPERIENCE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Salary Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Salary Min (Optional)
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 80000"
                          value={formData.salary_min || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salary_min: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Salary Max (Optional)
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 150000"
                          value={formData.salary_max || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salary_max: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                    {errors.salary && (
                      <p className="text-sm text-red-400">{errors.salary}</p>
                    )}

                    {/* Submit */}
                    <div className="flex gap-3 pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-purple-500 text-white hover:bg-purple-600"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Opportunity"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-600"
                        onClick={() => navigate("/opportunities")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
