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

if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid Pin ID']);
    exit;
}

$file = __DIR__ . '/pins.json';
$pins = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Filter out the pin to delete
$initialCount = count($pins);
$pins = array_filter($pins, function($pin) use ($input) {
    return $pin['id'] !== $input['id'];
});

// Re-index array
$pins = array_values($pins);

if (count($pins) === $initialCount) {
    http_response_code(404);
    echo json_encode(['error' => 'Pin not found']);
    exit;
}

file_put_contents($file, json_encode($pins, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
