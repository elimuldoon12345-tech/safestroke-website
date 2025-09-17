// Booking Management System Extensions
// This file adds booking ID generation and management features to your existing booking system

(function() {
    'use strict';
    
    // Generate unique booking ID
    function generateBookingId() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `SS-${year}-${random}`;
    }
    
    // Store booking in localStorage (in production, this would be in your database)
    function storeBooking(bookingData) {
        const bookingId = generateBookingId();
        const booking = {
            ...bookingData,
            id: bookingId,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            rescheduleCount: 0,
            rescheduleLimit: bookingData.type === 'package' ? 2 : 1
        };
        
        // Store in localStorage
        const bookings = JSON.parse(localStorage.getItem('safestroke_bookings') || '{}');
        bookings[bookingId] = booking;
        bookings[booking.email.toLowerCase()] = booking; // Also store by email for easy lookup
        localStorage.setItem('safestroke_bookings', JSON.stringify(bookings));
        
        return bookingId;
    }
    
    // Retrieve booking
    function getBooking(idOrEmail) {
        const bookings = JSON.parse(localStorage.getItem('safestroke_bookings') || '{}');
        return bookings[idOrEmail] || bookings[idOrEmail.toLowerCase()];
    }
    
    // Update booking
    function updateBooking(bookingId, updates) {
        const bookings = JSON.parse(localStorage.getItem('safestroke_bookings') || '{}');
        if (bookings[bookingId]) {
            bookings[bookingId] = { ...bookings[bookingId], ...updates };
            localStorage.setItem('safestroke_bookings', JSON.stringify(bookings));
            return true;
        }
        return false;
    }
    
    // Check if cancellation/reschedule is allowed (24-hour policy)
    function canModifyBooking(booking) {
        const now = new Date();
        const lessonDate = new Date(booking.date + 'T' + booking.time);
        const hoursUntilLesson = (lessonDate - now) / (1000 * 60 * 60);
        return hoursUntilLesson >= 24;
    }
    
    // Enhanced confirmation message with booking ID and management link
    function getEnhancedConfirmationHTML(bookingId, bookingData) {
        return `
            <div class="booking-confirmation-enhanced">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold mb-2">Booking Confirmed!</h2>
                    <p class="text-gray-600">Thank you for choosing SafeStroke Swim Academy</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-sm text-gray-600">Booking ID</span>
                        <span class="font-mono font-bold text-lg text-blue-900">${bookingId}</span>
                    </div>
                    <div class="text-sm text-gray-700">
                        <p class="mb-2"><strong>Save this ID</strong> to manage your booking</p>
                        <p>A confirmation email with all details has been sent to: <strong>${bookingData.email}</strong></p>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 class="font-semibold mb-2">Lesson Details</h3>
                        <p class="text-sm text-gray-600">Program: <span class="font-semibold text-gray-900">${bookingData.program}</span></p>
                        <p class="text-sm text-gray-600">Date: <span class="font-semibold text-gray-900">${formatDate(bookingData.date)}</span></p>
                        <p class="text-sm text-gray-600">Time: <span class="font-semibold text-gray-900">${formatTime(bookingData.time)}</span></p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 class="font-semibold mb-2">Student Info</h3>
                        <p class="text-sm text-gray-600">Name: <span class="font-semibold text-gray-900">${bookingData.childName}</span></p>
                        <p class="text-sm text-gray-600">Age: <span class="font-semibold text-gray-900">${bookingData.childAge} years</span></p>
                        <p class="text-sm text-gray-600">Parent: <span class="font-semibold text-gray-900">${bookingData.parentName}</span></p>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 class="font-semibold text-yellow-900 mb-2">📍 Need to Make Changes?</h3>
                    <p class="text-sm text-yellow-800 mb-3">You can reschedule or cancel up to 24 hours before your lesson</p>
                    <a href="/manage-booking.html?id=${bookingId}" 
                       class="inline-block bg-white border border-yellow-400 text-yellow-900 font-semibold py-2 px-6 rounded-full hover:bg-yellow-50 transition">
                        Manage This Booking
                    </a>
                </div>
                
                <div class="border-t pt-6">
                    <h3 class="font-semibold mb-3">What's Next?</h3>
                    <ol class="space-y-2 text-sm text-gray-700">
                        <li class="flex items-start">
                            <span class="font-bold text-blue-600 mr-2">1.</span>
                            <span>Check your email for confirmation and detailed instructions</span>
                        </li>
                        <li class="flex items-start">
                            <span class="font-bold text-blue-600 mr-2">2.</span>
                            <span>Save your booking ID: <strong>${bookingId}</strong></span>
                        </li>
                        <li class="flex items-start">
                            <span class="font-bold text-blue-600 mr-2">3.</span>
                            <span>Arrive 10 minutes early to complete any paperwork</span>
                        </li>
                        <li class="flex items-start">
                            <span class="font-bold text-blue-600 mr-2">4.</span>
                            <span>Bring swimsuit, towel, and goggles (optional)</span>
                        </li>
                    </ol>
                </div>
                
                <div class="mt-6 text-center">
                    <a href="/index.html" 
                       class="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition">
                        Return to Home
                    </a>
                </div>
            </div>
        `;
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Format time for display
    function formatTime(timeString) {
        const [hour, minute] = timeString.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${displayHour}:${minute} ${ampm}`;
    }
    
    // Send confirmation email with booking ID and management link
    function sendEnhancedConfirmationEmail(bookingId, bookingData) {
        // This would integrate with your email service
        const emailData = {
            to: bookingData.email,
            subject: `Booking Confirmed - SafeStroke Swim Academy [${bookingId}]`,
            template: 'booking-confirmation-enhanced',
            data: {
                bookingId: bookingId,
                parentName: bookingData.parentName,
                childName: bookingData.childName,
                program: bookingData.program,
                date: formatDate(bookingData.date),
                time: formatTime(bookingData.time),
                location: '199 Scoles Avenue, Clifton, NJ 07012',
                manageLink: `https://safestrokeswim.com/manage-booking.html?id=${bookingId}`,
                cancelLink: `https://safestrokeswim.com/manage-booking.html?id=${bookingId}&action=cancel`,
                rescheduleLink: `https://safestrokeswim.com/manage-booking.html?id=${bookingId}&action=reschedule`
            }
        };
        
        console.log('Sending enhanced confirmation email:', emailData);
        // In production, make API call to your email service
        // fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) });
    }
    
    // Send reminder emails
    function scheduleReminderEmails(bookingId, bookingData) {
        // 48-hour reminder
        const reminder48 = {
            bookingId: bookingId,
            sendAt: new Date(bookingData.date + 'T' + bookingData.time).getTime() - (48 * 60 * 60 * 1000),
            template: '48-hour-reminder'
        };
        
        // 24-hour reminder with last chance to modify
        const reminder24 = {
            bookingId: bookingId,
            sendAt: new Date(bookingData.date + 'T' + bookingData.time).getTime() - (24 * 60 * 60 * 1000),
            template: '24-hour-reminder-last-chance'
        };
        
        console.log('Scheduling reminder emails:', { reminder48, reminder24 });
        // In production, schedule these with your email service
    }
    
    // Export functions to window for global access
    window.BookingManagement = {
        generateBookingId,
        storeBooking,
        getBooking,
        updateBooking,
        canModifyBooking,
        getEnhancedConfirmationHTML,
        sendEnhancedConfirmationEmail,
        scheduleReminderEmails
    };
    
    // Override the existing payment success handler
    if (window.handlePaymentSuccess) {
        const originalHandler = window.handlePaymentSuccess;
        window.handlePaymentSuccess = function(bookingData) {
            // Generate and store booking
            const bookingId = storeBooking(bookingData);
            
            // Send enhanced confirmation email
            sendEnhancedConfirmationEmail(bookingId, bookingData);
            
            // Schedule reminder emails
            scheduleReminderEmails(bookingId, bookingData);
            
            // Show enhanced confirmation
            const confirmationContainer = document.getElementById('confirmation-container') || 
                                        document.querySelector('.confirmation-message').parentElement;
            if (confirmationContainer) {
                confirmationContainer.innerHTML = getEnhancedConfirmationHTML(bookingId, bookingData);
            }
            
            // Call original handler if needed
            if (typeof originalHandler === 'function') {
                originalHandler(bookingData);
            }
            
            // Track in analytics
            if (window.fbq) {
                fbq('track', 'Purchase', {
                    value: bookingData.price,
                    currency: 'USD',
                    content_name: bookingData.program,
                    content_ids: [bookingId],
                    content_type: 'swim_lesson'
                });
            }
        };
    }
    
})();

