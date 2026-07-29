// js/GiftBox.js

export function createGiftBox(scene) {
    const giftBox = new THREE.Group();

    // Deep Velvet Red / Purple
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x4a0e4a, shininess: 10 });
    // Deep orchid/mauve — blends with the lavender/purple scene palette
    const ribbonMat = new THREE.MeshPhongMaterial({ color: 0x9b4f9b, specular: 0xd7aaff, shininess: 120 });

    // Base - Hollow box (5 pieces instead of a solid cube)
    const baseGroup = new THREE.Group();
    
    // Bottom
    const bottomGeo = new THREE.BoxGeometry(3, 0.1, 3);
    const bottom = new THREE.Mesh(bottomGeo, baseMat);
    bottom.position.y = -1.2;
    baseGroup.add(bottom);
    
    // Front
    const frontGeo = new THREE.BoxGeometry(3, 2.5, 0.1);
    const front = new THREE.Mesh(frontGeo, baseMat);
    front.position.z = 1.45;
    baseGroup.add(front);
    
    // Back
    const backGeo = new THREE.BoxGeometry(3, 2.5, 0.1);
    const back = new THREE.Mesh(backGeo, baseMat);
    back.position.z = -1.45;
    baseGroup.add(back);
    
    // Left
    const leftGeo = new THREE.BoxGeometry(0.1, 2.5, 3);
    const left = new THREE.Mesh(leftGeo, baseMat);
    left.position.x = -1.45;
    baseGroup.add(left);
    
    // Right
    const rightGeo = new THREE.BoxGeometry(0.1, 2.5, 3);
    const right = new THREE.Mesh(rightGeo, baseMat);
    right.position.x = 1.45;
    baseGroup.add(right);

    giftBox.add(baseGroup);

    // Lid (Solid top)
    const lidGeo = new THREE.BoxGeometry(3.2, 0.6, 3.2);
    const lid = new THREE.Mesh(lidGeo, baseMat);
    lid.position.y = 1.5;
    giftBox.add(lid);

    // Ribbons (kept on base group — we'll hide them when box opens)
    const hRibbonGeo = new THREE.BoxGeometry(3.05, 0.3, 3.3);
    const hRibbon = new THREE.Mesh(hRibbonGeo, ribbonMat);
    hRibbon.position.y = 0;
    giftBox.add(hRibbon);

    const vRibbonGeo = new THREE.BoxGeometry(3.3, 2.5, 0.3);
    const vRibbon = new THREE.Mesh(vRibbonGeo, ribbonMat);
    giftBox.add(vRibbon);

    const baseRibbons = [hRibbon, vRibbon];

    // Bow
    const bowGroup = new THREE.Group();
    const bowGeo = new THREE.TorusGeometry(0.4, 0.1, 8, 20);
    const bowL = new THREE.Mesh(bowGeo, ribbonMat);
    bowL.rotation.y = Math.PI / 2;
    bowL.position.x = -0.3;
    const bowR = new THREE.Mesh(bowGeo, ribbonMat);
    bowR.rotation.y = Math.PI / 2;
    bowR.position.x = 0.3;
    bowGroup.add(bowL, bowR);
    bowGroup.position.y = 1.8;
    lid.add(bowGroup);

    // Collect every mesh that belongs to the box so raycaster can detect clicks
    const allMeshes = [];
    giftBox.traverse(obj => { if (obj.isMesh) allMeshes.push(obj); });

    scene.add(giftBox);
    return { giftBox, lid, allMeshes, baseRibbons };
}
