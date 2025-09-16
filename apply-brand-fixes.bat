@echo off
echo Applying Brand Consistency Fixes to All Pages...
echo ===========================================

REM Fix colors and headers in all HTML files
powershell -Command "Get-ChildItem *.html | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '#2563EB', '#2284B8'; $content = $content -replace 'text-\[#23C552\]', 'text-[#2284B8]'; $content = $content -replace 'bg-\[#23C552\]', 'bg-[#2284B8]'; if ($content -notmatch 'brand-consistency-fix.js') { $content = $content -replace '(</body>)', '<script src=""brand-consistency-fix.js""></script>`n$1' }; Set-Content -Path $_.FullName -Value $content -Encoding UTF8 }"

echo.
echo Fixing specific issues in index.html...

REM Fix checkmarks in programs section with bullet points
powershell -Command "$content = Get-Content 'index.html' -Raw; $content = $content -replace '<svg class=""w-4 h-4 text-\[#2284B8\][^>]*>[^<]*</svg>', '<span style=""display: inline-block; width: 6px; height: 6px; background-color: #2284B8; border-radius: 50%; margin-right: 8px; flex-shrink: 0; margin-top: 6px;""></span>'; $content = $content -replace '<svg class=""w-4 h-4 text-\[#23C552\][^>]*>[^<]*</svg>', '<span style=""display: inline-block; width: 6px; height: 6px; background-color: #2284B8; border-radius: 50%; margin-right: 8px; flex-shrink: 0; margin-top: 6px;""></span>'; Set-Content -Path 'index.html' -Value $content -Encoding UTF8"

echo.
echo Standardizing headers across all pages...

REM Apply consistent header styles
for %%f in (safestroke-aboutus.html safestroke-booking.html safestroke-location.html safestroke-pricing.html safestroke-programs.html safestroke-reviews.html) do (
    if exist %%f (
        echo Updating %%f header...
        powershell -Command "$content = Get-Content '%%f' -Raw; if ($content -notmatch 'nav-link::after') { $headerStyles = '<style>.nav-link { transition: color 0.3s; position: relative; } .nav-link.active { font-weight: 700; color: #2284B8; } .nav-link:not(.active):hover { color: #2284B8; } .nav-link::after { content: \"\"; position: absolute; width: 0; height: 2px; bottom: -4px; left: 50%%; transform: translateX(-50%%); background: linear-gradient(90deg, #2284B8, #1976a3); transition: width 0.3s ease-in-out; border-radius: 1px; } .nav-link:hover::after, .nav-link.active::after { width: 100%%; }</style>'; $content = $content -replace '(</head>)', ""$headerStyles`n`$1"" }; Set-Content -Path '%%f' -Value $content -Encoding UTF8"
    )
)

echo.
echo ===========================================
echo Brand consistency fixes applied!
echo.
echo Changes made:
echo - Replaced all #2563EB with #2284B8 
echo - Standardized headers across all pages
echo - Fixed checkmarks to use brand color bullets
echo - Fixed icon colors in about section
echo - Fixed CTA section structure
echo.
echo Please refresh your browser to see changes
echo.
pause