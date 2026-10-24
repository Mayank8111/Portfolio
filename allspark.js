
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

const bodyGeometry = new THREE.IcosahedronGeometry(0.64, 2);

const body = new THREE.Mesh(
    bodyGeometry,
    darkMetalMaterial
);

// Temporarily hide the dark body so we can inspect the core.
body.visible = false;

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

createRing(0.78, 0.025, innerMetalMaterial, [0, 0, 0]);

createRing(0.86, 0.018, greenMaterial, [Math.PI / 2, 0.4, 0]);

createRing(0.94, 0.022, innerMetalMaterial, [0.7, 0.3, 0.8]);
// Faceted energy heart.

const coreGeometry = new THREE.IcosahedronGeometry(0.62, 1);

const coreMaterial = new THREE.MeshStandardMaterial({
    color: "#36d96b",
    emissive: "#087b2b",
    emissiveIntensity: 1.1,
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

for (let i = 0; i < 0; i++) {
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

 // ------------------------------------------------------
 // ARMOR PETALS — OVERLAPPING ALIEN ARMOR
 // ------------------------------------------------------
const petals = [];
const sphereRadius = 1.02;

// Each row contains the number of plates and its latitude.
// Alternating rows are offset to reduce gaps between plates.
const armorRows = [
    { count: 5, latitude: 1.05, offset: 0 },
    { count: 8, latitude: 0.48, offset: Math.PI / 8 },
    { count: 8, latitude: -0.18, offset: 0 },
    { count: 5, latitude: -0.82, offset: Math.PI / 5 }
];

function makePetalGeometry(width, height) {
    const shape = new THREE.Shape();

    // Angular shield shape.
    shape.moveTo(-width * 0.50, height * 0.30);
    shape.lineTo(-width * 0.30, height * 0.50);
    shape.lineTo(width * 0.30, height * 0.48);
    shape.lineTo(width * 0.50, height * 0.20);
    shape.lineTo(width * 0.42, -height * 0.22);
    shape.lineTo(width * 0.12, -height * 0.50);
    shape.lineTo(-width * 0.30, -height * 0.38);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
        depth: 0.055,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012
    });
}

function createPetal(index, rowIndex, columnIndex, count, latitude, offset) {
    const angle = (columnIndex / count) * Math.PI * 2 + offset;
    const ringRadius = Math.cos(latitude);

    const normal = new THREE.Vector3(
        Math.sin(angle) * ringRadius,
        Math.sin(latitude),
        Math.cos(angle) * ringRadius
    ).normalize();

    const orientation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
    );

    const pivot = new THREE.Group();

    // Place the armor on the outside of the core and inner rings.
    pivot.position.copy(normal.clone().multiplyScalar(sphereRadius));
    pivot.quaternion.copy(orientation);

    const plateGroup = new THREE.Group();
    pivot.add(plateGroup);

    // Wider plates near the equator; narrower plates near the poles.
    const width = rowIndex === 0 || rowIndex === 3 ? 0.88 : 0.76;
    const height = rowIndex === 0 || rowIndex === 3 ? 0.72 : 0.82;

    const geometry = makePetalGeometry(width, height);

    const plate = new THREE.Mesh(
        geometry,
        index % 4 === 0 ? innerMetalMaterial : metalMaterial
    );

    plate.position.set(0, -height * 0.30, 0.025);
    plateGroup.add(plate);

    const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        edgeMaterial
    );
    edges.position.copy(plate.position);
    plateGroup.add(edges);

    const seamPoints = [
        new THREE.Vector3(-width * 0.22, height * 0.12, 0.105),
        new THREE.Vector3(width * 0.08, height * 0.16, 0.105),
        new THREE.Vector3(width * 0.28, -height * 0.12, 0.105)
    ];

    const seamGeometry = new THREE.BufferGeometry().setFromPoints(seamPoints);
    plateGroup.add(new THREE.Line(seamGeometry, seamMaterial));

    const inset = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.10, 0.025),
        darkMetalMaterial
    );
    inset.position.set(0.02, -height * 0.32, 0.12);
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

let petalIndex = 0;

armorRows.forEach((row, rowIndex) => {
    for (let column = 0; column < row.count; column++) {
        createPetal(
            petalIndex,
            rowIndex,
            column,
            row.count,
            row.latitude,
            row.offset
        );
        petalIndex++;
    }
});

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

        const direction = index % 2 === 0 ? 1 : -1;

        // Move each hinge slightly outward to clear the central shell.
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
            index * 0.055
        );

        // Rotate the armor panel as it opens.
        timeline.to(
            plateGroup.rotation,
            {
                x: direction * 1.15,
                y: (index % 3 === 0 ? -1 : 1) * 0.65,
                z: direction * 0.55,
                duration,
                ease: "power3.inOut"
            },
            index * 0.055
        );
    });

    // Keep the artifact large enough to see while opening.
    timeline.to(
        artifact.scale,
        {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 1.0,
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
    // Fold the plates inward into a tighter sealed configuration.
    petals.forEach((petal, index) => {
        const { pivot, plateGroup, normal } = petal;

        // Pull each hinge slightly inward.
        const targetPosition = petal.closedPosition.clone().add(
            normal.clone().multiplyScalar(-0.10)
        );

        activeTimeline.to(
            pivot.position,
            {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 0.65,
                ease: "power3.inOut"
            },
            index * 0.025
        );

        // Fold the plate inward with an alternating motion.
        const direction = index % 2 === 0 ? 1 : -1;

        activeTimeline.to(
            plateGroup.rotation,
            {
                x: direction * 0.35,
                y: -direction * 0.22,
                z: direction * 0.18,
                duration: 0.65,
                ease: "power3.inOut"
            },
            index * 0.025
        );
    });

    activeTimeline.to(
        artifact.scale,
        {
            x: 0.92,
            y: 0.92,
            z: 0.92,
            duration: 0.75,
            ease: "power3.inOut"
        },
        0
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