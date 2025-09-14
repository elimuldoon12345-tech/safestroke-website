const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
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

  // Check if Supabase is configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Supabase not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database not configured',
        details: 'Supabase credentials missing'
      }),
    };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request data',
          details: parseError.message 
        }),
      };
    }

    const { adminCode, program, lessons, customerEmail, customerName } = requestData;

    // Define your admin codes here - you can have multiple for different purposes
    const ADMIN_CODES = {
      'ADMIN2025': { valid: true, description: 'Master admin code' },
      'SWIMFREE': { valid: true, description: 'Free swim lessons admin code' },
      'TESTBOOK': { valid: true, description: 'Test booking admin code' }
    };

    // Check if environment variable admin code is set (optional)
    if (process.env.ADMIN_MASTER_CODE) {
      ADMIN_CODES[process.env.ADMIN_MASTER_CODE] = { valid: true, description: 'Environment admin code' };
    }

    // Validate admin code
    if (!adminCode || !ADMIN_CODES[adminCode]?.valid) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid admin code',
          details: 'The provided admin code is not valid'
        }),
      };
    }

    // Validate input
    if (!program || !lessons) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'program and lessons are required'
        }),
      };
    }

    // Validate program
    const validPrograms = ['Droplet', 'Splashlet', 'Strokelet'];
    if (!validPrograms.includes(program)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid program',
          details: `Program must be one of: ${validPrograms.join(', ')}`
        }),
      };
    }

    // Validate lessons
    const lessonsNum = parseInt(lessons);
    if (isNaN(lessonsNum) || lessonsNum < 1 || lessonsNum > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid lessons count',
          details: 'Lessons must be between 1 and 100'
        }),
      };
    }

    console.log('Creating admin package for:', { program, lessons, adminCode });

    // Generate a unique package code
    const packageCode = generateAdminPackageCode(program, lessonsNum);

    // Store the package in database
    const { data: packageData, error: dbError } = await supabase
      .from('packages')
      .insert([
        {
          code: packageCode,
          program: program,
          lessons_total: lessonsNum,
          lessons_remaining: lessonsNum,
          amount_paid: 0, // Free package
          payment_intent_id: `admin_${Date.now()}`, // Unique identifier for admin packages
          status: 'paid', // Mark as paid immediately
          customer_email: customerEmail || null,
          customer_name: customerName || null,
          notes: `Created with admin code: ${adminCode} - ${ADMIN_CODES[adminCode].description}`,
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
          error: 'Failed to create package',
          details: dbError.message
        }),
      };
    }

    // Log admin action for audit purposes
    console.log('Admin package created:', {
      packageCode,
      program,
      lessons: lessonsNum,
      adminCode,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        packageCode: packageCode,
        program: program,
        lessons: lessonsNum,
        message: `Admin package created successfully with ${lessonsNum} lessons for ${program} program`
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

function generateAdminPackageCode(program, lessons) {
  const prefix = 'ADM'; // Special prefix for admin packages
  const programCode = program.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${programCode}-${lessons}L-${timestamp}-${random}`;
}