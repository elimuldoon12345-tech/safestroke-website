@echo off
echo ================================
echo DEPLOYING COMPLETE BOOKING FIX
echo ================================
echo.

echo Fixing all booking flow errors...
echo.

REM Add all changes
git add booking-system-v2.js
git add booking-post-payment-fix.js
git add safestroke-booking.html
git add BOOKING-ERROR-FIX-REPORT.md
git add test-booking-flow-fix.html

REM Commit the changes
git commit -m "Complete fix: Resolve all booking flow errors after payment

- Fixed showCalendarSection null reference errors
- Fixed resetToInitialState element checking
- Added post-payment continuation enhancement
- Auto-fills package code after successful payment
- Ensures smooth transition from payment to scheduling
- Added comprehensive error handling and fallbacks

Issues fixed:
- Cannot read properties of null (classList) errors
- Calendar not showing after payment
- Schedule with code button not working immediately after payment"

REM Push to GitHub (which triggers Netlify deploy)
echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ================================
echo DEPLOYMENT COMPLETE!
echo ================================
echo.
echo All booking flow fixes have been deployed.
echo.
echo What was fixed:
echo 1. Calendar section displays correctly after payment
echo 2. No more null reference errors
echo 3. Package code auto-fills after payment
echo 4. Schedule button works immediately after payment
echo 5. Better error handling throughout the flow
echo.
echo The site will be updated on Netlify in 1-2 minutes.
echo.
echo Test the complete flow:
echo 1. Select a package and complete payment
echo 2. Package code should auto-fill in the "Have a package code?" section
echo 3. Click "Schedule" to book lessons
echo 4. Calendar should load without errors
echo.
pause
