-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Set admin secret key in a simple way (using a single-row config table)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Store the admin secret key hash
INSERT INTO config(key, value) 
VALUES ('admin_secret_hash', crypt('123$', gen_salt('bf')))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verify
SELECT 'Database functions setup complete!' AS status;
SELECT 'Admin secret key is: 123$' AS note;
