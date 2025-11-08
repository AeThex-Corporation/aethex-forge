const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Validate environment variables
const requiredEnvVars = ["DISCORD_BOT_TOKEN", "DISCORD_CLIENT_ID"];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(
    "❌ FATAL ERROR: Missing required environment variables:",
    missingVars.join(", "),
  );
  console.error("\nPlease set these before running command registration:");
  missingVars.forEach((envVar) => {
    console.error(`  - ${envVar}`);
  });
  process.exit(1);
}

// Load commands from commands directory
const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Loaded command: ${command.data.name}`);
  }
}

// Register commands with Discord API
async function registerCommands() {
  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN,
    );

    console.log(`\n📝 Registering ${commands.length} slash commands...`);
    console.log(
      "⚠️  This will co-exist with Discord's auto-generated Entry Point command.\n",
    );

    try {
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands },
      );
      console.log(`✅ Successfully registered ${data.length} slash commands.`);
      console.log("\n🎉 Command registration complete!");
      console.log("ℹ️  Your commands are now live in Discord.");
      console.log(
        "ℹ️  The Entry Point command (for Activities) will be managed by Discord.\n",
      );
    } catch (error) {
      // Handle Entry Point command conflict
      if (error.code === 50240) {
        console.warn(
          "⚠️  Error 50240: Entry Point command detected (Discord Activity enabled).",
        );
        console.warn("Registering commands individually...\n");

        let successCount = 0;
        for (const command of commands) {
          try {
            await rest.post(
              Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
              { body: command },
            );
            successCount++;
          } catch (postError) {
            if (postError.code === 50045) {
              console.warn(
                `  ⚠️  ${command.name}: Already registered (skipping)`,
              );
            } else {
              console.error(`  ❌ ${command.name}: ${postError.message}`);
            }
          }
        }

        console.log(
          `\n✅ Registered ${successCount} slash commands (individual mode).`,
        );
        console.log("🎉 Command registration complete!");
        console.log(
          "ℹ️  The Entry Point command will be managed by Discord.\n",
        );
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(
      "❌ Fatal error registering commands:",
      error.message || error,
    );
    process.exit(1);
  }
}

// Run registration
registerCommands();
