// Quick script to check which migration tables exist
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const tablesToCheck = [
  { table: 'applications', migration: '202407090001_create_applications' },
  { table: 'badges', migration: '20241212_add_tier_badges' },
  { table: 'user_badges', migration: '20241212_add_tier_badges' },
  { table: 'discord_links', migration: '20250107_add_discord_integration' },
  { table: 'discord_verifications', migration: '20250107_add_discord_integration' },
  { table: 'discord_linking_sessions', migration: '20250107_add_discord_integration' },
  { table: 'discord_role_mappings', migration: '20250107_add_discord_integration' },
  { table: 'arm_follows', migration: '20250115_feed_phase1_schema' },
  { table: 'web3_wallets', migration: '20250107_add_web3_and_games' },
  { table: 'games', migration: '20250107_add_web3_and_games' },
  { table: 'fourthwall_integrations', migration: '20250115_add_fourthwall_integration' },
  { table: 'wallet_verifications', migration: '20250115_add_wallet_verification' },
  { table: 'oauth_federation', migration: '20250115_oauth_federation' },
  { table: 'passport_cache', migration: '20250115_passport_cache_tracking' },
  { table: 'collaboration_posts', migration: '20250120_add_collaboration_posts' },
  { table: 'community_notifications', migration: '20250120_add_community_notifications' },
  { table: 'discord_webhooks', migration: '20250120_add_discord_webhooks' },
  { table: 'staff_members', migration: '20250121_add_staff_management' },
  { table: 'blog_posts', migration: '20250122_add_blog_posts' },
  { table: 'community_likes', migration: '20250125_create_community_likes_comments' },
  { table: 'community_comments', migration: '20250125_create_community_likes_comments' },
  { table: 'community_posts', migration: '20250125_create_community_posts' },
  { table: 'user_follows', migration: '20250125_create_user_follows' },
  { table: 'email_links', migration: '20250206_add_email_linking' },
  { table: 'ethos_guild_artists', migration: '20250206_add_ethos_guild' },
  { table: 'ethos_artist_verifications', migration: '20250210_add_ethos_artist_verification' },
  { table: 'ethos_artist_services', migration: '20250211_add_ethos_artist_services' },
  { table: 'ethos_service_requests', migration: '20250212_add_ethos_service_requests' },
  { table: 'gameforge_studios', migration: '20250213_add_gameforge_studio' },
  { table: 'foundation_projects', migration: '20250214_add_foundation_system' },
  { table: 'nexus_listings', migration: '20250214_add_nexus_marketplace' },
  { table: 'gameforge_sprints', migration: '20250301_add_gameforge_sprints' },
  { table: 'corp_companies', migration: '20250301_add_corp_hub_schema' },
  { table: 'teams', migration: '20251018_core_event_bus_teams_projects' },
  { table: 'projects', migration: '20251018_projects_table' },
  { table: 'mentorship_programs', migration: '20251018_mentorship' },
  { table: 'moderation_reports', migration: '20251018_moderation_reports' },
  { table: 'social_invites', migration: '20251018_social_invites_reputation' },
  { table: 'nexus_core_resources', migration: '20251213_add_nexus_core_schema' },
  { table: 'developer_api_keys', migration: '20260107_developer_api_keys' },
];

const existingTables = [];
const missingTables = [];

for (const { table, migration } of tablesToCheck) {
  const { data, error } = await supabase.from(table).select('*').limit(0);
  if (error) {
    if (error.code === '42P01') {
      missingTables.push({ table, migration });
    } else {
      console.log(`Error checking ${table}:`, error.message);
    }
  } else {
    existingTables.push({ table, migration });
  }
}

console.log('\n✅ EXISTING TABLES (Likely Applied Migrations):');
console.log('================================================');
const appliedMigrations = new Set();
existingTables.forEach(({ table, migration }) => {
  console.log(`  ${table} → ${migration}`);
  appliedMigrations.add(migration);
});

console.log('\n❌ MISSING TABLES (Likely NOT Applied):');
console.log('=======================================');
const missingMigrations = new Set();
missingTables.forEach(({ table, migration }) => {
  console.log(`  ${table} → ${migration}`);
  missingMigrations.add(migration);
});

console.log('\n\n📊 MIGRATION SUMMARY:');
console.log('===================');
console.log(`Likely Applied: ${appliedMigrations.size} migrations`);
console.log(`Likely NOT Applied: ${missingMigrations.size} migrations`);

console.log('\n\n📋 MIGRATIONS THAT SEEM TO BE APPLIED:');
appliedMigrations.forEach(m => console.log(`  ✓ ${m}`));

console.log('\n\n📋 MIGRATIONS THAT SEEM TO BE MISSING:');
missingMigrations.forEach(m => console.log(`  ✗ ${m}`));
