@echo off
echo ===============================================
echo DEPLOYING BOOKING FIXES + ADMIN TESTING SYSTEM
echo ===============================================
echo.

echo Adding all booking fixes and admin testing system...
echo.

REM Add all the files
git add booking-system-v2.js
git add booking-post-payment-fix.js
git add safestroke-booking.html
git add admin-booking-bypass.js
git add admin-loader.js
git add admin-dashboard.html
git add ADMIN-TESTING-GUIDE.md
git add BOOKING-ERROR-FIX-REPORT.md

REM Commit all changes
git commit -m "Add complete booking fix and admin testing system

BOOKING FIXES:
- Fixed null reference errors in showCalendarSection
- Fixed resetToInitialState element checking  
- Added post-payment continuation enhancement
- Package code auto-fills after payment
- Smooth transition from payment to scheduling

ADMIN TESTING SYSTEM:
- Admin bypass for testing without real payments
- Master code: ADMIN-TEST-2025
- Works with admin emails only for security
- Environment-based loader (won't load in production)
- Visual indicators when in test mode
- Admin dashboard for easy testing
- Complete testing documentation

The admin system allows complete testing of:
- Package selection and pricing
- Email collection
- Payment bypass (instant, free)
- Package code generation
- Calendar and scheduling
- Booking confirmation

Security: Only loads in development/test environments
or when explicitly enabled with admin credentials."

REM Push to GitHub
echo.
echo Pushing to GitHub (this will trigger Netlify deployment)...
git push origin main

echo.
echo ===============================================
echo DEPLOYMENT COMPLETE!
echo ===============================================
echo.
echo What was deployed:
echo 1. All booking flow error fixes
echo 2. Admin testing system with security controls
echo 3. Admin dashboard at admin-dashboard.html
echo.
echo To test the admin system:
echo 1. Go to safestroke-booking.html
echo 2. Press Ctrl+Shift+A
echo 3. Enter code: ADMIN-TEST-2025
echo 4. Enter email: mattjpiacentini@gmail.com
echo.
echo Or visit admin-dashboard.html for the testing control panel.
echo.
echo The site will update on Netlify in 1-2 minutes.
echo.
pause
