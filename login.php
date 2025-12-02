<?php
session_start();

// Simple, local-only authentication for testing purposes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // Example credentials
    $validEmail = 'admin@admin.com';
    $validPassword = 'admin';

    if ($email === $validEmail && $password === $validPassword) {
        // Mark session as logged in (optional)
        $_SESSION['logged_in'] = true;
        // Redirect to the main site (adjust target as needed)
        header('Location: main.html');
        exit;
    }
}

// On failure, redirect back to the login page with an error flag
header('Location: index.php?error=1');
exit;
