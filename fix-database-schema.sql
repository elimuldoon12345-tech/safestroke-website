-- SafeStroke Database Schema Fixes
-- Run these queries in your Supabase SQL editor to fix the schema issues

-- ============================================
-- STEP 1: Check if packages table exists and view its structure
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'packages'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add missing columns to packages table (if needed)
-- ============================================

-- Add promo_code column if it doesn't exist
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);

-- Add customer_email column if it doesn't exist
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Ensure all required columns exist
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS program VARCHAR(50) NOT NULL,
ADD COLUMN IF NOT EXISTS lessons_total INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS lessons_remaining INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- STEP 3: Check if time_slots table exists and has correct structure
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'time_slots'
ORDER BY ordinal_position;

-- ============================================
-- STEP 4: Ensure time_slots table has all required columns
-- ============================================
ALTER TABLE time_slots
ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY,
ADD COLUMN IF NOT EXISTS date DATE NOT NULL,
ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL,
ADD COLUMN IF NOT EXISTS end_time TIME NOT NULL,
ADD COLUMN IF NOT EXISTS lesson_type VARCHAR(50) NOT NULL,
ADD COLUMN IF NOT EXISTS group_number INTEGER,
ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS current_enrollment INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'available',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- STEP 5: Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_lesson_type ON time_slots(lesson_type);
CREATE INDEX IF NOT EXISTS idx_time_slots_status ON time_slots(status);
CREATE INDEX IF NOT EXISTS idx_packages_code ON packages(code);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);

-- ============================================
-- STEP 6: Check if there are any time slots for October 2025
-- ============================================
SELECT COUNT(*) as total_slots,
       COUNT(DISTINCT date) as unique_dates,
       MIN(date) as first_date,
       MAX(date) as last_date
FROM time_slots
WHERE date >= '2025-10-01' AND date <= '2025-10-31';

-- ============================================
-- STEP 7: View sample time slots
-- ============================================
SELECT * FROM time_slots 
WHERE date >= '2025-10-01' AND date <= '2025-10-31'
ORDER BY date, start_time
LIMIT 10;

-- ============================================
-- STEP 8: Check for any existing packages
-- ============================================
SELECT COUNT(*) as total_packages,
       COUNT(DISTINCT program) as programs,
       COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_packages
FROM packages;

-- ============================================
-- STEP 9: Clean up any test data (optional)
-- ============================================
-- DELETE FROM packages WHERE code LIKE 'TEST-%';
-- DELETE FROM packages WHERE code LIKE 'FREE-%' AND created_at < NOW() - INTERVAL '1 day';

-- ============================================
-- STEP 10: Verify everything is working
-- ============================================
-- Try inserting a test package
INSERT INTO packages (
    code,
    program,
    lessons_total,
    lessons_remaining,
    amount_paid,
    status,
    payment_intent_id
) VALUES (
    'TEST-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    'Splashlet',
    1,
    1,
    0,
    'paid',
    'test_payment_intent'
) RETURNING *;

-- Clean up the test (run after verifying)
-- DELETE FROM packages WHERE code LIKE 'TEST-%';