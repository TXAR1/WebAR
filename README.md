# AR Koffer Erfahrung

Eine interaktive markerlose AR-Erfahrung mit automatischer Bodenerkennung. Ein virtueller Koffer öffnet sich, platziert Objekte, und nach dem Einsammeln von 2 Objekten präsentiert er ein magisches Finale.

## Features

- 🎯 **Markerlose AR** - Keine Marker nötig, funktioniert auf jedem Boden
- 👁️ **Preview-System** - Sieh den Koffer als halbtransparente Vorschau
- 📍 **Automatische Platzierung** - Platziere den Koffer mit einem Button-Klick
- 📦 **Animierter 3D-Koffer** - Öffnet und schließt sich mit flüssigen Animationen
- 🎯 **6 bunte 3D-Objekte** - Werden im Kreis um den Koffer platziert
- 👆 **Touch-Interaktion** - Tippe auf Objekte, um sie einzusammeln
- 🎬 **Wackel-Animation** - Der Koffer wackelt nach dem Schließen
- ✨ **Magisches Finale** - Goldenes Objekt erscheint über dem Koffer

## Ablauf

1. **Boden scannen** - Bewege dein Gerät langsam über eine ebene Fläche
2. **Preview erscheint** - Sobald der Boden erkannt wird, siehst du einen halbtransparenten Koffer
3. **Position anpassen** - Bewege das Gerät, um die perfekte Stelle zu finden
4. **Platzieren** - Drücke auf "KOFFER PLATZIEREN"
5. **Koffer öffnet sich** - Der Koffer wird platziert und öffnet sich automatisch
6. **Objekte erscheinen** - 6 Objekte werden im Kreis um den Koffer platziert
7. **Objekte sammeln** - Tippe auf 2 beliebige Objekte, um sie einzusammeln
8. **Koffer schließt sich** - Nach dem Sammeln schließt sich der Koffer automatisch
9. **Wackel-Animation** - Der Koffer wackelt leicht
10. **Finale** - Der Koffer öffnet sich erneut und zeigt ein goldenes, rotierendes Objekt

## Installation & Start

### Option 1: Lokaler Server (empfohlen)

1. Installiere einen lokalen Webserver, z.B. mit Python:
   ```bash
   python -m http.server 8000
   ```

   Oder mit Node.js:
   ```bash
   npx http-server -p 8000
   ```

2. Öffne im Browser: `http://localhost:8000`

### Option 2: Live Server (VS Code)

1. Installiere die "Live Server" Extension in VS Code
2. Rechtsklick auf `index.html` → "Open with Live Server"

### WICHTIG: HTTPS erforderlich

Für markerlose AR auf mobilen Geräten benötigst du HTTPS! Optionen:

1. **ngrok** (einfachste Methode):
   ```bash
   npx http-server -p 8000
   # In einem neuen Terminal:
   ngrok http 8000
   ```
   Nutze die generierte HTTPS-URL auf deinem Smartphone

2. **GitHub Pages** (kostenlos):
   - Pushe den Code zu GitHub
   - Aktiviere GitHub Pages in den Repository-Einstellungen
   - Öffne die generierte URL

3. **Lokales Netzwerk** (für Tests):
   - Auf manchen Geräten funktioniert auch die lokale IP-Adresse

## Technologie

- **A-Frame 1.4.2** - WebVR/WebXR Framework
- **WebXR** - Web Extended Reality API für markerlose AR
- **Hit-Testing API** - Automatische Bodenerkennung
- **Three.js** - 3D-Grafik Engine (via A-Frame)

## Browser-Kompatibilität

### Mobil (WebXR AR erforderlich):
- ✅ **Chrome (Android 87+)** - Volle Unterstützung
- ✅ **Edge (Android)** - Volle Unterstützung
- ⚠️ **Safari (iOS)** - Begrenzte WebXR-Unterstützung (nutze AR Quick Look als Alternative)
- ❌ Firefox Mobile - Keine WebXR AR-Unterstützung

### Desktop (Fallback-Modus):
- ✅ Chrome, Firefox, Edge, Safari
- Zeigt den Koffer direkt vor der virtuellen Kamera

### Anforderungen:
- HTTPS-Verbindung (außer localhost)
- Kamera-Zugriff erlaubt
- WebXR-kompatibles Gerät für AR-Funktionen

## Fehlerbehebung

### AR startet nicht / "Bewege dein Gerät..." bleibt stehen
- **WebXR nicht verfügbar**: Dein Browser/Gerät unterstützt kein WebXR
  - Lösung: Nutze Chrome auf Android (Version 87+)
  - Alternative: Nutze einen anderen AR-Browser
- **Kamera-Zugriff verweigert**: Erlaube Kamera-Zugriff in den Browser-Einstellungen
- **Kein HTTPS**: Stelle sicher, dass du über HTTPS oder localhost zugreifst

### Preview erscheint nicht
- Bewege das Gerät langsamer über die Oberfläche
- Sorge für gute Beleuchtung
- Richte die Kamera auf eine strukturierte, nicht-reflektierende Oberfläche
- Vermeide zu dunkle oder zu helle Bereiche

### Button "KOFFER PLATZIEREN" reagiert nicht
- Stelle sicher, dass der Preview sichtbar ist
- Tippe direkt auf den Button (nicht daneben)
- Warte einen Moment nach dem Erscheinen des Previews

### Objekte sind nicht anklickbar
- Stelle sicher, dass der Koffer vollständig geöffnet ist
- Tippe direkt auf die 3D-Objekte (nicht daneben)
- Bei Problemen: Bewege dich näher an die Objekte heran
- Prüfe, ob Touch-Events im Browser funktionieren

## Anpassungen

### Anzahl der zu sammelnden Objekte ändern
In `ar-suitcase.js` Zeile 6:
```javascript
this.objectsToCollect = 2; // Ändere diese Zahl
```

### Objektfarben ändern
In `ar-suitcase.js` ab Zeile 95:
```javascript
const objectTypes = [
    { type: 'cube', color: '#FF6B6B', size: 0.12 }, // Ändere die Farben
    // ...
];
```

### Koffer-Größe anpassen
In `index.html` bei den `<a-box>` Elementen:
```html
<a-box id="suitcase-bottom" width="0.6" height="0.3" depth="0.4">
```

## Lizenz

Frei verwendbar für persönliche und kommerzielle Projekte.

## Viel Spaß!

Genieße deine AR-Koffer-Erfahrung! 🎉
