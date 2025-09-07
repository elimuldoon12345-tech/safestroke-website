// SafeStroke Complete Booking System
// This replaces the existing booking-logic.js with full functionality

// --- Configuration ---
const PROGRAM_INFO = {
    'Droplet': { 
        ageRange: '3-24 months',
        description: 'Parent & Child classes',
        color: '#60A5FA' // Blue
    },
    'Splashlet': { 
        ageRange: '2-3 years',
        description: 'First independent lessons',
        color: '#34D399' // Green
    },
    'Strokelet': { 
        ageRange: '3-12 years',
        description: 'Skill development',
        color: '#F59E0B' // Orange
    }
};

const PACKAGE_PRICING = {
    'Droplet': { 4: 112, 6: 162, 8: 200 },
    'Splashlet': { 4: 152, 6: 222, 8: 280 },
    'Strokelet': { 4: 172, 6: 252, 8: 320 }
};

// --- Global State ---
let selectedProgram = null;
let selectedPackage = null;
let enteredPackageCode = null;
let selectedTimeSlot = null;
let stripe = null;
let elements = null;
let paymentElement = null;
let currentCalendarMonth = new Date();

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('SafeStroke Booking System v2.0 Initialized');
    initializeMobileMenu();
    initializeBookingFlow();
    initializeStripe();
    
    // Set current month to October 2025 for demo (adjust as needed)
    currentCalendarMonth = new Date('2025-10-01');
});

// --- Initialization Functions ---
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function initializeBookingFlow() {
    // Program selection cards
    document.querySelectorAll('#step-1 .step-card').forEach(card => {
        card.addEventListener('click', handleProgramSelection);
    });
    
    // Navigation buttons
    const backToPrograms = document.getElementById('back-to-programs');
    if (backToPrograms) {
        backToPrograms.addEventListener('click', () => {
            showStep(1);
        });
    }
    
    const backToPackages = document.getElementById('back-to-packages');
    if (backToPackages) {
        backToPackages.addEventListener('click', () => {
            showStep(2);
        });
    }
    
    // Schedule with code button
    const scheduleButton = document.getElementById('schedule-with-code-btn');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', handleScheduleWithCode);
    }
    
    // Book now after payment button
    const bookNowButton = document.getElementById('book-now-btn');
    if (bookNowButton) {
        bookNowButton.addEventListener('click', () => {
            const code = document.getElementById('package-code-display').textContent;
            document.getElementById('package-code-input').value = code;
            handleScheduleWithCode();
        });
    }
}

function initializeStripe() {
    const stripeKey = document.querySelector('meta[name="stripe-public-key"]')?.content || 
                     'pk_test_51S4UnDPRIIfaJZnp1eF8ZlFCD74YDhIU0LVsu3oX3RAy58FBARnucYobBFWf2Wr0wBTZ7smsb1br4ySd2PcfZN4m00oGXz5yQn';
    
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe(stripeKey);
        console.log('Stripe initialized successfully');
    } else {
        console.error('Stripe library not loaded');
    }
}

// --- Event Handlers ---
function handleProgramSelection(event) {
    selectedProgram = event.currentTarget.dataset.programName;
    console.log('Program selected:', selectedProgram);
    showStep(2);
    renderPackages();
}

