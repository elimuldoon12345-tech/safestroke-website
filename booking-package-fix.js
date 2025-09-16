// Fix for package booking email step error
// This fixes the DOM insertion error when selecting a package

// First, ensure showStep function exists and works properly
window.showStepOriginal = window.showStep;
window.showStep = function(stepNumber) {
    console.log('showStep called with:', stepNumber);
    
    // Get or create the step-content container
    let stepContent = document.getElementById('step-content');
    if (!stepContent) {
        const packageFlow = document.getElementById('package-flow');
        if (packageFlow) {
            stepContent = document.createElement('div');
            stepContent.id = 'step-content';
            packageFlow.appendChild(stepContent);
        }
    }
    
    if (stepNumber === 3 && stepContent) {
        // Create payment section HTML
        console.log('Creating payment section HTML');
        stepContent.innerHTML = `
            <div id="payment-section">
                <div class="max-w-lg mx-auto">
                    <h3 class="text-2xl font-bold text-center mb-6">Step 3: Complete Payment</h3>
                    
                    <div id="payment-summary"></div>
                    
                    <form id="payment-form" class="mt-6">
                        <div id="payment-element" class="mb-6">
                            <!-- Stripe payment element will be mounted here -->
                        </div>
                        
                        <button type="submit" id="pay-button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full">
                            Complete Payment
                        </button>
                    </form>
                </div>
            </div>
            
            <div id="success-section" class="hidden">
                <div class="text-center">
                    <div class="text-green-500 mb-4">
                        <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold mb-4">Payment Successful!</h2>
                    <p class="text-lg text-gray-600 mb-6">
                        Your package has been created. We've sent your package code to your email.
                    </p>
                    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                        <p class="text-sm text-gray-600 mb-2">Your Package Code:</p>
                        <p id="package-code-display" class="text-2xl font-bold text-blue-800 font-mono"></p>
                    </div>
                    <button id="book-now-btn" onclick="handleScheduleWithCode()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
                        Book Your First Lesson →
                    </button>
                </div>
            </div>
        `;
        
        // Show payment section, hide others
        const paymentSection = document.getElementById('payment-section');
        const successSection = document.getElementById('success-section');
        const emailStep = document.getElementById('email-step');
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        
        if (paymentSection) paymentSection.classList.remove('hidden');
        if (successSection) successSection.classList.add('hidden');
        if (emailStep) emailStep.classList.add('hidden');
        if (step1) step1.classList.add('hidden');
        if (step2) step2.classList.add('hidden');
        
        // Call setupPaymentForm after creating the elements
        setTimeout(() => {
            if (typeof window.setupPaymentForm === 'function' && !window.paymentFormInitialized) {
                window.paymentFormInitialized = true;
                window.setupPaymentForm();
            }
        }, 100);
        
    } else if (stepNumber === 4 && stepContent) {
        // Show success section
        const paymentSection = document.getElementById('payment-section');
        const successSection = document.getElementById('success-section');
        
        if (paymentSection) paymentSection.classList.add('hidden');
        if (successSection) successSection.classList.remove('hidden');
        
    } else if (typeof window.showStepOriginal === 'function') {
        // Try the original function if it exists
        window.showStepOriginal(stepNumber);
    } else {
        // Handle other steps normally
        // Hide all steps
        const allSteps = ['step-1', 'step-2', 'email-step', 'payment-section', 'success-section'];
        allSteps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        
        // Show requested step
        const stepId = stepNumber === 1 ? 'step-1' : 
                       stepNumber === 2 ? 'step-2' : 
                       stepNumber === 2.5 ? 'email-step' : 
                       'success-section';
        
        const stepEl = document.getElementById(stepId);
        if (stepEl) stepEl.classList.remove('hidden');
    }
    
    // Update step indicators
    if (typeof window.updateStepIndicators === 'function') {
        window.updateStepIndicators(stepNumber);
    }
};

// Add missing global functions that may not exist
if (typeof window.checkReturningCustomerStatus !== 'function') {
    window.checkReturningCustomerStatus = async function(email) {
        try {
            const response = await fetch('/.netlify/functions/check-customer-discount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            if (response.ok) {
                const data = await response.json();
                window.isReturningCustomer = data.eligible;
                
                if (window.isReturningCustomer && !window.appliedPromoCode) {
                    // Apply loyalty discount only if no other promo code is active
                    window.loyaltyDiscountApplied = true;
                    
                    // Update the selected package price with discount
                    const discountedPrice = Math.round(window.selectedPackage.price * 0.9);
                    window.selectedPackage.originalPrice = window.selectedPackage.price;
                    window.selectedPackage.price = discountedPrice;
                    
                    console.log('Loyalty discount applied:', {
                        original: window.selectedPackage.originalPrice,
                        discounted: window.selectedPackage.price,
                        purchaseCount: data.purchaseCount
                    });
                }
            }
        } catch (error) {
            console.error('Failed to check customer status:', error);
            // Continue without discount if check fails
        }
    };
}

