// Payment Optimization Diagnostic Script
// Run this in the browser console on the booking page to check status

console.log('=== PAYMENT OPTIMIZATION DIAGNOSTIC ===');
console.log('');

// Check which scripts are loaded
console.log('1. SCRIPT LOADING STATUS:');
const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src.split('/').pop());
console.log('Loaded scripts:', scripts);
console.log('- booking-payment-optimized.js:', scripts.includes('booking-payment-optimized.js') ? '✅ LOADED' : '❌ NOT LOADED');
console.log('- booking-single-lesson-optimized.js:', scripts.includes('booking-single-lesson-optimized.js') ? '✅ LOADED' : '❌ NOT LOADED');
console.log('- payment-optimization-enforcer.js:', scripts.includes('payment-optimization-enforcer.js') ? '✅ LOADED' : '❌ NOT LOADED');
console.log('');

// Check function overrides
console.log('2. FUNCTION OVERRIDE STATUS:');
console.log('- setupPaymentForm:', window.setupPaymentForm ? (window.setupPaymentForm === window.setupPaymentFormOptimized ? '✅ OPTIMIZED' : '❌ NOT OPTIMIZED') : '❌ NOT FOUND');
console.log('- handleBookingSubmit:', window.handleBookingSubmit ? (window.handleBookingSubmit === window.handleBookingSubmitFixed ? '✅ OPTIMIZED' : '❌ NOT OPTIMIZED') : '❌ NOT FOUND');
console.log('- setupPaymentFormOptimized exists:', window.setupPaymentFormOptimized ? '✅ YES' : '❌ NO');
console.log('- handleBookingSubmitFixed exists:', window.handleBookingSubmitFixed ? '✅ YES' : '❌ NO');
console.log('');

// Check Stripe status
console.log('3. STRIPE STATUS:');
console.log('- Stripe loaded:', window.Stripe ? '✅ YES' : '❌ NO');
console.log('- stripe instance:', window.stripe ? '✅ YES' : '❌ NO');
if (window.stripe) {
    // Test Payment Request
    const pr = window.stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: { label: 'Test', amount: 100 },
        requestPayerName: true,
        requestPayerEmail: true,
    });
    
    pr.canMakePayment().then(result => {
        console.log('- Express checkout available:', result ? '✅ YES' : '❌ NO');
        if (result) {
            const ua = navigator.userAgent;
            if (/iPhone|iPad/.test(ua) && /Safari/.test(ua)) {
                console.log('  → Apple Pay should be available');
            } else if (/Chrome/.test(ua)) {
                console.log('  → Google Pay should be available');
            }
        }
    });
}
console.log('');

// Check for payment optimization object
console.log('4. PAYMENT OPTIMIZATION API:');
if (window.paymentOptimization) {
    console.log('✅ Payment optimization API available');
    console.log('Running status check...');
    const status = window.paymentOptimization.status();
    console.log('Status:', status);
} else {
    console.log('❌ Payment optimization API not found');
    console.log('The enforcer script may not be loaded');
}
console.log('');

// Try to manually trigger optimization
console.log('5. MANUAL OVERRIDE ATTEMPT:');
if (window.setupPaymentFormOptimized) {
    window.setupPaymentForm = window.setupPaymentFormOptimized;
    console.log('✅ Manually set setupPaymentForm to optimized version');
} else {
    console.log('❌ setupPaymentFormOptimized not found - optimized script not loaded properly');
}

if (window.handleBookingSubmitFixed) {
    window.handleBookingSubmit = window.handleBookingSubmitFixed;
    console.log('✅ Manually set handleBookingSubmit to optimized version');
} else {
    console.log('❌ handleBookingSubmitFixed not found - optimized script not loaded properly');
}
console.log('');

// Provide fix instructions
console.log('6. TROUBLESHOOTING:');
if (!window.setupPaymentFormOptimized || !window.handleBookingSubmitFixed) {
    console.log('⚠️ Optimized functions not found. Possible issues:');
    console.log('1. Scripts not loaded in correct order');
    console.log('2. Scripts failed to load (check Network tab)');
    console.log('3. JavaScript errors preventing execution (check Console for errors)');
    console.log('');
    console.log('To fix:');
    console.log('1. Ensure these scripts are loaded in this order:');
    console.log('   - booking-payment-optimized.js');
    console.log('   - booking-single-lesson-optimized.js');
    console.log('   - payment-optimization-enforcer.js (LAST)');
    console.log('2. Check for 404 errors in Network tab');
    console.log('3. Clear browser cache and reload');
} else if (window.setupPaymentForm !== window.setupPaymentFormOptimized) {
    console.log('⚠️ Optimized functions exist but are not active');
    console.log('Another script may be overriding them after load');
    console.log('');
    console.log('To fix:');
    console.log('1. Ensure payment-optimization-enforcer.js is loaded LAST');
    console.log('2. Try running: window.paymentOptimization.enforce()');
} else {
    console.log('✅ Everything appears to be configured correctly!');
    console.log('The optimized payment flow should be active.');
}

console.log('');
console.log('=== END DIAGNOSTIC ===');
