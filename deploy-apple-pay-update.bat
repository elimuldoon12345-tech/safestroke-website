@echo off
cls
echo ============================================================
echo     APPLE PAY + GOOGLE PAY DEPLOYMENT (After Domain Verification)
echo ============================================================
echo.

echo Now that you've enabled Apple Pay in Stripe, this will deploy
echo the enhanced payment optimization with full Apple Pay support.
echo.

echo [1] Adding all updated files...
git add booking-payment-optimized-v3.js
git add safestroke-booking.html
git add test-apple-pay-live.html
git add booking-single-lesson-optimized.js
git add payment-optimization-enforcer.js

echo.
echo [2] Creating commit...
git commit -m "feat: enhance Apple Pay support after domain verification

- Updated to v3.0 with enhanced Apple Pay detection
- Better device/browser detection for Apple devices
- Improved error handling and logging
- Added live Apple Pay verification test page
- Using correct Stripe keys (live vs test)

Apple Pay Requirements:
✅ Domain verified in Stripe Dashboard
✅ HTTPS (required)
✅ Safari on Apple device
✅ Card saved in Wallet

Google Pay Requirements:
✅ Domain verified in Stripe Dashboard  
✅ HTTPS (required)
✅ Chrome browser
✅ Saved payment method in Google account"

echo.
echo [3] Pushing to GitHub...
git push origin main

echo.
echo ============================================================
echo                 DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo IMPORTANT: Apple Pay Setup Checklist
echo -------------------------------------
echo ✅ 1. Domain verified in Stripe Dashboard
echo ⏳ 2. Wait 5-10 minutes for verification to propagate
echo 📱 3. Test on actual iPhone/iPad with Safari
echo 💳 4. Ensure you have cards in Apple Wallet
echo 🔒 5. Must be on HTTPS (not localhost)
echo.
echo TEST YOUR IMPLEMENTATION:
echo -------------------------
echo 1. Open on iPhone: https://yourdomain.com/test-apple-pay-live.html
echo 2. This will verify if Apple Pay is working
echo.
echo 3. Then test actual booking flow:
echo    - Go to booking page on iPhone Safari
echo    - Start a booking
echo    - Apple Pay button should appear at payment step
echo.
echo TROUBLESHOOTING:
echo ----------------
echo If Apple Pay doesn't appear:
echo - Clear Safari cache (Settings > Safari > Clear History)
echo - Ensure domain shows "Verified" in Stripe Dashboard
echo - Check console for errors (can use Safari Web Inspector)
echo - Try the test page first: test-apple-pay-live.html
echo.
echo Google Pay should work immediately in Chrome if you have
echo saved cards in your Google account.
echo.
echo Press any key to exit...
pause >nul
