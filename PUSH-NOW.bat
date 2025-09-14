@echo off
echo =====================================
echo   Adding Admin Code Feature to Git
echo =====================================
echo.

echo Adding ALL new and modified files...
git add -A

echo.
echo Files that will be committed:
git status --short

echo.
echo Creating commit...
git commit -m "Add admin code feature for free package creation - ADMIN2025, SWIMFREE, TESTBOOK codes"

echo.
echo Pushing to GitHub (this will trigger Netlify)...
git push origin master

echo.
echo =====================================
echo   SUCCESS! Files pushed to GitHub
echo =====================================
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com
echo 2. You should see deployment starting in 1-2 minutes
echo 3. Look for "Building" status
echo 4. Wait 3-5 minutes for deployment to complete
echo.
echo Admin codes you can use:
echo - ADMIN2025 (master admin code)
echo - SWIMFREE (free lessons)  
echo - TESTBOOK (testing)
echo.
pause