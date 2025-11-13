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

// Validate token format
const token = process.env.DISCORD_BOT_TOKEN;
if (!token || token.length < 20) {
  console.error("❌ FATAL ERROR: DISCORD_BOT_TOKEN is empty or invalid");
  console.error(`  Length: ${token ? token.length : 0}`);
  process.exit(1);
}

console.log("[Token] Bot token loaded (length: " + token.length + " chars)");

// Initialize Discord client with message intents for feed sync
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
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

// Load event handlers from events directory
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if ("name" in event && "execute" in event) {
      client.on(event.name, (...args) =>
        event.execute(...args, client, supabase),
      );
      console.log(`✅ Loaded event listener: ${event.name}`);
    }
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

    console.log(
      `📝 Registering ${COMMANDS_TO_REGISTER.length} slash commands...`,
    );

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
const healthPort = process.env.HEALTH_PORT || 8044;
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

    if (req.url === "/register-commands") {
      if (req.method === "GET") {
        // Show HTML form with button
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Register Discord Commands</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #333;
                margin-bottom: 20px;
              }
              p {
                color: #666;
                margin-bottom: 30px;
              }
              button {
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.3s;
              }
              button:hover {
                background: #764ba2;
              }
              button:disabled {
                background: #ccc;
                cursor: not-allowed;
              }
              #result {
                margin-top: 30px;
                padding: 20px;
                border-radius: 5px;
                display: none;
              }
              #result.success {
                background: #d4edda;
                color: #155724;
                display: block;
              }
              #result.error {
                background: #f8d7da;
                color: #721c24;
                display: block;
              }
              #loading {
                display: none;
                color: #667eea;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🤖 Discord Commands Registration</h1>
              <p>Click the button below to register all Discord slash commands (/verify, /set-realm, /profile, /unlink, /verify-role)</p>

              <button id="registerBtn" onclick="registerCommands()">Register Commands</button>

              <div id="loading">⏳ Registering... please wait...</div>
              <div id="result"></div>
            </div>

            <script>
              async function registerCommands() {
                const btn = document.getElementById('registerBtn');
                const loading = document.getElementById('loading');
                const result = document.getElementById('result');

                btn.disabled = true;
                loading.style.display = 'block';
                result.style.display = 'none';

                try {
                  const response = await fetch('/register-commands', {
                    method: 'POST',
                    headers: {
                      'Authorization': 'Bearer aethex-link',
                      'Content-Type': 'application/json'
                    }
                  });

                  const data = await response.json();

                  loading.style.display = 'none';
                  result.style.display = 'block';

                  if (response.ok && data.success) {
                    result.className = 'success';
                    result.innerHTML = \`
                      <h3>✅ Success!</h3>
                      <p>Registered \${data.count} commands</p>
                      \${data.skipped ? \`<p>(\${data.skipped} commands already existed)</p>\` : ''}
                      <p>You can now use the following commands in Discord:</p>
                      <ul>
                        <li>/verify - Link your account</li>
                        <li>/set-realm - Choose your realm</li>
                        <li>/profile - View your profile</li>
                        <li>/unlink - Disconnect account</li>
                        <li>/verify-role - Check your roles</li>
                      </ul>
                    \`;
                  } else {
                    result.className = 'error';
                    result.innerHTML = \`
                      <h3>❌ Error</h3>
                      <p>\${data.error || 'Failed to register commands'}</p>
                    \`;
                  }
                } catch (error) {
                  loading.style.display = 'none';
                  result.style.display = 'block';
                  result.className = 'error';
                  result.innerHTML = \`
                    <h3>❌ Error</h3>
                    <p>\${error.message}</p>
                  \`;
                } finally {
                  btn.disabled = false;
                }
              }
            </script>
          </body>
          </html>
        `);
        return;
      }

      if (req.method === "POST") {
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
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  })
  .listen(healthPort, () => {
    console.log(`���� Health check server running on port ${healthPort}`);
    console.log(
      `📝 Register commands at: POST http://localhost:${healthPort}/register-commands`,
    );
  });

// Login with error handling
client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("❌ FATAL ERROR: Failed to login to Discord");
  console.error(`   Error Code: ${error.code}`);
  console.error(`   Error Message: ${error.message}`);

  if (error.code === "TokenInvalid") {
    console.error("\n⚠️  DISCORD_BOT_TOKEN is invalid!");
    console.error("   Possible causes:");
    console.error("   1. Token has been revoked by Discord");
    console.error("   2. Token has expired");
    console.error("   3. Token format is incorrect");
    console.error(
      "\n   Solution: Get a new bot token from Discord Developer Portal",
    );
    console.error("   https://discord.com/developers/applications");
  }

  process.exit(1);
});

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
