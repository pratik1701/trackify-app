-- Migration script to convert billingCycle from string to enum
-- This script should be run in your PostgreSQL database

-- Step 1: Create the new enum type
CREATE TYPE "BillingCycle" AS ENUM ('monthly', 'yearly', 'twoYear', 'threeYear');

-- Step 2: Add a new column with the enum type
ALTER TABLE "Subscription" ADD COLUMN "billingCycle_new" "BillingCycle";

-- Step 3: Update the new column with existing data
UPDATE "Subscription" 
SET "billingCycle_new" = "billingCycle"::"BillingCycle";

-- Step 4: Drop the old column
ALTER TABLE "Subscription" DROP COLUMN "billingCycle";

-- Step 5: Rename the new column to the original name
ALTER TABLE "Subscription" RENAME COLUMN "billingCycle_new" TO "billingCycle";

-- Step 6: Make the column NOT NULL (if it was before)
ALTER TABLE "Subscription" ALTER COLUMN "billingCycle" SET NOT NULL; 