@echo off
echo ==================================
echo Pushing booking page fixes to GitHub
echo ==================================
echo.

echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "Fix booking page - single lesson and package flows now display properly"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ==================================
echo Push complete!
echo ==================================
pause