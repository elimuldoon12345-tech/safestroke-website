// Optimized payment form with Card + Apple Pay/Google Pay only
// Version 2.0 - Fixed express checkout display issue

window.setupPaymentFormOptimized = async function() {
    console.log('Setting up optimized payment form v2.0');
    
    // Prevent double initialization
    if (window.paymentFormInitializing) {
        console.log('Payment form already initializing, skipping...');
        return;
    }
    window.paymentFormInitializing = true;
    
    // Initialize Stripe if needed
    if (!window.stripe && typeof Stripe !== 'undefined') {
        const stripeKey = document.querySelector('meta[name="stripe-public-key"]')?.content || 
                         'pk_test_51S4UnDPRIIfaJZnp1eF8ZlFCD74YDhIU0LVsu3oX3RAy58FBARnucYobBFWf2Wr0wBTZ7smsb1br4ySd2PcfZN4m00oGXz5yQn';
        window.stripe = Stripe(stripeKey);
    }
    
    if (!window.stripe || !window.selectedPackage) {
        console.error('Stripe not initialized or no package selected');
        window.paymentFormInitializing = false;
        return;
    }
    
    // Display payment summary
    const paymentSummary = document.getElementById('payment-summary');
    if (paymentSummary) {
        paymentSummary.innerHTML = `
            <div class="bg-gray-50 p-6 rounded-lg mb-6">
                ${window.isReturningCustomer && window.loyaltyDiscountApplied ? `
                <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">RETURNING CUSTOMER</span>
                        <span class="text-purple-800 text-sm font-semibold">10% Loyalty Discount Applied!</span>
                    </div>
                </div>
                ` : ''}
                
                <h3 class="text-xl font-bold mb-4">Order Summary</h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Program:</span>
                        <span class="font-semibold">${window.selectedPackage.program}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Package:</span>
                        <span class="font-semibold">${window.selectedPackage.lessons} Lessons</span>
                    </div>
                    ${window.customerEmail ? `
                    <div class="flex justify-between">
                        <span>Email:</span>
                        <span class="font-semibold text-sm">${window.customerEmail}</span>
                    </div>
                    ` : ''}
                    
                    ${window.loyaltyDiscountApplied && window.selectedPackage.originalPrice ? `
                    <div class="border-t pt-2 mt-2">
                        <div class="flex justify-between text-gray-500">
                            <span>Original Price:</span>
                            <span class="line-through">$${window.selectedPackage.originalPrice}</span>
                        </div>
                        <div class="flex justify-between text-green-600 font-semibold">
                            <span>Loyalty Discount (10%):</span>
                            <span>-$${window.selectedPackage.originalPrice - window.selectedPackage.price}</span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="border-t pt-2 mt-2">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span class="text-green-600">$${window.selectedPackage.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.getElementById('pay-button');
    
    if (paymentForm && submitButton) {
        // Prevent default form submission
        paymentForm.onsubmit = function(e) {
            e.preventDefault();
            return false;
        };
        
        submitButton.disabled = true;
        submitButton.textContent = 'Initializing payment...';
        
        try {
            // Create payment intent
            console.log('Creating payment intent...');
            const response = await fetch('/.netlify/functions/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: window.selectedPackage.price * 100,
                    program: window.selectedPackage.program,
                    lessons: window.selectedPackage.lessons,
                    customerEmail: window.customerEmail,
                    isReturningCustomer: window.isReturningCustomer,
                    loyaltyDiscountApplied: window.loyaltyDiscountApplied,
                    originalPrice: window.selectedPackage.originalPrice ? window.selectedPackage.originalPrice * 100 : null
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment initialization failed');
            }
            
            const { clientSecret, packageCode } = await response.json();
            window.recentPackageCode = packageCode;
            console.log('Payment initialized with package code:', packageCode);
            
            // Create Stripe Elements with card-only configuration
            const elements = window.stripe.elements({ 
                clientSecret,
                appearance: { 
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#2284B8',
                    }
                }
            });
            
            // Clear payment div
            const paymentDiv = document.getElementById('payment-element');
            if (paymentDiv) {
                paymentDiv.innerHTML = '';
                
                // Try to set up Payment Request for Apple Pay/Google Pay
                let expressCheckoutAvailable = false;
                
                try {
                    const paymentRequest = window.stripe.paymentRequest({
                        country: 'US',
                        currency: 'usd',
                        total: {
                            label: `SafeStroke ${window.selectedPackage.program} - ${window.selectedPackage.lessons} Lessons`,
                            amount: window.selectedPackage.price * 100,
                        },
                        requestPayerName: true,
                        requestPayerEmail: true,
                    });
                    
                    // Check if express checkout is available
                    const canMakePaymentResult = await paymentRequest.canMakePayment();
                    console.log('Express checkout (Apple/Google Pay) available:', canMakePaymentResult);
                    
                    if (canMakePaymentResult) {
                        // Create container for express checkout
                        const expressContainer = document.createElement('div');
                        expressContainer.id = 'express-checkout-container';
                        expressContainer.className = 'mb-4';
                        paymentDiv.appendChild(expressContainer);
                        
                        // Try to create and mount Payment Request Button
                        const prButton = elements.create('paymentRequestButton', {
                            paymentRequest: paymentRequest
                        });
                        
                        // Wait for button to be ready
                        await new Promise((resolve) => {
                            prButton.on('ready', function() {
                                console.log('Express checkout button ready, mounting...');
                                prButton.mount('#express-checkout-container');
                                expressCheckoutAvailable = true;
                                resolve();
                            });
                            
                            // Timeout after 2 seconds if button doesn't become ready
                            setTimeout(() => {
                                console.log('Express checkout button timeout - not available');
                                resolve();
                            }, 2000);
                        });
                        
                        if (expressCheckoutAvailable) {
                            // Handle express checkout payment
                            paymentRequest.on('paymentmethod', async (ev) => {
                                console.log('Processing express checkout payment...');
                                
                                const {error: confirmError} = await window.stripe.confirmCardPayment(
                                    clientSecret,
                                    {
                                        payment_method: ev.paymentMethod.id,
                                        receipt_email: ev.payerEmail || window.customerEmail
                                    },
                                    { handleActions: false }
                                );
                                
                                if (confirmError) {
                                    ev.complete('fail');
                                    console.error('Express payment failed:', confirmError);
                                    alert('Payment failed: ' + confirmError.message);
                                } else {
                                    ev.complete('success');
                                    console.log('Express payment successful!');
                                    handlePaymentSuccess(packageCode);
                                }
                            });
                            
                            // Add divider between express and card options
                            const divider = document.createElement('div');
                            divider.className = 'flex items-center my-4';
                            divider.innerHTML = `
                                <div class="flex-1 border-t border-gray-300"></div>
                                <span class="px-3 text-sm text-gray-500">or pay with card</span>
                                <div class="flex-1 border-t border-gray-300"></div>
                            `;
                            paymentDiv.appendChild(divider);
                        } else {
                            // Remove empty express container if button didn't mount
                            expressContainer.remove();
                        }
                    } else {
                        console.log('Express checkout not available - showing card only');
                    }
                } catch (error) {
                    console.log('Express checkout setup error (non-fatal):', error.message);
                    // Continue with card-only payment
                }
                
                // Add card payment element
                const cardContainer = document.createElement('div');
                cardContainer.id = 'card-element-container';
                paymentDiv.appendChild(cardContainer);
                
                // Create card-only payment element
                const paymentElement = elements.create('payment', {
                    defaultValues: {
                        billingDetails: {
                            email: window.customerEmail
                        }
                    },
                    wallets: {
                        applePay: 'never', // Disable to avoid duplication with express checkout
                        googlePay: 'never'  // Disable to avoid duplication with express checkout
                    },
                    layout: {
                        type: 'tabs',
                        defaultCollapsed: false
                    }
                });
                
                paymentElement.mount('#card-element-container');
                console.log('Card payment element mounted');
                
                // Log what payment methods are available
                if (expressCheckoutAvailable) {
                    console.log('✅ Payment methods available: Card + Express Checkout (Apple/Google Pay)');
                } else {
                    console.log('✅ Payment methods available: Card only');
                    console.log('ℹ️ Express checkout requires: HTTPS, saved cards, and domain registration in Stripe');
                }
            }
            
            submitButton.textContent = 'Complete Payment';
            submitButton.disabled = false;
            
            // Handle card payment submission
            const processPayment = async function(e) {
                e.preventDefault();
                console.log('Processing card payment...');
                
                submitButton.disabled = true;
                submitButton.textContent = 'Processing payment...';
                
                try {
                    const result = await window.stripe.confirmPayment({
                        elements,
                        confirmParams: {
                            return_url: window.location.href,
                            receipt_email: window.customerEmail
                        },
                        redirect: 'if_required'
                    });
                    
                    if (result.error) {
                        console.error('Payment error:', result.error);
                        
                        // Skip Link-related errors
                        if (!result.error.message?.includes('too many') && 
                            result.error.code !== 'email_verification_failed') {
                            alert('Payment failed: ' + result.error.message);
                        }
                        
                        submitButton.textContent = 'Complete Payment';
                        submitButton.disabled = false;
                    } else {
                        console.log('Payment successful!');
                        handlePaymentSuccess(packageCode);
                    }
                } catch (error) {
                    console.error('Payment processing error:', error);
                    alert('Payment processing failed: ' + error.message);
                    submitButton.textContent = 'Complete Payment';
                    submitButton.disabled = false;
                }
                
                return false;
            };
            
            // Reset initialization flag
            window.paymentFormInitializing = false;
            
            // Attach handlers
            paymentForm.onsubmit = processPayment;
            submitButton.onclick = processPayment;
            
        } catch (error) {
            console.error('Payment setup failed:', error);
            alert('Failed to setup payment: ' + error.message);
            submitButton.textContent = 'Retry Payment Setup';
            submitButton.disabled = false;
            window.paymentFormInitializing = false;
            
            paymentForm.onsubmit = function(e) {
                e.preventDefault();
                window.setupPaymentFormOptimized();
                return false;
            };
        }
    } else {
        console.error('Payment form elements not found');
        window.paymentFormInitializing = false;
    }
};

// Helper function to handle successful payment
function handlePaymentSuccess(packageCode) {
    if (typeof window.showStep === 'function') {
        window.showStep(4);
    }
    const codeDisplay = document.getElementById('package-code-display');
    if (codeDisplay) {
        codeDisplay.textContent = packageCode;
    }
}

// Force override the original setupPaymentForm
if (window.setupPaymentForm) {
    window.setupPaymentFormOriginal = window.setupPaymentForm;
    console.log('Original setupPaymentForm backed up');
}
window.setupPaymentForm = window.setupPaymentFormOptimized;

// Also override immediately after DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.setupPaymentForm = window.setupPaymentFormOptimized;
    console.log('Payment form override confirmed');
});

// Double-check override after a delay
setTimeout(() => {
    window.setupPaymentForm = window.setupPaymentFormOptimized;
    console.log('Payment form override enforced');
}, 100);

console.log('Optimized payment v2.0 (Card + Apple/Google Pay) loaded and enforced');
