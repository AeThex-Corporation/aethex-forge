import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Hash, Lock, Plus } from "lucide-react";

const channels = [
  {
    name: "announcements",
    description: "Company announcements and updates",
    type: "public",
    members: 45,
  },
  {
    name: "engineering",
    description: "Engineering team discussions",
    type: "private",
    members: 12,
  },
  {
    name: "product",
    description: "Product and feature discussions",
    type: "public",
    members: 28,
  },
  {
    name: "design",
    description: "Design and UX team",
    type: "private",
    members: 8,
  },
  {
    name: "random",
    description: "Off-topic and casual chat",
    type: "public",
    members: 42,
  },
];

const directMessages = [
  { name: "Sarah Johnson", role: "CEO", status: "online" },
  { name: "Mike Chen", role: "CTO", status: "online" },
  { name: "Emma Davis", role: "Product Lead", status: "away" },
  { name: "Alex Kim", role: "Designer", status: "offline" },
];

export default function StaffChat() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <Layout><div className="container py-20">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Team Chat</h1>
            <p className="text-slate-400">Internal collaboration and team discussions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Channels */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Hash className="h-5 w-5 text-slate-400" />
                    Channels
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <Button
                      key={channel.name}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      {channel.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* DMs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    Direct Messages
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {directMessages.map((dm) => (
                    <Button
                      key={dm.name}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="truncate">{dm.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Channel Info */}
              <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Hash className="h-5 w-5" />
                        announcements
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Company announcements and updates
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      45 members
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Messages Area */}
              <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur h-96 flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">Sarah Johnson</p>
                      <p className="text-slate-300 text-sm mt-1">
                        Welcome to the internal team chat! This is where we collaborate and share updates.
                      </p>
                      <p className="text-xs text-slate-500 mt-2">10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">Mike Chen</p>
                      <p className="text-slate-300 text-sm mt-1">
                        Great! Looking forward to building amazing things together.
                      </p>
                      <p className="text-xs text-slate-500 mt-2">10:35 AM</p>
                    </div>
                  </div>
                </CardContent>

                <div className="border-t border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700">Send</Button>
                  </div>
                </div>
              </Card>

              {/* Info */}
              <Card className="border-blue-500/30 bg-blue-500/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Chat Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-200/80 space-y-2">
                  <p>
                    • Full-featured internal messaging platform
                  </p>
                  <p>
                    • Channels for teams and projects
                  </p>
                  <p>
                    • Direct messages and group chats
                  </p>
                  <p>
                    • File sharing and integrations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
