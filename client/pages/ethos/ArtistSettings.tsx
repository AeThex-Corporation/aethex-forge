import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import TrackUploadModal from "@/components/ethos/TrackUploadModal";
import TrackMetadataForm from "@/components/ethos/TrackMetadataForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { Upload, Music, Settings, CheckCircle, Clock } from "lucide-react";

const SKILLS = [
  "Synthwave",
  "Orchestral",
  "SFX Design",
  "Game Audio",
  "Ambient",
  "Electronic",
  "Cinematic",
  "Jazz",
  "Hip-Hop",
  "Folk",
];

interface ArtistProfile {
  skills: string[];
  for_hire: boolean;
  bio?: string;
  portfolio_url?: string;
  sample_price_track?: number;
  sample_price_sfx?: number;
  sample_price_score?: number;
  turnaround_days?: number;
  verified?: boolean;
}

interface VerificationStatus {
  status: "pending" | "approved" | "rejected" | "none";
  submitted_at?: string;
  rejection_reason?: string;
}

export default function ArtistSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useAethexToast();

  const [profile, setProfile] = useState<ArtistProfile>({
    skills: [],
    for_hire: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    status: "none",
  });
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/ethos/artists?id=${user.id}`, {
          headers: { "x-user-id": user.id },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile({
            skills: data.skills || [],
            for_hire: data.for_hire ?? true,
            bio: data.bio,
            portfolio_url: data.portfolio_url,
            sample_price_track: data.sample_price_track,
            sample_price_sfx: data.sample_price_sfx,
            sample_price_score: data.sample_price_score,
            turnaround_days: data.turnaround_days,
            verified: data.verified,
          });
        }

        // Fetch verification status
        const verRes = await fetch(`/api/ethos/verification?status=pending`, {
          headers: { "x-user-id": user.id },
        });

        if (verRes.ok) {
          const { data: requests } = await verRes.json();
          const userRequest = requests?.find((r: any) => r.user_id === user.id);
          if (userRequest) {
            setVerificationStatus({
              status: userRequest.status,
              submitted_at: userRequest.submitted_at,
              rejection_reason: userRequest.rejection_reason,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmitVerification = async () => {
    if (!user) return;

    setIsSubmittingVerification(true);
    try {
      const response = await fetch("/api/ethos/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          action: "submit",
          submission_notes: submissionNotes,
          portfolio_links: portfolioLinks
            .split("\n")
            .filter((link) => link.trim()),
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setVerificationStatus({
          status: "pending",
          submitted_at: data.submitted_at,
        });
        setSubmissionNotes("");
        setPortfolioLinks("");
        toast.success({
          title: "Verification request submitted",
          description:
            "Your application has been sent to the Ethos Guild team for review. You'll be notified via email of any updates.",
        });
      } else {
        throw new Error("Failed to submit verification request");
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: String(error),
      });
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/ethos/artists`, {
        method: "PUT",
        headers: {
          "x-user-id": user.id,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success({
          title: "Profile updated",
          description: "Your Ethos artist profile has been saved",
        });
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: String(error),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setCurrentFile(file);
    setShowMetadataForm(true);
  };

  const handleMetadataSubmit = async (metadata: any) => {
    if (!user || !currentFile) return;

    try {
      // TODO: Upload file to Supabase Storage
      // For now, just create track record with placeholder file_url
      const res = await fetch(`/api/ethos/tracks`, {
        method: "POST",
        headers: {
          "x-user-id": user.id,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...metadata,
          file_url: `ethos-tracks/${user.id}/${currentFile.name}`,
          duration_seconds: Math.floor(currentFile.size / 16000), // Rough estimate
        }),
      });

      if (res.ok) {
        toast.success({
          title: "Track uploaded",
          description: "Your track has been added to your portfolio",
        });
        setShowMetadataForm(false);
        setCurrentFile(null);
      } else {
        throw new Error("Failed to upload track");
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: String(error),
      });
    }
  };

  if (loading) {
    return <Layout><div className="py-20 text-center">Loading settings...</div></Layout>;
  }

  return (
    <>
      <SEO pageTitle="Artist Settings - Ethos Guild" />
      <Layout>
        <div className="bg-slate-950 text-foreground min-h-screen">
          <div className="container mx-auto px-4 max-w-4xl py-12">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                  <Settings className="h-8 w-8" />
                  Artist Settings
                </h1>
                <p className="text-slate-400">
                  Manage your Ethos Guild profile, portfolio, and services
                </p>
              </div>

              {/* Profile Section */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Bio</Label>
                    <Textarea
                      value={profile.bio || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself, your musical style, and experience..."
                      className="bg-slate-800 border-slate-700 h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Portfolio URL</Label>
                    <Input
                      value={profile.portfolio_url || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, portfolio_url: e.target.value })
                      }
                      placeholder="https://yourportfolio.com"
                      type="url"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer">
                    <Checkbox
                      checked={profile.for_hire}
                      onCheckedChange={(checked) =>
                        setProfile({ ...profile, for_hire: checked as boolean })
                      }
                      className="border-slate-600"
                    />
                    <span className="text-sm text-slate-300">
                      I'm available for commissions
                    </span>
                  </label>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Skills</CardTitle>
                  <CardDescription>Select the skills you specialize in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SKILLS.map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-slate-600 transition"
                      >
                        <Checkbox
                          checked={profile.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                          className="border-slate-600"
                        />
                        <span className="text-sm text-slate-300">{skill}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services & Pricing */}
              {profile.for_hire && (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Services & Pricing</CardTitle>
                    <CardDescription>
                      Set your sample pricing for common services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Custom Track</Label>
                        <Input
                          type="number"
                          value={profile.sample_price_track || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              sample_price_track: Number(e.target.value) || undefined,
                            })
                          }
                          placeholder="500"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">SFX Pack</Label>
                        <Input
                          type="number"
                          value={profile.sample_price_sfx || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              sample_price_sfx: Number(e.target.value) || undefined,
                            })
                          }
                          placeholder="150"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Full Score</Label>
                        <Input
                          type="number"
                          value={profile.sample_price_score || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              sample_price_score: Number(e.target.value) || undefined,
                            })
                          }
                          placeholder="2000"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Turnaround Time (days)</Label>
                      <Input
                        type="number"
                        value={profile.turnaround_days || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            turnaround_days: Number(e.target.value) || undefined,
                          })
                        }
                        placeholder="5"
                        className="bg-slate-800 border-slate-700"
                        min="1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Track */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Upload Track
                  </CardTitle>
                  <CardDescription>Add a new track to your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Track
                  </Button>
                </CardContent>
              </Card>

              {/* Verification Section */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Ethos Guild Verification
                  </CardTitle>
                  <CardDescription>
                    Get verified to unlock commercial licensing opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.verified ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-400">Verified Artist</p>
                        <p className="text-sm text-green-300 mt-1">
                          You are a verified Ethos Guild artist. You can upload tracks and accept
                          commercial licensing requests.
                        </p>
                      </div>
                    </div>
                  ) : verificationStatus.status === "pending" ? (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-400">Pending Review</p>
                        <p className="text-sm text-yellow-300 mt-1">
                          Your verification request is under review. We'll email you when there's an
                          update.
                        </p>
                        {verificationStatus.submitted_at && (
                          <p className="text-xs text-yellow-300/70 mt-2">
                            Submitted:{" "}
                            {new Date(verificationStatus.submitted_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : verificationStatus.status === "rejected" ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="font-semibold text-red-400">Application Rejected</p>
                      {verificationStatus.rejection_reason && (
                        <p className="text-sm text-red-300 mt-2">
                          {verificationStatus.rejection_reason}
                        </p>
                      )}
                      <p className="text-sm text-red-300 mt-2">
                        You can resubmit with updates to your portfolio or qualifications.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-white">Application Notes (optional)</Label>
                        <Textarea
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          placeholder="Tell us about your experience, achievements, and why you'd like to join the Ethos Guild..."
                          className="bg-slate-800 border-slate-700 h-24"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Portfolio Links (one per line)</Label>
                        <Textarea
                          value={portfolioLinks}
                          onChange={(e) => setPortfolioLinks(e.target.value)}
                          placeholder="https://yourportfolio.com&#10;https://soundcloud.com/yourprofile&#10;https://example.com"
                          className="bg-slate-800 border-slate-700 h-24"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitVerification}
                        disabled={isSubmittingVerification}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      >
                        {isSubmittingVerification
                          ? "Submitting..."
                          : "Submit for Verification"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex-1"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>

          <TrackUploadModal
            open={uploadModalOpen}
            onOpenChange={setUploadModalOpen}
            onFileSelected={handleFileSelected}
          />

          {/* Metadata Form Modal */}
          {showMetadataForm && currentFile && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="bg-slate-900 border-slate-800 max-w-2xl w-full">
                <CardHeader>
                  <CardTitle className="text-white">Track Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrackMetadataForm
                    onSubmit={handleMetadataSubmit}
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
