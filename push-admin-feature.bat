@echo off
echo ======================================
echo   SafeStroke Admin Code Feature Push
echo ======================================
echo.

echo Checking git status...
git status
echo.

echo Adding all changes...
git add -A
echo.

echo Creating commit...
git commit -m "Add admin code feature for free package creation - allows manual scheduling with codes ADMIN2025, SWIMFREE, TESTBOOK"
echo.

echo Pushing to GitHub...
git push origin master
echo.

echo ======================================
echo   Push Complete!
echo ======================================
echo.
echo Next steps:
echo 1. The changes will auto-deploy to Netlify
echo 2. Run the SQL update in Supabase (admin-package-db-update.sql)
echo 3. Test with code: TESTBOOK
echo.
pause