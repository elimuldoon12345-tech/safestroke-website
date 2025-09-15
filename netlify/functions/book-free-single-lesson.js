const { createClient } = require('@supabase/supabase-js');

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
    const {
      program,
      price,
      timeSlotId,
      studentName,
      studentBirthdate,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      promoCode
    } = JSON.parse(event.body);

    console.log('Booking single lesson:', { program, price, timeSlotId, promoCode });

    // Get the time slot details
    const { data: timeSlot, error: slotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', timeSlotId)
      .single();

    if (slotError || !timeSlot) {
      throw new Error('Time slot not found');
    }

    // Check availability
    if (timeSlot.current_enrollment >= timeSlot.max_capacity) {
      throw new Error('This time slot is full');
    }

    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          id: bookingId,
          time_slot_id: timeSlotId,
          student_name: studentName,
          student_birthdate: studentBirthdate,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          program: program,
          lesson_date: timeSlot.date,
          lesson_time: timeSlot.start_time,
          amount_paid: price,
          booking_type: 'single',
          promo_code: promoCode,
          notes: notes,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw new Error('Failed to create booking');
    }

    // Update time slot enrollment
    const { error: updateError } = await supabase
      .from('time_slots')
      .update({ 
        current_enrollment: timeSlot.current_enrollment + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', timeSlotId);

    if (updateError) {
      console.error('Failed to update enrollment:', updateError);
      // Don't throw error as booking was created
    }

    // Send confirmation email (if email service is configured)
    try {
      if (customerEmail) {
        // You can add email sending logic here
        console.log('Would send confirmation email to:', customerEmail);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        bookingId: bookingId,
        message: price === 0 ? 'Free lesson booked successfully!' : 'Lesson booked successfully!',
        lessonsRemaining: 0,
        singleLesson: true,
        details: {
          date: timeSlot.date,
          time: timeSlot.start_time,
          program: program,
          price: price
        }
      }),
    };

  } catch (error) {
    console.error('Book single lesson error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to book lesson'
      }),
    };
  }
};