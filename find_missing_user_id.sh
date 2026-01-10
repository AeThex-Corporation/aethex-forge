#!/bin/bash
# Find tables with policies referencing user_id but no user_id column in CREATE TABLE

grep -n "create table" apply_missing_migrations.sql | while read line; do
    line_num=$(echo "$line" | cut -d: -f1)
    table_name=$(echo "$line" | grep -oP 'create table.*?public\.\K[a-z_]+' || echo "$line" | grep -oP 'CREATE TABLE.*?\K[a-z_]+')
    
    if [ ! -z "$table_name" ]; then
        # Get the CREATE TABLE block (next 30 lines)
        table_def=$(sed -n "${line_num},$((line_num+30))p" apply_missing_migrations.sql)
        
        # Check if this table has user_id in its definition
        has_user_id=$(echo "$table_def" | grep -c "user_id")
        
        # Check if there are policies for this table that reference user_id
        has_policy_user_id=$(grep -c "policy.*on.*${table_name}.*user_id" apply_missing_migrations.sql)
        
        if [ "$has_policy_user_id" -gt 0 ] && [ "$has_user_id" -eq 0 ]; then
            echo "⚠️  Table: $table_name - Has policies with user_id but CREATE TABLE has no user_id column"
        fi
    fi
done
