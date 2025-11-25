/* =============================================
   AI-BUBBLES.JS - Code Syntax Institut
   KI-Blasen Animationssystem
   ============================================= */

/**
 * AI Bubble Animation Klasse
 * Erzeugt schwebende, glänzende Blasen im Hintergrund
 */
class AIBubbleSystem {
    constructor(options = {}) {
        // Konfiguration
        this.container = document.getElementById('aiBubbleContainer');
        this.maxBubbles = options.maxBubbles || 15;
        this.minSize = options.minSize || 10;
        this.maxSize = options.maxSize || 80;
        this.minDuration = options.minDuration || 8;
        this.maxDuration = options.maxDuration || 15;
        this.spawnInterval = options.spawnInterval || 2000;
        this.colors = options.colors || [
            'rgba(78, 203, 255, 0.3)',
            'rgba(0, 119, 255, 0.25)',
            'rgba(0, 212, 255, 0.2)',
            'rgba(100, 180, 255, 0.25)'
        ];
        
        // Status
        this.bubbles = [];
        this.isRunning = false;
        this.intervalId = null;
        this.animationFrame = null;
        
        // Performance Check
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialisierung
        this.init();
    }
    
    /**
     * System initialisieren
     */
    init() {
        if (!this.container) {
            console.warn('AI Bubble Container nicht gefunden. Erstelle Container...');
            this.createContainer();
        }
        
        // Nicht starten wenn reduzierte Bewegung bevorzugt wird
        if (this.prefersReducedMotion) {
            console.log('Reduzierte Bewegung aktiv - AI Bubbles deaktiviert');
            return;
        }
        
        // Performance-optimierte Initialisierung
        this.start();
        
        // Visibility Change Handler für bessere Performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Resize Handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Container erstellen falls nicht vorhanden
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'aiBubbleContainer';
        document.body.appendChild(this.container);
    }
    
    /**
     * Bubble-System starten
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Initial einige Bubbles erstellen
        for (let i = 0; i < Math.min(5, this.maxBubbles); i++) {
            setTimeout(() => this.createBubble(), i * 500);
        }
        
        // Regelmäßig neue Bubbles erstellen
        this.intervalId = setInterval(() => {
            if (this.bubbles.length < this.maxBubbles) {
                this.createBubble();
            }
        }, this.spawnInterval);
    }
    
    /**
     * System pausieren
     */
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    /**
     * System fortsetzen
     */
    resume() {
        if (!this.prefersReducedMotion) {
            this.start();
        }
    }
    
    /**
     * System stoppen und aufräumen
     */
    stop() {
        this.pause();
        this.bubbles.forEach(bubble => bubble.element.remove());
        this.bubbles = [];
    }
    
    /**
     * Einzelne Bubble erstellen
     */
    createBubble() {
        if (!this.container || !this.isRunning) return;
        
        // Zufällige Eigenschaften
        const size = this.randomRange(this.minSize, this.maxSize);
        const duration = this.randomRange(this.minDuration, this.maxDuration);
        const startX = this.randomRange(0, 100);
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const variant = Math.random() > 0.5 ? 'glass' : 'glow';
        
        // Bubble-Element erstellen
        const bubble = document.createElement('div');
        bubble.className = `ai-bubble ${variant}`;
        
        // Styles anwenden
        Object.assign(bubble.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${startX}%`,
            bottom: '-10%',
            background: variant === 'glow' 
                ? `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`
                : `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${color})`,
            animationDuration: `${duration}s`,
            animationDelay: `${Math.random() * 2}s`
        });
        
        // Zur Container hinzufügen
        this.container.appendChild(bubble);
        
        // Bubble-Objekt speichern
        const bubbleObj = {
            element: bubble,
            createdAt: Date.now(),
            duration: duration * 1000
        };
        this.bubbles.push(bubbleObj);
        
        // Bubble nach Animation entfernen
        setTimeout(() => {
            this.removeBubble(bubbleObj);
        }, duration * 1000 + 2000);
    }
    
    /**
     * Bubble entfernen
     */
    removeBubble(bubbleObj) {
        const index = this.bubbles.indexOf(bubbleObj);
        if (index > -1) {
            this.bubbles.splice(index, 1);
            if (bubbleObj.element && bubbleObj.element.parentNode) {
                bubbleObj.element.remove();
            }
        }
    }
    
    /**
     * Resize Handler
     */
    handleResize() {
        // Bei kleinen Bildschirmen weniger Bubbles
        const isMobile = window.innerWidth < 768;
        this.maxBubbles = isMobile ? 8 : 15;
        
        // Überschüssige Bubbles entfernen
        while (this.bubbles.length > this.maxBubbles) {
            const bubble = this.bubbles.pop();
            if (bubble && bubble.element) {
                bubble.element.remove();
            }
        }
    }
    
    /**
     * Zufällige Zahl im Bereich
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// System automatisch starten wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
    // Kurze Verzögerung für bessere Ladeperformance
    setTimeout(() => {
        window.aiBubbleSystem = new AIBubbleSystem({
            maxBubbles: 12,
            minSize: 15,
            maxSize: 60,
            minDuration: 10,
            maxDuration: 18,
            spawnInterval: 2500
        });
    }, 500);
});
