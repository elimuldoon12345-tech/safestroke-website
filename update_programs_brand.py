#!/usr/bin/env python3
"""
SafeStroke Programs Section Brand Update
Updates the Programs section to be brand-consistent, professional, and mobile-friendly.

Requirements:
- Font: Outfit only (300/400/600/700)
- Colors: Use CSS custom properties (--ss-blue, --ss-navy, etc.)
- Reduce green usage - only for "First Lesson Free" badge
- Standardize badges, labels, and pricing formats
- Trim copy to 3 bullets per section
- Fix Family Savings tile to reduce green dominance
- Ensure mobile responsiveness
"""

import re
from pathlib import Path

def update_programs_section():
    """Update the Programs section in index.html"""
    
    # Define file path
    file_path = Path("C:/Users/mattj/Desktop/safestroke-website/index.html")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add CSS custom properties in the style section
    css_properties = '''        :root {
            /* Brand Colors - Design Tokens */
            --ss-blue: #2284B8;
            --ss-navy: #0B3856;
            --ss-sky: #E9F5FC;
            --ss-accent-green: #10B981;
            
            /* Neutral Palette */
            --ss-gray-50: #F9FAFB;
            --ss-gray-100: #F3F4F6;
            --ss-gray-200: #E5E7EB;
            --ss-gray-300: #D1D5DB;
            --ss-gray-400: #9CA3AF;
            --ss-gray-500: #6B7280;
            --ss-gray-600: #4B5563;
            --ss-gray-700: #374151;
            --ss-gray-800: #1F2937;
            --ss-gray-900: #111827;
            
            /* Component Tokens */
            --ss-radius: 0.5rem;  /* rounded-2xl */
            --ss-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --ss-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --ss-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }'''
    
    # Replace existing :root section
    content = re.sub(
        r':root\s*{[^}]*}',
        css_properties,
        content,
        count=1
    )
    
    # 2. Create the updated Programs section HTML
    programs_section = '''        <!-- Programs Section -->
        <section id="programs" class="py-20 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Section Header -->
                <div class="text-center mb-12">
                    <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif; font-weight: 700;">Our Programs</h2>
                    <p class="text-lg max-w-3xl mx-auto" style="color: var(--ss-gray-600); font-family: 'Outfit', sans-serif; font-weight: 400;">
                        Age-appropriate instruction that builds skills progressively at your child's pace.
                    </p>
                </div>

                <!-- Programs Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                    <!-- Droplet Card -->
                    <div class="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
                        <div class="p-6 flex-1">
                            <!-- Header Row -->
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-2xl font-bold" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Droplet</h3>
                                    <p class="text-sm font-semibold mt-1" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Ages 3–24 Months</p>
                                </div>
                                <img src="safestroke-images/droplet-shield.png" alt="Droplet" class="w-12 h-12 object-contain">
                            </div>
                            
                            <!-- Meta Row -->
                            <div class="flex flex-wrap gap-2 mb-6">
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    8:1 Ratio
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    30 min
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style="background: rgba(16, 185, 129, 0.1); color: var(--ss-accent-green);">
                                    First Lesson Free
                                </span>
                            </div>
                            
                            <!-- Price -->
                            <p class="text-sm font-medium mb-4" style="color: var(--ss-gray-600);">From $25 per lesson</p>
                            
                            <!-- What We Focus On -->
                            <div class="mb-5">
                                <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What we focus on</h4>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Water comfort with songs & play</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Safe parent holds</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Wall holds & assisted entries</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- What Parents Notice -->
                            <div class="mb-5">
                                <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What parents notice</h4>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Happier bath time</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Purposeful splashing & kicking</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Reaching for toys</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- Goal -->
                            <p class="text-sm font-medium mb-6 pt-4 border-t" style="color: var(--ss-navy); border-color: var(--ss-gray-200);">
                                <strong>Goal:</strong> Calm, happy baby who enjoys the water
                            </p>
                            
                            <!-- CTA -->
                            <a href="safestroke-programs.html#droplet" 
                               class="block w-full text-center py-3 px-6 border-2 rounded-2xl font-semibold transition duration-200" 
                               style="border-color: var(--ss-blue); color: var(--ss-blue); font-family: 'Outfit', sans-serif;"
                               onmouseover="this.style.backgroundColor='var(--ss-blue)'; this.style.color='white';"
                               onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--ss-blue)';">
                                View Droplet Details
                            </a>
                        </div>
                    </div>
                    
                    <!-- Splashlet Card -->
                    <div class="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
                        <div class="p-6 flex-1">
                            <!-- Header Row -->
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-2xl font-bold" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Splashlet</h3>
                                    <p class="text-sm font-semibold mt-1" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Ages 2–3 Years</p>
                                </div>
                                <img src="safestroke-images/splashlet-shield.png" alt="Splashlet" class="w-12 h-12 object-contain">
                            </div>
                            
                            <!-- Meta Row -->
                            <div class="flex flex-wrap gap-2 mb-6">
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    4:1 Ratio
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    30 min
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style="background: rgba(16, 185, 129, 0.1); color: var(--ss-accent-green);">
                                    First Lesson Free
                                </span>
                            </div>
                            
                            <!-- Price -->
                            <p class="text-sm font-medium mb-4" style="color: var(--ss-gray-600);">From $35 per lesson</p>
                            
                            <!-- What We Focus On -->
                            <div class="mb-5">
                                <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What we focus on</h4>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Bubbles & breath control</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Assisted front/back floats</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">First kicks & arm moves</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- What Parents Notice -->
                            <div class="mb-5">
                                <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What parents notice</h4>
                                <ul class="space-y-2">
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Brief submersion with encouragement</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Safe jumps with help</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                        <span class="text-sm" style="color: var(--ss-gray-700);">Responds to "1–2–3"</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- Goal -->
                            <p class="text-sm font-medium mb-6 pt-4 border-t" style="color: var(--ss-navy); border-color: var(--ss-gray-200);">
                                <strong>Goal:</strong> Trust in water & basic skills without a parent in the pool
                            </p>
                            
                            <!-- CTA -->
                            <a href="safestroke-programs.html#splashlet" 
                               class="block w-full text-center py-3 px-6 border-2 rounded-2xl font-semibold transition duration-200" 
                               style="border-color: var(--ss-blue); color: var(--ss-blue); font-family: 'Outfit', sans-serif;"
                               onmouseover="this.style.backgroundColor='var(--ss-blue)'; this.style.color='white';"
                               onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--ss-blue)';">
                                View Splashlet Details
                            </a>
                        </div>
                    </div>
                    
                    <!-- Strokelet Card -->
                    <div class="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
                        <div class="p-6 flex-1">
                            <!-- Header Row -->
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-2xl font-bold" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Strokelet</h3>
                                    <p class="text-sm font-semibold mt-1" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Ages 3–12 Years</p>
                                </div>
                                <img src="safestroke-images/strokelet-shield.png" alt="Strokelet" class="w-12 h-12 object-contain">
                            </div>
                            
                            <!-- Level Pills -->
                            <div class="flex gap-2 mb-4">
                                <button class="px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1" 
                                        style="background: var(--ss-blue); color: white; font-family: 'Outfit', sans-serif;"
                                        onclick="showLevel(this, 1)">
                                    Level 1
                                </button>
                                <button class="px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1" 
                                        style="background: var(--ss-gray-100); color: var(--ss-gray-700); font-family: 'Outfit', sans-serif;"
                                        onclick="showLevel(this, 2)">
                                    Level 2
                                </button>
                            </div>
                            
                            <!-- Meta Row -->
                            <div class="flex flex-wrap gap-2 mb-6">
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    3:1 Ratio
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--ss-gray-100); color: var(--ss-gray-700);">
                                    30 min
                                </span>
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style="background: rgba(16, 185, 129, 0.1); color: var(--ss-accent-green);">
                                    First Lesson Free
                                </span>
                            </div>
                            
                            <!-- Price -->
                            <p class="text-sm font-medium mb-4" style="color: var(--ss-gray-600);">From $40 per lesson</p>
                            
                            <!-- Level 1 Content (default shown) -->
                            <div id="strokelet-level-1">
                                <!-- What We Focus On -->
                                <div class="mb-5">
                                    <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What we focus on</h4>
                                    <ul class="space-y-2">
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Breath control & confident submersion</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">5–10s back float</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Jump–turn–swim to safety</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <!-- What Parents Notice -->
                                <div class="mb-5">
                                    <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What parents notice</h4>
                                    <ul class="space-y-2">
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Swims a few yards</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Calm jump & resurface</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Relaxed back float</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <!-- Level 2 Content (initially hidden) -->
                            <div id="strokelet-level-2" style="display: none;">
                                <!-- What We Focus On -->
                                <div class="mb-5">
                                    <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What we focus on</h4>
                                    <ul class="space-y-2">
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Streamlined freestyle technique</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Backstroke fundamentals</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-navy);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Endurance building (12+ yards)</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <!-- What Parents Notice -->
                                <div class="mb-5">
                                    <h4 class="font-bold text-sm mb-3" style="color: var(--ss-navy);">What parents notice</h4>
                                    <ul class="space-y-2">
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Swimming full pool width confidently</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Floating for 1+ minute effortlessly</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background: var(--ss-blue);"></span>
                                            <span class="text-sm" style="color: var(--ss-gray-700);">Climbing out unassisted</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <!-- Goal -->
                            <p class="text-sm font-medium mb-6 pt-4 border-t" style="color: var(--ss-navy); border-color: var(--ss-gray-200);">
                                <strong>Goal:</strong> Foundation for safe, independent swimming
                            </p>
                            
                            <!-- CTA -->
                            <a href="safestroke-programs.html#strokelet" 
                               class="block w-full text-center py-3 px-6 border-2 rounded-2xl font-semibold transition duration-200" 
                               style="border-color: var(--ss-blue); color: var(--ss-blue); font-family: 'Outfit', sans-serif;"
                               onmouseover="this.style.backgroundColor='var(--ss-blue)'; this.style.color='white';"
                               onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--ss-blue)';">
                                View Strokelet Details
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Family Savings Banner (Reduced Green) -->
                <div class="mt-12 max-w-4xl mx-auto">
                    <div class="bg-white rounded-2xl shadow-md p-6 border-l-4" style="border-color: var(--ss-accent-green);">
                        <div class="flex items-center justify-between flex-wrap gap-4">
                            <div class="flex items-start gap-3">
                                <svg class="w-8 h-8 mt-1 flex-shrink-0" style="color: var(--ss-accent-green);" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                </svg>
                                <div>
                                    <h3 class="text-lg font-bold mb-1" style="color: var(--ss-navy); font-family: 'Outfit', sans-serif;">Family Savings</h3>
                                    <p class="text-sm" style="color: var(--ss-gray-600); font-family: 'Outfit', sans-serif; font-weight: 400;">
                                        10% off each additional package after the first—all programs & sizes.
                                    </p>
                                </div>
                            </div>
                            <a href="safestroke-pricing.html#family-savings" 
                               class="inline-block px-5 py-2 border-2 rounded-full font-semibold text-sm transition duration-200 whitespace-nowrap"
                               style="border-color: var(--ss-blue); color: var(--ss-blue); font-family: 'Outfit', sans-serif;"
                               onmouseover="this.style.backgroundColor='var(--ss-blue)'; this.style.color='white';"
                               onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--ss-blue)';">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Progress Disclaimer -->
                <div class="mt-8 text-center">
                    <p class="text-xs max-w-3xl mx-auto px-4" style="color: var(--ss-gray-500); font-family: 'Outfit', sans-serif; font-weight: 300;">
                        Progress varies by individual child based on age, starting comfort level, and attendance consistency.
                    </p>
                </div>
            </div>
        </section>
        
        <script>
        function showLevel(button, level) {
            // Get all level buttons in this card
            const buttons = button.parentElement.querySelectorAll('button');
            
            // Update button styles
            buttons.forEach(btn => {
                if (btn === button) {
                    btn.style.background = 'var(--ss-blue)';
                    btn.style.color = 'white';
                } else {
                    btn.style.background = 'var(--ss-gray-100)';
                    btn.style.color = 'var(--ss-gray-700)';
                }
            });
            
            // Show/hide content
            const level1Content = document.getElementById('strokelet-level-1');
            const level2Content = document.getElementById('strokelet-level-2');
            
            if (level === 1) {
                level1Content.style.display = 'block';
                level2Content.style.display = 'none';
            } else {
                level1Content.style.display = 'none';
                level2Content.style.display = 'block';
            }
        }
        </script>'''
    
    # Find and replace the Programs section
    programs_pattern = r'<!-- Programs Section.*?</section>'
    programs_match = re.search(programs_pattern, content, re.DOTALL)
    
    if programs_match:
        content = content[:programs_match.start()] + programs_section + content[programs_match.end():]
    
    # Save the updated file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Programs section updated successfully!")
    print("\nChanges applied:")
    print("- Added CSS custom properties for brand colors")
    print("- Replaced green elements with navy/blue (kept green only for 'First Lesson Free')")
    print("- Standardized all badges and labels")
    print("- Updated pricing format to 'From $XX per lesson'")
    print("- Updated age format to use en-dash")
    print("- Reduced copy to 3 bullets per section")
    print("- Converted checkmarks to simple bullet points")
    print("- Updated Family Savings tile with reduced green dominance")
    print("- Ensured mobile responsiveness")

if __name__ == "__main__":
    update_programs_section()
