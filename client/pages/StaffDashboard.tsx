import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { aethexToast } from "@/lib/aethex-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function useHasStaffAccess(roles: string[]) {
  return useMemo(
    () =>
      roles.some((r) =>
        ["owner", "admin", "founder", "staff", "employee"].includes(
          r.toLowerCase(),
        ),
      ),
    [roles],
  );
}

export default function StaffDashboard() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const hasAccess = useHasStaffAccess(roles);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      aethexToast.info({
        title: "Sign in required",
        description: "Staff area requires authentication",
      });
      navigate("/staff/login");
      return;
    }
    if (!hasAccess) {
      aethexToast.error({
        title: "Access denied",
        description: "You don't have staff permissions",
      });
      navigate("/dashboard");
    }
  }, [user, roles, hasAccess, loading, navigate]);

  const [activeTab, setActiveTab] = useState("overview");
  const [openReports, setOpenReports] = useState<any[]>([]);
  const [mentorshipAll, setMentorshipAll] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const refresh = async () => {
    setLoadingData(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/moderation/reports?status=open&limit=100"),
        fetch("/api/mentorship/requests/all?limit=50&status=pending"),
      ]);
      const reports = r1.ok ? await r1.json() : [];
      const m = r2.ok ? await r2.json() : [];
      setOpenReports(Array.isArray(reports) ? reports : []);
      setMentorshipAll(Array.isArray(m) ? m : []);
    } catch (e) {
      /* ignore */
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && hasAccess) refresh();
  }, [user, hasAccess]);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQ.trim()) params.set("q", searchQ.trim());
      params.set("limit", "25");
      const resp = await fetch(`/api/staff/users?${params.toString()}`);
      const data = resp.ok ? await resp.json() : [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  const updateReportStatus = async (
    id: string,
    status: "resolved" | "ignored" | "open",
  ) => {
    try {
      const resp = await fetch(
        `/api/moderation/reports/${encodeURIComponent(id)}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (resp.ok) {
        aethexToast.success({
          title: "Updated",
          description: `Report marked ${status}`,
        });
        refresh();
      }
    } catch {}
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">
            Internal
          </Badge>
          <h1 className="text-3xl font-bold">Operations Command</h1>
          <p className="text-muted-foreground">
            Staff dashboards, moderation, and internal tools.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Community Health</CardTitle>
                  <CardDescription>
                    Quick pulse across posts and reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Open reports
                    </div>
                    <div className="text-xl font-semibold">
                      {openReports.length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">
                      Mentorship requests
                    </div>
                    <div className="text-xl font-semibold">
                      {mentorshipAll.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                  <CardDescription>APIs and queues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Admin API
                    </div>
                    <Badge className="bg-emerald-600">OK</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">
                      Notifications
                    </div>
                    <Badge className="bg-emerald-600">OK</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Staff Resources</CardTitle>
                  <CardDescription>Knowledge & HR tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <a href="/staff/knowledge-base">Knowledge Base</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/staff/team-handbook">Team Handbook</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/staff/announcements">Announcements</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/staff/learning-portal">Learning Portal</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Queue</CardTitle>
                <CardDescription>Flagged content and actions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData && (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                )}
                {!loadingData && openReports.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No items in queue.
                  </p>
                )}
                <div className="space-y-3">
                  {openReports.map((r) => (
                    <div
                      key={r.id}
                      className="rounded border border-border/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{r.reason}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.details}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateReportStatus(r.id, "ignored")}
                          >
                            Ignore
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateReportStatus(r.id, "resolved")}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>
                  Review recent mentor/mentee activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData && (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                )}
                {!loadingData && mentorshipAll.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No requests to review.
                  </p>
                )}
                <div className="space-y-3">
                  {mentorshipAll.map((req) => (
                    <div
                      key={req.id}
                      className="rounded border border-border/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">
                            {req.mentee?.full_name || req.mentee?.username} →{" "}
                            {req.mentor?.full_name || req.mentor?.username}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {req.message || "No message"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button asChild>
                    <a href="/community/mentorship">Open requests</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/community/mentorship/apply">Mentor directory</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Search, roles, and quick actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    className="w-full rounded border border-border/50 bg-background px-3 py-2 text-sm"
                    placeholder="Search by name or username"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                  <Button onClick={loadUsers} variant="outline">
                    Search
                  </Button>
                </div>
                <div className="rounded border border-border/50">
                  {users.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      No users found.
                    </p>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-3"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {u.full_name || u.username || u.id}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {u.username}
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {u.user_type || "unknown"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
