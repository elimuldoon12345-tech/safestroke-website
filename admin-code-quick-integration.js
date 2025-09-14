// QUICK ADMIN CODE IMPLEMENTATION FOR booking-system-v2.js
// Add this to your existing booking-system-v2.js file

// Step 1: Add admin codes to your configuration (near the top of the file)
const ADMIN_CODES = {
    'ADMIN2025': { valid: true, description: 'Master admin code' },
    'SWIMFREE': { valid: true, description: 'Free swim lessons admin code' },
    'TESTBOOK': { valid: true, description: 'Test booking admin code' }
};

// Step 2: Replace your existing handleScheduleWithCode function with this enhanced version
async function handleScheduleWithCode() {
    const codeInput = document.getElementById('package-code-input');
    const code = codeInput.value.trim().toUpperCase(); // Convert to uppercase
    const errorMsg = document.getElementById('code-error-message');
    
    if (!code) {
        showError(errorMsg, 'Please enter a package code');
        return;
    }
    
    hideError(errorMsg);
    
    // Check if it's an admin code
    if (ADMIN_CODES[code]?.valid) {
        // It's an admin code - show quick package creation
        showQuickAdminDialog(code);
        return;
    }
    
    // Continue with normal package validation (rest of your existing code)
    showCalendarSection();
    
    try {
        // Your existing package validation code here...
        let packageData = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
            const response = await fetch(`/.netlify/functions/validate-package?code=${code}`);
            const data = await response.json();
            
            if (response.ok && data.valid) {
                packageData = data;
                break;
            }
            
            if (window.recentPackageCode === code && attempts < maxAttempts - 1) {
                console.log(`Attempt ${attempts + 1}: Waiting for payment confirmation...`);
                updateCalendarLoading(`Confirming payment... (Attempt ${attempts + 1}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } else {
                throw new Error(data.error || 'Invalid package code');
            }
        }
        
        if (!packageData || !packageData.valid) {
            throw new Error('Package validation failed');
        }
        
        enteredPackageCode = code;
        selectedProgram = packageData.program;
        
        updateCalendarTitle(code, packageData);
        await loadTimeSlots(packageData.program);
        
    } catch (error) {
        console.error('Code validation failed:', error);
        showError(errorMsg, error.message);
        resetToInitialState();
    }
}

// Step 3: Add this new function to show quick admin dialog
function showQuickAdminDialog(adminCode) {
    // Hide existing elements
    document.getElementById('existing-customer-path').classList.add('hidden');
    
    // Create a simple dialog
    const dialog = document.createElement('div');
    dialog.id = 'quick-admin-dialog';
    dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    dialog.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold mb-4">🔑 Admin Mode - Create Free Package</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Program:</label>
                    <select id="admin-program" class="w-full p-2 border rounded">
                        <option value="Droplet">Droplet (3-24 months)</option>
                        <option value="Splashlet">Splashlet (2-3 years)</option>
                        <option value="Strokelet">Strokelet (3-12 years)</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Lessons:</label>
                    <select id="admin-lessons" class="w-full p-2 border rounded">
                        <option value="1">1 Lesson</option>
                        <option value="4">4 Lessons</option>
                        <option value="6" selected>6 Lessons</option>
                        <option value="8">8 Lessons</option>
                        <option value="12">12 Lessons</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Email (optional):</label>
                    <input type="email" id="admin-email" class="w-full p-2 border rounded" 
                           placeholder="customer@email.com">
                </div>
                
                <div class="flex gap-2 pt-4">
                    <button onclick="closeAdminDialog()" 
                            class="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded">
                        Cancel
                    </button>
                    <button onclick="createAdminPackage('${adminCode}')" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                        Create Package
                    </button>
                </div>
            </div>
            
            <div id="admin-status" class="mt-4 text-sm hidden"></div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// Step 4: Add function to create admin package
window.createAdminPackage = async function(adminCode) {
    const program = document.getElementById('admin-program').value;
    const lessons = document.getElementById('admin-lessons').value;
    const email = document.getElementById('admin-email').value;
    const statusDiv = document.getElementById('admin-status');
    
    statusDiv.innerHTML = '<span class="text-blue-600">Creating package...</span>';
    statusDiv.classList.remove('hidden');
    
    try {
        const response = await fetch('/.netlify/functions/create-admin-package', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminCode: adminCode,
                program: program,
                lessons: parseInt(lessons),
                customerEmail: email || null
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            statusDiv.innerHTML = `
                <div class="bg-green-100 p-3 rounded">
                    <strong class="text-green-800">✓ Package Created!</strong><br>
                    <span class="font-mono text-lg">${result.packageCode}</span><br>
                    <small>Redirecting to calendar...</small>
                </div>
            `;
            
            // Auto-proceed to calendar after 2 seconds
            setTimeout(() => {
                closeAdminDialog();
                
                // Set the package code and proceed
                enteredPackageCode = result.packageCode;
                selectedProgram = result.program;
                
                showCalendarSection();
                updateCalendarTitle(result.packageCode, {
                    program: result.program,
                    lessons_remaining: result.lessons
                });
                loadTimeSlots(result.program);
            }, 2000);
            
        } else {
            throw new Error(result.error || 'Failed to create package');
        }
        
    } catch (error) {
        statusDiv.innerHTML = `<span class="text-red-600">Error: ${error.message}</span>`;
    }
}

// Step 5: Add function to close dialog
window.closeAdminDialog = function() {
    const dialog = document.getElementById('quick-admin-dialog');
    if (dialog) {
        dialog.remove();
    }
    // Show the original options
    document.getElementById('existing-customer-path').classList.remove('hidden');
}

// That's it! The admin code feature is now integrated.
// Admin codes: ADMIN2025, SWIMFREE, TESTBOOK