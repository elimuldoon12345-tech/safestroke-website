@echo off
echo ========================================
echo SafeStroke FINAL Fix Deployment
echo ========================================
echo.
echo The issues are:
echo 1. FIRST-FREE should NOT create a package, just make lesson free
echo 2. Calendar needs time slots initialized in database
echo.

echo Step 1: Deploy fixes...
git add debug-booking.html
git add booking-system-v2.js
git add netlify/functions/book-free-single-lesson.js
git add netlify/functions/init-october-slots.js
git add netlify/functions/get-time-slots.js
git add final-fix-deploy.bat

git commit -m "Fix booking flow: FIRST-FREE now properly makes lesson free without creating package

- Single lesson with FIRST-FREE now goes to calendar with $0 price
- Removed incorrect handleFreeSingleLesson call
- Fixed calendar flow for both free and paid single lessons"

git push origin main

echo.
echo ========================================
echo CRITICAL: After deployment completes:
echo ========================================
echo.
echo STEP 1 - INITIALIZE TIME SLOTS (REQUIRED!):
echo   1. Open your-site.netlify.app/debug-booking.html
echo   2. Click the BIG RED BUTTON "Initialize Time Slots Now"
echo   3. Wait for "Success! Created X time slots"
echo.
echo STEP 2 - TEST THE FLOW:
echo   1. Go to booking page
echo   2. Choose "Single Lesson"
echo   3. Enter FIRST-FREE promo code
echo   4. Select any program
echo   5. Should show calendar with FREE price
echo   6. Click on a green date
echo   7. Should show available time slots
echo.
echo If calendar still shows "no available slots":
echo   - Make sure you ran Step 1 above
echo   - Check debug-booking.html "Check Time Slots Count"
echo   - Should show slots exist for October 2025
echo.
pause