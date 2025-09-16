// Fix for package booking payment form submission
// This ensures payment is processed correctly without page reload

// Override setupPaymentForm to initialize payment immediately
window.setupPaymentForm = async function() {
    console.log('Setting up payment form for package');
    
    if (!window.stripe || !window.selectedPackage) {
        console.error('Stripe not initialized or no package selected');
        if (!window.stripe && typeof Stripe !== 'undefined') {
            // Try to initialize Stripe
            const stripeKey = document.querySelector('meta[name="stripe-public-key"]')?.content || 
                             'pk_test_51S4UnDPRIIfaJZnp1eF8ZlFCD74YDhIU0LVsu3oX3RAy58FBARnucYobBFWf2Wr0wBTZ7smsb1br4ySd2PcfZN4m00oGXz5yQn';
            window.stripe = Stripe(stripeKey);
        }
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
    
    // Initialize payment form and Stripe elements immediately
    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.getElementById('pay-button');
    
    if (paymentForm && submitButton) {
        // Prevent any default form submission
        paymentForm.onsubmit = function(e) {
            e.preventDefault();
            return false;
        };
        
        // Initialize payment
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
            
            // Create Stripe Elements
            const elements = window.stripe.elements({ 
                clientSecret,
                appearance: { theme: 'stripe' }
            });
            
            // Create and mount payment element
            const paymentElement = elements.create('payment', {
                defaultValues: {
                    billingDetails: {
                        email: window.customerEmail
                    }
                }
            });
            
            const paymentDiv = document.getElementById('payment-element');
            if (paymentDiv) {
                paymentDiv.innerHTML = '';
                paymentElement.mount('#payment-element');
                console.log('Payment element mounted');
            }
            
            submitButton.textContent = 'Complete Payment';
            submitButton.disabled = false;
            
            // Set up the actual payment processing handler
            const processPayment = async function(e) {
                e.preventDefault();
                console.log('Processing payment...');
                
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
                        alert('Payment failed: ' + result.error.message);
                        submitButton.textContent = 'Complete Payment';
                        submitButton.disabled = false;
                    } else {
                        console.log('Payment successful!');
                        // Payment successful - show success step
                        if (typeof window.showStep === 'function') {
                            window.showStep(4);
                        }
                        const codeDisplay = document.getElementById('package-code-display');
                        if (codeDisplay) {
                            codeDisplay.textContent = packageCode;
                        }
                    }
                } catch (error) {
                    console.error('Payment processing error:', error);
                    alert('Payment processing failed: ' + error.message);
                    submitButton.textContent = 'Complete Payment';
                    submitButton.disabled = false;
                }
                
                return false;
            };
            
            // Attach handler to both form and button
            paymentForm.onsubmit = processPayment;
            submitButton.onclick = processPayment;
            
        } catch (error) {
            console.error('Payment setup failed:', error);
            alert('Failed to setup payment: ' + error.message);
            submitButton.textContent = 'Retry Payment Setup';
            submitButton.disabled = false;
            
            // Set a handler to retry setup
            paymentForm.onsubmit = function(e) {
                e.preventDefault();
                window.setupPaymentForm(); // Retry setup
                return false;
            };
        }
    } else {
        console.error('Payment form elements not found');
    }
};

// Ensure setupPaymentForm is called when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Package payment fix loaded');
});

console.log('Package booking payment fix ready');