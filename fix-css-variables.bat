@echo off
echo Applying Brand Consistency Updates...
echo ===========================================

REM Update all HTML files to use correct CSS variables

powershell -Command "(gc index.html) -replace '--brand-blue: #2284B8;', '--ss-blue: #2284B8; /* Updated */' -replace 'var\(--brand-blue\)', 'var(--ss-blue)' -replace 'color: #2284B8', 'color: var(--ss-blue)' -replace 'background-color: #2284B8', 'background-color: var(--ss-blue)' -replace 'border-color: #2284B8', 'border-color: var(--ss-blue)' | Out-File -encoding ASCII index.html"

powershell -Command "(gc index.html) -replace '--brand-navy: #0B3856;', '--ss-navy: #0B3856; /* Updated */' -replace 'var\(--brand-navy\)', 'var(--ss-navy)' -replace 'color: #0B3856', 'color: var(--ss-navy)' -replace '#00253D', 'var(--ss-navy)' | Out-File -encoding ASCII index.html"

powershell -Command "(gc index.html) -replace '--brand-sky: #E9F5FC;', '--ss-sky: #E9F5FC; /* Updated */' -replace 'var\(--brand-sky\)', 'var(--ss-sky)' -replace 'color: #E9F5FC', 'color: var(--ss-sky)' | Out-File -encoding ASCII index.html"

powershell -Command "(gc index.html) -replace '--accent-green: #10B981;', '--ss-accent-green: #10B981; /* Updated */' -replace 'var\(--accent-green\)', 'var(--ss-accent-green)' -replace '#23C552', 'var(--ss-accent-green)' | Out-File -encoding ASCII index.html"

echo Updated index.html

REM Update other HTML files
for %%f in (safestroke-aboutus.html safestroke-booking.html safestroke-location.html safestroke-pricing.html safestroke-programs.html safestroke-reviews.html) do (
    if exist %%f (
        echo Updating %%f...
        powershell -Command "(gc %%f) -replace 'var\(--brand-blue\)', 'var(--ss-blue)' -replace 'var\(--brand-navy\)', 'var(--ss-navy)' -replace 'var\(--brand-sky\)', 'var(--ss-sky)' -replace 'var\(--accent-green\)', 'var(--ss-accent-green)' | Out-File -encoding ASCII %%f"
    )
)

echo.
echo ===========================================
echo Brand consistency updates applied!
echo.
echo Changes made:
echo - CSS variables updated to match brand-system.css
echo - Colors now use --ss-blue, --ss-navy, --ss-sky, --ss-accent-green
echo.
echo Please refresh your browser to see changes
echo.
pause