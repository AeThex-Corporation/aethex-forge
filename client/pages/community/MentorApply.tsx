import React, { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import { aethexSocialService } from "@/lib/aethex-social-service";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useNavigate } from "react-router-dom";

export default function MentorApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [available, setAvailable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Show inline sign-in prompt instead of redirecting away

  const addExpertise = () => {
    const parts = expertiseInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = Array.from(new Set([...expertise, ...parts])).slice(0, 20);
    setExpertise(next);
    setExpertiseInput("");
  };

  const removeExpertise = (tag: string) => {
    setExpertise((prev) =>
      prev.filter((t) => t.toLowerCase() !== tag.toLowerCase()),
    );
  };

  const canSubmit = useMemo(() => {
    return Boolean(user?.id) && expertise.length > 0 && !submitting;
  }, [user, expertise, submitting]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setSubmitting(true);
      const rate = hourlyRate ? Number(hourlyRate) : undefined;
      await aethexSocialService.applyToBeMentor(user.id, {
        bio: bio || null,
        expertise,
        hourlyRate: Number.isFinite(rate as number)
          ? (rate as number)
          : undefined,
        available,
      });
      aethexToast.success({
        title: "Mentor profile saved",
        description: "You're ready to receive mentorship requests",
      });
      navigate("/community#mentorship");
    } catch (e: any) {
      aethexToast.error({
        title: "Failed to save",
        description: String(e?.message || e),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            Mentorship
          </Badge>
          <h1 className="text-3xl font-bold">Become a mentor</h1>
          <p className="text-muted-foreground mt-1">
            Share your expertise and guide community members through 1:1
            sessions and clinics.
          </p>
        </div>

        {!user ? (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Sign in to create your mentor profile and start receiving
                requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const next = encodeURIComponent(
                      location.pathname + location.search,
                    );
                    navigate(`/login?next=${next}`);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/community#mentorship")}
                >
                  Back to directory
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Mentor profile</CardTitle>
              <CardDescription>
                Tell mentees how you can help and set your availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What topics do you mentor on?"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise</Label>
                  <div className="flex gap-2">
                    <Input
                      id="expertise"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      placeholder="Add tags, e.g. Unreal, AI, Networking"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addExpertise();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addExpertise}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expertise.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => removeExpertise(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly rate (optional)</Label>
                    <Input
                      id="rate"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 100"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 or leave blank if you mentor for free.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available">Available</Label>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="available"
                        checked={available}
                        onCheckedChange={setAvailable}
                      />
                      <span className="text-sm text-muted-foreground">
                        Show in mentor directory
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!canSubmit}>
                    {submitting ? "Saving..." : "Save mentor profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/community#mentorship")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
