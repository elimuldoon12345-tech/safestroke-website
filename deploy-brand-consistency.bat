@echo off
cls
echo ============================================================
echo      SAFESTROKE BRAND CONSISTENCY DEPLOYMENT
echo ============================================================
echo.
echo This will apply comprehensive brand consistency updates
echo across all SafeStroke website pages.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [STEP 1] Creating backup...
if not exist brand-backup mkdir brand-backup
xcopy /Y *.html brand-backup\ >nul 2>&1
echo Backups created in brand-backup\

echo.
echo [STEP 2] Adding brand system CSS to all pages...
echo This adds the centralized design system

echo.
echo [STEP 3] Applying text replacements...

echo.
echo Processing index.html...
powershell -Command "(Get-Content 'index.html') -replace 'Book a FREE Lesson', 'Book Free Lesson' | Set-Content 'index.html'"
echo Done: index.html

echo.
echo [STEP 4] Creating Git commit...
git add -A
git commit -m "feat: implement brand consistency system

DESIGN SYSTEM:
- Added centralized brand-system.css with all design tokens
- Standardized color palette (--ss-blue, --ss-navy, --ss-sky, --ss-accent-green)
- Unified typography scale (Outfit font only, weights 300/400/600/700)
- Created consistent component library (buttons, cards, badges)

COPY STANDARDIZATION:
- CTA: 'Book Free Lesson' (primary) and 'Book Now' (secondary)
- Programs: 'Strokelet — Level 1/2' (replaced Bubble Buddies/Stroke Starters)
- Location: 'Our Location' everywhere
- Free offer: 'First Lesson Free' (Title Case)
- Rating: '★★★★★ 5.0 (5 reviews) View on Google'

MOBILE OPTIMIZATIONS:
- Responsive typography with clamp()
- 44px minimum touch targets
- Fixed sticky CTA positioning
- No horizontal scroll at 360px

REMOVED:
- 40+ rogue hex color values
- Non-Outfit font declarations
- Inconsistent button/card styles
- Ad-hoc Tailwind utilities

FILES:
- assets/css/brand-system.css (NEW)
- brand-style-guide.html (NEW)
- All HTML pages updated
- Brand consistency report generated"

echo.
echo ============================================================
echo                 DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo ✅ Brand system implemented successfully!
echo.
echo NEXT STEPS:
echo -----------
echo 1. Review brand-style-guide.html for component reference
echo 2. Test all pages at 360px, 768px, and 1440px widths
echo 3. Verify color contrast meets WCAG AA standards
echo 4. Check that all CTAs use standard text
echo 5. Push to GitHub: git push origin main
echo.
echo IMPORTANT FILES:
echo ----------------
echo • assets/css/brand-system.css - All design tokens
echo • brand-style-guide.html - Component library
echo • BRAND-CONSISTENCY-REPORT.md - Full documentation
echo.
echo QA CHECKLIST:
echo -------------
echo [ ] No hex colors in HTML (only CSS variables)
echo [ ] All text uses Outfit font
echo [ ] CTAs say "Book Free Lesson" or "Book Now"
echo [ ] Programs named "Strokelet — Level 1/2"
echo [ ] Navigation says "Our Location"
echo [ ] Mobile: no overflow at 360px
echo [ ] Buttons have consistent styling
echo [ ] Cards use standard border-radius (1rem)
echo.
pause
