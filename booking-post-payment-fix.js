// Post-payment booking flow continuation fix
// This ensures users can immediately schedule after payment without errors

(function() {
    'use strict';
    
    console.log('Post-payment booking continuation fix loading...');
    
    // Store original scheduleWithCode if it exists
    const originalScheduleWithCode = window.scheduleWithCode;
    
    // Enhanced scheduleWithCode function that handles post-payment flow
    window.scheduleWithCode = function() {
        console.log('Enhanced scheduleWithCode called');
        
        const codeInput = document.getElementById('package-code');
        const code = codeInput ? codeInput.value.trim() : '';
        const successMsg = document.getElementById('code-success');
        const errorMsg = document.getElementById('code-error');
        
        // Basic validation
        if (!code) {
            if (successMsg) successMsg.classList.add('hidden');
            if (errorMsg) {
                errorMsg.classList.remove('hidden');
                const errorText = errorMsg.querySelector('p');
                if (errorText) errorText.textContent = 'Please enter a package code';
            }
            return;
        }
        
        // Show success and hide error
        if (errorMsg) errorMsg.classList.add('hidden');
        if (successMsg) successMsg.classList.remove('hidden');
        
        // Set the code in the proper input field
        let packageCodeInput = document.getElementById('package-code-input');
        if (!packageCodeInput) {
            // Create a hidden input if it doesn't exist
            packageCodeInput = document.createElement('input');
            packageCodeInput.type = 'hidden';
            packageCodeInput.id = 'package-code-input';
            document.body.appendChild(packageCodeInput);
        }
        packageCodeInput.value = code;
        
        // Ensure all UI elements are properly hidden before showing calendar
        const elementsToHide = [
            'package-flow',
            'single-lesson-flow',
            'step-1', 'step-2', 'step-3', 'step-4',
            'email-step',
            'payment-section',
            'success-section'
        ];
        
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
                element.style.display = 'none'; // Force hide with inline style
            }
        });
        
        // Call the main handler from booking-system-v2.js
        if (typeof window.handleScheduleWithCode === 'function') {
            try {
                window.handleScheduleWithCode();
            } catch (error) {
                console.error('Error in handleScheduleWithCode:', error);
                
                // Fallback: Try to show calendar directly
                if (typeof window.showCalendarSection === 'function') {
                    window.showCalendarSection();
                }
                
                if (errorMsg) {
                    errorMsg.classList.remove('hidden');
                    const errorText = errorMsg.querySelector('p');
                    if (errorText) {
                        errorText.textContent = 'Error loading calendar. Please refresh the page and try again.';
                    }
                }
                if (successMsg) successMsg.classList.add('hidden');
            }
        } else {
            console.error('handleScheduleWithCode function not found');
            
            // Try original function as fallback
            if (originalScheduleWithCode) {
                originalScheduleWithCode();
            } else if (errorMsg) {
                errorMsg.classList.remove('hidden');
                const errorText = errorMsg.querySelector('p');
                if (errorText) {
                    errorText.textContent = 'Booking system not ready. Please refresh the page.';
                }
                if (successMsg) successMsg.classList.add('hidden');
            }
        }
    };
    
    // Auto-fill package code after successful payment
    window.addEventListener('DOMContentLoaded', function() {
        // Check if we just completed a payment (URL might have payment_intent parameter)
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntent = urlParams.get('payment_intent');
        const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
        
        if (paymentIntent || paymentIntentClientSecret) {
            console.log('Payment completion detected');
            
            // Check for recent package code
            if (window.recentPackageCode) {
                console.log('Auto-filling package code:', window.recentPackageCode);
                
                // Fill the package code input
                const packageCodeField = document.getElementById('package-code');
                if (packageCodeField) {
                    packageCodeField.value = window.recentPackageCode;
                    
                    // Highlight the field
                    packageCodeField.style.border = '2px solid #10b981';
                    packageCodeField.style.backgroundColor = '#f0fdf4';
                    
                    // Add a notice
                    const notice = document.createElement('div');
                    notice.className = 'mt-2 p-3 bg-green-100 text-green-800 rounded-lg text-sm';
                    notice.innerHTML = `
                        <strong>Payment successful!</strong> Your package code has been auto-filled. 
                        Click "Schedule" to book your lessons.
                    `;
                    packageCodeField.parentElement.appendChild(notice);
                    
                    // Scroll to the field
                    setTimeout(() => {
                        packageCodeField.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 500);
                }
            }
            
            // Clean up URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    });
    
    // Monitor for dynamically created elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if success section was just shown
                const successSection = document.getElementById('success-section');
                if (successSection && !successSection.classList.contains('hidden')) {
                    // Auto-fill the package code field if it exists
                    const codeDisplay = document.getElementById('package-code-display');
                    const codeInput = document.getElementById('package-code');
                    
                    if (codeDisplay && codeInput) {
                        const code = codeDisplay.textContent.trim();
                        if (code && code !== codeInput.value) {
                            codeInput.value = code;
                            console.log('Auto-filled package code from success display:', code);
                        }
                    }
                }
            }
        });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Post-payment booking continuation fix loaded successfully');
    
})();
