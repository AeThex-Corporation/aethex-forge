import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import LoadingScreen from "@/components/LoadingScreen";

export default function Web3Callback() {
  const navigate = useNavigate();
  const { account, signMessage } = useWeb3();
  const { user, loading: authLoading } = useAuth();
  const { error: toastError, success: toastSuccess } = useAethexToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleWeb3Auth = async () => {
      if (!account || authLoading) return;

      setIsProcessing(true);
      try {
        // Generate a nonce from the backend
        const nonceResponse = await fetch(`${API_BASE}/api/web3/nonce`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet_address: account }),
        });

        if (!nonceResponse.ok) {
          throw new Error("Failed to generate nonce");
        }

        const { nonce } = await nonceResponse.json();

        // Create message to sign
        const message = `Sign this message to authenticate with AeThex\n\nWallet: ${account}\nNonce: ${nonce}`;

        // Request signature
        const signature = await signMessage(message);

        // Verify signature on backend and create/link account
        const verifyResponse = await fetch(`${API_BASE}/api/web3/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: account,
            signature,
            message,
            nonce,
          }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.error || "Verification failed");
        }

        const data = await verifyResponse.json();

        // If user is already authenticated, link the wallet
        if (user && data.success) {
          toastSuccess({
            title: "Wallet linked",
            description:
              "Your Ethereum wallet is now connected to your account",
          });
          navigate("/dashboard?tab=connections");
          return;
        }

        // Otherwise, create account and sign in
        if (data.auth_token) {
          // Backend will handle session creation
          toastSuccess({
            title: "Web3 authentication successful",
            description: "Redirecting to dashboard...",
          });
          navigate("/dashboard");
          return;
        }

        navigate("/onboarding?web3_wallet=" + account);
      } catch (error: any) {
        console.error("Web3 auth error:", error);
        toastError({
          title: "Web3 authentication failed",
          description: error?.message || "Could not authenticate with wallet",
        });
        navigate("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    if (account && !authLoading) {
      handleWeb3Auth();
    }
  }, [
    account,
    authLoading,
    signMessage,
    user,
    navigate,
    toastError,
    toastSuccess,
  ]);

  return (
    <LoadingScreen
      message={
        isProcessing ? "Verifying your wallet..." : "Connecting wallet..."
      }
      showProgress={true}
      duration={5000}
    />
  );
}
