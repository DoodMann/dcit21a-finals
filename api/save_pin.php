<?php
session_start();
header('Content-Type: application/json');

// Check Authorization
if (!isset($_SESSION['logged_in']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get Input Data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['x']) || !isset($input['y'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$file = __DIR__ . '/pins.json';
$pins = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Create New Pin
$newPin = [
    'id' => uniqid(),
    'x' => $input['x'],
    'y' => $input['y'],
    'created_at' => time()
];

$pins[] = $newPin;

file_put_contents($file, json_encode($pins, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'pin' => $newPin]);
