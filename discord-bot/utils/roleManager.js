const { EmbedBuilder } = require("discord.js");

/**
 * Assign Discord role based on user's arm and type
 * @param {Guild} guild - Discord guild
 * @param {string} discordId - Discord user ID
 * @param {string} arm - User's primary arm (labs, gameforge, corp, foundation, devlink)
 * @param {object} supabase - Supabase client
 * @returns {Promise<boolean>} - Success status
 */
async function assignRoleByArm(guild, discordId, arm, supabase) {
  try {
    // Fetch guild member
    const member = await guild.members.fetch(discordId);
    if (!member) {
      console.warn(`Member not found: ${discordId}`);
      return false;
    }

    // Get role mapping from Supabase
    const { data: mapping, error: mapError } = await supabase
      .from("discord_role_mappings")
      .select("discord_role")
      .eq("arm", arm)
      .eq("server_id", guild.id)
      .maybeSingle();

    if (mapError) {
      console.error("Error fetching role mapping:", mapError);
      return false;
    }

    if (!mapping) {
      console.warn(
        `No role mapping found for arm: ${arm} in server: ${guild.id}`,
      );
      return false;
    }

    // Find role by name or ID
    let roleToAssign = guild.roles.cache.find(
      (r) => r.id === mapping.discord_role || r.name === mapping.discord_role,
    );

    if (!roleToAssign) {
      console.warn(`Role not found: ${mapping.discord_role}`);
      return false;
    }

    // Remove old arm roles
    const armRoles = member.roles.cache.filter((role) =>
      ["Labs", "GameForge", "Corp", "Foundation", "Dev-Link"].some((arm) =>
        role.name.includes(arm),
      ),
    );

    for (const [, role] of armRoles) {
      try {
        if (role.id !== roleToAssign.id) {
          await member.roles.remove(role);
        }
      } catch (e) {
        console.warn(`Could not remove role ${role.name}: ${e.message}`);
      }
    }

    // Assign new role
    if (!member.roles.cache.has(roleToAssign.id)) {
      await member.roles.add(roleToAssign);
      console.log(
        `✅ Assigned role ${roleToAssign.name} to ${member.user.tag}`,
      );
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error assigning role:", error);
    return false;
  }
}

/**
 * Get user's primary arm from Supabase
 * @param {string} discordId - Discord user ID
 * @param {object} supabase - Supabase client
 * @returns {Promise<string>} - Primary arm (labs, gameforge, corp, foundation, devlink)
 */
async function getUserArm(discordId, supabase) {
  try {
    const { data: link, error } = await supabase
      .from("discord_links")
      .select("primary_arm")
      .eq("discord_id", discordId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user arm:", error);
      return null;
    }

    return link?.primary_arm || null;
  } catch (error) {
    console.error("Error getting user arm:", error);
    return null;
  }
}

/**
 * Sync roles for a user across all guilds
 * @param {Client} client - Discord client
 * @param {string} discordId - Discord user ID
 * @param {string} arm - Primary arm
 * @param {object} supabase - Supabase client
 */
async function syncRolesAcrossGuilds(client, discordId, arm, supabase) {
  try {
    for (const [, guild] of client.guilds.cache) {
      try {
        const member = await guild.members.fetch(discordId);
        if (member) {
          await assignRoleByArm(guild, discordId, arm, supabase);
        }
      } catch (e) {
        console.warn(`Could not sync roles in guild ${guild.id}: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Error syncing roles across guilds:", error);
  }
}

module.exports = {
  assignRoleByArm,
  getUserArm,
  syncRolesAcrossGuilds,
};
