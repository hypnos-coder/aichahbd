// js/Rose.js

export function createRose(scene) {
    const roseGroup = new THREE.Group();

    // ── Materials ──────────────────────────────────────────────────────────
    // Three shades of red: dark inner, mid, bright outer
    const matInner = new THREE.MeshPhysicalMaterial({
        color: 0x7a0000, roughness: 0.7, metalness: 0.0,
        clearcoat: 0.4, clearcoatRoughness: 0.35,
        side: THREE.DoubleSide,
    });
    const matMid = new THREE.MeshPhysicalMaterial({
        color: 0xaa0000, roughness: 0.65, metalness: 0.0,
        clearcoat: 0.3, clearcoatRoughness: 0.3,
        side: THREE.DoubleSide,
    });
    const matOuter = new THREE.MeshPhysicalMaterial({
        color: 0xcc1a1a, roughness: 0.6, metalness: 0.0,
        clearcoat: 0.2,
        side: THREE.DoubleSide,
    });
    const stemMat  = new THREE.MeshPhongMaterial({ color: 0x1a5020 });
    const leafMat  = new THREE.MeshPhysicalMaterial({
        color: 0x2d7a2d, roughness: 0.75, metalness: 0.0,
        side: THREE.DoubleSide,
    });
    const sepalMat = new THREE.MeshPhongMaterial({ color: 0x1a5c1a, side: THREE.DoubleSide });
    const stamenMat = new THREE.MeshPhongMaterial({ color: 0xffcc44, emissive: 0x553300 });

    // ── Petal geometry factory ─────────────────────────────────────────────
    // Creates a teardrop shape in the XY plane (base at origin, tip at top)
    function makePetalGeo(w, h) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(-w * 0.55, h * 0.18, -w * 0.55, h * 0.65, 0, h);
        shape.bezierCurveTo( w * 0.55, h * 0.65,  w * 0.55, h * 0.18, 0, 0);
        return new THREE.ShapeGeometry(shape, 14);
    }

    // ── Petal ring helper ──────────────────────────────────────────────────
    // Petals are laid out via a pivot group (Y-axis azimuth) + tilt (X-axis).
    // The result: petal base near stem center, tip fans radially outward.
    function addRing({ count, w, h, tilt, yPos, radialOffset, mat, phaseOffset = 0 }) {
        const geo = makePetalGeo(w, h);
        for (let i = 0; i < count; i++) {
            const azimuth = (i / count) * Math.PI * 2 + phaseOffset;

            const pivot = new THREE.Group();
            pivot.position.y = yPos;
            pivot.rotation.y = azimuth;
            roseGroup.add(pivot);

            const petal = new THREE.Mesh(geo, mat);
            // Tilt outward: positive X-rotation leans petal back → tip spreads away from stem
            petal.rotation.x = tilt;
            petal.position.x = radialOffset;
            pivot.add(petal);
        }
    }

    // ── Bloom: 5 concentric petal layers ──────────────────────────────────
    // Layer 1 – innermost / tightest (bud heart)
    addRing({ count: 5,  w: 0.13, h: 0.30, tilt: 0.10, yPos: 1.52, radialOffset: 0.01, mat: matInner });
    // Layer 2 – inner cup
    addRing({ count: 6,  w: 0.17, h: 0.40, tilt: 0.38, yPos: 1.44, radialOffset: 0.05, mat: matInner, phaseOffset: Math.PI / 6 });
    // Layer 3 – mid cup
    addRing({ count: 7,  w: 0.23, h: 0.50, tilt: 0.65, yPos: 1.32, radialOffset: 0.11, mat: matMid });
    // Layer 4 – outer cup
    addRing({ count: 8,  w: 0.29, h: 0.56, tilt: 0.90, yPos: 1.16, radialOffset: 0.18, mat: matMid,  phaseOffset: Math.PI / 8 });
    // Layer 5 – outermost / most open
    addRing({ count: 10, w: 0.33, h: 0.60, tilt: 1.15, yPos: 0.96, radialOffset: 0.24, mat: matOuter });

    // ── Stamen (tiny golden centre) ────────────────────────────────────────
    const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), stamenMat);
    stamen.position.y = 1.58;
    roseGroup.add(stamen);

    // ── Sepals (green leaflets at bloom base) ──────────────────────────────
    function makeSepalGeo() {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo(-0.045, 0.07, -0.04, 0.22, 0, 0.28);
        s.bezierCurveTo( 0.04,  0.22,  0.045, 0.07, 0, 0);
        return new THREE.ShapeGeometry(s, 8);
    }
    const sepalGeo = makeSepalGeo();
    for (let i = 0; i < 5; i++) {
        const az = (i / 5) * Math.PI * 2;
        const sp = new THREE.Group();
        sp.position.y = 0.9;
        sp.rotation.y = az;
        roseGroup.add(sp);
        const sepal = new THREE.Mesh(sepalGeo, sepalMat);
        sepal.rotation.x = 1.05;   // spread outward
        sepal.position.x = 0.06;
        sp.add(sepal);
    }

    // ── Curved stem ───────────────────────────────────────────────────────
    const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3( 0.00, 0.00,  0.00),
        new THREE.Vector3( 0.09, 0.30,  0.04),
        new THREE.Vector3(-0.06, 0.62, -0.03),
        new THREE.Vector3( 0.04, 0.96,  0.02),
        new THREE.Vector3( 0.00, 1.28,  0.00),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 22, 0.032, 8, false);
    roseGroup.add(new THREE.Mesh(stemGeo, stemMat));

    // ── Leaves ────────────────────────────────────────────────────────────
    function makeLeafGeo(w, h) {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo(-w * 0.6, h * 0.22, -w * 0.55, h * 0.72, 0, h);
        s.bezierCurveTo( w * 0.55, h * 0.72,  w * 0.6, h * 0.22, 0, 0);
        return new THREE.ShapeGeometry(s, 10);
    }
    const leafGeo = makeLeafGeo(0.26, 0.54);

    [
        { yPos: 0.32, xOff: 0.11, rotX: 0.55 },
        { yPos: 0.62, xOff: 0.09, rotX: 0.50 },
    ].forEach(({ yPos, xOff, rotX }) => {
        [-1, 1].forEach(side => {
            const lp = new THREE.Group();
            lp.position.y = yPos;
            lp.rotation.y = side * Math.PI * 0.22;
            roseGroup.add(lp);

            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.rotation.x =  rotX * side;
            leaf.rotation.z =  side * 0.55;
            leaf.position.x =  xOff * side;
            lp.add(leaf);
        });
    });

    // ── Position & physics ─────────────────────────────────────────────────
    roseGroup.position.set(
        (Math.random() - 0.5) * 1.5,
        -1.5,
        (Math.random() - 0.5) * 1.5
    );
    roseGroup.rotation.z = (Math.random() - 0.5) * 0.5;

    roseGroup.userData = {
        speedY:   0.05 + Math.random() * 0.05,
        speedX:   (Math.random() - 0.5) * 0.03,
        speedZ:   (Math.random() - 0.5) * 0.03,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        active:   false,
    };

    scene.add(roseGroup);
    return roseGroup;
}
