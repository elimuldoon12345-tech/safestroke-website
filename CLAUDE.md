# SafeStroke Website - Claude Code Configuration

## Project Overview
SafeStroke is a swimming lesson booking website that integrates with Supabase (database), Stripe (payments), and Netlify (hosting/serverless functions). The site is deployed via GitHub → Netlify automatic deployments.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Backend**: Netlify Functions (Node.js serverless)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Hosting**: Netlify
- **Deployment**: GitHub → Netlify automatic deployment

## Project Structure
```
safestroke-website/
├── index.html                     # Main landing page
├── safestroke-booking.html         # Booking page with payment integration
├── safestroke-aboutus.html         # About us page
├── safestroke-location.html        # Location page
├── safestroke-pricing.html         # Pricing page
├── safestroke-programs.html        # Programs page
├── safestroke-reviews.html         # Reviews page
├── booking-logic.js               # Main booking flow client-side logic
├── payment-handler.js             # Stripe payment handling
├── database-schema.sql            # Supabase database schema
├── database-schema-updated.sql    # Updated database schema
├── safestroke-images/             # Static assets
├── netlify/
│   └── functions/                 # Serverless functions
│       ├── book-class.js          # Class booking API
│       ├── create-payment.js      # Stripe payment intent creation
│       └── validate-package.js    # Package validation
├── .env                          # Environment variables (local)
├── .env.example                  # Environment variables template
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies
└── setup.sh/.bat/.ps1           # Setup scripts
```

## Key Integrations

### Supabase Database
- URL: Process.env.SUPABASE_URL
- Service Key: Process.env.SUPABASE_SERVICE_KEY
- Anon Key: Process.env.SUPABASE_ANON_KEY
- Main tables: classes, bookings, packages, students

### Stripe Payments
- Secret Key: Process.env.STRIPE_SECRET_KEY
- Publishable Key: Process.env.STRIPE_PUBLISHABLE_KEY
- Handles payment intents for class packages

### Netlify Functions
- Location: `netlify/functions/`
- Node version: 18
- Bundler: esbuild
- CORS enabled for all functions

## Environment Variables
Required environment variables (see .env.example):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
ACUITY_USER_ID=...
ACUITY_API_KEY=...
```

## Package Information
Swimming lesson packages with different tiers:
- **Droplet**: Entry level (4/6/8 classes: $112/$162/$200)
- **Splashlet**: Intermediate (4/6/8 classes: $152/$222/$280)
- **Strokelet**: Advanced (4/6/8 classes: $172/$252/$320)

## Build & Deploy
- **Build Command**: None (static site)
- **Publish Directory**: `.` (root)
- **Functions Directory**: `netlify/functions/`
- **Deploy**: Automatic via GitHub integration

## Development Commands
```bash
# Install dependencies
npm install

# Local development
npm run dev  # (if available)

# Run setup
./setup.sh    # Unix/Mac
./setup.bat   # Windows
./setup.ps1   # PowerShell
```

## Key Files to Understand
1. `booking-logic.js` - Main booking flow, package selection, Acuity integration
2. `netlify/functions/book-class.js` - Class booking API endpoint
3. `netlify/functions/create-payment.js` - Stripe payment intent creation
4. `database-schema.sql` - Database structure
5. `safestroke-booking.html` - Main booking interface

## Important Constants
- Acuity Owner ID: '36567436'
- Appointment Type IDs: Droplet (81908979), Splashlet (81908997), Strokelet (81909020)
- Package IDs mapped to class counts and types

## Testing
- Functions can be tested via `/.netlify/functions/[function-name]`
- CORS enabled for local development
- Stripe in test mode by default

## Common Tasks
- Adding new packages: Update PACKAGE_PRICING and ACUITY_PACKAGE_IDS in booking-logic.js
- Modifying payment flow: Check payment-handler.js and create-payment.js
- Database changes: Update database-schema.sql and deploy via Supabase
- Adding pages: Create new HTML file, ensure mobile menu integration