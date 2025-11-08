import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { aethexToast } from "@/lib/aethex-toast";

export interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            const chainIdHex = await (window as any).ethereum.request({
              method: "eth_chainId",
            });
            setChainId(parseInt(chainIdHex, 16));
          }
        } catch (error) {
          console.warn("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      aethexToast.error({
        title: "Metamask not installed",
        description: "Please install Metamask to connect your wallet",
      });
      throw new Error("Ethereum provider not found");
    }

    setIsConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No account selected");
      }

      setAccount(accounts[0]);
      setIsConnected(true);

      // Get chain ID
      const chainIdHex = await (window as any).ethereum.request({
        method: "eth_chainId",
      });
      setChainId(parseInt(chainIdHex, 16));

      aethexToast.success({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      aethexToast.error({
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet",
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    aethexToast.info({
      title: "Wallet disconnected",
      description: "You have been disconnected from your wallet",
    });
  }, []);

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (
        !account ||
        typeof window === "undefined" ||
        !(window as any).ethereum
      ) {
        throw new Error("Wallet not connected");
      }

      try {
        const signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [message, account],
        });
        return signature;
      } catch (error: any) {
        console.error("Message signing error:", error);
        aethexToast.error({
          title: "Signing failed",
          description: error?.message || "Failed to sign message",
        });
        throw error;
      }
    },
    [account],
  );

  // Listen for account changes
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
    (window as any).ethereum.on("chainChanged", handleChainChanged);

    return () => {
      (window as any).ethereum?.removeListener(
        "accountsChanged",
        handleAccountsChanged,
      );
      (window as any).ethereum?.removeListener(
        "chainChanged",
        handleChainChanged,
      );
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        chainId,
        connectWallet,
        disconnectWallet,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
