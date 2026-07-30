// js/PhotoSprite.js
// Photo images pop out from the heart box center, travel to sparse outer perimeter slots,
// and float dynamically with organic sway & subtle rotation, keeping the center clear.

const IMAGE_PATHS = [
    'assets/IMG-20260730-WA0002.jpg',
    'assets/IMG-20260730-WA0003.jpg',
    'assets/IMG-20260730-WA0004.jpg',
    'assets/IMG-20260730-WA0005.jpg',
    'assets/IMG-20260730-WA0007.jpg',
    'assets/IMG-20260730-WA0008.jpg',
    'assets/IMG-20260730-WA0009.jpg',
    'assets/IMG-20260730-WA0010.jpg',
];

// 8 sparse perimeter slots around outer edges (leaving central region completely clear)
const PERIMETER_SLOTS = [
    { x: 12, y: 16, rot: -5 }, // Top-Left
    { x: 88, y: 16, rot: 6 },  // Top-Right
    { x: 9,  y: 45, rot: 4 },  // Mid-Left
    { x: 91, y: 45, rot: -6 }, // Mid-Right
    { x: 12, y: 74, rot: -7 }, // Lower-Left
    { x: 88, y: 74, rot: 5 },  // Lower-Right
    { x: 22, y: 88, rot: 3 },  // Bottom-Left-Center
    { x: 78, y: 88, rot: -4 }, // Bottom-Right-Center
];

let container = null;

function getContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.id = 'photo-overlay';
    Object.assign(container.style, {
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        zIndex: '15',
        overflow: 'hidden',
    });
    document.body.appendChild(container);
    return container;
}

/**
 * Spawn all photo cards popping out from gift box center to perimeter slots.
 */
export function spawnPhotos() {
    const c = getContainer();
    c.innerHTML = ''; // Reset container if re-triggered

    IMAGE_PATHS.forEach((path, i) => {
        setTimeout(() => {
            spawnOne(c, path, i);
        }, i * 380); // Staggered pop-outs (gentler sequence)
    });
}

function getResponsiveConfig() {
    const w = window.innerWidth;
    if (w <= 480) {
        return { size: 75, maxHeight: 90, ampMult: 0.35 };
    } else if (w <= 768) {
        return { size: 95, maxHeight: 115, ampMult: 0.55 };
    }
    return { size: 135, maxHeight: 160, ampMult: 1.0 };
}

function spawnOne(container, path, index) {
    const slot = PERIMETER_SLOTS[index % PERIMETER_SLOTS.length];
    const cfg  = getResponsiveConfig();

    const wrapper = document.createElement('div');
    
    // Start collapsed right at the heart box location (center-screen)
    Object.assign(wrapper.style, {
        position: 'absolute',
        left: '50%',
        top: '55%',
        width: `${cfg.size}px`,
        transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
        transformOrigin: 'center center',
        transition: 'left 2.2s cubic-bezier(0.2, 0.9, 0.3, 1), top 2.2s cubic-bezier(0.2, 0.9, 0.3, 1), transform 2.2s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 1.0s ease-out',
        opacity: '0',
        willChange: 'transform, left, top',
    });

    const img = document.createElement('img');
    img.src = path;
    Object.assign(img.style, {
        width: '100%',
        height: 'auto',
        maxHeight: `${cfg.maxHeight}px`,
        objectFit: 'cover',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 0 12px rgba(170,196,255,0.35)',
        display: 'block',
        border: '1.5px solid rgba(170,196,255,0.3)',
        background: 'rgba(5, 13, 46, 0.8)',
    });

    wrapper.appendChild(img);
    container.appendChild(wrapper);

    // Pop out to perimeter target slot
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wrapper.style.left = `${slot.x}%`;
            wrapper.style.top = `${slot.y}%`;
            wrapper.style.transform = `translate(-50%, -50%) scale(1) rotate(${slot.rot}deg)`;
            wrapper.style.opacity = '1';

            // Once pop-in movement completes, hand off to dynamic continuous floating loop
            setTimeout(() => {
                // Clear initial CSS transitions so JS rAF smooth motion takes over cleanly
                wrapper.style.transition = 'none';
                startDynamicFloat(wrapper, slot, index, cfg.ampMult);
            }, 2300);
        });
    });
}

/**
 * Dynamic floating animation loop.
 * Creates smooth organic figure-8 / dual-sine wave swaying with subtle tilt and breathing scale.
 */
function startDynamicFloat(wrapper, slot, index, ampMult = 1.0) {
    const baseRot  = slot.rot;
    const ampX     = (25 + (index % 3) * 8) * ampMult;  // Scaled horizontal sway range
    const ampY     = (20 + (index % 4) * 6) * ampMult;  // Scaled vertical sway range
    const rotAmp   = 4 + (index % 3) * 2;              // 4deg - 8deg rotation tilt amplitude
    
    // Unique speed & phase per card for asynchronous organic movement
    const speedX   = 0.0007 + (index * 0.00013);
    const speedY   = 0.0009 + (index * 0.00011);
    const speedRot = 0.0006 + (index * 0.00014);
    
    const phaseX   = index * 1.1;
    const phaseY   = index * 1.7;
    const phaseRot = index * 0.9;

    let start = null;

    function frame(ts) {
        if (!start) start = ts;
        const t = ts - start;

        const dx   = Math.sin(t * speedX + phaseX) * ampX;
        const dy   = Math.sin(t * speedY + phaseY) * ampY;
        const tilt = baseRot + Math.sin(t * speedRot + phaseRot) * rotAmp;
        const scale = 1 + Math.sin(t * 0.0008 + phaseX) * 0.03;

        wrapper.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale}) rotate(${tilt}deg)`;
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

/**
 * No-op update for compatibility with main.js loop.
 */
export function updatePhotoSprites() {}
