// Quick fix for function availability - These functions need to be available immediately
// This file should be loaded BEFORE booking-system-v2.js in the HTML

// Define these functions immediately so they're available for onclick handlers
window.startSingleLessonFlow = function() {
    // Hide the option selection
    const newCustomerPath = document.getElementById('new-customer-path');
    const existingCustomerPath = document.getElementById('existing-customer-path');
    const singleLessonFlow = document.getElementById('single-lesson-flow');
    
    if (newCustomerPath) newCustomerPath.classList.add('hidden');
    if (existingCustomerPath) existingCustomerPath.classList.add('hidden');
    if (singleLessonFlow) singleLessonFlow.classList.remove('hidden');
    
    // Set booking mode if it exists
    if (typeof bookingMode !== 'undefined') {
        bookingMode = 'single';
    }
};

window.startPackageFlow = function() {
    // Hide the option selection
    const newCustomerPath = document.getElementById('new-customer-path');
    const existingCustomerPath = document.getElementById('existing-customer-path');
    const packageFlow = document.getElementById('package-flow');
    
    if (newCustomerPath) newCustomerPath.classList.add('hidden');
    if (existingCustomerPath) existingCustomerPath.classList.add('hidden');
    if (packageFlow) packageFlow.classList.remove('hidden');
    
    // Set booking mode if it exists
    if (typeof bookingMode !== 'undefined') {
        bookingMode = 'package';
    }
};

window.backToOptions = function() {
    // Hide all flows
    const singleLessonFlow = document.getElementById('single-lesson-flow');
    const packageFlow = document.getElementById('package-flow');
    const newCustomerPath = document.getElementById('new-customer-path');
    const existingCustomerPath = document.getElementById('existing-customer-path');
    
    if (singleLessonFlow) singleLessonFlow.classList.add('hidden');
    if (packageFlow) packageFlow.classList.add('hidden');
    if (newCustomerPath) newCustomerPath.classList.remove('hidden');
    if (existingCustomerPath) existingCustomerPath.classList.remove('hidden');
    
    // Reset states if they exist
    if (typeof selectedProgram !== 'undefined') selectedProgram = null;
    if (typeof singleLessonProgram !== 'undefined') singleLessonProgram = null;
    if (typeof appliedPromoCode !== 'undefined') appliedPromoCode = null;
    if (typeof bookingMode !== 'undefined') bookingMode = null;
};

window.selectSingleLessonProgram = function(program) {
    // Store the selected program
    if (typeof singleLessonProgram !== 'undefined') {
        singleLessonProgram = program;
    }
    
    // Get the price if PACKAGE_PRICING is defined
    if (typeof PACKAGE_PRICING !== 'undefined' && typeof singleLessonPrice !== 'undefined') {
        singleLessonPrice = PACKAGE_PRICING[program][1];
        
        // Check if promo code is applied
        if (typeof appliedPromoCode !== 'undefined' && appliedPromoCode && appliedPromoCode.type === 'single_lesson') {
            singleLessonPrice = singleLessonPrice * (1 - appliedPromoCode.discount / 100);
        }
    }
    
    // Track single lesson selection for Meta Pixel
    if (typeof window.trackSingleLessonSelection === 'function') {
        window.trackSingleLessonSelection(program, typeof singleLessonPrice !== 'undefined' ? singleLessonPrice : 0);
    }
    
    // If free lesson, create free package and go to calendar
    if (typeof singleLessonPrice !== 'undefined' && singleLessonPrice === 0) {
        if (typeof handleFreeSingleLesson === 'function') {
            handleFreeSingleLesson();
        }
    } else {
        // Go to calendar for time selection
        if (typeof proceedToSingleLessonCalendar === 'function') {
            proceedToSingleLessonCalendar();
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
    
    // Check if PROMO_CODES is defined
    if (typeof PROMO_CODES === 'undefined') {
        promoMessage.textContent = 'Promo system not ready. Please refresh the page.';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        return;
    }
    
    const promo = PROMO_CODES[code];
    
    if (!promo) {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        if (typeof appliedPromoCode !== 'undefined') appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    if (promo.type !== 'single_lesson') {
        promoMessage.textContent = 'This code is only valid for packages, not single lessons';
        promoMessage.className = 'text-sm text-red-600';
        promoMessage.classList.remove('hidden');
        if (typeof appliedPromoCode !== 'undefined') appliedPromoCode = null;
        if (typeof resetPriceDisplays === 'function') resetPriceDisplays();
        return;
    }
    
    if (typeof appliedPromoCode !== 'undefined') {
        appliedPromoCode = { code, ...promo };
    }
    
    // Track promo code application for Meta Pixel
    if (typeof window.trackPromoCode === 'function') {
        window.trackPromoCode(code, 'single_lesson');
    }
    
    if (promo.discount === 100) {
        promoMessage.innerHTML = `✅ <strong>${promo.description}</strong> applied! Select a program to continue.`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
        
        // Update all price displays to show FREE with crossed out original price
        if (typeof updatePriceDisplaysForFree === 'function') {
            updatePriceDisplaysForFree();
        }
    } else {
        promoMessage.innerHTML = `✅ <strong>${promo.discount}% off</strong> applied!`;
        promoMessage.className = 'text-sm text-green-600 font-semibold';
    }
    
    promoMessage.classList.remove('hidden');
};

console.log('Booking functions fix loaded - functions now available for onclick handlers');
