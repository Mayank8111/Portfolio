import * as THREE from "three";

// ======================================================
// VOID RELIC — ORIGINAL ALIEN MECHANICAL ARTIFACT
// ======================================================

const stage = document.getElementById("artifact-canvas");
const caption = document.getElementById("artifact-caption");
const terminalLine = document.getElementById("terminal-line");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");

if (!stage) {
    throw new Error("Artifact stage not found.");
}

// ------------------------------------------------------
// SCENE
// ------------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color("#080d0a");

const camera = new THREE.PerspectiveCamera(
    38,
    stage.clientWidth / stage.clientHeight,
    0.1,
    100
);

camera.position.set(4.8, 3.1, 6.8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

stage.appendChild(renderer.domElement);

// ------------------------------------------------------
// LIGHTING
// ------------------------------------------------------

scene.add(new THREE.AmbientLight("#c1d0c4", 2.2));

const keyLight = new THREE.DirectionalLight("#e4f5e8", 4.5);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight("#91aa99", 3);
fillLight.position.set(-4, 1, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight("#48b96a", 2.5);
rimLight.position.set(-5, 2, -4);
scene.add(rimLight);

const coreLight = new THREE.PointLight("#4cff78", 8, 7);
coreLight.position.set(0, 0, 0);
scene.add(coreLight);

// ------------------------------------------------------
// ARTIFACT ROOT
// ------------------------------------------------------

const artifact = new THREE.Group();
scene.add(artifact);

const relicBody = new THREE.Group();
artifact.add(relicBody);

const metalMaterial = new THREE.MeshStandardMaterial({
    color: "#68766c",
    metalness: 0.78,
    roughness: 0.32,
    flatShading: true
});

const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: "#151d18",
    metalness: 0.88,
    roughness: 0.34,
    flatShading: true
});

const innerMetalMaterial = new THREE.MeshStandardMaterial({
    color: "#29352d",
    metalness: 0.9,
    roughness: 0.25,
    flatShading: true
});

const greenMaterial = new THREE.MeshStandardMaterial({
    color: "#37d85e",
    emissive: "#168b37",
    emissiveIntensity: 1.2,
    metalness: 0.45,
    roughness: 0.3
});

const edgeMaterial = new THREE.LineBasicMaterial({
    color: "#8ba895",
    transparent: true,
    opacity: 0.38
});

const seamMaterial = new THREE.LineBasicMaterial({
    color: "#54ff82",
    transparent: true,
    opacity: 0.8
});

// ------------------------------------------------------
// INNER MECHANISM
// ------------------------------------------------------

// Dark spherical body remains visible between armor petals.

const bodyGeometry = new THREE.IcosahedronGeometry(0.86, 2);

const body = new THREE.Mesh(
    bodyGeometry,
    darkMetalMaterial
);

relicBody.add(body);

// Inner mechanical rings.

const ringGroup = new THREE.Group();
relicBody.add(ringGroup);

function createRing(radius, tube, material, rotation) {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 48),
        material
    );

    ring.rotation.set(...rotation);
    ringGroup.add(ring);

    return ring;
}

createRing(0.57, 0.035, innerMetalMaterial, [0, 0, 0]);
createRing(0.46, 0.018, greenMaterial, [Math.PI / 2, 0.4, 0]);
createRing(0.68, 0.022, innerMetalMaterial, [0.7, 0.3, 0.8]);

// Faceted energy heart.

const coreGeometry = new THREE.IcosahedronGeometry(0.31, 1);

const coreMaterial = new THREE.MeshStandardMaterial({
    color: "#69ff91",
    emissive: "#25e653",
    emissiveIntensity: 1.7,
    metalness: 0.55,
    roughness: 0.2,
    flatShading: true
});

const core = new THREE.Mesh(coreGeometry, coreMaterial);
relicBody.add(core);

const coreEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(coreGeometry),
    new THREE.LineBasicMaterial({
        color: "#c4ffd2",
        transparent: true,
        opacity: 0.75
    })
);

core.add(coreEdges);

// Small mechanical spokes around the heart.

const spokeMaterial = new THREE.MeshStandardMaterial({
    color: "#68776b",
    metalness: 0.95,
    roughness: 0.24
});

const spokeGeometry = new THREE.BoxGeometry(0.075, 0.075, 0.65);

