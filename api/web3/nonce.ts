import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

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
    const { wallet_address } = req.body;

    if (!wallet_address || !wallet_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const normalizedAddress = wallet_address.toLowerCase();

    // Generate a random nonce
    const nonce = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store nonce in database
    const { error } = await supabase.from("web3_nonces").insert({
      wallet_address: normalizedAddress,
      nonce,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to store nonce:", error);
      return res.status(500).json({ error: "Failed to generate nonce" });
    }

    return res.status(200).json({ nonce });
  } catch (error: any) {
    console.error("Nonce generation error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate nonce",
    });
  }
}
