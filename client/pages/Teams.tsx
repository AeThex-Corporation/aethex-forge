import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { aethexCollabService } from "@/lib/aethex-collab-service";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";

export default function Teams() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const myTeams = await aethexCollabService.listMyTeams(user.id);
        setTeams(myTeams);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const canCreate = useMemo(
    () => name.trim().length > 2 && !creating,
    [name, creating],
  );

  const handleCreate = async () => {
    if (!user?.id) return;
    if (!canCreate) return;
    setCreating(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      team_id: tempId,
      teams: {
        id: tempId,
        name: name.trim(),
        description: description.trim() || null,
        visibility: "private",
      },
    } as any;
    setTeams((prev) => [optimistic, ...prev]);
    setName("");
    setDescription("");
    let created: any | null = null;
    try {
      created = await aethexCollabService.createTeam(
        user.id,
        optimistic.teams.name,
        optimistic.teams.description,
        "private",
      );
      setTeams((prev) =>
        prev.map((t: any) =>
          t.team_id === tempId ? { team_id: created.id, teams: created } : t,
        ),
      );
      aethexToast.success({ title: "Team created" });
    } catch (e: any) {
      setTeams((prev) => prev.filter((t: any) => t.team_id !== tempId));
      aethexToast.error({
        title: "Failed to create team",
        description: e?.message || "Try again later.",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading || isLoading)
    return (
      <LoadingScreen message="Loading teams..." showProgress duration={800} />
    );

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)] py-10">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6 space-y-6">
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <h1 className="text-3xl font-semibold text-foreground">Teams</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a team and collaborate with members across projects.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Your teams</CardTitle>
                  <CardDescription>Teams you belong to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No teams yet. Create one to get started.
                    </p>
                  ) : (
                    teams.map((t) => {
                      const team = (t as any).teams || t;
                      return (
                        <div
                          key={team.id}
                          className="flex items-center justify-between rounded-2xl border border-border/30 bg-background/60 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={undefined} />
                              <AvatarFallback>
                                {team.name?.[0]?.toUpperCase() || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {team.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {team.visibility || "private"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-border/50"
                            >
                              Team
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/projects/new`)}
                            >
                              New project
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Create a team</CardTitle>
                  <CardDescription>
                    Private by default; you can invite members later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Team name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Short description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreate}
                      disabled={!canCreate}
                      className="rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue text-white"
                    >
                      {creating ? "Creating..." : "Create team"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
