import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Key, Database, Code2, ExternalLink } from "lucide-react";

export default function StaffDocs() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <Layout><div className="container py-20">Loading...</div></Layout>;

  const docs = [
    {
      icon: FileText,
      title: "Getting Started",
      description: "Onboarding guide and platform overview",
      link: "#",
    },
    {
      icon: Code2,
      title: "API Reference",
      description: "Complete API documentation and endpoints",
      link: "#",
    },
    {
      icon: Database,
      title: "Database Schema",
      description: "Database structure and relationships",
      link: "#",
    },
    {
      icon: Key,
      title: "Authentication",
      description: "OAuth, tokens, and security guidelines",
      link: "#",
    },
  ];

  const apiKeys = [
    { name: "Public API Key", key: "pk_aethex_...", status: "active" },
    { name: "Secret API Key", key: "sk_aethex_...", status: "active" },
    { name: "Webhook Secret", key: "whk_aethex_...", status: "active" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Documentation & API</h1>
            <p className="text-slate-400">Internal docs, API keys, and credentials</p>
          </div>

          {/* Documentation */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {docs.map((doc, idx) => {
                const IconComponent = doc.icon;
                return (
                  <Card
                    key={idx}
                    className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded bg-blue-500/20">
                            <IconComponent className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{doc.title}</CardTitle>
                            <CardDescription className="text-slate-400">
                              {doc.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
                        Read Docs <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* API Keys */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">API Keys</h2>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                Keep secure
              </Badge>
            </div>
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {apiKeys.map((key, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded border border-slate-700/50 bg-slate-800/30"
                    >
                      <div>
                        <p className="text-white font-medium">{key.name}</p>
                        <p className="text-slate-400 text-sm font-mono">{key.key}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/50 capitalize">
                          {key.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Generate New Key
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="border-red-500/30 bg-red-500/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-red-300">🔐 Security Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-red-200/80 space-y-2">
              <p>• Never share API keys in public channels or repositories</p>
              <p>• Rotate keys regularly for security</p>
              <p>• Use secrets management for production deployments</p>
              <p>• Report compromised keys immediately</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
