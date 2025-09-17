// Environment-based Admin System Loader
// This script determines whether to load the admin booking bypass system
// based on environment conditions

(function() {
    'use strict';
    
    // Configuration for when admin system should be loaded
    const ADMIN_LOAD_CONFIG = {
        // Hostnames where admin system should always load
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            'test.safestrokeswim.com',
            'staging.safestrokeswim.com',
            'dev.safestrokeswim.com'
        ],
        
        // URL parameters that trigger admin system
        triggerParams: [
            'admin=true',
            'test=true',
            'debug=true'
        ],
        
        // Check for Netlify deploy preview URLs
        checkNetlifyPreview: true,
        
        // Allow loading on specific Netlify branches
        allowedBranches: [
            'develop',
            'staging',
            'test'
        ]
    };
    
    // Determine if admin system should be loaded
    function shouldLoadAdminSystem() {
        const hostname = window.location.hostname;
        const search = window.location.search;
        const pathname = window.location.pathname;
        
        // Check if hostname is in allowed list
        if (ADMIN_LOAD_CONFIG.allowedHosts.some(host => hostname.includes(host))) {
            console.log('Admin system enabled: Development hostname detected');
            return true;
        }
        
        // Check for URL parameters
        if (ADMIN_LOAD_CONFIG.triggerParams.some(param => search.includes(param))) {
            console.log('Admin system enabled: Trigger parameter in URL');
            return true;
        }
        
        // Check for Netlify deploy preview URLs
        if (ADMIN_LOAD_CONFIG.checkNetlifyPreview) {
            // Netlify preview URLs look like: deploy-preview-123--safestroke.netlify.app
            if (hostname.includes('deploy-preview-') && hostname.includes('.netlify.app')) {
                console.log('Admin system enabled: Netlify deploy preview detected');
                return true;
            }
            
            // Branch deploys look like: branch-name--safestroke.netlify.app
            if (hostname.includes('--') && hostname.includes('.netlify.app')) {
                const branch = hostname.split('--')[0];
                if (ADMIN_LOAD_CONFIG.allowedBranches.includes(branch)) {
                    console.log(`Admin system enabled: Netlify branch deploy (${branch})`);
                    return true;
                }
            }
        }
        
        // Check for localStorage override (for development)
        if (localStorage.getItem('enableAdminSystem') === 'true') {
            console.log('Admin system enabled: localStorage override');
            return true;
        }
        
        // Don't load on production
        if (hostname === 'safestrokeswim.com' || hostname === 'www.safestrokeswim.com') {
            console.log('Admin system disabled: Production environment');
            return false;
        }
        
        // Check for .local domain (common for local development)
        if (hostname.endsWith('.local')) {
            console.log('Admin system enabled: .local domain detected');
            return true;
        }
        
        // Default: don't load
        return false;
    }
    
    // Load admin system if conditions are met
    if (shouldLoadAdminSystem()) {
        console.log('Loading admin booking bypass system...');
        
        const script = document.createElement('script');
        script.src = 'admin-booking-bypass.js';
        script.onload = function() {
            console.log('Admin booking bypass system loaded successfully');
            
            // Add subtle indicator that admin system is available
            const indicator = document.createElement('div');
            indicator.id = 'admin-available-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 10px;
                height: 10px;
                background: #f59e0b;
                border-radius: 50%;
                opacity: 0.3;
                z-index: 9998;
                cursor: help;
                transition: opacity 0.3s;
            `;
            indicator.title = 'Admin system available. Press Ctrl+Shift+A to activate.';
            indicator.onmouseover = function() { this.style.opacity = '1'; };
            indicator.onmouseout = function() { this.style.opacity = '0.3'; };
            document.body.appendChild(indicator);
        };
        script.onerror = function() {
            console.error('Failed to load admin booking bypass system');
        };
        document.body.appendChild(script);
        
    } else {
        console.log('Admin booking bypass system not loaded (production environment)');
    }
    
    // Provide manual override function for emergencies
    window.enableAdminSystemManually = function(confirmation) {
        if (confirmation === 'I understand this is for testing only') {
            localStorage.setItem('enableAdminSystem', 'true');
            console.log('Admin system will be enabled on next page load');
            alert('Admin system enabled. Please refresh the page.');
            location.reload();
        } else {
            console.log('To enable admin system manually, call:');
            console.log("enableAdminSystemManually('I understand this is for testing only')");
        }
    };
    
    window.disableAdminSystem = function() {
        localStorage.removeItem('enableAdminSystem');
        sessionStorage.removeItem('adminMode');
        sessionStorage.removeItem('adminEmail');
        console.log('Admin system disabled');
        location.reload();
    };
    
})();
