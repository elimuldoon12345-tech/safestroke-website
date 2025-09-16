#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Get the main index.html header for replication
async function getMainHeader() {
    const indexPath = path.join(__dirname, 'index.html');
    const indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Extract the header from index.html (from Top Bar to end of nav)
    const topBarStart = indexContent.indexOf('<!-- Top Bar -->');
    const navEnd = indexContent.indexOf('</nav>') + 6;
    const headerContent = indexContent.substring(topBarStart, navEnd);
    
    // Also extract the mobile menu JavaScript
    const scriptStart = indexContent.indexOf("document.getElementById('mobile-menu-button')");
    const scriptEnd = indexContent.indexOf('});', scriptStart) + 3;
    const mobileMenuScript = indexContent.substring(
        indexContent.lastIndexOf('<script>', scriptStart),
        indexContent.indexOf('</script>', scriptEnd) + 9
    );
    
    return { headerContent, mobileMenuScript };
}

// Replace headers in all pages
async function replaceHeaders() {
    const { headerContent, mobileMenuScript } = await getMainHeader();
    
    const pages = [
        'safestroke-aboutus.html',
        'safestroke-booking.html',
        'safestroke-location.html',
        'safestroke-pricing.html',
        'safestroke-programs.html',
        'safestroke-reviews.html'
    ];
    
    for (const page of pages) {
        const pagePath = path.join(__dirname, page);
        let content = await fs.readFile(pagePath, 'utf8');
        
        // Find and replace the header section
        const topBarStart = content.indexOf('<!-- Top Bar -->');
        const navEnd = content.indexOf('</nav>') + 6;
        
        if (topBarStart !== -1 && navEnd > topBarStart) {
            // Replace the header
            content = content.substring(0, topBarStart) + 
                     headerContent + 
                     content.substring(navEnd);
            
            // Ensure mobile menu script is present
            if (!content.includes("document.getElementById('mobile-menu-button')")) {
                // Add the script right after the header
                const insertPoint = content.indexOf('</nav>') + 6;
                content = content.substring(0, insertPoint) + 
                         '\n    ' + mobileMenuScript + '\n' +
                         content.substring(insertPoint);
            }
            
            // Update active nav link based on page
            if (page.includes('aboutus')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                content = content.replace('class="nav-link">About Us</a>', 'class="nav-link active">About Us</a>');
            } else if (page.includes('programs')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                content = content.replace('class="nav-link">Programs</a>', 'class="nav-link active">Programs</a>');
            } else if (page.includes('pricing')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                content = content.replace('class="nav-link">Pricing</a>', 'class="nav-link active">Pricing</a>');
            } else if (page.includes('reviews')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                content = content.replace('class="nav-link">Reviews</a>', 'class="nav-link active">Reviews</a>');
            } else if (page.includes('location')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                content = content.replace('class="nav-link">Our Location</a>', 'class="nav-link active">Our Location</a>');
            } else if (page.includes('booking')) {
                content = content.replace('class="nav-link active">Main</a>', 'class="nav-link">Main</a>');
                // Booking page doesn't have a nav link, so no active state
            }
            
            await fs.writeFile(pagePath, content);
            console.log(`✅ Updated header in ${page}`);
        } else {
            console.log(`⚠️  Could not find header markers in ${page}`);
        }
    }
}

