@echo off
echo =====================================
echo   Checking What Files Need Committing
echo =====================================
echo.

echo Current Git Status:
echo -------------------
git status

echo.
echo =====================================
echo   Adding ALL Admin Code Files Now
echo =====================================
echo.

echo Adding all modified and new files...
git add booking-system-v2.js
git add netlify/functions/create-admin-package.js
git add admin-package-creator.html
git add admin-quick-reference.html
git add admin-package-db-update.sql
git add ADMIN_CODE_GUIDE.md
git add admin-code-quick-integration.js
git add -A

echo.
echo Files staged for commit:
git status --short

echo.
echo Committing the ACTUAL admin code changes...
git commit -m "Add actual admin code implementation - modified booking system and new functions"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo =====================================
echo   DONE! Check Netlify Now
echo =====================================
echo.
echo The ACTUAL code changes are now pushed!
echo Check https://app.netlify.com for deployment
echo.
pause