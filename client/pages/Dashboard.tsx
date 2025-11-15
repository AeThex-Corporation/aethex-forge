import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/LoadingScreen";
import { Link } from "react-router-dom";
import OAuthConnections, {
  type ProviderDescriptor,
  type ProviderKey,
} from "@/components/settings/OAuthConnections";
import RealmSwitcher, { RealmKey } from "@/components/settings/RealmSwitcher";
import {
  User,
  Settings,
  TrendingUp,
  Users,
  Bell,
  Star,
  Trophy,
  Rocket,
  Code,
  Database,
  Shield,
  ChevronRight,
  Activity,
  LogOut,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Copy,
  CheckCircle2,
  Github,
  Mail,
  MessageCircle,
} from "lucide-react";

const ARMS = [
  {
    id: "staff",
    label: "Staff",
    color: "#7c3aed",
    href: "/staff/dashboard",
    icon: Shield,
    description: "Operations & Administration",
    bgGradient: "from-purple-500/20 to-purple-900/20",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
  },
  {
    id: "labs",
    label: "Labs",
    color: "#FBBF24",
    href: "/dashboard/labs",
    icon: Code,
    description: "Research & Development",
    bgGradient: "from-amber-500/20 to-amber-900/20",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
  },
  {
    id: "gameforge",
    label: "GameForge",
    color: "#22C55E",
    href: "/dashboard/gameforge",
    icon: Rocket,
    description: "Game Development",
    bgGradient: "from-green-500/20 to-green-900/20",
    borderColor: "border-green-500/30 hover:border-green-500/60",
  },
  {
    id: "corp",
    label: "Corp",
    color: "#3B82F6",
    href: "/hub/client",
    icon: Users,
    description: "Business & Consulting",
    bgGradient: "from-blue-500/20 to-blue-900/20",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
  },
  {
    id: "foundation",
    label: "Foundation",
    color: "#EF4444",
    href: "/dashboard/foundation",
    icon: Trophy,
    description: "Education & Mentorship",
    bgGradient: "from-red-500/20 to-red-900/20",
    borderColor: "border-red-500/30 hover:border-red-500/60",
  },
  {
    id: "devlink",
    label: "Dev-Link",
    color: "#06B6D4",
    href: "/dashboard/dev-link",
    icon: Database,
    description: "Developer Network",
    bgGradient: "from-cyan-500/20 to-cyan-900/20",
    borderColor: "border-cyan-500/30 hover:border-cyan-500/60",
  },
  {
    id: "nexus",
    label: "Nexus",
    color: "#A855F7",
    href: "/dashboard/nexus",
    icon: Sparkles,
    description: "Talent Marketplace",
    bgGradient: "from-purple-500/20 to-fuchsia-900/20",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
  },
];

