import type { VercelRequest, VercelResponse } from "@vercel/node";

interface CommandData {
  name: string;
  description: string;
  options?: any[];
}

// Define all commands that should be registered
const COMMANDS: CommandData[] = [
  {
    name: "verify",
    description: "Link your Discord account to AeThex",
  },
  {
    name: "set-realm",
    description: "Choose your primary arm/realm (Labs, GameForge, Corp, etc.)",
    options: [
      {
        name: "realm",
        type: 3,
        description: "Your primary realm",
        required: true,
        choices: [
          { name: "Labs", value: "labs" },
          { name: "GameForge", value: "gameforge" },
          { name: "Corp", value: "corp" },
          { name: "Foundation", value: "foundation" },
          { name: "Dev-Link", value: "devlink" },
        ],
      },
    ],
  },
  {
    name: "profile",
    description: "View your linked AeThex profile",
  },
  {
    name: "unlink",
    description: "Disconnect your Discord account from AeThex",
  },
  {
    name: "verify-role",
    description: "Check your assigned Discord roles",
  },
];

const DISCORD_API_VERSION = "10";
const DISCORD_API_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Allow both GET and POST
    if (req.method !== "POST" && req.method !== "GET") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Basic security: Check if requester has admin token
    const authHeader = req.headers.authorization;
    const queryToken = req.query.token;
    const adminToken = process.env.DISCORD_ADMIN_REGISTER_TOKEN;

    const providedToken = authHeader
      ? authHeader.replace("Bearer ", "")
      : queryToken;

    if (!adminToken || providedToken !== adminToken) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Validate environment variables
    const requiredVars = ["DISCORD_BOT_TOKEN", "DISCORD_CLIENT_ID"];
    const missingVars = requiredVars.filter((v) => !process.env[v]);

    if (missingVars.length > 0) {
      return res.status(500).json({
        error: "Missing environment variables",
        missing: missingVars,
      });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN!;
    const clientId = process.env.DISCORD_CLIENT_ID!;
    const authorizationHeader = `Bot ${botToken}`;

    console.log(`📝 Registering ${COMMANDS.length} Discord slash commands...`);

    // Try bulk update first
    try {
      const bulkResponse = await fetch(
        `${DISCORD_API_URL}/applications/${clientId}/commands`,
        {
          method: "PUT",
          headers: {
            Authorization: authorizationHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(COMMANDS),
        },
      );

      if (bulkResponse.ok) {
        const data = (await bulkResponse.json()) as any[];
        console.log(`✅ Successfully registered ${data.length} slash commands`);

        return res.status(200).json({
          success: true,
          message: `Registered ${data.length} slash commands`,
          commands: (data as any[]).map((cmd: any) => cmd.name),
        });
      }

      // If bulk update failed, try individual registration
      const errorData = (await bulkResponse.json()) as any;
      const errorCode = errorData?.code;

      if (errorCode === 50240) {
        // Error 50240: Entry Point conflict (Discord Activity enabled)
        console.warn(
          "⚠️ Error 50240: Entry Point detected. Registering individually...",
        );

        const results = [];
        let successCount = 0;
        let skipCount = 0;

        for (const command of COMMANDS) {
          try {
            const postResponse = await fetch(
              `${DISCORD_API_URL}/applications/${clientId}/commands`,
              {
                method: "POST",
                headers: {
                  Authorization: authorizationHeader,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(command),
              },
            );

            if (postResponse.ok) {
              const posted = await postResponse.json();
              results.push({
                name: command.name,
                status: "registered",
                id: posted.id,
              });
              successCount++;
            } else if (postResponse.status === 400) {
              // Error 50045: Command already exists
              results.push({
                name: command.name,
                status: "already_exists",
              });
              skipCount++;
            } else {
              const errData = await postResponse.json();
              results.push({
                name: command.name,
                status: "error",
                error: errData.message || `HTTP ${postResponse.status}`,
              });
            }
          } catch (postError: any) {
            results.push({
              name: command.name,
              status: "error",
              error: postError.message,
            });
          }
        }

        console.log(
          `✅ Registration complete: ${successCount} new, ${skipCount} already existed`,
        );

        return res.status(200).json({
          success: true,
          message: `Registered ${successCount} new commands (${skipCount} already existed)`,
          results,
          note: "Entry Point command is managed by Discord (Activities enabled)",
        });
      }

      throw new Error(
        `Discord API error: ${errorData?.message || bulkResponse.statusText}`,
      );
    } catch (error: any) {
      console.error("❌ Failed to register commands:", error);

      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to register commands",
      });
    }
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}
