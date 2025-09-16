// Updated single lesson booking with optimized payment (Card + Apple/Google Pay only)

// Override the handleBookingSubmit function to properly handle single lesson bookings
window.handleBookingSubmitFixed = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Booking...';
    
    const formData = new FormData(form);
    
    // Check if this is a single lesson booking
    if (window.bookingMode === 'single' && !window.enteredPackageCode) {
        
        // Store the form data for use after payment
        window.tempBookingData = {
            studentName: formData.get('studentName'),
            studentBirthdate: formData.get('studentBirthdate'),
            customerName: formData.get('parentName'),
            customerEmail: formData.get('email'),
            customerPhone: formData.get('phone'),
            notes: formData.get('notes')
        };
        
        // FREE SINGLE LESSON
        if (window.singleLessonPrice === 0) {
            console.log('Processing free single lesson booking...');
            
            // First create a free package code
            try {
                const packageResponse = await fetch('/.netlify/functions/create-free-package', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        program: window.singleLessonProgram || window.selectedProgram,
                        promoCode: window.appliedPromoCode?.code || 'FIRST-FREE'
                    })
                });
                
                if (!packageResponse.ok) {
                    throw new Error('Failed to create free package');
                }
                
                const { packageCode } = await packageResponse.json();
                console.log('Free package created:', packageCode);
                
                // Calculate student age from birthdate if provided
                let studentAge = null;
                const birthdate = window.tempBookingData.studentBirthdate;
                if (birthdate) {
                    const birthDate = new Date(birthdate);
                    const today = new Date();
                    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                                       (today.getMonth() - birthDate.getMonth());
                    studentAge = Math.floor(ageInMonths / 12); // Age in years
                    
                    // If under 2 years, provide age in months
                    if (studentAge < 2) {
                        studentAge = `${ageInMonths} months`;
                    } else {
                        studentAge = `${studentAge} years`;
                    }
                }
                
                // Now book with the package code
                const bookingData = {
                    packageCode: packageCode,
                    timeSlotId: window.selectedTimeSlot.id,
                    studentName: window.tempBookingData.studentName,
                    studentAge: studentAge || 'Not specified',
                    customerName: window.tempBookingData.customerName,
                    customerEmail: window.tempBookingData.customerEmail,
                    customerPhone: window.tempBookingData.customerPhone,
                    notes: window.tempBookingData.notes || 'Free single lesson (FIRST-FREE)'
                };
                
                console.log('Booking data being sent:', bookingData);
                
                const bookingResponse = await fetch('/.netlify/functions/book-time-slot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });
                
                if (!bookingResponse.ok) {
                    const error = await bookingResponse.json();
                    throw new Error(error.error || 'Booking failed');
                }
                
                const result = await bookingResponse.json();
                showConfirmation(result);
                
                // Clean up temp data
                delete window.tempBookingData;
                
            } catch (error) {
                console.error('Booking failed:', error);
                alert('Booking failed: ' + error.message + '\n\nPlease try again or contact support at 973-820-1153.');
                submitButton.disabled = false;
                submitButton.textContent = 'Confirm Booking';
            }
        } 
        // PAID SINGLE LESSON - with optimized payment
        else {
            console.log('Processing paid single lesson - need to handle payment first');
            submitButton.textContent = 'Initializing payment...';
            
            try {
                // Create payment intent for single lesson
                const response = await fetch('/.netlify/functions/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: window.singleLessonPrice * 100, // Convert to cents
                        program: window.singleLessonProgram || window.selectedProgram,
                        lessons: 1,
                        customerEmail: window.tempBookingData.customerEmail
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Payment initialization failed');
                }
                
                const { clientSecret, packageCode } = await response.json();
                window.tempPackageCode = packageCode;
                console.log('Payment initialized, package code:', packageCode);
                
                // Initialize Stripe if needed
                let stripe = window.stripe;
                if (!stripe && typeof Stripe !== 'undefined') {
                    const stripeKey = document.querySelector('meta[name="stripe-public-key"]')?.content || 
                                     'pk_test_51S4UnDPRIIfaJZnp1eF8ZlFCD74YDhIU0LVsu3oX3RAy58FBARnucYobBFWf2Wr0wBTZ7smsb1br4ySd2PcfZN4m00oGXz5yQn';
                    stripe = Stripe(stripeKey);
                    window.stripe = stripe;
                    console.log('Stripe initialized');
                }
                
                if (!stripe) {
                    throw new Error('Stripe library not available - please refresh the page');
                }
                
                // Hide the current form and show payment UI
                const formSection = document.getElementById('form-section');
                if (formSection) {
                    formSection.innerHTML = `
                        <div class="max-w-lg mx-auto">
                            <h2 class="text-2xl font-bold text-center mb-6">Complete Payment</h2>
                            
                            <div class="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 class="font-bold mb-3">Order Summary:</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span>Program:</span>
                                        <span class="font-semibold">${window.singleLessonProgram || window.selectedProgram}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Type:</span>
                                        <span class="font-semibold">Single Lesson</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Student:</span>
                                        <span class="font-semibold">${window.tempBookingData.studentName}</span>
                                    </div>
                                    <div class="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>$${window.singleLessonPrice}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="single-payment-element" class="mb-6"></div>
                            
                            <button id="payment-submit-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full">
                                Pay $${window.singleLessonPrice}
                            </button>
                            
                            <p class="text-xs text-gray-500 text-center mt-4">
                                Your card will be charged and you'll receive an email confirmation
                            </p>
                        </div>
                    `;
                }
                
                // Create Stripe Elements with optimized configuration
                const elements = stripe.elements({ 
                    clientSecret,
                    appearance: { 
                        theme: 'stripe',
                        variables: {
                            colorPrimary: '#2284B8',
                        }
                    }
                });
                
                // Set up Payment Request for Apple Pay/Google Pay
                const paymentRequest = stripe.paymentRequest({
                    country: 'US',
                    currency: 'usd',
                    total: {
                        label: `SafeStroke ${window.singleLessonProgram} - Single Lesson`,
                        amount: window.singleLessonPrice * 100,
                    },
                    requestPayerName: true,
                    requestPayerEmail: true,
                });
                
                // Check if express checkout is available
                const canMakePaymentResult = await paymentRequest.canMakePayment();
                
                const paymentDiv = document.getElementById('single-payment-element');
                if (paymentDiv) {
                    paymentDiv.innerHTML = '';
                    
                    // Add express checkout if available
                    if (canMakePaymentResult) {
                        const expressDiv = document.createElement('div');
                        expressDiv.id = 'single-express-checkout';
                        expressDiv.className = 'mb-4';
                        paymentDiv.appendChild(expressDiv);
                        
                        const prButton = elements.create('paymentRequestButton', {
                            paymentRequest: paymentRequest,
                            style: {
                                paymentRequestButton: {
                                    type: 'default',
                                    theme: 'dark',
                                    height: '48px'
                                }
                            }
                        });
                        
                        prButton.on('ready', function() {
                            prButton.mount('#single-express-checkout');
                        });
                        
                        // Handle express checkout payment
                        paymentRequest.on('paymentmethod', async (ev) => {
                            const {error: confirmError} = await stripe.confirmCardPayment(
                                clientSecret,
                                {
                                    payment_method: ev.paymentMethod.id,
                                    receipt_email: ev.payerEmail || window.tempBookingData.customerEmail
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
                                await completeBookingAfterPayment();
                            }
                        });
                        
                        // Add divider
                        const divider = document.createElement('div');
                        divider.className = 'flex items-center my-4';
                        divider.innerHTML = `
                            <div class="flex-1 border-t border-gray-300"></div>
                            <span class="px-3 text-sm text-gray-500">or pay with card</span>
                            <div class="flex-1 border-t border-gray-300"></div>
                        `;
                        paymentDiv.appendChild(divider);
                    }
                    
                    // Add card element container
                    const cardDiv = document.createElement('div');
                    cardDiv.id = 'single-card-element';
                    paymentDiv.appendChild(cardDiv);
                    
                    // Create and mount card payment element
                    const paymentElement = elements.create('payment', {
                        defaultValues: {
                            billingDetails: {
                                email: window.tempBookingData.customerEmail,
                                name: window.tempBookingData.customerName
                            }
                        },
                        wallets: {
                            applePay: 'never',
                            googlePay: 'never'
                        }
                    });
                    
                    paymentElement.mount('#single-card-element');
                }
                
                // Handle card payment submission
                document.getElementById('payment-submit-btn').onclick = async () => {
                    const payBtn = document.getElementById('payment-submit-btn');
                    payBtn.disabled = true;
                    payBtn.textContent = 'Processing...';
                    
                    try {
                        const result = await stripe.confirmPayment({
                            elements,
                            confirmParams: {
                                return_url: window.location.href,
                                receipt_email: window.tempBookingData.customerEmail
                            },
                            redirect: 'if_required'
                        });
                        
                        if (result.error) {
                            // Skip Link-related errors
                            if (!result.error.message?.includes('too many')) {
                                throw new Error(result.error.message);
                            }
                        }
                        
                        // Payment successful, book the slot
                        await completeBookingAfterPayment();
                        
                    } catch (error) {
                        console.error('Payment/booking failed:', error);
                        alert('Error: ' + error.message);
                        payBtn.disabled = false;
                        payBtn.textContent = `Pay $${window.singleLessonPrice}`;
                    }
                };
                
            } catch (error) {
                console.error('Failed to initialize payment:', error);
                alert('Failed to initialize payment: ' + error.message + '\n\nPlease try again or contact support.');
                submitButton.disabled = false;
                submitButton.textContent = 'Confirm Booking';
            }
        }
        
        return; // End of single lesson handling
    }
    
    // Rest of the code for regular package bookings...
    // [Original package booking code continues here]
    
    // For regular package bookings (with existing package code)
    try {
        // Calculate student age from birthdate if provided
        let studentAge = null;
        const birthdate = formData.get('studentBirthdate');
        if (birthdate) {
            const birthDate = new Date(birthdate);
            const today = new Date();
            const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                               (today.getMonth() - birthDate.getMonth());
            studentAge = Math.floor(ageInMonths / 12); // Age in years
            
            // If under 2 years, provide age in months
            if (studentAge < 2) {
                studentAge = `${ageInMonths} months`;
            } else {
                studentAge = `${studentAge} years`;
            }
        }
        
        const bookingData = {
            packageCode: window.enteredPackageCode,
            timeSlotId: window.selectedTimeSlot.id,
            studentName: formData.get('studentName'),
            studentAge: studentAge || 'Not specified',
            customerName: formData.get('parentName'),
            customerEmail: formData.get('email'),
            customerPhone: formData.get('phone'),
            notes: formData.get('notes')
        };
        
        console.log('Booking data being sent:', bookingData);
        
        const response = await fetch('/.netlify/functions/book-time-slot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Booking failed');
        }
        
        const result = await response.json();
        showConfirmation(result);
        
    } catch (error) {
        console.error('Booking failed:', error);
        alert('Booking failed: ' + error.message + '\n\nPlease try again or contact support at 973-820-1153.');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
    }
};

