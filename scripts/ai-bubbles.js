/**
 * AI Bubbles - Code Syntax Institut
 * Floating AI-styled bubble animations on the homepage
 */

class AIBubbles {
    constructor(containerId = 'aiBubbleContainer') {
        this.container = document.getElementById(containerId);
        this.bubbles = [];
        this.maxBubbles = 15;
        this.isRunning = false;
        
        // Configuration
        this.config = {
            minSize: 20,
            maxSize: 80,
            minDuration: 10,
            maxDuration: 25,
            colors: [
                'rgba(99, 102, 241, 0.15)',   // Primary purple
                'rgba(6, 182, 212, 0.15)',    // Cyan
                'rgba(244, 114, 182, 0.12)',  // Pink
                'rgba(139, 92, 246, 0.12)',   // Violet
                'rgba(59, 130, 246, 0.12)'    // Blue
            ]
        };
    }
    
    /**
     * Initialize the bubble animation system
     */
    init() {
        if (!this.container) {
            console.warn('AI Bubble container not found');
            return;
        }
        
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Reduced motion preference detected - bubbles disabled');
            return;
        }
        
        this.isRunning = true;
        this.createInitialBubbles();
        this.startContinuousGeneration();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        console.log('AI Bubbles initialized');
    }
    
    /**
     * Create initial set of bubbles
     */
    createInitialBubbles() {
        const initialCount = Math.floor(this.maxBubbles * 0.6);
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                this.createBubble(true);
            }, i * 200);
        }
    }
    
    /**
     * Start continuous bubble generation
     */
    startContinuousGeneration() {
        this.generationInterval = setInterval(() => {
            if (this.isRunning && this.bubbles.length < this.maxBubbles) {
                this.createBubble();
            }
        }, 2000);
    }
    
    /**
     * Create a single bubble
     * @param {boolean} randomStartPosition - Start from random position instead of bottom
     */
    createBubble(randomStartPosition = false) {
        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble';
        
        // Random properties
        const size = this.randomRange(this.config.minSize, this.config.maxSize);
        const duration = this.randomRange(this.config.minDuration, this.config.maxDuration);
        const delay = randomStartPosition ? this.randomRange(0, 5) : 0;
        const startX = this.randomRange(5, 95);
        const opacity = this.randomRange(0.3, 0.7);
        const scale = this.randomRange(0.8, 1.2);
        
        // Random color
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        
        // Apply styles
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            bottom: ${randomStartPosition ? this.randomRange(-50, 50) + '%' : '-100px'};
            background: radial-gradient(circle at 30% 30%, ${color}, transparent 70%);
            --duration: ${duration}s;
            --delay: ${delay}s;
            --opacity: ${opacity};
            --scale: ${scale};
        `;
        
        // Add to container
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // Remove bubble after animation completes
        const totalDuration = (duration + delay) * 1000;
        setTimeout(() => {
            this.removeBubble(bubble);
        }, totalDuration);
    }
    
    /**
     * Remove a bubble from the DOM and tracking array
     */
    removeBubble(bubble) {
        const index = this.bubbles.indexOf(bubble);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }
    
    /**
     * Pause bubble generation
     */
    pause() {
        this.isRunning = false;
        if (this.generationInterval) {
            clearInterval(this.generationInterval);
        }
    }
    
    /**
     * Resume bubble generation
     */
    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startContinuousGeneration();
        }
    }
    
    /**
     * Stop and cleanup all bubbles
     */
    destroy() {
        this.pause();
        this.bubbles.forEach(bubble => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        });
        this.bubbles = [];
    }
    
    /**
     * Generate random number in range
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const aiBubbles = new AIBubbles();
    aiBubbles.init();
    
    // Make instance available globally if needed
    window.aiBubbles = aiBubbles;
});
