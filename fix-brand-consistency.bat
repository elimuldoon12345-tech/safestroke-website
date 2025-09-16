@echo off
cls
echo =========================================
echo APPLYING BRAND CONSISTENCY FIXES
echo =========================================
echo.

echo Creating backup directory...
if not exist brand-backup mkdir brand-backup
copy *.html brand-backup\ >nul 2>&1

echo.
echo Applying brand consistency updates to all HTML files...
echo.

REM Update each HTML file with PowerShell
powershell -Command "Get-ChildItem '*.html' | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '>Book Now</a>', '>Book Free Lesson</a>'; $content = $content -replace 'Book Now</button>', 'Book Free Lesson</button>'; $content = $content -replace 'Bubble Buddies', 'Strokelet — Level 1'; $content = $content -replace 'Stroke Starters', 'Strokelet — Level 2'; $content = $content -replace 'FIRST-FREE', 'First Lesson Free'; $content = $content -replace 'First Free', 'First Lesson Free'; $content = $content -replace 'FREE First Lesson', 'First Lesson Free'; $content = $content -replace 'text-blue-600', 'text-ss-blue'; $content = $content -replace 'text-blue-500', 'text-ss-blue'; $content = $content -replace 'bg-blue-600', 'bg-ss-blue'; $content = $content -replace 'bg-emerald-500', 'bg-ss-promo'; $content = $content -replace 'bg-emerald-600', 'bg-ss-promo'; $content = $content -replace 'text-emerald-600', 'text-ss-promo'; $content = $content -replace 'bg-gray-50(?!0)', 'bg-ss-gray-light'; $content = $content -replace '#00253D', 'var(--ss-navy)'; $content = $content -replace '#23C552', 'var(--ss-accent-green)'; Set-Content $_.FullName $content; Write-Host 'Updated:' $_.Name }"

echo.
echo =========================================
echo BRAND CONSISTENCY APPLIED!
echo =========================================
echo.
echo Changes made:
echo - CTAs updated to "Book Free Lesson"
echo - Program names: Strokelet Level 1/2
echo - Color tokens applied
echo - Free offer text standardized
echo.
echo Backup files saved in: brand-backup\
echo.
echo Next: Commit and push changes
echo.
pause
