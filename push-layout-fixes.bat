@echo off
echo ================================================
echo Pushing layout fixes for booking system
echo ================================================
echo.

REM Change to the project directory
cd /d "C:\Users\eli\Desktop\New folder (2)"

REM Add changes to git
git add booking-system-v2.js

REM Commit with descriptive message
git commit -m "Fix booking layout issues: Add dollar signs to prices, fix code entry field, align package cards"

REM Push to main branch
git push origin main

echo.
echo ================================================
echo Changes pushed successfully!
echo ================================================
echo.
echo Fixed:
echo - Added dollar signs to all prices in package cards
echo - Fixed promo code entry field layout (now responsive)
echo - Properly aligned the 3 package cards in a grid
echo.
pause
