const { createClient } = require('@supabase/supabase-js');
const { sendBookingConfirmation } = require('./email-service');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  const normalized = String(value).toLowerCase().trim();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }
  return defaultValue;
};

const generateSimulatedIntentId = () => {
  if (crypto.randomUUID) {
    return `pi_simulated_${crypto.randomUUID()}`;
  }
  return `pi_simulated_${crypto.randomBytes(16).toString('hex')}`;
};

const normalizeCsv = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

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

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (parseError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON payload', details: parseError.message }),
    };
  }

  const simulatorEnabled = parseBoolean(process.env.ENABLE_BOOKING_SIMULATOR, false);
  if (!simulatorEnabled) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Booking simulator is disabled' }),
    };
  }

  const allowInProd = parseBoolean(process.env.SIMULATOR_ALLOW_IN_PROD, false);
  const deployContext = (process.env.CONTEXT || process.env.DEPLOY_CONTEXT || '').toLowerCase();
  if (!allowInProd && deployContext === 'production') {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Booking simulator is locked in production' }),
    };
  }

  const adminEmail = (payload.adminEmail || '').toString().trim().toLowerCase();
  const allowedEmails = normalizeCsv(process.env.SIMULATOR_ADMIN_EMAILS);
  if (allowedEmails.length > 0) {
    if (!adminEmail || !allowedEmails.includes(adminEmail)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Admin email is not authorized for simulator access' }),
      };
    }
  }

  const sharedSecret =
    process.env.SIMULATOR_SHARED_SECRET ||
    process.env.ADMIN_SHARED_KEY ||
    'safestroke-admin-2025';

  if (sharedSecret && payload.adminKey !== sharedSecret) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid admin credentials' }),
    };
  }

  const outcome = (payload.outcome || 'success').toString().toLowerCase();
  if (!['success', 'failure'].includes(outcome)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Outcome must be "success" or "failure"' }),
    };
  }

  const timeSlotId = payload.timeSlotId;
  const studentName = (payload.studentName || '').trim();
  const customerName = (payload.customerName || '').trim();
  const customerEmail = (payload.customerEmail || '').trim().toLowerCase();

  if (!timeSlotId || !studentName || !customerName || !customerEmail) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const studentAge = payload.studentAge || null;
  const customerPhone = payload.customerPhone || null;
  const notes = payload.notes || null;
  const lessonsTotal = Number(payload.lessonsTotal || 1);
  const amountPaid = Number(payload.amountPaid ?? 0);
  const programName = payload.program || null;
  const sendNotificationsRequest = parseBoolean(payload.sendNotifications, false);
  const suppressNotifications = parseBoolean(process.env.SIMULATOR_SUPPRESS_NOTIFICATIONS, true);
  const shouldSendNotifications = sendNotificationsRequest && !suppressNotifications && outcome === 'success';

  if (!Number.isFinite(lessonsTotal) || lessonsTotal <= 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'lessonsTotal must be a positive number' }),
    };
  }

  if (!Number.isFinite(amountPaid)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'amountPaid must be a valid number' }),
    };
  }

  const simulatedBy = adminEmail || 'simulator-admin';
  const simulatedAt = new Date().toISOString();
  const paymentStatus = outcome === 'success' ? 'succeeded' : 'failed';
  const bookingStatus = outcome === 'success' ? 'confirmed' : 'failed';
  const paymentIntentId = generateSimulatedIntentId();

  try {
    const { data: slotData, error: slotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', timeSlotId)
      .single();

    if (slotError || !slotData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid time slot' }),
      };
    }

    if (outcome === 'success') {
      if (slotData.current_enrollment >= slotData.max_capacity) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'This time slot is full' }),
        };
      }
    }

    const { data: existingBooking, error: existingBookingError } = await supabase
      .from('time_slot_bookings')
      .select('id')
      .eq('time_slot_id', timeSlotId)
      .eq('student_name', studentName)
      .eq('customer_email', customerEmail)
      .maybeSingle();

    if (existingBookingError && existingBookingError.code !== 'PGRST116') {
      console.error('Existing booking lookup error:', existingBookingError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to check existing bookings' }),
      };
    }

    if (existingBooking && outcome === 'success') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'This student already has a booking for this time slot' }),
      };
    }

    let packageRecord = null;
    const packageCode = (payload.packageCode || '').trim();

    if (packageCode) {
      const { data: existingPackage, error: packageLookupError } = await supabase
        .from('packages')
        .select('*')
        .eq('code', packageCode)
        .single();

      if (packageLookupError || !existingPackage) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Specified package code was not found' }),
        };
      }

      if (
        Object.prototype.hasOwnProperty.call(existingPackage, 'is_test') &&
        existingPackage.is_test !== true
      ) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Existing package is not marked as test data. Provide a simulator package or omit packageCode.',
          }),
        };
      }

      const { data: updatedPackage, error: packageUpdateError } = await supabase
        .from('packages')
        .update({
          is_test: true,
          simulated_by: simulatedBy,
          simulated_at: simulatedAt,
          source: 'simulator',
          payment_status: paymentStatus,
          payment_intent_id: paymentIntentId,
          status: outcome === 'success' ? 'paid' : existingPackage.status,
          simulator_notes: notes,
          updated_at: simulatedAt,
        })
        .eq('code', packageCode)
        .select()
        .single();

      if (packageUpdateError || !updatedPackage) {
        console.error('Package update error:', packageUpdateError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to update existing package for simulation' }),
        };
      }

      packageRecord = updatedPackage;
    } else {
      const generatedCode = `SIM-${(programName || slotData.lesson_type || 'PKG')
        .toString()
        .substring(0, 3)
        .toUpperCase()}-${Date.now().toString().slice(-6)}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const packageInsert = {
        code: generatedCode,
        program: programName || slotData.lesson_type || 'Simulator',
        lessons_total: lessonsTotal,
        lessons_remaining: lessonsTotal,
        amount_paid: amountPaid,
        payment_intent_id: paymentIntentId,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        status: outcome === 'success' ? 'paid' : 'pending',
        created_at: simulatedAt,
        updated_at: simulatedAt,
        is_test: true,
        simulated_by: simulatedBy,
        simulated_at: simulatedAt,
        source: 'simulator',
        payment_status: paymentStatus,
        simulator_notes: notes,
      };

      const { data: insertedPackage, error: packageInsertError } = await supabase
        .from('packages')
        .insert([packageInsert])
        .select()
        .single();

      if (packageInsertError || !insertedPackage) {
        console.error('Package insert error:', packageInsertError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to create simulated package' }),
        };
      }

      packageRecord = insertedPackage;
    }

    let bookingRecord = null;
    if (outcome === 'success') {
      const bookingInsert = {
        time_slot_id: timeSlotId,
        package_code: packageRecord.code,
        student_name: studentName,
        student_age: studentAge,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        status: bookingStatus,
        notes,
        created_at: simulatedAt,
        is_test: true,
        simulated_by: simulatedBy,
        simulated_at: simulatedAt,
        source: 'simulator',
        payment_status: paymentStatus,
        payment_intent_id: paymentIntentId,
        simulator_outcome: outcome,
        simulator_notes: notes,
      };

      const { data: insertedBooking, error: bookingInsertError } = await supabase
        .from('time_slot_bookings')
        .insert([bookingInsert])
        .select()
        .single();

      if (bookingInsertError || !insertedBooking) {
        console.error('Booking insert error:', bookingInsertError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to create simulated booking' }),
        };
      }

      bookingRecord = insertedBooking;
    }

    const { error: customerError } = await supabase
      .from('customers')
      .upsert(
        [
          {
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            updated_at: simulatedAt,
            is_test: true,
            simulated_by: simulatedBy,
            simulated_at: simulatedAt,
            source: 'simulator',
          },
        ],
        { onConflict: 'email' }
      );

    if (customerError) {
      console.error('Customer upsert error:', customerError);
    }

    let updatedPackageLessons = packageRecord.lessons_remaining;
    if (packageRecord.code) {
      const { data: refreshedPackage, error: refreshedPackageError } = await supabase
        .from('packages')
        .select('lessons_remaining')
        .eq('code', packageRecord.code)
        .single();

      if (!refreshedPackageError && refreshedPackage) {
        updatedPackageLessons = refreshedPackage.lessons_remaining;
      }
    }

    const auditRequestPayload = { ...payload };
    delete auditRequestPayload.adminKey;

    const auditRecord = {
      booking_id: bookingRecord ? bookingRecord.id : null,
      package_id: packageRecord ? packageRecord.id : null,
      payment_id: null,
      request_payload: auditRequestPayload,
      response_payload: {
        outcome,
        bookingId: bookingRecord ? bookingRecord.id : null,
        packageCode: packageRecord.code,
      },
      outcome,
      simulated_by: simulatedBy,
      simulated_at: simulatedAt,
      notes,
    };

    const { error: auditError } = await supabase
      .from('booking_simulator_audit')
      .insert([auditRecord]);

    if (auditError) {
      if (auditError.message && auditError.message.includes('relation')) {
        console.warn('Audit table missing; skipping audit insert.');
      } else {
        console.error('Audit insert error:', auditError);
      }
    }

    if (shouldSendNotifications && bookingRecord) {
      try {
        await sendBookingConfirmation(bookingRecord, slotData);
      } catch (notificationError) {
        console.error('Notification error (simulator):', notificationError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        simulated: true,
        outcome,
        bookingId: bookingRecord ? bookingRecord.id : null,
        packageCode: packageRecord.code,
        lessonsRemaining: updatedPackageLessons,
        notificationsSent: shouldSendNotifications && !!bookingRecord,
        suppressNotifications,
        booking: bookingRecord
          ? {
              ...bookingRecord,
              timeSlot: slotData,
            }
          : null,
        package: packageRecord,
        message:
          outcome === 'success'
            ? 'Simulated booking created successfully.'
            : 'Simulated booking recorded as failure.',
      }),
    };
  } catch (error) {
    console.error('Simulate booking error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Simulation failed',
        details: error.message,
      }),
    };
  }
};
