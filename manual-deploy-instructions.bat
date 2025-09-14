@echo off
echo =====================================
echo   Manual Netlify Deploy Instructions
echo =====================================
echo.
echo Since auto-deploy isn't working, here's how to manually deploy:
echo.
echo OPTION 1: Netlify CLI (if installed)
echo -------------------------------------
echo Run: netlify deploy --prod
echo.
echo OPTION 2: Drag and Drop
echo -------------------------------------
echo 1. Open https://app.netlify.com/drop
echo 2. Open this folder in File Explorer
echo 3. Select ALL files (Ctrl+A)
echo 4. Drag them to the Netlify browser window
echo 5. Wait for upload
echo.
echo OPTION 3: GitHub Deploy Button
echo -------------------------------------
echo 1. Go to Netlify Deploys tab
echo 2. Find "Trigger deploy" button
echo 3. Click "Clear cache and deploy site"
echo.
echo Your site should be live in 2-3 minutes after deploy!
echo.
pause