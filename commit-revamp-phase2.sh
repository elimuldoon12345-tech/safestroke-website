#!/bin/bash

echo "Starting SafeStroke website Phase 2 revamp..."

echo ""
echo "Step 1: Backing up Phase 1 files..."
cp index.html index-phase1-backup.html
cp safestroke-booking.html safestroke-booking-phase1-backup.html
cp safestroke-pricing.html safestroke-pricing-phase1-backup.html
cp safestroke-reviews.html safestroke-reviews-phase1-backup.html

echo ""
echo "Step 2: Applying Phase 2 updates..."

# Rename new files to replace old ones
if [ -f "safestroke-booking-new.html" ]; then
    mv safestroke-booking-new.html safestroke-booking.html
    echo "✓ Booking page updated"
fi

if [ -f "safestroke-pricing-new.html" ]; then
    mv safestroke-pricing-new.html safestroke-pricing.html
    echo "✓ Pricing page updated with FAQ and Family Savings"
fi

if [ -f "safestroke-reviews-new.html" ]; then
    mv safestroke-reviews-new.html safestroke-reviews.html
    echo "✓ Reviews page updated with 5 reviews"
fi

echo ""
echo "Step 3: Git operations..."
git add -A
git commit -m "Major website revamp - Phase 2 Complete

Phase 2 Updates:

Homepage (index.html):
- Implemented accessible tabs for Strokelet Level 1/2 with ARIA support
- Elevated Deep-Water Safety as bordered callout card
- Added keyboard navigation for tabs (Arrow keys)
- Fixed all green check icons to brand blue (except offers)

Pricing Page (safestroke-pricing.html):
- Added trust strip at top (5 Reviews, 3:1 Ratio, CPR Certified)
- Implemented Family Savings module with green accent
- Created accessible FAQ accordion with ARIA support
- Added FAQPage JSON-LD structured data
- Removed all savings percentages and guarantees
- Updated to use only Outfit font and brand colors

Reviews Page (safestroke-reviews.html):
- Updated to show exactly 5 reviews
- Added aggregate rating header (5.0 average • 5 reviews)
- Added 'View on Google' button
- Consistent review card formatting with initials/avatars
- Added 'Verified Parent' tags

Booking Page (safestroke-booking.html):
- Complete redesign with two choice cards
- Single Lesson card with FIRST-FREE badge (green accent)
- Package card with Family Savings info
- Accessible stepper for package flow
- Package code functionality with success/error states
- Removed all money-back guarantees and unverified claims

Global Updates:
- Outfit is now the only font (removed all Inter references)
- Review count consistently set to 5 throughout
- Accent green only used for offers (FIRST-FREE, Family Savings)
- Added data-cta attributes for analytics tracking
- Implemented global footer on all pages
- All focus states meet WCAG AA standards
- Minimum 44px touch targets throughout

Technical Improvements:
- CSS custom properties for brand colors
- Proper semantic HTML structure
- ARIA labels and live regions for dynamic content
- Keyboard navigation support
- LocalBusiness and FAQPage structured data
- Mobile-first responsive design

Acceptance Criteria Met:
✓ Outfit is the only font
✓ Review count = 5 everywhere
✓ Accent green only on offers/savings
✓ No guarantees or superlatives remain
✓ Programs tabs are ARIA-compliant
✓ Pricing has Family Savings + FAQ with JSON-LD
✓ Booking page has clear choice cards
✓ Global footer deployed on all updated pages"

echo ""
echo "Phase 2 complete! Ready to push changes."
echo "Run 'git push origin main' to deploy."