for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;

    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);

    spoke.position.set(
        Math.cos(angle) * 0.48,
        Math.sin(angle) * 0.48,
        0
    );

    spoke.rotation.z = angle;
    relicBody.add(spoke);
}

// ------------------------------------------------------
// ARMOR PETALS
// ------------------------------------------------------

// Each petal has its own edge pivot.
// Petals are distributed over a sphere using Fibonacci spacing.

const petals = [];
const petalCount = 20;
const sphereRadius = 0.67;

function makePetalGeometry() {
    const shape = new THREE.Shape();

    // Angular shield shape, deliberately not a square or cube face.
    shape.moveTo(0, 0.48);
    shape.lineTo(0.25, 0.23);
    shape.lineTo(0.22, -0.19);
    shape.lineTo(0, -0.43);
    shape.lineTo(-0.22, -0.19);
    shape.lineTo(-0.25, 0.23);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
        depth: 0.085,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025
    });
}

const petalGeometry = makePetalGeometry();

function createPetal(index) {
    const t = (index + 0.5) / petalCount;
    const y = 1 - 2 * t;
    const ringRadius = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));

    const normal = new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        y,
        Math.sin(angle) * ringRadius
    ).normalize();

    // Pivot sits on the surface of the inner body.
    const pivot = new THREE.Group();
    pivot.position.copy(normal.clone().multiplyScalar(sphereRadius));

    // Orient the petal so its front points away from the center.
    pivot.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
    );

    // Alternate petal angles to create a layered alien pattern.
    pivot.rotateZ((index % 2 === 0 ? 1 : -1) * 0.14);

    const plateGroup = new THREE.Group();
    pivot.add(plateGroup);

    const plate = new THREE.Mesh(
        petalGeometry,
        index % 4 === 0 ? innerMetalMaterial : metalMaterial
    );

    // Place the shield slightly above its pivot.
    plate.position.set(0, 0.02, 0.015);
    plateGroup.add(plate);

    const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(petalGeometry),
        edgeMaterial
    );

    edges.position.copy(plate.position);
    plateGroup.add(edges);

    // A narrow glowing line creates the energy seam.
    const seamPoints = [
        new THREE.Vector3(0, 0.39, 0.12),
        new THREE.Vector3(0.17, 0.20, 0.12),
        new THREE.Vector3(0.15, -0.13, 0.12)
    ];

    const seamGeometry = new THREE.BufferGeometry().setFromPoints(
        seamPoints
    );

    const seam = new THREE.Line(seamGeometry, seamMaterial);
    plateGroup.add(seam);

    // A small inset armor detail.
    const insetGeometry = new THREE.BoxGeometry(0.095, 0.12, 0.025);
    const inset = new THREE.Mesh(insetGeometry, darkMetalMaterial);

    inset.position.set(0, 0.02, 0.12);
    plateGroup.add(inset);

    relicBody.add(pivot);

    const petal = {
        pivot,
        plateGroup,
        normal,
        closedPosition: pivot.position.clone(),
        closedQuaternion: pivot.quaternion.clone(),
        index
    };

    petals.push(petal);
}

for (let i = 0; i < petalCount; i++) {
    createPetal(i);
}

// ------------------------------------------------------
// TRANSFORMATION ANIMATION
// ------------------------------------------------------

const homeContent = {
    title: "AN INTERFACE<br>FROM ANOTHER<br>WORLD.",
    description:
        "A DIGITAL SPACE FOR PROJECTS, EXPERIMENTS, AND SYSTEMS IN PROGRESS.",
    terminal: "SELECT A SECTION TO INITIATE TRANSFORMATION.",
    caption: "DORMANT CONFIGURATION"
};

const sectionContent = {
    home: homeContent,

    identity: {
        title: "IDENTITY<br>PROTOCOL.",
        description:
            "A HUMAN OPERATOR BEHIND THE INTERFACE. PROFILE DATA AWAITS INITIALIZATION.",
        terminal: "IDENTITY MODULE SELECTED.",
        caption: "SEALED CONFIGURATION"
    },

    archive: {
        title: "ARCHIVE<br>UNLOCKED.",
        description:
            "PROJECTS, EXPERIMENTS, AND BUILDS STORED WITHIN THE SYSTEM.",
        terminal: "ARCHIVE MODULE SELECTED.",
        caption: "ARMOR DEPLOYMENT"
    },

    systems: {
        title: "SYSTEMS<br>ONLINE.",
        description:
            "TOOLS, TECHNOLOGIES, AND TECHNICAL CAPABILITIES.",
        terminal: "SYSTEMS MODULE SELECTED.",
        caption: "CORE ACCESS CONFIGURATION"
    }
};

