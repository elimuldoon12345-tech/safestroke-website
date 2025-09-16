@echo off
cls
echo =========================================
echo SafeStroke Brand Consistency Update
echo =========================================
echo.

REM Create backup directory
echo Creating backups...
if not exist brand-backup mkdir brand-backup
copy index.html brand-backup\ >nul 2>&1
copy safestroke-*.html brand-backup\ >nul 2>&1

echo.
echo Applying brand consistency updates...
echo.

REM Process each HTML file
for %%f in (index.html safestroke-*.html) do (
    echo Processing %%f...
    
    REM Create temporary file with updates
    powershell -Command "(Get-Content '%%f') -replace 'Book a FREE Lesson', 'Book Free Lesson' -replace 'Book Your First Lesson', 'Book Free Lesson' -replace 'Book a Free Lesson Today', 'Book Free Lesson' -replace 'Book Lessons', 'Book Now' -replace 'Get Started Today', 'Book Free Lesson' -replace 'Bubble Buddies', 'Strokelet — Level 1' -replace 'Stroke Starters', 'Strokelet — Level 2' -replace '>Location<', '>Our Location<' -replace 'FIRST-FREE', 'First Lesson Free' -replace 'First Free', 'First Lesson Free' -replace 'SafeStroke Swim School', 'SafeStroke Swim Academy' -replace 'swim school', 'swim academy' -replace 'text-blue-600', 'text-ss-blue' -replace 'text-blue-500', 'text-ss-blue' -replace 'bg-blue-600', 'bg-ss-blue' -replace 'bg-emerald-500', 'bg-ss-promo' -replace 'bg-emerald-600', 'bg-ss-promo' -replace 'text-emerald-600', 'text-ss-promo' -replace 'bg-gray-50', 'bg-ss-gray-light' -replace '#00253D', 'var(--ss-navy)' -replace '#E9F5FC', 'var(--ss-sky)' -replace '#23C552', 'var(--ss-accent-green)' | Set-Content '%%f.tmp'"
    
    REM Replace original with updated
    move /Y %%f.tmp %%f >nul 2>&1
    echo Done: %%f
)

echo.
echo =========================================
echo Brand Consistency Update Complete!
echo =========================================
echo.
echo Changes Applied:
echo - Standardized CTA text
echo - Fixed program names
echo - Updated location labels
echo - Normalized free offer text
echo - Fixed SafeStroke naming
echo - Replaced color utilities
echo.
echo Backups saved in: brand-backup\
echo.
echo Next steps:
echo 1. Add brand-system.css link to all HTML files
echo 2. Test all pages at different screen sizes
echo 3. Commit changes to git
echo.
pause
