import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Copy, Unlink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface WalletVerificationProps {
  onWalletUpdated?: (walletAddress: string | null) => void;
}

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const formatWalletAddress = (address: string): string => {
  if (!isValidEthereumAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletVerification = ({
  onWalletUpdated,
}: WalletVerificationProps) => {
  const { user, profile } = useAuth();
  const [walletInput, setWalletInput] = useState("");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Initialize with existing wallet address if available
    if (profile?.wallet_address) {
      setConnectedWallet(profile.wallet_address);
    }
  }, [profile?.wallet_address]);

  const handleConnect = async () => {
    if (!walletInput.trim()) {
      aethexToast.warning("Please enter a wallet address");
      return;
    }

    const normalized = walletInput.trim().toLowerCase();
    if (!isValidEthereumAddress(normalized)) {
      aethexToast.warning(
        "Invalid Ethereum address. Must be 0x followed by 40 hexadecimal characters.",
      );
      return;
    }

    if (!user?.id) {
      aethexToast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/wallet-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          wallet_address: normalized,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to connect wallet`,
        );
      }

      const data = await response.json();
      setConnectedWallet(normalized);
      setWalletInput("");
      aethexToast.success("✅ Wallet connected successfully!");

      if (onWalletUpdated) {
        onWalletUpdated(normalized);
      }
    } catch (error: any) {
      console.error("[Wallet Verification] Error:", error?.message);
      aethexToast.error(
        error?.message || "Failed to connect wallet. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user?.id || !connectedWallet) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/wallet-verify`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to disconnect wallet`,
        );
      }

      setConnectedWallet(null);
      aethexToast.success("Wallet disconnected");

      if (onWalletUpdated) {
        onWalletUpdated(null);
      }
    } catch (error: any) {
      console.error("[Wallet Verification] Error:", error?.message);
      aethexToast.error(
        error?.message || "Failed to disconnect wallet. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card className="border-border/40 bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔐 Wallet Verification</span>
          {connectedWallet && (
            <Badge
              variant="outline"
              className="ml-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Connect your Ethereum wallet to enable Web3 identity verification.
          This wallet address will be used to verify ownership of your{" "}
          <code className="rounded bg-slate-800 px-1 text-xs">.aethex</code> TLD
          once the Axiom Protocol is live.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {connectedWallet ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Connected Wallet
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-slate-800 px-3 py-2 text-sm font-mono text-emerald-300">
                  {formatWalletAddress(connectedWallet)}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAddress}
                  className="border-border/60"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {isCopied && (
                <p className="mt-2 text-xs text-emerald-300">
                  ✓ Copied to clipboard
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-lg border border-slate-500/20 bg-slate-500/5 p-4">
              <h4 className="text-sm font-semibold text-foreground">
                What's this for?
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>
                  ✓ Proves you're the owner of this wallet (Web3 identity)
                </li>
                <li>
                  ✓ Will unlock your{" "}
                  <code className="text-aethex-300">.aethex</code> TLD
                  verification when the Protocol launches
                </li>
                <li>✓ No smart contracts or gas fees required right now</li>
                <li>
                  ✓ Your wallet address is private and only visible to you
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isLoading}
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Unlink className="mr-2 h-4 w-4" />
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-500/20 bg-slate-500/5 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">No wallet connected yet.</p>
                  <p className="mt-1">
                    Enter your Ethereum wallet address below to verify your
                    identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="wallet-address" className="text-sm font-medium">
                  Ethereum Wallet Address
                </Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  disabled={isLoading}
                  className="mt-2 font-mono text-sm"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Format: 0x followed by 40 hexadecimal characters
                </p>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isLoading || !walletInput.trim()}
                className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="font-semibold">💡 How it works:</p>
              <ol className="mt-1 space-y-1 pl-4">
                <li>1. Enter your wallet address</li>
                <li>2. We save it securely to your profile</li>
                <li>
                  3. When Phase 2 launches, we'll verify you own the .aethex TLD
                  registered to this wallet
                </li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletVerification;
