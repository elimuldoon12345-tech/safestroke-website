// Optimized payment form with Card + Apple Pay/Google Pay only
// Replaces the previous payment setup with cleaner wallet integration

window.setupPaymentFormOptimized = async function() {
    console.log('Setting up optimized payment form');
    
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
                        colorPrimary: '#2284B8', // SafeStroke brand blue
                    }
                }
            });
            
            // First, set up Payment Request for Apple Pay/Google Pay
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
            
            // Check if Apple Pay/Google Pay is available
            const canMakePaymentResult = await paymentRequest.canMakePayment();
            
            // Add express checkout button if available
            const paymentDiv = document.getElementById('payment-element');
            if (paymentDiv) {
                paymentDiv.innerHTML = '';
                
                // Add express checkout section if available
                if (canMakePaymentResult) {
                    const expressCheckoutDiv = document.createElement('div');
                    expressCheckoutDiv.id = 'express-checkout-container';
                    expressCheckoutDiv.className = 'mb-4';
                    expressCheckoutDiv.innerHTML = `
                        <div class="text-center mb-3">
                            <p class="text-sm text-gray-600">Express checkout</p>
                        </div>
                    `;
                    paymentDiv.appendChild(expressCheckoutDiv);
                    
                    // Create and mount Payment Request Button
                    const prButton = elements.create('paymentRequestButton', {
                        paymentRequest: paymentRequest,
                        style: {
                            paymentRequestButton: {
                                type: 'default', // Shows Apple Pay or Google Pay based on browser
                                theme: 'dark',
                                height: '48px'
                            }
                        }
                    });
                    
                    // Check if the Payment Request Button can be used
                    prButton.on('ready', function() {
                        prButton.mount('#express-checkout-container');
                    });
                    
                    // Handle Payment Request submission
                    paymentRequest.on('paymentmethod', async (ev) => {
                        console.log('Payment Request submitted');
                        
                        // Confirm the PaymentIntent with the payment method returned
                        const {error: confirmError} = await window.stripe.confirmCardPayment(
                            clientSecret,
                            {
                                payment_method: ev.paymentMethod.id,
                                receipt_email: ev.payerEmail || window.customerEmail
                            },
                            {
                                handleActions: false
                            }
                        );
                        
                        if (confirmError) {
                            ev.complete('fail');
                            console.error('Payment failed:', confirmError);
                            alert('Payment failed: ' + confirmError.message);
                        } else {
                            ev.complete('success');
                            console.log('Payment successful via express checkout!');
                            handlePaymentSuccess(packageCode);
                        }
                    });
                    
                    // Add divider
                    const dividerDiv = document.createElement('div');
                    dividerDiv.className = 'flex items-center my-4';
                    dividerDiv.innerHTML = `
                        <div class="flex-1 border-t border-gray-300"></div>
                        <span class="px-3 text-sm text-gray-500">or pay with card</span>
                        <div class="flex-1 border-t border-gray-300"></div>
                    `;
                    paymentDiv.appendChild(dividerDiv);
                } else {
                    console.log('Express checkout not available on this device/browser');
                }
                
                // Add card payment element container
                const cardElementDiv = document.createElement('div');
                cardElementDiv.id = 'card-element-container';
                paymentDiv.appendChild(cardElementDiv);
                
                // Create and mount card-only payment element
                const paymentElement = elements.create('payment', {
                    defaultValues: {
                        billingDetails: {
                            email: window.customerEmail
                        }
                    },
                    wallets: {
                        applePay: 'never', // Disable in payment element since we have express checkout
                        googlePay: 'never'  // Disable in payment element since we have express checkout
                    },
                    layout: {
                        type: 'tabs',
                        defaultCollapsed: false
                    }
                });
                
                paymentElement.mount('#card-element-container');
                console.log('Payment element mounted');
            }
            
            submitButton.textContent = 'Complete Payment';
            submitButton.disabled = false;
            
            // Handle regular card payment submission
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

// Override the original setupPaymentForm with optimized version
window.setupPaymentForm = window.setupPaymentFormOptimized;

console.log('Optimized payment (Card + Apple/Google Pay only) loaded');
