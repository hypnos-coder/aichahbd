// js/Rose.js

export function createRose(scene) {
    const roseGroup = new THREE.Group();
    
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const stemMat = new THREE.MeshPhongMaterial({ color: 0x1e3d1e }); // Dark Green
    const stem = new THREE.Mesh(stemGeo, stemMat);
    roseGroup.add(stem);

    // Bloom (Lavender Rose)
    const bloomGroup = new THREE.Group();
    const petalMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xba87d1, 
        metalness: 0.1, 
        roughness: 0.8,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
    }); 
    
    for(let i=0; i<6; i++) {
        const petalGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.scale.set(1, 0.5, 1);
        petal.position.y = 1.5;
        petal.position.x = Math.sin(i * Math.PI/3) * 0.2;
        petal.position.z = Math.cos(i * Math.PI/3) * 0.2;
        petal.rotation.y = i;
        bloomGroup.add(petal);
    }
    
    // Center
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), petalMat);
    center.position.y = 1.6;
    bloomGroup.add(center);

    roseGroup.add(bloomGroup);
    
    // Random start inside the heart box
    roseGroup.position.set(
        (Math.random() - 0.5) * 1.5,
        -1.5,
        (Math.random() - 0.5) * 1.5
    );
    roseGroup.rotation.z = (Math.random() - 0.5) * 0.5;
    
    // Dynamic physics data
    roseGroup.userData = { 
        speedY: 0.05 + Math.random() * 0.05,
        speedX: (Math.random() - 0.5) * 0.03,
        speedZ: (Math.random() - 0.5) * 0.03,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        active: false
    };
    
    scene.add(roseGroup);
    return roseGroup;
}
