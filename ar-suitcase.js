// Markerlose AR Koffer Erfahrung mit WebXR
class ARSuitcaseExperience {
    constructor() {
        this.state = 'scanning'; // scanning, preview, placed, opening, open, collecting, closing, shaking, revealing
        this.collectedObjects = 0;
        this.totalObjects = 6;
        this.objectsToCollect = 2;
        this.objects = [];
        this.selectedObjects = [];
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.reticle = null;
        this.previewPosition = null;

        this.init();
    }

    init() {
        const scene = document.querySelector('a-scene');

        if (scene.hasLoaded) {
            this.onSceneLoaded();
        } else {
            scene.addEventListener('loaded', () => this.onSceneLoaded());
        }
    }

    onSceneLoaded() {
        console.log('AR Szene geladen');

        const sceneEl = document.querySelector('a-scene');
        this.setupXRSession(sceneEl);
        this.setupPlaceButton();
    }

    setupXRSession(sceneEl) {
        const self = this;

        sceneEl.addEventListener('enter-vr', () => {
            console.log('AR Modus gestartet');
            const xrSession = sceneEl.xrSession;

            if (xrSession) {
                self.onSessionStarted(xrSession);
            }
        });

        // Fallback für nicht-WebXR Browser (Desktop)
        if (!navigator.xr) {
            console.log('WebXR nicht verfügbar, verwende Fallback-Modus');
            this.enableFallbackMode();
        }
    }

