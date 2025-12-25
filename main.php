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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Map | CvSU</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script>
        const USER_ROLE = '<?php echo htmlspecialchars($userRole); ?>';
    </script>
</head>

<body>
    <div class="app-container">
        <header class="app-header">
            <div class="header-left">
                <h1>CvSU Campus Map</h1>
                <span class="badge <?php echo $userRole; ?>"><?php echo ucfirst($userRole); ?></span>
            </div>
            <div class="header-right">
                <a href="logout.php" class="btn-logout">Logout</a>
            </div>
        </header>

        <main class="map-wrapper">
            <div id="map-container"></div>
            
            <?php if ($userRole === 'admin'): ?>
            <div class="admin-panel">
                <h3>Admin Controls</h3>
                <button id="add-pin-btn" class="action-btn">📍 Add Pin</button>
            </div>
            <?php endif; ?>
        </main>

        <!-- Modal -->
        <div id="pin-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                
                <!-- View Mode -->
                <div id="view-mode" class="mode-section">
                    <div id="hero-section" class="hero-section hidden">
                        <div class="hero-overlay">
                            <h2 id="view-name" class="hero-title"></h2>
                        </div>
                    </div>
                    
                    <h3 id="view-name-fallback" class="view-name-fallback hidden"></h3>
                    <p id="view-desc" class="view-description"></p>
                    
                    <div id="view-gallery" class="image-gallery hidden"></div>
                    
                    <?php if ($userRole === 'admin'): ?>
                    <div class="modal-actions">
                        <button id="btn-delete-pin" class="btn-danger">Delete</button>
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Edit Mode (Admin Only) -->
                <?php if ($userRole === 'admin'): ?>
                <div id="edit-mode" class="mode-section hidden">
                    <form id="pin-form">
                        <input type="hidden" id="pin-id">
                        <input type="hidden" id="pin-x">
                        <input type="hidden" id="pin-y">
                        
                        <div class="form-group">
                            <label for="pin-name">Name</label>
                            <input type="text" id="pin-name" placeholder="Location name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="pin-desc">Description</label>
                            <textarea id="pin-desc" rows="3" placeholder="Description..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Images</label>
                            <input type="file" id="image-upload" accept="image/*" multiple style="display: none;">
                            <button type="button" id="btn-upload-image" class="btn-upload">📷 Upload Images</button>
                            <div id="image-previews" class="image-preview-grid"></div>
                        </div>

                        <div class="modal-actions">
                            <button type="submit" class="btn-primary">Save</button>
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