@echo off
echo ========================================
echo Pushing SafeStroke Booking Fix
echo ========================================
echo.

:: Add all changes
git add .

:: Commit with a descriptive message
git commit -m "Fix site deployment issues: reorder JS scripts to resolve conflicts, update netlify config"

:: Push to main branch
git push origin main

echo.
echo ========================================
echo Push complete! 
echo Your changes should trigger a new Netlify deploy.
echo Check your Netlify dashboard in 1-2 minutes.
echo ========================================
pause
