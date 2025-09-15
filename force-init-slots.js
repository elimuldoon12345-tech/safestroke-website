// October 2025 Time Slot Force Initializer
// Run this in browser console on your booking page

async function forceInitializeSlots() {
    console.log('🚨 Force initializing October 2025 slots...');
    
    try {
        const response = await fetch('/.netlify/functions/init-october-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        console.log('Response:', data);
        
        if (data.success) {
            console.log('✅ SUCCESS! Created slots:', data.slotsCreated);
            console.log('Dates:', data.dates);
            
            // Now test if we can retrieve them
            console.log('\n📊 Testing retrieval...');
            const testResponse = await fetch('/.netlify/functions/get-time-slots?program=Splashlet&date=2025-10-05');
            const testSlots = await testResponse.json();
            console.log('Test retrieval for Oct 5:', testSlots.length, 'slots found');
            
            if (testSlots.length > 0) {
                console.log('✅ COMPLETE SUCCESS! Slots are working!');
                console.log('Available times:', testSlots.map(s => s.start_time));
            } else {
                console.log('⚠️ Slots created but not retrievable - check API');
            }
        } else {
            console.log('⚠️', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run it
forceInitializeSlots();