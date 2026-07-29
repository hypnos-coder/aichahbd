// js/SceneSetup.js

export function initScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 10); // Slightly further back for the heart
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Lighting adjusted for Lavender/Purple theme
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xffffff, 1);
    spot.position.set(5, 10, 5);
    spot.castShadow = true;
    scene.add(spot);

    // Pink/Lavender light inside the box
    const innerLight = new THREE.PointLight(0xe0b0ff, 0, 10); // Start with 0 intensity
    innerLight.position.set(0, 1.5, 0);
    scene.add(innerLight);

    // Bloom Setup
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.2; // Only bright things glow
    bloomPass.strength = 1.0; 
    bloomPass.radius = 0.5;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Particles
    const particles = createParticleSystem(scene);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, composer, innerLight, particles };
}

function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Draw heart
    ctx.beginPath();
    ctx.moveTo(32, 18);
    ctx.bezierCurveTo(32, 14, 28, 5, 16, 5);
    ctx.bezierCurveTo(0, 5, 0, 25, 0, 25);
    ctx.bezierCurveTo(0, 39, 16, 52, 32, 60);
    ctx.bezierCurveTo(48, 52, 64, 39, 64, 25);
    ctx.bezierCurveTo(64, 25, 64, 5, 48, 5);
    ctx.bezierCurveTo(36, 5, 32, 14, 32, 18);
    ctx.fillStyle = '#ffffff'; // White so material color tints it perfectly
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createParticleSystem(scene) {
    const geo = new THREE.BufferGeometry();
    const count = 300; // Adjusted count for bigger particles
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count*3; i++) pos[i] = (Math.random() - 0.5) * 20;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    // Lavender/Gold particles
    const mat = new THREE.PointsMaterial({ 
        color: 0xe0b0ff, 
        size: 0.6, 
        map: createHeartTexture(),
        transparent: true, 
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    return particles;
}
