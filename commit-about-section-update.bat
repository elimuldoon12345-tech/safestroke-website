@echo off
echo Committing About section updates...
cd /d C:\Users\mattj\Desktop\safestroke-website
git add index.html
git commit -m "Update About section with new content and styling

- Replaced dark background with light background
- Updated heading and subline with new copy
- Maintained 4 value cards with updated content
- Added safety note callout with proper styling
- Updated CTAs with correct styling and links
- Improved mobile responsiveness
- Applied brand colors and fonts
- Added proper accessibility attributes
- Fixed contrast for WCAG AA compliance"
echo Commit complete!
pause