if (typeof window.setupPaymentForm !== 'function') {
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
                                <span class="line-through">${window.selectedPackage.originalPrice}</span>
                            </div>
                            <div class="flex justify-between text-green-600 font-semibold">
                                <span>Loyalty Discount (10%):</span>
                                <span>-${window.selectedPackage.originalPrice - window.selectedPackage.price}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="border-t pt-2 mt-2">
                            <div class="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span class="text-green-600">${window.selectedPackage.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Setup payment form button handler
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.onsubmit = async function(event) {
                event.preventDefault();
                
                const submitButton = document.getElementById('pay-button');
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
                
                try {
                    // Create payment intent
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
                        throw new Error('Payment initialization failed');
                    }
                    
                    const { clientSecret, packageCode } = await response.json();
                    window.recentPackageCode = packageCode;
                    
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
                    paymentDiv.innerHTML = '';
                    paymentElement.mount('#payment-element');
                    
                    submitButton.textContent = 'Complete Payment';
                    submitButton.disabled = false;
                    
                    // Update form submit to process payment
                    paymentForm.onsubmit = async function(e) {
                        e.preventDefault();
                        submitButton.disabled = true;
                        submitButton.textContent = 'Processing payment...';
                        
                        const result = await window.stripe.confirmPayment({
                            elements,
                            confirmParams: {
                                return_url: window.location.href,
                                receipt_email: window.customerEmail
                            },
                            redirect: 'if_required'
                        });
                        
                        if (result.error) {
                            alert('Payment failed: ' + result.error.message);
                            submitButton.textContent = 'Complete Payment';
                            submitButton.disabled = false;
                        } else {
                            // Payment successful
                            if (typeof window.showStep === 'function') {
                                window.showStep(4);
                            }
                            const codeDisplay = document.getElementById('package-code-display');
                            if (codeDisplay) {
                                codeDisplay.textContent = packageCode;
                            }
                        }
                    };
                    
                } catch (error) {
                    console.error('Payment setup failed:', error);
                    alert('Failed to setup payment: ' + error.message);
                    submitButton.textContent = 'Complete Payment';
                    submitButton.disabled = false;
                }
            };
        }
    };
}

// Add handleScheduleWithCode function if it doesn't exist
if (typeof window.handleScheduleWithCode !== 'function') {
    window.handleScheduleWithCode = function() {
        const packageCode = document.getElementById('package-code-display')?.textContent || window.recentPackageCode;
        if (packageCode) {
            // Set the package code and trigger the schedule flow
            const packageCodeInput = document.getElementById('package-code-input');
            if (packageCodeInput) {
                packageCodeInput.value = packageCode;
            }
            
            // Hide success section and show calendar
            const successSection = document.getElementById('success-section');
            if (successSection) successSection.classList.add('hidden');
            
            // Show calendar section
            if (typeof window.showCalendarSection === 'function') {
                window.showCalendarSection();
            }
            
            // Update calendar title
            if (typeof window.updateCalendarTitle === 'function') {
                window.updateCalendarTitle(packageCode, {
                    program: window.selectedPackage.program,
                    lessons_remaining: window.selectedPackage.lessons
                });
            }
            
            // Load time slots
            if (typeof window.loadTimeSlots === 'function') {
                window.loadTimeSlots(window.selectedPackage.program);
            }
            
            // Store the entered package code globally
            window.enteredPackageCode = packageCode;
        }
    };
}

