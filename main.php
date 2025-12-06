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
    </div>

    <script src="js/map.js"></script>
</body>
</html>