const OAUTH_PROVIDERS: readonly ProviderDescriptor[] = [
  {
    provider: "github",
    name: "GitHub",
    description: "Connect your GitHub account for project collaboration",
    Icon: Github,
    gradient: "from-gray-700 to-black",
  },
  {
    provider: "google",
    name: "Google",
    description: "Sign in with your Google account",
    Icon: Mail,
    gradient: "from-red-500 to-orange-500",
  },
  {
    provider: "discord",
    name: "Discord",
    description: "Link your Discord account for community chat",
    Icon: MessageCircle,
    gradient: "from-indigo-500 to-purple-600",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading: authLoading,
    signOut,
    profileComplete,
    linkedProviders,
    linkProvider,
    unlinkProvider,
  } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") ?? "realms",
  );
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.full_name || "");
      setBio(profile.bio || "");
      setWebsite(profile.website_url || "");
      setLinkedin(profile.linkedin_url || "");
      setGithub(profile.github_url || "");
      setTwitter(profile.twitter_url || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await (window as any).supabaseClient
        .from("user_profiles")
        .update({
          full_name: displayName,
          bio: bio,
          website_url: website,
          linkedin_url: linkedin,
          github_url: github,
          twitter_url: twitter,
        })
        .eq("id", user.id);

      if (error) throw error;
      aethexToast({
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (error: any) {
      aethexToast({
        message: error?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const profileUrl = profile?.username
    ? `https://${profile.username}.aethex.me`
    : "";

  const copyProfileLink = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      setProfileLinkCopied(true);
      setTimeout(() => setProfileLinkCopied(false), 2000);
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome to AeThex
              </h1>
              <p className="text-gray-400 text-lg">
                Sign in to access your personalized dashboard
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-6"
            >
              Sign In to Dashboard
            </Button>
            <Button
              onClick={() => navigate("/onboarding")}
              variant="outline"
              className="w-full text-lg py-6 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              Create New Account
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const showProfileSetup = !profileComplete;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                  Welcome back,{" "}
                  <span className="text-purple-300 font-semibold">
                    {profile?.full_name || user.email?.split("@")[0]}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileComplete && (
                  <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border-green-500/50 text-sm py-1 px-3">
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Profile Complete
                  </Badge>
                )}
                {profile?.level && (
                  <Badge
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 bg-purple-500/10 text-sm py-1 px-3"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Level {profile.level}
                  </Badge>
                )}
              </div>
            </div>

            {/* Setup Banner */}
            {showProfileSetup && (
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-white">
                        Complete Your Profile
                      </p>
                      <p className="text-sm text-orange-200">
                        Set up your profile to unlock all AeThex features and
                        join the community
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("profile")}
                      className="bg-orange-600 hover:bg-orange-700 shrink-0"
                    >
                      Setup Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 bg-purple-950/30 border border-purple-500/20 p-1">
              <TabsTrigger value="realms" className="text-sm md:text-base">
                <span className="hidden sm:inline">Realms</span>
                <span className="sm:hidden">Arms</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-sm md:text-base">
                Profile
              </TabsTrigger>
              <TabsTrigger value="connections" className="text-sm md:text-base">
                Connections
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm md:text-base">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Realms Tab */}
            <TabsContent value="realms" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ARMS.map((arm) => {
                  const IconComponent = arm.icon;
                  return (
                    <button
                      key={arm.id}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(arm.href);
                      }}
                      className="group relative overflow-hidden"
                    >
                      <Card
                        className={`bg-gradient-to-br ${arm.bgGradient} border transition-all duration-300 h-full hover:shadow-lg hover:shadow-purple-500/20 ${arm.borderColor} cursor-pointer`}
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-black/30 group-hover:bg-black/50 transition-colors">
                                  <IconComponent
                                    className="h-5 w-5"
                                    style={{ color: arm.color }}
                                  />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                  {arm.label}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-400">
                                {arm.description}
                              </p>
                            </div>
                          </div>
                          <div className="pt-2 flex items-center gap-2 text-purple-300 group-hover:gap-3 transition-all">
                            <span className="text-sm font-medium">Explore</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20 lg:col-span-1">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="relative mx-auto w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-lg" />
                      <img
                        src={
                          profile?.avatar_url ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full ring-4 ring-purple-500/40 relative"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white">
                        {profile?.full_name || "User"}
                      </h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <Badge className="bg-purple-600/50 text-purple-100 mx-auto">
                        <Star className="h-3 w-3 mr-1" />
                        Level {profile?.level || 1}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your public profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-purple-950/30 border-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        className="bg-purple-950/30 border-purple-500/20 resize-none h-24"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className="bg-purple-950/30 border-purple-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github.com/username"
                          className="bg-purple-950/30 border-purple-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/username"
                          className="bg-purple-950/30 border-purple-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X</Label>
                        <Input
                          id="twitter"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="@username"
                          className="bg-purple-950/30 border-purple-500/20"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Link Card */}
              {profileUrl && (
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>Your Public Profile</CardTitle>
                    <CardDescription>
                      Share your unique profile link with others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 bg-purple-950/30 border border-purple-500/20 rounded-lg p-3">
                      <code className="flex-1 text-sm text-purple-200 break-all">
                        {profileUrl}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyProfileLink}
                        className="h-8 w-8 shrink-0"
                        title={profileLinkCopied ? "Copied!" : "Copy"}
                      >
                        {profileLinkCopied ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      This is your public profile page where others can see your
                      achievements, portfolio, and connect with you.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Link to={`/passport/${profile?.username || "me"}`}>
                        View Your Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent
              value="connections"
              className="space-y-6 animate-fade-in"
            >
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Link external accounts to your AeThex profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OAuthConnections
                    providers={OAUTH_PROVIDERS}
                    linkedProviderMap={
                      linkedProviders
                        ? Object.fromEntries(
                            linkedProviders.map((p) => [p.provider, p]),
                          )
                        : {}
                    }
                    connectionAction={null}
                    onLink={linkProvider}
                    onUnlink={unlinkProvider}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Realm Preference */}
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>Primary Realm</CardTitle>
                    <CardDescription>
                      Choose your primary area of focus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RealmSwitcher />
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-red-500/30 text-red-300 hover:bg-red-500/10 h-auto py-2"
                      onClick={() => signOut()}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
