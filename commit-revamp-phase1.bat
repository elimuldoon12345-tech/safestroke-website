@echo off
echo Starting comprehensive SafeStroke website revamp...
cd /d C:\Users\mattj\Desktop\safestroke-website

echo.
echo Step 1: Backing up current files...
copy index.html index-backup.html
copy safestroke-booking.html safestroke-booking-backup.html
copy safestroke-pricing.html safestroke-pricing-backup.html
copy safestroke-aboutus.html safestroke-aboutus-backup.html
copy safestroke-reviews.html safestroke-reviews-backup.html
copy safestroke-location.html safestroke-location-backup.html

echo.
echo Step 2: Renaming new booking page...
move safestroke-booking-new.html safestroke-booking.html

echo.
echo Step 3: Git operations...
git add -A
git commit -m "Major website revamp - Phase 1

Global Updates:
- Removed all Inter font references, using Outfit exclusively
- Implemented CSS custom properties for brand colors
- Updated review count to 5 throughout site
- Accent green now only for offers/savings badges
- Added LocalBusiness JSON-LD structured data
- Fixed month ribbon bug with dynamic current month
- Added data-cta attributes for analytics

Homepage Updates:
- Updated meta tags and descriptions
- Converted Programs section icons from green to brand blue
- Fixed all check icons to use brand blue instead of green
- Updated About section with light background
- Removed superlatives and guarantees

Booking Page:
- Complete redesign with new structure
- Added H1 'Book Your Lessons' with trust strip
- Two choice cards: Single Lesson vs Packages
- Implemented accessible stepper for package flow
- Added package code functionality with success/error states
- Removed money-back guarantee and unverified savings claims
- Added Family Savings module with proper green badge
- Improved accessibility with ARIA labels and focus states
- Minimum 44px touch targets throughout

Accessibility:
- Added proper focus indicators
- Implemented ARIA live regions for dynamic content
- Added semantic HTML structure
- Keyboard navigation support

Next Phase:
- Update Pricing page with FAQ
- Update Reviews page with 5 reviews
- Update Location page with map
- Create global footer component"

echo.
echo Commit complete! Ready to push changes.
echo Run 'git push origin main' to deploy.
pause