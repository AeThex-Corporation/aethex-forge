import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, ExternalLink, Hash, Lock } from "lucide-react";

const CHANNELS = [
  { id: 1, name: "general", type: "public", members: 12, unread: 3 },
  { id: 2, name: "engineering", type: "public", members: 8, unread: 0 },
  { id: 3, name: "operations", type: "public", members: 5, unread: 1 },
  { id: 4, name: "announcements", type: "locked", members: 15, unread: 2 },
];

const MESSAGES = [
  {
    id: 1,
    author: "John Founder",
    content: "Welcome to the AeThex staff chat!",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    author: "Sarah Dev",
    content: "Great to have everyone here",
    timestamp: "10:32 AM",
    isOwn: false,
  },
  {
    id: 3,
    author: "You",
    content: "Looking forward to collaborating",
    timestamp: "10:35 AM",
    isOwn: true,
  },
];

export default function StaffChat() {
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Staff Chat</h1>
              <p className="text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Internal team communication
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Channels Sidebar */}
            <Card className="bg-slate-900/50 border-purple-500/20 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedChannel.id === channel.id
                        ? "bg-purple-600/30 border border-purple-500/50"
                        : "hover:bg-purple-600/10 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {channel.type === "locked" ? (
                        <Lock className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Hash className="w-4 h-4 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          #{channel.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {channel.members} members
                        </p>
                      </div>
                      {channel.unread > 0 && (
                        <Badge className="bg-red-500/20 text-red-300">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="bg-slate-900/50 border-purple-500/20 lg:col-span-3 flex flex-col">
              {/* Channel Header */}
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedChannel.type === "locked" ? (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Hash className="w-4 h-4 text-gray-400" />
                  )}
                  {selectedChannel.name}
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto py-6 space-y-4">
                {MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? "bg-purple-600/30 text-white"
                          : "bg-slate-800/50 text-gray-300"
                      }`}
                    >
                      {!msg.isOwn && (
                        <p className="text-sm font-semibold text-gray-300">
                          {msg.author}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t border-purple-500/20 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
