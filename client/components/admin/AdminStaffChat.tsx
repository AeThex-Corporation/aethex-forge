import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users, Hash } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  members: number;
  icon?: string;
}

export default function AdminStaffChat() {
  const [selectedChannel, setSelectedChannel] = useState<string>("general");
  const [messageInput, setMessageInput] = useState("");

  const channels: Channel[] = [
    {
      id: "general",
      name: "general",
      description: "General team discussion",
      members: 12,
    },
    {
      id: "announcements",
      name: "announcements",
      description: "Important team announcements",
      members: 12,
    },
    {
      id: "engineering",
      name: "engineering",
      description: "Engineering team discussion",
      members: 5,
    },
    {
      id: "community",
      name: "community",
      description: "Community management team",
      members: 3,
    },
  ];

  const messages: Record<string, Message[]> = {
    general: [
      {
        id: "1",
        author: "Alex Chen",
        content:
          "Good morning everyone! Starting weekly standup in 10 minutes.",
        timestamp: "09:50",
      },
      {
        id: "2",
        author: "Jordan Martinez",
        content: "Ready! Just finishing up the API deployment.",
        timestamp: "09:55",
      },
      {
        id: "3",
        author: "Sam Patel",
        content: "Community dashboard is live! 🎉",
        timestamp: "10:02",
      },
      {
        id: "4",
        author: "Taylor Kim",
        content: "Great progress this week!",
        timestamp: "10:05",
      },
    ],
    announcements: [
      {
        id: "1",
        author: "Alex Chen",
        content: "Q1 roadmap has been published on the wiki.",
        timestamp: "2024-01-15 14:30",
      },
      {
        id: "2",
        author: "Jordan Martinez",
        content: "Version 2.0 will be released next week.",
        timestamp: "2024-01-12 11:20",
      },
    ],
    engineering: [
      {
        id: "1",
        author: "Jordan Martinez",
        content: "API performance improvements merged to main.",
        timestamp: "10:15",
      },
    ],
    community: [
      {
        id: "1",
        author: "Sam Patel",
        content: "Community event next Friday at 3 PM UTC",
        timestamp: "09:30",
      },
    ],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send to the backend
    console.log(`Message sent to #${selectedChannel}: ${messageInput}`);
    setMessageInput("");
  };

  const currentMessages = messages[selectedChannel] || [];
  const currentChannel = channels.find((c) => c.id === selectedChannel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
      {/* Channels sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full text-left p-3 rounded-lg transition ${
                selectedChannel === channel.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 font-medium"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>{channel.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {channel.members} members
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Main chat area */}
      <Card className="lg:col-span-3 flex flex-col">
        {/* Header */}
        <CardHeader className="border-b pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                {currentChannel?.name}
              </CardTitle>
              <CardDescription className="mt-1">
                {currentChannel?.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {currentChannel?.members}
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 p-2 rounded"
            >
              <div className="w-8 h-8 bg-blue-200 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-bold text-blue-900 dark:text-blue-200 flex-shrink-0">
                {msg.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">{msg.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm mt-1">{msg.content}</p>
              </div>
            </div>
          ))}
        </CardContent>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              placeholder={`Message #${currentChannel?.name}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
