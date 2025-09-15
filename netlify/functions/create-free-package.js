const { createClient } = require('@supabase/supabase-js');

// Add error checking for environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { program, promoCode } = body;

    console.log('Creating free package:', { program, promoCode });

    // Validate inputs - promoCode is optional
    if (!program) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Program is required' }),
      };
    }

    // Generate simpler package code
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const packageCode = `FREE-${timestamp}-${random}`;
    
    console.log('Generated package code:', packageCode);
    
    // Create the package with all required fields
    const packageData = {
      code: packageCode,
      program: program,
      lessons_total: 1,
      lessons_remaining: 1,
      amount_paid: 0,
      payment_intent_id: `promo_${promoCode || 'FIRST-FREE'}_${timestamp}`,
      status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_email: null, // Will be updated when booking
      promo_code: promoCode || 'FIRST-FREE'
    };

    console.log('Inserting package:', packageData);

    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database error creating package',
          details: error.message,
          code: error.code 
        }),
      };
    }

    console.log('Package created successfully:', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        packageCode: packageCode,
        message: 'Free lesson package created successfully'
      }),
    };

  } catch (error) {
    console.error('Create free package error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create free package',
        details: error.message,
        stack: error.stack
      }),
    };
  }
};