import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RealmSwitcher, {
  REALM_OPTIONS,
  RealmKey,
} from "@/components/settings/RealmSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, Rocket } from "lucide-react";

export default function Realms() {
  const { user, profile, roles, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activating, setActivating] = useState<string | null>(null);
  const [selectedRealm, setSelectedRealm] = useState<RealmKey | null>(
    (profile as any)?.user_type ?? null,
  );
  const [experience, setExperience] = useState<string>(
    (profile as any)?.experience_level || "beginner",
  );
  const [saving, setSaving] = useState(false);
  const lastRealm = (profile as any)?.user_type as RealmKey | undefined;
  const canSeeStaff = useMemo(
    () =>
      roles.some((r) =>
        ["owner", "admin", "founder", "staff", "employee"].includes(
          r.toLowerCase(),
        ),
      ),
    [roles],
  );
  const visible = useMemo(
    () => REALM_OPTIONS.filter((o) => (o.id === "staff" ? canSeeStaff : true)),
    [canSeeStaff],
  );

  return (
    <Layout>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[128px] opacity-20 bg-primary/30 top-20 left-10"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[128px] opacity-15 bg-primary/40 bottom-20 right-10"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-6xl relative space-y-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center space-y-6"
        >
          <Badge className="text-sm px-6 py-2 backdrop-blur-xl bg-primary/10 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
            Six Specialized Realms
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Choose Your{" "}
            <span className="text-primary drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">Realm</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Unique tools and communities for every role
          </p>
        </motion.div>

        {/* Realm & Path manager */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 backdrop-blur-xl bg-card/50 border-2 border-primary/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
        >
          <RealmSwitcher
            selectedRealm={selectedRealm}
            onRealmChange={setSelectedRealm}
            selectedExperience={experience}
            onExperienceChange={setExperience}
            hasChanges={
              selectedRealm !== ((profile as any)?.user_type ?? null) ||
              experience !== ((profile as any)?.experience_level || "beginner")
            }
            onSave={async () => {
              if (!selectedRealm) return;
              if (!user) {
                navigate("/onboarding");
                return;
              }
              setSaving(true);
              try {
                await updateProfile({
                  user_type: selectedRealm,
                  experience_level: experience,
                } as any);
                navigate("/dashboard", { replace: true });
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => navigate(user ? "/dashboard" : "/onboarding")}
              size="lg"
              className="shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] uppercase tracking-wide font-bold"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {user ? "Open Dashboard" : "Start Onboarding"}
            </Button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-primary/10 border-primary/30 uppercase tracking-wider font-bold">
              <Users className="w-4 h-4 mr-2 inline" />
              Contributor Network
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black">
              Mentors, Maintainers, and Shipmates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Grow the platform with us—teach, steward projects, and ship products together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full group hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Sparkles className="w-5 h-5" />
                    Mentors
                  </CardTitle>
                  <CardDescription className="text-base">
                    Guide builders through 1:1 sessions, clinics, and code reviews.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild className="shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Link to="/community/mentorship/apply">Become a mentor</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-primary/30">
                    <Link to="/community/mentorship">Request mentorship</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full group hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Zap className="w-5 h-5" />
                    Maintainers
                  </CardTitle>
                  <CardDescription className="text-base">
                    Own modules, triage issues, and lead roadmap execution.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="outline" className="border-primary/30">
                    <Link to="/developers">Browse developers</Link>
                  </Button>
                  <Button asChild className="shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Link to="/projects/new">Start a project</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full group hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Rocket className="w-5 h-5" />
                    Shipmates
                  </CardTitle>
                  <CardDescription className="text-base">
                    Join product squads shipping across Labs, Platform, and Community.
                  </CardDescription>
                  </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild className="shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Link to="/teams">Open Teams</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-primary/30">
                    <Link to="/labs">Explore Labs</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge className="bg-primary/10 border-primary/30 uppercase tracking-wider font-bold">
              <Zap className="w-4 h-4 mr-2 inline" />
              Teams Hiring Now
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black">
              Across Labs, Platform, and Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Apply to active squads and help us accelerate delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Labs squads</CardTitle>
                  <CardDescription className="text-base">
                    R&amp;D and experimental products.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-4">
                    <li>Realtime Engine</li>
                    <li>Gameplay Systems</li>
                    <li>Mentorship Programs</li>
                  </ul>
                  <Button asChild size="lg" className="w-full shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Link to="/teams">View openings</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Platform squads</CardTitle>
                  <CardDescription className="text-base">
                    Core app, APIs, and reliability.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-4">
                    <li>Edge Functions &amp; Status</li>
                    <li>Auth &amp; Profiles</li>
                    <li>Content &amp; Docs</li>
                  </ul>
                  <Button asChild size="lg" className="w-full shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Link to="/teams">View openings</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all h-full hover:scale-105 duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Community squads</CardTitle>
                  <CardDescription className="text-base">Growth, safety, and events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-4">
                    <li>Moderation &amp; Safety</li>
                    <li>Events &amp; Partnerships</li>
                    <li>Creator Success</li>
                  </ul>
                  <Button asChild size="lg" variant="outline" className="w-full border-primary/30">
                    <Link to="/community">Open community</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