async function handleScheduleWithCode() {
    const codeInput = document.getElementById('package-code-input');
    const code = codeInput.value.trim();
    const errorMsg = document.getElementById('code-error-message');
    
    if (!code) {
        showError(errorMsg, 'Please enter a package code');
        return;
    }
    
    hideError(errorMsg);
    showCalendarSection();
    
    try {
        // Validate package code with retries for recent payments
        let packageData = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
            const response = await fetch(`/.netlify/functions/validate-package?code=${code}`);
            const data = await response.json();
            
            if (response.ok && data.valid) {
                packageData = data;
                break;
            }
            
            // Retry if this is a recent payment
            if (window.recentPackageCode === code && attempts < maxAttempts - 1) {
                console.log(`Attempt ${attempts + 1}: Waiting for payment confirmation...`);
                updateCalendarLoading(`Confirming payment... (Attempt ${attempts + 1}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } else {
                throw new Error(data.error || 'Invalid package code');
            }
        }
        
        if (!packageData || !packageData.valid) {
            throw new Error('Package validation failed');
        }
        
        enteredPackageCode = code;
        selectedProgram = packageData.program;
        
        // Display package info
        updateCalendarTitle(code, packageData);
        
        // Load available time slots
        await loadTimeSlots(packageData.program);
        
    } catch (error) {
        console.error('Code validation failed:', error);
        showError(errorMsg, error.message);
        resetToInitialState();
    }
}

// --- UI Rendering Functions ---
function showStep(stepNumber) {
    // Hide all steps
    ['step-1', 'step-2', 'payment-section', 'success-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Show requested step
    const stepId = stepNumber === 1 ? 'step-1' : 
                   stepNumber === 2 ? 'step-2' : 
                   stepNumber === 3 ? 'payment-section' : 
                   'success-section';
    
    const stepEl = document.getElementById(stepId);
    if (stepEl) stepEl.classList.remove('hidden');
    
    // Update step indicators
    updateStepIndicators(stepNumber);
}

function updateStepIndicators(activeStep) {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        if (indicator) {
            indicator.classList.remove('active', 'completed', 'bg-blue-100', 'text-blue-800', 'bg-gray-200', 'text-gray-500');
            
            if (i < activeStep) {
                indicator.classList.add('completed', 'bg-green-500', 'text-white');
            } else if (i === activeStep) {
                indicator.classList.add('active', 'bg-blue-500', 'text-white');
            } else {
                indicator.classList.add('bg-gray-200', 'text-gray-500');
            }
        }
    }
}

function renderPackages() {
    const container = document.getElementById('package-container');
    const pricing = PACKAGE_PRICING[selectedProgram];
    
    container.innerHTML = `
        <div class="text-center mb-8">
            <h3 class="text-2xl font-bold">${selectedProgram} Packages</h3>
            <p class="text-gray-600">${PROGRAM_INFO[selectedProgram].description}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${[4, 6, 8].map(lessons => `
                <div class="package-card bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer">
                    <div class="text-center">
                        <h4 class="text-xl font-bold mb-2">${lessons} Lessons</h4>
                        ${lessons === 6 ? '<span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">Most Popular</span>' : 
                          lessons === 8 ? '<span class="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-3">Best Value</span>' : 
                          '<div class="mb-3">&nbsp;</div>'}
                        <div class="text-3xl font-bold mb-1">$${pricing[lessons]}</div>
                        <div class="text-gray-500 text-sm mb-4">$${(pricing[lessons] / lessons).toFixed(0)} per lesson</div>
                        <button class="purchase-btn w-full brand-blue-bg hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition"
                                data-lessons="${lessons}" data-price="${pricing[lessons]}">
                            Select Package
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click handlers
    container.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lessons = parseInt(e.target.dataset.lessons);
            const price = parseInt(e.target.dataset.price);
            selectPackage(lessons, price);
        });
    });
}

function selectPackage(lessons, price) {
    selectedPackage = {
        program: selectedProgram,
        lessons: lessons,
        price: price
    };
    console.log('Package selected:', selectedPackage);
    showStep(3);
    setupPaymentForm();
}

async function setupPaymentForm() {
    if (!stripe || !selectedPackage) {
        console.error('Stripe not initialized or no package selected');
        return;
    }
    
    // Display payment summary
    document.getElementById('payment-summary').innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Program:</span>
                    <span class="font-semibold">${selectedPackage.program}</span>
                </div>
                <div class="flex justify-between">
                    <span>Package:</span>
                    <span class="font-semibold">${selectedPackage.lessons} Lessons</span>
                </div>
                <div class="border-t pt-2 mt-2">
                    <div class="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>$${selectedPackage.price}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup payment form
    const paymentDiv = document.getElementById('payment-element');
    paymentDiv.innerHTML = `
        <div class="bg-blue-50 p-4 rounded-lg text-center">
            <p class="text-blue-800">Click "Complete Payment" to proceed with secure checkout</p>
        </div>
    `;
    
    // Setup form submission
    const form = document.getElementById('payment-form');
    form.onsubmit = handlePaymentSubmit;
}

async function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const submitButton = document.getElementById('pay-button');
    const paymentDiv = document.getElementById('payment-element');
    
    if (!paymentElement) {
        // Create payment intent first
        submitButton.disabled = true;
        submitButton.textContent = 'Initializing payment...';
        
        try {
            const response = await fetch('/.netlify/functions/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: selectedPackage.price * 100,
                    program: selectedPackage.program,
                    lessons: selectedPackage.lessons
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Payment initialization failed');
            }
            
            const { clientSecret, packageCode } = await response.json();
            window.recentPackageCode = packageCode;
            
            // Create Stripe Elements
            elements = stripe.elements({ clientSecret });
            paymentElement = elements.create('payment');
            
            // Mount payment element
            paymentDiv.innerHTML = '';
            paymentElement.mount('#payment-element');
            
            submitButton.textContent = 'Complete Payment';
            submitButton.disabled = false;
            
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Failed to initialize payment: ' + error.message);
            submitButton.textContent = 'Complete Payment';
            submitButton.disabled = false;
        }
        
        return;
    }
    
    // Process payment
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href
            },
            redirect: 'if_required'
        });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        // Payment successful
        showStep(4);
        document.getElementById('package-code-display').textContent = window.recentPackageCode;
        
    } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + error.message);
        submitButton.textContent = 'Complete Payment';
        submitButton.disabled = false;
    }
}

// --- Calendar Functions ---
function showCalendarSection() {
    document.getElementById('existing-customer-path').classList.add('hidden');
    document.getElementById('new-customer-path').classList.add('hidden');
    document.getElementById('calendar-section').classList.remove('hidden');
    updateCalendarLoading('Loading available times...');
}

function updateCalendarLoading(message) {
    const loadingDiv = document.getElementById('calendar-loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `<p class="text-lg text-gray-600">${message}</p>`;
        loadingDiv.classList.remove('hidden');
    }
}

function updateCalendarTitle(code, packageData) {
    const titleEl = document.getElementById('calendar-title');
    if (titleEl) {
        titleEl.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-2">Schedule Your Lessons</h2>
                <div class="flex items-center justify-center gap-4 text-sm">
                    <span class="bg-gray-100 px-3 py-1 rounded-full">Code: <strong>${code}</strong></span>
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">${packageData.program}</span>
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">${packageData.lessons_remaining} lessons remaining</span>
                </div>
            </div>
        `;
    }
}

async function loadTimeSlots(program) {
    try {
        const response = await fetch(`/.netlify/functions/get-time-slots?program=${program}&month=${currentCalendarMonth.toISOString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load time slots');
        }
        
        const timeSlots = await response.json();
        
        // Debug: Log the raw data received from API
        console.log('=== Time Slots Loaded ===');
        console.log(`Program: ${program}`);
        console.log(`Total slots received: ${timeSlots.length}`);
        
        // Group by date for debugging
        const slotsByDateDebug = {};
        timeSlots.forEach(slot => {
            const date = slot.date.split('T')[0];
            if (!slotsByDateDebug[date]) {
                slotsByDateDebug[date] = [];
            }
            slotsByDateDebug[date].push({
                id: slot.id,
                time: slot.start_time,
                enrollment: slot.current_enrollment,
                capacity: slot.max_capacity,
                available: slot.max_capacity - slot.current_enrollment
            });
        });
        
        console.log('Slots grouped by date:', slotsByDateDebug);
        
        renderCalendar(timeSlots);
        
    } catch (error) {
        console.error('Failed to load time slots:', error);
        document.getElementById('calendar-container').innerHTML = `
            <div class="text-center text-red-600 p-8">
                <p>Failed to load available times. Please try again.</p>
            </div>
        `;
        document.getElementById('calendar-container').classList.remove('hidden');
        document.getElementById('calendar-loading').classList.add('hidden');
    }
}

function renderCalendar(timeSlots) {
    const container = document.getElementById('calendar-container');
    const loadingDiv = document.getElementById('calendar-loading');
    
    loadingDiv.classList.add('hidden');
    
    // Group time slots by date
    const slotsByDate = {};
    timeSlots.forEach(slot => {
        const date = slot.date.split('T')[0];
        if (!slotsByDate[date]) {
            slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot);
    });
    
    // Create calendar HTML
    let html = `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <button onclick="changeMonth(-1)" class="p-2 hover:bg-gray-100 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h3 class="text-xl font-bold">
                    ${currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button onclick="changeMonth(1)" class="p-2 hover:bg-gray-100 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            
            <div class="grid grid-cols-7 gap-1 mb-2">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
                    `<div class="text-center text-sm font-semibold text-gray-600 py-2">${day}</div>`
                ).join('')}
            </div>
            
            <div class="grid grid-cols-7 gap-1">
                ${generateCalendarDays(currentCalendarMonth, slotsByDate)}
            </div>
        </div>
        
        <div id="selected-date-slots" class="mt-6"></div>
    `;
    
    container.innerHTML = html;
    container.classList.remove('hidden');
}

function generateCalendarDays(month, slotsByDate) {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();
    
    let html = '';
    
    // Add padding for start of month
    for (let i = 0; i < startPadding; i++) {
        html += '<div></div>';
    }
    
    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const slots = slotsByDate[dateStr] || [];
        
        // FIXED: Count available slots for THIS SPECIFIC DATE only
        const availableSlots = slots.filter(s => 
            s.current_enrollment < s.max_capacity
        );
        const availableCount = availableSlots.length;
        const hasAvailable = availableCount > 0;
        
        // Debug logging for October 5th and other Sundays
        if (date.getDay() === 0) { // If it's a Sunday
            console.log(`Sunday ${dateStr}: Total slots: ${slots.length}, Available: ${availableCount}`);
            if (slots.length > 0) {
                console.log('Slot details:', slots.map(s => ({
                    id: s.id,
                    enrollment: s.current_enrollment,
                    capacity: s.max_capacity
                })));
            }
        }
        
        const dayOfWeek = date.getDay();
        const isClassDay = dayOfWeek === 0 || dayOfWeek === 1; // Sunday or Monday
        
        let className = 'min-h-[80px] p-2 border rounded-lg ';
        
        if (!isClassDay) {
            className += 'bg-gray-50 cursor-not-allowed';
        } else if (hasAvailable) {
            className += 'bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer';
        } else if (slots.length > 0) {
            className += 'bg-red-50 border-red-300 cursor-not-allowed';
        } else {
            className += 'bg-gray-50 cursor-not-allowed';
        }
        
        html += `
            <div class="${className}" ${hasAvailable ? `onclick="showDateSlots('${dateStr}')"` : ''}>
                <div class="font-semibold text-sm">${day}</div>
                ${isClassDay ? `
                    <div class="text-xs mt-1">
                        ${hasAvailable ? 
                            `<span class="text-green-600">${availableCount} slots</span>` :
                            slots.length > 0 ? 
                                '<span class="text-red-600">Full</span>' : 
                                '<span class="text-gray-400">No class</span>'
                        }
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    return html;
}

window.changeMonth = function(direction) {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + direction);
    loadTimeSlots(selectedProgram);
};

window.showDateSlots = async function(dateStr) {
    const container = document.getElementById('selected-date-slots');
    const date = new Date(dateStr + 'T00:00:00');
    
    try {
        const response = await fetch(`/.netlify/functions/get-time-slots?program=${selectedProgram}&date=${dateStr}`);
        const slots = await response.json();
        
        const availableSlots = slots.filter(s => s.current_enrollment < s.max_capacity);
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h4 class="text-lg font-bold mb-4">
                    Available times for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${availableSlots.map(slot => `
                        <button onclick="selectTimeSlot('${slot.id}', '${slot.date}', '${slot.start_time}')" 
                                class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
                            <div class="font-semibold">
                                ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}
                            </div>
                            <div class="text-sm text-gray-600 mt-1">
                                Group ${slot.group_number} • ${slot.max_capacity - slot.current_enrollment} spots left
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Failed to load slots for date:', error);
        container.innerHTML = '<div class="text-red-600 text-center p-4">Failed to load time slots</div>';
    }
};

window.selectTimeSlot = function(slotId, date, time) {
    selectedTimeSlot = { id: slotId, date: date, time: time };
    showBookingForm();
};

function showBookingForm() {
    document.getElementById('calendar-section').classList.add('hidden');
    document.getElementById('form-section').classList.remove('hidden');
    
    const container = document.getElementById('form-container');
    const dateTime = new Date(`${selectedTimeSlot.date}T${selectedTimeSlot.time}`);
    
    container.innerHTML = `
        <form id="booking-form" class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg mb-6">
                <p class="text-center">
                    <strong>Selected Time:</strong><br>
                    ${dateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}<br>
                    ${formatTime(selectedTimeSlot.time)}
                </p>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input type="text" name="studentName" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student Age</label>
                <input type="number" name="studentAge" min="0" max="18"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name *</label>
                <input type="text" name="parentName" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" name="phone" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Special Notes (optional)</label>
                <textarea name="notes" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Any special requirements, medical conditions, etc."></textarea>
            </div>
            
            <div class="pt-4">
                <button type="submit" class="w-full brand-blue-bg hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition">
                    Confirm Booking
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('booking-form').onsubmit = handleBookingSubmit;
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Booking...';
    
    const formData = new FormData(form);
    const bookingData = {
        packageCode: enteredPackageCode,
        timeSlotId: selectedTimeSlot.id,
        studentName: formData.get('studentName'),
        studentAge: formData.get('studentAge'),
        customerName: formData.get('parentName'),
        customerEmail: formData.get('email'),
        customerPhone: formData.get('phone'),
        notes: formData.get('notes')
    };
    
    try {
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
        alert('Booking failed: ' + error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
    }
}

function showConfirmation(bookingResult) {
    document.getElementById('form-section').classList.add('hidden');
    document.getElementById('confirmation-message').classList.remove('hidden');
    
    const confirmDiv = document.getElementById('confirmation-message');
    confirmDiv.innerHTML = `
        <div class="text-center">
            <div class="text-green-500 mb-4">
                <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h2 class="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p class="text-lg text-gray-600 mb-6">
                Your lesson has been successfully booked. We've sent a confirmation email with all the details.
            </p>
            <div class="bg-gray-50 p-6 rounded-lg text-left max-w-md mx-auto">
                <h3 class="font-bold mb-3">Booking Details:</h3>
                <div class="space-y-2 text-sm">
                    <div><strong>Booking ID:</strong> ${bookingResult.bookingId}</div>
                    <div><strong>Lessons Remaining:</strong> ${bookingResult.lessonsRemaining}</div>
                </div>
            </div>
            <div class="mt-8 space-x-4">
                <button onclick="location.reload()" class="brand-blue-bg hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full">
                    Book Another Lesson
                </button>
                <a href="index.html" class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full">
                    Return Home
                </a>
            </div>
        </div>
    `;
}

// --- Helper Functions ---
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

function hideError(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

function resetToInitialState() {
    document.getElementById('existing-customer-path').classList.remove('hidden');
    document.getElementById('new-customer-path').classList.remove('hidden');
    document.getElementById('calendar-section').classList.add('hidden');
    document.getElementById('form-section').classList.add('hidden');
    document.getElementById('confirmation-message').classList.add('hidden');
}