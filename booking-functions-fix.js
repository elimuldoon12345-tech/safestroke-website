// Fixed Booking Flow Functions
// This file replaces the existing booking-functions-fix.js

// Define these functions immediately so they're available for onclick handlers
window.startSingleLessonFlow = function() {
    console.log('Starting single lesson flow...');
    
    // Hide the choice cards
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => card.parentElement.style.display = 'none');
    
    // Show single lesson flow container
    const singleLessonFlow = document.getElementById('single-lesson-flow');
    if (singleLessonFlow) {
        singleLessonFlow.classList.remove('hidden');
        
        // Render the single lesson content
        singleLessonFlow.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Back Button -->
                <button onclick="backToOptions()" class="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to options
                </button>
                
                <h2 class="text-3xl font-bold text-center mb-8">Select Your Program</h2>
                
                <!-- Promo Code Section -->
                <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200">
                    <h3 class="font-bold text-lg mb-3">Have a promo code?</h3>
                    <div class="flex gap-3">
                        <input type="text" 
                               id="single-promo-input" 
                               placeholder="Enter code (e.g., FIRST-FREE)"
                               class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <button onclick="applySingleLessonPromo()" 
                                class="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg">
                            Apply
                        </button>
                    </div>
                    <div id="single-promo-message" class="hidden mt-2"></div>
                </div>
                
                <!-- Program Cards -->
                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Droplet Card -->
                    <div onclick="selectSingleLessonProgram('Droplet')" 
                         class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">👶</span>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Droplet</h3>
                            <p class="text-sm text-gray-600 mb-4">3-24 months<br>Parent & Child</p>
                            <div id="droplet-price">
                                <p class="text-2xl font-bold text-blue-600">$30</p>
                                <p class="text-sm text-gray-500">per lesson</p>
                            </div>
                            <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                Select Program
                            </button>
                        </div>
                    </div>
                    
                    <!-- Splashlet Card -->
                    <div onclick="selectSingleLessonProgram('Splashlet')" 
                         class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">🏊</span>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Splashlet</h3>
                            <p class="text-sm text-gray-600 mb-4">2-3 years<br>First independent</p>
                            <div id="splashlet-price">
                                <p class="text-2xl font-bold text-blue-600">$40</p>
                                <p class="text-sm text-gray-500">per lesson</p>
                            </div>
                            <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                Select Program
                            </button>
                        </div>
                    </div>
                    
                    <!-- Strokelet Card -->
                    <div onclick="selectSingleLessonProgram('Strokelet')" 
                         class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">🏅</span>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Strokelet</h3>
                            <p class="text-sm text-gray-600 mb-4">3-12 years<br>Skill development</p>
                            <div id="strokelet-price">
                                <p class="text-2xl font-bold text-blue-600">$45</p>
                                <p class="text-sm text-gray-500">per lesson</p>
                            </div>
                            <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                Select Program
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Set booking mode globally
    window.bookingMode = 'single';
};

