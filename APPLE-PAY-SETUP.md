# 🍎 Apple Pay Integration - After Domain Verification

## What's Updated

Now that you've enabled Apple Pay in your Stripe Dashboard, I've created enhanced scripts to ensure it appears correctly:

### 1. **Updated Payment Script (v3.0)**
- Enhanced Apple Pay detection
- Better device/browser checking
- Improved error handling
- Explicit Apple Pay button styling

### 2. **Test Pages**
- `test-apple-pay-live.html` - Verify Apple Pay is working
- `test-express-checkout-debug.html` - Debug why it might not appear
- `apple-pay-check.js` - Console script to check status

## Deploy the Updates

Run this command:
```bash
./deploy-apple-pay-update.bat
```

Or manually:
```bash
git add -A
git commit -m "feat: enhance Apple Pay support after domain verification"
git push origin main
```

## Testing Apple Pay

### Requirements Checklist
- ✅ Domain verified in Stripe Dashboard (you've done this)
- ⏳ Wait 5-10 minutes for verification to propagate
- 📱 Test on actual iPhone/iPad with Safari
- 💳 Have at least one card in Apple Wallet
- 🔒 Must be on HTTPS (not http:// or localhost)

### Test Steps
1. **First, verify Apple Pay is working:**
   - Open on iPhone: `https://yourdomain.com/test-apple-pay-live.html`
   - You should see an Apple Pay button if everything is configured

2. **Then test in booking flow:**
   - Go to your booking page on iPhone Safari
   - Select a package and proceed to payment
   - Apple Pay button should appear above the card form

3. **If Apple Pay doesn't appear:**
   - Clear Safari cache: Settings → Safari → Clear History and Website Data
   - Run console check: Copy `apple-pay-check.js` contents into Safari console
   - Make sure you're on HTTPS (not http://)
   - Ensure you have cards in Apple Wallet

## Quick Console Check

Run this in Safari console on your booking page:
```javascript
// Quick Apple Pay check
(async () => {
    const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: { label: 'Test', amount: 100 }
    });
    const can = await pr.canMakePayment();
    console.log('Apple Pay available:', can ? '✅ YES' : '❌ NO');
    if (!can) console.log('Add cards to Wallet or wait for domain verification');
})();
```

## Expected Behavior

### On iPhone/iPad Safari (with cards in Wallet):
- Apple Pay button appears above card form
- Clicking opens native Apple Pay sheet
- Uses Touch ID/Face ID for authentication

### On Chrome (with saved cards):
- Google Pay button appears above card form
- One-click checkout with saved cards

### On other browsers/devices:
- Only card payment form appears
- No express checkout buttons

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| No Apple Pay button on iPhone | 1. Clear Safari cache<br>2. Ensure HTTPS<br>3. Add card to Wallet<br>4. Wait 10 mins for domain verification |
| "Not verified" in Stripe | Re-verify domain, upload verification file to `/.well-known/` |
| Works in test but not live | Use live Stripe keys, ensure domain matches exactly |
| Console shows "not available" | Check all requirements with `apple-pay-check.js` |

## The Key Changes in v3.0

1. **Better Detection**
   ```javascript
   // Explicitly checks for Apple device + Safari
   const isAppleDevice = /iPhone|iPad|Mac/.test(ua);
   const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
   ```

2. **Apple Pay Specific Styling**
   ```javascript
   style: {
       paymentRequestButton: {
           type: canMakePayment.applePay ? 'apple-pay' : 'default',
           theme: 'dark',
           height: '48px'
       }
   }
   ```

3. **Enhanced Logging**
   - Shows exactly why Apple Pay might not appear
   - Logs device capabilities
   - Shows verification status

## Next Steps

1. **Deploy the updates** using `deploy-apple-pay-update.bat`
2. **Wait 5-10 minutes** for Netlify to deploy
3. **Test on iPhone Safari** with cards in Apple Wallet
4. **Monitor console** for any errors

Apple Pay should now appear! The domain verification you completed is the key requirement - once that propagates (usually within 10 minutes), Apple Pay will work on all eligible devices.

---

**Remember**: Apple Pay ONLY works on:
- Safari browser (not Chrome on iOS)
- Apple devices (iPhone, iPad, Mac)
- With cards saved in Wallet
- On HTTPS websites
- With verified domains in Stripe

Google Pay works on Chrome with saved payment methods.
