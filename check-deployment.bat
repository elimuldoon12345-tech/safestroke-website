@echo off
echo =====================================
echo   Netlify Deployment Troubleshooter
echo =====================================
echo.

echo Step 1: Checking Git Status...
echo -------------------------------------
git status
echo.

echo Step 2: Checking Remote Repository...
echo -------------------------------------
git remote -v
echo.

echo Step 3: Checking Current Branch...
echo -------------------------------------
git branch --show-current
echo.

echo Step 4: Fetching from Remote...
echo -------------------------------------
git fetch origin
echo.

echo Step 5: Checking if Local is Behind Remote...
echo -------------------------------------
git status -uno
echo.

echo Step 6: Showing Last Commit...
echo -------------------------------------
git log -1 --oneline
echo.

echo Step 7: Attempting to Push...
echo -------------------------------------
git push origin master
echo.

echo =====================================
echo   Troubleshooting Complete!
echo =====================================
echo.
echo NEXT STEPS:
echo 1. Check Netlify Dashboard at https://app.netlify.com
echo 2. Make sure your site is linked to the correct GitHub repo
echo 3. Check Site Settings - Build ^& Deploy - Continuous Deployment
echo 4. Look for any error messages above
echo.
echo If push was successful, deployment should start within 1-2 minutes.
echo.
pause