const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// This webhook endpoint will be called by Stripe when payment events occur
exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify the webhook signature
    if (webhookSecret) {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        webhookSecret
      );
    } else {
      // For testing without webhook secret (not recommended for production)
      stripeEvent = JSON.parse(event.body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(stripeEvent.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(stripeEvent.data.object);
        break;
        
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};

async function handlePaymentSuccess(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // Extract metadata
  const { program, lessons } = paymentIntent.metadata;
  
  // Find the package by payment intent ID
  const { data: packageData, error: findError } = await supabase
    .from('packages')
    .select('*')
    .eq('payment_intent_id', paymentIntent.id)
    .single();

  if (findError || !packageData) {
    console.error('Package not found for payment intent:', paymentIntent.id);
    return;
  }

  // Update package status to paid
  const { error: updateError } = await supabase
    .from('packages')
    .update({ 
      status: 'paid',
      updated_at: new Date().toISOString()
    })
    .eq('id', packageData.id);

  if (updateError) {
    console.error('Failed to update package status:', updateError);
    return;
  }

  // Extract customer email from payment intent if available
  if (paymentIntent.receipt_email || paymentIntent.charges?.data[0]?.billing_details?.email) {
    const customerEmail = paymentIntent.receipt_email || paymentIntent.charges.data[0].billing_details.email;
    const customerName = paymentIntent.charges?.data[0]?.billing_details?.name || '';
    const customerPhone = paymentIntent.charges?.data[0]?.billing_details?.phone || '';
    
    // Update package with customer info
    await supabase
      .from('packages')
      .update({ 
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone
      })
      .eq('id', packageData.id);
    
    // Create or update customer record
    await supabase
      .from('customers')
      .upsert([
        {
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'email' });
  }

  console.log(`Package ${packageData.code} marked as paid`);
  
  // TODO: Send confirmation email with package code
  // await sendPackageConfirmationEmail(packageData);
}

async function handlePaymentFailure(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  // Find and update the package
  const { error } = await supabase
    .from('packages')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Failed to update package status:', error);
  }
}