// Replace checkmarks with brand color bullet points in programs section
async function updateProgramsSection() {
    const indexPath = path.join(__dirname, 'index.html');
    let content = await fs.readFile(indexPath, 'utf8');
    
    // In the programs section, the checkmarks are actually SVG icons already
    // They're using various colors like #2284B8, #23C552
    // Let's make them all use the brand primary blue #2284B8
    
    // Find the programs section
    const programsStart = content.indexOf('<!-- Programs Section');
    const programsEnd = content.indexOf('<!-- About Section -->');
    
    if (programsStart !== -1 && programsEnd !== -1) {
        let programsSection = content.substring(programsStart, programsEnd);
        
        // Replace green checkmark color with brand blue
        programsSection = programsSection.replace(/text-\[#23C552\]/g, 'text-[#2284B8]');
        
        // Update the content
        content = content.substring(0, programsStart) + 
                 programsSection + 
                 content.substring(programsEnd);
        
        await fs.writeFile(indexPath, content);
        console.log('✅ Updated checkmark colors in programs section');
    }
}

// Update about section icon colors
async function updateAboutSection() {
    const indexPath = path.join(__dirname, 'index.html');
    let content = await fs.readFile(indexPath, 'utf8');
    
    // Find the about section
    const aboutStart = content.indexOf('<!-- About Section -->');
    const aboutEnd = content.indexOf('<!-- Reviews Section -->');
    
    if (aboutStart !== -1 && aboutEnd !== -1) {
        let aboutSection = content.substring(aboutStart, aboutEnd);
        
        // Replace green icon colors with brand blue
        aboutSection = aboutSection.replace(/text-\[#23C552\]/g, 'text-[#2284B8]');
        
        // Ensure all SVG icons use brand blue
        aboutSection = aboutSection.replace(/class="w-6 h-6 text-\[#[A-Fa-f0-9]{6}\]/g, 'class="w-6 h-6 text-[#2284B8]');
        
        // Update the content
        content = content.substring(0, aboutStart) + 
                 aboutSection + 
                 content.substring(aboutEnd);
        
        await fs.writeFile(indexPath, content);
        console.log('✅ Updated icon colors in about section');
    }
}

// Fix the CTA section structure and visual formatting
async function fixCTASection() {
    const indexPath = path.join(__dirname, 'index.html');
    let content = await fs.readFile(indexPath, 'utf8');
    
    // The CTA section is already well-structured, but let's ensure consistent spacing and styling
    const ctaStart = content.indexOf('<!-- Hero CTA Section');
    const ctaEnd = content.indexOf('<!-- Dynamic Month Script -->');
    
    if (ctaStart !== -1 && ctaEnd !== -1) {
        let ctaSection = content.substring(ctaStart, ctaEnd);
        
        // Ensure all buttons use consistent brand colors
        ctaSection = ctaSection.replace(/bg-\[#2563EB\]/g, 'bg-[#2284B8]');
        ctaSection = ctaSection.replace(/hover:bg-\[#[A-Fa-f0-9]{6}\]/g, 'hover:bg-[#1976a3]');
        ctaSection = ctaSection.replace(/text-\[#2563EB\]/g, 'text-[#2284B8]');
        ctaSection = ctaSection.replace(/border-\[#2563EB\]/g, 'border-[#2284B8]');
        ctaSection = ctaSection.replace(/ring-\[#2563EB\]/g, 'ring-[#2284B8]');
        
        // Update the content
        content = content.substring(0, ctaStart) + 
                 ctaSection + 
                 content.substring(ctaEnd);
        
        await fs.writeFile(indexPath, content);
        console.log('✅ Fixed CTA section structure and colors');
    }
}

// Replace all #2563EB with #2284B8 globally
async function replaceColorGlobally() {
    const files = [
        'index.html',
        'safestroke-aboutus.html',
        'safestroke-booking.html',
        'safestroke-location.html',
        'safestroke-pricing.html',
        'safestroke-programs.html',
        'safestroke-reviews.html'
    ];
    
    for (const file of files) {
        const filePath = path.join(__dirname, file);
        let content = await fs.readFile(filePath, 'utf8');
        
        if (content.includes('#2563EB')) {
            content = content.replace(/#2563EB/gi, '#2284B8');
            await fs.writeFile(filePath, content);
            console.log(`✅ Replaced #2563EB with #2284B8 in ${file}`);
        }
    }
}

// Main execution
async function main() {
    try {
        console.log('🎨 Starting comprehensive brand updates...\n');
        
        // 1. Replace all #2563EB with #2284B8
        console.log('Step 1: Replacing color codes globally...');
        await replaceColorGlobally();
        
        // 2. Update all page headers to match main page
        console.log('\nStep 2: Standardizing headers across all pages...');
        await replaceHeaders();
        
        // 3. Update programs section checkmarks
        console.log('\nStep 3: Updating programs section...');
        await updateProgramsSection();
        
        // 4. Update about section icon colors
        console.log('\nStep 4: Updating about section icons...');
        await updateAboutSection();
        
        // 5. Fix CTA section
        console.log('\nStep 5: Fixing CTA section...');
        await fixCTASection();
        
        console.log('\n✨ All brand updates completed successfully!');
        console.log('📝 Summary of changes:');
        console.log('  - Replaced all #2563EB with #2284B8');
        console.log('  - Standardized headers across all pages');
        console.log('  - Updated programs section with brand colors');
        console.log('  - Fixed about section icon colors');
        console.log('  - Enhanced CTA section structure');
        
    } catch (error) {
        console.error('❌ Error during updates:', error);
        process.exit(1);
    }
}

// Run the script
main();