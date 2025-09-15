@echo off
echo ========================================
echo SafeStroke URGENT Booking System Fixes
echo ========================================
echo.

echo This script will fix both issues:
echo 1. Free lesson database error
echo 2. Calendar showing no available slots
echo.

echo Step 1: Adding all fixes to git...
git add debug-booking.html
git add netlify/functions/create-free-package-v2.js
git add fix-database-schema.sql
git add booking-system-v2.js
git add urgent-fix-deploy.bat

echo.
echo Step 2: Committing fixes...
git commit -m "URGENT: Fix database schema issues for booking system

- Added create-free-package-v2 with better error handling
- Created debug-booking.html for troubleshooting
- Added SQL schema fixes for database tables
- Handles missing columns gracefully"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo CRITICAL POST-DEPLOYMENT STEPS:
echo ========================================
echo.
echo STEP 1 - FIX DATABASE (Do this FIRST!):
echo   1. Go to your Supabase dashboard
echo   2. Open SQL Editor
echo   3. Copy and run the queries from fix-database-schema.sql
echo   4. This will add any missing columns
echo.
echo STEP 2 - INITIALIZE TIME SLOTS:
echo   1. Open your-site.netlify.app/debug-booking.html
echo   2. Click the RED "Initialize Time Slots Now" button
echo   3. Wait for success message
echo.
echo STEP 3 - TEST THE FIXES:
echo   1. Still on debug-booking.html
echo   2. Click "Check Time Slots Count" - should show slots
echo   3. Click "Test Package Table Schema" - should succeed
echo   4. Try "Create Free Package" - should work now
echo.
echo STEP 4 - UPDATE YOUR CODE (Optional):
echo   If create-free-package-v2 works, rename it:
echo   - Delete old create-free-package.js
echo   - Rename create-free-package-v2.js to create-free-package.js
echo.
echo ========================================
pause