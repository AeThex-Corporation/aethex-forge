import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function Link() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setError("Please enter a valid 6-character code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/verify-device-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to link device");
      }

      setSuccess(true);
      setCode("");
    } catch (err: any) {
      setError(err.message || "Failed to link device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/95 border-purple-500/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Link2 className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Link Your Device</CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Enter the 6-character code displayed in your game or app
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {success ? (
            <Alert className="bg-green-950/50 border-green-500/50">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Device linked successfully! You can now return to your game.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-gray-300">
                    Device Code
                  </label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-600"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <Alert className="bg-red-950/50 border-red-500/50">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    "Link Device"
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-700">
                <div className="space-y-3 text-sm text-gray-400">
                  <p className="font-semibold text-gray-300">Where to find your code:</p>
                  <ul className="space-y-2 pl-4">
                    <li>• <strong className="text-white">VRChat:</strong> Check the in-world AeThex panel</li>
                    <li>• <strong className="text-white">RecRoom:</strong> Look for the code display board</li>
                    <li>• <strong className="text-white">Other Games:</strong> Check your authentication menu</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
