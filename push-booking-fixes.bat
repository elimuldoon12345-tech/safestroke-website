@echo off
echo ========================================
echo SafeStroke Booking System Fix Deployment
echo ========================================
echo.

echo Step 1: Adding and committing fixes...
git add netlify/functions/init-october-slots.js
git add netlify/functions/get-time-slots.js
git add netlify/functions/create-free-package.js
git add booking-system-v2.js
git add safestroke-booking.html
git add test-slot-initialization.html
git add push-booking-fixes.bat

git commit -m "Fix booking system issues: calendar availability and free lesson creation

- Added init-october-slots function to create time slots for October 2025
- Updated get-time-slots to handle missing status field
- Enhanced create-free-package with better error handling
- Added Tailwind CDN warning suppression
- Created test page for slot initialization"

echo.
echo Step 2: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo IMPORTANT POST-DEPLOYMENT STEPS:
echo.
echo 1. After Netlify deploys, open test-slot-initialization.html
echo 2. Click "Initialize Time Slots" to create October 2025 slots
echo 3. Test the booking flow with FIRST-FREE promo code
echo 4. Check that calendar shows available dates
echo.
echo If you encounter any issues, check the browser console
echo and Netlify function logs for detailed error messages.
echo.
pause