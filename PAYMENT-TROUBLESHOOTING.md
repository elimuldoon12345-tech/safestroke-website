# Payment Optimization Troubleshooting Guide

## Quick Check
Open your browser console on the booking page and run:
```javascript
// Copy and paste this entire block into the console
console.log('Checking payment optimization...');
console.log('setupPaymentForm:', window.setupPaymentForm === window.setupPaymentFormOptimized ? '✅ OPTIMIZED' : '❌ NOT OPTIMIZED');
console.log('Optimized function exists:', window.setupPaymentFormOptimized ? '✅' : '❌');
if (window.paymentOptimization) {
    window.paymentOptimization.status();
    window.paymentOptimization.enforce();
    console.log('Enforcement applied!');
}
```

## The Issue
The optimized payment scripts are loaded but may not be taking effect because:
1. Other scripts are overriding them
2. Script loading order issues
3. JavaScript errors preventing execution

## Solution 1: Force the Override (Quick Fix)
Run this in the console on your booking page:

```javascript
// Force optimized payment - run this in console
(function() {
    // Backup originals
    window.setupPaymentFormOriginal = window.setupPaymentForm;
    window.handleBookingSubmitOriginal = window.handleBookingSubmit;
    
    // Force optimized versions
    if (window.setupPaymentFormOptimized) {
        window.setupPaymentForm = window.setupPaymentFormOptimized;
        console.log('✅ Payment form optimized');
    } else {
        console.log('❌ Optimized payment function not found');
    }
    
    if (window.handleBookingSubmitFixed) {
        window.handleBookingSubmit = window.handleBookingSubmitFixed;
        console.log('✅ Booking submit optimized');
    } else {
        console.log('❌ Optimized booking function not found');
    }
    
    // Prevent future overrides
    Object.freeze(window.setupPaymentForm);
    Object.freeze(window.handleBookingSubmit);
    
    console.log('Payment optimization forced! Try the payment flow now.');
})();
```

## Solution 2: Check Script Loading (Verify Files)

1. **Check if files exist:**
   - Navigate to: `yourdomain.com/booking-payment-optimized.js`
   - Navigate to: `yourdomain.com/booking-single-lesson-optimized.js`
   - Navigate to: `yourdomain.com/payment-optimization-enforcer.js`

2. **Check Console for Errors:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for red error messages
   - Check Network tab for 404 errors

## Solution 3: Manual HTML Update

Make sure your `safestroke-booking.html` has scripts in this exact order at the bottom:

```html
<!-- Scripts -->
<!-- Core booking system -->
<script src="booking-system-v2.js"></script>
<script src="booking-functions-fix.js"></script>
<script src="booking-package-fix.js"></script>
<!-- Optimized payment with Card + Apple/Google Pay only -->
<script src="booking-payment-optimized.js"></script>
<script src="booking-single-lesson-optimized.js"></script>
<!-- Payment optimization enforcer - MUST BE LAST -->
<script src="payment-optimization-enforcer.js"></script>
```

## Solution 4: Test Isolation

Test if the optimization works in isolation:
1. Open `test-direct-payment.html` in your browser
2. Click "Create Test Payment"
3. Check if you see:
   - Express checkout button (Apple/Google Pay) on eligible devices
   - Card payment form
   - NO other payment methods

If this works but the main booking page doesn't, there's a script conflict.

## Solution 5: Clear and Reload

1. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Safari: Develop → Empty Caches
   
2. Hard reload the page:
   - Windows: Ctrl+F5
   - Mac: Cmd+Shift+R

## Verification Steps

After applying fixes, verify by:

1. **Start a booking flow**
2. **Select a package**
3. **Get to payment step**
4. **Check payment methods shown:**
   - ✅ Should see: Card form
   - ✅ Should see: Apple Pay (on iPhone/Safari) or Google Pay (on Chrome)
   - ❌ Should NOT see: Klarna, PayPal, Cash App, etc.

## If Still Not Working

Run the diagnostic script:
```javascript
// Copy the entire contents of payment-diagnostic.js and paste in console
```

This will show you:
- Which scripts are loaded
- Which functions are active
- What needs to be fixed

## Emergency Rollback

If you need to rollback:
```bash
# Restore original files
git checkout -- safestroke-booking.html
git checkout HEAD~1 -- booking-payment-fix.js
git checkout HEAD~1 -- booking-single-lesson-fix.js
```

## Contact Support

If issues persist, check:
1. Netlify deployment logs for errors
2. Browser console for JavaScript errors
3. Network tab for failed script loads

The optimization IS in place in the code - we just need to ensure it's being executed properly!
