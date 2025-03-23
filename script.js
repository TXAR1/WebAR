console.log("WebAR startet...");

// WebXR Polyfill für bessere Unterstützung
const polyfill = new WebXRPolyfill();

// Szene, Kamera, Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Licht hinzufügen
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// 3D-Objekt: Ein einfacher Würfel
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.set(0, 0, -0.5); // Position direkt vor der Kamera

// Animationsloop
function animate() {
    renderer.setAnimationLoop(() => {
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    });
}

// AR starten, wenn möglich
document.getElementById("arButton").addEventListener("click", async () => {
    if (navigator.xr) {
        try {
            const session = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["local-floor"] });
            renderer.xr.setSession(session);
            animate();
        } catch (error) {
            console.error("AR-Fehler:", error);
            alert("AR kann nicht gestartet werden.");
        }
    } else {
        alert("WebXR wird nicht unterstützt!");
    }
});

