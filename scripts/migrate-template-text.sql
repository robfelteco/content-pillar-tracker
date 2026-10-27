-- One-time conversion for databases created when content_template was a
-- Postgres ENUM. Run once, after upgrading the code. Idempotent: a column that
-- is already text is left alone.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_template') THEN
    ALTER TABLE posts           ALTER COLUMN template      TYPE text USING template::text;
    ALTER TABLE labels          ALTER COLUMN template      TYPE text USING template::text;
    ALTER TABLE labels          ALTER COLUMN prev_template TYPE text USING prev_template::text;
    ALTER TABLE recommendation_uses ALTER COLUMN template TYPE text USING template::text;
    DROP TYPE content_template;
  END IF;
END $$;
