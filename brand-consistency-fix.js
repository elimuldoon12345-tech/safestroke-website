/**
 * Brand Consistency Fixes
 * Apply standardized headers and brand colors across all pages
 */

// Standardized header HTML that will be applied to all pages
const standardizedHeader = `
    <!-- Top Bar -->
    <div class="dark-section text-white text-center py-2 text-sm font-medium tracking-wider" style="background-color: #00253D;">
        199 Scoles Ave, Clifton NJ | <a href="tel:973-820-1153" class="font-bold hover:underline">Call or Text 973-820-1153</a>
    </div>

    <!-- Header -->
    <nav class="bg-white sticky top-0 z-50 shadow-lg rounded-b-2xl">
        <div class="container mx-auto px-6 py-3 flex justify-between items-center">
            <!-- Logo (Left) -->
            <div class="flex-shrink-0 md:flex-grow-0">
                <a href="index.html" class="flex items-center">
                    <img src="safestroke-images/safestroke_logo.png" alt="SafeStroke Logo" class="h-20 w-auto">
                </a>
            </div>

            <!-- Centered Navigation Links for Desktop -->
            <div class="hidden md:flex flex-grow justify-center items-center space-x-8 font-semibold">
                <a href="index.html" class="nav-link" data-page="index">Main</a>
                <a href="safestroke-programs.html" class="nav-link" data-page="programs">Programs</a>
                <a href="safestroke-pricing.html" class="nav-link" data-page="pricing">Pricing</a>
                <a href="safestroke-aboutus.html" class="nav-link" data-page="aboutus">About Us</a>
                <a href="safestroke-reviews.html" class="nav-link" data-page="reviews">Reviews</a>
                <a href="safestroke-location.html" class="nav-link" data-page="location">Our Location</a>
            </div>
            
            <!-- Book Now Button (Right, Desktop) -->
            <div class="hidden md:flex flex-shrink-0">
                <a href="safestroke-booking.html" class="brand-blue-bg hover:bg-blue-600 text-white font-bold py-2.5 px-7 rounded-full text-md transition duration-300 transform hover:scale-105" style="background-color: #2284B8;">Book Free Lesson</a>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center">
                <button id="mobile-menu-button" class="text-gray-800 focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
        </div>
        
        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="md:hidden hidden bg-white px-6 pb-4 border-t border-gray-100 rounded-b-2xl">
            <a href="index.html" class="block py-2 text-gray-800" data-page="index">Main</a>
            <a href="safestroke-programs.html" class="block py-2 text-gray-800" data-page="programs">Programs</a>
            <a href="safestroke-pricing.html" class="block py-2 text-gray-800" data-page="pricing">Pricing</a>
            <a href="safestroke-aboutus.html" class="block py-2 text-gray-800" data-page="aboutus">About Us</a>
            <a href="safestroke-reviews.html" class="block py-2 text-gray-800" data-page="reviews">Reviews</a>
            <a href="safestroke-location.html" class="block py-2 text-gray-800" data-page="location">Our Location</a>
            <div class="mt-4 pt-4 border-t">
                 <a href="safestroke-booking.html" class="block w-full text-center brand-blue-bg hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-md transition duration-300" style="background-color: #2284B8;">Book Free Lesson</a>
            </div>
        </div>
    </nav>
`;

// Header styles to inject
const headerStyles = `
    <style>
        .nav-link { 
            transition: color 0.3s; 
            position: relative; 
        }
        .nav-link.active { 
            font-weight: 700; 
            color: #2284B8; 
        }
        .nav-link:not(.active):hover { 
            color: #2284B8; 
        }
        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(90deg, #2284B8, #1976a3);
            transition: width 0.3s ease-in-out;
            border-radius: 1px;
        }
        .nav-link:hover::after, .nav-link.active::after {
            width: 100%;
        }
        .dark-section { 
            background-color: #00253D; 
            color: white;
            background-image: radial-gradient(circle at top left, rgba(34, 132, 184, 0.1) 0%, transparent 30%);
        }
    </style>
`;