// Helper function to complete booking after payment
async function completeBookingAfterPayment() {
    console.log('Completing booking after payment...');
    
    // Calculate student age
    let studentAge = null;
    const birthdate = window.tempBookingData.studentBirthdate;
    if (birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                           (today.getMonth() - birthDate.getMonth());
        studentAge = Math.floor(ageInMonths / 12);
        
        if (studentAge < 2) {
            studentAge = `${ageInMonths} months`;
        } else {
            studentAge = `${studentAge} years`;
        }
    }
    
    // Book the time slot with the package code
    const bookingData = {
        packageCode: window.tempPackageCode,
        timeSlotId: window.selectedTimeSlot.id,
        studentName: window.tempBookingData.studentName,
        studentAge: studentAge || 'Not specified',
        customerName: window.tempBookingData.customerName,
        customerEmail: window.tempBookingData.customerEmail,
        customerPhone: window.tempBookingData.customerPhone,
        notes: window.tempBookingData.notes || 'Paid single lesson'
    };
    
    const bookingResponse = await fetch('/.netlify/functions/book-time-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    
    if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        // If booking fails due to timing, still show success with package code
        if (error.error && error.error.includes('package')) {
            alert(`Payment successful! Your package code is: ${window.tempPackageCode}\n\nPlease save this code and try booking again in a moment.`);
            location.reload();
            return;
        }
        throw new Error(error.error || 'Booking failed after payment');
    }
    
    const bookingResult = await bookingResponse.json();
    showConfirmation(bookingResult);
    
    // Clean up
    delete window.tempBookingData;
    delete window.tempPackageCode;
}

// Override the form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the original handlers to be set up
    setTimeout(() => {
        console.log('Applying optimized booking form fix...');
        
        // Override the existing handleBookingSubmit
        if (window.handleBookingSubmit) {
            window.handleBookingSubmitOriginal = window.handleBookingSubmit;
            window.handleBookingSubmit = window.handleBookingSubmitFixed;
            console.log('handleBookingSubmit overridden with optimized payment');
        }
        
        // Also watch for dynamically created forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'booking-form') {
                        console.log('Booking form detected, applying optimized fix...');
                        node.onsubmit = window.handleBookingSubmitFixed;
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
    }, 1000);
});

console.log('Single lesson booking with optimized payment loaded');
