document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const backgroundContainer = document.querySelector('.background-container');
    const successOverlay = document.getElementById('success-overlay');
    const successMessage = document.querySelector('.success-message');
    const subMessage = document.querySelector('.sub-message');
    const yaySound = document.getElementById('yay-sound');

    // --- Floating Hearts Background ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '💖';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 7 + 's'; // 7-10s
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        backgroundContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 10000);
    }

    setInterval(createHeart, 300);

    // --- YES Button Logic ---
    yesBtn.addEventListener('click', () => {
        celebrate();
    });

    // --- NO Button Logic (The Evasion) ---
    const noTexts = [
        "No 😢",
        "Really? 🥺",
        "Think again! 💔",
        "Nope, not happening! 😏",
        "Give up! 💝",
        "Last chance! 🌹",
        "Don't do this to me! 😭",
        "You can't escape my love! 😈",
        "Are you sure? 🧐",
        "Press YES! 💖",
        "I'm not leaving! 💃",
        "Try again! 🎲",
        "Resistance is futile! 🤖",
        "You know you want to... 😉",
        "Just click YES already! 😤",
        "Pretty please? 🥺",
        "I'll buy you chocolate! 🍫"
    ];
    let noHoverCount = 0;

    function moveNoBtn() {
        noHoverCount++;

        // Update text
        if (noHoverCount < noTexts.length) {
            noBtn.innerText = noTexts[noHoverCount];
        } else {
            noBtn.innerText = noTexts[noTexts.length - 1];
        }

        // Make YES button grow
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        const newSize = currentSize * 1.2; // Grow by 20%
        yesBtn.style.fontSize = `${newSize}px`;
        yesBtn.style.padding = `${parseFloat(window.getComputedStyle(yesBtn).paddingTop) * 1.1}px ${parseFloat(window.getComputedStyle(yesBtn).paddingRight) * 1.2}px`;

        // Teleport NO button using FIXED position to ensure it stays in viewport
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '1000'; // Ensure it stays on top

        // Get button dimensions
        const btnWidth = noBtn.offsetWidth || 100; // Fallback if not rendered yet
        const btnHeight = noBtn.offsetHeight || 50;

        // Add a buffer so it doesn't touch the edges
        const buffer = 20;

        // Calculate available area
        const maxX = window.innerWidth - btnWidth - buffer;
        const maxY = window.innerHeight - btnHeight - buffer;

        // Generate random position within buffer
        const randomX = Math.max(buffer, Math.random() * maxX);
        const randomY = Math.max(buffer, Math.random() * maxY);

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // Make NO button smaller slightly
        const currentNoSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(10, currentNoSize * 0.9)}px`; // Don't go below 10px
    }

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click on mobile
        moveNoBtn();
    });

    // --- Celebration Logic ---
    function celebrate() {
        // Play sound
        if (yaySound) {
            yaySound.play().catch(e => console.log("Audio play blocked (user needed to interact first)"));
        }

        // Confetti explosion
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF69B4', '#FFC0CB', '#B76E79', '#FFD700', '#FFF']
        });

        // Continuous confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 250);

        // Show overlay
        successOverlay.classList.remove('hidden');

        // Log to Firebase
        writeToFirebase();
    }

    function writeToFirebase() {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            const db = firebase.firestore();
            db.collection("valentine").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                response: "YES! 💝",
                attempts_to_click_no: noHoverCount,
                device: navigator.userAgent
            }).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    }
});
