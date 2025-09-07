// Ultra-safe payment function that always returns JSON
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // For GET requests - show status
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'Payment function is accessible',
        stripe_configured: !!process.env.STRIPE_SECRET_KEY,
        timestamp: new Date().toISOString()
      })
    };
  }

  // For POST requests - handle payment
  if (event.httpMethod === 'POST') {
    try {
      // Check if Stripe key exists
      if (!process.env.STRIPE_SECRET_KEY) {
        console.log('No Stripe key found, returning test mode');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            testMode: true,
            clientSecret: 'test_cs_' + Date.now(),
            packageCode: 'TEST-' + Date.now(),
            message: 'Stripe not configured - test mode active'
          })
        };
      }

      // Parse request body
      let requestBody = {};
      try {
        requestBody = JSON.parse(event.body || '{}');
      } catch (e) {
        requestBody = { amount: 15200, program: 'Test', lessons: 4 };
      }

      const { amount = 15200, program = 'Splashlet', lessons = 4 } = requestBody;

      console.log('Creating payment for:', { amount, program, lessons });

      // Try to load and use Stripe
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          automatic_payment_methods: {
            enabled: true
          },
          metadata: {
            program: program,
            lessons: lessons.toString()
          }
        });

        const packageCode = `${program.substring(0, 3).toUpperCase()}-${lessons}L-${Date.now().toString().slice(-6)}`;

        console.log('Payment intent created:', paymentIntent.id);

        // Try to save to database if Supabase is configured
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
          try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(
              process.env.SUPABASE_URL,
              process.env.SUPABASE_SERVICE_KEY
            );

            await supabase
              .from('packages')
              .insert([{
                code: packageCode,
                program: program,
                lessons_total: lessons,
                lessons_remaining: lessons,
                amount_paid: amount / 100,
                payment_intent_id: paymentIntent.id,
                status: 'pending',
                created_at: new Date().toISOString()
              }]);
          } catch (dbError) {
            console.log('Database error (non-critical):', dbError.message);
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            packageCode: packageCode
          })
        };

      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            testMode: true,
            clientSecret: 'test_cs_error_' + Date.now(),
            packageCode: 'TEST-ERROR-' + Date.now(),
            error: stripeError.message
          })
        };
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          testMode: true,
          clientSecret: 'test_cs_critical_' + Date.now(),
          packageCode: 'TEST-CRITICAL-' + Date.now(),
          error: error.message
        })
      };
    }
  }

  // For any other method
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      error: 'Method not allowed',
      method: event.httpMethod
    })
  };
};