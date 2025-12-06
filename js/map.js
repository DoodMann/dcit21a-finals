/**
 * Interactive Map Logic
 * Handles panning, zooming, and admin pin placement.
 */

document.addEventListener('DOMContentLoaded', () => {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapContainer = document.getElementById('map-container');
    const addPinBtn = document.getElementById('add-pin-btn');

    // Modal Elements
    const modal = document.getElementById('pin-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const pinForm = document.getElementById('pin-form');

    // View Elements
    const viewMode = document.getElementById('view-mode');
    const viewName = document.getElementById('view-name');
    const viewDesc = document.getElementById('view-desc');
    const viewGallery = document.getElementById('view-gallery');
    const deleteBtn = document.getElementById('btn-delete-pin');

    // Edit Elements
    const editMode = document.getElementById('edit-mode');
    const cancelEditBtn = document.getElementById('btn-cancel-edit');
    const inputId = document.getElementById('pin-id');
    const inputX = document.getElementById('pin-x');
    const inputY = document.getElementById('pin-y');
    const inputName = document.getElementById('pin-name');
    const inputDesc = document.getElementById('pin-desc');
    const imageUploadInput = document.getElementById('image-upload');
    const btnUploadImage = document.getElementById('btn-upload-image');
    const imagePreviewsContainer = document.getElementById('image-previews');

    // Store uploaded images for current pin
    let currentImages = [];

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

    // --- Core Map Functions ---

    function getMinScale() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const scaleX = wrapperRect.width / MAP_WIDTH;
        const scaleY = wrapperRect.height / MAP_HEIGHT;
        return Math.max(scaleX, scaleY);
    }

    function initMap() {
        state.scale = getMinScale();
        centerMap();
        updateTransform();
    }

    function centerMap() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        state.translateX = (wrapperRect.width - (MAP_WIDTH * state.scale)) / 2;
        state.translateY = (wrapperRect.height - (MAP_HEIGHT * state.scale)) / 2;
        constrainBounds();
    }

    function constrainBounds() {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const minScale = getMinScale();

        if (state.scale < minScale) state.scale = minScale;

        const scaledWidth = MAP_WIDTH * state.scale;
        const scaledHeight = MAP_HEIGHT * state.scale;

        const minX = wrapperRect.width - scaledWidth;
        const maxX = 0;

        if (scaledWidth < wrapperRect.width) {
            state.translateX = (wrapperRect.width - scaledWidth) / 2;
        } else {
            state.translateX = Math.min(Math.max(state.translateX, minX), maxX);
        }

        const minY = wrapperRect.height - scaledHeight;
        const maxY = 0;

        if (scaledHeight < wrapperRect.height) {
            state.translateY = (wrapperRect.height - scaledHeight) / 2;
        } else {
            state.translateY = Math.min(Math.max(state.translateY, minY), maxY);
        }
    }

    function updateTransform() {
        mapContainer.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
    }

    // --- Event Listeners (Pan/Zoom) ---

    mapWrapper.addEventListener('mousedown', (e) => {
        if (state.pinMode) return;

        state.isDragging = true;
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

    mapWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = mapWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const mapMouseX = (mouseX - state.translateX) / state.scale;
        const mapMouseY = (mouseY - state.translateY) / state.scale;

        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;

        let newScale = state.scale + delta;
        const minScale = getMinScale();
        const maxScale = 4;

        newScale = Math.min(Math.max(minScale, newScale), maxScale);

        state.translateX = mouseX - (mapMouseX * newScale);
        state.translateY = mouseY - (mapMouseY * newScale);
        state.scale = newScale;

        constrainBounds();
        updateTransform();
    });

    window.addEventListener('resize', () => {
        constrainBounds();
        updateTransform();
    });

    // --- Modal Functions ---

    function resetModal() {
        if (viewMode) viewMode.classList.remove('hidden');
        if (editMode) editMode.classList.add('hidden');
        if (pinForm) pinForm.reset();
        if (inputId) inputId.value = '';
        currentImages = [];
        if (imagePreviewsContainer) imagePreviewsContainer.innerHTML = '';
        if (viewGallery) viewGallery.innerHTML = '';

        // Reset hero section
        const heroSection = document.getElementById('hero-section');
        const viewNameFallback = document.getElementById('view-name-fallback');
        if (heroSection) {
            heroSection.classList.add('hidden');
            heroSection.style.backgroundImage = '';
        }
        if (viewNameFallback) viewNameFallback.classList.add('hidden');
    }

    function closeModal() {
        if (modal) modal.classList.add('hidden');
        resetModal();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    function displayGallery(images, pinName) {
        const heroSection = document.getElementById('hero-section');
        const viewNameElement = document.getElementById('view-name');
        const viewNameFallback = document.getElementById('view-name-fallback');

        if (!images || images.length === 0) {
            // No images - show fallback title
            if (heroSection) heroSection.classList.add('hidden');
            if (viewGallery) viewGallery.classList.add('hidden');
            if (viewNameFallback) {
                viewNameFallback.textContent = pinName || 'Unknown Location';
                viewNameFallback.classList.remove('hidden');
            }
            return;
        }

        // Show hero section with first image
        if (heroSection && viewNameElement) {
            heroSection.style.backgroundImage = `url('${images[0]}')`;
            heroSection.classList.remove('hidden');
            viewNameElement.textContent = pinName || 'Unknown Location';

            // Add click to zoom
            heroSection.onclick = () => openImageZoom(images[0]);
        }

        // Hide fallback title
        if (viewNameFallback) viewNameFallback.classList.add('hidden');

        // Show remaining images in gallery (if more than 1)
        if (viewGallery) {
            if (images.length > 1) {
                viewGallery.classList.remove('hidden');
                viewGallery.innerHTML = '';

                images.slice(1).forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.className = 'gallery-image';
                    img.alt = 'Pin Image';
                    img.onclick = () => openImageZoom(imgUrl);
                    viewGallery.appendChild(img);
                });
            } else {
                viewGallery.classList.add('hidden');
            }
        }
    }

    // Image Zoom Functionality
    function openImageZoom(imageUrl) {
        let zoomOverlay = document.getElementById('image-zoom-overlay');

        if (!zoomOverlay) {
            zoomOverlay = document.createElement('div');
            zoomOverlay.id = 'image-zoom-overlay';
            zoomOverlay.className = 'image-zoom-overlay';

            const img = document.createElement('img');
            zoomOverlay.appendChild(img);

            zoomOverlay.onclick = () => {
                zoomOverlay.classList.remove('active');
            };

            document.body.appendChild(zoomOverlay);
        }

        const img = zoomOverlay.querySelector('img');
        img.src = imageUrl;
        zoomOverlay.classList.add('active');
    }

    function displayImagePreviews() {
        if (!imagePreviewsContainer) return;
        imagePreviewsContainer.innerHTML = '';

        currentImages.forEach((imgUrl, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'preview-thumbnail';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image-btn';
            removeBtn.innerHTML = '×';
            removeBtn.type = 'button';
            removeBtn.onclick = () => {
                currentImages.splice(index, 1);
                displayImagePreviews();
            };

            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreviewsContainer.appendChild(previewItem);
        });
    }

    // Image Upload Handler
    if (btnUploadImage && imageUploadInput) {
        btnUploadImage.addEventListener('click', () => {
            imageUploadInput.click();
        });

        imageUploadInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);

            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await fetch('api/upload_image.php', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    if (data.success) {
                        currentImages.push(data.url);
                        displayImagePreviews();
                    } else {
                        alert('Failed to upload image: ' + (data.error || 'Unknown error'));
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                    alert('Failed to upload image');
                }
            }

            // Reset input
            imageUploadInput.value = '';
        });
    }

    function openModal(data) {
        if (!modal) return;
        modal.classList.remove('hidden');
        resetModal();

        const pinName = data.name || 'Unknown Location';
        const images = data.images || (data.image ? [data.image] : []);

        // Set coordinates in hidden fields immediately
        if (inputX) inputX.value = data.x || '';
        if (inputY) inputY.value = data.y || '';
        if (inputId) inputId.value = data.id || '';

        // Check if this is an admin
        const isAdmin = typeof USER_ROLE !== 'undefined' && USER_ROLE === 'admin';

        // Determine if we should show edit mode
        // Show edit mode if: admin AND (creating new pin OR editing existing)
        const showEditMode = isAdmin;

        if (showEditMode) {
            // ADMIN: Show edit form directly
            if (viewMode) viewMode.classList.add('hidden');
            if (editMode) editMode.classList.remove('hidden');

            // Populate form fields
            if (inputName) inputName.value = data.name || '';
            if (inputDesc) inputDesc.value = data.description || '';

            // Load existing images
            currentImages = [...images];
            displayImagePreviews();

            // Setup Delete button (only for existing pins)
            if (deleteBtn && data.id) {
                deleteBtn.onclick = () => {
                    if (confirm('Are you sure you want to delete this pin?')) {
                        deletePinFromServer(data.id);
                        closeModal();
                    }
                };
            }
        } else {
            // GUEST: Show view mode only
            if (viewMode) viewMode.classList.remove('hidden');
            if (editMode) editMode.classList.add('hidden');

            // Populate View Data
            if (viewDesc) {
                viewDesc.textContent = data.description || 'No description available.';
            }

            // Display images with hero layout
            displayGallery(images, pinName);
        }
    }

    // --- Form Submission ---
    if (pinForm) {
        pinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const pData = {
                x: parseFloat(inputX.value),
                y: parseFloat(inputY.value),
                name: inputName.value,
                description: inputDesc.value,
                images: currentImages
            };

            // Include ID if editing existing pin
            if (inputId.value) {
                pData.id = inputId.value;
            }

            savePinToServer(pData);
        });

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                if (inputId.value) {
                    editMode.classList.add('hidden');
                    viewMode.classList.remove('hidden');
                } else {
                    closeModal();
                }
            });
        }
    }

    // --- API Functions ---

    function fetchPins() {
        fetch('api/get_pins.php')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    document.querySelectorAll('.map-pin').forEach(el => el.remove());
                    data.forEach(pinData => {
                        createPinElement(pinData.x, pinData.y, pinData.id, pinData);
                    });
                }
            })
            .catch(err => console.error('Error fetching pins:', err));
    }

    function createPinElement(x, y, id, fullData) {
        let pin = document.querySelector(`.map-pin[data-id="${id}"]`);
        if (!pin) {
            pin = document.createElement('div');
            pin.className = 'map-pin';
            mapContainer.appendChild(pin);
        }

        pin.style.left = (x - 16) + 'px';
        pin.style.top = (y - 32) + 'px';
        pin.dataset.id = id;

        pin.title = fullData.name || 'Map Pin';

        pin.onclick = (e) => {
            e.stopPropagation();
            openModal(fullData);
        };
    }

    function savePinToServer(pinData) {
        fetch('api/save_pin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pinData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchPins();
                    closeModal();
                } else {
                    alert('Failed to save pin!');
                }
            })
            .catch(err => console.error(err));
    }

    function deletePinFromServer(id) {
        fetch('api/delete_pin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const el = document.querySelector(`.map-pin[data-id="${id}"]`);
                    if (el) el.remove();
                } else {
                    alert('Failed to delete pin');
                }
            })
            .catch(err => console.error(err));
    }

    // --- Initialization ---

    initMap();
    fetchPins();

    // --- Admin Add Pin Button ---
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

        // Place Pin
        mapContainer.addEventListener('click', (e) => {
            if (!state.pinMode) return;

            const rect = mapContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / state.scale;
            const y = (e.clientY - rect.top) / state.scale;

            openModal({ x: x, y: y, name: '', description: '' }, true);

            state.pinMode = false;
            addPinBtn.textContent = '📍 Add Pin';
            addPinBtn.style.background = '';
            mapWrapper.style.cursor = 'grab';
        });
    }

});
