import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface DiagnosticData {
  timestamp: string;
  environment: {
    botTokenSet: boolean;
    clientIdSet: boolean;
    publicKeySet: boolean;
  };
  tokenValidation: {
    length: number;
    format: string;
    preview: string | null;
    minLengthMet: boolean;
  };
  clientIdValidation: {
    value: string | null;
    isNumeric: boolean;
  };
  testRequest: {
    url: string;
    method: string;
    headerFormat: string;
    status: string;
    responseCode?: number;
    error?: string;
  };
  recommendations: string[];
}

export default function AdminDiscordDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/discord/diagnostic`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setDiagnostic(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch diagnostic",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostic();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          Discord Configuration Diagnostic
        </h3>
        <button
          onClick={fetchDiagnostic}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold">Error</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg text-center">
          <p className="text-gray-300">Loading diagnostic...</p>
        </div>
      )}

      {diagnostic && (
        <div className="space-y-6">
          {/* Environment Variables Status */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Environment Variables
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-1">DISCORD_BOT_TOKEN</p>
                <div className="flex items-center gap-2">
                  {diagnostic.environment.botTokenSet ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span
                    className={
                      diagnostic.environment.botTokenSet
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {diagnostic.environment.botTokenSet ? "Set" : "Missing"}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-1">DISCORD_CLIENT_ID</p>
                <div className="flex items-center gap-2">
                  {diagnostic.environment.clientIdSet ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span
                    className={
                      diagnostic.environment.clientIdSet
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {diagnostic.environment.clientIdSet ? "Set" : "Missing"}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-1">DISCORD_PUBLIC_KEY</p>
                <div className="flex items-center gap-2">
                  {diagnostic.environment.publicKeySet ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span
                    className={
                      diagnostic.environment.publicKeySet
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {diagnostic.environment.publicKeySet ? "Set" : "Missing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Validation */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              {diagnostic.tokenValidation.minLengthMet ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              Token Validation
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-2">Token Length</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    {diagnostic.tokenValidation.length} characters
                  </span>
                  <span
                    className={
                      diagnostic.tokenValidation.minLengthMet
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {diagnostic.tokenValidation.minLengthMet
                      ? "✓ Valid"
                      : "✗ Too Short"}
                  </span>
                </div>
              </div>
              {diagnostic.tokenValidation.preview && (
                <div className="p-3 bg-gray-900/50 rounded border border-gray-700/30 font-mono text-xs break-all">
                  <p className="text-gray-400 text-sm mb-2">Token Preview</p>
                  <p className="text-gray-300">
                    {diagnostic.tokenValidation.preview}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* API Test Results */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              {diagnostic.testRequest.status.startsWith("✅") ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : diagnostic.testRequest.status.startsWith("❌") ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              Discord API Test
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-1">Endpoint</p>
                <p className="text-gray-300 text-sm font-mono break-all">
                  {diagnostic.testRequest.url}
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-gray-700/30">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-gray-300">{diagnostic.testRequest.status}</p>
              </div>
              {diagnostic.testRequest.responseCode && (
                <div className="p-3 bg-gray-900/50 rounded border border-gray-700/30">
                  <p className="text-gray-400 text-sm mb-1">Response Code</p>
                  <p
                    className={
                      diagnostic.testRequest.responseCode === 200
                        ? "text-green-400 font-mono"
                        : "text-red-400 font-mono"
                    }
                  >
                    {diagnostic.testRequest.responseCode}
                  </p>
                </div>
              )}
              {diagnostic.testRequest.error && (
                <div className="p-3 bg-red-900/20 rounded border border-red-700/30">
                  <p className="text-red-400 text-sm mb-1">Error</p>
                  <p className="text-red-300 text-sm break-all">
                    {diagnostic.testRequest.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold">Recommendations</h4>
            <div className="space-y-2">
              {diagnostic.recommendations.length === 0 ? (
                <p className="text-green-400">✅ All systems operational!</p>
              ) : (
                diagnostic.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {rec.startsWith("✅") ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                    ) : rec.startsWith("❌") ? (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    )}
                    <p className="text-gray-300 text-sm">{rec}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-500">
            Last updated: {new Date(diagnostic.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
