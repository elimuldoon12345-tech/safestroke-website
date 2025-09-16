#!/usr/bin/env python3
"""
SafeStroke Website Brand Consistency Update Script
Updates all HTML files to ensure brand consistency:
1. Replace all #2563EB with #2284B8
2. Standardize headers across all pages
3. Replace checkmarks with brand blue bullet points
4. Fix icon colors in about section
5. Improve CTA section structure
"""

import os
import re
from pathlib import Path

# Get the website directory
WEBSITE_DIR = Path("C:/Users/mattj/Desktop/safestroke-website")

def update_checkmarks_to_bullets(content):
    """Replace all checkmark SVGs with brand blue bullet points"""
    
    # Pattern for checkmark SVGs (both green and blue)
    checkmark_patterns = [
        # Standard checkmark pattern with various colors
        r'<svg class="w-4 h-4 text-\[#[0-9A-Fa-f]{6}\] mt-0\.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3\.707-9\.293a1 1 0 00-1\.414-1\.414L9 10\.586 7\.707 9\.293a1 1 0 00-1\.414 1\.414l2 2a1 1 0 001\.414 0l4-4z" clip-rule="evenodd"></path></svg>',
        # Alternative checkmark patterns
        r'<svg class="w-4 h-4 text-\[[^\]]+\] mt-0\.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8[^>]+></path></svg>',
    ]
    
    # Replace with brand blue bullet point
    bullet_replacement = '<span class="w-2 h-2 bg-[#2284B8] rounded-full mt-1.5 flex-shrink-0"></span>'
    
    for pattern in checkmark_patterns:
        content = re.sub(pattern, bullet_replacement, content)
    
    return content

def update_icon_colors(content):
    """Update icon colors in about section to brand blue"""
    
    # Update green icons (#23C552) to brand blue (#2284B8)
    content = content.replace('text-[#23C552]', 'text-[#2284B8]')
    content = content.replace('bg-[#23C552]', 'bg-[#2284B8]')
    content = content.replace('#23C552', '#2284B8')
    
    # For SVG icons in about section, ensure they use fill attribute
    about_icon_pattern = r'<svg aria-hidden="true" class="w-6 h-6 text-\[#[0-9A-Fa-f]{6}\] flex-shrink-0 mt-0\.5" fill="none" stroke="currentColor"'
    about_icon_replacement = r'<svg aria-hidden="true" class="w-6 h-6 text-[#2284B8] flex-shrink-0 mt-0.5" fill="#2284B8" stroke="#2284B8"'
    content = re.sub(about_icon_pattern, about_icon_replacement, content)
    
    return content

def update_blue_color(content):
    """Replace all instances of #2563EB with #2284B8"""
    content = content.replace('#2563EB', '#2284B8')
    content = content.replace('2563EB', '2284B8')
    return content

def get_main_header():
    """Extract the header from index.html to use as template"""
    index_file = WEBSITE_DIR / "index.html"
    if not index_file.exists():
        print(f"Warning: index.html not found at {index_file}")
        return None
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract header section (from <nav to closing </nav>)
    nav_pattern = r'<nav class="bg-white sticky top-0 z-50 shadow-lg rounded-b-2xl">.*?</nav>'
    match = re.search(nav_pattern, content, re.DOTALL)
    
    if match:
        return match.group(0)
    return None

def update_header(content, main_header):
    """Replace header in content with main page header"""
    if not main_header:
        return content
    
    # Pattern to match existing nav section
    nav_pattern = r'<nav[^>]*>.*?</nav>'
    
    # Replace with main header
    content = re.sub(nav_pattern, main_header, content, count=1, flags=re.DOTALL)
    
    return content

def fix_cta_section(content):
    """Fix the structure and visual formatting of the CTA section"""
    
    # Improve CTA section styling - ensure proper gradient and structure
    cta_section_pattern = r'<section class="relative py-16 md:py-20 pb-24 overflow-hidden bg-gradient-to-b from-\[#0B3856\] to-\[#00253D\]"'
    
    if cta_section_pattern in content:
        # Already has the correct structure
        return content
    
    # Update old CTA section patterns to new structure
    old_cta_patterns = [
        r'<section class="py-20 bg-gradient-to-br from-blue-600 to-blue-800"',
        r'<section class="py-16 md:py-20 bg-gradient-to-b from-\[#0B3856\] to-\[#00253D\]"',
    ]
    
    new_cta_start = '<section class="relative py-16 md:py-20 pb-24 overflow-hidden bg-gradient-to-b from-[#0B3856] to-[#00253D]"'
    
    for pattern in old_cta_patterns:
        content = content.replace(pattern, new_cta_start)
    
    return content

def process_file(file_path):
    """Process a single HTML file"""
    print(f"Processing {file_path.name}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all updates
        content = update_blue_color(content)
        content = update_checkmarks_to_bullets(content)
        content = update_icon_colors(content)
        content = fix_cta_section(content)
        
        # Update header for non-index files
        if file_path.name != 'index.html':
            main_header = get_main_header()
            if main_header:
                content = update_header(content, main_header)
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {file_path.name}")
        else:
            print(f"  No changes needed for {file_path.name}")
            
    except Exception as e:
        print(f"✗ Error processing {file_path.name}: {e}")

def main():
    """Main function to process all HTML files"""
    print("SafeStroke Website Brand Consistency Update")
    print("=" * 50)
    
    # Get all HTML files
    html_files = list(WEBSITE_DIR.glob("*.html"))
    
    if not html_files:
        print(f"No HTML files found in {WEBSITE_DIR}")
        return
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    # Process each file
    for file_path in html_files:
        process_file(file_path)
    
    print("\n" + "=" * 50)
    print("Update complete!")
    print("\nChanges made:")
    print("1. Replaced all #2563EB with #2284B8")
    print("2. Standardized headers across all pages")
    print("3. Replaced checkmarks with brand blue bullet points")
    print("4. Fixed icon colors in about sections")
    print("5. Improved CTA section structure")

if __name__ == "__main__":
    main()
