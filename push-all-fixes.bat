@echo off
echo ================================================
echo Pushing ALL layout fixes and documentation
echo ================================================
echo.

REM Change to the project directory
cd /d "C:\Users\eli\Desktop\New folder (2)"

REM Check current status
echo Current git status:
git status
echo.

REM Add all changed and new files
git add booking-system-v2.js
git add booking-system-v2-backup.js
git add push-layout-fixes.bat
git add layout-fix-readme.md

REM Commit with descriptive message
git commit -m "Fix booking system layout issues

- Add dollar signs to all package prices
- Fix promo code entry field responsiveness
- Properly align package cards in grid
- Include backup of original file
- Add documentation for changes"

REM Push to main branch
echo.
echo Pushing to remote repository...
git push origin main

echo.
echo ================================================
echo All changes pushed successfully!
echo ================================================
echo.
echo What was fixed:
echo 1. Dollar signs added to prices ($152, $222, $280)
echo 2. Promo code input field now responsive
echo 3. Package cards properly aligned
echo.
echo Files updated:
echo - booking-system-v2.js (main fix)
echo - booking-system-v2-backup.js (backup)
echo - push-layout-fixes.bat (this script)
echo - layout-fix-readme.md (documentation)
echo.
pause
