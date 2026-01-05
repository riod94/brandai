-- Reset BrandAI Database
-- Jalankan di Supabase SQL Editor

-- Drop drizzle migration tracking
DROP SCHEMA IF EXISTS drizzle CASCADE;

-- Drop all app tables
DROP TABLE IF EXISTS "logo" CASCADE;
DROP TABLE IF EXISTS "transaction" CASCADE;
DROP TABLE IF EXISTS "subscription" CASCADE;
DROP TABLE IF EXISTS "setting" CASCADE;
DROP TABLE IF EXISTS "authenticator" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "verificationToken" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Confirm reset
SELECT 'Database reset complete!' as status;
