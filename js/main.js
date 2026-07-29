// js/main.js
import { initScene } from './SceneSetup.js';
import { createGiftBox } from './GiftBox.js';
import { createRose } from './Rose.js';
import { createConfettiBurst, updateConfetti } from './Confetti.js';

let scene, camera, renderer, composer, innerLight, particles;
let giftBoxGroup, lid, boxMeshes, baseRibbons;
let roses = [];
let confettiList = [];
let isOpened = false;
let clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let controls;

function init() {
    const setup = initScene();
    scene = setup.scene;
    camera = setup.camera;
    renderer = setup.renderer;
    composer = setup.composer; // Now using the composer for Bloom
    innerLight = setup.innerLight;
    particles = setup.particles;

    // Initialize OrbitControls
    if (window.THREE && THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 + 0.1; // Restrict below ground
        controls.minDistance = 5;
        controls.maxDistance = 20;
    }

    const giftBoxObj = createGiftBox(scene);
    giftBoxGroup = giftBoxObj.giftBox;
    lid = giftBoxObj.lid;
    boxMeshes = giftBoxObj.allMeshes;
    baseRibbons = giftBoxObj.baseRibbons;

    // Initial fade in
    setTimeout(() => {
        document.getElementById('topTitle').style.opacity = '1';
    }, 500);

    // Click on the label still works as a fallback
    document.getElementById('interactionHint').addEventListener('click', openGift);

    // Click anywhere on the canvas
    renderer.domElement.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(boxMeshes);
        if (hits.length > 0) openGift();
    });

    animate();
}

function startTextSequence() {
    const seq1 = document.getElementById('seq1');
    const seq2 = document.getElementById('seq2');
    const seq3 = document.getElementById('seq3');

    // Show Seq 1
    seq1.classList.add('seq-in');
    
    // After 3.5 seconds, fade out seq 1 and show seq 2
    setTimeout(() => {
        seq1.classList.remove('seq-in');
        seq1.classList.add('seq-out');
        
        seq2.classList.add('seq-in');
    }, 3500);

    // After 7 seconds, fade out seq 2 and show seq 3
    setTimeout(() => {
        seq2.classList.remove('seq-in');
        seq2.classList.add('seq-out');
        
        seq3.classList.add('seq-in');
    }, 7000);
}

function openGift() {
    if (isOpened) return;
    isOpened = true;
    
    document.getElementById('interactionHint').style.display = 'none';
    const messageBox = document.getElementById('message-box');
    messageBox.style.display = 'block';
    
    // Start the text sequence
    startTextSequence();

    // Try playing audio (may fail if files don't exist yet)
    const bgm = document.getElementById('bgm');
    const popSound = document.getElementById('popSound');
    if (bgm) bgm.play().catch(e => console.log('BGM playback failed:', e));
    if (popSound) popSound.play().catch(e => console.log('Pop sound playback failed:', e));

    // Disable OrbitControls to smoothly animate camera
    if (controls) controls.enabled = false;

    // Hide the base ribbons so there's no residue inside the open box
    baseRibbons.forEach(r => { r.visible = false; });

    // Trigger Confetti Burst
    confettiList = createConfettiBurst(scene);

    // Create premium lavender roses
    for(let i=0; i<20; i++) {
        roses.push(createRose(scene));
    }
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    if (controls && controls.enabled) {
        controls.update();
    }

    // Hover effect for box
    if (!isOpened) {
        giftBoxGroup.position.y = Math.sin(time) * 0.2 - 1; // centered at -1
        giftBoxGroup.rotation.y += 0.005; // Gentle rotation
    } else {
        // Lid flies completely off the screen
        lid.position.y += 0.2;
        lid.position.x += 0.05;
        lid.rotation.x += 0.06;
        lid.rotation.z += 0.025;

        // Increase inner light intensity dramatically
        if (innerLight.intensity < 5) {
            innerLight.intensity += 0.1;
        }

        // Cinematic Camera: slowly interpolate to a fixed wide angle
        camera.position.lerp(new THREE.Vector3(0, 5, 14), 0.015);
        camera.lookAt(0, 1, 0);

        // Roses popping out
        roses.forEach(rose => {
            rose.position.y += rose.userData.speedY;
            rose.position.x += rose.userData.speedX;
            rose.position.z += rose.userData.speedZ;
            rose.rotation.y += rose.userData.rotSpeed;
            
            // Gentle swaying
            rose.position.x += Math.sin(time + rose.position.y) * 0.01;
        });

        // Update Confetti physics
        updateConfetti(confettiList);
    }

    // Particle movement (floating hearts)
    particles.rotation.y += 0.001;
    particles.position.y -= 0.005;
    if (particles.position.y < -5) particles.position.y = 5;

    // Use Composer for Bloom!
    composer.render();
}

window.onload = init;