let currentMode = "home";
let activeTimeline = null;

function killAnimation() {
    if (activeTimeline) {
        activeTimeline.kill();
        activeTimeline = null;
    }

    petals.forEach(({ pivot, plateGroup }) => {
        gsap.killTweensOf(pivot.position);
        gsap.killTweensOf(pivot.quaternion);
        gsap.killTweensOf(plateGroup.position);
        gsap.killTweensOf(plateGroup.rotation);
    });

    gsap.killTweensOf(artifact.scale);
    gsap.killTweensOf(ringGroup.rotation);
    gsap.killTweensOf(core.scale);
}

function restorePetals(timeline, duration = 0.75) {
    petals.forEach((petal, index) => {
        const { pivot, plateGroup } = petal;

        timeline.to(
            pivot.position,
            {
                x: petal.closedPosition.x,
                y: petal.closedPosition.y,
                z: petal.closedPosition.z,
                duration,
                ease: "power3.inOut"
            },
            index * 0.025
        );

        timeline.to(
            pivot.quaternion,
            {
                x: petal.closedQuaternion.x,
                y: petal.closedQuaternion.y,
                z: petal.closedQuaternion.z,
                w: petal.closedQuaternion.w,
                duration,
                ease: "power3.inOut"
            },
            index * 0.025
        );

        timeline.to(
            plateGroup.rotation,
            {
                x: 0,
                y: 0,
                z: 0,
                duration,
                ease: "power3.inOut"
            },
            index * 0.025
        );
    });

    timeline.to(
        artifact.scale,
        {
            x: 0.88,
            y: 0.88,
            z: 0.88,
            duration: 0.8,
            ease: "power3.inOut"
        },
        0
    );
}

function deployPetals(timeline, amount = 0.8, duration = 0.9) {
    petals.forEach((petal, index) => {
        const { pivot, plateGroup, normal } = petal;

        // Each petal slides outward along its own surface normal.
        const targetPosition = petal.closedPosition.clone().add(
            normal.clone().multiplyScalar(amount)
        );

        timeline.to(
            pivot.position,
            {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration,
                ease: "power3.inOut"
            },
            index * 0.065
        );

        // The plate folds away from the center as it slides outward.
        timeline.to(
            plateGroup.rotation,
            {
                x: (index % 2 === 0 ? 1 : -1) * 0.55,
                y: (index % 3 === 0 ? -1 : 1) * 0.35,
                z: (index % 2 === 0 ? 1 : -1) * 0.25,
                duration,
                ease: "power3.inOut"
            },
            index * 0.065
        );
    });

    timeline.to(
        artifact.scale,
        {
            x: 0.72,
            y: 0.72,
            z: 0.72,
            duration: 1.1,
            ease: "power3.inOut"
        },
        0
    );
}

function setSection(section) {
    const content = sectionContent[section];

    if (!content) return;

    killAnimation();
    currentMode = section;

    document.querySelectorAll(".nav-link").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.section === section
        );
    });

    if (heroTitle) heroTitle.innerHTML = content.title;
    if (heroDescription) {
        heroDescription.textContent = content.description;
    }
    if (terminalLine) {
        terminalLine.textContent = content.terminal;
    }
    if (caption) caption.textContent = content.caption;

    activeTimeline = gsap.timeline();

    if (section === "home") {
        restorePetals(activeTimeline, 0.8);

        activeTimeline.to(
            ringGroup.rotation,
            {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.8,
                ease: "power3.inOut"
            },
            0
        );
    }

    if (section === "identity") {
        // Close the artifact, then slightly tighten the armor.
        restorePetals(activeTimeline, 0.7);

        activeTimeline.to(
            artifact.scale,
            {
                x: 0.66,
                y: 0.66,
                z: 0.66,
                duration: 0.75,
                ease: "power3.inOut"
            },
            0.35
        );
    }

    if (section === "archive") {
        // Unlock petals from different regions in sequence.
        deployPetals(activeTimeline, 0.9, 1.0);
    }

    if (section === "systems") {
        // Open the armor, then rotate the exposed inner mechanism.
        deployPetals(activeTimeline, 0.65, 0.9);

        activeTimeline.to(
            ringGroup.rotation,
            {
                x: Math.PI * 1.5,
                y: Math.PI * 2,
                z: Math.PI * 0.5,
                duration: 2.5,
                ease: "power2.inOut"
            },
            0.8
        );
    }
}

