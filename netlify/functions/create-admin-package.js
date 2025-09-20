const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { code, program, lessons, amount, isTest } = JSON.parse(event.body);

    // Validate input
    if (!code || !program || !lessons || amount !== 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid admin package data' }),
      };
    }

    // Ensure this is a test package
    if (!isTest) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Only test packages allowed' }),
      };
    }

    console.log('Creating admin test package:', { code, program, lessons, amount });

    // Create the package directly in database with paid status
    const { data: packageData, error: dbError } = await supabase
      .from('packages')
      .insert([
        {
          code: code,
          program: program,
          lessons_total: lessons,
          lessons_remaining: lessons,
          amount_paid: 0, // $0 for admin test
          payment_intent_id: 'admin-test-' + Date.now(),
          status: 'paid', // Mark as paid immediately for testing
          customer_email: null, // Will be filled when booking
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to create admin package',
          details: dbError.message
        }),
      };
    }

    console.log('Admin package created successfully:', packageData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        packageCode: code,
        message: 'Admin test package created successfully'
      }),
    };

  } catch (error) {
    console.error('Admin package creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create admin package',
        details: error.message
      }),
    };
  }
};