window.startPackageFlow = function() {
    console.log('Starting package flow...');
    
    // Hide the choice cards
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => card.parentElement.style.display = 'none');
    
    // Show package flow container
    const packageFlow = document.getElementById('package-flow');
    if (packageFlow) {
        packageFlow.classList.remove('hidden');
        
        // Show step 1 content
        const stepContent = document.getElementById('step-content');
        if (stepContent) {
            stepContent.innerHTML = `
                <!-- Step 1: Select Program -->
                <div id="step-1">
                    <div class="max-w-4xl mx-auto">
                        <!-- Back Button -->
                        <button onclick="backToOptions()" class="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to options
                        </button>
                        
                        <h3 class="text-2xl font-bold text-center mb-8">Step 1: Select Your Program</h3>
                        
                        <div class="grid md:grid-cols-3 gap-6">
                            <!-- Droplet Program -->
                            <div onclick="selectProgram('Droplet')" 
                                 class="step-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6"
                                 data-program-name="Droplet">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span class="text-2xl">👶</span>
                                    </div>
                                    <h4 class="text-xl font-bold mb-2">Droplet</h4>
                                    <p class="text-sm text-gray-600 mb-2">3-24 months</p>
                                    <p class="text-xs text-gray-500 mb-4">Parent & Child classes for water introduction</p>
                                    <div class="border-t pt-3">
                                        <p class="text-sm font-semibold">Starting at</p>
                                        <p class="text-2xl font-bold text-blue-600">$28/lesson</p>
                                        <p class="text-xs text-gray-500">in 4-lesson package</p>
                                    </div>
                                    <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                        Select Program
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Splashlet Program -->
                            <div onclick="selectProgram('Splashlet')" 
                                 class="step-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6"
                                 data-program-name="Splashlet">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span class="text-2xl">🏊</span>
                                    </div>
                                    <h4 class="text-xl font-bold mb-2">Splashlet</h4>
                                    <p class="text-sm text-gray-600 mb-2">2-3 years</p>
                                    <p class="text-xs text-gray-500 mb-4">First independent swimming lessons</p>
                                    <div class="border-t pt-3">
                                        <p class="text-sm font-semibold">Starting at</p>
                                        <p class="text-2xl font-bold text-blue-600">$35/lesson</p>
                                        <p class="text-xs text-gray-500">in 4-lesson package</p>
                                    </div>
                                    <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                        Select Program
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Strokelet Program -->
                            <div onclick="selectProgram('Strokelet')" 
                                 class="step-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 p-6"
                                 data-program-name="Strokelet">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span class="text-2xl">🏅</span>
                                    </div>
                                    <h4 class="text-xl font-bold mb-2">Strokelet</h4>
                                    <p class="text-sm text-gray-600 mb-2">3-12 years</p>
                                    <p class="text-xs text-gray-500 mb-4">Skill development & stroke technique</p>
                                    <div class="border-t pt-3">
                                        <p class="text-sm font-semibold">Starting at</p>
                                        <p class="text-2xl font-bold text-blue-600">$40/lesson</p>
                                        <p class="text-xs text-gray-500">in 4-lesson package</p>
                                    </div>
                                    <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                                        Select Program
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Step 2: Select Package (Hidden initially) -->
                <div id="step-2" class="hidden">
                    <div class="max-w-4xl mx-auto">
                        <button onclick="showStep(1)" class="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to programs
                        </button>
                        
                        <h3 class="text-2xl font-bold text-center mb-8">Step 2: Choose Your Package</h3>
                        
                        <div id="package-container" class="grid md:grid-cols-3 gap-6">
                            <!-- Package options will be rendered here -->
                        </div>
                    </div>
                </div>
                
                <!-- Email Collection Step (Hidden initially) -->
                <div id="email-step" class="hidden">
                    <!-- Email form will be rendered here -->
                </div>
                
                <!-- Step 3: Payment (Hidden initially) -->
                <div id="payment-section" class="hidden">
                    <div class="max-w-lg mx-auto">
                        <h3 class="text-2xl font-bold text-center mb-6">Step 3: Payment</h3>
                        
                        <div id="payment-summary">
                            <!-- Payment summary will be rendered here -->
                        </div>
                        
                        <form id="payment-form">
                            <div id="payment-element" class="mb-6">
                                <!-- Stripe payment element will be mounted here -->
                            </div>
                            
                            <button type="submit" id="pay-button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg">
                                Complete Payment
                            </button>
                        </form>
                    </div>
                </div>
                
                <!-- Step 4: Success (Hidden initially) -->
                <div id="success-section" class="hidden">
                    <div class="text-center">
                        <div class="text-green-500 mb-4">
                            <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold mb-4">Payment Successful!</h2>
                        <p class="text-lg text-gray-600 mb-6">Your package has been created. Use the code below to book your lessons:</p>
                        
                        <div class="bg-gray-100 rounded-lg p-6 max-w-md mx-auto">
                            <p class="text-sm text-gray-600 mb-2">Your Package Code:</p>
                            <p id="package-code-display" class="text-2xl font-bold text-blue-600"></p>
                        </div>
                        
                        <button id="book-now-btn" onclick="handleScheduleWithCode()" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                            Book Your First Lesson Now
                        </button>
                    </div>
                </div>
            `;
            
            // Initialize program selection with a slight delay to ensure DOM is ready
            setTimeout(() => {
                initializeProgramSelection();
                console.log('Package flow initialized');
            }, 100);
        }
        
        // Update stepper to show step 1 as active
        if (typeof window.updateStepIndicators === 'function') {
            window.updateStepIndicators(1);
        } else {
            updateStepIndicators(1);
        }
    }
    
    // Set booking mode globally
    window.bookingMode = 'package';
};

