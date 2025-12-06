<?php
session_start();

// Handle Guest Login
if (isset($_GET['guest']) && $_GET['guest'] === 'true') {
    $_SESSION['logged_in'] = true;
    $_SESSION['role'] = 'guest';
    header('Location: main.php');
    exit;
}

// test
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // yes very nice creds 
    $validEmail = 'admin@admin.com';
    $validPassword = 'admin';

    if ($email === $validEmail && $password === $validPassword) {
        // Mark session as logged in
        $_SESSION['logged_in'] = true;
        $_SESSION['role'] = 'admin'; // Set role to admin
        // Redirect to the main site
        header('Location: main.php');
        exit;
    }
}

// login failed, redirect back
header('Location: index.php?error=1');
exit;
