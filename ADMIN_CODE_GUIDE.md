# SafeStroke Admin Code Feature Documentation

## Overview
The admin code feature allows authorized staff to create free packages for manual scheduling without processing payment. This is useful for:
- Compensatory lessons
- Trial lessons
- Make-up sessions
- Special promotions
- Manual scheduling for phone/in-person bookings

## Admin Codes
The following admin codes are currently configured:
- `ADMIN2025` - Master admin code
- `SWIMFREE` - Free swim lessons admin code  
- `TESTBOOK` - Test booking admin code

## Two Ways to Use Admin Codes

### Method 1: Dedicated Admin Page
1. Navigate to `admin-package-creator.html`
2. Enter the admin code
3. Select program and number of lessons
4. Optionally add customer information
5. Click "Create Free Package"
6. Copy the generated package code
7. Share package code with customer or use it in booking system

### Method 2: Direct Entry in Booking Page
1. Go to the regular booking page
2. Click "Already have a package code?"
3. Enter the admin code (e.g., `ADMIN2025`)
4. System will recognize it as an admin code
5. Select program and lessons in the popup
6. System creates a free package and proceeds to calendar

## Implementation Details

### Files Modified/Created:
1. **`netlify/functions/create-admin-package.js`** - New serverless function for creating admin packages
2. **`admin-package-creator.html`** - Dedicated admin interface
3. **`admin-code-integration.js`** - Integration code for booking system

### Database Changes:
Admin packages are stored in the Supabase `packages` table with:
- `amount_paid: 0` (free package)
- `status: 'paid'` (immediately active)
- `payment_intent_id` starting with `admin_` prefix
- Notes field containing admin code used

### Package Code Format:
Admin packages use special format: `ADM-[PROGRAM]-[LESSONS]L-[TIMESTAMP]-[RANDOM]`
Example: `ADM-DRO-6L-123456-ABC`

## Security Considerations
1. Admin codes are validated server-side
2. All admin package creations are logged
3. Package codes include "ADM" prefix for audit trail
4. Consider changing admin codes periodically
5. Optional: Set `ADMIN_MASTER_CODE` environment variable in Netlify for additional security

## Deployment Steps

### 1. Deploy the Netlify Function
The `create-admin-package.js` function will be automatically deployed with your next Netlify deployment.

### 2. Optional: Set Environment Variable
In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add variable: `ADMIN_MASTER_CODE` 
3. Set a secret value (this becomes an additional admin code)

### 3. Update Booking System
To integrate admin codes into your existing booking page:
1. Add the admin code configuration to `booking-system-v2.js`
2. Replace `handleScheduleWithCode` with `handleScheduleWithCodeEnhanced`
3. Add the supporting functions from the integration code

## Testing
1. Test with code `TESTBOOK` first
2. Verify package creation in Supabase dashboard
3. Confirm booking flow works with generated package code
4. Check email notifications if configured

## Troubleshooting
- **"Invalid admin code"**: Check code spelling and case
- **"Database not configured"**: Verify Supabase environment variables
- **Package not working**: Ensure package status is 'paid' in database
- **Email not sending**: Check email service configuration

## Support
For issues or to request new admin codes, contact your system administrator.

## Change Log
- **Version 1.0** (2025): Initial implementation with 3 default admin codes
- Supports all programs (Droplet, Splashlet, Strokelet)
- Flexible lesson counts (1-100)
- Optional customer email integration