// Email templates for reference (these would be on your email service)
const emailTemplates = {
    'booking-confirmation-enhanced': `
        Subject: Booking Confirmed - SafeStroke Swim Academy [{{bookingId}}]
        
        Hi {{parentName}},
        
        Your swim lesson is confirmed! 🏊‍♂️
        
        BOOKING DETAILS:
        ================
        Booking ID: {{bookingId}}
        Student: {{childName}}
        Program: {{program}}
        Date: {{date}}
        Time: {{time}}
        Location: {{location}}
        
        MANAGE YOUR BOOKING:
        ===================
        Need to make changes? You can reschedule or cancel up to 24 hours before your lesson.
        
        🔄 Reschedule: {{rescheduleLink}}
        ❌ Cancel: {{cancelLink}}
        📋 View Details: {{manageLink}}
        
        WHAT TO BRING:
        ==============
        ✓ Swimsuit
        ✓ Towel
        ✓ Goggles (optional but recommended)
        ✓ Swim diapers (for children not potty trained)
        
        ARRIVAL INSTRUCTIONS:
        ====================
        • Please arrive 10 minutes early
        • Check in at the front desk
        • Complete any necessary paperwork
        • Our team will guide you to the pool area
        
        CANCELLATION POLICY:
        ===================
        Cancellations must be made at least 24 hours in advance.
        Same-day cancellations cannot be refunded or rescheduled.
        
        Questions? Call or text us at 973-820-1153
        
        See you at the pool!
        The SafeStroke Team
    `,
    
    '48-hour-reminder': `
        Subject: Reminder: Swim Lesson in 2 Days - SafeStroke
        
        Your lesson is coming up in 48 hours!
        
        Date: {{date}}
        Time: {{time}}
        
        Need to reschedule? You still have time!
        {{rescheduleLink}}
    `,
    
    '24-hour-reminder-last-chance': `
        Subject: Tomorrow's Swim Lesson - Last Chance to Modify
        
        ⏰ LAST CHANCE TO MAKE CHANGES
        
        Your lesson is tomorrow!
        This is your last opportunity to reschedule or cancel.
        
        After this, changes cannot be made due to our 24-hour policy.
        
        Manage Booking: {{manageLink}}
    `,
    
    'booking-rescheduled': `
        Subject: Lesson Rescheduled - SafeStroke [{{bookingId}}]
        
        Your lesson has been successfully rescheduled.
        
        OLD TIME: {{oldDateTime}} ❌
        NEW TIME: {{newDateTime}} ✓
        
        All other details remain the same.
        Your booking ID: {{bookingId}}
    `,
    
    'booking-cancelled': `
        Subject: Lesson Cancelled - SafeStroke [{{bookingId}}]
        
        Your lesson has been cancelled as requested.
        
        {{creditMessage}}
        
        We hope to see you back soon!
        Book a new lesson: https://safestrokeswim.com/safestroke-booking.html
    `
};

console.log('Booking Management System loaded successfully');