    async onSessionStarted(session) {
        console.log('XR Session gestartet');
        this.session = session;

        // Hit-Test-Source anfordern
        session.requestReferenceSpace('viewer').then((referenceSpace) => {
            session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                this.hitTestSource = source;
                console.log('Hit-Test-Source erfolgreich erstellt');
            });
        });

        // Frame-Updates
        const sceneEl = document.querySelector('a-scene');
        sceneEl.addEventListener('render', () => {
            if (this.state === 'scanning' || this.state === 'preview') {
                this.onXRFrame();
            }
        });
    }

    onXRFrame() {
        if (!this.session || !this.hitTestSource) return;

        const frame = this.session.requestAnimationFrame ? null : this.session;
        if (!frame) return;

        const referenceSpace = this.session.referenceSpace;
        if (!referenceSpace) return;

        // Hit-Test durchführen
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);

            if (pose) {
                const position = pose.transform.position;
                this.updatePreview(position);
            }
        }
    }

    updatePreview(position) {
        const preview = document.querySelector('#preview-container');
        const placeButton = document.querySelector('#place-button');
        const instructions = document.querySelector('#instructions');

        if (this.state === 'scanning') {
            this.state = 'preview';
            instructions.textContent = 'Bewege das Gerät, um die perfekte Position zu finden';
            placeButton.style.display = 'block';
        }

        // Setze Preview-Position
        preview.setAttribute('visible', true);
        preview.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        this.previewPosition = { x: position.x, y: position.y, z: position.z };
    }

    setupPlaceButton() {
        const placeButton = document.querySelector('#place-button');

        placeButton.addEventListener('click', () => {
            if (this.state === 'preview' && this.previewPosition) {
                this.placeSuitcase();
            }
        });

        placeButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.state === 'preview' && this.previewPosition) {
                this.placeSuitcase();
            }
        });
    }

    placeSuitcase() {
        console.log('Koffer wird platziert');
        this.state = 'placed';

        // Verstecke Preview und Button
        const preview = document.querySelector('#preview-container');
        const placeButton = document.querySelector('#place-button');
        const crosshair = document.querySelector('#crosshair');

        preview.setAttribute('visible', false);
        placeButton.style.display = 'none';
        crosshair.style.display = 'none';

        // Zeige den echten Koffer
        const suitcase = document.querySelector('#suitcase-container');
        suitcase.setAttribute('visible', true);
        suitcase.setAttribute('position',
            `${this.previewPosition.x} ${this.previewPosition.y} ${this.previewPosition.z}`);

        // Starte die Öffnungs-Animation
        setTimeout(() => {
            this.openSuitcase();
        }, 500);
    }

    enableFallbackMode() {
        // Desktop-Modus ohne WebXR
        console.log('Fallback-Modus aktiviert');

        setTimeout(() => {
            const instructions = document.querySelector('#instructions');
            const placeButton = document.querySelector('#place-button');
            const preview = document.querySelector('#preview-container');

            instructions.textContent = 'Klicke auf "KOFFER PLATZIEREN" um zu starten';
            placeButton.style.display = 'block';

            // Zeige Preview vor der Kamera
            preview.setAttribute('visible', true);
            preview.setAttribute('position', '0 0 -2');

            this.state = 'preview';
            this.previewPosition = { x: 0, y: 0, z: -2 };
        }, 1000);
    }

    openSuitcase() {
        this.state = 'opening';
        this.updateInstructions('Koffer öffnet sich...');

        const topLid = document.querySelector('#suitcase-top');
        const suitcaseContainer = document.querySelector('#suitcase-container');
        const containerPos = suitcaseContainer.getAttribute('position');

        let angle = 0;
        const openInterval = setInterval(() => {
            angle += 3;
            if (angle >= 90) {
                angle = 90;
                clearInterval(openInterval);
                this.state = 'open';
                this.placeObjects();
                this.updateInstructions('Tippe auf 2 Objekte, um sie einzusammeln!');
                document.querySelector('#counter').style.display = 'block';
            }

            // Rotation um die hintere Kante
            const radians = (angle * Math.PI) / 180;
            const yOffset = Math.sin(radians) * 0.2;
            const zOffset = Math.cos(radians) * 0.2 - 0.2;

            topLid.setAttribute('position', `0 ${0.3 + yOffset} ${zOffset}`);
            topLid.setAttribute('rotation', `${-angle} 0 0`);
        }, 20);
    }

    placeObjects() {
        const suitcaseContainer = document.querySelector('#suitcase-container');
        const suitcasePos = suitcaseContainer.getAttribute('position');
        const container = document.querySelector('#objects-container');

        const objectTypes = [
            { type: 'cube', color: '#FF6B6B', size: 0.12 },
            { type: 'sphere', color: '#4ECDC4', size: 0.08 },
            { type: 'cylinder', color: '#45B7D1', size: 0.08 },
            { type: 'pyramid', color: '#FFA07A', size: 0.12 },
            { type: 'torus', color: '#98D8C8', size: 0.08 },
            { type: 'octahedron', color: '#F7DC6F', size: 0.1 }
        ];

        // Positionen im Kreis um den Koffer
        const radius = 0.5;
        const angleStep = (2 * Math.PI) / this.totalObjects;

        for (let i = 0; i < this.totalObjects; i++) {
            const angle = i * angleStep;
            const x = suitcasePos.x + Math.cos(angle) * radius;
            const z = suitcasePos.z + Math.sin(angle) * radius;
            const y = suitcasePos.y + 0.15;

            const objData = objectTypes[i];
            const objEntity = document.createElement('a-entity');
            objEntity.classList.add('clickable-object');
            objEntity.setAttribute('data-object-id', i);

            let geometry;
            switch(objData.type) {
                case 'cube':
                    geometry = `primitive: box; width: ${objData.size}; height: ${objData.size}; depth: ${objData.size}`;
                    break;
                case 'sphere':
                    geometry = `primitive: sphere; radius: ${objData.size}`;
                    break;
                case 'cylinder':
                    geometry = `primitive: cylinder; radius: ${objData.size}; height: ${objData.size * 2}`;
                    break;
                case 'pyramid':
                    geometry = `primitive: cone; radiusBottom: ${objData.size}; radiusTop: 0; height: ${objData.size * 2}`;
                    break;
                case 'torus':
                    geometry = `primitive: torus; radius: ${objData.size}; radiusTubular: ${objData.size * 0.3}`;
                    break;
                case 'octahedron':
                    geometry = `primitive: octahedron; radius: ${objData.size}`;
                    break;
            }

            objEntity.setAttribute('geometry', geometry);
            objEntity.setAttribute('material', `color: ${objData.color}; metalness: 0.5; roughness: 0.5`);
            objEntity.setAttribute('position', `${x} ${y} ${z}`);

            // Hover-Animation
            objEntity.setAttribute('animation__hover', {
                property: 'position',
                from: `${x} ${y} ${z}`,
                to: `${x} ${y + 0.05} ${z}`,
                dur: 1000,
                dir: 'alternate',
                loop: true,
                easing: 'easeInOutSine'
            });

            // Rotation-Animation
            objEntity.setAttribute('animation__rotate', {
                property: 'rotation',
                to: '0 360 0',
                dur: 4000 + i * 500,
                loop: true,
                easing: 'linear'
            });

            container.appendChild(objEntity);
            this.objects.push({
                entity: objEntity,
                id: i,
                position: { x, y, z },
                collected: false
            });
        }

        // Setup click handler nach dem Platzieren
        this.setupClickHandler();
    }

    setupClickHandler() {
        const scene = document.querySelector('a-scene');
        const camera = document.querySelector('[camera]');

        const handleInteraction = (clientX, clientY) => {
            if (this.state !== 'open') return;

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            mouse.x = (clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(clientY / window.innerHeight) * 2 + 1;

            const cameraComponent = camera.components.camera;
            if (!cameraComponent) return;

            const cameraObj = cameraComponent.camera;
            raycaster.setFromCamera(mouse, cameraObj);

            // Prüfe alle Objekte
            this.objects.forEach(obj => {
                if (obj.collected) return;

                const intersects = raycaster.intersectObject(obj.entity.object3D, true);
                if (intersects.length > 0) {
                    this.collectObject(obj);
                }
            });
        };

        // Click-Handler
        scene.addEventListener('click', (evt) => {
            handleInteraction(evt.clientX, evt.clientY);
        });

        // Touch-Handler für mobile Geräte
        scene.addEventListener('touchstart', (evt) => {
            if (evt.touches.length > 0) {
                const touch = evt.touches[0];
                handleInteraction(touch.clientX, touch.clientY);
            }
        });
    }

    collectObject(obj) {
        console.log('Objekt gesammelt:', obj.id);
        obj.collected = true;
        this.selectedObjects.push(obj);
        this.collectedObjects++;

        const suitcaseContainer = document.querySelector('#suitcase-container');
        const suitcasePos = suitcaseContainer.getAttribute('position');

        // Animation: Objekt fliegt zum Koffer
        const entity = obj.entity;
        entity.setAttribute('animation__collect', {
            property: 'position',
            to: `${suitcasePos.x} ${suitcasePos.y + 0.3} ${suitcasePos.z}`,
            dur: 800,
            easing: 'easeInOutQuad'
        });

        entity.setAttribute('animation__scale', {
            property: 'scale',
            to: '0.1 0.1 0.1',
            dur: 800,
            easing: 'easeInOutQuad'
        });

        setTimeout(() => {
            entity.setAttribute('visible', false);
        }, 800);

        // Counter aktualisieren
        this.updateCounter();

        // Prüfe ob genug Objekte gesammelt wurden
        if (this.collectedObjects >= this.objectsToCollect) {
            setTimeout(() => {
                this.closeSuitcase();
            }, 1000);
        }
    }

    closeSuitcase() {
        this.state = 'closing';
        this.updateInstructions('Koffer schließt sich...');

        const topLid = document.querySelector('#suitcase-top');

        let angle = 90;
        const closeInterval = setInterval(() => {
            angle -= 3;
            if (angle <= 0) {
                angle = 0;
                clearInterval(closeInterval);
                this.shakeSuitcase();
            }

            const radians = (angle * Math.PI) / 180;
            const yOffset = Math.sin(radians) * 0.2;
            const zOffset = Math.cos(radians) * 0.2 - 0.2;

            topLid.setAttribute('position', `0 ${0.3 + yOffset} ${zOffset}`);
            topLid.setAttribute('rotation', `${-angle} 0 0`);
        }, 20);
    }

    shakeSuitcase() {
        this.state = 'shaking';
        this.updateInstructions('Der Koffer wackelt...');

        const container = document.querySelector('#suitcase-container');
        const currentPos = container.getAttribute('position');
        const originalPos = { x: currentPos.x, y: currentPos.y, z: currentPos.z };

        let shakeCount = 0;
        const maxShakes = 20;
        const shakeIntensity = 0.02;

        const shakeInterval = setInterval(() => {
            shakeCount++;

            if (shakeCount >= maxShakes) {
                clearInterval(shakeInterval);
                container.setAttribute('position', `${originalPos.x} ${originalPos.y} ${originalPos.z}`);
                this.revealFinalObject();
                return;
            }

            const offsetX = (Math.random() - 0.5) * shakeIntensity;
            const offsetY = (Math.random() - 0.5) * shakeIntensity * 0.5;
            const offsetZ = (Math.random() - 0.5) * shakeIntensity;

            container.setAttribute('position',
                `${originalPos.x + offsetX} ${originalPos.y + offsetY} ${originalPos.z + offsetZ}`);
        }, 50);
    }

    revealFinalObject() {
        this.state = 'revealing';
        this.updateInstructions('Ein magisches Objekt erscheint!');

        const suitcaseContainer = document.querySelector('#suitcase-container');
        const suitcasePos = suitcaseContainer.getAttribute('position');

        // Koffer wieder öffnen
        const topLid = document.querySelector('#suitcase-top');
        let angle = 0;

        const openInterval = setInterval(() => {
            angle += 3;
            if (angle >= 90) {
                angle = 90;
                clearInterval(openInterval);

                // Zeige das finale Objekt
                const finalObject = document.querySelector('#final-object');
                finalObject.setAttribute('visible', true);
                finalObject.setAttribute('position',
                    `${suitcasePos.x} ${suitcasePos.y} ${suitcasePos.z}`);

                // Erscheinungs-Animation
                finalObject.setAttribute('animation__appear', {
                    property: 'scale',
                    from: '0 0 0',
                    to: '1 1 1',
                    dur: 1000,
                    easing: 'easeOutElastic'
                });
            }

            const radians = (angle * Math.PI) / 180;
            const yOffset = Math.sin(radians) * 0.2;
            const zOffset = Math.cos(radians) * 0.2 - 0.2;

            topLid.setAttribute('position', `0 ${0.3 + yOffset} ${zOffset}`);
            topLid.setAttribute('rotation', `${-angle} 0 0`);
        }, 20);
    }

    updateInstructions(text) {
        const instructions = document.querySelector('#instructions');
        instructions.textContent = text;
    }

    updateCounter() {
        const counter = document.querySelector('#counter');
        counter.textContent = `Objekte gesammelt: ${this.collectedObjects}/${this.objectsToCollect}`;
    }
}

// Starte die AR-Erfahrung
window.addEventListener('load', () => {
    new ARSuitcaseExperience();
});
