import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  GamepadIcon,
  BriefcaseIcon,
  UsersIcon,
  ShoppingCartIcon,
  Rocket,
  Compass,
  ArrowRight,
  Check,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, memo, type ComponentType } from "react";

export type RealmKey =
  | "game_developer"
  | "client"
  | "community_member"
  | "customer"
  | "staff";

export interface RealmOption {
  id: RealmKey;
  name: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  route: string;
  routeLabel: string;
  highlights: string[];
}

export const REALM_OPTIONS: RealmOption[] = [
  {
    id: "game_developer",
    name: "Development Forge",
    title: "Game Development",
    description:
      "Build immersive experiences, collaborate with other creators, and unlock our full suite of development tools.",
    icon: GamepadIcon,
    gradient: "from-neon-purple to-aethex-500",
    route: "/gameforge",
    routeLabel: "Game Development",
    highlights: [
      "Advanced tooling and workflows",
      "Collaborative project spaces",
      "Mentors and technical reviews",
    ],
  },
  {
    id: "client",
    name: "Strategist Nexus",
    title: "Consulting",
    description:
      "Engage AeThex teams for bespoke solutions, product consulting, and strategic execution across every milestone.",
    icon: BriefcaseIcon,
    gradient: "from-neon-blue to-aethex-400",
    route: "/corp",
    routeLabel: "Consulting",
    highlights: [
      "Project leadership & delivery",
      "End-to-end service orchestration",
      "Outcome-driven partnership",
    ],
  },
  {
    id: "community_member",
    name: "Innovation Commons",
    title: "Community",
    description:
      "Connect with innovators, share discoveries, and access exclusive research, events, and community resources.",
    icon: UsersIcon,
    gradient: "from-neon-green to-aethex-600",
    route: "/community",
    routeLabel: "Community",
    highlights: [
      "Curated knowledge streams",
      "Collaborative guilds & events",
      "Access to experimental features",
    ],
  },
  {
    id: "customer",
    name: "Experience Hub",
    title: "Get Started",
    description:
      "Discover AeThex products, manage licenses, and access tailored support for every experience you launch.",
    icon: ShoppingCartIcon,
    gradient: "from-amber-400 to-aethex-700",
    route: "/get-started",
    routeLabel: "Get Started",
    highlights: [
      "Personalized product journeys",
      "Priority support & updates",
      "Insight dashboards",
    ],
  },
  {
    id: "staff",
    name: "Operations Command",
    title: "Admin Panel",
    description:
      "Admin realm for site staff and employees: operations dashboards, moderation, and admin tooling.",
    icon: Shield,
    gradient: "from-sky-600 to-indigo-700",
    route: "/admin",
    routeLabel: "Admin",
    highlights: [
      "Moderation & triage",
      "Operational dashboards",
      "Internal tools & audits",
    ],
  },
];

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Pathfinder (Beginner)" },
  { value: "intermediate", label: "Innovator (Intermediate)" },
  { value: "advanced", label: "Visionary (Advanced)" },
  { value: "expert", label: "Architect (Expert)" },
];

interface RealmSwitcherProps {
  selectedRealm: RealmKey | null;
  onRealmChange: (realm: RealmKey) => void;
  selectedExperience: string;
  onExperienceChange: (value: string) => void;
  hasChanges: boolean;
  onSave: () => void;
  saving: boolean;
}

const RealmSwitcher = memo(function RealmSwitcher({
  selectedRealm,
  onRealmChange,
  selectedExperience,
  onExperienceChange,
  hasChanges,
  onSave,
  saving,
}: RealmSwitcherProps) {
  const { roles } = useAuth();
  const canSeeStaff = useMemo(
    () =>
      roles.some((r) =>
        ["owner", "admin", "founder", "staff", "employee"].includes(
          r.toLowerCase(),
        ),
      ),
    [roles],
  );
  const visibleOptions = useMemo(
    () => REALM_OPTIONS.filter((o) => (o.id === "staff" ? canSeeStaff : true)),
    [canSeeStaff],
  );
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Rocket className="h-4 w-4 text-aethex-400" />
          Realm & Path
        </h3>
        <p className="text-sm text-muted-foreground">
          Tailor your AeThex experience. Choose the realm that matches your
          goals and align the path difficulty that fits your craft.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleOptions.map((realm, index) => {
          const Icon = realm.icon;
          const isActive = selectedRealm === realm.id;
          return (
            <Card
              key={realm.id}
              className={cn(
                "relative overflow-hidden border border-border/50 transition-all duration-300 hover:border-aethex-400/50 hover:shadow-lg",
                isActive && "border-aethex-400/70 shadow-xl",
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                  `from-transparent via-aethex-300/40 to-transparent`,
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg",
                      `bg-gradient-to-br ${realm.gradient}`,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {realm.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {realm.name}
                    </CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {realm.description}
                </p>
                <Badge
                  variant="outline"
                  className="w-fit border-aethex-400/40 text-[11px] uppercase tracking-wider"
                >
                  Suggested route: {realm.routeLabel}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {realm.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-start gap-2">
                      <Compass className="h-3.5 w-3.5 mt-0.5 text-aethex-400" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-2",
                      isActive
                        ? "bg-gradient-to-r from-aethex-500 to-neon-blue"
                        : "hover:border-aethex-400/60",
                    )}
                    onClick={() => onRealmChange(realm.id)}
                  >
                    {isActive ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {isActive ? "Realm active" : "Activate realm"}
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <Link to={realm.route}>Visit {realm.routeLabel}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Path difficulty</p>
          <p className="text-xs text-muted-foreground">
            Tune the experience level that unlocks curated resources and
            challenges matched to your expertise.
          </p>
        </div>
        <Select value={selectedExperience} onValueChange={onExperienceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose your experience path" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Your realm influences recommendations, default routes, and
          collaboration invites. You can change it anytime.
        </p>
        <Button
          type="button"
          disabled={!hasChanges || saving || !selectedRealm}
          onClick={onSave}
          className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
        >
          {saving ? "Saving..." : "Save realm & path"}
        </Button>
      </div>
    </div>
  );
});

export default RealmSwitcher;
