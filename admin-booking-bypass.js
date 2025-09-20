// Admin Booking Bypass System
// Allows testing of the complete booking flow without payment
// Only activated with special admin code + email combination

(function() {
    'use strict';
    
    console.log('Admin booking bypass system loaded');
    
    // Admin configuration
    const ADMIN_CONFIG = {
        // Secret admin code - change this to something only you know
        masterCode: 'ADMIN-TEST-2025',
        
        // Admin email patterns that are allowed to use the bypass
        adminEmails: [
            'admin@safestrokeswim.com',
            'test@safestrokeswim.com',
            'matt@safestrokeswim.com',
            'mattjpiacentini@gmail.com',  // Your email
            // Add any other admin emails here
        ],
        
        // Special test email pattern (any email ending with this will work with master code)
        testEmailSuffix: '@test.local',
        
        // Visual indicator when in admin mode
        showAdminBadge: true
    };
    
    // Check if admin mode is active
    window.isAdminMode = false;
    window.adminBypassActive = false;

    // Mapping for appointment type IDs so mocked responses mirror production
    const ADMIN_APPOINTMENT_TYPE_IDS = {
        'Droplet': 81908979,
        'Splashlet': 81908997,
        'Strokelet': 81909020
    };

    // Map short prefixes used in generated codes back to full program names
    const ADMIN_PROGRAM_PREFIXES = {
        'DRO': 'Droplet',
        'SPL': 'Splashlet',
        'STR': 'Strokelet'
    };

    // In-memory store for faux packages created while the bypass is active
    const adminPackageStore = new Map();

    // Store original fetch implementation
    const originalFetch = window.fetch;

    // Override fetch to intercept booking-related requests during admin bypass
    window.fetch = function(...args) {
        const context = this;
        const [resource, options] = args;
        const url = typeof resource === 'string' ? resource : resource?.url || '';

        if (window.adminBypassActive && url) {
            if (url.includes('/create-payment')) {
                console.log('🔐 Admin bypass: Intercepting payment creation');

                const packageCode = generateAdminPackageCode();

                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        clientSecret: 'admin_test_secret_' + Date.now(),
                        packageCode
                    })
                });
            }

            if (url.includes('stripe.com')) {
                console.log('🔐 Admin bypass: Mocking Stripe payment');

                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        status: 'succeeded',
                        payment_method: 'admin_test'
                    })
                });
            }

            if (url.includes('/.netlify/functions/validate-package')) {
                return handleAdminValidateRequest(url, args, context);
            }

            if (url.includes('/.netlify/functions/book-time-slot')) {
                return handleAdminBookRequest(resource, options, args, context);
            }
        }

        return originalFetch.apply(context, args);
    };
    
    // Generate admin package code and seed faux package state for later validation
    function generateAdminPackageCode() {
        const program = getProgramFromSelection('Splashlet');
        const lessons = getSelectedLessonsCount();
        const timestamp = Date.now().toString(36).toUpperCase();
        const programPrefix = (program || 'Splashlet').substring(0, 3).toUpperCase();
        const packageCode = `ADMIN-${programPrefix}-${lessons}L-${timestamp}`;

        initializeAdminPackageState(packageCode, program, lessons);

        return packageCode;
    }

    function handleAdminValidateRequest(url, originalArgs, context) {
        try {
            const parsedUrl = new URL(url, window.location.origin);
            const codeParam = parsedUrl.searchParams.get('code') || '';
            const normalizedCode = codeParam.toUpperCase();

            if (!normalizedCode.startsWith('ADMIN-')) {
                return originalFetch.apply(context, originalArgs);
            }

            const packageState = ensureAdminPackageState(normalizedCode);

            if (!packageState) {
                return Promise.resolve(createMockResponse({
                    valid: false,
                    error: 'Admin package not initialized'
                }, 400));
            }

            console.log('🔐 Admin bypass: Mocking package validation', normalizedCode, packageState);

            return Promise.resolve(createMockResponse({
                valid: true,
                program: packageState.program,
                lessons_total: packageState.lessonsTotal,
                lessons_remaining: packageState.lessonsRemaining,
                appointmentTypeID: packageState.appointmentTypeID,
                customer: packageState.customer || null
            }, 200));
        } catch (error) {
            console.error('Admin bypass validate-package error:', error);
            return Promise.resolve(createMockResponse({
                valid: false,
                error: 'Admin bypass validation failed'
            }, 500));
        }
    }

    function handleAdminBookRequest(resource, options, originalArgs, context) {
        const isRequestObject = typeof Request !== 'undefined' && resource instanceof Request;
        const requestInit = options || (isRequestObject ? {} : undefined);
        let requestBody = requestInit?.body;

        if (!requestBody && isRequestObject) {
            // Unable to safely read the body from a Request object without consuming it
            return originalFetch.apply(context, originalArgs);
        }

        if (!requestBody) {
            return originalFetch.apply(context, originalArgs);
        }

        let payload = null;

        if (typeof requestBody === 'string') {
            try {
                payload = JSON.parse(requestBody);
            } catch (error) {
                console.warn('Admin bypass: Failed to parse booking payload. Falling back to real fetch.', error);
                return originalFetch.apply(context, originalArgs);
            }
        } else if (requestBody instanceof FormData) {
            payload = Object.fromEntries(requestBody.entries());
        } else if (typeof requestBody === 'object') {
            payload = requestBody;
        }

        if (!payload || !payload.packageCode) {
            return originalFetch.apply(context, originalArgs);
        }

        const normalizedCode = String(payload.packageCode).toUpperCase();

        if (!normalizedCode.startsWith('ADMIN-')) {
            return originalFetch.apply(context, originalArgs);
        }

        const missingFields = ['packageCode', 'timeSlotId', 'studentName', 'customerName', 'customerEmail']
            .filter(field => !payload[field]);

        if (missingFields.length > 0) {
            return Promise.resolve(createMockResponse({
                error: 'Missing required fields',
                missingFields
            }, 400));
        }

        const packageState = ensureAdminPackageState(normalizedCode);

        if (!packageState) {
            return Promise.resolve(createMockResponse({
                error: 'Admin package not initialized'
            }, 400));
        }

        if (packageState.lessonsRemaining <= 0) {
            return Promise.resolve(createMockResponse({
                error: 'This package has no remaining lessons'
            }, 400));
        }

        packageState.bookings = packageState.bookings || [];
        const duplicateBooking = packageState.bookings.find(booking =>
            String(booking.timeSlotId) === String(payload.timeSlotId) &&
            (booking.studentName || '').toLowerCase() === String(payload.studentName || '').toLowerCase()
        );

        if (duplicateBooking) {
            return Promise.resolve(createMockResponse({
                error: 'This student is already booked for this time slot'
            }, 400));
        }

        const bookingId = `ADMIN-BOOKING-${Date.now()}`;
        const createdAt = new Date().toISOString();
        const timeSlotDetails = buildAdminTimeSlotDetails(payload.timeSlotId, packageState.program);

        const bookingRecord = {
            id: bookingId,
            time_slot_id: payload.timeSlotId,
            package_code: normalizedCode,
            student_name: payload.studentName,
            student_age: payload.studentAge || payload.studentBirthdate || null,
            customer_email: payload.customerEmail,
            customer_name: payload.customerName,
            customer_phone: payload.customerPhone || null,
            status: 'confirmed',
            notes: payload.notes || '',
            created_at: createdAt,
            timeSlot: timeSlotDetails
        };

        packageState.lessonsRemaining = Math.max(0, packageState.lessonsRemaining - 1);
        packageState.bookings.push({
            bookingId,
            timeSlotId: payload.timeSlotId,
            studentName: payload.studentName,
            createdAt
        });

        const payloadCustomer = buildCustomerFromPayload(payload);
        if (payloadCustomer) {
            packageState.customer = Object.assign(packageState.customer || {}, payloadCustomer);
        } else if (!packageState.customer) {
            packageState.customer = buildAdminCustomerInfo();
        }

        console.log('🔐 Admin bypass: Mocking time slot booking', {
            code: normalizedCode,
            lessonsRemaining: packageState.lessonsRemaining
        });

        return Promise.resolve(createMockResponse({
            success: true,
            bookingId,
            lessonsRemaining: packageState.lessonsRemaining,
            booking: bookingRecord
        }, 200));
    }

    function createMockResponse(body, status = 200) {
        const isString = typeof body === 'string';

        return {
            ok: status >= 200 && status < 300,
            status,
            headers: {
                get: () => null
            },
            json: () => Promise.resolve(isString ? safeJsonParse(body) : JSON.parse(JSON.stringify(body))),
            text: () => Promise.resolve(isString ? String(body) : JSON.stringify(body))
        };
    }

    function safeJsonParse(value) {
        if (typeof value !== 'string') {
            return value;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    function initializeAdminPackageState(code, program, lessons) {
        const normalizedCode = (code || '').toUpperCase();
        const normalizedProgram = program || getProgramFromSelection('Splashlet');
        const lessonCount = Math.max(1, parseInt(lessons, 10) || 1);
        const appointmentTypeID = ADMIN_APPOINTMENT_TYPE_IDS[normalizedProgram] || null;

        const packageState = {
            code: normalizedCode,
            program: normalizedProgram,
            lessonsTotal: lessonCount,
            lessonsRemaining: lessonCount,
            appointmentTypeID,
            customer: buildAdminCustomerInfo(),
            bookings: [],
            createdAt: Date.now()
        };

        adminPackageStore.set(normalizedCode, packageState);

        return packageState;
    }

    function ensureAdminPackageState(code) {
        if (!code) return null;

        const normalizedCode = code.toUpperCase();

        if (!normalizedCode.startsWith('ADMIN-')) {
            return null;
        }

        if (!adminPackageStore.has(normalizedCode)) {
            const parsed = parseAdminPackageCode(normalizedCode);
            const program = getProgramFromSelection(parsed.program || 'Splashlet');
            const lessons = getSelectedLessonsCount(parsed.lessons || 1);

            return initializeAdminPackageState(normalizedCode, program, lessons);
        }

        const packageState = adminPackageStore.get(normalizedCode);

        if (!packageState.appointmentTypeID) {
            packageState.appointmentTypeID = ADMIN_APPOINTMENT_TYPE_IDS[packageState.program] || null;
        }

        if (!packageState.customer) {
            const customerInfo = buildAdminCustomerInfo();
            if (customerInfo) {
                packageState.customer = customerInfo;
            }
        }

        return packageState;
    }

    function parseAdminPackageCode(code) {
        const parts = code.split('-');
        const prefix = parts[1] || '';
        const lessonsPart = parts[2] || '';

        let lessons = parseInt(lessonsPart.replace(/[^0-9]/g, ''), 10);
        if (Number.isNaN(lessons)) {
            lessons = 1;
        }

        const program = ADMIN_PROGRAM_PREFIXES[prefix] || null;

        return { prefix, program, lessons };
    }

    function getProgramFromSelection(fallbackProgram) {
        return window.selectedProgram ||
               window.selectedPackage?.program ||
               window.singleLessonProgram ||
               fallbackProgram ||
               'Splashlet';
    }

    function getSelectedLessonsCount(fallbackLessons) {
        const lessonsFromPackage = window.selectedPackage?.lessons;

        if (typeof lessonsFromPackage === 'number' && lessonsFromPackage > 0) {
            return lessonsFromPackage;
        }

        const parsedLessons = parseInt(lessonsFromPackage, 10);
        if (!Number.isNaN(parsedLessons) && parsedLessons > 0) {
            return parsedLessons;
        }

        if (typeof fallbackLessons === 'number' && fallbackLessons > 0) {
            return fallbackLessons;
        }

        if (window.bookingMode === 'single' || window.singleLessonProgram) {
            return 1;
        }

        return 1;
    }

    function buildAdminCustomerInfo() {
        const email = window.customerEmail || window.tempBookingData?.customerEmail || null;
        const name = window.tempBookingData?.customerName || window.customerName || null;
        const phone = window.tempBookingData?.customerPhone || window.customerPhone || null;

        if (email || name || phone) {
            return {
                email: email || null,
                name: name || null,
                phone: phone || null
            };
        }

        return null;
    }

    function buildCustomerFromPayload(payload) {
        if (!payload) return null;

        const email = payload.customerEmail || null;
        const name = payload.customerName || null;
        const phone = payload.customerPhone || null;

        if (email || name || phone) {
            return { email, name, phone };
        }

        return null;
    }

    function buildAdminTimeSlotDetails(timeSlotId, program) {
        const slot = window.selectedTimeSlot;

        if (slot && String(slot.id) === String(timeSlotId)) {
            return {
                id: slot.id,
                date: slot.date,
                time: slot.time,
                program: program || getProgramFromSelection(program)
            };
        }

        return {
            id: timeSlotId,
            program: program || getProgramFromSelection(program)
        };
    }
    
    // Check if email is admin email
    function isAdminEmail(email) {
        if (!email) return false;
        
        email = email.toLowerCase().trim();
        
        // Check if email is in admin list
        if (ADMIN_CONFIG.adminEmails.some(adminEmail => 
            email === adminEmail.toLowerCase()
        )) {
            return true;
        }
        
        // Check if email ends with test suffix
        if (email.endsWith(ADMIN_CONFIG.testEmailSuffix)) {
            return true;
        }
        
        return false;
    }
    
    // Enhanced promo code application for admin
    const originalApplyPromoCode = window.applyPromoCode;
    window.applyPromoCode = function() {
        const promoInput = document.getElementById('promo-code-input');
        const code = promoInput?.value.trim().toUpperCase();
        
        if (code === ADMIN_CONFIG.masterCode) {
            console.log('🔐 Admin master code detected');
            
            // Check if we need to verify email first
            const customerEmail = window.customerEmail || 
                                 document.getElementById('customer-email')?.value ||
                                 document.getElementById('email')?.value;
            
            if (!customerEmail) {
                // Show admin email request
                const promoMessage = document.getElementById('promo-message');
                if (promoMessage) {
                    promoMessage.innerHTML = `
                        <div class="bg-yellow-100 border border-yellow-400 p-3 rounded-lg">
                            <strong>Admin Mode Activation</strong><br>
                            <span class="text-sm">Please enter your admin email in the next step to activate test mode.</span>
                        </div>
                    `;
                    promoMessage.className = '';
                    promoMessage.classList.remove('hidden');
                }
                
                // Set flag to check email later
                window.pendingAdminActivation = true;
                return;
            }
            
            if (isAdminEmail(customerEmail)) {
                activateAdminMode();
                return;
            } else {
                const promoMessage = document.getElementById('promo-message');
                if (promoMessage) {
                    promoMessage.textContent = 'Invalid admin credentials';
                    promoMessage.className = 'text-sm text-red-600';
                    promoMessage.classList.remove('hidden');
                }
                return;
            }
        }
        
        // Fall back to original promo code function
        if (originalApplyPromoCode) {
            originalApplyPromoCode();
        }
    };
    
    // Activate admin mode
    function activateAdminMode() {
        window.isAdminMode = true;
        window.adminBypassActive = true;
        
        console.log('🔐 ADMIN MODE ACTIVATED');
        
        // Update UI to show admin mode
        const promoMessage = document.getElementById('promo-message') || 
                           document.getElementById('single-promo-message');
        if (promoMessage) {
            promoMessage.innerHTML = `
                <div class="bg-green-100 border border-green-400 p-3 rounded-lg">
                    <strong>✅ Admin Test Mode Active</strong><br>
                    <span class="text-sm">All payments will be bypassed. This is for testing only.</span>
                </div>
            `;
            promoMessage.className = '';
            promoMessage.classList.remove('hidden');
        }
        
        // Add visual admin badge
        if (ADMIN_CONFIG.showAdminBadge) {
            addAdminBadge();
        }
        
        // Make all packages show as FREE
        updatePricesForAdmin();
        
        // Store admin mode in session
        sessionStorage.setItem('adminMode', 'true');
        sessionStorage.setItem('adminEmail', window.customerEmail);
    }
    
    // Add visual admin badge to page
    function addAdminBadge() {
        if (document.getElementById('admin-mode-badge')) return;
        
        const badge = document.createElement('div');
        badge.id = 'admin-mode-badge';
        badge.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #dc2626);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
            font-family: system-ui, -apple-system, sans-serif;
            animation: pulse 2s infinite;
        `;
        badge.innerHTML = '🔐 ADMIN TEST MODE';
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(badge);
    }
    
    // Update all prices to show FREE in admin mode
    function updatePricesForAdmin() {
        // Update package prices
        const priceElements = document.querySelectorAll('.text-3xl.font-bold');
        priceElements.forEach(el => {
            if (el.textContent.includes('$')) {
                el.innerHTML = '<span class="line-through text-gray-400 text-2xl mr-2">' + 
                              el.textContent + '</span><span class="text-green-600">FREE</span>';
            }
        });
        
        // Add admin notice to package selection
        const packageContainer = document.getElementById('package-container');
        if (packageContainer && !document.getElementById('admin-package-notice')) {
            const notice = document.createElement('div');
            notice.id = 'admin-package-notice';
            notice.className = 'col-span-full mb-4 bg-orange-100 border border-orange-300 p-4 rounded-lg';
            notice.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🔐</span>
                    <div>
                        <strong class="text-orange-800">Admin Test Mode Active</strong><br>
                        <span class="text-sm text-orange-700">All packages are free for testing. Payments will be simulated.</span>
                    </div>
                </div>
            `;
            packageContainer.insertBefore(notice, packageContainer.firstChild);
        }
    }
    
    // Override Stripe payment confirmation
    if (window.Stripe) {
        const originalStripe = window.Stripe;
        window.Stripe = function(key) {
            const stripeInstance = originalStripe(key);
            
            // Override confirmPayment if admin mode is active
            const originalConfirmPayment = stripeInstance.confirmPayment;
            stripeInstance.confirmPayment = function(options) {
                if (window.adminBypassActive) {
                    console.log('🔐 Admin bypass: Simulating successful payment');
                    
                    // Return mock successful payment
                    return Promise.resolve({
                        paymentIntent: {
                            id: 'admin_test_' + Date.now(),
                            status: 'succeeded'
                        }
                    });
                }
                
                return originalConfirmPayment.call(this, options);
            };
            
            return stripeInstance;
        };
    }
    
    // Check for email entry to activate admin mode
    const originalHandleEmailSubmission = window.handleEmailSubmission;
    window.handleEmailSubmission = async function(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('customer-email');
        const email = emailInput?.value.trim();
        
        // Check if we have pending admin activation
        if (window.pendingAdminActivation && isAdminEmail(email)) {
            window.customerEmail = email;
            activateAdminMode();
            window.pendingAdminActivation = false;
        }
        
        // Continue with original flow
        if (originalHandleEmailSubmission) {
            return originalHandleEmailSubmission.call(this, event);
        }
    };
    
    // Check for single lesson promo application
    const originalApplySingleLessonPromo = window.applySingleLessonPromo;
    window.applySingleLessonPromo = function() {
        const promoInput = document.getElementById('single-promo-input');
        const code = promoInput?.value.trim().toUpperCase();
        
        if (code === ADMIN_CONFIG.masterCode) {
            console.log('🔐 Admin master code detected in single lesson flow');
            
            // Activate admin mode for single lessons
            window.adminBypassActive = true;
            
            const promoMessage = document.getElementById('single-promo-message');
            if (promoMessage) {
                promoMessage.innerHTML = `
                    <div class="bg-green-100 border border-green-400 p-3 rounded-lg">
                        <strong>✅ Admin Test Mode Active</strong><br>
                        <span class="text-sm">Single lesson will be free for testing.</span>
                    </div>
                `;
                promoMessage.className = '';
                promoMessage.classList.remove('hidden');
            }
            
            // Update prices to show FREE
            window.updatePriceDisplaysForFree();
            
            // Add admin badge
            if (ADMIN_CONFIG.showAdminBadge) {
                addAdminBadge();
            }
            
            return;
        }
        
        // Fall back to original function
        if (originalApplySingleLessonPromo) {
            originalApplySingleLessonPromo();
        }
    };
    
    // Auto-restore admin mode if it was active
    window.addEventListener('DOMContentLoaded', function() {
        if (sessionStorage.getItem('adminMode') === 'true') {
            const adminEmail = sessionStorage.getItem('adminEmail');
            if (adminEmail && isAdminEmail(adminEmail)) {
                window.customerEmail = adminEmail;
                window.isAdminMode = true;
                window.adminBypassActive = true;
                console.log('🔐 Admin mode restored from session');
                
                if (ADMIN_CONFIG.showAdminBadge) {
                    setTimeout(addAdminBadge, 500);
                }
            }
        }
        
        // Add keyboard shortcut for quick admin activation (Ctrl+Shift+A)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                const code = prompt('Enter admin master code:');
                if (code === ADMIN_CONFIG.masterCode) {
                    const email = prompt('Enter admin email:');
                    if (email && isAdminEmail(email)) {
                        window.customerEmail = email;
                        activateAdminMode();
                        alert('Admin mode activated!');
                    } else {
                        alert('Invalid admin email');
                    }
                } else if (code) {
                    alert('Invalid admin code');
                }
            }
        });
    });
    
    console.log('Admin bypass system ready. Use code: ADMIN-TEST-2025 with an admin email');
    console.log('Or press Ctrl+Shift+A for quick activation');
    
})();
