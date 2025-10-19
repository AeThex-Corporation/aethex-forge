import React, { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";

interface MentorRow {
  user_id: string;
  bio: string | null;
  expertise: string[] | null;
  available: boolean;
  hourly_rate: number | null;
  user_profiles?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
  } | null;
}

export default function MentorshipRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [query, setQuery] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorRow | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Allow public browsing; only require sign-in when sending a request

  const loadMentors = async () => {
    setLoadingMentors(true);
    try {
      const rows = await aethexSocialService.listMentors({
        q: query || undefined,
        expertise: expertise.length ? expertise : undefined,
        available: true,
        limit: 30,
      });
      setMentors(rows as MentorRow[]);
    } catch (e: any) {
      aethexToast.error({
        title: "Failed to load mentors",
        description: String(e?.message || e),
      });
    } finally {
      setLoadingMentors(false);
    }
  };

  useEffect(() => {
    loadMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onOpenRequest = (m: MentorRow) => {
    if (!user) {
      aethexToast.info({
        title: "Sign in required",
        description: "Sign in to send a mentorship request.",
      });
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?next=${next}`);
      return;
    }
    setSelectedMentor(m);
    setMessage("");
    setDialogOpen(true);
  };

  const onSubmitRequest = async () => {
    if (!user?.id || !selectedMentor) return;
    try {
      setSubmitting(true);
      await aethexSocialService.requestMentorship(
        user.id,
        selectedMentor.user_id,
        message || undefined,
      );
      aethexToast.success({
        title: "Request sent",
        description: "The mentor has been notified",
      });
      setDialogOpen(false);
    } catch (e: any) {
      aethexToast.error({
        title: "Failed to send",
        description: String(e?.message || e),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filtersActive = useMemo(
    () => query.trim().length > 0 || expertise.length > 0,
    [query, expertise],
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            Mentorship
          </Badge>
          <h1 className="text-3xl font-bold">Request mentorship</h1>
          <p className="text-muted-foreground mt-1">
            Find mentors by skill and send a short request. You’ll be notified
            when they respond.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Refine mentors by topic or keyword.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q">Search</Label>
                <div className="flex gap-2">
                  <Input
                    id="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, username, bio"
                  />
                  <Button variant="secondary" onClick={loadMentors}>
                    Search
                  </Button>
                </div>
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
                    variant="secondary"
                    onClick={addExpertise}
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
            </div>
            {filtersActive && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setExpertise([]);
                    setExpertiseInput("");
                    loadMentors();
                  }}
                >
                  Reset
                </Button>
                <Button onClick={loadMentors}>Apply filters</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loadingMentors && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Loading mentors...
              </CardContent>
            </Card>
          )}
          {!loadingMentors && mentors.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No mentors found. Try adjusting filters.
              </CardContent>
            </Card>
          )}
          {!loadingMentors &&
            mentors.map((m) => (
              <Card key={m.user_id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {m.user_profiles?.full_name ||
                      m.user_profiles?.username ||
                      "Mentor"}
                  </CardTitle>
                  <CardDescription>
                    {(m.expertise || []).slice(0, 5).join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {m.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {m.bio}
                    </p>
                  )}
                  {typeof m.hourly_rate === "number" && (
                    <p className="text-sm">Rate: ${m.hourly_rate}/hr</p>
                  )}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Button onClick={() => onOpenRequest(m)} className="w-full">
                      Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const uname = m.user_profiles?.username;
                        if (uname) {
                          navigate(
                            `/community/mentor/${encodeURIComponent(uname)}`,
                          );
                        }
                      }}
                      className="w-full"
                      disabled={!m.user_profiles?.username}
                    >
                      View profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request mentorship</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Tell the mentor what you want to achieve"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmitRequest} disabled={submitting}>
                {submitting ? "Sending..." : "Send request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
