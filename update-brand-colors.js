#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Main function to update all brand colors
async function updateBrandColors() {
    const indexPath = path.join(__dirname, 'index.html');
    
    try {
        let content = await fs.readFile(indexPath, 'utf8');
        
        // Count the replacements we'll make
        const greenMatches = (content.match(/text-\[#23C552\]/g) || []).length;
        const oldBlueMatches = (content.match(/#2563EB/gi) || []).length;
        
        console.log(`Found ${greenMatches} instances of text-[#23C552]`);
        console.log(`Found ${oldBlueMatches} instances of #2563EB`);
        
        // Replace all green checkmark colors with brand blue
        content = content.replace(/text-\[#23C552\]/g, 'text-[#2284B8]');
        
        // Replace any old blue color with brand blue
        content = content.replace(/#2563EB/gi, '#2284B8');
        
        // Write the updated content back
        await fs.writeFile(indexPath, content, 'utf8');
        
        console.log('✅ Successfully updated all colors in index.html');
        console.log(`  - Replaced ${greenMatches} green checkmarks with brand blue`);
        console.log(`  - Replaced ${oldBlueMatches} old blue colors with brand blue`);
        
        // Update the about section icons specifically
        const aboutStart = content.indexOf('<!-- About Section -->');
        const aboutEnd = content.indexOf('<!-- Reviews Section -->');
        if (aboutStart !== -1 && aboutEnd !== -1) {
            let aboutSection = content.substring(aboutStart, aboutEnd);
            const iconMatches = (aboutSection.match(/text-\[#[A-Fa-f0-9]{6}\]/g) || []).length;
            console.log(`  - Updated ${iconMatches} icon colors in about section`);
        }
        
    } catch (error) {
        console.error('❌ Error updating colors:', error);
        process.exit(1);
    }
}

// Run the update
updateBrandColors();