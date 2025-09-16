// Apple Pay Quick Check Script
// Run this in your browser console on the booking page to verify Apple Pay status

(async function checkApplePay() {
    console.log('🍎 Apple Pay Status Check\n' + '='.repeat(40));
    
    // 1. Check environment
    console.log('\n1️⃣ ENVIRONMENT CHECKS:');
    console.log('Protocol:', location.protocol, location.protocol === 'https:' ? '✅' : '❌ (HTTPS required)');
    console.log('Domain:', location.hostname);
    
    // 2. Check browser
    console.log('\n2️⃣ BROWSER CHECKS:');
    const ua = navigator.userAgent;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isAppleDevice = /iPhone|iPad|Mac/.test(ua);
    console.log('Browser:', isSafari ? 'Safari ✅' : 'Not Safari ❌');
    console.log('Device:', isAppleDevice ? 'Apple Device ✅' : 'Not Apple Device ❌');
    console.log('Apple Pay API:', typeof window.ApplePaySession !== 'undefined' ? 'Available ✅' : 'Not Available ❌');
    
    // 3. Check Stripe
    console.log('\n3️⃣ STRIPE CHECKS:');
    if (!window.stripe) {
        console.log('Stripe not initialized ❌');
        console.log('Tip: Make sure you\'re on the payment step of booking');
        return;
    }
    console.log('Stripe initialized ✅');
    
    // 4. Test Payment Request
    console.log('\n4️⃣ PAYMENT REQUEST TEST:');
    try {
        const pr = window.stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: { label: 'Test', amount: 100 },
            requestPayerName: true,
            requestPayerEmail: true
        });
        
        const canMakePayment = await pr.canMakePayment();
        
        if (canMakePayment) {
            console.log('✅ Apple Pay is AVAILABLE!');
            if (canMakePayment.applePay) {
                console.log('   Type: Apple Pay');
            } else if (canMakePayment.googlePay) {
                console.log('   Type: Google Pay');
            }
        } else {
            console.log('❌ Apple Pay NOT available');
            console.log('\nPossible reasons:');
            console.log('• No cards in Apple Wallet');
            console.log('• Domain not verified (or still propagating)');
            console.log('• Not on HTTPS');
            console.log('• Not using Safari on Apple device');
        }
    } catch (e) {
        console.log('❌ Error testing:', e.message);
    }
    
    // 5. Recommendations
    console.log('\n5️⃣ RECOMMENDATIONS:');
    if (!isSafari || !isAppleDevice) {
        console.log('⚠️ Switch to Safari on iPhone/iPad/Mac to use Apple Pay');
    } else if (location.protocol !== 'https:') {
        console.log('⚠️ Deploy to HTTPS to enable Apple Pay');
    } else {
        console.log('💡 If Apple Pay isn\'t showing:');
        console.log('   1. Ensure domain is verified in Stripe Dashboard');
        console.log('   2. Wait 5-10 minutes for propagation');
        console.log('   3. Add a card to Apple Wallet');
        console.log('   4. Clear Safari cache and reload');
    }
    
    console.log('\n' + '='.repeat(40));
    console.log('Check complete! See details above.');
})();
