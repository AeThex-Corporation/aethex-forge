import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Copy } from "lucide-react";
import { useState } from "react";

export default function AdminStaffDocs() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const internalDocs = [
    {
      title: "API Documentation",
      description: "Internal API endpoints for staff operations",
      content: "/api/staff/members\n/api/staff/users\n/api/moderation/reports",
    },
    {
      title: "Security Protocols",
      description: "Internal security guidelines and best practices",
      content:
        "Two-factor authentication required\nSession timeout: 24 hours\nAudit logging enabled",
    },
    {
      title: "Operational Procedures",
      description: "Day-to-day operational workflows",
      content:
        "Daily standup: 10 AM UTC\nWeekly review: Friday 2 PM UTC\nIncident response: 15 min SLA",
    },
  ];

  const apiKeys = [
    {
      id: "api-key-1",
      name: "Staff Portal API Key",
      lastRotated: "2024-01-15",
      status: "Active",
      masked: "sk_live_****...****abcd",
    },
    {
      id: "api-key-2",
      name: "Moderation API Key",
      lastRotated: "2024-01-10",
      status: "Active",
      masked: "sk_live_****...****wxyz",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Staff Documentation</h2>
        <p className="text-muted-foreground">
          Internal documentation, API keys, and security credentials
        </p>
      </div>

      <div className="grid gap-4">
        {internalDocs.map((doc) => (
          <Card key={doc.title}>
            <CardHeader>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {doc.content}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            <CardTitle className="text-lg">API Keys & Credentials</CardTitle>
          </div>
          <CardDescription>
            Manage sensitive credentials with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 border border-border rounded-lg bg-background/40 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last rotated: {key.lastRotated}
                  </p>
                  <p className="text-sm font-mono text-slate-400 mt-2">
                    {key.masked}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="bg-green-500/10">
                    {key.status}
                  </Badge>
                  <button
                    onClick={() => handleCopy(key.masked, key.id)}
                    className="p-2 hover:bg-slate-700 rounded transition"
                    title="Copy key"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
        <CardHeader>
          <CardTitle className="text-yellow-900 dark:text-yellow-100">
            ⚠️ Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800 dark:text-yellow-200">
          <ul className="list-disc list-inside space-y-1">
            <li>Never share API keys in public channels</li>
            <li>Rotate credentials every 90 days</li>
            <li>Report compromised credentials immediately</li>
            <li>Use VPN when accessing sensitive endpoints</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
