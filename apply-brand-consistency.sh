#!/bin/bash
# SafeStroke Brand Consistency Update Script
# This script applies all brand consistency changes across the website

echo "========================================="
echo "SafeStroke Brand Consistency Update"
echo "========================================="

# Create backup directory
echo "Creating backups..."
mkdir -p brand-backup
cp index.html brand-backup/
cp safestroke-*.html brand-backup/

echo "Applying brand consistency updates..."

# Update all HTML files with brand system CSS
for file in index.html safestroke-*.html; do
    echo "Processing $file..."
    
    # Add brand system CSS link after Outfit font link
    sed -i '/<link href="https:\/\/fonts.googleapis.com.*Outfit/a\    <link rel="stylesheet" href="/assets/css/brand-system.css">' "$file"
    
    # Fix CTA text variations
    sed -i 's/Book a FREE Lesson/Book Free Lesson/g' "$file"
    sed -i 's/Book Your First Lesson/Book Free Lesson/g' "$file"
    sed -i 's/Book a Free Lesson Today/Book Free Lesson/g' "$file"
    sed -i 's/Book Lessons/Book Now/g' "$file"
    sed -i 's/Get Started/Book Free Lesson/g' "$file"
    
    # Fix program names
    sed -i 's/Bubble Buddies/Strokelet — Level 1/g' "$file"
    sed -i 's/Stroke Starters/Strokelet — Level 2/g' "$file"
    
    # Fix location labels
    sed -i 's/>Location</>Our Location</g' "$file"
    sed -i 's/"Location"/"Our Location"/g' "$file"
    
    # Fix "First Lesson Free" variations
    sed -i 's/FIRST-FREE/First Lesson Free/g' "$file"
    sed -i 's/First Free/First Lesson Free/g' "$file"
    sed -i 's/FREE First Lesson/First Lesson Free/g' "$file"
    
    # Fix SafeStroke naming
    sed -i 's/SafeStroke Swim School/SafeStroke Swim Academy/g' "$file"
    sed -i 's/swim school/swim academy/g' "$file"
    
    # Replace color utilities with tokens
    sed -i 's/text-blue-600/text-ss-blue/g' "$file"
    sed -i 's/text-blue-500/text-ss-blue/g' "$file"
    sed -i 's/bg-blue-600/bg-ss-blue/g' "$file"
    sed -i 's/bg-emerald-500/bg-ss-promo/g' "$file"
    sed -i 's/bg-emerald-600/bg-ss-promo/g' "$file"
    sed -i 's/text-emerald-600/text-ss-promo/g' "$file"
    sed -i 's/bg-gray-50/bg-ss-gray-light/g' "$file"
    sed -i 's/text-gray-700/text-ss-gray/g' "$file"
    sed -i 's/text-gray-600/text-ss-gray/g' "$file"
    
    # Update button classes
    sed -i 's/class="[^"]*btn[^"]*primary[^"]*"/class="ss-btn ss-btn-primary"/g' "$file"
    sed -i 's/class="[^"]*btn[^"]*secondary[^"]*"/class="ss-btn ss-btn-secondary"/g' "$file"
    
    # Fix hex colors in styles
    sed -i 's/#00253D/var(--ss-navy)/g' "$file"
    sed -i 's/#2284B8/var(--ss-blue)/g' "$file"
    sed -i 's/#E9F5FC/var(--ss-sky)/g' "$file"
    sed -i 's/#23C552/var(--ss-accent-green)/g' "$file"
    
    echo "✓ Updated $file"
done

echo ""
echo "========================================="
echo "Brand Consistency Update Complete!"
echo "========================================="
echo ""
echo "Changes Applied:"
echo "✓ Added brand-system.css to all pages"
echo "✓ Standardized CTA text (Book Free Lesson / Book Now)"
echo "✓ Fixed program names (Strokelet — Level 1/2)"
echo "✓ Updated location labels to 'Our Location'"
echo "✓ Normalized 'First Lesson Free' text"
echo "✓ Fixed SafeStroke naming (Academy, not School)"
echo "✓ Replaced color utilities with design tokens"
echo "✓ Standardized button classes"
echo ""
echo "Backups saved in: brand-backup/"
echo ""
echo "Next steps:"
echo "1. Review the changes in each file"
echo "2. Test all pages at different screen sizes"
echo "3. Commit changes to git"
