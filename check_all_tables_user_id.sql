-- Check which tables in the DB actually have a user_id column
SELECT table_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name = 'user_id'
ORDER BY table_name;
