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
      console.error("Signature verification failed:", error);
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Check if recovered address matches provided address
    if (recoveredAddress !== normalizedAddress) {
      return res.status(401).json({ error: "Signature does not match wallet" });
    }

    // Verify nonce exists and is not expired
    const { data: nonceData, error: nonceError } = await supabase
      .from("web3_nonces")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .eq("nonce", nonce)
      .single();

    if (nonceError || !nonceData) {
      return res.status(401).json({ error: "Invalid or expired nonce" });
    }

    const expiresAt = new Date(nonceData.expires_at);
    if (expiresAt < new Date()) {
      return res.status(401).json({ error: "Nonce has expired" });
    }

    // Mark nonce as used
    await supabase
      .from("web3_nonces")
      .update({ used_at: new Date().toISOString() })
      .eq("nonce", nonce);

    // Check if user already exists with this wallet
    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("id, auth_id")
      .eq("wallet_address", normalizedAddress)
      .single();

    if (existingUser) {
      // User exists, link to their account
      return res.status(200).json({
        success: true,
        existing_user: true,
        user_id: existingUser.id,
      });
    }

    // Create new Web3 user
    const email = `${normalizedAddress.substring(2)}@web3.aethex.dev`;
    const username = normalizedAddress.substring(2, 10);

    // Create Supabase auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: require("crypto").randomBytes(32).toString("hex"),
        email_confirm: true,
        user_metadata: {
          wallet_address: normalizedAddress,
          auth_method: "web3",
        },
      });

    if (authError || !authData.user) {
      console.error("Failed to create auth user:", authError);
      return res.status(500).json({ error: "Failed to create account" });
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        auth_id: authData.user.id,
        email,
        username,
        wallet_address: normalizedAddress,
        user_type: "game_developer",
        full_name: `Web3 User ${username}`,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
      return res.status(500).json({ error: "Failed to create user profile" });
    }

    return res.status(200).json({
      success: true,
      user_id: profileData.id,
      email,
      username,
      wallet_address: normalizedAddress,
    });
  } catch (error: any) {
    console.error("Web3 verification error:", error);
    return res.status(500).json({
      error: error?.message || "Verification failed",
    });
  }
}
