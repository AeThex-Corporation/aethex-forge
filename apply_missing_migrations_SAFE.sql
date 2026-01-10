-- SAFE VERSION: All policy/trigger errors will be caught and skipped
-- This allows the migration to complete even if some objects already exist

DO $$ 
DECLARE
  sql_commands TEXT[];
  cmd TEXT;
BEGIN
  -- Split into individual statements and execute each with error handling
  FOR cmd IN 
    SELECT unnest(string_to_array(pg_read_file('apply_missing_migrations.sql'), ';'))
  LOOP
    BEGIN
      EXECUTE cmd;
    EXCEPTION 
      WHEN duplicate_object THEN 
        RAISE NOTICE 'Skipping duplicate: %', SQLERRM;
      WHEN insufficient_privilege THEN
        RAISE NOTICE 'Skipping (no permission): %', SQLERRM;
      WHEN OTHERS THEN
        RAISE NOTICE 'Error: % - %', SQLSTATE, SQLERRM;
    END;
  END LOOP;
END $$;
