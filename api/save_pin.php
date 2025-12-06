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
    echo json_encode(['error' => 'Invalid input: coordinates missing']);
    exit;
}

$file = __DIR__ . '/pins.json';
$pins = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$id = $input['id'] ?? uniqid();
$isUpdate = false;

// Handle images - accept both array and string for backward compatibility
$images = [];
if (isset($input['images']) && is_array($input['images'])) {
    $images = $input['images'];
} elseif (isset($input['image']) && !empty($input['image'])) {
    $images = [$input['image']]; // Convert old single image to array
}

// Prepare Pin Data
$pinData = [
    'id' => $id,
    'x' => floatval($input['x']),
    'y' => floatval($input['y']),
    'name' => $input['name'] ?? 'New Pin',
    'description' => $input['description'] ?? '',
    'images' => $images,
    'updated_at' => time()
];

// Check if updating existing
foreach ($pins as $key => $pin) {
    if ($pin['id'] === $id) {
        $pins[$key] = array_merge($pin, $pinData);
        $isUpdate = true;
        break;
    }
}

if (!$isUpdate) {
    $pinData['created_at'] = time();
    $pins[] = $pinData;
}

file_put_contents($file, json_encode($pins, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'pin' => $pinData]);
