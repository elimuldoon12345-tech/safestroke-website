@echo off
echo.
echo ========================================
echo   SAFESTROKE BRAND UPDATE TOOL
echo ========================================
echo.
echo This will apply the following updates:
echo   1. Replace all #2563EB with #2284B8
echo   2. Standardize headers across all pages
echo   3. Update programs section checkmarks to brand blue
echo   4. Fix about section icon colors
echo   5. Fix CTA section structure
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Running brand updates...
echo.

node apply-full-brand-updates.js

echo.
echo ========================================
echo   Updates complete!
echo ========================================
echo.
echo Please review the changes in your browser.
echo.
pause