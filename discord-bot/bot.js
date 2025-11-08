const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
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
