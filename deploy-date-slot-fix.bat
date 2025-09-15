@echo off
echo ========================================
echo SafeStroke Booking System - Date Slot Fix Deployment
echo ========================================
echo.

echo Step 1: Committing the fix...
git add booking-system-v2.js test-booking-fix.html
git commit -m "Fix: showDateSlots function now correctly uses program variable for single lesson flow"

echo.
echo Step 2: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo The fix has been applied to:
echo - booking-system-v2.js (fixed showDateSlots and changeMonth functions)
echo - Added test-booking-fix.html for verification
echo.
echo To test the fix:
echo 1. Open test-booking-fix.html in your browser
echo 2. Click "Run All Tests" to verify everything works
echo 3. Try the actual booking flow on safestroke-booking.html
echo.
echo The main issues fixed:
echo - showDateSlots now properly detects the program from all sources
echo - changeMonth function also uses correct program variable
echo - Both local and global variables are now properly synchronized
echo.
pause
