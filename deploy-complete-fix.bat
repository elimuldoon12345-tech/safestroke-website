@echo off
echo ========================================
echo SafeStroke Booking System - Complete Fix Deployment
echo ========================================
echo.

echo Step 1: Committing all fixes...
git add booking-system-v2.js test-booking-fix.html
git commit -m "Fix: Complete booking system fixes - showDateSlots program detection and paid single lesson flow"

echo.
echo Step 2: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Fixed Issues:
echo 1. Time slots now load when clicking dates (showDateSlots fixed)
echo 2. Program variable properly detected in all contexts
echo 3. Paid single lesson flow now works correctly
echo 4. Free single lesson flow continues to work
echo.
echo Testing:
echo - Free lessons: Use promo code FIRST-FREE
echo - Paid lessons: Select a single lesson without promo code
echo - Package flow: Purchase a package as normal
echo.
echo All flows should now work correctly!
echo.
pause
