// Fixed selectSingleLessonProgram function
// This replaces the existing one in booking-functions-fix.js

window.selectSingleLessonProgram = function(program) {
    console.log('Selected program:', program);
    console.log('Current promo code:', window.appliedPromoCode);
    
    // Store the selected program globally
    window.singleLessonProgram = program;
    window.selectedProgram = program; // Also set this for calendar to work
    
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
    
    // ALWAYS go to calendar - whether free or paid
    console.log(`Proceeding to calendar with ${price === 0 ? 'FREE' : '$' + price} lesson`);
    
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
                        Single Lesson - ${price === 0 ? 'FREE' : '$' + price}
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