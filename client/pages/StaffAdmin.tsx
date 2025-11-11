import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Users,
  Settings,
  Key,
  BarChart3,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function StaffAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [newApiKey, setNewApiKey] = useState("");
  const [apiKeys] = useState([
    {
      id: 1,
      name: "Discord Integration",
      key: "aethex_sk_****...****",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
    },
    {
      id: 2,
      name: "Analytics",
      key: "aethex_sk_****...****",
      created: "2024-01-10",
      lastUsed: "2024-01-21",
    },
  ]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Administration
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                System configuration and management
              </p>
            </div>
            <Button
              onClick={() => navigate("/staff/dashboard")}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Tabs */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Permissions</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="gap-2">
                    <Key className="w-4 h-4" />
                    <span className="hidden sm:inline">API Keys</span>
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Audit Log</span>
                  </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6 mt-6">
                  <Alert className="border-blue-500/30 bg-blue-500/10">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="ml-2 text-blue-600">
                      This interface allows management of AeThex users
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search" className="text-gray-300">
                        Search Users
                      </Label>
                      <Input
                        id="search"
                        placeholder="Search by email or name..."
                        className="mt-2 bg-slate-800/50 border-purple-500/20"
                      />
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                          <div>
                            <p className="text-white font-medium">
                              Total Users
                            </p>
                            <p className="text-gray-400 text-sm">
                              All registered accounts
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-purple-400">
                            2,487
                          </p>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                          <div>
                            <p className="text-white font-medium">
                              Active Users
                            </p>
                            <p className="text-gray-400 text-sm">
                              Signed in this week
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-green-400">
                            1,234
                          </p>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-white font-medium">
                              New This Month
                            </p>
                            <p className="text-gray-400 text-sm">
                              Recent sign-ups
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-blue-400">
                            287
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="space-y-6 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Owner</p>
                        <p className="text-gray-400 text-sm">
                          Full system access
                        </p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-300">
                        2 members
                      </Badge>
                    </div>
                    <div className="border-t border-purple-500/10 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">Admin</p>
                          <p className="text-gray-400 text-sm">
                            Management access
                          </p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          5 members
                        </Badge>
                      </div>
                    </div>
                    <div className="border-t border-purple-500/10 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">Editor</p>
                          <p className="text-gray-400 text-sm">Edit content</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          12 members
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <Card className="bg-slate-800/50 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          System Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-gray-300">
                            Maintenance Mode
                          </Label>
                          <p className="text-sm text-gray-400 mt-1">
                            Enable to restrict access during updates
                          </p>
                          <Button
                            variant="outline"
                            className="mt-3 border-purple-500/30"
                          >
                            Disabled
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* API Keys Tab */}
                <TabsContent value="api" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-name" className="text-gray-300">
                        Generate New Key
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="api-name"
                          placeholder="Key name (e.g., Discord Integration)"
                          className="bg-slate-800/50 border-purple-500/20"
                          value={newApiKey}
                          onChange={(e) => setNewApiKey(e.target.value)}
                        />
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-4">
                        Active Keys
                      </h4>
                      <div className="space-y-3">
                        {apiKeys.map((key) => (
                          <div
                            key={key.id}
                            className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">
                                  {key.name}
                                </p>
                                <p className="text-gray-400 text-sm font-mono mt-1">
                                  {key.key}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                  Created: {key.created} | Last used:{" "}
                                  {key.lastUsed}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                              >
                                Revoke
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Audit Log Tab */}
                <TabsContent value="audit" className="space-y-6 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                    <div className="space-y-3">
                      {[
                        {
                          action: "User created",
                          details: "john.doe@example.com",
                          time: "2 hours ago",
                          user: "admin",
                        },
                        {
                          action: "Settings updated",
                          details: "Discord integration enabled",
                          time: "5 hours ago",
                          user: "admin",
                        },
                        {
                          action: "API key generated",
                          details: "Analytics key created",
                          time: "1 day ago",
                          user: "operations",
                        },
                      ].map((log, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start py-3 border-b border-purple-500/10 last:border-0"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {log.action}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {log.details}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">{log.time}</p>
                            <Badge
                              variant="outline"
                              className="mt-1 border-purple-500/30"
                            >
                              {log.user}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
