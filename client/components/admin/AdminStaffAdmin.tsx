import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Settings, Key, FileText, Wrench } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
}

export default function AdminStaffAdmin() {
  const [adminTab, setAdminTab] = useState("users");

  const users: User[] = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@aethex.dev",
      role: "Owner",
      status: "active",
      joinDate: "2023-01-01",
    },
    {
      id: "2",
      name: "Jordan Martinez",
      email: "jordan@aethex.dev",
      role: "Admin",
      status: "active",
      joinDate: "2023-02-15",
    },
    {
      id: "3",
      name: "Sam Patel",
      email: "sam@aethex.dev",
      role: "Staff",
      status: "active",
      joinDate: "2023-06-01",
    },
  ];

  const permissions = [
    { feature: "User Management", owner: true, admin: true, staff: false },
    { feature: "Content Moderation", owner: true, admin: true, staff: true },
    { feature: "Analytics", owner: true, admin: true, staff: true },
    { feature: "System Settings", owner: true, admin: false, staff: false },
    { feature: "API Keys", owner: true, admin: true, staff: false },
    { feature: "Audit Logs", owner: true, admin: true, staff: false },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active:
        "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
      inactive:
        "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-200",
      suspended: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
    };
    return colors[status] || colors.inactive;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Management</h2>
        <p className="text-muted-foreground">
          User management, permissions, settings, and system tools
        </p>
      </div>

      <Tabs value={adminTab} onValueChange={setAdminTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage staff accounts and access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border border-border/40 rounded-lg bg-background/40 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined {user.joinDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Define what each role can access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Feature</th>
                      <th className="text-center p-2 font-semibold">Owner</th>
                      <th className="text-center p-2 font-semibold">Admin</th>
                      <th className="text-center p-2 font-semibold">Staff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr
                        key={perm.feature}
                        className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="p-2 font-medium">{perm.feature}</td>
                        <td className="text-center p-2">
                          {perm.owner ? (
                            <Badge className="bg-green-100 text-green-900 dark:bg-green-900/30">
                              ✓
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-center p-2">
                          {perm.admin ? (
                            <Badge className="bg-green-100 text-green-900 dark:bg-green-900/30">
                              ✓
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-center p-2">
                          {perm.staff ? (
                            <Badge className="bg-green-100 text-green-900 dark:bg-green-900/30">
                              ✓
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global system parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-border/40 rounded-lg bg-background/40">
                <label className="block font-medium mb-2">
                  Session Timeout
                </label>
                <select className="w-full border border-input rounded p-2 bg-background">
                  <option>12 hours</option>
                  <option selected>24 hours</option>
                  <option>48 hours</option>
                  <option>7 days</option>
                </select>
              </div>
              <div className="p-3 border border-border/40 rounded-lg bg-background/40">
                <label className="block font-medium mb-2">
                  Require 2FA for Staff
                </label>
                <input type="checkbox" defaultChecked /> Enabled
              </div>
              <div className="p-3 border border-border/40 rounded-lg bg-background/40">
                <label className="block font-medium mb-2">Audit Logging</label>
                <input type="checkbox" defaultChecked /> Enabled
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys Management</CardTitle>
              <CardDescription>Generate and revoke API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mb-4">Generate New Key</Button>
              <p className="text-sm text-muted-foreground">
                No active API keys. Generate one to get started.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                Track all administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 border-l-2 border-blue-500 pl-3">
                  <p className="font-medium">User Permissions Updated</p>
                  <p className="text-xs text-muted-foreground">
                    Jordan Martinez role changed to Admin • 2 hours ago
                  </p>
                </div>
                <div className="p-2 border-l-2 border-green-500 pl-3">
                  <p className="font-medium">System Settings Modified</p>
                  <p className="text-xs text-muted-foreground">
                    Session timeout changed to 24 hours • 1 day ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>
                Administrative tools and utilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Clear Cache
              </Button>
              <Button variant="outline" className="w-full">
                Sync Database
              </Button>
              <Button variant="outline" className="w-full">
                Generate Report
              </Button>
              <Button variant="destructive" className="w-full mt-4" disabled>
                Emergency Shutdown (Disabled)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
