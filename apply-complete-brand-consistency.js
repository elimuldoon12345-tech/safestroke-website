const fs = require('fs');
const path = require('path');

// Brand consistency updates
const brandUpdates = {
  // CTA standardization
  ctaUpdates: [
    // Primary CTAs
    { old: /Book Your Free Lesson/gi, new: 'Book Free Lesson' },
    { old: /Book a Free Lesson/gi, new: 'Book Free Lesson' },
    { old: /Book Free Trial/gi, new: 'Book Free Lesson' },
    { old: /Book Your Free Trial/gi, new: 'Book Free Lesson' },
    { old: /Book a Free Trial/gi, new: 'Book Free Lesson' },
    { old: /Start Free Trial/gi, new: 'Book Free Lesson' },
    { old: /Get Started/gi, new: 'Book Free Lesson' },
    { old: /Book Free Trial Now/gi, new: 'Book Free Lesson' },
    
    // Secondary CTAs (when not for free lesson)
    { old: /Book a Lesson/gi, new: 'Book Now' },
    { old: /Book Your Lesson/gi, new: 'Book Now' },
    { old: /Schedule Now/gi, new: 'Book Now' },
    { old: /Reserve Your Spot/gi, new: 'Book Now' },
  ],
  
  // Program name standardization
  programUpdates: [
    { old: /Bubble Buddies/gi, new: 'Strokelet — Level 1' },
    { old: /Stroke Starters/gi, new: 'Strokelet — Level 2' },
    { old: /Strokelet - Level 1/gi, new: 'Strokelet — Level 1' },
    { old: /Strokelet - Level 2/gi, new: 'Strokelet — Level 2' },
    { old: /Strokelet Level 1/gi, new: 'Strokelet — Level 1' },
    { old: /Strokelet Level 2/gi, new: 'Strokelet — Level 2' },
  ],
  
  // Location consistency
  locationUpdates: [
    { old: /Location/gi, new: 'Our Location' },
    { old: /Find Us/gi, new: 'Our Location' },
    { old: /Visit Us/gi, new: 'Our Location' },
  ],
  
  // Free offer standardization
  freeOfferUpdates: [
    { old: /first lesson free/gi, new: 'First Lesson Free' },
    { old: /FREE first lesson/gi, new: 'First Lesson Free' },
    { old: /complimentary first lesson/gi, new: 'First Lesson Free' },
    { old: /free trial lesson/gi, new: 'First Lesson Free' },
  ],
  
  // Remove non-Outfit fonts
  fontUpdates: [
    { old: /font-family:\s*['"]Inter['"][^;}]*/gi, new: 'font-family: \'Outfit\', sans-serif' },
    { old: /font-family:\s*['"]Poppins['"][^;}]*/gi, new: 'font-family: \'Outfit\', sans-serif' },
    { old: /font-family:\s*['"]Roboto['"][^;}]*/gi, new: 'font-family: \'Outfit\', sans-serif' },
    { old: /font-family:\s*['"]Open Sans['"][^;}]*/gi, new: 'font-family: \'Outfit\', sans-serif' },
  ],
  
  // Color standardization
  colorUpdates: [
    // Replace non-brand blues
    { old: /#0073e6/gi, new: 'var(--ss-blue)' },
    { old: /#007bff/gi, new: 'var(--ss-blue)' },
    { old: /#0056b3/gi, new: 'var(--ss-blue)' },
    { old: /#004085/gi, new: 'var(--ss-navy)' },
    { old: /#00253d/gi, new: 'var(--ss-navy)' },
    { old: /#e9f5fc/gi, new: 'var(--ss-sky)' },
    { old: /#10b981/gi, new: 'var(--ss-accent-green)' },
    { old: /#23c552/gi, new: 'var(--ss-accent-green)' },
  ]
};

// Files to update
const htmlFiles = [
  'index.html',
  'safestroke-aboutus.html',
  'safestroke-booking.html',
  'safestroke-location.html',
  'safestroke-pricing.html',
  'safestroke-programs.html',
  'safestroke-reviews.html',
  'admin-dashboard.html'
];

// Function to apply updates
function applyBrandConsistency(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changeCount = 0;
    
    // Apply all updates
    Object.values(brandUpdates).forEach(updateSet => {
      updateSet.forEach(update => {
        const regex = update.old;
        const newContent = content.replace(regex, (match) => {
          changeCount++;
          return update.new;
        });
        content = newContent;
      });
    });
    
    // Ensure brand-system.css is included
    if (!content.includes('brand-system.css')) {
      const headEnd = content.indexOf('</head>');
      if (headEnd !== -1) {
        const brandCssLink = '    <link rel="stylesheet" href="/assets/css/brand-system.css">\n';
        content = content.slice(0, headEnd) + brandCssLink + content.slice(headEnd);
        changeCount++;
      }
    }
    
    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${path.basename(filePath)}: ${changeCount} changes`);
      return changeCount;
    } else {
      console.log(`⏭️  No changes needed for ${path.basename(filePath)}`);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Main execution
console.log('🎨 Applying Brand Consistency Updates...\n');
console.log('=' .repeat(50));

let totalChanges = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    totalChanges += applyBrandConsistency(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('=' .repeat(50));
console.log(`\n✅ Brand consistency applied!`);
console.log(`📊 Total changes made: ${totalChanges}`);
console.log('\n📝 Summary:');
console.log('• Standardized all CTAs to "Book Free Lesson" and "Book Now"');
console.log('• Updated program names to use em dash (—)');
console.log('• Unified location references to "Our Location"');
console.log('• Standardized free offer text to Title Case');
console.log('• Added brand-system.css to all HTML files');
console.log('\n🚀 Next steps:');
console.log('1. Review the changes in your browser');
console.log('2. Test all CTAs and navigation');
console.log('3. Commit changes: git add -A && git commit -m "Apply brand consistency"');
console.log('4. Push to deploy: git push origin main');