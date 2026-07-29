// js/Confetti.js

export function createConfettiBurst(scene) {
    const confettiCount = 150;
    const geometry = new THREE.PlaneGeometry(0.15, 0.15);
    
    // Mix of gold, deep orchid, and lavender
    const colors = [0xffd700, 0xba87d1, 0x9b4f9b, 0xe0b0ff];
    const materials = colors.map(c => new THREE.MeshPhongMaterial({ 
        color: c, 
        side: THREE.DoubleSide,
        shininess: 100
    }));
    
    const confettiList = [];
    
    for(let i=0; i<confettiCount; i++) {
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, mat);
        
        mesh.position.set(0, 0, 0); // Start at center
        
        // Random velocity outwards and upwards
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.5; // Upper hemisphere
        const speed = 0.1 + Math.random() * 0.3;
        
        mesh.userData = {
            velocity: new THREE.Vector3(
                speed * Math.sin(phi) * Math.cos(theta),
                speed * Math.cos(phi) + 0.15, // extra upward push
                speed * Math.sin(phi) * Math.sin(theta)
            ),
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4
            )
        };
        
        scene.add(mesh);
        confettiList.push(mesh);
    }
    
    return confettiList;
}

export function updateConfetti(confettiList) {
    confettiList.forEach(c => {
        // Stop updating if it falls way below the scene
        if (c.position.y < -15) return;

        c.position.add(c.userData.velocity);
        c.rotation.x += c.userData.rotSpeed.x;
        c.rotation.y += c.userData.rotSpeed.y;
        c.rotation.z += c.userData.rotSpeed.z;
        
        // Gravity
        c.userData.velocity.y -= 0.008;
        
        // Air resistance (drag)
        c.userData.velocity.x *= 0.98;
        c.userData.velocity.z *= 0.98;
    });
}
