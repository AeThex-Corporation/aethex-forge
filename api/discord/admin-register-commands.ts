import type { VercelRequest, VercelResponse } from "@vercel/node";
import { REST, Routes } from "discord.js";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a POST request
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic security: Check if requester has admin token
  const authHeader = req.headers.authorization;
  const adminToken = process.env.DISCORD_ADMIN_REGISTER_TOKEN;

  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: "Unauthorized" });
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

  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN!,
    );

    console.log(`📝 Registering ${COMMANDS.length} Discord slash commands...`);

    try {
      // Try bulk update first
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: COMMANDS },
      );

      console.log(`✅ Successfully registered ${data.length} slash commands`);

      return res.status(200).json({
        success: true,
        message: `Registered ${data.length} slash commands`,
        commands: (data as any[]).map((cmd: any) => cmd.name),
      });
    } catch (bulkError: any) {
      // Handle Error 50240 (Entry Point conflict)
      if (bulkError.code === 50240) {
        console.warn(
          "⚠️ Error 50240: Entry Point detected. Registering individually...",
        );

        const results = [];
        let successCount = 0;
        let skipCount = 0;

        for (const command of COMMANDS) {
          try {
            // Try to post individual command
            const posted = await rest.post(
              Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
              { body: command },
            );
            results.push({
              name: command.name,
              status: "registered",
              id: (posted as any).id,
            });
            successCount++;
          } catch (postError: any) {
            // If command already exists (50045), skip it
            if (postError.code === 50045) {
              results.push({
                name: command.name,
                status: "already_exists",
              });
              skipCount++;
            } else {
              results.push({
                name: command.name,
                status: "error",
                error: postError.message,
              });
            }
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

      throw bulkError;
    }
  } catch (error: any) {
    console.error("❌ Failed to register commands:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to register commands",
      code: error?.code,
    });
  }
}
