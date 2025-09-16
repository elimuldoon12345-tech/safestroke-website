#!/bin/bash

# Apply brand consistency updates to all HTML files
echo "🎨 Applying Brand Consistency Updates..."

# Files to update
files=("index.html" "safestroke-aboutus.html" "safestroke-booking.html" "safestroke-location.html" "safestroke-pricing.html" "safestroke-programs.html" "safestroke-reviews.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Update CSS variable names to match brand-system.css
        sed -i 's/--brand-blue/--ss-blue/g' "$file"
        sed -i 's/--brand-navy/--ss-navy/g' "$file"
        sed -i 's/--brand-sky/--ss-sky/g' "$file"
        sed -i 's/--accent-green/--ss-accent-green/g' "$file"
        
        # Update button text standardization  
        sed -i 's/>Book Your Free Lesson</>Book Free Lesson</g' "$file"
        sed -i 's/>Book a Free Lesson</>Book Free Lesson</g' "$file"
        sed -i 's/>Book Free Trial</>Book Free Lesson</g' "$file"
        sed -i 's/>Get Started</>Book Free Lesson</g' "$file"
        sed -i 's/>Schedule Now</>Book Now</g' "$file"
        sed -i 's/>Book a Lesson</>Book Now</g' "$file"
        
        # Update program names
        sed -i 's/Bubble Buddies/Strokelet — Level 1/g' "$file"
        sed -i 's/Stroke Starters/Strokelet — Level 2/g' "$file"
        sed -i 's/Strokelet - Level/Strokelet — Level/g' "$file"
        
        # Update location text
        sed -i 's/>Location</>Our Location</g' "$file"
        sed -i 's/>Find Us</>Our Location</g' "$file"
        
        # Update color hex values to CSS variables
        sed -i 's/#2284B8/var(--ss-blue)/g' "$file"
        sed -i 's/#0B3856/var(--ss-navy)/g' "$file"
        sed -i 's/#E9F5FC/var(--ss-sky)/g' "$file"
        sed -i 's/#10B981/var(--ss-accent-green)/g' "$file"
        sed -i 's/#23C552/var(--ss-accent-green)/g' "$file"
        
        echo "✅ $file updated"
    fi
done

echo "
✅ Brand consistency applied!
📝 Summary of changes:
• CSS variables updated to match brand-system.css
• CTAs standardized to 'Book Free Lesson' and 'Book Now'
• Program names use em dash (—)
• Colors use CSS variables instead of hex values

🚀 Next steps:
1. Review changes in browser
2. Commit: git add -A && git commit -m 'Apply brand consistency'
3. Push: git push origin main
"