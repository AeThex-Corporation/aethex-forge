/**
 * Register Discord Slash Commands
 * Run this script once to register all slash commands with Discord
 *
 * Usage:
 * npx ts-node scripts/register-discord-commands.ts
 *
 * Required Environment Variables:
 * - DISCORD_BOT_TOKEN: Bot token from Discord Developer Portal
 * - DISCORD_CLIENT_ID: Application ID from Discord Developer Portal
 */

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "578971245454950421";
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
  console.error("❌ DISCORD_BOT_TOKEN environment variable is required");
  process.exit(1);
}

const commands = [
  {
    name: "creators",
    description: "Browse AeThex creators across all arms",
    options: [
      {
        name: "arm",
        description:
          "Filter by specific arm (labs, gameforge, corp, foundation, nexus)",
        type: 3, // STRING
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
    options: [
      {
        name: "arm",
        description:
          "Filter by specific arm (labs, gameforge, corp, foundation, nexus)",
        type: 3, // STRING
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
    options: [],
  },
];

async function registerCommands() {
  console.log(`📝 Registering ${commands.length} slash commands...`);
  console.log(`🔧 Client ID: ${DISCORD_CLIENT_ID}`);

  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
        body: JSON.stringify(commands),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "❌ Failed to register commands:",
        response.status,
        errorData,
      );
      process.exit(1);
    }

    const data = await response.json();
    console.log(`✅ Successfully registered ${data.length} slash commands!`);

    data.forEach((cmd: any) => {
      console.log(`  ✓ /${cmd.name} - ${cmd.description}`);
    });

    console.log("\n📍 Next steps:");
    console.log("1. Go to Discord Developer Portal > Application Settings");
    console.log(
      "2. Set Interactions Endpoint URL to: https://aethex.dev/api/discord/interactions",
    );
    console.log("3. Save changes");
    console.log(
      "4. Test commands in Discord with /creators, /opportunities, etc.",
    );
  } catch (error) {
    console.error("❌ Error registering commands:", error);
    process.exit(1);
  }
}

registerCommands();
