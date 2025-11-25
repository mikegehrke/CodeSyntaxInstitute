/* =============================================
   THREE-BACKGROUND.JS - Code Syntax Institut
   3D Partikel-Hintergrund mit Three.js
   ============================================= */

/**
 * 3D Background Klasse
 * Erstellt einen animierten Partikel-Hintergrund mit Three.js
 */
class ThreeBackground {
    constructor() {
        // Canvas-Element
        this.canvas = document.getElementById('bgCanvas');
        if (!this.canvas) {
            console.warn('Canvas Element nicht gefunden');
            return;
        }
        
        // Konfiguration
        this.particleCount = 800;
        this.particleSize = 2;
        this.rotationSpeed = 0.0003;
        this.mouseInfluence = 0.00005;
        
        // Status
        this.isInitialized = false;
        this.isAnimating = false;
        this.animationFrame = null;
        
        // Three.js Objekte
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.clock = null;
        
        // Mausposition
        this.mouse = { x: 0, y: 0 };
        
        // Performance Check
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Three.js laden und initialisieren
        this.loadThree();
    }
    
    /**
     * Three.js dynamisch laden
     */
    async loadThree() {
        // Prüfen ob Three.js bereits geladen ist
        if (window.THREE) {
            this.init();
            return;
        }
        
        try {
            // Three.js von CDN laden
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            this.init();
        } catch (error) {
            console.warn('Three.js konnte nicht geladen werden:', error);
            // Fallback: CSS-Hintergrund verwenden
            this.createFallbackBackground();
        }
    }
    
    /**
     * Script dynamisch laden
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Prüfen ob Script bereits existiert
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Three.js Szene initialisieren
     */
    init() {
        if (this.isInitialized || !window.THREE) return;
        
        try {
            // Szene erstellen
            this.scene = new THREE.Scene();
            
            // Kamera einrichten
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            this.camera.position.z = 50;
            
            // Renderer konfigurieren
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: false, // Performance
                powerPreference: 'low-power'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);
            
            // Clock für Animation
            this.clock = new THREE.Clock();
            
            // Partikel erstellen
            this.createParticles();
            
            // Event-Listener
            window.addEventListener('resize', this.handleResize.bind(this));
            window.addEventListener('mousemove', this.handleMouseMove.bind(this));
            
            // Visibility Change für Performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });
            
            this.isInitialized = true;
            
            // Animation starten
            if (!this.prefersReducedMotion) {
                this.animate();
            } else {
                // Einmal rendern ohne Animation
                this.renderer.render(this.scene, this.camera);
            }
            
        } catch (error) {
            console.warn('Fehler bei Three.js Initialisierung:', error);
            this.createFallbackBackground();
        }
    }
    
    /**
     * Partikel-System erstellen
     */
    createParticles() {
        // Geometrie erstellen
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        // Partikel-Positionen und Farben
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Zufällige Position in Kugelform
            const radius = 30 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Farben (Blautöne)
            const colorChoice = Math.random();
            if (colorChoice < 0.5) {
                // Cyan
                colors[i3] = 0.31;     // R
                colors[i3 + 1] = 0.8;  // G
                colors[i3 + 2] = 1.0;  // B
            } else if (colorChoice < 0.8) {
                // Blau
                colors[i3] = 0.0;
                colors[i3 + 1] = 0.47;
                colors[i3 + 2] = 1.0;
            } else {
                // Weiß
                colors[i3] = 1.0;
                colors[i3 + 1] = 1.0;
                colors[i3 + 2] = 1.0;
            }
            
            // Zufällige Größen
            sizes[i] = Math.random() * this.particleSize + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Material erstellen
        const material = new THREE.PointsMaterial({
            size: this.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Partikel-System erstellen
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    /**
     * Animation-Loop
     */
    animate() {
        if (!this.isAnimating && this.isInitialized) {
            this.isAnimating = true;
        }
        
        if (!this.isAnimating) return;
        
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        
        // Delta-Zeit für gleichmäßige Animation
        const delta = this.clock.getDelta();
        
        // Partikel rotieren
        if (this.particles) {
            this.particles.rotation.x += this.rotationSpeed;
            this.particles.rotation.y += this.rotationSpeed * 0.5;
            
            // Mauseinfluss
            this.particles.rotation.x += this.mouse.y * this.mouseInfluence;
            this.particles.rotation.y += this.mouse.x * this.mouseInfluence;
        }
        
        // Szene rendern
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Animation pausieren
     */
    pause() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Animation fortsetzen
     */
    resume() {
        if (!this.prefersReducedMotion && this.isInitialized && !this.isAnimating) {
            this.animate();
        }
    }
    
    /**
     * Fenster-Größenänderung behandeln
     */
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Mausbewegung behandeln
     */
    handleMouseMove(event) {
        // Normalisierte Mausposition (-1 bis 1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    /**
     * Fallback-Hintergrund wenn Three.js nicht verfügbar
     */
    createFallbackBackground() {
        if (this.canvas) {
            this.canvas.style.background = `
                radial-gradient(circle at 20% 80%, rgba(78, 203, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 119, 255, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 60%)
            `;
        }
    }
    
    /**
     * Ressourcen freigeben
     */
    dispose() {
        this.pause();
        
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            this.scene.remove(this.particles);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('mousemove', this.handleMouseMove);
    }
}

// Hintergrund initialisieren wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
    // Kurze Verzögerung für bessere Ladeperformance
    setTimeout(() => {
        window.threeBackground = new ThreeBackground();
    }, 100);
});
