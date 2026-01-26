#!/bin/bash
echo "Checking which tables/policies from migrations actually need to be created..."
echo ""
echo "=== Tables that DON'T exist yet ==="
for table in badges user_badges fourthwall_integrations wallet_verifications oauth_federation passport_cache foundation_course_modules foundation_course_lessons developer_api_keys; do
  if ! grep -q "\"$table\"" <<< "$TABLES"; then
    echo "  - $table (needs creation)"
  fi
done
