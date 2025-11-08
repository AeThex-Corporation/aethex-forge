import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyMessage } from "ethers";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data: userData, error: authError } =
      await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { wallet_address, signature, message, nonce } = req.body;

    if (!wallet_address || !signature || !message || !nonce) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedAddress = wallet_address.toLowerCase();

    // Verify the signature
    let recoveredAddress: string;
    try {
      recoveredAddress = verifyMessage(message, signature).toLowerCase();
    } catch (error) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    if (recoveredAddress !== normalizedAddress) {
      return res.status(401).json({ error: "Signature does not match wallet" });
    }

    // Verify nonce
    const { data: nonceData, error: nonceError } = await supabase
      .from("web3_nonces")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .eq("nonce", nonce)
      .single();

    if (nonceError || !nonceData) {
      return res.status(401).json({ error: "Invalid or expired nonce" });
    }

    // Mark nonce as used
    await supabase
      .from("web3_nonces")
      .update({ used_at: new Date().toISOString() })
      .eq("nonce", nonce);

    // Link wallet to existing user
    const { error: linkError } = await supabase.from("web3_wallets").insert({
      user_id: userData.user.id,
      wallet_address: normalizedAddress,
      chain_id: 1, // Ethereum mainnet
    });

    if (
      linkError &&
      !linkError.message.includes("violates unique constraint")
    ) {
      console.error("Failed to link wallet:", linkError);
      return res.status(500).json({ error: "Failed to link wallet" });
    }

    // Also update user_profiles wallet_address column if available
    await supabase
      .from("user_profiles")
      .update({ wallet_address: normalizedAddress })
      .eq("auth_id", userData.user.id);

    return res.status(200).json({
      success: true,
      message: "Web3 wallet linked successfully",
      wallet_address: normalizedAddress,
    });
  } catch (error: any) {
    console.error("Link Web3 error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to link wallet",
    });
  }
}
