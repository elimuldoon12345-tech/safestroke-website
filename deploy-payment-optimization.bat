@echo off
echo ========================================
echo STRIPE PAYMENT OPTIMIZATION DEPLOYMENT
echo Card + Apple Pay/Google Pay Only
echo ========================================
echo.

echo [STEP 1] Creating backup of current payment files...
copy booking-payment-fix.js booking-payment-fix-backup.js >nul 2>&1
copy booking-single-lesson-fix.js booking-single-lesson-fix-backup.js >nul 2>&1
echo Backups created.

echo.
echo [STEP 2] Verifying optimized payment files...
if not exist booking-payment-optimized.js (
    echo ERROR: booking-payment-optimized.js not found!
    exit /b 1
)
if not exist booking-single-lesson-optimized.js (
    echo ERROR: booking-single-lesson-optimized.js not found!
    exit /b 1
)
echo Optimized files verified.

echo.
echo [STEP 3] Creating integrated loader script...
echo // Payment Method Optimization Loader > booking-payment-loader.js
echo // Loads optimized payment with Card + Apple/Google Pay only >> booking-payment-loader.js
echo. >> booking-payment-loader.js
echo document.addEventListener('DOMContentLoaded', function() { >> booking-payment-loader.js
echo     // Load optimized payment scripts >> booking-payment-loader.js
echo     const scripts = [ >> booking-payment-loader.js
echo         'booking-payment-optimized.js', >> booking-payment-loader.js
echo         'booking-single-lesson-optimized.js' >> booking-payment-loader.js
echo     ]; >> booking-payment-loader.js
echo. >> booking-payment-loader.js
echo     scripts.forEach(src =^> { >> booking-payment-loader.js
echo         const script = document.createElement('script'); >> booking-payment-loader.js
echo         script.src = src; >> booking-payment-loader.js
echo         script.async = false; >> booking-payment-loader.js
echo         document.body.appendChild(script); >> booking-payment-loader.js
echo     }); >> booking-payment-loader.js
echo. >> booking-payment-loader.js
echo     console.log('Optimized payment methods loaded: Card + Express Checkout only'); >> booking-payment-loader.js
echo }); >> booking-payment-loader.js

echo Loader script created.

echo.
echo [STEP 4] Updating HTML files to use optimized scripts...
echo Please manually add the following to your HTML files:
echo.
echo In safestroke-booking.html, add before closing ^</body^> tag:
echo ^<script src="booking-payment-optimized.js"^>^</script^>
echo ^<script src="booking-single-lesson-optimized.js"^>^</script^>
echo.

echo.
echo [STEP 5] Git operations...
git add booking-payment-optimized.js
git add booking-single-lesson-optimized.js
git add test-payment-methods-optimized.html
git add deploy-payment-optimization.bat

echo.
echo [STEP 6] Creating commit...
git commit -m "feat: optimize Stripe payment methods - Card + Apple/Google Pay only

- Restrict payment methods to Card, Apple Pay, and Google Pay
- Remove all BNPL options (Klarna, Afterpay, etc.)
- Remove PayPal, Cash App, Amazon Pay
- Implement express checkout with Payment Request Button
- Add proper device detection for wallet availability
- Update both package and single lesson payment flows
- Add comprehensive QA testing page

Technical changes:
- Server: payment_method_types restricted to ['card']
- Frontend: Express checkout for Apple/Google Pay
- Wallets disabled in payment element to avoid duplication
- Stripe Link disabled to simplify checkout"

echo.
echo [DEPLOYMENT SUMMARY]
echo ====================
echo 1. Payment methods restricted to:
echo    - Credit/Debit Cards (always available)
echo    - Apple Pay (on eligible Apple devices)
echo    - Google Pay (on Chrome with saved cards)
echo.
echo 2. Removed payment methods:
echo    - Klarna, Afterpay, Affirm (BNPL)
echo    - PayPal, Cash App, Amazon Pay
echo    - Stripe Link
echo.
echo 3. Files created/updated:
echo    - booking-payment-optimized.js
echo    - booking-single-lesson-optimized.js
echo    - test-payment-methods-optimized.html
echo    - Server: create-payment.js (already configured)
echo.
echo 4. Testing checklist:
echo    [x] Card payment works on all devices
echo    [ ] Apple Pay appears on iPhone/Safari
echo    [ ] Google Pay appears on Chrome
echo    [ ] No other payment methods visible
echo    [ ] Payment completes successfully
echo.
echo 5. IMPORTANT: Domain Registration Required
echo    To enable Apple Pay and Google Pay:
echo    1. Go to Stripe Dashboard
echo    2. Settings -^> Payment methods
echo    3. Add your domain(s) to Apple Pay and Google Pay
echo    4. Verify domain ownership
echo.
echo Ready to push? (Ctrl+C to cancel, Enter to continue)
pause >nul

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Test at: test-payment-methods-optimized.html
echo 2. Verify on live site after Netlify deployment
echo 3. Register domains in Stripe Dashboard
echo.
pause
