@echo off
cls
echo ============================================================
echo       STRIPE PAYMENT OPTIMIZATION - FINAL DEPLOYMENT
echo ============================================================
echo.
echo This will deploy the payment optimization that restricts
echo payments to: Card, Apple Pay, and Google Pay ONLY
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [STEP 1] Checking files...
echo ----------------------------------------

set missing=0

if not exist booking-payment-optimized.js (
    echo ❌ MISSING: booking-payment-optimized.js
    set missing=1
) else (
    echo ✅ Found: booking-payment-optimized.js
)

if not exist booking-single-lesson-optimized.js (
    echo ❌ MISSING: booking-single-lesson-optimized.js
    set missing=1
) else (
    echo ✅ Found: booking-single-lesson-optimized.js
)

if not exist payment-optimization-enforcer.js (
    echo ❌ MISSING: payment-optimization-enforcer.js
    set missing=1
) else (
    echo ✅ Found: payment-optimization-enforcer.js
)

if %missing%==1 (
    echo.
    echo ERROR: Missing required files!
    echo Please ensure all optimization files are present.
    pause
    exit /b 1
)

echo.
echo [STEP 2] Git Status Check...
echo ----------------------------------------
git status --short

echo.
echo [STEP 3] Adding all changes...
echo ----------------------------------------
git add -A

echo.
echo [STEP 4] Creating comprehensive commit...
echo ----------------------------------------
git commit -m "feat: Complete Stripe payment optimization - Card + Apple/Google Pay only

WHAT CHANGED:
- Restricted payment methods to Card, Apple Pay, and Google Pay ONLY
- Removed ALL other payment methods (Klarna, PayPal, Cash App, Amazon Pay, BNPL)
- Added express checkout with Payment Request Button for wallets
- Implemented failsafe override to ensure optimization takes effect

FILES ADDED/MODIFIED:
- booking-payment-optimized.js: Main optimized payment handler
- booking-single-lesson-optimized.js: Single lesson payment flow
- payment-optimization-enforcer.js: Ensures overrides work
- safestroke-booking.html: Updated script order + inline failsafe
- Test files for QA validation

TECHNICAL DETAILS:
- Server: payment_method_types restricted to ['card'] in create-payment.js
- Frontend: Payment Request API for Apple/Google Pay detection
- Wallets disabled in payment element to avoid duplication
- Multiple override mechanisms to ensure optimization works

HOW TO VERIFY:
1. Open browser console on booking page
2. Look for 'Payment Optimization Failsafe Active' message
3. Should see 'Payment form optimized via failsafe' if working
4. Test payment flow - should only show Card + Apple/Google Pay

ROLLBACK IF NEEDED:
git revert HEAD"

echo.
echo [STEP 5] Pushing to GitHub...
echo ----------------------------------------
git push origin main

echo.
echo ============================================================
echo                    DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo ✅ Files pushed to GitHub
echo ✅ Netlify will auto-deploy in 1-2 minutes
echo.
echo TO VERIFY AFTER DEPLOYMENT:
echo ----------------------------
echo 1. Go to your live booking page
echo 2. Open browser console (F12)
echo 3. You should see:
echo    - "Payment Optimization Failsafe Active"
echo    - "Payment form optimized via failsafe"
echo.
echo 4. Start a booking flow and verify:
echo    ✅ Card payment form appears
echo    ✅ Apple Pay appears (on iPhone/Safari)
echo    ✅ Google Pay appears (on Chrome)
echo    ❌ NO other payment methods visible
echo.
echo TEST PAGES:
echo -----------
echo - test-direct-payment.html (direct test)
echo - test-isolated-payment.html (isolated test)
echo - test-payment-methods-optimized.html (full QA)
echo.
echo TROUBLESHOOTING:
echo ----------------
echo If payment methods aren't restricted, check:
echo 1. Browser console for errors
echo 2. Network tab for script 404s
echo 3. Run: window.paymentOptimization.status()
echo 4. See PAYMENT-TROUBLESHOOTING.md for details
echo.
echo Press any key to exit...
pause >nul
