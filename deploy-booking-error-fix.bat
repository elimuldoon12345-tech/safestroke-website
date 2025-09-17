@echo off
echo ================================
echo DEPLOYING BOOKING ERROR FIX
echo ================================
echo.

echo Fixing null reference errors in booking flow...
echo.

REM Add all changes
git add booking-system-v2.js

REM Commit the changes
git commit -m "Fix: Resolve null reference errors in booking flow after payment

- Fixed showCalendarSection function to handle missing DOM elements
- Fixed resetToInitialState function to check element existence
- Prevents 'Cannot read properties of null' errors
- Booking flow now continues properly after payment completion"

REM Push to GitHub (which triggers Netlify deploy)
echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ================================
echo DEPLOYMENT COMPLETE!
echo ================================
echo.
echo The fixes have been deployed. The booking flow should now work properly.
echo.
echo What was fixed:
echo - Calendar section now displays correctly after payment
echo - No more null reference errors when scheduling with package code
echo - Proper element existence checks throughout the flow
echo.
echo The site will be updated on Netlify in 1-2 minutes.
echo.
pause
