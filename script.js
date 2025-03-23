console.log("Script geladen!");

// WebXR Polyfill für bessere Unterstützung
const polyfill = new WebXRPolyfill();

// Szene, Kamera, Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Würfel als Testobjekt hinzufügen
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 2;

// Animationsloop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// AR starten, wenn möglich
document.getElementById("arButton").addEventListener("click", async () => {
    if (navigator.xr) {
        try {
            const session = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["local-floor"] });
            renderer.xr.enabled = true;
            renderer.xr.setSession(session);
        } catch (error) {
            console.error("AR-Fehler:", error);
        }
    } else {
        alert("WebXR wird nicht unterstützt!");
    }
});
