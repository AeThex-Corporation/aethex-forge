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
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            Realms
          </Badge>
          <h1 className="text-3xl font-bold">Choose your realm</h1>
          <p className="text-muted-foreground">
            Your dashboard adapts to the selected realm. Last used realm is
            highlighted.
          </p>
        </div>

        {/* Realm & Path manager */}
        <div className="mb-8">
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
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => navigate(user ? "/dashboard" : "/onboarding")}>
            {user ? "Open Dashboard" : "Start Onboarding"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
