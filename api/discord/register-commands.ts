import { VercelRequest, VercelResponse } from "@vercel/node";

const DISCORD_API_BASE = "https://discord.com/api/v10";

const commands = [
  {
    name: "creators",
    description: "Browse AeThex creators across all arms",
    type: 1,
    options: [
      {
        name: "arm",
        description: "Filter creators by arm",
        type: 3,
        required: false,
        choices: [
          { name: "Labs", value: "labs" },
          { name: "GameForge", value: "gameforge" },
          { name: "Corp", value: "corp" },
          { name: "Foundation", value: "foundation" },
          { name: "Nexus", value: "nexus" },
        ],
      },
    ],
  },
  {
    name: "opportunities",
    description: "Find job opportunities and collaborations on Nexus",
    type: 1,
    options: [
      {
        name: "arm",
        description: "Filter opportunities by arm",
        type: 3,
        required: false,
        choices: [
          { name: "Labs", value: "labs" },
          { name: "GameForge", value: "gameforge" },
          { name: "Corp", value: "corp" },
          { name: "Foundation", value: "foundation" },
          { name: "Nexus", value: "nexus" },
        ],
      },
    ],
  },
  {
    name: "nexus",
    description: "Explore the AeThex Talent Marketplace",
    type: 1,
  },
  {
    name: "help",
    description: "Get help about AeThex Discord commands",
    type: 1,
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify auth token to prevent unauthorized registration
  const authToken = req.query.token as string;
  if (authToken !== process.env.DISCORD_REGISTER_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!botToken || !clientId) {
    return res.status(400).json({
      error: "Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID env variables",
    });
  }

  try {
    console.log("[Discord] Registering slash commands...");

    const response = await fetch(
      `${DISCORD_API_BASE}/applications/${clientId}/commands`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      console.error("[Discord] Registration error:", errorData);
      return res.status(response.status).json({
        error: "Failed to register commands",
        details: errorData,
      });
    }

    const data = (await response.json()) as any[];
    console.log("[Discord] Successfully registered commands:", data);

    return res.status(200).json({
      success: true,
      message: "Successfully registered 3 slash commands",
      commands: data.map((cmd: any) => ({
        name: cmd.name,
        description: cmd.description,
      })),
    });
  } catch (error: any) {
    console.error("[Discord] Registration endpoint error:", error);
    return res.status(500).json({
      error: "Server error during command registration",
      message: error.message,
    });
  }
}
