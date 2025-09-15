-- Migration: Add loyalty discount tracking to packages table
-- Run this in your Supabase SQL editor to add loyalty discount tracking

-- Add columns to track loyalty discounts
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS is_returning_customer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS loyalty_discount_applied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

-- Update original_price for existing records (set to amount_paid if not present)
UPDATE packages 
SET original_price = amount_paid 
WHERE original_price IS NULL;

-- Create an index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_packages_customer_email_paid 
ON packages(customer_email, status) 
WHERE status = 'paid';

-- Create a view to easily see returning customers
CREATE OR REPLACE VIEW returning_customers AS
SELECT 
    customer_email,
    COUNT(*) as total_purchases,
    SUM(amount_paid) as total_spent,
    MIN(created_at) as first_purchase,
    MAX(created_at) as last_purchase,
    ARRAY_AGG(DISTINCT program) as programs_purchased,
    SUM(CASE WHEN loyalty_discount_applied = true THEN 1 ELSE 0 END) as discounted_purchases,
    SUM(CASE WHEN loyalty_discount_applied = true THEN (original_price - amount_paid) ELSE 0 END) as total_saved
FROM packages
WHERE status = 'paid' 
    AND customer_email IS NOT NULL
GROUP BY customer_email
HAVING COUNT(*) > 1
ORDER BY total_spent DESC;

-- Create a function to check if a customer is eligible for discount
CREATE OR REPLACE FUNCTION check_loyalty_discount_eligibility(email TEXT)
RETURNS TABLE (
    is_eligible BOOLEAN,
    purchase_count INTEGER,
    total_spent DECIMAL,
    discount_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN COUNT(*) > 0 THEN true ELSE false END as is_eligible,
        COUNT(*)::INTEGER as purchase_count,
        COALESCE(SUM(amount_paid), 0) as total_spent,
        CASE WHEN COUNT(*) > 0 THEN 10 ELSE 0 END as discount_percentage
    FROM packages
    WHERE customer_email ILIKE email
        AND status = 'paid';
END;
$$ LANGUAGE plpgsql;

-- Add a comment to the table for documentation
COMMENT ON TABLE packages IS 'Stores all lesson package purchases with loyalty discount tracking';
COMMENT ON COLUMN packages.is_returning_customer IS 'Whether customer had previous purchases when buying this package';
COMMENT ON COLUMN packages.loyalty_discount_applied IS 'Whether 10% loyalty discount was applied to this purchase';
COMMENT ON COLUMN packages.original_price IS 'Original price before any discounts were applied';

-- Create a trigger to automatically mark returning customers
CREATE OR REPLACE FUNCTION mark_returning_customer()
RETURNS TRIGGER AS $$
DECLARE
    previous_purchases INTEGER;
BEGIN
    -- Check if this customer has any previous paid packages
    SELECT COUNT(*) INTO previous_purchases
    FROM packages
    WHERE customer_email = NEW.customer_email
        AND status = 'paid'
        AND id != NEW.id;
    
    -- If they have previous purchases and loyalty discount wasn't already set
    IF previous_purchases > 0 AND NEW.is_returning_customer IS NULL THEN
        NEW.is_returning_customer := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger (drop if exists first)
DROP TRIGGER IF EXISTS check_returning_customer_trigger ON packages;
CREATE TRIGGER check_returning_customer_trigger
BEFORE INSERT OR UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION mark_returning_customer();

-- Sample query to view discount statistics
-- SELECT 
--     COUNT(DISTINCT customer_email) as unique_customers,
--     SUM(CASE WHEN is_returning_customer THEN 1 ELSE 0 END) as returning_purchases,
--     SUM(CASE WHEN loyalty_discount_applied THEN 1 ELSE 0 END) as discounted_purchases,
--     SUM(CASE WHEN loyalty_discount_applied THEN (original_price - amount_paid) ELSE 0 END) as total_discount_given
-- FROM packages
-- WHERE status = 'paid';
