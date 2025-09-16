@echo off
echo ========================================
echo FORCE PAYMENT OPTIMIZATION DEPLOYMENT
echo ========================================
echo.

echo [1] Adding all optimization files...
git add booking-payment-optimized.js
git add booking-single-lesson-optimized.js  
git add payment-optimization-enforcer.js
git add safestroke-booking.html
git add test-direct-payment.html
git add test-payment-methods-optimized.html
git add payment-diagnostic.js
git add PAYMENT-TROUBLESHOOTING.md
git add payment-optimization-report.md

echo.
echo [2] Creating commit...
git commit -m "fix: force payment optimization with enforcer script

- Add payment-optimization-enforcer.js to ensure overrides work
- Update script loading order in HTML
- Add diagnostic tools for troubleshooting
- Force override of payment functions
- Add direct test page for isolation testing

The optimization restricts payments to:
- Credit/Debit Cards (always)
- Apple Pay (on eligible devices)
- Google Pay (on Chrome)

Removes: Klarna, PayPal, Cash App, Amazon Pay, all BNPL"

echo.
echo [3] Pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo DEPLOYMENT PUSHED!
echo ========================================
echo.
echo After Netlify deploys (1-2 minutes), test by:
echo.
echo 1. Go to your booking page
echo 2. Open browser console (F12)
echo 3. Run this diagnostic:
echo    window.paymentOptimization.status()
echo.
echo 4. If not optimized, run:
echo    window.paymentOptimization.enforce()
echo.
echo 5. Test the payment flow
echo.
pause
