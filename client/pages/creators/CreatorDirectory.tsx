import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Users, Plus, Sparkles } from "lucide-react";
import { getCreators, createCreatorProfile } from "@/api/creators";
import { CreatorCard } from "@/components/creator-network/CreatorCard";
import { ArmFilter } from "@/components/creator-network/ArmFilter";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import type { Creator } from "@/api/creators";

const ARMS = [
  { value: "labs", label: "Labs - Research & Development" },
  { value: "gameforge", label: "GameForge - Game Development" },
  { value: "corp", label: "Corp - Business & Consulting" },
  { value: "foundation", label: "Foundation - Education" },
  { value: "devlink", label: "Dev-Link - Developer Network" },
  { value: "nexus", label: "Nexus - Talent Marketplace" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

export default function CreatorDirectory() {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedArm, setSelectedArm] = useState<string | undefined>(
    searchParams.get("arm") || undefined,
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    skills: "",
    primary_arm: "",
    experience_level: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        username: profile.username || "",
        bio: profile.bio || "",
      }));
    }
  }, [profile]);

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const result = await getCreators({
        arm: selectedArm,
        search: search || undefined,
        page,
        limit: 12,
      });
      setCreators(result.data);
      setTotalPages(result.pagination.pages);

      const params = new URLSearchParams();
      if (selectedArm) params.set("arm", selectedArm);
      if (search) params.set("search", search);
      if (page > 1) params.set("page", String(page));
      setSearchParams(params);
    } catch (error) {
      console.error("Failed to fetch creators:", error);
      setCreators([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [selectedArm, search, page, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleArmChange = (arm: string | undefined) => {
    setSelectedArm(arm);
    setPage(1);
  };

  const handleSubmitCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      aethexToast.error({ description: "Please sign in to register as a creator" });
      return;
    }

    if (!formData.username || !formData.bio || !formData.primary_arm) {
      aethexToast.error({ description: "Please fill in all required fields" });
      return;
    }

    setIsSubmitting(true);
    try {
      await createCreatorProfile({
        user_id: user.id,
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        avatar_url: profile?.avatar_url || "",
        experience_level: formData.experience_level || "beginner",
        primary_arm: formData.primary_arm,
        arm_affiliations: [formData.primary_arm],
      });

      aethexToast.success({ description: "You're now a creator! Welcome to the network." });
      setIsDialogOpen(false);
      fetchCreators();
    } catch (error: any) {
      console.error("Failed to create creator profile:", error);
      aethexToast.error({ description: error?.message || "Failed to create creator profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#8b5cf6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(139,92,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(139,92,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-12 lg:py-20 border-b border-slate-800">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                  <Users className="h-8 w-8 text-purple-400" />
                  <h1 className="text-4xl lg:text-5xl font-black text-white">
                    Creator Directory
                  </h1>
                </div>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                  Discover talented creators across all AeThex arms. Filter by
                  specialty, skills, and arm affiliation.
                </p>

                {user ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Become a Creator
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl">
                          Join the Creator Network
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Register as a creator to showcase your work and
                          connect with other builders.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmitCreator}
                        className="space-y-4 mt-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="username">Username *</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
                              })
                            }
                            placeholder="Your unique username"
                            className="bg-slate-800 border-slate-600"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio *</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                            placeholder="Tell us about yourself and what you create..."
                            className="bg-slate-800 border-slate-600 min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skills">
                            Skills (comma-separated)
                          </Label>
                          <Input
                            id="skills"
                            value={formData.skills}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                skills: e.target.value,
                              })
                            }
                            placeholder="React, TypeScript, Game Design..."
                            className="bg-slate-800 border-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="primary_arm">Primary Arm *</Label>
                          <Select
                            value={formData.primary_arm}
                            onValueChange={(value) =>
                              setFormData({ ...formData, primary_arm: value })
                            }
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-600">
                              <SelectValue placeholder="Select your primary arm" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              {ARMS.map((arm) => (
                                <SelectItem key={arm.value} value={arm.value}>
                                  {arm.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience Level</Label>
                          <Select
                            value={formData.experience_level}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                experience_level: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-600">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              {EXPERIENCE_LEVELS.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Join Network
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Link to="/auth">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Sign in to Become a Creator
                    </Button>
                  </Link>
                )}
              </div>

              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search creators by name or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </section>

          <section className="py-12 lg:py-20">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <ArmFilter
                      selectedArm={selectedArm}
                      onArmChange={handleArmChange}
                    />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : creators.length === 0 ? (
                    <div className="text-center py-20">
                      <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No creators found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Be the first to join the creator network!
                      </p>
                      {user ? (
                        <Button
                          onClick={() => setIsDialogOpen(true)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Become a Creator
                        </Button>
                      ) : (
                        <Link to="/auth">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            Sign in to Join
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {creators.map((creator) => (
                          <CreatorCard key={creator.id} creator={creator} />
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                          <Button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            variant="outline"
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((p) => (
                              <Button
                                key={p}
                                onClick={() => setPage(p)}
                                variant={page === p ? "default" : "outline"}
                                size="sm"
                              >
                                {p}
                              </Button>
                            ))}
                          </div>
                          <Button
                            onClick={() =>
                              setPage(Math.min(totalPages, page + 1))
                            }
                            disabled={page === totalPages}
                            variant="outline"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
