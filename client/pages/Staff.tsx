import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { aethexToast } from "@/lib/aethex-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Staff() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const hasAccess = useHasStaffAccess(roles);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      aethexToast.info({ title: "Sign in required", description: "Staff area requires authentication" });
      navigate("/login");
      return;
    }
    if (!hasAccess) {
      aethexToast.error({ title: "Access denied", description: "You don't have staff permissions" });
      navigate("/dashboard");
    }
  }, [user, roles, hasAccess, loading, navigate]);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">Internal</Badge>
          <h1 className="text-3xl font-bold">Operations Command</h1>
          <p className="text-muted-foreground">Staff dashboards, moderation, and internal tools.</p>
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
                  <CardDescription>Quick pulse across posts and reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Open reports</div>
                    <div className="text-xl font-semibold">0</div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">Mentorship requests</div>
                    <div className="text-xl font-semibold">0</div>
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
                    <div className="text-sm text-muted-foreground">Admin API</div>
                    <Badge className="bg-emerald-600">OK</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">Notifications</div>
                    <Badge className="bg-emerald-600">OK</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shortcuts</CardTitle>
                  <CardDescription>Common operational links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full"><a href="/admin">Admin panel</a></Button>
                  <Button asChild variant="outline" className="w-full"><a href="/community#mentorship">Mentorship hub</a></Button>
                  <Button asChild variant="outline" className="w-full"><a href="/feed">Community feed</a></Button>
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
                <p className="text-sm text-muted-foreground">No items in queue.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>Review recent mentor/mentee activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No requests to review.</p>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button asChild><a href="/community/mentorship">Open requests</a></Button>
                  <Button asChild variant="outline"><a href="/community/mentorship/apply">Mentor directory</a></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Search, roles, and quick actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">User tools coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
