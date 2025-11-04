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
import { Users, Plus, Zap, Target, Trophy, MessageSquare } from "lucide-react";

export default function Squads() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [squads, setSquads] = useState<any[]>([]);
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
        const mySquads = await aethexCollabService.listMyTeams(user.id);
        setSquads(mySquads.filter((t) => t.squad_type === true) || []);
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
    if (!canCreate || !user) return;

    setCreating(true);
    try {
      const newSquad = await aethexCollabService.createTeam(user.id, {
        name: name.trim(),
        description: description.trim(),
        squad_type: true,
      });

      if (newSquad) {
        setSquads([...squads, newSquad]);
        setName("");
        setDescription("");
        aethexToast.success({
          title: "Squad created",
          description: `${name} is ready to go!`,
        });
      }
    } catch (error) {
      aethexToast.error({
        title: "Failed to create squad",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading || isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)] py-10">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6 space-y-6">
          {/* Header */}
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">
                  Squads Hub
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Form squads and ship projects together. Match by skill,
                  timezone, and goals.
                </p>
              </div>
              <div className="hidden sm:block p-3 rounded-2xl bg-gradient-to-br from-aethex-500/10 to-neon-blue/10">
                <Users className="h-6 w-6 text-aethex-400" />
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Squads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{squads.length}</div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {squads.reduce(
                    (acc, squad) => acc + (squad.members?.length || 1),
                    0,
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Projects Shipped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-background/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Create New Squad Form */}
          <Card className="border-border/40 bg-background/80 backdrop-blur shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-aethex-400" />
                <CardTitle>Create a New Squad</CardTitle>
              </div>
              <CardDescription>
                Build your squad and start collaborating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Squad Name
                </label>
                <Input
                  placeholder="e.g., Game Dev Collective"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-background/60 border-border/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="What's this squad about? What will you build together?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 bg-background/60 border-border/40"
                  rows={4}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!canCreate}
                className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
              >
                {creating ? "Creating..." : "Create Squad"}
              </Button>
            </CardContent>
          </Card>

          {/* Your Squads */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Your Squads
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {squads.length === 0
                  ? "Create your first squad to get started"
                  : `You're in ${squads.length} squad${squads.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {squads.length === 0 ? (
              <Card className="border-dashed border-border/40 bg-background/40 backdrop-blur p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-aethex-500/10">
                    <Users className="h-6 w-6 text-aethex-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No squads yet
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Create a squad above to start building with others
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {squads.map((squad) => (
                  <Card
                    key={squad.id}
                    className="group border-border/40 bg-background/80 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-aethex-400/50"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="group-hover:text-aethex-300 transition-colors">
                            {squad.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {squad.description || "No description provided yet"}
                          </CardDescription>
                        </div>
                        <div className="p-2 rounded-lg bg-aethex-500/10 group-hover:bg-aethex-500/20 transition-colors">
                          <Users className="h-5 w-5 text-aethex-400" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {squad.members?.length || 1} member
                          {(squad.members?.length || 1) !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-border/40 hover:bg-background/50"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-aethex-500/10 hover:bg-aethex-500/20 text-aethex-300"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Squad Features */}
          <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Squad Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-aethex-500/5 border border-aethex-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-aethex-400" />
                  <span className="font-semibold text-foreground">
                    Real-time Sync
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep every squad aligned across devices with presence and
                  threads
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-neon-blue/60" />
                  <span className="font-semibold text-foreground">
                    Goal Tracking
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set objectives and track progress together
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-5 w-5 text-green-500/60" />
                  <span className="font-semibold text-foreground">
                    Achievements
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Celebrate milestones and earn squad badges
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
