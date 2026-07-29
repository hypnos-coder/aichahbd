// js/HeartBox.js

export function createHeartBox(scene) {
    const heartGroup = new THREE.Group();

    const shape = new THREE.Shape();
    const x = 0, y = 0;

    // Standard Heart Shape
    shape.moveTo( x + 2.5, y + 2.5 );
    shape.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
    shape.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5,x - 3.0,y + 3.5 );
    shape.bezierCurveTo( x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5 );
    shape.bezierCurveTo( x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
    shape.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
    shape.bezierCurveTo( x + 3.0, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

    // Deep Purple/Velvet color for the heart box
    const material = new THREE.MeshPhongMaterial({ color: 0x4a0e4a, shininess: 30 }); 
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });

    // Base Extrusion
    const extrudeSettingsBase = { depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const geometryBase = new THREE.ExtrudeGeometry( shape, extrudeSettingsBase );
    centerGeometry(geometryBase);
    const base = new THREE.Mesh(geometryBase, material);

    // Lid Extrusion
    const extrudeSettingsLid = { depth: 0.5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const geometryLid = new THREE.ExtrudeGeometry( shape, extrudeSettingsLid );
    centerGeometry(geometryLid);
    const lid = new THREE.Mesh(geometryLid, material);
    
    // Scale and position
    base.scale.set(0.3, 0.3, 0.3);
    lid.scale.set(0.31, 0.31, 0.31); // Slightly larger lid
    
    // The heart is drawn upside down in Three.js coordinates, let's rotate it
    base.rotation.x = Math.PI;
    lid.rotation.x = Math.PI;

    // Position lid above the base
    lid.position.z = -0.5; // Since we rotated X by PI, Z is flipped

    // Add ribbons
    // Ribbon wrap around base
    const baseRibbonGeo = new THREE.BoxGeometry(3.5, 3.5, 0.1);
    const baseRibbon = new THREE.Mesh(baseRibbonGeo, ribbonMat);
    baseRibbon.position.z = -0.75;
    // We attach the ribbon to the base group if needed, but simplest is just adding to the base mesh
    base.add(baseRibbon);

    // Ribbon on lid
    const lidRibbonGeo = new THREE.BoxGeometry(3.6, 3.6, 0.1);
    const lidRibbon = new THREE.Mesh(lidRibbonGeo, ribbonMat);
    lidRibbon.position.z = -0.25;
    lid.add(lidRibbon);

    heartGroup.add(base);
    heartGroup.add(lid);
    
    // Overall group rotation to show it to camera nicely
    heartGroup.rotation.x = -Math.PI / 4; 
    heartGroup.position.y = -1; // Center it

    scene.add(heartGroup);

    return { heartGroup, base, lid };
}

function centerGeometry(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const offset = new THREE.Vector3().addVectors(box.max, box.min).multiplyScalar(-0.5);
    geometry.translate(offset.x, offset.y, offset.z);
}
