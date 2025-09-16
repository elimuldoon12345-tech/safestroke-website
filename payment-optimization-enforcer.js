// Master Payment Optimization Enforcer
// This script ensures the optimized payment methods are used everywhere

(function() {
    console.log('Payment Optimization Enforcer starting...');
    
    // Store references to original functions
    const originalFunctions = {};
    
    // Function to enforce optimized payment
    function enforceOptimizedPayment() {
        console.log('Enforcing optimized payment configuration...');
        
        // Override setupPaymentForm
        if (window.setupPaymentFormOptimized) {
            originalFunctions.setupPaymentForm = window.setupPaymentForm;
            window.setupPaymentForm = window.setupPaymentFormOptimized;
            console.log('✓ setupPaymentForm overridden with optimized version');
        }
        
        // Override handleBookingSubmit  
        if (window.handleBookingSubmitFixed) {
            originalFunctions.handleBookingSubmit = window.handleBookingSubmit;
            window.handleBookingSubmit = window.handleBookingSubmitFixed;
            console.log('✓ handleBookingSubmit overridden with optimized version');
        }
        
        // Monitor for any attempts to reset these functions
        const protectedFunctions = ['setupPaymentForm', 'handleBookingSubmit'];
        protectedFunctions.forEach(fnName => {
            let currentFn = window[fnName];
            Object.defineProperty(window, fnName, {
                get() { return currentFn; },
                set(newFn) {
                    if (fnName === 'setupPaymentForm' && window.setupPaymentFormOptimized && newFn !== window.setupPaymentFormOptimized) {
                        console.warn(`Blocked attempt to override ${fnName} with non-optimized version`);
                        return;
                    }
                    if (fnName === 'handleBookingSubmit' && window.handleBookingSubmitFixed && newFn !== window.handleBookingSubmitFixed) {
                        console.warn(`Blocked attempt to override ${fnName} with non-optimized version`);
                        return;
                    }
                    currentFn = newFn;
                },
                configurable: true
            });
        });
        
        console.log('✓ Payment optimization protection enabled');
    }
    
    // Function to verify Stripe configuration
    function verifyStripeConfig() {
        if (window.stripe) {
            console.log('✓ Stripe initialized');
            
            // Test Payment Request availability
            const pr = window.stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: { label: 'Test', amount: 100 },
                requestPayerName: true,
                requestPayerEmail: true,
            });
            
            pr.canMakePayment().then(result => {
                if (result) {
                    const ua = navigator.userAgent;
                    const isApple = /iPhone|iPad|Mac/.test(ua) && /Safari/.test(ua);
                    const isChrome = /Chrome/.test(ua);
                    
                    if (isApple) {
                        console.log('✓ Apple Pay available on this device');
                    } else if (isChrome) {
                        console.log('✓ Google Pay available on this browser');
                    } else {
                        console.log('✓ Express checkout available');
                    }
                } else {
                    console.log('ℹ Express checkout not available - Card only mode');
                }
            });
        }
    }
    
    // Enforce on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enforceOptimizedPayment);
    } else {
        enforceOptimizedPayment();
    }
    
    // Enforce again after a delay to catch late-loading scripts
    setTimeout(enforceOptimizedPayment, 500);
    setTimeout(enforceOptimizedPayment, 1000);
    setTimeout(enforceOptimizedPayment, 2000);
    
    // Verify Stripe when ready
    const checkStripe = setInterval(() => {
        if (window.stripe) {
            verifyStripeConfig();
            clearInterval(checkStripe);
        }
    }, 100);
    
    // Public API for debugging
    window.paymentOptimization = {
        status: function() {
            console.log('Payment Optimization Status:');
            console.log('- setupPaymentForm:', window.setupPaymentForm === window.setupPaymentFormOptimized ? '✓ Optimized' : '✗ Not optimized');
            console.log('- handleBookingSubmit:', window.handleBookingSubmit === window.handleBookingSubmitFixed ? '✓ Optimized' : '✗ Not optimized');
            console.log('- Original functions backed up:', Object.keys(originalFunctions));
            return {
                setupPaymentForm: window.setupPaymentForm === window.setupPaymentFormOptimized,
                handleBookingSubmit: window.handleBookingSubmit === window.handleBookingSubmitFixed
            };
        },
        enforce: enforceOptimizedPayment,
        verify: verifyStripeConfig
    };
    
    console.log('Payment Optimization Enforcer ready. Use window.paymentOptimization.status() to check status.');
})();
