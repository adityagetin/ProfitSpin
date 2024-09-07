// Define slot values for different rewards
const slotValues = [
    '01.png', // Cashback
    '02.png', // ROI Discount
    '03.png'  // Subscription Discount
];

// Maximum number of spins allowed
let spinCount = 0;
const maxSpins = 3;

// Wallet balances for different types of rewards
let cashbackBalance = 0;
let roiBalance = 0;
let subscriptionBalance = 0;

// Preload and set up the spin sound
const spinSound = new Audio('Sound1.mp3');
spinSound.loop = true; // Set sound to loop

// Utility function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility function to get a random slot value
function getRandomSlotValue() {
    return slotValues[Math.floor(Math.random() * slotValues.length)];
}

// Function to get jackpot result and update wallet balances
function getJackpotResult(value) {
    switch (value) {
        case '01.png':
            // Cashback between Rs 20 to 500
            const cashback = getRandomInt(20, 500);
            cashbackBalance += cashback;
            updateWallets();
            return `Cashback of Rs ${cashback}`;
        case '02.png':
            // ROI Discount between 0.5% to 2%
            const roiDiscount = getRandomInt(1, 2) / 100;
            roiBalance += roiDiscount;
            updateWallets();
            return `ROI Discount of ${roiDiscount}%`;
        case '03.png':
            // Subscription Discount between Rs 100 to 2000
            const subscriptionDiscount = getRandomInt(100, 2000);
            subscriptionBalance += subscriptionDiscount;
            updateWallets();
            return `Subscription Discount of Rs ${subscriptionDiscount}`;
        default:
            return 'Try again!';
    }
}

// Function to update the wallet displays
function updateWallets() {
    document.getElementById('cashbackAmount').textContent = `${cashbackBalance}/-`;
    document.getElementById('roiAmount').textContent = `${roiBalance.toFixed(2)}`;
    document.getElementById('subscriptionAmount').textContent = `${subscriptionBalance}/-`;
}

// Main function to handle the spinning action
function spin() {
    if (spinCount < maxSpins) {
        spinCount++;
        const slots = document.querySelectorAll('.slot-content');
        const resultDisplay = document.getElementById('result');
        
        // Play sound when spin starts
        spinSound.play();

        // Calculate spin duration and number of spins
        const spins = getRandomInt(5, 10);
        const duration = 5; // Duration in seconds
        const totalRotation = spins * 360; // Total degrees to rotate
        const iconChangeInterval = 100; // Interval to change icons in milliseconds

        // Set initial icons
        slots.forEach(slot => {
            slot.innerHTML = `<img src="${getRandomSlotValue()}" alt="Reward"/>`;
        });

        // Start spinning animation
        slots.forEach(slot => {
            slot.style.transition = `transform ${duration}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
            slot.style.transform = `rotateX(${totalRotation}deg)`;
        });

        // Change icons during spinning
        const intervalId = setInterval(() => {
            slots.forEach(slot => {
                slot.innerHTML = `<img src="${getRandomSlotValue()}" alt="Reward"/>`;
            });
        }, iconChangeInterval);

        // Stop changing icons and determine result after spinning
        setTimeout(() => {
            clearInterval(intervalId); // Stop changing icons

            const results = [];
            slots.forEach(slot => {
                const value = getRandomSlotValue();
                slot.innerHTML = `<img src="${value}" alt="Reward"/>`;
                results.push(value);
            });

            // Stop the sound when result is declared
            spinSound.pause();
            spinSound.currentTime = 0; // Reset sound playback

            // Determine the result
            if (new Set(results).size === 1) {
                resultDisplay.innerHTML = `Congratulations! You Win <br> ${getJackpotResult(results[0])}!`;
            } else {
                resultDisplay.innerHTML = `Try again!`;
            }

            // Reset rotation
            slots.forEach(slot => {
                slot.style.transition = 'none';
                slot.style.transform = 'none';
            });

            // Update spin button text
            if (spinCount < maxSpins) {
                document.getElementById('spinButton').textContent = `Spin ${spinCount + 1}/${maxSpins}`;
            } else {
                document.getElementById('spinButton').textContent = "Game Over";
                document.getElementById('spinButton').disabled = true;
                if(cashbackBalance==0 && roiBalance ==0 && subscriptionBalance ==0){
                    setTimeout(5000)
                    resultDisplay.innerHTML= 'Better Luck Next Time !';
                }
                else{
                    resultDisplay.innerHTML= 'Thanks!'
                }
            }
        }, duration * 1000); // Match the duration in milliseconds
    }
}