window.backToOptions = function() {
    console.log('Going back to options...');
    
    // Hide all flows
    const singleLessonFlow = document.getElementById('single-lesson-flow');
    const packageFlow = document.getElementById('package-flow');
    
    if (singleLessonFlow) singleLessonFlow.classList.add('hidden');
    if (packageFlow) packageFlow.classList.add('hidden');
    
    // Show the choice cards again
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => card.parentElement.style.display = '');
    
    // Reset all global states
    window.selectedProgram = null;
    window.singleLessonProgram = null;
    window.appliedPromoCode = null;
    window.bookingMode = null;
    window.selectedPackage = null;
    window.singleLessonPrice = null;
};

// Helper function to select a program in package flow - MAKE GLOBALLY AVAILABLE
window.selectProgram = function(program) {
    console.log('Program selected in package flow:', program);
    
    // Store the selected program globally
    window.selectedProgram = program;
    
    // Update the window-level variable references used by booking-system-v2.js
    if (window.selectedProgram !== program) {
        window.selectedProgram = program;
    }
    
    // Call showStep(2) from booking-system-v2.js if available
    if (typeof window.showStep === 'function') {
        window.showStep(2);
    } else {
        // Fallback: manually show step 2
        // Hide all steps first
        ['step-1', 'step-2', 'email-step', 'payment-section', 'success-section'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        
        // Show step 2
        const step2 = document.getElementById('step-2');
        if (step2) step2.classList.remove('hidden');
        
        // Update stepper
        if (typeof window.updateStepIndicators === 'function') {
            window.updateStepIndicators(2);
        }
    }
    
    // Render packages for the selected program
    if (typeof window.renderPackages === 'function') {
        window.renderPackages();
    } else {
        // Fallback rendering if main function not available
        renderPackagesFallback(program);
    }
};

// Fallback package rendering
function renderPackagesFallback(program) {
    const container = document.getElementById('package-container');
    const pricing = {
        'Droplet': { 4: 112, 6: 162, 8: 200 },
        'Splashlet': { 4: 152, 6: 222, 8: 280 },
        'Strokelet': { 4: 172, 6: 252, 8: 320 }
    };
    
    const programPricing = pricing[program];
    let html = '';
    
    [4, 6, 8].forEach((lessons, index) => {
        const price = programPricing[lessons];
        const perLesson = Math.floor(price / lessons);
        
        let badge = '';
        if (lessons === 6) badge = '<div class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full inline-block">Most Popular</div>';
        else if (lessons === 8) badge = '<div class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full inline-block">Best Value</div>';
        else badge = '<div style="height: 24px"></div>';
        
        html += `
            <div class="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 transition p-4">
                <h4 class="text-xl font-bold mb-2">${lessons} Lessons</h4>
                ${badge}
                <div class="text-3xl font-bold mt-3 mb-1">$${price}</div>
                <div class="text-sm text-gray-500 mb-3">$${perLesson}/lesson</div>
                <button onclick="selectPackage(${lessons}, ${price})" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
                    Select
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Helper function to update step indicators
function updateStepIndicators(activeStep) {
    const steppers = document.querySelectorAll('.stepper-item');
    steppers.forEach((stepper, index) => {
        const stepNum = index + 1;
        const numberDiv = stepper.querySelector('.stepper-number');
        
        if (stepNum < activeStep) {
            stepper.classList.add('completed');
            stepper.classList.remove('active');
        } else if (stepNum === activeStep) {
            stepper.classList.add('active');
            stepper.classList.remove('completed');
        } else {
            stepper.classList.remove('active', 'completed');
        }
    });
}

// Helper function to show steps
window.showStep = function(stepNumber) {
    // Hide all steps
    ['step-1', 'step-2', 'email-step', 'payment-section', 'success-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Show requested step
    const stepId = stepNumber === 1 ? 'step-1' : 
                   stepNumber === 2 ? 'step-2' : 
                   stepNumber === 2.5 ? 'email-step' :
                   stepNumber === 3 ? 'payment-section' : 
                   'success-section';
    
    const stepEl = document.getElementById(stepId);
    if (stepEl) stepEl.classList.remove('hidden');
    
    // Update step indicators
    updateStepIndicators(Math.floor(stepNumber));
};

// Initialize program selection event handlers
function initializeProgramSelection() {
    // Use event delegation for better reliability
    const step1Container = document.getElementById('step-1');
    if (step1Container) {
        // Remove any existing listeners first
        step1Container.replaceWith(step1Container.cloneNode(true));
        const newStep1 = document.getElementById('step-1');
        
        // Add click listener to the container
        newStep1.addEventListener('click', function(e) {
            // Find the closest step-card parent
            const card = e.target.closest('.step-card');
            if (card && card.dataset.programName) {
                const program = card.dataset.programName;
                console.log('Card clicked, program:', program);
                window.selectProgram(program);
            }
        });
    }
    
    // Also ensure the onclick attributes work
    document.querySelectorAll('#step-1 .step-card').forEach(card => {
        const program = card.dataset.programName;
        if (program && !card.onclick) {
            card.onclick = function() {
                console.log('Direct onclick, program:', program);
                window.selectProgram(program);
            };
        }
    });
}

// The rest of the functions remain the same...
window.selectSingleLessonProgram = function(program) {
    console.log('Selected program:', program);
    console.log('Current promo code:', window.appliedPromoCode);
    
    // Store the selected program globally
    window.singleLessonProgram = program;
    
    // Get the price - use global PACKAGE_PRICING if available
    const PACKAGE_PRICING = window.PACKAGE_PRICING || {
        'Droplet': { 1: 30 },
        'Splashlet': { 1: 40 },
        'Strokelet': { 1: 45 }
    };
    
    let price = PACKAGE_PRICING[program][1];
    
    // Check if promo code is applied
    if (window.appliedPromoCode && window.appliedPromoCode.type === 'single_lesson') {
        price = price * (1 - window.appliedPromoCode.discount / 100);
        console.log('Applied promo discount, new price:', price);
    }
    
    window.singleLessonPrice = price;
    
    // Track selection
    if (typeof window.trackSingleLessonSelection === 'function') {
        window.trackSingleLessonSelection(program, price);
    }
    
    // Set the selected program globally for calendar
    window.selectedProgram = program;
    
    // Always go to calendar for time selection (whether free or paid)
    console.log(`Proceeding to calendar with ${price === 0 ? 'FREE' : '
};

window.applySingleLessonPromo = function() {
    const promoInput = document.getElementById('single-promo-input');
    const promoMessage = document.getElementById('single-promo-message');
    
    if (!promoInput || !promoMessage) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        return;
    }
    
    // Define PROMO_CODES locally if not available
    const PROMO_CODES = window.PROMO_CODES || {
        'FIRST-FREE': {
            type: 'single_lesson',
            discount: 100,
            description: 'First lesson free',
            validPrograms: ['Droplet', 'Splashlet', 'Strokelet']
        }
    };
    
    const promo = PROMO_CODES[code];
    
    if (!promo) {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    if (promo.type !== 'single_lesson') {
        promoMessage.textContent = 'This code is only valid for packages, not single lessons';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    // Set the promo code globally so it's accessible everywhere
    window.appliedPromoCode = { code, ...promo };
    console.log('Promo code applied:', window.appliedPromoCode);
    
    // Track promo code application
    if (typeof window.trackPromoCode === 'function') {
        window.trackPromoCode(code, 'single_lesson');
    }
    
    if (promo.discount === 100) {
        promoMessage.innerHTML = `✅ <strong>${promo.description}</strong> applied! Select a program to continue.`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
        
        // Update all price displays to show FREE
        if (typeof updatePriceDisplaysForFree === 'function') {
            updatePriceDisplaysForFree();
        } else if (typeof window.updatePriceDisplaysForFree === 'function') {
            window.updatePriceDisplaysForFree();
        }
    } else {
        promoMessage.innerHTML = `✅ <strong>${promo.discount}% off</strong> applied!`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
    }
    
    promoMessage.classList.remove('hidden');
};

// Ensure this function is available globally
window.updatePriceDisplaysForFree = function updatePriceDisplaysForFree() {
    // Update Droplet price
    const dropletPrice = document.getElementById('droplet-price');
    if (dropletPrice) {
        dropletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$30</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Splashlet price
    const splashletPrice = document.getElementById('splashlet-price');
    if (splashletPrice) {
        splashletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$40</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Strokelet price
    const strokeletPrice = document.getElementById('strokelet-price');
    if (strokeletPrice) {
        strokeletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$45</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
}

console.log('Booking functions fix loaded - all functions ready');
 + price} lesson`);
    
    if (typeof window.proceedToSingleLessonCalendar === 'function') {
        window.proceedToSingleLessonCalendar();
    } else {
        // Fallback: directly show calendar
        const singleLessonFlow = document.getElementById('single-lesson-flow');
        if (singleLessonFlow) {
            singleLessonFlow.classList.add('hidden');
        }
        
        const calendarSection = document.getElementById('calendar-section');
        if (calendarSection) {
            calendarSection.classList.remove('hidden');
            
            // Update title
            let titleEl = document.getElementById('calendar-title');
            if (!titleEl) {
                titleEl = document.createElement('div');
                titleEl.id = 'calendar-title';
                titleEl.className = 'mb-6';
                calendarSection.insertBefore(titleEl, calendarSection.firstChild);
            }
            
            titleEl.innerHTML = `
                <div class="text-center">
                    <h2 class="text-3xl font-bold mb-2">Select Your Lesson Time</h2>
                    <div class="flex items-center justify-center gap-4 text-sm">
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">${program}</span>
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">Single Lesson - ${price === 0 ? 'FREE' : '
};

window.applySingleLessonPromo = function() {
    const promoInput = document.getElementById('single-promo-input');
    const promoMessage = document.getElementById('single-promo-message');
    
    if (!promoInput || !promoMessage) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        return;
    }
    
    // Define PROMO_CODES locally if not available
    const PROMO_CODES = window.PROMO_CODES || {
        'FIRST-FREE': {
            type: 'single_lesson',
            discount: 100,
            description: 'First lesson free',
            validPrograms: ['Droplet', 'Splashlet', 'Strokelet']
        }
    };
    
    const promo = PROMO_CODES[code];
    
    if (!promo) {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    if (promo.type !== 'single_lesson') {
        promoMessage.textContent = 'This code is only valid for packages, not single lessons';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    // Set the promo code globally so it's accessible everywhere
    window.appliedPromoCode = { code, ...promo };
    console.log('Promo code applied:', window.appliedPromoCode);
    
    // Track promo code application
    if (typeof window.trackPromoCode === 'function') {
        window.trackPromoCode(code, 'single_lesson');
    }
    
    if (promo.discount === 100) {
        promoMessage.innerHTML = `✅ <strong>${promo.description}</strong> applied! Select a program to continue.`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
        
        // Update all price displays to show FREE
        if (typeof updatePriceDisplaysForFree === 'function') {
            updatePriceDisplaysForFree();
        } else if (typeof window.updatePriceDisplaysForFree === 'function') {
            window.updatePriceDisplaysForFree();
        }
    } else {
        promoMessage.innerHTML = `✅ <strong>${promo.discount}% off</strong> applied!`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
    }
    
    promoMessage.classList.remove('hidden');
};

// Ensure this function is available globally
window.updatePriceDisplaysForFree = function updatePriceDisplaysForFree() {
    // Update Droplet price
    const dropletPrice = document.getElementById('droplet-price');
    if (dropletPrice) {
        dropletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$30</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Splashlet price
    const splashletPrice = document.getElementById('splashlet-price');
    if (splashletPrice) {
        splashletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$40</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Strokelet price
    const strokeletPrice = document.getElementById('strokelet-price');
    if (strokeletPrice) {
        strokeletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$45</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
}

console.log('Booking functions fix loaded - all functions ready');
 + price}</span>
                    </div>
                </div>
            `;
            
            // Load time slots
            if (typeof window.loadTimeSlots === 'function') {
                window.loadTimeSlots(program);
            }
        }
    }
};

window.applySingleLessonPromo = function() {
    const promoInput = document.getElementById('single-promo-input');
    const promoMessage = document.getElementById('single-promo-message');
    
    if (!promoInput || !promoMessage) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        return;
    }
    
    // Define PROMO_CODES locally if not available
    const PROMO_CODES = window.PROMO_CODES || {
        'FIRST-FREE': {
            type: 'single_lesson',
            discount: 100,
            description: 'First lesson free',
            validPrograms: ['Droplet', 'Splashlet', 'Strokelet']
        }
    };
    
    const promo = PROMO_CODES[code];
    
    if (!promo) {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    if (promo.type !== 'single_lesson') {
        promoMessage.textContent = 'This code is only valid for packages, not single lessons';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    // Set the promo code globally so it's accessible everywhere
    window.appliedPromoCode = { code, ...promo };
    console.log('Promo code applied:', window.appliedPromoCode);
    
    // Track promo code application
    if (typeof window.trackPromoCode === 'function') {
        window.trackPromoCode(code, 'single_lesson');
    }
    
    if (promo.discount === 100) {
        promoMessage.innerHTML = `✅ <strong>${promo.description}</strong> applied! Select a program to continue.`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
        
        // Update all price displays to show FREE
        if (typeof updatePriceDisplaysForFree === 'function') {
            updatePriceDisplaysForFree();
        } else if (typeof window.updatePriceDisplaysForFree === 'function') {
            window.updatePriceDisplaysForFree();
        }
    } else {
        promoMessage.innerHTML = `✅ <strong>${promo.discount}% off</strong> applied!`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
    }
    
    promoMessage.classList.remove('hidden');
};

// Ensure this function is available globally
window.updatePriceDisplaysForFree = function updatePriceDisplaysForFree() {
    // Update Droplet price
    const dropletPrice = document.getElementById('droplet-price');
    if (dropletPrice) {
        dropletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$30</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Splashlet price
    const splashletPrice = document.getElementById('splashlet-price');
    if (splashletPrice) {
        splashletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$40</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
    
    // Update Strokelet price
    const strokeletPrice = document.getElementById('strokelet-price');
    if (strokeletPrice) {
        strokeletPrice.innerHTML = `
            <p class="text-2xl font-bold">
                <span class="line-through text-gray-400">$45</span>
                <span class="text-green-600 ml-2">FREE</span>
            </p>
            <p class="text-sm text-green-600 font-semibold">First lesson free!</p>
        `;
    }
}

console.log('Booking functions fix loaded - all functions ready');
