const { createClient } = require('@supabase/supabase-js');

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

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
    
    // Try with minimal fields first (in case promo_code column doesn't exist)
    let packageData = {
      code: packageCode,
      program: program,
      lessons_total: 1,
      lessons_remaining: 1,
      amount_paid: 0,
      payment_intent_id: `promo_${promoCode || 'FIRST-FREE'}_${timestamp}`,
      status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Attempting insert with minimal fields...');

    // First attempt: minimal fields
    let { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();

    // If it fails, it might be because some columns don't exist
    if (error) {
      console.log('First attempt failed:', error.message);
      console.log('Trying with different field structure...');
      
      // Try even more minimal - just required fields
      packageData = {
        code: packageCode,
        program: program,
        lessons_total: 1,
        lessons_remaining: 1,
        amount_paid: 0,
        status: 'paid'
      };
      
      // Second attempt with minimal fields
      const result2 = await supabase
        .from('packages')
        .insert([packageData])
        .select()
        .single();
        
      data = result2.data;
      error = result2.error;
      
      if (error) {
        console.error('Second attempt also failed:', error);
        
        // Try one more time with different field names
        packageData = {
          code: packageCode,
          program: program,
          total_lessons: 1, // Try different field name
          remaining_lessons: 1, // Try different field name
          amount_paid: 0,
          status: 'paid'
        };
        
        const result3 = await supabase
          .from('packages')
          .insert([packageData])
          .select()
          .single();
          
        data = result3.data;
        error = result3.error;
      }
    }

    if (error) {
      console.error('All attempts failed. Final error:', error);
      
      // Provide helpful error message
      let errorMessage = 'Database error creating package';
      let errorDetails = error.message;
      
      if (error.message.includes('column') || error.message.includes('field')) {
        errorMessage = 'Database schema mismatch';
        errorDetails = 'The packages table structure may need updating. ' + error.message;
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          code: error.code,
          hint: 'Check that the packages table has these columns: code, program, lessons_total OR total_lessons, lessons_remaining OR remaining_lessons, amount_paid, status'
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