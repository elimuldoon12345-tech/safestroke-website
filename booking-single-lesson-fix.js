// Fix for the booking error - fixes the issue where single lesson booking fails with "Missing required fields"

// Override the handleBookingSubmit function to properly handle single lesson bookings
window.handleBookingSubmitFixed = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Booking...';
    
    const formData = new FormData(form);
    
    // For single lesson bookings without a package code
    if (window.bookingMode === 'single' && window.singleLessonPrice === 0 && !window.enteredPackageCode) {
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
            
            // Now book with the package code
            const bookingData = {
                packageCode: packageCode,
                timeSlotId: window.selectedTimeSlot.id,
                studentName: formData.get('studentName'),
                studentAge: studentAge || formData.get('studentAge') || 'Not specified',
                customerName: formData.get('parentName'),
                customerEmail: formData.get('email'),
                customerPhone: formData.get('phone'),
                notes: formData.get('notes') || 'Free single lesson (FIRST-FREE)'
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
            
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed: ' + error.message + '\n\nPlease try again or contact support at 973-820-1153.');
            submitButton.disabled = false;
            submitButton.textContent = 'Confirm Booking';
        }
        
        return;
    }
    
    // For regular package bookings or paid single lessons
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
            studentAge: studentAge || formData.get('studentAge') || 'Not specified',
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

// Override the form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the original handlers to be set up
    setTimeout(() => {
        console.log('Applying booking form fix...');
        
        // Override the existing handleBookingSubmit
        if (window.handleBookingSubmit) {
            window.handleBookingSubmitOriginal = window.handleBookingSubmit;
            window.handleBookingSubmit = window.handleBookingSubmitFixed;
            console.log('handleBookingSubmit overridden with fix');
        }
        
        // Also watch for dynamically created forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'booking-form') {
                        console.log('Booking form detected, applying fix...');
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

console.log('Single lesson booking fix loaded');