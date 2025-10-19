import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { aethexSocialService } from "@/lib/aethex-social-service";

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

export default function MentorProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const rows = (await aethexSocialService.listMentors({
          q: username,
          limit: 50,
        })) as MentorRow[];
        const found = rows.find(
          (r) =>
            (r.user_profiles?.username || "").toLowerCase() ===
            (username || "").toLowerCase(),
        );
        setMentor(found || null);
      } catch {
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const displayName = useMemo(
    () =>
      mentor?.user_profiles?.full_name ||
      mentor?.user_profiles?.username ||
      "Mentor",
    [mentor],
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">
            Mentorship
          </Badge>
          <h1 className="text-3xl font-bold">
            {loading ? "Loading…" : displayName}
          </h1>
          {!loading && (
            <p className="text-muted-foreground mt-1">
              {mentor?.user_profiles?.bio || mentor?.bio || "Mentor profile"}
            </p>
          )}
        </div>

        {loading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading profile…
            </CardContent>
          </Card>
        )}

        {!loading && !mentor && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Mentor not found.
            </CardContent>
          </Card>
        )}

        {!loading && mentor && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Background and focus areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentor.bio && (
                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {(mentor.expertise || []).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking</CardTitle>
                <CardDescription>Availability and rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div>
                    Availability:{" "}
                    {mentor.available ? "Accepting requests" : "Unavailable"}
                  </div>
                  {typeof mentor.hourly_rate === "number" && (
                    <div>Rate: ${mentor.hourly_rate}/hr</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      navigate(
                        `/community/mentorship?m=${mentor.user_profiles?.username || mentor.user_id}`,
                      )
                    }
                  >
                    Request mentorship
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/community/mentorship")}
                  >
                    Back to directory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
