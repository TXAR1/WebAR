// WebXR Polyfill für bessere Kompatibilität
const polyfill = new WebXRPolyfill();

let scene, camera, renderer, controller;

function init() {
    // Szene erstellen
    scene = new THREE.Scene();

    // Kamera hinzufügen
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    scene.add(camera);

    // Renderer für WebXR
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // AR-Button hinzufügen
    document.body.appendChild(ARButton.createButton(renderer));

    // AR-Controller für Interaktionen
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // Lichtquelle hinzufügen
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
}

function onSelect() {
    // Einfache 3D-Form (Würfel) in die Szene einfügen
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(geometry, material);

    // Position des Controllers übernehmen
    cube.position.setFromMatrixPosition(controller.matrixWorld);
    scene.add(cube);
}

function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

// Startet die Anwendung
init();
animate();
