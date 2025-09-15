# Netlify Deployment Troubleshooting

## Quick Fix Steps:

### 1. Push the updated configuration to GitHub:
```bash
git add netlify.toml package.json _redirects test.html .nvmrc .gitignore
git commit -m "Fix Netlify deployment configuration"
git push origin main
```

### 2. Check Netlify Dashboard:
1. Go to https://app.netlify.com
2. Select your site
3. Go to "Deploys" tab
4. Check for any error messages in the deploy log

### 3. Verify Site Settings in Netlify:
1. Go to Site Settings → Build & Deploy
2. Check these settings:
   - **Base directory:** (leave empty)
   - **Build command:** (leave empty)
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`

### 4. Check Deploy Status:
Look for these common issues in the deploy log:
- ❌ "No index.html found" - File structure issue
- ❌ "Build failed" - Build command issue
- ❌ "Function bundling failed" - Functions syntax error
- ✅ "Deploy is live" - Should work!

### 5. Test Direct Access:
Try accessing these URLs directly:
- `https://[your-site-name].netlify.app/test.html`
- `https://[your-site-name].netlify.app/index.html`

### 6. Clear Cache and Redeploy:
1. In Netlify Dashboard, go to Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"

### 7. Check Production Branch:
1. Go to Site Settings → Build & Deploy → Branches
2. Make sure "Production branch" is set to `main` (or `master` if that's what you use)

### 8. If Still Not Working:
1. Check the site URL - it should be something like:
   - `https://[site-name].netlify.app`
   - NOT `https://[some-hash].netlify.app` (this is a preview URL)

2. Make sure you're looking at the right site in Netlify dashboard
   - You might have multiple sites

3. Try creating a new site from the same repo:
   - Click "New site from Git"
   - Connect to your GitHub repo
   - Use these settings:
     - Build command: (leave empty)
     - Publish directory: `.`

## Common Issues and Solutions:

### Issue: "Page Not Found" or "Site Not Found"
**Solution:** The site might not be deployed yet. Check the Deploys tab for status.

### Issue: Site works locally but not on Netlify
**Solution:** Check file names are case-sensitive on Netlify (Linux) but not on Windows.

### Issue: Functions not working
**Solution:** Check the functions are in `netlify/functions/` folder.

## Your Site Details:
- Main file: `index.html` ✓
- Booking page: `safestroke-booking.html` ✓
- Functions folder: `netlify/functions/` ✓
- Static assets: `safestroke-images/` ✓

## Test URLs After Deploy:
Once deployed, test these:
1. Homepage: `https://[your-site].netlify.app/`
2. Test page: `https://[your-site].netlify.app/test.html`
3. Booking: `https://[your-site].netlify.app/safestroke-booking.html`
