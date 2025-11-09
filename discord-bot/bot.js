const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Validate environment variables
const requiredEnvVars = [
  "DISCORD_BOT_TOKEN",
  "DISCORD_CLIENT_ID",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE",
];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(
    "❌ FATAL ERROR: Missing required environment variables:",
    missingVars.join(", "),
  );
  console.error("\nPlease set these in your Discloud/hosting environment:");
  missingVars.forEach((envVar) => {
    console.error(`  - ${envVar}`);
  });
  process.exit(1);
}

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

// Store slash commands
client.commands = new Collection();

// Load commands from commands directory
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
  }
}

// Bot ready event
client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📡 Listening in ${client.guilds.cache.size} server(s)`);

  // Set bot status
  client.user.setActivity("/verify to link your AeThex account", {
    type: "LISTENING",
  });
});

// Slash command interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(
      `⚠️ No command matching ${interaction.commandName} was found.`,
    );
    return;
  }

  try {
    await command.execute(interaction, supabase, client);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);

    const errorEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Command Error")
      .setDescription("There was an error while executing this command.")
      .setFooter({ text: "Contact support if this persists" });

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

// IMPORTANT: Commands are now registered via a separate script
// Run this ONCE during deployment: npm run register-commands
// This prevents Error 50240 (Entry Point conflict) when Activities are enabled
// The bot will simply load and listen for the already-registered commands

// Define all commands for registration
const COMMANDS_TO_REGISTER = [
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

// Function to register commands with Discord
async function registerDiscordCommands() {
  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN,
    );

    console.log(`📝 Registering ${COMMANDS_TO_REGISTER.length} slash commands...`);

    try {
      // Try bulk update first
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: COMMANDS_TO_REGISTER },
      );

      console.log(`✅ Successfully registered ${data.length} slash commands`);
      return { success: true, count: data.length, results: null };
    } catch (bulkError) {
      // Handle Error 50240 (Entry Point conflict)
      if (bulkError.code === 50240) {
        console.warn(
          "⚠️ Error 50240: Entry Point detected. Registering individually...",
        );

        const results = [];
        let successCount = 0;
        let skipCount = 0;

        for (const command of COMMANDS_TO_REGISTER) {
          try {
            const posted = await rest.post(
              Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
              { body: command },
            );
            results.push({
              name: command.name,
              status: "registered",
              id: posted.id,
            });
            successCount++;
          } catch (postError) {
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
        return {
          success: true,
          count: successCount,
          skipped: skipCount,
          results,
        };
      }

      throw bulkError;
    }
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
    return { success: false, error: error.message };
  }
}

// Start HTTP health check server
const healthPort = process.env.HEALTH_PORT || 3000;
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === "/health") {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          status: "online",
          guilds: client.guilds.cache.size,
          commands: client.commands.size,
          uptime: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
        }),
      );
      return;
    }

    if (req.url === "/register-commands" && req.method === "POST") {
      // Verify admin token if provided
      const authHeader = req.headers.authorization;
      const adminToken = process.env.DISCORD_ADMIN_REGISTER_TOKEN;

      if (adminToken && authHeader !== `Bearer ${adminToken}`) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }

      // Register commands
      registerDiscordCommands().then((result) => {
        if (result.success) {
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          res.writeHead(500);
          res.end(JSON.stringify(result));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  })
  .listen(healthPort, () => {
    console.log(`���� Health check server running on port ${healthPort}`);
    console.log(`📝 Register commands at: POST http://localhost:${healthPort}/register-commands`);
  });

client.login(process.env.DISCORD_BOT_TOKEN);

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📡 Listening in ${client.guilds.cache.size} server(s)`);
  console.log("ℹ️  Commands are registered via: npm run register-commands");

  // Set bot status
  client.user.setActivity("/verify to link your AeThex account", {
    type: "LISTENING",
  });
});

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

module.exports = client;
