// three-background.js - Handles the futuristic particle network background

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 100;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.particlesCount = window.innerWidth < 768 ? 400 : 800;
        this.initParticles();
        
        this.clock = new THREE.Clock();
        
        this.mouseX = 0;
        this.posY = 0;

        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        this.animate();
    }

    initParticles() {
        const positions = new Float32Array(this.particlesCount * 3);
        const colors = new Float32Array(this.particlesCount * 3);

        const colorPink = new THREE.Color('#ff007f');
        const colorCyan = new THREE.Color('#00f0ff');
        const colorPurple = new THREE.Color('#9834ff');

        for(let i = 0; i < this.particlesCount * 3; i+=3) {
            positions[i] = (Math.random() - 0.5) * 400; // x
            positions[i+1] = (Math.random() - 0.5) * 400; // y
            positions[i+2] = (Math.random() - 0.5) * 200; // z

            // Mix colors
            const mixRatio = Math.random();
            let finalColor;
            if (mixRatio < 0.33) {
                finalColor = colorPink;
            } else if (mixRatio < 0.66) {
                finalColor = colorCyan;
            } else {
                finalColor = colorPurple;
            }

            colors[i] = finalColor.r;
            colors[i+1] = finalColor.g;
            colors[i+2] = finalColor.b;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a circular particle texture programmatically
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 16);
        const texture = new THREE.CanvasTexture(canvas);

        this.material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            map: texture,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.posY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        // Slow rotation
        this.points.rotation.y = elapsedTime * 0.05;
        this.points.rotation.x = elapsedTime * 0.02;

        // Mouse parallax
        this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.posY * 10 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('three-canvas');
});
