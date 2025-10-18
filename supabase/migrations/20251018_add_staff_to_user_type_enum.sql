-- Add 'staff' value to user_type_enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'user_type_enum' AND e.enumlabel = 'staff'
  ) THEN
    ALTER TYPE user_type_enum ADD VALUE 'staff';
  END IF;
END$$;
