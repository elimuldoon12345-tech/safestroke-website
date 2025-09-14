-- Add these columns to your existing packages table in Supabase
-- Run this in the SQL editor if these columns don't exist already

-- Add notes field for tracking admin codes and special notes
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add customer_name field for storing customer names
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- These columns should already exist, but just in case:
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Update the comment on the payment_intent_id to note it can be admin_
COMMENT ON COLUMN packages.payment_intent_id IS 'Stripe payment intent ID or admin_[timestamp] for admin-created packages';