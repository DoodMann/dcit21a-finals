/**
 * Interactive Map Logic
 * Handles panning, zooming, and admin pin placement.
 * Now with boundary constraints!
 */

document.addEventListener('DOMContentLoaded', () => {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapContainer = document.getElementById('map-container');
    const addPinBtn = document.getElementById('add-pin-btn');

    // Map Dimensions (MUST match CSS)
    const MAP_WIDTH = 2000;
    const MAP_HEIGHT = 2000;

    // State
    const state = {
        isDragging: false,
        startX: 0,
        startY: 0,
        translateX: 0,
        translateY: 0,
        scale: 1,
        pinMode: false
    };

    /**
     * Calculates the minimum scale needed to cover the viewport.
     * Use Math.min if you want "contain" (bars).
     * Use Math.max if you want "cover" (no empty space).
     */
    function getMinScale() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        // We want to ensure the map is at least as big as the wrapper
        const scaleX = wrapperRect.width / MAP_WIDTH;
        const scaleY = wrapperRect.height / MAP_HEIGHT;
        return Math.max(scaleX, scaleY);
    }

    function initMap() {
        state.scale = getMinScale(); // Start zoomed out to cover screen
        centerMap();
        updateTransform();
    }

    function centerMap() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        // Center the map logic
        state.translateX = (wrapperRect.width - (MAP_WIDTH * state.scale)) / 2;
        state.translateY = (wrapperRect.height - (MAP_HEIGHT * state.scale)) / 2;
        constrainBounds(); // Ensure valid after calculation
    }

    /**
     * Ensures the map stays within the viewport boundaries.
     * Rules:
     * 1. x cannot be positive (gap on left)
     * 2. (x + width*scale) cannot be less than viewport width (gap on right)
     */
    function constrainBounds() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const minScale = getMinScale();

        // Enforce Min Scale
        if (state.scale < minScale) state.scale = minScale;

        const scaledWidth = MAP_WIDTH * state.scale;
        const scaledHeight = MAP_HEIGHT * state.scale;

        // Bounds X
        // minX is usually negative: viewportWidth - mapWidth
        const minX = wrapperRect.width - scaledWidth;
        const maxX = 0; // Top-left corner cannot be > 0

        // If map is smaller than viewport (shouldn't happen with minScale check, but safety)
        if (scaledWidth < wrapperRect.width) {
            state.translateX = (wrapperRect.width - scaledWidth) / 2;
        } else {
            state.translateX = Math.min(Math.max(state.translateX, minX), maxX);
        }

        // Bounds Y
        const minY = wrapperRect.height - scaledHeight;
        const maxY = 0;

        if (scaledHeight < wrapperRect.height) {
            state.translateY = (wrapperRect.height - scaledHeight) / 2;
        } else {
            state.translateY = Math.min(Math.max(state.translateY, minY), maxY);
        }
    }


    // --- Panning Logic ---
    mapWrapper.addEventListener('mousedown', (e) => {
        if (state.pinMode) return;

        state.isDragging = true;
        // Calculate offset from current translate
        state.startX = e.clientX - state.translateX;
        state.startY = e.clientY - state.translateY;
        mapWrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        state.isDragging = false;
        if (!state.pinMode) {
            mapWrapper.style.cursor = 'grab';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;

        e.preventDefault();
        state.translateX = e.clientX - state.startX;
        state.translateY = e.clientY - state.startY;

        constrainBounds();
        updateTransform();
    });

    // --- Zooming Logic (Wheel) ---
    mapWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapWrapper.getBoundingClientRect();
        // Mouse position relative to wrapper
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Mouse position relative to Map (0 to 1)
        const mapMouseX = (mouseX - state.translateX) / state.scale;
        const mapMouseY = (mouseY - state.translateY) / state.scale;

        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;

        let newScale = state.scale + delta;
        const minScale = getMinScale();
        const maxScale = 4; // Max zoom 4x

        // Clamp Scale
        newScale = Math.min(Math.max(minScale, newScale), maxScale);

        // Calculate new translate to keep mouse point stable
        // newTranslate = mousePos - (mapPos * newScale)
        state.translateX = mouseX - (mapMouseX * newScale);
        state.translateY = mouseY - (mapMouseY * newScale);
        state.scale = newScale;

        constrainBounds();
        updateTransform();
    });

    // --- Resize Handle ---
    window.addEventListener('resize', () => {
        constrainBounds();
        updateTransform();
    });

    function updateTransform() {
        mapContainer.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
    }

    // Initialize
    initMap();
    fetchPins();

    function fetchPins() {
        fetch('api/get_pins.php')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    data.forEach(pinData => {
                        createPinElement(pinData.x, pinData.y, pinData.id);
                    });
                }
            })
            .catch(err => console.error('Error fetching pins:', err));
    }


    // --- Admin: Add Pin Logic ---
    if (typeof USER_ROLE !== 'undefined' && USER_ROLE === 'admin' && addPinBtn) {
        addPinBtn.addEventListener('click', () => {
            state.pinMode = !state.pinMode;

            if (state.pinMode) {
                addPinBtn.textContent = '❌ Cancel Pin';
                addPinBtn.style.background = '#d32f2f';
                mapWrapper.style.cursor = 'crosshair';
            } else {
                addPinBtn.textContent = '📍 Add Pin';
                addPinBtn.style.background = '';
                mapWrapper.style.cursor = 'grab';
            }
        });

        // Place Pin on Click
        mapContainer.addEventListener('click', (e) => {
            if (!state.pinMode) return;

            const rect = mapContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / state.scale;
            const y = (e.clientY - rect.top) / state.scale;

            // Optimistic UI: Create pin immediately
            // But we need the ID from server to delete it later, so we might wait 
            // OR create a temp pin and update it.
            // Let's just wait for the server response for simplicity in a Finals project (avoids sync issues)

            savePinToServer(x, y);

            state.pinMode = false;
            addPinBtn.textContent = '📍 Add Pin';
            addPinBtn.style.background = '';
            mapWrapper.style.cursor = 'grab';
        });
    }

    function savePinToServer(x, y) {
        fetch('api/save_pin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: x, y: y })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    createPinElement(data.pin.x, data.pin.y, data.pin.id);
                } else {
                    alert('Failed to save pin!');
                }
            })
            .catch(err => console.error(err));
    }

    function createPinElement(x, y, id) {
        const pin = document.createElement('div');
        pin.className = 'map-pin';
        pin.style.left = (x - 16) + 'px';
        pin.style.top = (y - 32) + 'px';
        pin.dataset.id = id;

        pin.title = `Location: ${Math.round(x)}, ${Math.round(y)}`;

        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            if (USER_ROLE === 'admin') {
                if (confirm('Delete this pin?')) {
                    deletePinFromServer(id, pin);
                }
            } else {
                alert('This is a pin!'); // In future, maybe show a popup with more info
            }
        });

        mapContainer.appendChild(pin);
    }

    function deletePinFromServer(id, pinElement) {
        fetch('api/delete_pin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    pinElement.remove();
                } else {
                    alert('Failed to delete pin');
                }
            })
            .catch(err => console.error(err));
    }
});
