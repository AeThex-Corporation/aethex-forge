import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import LoadingScreen from "@/components/LoadingScreen";
import {
  User,
  Settings,
  Activity,
  Globe,
  Shield,
  Bell,
  Database,
  Monitor,
  Network,
  Zap,
  TrendingUp,
  Users,
  Server,
  Eye,
  Link2,
  Wifi,
  Cloud,
  Lock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Circle,
} from "lucide-react";

interface SiteStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: string;
  responseTime: number;
  version: string;
}

interface CrossSiteCommunication {
  siteName: string;
  lastSync: string;
  dataExchanged: number;
  status: 'connected' | 'disconnected' | 'syncing';
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    company: '',
    location: '',
    website: '',
    githubUsername: '',
    twitterUsername: '',
    linkedinUrl: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showProjects: true,
    allowAnalytics: true,
  });

  // Overseer dashboard data
  const [overseerData, setOverseerData] = useState({
    systemHealth: 98.5,
    activeUsers: 1247,
    totalProjects: 3592,
    serverLoad: 23,
    dataProcessed: 15.7, // GB
    apiCalls: 45231,
    errorRate: 0.03,
  });

  // Cross-site communication data
  const [crossSiteData, setCrossSiteData] = useState<CrossSiteCommunication[]>([
    {
      siteName: 'AeThex Labs',
      lastSync: '2 minutes ago',
      dataExchanged: 1.2,
      status: 'connected',
    },
    {
      siteName: 'Development Portal',
      lastSync: '5 minutes ago',
      dataExchanged: 0.8,
      status: 'syncing',
    },
    {
      siteName: 'Community Hub',
      lastSync: '12 minutes ago',
      dataExchanged: 2.1,
      status: 'connected',
    },
  ]);

  // Site monitoring data
  const [siteStatuses, setSiteStatuses] = useState<SiteStatus[]>([
    {
      name: 'Main Site',
      url: 'https://core.aethex.biz',
      status: 'online',
      lastCheck: 'Just now',
      responseTime: 245,
      version: '1.0.0',
    },
    {
      name: 'API Gateway',
      url: 'https://api.aethex.biz',
      status: 'online',
      lastCheck: '30 seconds ago',
      responseTime: 123,
      version: '2.1.3',
    },
    {
      name: 'Labs Portal',
      url: 'https://labs.aethex.biz',
      status: 'maintenance',
      lastCheck: '2 minutes ago',
      responseTime: 0,
      version: '1.5.2',
    },
  ]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setProfileData({
        displayName: profile.full_name || '',
        bio: profile.bio || '',
        company: profile.company || '',
        location: profile.location || '',
        website: profile.website || '',
        githubUsername: profile.github_username || '',
        twitterUsername: profile.twitter_username || '',
        linkedinUrl: profile.linkedin_url || '',
      });
    }

    setIsLoading(false);
  }, [authLoading, user, profile, navigate]);

  const handleProfileSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile({
        full_name: profileData.displayName,
        bio: profileData.bio,
        company: profileData.company,
        location: profileData.location,
        website: profileData.website,
        github_username: profileData.githubUsername,
        twitter_username: profileData.twitterUsername,
        linkedin_url: profileData.linkedinUrl,
      });

      aethexToast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        type: "success",
      });
    } catch (error) {
      aethexToast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'bg-green-500';
      case 'offline':
      case 'disconnected':
        return 'bg-red-500';
      case 'maintenance':
      case 'syncing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (authLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl">
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {profile?.full_name || 'User Profile'}
                </h1>
                <p className="text-gray-300">{user?.email}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-purple-600">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="overseer" className="text-white data-[state=active]:bg-purple-600">
                <Monitor className="h-4 w-4 mr-2" />
                Overseer
              </TabsTrigger>
              <TabsTrigger value="network" className="text-white data-[state=active]:bg-purple-600">
                <Network className="h-4 w-4 mr-2" />
                Network
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Update your profile information and social links.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName" className="text-white">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-white">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-white">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="bg-slate-900/50 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                  <Separator className="bg-slate-600" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="github" className="text-white">GitHub Username</Label>
                      <Input
                        id="github"
                        value={profileData.githubUsername}
                        onChange={(e) => setProfileData({ ...profileData, githubUsername: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter" className="text-white">Twitter Username</Label>
                      <Input
                        id="twitter"
                        value={profileData.twitterUsername}
                        onChange={(e) => setProfileData({ ...profileData, twitterUsername: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin" className="text-white">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={profileData.linkedinUrl}
                        onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={handleProfileSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, [key]: checked })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={typeof value === 'boolean' ? value : value === 'public'}
                          onCheckedChange={(checked) => 
                            setPrivacy({ 
                              ...privacy, 
                              [key]: typeof value === 'boolean' ? checked : (checked ? 'public' : 'private')
                            })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Overseer Dashboard Tab */}
            <TabsContent value="overseer" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">System Health</p>
                        <p className="text-2xl font-bold text-green-400">{overseerData.systemHealth}%</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Users</p>
                        <p className="text-2xl font-bold text-blue-400">{overseerData.activeUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Server Load</p>
                        <p className="text-2xl font-bold text-yellow-400">{overseerData.serverLoad}%</p>
                      </div>
                      <Server className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Error Rate</p>
                        <p className="text-2xl font-bold text-red-400">{overseerData.errorRate}%</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Site Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Real-time status of all AeThex sites and services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {siteStatuses.map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(site.status)}
                          <div>
                            <h4 className="text-white font-medium">{site.name}</h4>
                            <p className="text-sm text-gray-400">{site.url}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={`${getStatusColor(site.status)} text-white border-0`}>
                            {site.status}
                          </Badge>
                          <p className="text-sm text-gray-400 mt-1">{site.responseTime}ms</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Network/Cross-Site Communication Tab */}
            <TabsContent value="network" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Network className="h-5 w-5 mr-2" />
                    Cross-Site Communication
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Monitor data exchange between AeThex network sites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crossSiteData.map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(site.status)}
                          <div>
                            <h4 className="text-white font-medium">{site.siteName}</h4>
                            <p className="text-sm text-gray-400">Last sync: {site.lastSync}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{site.dataExchanged} MB</p>
                          <Badge variant="outline" className={`${getStatusColor(site.status)} text-white border-0 mt-1`}>
                            {site.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wifi className="h-5 w-5 mr-2" />
                    Network Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">Auto-Sync</h4>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-400">Automatically sync data between sites</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">Real-time Updates</h4>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-400">Enable real-time cross-site communication</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">Data Encryption</h4>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-400">Encrypt data during transmission</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">Monitoring Alerts</h4>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-gray-400">Get notified of connection issues</p>
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
