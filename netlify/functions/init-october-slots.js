const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const slotsToCreate = [];
    const programs = ['Droplet', 'Splashlet', 'Strokelet'];
    
    // October 2025 - Create slots for all Sundays and Mondays
    const october2025 = new Date(2025, 9, 1); // October is month 9 (0-indexed)
    
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, 9, day);
      const dayOfWeek = date.getDay();
      
      // Only create slots for Sundays (0) and Mondays (1)
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Create morning and afternoon slots for each program
        programs.forEach(program => {
          // Morning slots (9am, 10am, 11am)
          ['09:00:00', '10:00:00', '11:00:00'].forEach((startTime, index) => {
            const endTime = `${parseInt(startTime.split(':')[0]) + 1}:00:00`;
            slotsToCreate.push({
              date: dateStr,
              start_time: startTime,
              end_time: endTime,
              lesson_type: program,
              group_number: index + 1,
              max_capacity: 3,
              current_enrollment: 0,
              status: 'available',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          });
          
          // Afternoon slots (2pm, 3pm, 4pm)
          ['14:00:00', '15:00:00', '16:00:00'].forEach((startTime, index) => {
            const endTime = `${parseInt(startTime.split(':')[0]) + 1}:00:00`;
            slotsToCreate.push({
              date: dateStr,
              start_time: startTime,
              end_time: endTime,
              lesson_type: program,
              group_number: index + 4,
              max_capacity: 3,
              current_enrollment: 0,
              status: 'available',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          });
        });
      }
    }

    // Check if slots already exist for October 2025
    const { data: existingSlots, error: checkError } = await supabase
      .from('time_slots')
      .select('id')
      .gte('date', '2025-10-01')
      .lte('date', '2025-10-31')
      .limit(1);

    if (existingSlots && existingSlots.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Time slots for October 2025 already exist',
          existingCount: existingSlots.length
        })
      };
    }

    // Insert all slots
    const { data, error } = await supabase
      .from('time_slots')
      .insert(slotsToCreate);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: `Created ${slotsToCreate.length} time slots for October 2025`,
        slotsCreated: slotsToCreate.length,
        dates: [...new Set(slotsToCreate.map(s => s.date))]
      })
    };
  } catch (error) {
    console.error('Error creating slots:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create time slots',
        details: error.message 
      })
    };
  }
};