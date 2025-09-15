// Fixed Booking Flow Functions
// This file handles the single lesson and package flow initialization

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
            `;
        }
        
        // Update stepper to show step 1 as active
        if (typeof window.updateStepIndicators === 'function') {
            window.updateStepIndicators(1);
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

// Helper function to select a program in package flow
window.selectProgram = function(program) {
    console.log('Program selected in package flow:', program);
    
    // Store the selected program globally
    window.selectedProgram = program;
    
    // Call showStep(2) from booking-system-v2.js if available
    if (typeof window.showStep === 'function') {
        window.showStep(2);
    }
    
    // Render packages for the selected program
    if (typeof window.renderPackages === 'function') {
        window.renderPackages();
    }
};

// Select single lesson program
window.selectSingleLessonProgram = function(program) {
    console.log('Selected program:', program);
    console.log('Current promo code:', window.appliedPromoCode);
    
    // Store the selected program globally
    window.singleLessonProgram = program;
    window.selectedProgram = program; // Also set this for calendar
    
    // Get the price
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
    
    // Always go to calendar for time selection
    const priceDisplay = price === 0 ? 'FREE' : '$' + price;
    console.log(`Proceeding to calendar with ${priceDisplay} lesson`);
    
    // Hide single lesson flow
    const singleLessonFlow = document.getElementById('single-lesson-flow');
    if (singleLessonFlow) {
        singleLessonFlow.classList.add('hidden');
    }
    
    // Show calendar section
    const calendarSection = document.getElementById('calendar-section');
    if (calendarSection) {
        calendarSection.classList.remove('hidden');
        
        // Update or create title
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
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Single Lesson - ${priceDisplay}
                    </span>
                </div>
            </div>
        `;
        
        // Hide loading if it exists
        const loadingDiv = document.getElementById('calendar-loading');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }
        
        // Load available time slots
        if (typeof window.loadTimeSlots === 'function') {
            window.loadTimeSlots(program);
        } else {
            console.error('loadTimeSlots function not found');
        }
    }
};

// Apply single lesson promo code
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
        return;
    }
    
    if (promo.type !== 'single_lesson') {
        promoMessage.textContent = 'This code is only valid for packages, not single lessons';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        window.appliedPromoCode = null;
        return;
    }
    
    // Set the promo code globally
    window.appliedPromoCode = { code, ...promo };
    console.log('Promo code applied:', window.appliedPromoCode);
    
    if (promo.discount === 100) {
        promoMessage.innerHTML = `✅ <strong>${promo.description}</strong> applied! Select a program to continue.`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
        
        // Update all price displays to show FREE
        updatePriceDisplaysForFree();
    } else {
        promoMessage.innerHTML = `✅ <strong>${promo.discount}% off</strong> applied!`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
    }
    
    promoMessage.classList.remove('hidden');
};

// Update price displays to show FREE
function updatePriceDisplaysForFree() {
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

// Make it globally available
window.updatePriceDisplaysForFree = updatePriceDisplaysForFree;

console.log('Booking functions fix loaded - all functions ready');