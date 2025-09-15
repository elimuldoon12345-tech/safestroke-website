const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { email, phone } = JSON.parse(event.body);
    
    if (!email && !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Email or phone required',
          eligible: false 
        })
      };
    }

    // Check if customer has any previous PAID package purchases
    // We check the packages table for completed purchases
    let query = supabase
      .from('packages')
      .select('id, created_at, lessons_remaining, status, program, amount_paid')
      .eq('status', 'paid'); // Only count paid packages
    
    // Search by email (case-insensitive)
    if (email) {
      query = query.ilike('customer_email', email.toLowerCase());
    }
    
    const { data: existingPackages, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database error',
          eligible: false 
        })
      };
    }

    // Customer is eligible for discount if they have at least one completed package purchase
    const isEligible = existingPackages && existingPackages.length > 0;
    const purchaseCount = existingPackages ? existingPackages.length : 0;
    
    // Calculate total amount spent (for future features)
    const totalSpent = existingPackages 
      ? existingPackages.reduce((sum, pkg) => sum + (pkg.amount_paid || 0), 0)
      : 0;
    
    // Calculate discount percentage (10% for all subsequent purchases)
    const discountPercentage = isEligible ? 10 : 0;
    
    // Log for debugging
    console.log('Customer discount check:', {
      email,
      isEligible,
      purchaseCount,
      totalSpent,
      discountPercentage
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        eligible: isEligible,
        discountPercentage,
        purchaseCount,
        totalSpent: Math.round(totalSpent),
        message: isEligible 
          ? `Welcome back! You've earned a ${discountPercentage}% loyalty discount on this package.`
          : 'Welcome! After your first package purchase, you\'ll automatically receive 10% off all future packages.',
        discountCode: isEligible ? 'LOYALTY10' : null,
        previousPrograms: isEligible 
          ? [...new Set(existingPackages.map(p => p.program))] // List unique programs they've purchased
          : []
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        eligible: false 
      })
    };
  }
};
