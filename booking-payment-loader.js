// Payment Method Optimization Loader 
// Loads optimized payment with Card + Apple/Google Pay only 
 
document.addEventListener('DOMContentLoaded', function() { 
    // Load optimized payment scripts 
    const scripts = [ 
        'booking-payment-optimized.js', 
        'booking-single-lesson-optimized.js' 
    ]; 
 
    scripts.forEach(src => { 
        const script = document.createElement('script'); 
        script.src = src; 
        script.async = false; 
        document.body.appendChild(script); 
    }); 
 
    console.log('Optimized payment methods loaded: Card + Express Checkout only'); 
}); 