// Override the showEmailCollectionStep function
window.showEmailCollectionStepFixed = function() {
    console.log('Using fixed email collection step');
    
    // First check if the email step exists, if not create it
    let emailStep = document.getElementById('email-step');
    
    if (!emailStep) {
        // Create the email step div
        emailStep = document.createElement('div');
        emailStep.id = 'email-step';
        emailStep.className = 'hidden';
        
        // Try different insertion strategies
        const stepContent = document.getElementById('step-content');
        const packageFlow = document.getElementById('package-flow');
        const step2 = document.getElementById('step-2');
        
        if (stepContent) {
            // If step-content exists (created by booking-functions-fix.js), append there
            stepContent.appendChild(emailStep);
        } else if (packageFlow) {
            // Otherwise try to append to package-flow
            packageFlow.appendChild(emailStep);
        } else {
            // Last resort: append to document body in a container
            const container = document.createElement('div');
            container.className = 'max-w-6xl mx-auto p-6';
            container.appendChild(emailStep);
            document.querySelector('main') ? document.querySelector('main').appendChild(container) : document.body.appendChild(container);
        }
    }
    
    // Reset discount flags when showing email step
    window.isReturningCustomer = false;
    window.loyaltyDiscountApplied = false;
    
    // Check if a promo code is applied
    const hasPromoCode = window.appliedPromoCode && window.appliedPromoCode.code;
    
    // Create the email collection form
    emailStep.innerHTML = `
        <div class="max-w-md mx-auto">
            <h3 class="text-2xl font-bold text-center mb-6">Enter Your Email</h3>
            
            <div class="bg-blue-50 p-4 rounded-lg mb-6">
                <p class="text-sm text-blue-800">
                    <strong>Why we need your email:</strong><br>
                    • We'll send your package code immediately<br>
                    • You'll get booking confirmations<br>
                    ${!hasPromoCode ? '• Returning customers save 10%!' : '• Never lose your package code again!'}
                </p>
            </div>
            
            ${!hasPromoCode ? `
            <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-sm text-purple-800 font-semibold">
                        Returning customers automatically get 10% off!
                    </p>
                </div>
            </div>
            ` : ''}
            
            <div class="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 class="font-bold mb-3">Your Selection:</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Program:</span>
                        <span class="font-semibold">${window.selectedPackage?.program || 'Not selected'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Package:</span>
                        <span class="font-semibold">${window.selectedPackage?.lessons || 0} Lessons</span>
                    </div>
                    ${hasPromoCode ? `
                    <div class="flex justify-between text-green-600">
                        <span>Promo Code:</span>
                        <span class="font-semibold">${window.appliedPromoCode.code}</span>
                    </div>
                    ` : ''}
                    <div class="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>$${window.selectedPackage?.price || 0}</span>
                    </div>
                </div>
            </div>
            
            <form id="email-collection-form" class="space-y-4">
                <div>
                    <label for="customer-email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input 
                        type="email" 
                        id="customer-email" 
                        name="email" 
                        required 
                        placeholder="parent@example.com"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                    <p class="text-xs text-gray-500 mt-1">
                        Your package code will be sent to this email
                    </p>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="showStep(2)" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full">
                        ← Back
                    </button>
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
                        Continue to Payment →
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Hide other steps
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const paymentSection = document.getElementById('payment-section');
    
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.add('hidden');
    if (paymentSection) paymentSection.classList.add('hidden');
    
    // Show email step
    emailStep.classList.remove('hidden');
    
    // Update step indicators if the function exists
    if (typeof window.updateStepIndicators === 'function') {
        window.updateStepIndicators(2.5);
    }
    
    // Setup form submission
    const form = document.getElementById('email-collection-form');
    if (form) {
        form.onsubmit = async function(event) {
            event.preventDefault();
            
            const emailInput = document.getElementById('customer-email');
            window.customerEmail = emailInput.value.trim();
            
            if (!window.customerEmail) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Store email
            console.log('Email collected:', window.customerEmail);
            
            // Check if this is a returning customer (for loyalty discount)
            if (typeof window.checkReturningCustomerStatus === 'function') {
                await window.checkReturningCustomerStatus(window.customerEmail);
            }
            
            // Now show payment step
            if (typeof window.showStep === 'function') {
                window.paymentFormInitialized = false; // Reset flag before showing step
                window.showStep(3);
            }
            
            // setupPaymentForm will be called automatically by showStep(3)
            // so we don't need to call it again here
        };
    }
};

// Override the original function
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Applying email step fix...');
        
        // Override showEmailCollectionStep if it exists
        if (typeof window.showEmailCollectionStep === 'function') {
            window.showEmailCollectionStepOriginal = window.showEmailCollectionStep;
            window.showEmailCollectionStep = window.showEmailCollectionStepFixed;
            console.log('showEmailCollectionStep overridden with fix');
        }
        
        // Also override selectPackage to use the fixed function
        if (typeof window.selectPackage === 'function') {
            const originalSelectPackage = window.selectPackage;
            window.selectPackage = function(lessons, price) {
                const currentProgram = window.selectedProgram;
                
                if (!currentProgram) {
                    console.error('No program selected for selectPackage');
                    return;
                }
                
                // Check if a promo code is already applied
                if (window.appliedPromoCode) {
                    window.selectedPackage = {
                        program: currentProgram,
                        lessons: lessons,
                        price: price,
                        hasPromoCode: true
                    };
                } else {
                    window.selectedPackage = {
                        program: currentProgram,
                        lessons: lessons,
                        price: price,
                        hasPromoCode: false
                    };
                }
                
                window.bookingMode = 'package';
                console.log('Package selected:', window.selectedPackage);
                
                // Track package selection if function exists
                if (typeof window.trackPackageSelection === 'function') {
                    window.trackPackageSelection(currentProgram, lessons, price);
                }
                
                // Use the fixed email collection step
                window.showEmailCollectionStepFixed();
            };
            console.log('selectPackage overridden to use fixed email step');
        }
    }, 1500); // Wait a bit longer to ensure everything is loaded
});

console.log('Package booking email step fix loaded');