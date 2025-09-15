@echo off
echo ========================================
echo SafeStroke Complete Time Slot Fix
echo ========================================
echo.

echo Deploying all debugging tools...
git add slot-debugger.html
git add debug-showDateSlots.js
git add force-init-slots.js
git add booking-system-v2.js

git commit -m "Add complete time slot debugging and fixes

- Added slot-debugger.html for comprehensive testing
- Enhanced showDateSlots with debug logging
- Fixed program variable references for single lessons"

git push origin main

echo.
echo ========================================
echo AFTER DEPLOYMENT - RUN THESE STEPS:
echo ========================================
echo.
echo STEP 1: Open slot-debugger.html
echo   https://your-site.netlify.app/slot-debugger.html
echo.
echo STEP 2: Click the BIG RED BUTTON
echo   "INITIALIZE TIME SLOTS NOW"
echo.
echo STEP 3: Test a specific date
echo   - Select Splashlet
echo   - Date: 2025-10-05
echo   - Click "Test This Date"
echo   - Should show 6 available times
echo.
echo STEP 4: Go back to booking page
echo   - Clear cache (Ctrl+F5)
echo   - Try single lesson flow again
echo   - Open console (F12) to see debug info
echo.
pause