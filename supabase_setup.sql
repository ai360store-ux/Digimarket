-- =====================================================================
-- SUPABASE INITIALIZATION SCRIPT (RESET)
-- =====================================================================
-- WARNING: This will DELETE all existing data in the specified tables.
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- =====================================================================

-- 1. Clean up old tables
DROP TABLE IF EXISTS dm_products;
DROP TABLE IF EXISTS dm_categories;
DROP TABLE IF EXISTS dm_settings;
DROP TABLE IF EXISTS dm_config;

-- 2. Create Products Table
-- Stores all product details including Base64 images in the 'data' JSONB column
CREATE TABLE dm_products (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Categories Table
CREATE TABLE dm_categories (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Settings Table
-- Stores store-wide settings like Brand Name, Currency, etc.
CREATE TABLE dm_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Config Table
-- Stores shared configuration if needed
CREATE TABLE dm_config (
    id TEXT PRIMARY KEY,
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISABLE ROW LEVEL SECURITY (RLS)
-- CRITICAL STEP: This makes the tables accessible to your application without
-- requiring complex user authentication policies.
ALTER TABLE dm_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_config DISABLE ROW LEVEL SECURITY;

-- 7. Verification Output
SELECT 'DigiMarket Tables Initialized Successfully' as status;
