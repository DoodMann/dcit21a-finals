<?php
session_start();

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
        // Redirect to the main site
        header('Location: main.html');
        exit;
    }
}

// login failed, redirect back
header('Location: index.php?error=1');
exit;