document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
        setSection(button.dataset.section);
    });
});

// ------------------------------------------------------
// RESIZE
// ------------------------------------------------------

function resizeRenderer() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

const resizeObserver = new ResizeObserver(resizeRenderer);
resizeObserver.observe(stage);

// ------------------------------------------------------
// RENDER LOOP
// ------------------------------------------------------

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // No mouse tracking. Only slow ambient motion.
    if (currentMode === "home") {
        artifact.rotation.y = -0.3 + Math.sin(time * 0.2) * 0.08;
        artifact.rotation.x = Math.sin(time * 0.16) * 0.035;
    }

    core.rotation.x = time * 0.18;
    core.rotation.y = time * 0.28;

    coreLight.intensity = 7 + Math.sin(time * 1.5) * 1.2;

    renderer.render(scene, camera);
}

// ------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------

artifact.scale.setScalar(1.2);

resizeRenderer();
animate();








 // ------------------------------------------------------
 // ARMOR PETALS — OVERLAPPING ALIEN ARMOR
 // ------------------------------------------------------

const petals = [];
const petalCount = 20;
const sphereRadius = 0.61;

function makePetalGeometry() {
    const shape = new THREE.Shape();

    // Broad angular shield with a tapered lower edge.
    shape.moveTo(-0.29, 0.18);
    shape.lineTo(-0.19, 0.38);
    shape.lineTo(0.10, 0.43);
    shape.lineTo(0.29, 0.22);
    shape.lineTo(0.25, -0.12);
    shape.lineTo(0.06, -0.39);
    shape.lineTo(-0.18, -0.28);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
        depth: 0.075,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.018,
        bevelThickness: 0.018
    });
}

const petalGeometry = makePetalGeometry();

function createPetal(index) {
    const t = (index + 0.5) / petalCount;
    const y = 1 - 2 * t;
    const ringRadius = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));

    const normal = new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        y,
        Math.sin(angle) * ringRadius
    ).normalize();

    // Orient the plate outward from the spherical core.
    const orientation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
    );

    // Put the hinge near one edge of the plate.
    const pivot = new THREE.Group();
    pivot.position.copy(normal.clone().multiplyScalar(sphereRadius));
    pivot.quaternion.copy(orientation);

    const plateGroup = new THREE.Group();
    pivot.add(plateGroup);

    const plate = new THREE.Mesh(
        petalGeometry,
        index % 4 === 0 ? innerMetalMaterial : metalMaterial
    );

    // Slightly offset adjacent plates to create layered armor.
    plate.position.set(0, 0, 0.025);
    plateGroup.add(plate);

    const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(petalGeometry),
        edgeMaterial
    );
    edges.position.copy(plate.position);
    plateGroup.add(edges);

    // Restrained green energy channel along each plate.
    const seamPoints = [
        new THREE.Vector3(-0.16, 0.25, 0.115),
        new THREE.Vector3(0.08, 0.29, 0.115),
        new THREE.Vector3(0.19, 0.12, 0.115)
    ];

    const seamGeometry = new THREE.BufferGeometry().setFromPoints(
        seamPoints
    );

    plateGroup.add(new THREE.Line(seamGeometry, seamMaterial));

    // Dark inset detail.
    const inset = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.10, 0.025),
        darkMetalMaterial
    );
    inset.position.set(0.02, 0.02, 0.12);
    plateGroup.add(inset);

    relicBody.add(pivot);

    petals.push({
        pivot,
        plateGroup,
        normal,
        closedPosition: pivot.position.clone(),
        closedQuaternion: pivot.quaternion.clone(),
        index
    });
}

for (let i = 0; i < petalCount; i++) {
    createPetal(i);
}