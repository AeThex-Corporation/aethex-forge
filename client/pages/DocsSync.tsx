import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2, BookOpen } from "lucide-react";

interface SyncResult {
  page: string;
  status: "success" | "failed";
  error?: string;
}

interface SyncResponse {
  message: string;
  successful: number;
  failed: number;
  results: SyncResult[];
}

export default function DocsSync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/sync-docs-gitbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: SyncResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">
                Documentation Sync
              </h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl">
              Sync your AeThex documentation to Gitbook. Click the button below
              to push all 9 documentation pages to your Gitbook workspace.
            </p>
          </div>

          {/* Sync Card */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                Sync Documentation to Gitbook
              </CardTitle>
              <CardDescription className="text-gray-400">
                This will push all 9 documentation pages to your Gitbook
                workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Pages to Sync</p>
                  <p className="text-2xl font-bold text-white">9</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Workspace</p>
                  <p className="text-2xl font-bold text-white">AeThex Docs</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Target</p>
                  <p className="text-2xl font-bold text-white">Gitbook</p>
                </div>
              </div>

              {/* Sync Button */}
              <Button
                onClick={handleSync}
                disabled={loading}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5 mr-2" />
                    Sync to Gitbook
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="bg-red-900/20 border-red-500/40 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-200 font-semibold">Sync Failed</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card
              className={`${result.failed === 0 ? "bg-emerald-900/20 border-emerald-500/40" : "bg-slate-800/50 border-slate-700"} mb-8`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Sync Results</CardTitle>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Successful</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {result.successful}
                      </p>
                    </div>
                    {result.failed > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Failed</p>
                        <p className="text-2xl font-bold text-red-400">
                          {result.failed}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.results.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "success" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        )}
                        <span className="text-white">{item.page}</span>
                      </div>
                      <Badge
                        className={
                          item.status === "success"
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-red-500/20 text-red-200"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {result.failed === 0 && (
                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg">
                    <p className="text-emerald-200 text-sm">
                      ✅ All documentation successfully synced to Gitbook! Your
                      docs are now available at https://docs.aethex.tech
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-white mb-2">Before syncing:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>
                    Verify Vercel environment variables are set:
                    <code className="bg-black/40 px-2 py-1 rounded text-purple-200 ml-2">
                      GITBOOK_API_TOKEN
                    </code>
                    and
                    <code className="bg-black/40 px-2 py-1 rounded text-purple-200 ml-2">
                      GITBOOK_SPACE_ID
                    </code>
                  </li>
                  <li>Ensure your Gitbook workspace "AeThex Docs" is ready</li>
                  <li>
                    Have pages created in Gitbook (Overview, Getting Started,
                    etc.)
                  </li>
                </ol>
              </div>

              <div>
                <p className="font-semibold text-white mb-2">After syncing:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Verify content appears in Gitbook</li>
                  <li>Update internal links to point to Gitbook URLs</li>
                  <li>Keep local /docs routes as fallback during transition</li>
                  <li>Monitor analytics to track usage migration</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