// Function to apply header to current page
function applyStandardHeader() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Add header styles if not already present
    if (!document.querySelector('style[data-header-styles]')) {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-header-styles', 'true');
        styleElement.innerHTML = headerStyles;
        document.head.appendChild(styleElement);
    }
    
    // Mark active nav link
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (currentPage.includes(linkPage) || (currentPage === 'index.html' && linkPage === 'index')) {
                link.classList.add('active');
            }
        });
        
        // Setup mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }, 100);
}

// Function to fix brand colors
function fixBrandColors() {
    // Replace all #2563EB with #2284B8
    const elementsToFix = document.querySelectorAll('*');
    elementsToFix.forEach(el => {
        const style = window.getComputedStyle(el);
        
        // Check background color
        if (style.backgroundColor === 'rgb(37, 99, 235)') {
            el.style.backgroundColor = '#2284B8';
        }
        
        // Check text color
        if (style.color === 'rgb(37, 99, 235)') {
            el.style.color = '#2284B8';
        }
        
        // Check border color
        if (style.borderColor === 'rgb(37, 99, 235)') {
            el.style.borderColor = '#2284B8';
        }
    });
    
    // Fix inline styles
    const inlineStyleElements = document.querySelectorAll('[style*="#2563EB"]');
    inlineStyleElements.forEach(el => {
        el.style.cssText = el.style.cssText.replace(/#2563EB/gi, '#2284B8');
    });
}

// Function to fix checkmarks in programs section
function fixProgramCheckmarks() {
    // Find all checkmark SVGs in the programs section
    const programSection = document.getElementById('programs');
    if (programSection) {
        const checkmarks = programSection.querySelectorAll('svg[fill="currentColor"]');
        checkmarks.forEach(svg => {
            const parentLi = svg.closest('li');
            if (parentLi && parentLi.textContent.includes('focus on')) {
                // Replace with bullet point
                const bullet = document.createElement('span');
                bullet.style.cssText = 'display: inline-block; width: 6px; height: 6px; background-color: #2284B8; border-radius: 50%; margin-right: 8px; flex-shrink: 0; margin-top: 6px;';
                svg.parentElement.replaceChild(bullet, svg);
            }
        });
    }
}

// Function to fix icon colors in about section
function fixAboutIcons() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const svgIcons = aboutSection.querySelectorAll('svg.text-\\[\\#2284B8\\], svg.text-\\[\\#23C552\\]');
        svgIcons.forEach(svg => {
            svg.style.color = '#2284B8';
            svg.classList.remove('text-[#23C552]');
            svg.classList.add('text-[#2284B8]');
        });
    }
}

// Function to fix CTA section structure
function fixCTASection() {
    const ctaSection = document.querySelector('section[aria-label="Call to action"]');
    if (ctaSection) {
        // Fix button colors
        const buttons = ctaSection.querySelectorAll('a.bg-\\[\\#2284B8\\], a[style*="background-color"]');
        buttons.forEach(btn => {
            if (!btn.style.backgroundColor || btn.style.backgroundColor !== '#2284B8') {
                btn.style.backgroundColor = '#2284B8';
            }
        });
        
        // Fix text structure
        const headings = ctaSection.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            heading.style.fontFamily = 'Outfit, sans-serif';
            heading.style.fontWeight = '700';
        });
        
        // Ensure proper spacing
        const container = ctaSection.querySelector('.max-w-7xl');
        if (container) {
            container.style.padding = '0 1rem';
        }
    }
}

// Initialize all fixes when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    applyStandardHeader();
    fixBrandColors();
    fixProgramCheckmarks();
    fixAboutIcons();
    fixCTASection();
});

// Also run fixes after a short delay to catch any dynamic content
setTimeout(() => {
    fixBrandColors();
    fixProgramCheckmarks();
    fixAboutIcons();
    fixCTASection();
}, 1000);
