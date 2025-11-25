// ai-bubbles.js - Animations for floating AI-like bubbles

(function() {
    'use strict';

    const CONFIG = {
        maxBubbles: 15,
        minSize: 20,
        maxSize: 60,
        minDuration: 8,
        maxDuration: 15,
        spawnInterval: 2000
    };

    let bubbleContainer = null;
    let bubbleCount = 0;

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        bubbleContainer = document.getElementById('aiBubbleContainer');
        if (bubbleContainer) {
            createInitialBubbles();
            startBubbleSpawner();
        }
    });

    function createInitialBubbles() {
        // Create a few bubbles initially
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createBubble(), i * 500);
        }
    }

    function startBubbleSpawner() {
        setInterval(() => {
            if (bubbleCount < CONFIG.maxBubbles) {
                createBubble();
            }
        }, CONFIG.spawnInterval);
    }

    function createBubble() {
        if (!bubbleContainer) return;

        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble';

        // Random properties
        const size = randomInRange(CONFIG.minSize, CONFIG.maxSize);
        const duration = randomInRange(CONFIG.minDuration, CONFIG.maxDuration);
        const left = randomInRange(5, 95);
        const delay = randomInRange(0, 2);

        // Apply styles
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        // Add to container
        bubbleContainer.appendChild(bubble);
        bubbleCount++;

        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
                bubbleCount--;
            }
        }, (duration + delay) * 1000);
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Interactive bubble effect on mouse move (throttled)
    let lastMouseBubbleTime = 0;
    const MOUSE_BUBBLE_THROTTLE = 200; // ms between bubble creations
    let mouseBubbleCount = 0;
    const MAX_MOUSE_BUBBLES = 10;

    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (!bubbleContainer || 
            now - lastMouseBubbleTime < MOUSE_BUBBLE_THROTTLE || 
            mouseBubbleCount >= MAX_MOUSE_BUBBLES ||
            Math.random() > 0.3) return;

        lastMouseBubbleTime = now;
        mouseBubbleCount++;

        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble';
        
        const size = randomInRange(10, 25);
        
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - size/2}px;
            top: ${e.clientY - size/2}px;
            animation: float 3s ease-out forwards;
            opacity: 0.6;
        `;

        bubbleContainer.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
                mouseBubbleCount--;
            }
        }, 3000);
    });

})();
