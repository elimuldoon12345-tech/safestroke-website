# Admin Testing System for SafeStroke Booking

## Overview
This admin testing system allows you to test the complete booking flow without processing real payments. It's designed for development and testing purposes only.

## How to Use

### Method 1: Promo Code + Admin Email
1. Start any booking flow (single lesson or package)
2. When you see "Have a promo code?", enter: **ADMIN-TEST-2025**
3. Use one of these admin emails when prompted:
   - mattjpiacentini@gmail.com (your email)
   - admin@safestrokeswim.com
   - test@safestrokeswim.com
   - Any email ending with @test.local

### Method 2: Keyboard Shortcut (Quick Activation)
1. On the booking page, press **Ctrl+Shift+A**
2. Enter the master code: **ADMIN-TEST-2025**
3. Enter an admin email
4. Admin mode will be activated immediately

### Method 3: Direct URL Parameter (Development Only)
Add this to your booking URL:
```
safestroke-booking.html?admin=true&code=ADMIN-TEST-2025
```

## What Happens in Admin Mode

### Visual Indicators
- 🔐 Orange "ADMIN TEST MODE" badge appears in top-right corner
- All prices show as "FREE" with original prices crossed out
- Yellow/orange notices appear indicating test mode is active

### Payment Bypass
- Stripe payment forms are bypassed completely
- Payments are simulated as successful
- Package codes are generated with "ADMIN-" prefix
- All bookings work but are marked as test bookings

### What You Can Test
1. **Complete Package Flow:**
   - Select program (Droplet/Splashlet/Strokelet)
   - Choose package size (4, 6, or 8 lessons)
   - Enter email (admin email)
   - "Payment" is instant and free
   - Get package code immediately
   - Schedule lessons on calendar

2. **Single Lesson Flow:**
   - Choose single lesson option
   - Select program
   - Book time slot
   - Complete booking without payment

3. **Returning Customer Flow:**
   - Use generated admin package codes
   - Test scheduling multiple lessons
   - Test remaining lesson tracking

## Security Features

### Email Validation
The system only works with pre-approved admin emails to prevent abuse:
```javascript
adminEmails: [
    'mattjpiacentini@gmail.com',
    'admin@safestrokeswim.com',
    'test@safestrokeswim.com'
]
```

### Test Email Pattern
Any email ending with `@test.local` will work with the admin code.
Example: `john@test.local`, `mary@test.local`

### Session Persistence
Admin mode stays active during your browser session. To deactivate:
1. Clear browser session storage
2. Refresh the page
3. Or close and reopen browser

## Customization

Edit `admin-booking-bypass.js` to customize:

### Change Master Code
```javascript
masterCode: 'YOUR-SECRET-CODE-HERE'
```

### Add More Admin Emails
```javascript
adminEmails: [
    'existing@email.com',
    'newadmin@email.com'  // Add new admin email
]
```

### Toggle Visual Badge
```javascript
showAdminBadge: false  // Set to false to hide the badge
```

## Testing Checklist

Use admin mode to test:
- [ ] Package selection and pricing display
- [ ] Email collection and validation
- [ ] Payment form appearance (should show as bypassed)
- [ ] Package code generation
- [ ] Calendar loading after payment
- [ ] Available time slots display
- [ ] Booking form submission
- [ ] Confirmation messages
- [ ] Email notifications (check if test emails are sent)
- [ ] Returning customer flow with package codes
- [ ] Multiple lesson scheduling
- [ ] Remaining lesson count

## Important Notes

⚠️ **NEVER deploy this to production with the default admin code!**

For production deployment, you should:
1. Change the master code to something secure
2. Remove test emails and use only real admin emails
3. Consider adding IP restrictions
4. Add server-side validation
5. Log all admin test bookings

## Conditional Loading

For production, you can conditionally load the admin system:

```javascript
// Only load admin system in development
if (window.location.hostname === 'localhost' || 
    window.location.hostname.includes('test') ||
    window.location.search.includes('admin=true')) {
    
    const script = document.createElement('script');
    script.src = 'admin-booking-bypass.js';
    document.body.appendChild(script);
}
```

## Troubleshooting

### Admin Mode Not Activating
1. Check browser console for errors
2. Verify email is in admin list
3. Ensure code is typed correctly (case-sensitive)
4. Clear cache and try again

### Payment Still Being Requested
1. Admin mode may not be fully active
2. Check for the admin badge indicator
3. Refresh page and try again
4. Check console for "Admin bypass" messages

### Package Code Not Working
1. Admin package codes start with "ADMIN-"
2. These only work in test environments
3. Real booking system may reject admin codes

## Database Considerations

Admin test bookings should be:
1. Marked with a test flag in database
2. Excluded from reports and analytics
3. Periodically cleaned up
4. Not sent to payment processors

## Remove for Production

Before going live, remove or disable:
1. The `admin-booking-bypass.js` script inclusion
2. Or implement environment-based loading
3. Change all default codes and emails
4. Add proper authentication

---

## Quick Test Scenarios

### Scenario 1: New Customer Package Purchase
1. Press Ctrl+Shift+A → Enter code → Enter admin email
2. Click "Lesson Packages"
3. Select "Splashlet" program
4. Choose "6 Lessons" package
5. Verify shows as FREE
6. Click through payment (instant)
7. Get package code
8. Schedule first lesson

### Scenario 2: Free Single Lesson
1. Apply admin mode
2. Click "Single Lesson"
3. Use FIRST-FREE code (or admin code)
4. Select program
5. Book time slot
6. Complete without payment

### Scenario 3: Returning Customer
1. Use a previously generated ADMIN- package code
2. Click "Schedule" 
3. Select available time slot
4. Complete booking
5. Verify lessons remaining updates

---

Remember: This is for testing only. Never use real customer data in test mode.
