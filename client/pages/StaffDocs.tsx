import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Key,
  Shield,
  AlertTriangle,
  Copy,
  ExternalLink,
} from "lucide-react";

const DOCS = [
  {
    id: 1,
    title: "Getting Started",
    description: "Onboarding guide for new staff members",
    category: "Onboarding",
    link: "/internal-docs",
  },
  {
    id: 2,
    title: "Code of Conduct",
    description: "AeThex team values and expectations",
    category: "Policy",
    link: "/internal-docs/code-of-conduct",
  },
  {
    id: 3,
    title: "Communication Guidelines",
    description: "How we communicate across the team",
    category: "Process",
    link: "/internal-docs/communication",
  },
  {
    id: 4,
    title: "Tech Stack",
    description: "Tools and technologies we use",
    category: "Technical",
    link: "/internal-docs/tech-stack",
  },
];

const API_CREDENTIALS = [
  {
    id: 1,
    name: "Discord Bot Token",
    value: "NTc4OTcx****...****",
    description: "Bot authentication token for Discord integration",
  },
  {
    id: 2,
    name: "Supabase Service Role",
    value: "eyJhbGc****...****",
    description: "Admin access to Supabase database",
  },
  {
    id: 3,
    name: "API Key",
    value: "aethex_sk_****...****",
    description: "Main API authentication",
  },
];

export default function StaffDocs() {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Staff Documentation
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Internal resources and guides
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

          {/* Security Notice */}
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="ml-2 text-red-600">
              This section contains sensitive information. Do not share
              credentials or secrets outside of this portal.
            </AlertDescription>
          </Alert>

          {/* Documentation Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCS.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => navigate(doc.link)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <Badge variant="outline" className="border-purple-500/30">
                        {doc.category}
                      </Badge>
                    </div>
                    <h3 className="text-white font-bold mb-2">{doc.title}</h3>
                    <p className="text-gray-400 text-sm">{doc.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* API Credentials Section */}
          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Shield className="w-5 h-5" />
                API Credentials
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">
                Sensitive credentials are hidden. Click copy to reveal
                temporarily.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {API_CREDENTIALS.map((cred) => (
                <div
                  key={cred.id}
                  className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{cred.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {cred.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(cred.id, cred.value)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {copiedId === cred.id ? (
                        <span className="text-xs">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm font-mono">
                    {cred.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate("/internal-docs")}
                variant="outline"
                className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                All Docs
              </Button>
              <Button
                onClick={() => navigate("/staff/admin")}
                variant="outline"
                className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              >
                <Key className="w-4 h-4 mr-2" />
                API Management
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="h-12 border-purple-500/30 hover:bg-purple-500/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
