// Ultra-safe version that ALWAYS returns JSON
exports.handler = async (event) => {
  try {
    // Always return JSON headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ method: 'OPTIONS' })
      };
    }

    // For any GET request, return status
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'Function is running',
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          timestamp: new Date().toISOString()
        })
      };
    }

    // For POST, try to create payment or return test data
    if (event.httpMethod === 'POST') {
      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        // Return test data if no Stripe key
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            testMode: true,
            clientSecret: 'test_cs_' + Date.now(),
            packageCode: 'TEST-' + Date.now()
          })
        };
      }

      // Try to use Stripe
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const body = JSON.parse(event.body || '{}');
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: body.amount || 10000,
          currency: 'usd',
          automatic_payment_methods: { enabled: true }
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            packageCode: 'PKG-' + Date.now()
          })
        };
      } catch (stripeError) {
        // If Stripe fails, return error as JSON
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            testMode: true,
            error: stripeError.message,
            clientSecret: 'test_cs_error_' + Date.now(),
            packageCode: 'TEST-ERROR-' + Date.now()
          })
        };
      }
    }

    // For any other method
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        error: 'Method not supported',
        method: event.httpMethod 
      })
    };

  } catch (anyError) {
    // Even if everything fails, return JSON
    return {
      statusCode: 200,
      body: JSON.stringify({
        criticalError: anyError.message,
        testMode: true,
        clientSecret: 'test_emergency_' + Date.now(),
        packageCode: 'EMERGENCY-' + Date.now()
      })
    };
  }
};