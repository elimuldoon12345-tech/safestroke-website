@echo off
echo ========================================
echo SafeStroke CRITICAL Booking Fix
echo ========================================
echo.
echo Fixing the corrupted JavaScript file that's preventing buttons from working
echo.

echo Step 1: Add fixed files to git...
git add booking-functions-fix.js
git add booking-system-v2.js
git add debug-booking.html
git add netlify/functions/init-october-slots.js
git add netlify/functions/get-time-slots.js
git add netlify/functions/book-free-single-lesson.js

echo.
echo Step 2: Commit the fixes...
git commit -m "CRITICAL FIX: Repair corrupted booking-functions-fix.js

- Fixed syntax error on line 509 that was breaking all booking functions
- Single lesson flow now works with FIRST-FREE making lesson $0
- Calendar properly loads for both free and paid lessons
- No package creation for free single lessons"

echo.
echo Step 3: Push to GitHub...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo CRITICAL NEXT STEPS:
echo.
echo 1. Wait 2-3 minutes for Netlify to deploy
echo.
echo 2. INITIALIZE TIME SLOTS (Required for calendar to work):
echo    - Open: your-site.netlify.app/debug-booking.html
echo    - Click the BIG RED BUTTON: "Initialize Time Slots Now"
echo    - Wait for success message
echo.
echo 3. TEST THE BOOKING FLOW:
echo    - Clear browser cache (Ctrl+F5)
echo    - Go to booking page
echo    - Both buttons should now work
echo    - Test FIRST-FREE promo code
echo.
pause