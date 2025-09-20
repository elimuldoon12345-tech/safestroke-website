# SafeStroke Booking System - Deployment Guide

## Overview
This is your complete custom checkout and booking system for SafeStroke Swim Academy. The system includes:
- Stripe payment integration
- Calendar-based lesson booking
- Supabase database backend
- Automated time slot management
- Package code system

## Quick Start Deployment Steps

### 1. Database Setup (Supabase)
1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to the SQL Editor
3. Run these SQL scripts in order:
   - First: Copy and run everything from `database-schema-complete.sql`
   - Second: Copy and run everything from `generate-time-slots.sql`
   - This will create all tables and generate time slots for Oct 5, 2025 - Jan 5, 2026

### 2. Environment Variables (Netlify)
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add these variables (you already have most of them):
   ```
   STRIPE_SECRET_KEY=sk_test_... (already set)
   STRIPE_PUBLISHABLE_KEY=pk_test_... (already set)
   SUPABASE_URL=https://... (already set)
   SUPABASE_ANON_KEY=eyJ... (already set)
   SUPABASE_SERVICE_KEY=eyJ... (already set)
   STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe after setting up webhook)
   ENABLE_BOOKING_SIMULATOR=false (enable locally when testing the simulator)
   SIMULATOR_ADMIN_EMAILS=admin@example.com (comma-separated list of allowed admins)
   SIMULATOR_SUPPRESS_NOTIFICATIONS=true (keeps simulator bookings from emailing by default)
   SIMULATOR_ALLOW_IN_PROD=false (keeps production locked unless explicitly overridden)
   SIMULATOR_SHARED_SECRET=safestroke-admin-2025 (override to your own secure value)
   ```

### 3. Stripe Webhook Setup
1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. Enter your endpoint URL: `https://your-site-name.netlify.app/.netlify/functions/stripe-webhook`
5. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Netlify

### 4. Deploy to Netlify
1. Commit and push all files to GitHub:
   ```bash
   git add .
   git commit -m "Add complete booking system"
   git push
   ```
2. Netlify will automatically deploy the changes

### 5. Initialize Time Slots
Option A: Via Admin Dashboard
1. Navigate to: `https://your-site.netlify.app/admin-dashboard.html`
2. Use "Initialize Time Slots" to generate slots for your date range

Option B: Via SQL (already done if you ran generate-time-slots.sql)

### 6. Test the System
1. Go to your booking page: `https://your-site.netlify.app/safestroke-booking.html`
2. Test the purchase flow:
   - Select a program
   - Choose a package
   - Use Stripe test card: 4242 4242 4242 4242
   - Complete payment
   - You'll receive a package code
   - Use the code to book lessons

### 7. Enable the Admin Booking Simulator (optional)
1. Flip the environment variables listed above so that `ENABLE_BOOKING_SIMULATOR=true` for the environment you want to test.
2. Provide a comma-separated list of approved admin emails in `SIMULATOR_ADMIN_EMAILS` and share the `SIMULATOR_SHARED_SECRET` out of band.
3. Issue a POST request to `/.netlify/functions/simulate-booking` with the same payload structure as the live `book-time-slot` endpoint plus simulator fields (e.g., `outcome`, `lessonsTotal`).
4. For local testing you can use `function-tester.html` or `function-tester` scripts to call the new endpoint.
5. When finished, set `ENABLE_BOOKING_SIMULATOR` back to `false` for production safety.

## File Structure

### Core Files
- `safestroke-booking.html` - Main booking page
- `booking-system-v2.js` - Complete booking logic with calendar
- `admin-dashboard.html` - Admin management interface

### Database Files
- `database-schema-complete.sql` - Complete database schema
- `generate-time-slots.sql` - Time slot generation script

### Netlify Functions (Backend)
- `create-payment.js` - Creates Stripe payment intents
- `validate-package.js` - Validates package codes
- `get-time-slots.js` - Retrieves available time slots
- `book-time-slot.js` - Books a specific time slot
- `simulate-booking.js` - Creates admin-only simulated bookings for QA
- `stripe-webhook.js` - Handles Stripe payment confirmations
- `initialize-time-slots.js` - Generates time slots programmatically

## Schedule Configuration

Your schedule is configured as follows:

### Sundays (3:00 PM - 5:00 PM)
- **3:00-3:30 PM**: 
  - Droplet: 1 group (8 slots)
  - Splashlet: 1 group (4 slots)
  - Strokelet: 1 group (3 slots)
- **3:30-5:00 PM** (30-minute sessions):
  - Splashlet: 2 groups (4 slots each)
  - Strokelet: 2 groups (3 slots each)

### Mondays (5:00 PM - 7:00 PM)
- **All time slots** (30-minute sessions):
  - Splashlet: 2 groups (4 slots each)
  - Strokelet: 2 groups (3 slots each)

## Testing Checklist

- [ ] Database tables created in Supabase
- [ ] Time slots generated for your date range
- [ ] Environment variables set in Netlify
- [ ] Stripe webhook configured
- [ ] Site deployed to Netlify
- [ ] Test payment with Stripe test card
- [ ] Test booking with generated package code
- [ ] Verify booking appears in Supabase

## Troubleshooting

### Issue: Payment fails
- Check Stripe keys in environment variables
- Verify Stripe is in test mode
- Check browser console for errors

### Issue: "Invalid package code"
- Wait 5-10 seconds after payment (webhook delay)
- Check if package status is "paid" in Supabase
- Verify webhook is configured correctly

### Issue: No time slots showing
- Run the time slot generation SQL
- Check that dates are in the future
- Verify program name matches exactly

### Issue: Booking fails
- Check Supabase connection
- Verify time slot isn't full
- Check browser console for API errors

## Support

For any issues:
1. Check the browser console for errors
2. Check Netlify function logs
3. Verify database records in Supabase
4. Test with the admin dashboard tools

## Next Steps

1. **Email Notifications**: Add SendGrid or similar for email confirmations
2. **Admin Features**: Expand admin dashboard with more management tools
3. **Reporting**: Add booking reports and analytics
4. **Cancellations**: Add ability to cancel/reschedule bookings
5. **Waitlists**: Add waitlist functionality for full classes

## Important Notes

- The system is currently in TEST mode with Stripe test keys
- To go live, replace with production Stripe keys
- Always backup your database before major changes
- Test thoroughly before switching to production

---

Deployment completed! Your custom booking system is ready to use.