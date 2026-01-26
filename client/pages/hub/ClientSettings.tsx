import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Settings,
  ArrowLeft,
  Building2,
  Bell,
  CreditCard,
  Users,
  Shield,
  Save,
  Upload,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Globe,
  Key,
  AlertTriangle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface CompanyProfile {
  name: string;
  logo_url: string;
  website: string;
  industry: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billing_email: string;
  phone: string;
}

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member" | "viewer";
  invited_at: string;
  accepted: boolean;
}

interface NotificationSettings {
  email_invoices: boolean;
  email_milestones: boolean;
  email_reports: boolean;
  email_team_updates: boolean;
  sms_urgent: boolean;
}

export default function ClientSettings() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");

  const [company, setCompany] = useState<CompanyProfile>({
    name: "",
    logo_url: "",
    website: "",
    industry: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
    billing_email: "",
    phone: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_invoices: true,
    email_milestones: true,
    email_reports: true,
    email_team_updates: true,
    sms_urgent: false,
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadSettings();
    }
  }, [user, authLoading]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load company profile
      const companyRes = await fetch(`${API_BASE}/api/corp/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (companyRes.ok) {
        const data = await companyRes.json();
        if (data) setCompany(data);
      }

      // Load team members
      const teamRes = await fetch(`${API_BASE}/api/corp/team/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (teamRes.ok) {
        const data = await teamRes.json();
        setTeamMembers(Array.isArray(data) ? data : []);
      }

      // Load notification settings
      const notifRes = await fetch(`${API_BASE}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (notifRes.ok) {
        const data = await notifRes.json();
        if (data) setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/company`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });

      if (res.ok) {
        aethexToast({ message: "Company profile saved", type: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      aethexToast({ message: "Failed to save company profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/user/notifications`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });

      if (res.ok) {
        aethexToast({ message: "Notification preferences saved", type: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      aethexToast({ message: "Failed to save notifications", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleInviteTeamMember = async () => {
    if (!newMemberEmail) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/team/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newMemberEmail, role: "member" }),
      });

      if (res.ok) {
        aethexToast({ message: "Invitation sent", type: "success" });
        setNewMemberEmail("");
        loadSettings();
      } else {
        throw new Error("Failed to invite");
      }
    } catch (error) {
      aethexToast({ message: "Failed to send invitation", type: "error" });
    }
  };

  const handleRemoveTeamMember = async (memberId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/team/members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        aethexToast({ message: "Team member removed", type: "success" });
        loadSettings();
      }
    } catch (error) {
      aethexToast({ message: "Failed to remove member", type: "error" });
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Settings..." />;
  }

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />

        <main className="relative z-10">
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/hub/client")}
                className="mb-4 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-blue-400" />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Settings className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-6">
                    Account settings and preferences coming soon
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/hub/client")}
                  >
                    Back to Portal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to your client portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invite New Member */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Enter email to invite..."
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    <Button onClick={handleInviteTeamMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>

                  {/* Team List */}
                  <div className="space-y-3">
                    {teamMembers.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-700 rounded-lg">
                        <Users className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                        <p className="text-gray-400">No team members yet</p>
                      </div>
                    ) : (
                      teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">{member.name || member.email}</p>
                              <p className="text-sm text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={
                              member.role === "admin"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-slate-500/20 text-slate-300"
                            }>
                              {member.role}
                            </Badge>
                            {!member.accepted && (
                              <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Invoice Notifications</p>
                        <p className="text-sm text-gray-400">Receive emails when invoices are issued or paid</p>
                      </div>
                      <Switch
                        checked={notifications.email_invoices}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_invoices: checked })}
                      />
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Milestone Updates</p>
                        <p className="text-sm text-gray-400">Get notified when project milestones are completed</p>
                      </div>
                      <Switch
                        checked={notifications.email_milestones}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_milestones: checked })}
                      />
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Weekly Reports</p>
                        <p className="text-sm text-gray-400">Receive weekly project status reports</p>
                      </div>
                      <Switch
                        checked={notifications.email_reports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_reports: checked })}
                      />
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Team Updates</p>
                        <p className="text-sm text-gray-400">Notifications about team member changes</p>
                      </div>
                      <Switch
                        checked={notifications.email_team_updates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email_team_updates: checked })}
                      />
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Urgent SMS Alerts</p>
                        <p className="text-sm text-gray-400">Receive SMS for critical updates</p>
                      </div>
                      <Switch
                        checked={notifications.sms_urgent}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms_urgent: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage payment methods and billing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Billing Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={company.billing_email}
                        onChange={(e) => setCompany({ ...company, billing_email: e.target.value })}
                        className="pl-10 bg-slate-800/50 border-slate-700"
                        placeholder="billing@company.com"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">Payment Methods</h3>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-blue-400" />
                        <div>
                          <p className="font-semibold text-white">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-400">Expires 12/26</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">Default</Badge>
                    </div>
                    <Button variant="outline" className="w-full border-slate-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-semibold text-white">Change Password</p>
                            <p className="text-sm text-gray-400">Update your account password</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="font-semibold text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-400">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-300">Danger Zone</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
