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
    
    // Store original functions
    const originalCreatePayment = window.fetch;
    
    // Override fetch to intercept payment creation
    window.fetch = function(...args) {
        const [url, options] = args;
        
        // Check if this is a payment creation request
        if (url && url.includes('/create-payment') && window.adminBypassActive) {
            console.log('🔐 Admin bypass: Intercepting payment creation');
            
            // Return a mock successful payment response
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    clientSecret: 'admin_test_secret_' + Date.now(),
                    packageCode: generateAdminPackageCode()
                })
            });
        }
        
        // Check if this is a payment confirmation request
        if (url && url.includes('stripe.com') && window.adminBypassActive) {
            console.log('🔐 Admin bypass: Mocking Stripe payment');
            
            // Return successful payment confirmation
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    status: 'succeeded',
                    payment_method: 'admin_test'
                })
            });
        }
        
        // For all other requests, use the original fetch
        return originalCreatePayment.apply(this, args);
    };
    
    // Generate admin package code
    function generateAdminPackageCode() {
        const program = window.selectedProgram || 'TEST';
        const lessons = window.selectedPackage?.lessons || 1;
        const timestamp = Date.now().toString(36).toUpperCase();
        return `ADMIN-${program.substring(0, 3).toUpperCase()}-${lessons}L-${timestamp}`;
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
