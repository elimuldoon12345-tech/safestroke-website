// Debug what the calendar is actually sending
// Add this temporarily to booking-system-v2.js

window.showDateSlots = async function(dateStr) {
    const container = document.getElementById('selected-date-slots');
    const date = new Date(dateStr + 'T00:00:00');
    
    // DEBUG: Log exactly what we're sending
    console.log('🔍 DEBUG showDateSlots called with:', {
        dateStr: dateStr,
        program: selectedProgram || window.selectedProgram,
        url: `/.netlify/functions/get-time-slots?program=${selectedProgram || window.selectedProgram}&date=${dateStr}`
    });
    
    // Remove previous selection highlight
    document.querySelectorAll('.calendar-day-selected').forEach(el => {
        el.classList.remove('calendar-day-selected');
    });
    
    // Add selection highlight to clicked date
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('calendar-day-selected');
    }
    
    // Show loading spinner
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="loading-spinner"></div>
            <p class="text-gray-600 mt-4">Loading available times...</p>
        </div>
    `;
    
    // Smooth scroll to loading indicator
    setTimeout(() => {
        container.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest' 
        });
    }, 100);
    
    try {
        // Make sure we have a program selected
        const currentProgram = selectedProgram || window.selectedProgram || window.singleLessonProgram;
        
        if (!currentProgram) {
            throw new Error('No program selected');
        }
        
        const url = `/.netlify/functions/get-time-slots?program=${currentProgram}&date=${dateStr}`;
        console.log('🔍 DEBUG: Fetching from URL:', url);
        
        const response = await fetch(url);
        const slots = await response.json();
        
        console.log('🔍 DEBUG: Response received:', {
            status: response.status,
            slotsCount: slots.length,
            slots: slots
        });
        
        const availableSlots = slots.filter(s => s.current_enrollment < s.max_capacity);
        
        console.log('🔍 DEBUG: Available slots after filtering:', availableSlots.length);
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold">
                        Available times for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h4>
                    <button onclick="clearDateSelection()" 
                            class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition">
                        ← Back to calendar
                    </button>
                </div>
                
                ${availableSlots.length > 0 ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${availableSlots.map(slot => `
                            <button onclick="selectTimeSlot('${slot.id}', '${slot.date}', '${slot.start_time}')" 
                                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left">
                                <div class="font-semibold">
                                    ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}
                                </div>
                                <div class="text-sm text-gray-600 mt-1">
                                    Group ${slot.group_number} • ${slot.max_capacity - slot.current_enrollment} spots left
                                </div>
                            </button>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <p class="text-gray-500">No available time slots for this date.</p>
                        <p class="text-sm text-gray-400 mt-2">Please select another date.</p>
                        <div class="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4 text-left">
                            <p class="text-sm text-yellow-800">
                                <strong>Debug Info:</strong><br>
                                Program: ${currentProgram}<br>
                                Date: ${dateStr}<br>
                                Total slots found: ${slots.length}<br>
                                Available after filter: ${availableSlots.length}
                            </p>
                        </div>
                    </div>
                `}
            </div>
        `;
        
        // Smooth scroll to the loaded time slots
        setTimeout(() => {
            container.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest' 
            });
        }, 100);
        
    } catch (error) {
        console.error('🔍 DEBUG: Failed to load slots for date:', error);
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="text-red-600 text-center p-4">
                    <p class="font-semibold">Failed to load time slots</p>
                    <p class="text-sm mt-2">Error: ${error.message}</p>
                    <button onclick="clearDateSelection()" 
                            class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-full text-sm transition">
                        Back to calendar
                    </button>
                </div>
            </div>
        `;
    }
};