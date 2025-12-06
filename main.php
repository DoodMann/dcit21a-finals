<?php
session_start();

// Security Check
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit;
}

$userRole = $_SESSION['role'] ?? 'guest';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Map | CvSU</title>
    <link rel="stylesheet" href="css/style.css">
    <!-- Load Font Awesome (for icons) or Google Fonts if needed later -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script>
        // Pass PHP Session Data to JavaScript
        const USER_ROLE = '<?php echo htmlspecialchars($userRole); ?>';
    </script>
</head>

<body>
    <div class="app-container">
        <header class="app-header">
            <div class="header-left">
                <h1>CvSU Campus Map</h1>
                <span class="badge <?php echo $userRole; ?>"><?php echo ucfirst($userRole); ?> Mode</span>
            </div>
            <div class="header-right">
                <a href="logout.php" class="btn-logout">Logout</a>
            </div>
        </header>

        <main class="map-wrapper">
            <!-- This is where the interactive map will live -->
            <div id="map-container">
            </div>
            
            <?php if ($userRole === 'admin'): ?>
            <!-- Admin Controls (Hidden for guests) -->
            <div class="admin-panel">
                <h3>Admin Controls</h3>
                <button id="add-pin-btn" class="action-btn">📍 Add Pin</button>
            </div>
            <?php endif; ?>
        </main>

        <!-- Pin Modal / Sidebar -->
        <div id="pin-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                
                <h2 id="modal-title">Pin Details</h2>
                
                <!-- View Mode (For Guests or Read-only) -->
                <div id="view-mode" class="mode-section">
                    <!-- Hero Image with Title Overlay -->
                    <div id="hero-section" class="hero-section hidden">
                        <div class="hero-overlay">
                            <h2 id="view-name" class="hero-title"></h2>
                        </div>
                    </div>
                    
                    <!-- Fallback title if no images -->
                    <h3 id="view-name-fallback" class="view-name-fallback hidden"></h3>
                    
                    <p id="view-desc" class="view-description"></p>
                    
                    <!-- Additional Images Gallery -->
                    <div id="view-gallery" class="image-gallery hidden">
                        <!-- Additional images will be dynamically inserted here -->
                    </div>
                    
                    <?php if ($userRole === 'admin'): ?>
                        <div class="modal-actions">
                            <button id="btn-delete-pin" class="btn-danger">Delete Pin</button>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Edit Mode (For Admins) -->
                <?php if ($userRole === 'admin'): ?>
                <div id="edit-mode" class="mode-section hidden">
                    <form id="pin-form">
                        <input type="hidden" id="pin-id">
                        <input type="hidden" id="pin-x">
                        <input type="hidden" id="pin-y">
                        
                        <div class="form-group">
                            <label for="pin-name">Name</label>
                            <input type="text" id="pin-name" placeholder="e.g. Main Library" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="pin-desc">Description</label>
                            <textarea id="pin-desc" rows="3" placeholder="Description of the location..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Images</label>
                            <div class="image-upload-section">
                                <input type="file" id="image-upload" accept="image/*" multiple style="display: none;">
                                <button type="button" id="btn-upload-image" class="btn-upload">
                                    📷 Upload Images
                                </button>
                                <div id="image-previews" class="image-preview-grid">
                                    <!-- Preview thumbnails will appear here -->
                                </div>
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button type="submit" class="btn-primary">Save Pin</button>
                            <button type="button" id="btn-cancel-edit" class="btn-ghost">Cancel</button>
                        </div>
                    </form>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="js/map.js"></script>
</body>
</html>