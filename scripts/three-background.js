/**
 * Three.js Background - Code Syntax Institut
 * 3D Particle animation background using Three.js
 */

class ParticleBackground {
    constructor(canvasId = 'bgCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = false;
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: 2000,
            particleSize: 2,
            particleColor: 0x6366f1,
            connectionDistance: 100,
            cameraZ: 1000,
            rotationSpeed: 0.0003,
            mouseInfluence: 0.00005
        };
    }
    
    /**
     * Initialize the Three.js scene
     */
    async init() {
        if (!this.canvas) {
            console.warn('Canvas element not found');
            return;
        }
        
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Reduced motion preference detected - 3D background disabled');
            this.createFallbackBackground();
            return;
        }
        
        // Dynamically import Three.js from CDN
        try {
            await this.loadThreeJS();
            this.setupScene();
            this.createParticles();
            this.setupEventListeners();
            this.isRunning = true;
            this.animate();
            console.log('Three.js particle background initialized');
        } catch (error) {
            console.warn('Three.js not available, using fallback background:', error.message);
            this.createFallbackBackground();
        }
    }
    
    /**
     * Load Three.js from CDN
     */
    loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (window.THREE) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Three.js'));
            document.head.appendChild(script);
        });
    }
    
    /**
     * Setup the Three.js scene
     */
    setupScene() {
        const THREE = window.THREE;
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            2000
        );
        this.camera.position.z = this.config.cameraZ;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }
    
    /**
     * Create particle system
     */
    createParticles() {
        const THREE = window.THREE;
        
        // Create geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.particleCount * 3);
        const colors = new Float32Array(this.config.particleCount * 3);
        
        // Define color palette
        const colorPalette = [
            new THREE.Color(0x6366f1), // Primary purple
            new THREE.Color(0x06b6d4), // Cyan
            new THREE.Color(0x818cf8), // Light purple
            new THREE.Color(0xf472b6), // Pink
            new THREE.Color(0x3b82f6)  // Blue
        ];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            const radius = 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create material
        const material = new THREE.PointsMaterial({
            size: this.config.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create points
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Add some ambient geometry for depth
        this.addAmbientShapes();
    }
    
    /**
     * Add ambient geometric shapes for visual interest
     */
    addAmbientShapes() {
        const THREE = window.THREE;
        
        // Create wireframe icosahedron
        const icoGeometry = new THREE.IcosahedronGeometry(200, 1);
        const icoMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        this.icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        this.scene.add(this.icosahedron);
        
        // Create wireframe torus
        const torusGeometry = new THREE.TorusGeometry(300, 50, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.05
        });
        this.torus = new THREE.Mesh(torusGeometry, torusMaterial);
        this.torus.rotation.x = Math.PI / 2;
        this.scene.add(this.torus);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - window.innerWidth / 2);
            this.mouseY = (event.clientY - window.innerHeight / 2);
        }, { passive: true });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        }, { passive: true });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y += this.config.rotationSpeed;
            this.particles.rotation.x += this.config.rotationSpeed * 0.5;
        }
        
        // Rotate ambient shapes
        if (this.icosahedron) {
            this.icosahedron.rotation.y += this.config.rotationSpeed * 2;
            this.icosahedron.rotation.x += this.config.rotationSpeed;
        }
        
        if (this.torus) {
            this.torus.rotation.z += this.config.rotationSpeed * 0.5;
        }
        
        // Mouse influence on camera
        const targetX = this.mouseX * this.config.mouseInfluence;
        const targetY = -this.mouseY * this.config.mouseInfluence;
        
        this.camera.rotation.y += (targetX - this.camera.rotation.y) * 0.05;
        this.camera.rotation.x += (targetY - this.camera.rotation.x) * 0.05;
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Pause animation
     */
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    /**
     * Resume animation
     */
    resume() {
        if (!this.isRunning && this.renderer) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    /**
     * Create fallback CSS background when Three.js is unavailable
     */
    createFallbackBackground() {
        this.canvas.style.background = `
            radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%),
            linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)
        `;
    }
    
    /**
     * Cleanup
     */
    destroy() {
        this.pause();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
        
        if (this.scene) {
            this.scene.clear();
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const particleBackground = new ParticleBackground();
    particleBackground.init();
    
    // Make instance available globally if needed
    window.particleBackground = particleBackground;
});
